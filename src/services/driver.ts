import { Driver, Vehicle, DriverApplication, DriverDocument } from '@/types/driver'

// Mock data for testing
const mockDrivers: Driver[] = []
const mockVehicles: Vehicle[] = []
const mockApplications: DriverApplication[] = []

export async function submitDriverApplication(
  driver: Omit<Driver, 'id' | 'userId' | 'status' | 'createdAt' | 'updatedAt'>,
  vehicle: Omit<Vehicle, 'id' | 'driverId' | 'status' | 'createdAt' | 'updatedAt'>
): Promise<DriverApplication> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000))

  // Validate driver age
  const age = calculateAge(driver.dateOfBirth)
  if (age < 18) {
    throw new Error('Driver must be at least 18 years old')
  }

  // Validate license plate for Gauteng
  if (driver.physicalAddress.province === 'Gauteng' && !vehicle.licensePlate.startsWith('GP')) {
    throw new Error('Vehicles in Gauteng must have GP license plates')
  }

  // Validate vehicle age and roadworthy certificate
  const currentYear = new Date().getFullYear()
  if (currentYear - vehicle.year > 4 && !vehicle.roadworthyCertificate) {
    throw new Error('Vehicles older than 4 years require a roadworthy certificate')
  }

  // Create new driver
  const newDriver: Driver = {
    ...driver,
    id: Math.random().toString(36).substr(2, 9),
    userId: 'current-user-id', // This would come from auth context
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }

  // Create new vehicle
  const newVehicle: Vehicle = {
    ...vehicle,
    id: Math.random().toString(36).substr(2, 9),
    driverId: newDriver.id,
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }

  // Create application
  const application: DriverApplication = {
    id: Math.random().toString(36).substr(2, 9),
    driver: newDriver,
    vehicle: newVehicle,
    status: 'pending',
    submittedAt: new Date().toISOString()
  }

  // Add to mock data
  mockDrivers.push(newDriver)
  mockVehicles.push(newVehicle)
  mockApplications.push(application)

  return application
}

export async function uploadDriverDocument(
  driverId: string,
  document: Omit<DriverDocument, 'id' | 'status' | 'uploadedAt' | 'verifiedAt'>
): Promise<DriverDocument> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000))

  const newDocument: DriverDocument = {
    ...document,
    id: Math.random().toString(36).substr(2, 9),
    status: 'pending',
    uploadedAt: new Date().toISOString()
  }

  // In a real app, this would upload the file to storage and update the driver's documents
  const driver = mockDrivers.find(d => d.id === driverId)
  if (driver) {
    driver.documents.push(newDocument)
  }

  return newDocument
}

export async function getDriverApplication(id: string): Promise<DriverApplication | null> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500))
  return mockApplications.find(app => app.id === id) || null
}

export async function getDriverApplications(): Promise<DriverApplication[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  return mockApplications
}

export async function updateApplicationStatus(
  id: string,
  status: 'approved' | 'rejected',
  rejectionReason?: string
): Promise<DriverApplication> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000))

  const application = mockApplications.find(app => app.id === id)
  if (!application) {
    throw new Error('Application not found')
  }

  application.status = status
  application.processedAt = new Date().toISOString()
  if (status === 'rejected' && rejectionReason) {
    application.rejectionReason = rejectionReason
  }

  // Update driver and vehicle status
  const driver = mockDrivers.find(d => d.id === application.driver.id)
  const vehicle = mockVehicles.find(v => v.id === application.vehicle.id)

  if (driver) {
    driver.status = status
    driver.updatedAt = new Date().toISOString()
  }

  if (vehicle) {
    vehicle.status = status
    vehicle.updatedAt = new Date().toISOString()
  }

  return application
}

// Helper function to calculate age
function calculateAge(dateOfBirth: string): number {
  const birthDate = new Date(dateOfBirth)
  const today = new Date()
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }

  return age
}
