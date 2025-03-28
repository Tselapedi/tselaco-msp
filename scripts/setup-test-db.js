const mysql = require('mysql2/promise')
require('dotenv').config({ path: '.env.test' })

async function setupTestDatabase() {
  try {
    // Create connection without database selected
    const connection = await mysql.createConnection({
      host: process.env.DATABASE_HOST,
      user: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD
    })

    // Create test database if it doesn't exist
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DATABASE_NAME}`)
    console.log('Test database created successfully')

    // Close connection
    await connection.end()
    console.log('Database setup completed')
  } catch (error) {
    console.error('Error setting up test database:', error)
    process.exit(1)
  }
}

setupTestDatabase()
