import { NextResponse } from 'next/server';
import { handleCallback } from '@/services/auth';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const state = cookies().get('auth_state')?.value;
    const nonce = cookies().get('auth_nonce')?.value;

    if (!state || !nonce) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    const params = Object.fromEntries(searchParams.entries());
    const { userInfo } = await handleCallback(params, state, nonce);

    // Store user info in session
    const response = NextResponse.redirect(new URL('/', request.url));
    response.cookies.set('user_info', JSON.stringify(userInfo), { httpOnly: true });

    // Clear auth state cookies
    response.cookies.delete('auth_state');
    response.cookies.delete('auth_nonce');

    return response;
  } catch (error) {
    console.error('Callback error:', error);
    return NextResponse.redirect(new URL('/', request.url));
  }
} 
