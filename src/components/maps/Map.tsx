'use client';

import { useEffect, useRef, useState } from 'react';
import { MapPin } from 'lucide-react';

interface MapProps {
  onLocationSelect?: (location: { lat: number; lng: number; address: string }) => void;
  initialCenter?: { lat: number; lng: number };
  markers?: Array<{
    position: { lat: number; lng: number };
    type: 'pickup' | 'dropoff';
  }>;
}

export default function Map({ onLocationSelect, initialCenter, markers = [] }: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [searchBox, setSearchBox] = useState<any>(null);
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    // Initialize the map
    const initMap = async () => {
      if (!mapRef.current) return;

      // Load AWS SDK
      const AWS = (window as any).AWS;
      if (!AWS) {
        console.error('AWS SDK not loaded');
        return;
      }

      // Configure AWS
      AWS.config.region = 'af-south-1';
      AWS.config.credentials = new AWS.Credentials({
        accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY!,
      });

      // Initialize the map
      const mapInstance = new AWS.LocationService({
        region: 'af-south-1',
        credentials: AWS.config.credentials,
      });

      // Create a map using MapLibre GL JS
      const maplibregl = (window as any).maplibregl;
      if (!maplibregl) {
        console.error('MapLibre GL JS not loaded');
        return;
      }

      const mapInstance = new maplibregl.Map({
        container: mapRef.current,
        style: 'https://maps.geo.af-south-1.amazonaws.com/maps/v0/maps/style-descriptor',
        center: initialCenter ? [initialCenter.lng, initialCenter.lat] : [18.4241, -33.9249], // Cape Town coordinates
        zoom: 13,
      });

      // Add navigation controls
      mapInstance.addControl(new maplibregl.NavigationControl(), 'top-right');

      // Add click event listener
      mapInstance.on('click', (e: any) => {
        const { lng, lat } = e.lngLat;
        setSelectedLocation({ lat, lng });
        
        // Reverse geocode to get address
        mapInstance.geocode({
          coordinates: [lng, lat],
        }).then((result: any) => {
          if (result.Results && result.Results[0]) {
            onLocationSelect?.({
              lat,
              lng,
              address: result.Results[0].Text,
            });
          }
        });
      });

      setMap(mapInstance);
    };

    initMap();

    return () => {
      if (map) {
        map.remove();
      }
    };
  }, []);

  // Add markers when they change
  useEffect(() => {
    if (!map) return;

    // Remove existing markers
    const markers = document.querySelectorAll('.map-marker');
    markers.forEach(marker => marker.remove());

    // Add new markers
    markers.forEach(({ position, type }) => {
      const marker = document.createElement('div');
      marker.className = 'map-marker';
      marker.style.position = 'absolute';
      marker.style.left = `${position.lng}px`;
      marker.style.top = `${position.lat}px`;
      marker.style.transform = 'translate(-50%, -50%)';
      marker.style.color = type === 'pickup' ? '#3B82F6' : '#EF4444';
      marker.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>`;
      mapRef.current?.appendChild(marker);
    });
  }, [markers, map]);

  return (
    <div className="relative w-full h-[400px] rounded-lg overflow-hidden">
      <div ref={mapRef} className="w-full h-full" />
      <div className="absolute top-4 left-4 right-4">
        <div className="bg-white rounded-lg shadow-lg p-2">
          <input
            type="text"
            placeholder="Search location..."
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => {
              // Implement search functionality
            }}
          />
        </div>
      </div>
    </div>
  );
} 
