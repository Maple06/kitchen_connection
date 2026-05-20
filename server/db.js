const sql  = require('mssql');
const mysql = require('mysql2/promise');
require('dotenv').config();

const APP_MODE = process.env.APP_MODE || 'deployment'; // 'deployment', 'local_azure', 'local_xampp'

// ─── Retry configuration ───────────────────────────────────────────────────
const MAX_RETRIES    = 5;
const BASE_DELAY_MS  = 2_000;   // 2 s — first retry wait
const MAX_DELAY_MS   = 30_000;  // 30 s — cap per-attempt wait
// Total worst-case wait before giving up: 2+4+8+16+30 = 60 s
// Cloud Run request timeout is 300 s, so users still get a response either way.

// ─── Helpers ──────────────────────────────────────────────────────────────
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/** Returns true when the error looks like a dropped/blocked TCP connection. */
function isConnectionError(err) {
    if (!err) return false;
    const msg  = (err.message || '').toLowerCase();
    const code = (err.code   || '');
    return (
        err.name === 'ConnectionError'          ||
        code === 'ECONNRESET'                   ||
        code === 'ECONNREFUSED'                 ||
        code === 'ETIMEDOUT'                    ||
        code === 'ESOCKET'                      ||
        msg.includes('failed to connect')       ||
        msg.includes('connection is closed')    ||
        msg.includes('socket hang up')          ||
        msg.includes('connection reset')        ||
        msg.includes('timeout')
    );
}

// ─── Azure SQL: connect with exponential-backoff retry ────────────────────
async function connectAzure(config) {
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
        try {
            const pool = await new sql.ConnectionPool(config).connect();
            console.log(`[DB] Connected to Azure SQL (attempt ${attempt}/${MAX_RETRIES})`);
            return pool;
        } catch (err) {
            const delay = Math.min(BASE_DELAY_MS * 2 ** (attempt - 1), MAX_DELAY_MS);
            if (attempt < MAX_RETRIES) {
                console.warn(
                    `[DB] Connection attempt ${attempt}/${MAX_RETRIES} failed: ${err.message}. ` +
                    `Retrying in ${delay / 1_000}s…`
                );
                await sleep(delay);
            } else {
                console.error(
                    `[DB] All ${MAX_RETRIES} connection attempts exhausted. ` +
                    `Last error: ${err.message}`
                );
            }
        }
    }
    return null; // pool stays null — every query will attempt one lazy reconnect
}

// ─── Module-level state ───────────────────────────────────────────────────
let azureConfig = null;   // stored so lazy reconnect can reuse it
let poolPromise = null;   // always a Promise<pool|null>
let reconnecting = false; // guard: one reconnect at a time

// ─── Initialise pool ──────────────────────────────────────────────────────
if (APP_MODE === 'local_xampp') {
    // MySQL (XAMPP) — no retry needed, it's local
    const mysqlPool = mysql.createPool({
        host:             process.env.DB_HOST     || 'localhost',
        user:             process.env.DB_USER     || 'root',
        password:         process.env.DB_PASSWORD || '',
        database:         process.env.DB_NAME     || 'kitchenconnection',
        waitForConnections: true,
        connectionLimit:  10,
        queueLimit:       0,
    });
    console.log('[DB] Using Local MySQL (XAMPP)');
    poolPromise = Promise.resolve(mysqlPool);
} else {
    // Azure SQL — connect with retry on startup
    azureConfig = {
        server:   process.env.DB_SERVER,
        user:     process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port:     parseInt(process.env.DB_PORT, 10) || 1433,
        options: {
            encrypt:                true,  // required for Azure SQL
            trustServerCertificate: false,
            connectTimeout:         15_000, // 15 s per TCP attempt
            requestTimeout:         30_000, // 30 s per query
        },
        pool: {
            max:               10,
            min:               0,
            idleTimeoutMillis: 30_000,
        },
    };

    poolPromise = connectAzure(azureConfig);
}

// ─── Lazy reconnect ───────────────────────────────────────────────────────
/**
 * Returns a live pool.
 * If the pool is null (startup failed) or has become stale, fires one reconnect
 * attempt before giving up.  Only one concurrent reconnect is allowed to avoid
 * duplicate connection storms.
 */
async function ensurePool() {
    const pool = await poolPromise;

    if (pool) return pool;
    if (APP_MODE === 'local_xampp') return pool; // XAMPP pool can't be null

    // Pool is dead — attempt a lazy reconnect (on the user's request, no timer)
    if (!reconnecting) {
        reconnecting = true;
        console.warn('[DB] Pool is unavailable — attempting lazy reconnect…');
        poolPromise = connectAzure(azureConfig).finally(() => {
            reconnecting = false;
        });
    }

    // Wait for the in-flight reconnect (whether we started it or another request did)
    return await poolPromise;
}

// ─── Query helper ─────────────────────────────────────────────────────────
const query = async (sqlString, params = []) => {
    const pool = await ensurePool();

    if (!pool) {
        throw new Error(
            'Database is temporarily unavailable. Please try again in a moment.'
        );
    }

    if (APP_MODE === 'local_xampp') {
        // mysql2 returns [rows, fields]
        const [rows, fields] = await pool.query(sqlString, params);
        return [rows, fields];
    }

    // mssql — replace positional `?` with named @p0, @p1, …
    const request = pool.request();
    let paramIndex = 0;

    const transformedSql = sqlString.replace(/\?/g, () => {
        const paramName = `p${paramIndex}`;
        request.input(paramName, params[paramIndex]);
        paramIndex++;
        return `@${paramName}`;
    });

    try {
        const result = await request.query(transformedSql);
        return [result.recordset || [], []];
    } catch (err) {
        // If the error looks like a lost connection, mark the pool as stale
        // so the NEXT request triggers a fresh reconnect.
        if (isConnectionError(err)) {
            console.warn('[DB] Connection error detected on query — marking pool for reconnect:', err.message);
            poolPromise = Promise.resolve(null);
        }
        throw err;
    }
};

module.exports = { sql, poolPromise, query };