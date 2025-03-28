'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Driver, Vehicle, DriverDocument, LicenseType, VehicleType, Province } from '@/types/driver'
import { submitDriverApplication, uploadDriverDocument } from '@/services/driver'

type Step = 'personal' | 'documents' | 'vehicle' | 'review'

export default function DriverRegistration() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState<Step>('personal')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [driverData, setDriverData] = useState<Partial<Driver>>({
    firstName: '',
    middleName: '',
    lastName: '',
    idNumber: '',
    dateOfBirth: '',
    physicalAddress: {
      street: '',
      suburb: '',
      city: '',
      province: 'Gauteng',
      postalCode: ''
    },
    bankingDetails: {
      bankName: '',
      accountNumber: '',
      accountHolder: '',
      branchCode: ''
    },
    phoneNumber: '',
    licenseType: 'B',
    licenseNumber: '',
    pdpNumber: '',
    documents: []
  })

  const [vehicleData, setVehicleData] = useState<Partial<Vehicle>>({
    make: '',
    model: '',
    type: 'Sedan',
    color: '',
    year: new Date().getFullYear(),
    licensePlate: '',
    vin: '',
    mileage: 0
  })

  const handleSubmit = async () => {
    setIsSubmitting(true)
    setError(null)

    try {
      const application = await submitDriverApplication(
        driverData as Omit<Driver, 'id' | 'userId' | 'status' | 'createdAt' | 'updatedAt'>,
        vehicleData as Omit<Vehicle, 'id' | 'driverId' | 'status' | 'createdAt' | 'updatedAt'>
      )
      router.push(`/driver/status/${application.id}`)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to submit application')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className='max-w-4xl mx-auto py-6 sm:px-6 lg:px-8'>
      <div className='px-4 py-6 sm:px-0'>
        <div className='bg-white shadow rounded-lg p-6'>
          <h1 className='text-2xl font-bold text-gray-900 mb-8'>Driver Registration</h1>

          {/* Progress Steps */}
          <div className='mb-8'>
            <nav aria-label='Progress'>
              <ol className='flex items-center space-x-4'>
                {['personal', 'documents', 'vehicle', 'review'].map((step, index) => (
                  <li key={step} className='flex items-center'>
                    <button
                      onClick={() => setCurrentStep(step as Step)}
                      className={`relative flex items-center justify-center w-8 h-8 rounded-full ${
                        currentStep === step ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500 hover:bg-gray-300'
                      }`}
                    >
                      {index + 1}
                    </button>
                    {index < 3 && (
                      <div className={`h-0.5 w-8 ${currentStep === step ? 'bg-blue-600' : 'bg-gray-200'}`} />
                    )}
                  </li>
                ))}
              </ol>
            </nav>
          </div>

          {/* Form Content */}
          <div className='space-y-6'>
            {currentStep === 'personal' && (
              <div>
                <h2 className='text-lg font-medium text-gray-900 mb-4'>Personal Information</h2>
                <div className='grid grid-cols-1 gap-6 sm:grid-cols-2'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700'>First Name</label>
                    <input
                      type='text'
                      value={driverData.firstName}
                      onChange={e => setDriverData(prev => ({ ...prev, firstName: e.target.value }))}
                      className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
                      required
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700'>Middle Name</label>
                    <input
                      type='text'
                      value={driverData.middleName}
                      onChange={e => setDriverData(prev => ({ ...prev, middleName: e.target.value }))}
                      className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700'>Last Name</label>
                    <input
                      type='text'
                      value={driverData.lastName}
                      onChange={e => setDriverData(prev => ({ ...prev, lastName: e.target.value }))}
                      className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
                      required
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700'>ID Number</label>
                    <input
                      type='text'
                      value={driverData.idNumber}
                      onChange={e => {
                        const value = e.target.value.replace(/\D/g, '').slice(0, 13)
                        setDriverData(prev => ({ ...prev, idNumber: value }))
                      }}
                      pattern='[0-9]{13}'
                      maxLength={13}
                      className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
                      required
                    />
                    {driverData.idNumber && driverData.idNumber.length !== 13 && (
                      <p className='mt-1 text-sm text-red-600'>ID number must be 13 digits</p>
                    )}
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700'>Date of Birth</label>
                    <input
                      type='date'
                      value={driverData.dateOfBirth}
                      onChange={e => setDriverData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                      max={new Date(Date.now() - 18 * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                      className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
                      required
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700'>Phone Number</label>
                    <input
                      type='tel'
                      value={driverData.phoneNumber}
                      onChange={e => {
                        const value = e.target.value.replace(/\D/g, '')
                        setDriverData(prev => ({ ...prev, phoneNumber: value }))
                      }}
                      pattern='[0-9]{10}'
                      maxLength={10}
                      placeholder='0123456789'
                      className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
                      required
                    />
                    {driverData.phoneNumber && driverData.phoneNumber.length !== 10 && (
                      <p className='mt-1 text-sm text-red-600'>Phone number must be 10 digits</p>
                    )}
                  </div>
                </div>

                <h3 className='text-lg font-medium text-gray-900 mt-8 mb-4'>Physical Address</h3>
                <div className='grid grid-cols-1 gap-6 sm:grid-cols-2'>
                  <div className='sm:col-span-2'>
                    <label className='block text-sm font-medium text-gray-700'>Street Address</label>
                    <input
                      type='text'
                      value={driverData.physicalAddress?.street}
                      onChange={e => setDriverData(prev => ({
                        ...prev,
                        physicalAddress: { ...prev.physicalAddress!, street: e.target.value }
                      }))}
                      className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
                      required
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700'>Suburb</label>
                    <input
                      type='text'
                      value={driverData.physicalAddress?.suburb}
                      onChange={e => setDriverData(prev => ({
                        ...prev,
                        physicalAddress: { ...prev.physicalAddress!, suburb: e.target.value }
                      }))}
                      className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
                      required
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700'>City</label>
                    <input
                      type='text'
                      value={driverData.physicalAddress?.city}
                      onChange={e => setDriverData(prev => ({
                        ...prev,
                        physicalAddress: { ...prev.physicalAddress!, city: e.target.value }
                      }))}
                      className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
                      required
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700'>Province</label>
                    <select
                      value={driverData.physicalAddress?.province}
                      onChange={e => setDriverData(prev => ({
                        ...prev,
                        physicalAddress: { ...prev.physicalAddress!, province: e.target.value as Province }
                      }))}
                      className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
                      required
                    >
                      {Object.values(Province).map(province => (
                        <option key={province} value={province}>
                          {province}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700'>Postal Code</label>
                    <input
                      type='text'
                      value={driverData.physicalAddress?.postalCode}
                      onChange={e => {
                        const value = e.target.value.replace(/\D/g, '').slice(0, 4)
                        setDriverData(prev => ({
                          ...prev,
                          physicalAddress: { ...prev.physicalAddress!, postalCode: value }
                        }))
                      }}
                      pattern='[0-9]{4}'
                      maxLength={4}
                      className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
                      required
                    />
                  </div>
                </div>

                <h3 className='text-lg font-medium text-gray-900 mt-8 mb-4'>Banking Details</h3>
                <div className='grid grid-cols-1 gap-6 sm:grid-cols-2'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700'>Bank Name</label>
                    <input
                      type='text'
                      value={driverData.bankingDetails?.bankName}
                      onChange={e => setDriverData(prev => ({
                        ...prev,
                        bankingDetails: { ...prev.bankingDetails!, bankName: e.target.value }
                      }))}
                      className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
                      required
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700'>Account Number</label>
                    <input
                      type='text'
                      value={driverData.bankingDetails?.accountNumber}
                      onChange={e => {
                        const value = e.target.value.replace(/\D/g, '')
                        setDriverData(prev => ({
                          ...prev,
                          bankingDetails: { ...prev.bankingDetails!, accountNumber: value }
                        }))
                      }}
                      className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
                      required
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700'>Account Holder</label>
                    <input
                      type='text'
                      value={driverData.bankingDetails?.accountHolder}
                      onChange={e => setDriverData(prev => ({
                        ...prev,
                        bankingDetails: { ...prev.bankingDetails!, accountHolder: e.target.value }
                      }))}
                      className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
                      required
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700'>Branch Code</label>
                    <input
                      type='text'
                      value={driverData.bankingDetails?.branchCode}
                      onChange={e => {
                        const value = e.target.value.replace(/\D/g, '').slice(0, 6)
                        setDriverData(prev => ({
                          ...prev,
                          bankingDetails: { ...prev.bankingDetails!, branchCode: value }
                        }))
                      }}
                      pattern='[0-9]{6}'
                      maxLength={6}
                      className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {currentStep === 'documents' && (
              <div>
                <h2 className='text-lg font-medium text-gray-900 mb-4'>Required Documents</h2>
                <div className='space-y-4'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700'>ID Document</label>
                    <input
                      type='file'
                      accept='image/*,.pdf'
                      onChange={e => {
                        if (e.target.files?.[0]) {
                          const file = e.target.files[0]
                          if (file.size > 5 * 1024 * 1024) {
                            setError('File size must be less than 5MB')
                            return
                          }
                          uploadDriverDocument('temp-id', {
                            type: 'id',
                            url: URL.createObjectURL(file)
                          })
                        }
                      }}
                      className='mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100'
                      required
                    />
                    <p className='mt-1 text-xs text-gray-500'>Upload a clear photo or scan of your ID document (max 5MB)</p>
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-700'>Driver's License</label>
                    <input
                      type='file'
                      accept='image/*,.pdf'
                      onChange={e => {
                        if (e.target.files?.[0]) {
                          const file = e.target.files[0]
                          if (file.size > 5 * 1024 * 1024) {
                            setError('File size must be less than 5MB')
                            return
                          }
                          uploadDriverDocument('temp-id', {
                            type: 'license',
                            url: URL.createObjectURL(file)
                          })
                        }
                      }}
                      className='mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100'
                      required
                    />
                    <p className='mt-1 text-xs text-gray-500'>Upload both sides of your driver's license (max 5MB)</p>
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-700'>Professional Driver's Permit (PDP)</label>
                    <input
                      type='file'
                      accept='image/*,.pdf'
                      onChange={e => {
                        if (e.target.files?.[0]) {
                          const file = e.target.files[0]
                          if (file.size > 5 * 1024 * 1024) {
                            setError('File size must be less than 5MB')
                            return
                          }
                          uploadDriverDocument('temp-id', {
                            type: 'pdp',
                            url: URL.createObjectURL(file)
                          })
                        }
                      }}
                      className='mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100'
                      required
                    />
                    <p className='mt-1 text-xs text-gray-500'>Upload your valid PDP certificate (max 5MB)</p>
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-700'>Criminal Background Check</label>
                    <input
                      type='file'
                      accept='image/*,.pdf'
                      onChange={e => {
                        if (e.target.files?.[0]) {
                          const file = e.target.files[0]
                          if (file.size > 5 * 1024 * 1024) {
                            setError('File size must be less than 5MB')
                            return
                          }
                          uploadDriverDocument('temp-id', {
                            type: 'criminal_check',
                            url: URL.createObjectURL(file)
                          })
                        }
                      }}
                      className='mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100'
                      required
                    />
                    <p className='mt-1 text-xs text-gray-500'>Upload your police clearance certificate (not older than 3 months)</p>
                  </div>

                  {vehicleData.year && new Date().getFullYear() - vehicleData.year > 4 && (
                    <div>
                      <label className='block text-sm font-medium text-gray-700'>Roadworthy Certificate</label>
                      <input
                        type='file'
                        accept='image/*,.pdf'
                        onChange={e => {
                          if (e.target.files?.[0]) {
                            const file = e.target.files[0]
                            if (file.size > 5 * 1024 * 1024) {
                              setError('File size must be less than 5MB')
                              return
                            }
                            uploadDriverDocument('temp-id', {
                              type: 'roadworthy',
                              url: URL.createObjectURL(file)
                            })
                          }
                        }}
                        className='mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100'
                        required
                      />
                      <p className='mt-1 text-xs text-gray-500'>Upload your valid roadworthy certificate (required for vehicles older than 4 years)</p>
                    </div>
                  )}

                  <div>
                    <label className='block text-sm font-medium text-gray-700'>Vehicle Registration Papers</label>
                    <input
                      type='file'
                      accept='image/*,.pdf'
                      onChange={e => {
                        if (e.target.files?.[0]) {
                          const file = e.target.files[0]
                          if (file.size > 5 * 1024 * 1024) {
                            setError('File size must be less than 5MB')
                            return
                          }
                          uploadDriverDocument('temp-id', {
                            type: 'registration',
                            url: URL.createObjectURL(file)
                          })
                        }
                      }}
                      className='mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100'
                      required
                    />
                    <p className='mt-1 text-xs text-gray-500'>Upload your vehicle registration certificate</p>
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-700'>Insurance Documents</label>
                    <input
                      type='file'
                      accept='image/*,.pdf'
                      onChange={e => {
                        if (e.target.files?.[0]) {
                          const file = e.target.files[0]
                          if (file.size > 5 * 1024 * 1024) {
                            setError('File size must be less than 5MB')
                            return
                          }
                          uploadDriverDocument('temp-id', {
                            type: 'insurance',
                            url: URL.createObjectURL(file)
                          })
                        }
                      }}
                      className='mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100'
                      required
                    />
                    <p className='mt-1 text-xs text-gray-500'>Upload proof of vehicle insurance</p>
                  </div>
                </div>

                {error && (
                  <div className='mt-4 p-4 bg-red-50 border border-red-200 rounded-md'>
                    <p className='text-sm text-red-600'>{error}</p>
                  </div>
                )}

                <div className='mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md'>
                  <h3 className='text-sm font-medium text-yellow-800'>Important Notes:</h3>
                  <ul className='mt-2 text-sm text-yellow-700 list-disc list-inside'>
                    <li>All documents must be clear and legible</li>
                    <li>Maximum file size for each document is 5MB</li>
                    <li>Accepted formats: Images (JPG, PNG) and PDF</li>
                    <li>Documents should not be expired</li>
                    <li>Criminal background check must be less than 3 months old</li>
                  </ul>
                </div>
              </div>
            )}

            {currentStep === 'vehicle' && (
              <div>
                <h2 className='text-lg font-medium text-gray-900 mb-4'>Vehicle Information</h2>
                <div className='grid grid-cols-1 gap-6 sm:grid-cols-2'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700'>Make</label>
                    <input
                      type='text'
                      value={vehicleData.make}
                      onChange={e => setVehicleData(prev => ({ ...prev, make: e.target.value }))}
                      className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
                      required
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700'>Model</label>
                    <input
                      type='text'
                      value={vehicleData.model}
                      onChange={e => setVehicleData(prev => ({ ...prev, model: e.target.value }))}
                      className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
                      required
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700'>Type</label>
                    <select
                      value={vehicleData.type}
                      onChange={e => setVehicleData(prev => ({ ...prev, type: e.target.value as VehicleType }))}
                      className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
                      required
                    >
                      {Object.values(VehicleType).map(type => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700'>Color</label>
                    <input
                      type='text'
                      value={vehicleData.color}
                      onChange={e => setVehicleData(prev => ({ ...prev, color: e.target.value }))}
                      className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
                      required
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700'>Year</label>
                    <input
                      type='number'
                      value={vehicleData.year}
                      onChange={e => setVehicleData(prev => ({ ...prev, year: parseInt(e.target.value) }))}
                      min={1900}
                      max={new Date().getFullYear()}
                      className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
                      required
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700'>License Plate</label>
                    <input
                      type='text'
                      value={vehicleData.licensePlate}
                      onChange={e => {
                        const value = e.target.value.toUpperCase()
                        setVehicleData(prev => ({ ...prev, licensePlate: value }))
                      }}
                      className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
                      required
                    />
                    {driverData.physicalAddress?.province === 'Gauteng' && 
                     vehicleData.licensePlate && 
                     !vehicleData.licensePlate.startsWith('GP') && (
                      <p className='mt-1 text-sm text-red-600'>License plate must start with GP for vehicles in Gauteng</p>
                    )}
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700'>VIN Number</label>
                    <input
                      type='text'
                      value={vehicleData.vin}
                      onChange={e => {
                        const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '')
                        setVehicleData(prev => ({ ...prev, vin: value }))
                      }}
                      maxLength={17}
                      className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
                      required
                    />
                    {vehicleData.vin && vehicleData.vin.length !== 17 && (
                      <p className='mt-1 text-sm text-red-600'>VIN number must be 17 characters</p>
                    )}
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700'>Mileage (km)</label>
                    <input
                      type='number'
                      value={vehicleData.mileage}
                      onChange={e => setVehicleData(prev => ({ ...prev, mileage: parseInt(e.target.value) }))}
                      min={0}
                      className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
                      required
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700'>Estimated Value (R)</label>
                    <input
                      type='number'
                      value={vehicleData.estimatedValue}
                      onChange={e => setVehicleData(prev => ({ ...prev, estimatedValue: parseInt(e.target.value) }))}
                      min={0}
                      step={1000}
                      className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {currentStep === 'review' && (
              <div>
                <h2 className='text-lg font-medium text-gray-900 mb-4'>Review Your Application</h2>
                <div className='space-y-6'>
                  <div>
                    <h3 className='text-md font-medium text-gray-700'>Personal Information</h3>
                    <dl className='mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2'>
                      <div>
                        <dt className='text-sm font-medium text-gray-500'>Full Name</dt>
                        <dd className='mt-1 text-sm text-gray-900'>
                          {driverData.firstName} {driverData.middleName} {driverData.lastName}
                        </dd>
                      </div>
                      <div>
                        <dt className='text-sm font-medium text-gray-500'>ID Number</dt>
                        <dd className='mt-1 text-sm text-gray-900'>{driverData.idNumber}</dd>
                      </div>
                      <div>
                        <dt className='text-sm font-medium text-gray-500'>Date of Birth</dt>
                        <dd className='mt-1 text-sm text-gray-900'>{driverData.dateOfBirth}</dd>
                      </div>
                      <div>
                        <dt className='text-sm font-medium text-gray-500'>Phone Number</dt>
                        <dd className='mt-1 text-sm text-gray-900'>{driverData.phoneNumber}</dd>
                      </div>
                    </dl>
                  </div>

                  <div>
                    <h3 className='text-md font-medium text-gray-700'>Physical Address</h3>
                    <dl className='mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2'>
                      <div className='sm:col-span-2'>
                        <dt className='text-sm font-medium text-gray-500'>Street Address</dt>
                        <dd className='mt-1 text-sm text-gray-900'>{driverData.physicalAddress?.street}</dd>
                      </div>
                      <div>
                        <dt className='text-sm font-medium text-gray-500'>Suburb</dt>
                        <dd className='mt-1 text-sm text-gray-900'>{driverData.physicalAddress?.suburb}</dd>
                      </div>
                      <div>
                        <dt className='text-sm font-medium text-gray-500'>City</dt>
                        <dd className='mt-1 text-sm text-gray-900'>{driverData.physicalAddress?.city}</dd>
                      </div>
                      <div>
                        <dt className='text-sm font-medium text-gray-500'>Province</dt>
                        <dd className='mt-1 text-sm text-gray-900'>{driverData.physicalAddress?.province}</dd>
                      </div>
                      <div>
                        <dt className='text-sm font-medium text-gray-500'>Postal Code</dt>
                        <dd className='mt-1 text-sm text-gray-900'>{driverData.physicalAddress?.postalCode}</dd>
                      </div>
                    </dl>
                  </div>

                  <div>
                    <h3 className='text-md font-medium text-gray-700'>Banking Details</h3>
                    <dl className='mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2'>
                      <div>
                        <dt className='text-sm font-medium text-gray-500'>Bank Name</dt>
                        <dd className='mt-1 text-sm text-gray-900'>{driverData.bankingDetails?.bankName}</dd>
                      </div>
                      <div>
                        <dt className='text-sm font-medium text-gray-500'>Account Number</dt>
                        <dd className='mt-1 text-sm text-gray-900'>{driverData.bankingDetails?.accountNumber}</dd>
                      </div>
                      <div>
                        <dt className='text-sm font-medium text-gray-500'>Account Holder</dt>
                        <dd className='mt-1 text-sm text-gray-900'>{driverData.bankingDetails?.accountHolder}</dd>
                      </div>
                      <div>
                        <dt className='text-sm font-medium text-gray-500'>Branch Code</dt>
                        <dd className='mt-1 text-sm text-gray-900'>{driverData.bankingDetails?.branchCode}</dd>
                      </div>
                    </dl>
                  </div>

                  <div>
                    <h3 className='text-md font-medium text-gray-700'>Vehicle Information</h3>
                    <dl className='mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2'>
                      <div>
                        <dt className='text-sm font-medium text-gray-500'>Make</dt>
                        <dd className='mt-1 text-sm text-gray-900'>{vehicleData.make}</dd>
                      </div>
                      <div>
                        <dt className='text-sm font-medium text-gray-500'>Model</dt>
                        <dd className='mt-1 text-sm text-gray-900'>{vehicleData.model}</dd>
                      </div>
                      <div>
                        <dt className='text-sm font-medium text-gray-500'>Type</dt>
                        <dd className='mt-1 text-sm text-gray-900'>{vehicleData.type}</dd>
                      </div>
                      <div>
                        <dt className='text-sm font-medium text-gray-500'>Color</dt>
                        <dd className='mt-1 text-sm text-gray-900'>{vehicleData.color}</dd>
                      </div>
                      <div>
                        <dt className='text-sm font-medium text-gray-500'>Year</dt>
                        <dd className='mt-1 text-sm text-gray-900'>{vehicleData.year}</dd>
                      </div>
                      <div>
                        <dt className='text-sm font-medium text-gray-500'>License Plate</dt>
                        <dd className='mt-1 text-sm text-gray-900'>{vehicleData.licensePlate}</dd>
                      </div>
                      <div>
                        <dt className='text-sm font-medium text-gray-500'>VIN Number</dt>
                        <dd className='mt-1 text-sm text-gray-900'>{vehicleData.vin}</dd>
                      </div>
                      <div>
                        <dt className='text-sm font-medium text-gray-500'>Mileage</dt>
                        <dd className='mt-1 text-sm text-gray-900'>{vehicleData.mileage} km</dd>
                      </div>
                      <div>
                        <dt className='text-sm font-medium text-gray-500'>Estimated Value</dt>
                        <dd className='mt-1 text-sm text-gray-900'>R {vehicleData.estimatedValue?.toLocaleString()}</dd>
                      </div>
                    </dl>
                  </div>

                  <div>
                    <h3 className='text-md font-medium text-gray-700'>Uploaded Documents</h3>
                    <ul className='mt-2 divide-y divide-gray-200'>
                      {driverData.documents?.map((doc, index) => (
                        <li key={index} className='py-3 flex justify-between items-center'>
                          <div className='flex items-center'>
                            <svg className='h-5 w-5 text-gray-400' fill='currentColor' viewBox='0 0 20 20'>
                              <path
                                fillRule='evenodd'
                                d='M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z'
                                clipRule='evenodd'
                              />
                            </svg>
                            <span className='ml-2 text-sm text-gray-900'>
                              {doc.type
                                .split('_')
                                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                                .join(' ')}
                            </span>
                          </div>
                          <span className='text-sm text-gray-500'>
                            Uploaded {new Date(doc.uploadedAt).toLocaleDateString()}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className='rounded-md bg-yellow-50 p-4'>
                    <div className='flex'>
                      <div className='flex-shrink-0'>
                        <svg className='h-5 w-5 text-yellow-400' viewBox='0 0 20 20' fill='currentColor'>
                          <path
                            fillRule='evenodd'
                            d='M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z'
                            clipRule='evenodd'
                          />
                        </svg>
                      </div>
                      <div className='ml-3'>
                        <h3 className='text-sm font-medium text-yellow-800'>Important Notice</h3>
                        <div className='mt-2 text-sm text-yellow-700'>
                          <p>
                            By submitting this application, you confirm that all information provided is accurate and true.
                            False information may result in immediate termination of your driver account.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className='mt-4 p-4 bg-red-50 border border-red-200 rounded-md'>
              <p className='text-sm text-red-600'>{error}</p>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className='mt-8 flex justify-between'>
            {currentStep !== 'personal' && (
              <button
                onClick={() => setCurrentStep(getPreviousStep(currentStep))}
                className='px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
              >
                Previous
              </button>
            )}
            {currentStep !== 'review' ? (
              <button
                onClick={() => setCurrentStep(getNextStep(currentStep))}
                className='ml-auto px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className='ml-auto px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400'
              >
                {isSubmitting ? 'Submitting...' : 'Submit Application'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function getPreviousStep(currentStep: Step): Step {
  const steps: Step[] = ['personal', 'documents', 'vehicle', 'review']
  const currentIndex = steps.indexOf(currentStep)
  return steps[currentIndex - 1]
}

function getNextStep(currentStep: Step): Step {
  const steps: Step[] = ['personal', 'documents', 'vehicle', 'review']
  const currentIndex = steps.indexOf(currentStep)
  return steps[currentIndex + 1]
}
