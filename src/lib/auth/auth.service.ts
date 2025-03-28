import { compare, hash } from 'bcryptjs'
import { createId } from '@paralleldrive/cuid2'
import { db } from '@/lib/db'
import { users, drivers } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { generateVerificationCode, sendVerificationEmail } from '@/lib/email'
import { sign } from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'
const SALT_ROUNDS = 12

export class AuthService {
  static async registerUser(data: {
    email: string
    password: string
    firstName: string
    lastName: string
    phoneNumber: string
    idNumber: string
  }) {
    try {
      // Hash password
      const hashedPassword = await hash(data.password, SALT_ROUNDS)

      // Generate verification code
      const verificationCode = generateVerificationCode()
      const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

      // Create user
      const [user] = await db.insert(users).values({
        ...data,
        password: hashedPassword,
        verificationCode,
        verificationExpires
      })

      // Send verification email
      await sendVerificationEmail(data.email, verificationCode)

      return { success: true, userId: user.id }
    } catch (error) {
      console.error('Error registering user:', error)
      throw new Error('Failed to register user')
    }
  }

  static async registerDriver(data: {
    email: string
    password: string
    firstName: string
    middleName?: string
    lastName: string
    phoneNumber: string
    idNumber: string
    licenseNumber: string
    pdpNumber: string
  }) {
    try {
      // Hash password
      const hashedPassword = await hash(data.password, SALT_ROUNDS)

      // Generate verification code
      const verificationCode = generateVerificationCode()
      const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

      // Create driver
      const [driver] = await db.insert(drivers).values({
        ...data,
        password: hashedPassword,
        verificationCode,
        verificationExpires
      })

      // Send verification email
      await sendVerificationEmail(data.email, verificationCode)

      return { success: true, driverId: driver.id, referenceNumber: driver.referenceNumber }
    } catch (error) {
      console.error('Error registering driver:', error)
      throw new Error('Failed to register driver')
    }
  }

  static async verifyEmail(email: string, code: string) {
    try {
      // Check user verification
      const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1)

      if (user) {
        if (user.verificationCode === code && user.verificationExpires > new Date()) {
          await db
            .update(users)
            .set({ isVerified: true, verificationCode: null, verificationExpires: null })
            .where(eq(users.id, user.id))
          return { success: true, type: 'user' }
        }
      }

      // Check driver verification
      const [driver] = await db.select().from(drivers).where(eq(drivers.email, email)).limit(1)

      if (driver) {
        if (driver.verificationCode === code && driver.verificationExpires > new Date()) {
          await db
            .update(drivers)
            .set({ isVerified: true, verificationCode: null, verificationExpires: null })
            .where(eq(drivers.id, driver.id))
          return { success: true, type: 'driver' }
        }
      }

      throw new Error('Invalid or expired verification code')
    } catch (error) {
      console.error('Error verifying email:', error)
      throw new Error('Failed to verify email')
    }
  }

  static async login(email: string, password: string) {
    try {
      // Check user credentials
      const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1)

      if (user) {
        const isValid = await compare(password, user.password)
        if (isValid) {
          const token = sign({ id: user.id, type: 'user' }, JWT_SECRET, { expiresIn: '7d' })
          return { success: true, type: 'user', token, user: { ...user, password: undefined } }
        }
      }

      // Check driver credentials
      const [driver] = await db.select().from(drivers).where(eq(drivers.email, email)).limit(1)

      if (driver) {
        const isValid = await compare(password, driver.password)
        if (isValid) {
          const token = sign({ id: driver.id, type: 'driver' }, JWT_SECRET, { expiresIn: '7d' })
          return { success: true, type: 'driver', token, driver: { ...driver, password: undefined } }
        }
      }

      throw new Error('Invalid credentials')
    } catch (error) {
      console.error('Error logging in:', error)
      throw new Error('Failed to log in')
    }
  }

  static async resendVerification(email: string) {
    try {
      const verificationCode = generateVerificationCode()
      const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

      // Check and update user
      const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1)

      if (user && !user.isVerified) {
        await db.update(users).set({ verificationCode, verificationExpires }).where(eq(users.id, user.id))
        await sendVerificationEmail(email, verificationCode)
        return { success: true }
      }

      // Check and update driver
      const [driver] = await db.select().from(drivers).where(eq(drivers.email, email)).limit(1)

      if (driver && !driver.isVerified) {
        await db.update(drivers).set({ verificationCode, verificationExpires }).where(eq(drivers.id, driver.id))
        await sendVerificationEmail(email, verificationCode)
        return { success: true }
      }

      throw new Error('Email not found or already verified')
    } catch (error) {
      console.error('Error resending verification:', error)
      throw new Error('Failed to resend verification')
    }
  }
}
