const sql = require('mssql');
const mysql = require('mysql2/promise');
require('dotenv').config();

const APP_MODE = process.env.APP_MODE || 'deployment'; // 'deployment', 'local_azure', 'local_xampp'
let poolPromise = null;

if (APP_MODE === 'local_xampp') {
    // MySQL (XAMPP) Configuration
    const pool = mysql.createPool({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'kitchenconnection',
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    });
    console.log('Connected to Local MySQL (XAMPP)');
    poolPromise = Promise.resolve(pool);
} else {
    // Azure SQL Configuration
    const config = {
        server: process.env.DB_SERVER,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: parseInt(process.env.DB_PORT) || 1433,
        options: {
            encrypt: true, // CRUCIAL for Azure SQL
            trustServerCertificate: false
        },
        pool: {
            max: 10,
            min: 0,
            idleTimeoutMillis: 30000
        }
    };

    poolPromise = new sql.ConnectionPool(config)
        .connect()
        .then(pool => {
            console.log('Connected to Azure SQL');
            return pool;
        })
        .catch(err => {
            console.error('Database connection failed: ', err.message);
            // Don't crash the container, let the API return 500s so Cloud Run deployment succeeds
            // process.exit(1); 
        });
}

// Helper function to abstract db differences
const query = async (sqlString, params = []) => {
    const pool = await poolPromise;

    if (!pool) {
        throw new Error('Database connection is unavailable. Check server logs for connection errors.');
    }

    if (APP_MODE === 'local_xampp') {
        // mysql2 native execution
        const [rows, fields] = await pool.query(sqlString, params);
        return [rows, fields];
    } else {
        // mssql execution
        const request = pool.request();

        // Replace positional `?` with named `@param0`, `@param1`, etc.
        let paramIndex = 0;
        const transformedSql = sqlString.replace(/\?/g, () => {
            const paramName = `p${paramIndex}`;
            request.input(paramName, params[paramIndex]);
            paramIndex++;
            return `@${paramName}`;
        });

        // Execute query
        const result = await request.query(transformedSql);

        // Return in [rows, fields] format like mysql2 does
        return [result.recordset || [], []];
    }
};

module.exports = {
    sql,
    poolPromise,
    query
};