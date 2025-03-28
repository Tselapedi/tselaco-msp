import { Metadata } from 'next';
import RegistrationForm, { RegistrationFormData } from '@/components/auth/RegistrationForm';
import Link from 'next/link';
import { registerUser } from '@/app/actions/auth';

export const metadata: Metadata = {
  title: 'Driver Registration - RideConnect SA',
  description: 'Register as a driver on RideConnect SA',
};

export default function DriverRegistration() {
  const handleSubmit = async (data: RegistrationFormData) => {
    'use server';
    try {
      await registerUser({
        ...data,
        role: 'DRIVER',
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
          Register as a Driver
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link href="/auth/login" className="font-medium text-green-600 hover:text-green-500">
            Sign in
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <RegistrationForm userType="DRIVER" onSubmit={handleSubmit} />
          
          <div className="mt-6">
            <div className="rounded-md bg-yellow-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">
                    Important Notice
                  </h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <p>
                      After registration, you'll need to:
                    </p>
                    <ul className="list-disc pl-5 mt-1">
                      <li>Upload your driver's license</li>
                      <li>Provide vehicle registration documents</li>
                      <li>Complete a background check</li>
                      <li>Pass a vehicle inspection</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            
            <p className="mt-6 text-center text-sm text-gray-500">
              By registering, you agree to our{' '}
              <Link href="/terms" className="font-medium text-green-600 hover:text-green-500">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="font-medium text-green-600 hover:text-green-500">
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 
