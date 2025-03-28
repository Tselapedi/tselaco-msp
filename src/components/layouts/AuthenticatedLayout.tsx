import { ReactNode } from 'react';
import { UserRole } from '@prisma/client';
import MobileNavBar from '../navigation/MobileNavBar';

interface AuthenticatedLayoutProps {
  children: ReactNode;
  userRole: UserRole;
}

export default function AuthenticatedLayout({ children, userRole }: AuthenticatedLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <main className="pb-16">
        {children}
      </main>

      {/* Mobile Navigation */}
      <MobileNavBar userRole={userRole} />
    </div>
  );
} 
