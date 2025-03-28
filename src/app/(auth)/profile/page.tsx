'use client'

import { useState } from 'react'

import { useAuth } from '@/hooks/useAuth'
import { verifyIdNumber } from '@/services/user'

interface ProfileData {
  name: string
  email: string
  phone: string
  preferredLanguage: string
  idNumber: string
  isVerified: boolean
  notifications: {
    rideUpdates: boolean
    promotions: boolean
    news: boolean
  }
}

export default function Profile() {
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [verificationError, setVerificationError] = useState<string | null>(null)

  const [profileData, setProfileData] = useState<ProfileData>({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    preferredLanguage: 'en',
    idNumber: user?.idNumber || '',
    isVerified: user?.isVerified || false,
    notifications: {
      rideUpdates: true,
      promotions: true,
      news: false
    }
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // TODO: Implement profile update logic
    setIsEditing(false)
  }

  const handleVerifyId = async () => {
    if (!profileData.idNumber || profileData.idNumber.length !== 13) {
      setVerificationError('Please enter a valid 13-digit ID number')

      return
    }

    setIsVerifying(true)
    setVerificationError(null)

    try {
      const isVerified = await verifyIdNumber(profileData.idNumber)

      if (isVerified) {
        setProfileData({ ...profileData, isVerified: true })
      } else {
        setVerificationError('Invalid ID number. Please check and try again.')
      }
    } catch (error) {
      setVerificationError('Failed to verify ID number. Please try again.')
    } finally {
      setIsVerifying(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return
    }

    // TODO: Implement account deletion logic
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='bg-white shadow rounded-lg p-6'>
        <h1 className='text-2xl font-bold text-gray-900'>Profile Settings</h1>
        <p className='mt-2 text-gray-600'>Manage your account settings and preferences</p>
      </div>

      {/* ID Verification */}
      <div className='bg-white shadow rounded-lg p-6'>
        <h2 className='text-lg font-medium text-gray-900 mb-4'>ID Verification</h2>
        <div className='space-y-4'>
          <div>
            <label htmlFor='idNumber' className='block text-sm font-medium text-gray-700'>
              ID Number
            </label>
            <input
              type='text'
              id='idNumber'
              value={profileData.idNumber}
              onChange={e => setProfileData({ ...profileData, idNumber: e.target.value })}
              disabled={profileData.isVerified}
              maxLength={13}
              pattern='[0-9]{13}'
              className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100'
              placeholder='Enter your 13-digit ID number'
            />
            {verificationError && <p className='mt-1 text-sm text-red-600'>{verificationError}</p>}
          </div>
          {!profileData.isVerified ? (
            <button
              onClick={handleVerifyId}
              disabled={isVerifying || !profileData.idNumber || profileData.idNumber.length !== 13}
              className='px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-400'
            >
              {isVerifying ? 'Verifying...' : 'Verify ID Number'}
            </button>
          ) : (
            <div className='flex items-center text-green-600'>
              <svg className='h-5 w-5 mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M5 13l4 4L19 7' />
              </svg>
              <span>ID Number Verified</span>
            </div>
          )}
        </div>
      </div>

      {/* Personal Information */}
      <div className='bg-white shadow rounded-lg p-6'>
        <form onSubmit={handleSubmit} className='space-y-6'>
          <div>
            <h2 className='text-lg font-medium text-gray-900 mb-4'>Personal Information</h2>
            <div className='grid grid-cols-1 gap-6 sm:grid-cols-2'>
              <div>
                <label htmlFor='name' className='block text-sm font-medium text-gray-700'>
                  Full Name
                </label>
                <input
                  type='text'
                  id='name'
                  value={profileData.name}
                  onChange={e => setProfileData({ ...profileData, name: e.target.value })}
                  disabled={!isEditing}
                  className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100'
                />
              </div>
              <div>
                <label htmlFor='email' className='block text-sm font-medium text-gray-700'>
                  Email Address
                </label>
                <input
                  type='email'
                  id='email'
                  value={profileData.email}
                  onChange={e => setProfileData({ ...profileData, email: e.target.value })}
                  disabled={!isEditing}
                  className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100'
                />
              </div>
              <div>
                <label htmlFor='phone' className='block text-sm font-medium text-gray-700'>
                  Phone Number
                </label>
                <input
                  type='tel'
                  id='phone'
                  value={profileData.phone}
                  onChange={e => setProfileData({ ...profileData, phone: e.target.value })}
                  disabled={!isEditing}
                  className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100'
                />
              </div>
              <div>
                <label htmlFor='language' className='block text-sm font-medium text-gray-700'>
                  Preferred Language
                </label>
                <select
                  id='language'
                  value={profileData.preferredLanguage}
                  onChange={e => setProfileData({ ...profileData, preferredLanguage: e.target.value })}
                  disabled={!isEditing}
                  className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100'
                >
                  <option value='en'>English</option>
                  <option value='af'>Afrikaans</option>
                  <option value='zu'>Zulu</option>
                  <option value='xh'>Xhosa</option>
                </select>
              </div>
            </div>
          </div>

          {/* Notification Preferences */}
          <div>
            <h2 className='text-lg font-medium text-gray-900 mb-4'>Notification Preferences</h2>
            <div className='space-y-4'>
              <div className='flex items-center justify-between'>
                <div>
                  <label className='text-sm font-medium text-gray-700'>Ride Updates</label>
                  <p className='text-sm text-gray-500'>Get notified about your ride status</p>
                </div>
                <button
                  type='button'
                  onClick={() =>
                    setProfileData({
                      ...profileData,
                      notifications: {
                        ...profileData.notifications,
                        rideUpdates: !profileData.notifications.rideUpdates
                      }
                    })
                  }
                  disabled={!isEditing}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    profileData.notifications.rideUpdates ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      profileData.notifications.rideUpdates ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
              <div className='flex items-center justify-between'>
                <div>
                  <label className='text-sm font-medium text-gray-700'>Promotions</label>
                  <p className='text-sm text-gray-500'>Receive promotional offers and discounts</p>
                </div>
                <button
                  type='button'
                  onClick={() =>
                    setProfileData({
                      ...profileData,
                      notifications: {
                        ...profileData.notifications,
                        promotions: !profileData.notifications.promotions
                      }
                    })
                  }
                  disabled={!isEditing}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    profileData.notifications.promotions ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      profileData.notifications.promotions ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
              <div className='flex items-center justify-between'>
                <div>
                  <label className='text-sm font-medium text-gray-700'>News and Updates</label>
                  <p className='text-sm text-gray-500'>Stay informed about app updates and news</p>
                </div>
                <button
                  type='button'
                  onClick={() =>
                    setProfileData({
                      ...profileData,
                      notifications: {
                        ...profileData.notifications,
                        news: !profileData.notifications.news
                      }
                    })
                  }
                  disabled={!isEditing}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    profileData.notifications.news ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      profileData.notifications.news ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className='flex justify-end space-x-4'>
            {isEditing ? (
              <>
                <button
                  type='button'
                  onClick={() => setIsEditing(false)}
                  className='px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                >
                  Cancel
                </button>
                <button
                  type='submit'
                  className='px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                >
                  Save Changes
                </button>
              </>
            ) : (
              <button
                type='button'
                onClick={() => setIsEditing(true)}
                className='px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
              >
                Edit Profile
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Delete Account */}
      <div className='bg-white shadow rounded-lg p-6'>
        <h2 className='text-lg font-medium text-gray-900 mb-4'>Delete Account</h2>
        <p className='text-sm text-gray-500 mb-4'>
          Once you delete your account, there is no going back. Please be certain.
        </p>
        <button
          onClick={handleDeleteAccount}
          className='px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'
        >
          Delete Account
        </button>
      </div>
    </div>
  )
}
