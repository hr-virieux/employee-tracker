const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'henry',
  password: '1234',  // Simple password only used for demonstration
  database: 'employees'
}).promise();

module.exports = connection;
