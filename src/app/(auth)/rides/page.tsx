'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Ride, getRides } from '@/services/rides';

export default function Rides() {
  const router = useRouter();
  const [rides, setRides] = useState<Ride[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'completed' | 'in_progress' | 'cancelled'>('all');

  useEffect(() => {
    const fetchRides = async () => {
      try {
        const data = await getRides();
        setRides(data);
      } catch (error) {
        console.error('Error fetching rides:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRides();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-ZA', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: Ride['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredRides = filter === 'all'
    ? rides
    : rides.filter(ride => ride.status === filter);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900">My Rides</h1>
        <p className="mt-2 text-gray-600">View your ride history and current rides</p>
      </div>

      {/* Filters */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex space-x-4">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg ${
              filter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Rides
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-4 py-2 rounded-lg ${
              filter === 'completed'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Completed
          </button>
          <button
            onClick={() => setFilter('in_progress')}
            className={`px-4 py-2 rounded-lg ${
              filter === 'in_progress'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            In Progress
          </button>
          <button
            onClick={() => setFilter('cancelled')}
            className={`px-4 py-2 rounded-lg ${
              filter === 'cancelled'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Cancelled
          </button>
        </div>
      </div>

      {/* Rides List */}
      <div className="bg-white shadow rounded-lg divide-y">
        {filteredRides.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No rides found. Book your first ride!
          </div>
        ) : (
          filteredRides.map((ride) => (
            <div key={ride.id} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{formatDate(ride.date)}</p>
                  <div className="mt-1">
                    <p className="text-sm font-medium text-gray-900">
                      {ride.pickup} → {ride.dropoff}
                    </p>
                    <div className="mt-1 flex items-center space-x-2">
                      <p className="text-sm text-gray-500">{ride.driver.name}</p>
                      <span className="text-sm text-gray-300">•</span>
                      <p className="text-sm text-gray-500">{ride.driver.vehicle}</p>
                      <span className="text-sm text-gray-300">•</span>
                      <p className="text-sm text-gray-500">★ {ride.driver.rating}</p>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(ride.status)}`}>
                    {ride.status.replace('_', ' ')}
                  </span>
                  {ride.price > 0 && (
                    <p className="mt-2 text-lg font-semibold text-gray-900">
                      R{ride.price}
                    </p>
                  )}
                </div>
              </div>
              {ride.status === 'completed' && (
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => router.push(`/rides/${ride.id}/receipt`)}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    View Receipt
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
} 
