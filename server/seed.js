const sql = require('mssql');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const config = {
    server: process.env.DB_SERVER,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: parseInt(process.env.DB_PORT) || 1433,
    options: {
        encrypt: true, // Required for Azure SQL
        trustServerCertificate: false
    }
};

async function runSeed() {
    let pool;
    try {
        console.log('Connecting to Azure SQL Database...');
        pool = await sql.connect(config);
        console.log(`Connected to database: ${config.database}`);

        // ==========================================
        // 1. CREATE TABLES (IF NOT EXIST)
        // ==========================================
        console.log('Verifying table schemas...');

        // Users Table (Replaced AUTO_INCREMENT with IDENTITY, ENUM with CHECK, BOOLEAN with BIT)
        await pool.request().query(`
            IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[users]') AND type in (N'U'))
            BEGIN
                CREATE TABLE users (
                    id INT IDENTITY(1,1) PRIMARY KEY,
                    name VARCHAR(255) NOT NULL,
                    email VARCHAR(255) NOT NULL UNIQUE,
                    password VARCHAR(255),
                    role VARCHAR(50) DEFAULT 'client' CHECK (role IN ('client', 'admin', 'superadmin')),
                    is_verified BIT DEFAULT 0,
                    verification_token VARCHAR(255),
                    reset_token VARCHAR(255),
                    delete_requested BIT DEFAULT 0,
                    google_id VARCHAR(255),
                    phone_number VARCHAR(50),
                    created_at DATETIME2 DEFAULT CURRENT_TIMESTAMP
                );
            END
        `);

        // Projects Table
        await pool.request().query(`
            IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[projects]') AND type in (N'U'))
            BEGIN
                CREATE TABLE projects (
                    id INT IDENTITY(1,1) PRIMARY KEY,
                    client_id INT NOT NULL,
                    title VARCHAR(255) NOT NULL,
                    status VARCHAR(100) DEFAULT 'Konsultasi',
                    progress_percentage INT DEFAULT 0,
                    pic_id INT,
                    archived_at DATETIME2 NULL DEFAULT NULL,
                    created_at DATETIME2 DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (client_id) REFERENCES users(id) ON DELETE CASCADE,
                    FOREIGN KEY (pic_id) REFERENCES users(id) ON DELETE NO ACTION
                );
            END
        `);

        // Documents Table
        await pool.request().query(`
            IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[documents]') AND type in (N'U'))
            BEGIN
                CREATE TABLE documents (
                    id INT IDENTITY(1,1) PRIMARY KEY,
                    project_id INT NOT NULL,
                    title VARCHAR(255) NOT NULL,
                    file_path VARCHAR(500) NOT NULL,
                    type VARCHAR(50) DEFAULT 'other' CHECK (type IN ('blueprint', 'invoice', 'other')),
                    uploaded_at DATETIME2 DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
                );
            END
        `);

        // Equipments Table
        await pool.request().query(`
            IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[equipments]') AND type in (N'U'))
            BEGIN
                CREATE TABLE equipments (
                    id INT IDENTITY(1,1) PRIMARY KEY,
                    name VARCHAR(255) NOT NULL,
                    category VARCHAR(100) NOT NULL,
                    type VARCHAR(50) NOT NULL CHECK (type IN ('commercial', 'home')),
                    dimensions VARCHAR(100),
                    power VARCHAR(100),
                    capacity VARCHAR(100),
                    description NVARCHAR(MAX),
                    image_url VARCHAR(500),
                    created_at DATETIME2 DEFAULT CURRENT_TIMESTAMP
                );
            END
        `);

        // Reservations Table
        await pool.request().query(`
            IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[reservations]') AND type in (N'U'))
            BEGIN
                CREATE TABLE reservations (
                    id INT IDENTITY(1,1) PRIMARY KEY,
                    client_name VARCHAR(255) NOT NULL,
                    client_email VARCHAR(255) NOT NULL,
                    date DATE NOT NULL,
                    time_slot VARCHAR(50) NOT NULL,
                    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
                    notes NVARCHAR(MAX),
                    created_at DATETIME2 DEFAULT CURRENT_TIMESTAMP
                );
            END
        `);

        // Settings Table (key-value store for global app config)
        await pool.request().query(`
            IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[settings]') AND type in (N'U'))
            BEGIN
                CREATE TABLE settings (
                    key_name VARCHAR(100) PRIMARY KEY,
                    value NVARCHAR(MAX),
                    updated_at DATETIME2 DEFAULT CURRENT_TIMESTAMP
                );
            END
        `);

        // Seed default settings (UPSERT — safe to run multiple times)
        await pool.request().query(`
            MERGE INTO settings AS target
            USING (VALUES ('calendar_embed_url', '')) AS source (key_name, value)
            ON target.key_name = source.key_name
            WHEN NOT MATCHED THEN
                INSERT (key_name, value) VALUES (source.key_name, source.value);
        `);

        console.log('✅ Base tables verified.');

        // ==========================================
        // 2. BACKUP DATA
        // ==========================================
        console.log('Creating backup of existing data...');
        try {
            const tablesForBackup = ['documents', 'projects', 'reservations', 'equipments', 'users'];
            const backupData = {};

            for (const table of tablesForBackup) {
                const result = await pool.request().query(`SELECT * FROM dbo.[${table}]`);
                backupData[table] = result.recordset;
            }

            const now = new Date();
            const d = String(now.getDate()).padStart(2, '0');
            const m = now.toLocaleString('default', { month: 'short' });
            const y = now.getFullYear();
            const h = String(now.getHours()).padStart(2, '0');
            const min = String(now.getMinutes()).padStart(2, '0');

            // I'm using a JSON backup file. It's much safer & standard in Node.js compared to generating pure raw SQL text strings manually.
            const backupFilename = `backup-${d}-${m}-${y}-${h}-${min}.json`;
            const backupFile = path.join(__dirname, backupFilename);

            fs.writeFileSync(backupFile, JSON.stringify(backupData, null, 2));
            console.log(`✅ Backup saved to ${backupFile}`);
        } catch (err) {
            console.log('⚠️ Could not backup data (normal if tables are empty/new):', err.message);
        }

        // ==========================================
        // 3. CLEAR OLD DATA
        // ==========================================
        console.log('Clearing database for fresh seed...');
        try {
            await pool.request().query(`
                -- Delete child tables first to respect foreign key constraints
                DELETE FROM documents;
                DELETE FROM projects;
                
                -- Delete parent tables
                DELETE FROM users;
                DELETE FROM equipments;
                DELETE FROM reservations;
            `);
            console.log('✅ Database cleared.');
        } catch (err) {
            console.log('⚠️ Error clearing database:', err.message);
        }

        // ==========================================
        // 4. SEEDING DATA
        // ==========================================
        console.log('Seeding Users...');
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('password123', salt);

        // In MS SQL, to insert specific numeric primary keys manually into an IDENTITY column,
        // we must temporarily turn IDENTITY_INSERT ON.
        await pool.request()
            .input('pass', sql.VarChar, hashedPassword)
            .query(`
                SET IDENTITY_INSERT users ON;
                
                -- Merge acting as "ON DUPLICATE KEY UPDATE"
                MERGE INTO users AS target
                USING (VALUES 
                    (1, 'Malendra', 'malendra@kitchenconnection.id', @pass, 'superadmin', 1, '6281808193399'),
                    (2, 'Sara Rabasari', 'sara@kitchenconnection.id', @pass, 'admin', 1, '6281320392414'),
                    (3, 'John Doe', 'john@example.com', @pass, 'client', 1, NULL),
                    (4, 'Sarah Smith', 'sarah@thegrandbistro.com', @pass, 'client', 1, NULL)
                ) AS source (id, name, email, password, role, is_verified, phone_number)
                ON target.id = source.id
                WHEN MATCHED THEN
                    UPDATE SET password = source.password, role = source.role, is_verified = source.is_verified, phone_number = source.phone_number
                WHEN NOT MATCHED THEN
                    INSERT (id, name, email, password, role, is_verified, phone_number)
                    VALUES (source.id, source.name, source.email, source.password, source.role, source.is_verified, source.phone_number);

                SET IDENTITY_INSERT users OFF;
            `);

        console.log('Seeding Equipments...');
        await pool.request().query(`
            SET IDENTITY_INSERT equipments ON;

            MERGE INTO equipments AS target
            USING (VALUES 
                (1, 'Kompor Gas Komersial 6 Tungku', 'Cooking', 'commercial', '36" x 32" x 56"', '180,000 BTU', '6 Panci', 'Kompor tugas berat yang cocok untuk dapur restoran bervolume tinggi.'),
                (2, 'Oven Konveksi Double Deck', 'Baking', 'commercial', '38" x 38" x 70"', '220V, 50A', '10 Loyang', 'Sempurna untuk toko roti dan kafe yang membutuhkan distribusi panas merata.'),
                (3, 'Kulkas Bawah Meja (Undercounter)', 'Cooling', 'commercial', '27" x 30" x 36"', '115V, 15A', '6.5 cu ft', 'Solusi pendingin hemat ruang untuk area persiapan bahan.'),
                (4, 'Kompor Premium Hunian', 'Cooking', 'home', '30" x 28" x 36"', '65,000 BTU', '4 Tungku', 'Kompor kelas profesional untuk dapur rumah mewah.'),
                (5, 'Tudung Hisap (Hood) Tipe 1', 'Ventilation', 'commercial', '48" x 30" x 24"', '120V', 'Exhaust 1500 CFM', 'Termasuk sistem pemadam api, wajib untuk memasak dengan api terbuka.')
            ) AS source (id, name, category, type, dimensions, power, capacity, description)
            ON target.id = source.id
            WHEN NOT MATCHED THEN
                INSERT (id, name, category, type, dimensions, power, capacity, description)
                VALUES (source.id, source.name, source.category, source.type, source.dimensions, source.power, source.capacity, source.description);

            SET IDENTITY_INSERT equipments OFF;
        `);

        console.log('Seeding Projects...');
        await pool.request().query(`
            SET IDENTITY_INSERT projects ON;

            MERGE INTO projects AS target
            USING (VALUES 
                (1, 4, 2, 'The Grand Bistro Kitchen Setup', 'Pengadaan', 60),
                (2, 3, 2, 'Johns Home Bakery', 'Desain', 30)
            ) AS source (id, client_id, pic_id, title, status, progress_percentage)
            ON target.id = source.id
            WHEN MATCHED THEN
                UPDATE SET status = source.status, progress_percentage = source.progress_percentage, pic_id = source.pic_id
            WHEN NOT MATCHED THEN
                INSERT (id, client_id, pic_id, title, status, progress_percentage)
                VALUES (source.id, source.client_id, source.pic_id, source.title, source.status, source.progress_percentage);

            SET IDENTITY_INSERT projects OFF;
        `);
        console.log('✅ Database seeded successfully into Azure SQL!');

    } catch (error) {
        console.error('❌ Seeding failed:', error);
    } finally {
        if (pool) {
            await pool.close();
            console.log('Connection closed.');
        }
        process.exit(0);
    }
}

runSeed();