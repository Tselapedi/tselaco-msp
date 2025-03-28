import { Metadata } from 'next';
import RegistrationForm, { RegistrationFormData } from '@/components/auth/RegistrationForm';
import Link from 'next/link';
import { registerUser } from '@/app/actions/auth';

export const metadata: Metadata = {
  title: 'Passenger Registration - RideConnect SA',
  description: 'Register as a passenger on RideConnect SA',
};

export default function PassengerRegistration() {
  const handleSubmit = async (data: RegistrationFormData) => {
    'use server';
    try {
      await registerUser({
        ...data,
        role: 'PASSENGER',
      });
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Register as a Passenger
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link href="/auth/login" className="font-medium text-blue-600 hover:text-blue-500">
            Sign in
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <RegistrationForm userType="PASSENGER" onSubmit={handleSubmit} />
          
          <div className="mt-6">
            <p className="text-center text-sm text-gray-500">
              By registering, you agree to our{' '}
              <Link href="/terms" className="font-medium text-blue-600 hover:text-blue-500">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="font-medium text-blue-600 hover:text-blue-500">
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 
