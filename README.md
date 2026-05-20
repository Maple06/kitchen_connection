<div align="center">

# 🍳 Kitchen Connection

**Platform konsultasi F&B profesional untuk desain dan manajemen dapur komersial**

[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js&logoColor=white)](https://nodejs.org)
[![Vite](https://img.shields.io/badge/Frontend-Vite-646CFF?logo=vite&logoColor=white)](https://vitejs.dev)
[![Azure SQL](https://img.shields.io/badge/Database-Azure%20SQL-0078D4)](https://azure.microsoft.com/en-us/products/azure-sql/database)
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
│   ├── db.js                # Adaptor DB multi-mode (Azure SQL / MySQL)
│   ├── init_db.js           # Inisialisasi skema
│   └── seed.js              # Data awal (seed)
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
| **Database** | Azure SQL (produksi) / MySQL XAMPP (lokal) |
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
- XAMPP (untuk mode MySQL lokal) atau akses Azure SQL

### 1. Clone Repositori

```bash
git clone https://github.com/yourrepo/kitchen_connection.git
cd kitchen_connection
```

### 2. Konfigurasi Environment Server

```bash
cp server/.env.example server/.env
```

Edit `server/.env`:

```env
# Mode database (pilih salah satu)
APP_MODE=local_xampp          # atau: local_azure / deployment

# Azure SQL (jika menggunakan local_azure atau deployment)
DB_SERVER=your-server.database.windows.net
DB_USER=your_user
DB_PASSWORD=your_password
DB_NAME=kitchenconnection
DB_PORT=1433

# MySQL / XAMPP (jika menggunakan local_xampp)
DB_HOST=localhost
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

```bash
cd server
npm install
npm run init-db   # Membuat tabel
npm run seed      # Mengisi data awal
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
DB_SERVER: "your-server.database.windows.net"
DB_USER: "your_user"
DB_PASSWORD: "your_password"
DB_NAME: "kitchenconnection"
DB_PORT: "1433"
FRONTEND_URL: "https://your-client-url.run.app"
JWT_SECRET: "your_secret"
BREVO_USER: "your@email.com"
BREVO_PASS: "your_brevo_key"
```

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
| Superadmin | `superadmin@kitchenconnection.com` | `superadmin123` |
| Admin | `admin@kitchenconnection.com` | `admin123` |
| Klien | `client@kitchenconnection.com` | `client123` |

---

## 📜 Lisensi

Proyek ini bersifat privat dan merupakan milik eksklusif Kitchen Connection.

---

<div align="center">
Dibuat oleh TriNetra
</div>