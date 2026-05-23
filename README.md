<div align="center">

# 🍳 Kitchen Connection

**Platform konsultasi F&B profesional untuk desain dan manajemen dapur komersial**

[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js&logoColor=white)](https://nodejs.org)
[![Vite](https://img.shields.io/badge/Frontend-Vite-646CFF?logo=vite&logoColor=white)](https://vitejs.dev)
[![Aiven for MySQL](https://img.shields.io/badge/Database-MySQL-4479A1?logo=mysql&logoColor=white)](https://aiven.io/)
[![Google Cloud](https://img.shields.io/badge/Hosting-Cloud%20Run-4285F4?logo=googlecloud&logoColor=white)](https://cloud.google.com/run)

[Demo Langsung](https://kitchenconnection.id) · [Laporkan Bug](https://github.com/Maple06/kitchen_connection/issues) · [Ajukan Fitur](https://github.com/Maple06/kitchen_connection/issues)

</div>

---

## 📋 Gambaran Umum

**Kitchen Connection** adalah portal konsultasi untuk bisnis F&B (Food & Beverage). Platform ini menyediakan portal profesional bagi klien untuk memantau proyek desain dapur, menjelajahi katalog peralatan, dan memesan konsultasi sekaligus memberikan konsol manajemen yang kuat bagi admin untuk mengawasi proyek, dokumen, dan reservasi.

## ✨ Fitur

### 👤 Untuk Klien
- **Dashboard Proyek**: Pemantauan progres real-time dengan progress bar visual
- **Akses Dokumen**: Unduh file desain, laporan kepatuhan, dan dokumen proyek
- **Katalog Peralatan**: Jelajahi dan filter peralatan dapur komersial
- **Reservasi Online**: Pesan slot konsultasi via Google Calendar terintegrasi
- **Checklist Keamanan**: Alat checklist kepatuhan interaktif
- **Manajemen Akun**: Perbarui kata sandi, ajukan penghapusan akun

### 🛠 Untuk Admin / Superadmin
- **Manajemen Proyek**: Buat, perbarui, arsipkan proyek dengan pipeline status
- **Manajemen Dokumen**: Unggah file ke GCS atau tautkan dokumen Google Drive
- **Manajemen Klien & Admin**: Buat akun, kelola permintaan penghapusan
- **CRUD Peralatan**: Manajemen katalog lengkap
- **Ikhtisar Reservasi**: Lihat dan kelola pemesanan konsultasi yang tertunda
- **Pengaturan Kalender**: Perbarui URL embed Google Calendar dari konsol

### 🔐 Sistem Role
| Role | Akses |
|---|---|
| `superadmin` | Akses penuh — kelola admin, klien, semua proyek |
| `admin` | Kelola klien & proyek, unggah dokumen |
| `client` | Lihat proyek sendiri, unduh dokumen, buat reservasi |

---

## 🏗 Arsitektur

```
kitchen_connection/
├── client/                  # SPA Vite + Vanilla JS
│   ├── src/
│   │   ├── views/           # Renderer halaman (home, dashboard, admin, dll.)
│   │   ├── main.js          # Hash router + state autentikasi
│   │   ├── config.js        # URL API dinamis (lokal vs produksi)
│   │   └── style.css        # TailwindCSS v4 + token kustom
│   └── index.html           # Shell HTML tunggal + navbar
│
├── server/                  # REST API Express.js
│   ├── index.js             # Semua route & middleware
│   ├── db.js                # Koneksi DB (MySQL via mysql2)
│   ├── init_db.js           # (Opsional) inisialisasi skema untuk lokal
│   └── seed.js              # Seeder (backup lokal + reset tabel + seed)
│
├── Dockerfile.client        # Server file statis Nginx
├── Dockerfile.server        # Container API Node.js
├── nginx.conf               # Konfigurasi Nginx (SPA routing)
├── deploy.ps1               # Skrip deployment interaktif
├── deploy.env               # Konfigurasi deployment (gitignored)
└── deploy.env.example       # Template konfigurasi deployment
```

### Teknologi yang Digunakan

| Lapisan | Teknologi |
|---|---|
| **Frontend** | Vite, Vanilla JS, TailwindCSS v4 |
| **Backend** | Node.js, Express.js v5 |
| **Database** | MySQL (Aiven untuk produksi) / MySQL (lokal) |
| **Penyimpanan File** | Google Cloud Storage |
| **Autentikasi** | JWT (HTTP-only cookies) |
| **Email** | Brevo (SMTP relay) |
| **Hosting** | Google Cloud Run (container) |
| **Registry** | Google Container Registry |

---

## 🚀 Memulai

### Prasyarat

- Node.js `>= 18`
- Docker Desktop
- Google Cloud SDK (`gcloud`)
- MySQL lokal (opsional) atau Aiven MySQL

### 1. Clone Repositori

```bash
git clone https://github.com/yourrepo/kitchen_connection.git
cd kitchen_connection
```

### 2. Konfigurasi Environment Server

> Ringkas:
> - `server/.env` dipakai saat menjalankan server **secara lokal**.
> - `env.yaml` dipakai saat **deploy** ke Cloud Run via `--env-vars-file`.

```bash
cp server/.env.example server/.env
```

Edit `server/.env`:

```env
# Mode aplikasi
APP_MODE=local                # local / deployment

# MySQL (lokal atau Aiven)
DB_SERVER=localhost           # atau host Aiven
DB_PORT=3306                  # atau port Aiven
DB_USER=root
DB_PASSWORD=
DB_NAME=kitchenconnection

# Aplikasi
FRONTEND_URL=http://localhost:5173
JWT_SECRET=your_super_secret_key

# Email (Brevo)
BREVO_USER=your@email.com
BREVO_PASS=your_brevo_api_key
```

### 3. Inisialisasi & Seed Database

> ⚠️ `npm run seed` bersifat **destruktif**: seeder akan melakukan backup data ke file JSON lokal (tersimpan di folder `server/backup-*.json`), lalu me-reset tabel (drop & recreate) dan mengisi ulang data contoh.

```bash
cd server
npm install
npm run seed      # Backup lokal + reset tabel + seed data contoh

# (opsional) jika ingin hanya inisialisasi skema lokal
# npm run init-db

```

#### Seed Aiven menggunakan `env.yaml` (deployment)

Jika Anda menyimpan variabel produksi di `env.yaml` (root project) untuk Cloud Run, Anda bisa seed Aiven **sekali** dari root:

```powershell
./seed.ps1
```

### 4. Jalankan Backend

```bash
# Dari folder /server
npm start
# API berjalan di http://localhost:5000
```

### 5. Jalankan Frontend

```bash
cd client
npm install
npm run dev
# Aplikasi berjalan di http://localhost:5173
```

---

## 🌐 Deployment (Google Cloud Run)

### 1. Konfigurasi Variabel Deployment

```bash
cp deploy.env.example deploy.env
```

Edit `deploy.env` dengan detail proyek GCP Anda:

```env
GCP_PROJECT_ID=your-project-id
GCP_REGION=asia-southeast1
GCP_REGISTRY=gcr.io
SERVICE_CLIENT=kitchen-connection
SERVICE_SERVER=kitchen-connection-api
IMAGE_CLIENT=kitchen-connection-client
IMAGE_SERVER=kitchen-connection-server
SERVER_ENV_FILE=env.yaml
```

### 2. Konfigurasi Environment Server untuk Produksi

Buat file `env.yaml` (gitignored — **jangan di-commit**):

```yaml
APP_MODE: "deployment"
DB_SERVER: "your-aiven-host.aivencloud.com"
DB_USER: "avnadmin"
DB_PASSWORD: "your_password"
DB_NAME: "defaultdb"
DB_PORT: "15530"
FRONTEND_URL: "https://your-client-url.run.app"
JWT_SECRET: "your_secret"
BREVO_USER: "your@email.com"
BREVO_PASS: "your_brevo_key"
```

### Endpoint Health Check (UptimeRobot)

API menyediakan endpoint ringan untuk monitoring:

- `GET /ping` → melakukan `SELECT 1` ke DB dan mengembalikan `{ ok: true }` jika sehat.

### Catatan: Error izin image / beda project

Jika deploy Cloud Run gagal dengan error seperti “service-xxxxx@serverless-robot-prod.iam.gserviceaccount.com must have permission to read the image”, biasanya karena image berada di project berbeda dari target deploy. Pastikan `GCP_PROJECT_ID` di `deploy.env` adalah project yang sama dengan image registry, atau berikan izin read Artifact Registry ke Cloud Run service agent project target.

### 3. Jalankan Skrip Deployment

```powershell
.\deploy.ps1
```

Pilih dari menu interaktif:
```
1. Deploy Client (Frontend) Only
2. Deploy Server (API) Only
3. Deploy Both (Client & Server)
```

---

## 🔑 Kredensial Default (Data Seed)

> ⚠️ Segera ubah kredensial ini setelah login pertama di lingkungan produksi.

| Role | Email | Kata Sandi |
|---|---|---|
| Superadmin | `malendra@kitchenconnection.id` | `password123` |
| Admin | `sara@kitchenconnection.id` | `password123` |
| Klien | `john@example.com` | `password123` |

---

## 📜 Lisensi

Proyek ini bersifat privat dan merupakan milik eksklusif Kitchen Connection.

---

<div align="center">
Dibuat oleh TriNetra
</div>