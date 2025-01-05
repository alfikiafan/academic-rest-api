const mysql = require('mysql2/promise');

// Konfigurasi koneksi
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'akademik_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = pool;
