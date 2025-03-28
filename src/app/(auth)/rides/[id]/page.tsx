'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Ride, getRide, cancelRide, rateRide } from '@/services/rides'
import RideTracking from '@/components/tracking/RideTracking'

export default function RideDetails({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [ride, setRide] = useState<Ride | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isCancelling, setIsCancelling] = useState(false)
  const [showRating, setShowRating] = useState(false)
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [isSubmittingRating, setIsSubmittingRating] = useState(false)

  useEffect(() => {
    const fetchRide = async () => {
      try {
        const data = await getRide(params.id)
        setRide(data)
      } catch (error) {
        console.error('Error fetching ride:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchRide()
  }, [params.id])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-ZA', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusColor = (status: Ride['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'in_progress':
        return 'bg-blue-100 text-blue-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const handleCancel = async () => {
    if (!ride) return

    if (!confirm('Are you sure you want to cancel this ride?')) {
      return
    }

    setIsCancelling(true)
    try {
      await cancelRide(ride.id)
      setRide({ ...ride, status: 'cancelled' })
    } catch (error) {
      console.error('Error cancelling ride:', error)
    } finally {
      setIsCancelling(false)
    }
  }

  const handleSubmitRating = async () => {
    if (!ride) return

    setIsSubmittingRating(true)
    try {
      await rateRide(ride.id, rating, comment)
      setShowRating(false)
      router.push('/rides')
    } catch (error) {
      console.error('Error submitting rating:', error)
    } finally {
      setIsSubmittingRating(false)
    }
  }

  if (isLoading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500'></div>
      </div>
    )
  }

  if (!ride) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <h2 className='text-2xl font-bold text-gray-900'>Ride Not Found</h2>
          <p className='mt-2 text-gray-600'>The ride you're looking for doesn't exist.</p>
          <button
            onClick={() => router.push('/rides')}
            className='mt-4 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700'
          >
            Back to Rides
          </button>
        </div>
      </div>
    )
  }

  const isActiveRide = ['pending', 'accepted', 'arrived', 'in_progress'].includes(ride.status)

  return (
    <div className='max-w-2xl mx-auto space-y-6'>
      {/* Header */}
      <div className='bg-white shadow rounded-lg p-6'>
        <div className='flex items-center justify-between'>
          <h1 className='text-2xl font-bold text-gray-900'>Ride Details</h1>
          <button onClick={() => router.push('/rides')} className='text-sm text-blue-600 hover:text-blue-800'>
            Back to Rides
          </button>
        </div>
        <p className='mt-2 text-gray-600'>{formatDate(ride.date)}</p>
      </div>

      {/* Tracking Component for Active Rides */}
      {isActiveRide && (
        <RideTracking
          rideId={ride.id}
          pickup={{
            latitude: ride.pickupLocation.latitude,
            longitude: ride.pickupLocation.longitude,
            address: ride.pickup
          }}
          dropoff={{
            latitude: ride.dropoffLocation.latitude,
            longitude: ride.dropoffLocation.longitude,
            address: ride.dropoff
          }}
        />
      )}

      {/* Status */}
      {!isActiveRide && (
        <div className='bg-white shadow rounded-lg p-6'>
          <div className='flex items-center justify-between'>
            <div>
              <h2 className='text-lg font-medium text-gray-900'>Status</h2>
              <span
                className={`mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(ride.status)}`}
              >
                {ride.status.replace('_', ' ')}
              </span>
            </div>
            {ride.status === 'in_progress' && (
              <button
                onClick={handleCancel}
                disabled={isCancelling}
                className='px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 disabled:bg-gray-400'
              >
                {isCancelling ? 'Cancelling...' : 'Cancel Ride'}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Ride Details (only shown for completed or cancelled rides) */}
      {!isActiveRide && (
        <>
          <div className='bg-white shadow rounded-lg p-6 space-y-4'>
            <h2 className='text-lg font-medium text-gray-900'>Ride Details</h2>
            <div className='grid grid-cols-1 gap-4'>
              <div>
                <p className='text-sm text-gray-500'>Pickup Location</p>
                <p className='mt-1 text-sm font-medium text-gray-900'>{ride.pickup}</p>
              </div>
              <div>
                <p className='text-sm text-gray-500'>Dropoff Location</p>
                <p className='mt-1 text-sm font-medium text-gray-900'>{ride.dropoff}</p>
              </div>
            </div>
          </div>

          {/* Driver Details */}
          <div className='bg-white shadow rounded-lg p-6 space-y-4'>
            <h2 className='text-lg font-medium text-gray-900'>Driver Details</h2>
            <div className='flex items-center space-x-4'>
              <div className='flex-1'>
                <p className='text-sm font-medium text-gray-900'>{ride.driver.name}</p>
                <div className='mt-1 flex items-center space-x-2'>
                  <p className='text-sm text-gray-500'>{ride.driver.vehicle}</p>
                  <span className='text-sm text-gray-300'>•</span>
                  <p className='text-sm text-gray-500'>★ {ride.driver.rating}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Price */}
          {ride.price > 0 && (
            <div className='bg-white shadow rounded-lg p-6'>
              <h2 className='text-lg font-medium text-gray-900'>Price</h2>
              <p className='mt-2 text-2xl font-bold text-gray-900'>R{ride.price}</p>
            </div>
          )}

          {/* Actions */}
          <div className='flex justify-end space-x-4 pb-6'>
            {ride.status === 'completed' && !showRating && (
              <>
                <button
                  onClick={() => router.push(`/rides/${ride.id}/receipt`)}
                  className='px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50'
                >
                  View Receipt
                </button>
                <button
                  onClick={() => setShowRating(true)}
                  className='px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700'
                >
                  Rate Ride
                </button>
              </>
            )}
          </div>
        </>
      )}

      {/* Rating Modal */}
      {showRating && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4'>
          <div className='bg-white rounded-lg p-6 max-w-md w-full'>
            <h3 className='text-lg font-medium text-gray-900 mb-4'>Rate Your Ride</h3>
            <div className='space-y-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700'>Rating</label>
                <div className='mt-1 flex items-center space-x-2'>
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      className={`text-2xl ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700'>Comment</label>
                <textarea
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                  rows={3}
                  className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
                  placeholder='How was your ride?'
                />
              </div>
              <div className='flex justify-end space-x-4'>
                <button
                  onClick={() => setShowRating(false)}
                  className='px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50'
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitRating}
                  disabled={isSubmittingRating}
                  className='px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:bg-gray-400'
                >
                  {isSubmittingRating ? 'Submitting...' : 'Submit Rating'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
