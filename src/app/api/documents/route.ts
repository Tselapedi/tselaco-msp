import { NextResponse } from 'next/server'
import { DriverService } from '@/lib/services/driver.service'
import { z } from 'zod'
import { getToken } from 'next-auth/jwt'

// Maximum file size (5MB)
const MAX_FILE_SIZE = 5 * 1024 * 1024

const documentSchema = z.object({
  type: z.enum([
    // User documents
    'id_document',
    'proof_of_address',
    'profile_photo',
    // Driver specific documents
    'drivers_license',
    'pdp_permit',
    'police_clearance',
    'vehicle_registration',
    'vehicle_insurance',
    'roadworthy_certificate',
    'bank_statement',
    'proof_of_residence'
  ]),
  file: z.object({
    name: z.string(),
    size: z.number().max(MAX_FILE_SIZE, 'File size must be less than 5MB'),
    type: z.string().refine(
      type => ['image/jpeg', 'image/png', 'application/pdf'].includes(type),
      'File must be JPEG, PNG, or PDF'
    ),
    url: z.string().url()
  }),
  expiryDate: z.string().optional(),
  documentNumber: z.string().optional()
})

const documentsSchema = z.array(documentSchema)

export async function POST(request: Request) {
  try {
    const token = await getToken({ req: request })
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const documents = documentsSchema.parse(body)

    // Validate required documents based on user type
    if (token.type === 'driver') {
      const requiredTypes = [
        'drivers_license',
        'pdp_permit',
        'police_clearance',
        'vehicle_registration',
        'vehicle_insurance',
        'roadworthy_certificate'
      ]
      
      const missingDocs = requiredTypes.filter(
        type => !documents.some(doc => doc.type === type)
      )
      
      if (missingDocs.length > 0) {
        return NextResponse.json({
          error: 'Missing required documents',
          missingDocuments: missingDocs
        }, { status: 400 })
      }
    } else {
      const requiredTypes = ['id_document', 'proof_of_address']
      const missingDocs = requiredTypes.filter(
        type => !documents.some(doc => doc.type === type)
      )
      
      if (missingDocs.length > 0) {
        return NextResponse.json({
          error: 'Missing required documents',
          missingDocuments: missingDocs
        }, { status: 400 })
      }
    }

    // Process and store documents
    const result = await DriverService.updateDriverDocuments(token.id as string, documents)
    
    return NextResponse.json({
      message: 'Documents uploaded successfully',
      documents: result
    })
  } catch (error) {
    console.error('Document upload error:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        error: 'Validation failed',
        details: error.errors
      }, { status: 400 })
    }
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Failed to upload documents'
    }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const token = await getToken({ req: request })
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const documents = await DriverService.getDriverDocuments(token.id as string)
    return NextResponse.json({
      documents,
      requiredDocuments: token.type === 'driver' ? [
        'drivers_license',
        'pdp_permit',
        'police_clearance',
        'vehicle_registration',
        'vehicle_insurance',
        'roadworthy_certificate'
      ] : [
        'id_document',
        'proof_of_address'
      ]
    })
  } catch (error) {
    console.error('Get documents error:', error)
    return NextResponse.json({
      error: 'Failed to get documents'
    }, { status: 500 })
  }
} 
