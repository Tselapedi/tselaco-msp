import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useNotifications, Notification } from '@/services/notifications'

export default function NotificationBell() {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const { notifications, permission, requestPermission, markAsRead, markAllAsRead, clearNotifications } =
    useNotifications()

  const unreadCount = notifications.filter(n => !n.read).length

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`

    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `${diffInHours}h ago`

    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays === 1) return 'Yesterday'
    if (diffInDays < 7) return `${diffInDays}d ago`

    return date.toLocaleDateString()
  }

  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id)

    if (notification.data?.rideId) {
      router.push(`/rides/${notification.data.rideId}`)
    }

    setIsOpen(false)
  }

  return (
    <div className='relative' ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className='relative p-2 text-gray-600 hover:text-gray-900 focus:outline-none'
      >
        <svg
          className='h-6 w-6'
          fill='none'
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth='2'
          viewBox='0 0 24 24'
          stroke='currentColor'
        >
          <path d='M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9'></path>
        </svg>
        {unreadCount > 0 && (
          <span className='absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full'>
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className='absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg z-50'>
          <div className='p-4 border-b border-gray-200'>
            <div className='flex items-center justify-between'>
              <h3 className='text-lg font-medium text-gray-900'>Notifications</h3>
              <div className='flex space-x-2'>
                <button onClick={markAllAsRead} className='text-sm text-blue-600 hover:text-blue-800'>
                  Mark all as read
                </button>
                <button onClick={clearNotifications} className='text-sm text-gray-600 hover:text-gray-800'>
                  Clear all
                </button>
              </div>
            </div>
            {!permission.granted && (
              <button
                onClick={requestPermission}
                className='mt-2 w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700'
              >
                Enable Notifications
              </button>
            )}
          </div>

          <div className='max-h-96 overflow-y-auto'>
            {notifications.length === 0 ? (
              <div className='p-4 text-center text-gray-500'>No notifications</div>
            ) : (
              <div className='divide-y divide-gray-200'>
                {notifications.map(notification => (
                  <div
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`p-4 cursor-pointer hover:bg-gray-50 ${!notification.read ? 'bg-blue-50' : ''}`}
                  >
                    <div className='flex items-start'>
                      <div className='flex-1 min-w-0'>
                        <p className='text-sm font-medium text-gray-900'>{notification.title}</p>
                        <p className='mt-1 text-sm text-gray-500'>{notification.body}</p>
                        <p className='mt-1 text-xs text-gray-400'>{formatTimestamp(notification.timestamp)}</p>
                      </div>
                      {!notification.read && (
                        <div className='ml-3 flex-shrink-0'>
                          <div className='h-2 w-2 bg-blue-600 rounded-full'></div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
