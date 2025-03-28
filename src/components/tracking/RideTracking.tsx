import { useEffect, useRef } from 'react'
import { useRideTracking } from '@/services/tracking'
import { Map } from '@/components/map/Map'

interface RideTrackingProps {
  rideId: string
  pickup: {
    latitude: number
    longitude: number
    address: string
  }
  dropoff: {
    latitude: number
    longitude: number
    address: string
  }
}

export default function RideTracking({ rideId, pickup, dropoff }: RideTrackingProps) {
  const { status, driverLocation } = useRideTracking(rideId)
  const mapRef = useRef<any>(null)

  useEffect(() => {
    if (driverLocation && mapRef.current) {
      // Update driver marker position on the map
      mapRef.current.updateDriverLocation(driverLocation)
    }
  }, [driverLocation])

  const formatTime = (dateString: string | null) => {
    if (!dateString) return 'Calculating...'
    return new Date(dateString).toLocaleTimeString('en-ZA', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatDuration = (minutes: number | null) => {
    if (!minutes) return 'Calculating...'
    if (minutes < 1) return 'Less than a minute'
    if (minutes === 1) return '1 minute'
    return `${Math.round(minutes)} minutes`
  }

  const formatDistance = (kilometers: number | null) => {
    if (!kilometers) return 'Calculating...'
    if (kilometers < 1) return `${Math.round(kilometers * 1000)}m`
    return `${kilometers.toFixed(1)}km`
  }

  const getStatusMessage = () => {
    if (!status) return 'Connecting...'

    switch (status.status) {
      case 'pending':
        return 'Looking for a driver...'
      case 'accepted':
        return `Driver is on the way - ${formatDuration(status.estimatedDuration)} away`
      case 'arrived':
        return 'Driver has arrived at pickup location'
      case 'in_progress':
        return `On the way to destination - ${formatDuration(status.estimatedDuration)} remaining`
      case 'completed':
        return 'Ride completed'
      case 'cancelled':
        return 'Ride cancelled'
      default:
        return 'Unknown status'
    }
  }

  const getStatusIndicator = () => {
    if (!status) return null

    switch (status.status) {
      case 'pending':
        return <div className='animate-pulse h-3 w-3 bg-blue-600 rounded-full' />
      case 'accepted':
      case 'arrived':
        return <div className='animate-ping h-3 w-3 bg-yellow-400 rounded-full' />
      case 'in_progress':
        return <div className='h-3 w-3 bg-green-500 rounded-full' />
      case 'completed':
        return <div className='h-3 w-3 bg-green-600 rounded-full' />
      case 'cancelled':
        return <div className='h-3 w-3 bg-red-600 rounded-full' />
      default:
        return null
    }
  }

  return (
    <div className='space-y-4'>
      {/* Status Banner */}
      <div className='bg-blue-50 p-4 rounded-lg'>
        <div className='flex items-center space-x-3'>
          <div className='flex-shrink-0'>
            {getStatusIndicator()}
          </div>
          <div className='flex-1'>
            <p className='text-sm font-medium text-blue-900'>{getStatusMessage()}</p>
            {status?.estimatedArrival && (
              <p className='mt-1 text-sm text-blue-700'>Estimated arrival: {formatTime(status.estimatedArrival)}</p>
            )}
          </div>
        </div>
      </div>

      {/* Map */}
      <div className='h-64 md:h-96 rounded-lg overflow-hidden'>
        <Map
          ref={mapRef}
          initialCenter={{
            latitude: pickup.latitude,
            longitude: pickup.longitude
          }}
          pickup={pickup}
          dropoff={dropoff}
          driverLocation={driverLocation}
          showSearch={false}
        />
      </div>

      {/* Trip Details */}
      <div className='grid grid-cols-2 gap-4 bg-white p-4 rounded-lg shadow'>
        <div>
          <p className='text-sm text-gray-500'>Distance</p>
          <p className='mt-1 text-sm font-medium text-gray-900'>{formatDistance(status?.estimatedDistance)}</p>
        </div>
        <div>
          <p className='text-sm text-gray-500'>Time Remaining</p>
          <p className='mt-1 text-sm font-medium text-gray-900'>{formatDuration(status?.estimatedDuration)}</p>
        </div>
      </div>

      {/* Location Details */}
      <div className='space-y-3 bg-white p-4 rounded-lg shadow'>
        <div>
          <p className='text-sm text-gray-500'>Pickup</p>
          <p className='mt-1 text-sm font-medium text-gray-900'>{pickup.address}</p>
        </div>
        <div>
          <p className='text-sm text-gray-500'>Dropoff</p>
          <p className='mt-1 text-sm font-medium text-gray-900'>{dropoff.address}</p>
        </div>
      </div>
    </div>
  )
}
