require('dotenv').config();

const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT),
  // Return DECIMAL columns (media, infrequencia) as numbers instead of strings.
  decimalNumbers: true
});

async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('MySQL connected successfully!');
    connection.release();
  } catch (error) {
    console.error('MySQL connection failed:', error);
  }
}

testConnection();

module.exports = pool;