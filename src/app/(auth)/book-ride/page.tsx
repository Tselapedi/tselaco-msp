'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Map from '@/components/map/Map'
import { Location, Route, calculateRoute, calculateFare } from '@/services/location'
import { bookRide } from '@/services/rides'
import { useAuth } from '@/hooks/useAuth'

interface RideOption {
  id: string
  name: string
  price: number
  description: string
  icon: string
}

const rideOptions: RideOption[] = [
  {
    id: 'standard',
    name: 'Standard',
    price: 18,
    description: 'Comfortable ride for 1-3 passengers',
    icon: '🚗'
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 25,
    description: 'Luxury vehicle for 1-2 passengers',
    icon: '✨'
  },
  {
    id: 'xl',
    name: 'XL',
    price: 30,
    description: 'Spacious ride for 4-6 passengers',
    icon: '🚐'
  }
]

export default function BookRide() {
  const router = useRouter()
  const { user } = useAuth()
  const [selectedOption, setSelectedOption] = useState<string>('standard')
  const [pickupLocation, setPickupLocation] = useState<Location | null>(null)
  const [dropoffLocation, setDropoffLocation] = useState<Location | null>(null)
  const [route, setRoute] = useState<Route | null>(null)
  const [estimatedFare, setEstimatedFare] = useState<number | null>(null)
  const [isBooking, setIsBooking] = useState(false)
  const [isCalculating, setIsCalculating] = useState(false)

  const handlePickupSelect = async (location: Location) => {
    setPickupLocation(location)
    await calculateRouteIfBothLocationsSet(location, dropoffLocation)
  }

  const handleDropoffSelect = async (location: Location) => {
    setDropoffLocation(location)
    await calculateRouteIfBothLocationsSet(pickupLocation, location)
  }

  const calculateRouteIfBothLocationsSet = async (pickup: Location | null, dropoff: Location | null) => {
    if (!pickup || !dropoff) return

    setIsCalculating(true)
    try {
      const calculatedRoute = await calculateRoute(pickup, dropoff)
      setRoute(calculatedRoute)

      const fare = calculateFare(calculatedRoute.distance, calculatedRoute.duration, selectedOption)
      setEstimatedFare(fare)
    } catch (error) {
      console.error('Error calculating route:', error)
    } finally {
      setIsCalculating(false)
    }
  }

  const handleBookRide = async () => {
    if (!user?.isVerified) {
      alert('Please verify your ID number in your profile before booking a ride.')
      router.push('/profile')
      return
    }

    if (!pickupLocation || !dropoffLocation || !route || !estimatedFare) return

    setIsBooking(true)
    try {
      const ride = await bookRide(pickupLocation.name || '', dropoffLocation.name || '', selectedOption)
      router.push(`/rides/${ride.id}`)
    } catch (error) {
      console.error('Error booking ride:', error)
    } finally {
      setIsBooking(false)
    }
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='bg-white shadow rounded-lg p-6'>
        <h1 className='text-2xl font-bold text-gray-900'>Book a Ride</h1>
        <p className='mt-2 text-gray-600'>Enter your pickup and dropoff locations</p>
      </div>

      {/* ID Verification Warning */}
      {!user?.isVerified && (
        <div className='bg-yellow-50 border-l-4 border-yellow-400 p-4'>
          <div className='flex'>
            <div className='flex-shrink-0'>
              <svg className='h-5 w-5 text-yellow-400' viewBox='0 0 20 20' fill='currentColor'>
                <path
                  fillRule='evenodd'
                  d='M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z'
                  clipRule='evenodd'
                />
              </svg>
            </div>
            <div className='ml-3'>
              <p className='text-sm text-yellow-700'>
                Please verify your ID number in your{' '}
                <button
                  onClick={() => router.push('/profile')}
                  className='font-medium underline text-yellow-700 hover:text-yellow-600'
                >
                  profile
                </button>{' '}
                before booking a ride.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Map and Booking Form */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {/* Map */}
        <div className='bg-white shadow rounded-lg p-6 h-[600px]'>
          <Map
            onLocationSelect={pickupLocation ? handleDropoffSelect : handlePickupSelect}
            onRouteCalculate={setRoute}
            showSearch={true}
          />
        </div>

        {/* Booking Form */}
        <div className='space-y-6'>
          {/* Location Summary */}
          <div className='bg-white shadow rounded-lg p-6 space-y-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700'>Pickup Location</label>
              <p className='mt-1 text-sm text-gray-900'>{pickupLocation?.name || 'Select on map'}</p>
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700'>Dropoff Location</label>
              <p className='mt-1 text-sm text-gray-900'>{dropoffLocation?.name || 'Select on map'}</p>
            </div>
          </div>

          {/* Route Information */}
          {route && (
            <div className='bg-white shadow rounded-lg p-6'>
              <h3 className='text-lg font-medium text-gray-900 mb-4'>Route Information</h3>
              <div className='space-y-2'>
                <p className='text-sm text-gray-600'>Distance: {(route.distance / 1000).toFixed(1)} km</p>
                <p className='text-sm text-gray-600'>Estimated Duration: {Math.round(route.duration / 60)} minutes</p>
              </div>
            </div>
          )}

          {/* Ride Options */}
          <div className='bg-white shadow rounded-lg p-6'>
            <h3 className='text-lg font-medium text-gray-900 mb-4'>Select Ride Type</h3>
            <div className='space-y-4'>
              {rideOptions.map(option => (
                <button
                  key={option.id}
                  onClick={() => {
                    setSelectedOption(option.id)
                    if (route) {
                      const fare = calculateFare(route.distance, route.duration, option.id)
                      setEstimatedFare(fare)
                    }
                  }}
                  className={`w-full p-4 rounded-lg border-2 transition-colors ${
                    selectedOption === option.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center space-x-4'>
                      <span className='text-2xl'>{option.icon}</span>
                      <div className='text-left'>
                        <p className='font-medium'>{option.name}</p>
                        <p className='text-sm text-gray-500'>{option.description}</p>
                      </div>
                    </div>
                    <div className='text-right'>
                      <p className='font-medium'>R{option.price}/km</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Estimated Fare */}
          {estimatedFare && (
            <div className='bg-white shadow rounded-lg p-6'>
              <h3 className='text-lg font-medium text-gray-900 mb-4'>Estimated Fare</h3>
              <p className='text-2xl font-bold text-blue-600'>R{estimatedFare}</p>
            </div>
          )}

          {/* Book Button */}
          <button
            onClick={handleBookRide}
            disabled={isBooking || !pickupLocation || !dropoffLocation || !route || !estimatedFare}
            className={`w-full py-4 px-6 rounded-lg text-white font-medium ${
              isBooking || !pickupLocation || !dropoffLocation || !route || !estimatedFare
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isBooking ? 'Booking...' : 'Book Now'}
          </button>
        </div>
      </div>
    </div>
  )
}
