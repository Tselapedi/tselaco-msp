import { getCurrentUser } from './user'

export interface Ride {
  id: string
  date: string
  pickup: string
  dropoff: string
  status: 'completed' | 'in_progress' | 'cancelled'
  price: number
  driver: {
    name: string
    rating: number
    vehicle: string
  }
}

export interface Receipt {
  id: string
  date: string
  pickup: string
  dropoff: string
  distance: number
  duration: number
  fare: {
    base: number
    distance: number
    time: number
    total: number
  }
  driver: {
    name: string
    rating: number
    vehicle: string
  }
  paymentMethod: string
}

// Mock data for testing
const mockRides: Ride[] = [
  {
    id: '1',
    date: '2024-03-15T10:30:00',
    pickup: 'Sandton City Mall',
    dropoff: 'Rosebank Mall',
    status: 'completed',
    price: 150,
    driver: {
      name: 'John Doe',
      rating: 4.8,
      vehicle: 'Toyota Camry'
    }
  },
  {
    id: '2',
    date: '2024-03-14T15:45:00',
    pickup: 'Melrose Arch',
    dropoff: 'Fourways Mall',
    status: 'completed',
    price: 180,
    driver: {
      name: 'Jane Smith',
      rating: 4.9,
      vehicle: 'BMW 3 Series'
    }
  },
  {
    id: '3',
    date: '2024-03-14T09:15:00',
    pickup: 'Eastgate Shopping Centre',
    dropoff: 'Sandton City Mall',
    status: 'in_progress',
    price: 120,
    driver: {
      name: 'Mike Johnson',
      rating: 4.7,
      vehicle: 'Mercedes C-Class'
    }
  },
  {
    id: '4',
    date: '2024-03-13T14:20:00',
    pickup: 'Rosebank Mall',
    dropoff: 'Melrose Arch',
    status: 'cancelled',
    price: 0,
    driver: {
      name: 'Sarah Wilson',
      rating: 4.6,
      vehicle: 'Audi A4'
    }
  }
]

const mockReceipts: { [key: string]: Receipt } = {
  '1': {
    id: '1',
    date: '2024-03-15T10:30:00',
    pickup: 'Sandton City Mall',
    dropoff: 'Rosebank Mall',
    distance: 5.2,
    duration: 18,
    fare: {
      base: 50,
      distance: 93.6,
      time: 6.4,
      total: 150
    },
    driver: {
      name: 'John Doe',
      rating: 4.8,
      vehicle: 'Toyota Camry'
    },
    paymentMethod: 'Credit Card'
  }
}

export async function getRides(): Promise<Ride[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  return mockRides
}

export async function getRide(id: string): Promise<Ride | null> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500))
  return mockRides.find(ride => ride.id === id) || null
}

export async function getReceipt(id: string): Promise<Receipt | null> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500))
  return mockReceipts[id] || null
}

export async function bookRide(pickup: string, dropoff: string, rideType: string): Promise<Ride> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000))

  // Check if user is verified
  const user = await getCurrentUser()
  if (!user?.isVerified) {
    throw new Error('User must verify their ID number before booking a ride')
  }

  const newRide: Ride = {
    id: Math.random().toString(36).substr(2, 9),
    date: new Date().toISOString(),
    pickup,
    dropoff,
    status: 'pending',
    price: 0, // This would be calculated by the backend
    driver: null
  }

  // Add to mock data
  mockRides.unshift(newRide)

  return newRide
}

export async function cancelRide(id: string): Promise<void> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  // In a real app, this would update the ride status in the database
}

export async function rateRide(id: string, rating: number, comment?: string): Promise<void> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500))
  // In a real app, this would store the rating and comment in the database
}

export async function emailReceipt(id: string, email: string): Promise<void> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  // In a real app, this would send an email with the receipt
}
