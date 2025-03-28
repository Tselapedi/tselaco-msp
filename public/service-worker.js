/* eslint-disable no-restricted-globals */

// Cache name
const CACHE_NAME = 'tselaco-msp-v1'

// Assets to cache
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/favicon.ico'
  // Add other static assets here
]

// Install event - cache static assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(STATIC_ASSETS)
    })
  )
})

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(cacheNames.filter(name => name !== CACHE_NAME).map(name => caches.delete(name)))
    })
  )
})

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request)
    })
  )
})

// Push event - handle incoming push notifications
self.addEventListener('push', event => {
  if (!event.data) return

  try {
    const data = event.data.json()
    const options = {
      body: data.body,
      icon: '/icons/icon-192x192.png',
      badge: '/icons/badge-72x72.png',
      vibrate: [200, 100, 200],
      tag: data.tag || 'default',
      data: data.data || {},
      actions: data.actions || []
    }

    event.waitUntil(self.registration.showNotification(data.title, options))
  } catch (error) {
    console.error('Error showing notification:', error)
  }
})

// Notification click event - handle notification clicks
self.addEventListener('notificationclick', event => {
  event.notification.close()

  const urlToOpen = new URL('/rides', self.location.origin).href

  // If we have a specific ride ID, navigate to that ride
  if (event.notification.data?.rideId) {
    urlToOpen = new URL(`/rides/${event.notification.data.rideId}`, self.location.origin).href
  }

  event.waitUntil(
    clients
      .matchAll({
        type: 'window',
        includeUncontrolled: true
      })
      .then(windowClients => {
        // If a window client is already open, focus it
        for (const client of windowClients) {
          if (client.url === urlToOpen) {
            return client.focus()
          }
        }
        // Otherwise open a new window
        return clients.openWindow(urlToOpen)
      })
  )
})

// Sync event - handle background sync
self.addEventListener('sync', event => {
  if (event.tag === 'sync-notifications') {
    event.waitUntil(
      // Implement background sync logic here
      Promise.resolve()
    )
  }
})
