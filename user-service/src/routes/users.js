const express = require('express');
const { pool } = require('../db/db');
const { requireAuth, requireRole } = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * [T5] GET /api/users/me — ดูโปรไฟล์ตัวเอง
 * เงื่อนไข: หากไม่พบข้อมูล profile ให้สร้างใหม่โดยใช้ข้อมูลจาก JWT ทันที
 */
router.get('/me', requireAuth, async (req, res) => {
  const userId = req.user.sub; // ดึง id จาก JWT payload

  try {
    // 1. ตรวจสอบว่ามี profile ใน user-db หรือยัง
    const result = await pool.query(
      'SELECT * FROM user_profiles WHERE user_id = $1',
      [userId]
    );

    // 2. ถ้าไม่พบ (เป็นผู้ใช้ใหม่ที่เพิ่ง register/login มาครั้งแรก)
    if (result.rows.length === 0) {
      const newProfile = await pool.query(
        `INSERT INTO user_profiles (user_id, username, email, role, display_name) 
         VALUES ($1, $2, $3, $4, $5) 
         RETURNING *`,
        [
          userId,
          req.user.username,
          req.user.email,
          req.user.role || 'member',
          req.user.username // ตั้งชื่อแสดงผลเริ่มต้นให้เท่ากับ username
        ]
      );
      return res.status(201).json({ 
        message: 'Initial profile created automatically', 
        user: newProfile.rows[0] 
      });
    }

    // 3. ถ้าพบข้อมูลอยู่แล้ว ส่งกลับปกติ
    res.json({ user: result.rows[0] });
  } catch (err) {
    console.error('[USER] /me error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * [T6] PUT /api/users/me — แก้ไขโปรไฟล์ตัวเอง
 */
router.put('/me', requireAuth, async (req, res) => {
  const userId = req.user.sub;
  const { display_name, bio, avatar_url } = req.body; // รับข้อมูลที่ต้องการแก้ไข

  try {
    const result = await pool.query(
      `UPDATE user_profiles 
       SET display_name = $1, bio = $2, avatar_url = $3, updated_at = NOW() 
       WHERE user_id = $4 
       RETURNING *`,
      [display_name, bio, avatar_url, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'ไม่พบโปรไฟล์ที่ต้องการแก้ไข' });
    }

    res.json({ message: 'อัปเดตโปรไฟล์สำเร็จ', user: result.rows[0] });
  } catch (err) {
    console.error('[USER] update error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * [T10] GET /api/users — ดูรายชื่อผู้ใช้ทั้งหมด (Admin Only)
 */
router.get('/', requireAuth, requireRole('admin'), async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM user_profiles ORDER BY created_at DESC'
    );
    res.json({ users: result.rows, total: result.rowCount });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/users/health
router.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'user-service' });
});

module.exports = router;