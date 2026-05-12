const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const multer = require('multer');
const fs = require('fs');
const db = require('./db');
require('dotenv').config();

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

// Multer setup
const upload = multer({ dest: 'uploads/' });

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey123';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

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
    origin: FRONTEND_URL,
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

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
app.post('/api/auth/register', async (req, res) => {
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
        res.status(500).json({ message: 'Terjadi kesalahan server saat mendaftar.' });
    }
});

// Verify Email
app.post('/api/auth/verify', async (req, res) => {
    const { token } = req.body;
    try {
        const [users] = await db.query('SELECT id FROM users WHERE verification_token = ?', [token]);
        if (users.length === 0) return res.status(400).json({ message: 'Token tidak valid atau sudah digunakan.' });

        await db.query('UPDATE users SET is_verified = true, verification_token = NULL WHERE id = ?', [users[0].id]);
        res.json({ message: 'Email berhasil diverifikasi. Silakan masuk.' });
    } catch (error) {
        res.status(500).json({ message: 'Terjadi kesalahan server.' });
    }
});

// Forgot Password
app.post('/api/auth/forgot-password', async (req, res) => {
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
        res.status(500).json({ message: 'Terjadi kesalahan server.' });
    }
});

// Reset Password
app.post('/api/auth/reset-password', async (req, res) => {
    const { token, newPassword } = req.body;
    try {
        const [users] = await db.query('SELECT id FROM users WHERE reset_token = ?', [token]);
        if (users.length === 0) return res.status(400).json({ message: 'Token tidak valid.' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        await db.query('UPDATE users SET password = ?, reset_token = NULL WHERE id = ?', [hashedPassword, users[0].id]);
        res.json({ message: 'Kata sandi berhasil diubah. Silakan masuk.' });
    } catch (error) {
        res.status(500).json({ message: 'Terjadi kesalahan server.' });
    }
});

// Change Password (Logged In)
app.post('/api/auth/change-password', verifyToken, async (req, res) => {
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
        res.status(500).json({ message: 'Terjadi kesalahan server.' });
    }
});

// Login
app.post('/api/auth/login', async (req, res) => {
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
        res.status(500).json({ message: 'Terjadi kesalahan server.' });
    }
});

app.post('/api/auth/logout', (req, res) => {
    res.clearCookie('token');
    res.json({ message: 'Berhasil logout' });
});

app.get('/api/auth/me', verifyToken, (req, res) => {
    res.json({ user: req.user });
});

