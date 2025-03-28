import { Issuer } from 'openid-client';
import { awsConfig } from '@/config/aws';
import { query } from '@/lib/db'
import { SignupData, LoginCredentials, User, AuthToken, VerificationData } from '@/types/auth'
import { hash, compare } from 'bcryptjs'
import { v4 as uuidv4 } from 'uuid'
import { sign, verify } from 'jsonwebtoken'
import { generateVerificationCode, sendVerificationEmail } from '@/lib/email'

let client: any;

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'
const SALT_ROUNDS = 12

// Initialize OpenID Client
export async function initializeClient() {
  if (!client) {
    const issuer = await Issuer.discover(
      `https://cognito-idp.${awsConfig.region}.amazonaws.com/${awsConfig.userPoolId}`
    );
    
    client = new issuer.Client({
      client_id: awsConfig.userPoolWebClientId,
      client_secret: process.env.COGNITO_CLIENT_SECRET,
      redirect_uris: [awsConfig.oauth.redirectSignIn],
      response_types: ['code'],
    });
  }
  return client;
}

// Get authorization URL
export async function getAuthUrl(state: string, nonce: string) {
  const client = await initializeClient();
  return client.authorizationUrl({
    scope: awsConfig.oauth.scope.join(' '),
    state,
    nonce,
  });
}

// Handle callback
export async function handleCallback(params: any, state: string, nonce: string) {
  const client = await initializeClient();
  const tokenSet = await client.callback(
    awsConfig.oauth.redirectSignIn,
    params,
    { nonce, state }
  );
  
  const userInfo = await client.userinfo(tokenSet.access_token);
  return { tokenSet, userInfo };
}

// Get logout URL
export function getLogoutUrl() {
  return `https://${awsConfig.userPoolDomain}/logout?client_id=${awsConfig.userPoolWebClientId}&logout_uri=${awsConfig.oauth.redirectSignOut}`;
}

export class AuthService {
  static async signup(data: SignupData): Promise<{ user: User; verificationCode: string }> {
    // Validate email format
    if (!data.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      throw new Error('Invalid email format')
    }

    // Validate ID number (13 digits for South African ID)
    if (!data.idNumber.match(/^\d{13}$/)) {
      throw new Error('Invalid ID number format')
    }

    // Validate phone number (10 digits)
    if (!data.phoneNumber.match(/^\d{10}$/)) {
      throw new Error('Invalid phone number format')
    }

    // Check if email already exists
    const existingUser = await query<User[]>('SELECT * FROM users WHERE email = ?', [data.email])
    if (existingUser.length > 0) {
      throw new Error('Email already registered')
    }

    // Check if ID number already exists
    const existingId = await query<User[]>('SELECT * FROM users WHERE idNumber = ?', [data.idNumber])
    if (existingId.length > 0) {
      throw new Error('ID number already registered')
    }

    // Hash password
    const hashedPassword = await hash(data.password, SALT_ROUNDS)

    // Generate verification code
    const verificationCode = generateVerificationCode()
    const verificationExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

    // Create user
    const userId = uuidv4()
    const user: User = {
      id: userId,
      email: data.email,
      password: hashedPassword,
      role: data.role,
      firstName: data.firstName,
      lastName: data.lastName,
      phoneNumber: data.phoneNumber,
      idNumber: data.idNumber,
      isVerified: false,
      verificationCode,
      verificationExpiry,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    await query(
      `INSERT INTO users 
       (id, email, password, role, firstName, lastName, phoneNumber, idNumber, verificationCode, verificationExpiry) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        user.id,
        user.email,
        user.password,
        user.role,
        user.firstName,
        user.lastName,
        user.phoneNumber,
        user.idNumber,
        user.verificationCode,
        user.verificationExpiry
      ]
    )

    // If user is a driver, create driver verification entry
    if (data.role === 'driver') {
      const referenceNumber = this.generateDriverReference()
      await query(
        `INSERT INTO driver_verifications (id, driverId, referenceNumber, status)
         VALUES (?, ?, ?, 'pending')`,
        [uuidv4(), user.id, referenceNumber]
      )
    }

    // Send verification email
    await sendVerificationEmail(user.email, verificationCode)

    return { user, verificationCode }
  }

  static async login(credentials: LoginCredentials): Promise<{ token: string; user: User }> {
    // Find user
    const users = await query<User[]>('SELECT * FROM users WHERE email = ?', [credentials.email])
    if (users.length === 0) {
      throw new Error('Invalid credentials')
    }

    const user = users[0]

    // Verify password
    const isValid = await compare(credentials.password, user.password)
    if (!isValid) {
      throw new Error('Invalid credentials')
    }

    // Check if user is verified
    if (!user.isVerified) {
      throw new Error('Please verify your email before logging in')
    }

    // Generate token
    const token = sign(
      { userId: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    )

    // Store token
    await query(
      `INSERT INTO auth_tokens (token, userId, role, expiresAt)
       VALUES (?, ?, ?, DATE_ADD(NOW(), INTERVAL 24 HOUR))`,
      [token, user.id, user.role]
    )

    return { token, user }
  }

  static async verifyEmail(data: VerificationData): Promise<void> {
    const users = await query<User[]>(
      'SELECT * FROM users WHERE id = ? AND verificationCode = ? AND verificationExpiry > NOW()',
      [data.userId, data.code]
    )

    if (users.length === 0) {
      throw new Error('Invalid or expired verification code')
    }

    await query(
      'UPDATE users SET isVerified = true, verificationCode = NULL, verificationExpiry = NULL WHERE id = ?',
      [data.userId]
    )
  }

  static async resendVerification(userId: string): Promise<void> {
    const users = await query<User[]>('SELECT * FROM users WHERE id = ?', [userId])
    if (users.length === 0) {
      throw new Error('User not found')
    }

    const user = users[0]
    if (user.isVerified) {
      throw new Error('User is already verified')
    }

    const verificationCode = generateVerificationCode()
    const verificationExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000)

    await query(
      'UPDATE users SET verificationCode = ?, verificationExpiry = ? WHERE id = ?',
      [verificationCode, verificationExpiry, userId]
    )

    await sendVerificationEmail(user.email, verificationCode)
  }

  private static generateDriverReference(): string {
    // Format: DR-YYYY-XXXXX (e.g., DR-2024-12345)
    const year = new Date().getFullYear()
    const random = Math.floor(10000 + Math.random() * 90000)
    return `DR-${year}-${random}`
  }

  static async validateToken(token: string): Promise<{ userId: string; role: string }> {
    try {
      // Check if token exists and is not expired
      const tokens = await query<AuthToken[]>(
        'SELECT * FROM auth_tokens WHERE token = ? AND expiresAt > NOW()',
        [token]
      )

      if (tokens.length === 0) {
        throw new Error('Invalid or expired token')
      }

      const decoded = verify(token, JWT_SECRET) as { userId: string; role: string }
      return decoded
    } catch (error) {
      throw new Error('Invalid token')
    }
  }

  static async logout(token: string): Promise<void> {
    await query('DELETE FROM auth_tokens WHERE token = ?', [token])
  }
} 
