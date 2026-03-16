const express     = require('express');
const { pool }    = require('../db/db');
const requireAuth = require('../middleware/authMiddleware');
const { verifyToken } = require('../middleware/jwtUtils');

const router = express.Router();

// Helper: log ลง user-db โดยตรง
async function logEvent({ level, event, userId, message, meta }) {
  try {
    await pool.query(
      `INSERT INTO logs (level, event, user_id, message, meta) VALUES ($1,$2,$3,$4,$5)`,
      [level, event, userId || null, message || null, meta ? JSON.stringify(meta) : null]
    );
  } catch (e) {
    console.error('[user-log]', e.message);
  }
}

// ── Helper: auto-create profile ถ้ายังไม่มี ──────────────────────────
async function ensureProfile(user) {
  const existing = await pool.query(
    'SELECT * FROM user_profiles WHERE user_id = $1', [user.sub]
  );
  if (existing.rows.length > 0) return existing.rows[0];

  // สร้าง profile เริ่มต้นจาก JWT
  const result = await pool.query(
    `INSERT INTO user_profiles (user_id, username, email, role)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (user_id) DO UPDATE SET updated_at = NOW()
     RETURNING *`,
    [user.sub, user.username, user.email, user.role]
  );
  await logEvent({
    level: 'INFO', event: 'PROFILE_CREATED',
    userId: user.sub, message: `Auto-created profile for ${user.username}`
  });
  return result.rows[0];
}

// GET /api/users/health
router.get('/health', (_, res) => res.json({ status: 'ok', service: 'user-service' }));

// ── ทุก route ต่อจากนี้ต้อง JWT ──
router.use(requireAuth);

// ── GET /api/users/me — ดู profile ของตัวเอง ──────────────────────────
router.get('/me', async (req, res) => {
  try {
    const profile = await ensureProfile(req.user);
    res.json({ profile });
  } catch (err) {
    console.error('[user] GET /me error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// ── PUT /api/users/me — แก้ไข profile ────────────────────────────────
router.put('/me', async (req, res) => {
  const { display_name, bio, avatar_url } = req.body;
  try {
    await ensureProfile(req.user);  // ให้มี profile ก่อน
    const result = await pool.query(
      `UPDATE user_profiles
       SET display_name = COALESCE($1, display_name),
           bio          = COALESCE($2, bio),
           avatar_url   = COALESCE($3, avatar_url),
           updated_at   = NOW()
       WHERE user_id = $4 RETURNING *`,
      [display_name, bio, avatar_url, req.user.sub]
    );
    await logEvent({
      level: 'INFO', event: 'PROFILE_UPDATED',
      userId: req.user.sub, message: `Profile updated for ${req.user.username}`
    });
    res.json({ profile: result.rows[0] });
  } catch (err) {
    console.error('[user] PUT /me error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// ── GET /api/users — รายชื่อผู้ใช้ทั้งหมด (admin only) ────────────────
router.get('/', async (req, res) => {
  if (req.user.role !== 'admin')
    return res.status(403).json({ error: 'Forbidden: admin only' });

  try {
    const result = await pool.query(
      `SELECT * FROM user_profiles ORDER BY user_id`
    );
    res.json({ users: result.rows, count: result.rowCount });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;