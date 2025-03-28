'use client';

import { useState } from 'react';
import { MapPin, Clock, Car, Star, DollarSign } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Activity - RideConnect SA',
  description: 'View your ride history and activity',
};

export default function PassengerActivity() {
  const [activeTab, setActiveTab] = useState('all');

  const rides = [
    {
      id: 1,
      date: '2024-03-26',
      time: '14:30',
      pickup: '123 Main Street, Cape Town',
      dropoff: '456 Beach Road, Cape Town',
      driver: 'John Doe',
      rating: 5,
      fare: 'R120.00',
      status: 'completed',
    },
    {
      id: 2,
      date: '2024-03-25',
      time: '09:15',
      pickup: '789 Shopping Mall, Cape Town',
      dropoff: '321 Office Park, Cape Town',
      driver: 'Jane Smith',
      rating: 4,
      fare: 'R85.00',
      status: 'completed',
    },
    {
      id: 3,
      date: '2024-03-24',
      time: '18:45',
      pickup: '555 Restaurant, Cape Town',
      dropoff: '777 Home Street, Cape Town',
      driver: 'Mike Johnson',
      rating: 5,
      fare: 'R95.00',
      status: 'completed',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Ride History</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {/* Tabs */}
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              activeTab === 'all'
                ? 'bg-blue-100 text-blue-800'
                : 'bg-gray-100 text-gray-800'
            }`}
          >
            All Rides
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              activeTab === 'completed'
                ? 'bg-blue-100 text-blue-800'
                : 'bg-gray-100 text-gray-800'
            }`}
          >
            Completed
          </button>
          <button
            onClick={() => setActiveTab('cancelled')}
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              activeTab === 'cancelled'
                ? 'bg-blue-100 text-blue-800'
                : 'bg-gray-100 text-gray-800'
            }`}
          >
            Cancelled
          </button>
        </div>

        {/* Ride List */}
        <div className="space-y-4">
          {rides.map((ride) => (
            <div
              key={ride.id}
              className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="text-sm text-gray-500">
                    {new Date(ride.date).toLocaleDateString('en-ZA', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </div>
                  <div className="text-sm text-gray-500">{ride.time}</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-gray-900">{ride.fare}</div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Star className="w-4 h-4 text-yellow-400 mr-1" />
                    {ride.rating}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  <div>
                    <div className="text-sm text-gray-500">Pickup</div>
                    <div className="font-medium">{ride.pickup}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-red-600" />
                  <div>
                    <div className="text-sm text-gray-500">Drop-off</div>
                    <div className="font-medium">{ride.dropoff}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Car className="w-5 h-5 text-gray-600" />
                  <div>
                    <div className="text-sm text-gray-500">Driver</div>
                    <div className="font-medium">{ride.driver}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
} 
