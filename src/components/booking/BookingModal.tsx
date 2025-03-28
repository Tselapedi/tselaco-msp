'use client';

import { useState } from 'react';
import { X, Clock, Car, Users, DollarSign } from 'lucide-react';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  pickupLocation: { lat: number; lng: number; address: string } | null;
  dropoffLocation: { lat: number; lng: number; address: string } | null;
  onConfirm: (bookingDetails: {
    type: 'standard' | 'comfort' | 'xl';
    scheduledTime?: Date;
  }) => void;
}

export default function BookingModal({
  isOpen,
  onClose,
  pickupLocation,
  dropoffLocation,
  onConfirm,
}: BookingModalProps) {
  const [selectedType, setSelectedType] = useState<'standard' | 'comfort' | 'xl'>('standard');
  const [scheduledTime, setScheduledTime] = useState<Date | null>(null);
  const [isScheduled, setIsScheduled] = useState(false);

  if (!isOpen) return null;

  const rideTypes = [
    {
      id: 'standard',
      name: 'Standard',
      description: '4 Seats',
      price: 'R18-22/km',
      icon: <Car className="w-6 h-6" />,
    },
    {
      id: 'comfort',
      name: 'Comfort',
      description: 'Premium Vehicle',
      price: 'R22-28/km',
      icon: <Car className="w-6 h-6" />,
    },
    {
      id: 'xl',
      name: 'XL',
      description: '6+ Seats',
      price: 'R28-35/km',
      icon: <Users className="w-6 h-6" />,
    },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Book Your Ride</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Locations */}
          <div className="space-y-4 mb-6">
            <div className="flex items-center space-x-3">
              <MapPin className="w-5 h-5 text-blue-600" />
              <div>
                <div className="text-sm text-gray-500">Pickup</div>
                <div className="font-medium">{pickupLocation?.address}</div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <MapPin className="w-5 h-5 text-red-600" />
              <div>
                <div className="text-sm text-gray-500">Drop-off</div>
                <div className="font-medium">{dropoffLocation?.address}</div>
              </div>
            </div>
          </div>

          {/* Ride Types */}
          <div className="space-y-3 mb-6">
            {rideTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setSelectedType(type.id as any)}
                className={`w-full p-4 rounded-lg border flex items-center space-x-4 ${
                  selectedType === type.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                <div className="text-blue-600">{type.icon}</div>
                <div className="flex-1 text-left">
                  <div className="font-medium text-gray-900">{type.name}</div>
                  <div className="text-sm text-gray-500">{type.description}</div>
                </div>
                <div className="text-sm font-medium text-gray-900">{type.price}</div>
              </button>
            ))}
          </div>

          {/* Schedule Option */}
          <div className="mb-6">
            <button
              onClick={() => setIsScheduled(!isScheduled)}
              className="w-full p-4 rounded-lg border border-gray-200 hover:border-blue-300 flex items-center space-x-4"
            >
              <Clock className="w-6 h-6 text-blue-600" />
              <div className="flex-1 text-left">
                <div className="font-medium text-gray-900">Schedule for Later</div>
                <div className="text-sm text-gray-500">
                  {isScheduled ? 'Select pickup time' : 'Book for a future time'}
                </div>
              </div>
            </button>
            {isScheduled && (
              <div className="mt-4">
                <input
                  type="datetime-local"
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(e) => setScheduledTime(new Date(e.target.value))}
                />
              </div>
            )}
          </div>

          {/* Estimated Price */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex justify-between items-center">
              <div className="text-gray-600">Estimated Price</div>
              <div className="text-xl font-semibold text-gray-900">R120.00</div>
            </div>
          </div>

          {/* Confirm Button */}
          <button
            onClick={() => onConfirm({
              type: selectedType,
              scheduledTime: scheduledTime || undefined,
            })}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Confirm Booking
          </button>
        </div>
      </div>
    </div>
  );
} 
