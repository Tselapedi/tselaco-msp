'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Receipt, getReceipt, emailReceipt } from '@/services/rides'

export default function RideReceipt({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [receipt, setReceipt] = useState<Receipt | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSendingEmail, setIsSendingEmail] = useState(false)

  useEffect(() => {
    const fetchReceipt = async () => {
      try {
        const data = await getReceipt(params.id)
        setReceipt(data)
      } catch (error) {
        console.error('Error fetching receipt:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchReceipt()
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

  const handleEmailReceipt = async () => {
    if (!receipt) return

    setIsSendingEmail(true)
    try {
      await emailReceipt(receipt.rideId)
      alert('Receipt has been sent to your email.')
    } catch (error) {
      console.error('Error sending receipt:', error)
      alert('Failed to send receipt. Please try again.')
    } finally {
      setIsSendingEmail(false)
    }
  }

  const handlePrint = () => {
    window.print()
  }

  if (isLoading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500'></div>
      </div>
    )
  }

  if (!receipt) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <h2 className='text-2xl font-bold text-gray-900'>Receipt Not Found</h2>
          <p className='mt-2 text-gray-600'>The receipt you're looking for doesn't exist.</p>
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

  return (
    <div className='max-w-2xl mx-auto space-y-6 print:m-0'>
      {/* Header */}
      <div className='bg-white shadow rounded-lg p-6 print:shadow-none'>
        <div className='flex items-center justify-between print:justify-center'>
          <h1 className='text-2xl font-bold text-gray-900'>Receipt</h1>
          <button
            onClick={() => router.push(`/rides/${receipt.rideId}`)}
            className='text-sm text-blue-600 hover:text-blue-800 print:hidden'
          >
            Back to Ride Details
          </button>
        </div>
        <p className='mt-2 text-gray-600'>{formatDate(receipt.date)}</p>
        <p className='mt-1 text-sm text-gray-500'>Receipt #{receipt.rideId}</p>
      </div>

      {/* Ride Details */}
      <div className='bg-white shadow rounded-lg p-6 space-y-4 print:shadow-none'>
        <h2 className='text-lg font-medium text-gray-900'>Ride Details</h2>
        <div className='grid grid-cols-1 gap-4'>
          <div>
            <p className='text-sm text-gray-500'>Pickup Location</p>
            <p className='mt-1 text-sm font-medium text-gray-900'>{receipt.pickup}</p>
          </div>
          <div>
            <p className='text-sm text-gray-500'>Dropoff Location</p>
            <p className='mt-1 text-sm font-medium text-gray-900'>{receipt.dropoff}</p>
          </div>
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <p className='text-sm text-gray-500'>Distance</p>
              <p className='mt-1 text-sm font-medium text-gray-900'>{receipt.distance} km</p>
            </div>
            <div>
              <p className='text-sm text-gray-500'>Duration</p>
              <p className='mt-1 text-sm font-medium text-gray-900'>{receipt.duration} min</p>
            </div>
          </div>
        </div>
      </div>

      {/* Driver Details */}
      <div className='bg-white shadow rounded-lg p-6 space-y-4 print:shadow-none'>
        <h2 className='text-lg font-medium text-gray-900'>Driver Details</h2>
        <div className='flex items-center space-x-4'>
          <div className='flex-1'>
            <p className='text-sm font-medium text-gray-900'>{receipt.driver.name}</p>
            <div className='mt-1 flex items-center space-x-2'>
              <p className='text-sm text-gray-500'>{receipt.driver.vehicle}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Fare Breakdown */}
      <div className='bg-white shadow rounded-lg p-6 print:shadow-none'>
        <h2 className='text-lg font-medium text-gray-900 mb-4'>Fare Breakdown</h2>
        <div className='space-y-3'>
          {receipt.fareBreakdown.map((item, index) => (
            <div key={index} className='flex justify-between items-center'>
              <span className='text-sm text-gray-600'>{item.description}</span>
              <span className='text-sm font-medium text-gray-900'>R{item.amount.toFixed(2)}</span>
            </div>
          ))}
          <div className='border-t border-gray-200 pt-3 mt-3'>
            <div className='flex justify-between items-center'>
              <span className='text-base font-medium text-gray-900'>Total</span>
              <span className='text-base font-bold text-gray-900'>R{receipt.totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Method */}
      <div className='bg-white shadow rounded-lg p-6 print:shadow-none'>
        <h2 className='text-lg font-medium text-gray-900 mb-4'>Payment Method</h2>
        <div className='flex items-center space-x-3'>
          <div className='text-sm text-gray-900'>{receipt.paymentMethod}</div>
        </div>
      </div>

      {/* Actions */}
      <div className='flex justify-end space-x-4 pb-6 print:hidden'>
        <button
          onClick={handlePrint}
          className='px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50'
        >
          Print Receipt
        </button>
        <button
          onClick={handleEmailReceipt}
          disabled={isSendingEmail}
          className='px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-400'
        >
          {isSendingEmail ? 'Sending...' : 'Email Receipt'}
        </button>
      </div>
    </div>
  )
}
