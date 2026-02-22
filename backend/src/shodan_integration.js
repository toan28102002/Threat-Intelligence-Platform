const express = require("express");
const axios = require("axios");
const sqlite3 = require("sqlite3").verbose();
require("dotenv").config({ path: "./.env" });

const router = express.Router();

// Import centralized environment variables
const env = require('./config/env');

// Import centralized database connection
const db = require('./database/db');

// Initialize the database table if it doesn't exist
db.run(`
    CREATE TABLE IF NOT EXISTS threat_data (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        ip_address TEXT NOT NULL,
        ports TEXT,
        hostnames TEXT
    );
`);

// Shodan API Route
router.get("/shodan/:ip", async (req, res) => {
    const { ip } = req.params;
    const SHODAN_API_KEY = process.env.SHODAN_API_KEY;

    if (!SHODAN_API_KEY) {
        return res.status(500).json({ error: "❌ Shodan API key is missing" });
    }

    const SHODAN_URL = `https://api.shodan.io/shodan/host/${ip}?key=${SHODAN_API_KEY}`;

    try {
        // Fetch data from Shodan API
        const response = await axios.get(SHODAN_URL);
        const data = response.data;

        // Extract relevant data
        const ip_address = data.ip_str;
        const ports = data.ports ? data.ports.join(", ") : "None";
        const hostnames = data.hostnames ? data.hostnames.join(", ") : "None";

        // Insert data into SQLite
        const query = `
            INSERT INTO threat_data (ip_address, ports, hostnames)
            VALUES (?, ?, ?)
        `;
        const values = [ip_address, ports, hostnames];

        db.run(query, values, function(err) {
            if (err) {
                console.error("❌ Error inserting data:", err.message);
                return res.status(500).json({ error: "Failed to store Shodan data" });
            }

            res.json({
                message: "✅ Shodan data stored successfully",
                data: {
                    id: this.lastID,
                    ip_address,
                    ports,
                    hostnames
                },
            });
        });
    } catch (error) {
        console.error("❌ Error fetching from Shodan:", error.message);
        res.status(500).json({ error: "Failed to retrieve Shodan data" });
    }
});

module.exports = router;
