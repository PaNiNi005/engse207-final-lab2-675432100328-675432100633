require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const { pool } = require('./db/db');
const usersRouter = require('./routes/users');

const app  = express();
const PORT = process.env.PORT || 3003;

app.use(cors());
app.use(express.json());
app.use('/api/users', usersRouter);

async function start() {
  let retries = 10;
  while (retries > 0) {
    try {
      await pool.query('SELECT 1');
      // สร้าง table ถ้ายังไม่มี (fallback สำหรับ Railway)
      await pool.query(`
        CREATE TABLE IF NOT EXISTS user_profiles (
          id SERIAL PRIMARY KEY, user_id INTEGER UNIQUE NOT NULL,
          username VARCHAR(50), email VARCHAR(100), role VARCHAR(20) DEFAULT 'member',
          display_name VARCHAR(100), bio TEXT, avatar_url VARCHAR(255),
          updated_at TIMESTAMP DEFAULT NOW()
        );
        CREATE TABLE IF NOT EXISTS logs (
          id SERIAL PRIMARY KEY, level VARCHAR(10) NOT NULL, event VARCHAR(100) NOT NULL,
          user_id INTEGER, message TEXT, meta JSONB, created_at TIMESTAMP DEFAULT NOW()
        );
      `);
      break;
    } catch (e) {
      console.log(`[user] Waiting DB... (${retries} left)`);
      retries--;
      await new Promise(r => setTimeout(r, 3000));
    }
  }
  app.listen(PORT, () => console.log(`[user-service] Running on :${PORT}`));
}
start();