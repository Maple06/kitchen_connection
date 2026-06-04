const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const multer = require('multer');
const { Storage } = require('@google-cloud/storage');
const sharp = require('sharp');
const axios = require('axios');

// GCS Setup
const storage = new Storage({
    projectId: process.env.GOOGLE_CLOUD_PROJECT || 'kitchen-connection-496813'
});
const bucketName = 'kitchen-connection-uploads';
const bucket = storage.bucket(bucketName);

const fs = require('fs');
const db = require('./db');
require('dotenv').config();

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

// Multer setup
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } }); // 10MB limit

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey123';
const APP_MODE = process.env.APP_MODE || 'local_azure'; // 'deployment', 'local_azure', 'local_xampp'

// Determine Frontend URLs based on APP_MODE
let allowedOrigins = [];
if (APP_MODE === 'deployment') {
    allowedOrigins = ['https://kitchenconnection.id', 'https://www.kitchenconnection.id'];
    if (process.env.FRONTEND_URL) {
        allowedOrigins.push(process.env.FRONTEND_URL);
    }
} else {
    allowedOrigins = ['http://localhost:5173'];
}
if (process.env.FRONTEND_URL) {
    allowedOrigins.push(process.env.FRONTEND_URL);
}

// Brevo Mailer Setup
const transporter = nodemailer.createTransport({
    host: 'smtp-relay.brevo.com',
    port: 587,
    auth: {
        user: process.env.BREVO_USER || '', // Must be set in .env
        pass: process.env.BREVO_PASS || ''  // Must be set in .env
    }
});

// Middleware
app.use(cors({
    origin: true, // Dynamically reflect the request origin to support any custom domain
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Lightweight health check for uptime monitors (hits DB with a tiny query)
app.get('/ping', async (req, res) => {
    try {
        await db.query('SELECT 1 AS ok');
        res.set('Cache-Control', 'no-store');
        res.json({ ok: true, ts: new Date().toISOString() });
    } catch (error) {
        res.set('Cache-Control', 'no-store');
        res.status(500).json({ ok: false, ts: new Date().toISOString() });
    }
});

// Verify JWT Middleware
const verifyToken = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: 'Tidak ada akses (Unauthorized)' });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Sesi tidak valid' });
    }
};

// --- AUTH API ---

// Register
app.post('/auth/register', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const [existing] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
        if (existing.length > 0) return res.status(400).json({ message: 'Email sudah terdaftar' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const verificationToken = crypto.randomBytes(32).toString('hex');

        await db.query(
            'INSERT INTO users (name, email, password, role, is_verified, verification_token) VALUES (?, ?, ?, ?, ?, ?)',
            [name, email, hashedPassword, 'client', false, verificationToken]
        );

        // Send Email
        const verifyLink = `${FRONTEND_URL}/#/verify?token=${verificationToken}`;
        await transporter.sendMail({
            from: '"Kitchen Connection" <noreply@kitchenconnection.com>',
            to: email,
            subject: 'Verifikasi Email Anda - Kitchen Connection',
            html: `<p>Halo ${name},</p><p>Terima kasih telah mendaftar. Silakan klik tautan di bawah ini untuk memverifikasi akun Anda:</p><p><a href="${verifyLink}">${verifyLink}</a></p>`
        });

        res.json({ message: 'Pendaftaran berhasil. Silakan cek email Anda untuk verifikasi.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Terjadi kesalahan server saat mendaftar. Detail: ' + (error.message || error) });
    }
});

// Verify Email
app.post('/auth/verify', async (req, res) => {
    const { token } = req.body;
    try {
        const [users] = await db.query('SELECT id FROM users WHERE verification_token = ?', [token]);
        if (users.length === 0) return res.status(400).json({ message: 'Token tidak valid atau sudah digunakan.' });

        await db.query('UPDATE users SET is_verified = 1, verification_token = NULL WHERE id = ?', [users[0].id]);
        res.json({ message: 'Email berhasil diverifikasi. Silakan masuk.' });
    } catch (error) {
        res.status(500).json({ message: 'Terjadi kesalahan server. Detail: ' + (error.message || error) });
    }
});

