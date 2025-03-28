'use server';

import { AuthService } from '@/lib/auth';
import { RegistrationFormData } from '@/components/auth/RegistrationForm';
import { redirect } from 'next/navigation';

export async function registerUser(data: RegistrationFormData) {
  try {
    const result = await AuthService.registerUser(data);
    
    if (result.success) {
      // Redirect to coming soon page after successful registration
      redirect('/coming-soon');
    }
    
    return result;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
}

export async function loginUser(email: string, password: string) {
  try {
    const result = await AuthService.login(email, password);
    
    if (result.success) {
      // Redirect based on user role
      const role = result.user?.role;
      if (role === 'DRIVER') {
        redirect('/driver/dashboard');
      } else if (role === 'PASSENGER') {
        redirect('/passenger/dashboard');
      } else if (role === 'ADMIN') {
        redirect('/admin/dashboard');
      }
    }
    
    return result;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}

export async function verifyEmail(email: string, code: string) {
  try {
    const result = await AuthService.verifyEmail(email, code);
    return result;
  } catch (error) {
    console.error('Email verification error:', error);
    throw error;
  }
} 
