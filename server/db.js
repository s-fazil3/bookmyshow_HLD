const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: "127.0.0.1",   
  port: 3307,          
  user: "root",
  password: "root",
  database: "booking_system",
  waitForConnections: true,
  connectionLimit: 10
});

module.exports = pool;