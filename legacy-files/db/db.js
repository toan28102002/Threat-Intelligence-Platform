// db/db.js
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
require('dotenv').config({ path: './srv.env' });

// Resolve full path to the database
const dbPath = path.resolve(__dirname, 'threat_intel.db');
console.log(`📁 Using SQLite DB path: ${dbPath}`);

// Initialize and export the SQLite connection
const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
  if (err) {
    console.error('❌ Failed to connect to SQLite database:', err.message);
  } else {
    console.log('✅ Successfully connected to SQLite database');
  }
});

module.exports = db;
