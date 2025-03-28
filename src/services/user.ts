import { User } from '@/types/user'

// Mock user data
const mockUser: User = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  phone: '+27123456789',
  idNumber: '9001015000000',
  isVerified: true,
  preferredLanguage: 'en',
  notifications: {
    rideUpdates: true,
    promotions: true,
    news: false
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
}

export async function getCurrentUser(): Promise<User | null> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500))

  // In production, this would fetch the user from your backend
  // For now, we'll return the mock user
  return mockUser
}

export async function updateUserProfile(profile: Partial<User>): Promise<User> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000))

  // In production, this would update the user in your backend
  // For now, we'll update the mock user
  const updatedUser = {
    ...mockUser,
    ...profile,
    updatedAt: new Date().toISOString()
  }

  return updatedUser
}

export async function verifyIdNumber(idNumber: string): Promise<boolean> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000))

  // In production, this would verify the ID number with your backend
  // For now, we'll just check if it's a valid 13-digit number
  if (!/^\d{13}$/.test(idNumber)) {
    return false
  }

  // Update the mock user's verification status
  mockUser.isVerified = true
  mockUser.idNumber = idNumber

  return true
}
