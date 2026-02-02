const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
});

async function initDB() {

  await pool.query(`
    CREATE TABLE IF NOT EXISTS calls (
      id SERIAL PRIMARY KEY,
      uniqueid TEXT,
      caller TEXT,
      destination TEXT,
      start_time TIMESTAMP,
      end_time TIMESTAMP,
      duration INTEGER,
      transcript TEXT,
      status TEXT
    )
  `);

  console.log('Database Ready');
}

initDB();

module.exports = pool;