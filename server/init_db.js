const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function initDB() {
    const APP_MODE = process.env.APP_MODE || 'local_azure';
    if (APP_MODE !== 'local_xampp') {
        console.log(`Skipping DB initialization. APP_MODE is ${APP_MODE}. Initialization is only for local_xampp.`);
        return;
    }

    try {
        // Connect without database first to create it
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            multipleStatements: true
        });

        const sqlScript = fs.readFileSync(path.join(__dirname, 'db.sql'), 'utf8');
        
        console.log('Executing database initialization...');
        await connection.query(sqlScript);
        console.log('Database initialized successfully.');
        
        await connection.end();
    } catch (error) {
        console.error('Error initializing database:', error);
    }
}

initDB();
