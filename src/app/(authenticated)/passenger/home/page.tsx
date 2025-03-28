'use client';

import { useState } from 'react';
import { MapPin, Clock, Car, Star, History } from 'lucide-react';
import Link from 'next/link';
import Map from '@/components/maps/Map';
import BookingModal from '@/components/booking/BookingModal';

interface Location {
  lat: number;
  lng: number;
  address: string;
}

export default function PassengerHome() {
  const [pickupLocation, setPickupLocation] = useState<Location | null>(null);
  const [dropoffLocation, setDropoffLocation] = useState<Location | null>(null);
  const [isBooking, setIsBooking] = useState(false);

  const handleLocationSelect = (location: Location, type: 'pickup' | 'dropoff') => {
    if (type === 'pickup') {
      setPickupLocation(location);
    } else {
      setDropoffLocation(location);
    }
  };

  const handleBookingConfirm = async (bookingDetails: {
    type: 'standard' | 'comfort' | 'xl';
    scheduledTime?: Date;
  }) => {
    // TODO: Implement booking confirmation logic
    console.log('Booking confirmed:', bookingDetails);
    setIsBooking(false);
  };

  const markers = [
    ...(pickupLocation ? [{ position: pickupLocation, type: 'pickup' as const }] : []),
    ...(dropoffLocation ? [{ position: dropoffLocation, type: 'dropoff' as const }] : []),
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Book a Ride</h1>
            <Link 
              href="/passenger/activity" 
              className="text-blue-600 hover:text-blue-700"
            >
              <History className="w-6 h-6" />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {/* Map */}
        <div className="mb-6">
          <Map
            onLocationSelect={(location) => {
              if (!pickupLocation) {
                handleLocationSelect(location, 'pickup');
              } else if (!dropoffLocation) {
                handleLocationSelect(location, 'dropoff');
              }
            }}
            markers={markers}
          />
        </div>

        {/* Location Input */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <MapPin className="w-5 h-5 text-blue-600" />
              <input
                type="text"
                placeholder="Pickup Location"
                value={pickupLocation?.address || ''}
                readOnly
                className="flex-1 p-2 border rounded-lg bg-gray-50"
              />
            </div>
            <div className="flex items-center space-x-3">
              <MapPin className="w-5 h-5 text-red-600" />
              <input
                type="text"
                placeholder="Drop-off Location"
                value={dropoffLocation?.address || ''}
                readOnly
                className="flex-1 p-2 border rounded-lg bg-gray-50"
              />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <button 
            className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            onClick={() => setIsBooking(true)}
            disabled={!pickupLocation || !dropoffLocation}
          >
            <Clock className="w-6 h-6 text-blue-600 mx-auto mb-2" />
            <span className="text-sm text-gray-600">Schedule Ride</span>
          </button>
          <button 
            className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            onClick={() => setIsBooking(true)}
            disabled={!pickupLocation || !dropoffLocation}
          >
            <Car className="w-6 h-6 text-blue-600 mx-auto mb-2" />
            <span className="text-sm text-gray-600">Ride Now</span>
          </button>
          <button className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <Star className="w-6 h-6 text-blue-600 mx-auto mb-2" />
            <span className="text-sm text-gray-600">Saved Places</span>
          </button>
          <button className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <History className="w-6 h-6 text-blue-600 mx-auto mb-2" />
            <span className="text-sm text-gray-600">Recent Rides</span>
          </button>
        </div>

        {/* Recent Destinations */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Destinations</h2>
          <div className="space-y-3">
            {[
              { name: 'Work', address: '123 Business Street, Cape Town' },
              { name: 'Home', address: '456 Residential Ave, Cape Town' },
              { name: 'Gym', address: '789 Fitness Road, Cape Town' },
            ].map((destination, index) => (
              <button
                key={index}
                className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors"
                onClick={() => {
                  // TODO: Implement geocoding for saved locations
                  setDropoffLocation({
                    lat: 0,
                    lng: 0,
                    address: destination.address,
                  });
                }}
              >
                <div className="font-medium text-gray-900">{destination.name}</div>
                <div className="text-sm text-gray-500">{destination.address}</div>
              </button>
            ))}
          </div>
        </div>
      </main>

      {/* Booking Modal */}
      <BookingModal
        isOpen={isBooking}
        onClose={() => setIsBooking(false)}
        pickupLocation={pickupLocation}
        dropoffLocation={dropoffLocation}
        onConfirm={handleBookingConfirm}
      />
    </div>
  );
} 
