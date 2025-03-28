import mysql from 'mysql2/promise'
import { config } from '@/config'

// Create a connection pool
const pool = mysql.createPool({
  host: config.db.host,
  user: config.db.user,
  password: config.db.password,
  database: config.db.name,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: true } : undefined
})

// Helper function to execute queries
export async function query<T>(sql: string, params?: any[]): Promise<T> {
  const [rows] = await pool.execute(sql, params)
  return rows as T
}

// Database initialization
export async function initializeDatabase() {
  const createUsersTable = `
    CREATE TABLE IF NOT EXISTS users (
      id VARCHAR(36) PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      role ENUM('user', 'driver', 'admin') NOT NULL,
      firstName VARCHAR(100) NOT NULL,
      lastName VARCHAR(100) NOT NULL,
      phoneNumber VARCHAR(20) NOT NULL,
      isVerified BOOLEAN DEFAULT false,
      idNumber VARCHAR(13) UNIQUE NOT NULL,
      verificationCode VARCHAR(6),
      verificationExpiry DATETIME,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_email (email),
      INDEX idx_role (role),
      INDEX idx_idNumber (idNumber)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `

  const createDriverVerificationsTable = `
    CREATE TABLE IF NOT EXISTS driver_verifications (
      id VARCHAR(36) PRIMARY KEY,
      driverId VARCHAR(36) NOT NULL,
      referenceNumber VARCHAR(20) UNIQUE NOT NULL,
      status ENUM('pending', 'approved', 'rejected') NOT NULL DEFAULT 'pending',
      adminNotes TEXT,
      submittedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      processedAt DATETIME,
      processedBy VARCHAR(36),
      FOREIGN KEY (driverId) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (processedBy) REFERENCES users(id),
      INDEX idx_driverId (driverId),
      INDEX idx_status (status),
      INDEX idx_referenceNumber (referenceNumber)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `

  const createAuthTokensTable = `
    CREATE TABLE IF NOT EXISTS auth_tokens (
      token VARCHAR(255) PRIMARY KEY,
      userId VARCHAR(36) NOT NULL,
      role ENUM('user', 'driver', 'admin') NOT NULL,
      expiresAt DATETIME NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
      INDEX idx_userId (userId),
      INDEX idx_expiresAt (expiresAt)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `

  try {
    await query(createUsersTable)
    await query(createDriverVerificationsTable)
    await query(createAuthTokensTable)
    console.log('Database tables initialized successfully')
  } catch (error) {
    console.error('Error initializing database tables:', error)
    throw error
  }
}

// Export the pool for direct access if needed
export { pool }
