require('dotenv').config();

const mysql = require('mysql2/promise');

// TiDB Cloud only accepts TLS connections; a local MySQL usually has no certificate.
const useSsl = process.env.DB_SSL
  ? process.env.DB_SSL === 'true'
  : /\.tidbcloud\.com$/.test(process.env.DB_HOST ?? '');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT),
  ssl: useSsl ? { minVersion: 'TLSv1.2', rejectUnauthorized: true } : undefined,
  // Return DECIMAL columns (media, infrequencia) as numbers instead of strings.
  decimalNumbers: true
});

async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('Database connected successfully!');
    connection.release();
  } catch (error) {
    console.error('Database connection failed:', error);
  }
}

testConnection();

module.exports = pool;
