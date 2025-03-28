import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { DriverService } from '@/lib/services/driver.service'
import { db } from '@/lib/db'
import { users, drivers, driverDocuments } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

describe('Document Upload Tests', () => {
  const testDriver = {
    email: 'testdriver@example.com',
    password: 'Test123!@#',
    firstName: 'Test',
    lastName: 'Driver',
    phoneNumber: '+27123456789',
    idNumber: '1234567890123',
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
        size: 1024 * 1024, // 1MB
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
        size: 2 * 1024 * 1024, // 2MB
        type: 'image/jpeg',
        url: 'https://example.com/drivers_license.jpg'
      },
      expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      documentNumber: 'DL123456'
    },
    {
      type: 'pdp_permit',
      file: {
        name: 'pdp_permit.pdf',
        size: 1.5 * 1024 * 1024, // 1.5MB
        type: 'application/pdf',
        url: 'https://example.com/pdp_permit.pdf'
      },
      expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      documentNumber: 'PDP123456'
    },
    {
      type: 'vehicle_registration',
      file: {
        name: 'vehicle_registration.pdf',
        size: 1 * 1024 * 1024, // 1MB
        type: 'application/pdf',
        url: 'https://example.com/vehicle_registration.pdf'
      },
      expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      documentNumber: 'VR123456'
    },
    {
      type: 'vehicle_insurance',
      file: {
        name: 'vehicle_insurance.pdf',
        size: 1 * 1024 * 1024, // 1MB
        type: 'application/pdf',
        url: 'https://example.com/vehicle_insurance.pdf'
      },
      expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      documentNumber: 'VI123456'
    },
    {
      type: 'roadworthy_certificate',
      file: {
        name: 'roadworthy_certificate.pdf',
        size: 1 * 1024 * 1024, // 1MB
        type: 'application/pdf',
        url: 'https://example.com/roadworthy_certificate.pdf'
      },
      expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      documentNumber: 'RC123456'
    }
  ]

  let driverId: string

  beforeAll(async () => {
    // Clean up any existing test data
    await db.delete(driverDocuments).where(eq(driverDocuments.userId, testDriver.idNumber))
    await db.delete(drivers).where(eq(drivers.userId, testDriver.idNumber))
    await db.delete(users).where(eq(users.idNumber, testDriver.idNumber))

    // Create test driver
    const result = await AuthService.signup(testDriver)
    driverId = result.user.id
  })

  afterAll(async () => {
    // Clean up test data
    await db.delete(driverDocuments).where(eq(driverDocuments.userId, testDriver.idNumber))
    await db.delete(drivers).where(eq(drivers.userId, testDriver.idNumber))
    await db.delete(users).where(eq(users.idNumber, testDriver.idNumber))
  })

  describe('Document Upload', () => {
    it('should upload all required documents successfully', async () => {
      const result = await DriverService.updateDriverDocuments(driverId, testDocuments)
      
      expect(result).toHaveLength(testDocuments.length)
      expect(result[0].type).toBe('id_document')
      expect(result[1].type).toBe('drivers_license')
      expect(result[2].type).toBe('pdp_permit')
      expect(result[3].type).toBe('vehicle_registration')
      expect(result[4].type).toBe('vehicle_insurance')
      expect(result[5].type).toBe('roadworthy_certificate')
    })

    it('should not allow file size exceeding 5MB', async () => {
      const largeFile = {
        ...testDocuments[0],
        file: {
          ...testDocuments[0].file,
          size: 6 * 1024 * 1024 // 6MB
        }
      }

      await expect(DriverService.updateDriverDocuments(driverId, [largeFile]))
        .rejects.toThrow('File size must be less than 5MB')
    })

    it('should not allow invalid file types', async () => {
      const invalidFile = {
        ...testDocuments[0],
        file: {
          ...testDocuments[0].file,
          type: 'application/zip'
        }
      }

      await expect(DriverService.updateDriverDocuments(driverId, [invalidFile]))
        .rejects.toThrow('File must be JPEG, PNG, or PDF')
    })

    it('should not allow missing required documents', async () => {
      const incompleteDocuments = testDocuments.slice(0, 3) // Only first 3 documents
      
      await expect(DriverService.updateDriverDocuments(driverId, incompleteDocuments))
        .rejects.toThrow('Missing required documents')
    })
  })

  describe('Document Retrieval', () => {
    it('should retrieve all uploaded documents', async () => {
      const documents = await DriverService.getDriverDocuments(driverId)
      
      expect(documents).toHaveLength(testDocuments.length)
      expect(documents[0].type).toBe('id_document')
      expect(documents[1].type).toBe('drivers_license')
      expect(documents[2].type).toBe('pdp_permit')
      expect(documents[3].type).toBe('vehicle_registration')
      expect(documents[4].type).toBe('vehicle_insurance')
      expect(documents[5].type).toBe('roadworthy_certificate')
    })

    it('should return empty array for non-existent driver', async () => {
      const documents = await DriverService.getDriverDocuments('non-existent-id')
      expect(documents).toHaveLength(0)
    })
  })
}) 
