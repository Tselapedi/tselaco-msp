'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { DriverApplication, DriverDocument } from '@/types/driver'
import { getDriverApplication, uploadDriverDocument } from '@/services/driver'

interface StatusUpdate {
  status: string
  timestamp: string
  message: string
}

export default function DriverApplicationStatus() {
  const params = useParams()
  const [application, setApplication] = useState<DriverApplication | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedDocument, setSelectedDocument] = useState<DriverDocument | null>(null)
  const [showDocumentModal, setShowDocumentModal] = useState(false)
  const [showContactForm, setShowContactForm] = useState(false)
  const [contactMessage, setContactMessage] = useState('')

  // Mock status updates - in a real app, this would come from the backend
  const statusUpdates: StatusUpdate[] = [
    {
      status: 'submitted',
      timestamp: application?.submittedAt || '',
      message: 'Application submitted successfully'
    },
    ...(application?.driver.documents.map(doc => ({
      status: 'document_uploaded',
      timestamp: doc.uploadedAt,
      message: `${doc.type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')} uploaded`
    })) || []),
    ...(application?.status === 'approved' || application?.status === 'rejected'
      ? [
          {
            status: application.status,
            timestamp: application.processedAt || '',
            message:
              application.status === 'approved'
                ? 'Application approved'
                : `Application rejected: ${application.rejectionReason}`
          }
        ]
      : [])
  ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const data = await getDriverApplication(params.id as string)
        setApplication(data)
      } catch (error) {
        setError('Failed to load application status')
      } finally {
        setIsLoading(false)
      }
    }

    fetchApplication()
  }, [params.id])

  const handleDocumentUpdate = async (type: DriverDocument['type'], file: File) => {
    try {
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('File size must be less than 5MB')
      }

      const document = await uploadDriverDocument(application?.driver.id || '', {
        type,
        url: URL.createObjectURL(file)
      })

      setApplication(prev =>
        prev
          ? {
              ...prev,
              driver: {
                ...prev.driver,
                documents: [...prev.driver.documents.filter(doc => doc.type !== type), document]
              }
            }
          : null
      )
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to upload document')
    }
  }

  const handleContactSupport = async (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would send the message to your support system
    alert('Message sent to support. We will get back to you soon.')
    setContactMessage('')
    setShowContactForm(false)
  }

  if (isLoading) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600'></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className='max-w-4xl mx-auto py-6 sm:px-6 lg:px-8'>
        <div className='px-4 py-6 sm:px-0'>
          <div className='bg-white shadow rounded-lg p-6'>
            <div className='text-center'>
              <h2 className='text-lg font-medium text-gray-900'>Error</h2>
              <p className='mt-2 text-sm text-gray-600'>{error}</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!application) {
    return (
      <div className='max-w-4xl mx-auto py-6 sm:px-6 lg:px-8'>
        <div className='px-4 py-6 sm:px-0'>
          <div className='bg-white shadow rounded-lg p-6'>
            <div className='text-center'>
              <h2 className='text-lg font-medium text-gray-900'>Application Not Found</h2>
              <p className='mt-2 text-sm text-gray-600'>The application you're looking for does not exist.</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='max-w-4xl mx-auto py-6 sm:px-6 lg:px-8'>
      <div className='px-4 py-6 sm:px-0'>
        <div className='bg-white shadow rounded-lg p-6'>
          {/* Status Header */}
          <div className='mb-8'>
            <div className='flex items-center justify-between'>
              <h1 className='text-2xl font-bold text-gray-900'>Application Status</h1>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  application.status === 'approved'
                    ? 'bg-green-100 text-green-800'
                    : application.status === 'rejected'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                }`}
              >
                {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
              </span>
            </div>
            <p className='mt-2 text-sm text-gray-600'>
              Submitted on {new Date(application.submittedAt).toLocaleDateString()}
            </p>
          </div>

          {/* Status Timeline */}
          <div className='mb-8'>
            <h2 className='text-lg font-medium text-gray-900 mb-4'>Application Timeline</h2>
            <div className='flow-root'>
              <ul className='-mb-8'>
                {statusUpdates.map((update, index) => (
                  <li key={index}>
                    <div className='relative pb-8'>
                      {index !== statusUpdates.length - 1 && (
                        <span className='absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200' aria-hidden='true' />
                      )}
                      <div className='relative flex space-x-3'>
                        <div>
                          <span
                            className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${
                              update.status === 'approved'
                                ? 'bg-green-500'
                                : update.status === 'rejected'
                                  ? 'bg-red-500'
                                  : 'bg-blue-500'
                            }`}
                          >
                            <svg className='h-5 w-5 text-white' fill='currentColor' viewBox='0 0 20 20'>
                              <path
                                fillRule='evenodd'
                                d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                                clipRule='evenodd'
                              />
                            </svg>
                          </span>
                        </div>
                        <div className='min-w-0 flex-1 pt-1.5'>
                          <p className='text-sm font-medium text-gray-900'>{update.message}</p>
                          <p className='mt-1 text-sm text-gray-500'>
                            {new Date(update.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Document Status */}
          <div className='mb-8'>
            <h2 className='text-lg font-medium text-gray-900 mb-4'>Document Status</h2>
            <div className='space-y-4'>
              {application.driver.documents.map(document => (
                <div key={document.id} className='flex items-center justify-between p-4 bg-gray-50 rounded-lg'>
                  <div className='flex items-center'>
                    <svg className='h-5 w-5 text-gray-400' fill='currentColor' viewBox='0 0 20 20'>
                      <path
                        fillRule='evenodd'
                        d='M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z'
                        clipRule='evenodd'
                      />
                    </svg>
                    <div className='ml-4'>
                      <p className='text-sm font-medium text-gray-900'>
                        {document.type
                          .split('_')
                          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                          .join(' ')}
                      </p>
                      <p className='text-sm text-gray-500'>
                        Uploaded on {new Date(document.uploadedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className='flex items-center space-x-4'>
                    <button
                      onClick={() => {
                        setSelectedDocument(document)
                        setShowDocumentModal(true)
                      }}
                      className='text-sm font-medium text-blue-600 hover:text-blue-500'
                    >
                      View
                    </button>
                    <label className='cursor-pointer text-sm font-medium text-blue-600 hover:text-blue-500'>
                      Update
                      <input
                        type='file'
                        className='hidden'
                        accept='image/*,.pdf'
                        onChange={e => e.target.files?.[0] && handleDocumentUpdate(document.type, e.target.files[0])}
                      />
                    </label>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        document.status === 'approved'
                          ? 'bg-green-100 text-green-800'
                          : document.status === 'rejected'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {document.status.charAt(0).toUpperCase() + document.status.slice(1)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Support */}
          <div className='border-t border-gray-200 pt-8'>
            <div className='flex justify-between items-center'>
              <h2 className='text-lg font-medium text-gray-900'>Need Help?</h2>
              <button
                onClick={() => setShowContactForm(!showContactForm)}
                className='px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
              >
                Contact Support
              </button>
            </div>

            {showContactForm && (
              <form onSubmit={handleContactSupport} className='mt-6 space-y-4'>
                <div>
                  <label htmlFor='message' className='block text-sm font-medium text-gray-700'>
                    Message
                  </label>
                  <textarea
                    id='message'
                    rows={4}
                    value={contactMessage}
                    onChange={e => setContactMessage(e.target.value)}
                    className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
                    placeholder='How can we help you?'
                    required
                  />
                </div>
                <div className='flex justify-end'>
                  <button
                    type='submit'
                    className='px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                  >
                    Send Message
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Document Preview Modal */}
      {showDocumentModal && selectedDocument && (
        <div className='fixed inset-0 z-10 overflow-y-auto'>
          <div className='flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0'>
            <div className='fixed inset-0 transition-opacity' aria-hidden='true'>
              <div className='absolute inset-0 bg-gray-500 opacity-75'></div>
            </div>
            <div className='inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6'>
              <div>
                <div className='mt-3 text-center sm:mt-5'>
                  <h3 className='text-lg leading-6 font-medium text-gray-900'>
                    {selectedDocument.type
                      .split('_')
                      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                      .join(' ')}
                  </h3>
                  <div className='mt-2'>
                    <img src={selectedDocument.url} alt='Document Preview' className='w-full' />
                  </div>
                </div>
              </div>
              <div className='mt-5 sm:mt-6'>
                <button
                  type='button'
                  onClick={() => setShowDocumentModal(false)}
                  className='inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm'
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