// Forgot Password
app.post('/auth/forgot-password', async (req, res) => {
    const { email } = req.body;
    try {
        const [users] = await db.query('SELECT id, name FROM users WHERE email = ?', [email]);
        if (users.length === 0) return res.status(404).json({ message: 'Email tidak ditemukan.' });

        const resetToken = crypto.randomBytes(32).toString('hex');
        await db.query('UPDATE users SET reset_token = ? WHERE id = ?', [resetToken, users[0].id]);

        const resetLink = `${FRONTEND_URL}/#/reset-password?token=${resetToken}`;
        await transporter.sendMail({
            from: '"Kitchen Connection" <noreply@kitchenconnection.com>',
            to: email,
            subject: 'Reset Kata Sandi - Kitchen Connection',
            html: `<p>Halo ${users[0].name},</p><p>Klik tautan di bawah ini untuk mengatur ulang kata sandi Anda:</p><p><a href="${resetLink}">${resetLink}</a></p>`
        });

        res.json({ message: 'Tautan reset sandi telah dikirim ke email Anda.' });
    } catch (error) {
        res.status(500).json({ message: 'Terjadi kesalahan server. Detail: ' + (error.message || error) });
    }
});

// Reset Password
app.post('/auth/reset-password', async (req, res) => {
    const { token, newPassword } = req.body;
    try {
        const [users] = await db.query('SELECT id FROM users WHERE reset_token = ?', [token]);
        if (users.length === 0) return res.status(400).json({ message: 'Token tidak valid.' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        await db.query('UPDATE users SET password = ?, reset_token = NULL WHERE id = ?', [hashedPassword, users[0].id]);
        res.json({ message: 'Kata sandi berhasil diubah. Silakan masuk.' });
    } catch (error) {
        res.status(500).json({ message: 'Terjadi kesalahan server. Detail: ' + (error.message || error) });
    }
});

// Change Password (Logged In)
app.post('/auth/change-password', verifyToken, async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    try {
        const [users] = await db.query('SELECT password FROM users WHERE id = ?', [req.user.id]);
        if (users.length === 0) return res.status(404).json({ message: 'Pengguna tidak ditemukan.' });

        const validPassword = await bcrypt.compare(oldPassword, users[0].password);
        if (!validPassword) return res.status(400).json({ message: 'Kata sandi lama salah.' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        await db.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, req.user.id]);
        res.json({ message: 'Kata sandi berhasil diubah.' });
    } catch (error) {
        res.status(500).json({ message: 'Terjadi kesalahan server. Detail: ' + (error.message || error) });
    }
});

// Login
app.post('/auth/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) return res.status(401).json({ message: 'Email tidak ditemukan.' });

        const user = users[0];
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(401).json({ message: 'Email atau kata sandi salah.' });

        if (!user.is_verified) return res.status(403).json({ message: 'Akun Anda belum diverifikasi. Silakan cek email Anda.' });

        const token = jwt.sign({ id: user.id, role: user.role, name: user.name }, JWT_SECRET, { expiresIn: '7d' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 3600000 // 7 days
        });

        res.json({ message: 'Berhasil login', user: { id: user.id, name: user.name, role: user.role } });
    } catch (error) {
        res.status(500).json({ message: 'Terjadi kesalahan server. Detail: ' + (error.message || error) });
    }
});

app.post('/auth/logout', (req, res) => {
    res.clearCookie('token');
    res.json({ message: 'Berhasil logout' });
});

app.post('/auth/google', async (req, res) => {
    const { credential } = req.body;
    if (!credential) return res.status(400).json({ message: 'Token Google tidak ditemukan.' });

    try {
        const response = await axios.get(`https://oauth2.googleapis.com/tokeninfo?id_token=${credential}`);
        const payload = response.data;

        const GOOGLE_CLIENT_ID = '244439459583-o237jdkh8jucm9j22u11b64upnkajvgr.apps.googleusercontent.com';
        if (payload.aud !== GOOGLE_CLIENT_ID) {
            return res.status(401).json({ message: 'Token Google tidak valid.' });
        }

        const { sub: googleId, email, name, picture } = payload;
        if (!email) return res.status(400).json({ message: 'Email tidak ditemukan dari akun Google.' });

        // Upsert user: find by google_id or email, create if not found
        let [users] = await db.query('SELECT * FROM users WHERE google_id = ? OR email = ?', [googleId, email]);
        let user;

        if (users.length > 0) {
            user = users[0];
            // Link google_id if not yet set (existing email/password account)
            if (!user.google_id) {
                await db.query('UPDATE users SET google_id = ?, is_verified = 1 WHERE id = ?', [googleId, user.id]);
            }
        } else {
            // New user via Google — auto-verified, no password
            await db.query(
                'INSERT INTO users (name, email, google_id, role, is_verified) VALUES (?, ?, ?, ?, ?)',
                [name || email.split('@')[0], email, googleId, 'client', true]
            );
            const [newUser] = await db.query('SELECT * FROM users WHERE google_id = ?', [googleId]);
            user = newUser[0];
        }

        const token = jwt.sign({ id: user.id, role: user.role, name: user.name }, JWT_SECRET, { expiresIn: '7d' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 3600000
        });

        res.json({ message: 'Berhasil masuk dengan Google', user: { id: user.id, name: user.name, role: user.role } });
    } catch (error) {
        console.error('Google auth error:', error?.response?.data || error.message);
        res.status(401).json({ message: 'Verifikasi Google gagal. Silakan coba lagi.' });
    }
});

