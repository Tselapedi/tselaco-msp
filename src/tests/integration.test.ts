import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { AuthService } from '@/services/auth'
import { DriverService } from '@/lib/services/driver.service'
import { db } from '@/lib/db'
import { users, drivers, driverDocuments } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

describe('Integration Tests', () => {
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
    licenseExpiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    pdpExpiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
  }

  const testDocuments = [
    {
      type: 'id_document',
      file: {
        name: 'id_document.pdf',
        size: 1024 * 1024,
        type: 'application/pdf',
        url: 'https://example.com/id_document.pdf'
      },
      expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      documentNumber: 'ID123456'
    },
    {
      type: 'drivers_license',
      file: {
        name: 'drivers_license.jpg',
        size: 2 * 1024 * 1024,
        type: 'image/jpeg',
        url: 'https://example.com/drivers_license.jpg'
      },
      expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      documentNumber: 'DL123456'
    }
  ]

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

  describe('User Registration Flow', () => {
    it('should complete full user registration flow', async () => {
      // 1. Register user
      const registration = await AuthService.signup(testUser)
      expect(registration.user).toBeDefined()
      expect(registration.user.isEmailVerified).toBe(false)

      // 2. Verify email
      const verification = await AuthService.verifyEmail({
        userId: registration.user.id,
        code: registration.user.verificationCode
      })
      expect(verification.success).toBe(true)
      expect(verification.user.isEmailVerified).toBe(true)

      // 3. Login
      const login = await AuthService.login({
        email: testUser.email,
        password: testUser.password
      })
      expect(login.token).toBeDefined()
      expect(login.user.isEmailVerified).toBe(true)
    })

    it('should handle invalid verification code', async () => {
      const registration = await AuthService.signup({
        ...testUser,
        email: 'invalid@example.com'
      })

      await expect(AuthService.verifyEmail({
        userId: registration.user.id,
        code: '000000'
      })).rejects.toThrow('Invalid verification code')
    })

    it('should handle expired verification code', async () => {
      const registration = await AuthService.signup({
        ...testUser,
        email: 'expired@example.com'
      })

      // Simulate code expiration by updating the user
      await db.update(users)
        .set({ verificationCode: null })
        .where(eq(users.id, registration.user.id))

      await expect(AuthService.verifyEmail({
        userId: registration.user.id,
        code: registration.user.verificationCode
      })).rejects.toThrow('Verification code has expired')
    })
  })

  describe('Driver Registration Flow', () => {
    it('should complete full driver registration flow', async () => {
      // 1. Register driver
      const registration = await AuthService.signup(testDriver)
      expect(registration.user).toBeDefined()
      expect(registration.referenceNumber).toBeDefined()
      expect(registration.referenceNumber).toMatch(/^TSE-\d{6}$/)

      // 2. Verify email
      const verification = await AuthService.verifyEmail({
        userId: registration.user.id,
        code: registration.user.verificationCode
      })
      expect(verification.success).toBe(true)

      // 3. Upload documents
      const documents = await DriverService.updateDriverDocuments(
        registration.user.id,
        testDocuments
      )
      expect(documents).toHaveLength(testDocuments.length)

      // 4. Verify document upload
      const uploadedDocs = await DriverService.getDriverDocuments(registration.user.id)
      expect(uploadedDocs).toHaveLength(testDocuments.length)
      expect(uploadedDocs[0].type).toBe('id_document')
      expect(uploadedDocs[1].type).toBe('drivers_license')
    })

    it('should handle document validation errors', async () => {
      const registration = await AuthService.signup({
        ...testDriver,
        email: 'invalid@example.com'
      })

      const invalidDocuments = [
        {
          ...testDocuments[0],
          file: {
            ...testDocuments[0].file,
            size: 6 * 1024 * 1024 // 6MB
          }
        }
      ]

      await expect(DriverService.updateDriverDocuments(
        registration.user.id,
        invalidDocuments
      )).rejects.toThrow('File size must be less than 5MB')
    })

    it('should handle duplicate document uploads', async () => {
      const registration = await AuthService.signup({
        ...testDriver,
        email: 'duplicate@example.com'
      })

      // Upload documents first time
      await DriverService.updateDriverDocuments(
        registration.user.id,
        testDocuments
      )

      // Try to upload same documents again
      const duplicateDocs = await DriverService.updateDriverDocuments(
        registration.user.id,
        testDocuments
      )

      // Should update existing documents instead of creating duplicates
      expect(duplicateDocs).toHaveLength(testDocuments.length)
    })
  })

  describe('Error Handling', () => {
    it('should handle database connection errors', async () => {
      // Simulate database connection error
      const originalQuery = db.query
      db.query = () => {
        throw new Error('Database connection failed')
      }

      await expect(AuthService.signup(testUser))
        .rejects.toThrow('Database connection failed')

      // Restore original query
      db.query = originalQuery
    })

    it('should handle file upload errors', async () => {
      const registration = await AuthService.signup({
        ...testDriver,
        email: 'upload@example.com'
      })

      const invalidDocuments = [
        {
          ...testDocuments[0],
          file: {
            ...testDocuments[0].file,
            url: 'invalid-url'
          }
        }
      ]

      await expect(DriverService.updateDriverDocuments(
        registration.user.id,
        invalidDocuments
      )).rejects.toThrow('Failed to upload document')
    })

    it('should handle concurrent requests', async () => {
      const registration = await AuthService.signup({
        ...testDriver,
        email: 'concurrent@example.com'
      })

      // Simulate concurrent document uploads
      const uploadPromises = [
        DriverService.updateDriverDocuments(registration.user.id, [testDocuments[0]]),
        DriverService.updateDriverDocuments(registration.user.id, [testDocuments[1]])
      ]

      const results = await Promise.all(uploadPromises)
      expect(results[0]).toHaveLength(1)
      expect(results[1]).toHaveLength(1)
    })
  })
}) 
