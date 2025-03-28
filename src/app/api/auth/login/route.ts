import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/services/auth';

export async function POST(request: NextRequest) {
  try {
    const credentials = await request.json();
    const { token, user } = await AuthService.login(credentials);

    // Remove sensitive data before sending response
    const { password, verificationCode, ...safeUser } = user;

    return NextResponse.json({
      message: 'Login successful',
      token,
      user: safeUser
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Login failed' },
      { status: 401 }
    );
  }
} 
