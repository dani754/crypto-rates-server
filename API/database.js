//general database connection configuration

const mysql = require('mysql');
const pool = mysql.createPool({
    host: 'remotemysql.com',
    user: 'ydnrcxIpJA',
    password: '3ulj2sEuIi',
    database: 'ydnrcxIpJA',
    port: '3306',
});

exports.pool = pool;