const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',    // Change this if using a cloud-hosted MySQL
  user: 'root',         // Your MySQL username
  password: 'password', // Your MySQL password
  database: 'travel_db' // The database you created
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err.stack);
    return;
  }
  console.log('Connected to MySQL database');
});

module.exports = db;
