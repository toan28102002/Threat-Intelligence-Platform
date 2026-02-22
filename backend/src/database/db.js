const path = require('path');
const sqlite3 = require('sqlite3').verbose();

// Path to SQLite DB
const dbPath = path.resolve(__dirname, '../../threat_intel.db');
console.log(`📁 Using SQLite DB path: ${dbPath}`);

// Initialize SQLite database
const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, err => {
  if (err) {
    console.error("❌ SQLite connection error:", err.message);
  } else {
    console.log(`✅ Successfully connected to SQLite at ${dbPath}`);
  }
});

// Export the database connection
module.exports = db; 