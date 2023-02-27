const mysql = require('mysql2/promise');

const promiseCon = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'room_management',
})

module.exports = promiseCon;
