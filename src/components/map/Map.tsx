'use client'

import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Location, searchPlaces } from '@/services/location'
import { Loader } from '@aws-amplify/ui-react'

// Fix for default marker icons in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png'
})

interface MapProps {
  onLocationSelect?: (location: Location) => void
  onRouteCalculate?: (route: any) => void
  showSearch?: boolean
  initialCenter?: Location
}

export default function Map({
  onLocationSelect,
  onRouteCalculate,
  showSearch = false,
  initialCenter = { lat: -26.2041, lng: 28.0473 } // Johannesburg coordinates
}: MapProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<L.Map | null>(null)
  const marker = useRef<L.Marker | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Location[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null)

  useEffect(() => {
    if (!mapContainer.current) return

    map.current = L.map(mapContainer.current).setView([initialCenter.lat, initialCenter.lng], 12)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map.current)

    // Add click handler
    map.current.on('click', (e: L.LeafletMouseEvent) => {
      const location: Location = {
        lat: e.latlng.lat,
        lng: e.latlng.lng,
        name: 'Selected Location'
      }

      setSelectedLocation(location)
      onLocationSelect?.(location)
    })

    return () => {
      map.current?.remove()
    }
  }, [initialCenter])

  useEffect(() => {
    if (!map.current || !selectedLocation) return

    // Remove existing marker
    if (marker.current) {
      marker.current.remove()
    }

    // Add new marker
    marker.current = L.marker([selectedLocation.lat, selectedLocation.lng]).addTo(map.current)

    // Fly to location
    map.current.flyTo([selectedLocation.lat, selectedLocation.lng], 14)
  }, [selectedLocation])

  const handleSearch = async (query: string) => {
    setSearchQuery(query)
    if (!query.trim()) {
      setSearchResults([])
      return
    }

    setIsSearching(true)
    try {
      const results = await searchPlaces(query)
      setSearchResults(results)
    } catch (error) {
      console.error('Error searching places:', error)
    } finally {
      setIsSearching(false)
    }
  }

  const handleLocationSelect = (location: Location) => {
    setSelectedLocation(location)
    setSearchResults([])
    setSearchQuery('')
    onLocationSelect?.(location)
  }

  return (
    <div className='relative h-full'>
      {showSearch && (
        <div className='absolute top-4 left-4 right-4 z-10'>
          <div className='relative'>
            <input
              type='text'
              value={searchQuery}
              onChange={e => handleSearch(e.target.value)}
              placeholder='Search for a location...'
              className='w-full px-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
            />
            {isSearching && (
              <div className='absolute right-3 top-2'>
                <Loader size='small' />
              </div>
            )}
          </div>
          {searchResults.length > 0 && (
            <div className='mt-2 bg-white rounded-lg shadow-lg max-h-60 overflow-y-auto'>
              {searchResults.map((location, index) => (
                <button
                  key={index}
                  onClick={() => handleLocationSelect(location)}
                  className='w-full px-4 py-2 text-left hover:bg-gray-50 focus:outline-none'
                >
                  <p className='text-sm font-medium text-gray-900'>{location.name}</p>
                  <p className='text-xs text-gray-500'>
                    {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
      <div ref={mapContainer} className='w-full h-full rounded-lg' />
    </div>
  )
}
