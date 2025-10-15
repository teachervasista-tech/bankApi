const sqlite3 = require("sqlite3").verbose();
const path = require("path");

// Open or create database file 'banking.db' in project directory
const db = new sqlite3.Database(
  path.resolve(__dirname, "banking.db"),
  (err) => {
    if (err) {
      console.error("Error opening database:", err.message);
    } else {
      console.log("Connected to SQLite database.");
    }
  }
);

// Create 'accounts' table if it doesn't exist
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS accounts (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      balance REAL NOT NULL
    )
  `);
});

module.exports = db;
