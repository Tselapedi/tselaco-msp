import { NextResponse } from 'next/server'
import { DriverService } from '@/lib/services/driver.service'
import { z } from 'zod'
import { getToken } from 'next-auth/jwt'

const documentSchema = z.object({
  type: z.enum([
    'id_document',
    'drivers_license',
    'pdp_permit',
    'police_clearance',
    'vehicle_registration',
    'vehicle_insurance',
    'roadworthy_certificate'
  ]),
  url: z.string().url()
})

const documentsSchema = z.array(documentSchema)

export async function POST(request: Request) {
  try {
    const token = await getToken({ req: request })
    if (!token || token.type !== 'driver') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const documents = documentsSchema.parse(body)

    const result = await DriverService.updateDriverDocuments(token.id as string, documents)
    return NextResponse.json(result)
  } catch (error) {
    console.error('Document upload error:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'Failed to upload documents' }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const token = await getToken({ req: request })
    if (!token || token.type !== 'driver') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const documents = await DriverService.getDriverDocuments(token.id as string)
    return NextResponse.json(documents)
  } catch (error) {
    console.error('Get documents error:', error)
    return NextResponse.json({ error: 'Failed to get documents' }, { status: 500 })
  }
}
