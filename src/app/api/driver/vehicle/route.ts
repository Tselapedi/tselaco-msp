import { NextResponse } from 'next/server'
import { DriverService } from '@/lib/services/driver.service'
import { z } from 'zod'
import { getToken } from 'next-auth/jwt'

const vehicleSchema = z.object({
  make: z.string().min(2),
  model: z.string().min(2),
  year: z.number().int().min(1900),
  color: z.string().min(2),
  licensePlate: z.string().regex(/^GP[A-Z0-9]{6}$/),
  vin: z.string().length(17),
  type: z.enum(['sedan', 'suv', 'van', 'hatchback']),
  mileage: z.number().int().min(0)
})

export async function POST(request: Request) {
  try {
    const token = await getToken({ req: request })
    if (!token || token.type !== 'driver') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const vehicleData = vehicleSchema.parse(body)

    const result = await DriverService.updateVehicleInfo(token.id as string, vehicleData)
    return NextResponse.json(result)
  } catch (error) {
    console.error('Vehicle update error:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'Failed to update vehicle information' }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const token = await getToken({ req: request })
    if (!token || token.type !== 'driver') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const vehicle = await DriverService.getDriverVehicle(token.id as string)
    return NextResponse.json(vehicle)
  } catch (error) {
    console.error('Get vehicle error:', error)
    return NextResponse.json({ error: 'Failed to get vehicle information' }, { status: 500 })
  }
}
