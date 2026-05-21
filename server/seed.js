const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

function buildBackupFilename() {
    const now = new Date();
    const d = String(now.getDate()).padStart(2, '0');
    const m = now.toLocaleString('default', { month: 'short' });
    const y = now.getFullYear();
    const h = String(now.getHours()).padStart(2, '0');
    const min = String(now.getMinutes()).padStart(2, '0');
    return `backup-${d}-${m}-${y}-${h}-${min}.json`;
}

function shouldUseSsl(host) {
    if (!host) return false;
    const h = String(host).toLowerCase();
    return h !== 'localhost' && h !== '127.0.0.1';
}

async function runSeed() {
    const host = process.env.DB_SERVER || process.env.DB_HOST || 'localhost';
    const port = parseInt(process.env.DB_PORT, 10) || 3306;
    const database = process.env.DB_NAME;
    const user = process.env.DB_USER || 'root';
    const password = process.env.DB_PASSWORD || '';

    if (!database) {
        console.error('❌ DB_NAME is not set. Aborting seeding.');
        process.exit(1);
    }

    const connectionConfig = {
        host,
        port,
        user,
        password,
        database,
        multipleStatements: true,
    };

    if (shouldUseSsl(host)) {
        connectionConfig.ssl = { rejectUnauthorized: false };
    }

    let connection;
    try {
        console.log('Connecting to MySQL Database...');
        connection = await mysql.createConnection(connectionConfig);
        console.log(`Connected to database: ${database}`);

        // ==========================================
        // 1. BACKUP DATA
        // ==========================================
        console.log('Creating backup of existing data...');
        try {
            const tablesForBackup = ['documents', 'projects', 'reservations', 'equipments', 'users', 'settings'];
            const backupData = {};

            for (const table of tablesForBackup) {
                try {
                    const [rows] = await connection.query(`SELECT * FROM \`${table}\``);
                    backupData[table] = rows;
                } catch (err) {
                    // Table might not exist yet; keep it as empty.
                    backupData[table] = [];
                }
            }

            const backupFilename = buildBackupFilename();
            const backupFile = path.join(__dirname, backupFilename);
            fs.writeFileSync(backupFile, JSON.stringify(backupData, null, 2));
            console.log(`✅ Backup saved to ${backupFile}`);
        } catch (err) {
            console.log('⚠️ Could not backup data:', err.message);
        }

        // ==========================================
        // 2. RESET TABLES (DROP + RECREATE)
        // ==========================================
        console.log('Resetting tables (drop & recreate)...');
        try {
            await connection.query(`
                SET FOREIGN_KEY_CHECKS = 0;

                DROP TABLE IF EXISTS \`documents\`;
                DROP TABLE IF EXISTS \`projects\`;
                DROP TABLE IF EXISTS \`reservations\`;
                DROP TABLE IF EXISTS \`equipments\`;
                DROP TABLE IF EXISTS \`settings\`;
                DROP TABLE IF EXISTS \`users\`;

                SET FOREIGN_KEY_CHECKS = 1;
            `);
        } catch (err) {
            console.log('⚠️ Could not drop tables (insufficient privileges?). Will try clearing rows instead:', err.message);
            await connection.query(`SET FOREIGN_KEY_CHECKS = 0;`);
            // Best-effort deletes; ignore if table doesn't exist
            for (const table of ['documents', 'projects', 'reservations', 'equipments', 'settings', 'users']) {
                try {
                    await connection.query(`DELETE FROM \`${table}\``);
                } catch (_) {
                    // ignore
                }
            }
            await connection.query(`SET FOREIGN_KEY_CHECKS = 1;`);
        }

        console.log('Creating table schemas...');
        await connection.query(`
            CREATE TABLE IF NOT EXISTS \`users\` (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL UNIQUE,
                password VARCHAR(255),
                role ENUM('client', 'admin', 'superadmin') DEFAULT 'client',
                is_verified BOOLEAN DEFAULT FALSE,
                verification_token VARCHAR(255),
                reset_token VARCHAR(255),
                delete_requested BOOLEAN DEFAULT FALSE,
                google_id VARCHAR(255),
                phone_number VARCHAR(50),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            ) ENGINE=InnoDB;

            CREATE TABLE IF NOT EXISTS \`equipments\` (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                category VARCHAR(100) NOT NULL,
                type ENUM('commercial', 'home') NOT NULL,
                dimensions VARCHAR(100),
                power VARCHAR(100),
                capacity VARCHAR(100),
                description TEXT,
                image_url VARCHAR(500),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            ) ENGINE=InnoDB;

            CREATE TABLE IF NOT EXISTS \`reservations\` (
                id INT AUTO_INCREMENT PRIMARY KEY,
                client_name VARCHAR(255) NOT NULL,
                client_email VARCHAR(255) NOT NULL,
                date DATE NOT NULL,
                time_slot VARCHAR(50) NOT NULL,
                status ENUM('pending', 'confirmed', 'completed', 'cancelled') DEFAULT 'pending',
                notes TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            ) ENGINE=InnoDB;

            CREATE TABLE IF NOT EXISTS \`projects\` (
                id INT AUTO_INCREMENT PRIMARY KEY,
                client_id INT NOT NULL,
                title VARCHAR(255) NOT NULL,
                status VARCHAR(100) DEFAULT 'Konsultasi',
                progress_percentage INT DEFAULT 0,
                pic_id INT NULL,
                archived_at TIMESTAMP NULL DEFAULT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                CONSTRAINT fk_projects_client FOREIGN KEY (client_id) REFERENCES users(id) ON DELETE CASCADE,
                CONSTRAINT fk_projects_pic FOREIGN KEY (pic_id) REFERENCES users(id) ON DELETE SET NULL
            ) ENGINE=InnoDB;

            CREATE TABLE IF NOT EXISTS \`documents\` (
                id INT AUTO_INCREMENT PRIMARY KEY,
                project_id INT NOT NULL,
                title VARCHAR(255) NOT NULL,
                file_path VARCHAR(500) NOT NULL,
                type ENUM('blueprint', 'invoice', 'other') DEFAULT 'other',
                uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                CONSTRAINT fk_documents_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
            ) ENGINE=InnoDB;

            CREATE TABLE IF NOT EXISTS \`settings\` (
                key_name VARCHAR(100) PRIMARY KEY,
                value TEXT,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            ) ENGINE=InnoDB;
        `);
        console.log('✅ Base tables created.');

        // Default setting
        await connection.query(
            `INSERT INTO settings (key_name, value) VALUES ('calendar_embed_url', '')
             ON DUPLICATE KEY UPDATE value = VALUES(value)`
        );

        // ==========================================
        // 3. SEEDING DATA
        // ==========================================
        console.log('Seeding Users...');
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('password123', salt);

        await connection.query(
            `INSERT INTO users (id, name, email, password, role, is_verified, phone_number, delete_requested)
             VALUES ?`,
            [[
                [1, 'Malendra', 'malendra@kitchenconnection.id', hashedPassword, 'superadmin', 1, '6281808193399', 0],
                [2, 'Sara Rabasari', 'sara@kitchenconnection.id', hashedPassword, 'admin', 1, '6281320392414', 0],
                [3, 'John Doe', 'john@example.com', hashedPassword, 'client', 1, null, 0],
                [4, 'Sarah Smith', 'sarah@thegrandbistro.com', hashedPassword, 'client', 1, null, 0]
            ]]
        );

        console.log('Seeding Equipments...');
        await connection.query(
            `INSERT INTO equipments (id, name, category, type, dimensions, power, capacity, description)
             VALUES ?`,
            [[
                [1, 'Kompor Gas Komersial 6 Tungku', 'Cooking', 'commercial', '36" x 32" x 56"', '180,000 BTU', '6 Panci', 'Kompor tugas berat yang cocok untuk dapur restoran bervolume tinggi.'],
                [2, 'Oven Konveksi Double Deck', 'Baking', 'commercial', '38" x 38" x 70"', '220V, 50A', '10 Loyang', 'Sempurna untuk toko roti dan kafe yang membutuhkan distribusi panas merata.'],
                [3, 'Kulkas Bawah Meja (Undercounter)', 'Cooling', 'commercial', '27" x 30" x 36"', '115V, 15A', '6.5 cu ft', 'Solusi pendingin hemat ruang untuk area persiapan bahan.'],
                [4, 'Kompor Premium Hunian', 'Cooking', 'home', '30" x 28" x 36"', '65,000 BTU', '4 Tungku', 'Kompor kelas profesional untuk dapur rumah mewah.'],
                [5, 'Tudung Hisap (Hood) Tipe 1', 'Ventilation', 'commercial', '48" x 30" x 24"', '120V', 'Exhaust 1500 CFM', 'Termasuk sistem pemadam api, wajib untuk memasak dengan api terbuka.']
            ]]
        );

        console.log('Seeding Projects...');
        await connection.query(
            `INSERT INTO projects (id, client_id, pic_id, title, status, progress_percentage)
             VALUES ?`,
            [[
                [1, 4, 2, 'The Grand Bistro Kitchen Setup', 'Pengadaan', 60],
                [2, 3, 2, 'Johns Home Bakery', 'Desain', 30]
            ]]
        );

        console.log('✅ Database seeded successfully into MySQL!');
    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exitCode = 1;
    } finally {
        if (connection) {
            try {
                await connection.end();
            } catch (_) {
                // ignore
            }
        }
    }
}

runSeed();