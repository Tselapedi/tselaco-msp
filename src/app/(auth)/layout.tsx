'use client'

import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import NotificationBell from '@/components/notifications/NotificationBell'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/')
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500'></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      <nav className='bg-white shadow'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-between h-16'>
            <div className='flex'>
              <div className='flex-shrink-0 flex items-center'>
                <img className='h-8 w-auto' src='/logo.png' alt='TselacoMSP' />
              </div>
              <div className='hidden sm:ml-6 sm:flex sm:space-x-8'>
                <a
                  href='/dashboard'
                  className='border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium'
                >
                  Dashboard
                </a>
                <a
                  href='/book-ride'
                  className='border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium'
                >
                  Book a Ride
                </a>
                <a
                  href='/rides'
                  className='border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium'
                >
                  My Rides
                </a>
                <a
                  href='/profile'
                  className='border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium'
                >
                  Profile
                </a>
              </div>
            </div>
            <div className='hidden sm:ml-6 sm:flex sm:items-center'>
              <NotificationBell />
              <div className='ml-3 relative'>
                <div>
                  <button
                    onClick={() => router.push('/api/auth/logout')}
                    className='ml-4 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50'
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='sm:hidden'>
          <div className='pt-2 pb-3 space-y-1'>
            <a
              href='/dashboard'
              className='bg-white border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium'
            >
              Dashboard
            </a>
            <a
              href='/book-ride'
              className='bg-white border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium'
            >
              Book a Ride
            </a>
            <a
              href='/rides'
              className='bg-white border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium'
            >
              My Rides
            </a>
            <a
              href='/profile'
              className='bg-white border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium'
            >
              Profile
            </a>
            <div className='bg-white border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium'>
              <NotificationBell />
            </div>
            <button
              onClick={() => router.push('/api/auth/logout')}
              className='w-full text-left bg-white border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium'
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className='max-w-7xl mx-auto py-6 sm:px-6 lg:px-8'>{children}</main>
    </div>
  )
}
