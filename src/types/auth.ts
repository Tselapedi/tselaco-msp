export type UserRole = 'user' | 'driver' | 'admin'

export interface User {
  id: string
  email: string
  password: string // Hashed
  role: UserRole
  firstName: string
  lastName: string
  phoneNumber: string
  isVerified: boolean
  idNumber: string
  verificationCode: string | null
  verificationExpiry: Date | null
  createdAt: Date
  updatedAt: Date
}

export interface DriverVerification {
  id: string
  driverId: string
  referenceNumber: string // Unique, never-changing reference
  status: 'pending' | 'approved' | 'rejected'
  adminNotes: string | null
  submittedAt: Date
  processedAt: Date | null
  processedBy: string | null
}

export interface AuthToken {
  token: string
  userId: string
  role: UserRole
  expiresAt: Date
  createdAt: Date
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface SignupData {
  email: string
  password: string
  firstName: string
  lastName: string
  phoneNumber: string
  idNumber: string
  role: 'user' | 'driver'
}

export interface VerificationData {
  userId: string
  code: string
} 
