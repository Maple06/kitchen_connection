const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const dbConfigWithoutDB = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    multipleStatements: true
};

const dbConfig = {
    ...dbConfigWithoutDB,
    database: process.env.DB_NAME || 'kitchen_connection'
};

async function runSeed() {
    let connection;
    try {
        console.log('Connecting to MySQL to create database and tables...');
        connection = await mysql.createConnection(dbConfigWithoutDB);
        
        // Read and execute db.sql
        const sqlScript = fs.readFileSync(path.join(__dirname, 'db.sql'), 'utf8');
        await connection.query(sqlScript);
        console.log('Database and tables created/verified successfully!');
        
        // Reconnect with database selected
        await connection.changeUser({ database: dbConfig.database });
        console.log('Connected to kitchen_connection database!');

        console.log('Checking and updating database schema...');
        
        const alterQueries = [
            "ALTER TABLE users ADD COLUMN is_verified BOOLEAN DEFAULT FALSE;",
            "ALTER TABLE users ADD COLUMN verification_token VARCHAR(255);",
            "ALTER TABLE users ADD COLUMN reset_token VARCHAR(255);",
            "ALTER TABLE users ADD COLUMN delete_requested BOOLEAN DEFAULT FALSE;",
            "ALTER TABLE users MODIFY COLUMN role ENUM('client', 'admin', 'superadmin') DEFAULT 'client';"
        ];

        for (const query of alterQueries) {
            try {
                await connection.query(query);
            } catch (err) {
                // Ignore duplicate column errors or harmless warnings
            }
        }
        console.log('Schema update verified.');

        console.log('Seeding Users...');
        // Password for all dummy users will be 'password123'
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('password123', salt);

        await connection.query(`
            INSERT INTO users (id, name, email, password, role, is_verified) VALUES 
            (1, 'Super Admin', 'superadmin@kitchenconnection.com', ?, 'superadmin', true),
            (2, 'Admin Kitchen', 'admin@kitchenconnection.com', ?, 'admin', true),
            (3, 'John Doe', 'john@example.com', ?, 'client', true),
            (4, 'Sarah Smith', 'sarah@thegrandbistro.com', ?, 'client', true)
            ON DUPLICATE KEY UPDATE password=VALUES(password), role=VALUES(role), is_verified=VALUES(is_verified)
        `, [hashedPassword, hashedPassword, hashedPassword, hashedPassword]);

        console.log('Seeding Equipments...');
        await connection.query(`
            INSERT IGNORE INTO equipments (id, name, category, type, dimensions, power, capacity, description) VALUES 
            (1, 'Kompor Gas Komersial 6 Tungku', 'Cooking', 'commercial', '36" x 32" x 56"', '180,000 BTU', '6 Panci', 'Kompor tugas berat yang cocok untuk dapur restoran bervolume tinggi.'),
            (2, 'Oven Konveksi Double Deck', 'Baking', 'commercial', '38" x 38" x 70"', '220V, 50A', '10 Loyang', 'Sempurna untuk toko roti dan kafe yang membutuhkan distribusi panas merata.'),
            (3, 'Kulkas Bawah Meja (Undercounter)', 'Cooling', 'commercial', '27" x 30" x 36"', '115V, 15A', '6.5 cu ft', 'Solusi pendingin hemat ruang untuk area persiapan bahan.'),
            (4, 'Kompor Premium Hunian', 'Cooking', 'home', '30" x 28" x 36"', '65,000 BTU', '4 Tungku', 'Kompor kelas profesional untuk dapur rumah mewah.'),
            (5, 'Tudung Hisap (Hood) Tipe 1', 'Ventilation', 'commercial', '48" x 30" x 24"', '120V', 'Exhaust 1500 CFM', 'Termasuk sistem pemadam api, wajib untuk memasak dengan api terbuka.')
        `);

        console.log('Seeding Projects...');
        await connection.query(`
            INSERT IGNORE INTO projects (id, client_id, title, status, progress_percentage) VALUES 
            (1, 2, 'The Grand Bistro Kitchen Setup', 'Pengadaan Peralatan', 65),
            (2, 3, 'Sarahs Home Bakery', 'Desain & Tata Letak', 30)
        `);

        console.log('Seeding Documents...');
        await connection.query(`
            INSERT IGNORE INTO documents (id, project_id, title, file_path, type) VALUES 
            (1, 1, 'Floor_Plan_v2.pdf', '/uploads/floor_plan_v2.pdf', 'blueprint'),
            (2, 1, 'INV-2026-001 (DP)', '/uploads/inv_001.pdf', 'invoice'),
            (3, 2, 'Catatan_Konsultasi_Awal.pdf', '/uploads/consultation.pdf', 'other')
        `);

        console.log('Seeding Reservations...');
        await connection.query(`
            INSERT IGNORE INTO reservations (id, client_name, client_email, date, time_slot, status, notes) VALUES 
            (1, 'Mike Johnson', 'mike@newcafe.com', '2026-05-15', '10:00 - 11:00', 'confirmed', 'Membuka kedai kopi baru, butuh saran tata letak.'),
            (2, 'Linda Wu', 'linda@home.com', '2026-05-16', '14:00 - 15:00', 'pending', 'Tertarik untuk meningkatkan dapur rumah menjadi kualitas komersial.')
        `);

        console.log('Database seeded successfully!');
    } catch (error) {
        console.error('Seeding failed:', error);
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

runSeed();
