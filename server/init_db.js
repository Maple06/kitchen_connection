const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function initDB() {
    try {
        // Connect without database first to create it
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            multipleStatements: true
        });

        const sql = fs.readFileSync(path.join(__dirname, 'db.sql'), 'utf8');
        
        console.log('Executing database initialization...');
        await connection.query(sql);
        console.log('Database initialized successfully.');
        
        await connection.end();
    } catch (error) {
        console.error('Error initializing database:', error);
    }
}

initDB();
