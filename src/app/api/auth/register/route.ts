import { NextResponse } from 'next/server'
import { AuthService } from '@/lib/auth/auth.service'
import { z } from 'zod'

const userSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  phoneNumber: z.string().regex(/^\+27[0-9]{9}$/),
  idNumber: z
    .string()
    .length(13)
    .regex(/^[0-9]+$/),
  type: z.literal('user')
})

const driverSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(2),
  middleName: z.string().optional(),
  lastName: z.string().min(2),
  phoneNumber: z.string().regex(/^\+27[0-9]{9}$/),
  idNumber: z
    .string()
    .length(13)
    .regex(/^[0-9]+$/),
  licenseNumber: z.string().min(8),
  pdpNumber: z.string().min(8),
  type: z.literal('driver')
})

export async function POST(request: Request) {
  try {
    const body = await request.json()

    if (body.type === 'user') {
      const data = userSchema.parse(body)
      const result = await AuthService.registerUser(data)
      return NextResponse.json(result)
    } else if (body.type === 'driver') {
      const data = driverSchema.parse(body)
      const result = await AuthService.registerDriver(data)
      return NextResponse.json(result)
    }

    return NextResponse.json({ error: 'Invalid registration type' }, { status: 400 })
  } catch (error) {
    console.error('Registration error:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 })
  }
}
