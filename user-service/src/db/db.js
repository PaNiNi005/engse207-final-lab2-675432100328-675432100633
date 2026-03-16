const { Pool } = require('pg');
const fs   = require('fs');
const path = require('path');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function initDB() {
  const sql = fs.readFileSync(path.join(__dirname, 'init.sql'), 'utf8');
  // แบ่งคำสั่งด้วย ; และกรองช่องว่างออก จากนั้นสั่ง query ทีละคำสั่ง
  const statements = sql.split(';').map(s => s.trim()).filter(s => s.length > 0);
  for (const statement of statements) {
    await pool.query(statement);
  }
  console.log('[user-db] Tables initialized');
}

// ส่งออกรวบยอดที่บรรทัดสุดท้ายที่เดียว
module.exports = { pool, initDB };