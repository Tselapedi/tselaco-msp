import { useState, useEffect } from 'react'

export interface NotificationPermission {
  granted: boolean
  token: string | null
}

export interface Notification {
  id: string
  title: string
  body: string
  data?: Record<string, any>
  timestamp: string
  read: boolean
}

class NotificationService {
  private static instance: NotificationService
  private notifications: Notification[] = []
  private listeners: ((notifications: Notification[]) => void)[] = []
  private permissionListeners: ((permission: NotificationPermission) => void)[] = []
  private permission: NotificationPermission = {
    granted: false,
    token: null
  }

  private constructor() {
    this.initializeNotifications()
  }

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService()
    }
    return NotificationService.instance
  }

  private async initializeNotifications() {
    try {
      if ('Notification' in window) {
        const permission = await Notification.requestPermission()
        this.updatePermission({
          granted: permission === 'granted',
          token: null // Token would be obtained from your push notification service
        })
      }
    } catch (error) {
      console.error('Failed to initialize notifications:', error)
    }
  }

  public async requestPermission(): Promise<NotificationPermission> {
    try {
      if ('Notification' in window) {
        const permission = await Notification.requestPermission()
        const token = await this.registerServiceWorker()

        const newPermission = {
          granted: permission === 'granted',
          token
        }

        this.updatePermission(newPermission)
        return newPermission
      }

      return { granted: false, token: null }
    } catch (error) {
      console.error('Failed to request notification permission:', error)
      return { granted: false, token: null }
    }
  }

  private async registerServiceWorker(): Promise<string | null> {
    try {
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.register('/service-worker.js')
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
        })

        // Send the subscription to your backend
        const response = await fetch('/api/notifications/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(subscription)
        })

        const data = await response.json()
        return data.token
      }
      return null
    } catch (error) {
      console.error('Failed to register service worker:', error)
      return null
    }
  }

  public addNotification(notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) {
    const newNotification: Notification = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
      read: false,
      ...notification
    }

    this.notifications = [newNotification, ...this.notifications]
    this.notifyListeners()

    // Show browser notification if permission is granted
    if (this.permission.granted) {
      new Notification(notification.title, {
        body: notification.body,
        data: notification.data
      })
    }
  }

  public markAsRead(notificationId: string) {
    this.notifications = this.notifications.map(notification =>
      notification.id === notificationId ? { ...notification, read: true } : notification
    )
    this.notifyListeners()
  }

  public markAllAsRead() {
    this.notifications = this.notifications.map(notification => ({
      ...notification,
      read: true
    }))
    this.notifyListeners()
  }

  public clearNotifications() {
    this.notifications = []
    this.notifyListeners()
  }

  public getNotifications(): Notification[] {
    return this.notifications
  }

  public onNotificationsChange(callback: (notifications: Notification[]) => void): () => void {
    this.listeners.push(callback)
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback)
    }
  }

  public onPermissionChange(callback: (permission: NotificationPermission) => void): () => void {
    this.permissionListeners.push(callback)
    return () => {
      this.permissionListeners = this.permissionListeners.filter(listener => listener !== callback)
    }
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.notifications))
  }

  private updatePermission(permission: NotificationPermission) {
    this.permission = permission
    this.permissionListeners.forEach(listener => listener(permission))
  }
}

// Create a singleton instance
const notificationService = NotificationService.getInstance()

// React hook for using notifications
export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>(notificationService.getNotifications())
  const [permission, setPermission] = useState<NotificationPermission>({
    granted: false,
    token: null
  })

  useEffect(() => {
    const unsubscribeNotifications = notificationService.onNotificationsChange(setNotifications)
    const unsubscribePermission = notificationService.onPermissionChange(setPermission)

    return () => {
      unsubscribeNotifications()
      unsubscribePermission()
    }
  }, [])

  return {
    notifications,
    permission,
    requestPermission: () => notificationService.requestPermission(),
    markAsRead: (id: string) => notificationService.markAsRead(id),
    markAllAsRead: () => notificationService.markAllAsRead(),
    clearNotifications: () => notificationService.clearNotifications()
  }
}

export default notificationService
