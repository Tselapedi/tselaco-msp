import { drizzle } from 'drizzle-orm/mysql2'
import mysql from 'mysql2/promise'
import * as schema from '@/lib/db/schema'

export async function createTestDatabase() {
  const connection = await mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME
  })

  // Create tables if they don't exist
  await connection.query(`
    CREATE TABLE IF NOT EXISTS users (
      id VARCHAR(255) PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      firstName VARCHAR(255) NOT NULL,
      lastName VARCHAR(255) NOT NULL,
      phoneNumber VARCHAR(255) NOT NULL,
      idNumber VARCHAR(255) UNIQUE NOT NULL,
      role ENUM('user', 'driver', 'admin') NOT NULL,
      isEmailVerified BOOLEAN DEFAULT FALSE,
      verificationCode VARCHAR(255),
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS drivers (
      id VARCHAR(255) PRIMARY KEY,
      userId VARCHAR(255) NOT NULL,
      middleName VARCHAR(255),
      licenseNumber VARCHAR(255) UNIQUE NOT NULL,
      pdpNumber VARCHAR(255) UNIQUE NOT NULL,
      licenseExpiryDate DATE NOT NULL,
      pdpExpiryDate DATE NOT NULL,
      referenceNumber VARCHAR(255) UNIQUE NOT NULL,
      verificationStatus ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
      rejectionReason TEXT,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS driver_documents (
      id VARCHAR(255) PRIMARY KEY,
      userId VARCHAR(255) NOT NULL,
      type VARCHAR(255) NOT NULL,
      fileUrl VARCHAR(255) NOT NULL,
      fileType VARCHAR(255) NOT NULL,
      fileSize INT NOT NULL,
      documentNumber VARCHAR(255),
      expiryDate DATE,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES users(id)
    );
  `)

  return drizzle(connection, { schema })
}
