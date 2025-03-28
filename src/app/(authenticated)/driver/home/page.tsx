'use client';

import { useState } from 'react';
import { Car, MapPin, Clock, DollarSign, Star, Settings } from 'lucide-react';
import Link from 'next/link';

export default function DriverHome() {
  const [isOnline, setIsOnline] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsOnline(!isOnline)}
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  isOnline
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {isOnline ? 'Online' : 'Offline'}
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Driver Dashboard</h1>
            </div>
            <Link 
              href="/driver/settings" 
              className="text-gray-600 hover:text-gray-900"
            >
              <Settings className="w-6 h-6" />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center space-x-3">
              <DollarSign className="w-6 h-6 text-green-600" />
              <div>
                <div className="text-sm text-gray-500">Today's Earnings</div>
                <div className="text-2xl font-bold text-gray-900">R450.00</div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center space-x-3">
              <Car className="w-6 h-6 text-blue-600" />
              <div>
                <div className="text-sm text-gray-500">Completed Rides</div>
                <div className="text-2xl font-bold text-gray-900">12</div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center space-x-3">
              <Star className="w-6 h-6 text-yellow-600" />
              <div>
                <div className="text-sm text-gray-500">Rating</div>
                <div className="text-2xl font-bold text-gray-900">4.8</div>
              </div>
            </div>
          </div>
        </div>

        {/* Current Ride */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Current Ride</h2>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <MapPin className="w-5 h-5 text-blue-600" />
              <div>
                <div className="text-sm text-gray-500">Pickup</div>
                <div className="font-medium">123 Main Street, Cape Town</div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <MapPin className="w-5 h-5 text-red-600" />
              <div>
                <div className="text-sm text-gray-500">Drop-off</div>
                <div className="font-medium">456 Beach Road, Cape Town</div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Clock className="w-5 h-5 text-gray-600" />
              <div>
                <div className="text-sm text-gray-500">Estimated Time</div>
                <div className="font-medium">15 minutes</div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <Car className="w-6 h-6 text-blue-600 mx-auto mb-2" />
            <span className="text-sm text-gray-600">Start Ride</span>
          </button>
          <button className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <DollarSign className="w-6 h-6 text-green-600 mx-auto mb-2" />
            <span className="text-sm text-gray-600">Earnings</span>
          </button>
          <button className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <Clock className="w-6 h-6 text-purple-600 mx-auto mb-2" />
            <span className="text-sm text-gray-600">Schedule</span>
          </button>
          <button className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <Settings className="w-6 h-6 text-gray-600 mx-auto mb-2" />
            <span className="text-sm text-gray-600">Settings</span>
          </button>
        </div>
      </main>
    </div>
  );
} 
