import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { AuthService } from '@/services/auth'
import { db } from '@/lib/db'
import { users, drivers, driverDocuments } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

describe('Authentication Tests', () => {
  const testUser = {
    email: 'test@example.com',
    password: 'Test123!@#',
    firstName: 'Test',
    lastName: 'User',
    phoneNumber: '+27123456789',
    idNumber: '1234567890123',
    type: 'user' as const
  }

  const testDriver = {
    ...testUser,
    email: 'driver@example.com',
    type: 'driver' as const,
    middleName: 'Middle',
    licenseNumber: 'ABC123456',
    pdpNumber: 'PDP123456',
    licenseExpiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year from now
    pdpExpiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString() // 1 year from now
  }

  beforeAll(async () => {
    // Clean up any existing test data
    await db.delete(driverDocuments).where(eq(driverDocuments.userId, testUser.idNumber))
    await db.delete(drivers).where(eq(drivers.userId, testUser.idNumber))
    await db.delete(users).where(eq(users.idNumber, testUser.idNumber))
  })

  afterAll(async () => {
    // Clean up test data
    await db.delete(driverDocuments).where(eq(driverDocuments.userId, testUser.idNumber))
    await db.delete(drivers).where(eq(drivers.userId, testUser.idNumber))
    await db.delete(users).where(eq(users.idNumber, testUser.idNumber))
  })

  describe('User Registration', () => {
    it('should register a new user successfully', async () => {
      const result = await AuthService.signup(testUser)
      
      expect(result.user).toBeDefined()
      expect(result.user.email).toBe(testUser.email)
      expect(result.user.firstName).toBe(testUser.firstName)
      expect(result.user.lastName).toBe(testUser.lastName)
      expect(result.user.phoneNumber).toBe(testUser.phoneNumber)
      expect(result.user.idNumber).toBe(testUser.idNumber)
      expect(result.user.role).toBe('user')
      expect(result.user.isEmailVerified).toBe(false)
      expect(result.user.verificationCode).toBeDefined()
      expect(result.user.password).not.toBe(testUser.password) // Password should be hashed
    })

    it('should not allow duplicate email registration', async () => {
      await expect(AuthService.signup(testUser)).rejects.toThrow('Email already registered')
    })

    it('should not allow duplicate ID number registration', async () => {
      const duplicateUser = {
        ...testUser,
        email: 'another@example.com'
      }
      await expect(AuthService.signup(duplicateUser)).rejects.toThrow('ID number already registered')
    })
  })

  describe('Driver Registration', () => {
    it('should register a new driver successfully', async () => {
      const result = await AuthService.signup(testDriver)
      
      expect(result.user).toBeDefined()
      expect(result.user.email).toBe(testDriver.email)
      expect(result.user.role).toBe('driver')
      expect(result.user.isEmailVerified).toBe(false)
      expect(result.user.verificationCode).toBeDefined()
      expect(result.referenceNumber).toBeDefined()
      expect(result.referenceNumber).toMatch(/^TSE-\d{6}$/)
    })

    it('should not allow duplicate license number registration', async () => {
      const duplicateDriver = {
        ...testDriver,
        email: 'another@example.com',
        idNumber: '9876543210987'
      }
      await expect(AuthService.signup(duplicateDriver)).rejects.toThrow('License number already registered')
    })

    it('should not allow duplicate PDP number registration', async () => {
      const duplicateDriver = {
        ...testDriver,
        email: 'another@example.com',
        idNumber: '9876543210987',
        licenseNumber: 'XYZ789012'
      }
      await expect(AuthService.signup(duplicateDriver)).rejects.toThrow('PDP number already registered')
    })
  })

  describe('Email Verification', () => {
    it('should verify email with correct code', async () => {
      const user = await db.query.users.findFirst({
        where: eq(users.email, testUser.email)
      })
      
      if (!user) throw new Error('User not found')
      
      const result = await AuthService.verifyEmail({
        userId: user.id,
        code: user.verificationCode
      })
      
      expect(result.success).toBe(true)
      expect(result.user.isEmailVerified).toBe(true)
    })

    it('should not verify email with incorrect code', async () => {
      const user = await db.query.users.findFirst({
        where: eq(users.email, testUser.email)
      })
      
      if (!user) throw new Error('User not found')
      
      await expect(AuthService.verifyEmail({
        userId: user.id,
        code: '000000'
      })).rejects.toThrow('Invalid verification code')
    })
  })

  describe('Login', () => {
    it('should login with correct credentials', async () => {
      const result = await AuthService.login({
        email: testUser.email,
        password: testUser.password
      })
      
      expect(result.token).toBeDefined()
      expect(result.user.email).toBe(testUser.email)
      expect(result.user.isEmailVerified).toBe(true)
    })

    it('should not login with incorrect password', async () => {
      await expect(AuthService.login({
        email: testUser.email,
        password: 'wrongpassword'
      })).rejects.toThrow('Invalid credentials')
    })

    it('should not login with unverified email', async () => {
      const unverifiedUser = {
        ...testUser,
        email: 'unverified@example.com'
      }
      await AuthService.signup(unverifiedUser)
      
      await expect(AuthService.login({
        email: unverifiedUser.email,
        password: unverifiedUser.password
      })).rejects.toThrow('Please verify your email first')
    })
  })
}) 