app.get('/auth/me', verifyToken, (req, res) => {
    res.json({ user: req.user });
});

// --- ADMIN API ---
app.post('/admin/create-admin', verifyToken, async (req, res) => {
    if (req.user.role !== 'superadmin') return res.status(403).json({ message: 'Hanya Superadmin yang dapat melakukan ini.' });

    const { name, email, password, phone_number } = req.body;
    try {
        const [existing] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
        if (existing.length > 0) return res.status(400).json({ message: 'Email sudah terdaftar.' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        await db.query(
            'INSERT INTO users (name, email, password, role, is_verified, phone_number) VALUES (?, ?, ?, ?, ?, ?)',
            [name, email, hashedPassword, 'admin', true, phone_number || null]
        );

        res.json({ message: 'Akun admin berhasil dibuat.' });
    } catch (error) {
        res.status(500).json({ message: 'Gagal membuat admin. Detail: ' + (error.message || error) });
    }
});

app.post('/admin/create-client', verifyToken, async (req, res) => {
    if (req.user.role === 'client') return res.status(403).json({ message: 'Akses ditolak.' });

    const { name, email, password, phone_number } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'Nama, email, dan kata sandi wajib diisi.' });

    try {
        const [existing] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
        if (existing.length > 0) return res.status(400).json({ message: 'Email sudah terdaftar.' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        await db.query(
            'INSERT INTO users (name, email, password, role, is_verified, phone_number) VALUES (?, ?, ?, ?, ?, ?)',
            [name, email, hashedPassword, 'client', true, phone_number || null]
        );

        res.json({ message: 'Akun klien berhasil dibuat.' });
    } catch (error) {
        res.status(500).json({ message: 'Gagal membuat klien. Detail: ' + (error.message || error) });
    }
});

// Download document from GCS as a direct attachment
app.get('/documents/:id/download', verifyToken, async (req, res) => {
    try {
        const [docs] = await db.query('SELECT * FROM documents WHERE id = ?', [req.params.id]);
        if (docs.length === 0) return res.status(404).json({ message: 'Dokumen tidak ditemukan.' });

        const doc = docs[0];

        // For Google Drive links, just redirect
        if (doc.type === 'gdrive') {
            return res.redirect(doc.file_path);
        }

        // Extract filename from GCS URL
        const urlParts = doc.file_path.split('/');
        const filename = urlParts[urlParts.length - 1];

        res.setHeader('Content-Disposition', `attachment; filename="${doc.title || filename}"`);
        res.setHeader('Content-Type', 'application/octet-stream');

        const fileStream = bucket.file(filename).createReadStream();
        fileStream.on('error', (err) => {
            console.error('GCS stream error:', err);
            if (!res.headersSent) res.status(500).json({ message: 'Gagal mengunduh berkas.' });
        });
        fileStream.pipe(res);
    } catch (error) {
        res.status(500).json({ message: 'Gagal mengunduh dokumen. Detail: ' + (error.message || error) });
    }
});

// --- SETTINGS API ---
// Public: get calendar embed URL for the reservation page
app.get('/settings/calendar', async (req, res) => {
    try {
        const [rows] = await db.query("SELECT value FROM settings WHERE key_name = 'calendar_embed_url'");
        const url = rows.length > 0 ? rows[0].value : '';
        res.json({ calendar_embed_url: url });
    } catch (error) {
        res.status(500).json({ message: 'Gagal mengambil pengaturan. Detail: ' + (error.message || error) });
    }
});

// Admin/Superadmin only: update calendar embed URL (atomic UPSERT prevents race conditions)
app.put('/settings/calendar', verifyToken, async (req, res) => {
    if (req.user.role === 'client') return res.status(403).json({ message: 'Akses ditolak.' });
    const { calendar_embed_url } = req.body;
    if (typeof calendar_embed_url === 'undefined') return res.status(400).json({ message: 'calendar_embed_url wajib disertakan.' });

    try {
        const APP_MODE = process.env.APP_MODE || 'deployment';
        if (APP_MODE === 'local_xampp') {
            // MySQL: atomic upsert via INSERT ... ON DUPLICATE KEY UPDATE
            await db.query(
                "INSERT INTO settings (key_name, value) VALUES ('calendar_embed_url', ?) ON DUPLICATE KEY UPDATE value = VALUES(value), updated_at = CURRENT_TIMESTAMP",
                [calendar_embed_url]
            );
        } else {
            // Azure SQL T-SQL: atomic MERGE (single statement — no race condition possible)
            await db.query(
                "MERGE INTO settings AS t USING (SELECT 'calendar_embed_url' AS key_name, ? AS value) AS s ON t.key_name = s.key_name WHEN MATCHED THEN UPDATE SET t.value = s.value, t.updated_at = CURRENT_TIMESTAMP WHEN NOT MATCHED THEN INSERT (key_name, value) VALUES (s.key_name, s.value);",
                [calendar_embed_url]
            );
        }
        res.json({ message: 'Tautan Google Calendar berhasil disimpan.' });
    } catch (error) {
        res.status(500).json({ message: 'Gagal menyimpan pengaturan. Detail: ' + (error.message || error) });
    }
});

// --- ACCOUNT & USER API ---
app.post('/account/request-delete', verifyToken, async (req, res) => {
    try {
        if (req.user.role === 'superadmin') {
            return res.status(403).json({ message: 'Superadmin tidak dapat dihapus.' });
        }
        await db.query('UPDATE users SET delete_requested = 1 WHERE id = ?', [req.user.id]);
        res.json({ message: 'Permintaan penghapusan akun telah dikirim dan menunggu persetujuan.' });
    } catch (error) {
        res.status(500).json({ message: 'Gagal mengajukan penghapusan akun. Detail: ' + (error.message || error) });
    }
});

app.get('/account/delete-requests', verifyToken, async (req, res) => {
    if (req.user.role === 'client') return res.status(403).json({ message: 'Akses ditolak.' });

    try {
        let query = '';
        if (req.user.role === 'admin') {
            // Admin only sees client requests
            query = "SELECT id, name, email, role FROM users WHERE delete_requested = 1 AND role = 'client'";
        } else if (req.user.role === 'superadmin') {
            // Superadmin sees admin and client requests
            query = "SELECT id, name, email, role FROM users WHERE delete_requested = 1 AND role != 'superadmin'";
        }

        const [requests] = await db.query(query);
        res.json(requests);
    } catch (error) {
        res.status(500).json({ message: 'Gagal mengambil data permintaan. Detail: ' + (error.message || error) });
    }
});

app.delete('/account/:id', verifyToken, async (req, res) => {
    if (req.user.role === 'client') return res.status(403).json({ message: 'Akses ditolak.' });

    try {
        const [targetUser] = await db.query('SELECT role FROM users WHERE id = ?', [req.params.id]);
        if (targetUser.length === 0) return res.status(404).json({ message: 'Pengguna tidak ditemukan.' });

        // Admin cannot delete another Admin
        if (req.user.role === 'admin' && targetUser[0].role !== 'client') {
            return res.status(403).json({ message: 'Admin hanya dapat menghapus Client.' });
        }

        await db.query('DELETE FROM users WHERE id = ?', [req.params.id]);
        res.json({ message: 'Akun berhasil dihapus permanen.' });
    } catch (error) {
        res.status(500).json({ message: 'Gagal menghapus akun. Detail: ' + (error.message || error) });
    }
});

app.get('/users/clients', verifyToken, async (req, res) => {
    if (req.user.role === 'client') return res.status(403).json({ message: 'Akses ditolak.' });
    try {
        const [clients] = await db.query("SELECT id, name, email FROM users WHERE role = 'client'");
        res.json(clients);
    } catch (error) {
        res.status(500).json({ message: 'Gagal mengambil daftar klien. Detail: ' + (error.message || error) });
    }
});

app.get('/users/admins', verifyToken, async (req, res) => {
    try {
        const [admins] = await db.query("SELECT id, name, email, phone_number, role FROM users WHERE role IN ('admin', 'superadmin')");
        res.json(admins);
    } catch (error) {
        res.status(500).json({ message: 'Gagal mengambil daftar admin. Detail: ' + (error.message || error) });
    }
});

// --- PROJECTS API ---
const STATUS_PERCENTAGES = {
    'Konsultasi': 10,
    'Desain': 30,
    'Pengadaan': 60,
    'Pemasangan': 90,
    'Selesai': 100
};
app.post('/projects', verifyToken, async (req, res) => {
    try {
        const { client_id, title, status, pic_id } = req.body;

        // Clients can create project requests
        if (req.user.role === 'client') {
            await db.query(
                'INSERT INTO projects (client_id, title, status, progress_percentage) VALUES (?, ?, ?, ?)',
                [req.user.id, title, 'Konsultasi', 10]
            );
            
            // Notify Admin
            const [adminResult] = await db.query('SELECT email FROM users WHERE role = "admin" OR role = "superadmin" LIMIT 1');
            if (adminResult.length > 0) {
                await transporter.sendMail({
                    from: '"Kitchen Connection" <noreply@kitchenconnection.id>',
                    to: adminResult[0].email,
                    subject: `Permintaan Proyek Baru - ${title}`,
                    html: `<p>Ada permintaan proyek baru dari klien: <strong>${req.user.name}</strong></p>
                           <p>Judul: ${title}</p>
                           <p>Silakan periksa dashboard admin untuk detailnya.</p>`
                });
            }
            return res.json({ message: 'Permintaan proyek berhasil dibuat. Silakan buat reservasi.' });
        }

        // Admins can create projects for clients
        if (!client_id || !title) return res.status(400).json({ message: 'Klien dan Judul wajib diisi.' });

        const finalStatus = status || 'Konsultasi';
        const progress = STATUS_PERCENTAGES[finalStatus] || 10;

        await db.query(
            'INSERT INTO projects (client_id, title, status, progress_percentage, pic_id) VALUES (?, ?, ?, ?, ?)',
            [client_id, title, finalStatus, progress, pic_id || null]
        );

        // Send email to client
        const [clientResult] = await db.query('SELECT email, name FROM users WHERE id = ?', [client_id]);
        if (clientResult.length > 0) {
            const client = clientResult[0];
            await transporter.sendMail({
                from: '"Kitchen Connection" <noreply@kitchenconnection.id>',
                to: client.email,
                subject: `Proyek Baru: ${title}`,
                html: `<p>Halo ${client.name},</p>
                       <p>Proyek baru "<strong>${title}</strong>" telah ditambahkan ke akun Anda.</p>
                       <p>Status saat ini: <strong style="color: maroon;">${finalStatus}</strong> (${progress}%).</p>
                       <p>Silakan masuk ke portal klien untuk melihat detail selengkapnya.</p>
                       <br>
                       <p>Salam hangat,<br>Tim Kitchen Connection</p>`
            });
        }

        res.json({ message: 'Proyek berhasil ditambahkan.' });
    } catch (error) {
        res.status(500).json({ message: 'Gagal membuat proyek. Detail: ' + (error.message || error) });
    }
});

app.put('/projects/:id', verifyToken, async (req, res) => {
    if (req.user.role === 'client') return res.status(403).json({ message: 'Akses ditolak.' });

    const { title, status, pic_id } = req.body;
    try {
        // Get old project data
        const [oldProjectResult] = await db.query('SELECT status, client_id, title FROM projects WHERE id = ?', [req.params.id]);
        if (oldProjectResult.length === 0) return res.status(404).json({ message: 'Proyek tidak ditemukan.' });
        const oldProject = oldProjectResult[0];

        const progress = STATUS_PERCENTAGES[status] || 10;
        await db.query(
            'UPDATE projects SET title = ?, status = ?, progress_percentage = ?, pic_id = ? WHERE id = ?',
            [title, status, progress, pic_id || null, req.params.id]
        );

        // Send email if status changed
        if (oldProject.status !== status) {
            const [clientResult] = await db.query('SELECT email, name FROM users WHERE id = ?', [oldProject.client_id]);
            if (clientResult.length > 0) {
                const client = clientResult[0];
                await transporter.sendMail({
                    from: '"Kitchen Connection" <noreply@kitchenconnection.id>',
                    to: client.email,
                    subject: `Pembaruan Status Proyek - ${title || oldProject.title}`,
                    html: `<p>Halo ${client.name},</p>
                           <p>Status proyek Anda "<strong>${title || oldProject.title}</strong>" telah diperbarui menjadi: <strong style="color: maroon;">${status}</strong> (${progress}%).</p>
                           <p>Silakan masuk ke portal klien untuk melihat detail selengkapnya.</p>
                           <br>
                           <p>Salam hangat,<br>Tim Kitchen Connection</p>`
                });
            }
        }

        res.json({ message: 'Proyek berhasil diperbarui.' });
    } catch (error) {
        res.status(500).json({ message: 'Gagal memperbarui proyek. Detail: ' + (error.message || error) });
    }
});

app.delete('/projects/:id', verifyToken, async (req, res) => {
    if (req.user.role === 'client') return res.status(403).json({ message: 'Akses ditolak.' });

    try {
        await db.query('UPDATE projects SET archived_at = CURRENT_TIMESTAMP WHERE id = ?', [req.params.id]);
        res.json({ message: 'Proyek berhasil diarsipkan.' });
    } catch (error) {
        res.status(500).json({ message: 'Gagal mengarsipkan proyek. Detail: ' + (error.message || error) });
    }
});

// --- DOCUMENTS API ---
app.get('/projects/:id/documents', verifyToken, async (req, res) => {
    try {
        const [documents] = await db.query('SELECT * FROM documents WHERE project_id = ? ORDER BY uploaded_at DESC', [req.params.id]);
        res.json(documents);
    } catch (error) {
        res.status(500).json({ message: 'Gagal mengambil dokumen. Detail: ' + (error.message || error) });
    }
});

app.delete('/documents/:id', verifyToken, async (req, res) => {
    if (req.user.role === 'client') return res.status(403).json({ message: 'Akses ditolak.' });

    try {
        // First, fetch the document to get the file path
        const [docs] = await db.query('SELECT * FROM documents WHERE id = ?', [req.params.id]);
        if (docs.length === 0) return res.status(404).json({ message: 'Dokumen tidak ditemukan.' });

        const doc = docs[0];

        // Delete from GCS if it's a real uploaded file (not a Google Drive link)
        if (doc.type !== 'gdrive' && doc.file_path) {
            try {
                // Extract filename from URL: https://storage.googleapis.com/bucket/filename.ext
                const urlParts = doc.file_path.split('/');
                const filename = urlParts[urlParts.length - 1];
                await bucket.file(filename).delete();
            } catch (gcsErr) {
                // Log but don't fail — DB record should still be deleted
                console.warn('GCS deletion warning:', gcsErr.message);
            }
        }

        await db.query('DELETE FROM documents WHERE id = ?', [req.params.id]);
        res.json({ message: 'Dokumen berhasil dihapus.' });
    } catch (error) {
        res.status(500).json({ message: 'Gagal menghapus dokumen. Detail: ' + (error.message || error) });
    }
});


// Validate Google Drive Link
app.post('/documents/validate-drive', verifyToken, async (req, res) => {
    const { link } = req.body;
    if (!link) return res.status(400).json({ message: 'Link tidak boleh kosong.' });

    try {
        // Simple check if it's a google drive link
        if (!link.includes('drive.google.com')) {
            return res.status(400).json({ message: 'Bukan tautan Google Drive yang valid.' });
        }

        // Try fetching it to see if it redirects to a login page or returns 401/403/404
        // Google Drive public links generally return 200 OK. Private links redirect to ServiceLogin.
        const response = await axios.get(link, { maxRedirects: 0, validateStatus: null });

        // If it redirects to login or accounts.google.com, it's private.
        if (response.status >= 300 && response.status < 400 && response.headers.location && response.headers.location.includes('ServiceLogin')) {
            return res.status(403).json({ message: 'Tautan Google Drive Anda di-private. Ubah akses menjadi "Anyone with the link".' });
        }
        if (response.status === 401 || response.status === 403 || response.status === 404) {
            return res.status(403).json({ message: 'Tautan Google Drive tidak dapat diakses publik.' });
        }

        res.json({ message: 'Tautan valid dan publik.' });
    } catch (error) {
        console.error('Drive validation error:', error.message);
        res.status(500).json({ message: 'Gagal memvalidasi tautan. Detail: ' + (error.message || error) });
    }
});

app.post('/documents', verifyToken, upload.single('document'), async (req, res) => {
    if (req.user.role === 'client') return res.status(403).json({ message: 'Akses ditolak.' });

    try {
        const { project_id, project_title, document_title, drive_link } = req.body;

        if (!project_id || !project_title || !document_title) {
            return res.status(400).json({ message: 'Data tidak lengkap.' });
        }

        let fileUrl = '';
        let fileType = 'other';

        // IF USING GOOGLE DRIVE LINK
        if (drive_link) {
            fileUrl = drive_link;
            fileType = 'gdrive';
        }
        // IF UPLOADING FILE TO GCS
        else if (req.file) {
            let fileBuffer = req.file.buffer;
            let ext = path.extname(req.file.originalname).toLowerCase();
            const mimeType = req.file.mimetype;

            // Compress if it's an image
            if (mimeType.startsWith('image/')) {
                // Resize and compress with sharp
                fileBuffer = await sharp(fileBuffer)
                    .resize(1920, 1920, { fit: 'inside', withoutEnlargement: true })
                    .jpeg({ quality: 80 })
                    .toBuffer();
                ext = '.jpg';
            }

            const cleanDocTitle = document_title.replace(/\s+/g, '_').replace(/[<>:"/\\|?*]/g, '');
            const cleanProjTitle = project_title.replace(/\s+/g, '_').replace(/[<>:"/\\|?*]/g, '');
            const newFileName = `${cleanDocTitle}-${cleanProjTitle}-${Date.now()}${ext}`;

            // Upload to GCS
            const blob = bucket.file(newFileName);
            const blobStream = blob.createWriteStream({
                resumable: false,
                contentType: mimeType.startsWith('image/') ? 'image/jpeg' : mimeType,
            });

            await new Promise((resolve, reject) => {
                blobStream.on('error', (err) => reject(err));
                blobStream.on('finish', () => resolve());
                blobStream.end(fileBuffer);
            });

            fileUrl = `https://storage.googleapis.com/${bucketName}/${newFileName}`;
            fileType = mimeType.startsWith('image/') ? 'image' : 'document';
        } else {
            return res.status(400).json({ message: 'Harus mengunggah file atau memberikan tautan Google Drive.' });
        }

        await db.query(
            'INSERT INTO documents (project_id, title, file_path, type) VALUES (?, ?, ?, ?)',
            [project_id, document_title, fileUrl, fileType]
        );

        res.json({ message: 'Dokumen berhasil ditambahkan.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Gagal memproses dokumen. Detail: ' + (error.message || error) });
    }
});

// --- EQUIPMENTS API ---
app.get('/equipments', async (req, res) => {
    try {
        const [equipments] = await db.query('SELECT * FROM equipments');
        res.json(equipments);
    } catch (error) {
        res.status(500).json({ message: 'Gagal mengambil data katalog Detail: ' + (error.message || error) });
    }
});

app.post('/equipments', verifyToken, async (req, res) => {
    if (req.user.role === 'client') return res.status(403).json({ message: 'Akses ditolak.' });

    const { name, category, type, dimensions, power, capacity, description, image_url } = req.body;
    try {
        await db.query(
            'INSERT INTO equipments (name, category, type, dimensions, power, capacity, description, image_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [name, category, type, dimensions, power, capacity, description, image_url]
        );
        res.json({ message: 'Peralatan berhasil ditambahkan.' });
    } catch (error) {
        res.status(500).json({ message: 'Gagal menambahkan peralatan. Detail: ' + (error.message || error) });
    }
});

app.put('/equipments/:id', verifyToken, async (req, res) => {
    if (req.user.role === 'client') return res.status(403).json({ message: 'Akses ditolak.' });

    const { name, category, type, dimensions, power, capacity, description, image_url } = req.body;
    try {
        await db.query(
            'UPDATE equipments SET name=?, category=?, type=?, dimensions=?, power=?, capacity=?, description=?, image_url=? WHERE id=?',
            [name, category, type, dimensions, power, capacity, description, image_url, req.params.id]
        );
        res.json({ message: 'Peralatan berhasil diperbarui.' });
    } catch (error) {
        res.status(500).json({ message: 'Gagal memperbarui peralatan. Detail: ' + (error.message || error) });
    }
});

app.delete('/equipments/:id', verifyToken, async (req, res) => {
    if (req.user.role === 'client') return res.status(403).json({ message: 'Akses ditolak.' });

    try {
        await db.query('DELETE FROM equipments WHERE id = ?', [req.params.id]);
        res.json({ message: 'Peralatan berhasil dihapus.' });
    } catch (error) {
        res.status(500).json({ message: 'Gagal menghapus peralatan. Detail: ' + (error.message || error) });
    }
});

// --- RESERVATIONS API ---
app.post('/reservations', async (req, res) => {
    const { client_name, client_email, date, time_slot, notes } = req.body;
    try {
        await db.query(
            'INSERT INTO reservations (client_name, client_email, date, time_slot, notes) VALUES (?, ?, ?, ?, ?)',
            [client_name, client_email, date, time_slot, notes]
        );

        // Notify client
        await transporter.sendMail({
            from: '"Kitchen Connection" <noreply@kitchenconnection.id>',
            to: client_email,
            subject: 'Konfirmasi Reservasi Konsultasi',
            html: `<p>Halo ${client_name},</p>
                   <p>Terima kasih. Permintaan reservasi Anda pada <strong>${date}</strong> jam <strong>${time_slot}</strong> telah kami terima dan saat ini berstatus <strong>Pending</strong>.</p>
                   <p>Tim kami akan segera menghubungi Anda untuk konfirmasi lebih lanjut.</p>
                   <br>
                   <p>Salam hangat,<br>Tim Kitchen Connection</p>`
        });

        // Notify admin and superadmin
        const [superadmins] = await db.query('SELECT email FROM users WHERE role = "superadmin"');
        const [admins] = await db.query('SELECT email FROM users WHERE role = "admin"');
        
        let toEmails = superadmins.map(u => u.email).join(',');
        let ccEmails = admins.map(u => u.email).join(',');
        
        if (!toEmails) {
            toEmails = ccEmails;
            ccEmails = '';
        }

        if (toEmails) {
            await transporter.sendMail({
                from: '"Kitchen Connection" <noreply@kitchenconnection.id>',
                to: toEmails,
                cc: ccEmails,
                subject: 'Reservasi Baru Masuk',
                html: `<p>Reservasi baru dari <strong>${client_name}</strong> (${client_email}).</p>
                       <p>Tanggal: ${date}<br>Jam: ${time_slot}</p>
                       <p>Catatan: ${notes}</p>
                       <p>Silakan cek dashboard admin untuk menindaklanjuti.</p>`
            });
        }

        res.json({ message: 'Reservasi berhasil dibuat!' });
    } catch (error) {
        res.status(500).json({ message: 'Gagal membuat reservasi Detail: ' + (error.message || error) });
    }
});

// --- DASHBOARD API (Client) ---
app.get('/dashboard/client', verifyToken, async (req, res) => {
    if (req.user.role !== 'client') return res.status(403).json({ message: 'Akses ditolak' });

    try {
        const [projects] = await db.query(`
            SELECT p.*, pic.name as pic_name, pic.phone_number as pic_phone
            FROM projects p
            LEFT JOIN users pic ON p.pic_id = pic.id
            WHERE p.client_id = ?
        `, [req.user.id]);

        let documents = [];
        if (projects.length > 0) {
            const [docs] = await db.query('SELECT * FROM documents WHERE project_id = ?', [projects[0].id]);
            documents = docs;
        }

        res.json({ projects, documents });
    } catch (error) {
        res.status(500).json({ message: 'Gagal mengambil data dashboard Detail: ' + (error.message || error) });
    }
});

// --- DASHBOARD API (Admin/Superadmin) ---
app.get('/dashboard/admin', verifyToken, async (req, res) => {
    if (req.user.role === 'client') return res.status(403).json({ message: 'Akses ditolak. Khusus Admin.' });

    try {
        const [projects] = await db.query(`
            SELECT p.*, u.name as client_name, pic.name as pic_name, pic.phone_number as pic_phone
            FROM projects p 
            JOIN users u ON p.client_id = u.id
            LEFT JOIN users pic ON p.pic_id = pic.id
            ORDER BY p.archived_at ASC, p.created_at DESC
        `);
        const [equipments] = await db.query('SELECT COUNT(*) as count FROM equipments');
        const [reservations] = await db.query("SELECT COUNT(*) as count FROM reservations WHERE status = 'pending'");

        res.json({
            projects,
            stats: {
                totalProjects: projects.length,
                pendingReservations: reservations[0].count,
                totalEquipments: equipments[0].count
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Gagal mengambil data admin Detail: ' + (error.message || error) });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
