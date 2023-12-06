const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: "localhost",
    user: 'root',
    password: 'RAY19991121',
    database: 'userDB'
});

module.exports = connection;