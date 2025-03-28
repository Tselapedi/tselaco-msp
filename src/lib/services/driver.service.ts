import { db } from '@/lib/db'
import { drivers, driverDocuments, vehicles } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { sendDriverApprovalEmail, sendDriverRejectionEmail } from '@/lib/email'

export class DriverService {
  static async getDriverByReferenceNumber(referenceNumber: string) {
    try {
      const [driver] = await db.select().from(drivers).where(eq(drivers.referenceNumber, referenceNumber)).limit(1)

      if (!driver) {
        throw new Error('Driver not found')
      }

      return driver
    } catch (error) {
      console.error('Error getting driver:', error)
      throw new Error('Failed to get driver')
    }
  }

  static async updateDriverDocuments(driverId: string, documents: Array<{ type: string; url: string }>) {
    try {
      const results = await Promise.all(
        documents.map(doc =>
          db.insert(driverDocuments).values({
            driverId,
            type: doc.type as any,
            url: doc.url
          })
        )
      )

      return results
    } catch (error) {
      console.error('Error updating driver documents:', error)
      throw new Error('Failed to update driver documents')
    }
  }

  static async updateVehicleInfo(
    driverId: string,
    vehicleData: {
      make: string
      model: string
      year: number
      color: string
      licensePlate: string
      vin: string
      type: 'sedan' | 'suv' | 'van' | 'hatchback'
      mileage: number
    }
  ) {
    try {
      // Validate vehicle data
      if (!vehicleData.licensePlate.startsWith('GP')) {
        throw new Error('License plate must start with GP (Gauteng Province)')
      }

      if (vehicleData.vin.length !== 17) {
        throw new Error('VIN must be exactly 17 characters')
      }

      const currentYear = new Date().getFullYear()
      if (vehicleData.year < currentYear - 10 || vehicleData.year > currentYear) {
        throw new Error('Vehicle must not be older than 10 years')
      }

      const [vehicle] = await db.insert(vehicles).values({
        driverId,
        ...vehicleData
      })

      return vehicle
    } catch (error) {
      console.error('Error updating vehicle info:', error)
      throw new Error('Failed to update vehicle info')
    }
  }

  static async approveDriver(driverId: string) {
    try {
      const [driver] = await db.select().from(drivers).where(eq(drivers.id, driverId)).limit(1)

      if (!driver) {
        throw new Error('Driver not found')
      }

      await db.update(drivers).set({ status: 'approved' }).where(eq(drivers.id, driverId))

      await sendDriverApprovalEmail(driver.email, driver.referenceNumber)

      return { success: true }
    } catch (error) {
      console.error('Error approving driver:', error)
      throw new Error('Failed to approve driver')
    }
  }

  static async rejectDriver(driverId: string, reason: string) {
    try {
      const [driver] = await db.select().from(drivers).where(eq(drivers.id, driverId)).limit(1)

      if (!driver) {
        throw new Error('Driver not found')
      }

      await db.update(drivers).set({ status: 'rejected', rejectionReason: reason }).where(eq(drivers.id, driverId))

      await sendDriverRejectionEmail(driver.email, reason)

      return { success: true }
    } catch (error) {
      console.error('Error rejecting driver:', error)
      throw new Error('Failed to reject driver')
    }
  }

  static async getDriverDocuments(driverId: string) {
    try {
      const documents = await db.select().from(driverDocuments).where(eq(driverDocuments.driverId, driverId))

      return documents
    } catch (error) {
      console.error('Error getting driver documents:', error)
      throw new Error('Failed to get driver documents')
    }
  }

  static async getDriverVehicle(driverId: string) {
    try {
      const [vehicle] = await db.select().from(vehicles).where(eq(vehicles.driverId, driverId)).limit(1)

      return vehicle
    } catch (error) {
      console.error('Error getting driver vehicle:', error)
      throw new Error('Failed to get driver vehicle')
    }
  }
}