// --- ADMIN API ---
app.post('/api/admin/create-admin', verifyToken, async (req, res) => {
    if (req.user.role !== 'superadmin') return res.status(403).json({ message: 'Hanya Superadmin yang dapat melakukan ini.' });

    const { name, email, password } = req.body;
    try {
        const [existing] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
        if (existing.length > 0) return res.status(400).json({ message: 'Email sudah terdaftar.' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        await db.query(
            'INSERT INTO users (name, email, password, role, is_verified) VALUES (?, ?, ?, ?, ?)',
            [name, email, hashedPassword, 'admin', true]
        );

        res.json({ message: 'Akun admin berhasil dibuat.' });
    } catch (error) {
        res.status(500).json({ message: 'Gagal membuat admin.' });
    }
});

// --- ACCOUNT & USER API ---
app.post('/api/account/request-delete', verifyToken, async (req, res) => {
    try {
        if (req.user.role === 'superadmin') {
            return res.status(403).json({ message: 'Superadmin tidak dapat dihapus.' });
        }
        await db.query('UPDATE users SET delete_requested = TRUE WHERE id = ?', [req.user.id]);
        res.json({ message: 'Permintaan penghapusan akun telah dikirim dan menunggu persetujuan.' });
    } catch (error) {
        res.status(500).json({ message: 'Gagal mengajukan penghapusan akun.' });
    }
});

app.get('/api/account/delete-requests', verifyToken, async (req, res) => {
    if (req.user.role === 'client') return res.status(403).json({ message: 'Akses ditolak.' });
    
    try {
        let query = '';
        if (req.user.role === 'admin') {
            // Admin only sees client requests
            query = 'SELECT id, name, email, role FROM users WHERE delete_requested = TRUE AND role = "client"';
        } else if (req.user.role === 'superadmin') {
            // Superadmin sees admin and client requests
            query = 'SELECT id, name, email, role FROM users WHERE delete_requested = TRUE AND role != "superadmin"';
        }
        
        const [requests] = await db.query(query);
        res.json(requests);
    } catch (error) {
        res.status(500).json({ message: 'Gagal mengambil data permintaan.' });
    }
});

app.delete('/api/account/:id', verifyToken, async (req, res) => {
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
        res.status(500).json({ message: 'Gagal menghapus akun.' });
    }
});

app.get('/api/users/clients', verifyToken, async (req, res) => {
    if (req.user.role === 'client') return res.status(403).json({ message: 'Akses ditolak.' });
    try {
        const [clients] = await db.query('SELECT id, name, email FROM users WHERE role = "client"');
        res.json(clients);
    } catch (error) {
        res.status(500).json({ message: 'Gagal mengambil daftar klien.' });
    }
});

// --- PROJECTS API ---
app.post('/api/projects', verifyToken, async (req, res) => {
    try {
        const { client_id, title, status, progress_percentage } = req.body;
        
        // Clients can create project requests
        if (req.user.role === 'client') {
            await db.query(
                'INSERT INTO projects (client_id, title, status, progress_percentage) VALUES (?, ?, ?, ?)',
                [req.user.id, title, 'Menunggu Konsultasi', 0]
            );
            return res.json({ message: 'Permintaan proyek berhasil dibuat. Silakan buat reservasi.' });
        }
        
        // Admins can create projects for clients
        if (!client_id || !title) return res.status(400).json({ message: 'Klien dan Judul wajib diisi.' });
        await db.query(
            'INSERT INTO projects (client_id, title, status, progress_percentage) VALUES (?, ?, ?, ?)',
            [client_id, title, status || 'Persiapan', progress_percentage || 0]
        );
        res.json({ message: 'Proyek berhasil ditambahkan.' });
    } catch (error) {
        res.status(500).json({ message: 'Gagal membuat proyek.' });
    }
});

app.put('/api/projects/:id', verifyToken, async (req, res) => {
    if (req.user.role === 'client') return res.status(403).json({ message: 'Akses ditolak.' });
    
    const { title, status, progress_percentage } = req.body;
    try {
        await db.query(
            'UPDATE projects SET title = ?, status = ?, progress_percentage = ? WHERE id = ?',
            [title, status, progress_percentage, req.params.id]
        );
        res.json({ message: 'Proyek berhasil diperbarui.' });
    } catch (error) {
        res.status(500).json({ message: 'Gagal memperbarui proyek.' });
    }
});

app.delete('/api/projects/:id', verifyToken, async (req, res) => {
    if (req.user.role === 'client') return res.status(403).json({ message: 'Akses ditolak.' });
    
    try {
        await db.query('DELETE FROM projects WHERE id = ?', [req.params.id]);
        res.json({ message: 'Proyek berhasil dihapus.' });
    } catch (error) {
        res.status(500).json({ message: 'Gagal menghapus proyek.' });
    }
});

// --- DOCUMENTS API ---
app.post('/api/documents', verifyToken, upload.single('document'), async (req, res) => {
    if (req.user.role === 'client') return res.status(403).json({ message: 'Akses ditolak.' });
    
    try {
        const { project_id, project_title, document_title } = req.body;
        if (!req.file || !project_id || !project_title || !document_title) {
            if (req.file) fs.unlinkSync(req.file.path);
            return res.status(400).json({ message: 'Data tidak lengkap.' });
        }

        // Sanitize and format filename
        // Replace spaces with underscores, remove potentially dangerous characters for file system but allow common symbols
        const cleanDocTitle = document_title.replace(/\s+/g, '_').replace(/[<>:"/\\|?*]/g, '');
        const cleanProjTitle = project_title.replace(/\s+/g, '_').replace(/[<>:"/\\|?*]/g, '');
        const ext = path.extname(req.file.originalname);
        
        const newFileName = `${cleanDocTitle}-${cleanProjTitle}${ext}`;
        const newFilePath = path.join(uploadsDir, newFileName);

        // Rename the uploaded file
        fs.renameSync(req.file.path, newFilePath);
        
        const fileUrl = `/uploads/${newFileName}`;

        await db.query(
            'INSERT INTO documents (project_id, title, file_path, type) VALUES (?, ?, ?, ?)',
            [project_id, document_title, fileUrl, 'other']
        );

        res.json({ message: 'Dokumen berhasil diunggah.' });
    } catch (error) {
        if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
        res.status(500).json({ message: 'Gagal mengunggah dokumen.' });
    }
});

// --- EQUIPMENTS API ---
app.get('/api/equipments', async (req, res) => {
    try {
        const [equipments] = await db.query('SELECT * FROM equipments');
        res.json(equipments);
    } catch (error) {
        res.status(500).json({ message: 'Gagal mengambil data katalog' });
    }
});

// --- RESERVATIONS API ---
app.post('/api/reservations', async (req, res) => {
    const { client_name, client_email, date, time_slot, notes } = req.body;
    try {
        await db.query(
            'INSERT INTO reservations (client_name, client_email, date, time_slot, notes) VALUES (?, ?, ?, ?, ?)',
            [client_name, client_email, date, time_slot, notes]
        );
        res.json({ message: 'Reservasi berhasil dibuat!' });
    } catch (error) {
        res.status(500).json({ message: 'Gagal membuat reservasi' });
    }
});

// --- DASHBOARD API (Client) ---
app.get('/api/dashboard/client', verifyToken, async (req, res) => {
    if (req.user.role !== 'client') return res.status(403).json({ message: 'Akses ditolak' });

    try {
        const [projects] = await db.query('SELECT * FROM projects WHERE client_id = ?', [req.user.id]);
        
        let documents = [];
        if (projects.length > 0) {
            const [docs] = await db.query('SELECT * FROM documents WHERE project_id = ?', [projects[0].id]);
            documents = docs;
        }

        res.json({ projects, documents });
    } catch (error) {
        res.status(500).json({ message: 'Gagal mengambil data dashboard' });
    }
});

// --- DASHBOARD API (Admin/Superadmin) ---
app.get('/api/dashboard/admin', verifyToken, async (req, res) => {
    if (req.user.role === 'client') return res.status(403).json({ message: 'Akses ditolak. Khusus Admin.' });

    try {
        const [projects] = await db.query(`
            SELECT p.*, u.name as client_name 
            FROM projects p 
            JOIN users u ON p.client_id = u.id
        `);
        const [equipments] = await db.query('SELECT COUNT(*) as count FROM equipments');
        const [reservations] = await db.query('SELECT COUNT(*) as count FROM reservations WHERE status = "pending"');

        res.json({
            projects,
            stats: {
                totalProjects: projects.length,
                pendingReservations: reservations[0].count,
                totalEquipments: equipments[0].count
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Gagal mengambil data admin' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
