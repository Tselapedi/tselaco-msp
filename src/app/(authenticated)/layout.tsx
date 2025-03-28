import { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import MobileNavBar from '@/components/navigation/MobileNavBar';

// This is a temporary mock of authentication - we'll replace it with real auth later
const mockAuth = {
  isAuthenticated: true,
  userRole: 'PASSENGER' as const, // or 'DRIVER'
};

export default function AuthenticatedLayout({
  children,
}: {
  children: ReactNode;
}) {
  // Check if user is authenticated
  if (!mockAuth.isAuthenticated) {
    redirect('/auth/login');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <main className="pb-16">
        {children}
      </main>

      {/* Mobile Navigation */}
      <MobileNavBar userRole={mockAuth.userRole} />
    </div>
  );
} 
