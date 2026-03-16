require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const morgan  = require('morgan');
const { Pool } = require('pg');
// สมมติว่า pool ถูก export มาจาก ./db/db หรือคุณสร้างที่นี่
const pool = new Pool({ connectionString: process.env.DATABASE_URL }); 
const authRoutes = require('./routes/auth');

const app  = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(morgan(':method :url :status :response-time ms'));

app.use('/api/auth', authRoutes);

// ฟังก์ชันสำหรับสร้างตาราง (รวมการ Retries ไว้ในที่เดียว)
async function initDB() {
  const query = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(50),
      email VARCHAR(100) UNIQUE,
      password VARCHAR(255)
    );
  `;
  await pool.query(query);
  console.log("Database initialized successfully");
}

// ฟังก์ชัน start เพื่อรันทุกอย่างตามลำดับ
async function start() {
  let retries = 10;
  while (retries > 0) {
    try {
      await initDB();
      break; // ถ้า initDB สำเร็จ ให้หยุด loop
    } catch (err) {
      console.log(`[auth-service] Waiting for DB... (${retries} retries left): ${err.message}`);
      retries--;
      await new Promise(r => setTimeout(r, 3000));
    }
  }
  
  app.listen(PORT, () => {
    console.log(`[auth-service] Running on port ${PORT}`);
  });
}

start();