const db = require('./db');

// Function to add a new user
const addUser = (name, email, password) => {
  const sql = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
  db.query(sql, [name, email, password], (err, result) => {
    if (err) {
      console.error('Error inserting user:', err);
    } else {
      console.log('User added with ID:', result.insertId);
    }
  });
};

// Example usage
addUser('John Doe', 'john@example.com', 'password123');
