import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { VALIDATION } from '@/config/aws-config';
import { UserRole } from '@prisma/client';

interface RegistrationFormProps {
  userType: 'PASSENGER' | 'DRIVER';
  onSubmit: (data: RegistrationFormData) => Promise<void>;
}

export interface RegistrationFormData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  idNumber: string;
  dateOfBirth: string;
  role: UserRole;
  // Driver specific fields
  vehicleType?: string;
  vehicleMake?: string;
  vehicleModel?: string;
  vehicleYear?: number;
  licensePlate?: string;
}

export default function RegistrationForm({ userType, onSubmit }: RegistrationFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegistrationFormData>();

  const onSubmitForm = async (data: RegistrationFormData) => {
    try {
      setIsLoading(true);
      await onSubmit({
        ...data,
        role: userType,
      });
    } catch (error) {
      console.error('Registration error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
            First Name
          </label>
          <input
            type="text"
            id="firstName"
            {...register('firstName', { required: 'First name is required' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.firstName && (
            <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
            Last Name
          </label>
          <input
            type="text"
            id="lastName"
            {...register('lastName', { required: 'Last name is required' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.lastName && (
            <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          type="email"
          id="email"
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Invalid email address',
            },
          })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          type="password"
          id="password"
          {...register('password', {
            required: 'Password is required',
            minLength: {
              value: VALIDATION.password.minLength,
              message: VALIDATION.password.message,
            },
          })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        {errors.password && (
          <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
          Phone Number
        </label>
        <input
          type="tel"
          id="phoneNumber"
          {...register('phoneNumber', {
            required: 'Phone number is required',
            pattern: {
              value: VALIDATION.phoneNumber.pattern,
              message: VALIDATION.phoneNumber.message,
            },
          })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        {errors.phoneNumber && (
          <p className="mt-1 text-sm text-red-600">{errors.phoneNumber.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="idNumber" className="block text-sm font-medium text-gray-700">
          ID Number
        </label>
        <input
          type="text"
          id="idNumber"
          {...register('idNumber', {
            required: 'ID number is required',
            pattern: {
              value: VALIDATION.idNumber.pattern,
              message: VALIDATION.idNumber.message,
            },
          })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        {errors.idNumber && (
          <p className="mt-1 text-sm text-red-600">{errors.idNumber.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700">
          Date of Birth
        </label>
        <input
          type="date"
          id="dateOfBirth"
          {...register('dateOfBirth', { required: 'Date of birth is required' })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        {errors.dateOfBirth && (
          <p className="mt-1 text-sm text-red-600">{errors.dateOfBirth.message}</p>
        )}
      </div>

      {userType === 'DRIVER' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="vehicleType" className="block text-sm font-medium text-gray-700">
                Vehicle Type
              </label>
              <select
                id="vehicleType"
                {...register('vehicleType', { required: 'Vehicle type is required' })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Select vehicle type</option>
                <option value="SEDAN">Sedan</option>
                <option value="SUV">SUV</option>
                <option value="VAN">Van</option>
              </select>
              {errors.vehicleType && (
                <p className="mt-1 text-sm text-red-600">{errors.vehicleType.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="vehicleMake" className="block text-sm font-medium text-gray-700">
                Vehicle Make
              </label>
              <input
                type="text"
                id="vehicleMake"
                {...register('vehicleMake', { required: 'Vehicle make is required' })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              {errors.vehicleMake && (
                <p className="mt-1 text-sm text-red-600">{errors.vehicleMake.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="vehicleModel" className="block text-sm font-medium text-gray-700">
                Vehicle Model
              </label>
              <input
                type="text"
                id="vehicleModel"
                {...register('vehicleModel', { required: 'Vehicle model is required' })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              {errors.vehicleModel && (
                <p className="mt-1 text-sm text-red-600">{errors.vehicleModel.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="vehicleYear" className="block text-sm font-medium text-gray-700">
                Vehicle Year
              </label>
              <input
                type="number"
                id="vehicleYear"
                {...register('vehicleYear', {
                  required: 'Vehicle year is required',
                  min: {
                    value: 2015,
                    message: 'Vehicle must be 2015 or newer',
                  },
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              {errors.vehicleYear && (
                <p className="mt-1 text-sm text-red-600">{errors.vehicleYear.message}</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="licensePlate" className="block text-sm font-medium text-gray-700">
              License Plate
            </label>
            <input
              type="text"
              id="licensePlate"
              {...register('licensePlate', { required: 'License plate is required' })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.licensePlate && (
              <p className="mt-1 text-sm text-red-600">{errors.licensePlate.message}</p>
            )}
          </div>
        </>
      )}

      <div>
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
            userType === 'DRIVER' ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'
          } focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            userType === 'DRIVER' ? 'focus:ring-green-500' : 'focus:ring-blue-500'
          } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isLoading ? 'Registering...' : 'Register'}
        </button>
      </div>
    </form>
  );
} 
