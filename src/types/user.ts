export interface User {
  id: string
  name: string
  email: string
  phone: string
  idNumber?: string
  isVerified: boolean
  preferredLanguage: string
  notifications: {
    rideUpdates: boolean
    promotions: boolean
    news: boolean
  }
  createdAt: string
  updatedAt: string
}

export interface UserProfile extends Omit<User, 'id' | 'createdAt' | 'updatedAt'> {} 
