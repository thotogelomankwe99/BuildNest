require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// ---------------------------
// MySQL Connection
// ---------------------------
let db;
async function initDB() {
    db = await mysql.createPool({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || 'Phuti@1016',
        database: process.env.DB_NAME || 'buildnest_db',
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    });
    console.log('Connected to MySQL');
}
initDB().catch(err => console.error('DB connection error:', err));

// ---------------------------
// Routes
// ---------------------------

// 1. Sync user (create or update)
app.post('/api/sync-user', async (req, res) => {
    try {
        const { uid, full_name, email, photo_url } = req.body;
        if (!uid || !full_name || !email) {
            return res.status(400).json({ success: false, message: 'Missing required fields' });
        }

        const [existing] = await db.query('SELECT * FROM users WHERE uid = ?', [uid]);

        if (existing.length) {
            await db.query(
                'UPDATE users SET full_name=?, email=?, photo_url=?, updated_at=NOW() WHERE uid=?',
                [full_name, email, photo_url || null, uid]
            );
        } else {
            await db.query(
                'INSERT INTO users (uid, full_name, email, photo_url) VALUES (?, ?, ?, ?)',
                [uid, full_name, email, photo_url || null]
            );
        }

        res.json({ success: true, message: 'User synced successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// 2. Get user info
app.get('/api/user/:uid', async (req, res) => {
    try {
        const { uid } = req.params;
        const [rows] = await db.query('SELECT * FROM users WHERE uid = ?', [uid]);
        if (!rows.length) return res.status(404).json({ success: false, message: 'User not found' });
        res.json({ success: true, user: rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// 3. Get dashboard data
app.get('/api/user/:uid/dashboard', async (req, res) => {
    try {
        const { uid } = req.params;

        const [userRows] = await db.query('SELECT id FROM users WHERE uid = ?', [uid]);
        if (!userRows.length) return res.status(404).json({ success: false, message: 'User not found' });
        const userId = userRows[0].id;

        // Example dashboard data
        const [[projectCount]] = await db.query(
            'SELECT COUNT(*) as total_projects FROM projects WHERE user_id = ?',
            [userId]
        );

        const [[discussionCount]] = await db.query(
            'SELECT COUNT(*) as total_discussions FROM discussions WHERE user_id = ?',
            [userId]
        );

        res.json({
            success: true,
            dashboard: {
                total_projects: projectCount.total_projects,
                total_discussions: discussionCount.total_discussions
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// 4. Get user notifications
app.get('/api/user/:uid/notifications', async (req, res) => {
    try {
        const { uid } = req.params;
        const [userRows] = await db.query('SELECT id FROM users WHERE uid = ?', [uid]);
        if (!userRows.length) return res.status(404).json({ success: false, message: 'User not found' });
        const userId = userRows[0].id;

        const [notifications] = await db.query(
            'SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC',
            [userId]
        );

        res.json({ success: true, notifications });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// 5. Get user discussions
app.get('/api/user/:uid/discussions', async (req, res) => {
    try {
        const { uid } = req.params;
        const [userRows] = await db.query('SELECT id FROM users WHERE uid = ?', [uid]);
        if (!userRows.length) return res.status(404).json({ success: false, message: 'User not found' });
        const userId = userRows[0].id;

        const [discussions] = await db.query(
            'SELECT * FROM discussions WHERE user_id = ? ORDER BY created_at DESC',
            [userId]
        );

        res.json({ success: true, discussions });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// ---------------------------
// Start server
// ---------------------------
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
