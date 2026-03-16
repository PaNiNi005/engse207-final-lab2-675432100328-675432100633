// tasks-service/src/db/db.js
const { Pool } = require('pg');
const fs   = require('fs');
const path = require('path');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  host:     process.env.DB_HOST     || 'db', 
  port:     5432,
  database: process.env.DB_NAME     || 'labdb',
  user:     process.env.DB_USER     || 'user',
  password: process.env.DB_PASSWORD || 'password',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function initDB() {
  const sql = fs.readFileSync(path.join(__dirname, 'init.sql'), 'utf8');
  await pool.query(sql);
  console.log('[task-db] Tables initialized');
}

module.exports = { pool, initDB };