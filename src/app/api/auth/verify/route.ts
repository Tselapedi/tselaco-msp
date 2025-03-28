import { NextRequest, NextResponse } from 'next/server'
import { AuthService } from '@/services/auth'

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    await AuthService.verifyEmail(data)

    return NextResponse.json({
      message: 'Email verified successfully'
    })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Verification failed' },
      { status: 400 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { userId } = await request.json()
    await AuthService.resendVerification(userId)

    return NextResponse.json({
      message: 'Verification code resent successfully'
    })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to resend verification code' },
      { status: 400 }
    )
  }
} 
