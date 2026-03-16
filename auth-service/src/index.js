// src/index.js
require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const morgan  = require('morgan');
const { Pool } = require('pg');
const { initDB } = require('./db/db');
const authRoutes = require('./routes/auth');

const app  = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(morgan(':method :url :status :response-time ms', {
  stream: { write: (msg) => console.log(msg.trim()) }
}));

app.use('/api/auth', authRoutes);
app.use((req, res) => res.status(404).json({ error: 'Route not found' }));
app.use((err, req, res, _next) => {
  console.error('[ERROR]', err.message);
  res.status(500).json({ error: 'Internal Server Error' });
});

// ฟังก์ชันสำหรับสร้างตาราง (Database Initialization)
async function initDB() {
  const query = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(50),
      email VARCHAR(100) UNIQUE,
      password VARCHAR(255)
    );
  `;
  try {
    await pool.query(query);
    console.log("Database initialized successfully");
  } catch (err) {
    console.error("Error initializing database:", err);
  }
}

// เรียกใช้ฟังก์ชันนี้ก่อนสั่งให้ Server เริ่มทำงาน
initDB().then(() => {
  app.listen(3001, () => {
    console.log("Auth Service running on port 3001");
  });
});

async function start() {
  let retries = 10;
  while (retries > 0) {
    try {
      await initDB();
     // await seedUsers();   // ← ✨ v2.0: สร้าง test users หลัง table พร้อม
      break;
    } catch (err) {
      console.log(`[auth-service] Waiting for DB... (${retries} retries left): ${err.message}`);
      retries--;
      await new Promise(r => setTimeout(r, 3000));
    }
  }
  app.listen(PORT, () => {
    console.log(`[auth-service] Running on port ${PORT}`);
    console.log(`[auth-service] JWT_EXPIRES: ${process.env.JWT_EXPIRES || '1h'}`);
  });
}

start();