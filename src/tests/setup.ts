import { beforeAll, afterAll } from 'vitest'
import { db } from '@/lib/db'
import { migrate } from 'drizzle-orm/mysql2/migrator'

beforeAll(async () => {
  // Run migrations
  await migrate(db, { migrationsFolder: './drizzle' })
})

afterAll(async () => {
  // Clean up database connection
  await db.end()
}) 
