const mysql = require("mysql2/promise");
require("dotenv").config();

const APP_MODE = process.env.APP_MODE || "deployment";

const dbConfig = {
    host: process.env.DB_SERVER || process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "kitchenconnection",
    port: parseInt(process.env.DB_PORT, 10) || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
};

if (APP_MODE === "deployment") {
    dbConfig.ssl = {
        rejectUnauthorized: false
    };
}

const pool = mysql.createPool(dbConfig);
const poolPromise = Promise.resolve(pool);

console.log(`[DB] Connected to MySQL (${APP_MODE}) at ${dbConfig.host}`);

const query = async (sqlString, params = []) => {
    const [rows, fields] = await pool.query(sqlString, params);
    return [rows, fields];
};

module.exports = { poolPromise, query, pool };
