const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Define SQLite DB location (you can adjust this path if necessary)
const DB_PATH = path.join(__dirname, 'threat_management.db'); // Path to your SQLite DB file

// Initialize SQLite database
const db = new sqlite3.Database(DB_PATH, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to SQLite database.');
    }
});

// SQL Schema for creating the necessary tables
const schema = `
    CREATE TABLE IF NOT EXISTS threat_data (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        ip_address TEXT NOT NULL,
        ports TEXT,
        hostnames TEXT
    );
    
    CREATE TABLE IF NOT EXISTS tva_mapping (
        asset_id INTEGER PRIMARY KEY AUTOINCREMENT,
        threat_name TEXT NOT NULL,
        vulnerability_description TEXT NOT NULL,
        likelihood INTEGER,
        impact INTEGER
    );

    CREATE TABLE IF NOT EXISTS incident_response (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        threat_name TEXT NOT NULL,
        response_plan TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS risk_analysis (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        threat_name TEXT NOT NULL,
        likelihood INTEGER,
        impact INTEGER,
        risk_score INTEGER
    );

    CREATE TABLE IF NOT EXISTS email_alerts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email_address TEXT NOT NULL,
        alert_type TEXT NOT NULL,
        is_active BOOLEAN DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS osint_data (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        source_name TEXT NOT NULL,
        data TEXT NOT NULL,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    
    CREATE TABLE IF NOT EXISTS threat_analysis (
    	id INTEGER PRIMARY KEY AUTOINCREMENT,
    	description TEXT NOT NULL,
    	analysis TEXT NOT NULL
	);
	
	CREATE TABLE IF NOT EXISTS threat_alerts (
    	id INTEGER PRIMARY KEY AUTOINCREMENT,
    	ip TEXT NOT NULL,
    	risk_score INTEGER NOT NULL,
    	details TEXT NOT NULL,
    	timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
	);
	
	CREATE TABLE IF NOT EXISTS threat_data (
    	ip TEXT PRIMARY KEY,
    	threat_level TEXT NOT NULL,
    	confidence INTEGER NOT NULL,
    	timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
	);
	
	CREATE TABLE incident_plans (
    	id INTEGER PRIMARY KEY AUTOINCREMENT,
    	threat_name TEXT NOT NULL,
    	plan TEXT NOT NULL
	);




`;

// Execute the schema
db.exec(schema, (err) => {
    if (err) {
        console.error('Error executing schema:', err.message);
    } else {
        console.log('Database schema created successfully.');
    }
    db.close(); // Close the database connection after schema is executed
});
