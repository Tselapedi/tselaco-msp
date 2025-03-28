import { useEffect, useState } from 'react'

export interface DriverLocation {
  latitude: number
  longitude: number
  heading: number
  speed: number
  timestamp: string
}

export interface RideStatus {
  status: 'pending' | 'accepted' | 'arrived' | 'in_progress' | 'completed' | 'cancelled'
  estimatedArrival: string | null
  estimatedDuration: number | null
  estimatedDistance: number | null
  driverLocation: DriverLocation | null
}

class TrackingService {
  private socket: WebSocket | null = null
  private rideId: string | null = null
  private statusListeners: ((status: RideStatus) => void)[] = []
  private locationListeners: ((location: DriverLocation) => void)[] = []
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectDelay = 1000 // Start with 1 second delay

  constructor() {
    this.handleWebSocketMessage = this.handleWebSocketMessage.bind(this)
    this.handleWebSocketClose = this.handleWebSocketClose.bind(this)
    this.handleWebSocketError = this.handleWebSocketError.bind(this)
  }

  public startTracking(rideId: string): void {
    if (this.socket?.readyState === WebSocket.OPEN) {
      console.warn('WebSocket connection already exists')
      return
    }

    this.rideId = rideId
    this.connectWebSocket()
  }

  public stopTracking(): void {
    this.rideId = null
    this.statusListeners = []
    this.locationListeners = []

    if (this.socket) {
      this.socket.close()
      this.socket = null
    }
  }

  public onStatusUpdate(callback: (status: RideStatus) => void): () => void {
    this.statusListeners.push(callback)
    return () => {
      this.statusListeners = this.statusListeners.filter(cb => cb !== callback)
    }
  }

  public onLocationUpdate(callback: (location: DriverLocation) => void): () => void {
    this.locationListeners.push(callback)
    return () => {
      this.locationListeners = this.locationListeners.filter(cb => cb !== callback)
    }
  }

  private connectWebSocket(): void {
    try {
      // Replace with your actual WebSocket endpoint
      this.socket = new WebSocket(`${process.env.NEXT_PUBLIC_WS_ENDPOINT}/tracking/${this.rideId}`)

      this.socket.onmessage = this.handleWebSocketMessage
      this.socket.onclose = this.handleWebSocketClose
      this.socket.onerror = this.handleWebSocketError

      this.socket.onopen = () => {
        console.log('WebSocket connection established')
        this.reconnectAttempts = 0
        this.reconnectDelay = 1000
      }
    } catch (error) {
      console.error('Failed to connect to WebSocket:', error)
      this.handleReconnect()
    }
  }

  private handleWebSocketMessage(event: MessageEvent): void {
    try {
      const data = JSON.parse(event.data)

      switch (data.type) {
        case 'status':
          this.statusListeners.forEach(callback => callback(data.payload))
          break
        case 'location':
          this.locationListeners.forEach(callback => callback(data.payload))
          break
        default:
          console.warn('Unknown message type:', data.type)
      }
    } catch (error) {
      console.error('Failed to parse WebSocket message:', error)
    }
  }

  private handleWebSocketClose(event: CloseEvent): void {
    console.log('WebSocket connection closed:', event.code, event.reason)

    if (this.rideId) {
      this.handleReconnect()
    }
  }

  private handleWebSocketError(event: Event): void {
    console.error('WebSocket error:', event)
    this.handleReconnect()
  }

  private handleReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached')
      return
    }

    setTimeout(() => {
      this.reconnectAttempts++
      this.reconnectDelay *= 2 // Exponential backoff
      this.connectWebSocket()
    }, this.reconnectDelay)
  }
}

// Create a singleton instance
const trackingService = new TrackingService()

// React hook for tracking a ride
export function useRideTracking(rideId: string | null) {
  const [status, setStatus] = useState<RideStatus | null>(null)
  const [driverLocation, setDriverLocation] = useState<DriverLocation | null>(null)

  useEffect(() => {
    if (!rideId) return

    trackingService.startTracking(rideId)

    const statusUnsubscribe = trackingService.onStatusUpdate(newStatus => {
      setStatus(newStatus)
      if (newStatus.driverLocation) {
        setDriverLocation(newStatus.driverLocation)
      }
    })

    const locationUnsubscribe = trackingService.onLocationUpdate(newLocation => {
      setDriverLocation(newLocation)
    })

    return () => {
      statusUnsubscribe()
      locationUnsubscribe()
      trackingService.stopTracking()
    }
  }, [rideId])

  return { status, driverLocation }
}

export default trackingService
