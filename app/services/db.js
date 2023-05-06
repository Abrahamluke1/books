require("dotenv").config();
const mysql = require("mysql2/promise");
const bcrypt = require("bcryptjs");

const config = {
  db: {
    host: process.env.DB_CONTAINER,
    port: process.env.DB_PORT,
    user: process.env.MYSQL_ROOT_USER,
    password: process.env.MYSQL_ROOT_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    waitForConnections: true,
    connectionLimit: 2,
    queueLimit: 0,
  },
};

const pool = mysql.createPool(config.db);

// Utility function to query the database
async function query(sql, params) {
  const [rows, fields] = await pool.execute(sql, params);
  return rows;
}

// Function to create a new user in the database
async function createUser(name, email, password) {
  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  const sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
  return query(sql, [name, email, hashedPassword]);
}

// Function to retrieve a user by email and password
async function getUserByEmailAndPassword(email, password) {
  const hashedPassword = await bcrypt.hash(password, 10);
  const query = "SELECT * FROM users WHERE email = ? AND password = ?";
  const results = await pool.execute(query, [email, hashedPassword]);

  if (results.length > 0) {
    return results[0];
  } else {
    return null;
  }
}


// Add this function to your db.js file
async function getBookById(bookId) {
  try {
    const result = await query('SELECT * FROM books WHERE id = ?', [bookId]);
    if (result && result.length) {
      return result[0];
    }
    return null;
  } catch (error) {
    console.error(error);
    return null;
  }
}

async function getBooksByGenre(genre) {
  try {
    const result = await query('SELECT * FROM books WHERE genre = ?', [genre]);
    return result;
  } catch (error) {
    console.error(error);
    return null;
  }
}

async function createAdminUser(email, password) {
  const hash = password;
  const sql = 'INSERT INTO admin (email, password, is_admin, name) VALUES (?, ?, ?, ?)';
  const defaultName = 'Admin'; // set a default value for the name field
  await query(sql, [email, hash, true, defaultName]);
}


// Function to retrieve an admin by email
async function getAdminByEmail(email) {
  const sql = "SELECT * FROM admin WHERE email = ?";
  const [rows, fields] = await pool.execute(sql, [email]);
  if (rows.length > 0) {
    return rows[0];
  } else {
    return null;
  }
}


async function getAllBooks() {
  const query = "SELECT * FROM books";
  const results = await pool.query(query);
  return results[0];
}


module.exports = {
  query,
  createUser,
getUserByEmailAndPassword,
  getBookById,
  getBooksByGenre,
  createAdminUser,
  getAdminByEmail,
  getAllBooks
};
