export type LicenseType = 'A' | 'B' | 'C' | 'D' | 'E' | 'F'
export type VehicleType = 'Hatchback' | 'Sedan' | 'SUV' | 'Bakkie' | 'Van' | 'Minibus' | 'Luxury'
export type Province = 'Gauteng' | 'Western Cape' | 'Eastern Cape' | 'KwaZulu-Natal' | 'Limpopo' | 'Mpumalanga' | 'North West' | 'Free State' | 'Northern Cape'

export interface DriverDocument {
  id: string
  type: 'id' | 'license' | 'pdp' | 'criminal_check' | 'roadworthy'
  url: string
  status: 'pending' | 'approved' | 'rejected'
  uploadedAt: string
  verifiedAt?: string
}

export interface Driver {
  id: string
  userId: string
  firstName: string
  middleName?: string
  lastName: string
  idNumber: string
  dateOfBirth: string
  age: number
  physicalAddress: {
    street: string
    suburb: string
    city: string
    province: Province
    postalCode: string
  }
  bankingDetails: {
    bankName: string
    accountNumber: string
    accountHolder: string
    branchCode: string
  }
  phoneNumber: string
  licenseType: LicenseType
  licenseNumber: string
  pdpNumber: string
  documents: DriverDocument[]
  status: 'pending' | 'active' | 'suspended' | 'rejected'
  createdAt: string
  updatedAt: string
}

export interface Vehicle {
  id: string
  driverId: string
  make: string
  model: string
  type: VehicleType
  color: string
  year: number
  licensePlate: string
  vin: string
  mileage: number
  estimatedValue: number
  roadworthyCertificate?: DriverDocument
  status: 'pending' | 'active' | 'suspended' | 'rejected'
  createdAt: string
  updatedAt: string
}

export interface DriverApplication {
  id: string
  driver: Driver
  vehicle: Vehicle
  status: 'pending' | 'approved' | 'rejected'
  submittedAt: string
  processedAt?: string
  rejectionReason?: string
} 
