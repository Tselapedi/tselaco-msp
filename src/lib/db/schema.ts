import { sql } from '@vercel/postgres'
import { mysqlTable, varchar, timestamp, boolean, int, text, mysqlEnum } from 'drizzle-orm/mysql-core'
import { createId } from '@paralleldrive/cuid2'

export const users = mysqlTable('users', {
  id: varchar('id', { length: 128 }).primaryKey().$defaultFn(() => createId()),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  firstName: varchar('first_name', { length: 255 }).notNull(),
  lastName: varchar('last_name', { length: 255 }).notNull(),
  phoneNumber: varchar('phone_number', { length: 20 }).notNull(),
  idNumber: varchar('id_number', { length: 13 }).notNull().unique(),
  isVerified: boolean('is_verified').default(false).notNull(),
  verificationCode: varchar('verification_code', { length: 6 }),
  verificationExpires: timestamp('verification_expires'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
})

export const drivers = mysqlTable('drivers', {
  id: varchar('id', { length: 128 }).primaryKey().$defaultFn(() => createId()),
  referenceNumber: varchar('reference_number', { length: 10 }).notNull().unique().$defaultFn(() => {
    // Generate a unique reference number: DR + 8 random digits
    const randomNum = Math.floor(10000000 + Math.random() * 90000000)
    return `DR${randomNum}`
  }),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  firstName: varchar('first_name', { length: 255 }).notNull(),
  middleName: varchar('middle_name', { length: 255 }),
  lastName: varchar('last_name', { length: 255 }).notNull(),
  phoneNumber: varchar('phone_number', { length: 20 }).notNull(),
  idNumber: varchar('id_number', { length: 13 }).notNull().unique(),
  licenseNumber: varchar('license_number', { length: 50 }).notNull().unique(),
  pdpNumber: varchar('pdp_number', { length: 50 }).notNull().unique(),
  status: mysqlEnum('status', ['pending', 'approved', 'rejected']).default('pending').notNull(),
  rejectionReason: text('rejection_reason'),
  isVerified: boolean('is_verified').default(false).notNull(),
  verificationCode: varchar('verification_code', { length: 6 }),
  verificationExpires: timestamp('verification_expires'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
})

export const driverDocuments = mysqlTable('driver_documents', {
  id: varchar('id', { length: 128 }).primaryKey().$defaultFn(() => createId()),
  driverId: varchar('driver_id', { length: 128 }).notNull().references(() => drivers.id, { onDelete: 'cascade' }),
  type: mysqlEnum('type', [
    'id_document',
    'drivers_license',
    'pdp_permit',
    'police_clearance',
    'vehicle_registration',
    'vehicle_insurance',
    'roadworthy_certificate'
  ]).notNull(),
  url: varchar('url', { length: 1024 }).notNull(),
  status: mysqlEnum('status', ['pending', 'approved', 'rejected']).default('pending').notNull(),
  rejectionReason: text('rejection_reason'),
  uploadedAt: timestamp('uploaded_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
})

export const vehicles = mysqlTable('vehicles', {
  id: varchar('id', { length: 128 }).primaryKey().$defaultFn(() => createId()),
  driverId: varchar('driver_id', { length: 128 }).notNull().references(() => drivers.id, { onDelete: 'cascade' }),
  make: varchar('make', { length: 100 }).notNull(),
  model: varchar('model', { length: 100 }).notNull(),
  year: int('year').notNull(),
  color: varchar('color', { length: 50 }).notNull(),
  licensePlate: varchar('license_plate', { length: 20 }).notNull().unique(),
  vin: varchar('vin', { length: 17 }).notNull().unique(),
  type: mysqlEnum('type', ['sedan', 'suv', 'van', 'hatchback']).notNull(),
  mileage: int('mileage').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
}) 
