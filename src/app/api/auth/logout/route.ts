import { NextResponse } from 'next/server';
import { getLogoutUrl } from '@/services/auth';

export async function GET() {
  try {
    const logoutUrl = getLogoutUrl();
    
    // Clear user session
    const response = NextResponse.redirect(logoutUrl);
    response.cookies.delete('user_info');
    
    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.redirect(new URL('/', process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'));
  }
} 
