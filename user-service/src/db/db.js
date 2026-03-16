// user/../db.js
const { Pool } = require('pg');
const fs   = require('fs');
const path = require('path');

const pool = new Pool({
  // ถ้ามี DATABASE_URL ให้ใช้ก่อน (สำหรับ Cloud) ถ้าไม่มีค่อยใช้ config แยก (สำหรับ Local)
  connectionString: process.env.DATABASE_URL, 
  host:     process.env.DB_HOST     || 'user-db',
  port:     parseInt(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME     || 'user_db',
  user:     process.env.DB_USER     || 'user_user',
  password: process.env.DB_PASSWORD || 'user_secret',
  // เพิ่ม SSL สำหรับการเชื่อมต่อบน Cloud Production
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function initDB() {
  const sql = fs.readFileSync(path.join(__dirname, 'init.sql'), 'utf8');
  // แบ่งคำสั่งด้วย ; และกรองช่องว่างออก จากนั้นสั่ง query ทีละคำสั่ง
  const statements = sql.split(';').map(s => s.trim()).filter(s => s.length > 0);
  for (const statement of statements) {
    await pool.query(statement);
  }
  console.log('[user-db] Tables initialized');
}

module.exports = { pool, initDB };