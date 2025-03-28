import { NextResponse } from 'next/server'
import { AuthService } from '@/services/auth'
import { z } from 'zod'

// Base schema for fields common to both users and drivers
const baseUserSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  phoneNumber: z.string()
    .regex(/^\+27[0-9]{9}$/, 'Phone number must be in format +27XXXXXXXXX'),
  idNumber: z.string()
    .length(13, 'ID number must be exactly 13 digits')
    .regex(/^[0-9]+$/, 'ID number must contain only numbers')
})

// Additional fields for drivers
const driverSchema = baseUserSchema.extend({
  type: z.literal('driver'),
  middleName: z.string().optional(),
  licenseNumber: z.string()
    .min(8, 'License number must be at least 8 characters')
    .regex(/^[A-Z0-9]+$/, 'License number must contain only uppercase letters and numbers'),
  pdpNumber: z.string()
    .min(8, 'PDP number must be at least 8 characters')
    .regex(/^[A-Z0-9]+$/, 'PDP number must contain only uppercase letters and numbers'),
  licenseExpiryDate: z.string()
    .refine((date) => new Date(date) > new Date(), 'License must not be expired'),
  pdpExpiryDate: z.string()
    .refine((date) => new Date(date) > new Date(), 'PDP must not be expired')
})

// Regular user schema
const userSchema = baseUserSchema.extend({
  type: z.literal('user')
})

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate based on user type
    if (body.type === 'user') {
      const data = userSchema.parse(body)
      const result = await AuthService.signup({
        ...data,
        role: 'user'
      })
      
      // Remove sensitive data before sending response
      const { password, verificationCode, ...safeResult } = result.user
      return NextResponse.json({
        message: 'User registration successful',
        user: safeResult,
        verificationRequired: true
      })
    } else if (body.type === 'driver') {
      const data = driverSchema.parse(body)
      const result = await AuthService.signup({
        ...data,
        role: 'driver'
      })
      
      // Remove sensitive data before sending response
      const { password, verificationCode, ...safeResult } = result.user
      return NextResponse.json({
        message: 'Driver registration successful',
        user: safeResult,
        verificationRequired: true,
        referenceNumber: result.referenceNumber
      })
    }

    return NextResponse.json(
      { error: 'Invalid registration type' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Registration error:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Registration failed' },
      { status: 500 }
    )
  }
} 
