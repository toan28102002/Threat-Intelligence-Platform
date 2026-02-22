const { exec } = require('child_process');
const path = require('path');
const db = require('../db/db'); // Adjust the path as needed based on your project structure

/**
 * Creates the blocked_ips table if it doesn't exist.
 */
function createBlockedIpsTable() {
    const query = `
        CREATE TABLE IF NOT EXISTS blocked_ips (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            ip TEXT NOT NULL,
            blocked_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `;
    db.run(query, (err) => {
        if (err) {
            console.error("❌ Error creating blocked_ips table:", err.message);
        } else {
            console.log("✅ Blocked IPs table created or already exists.");
        }
    });
}

/**
 * Logs blocked IPs into the database.
 * @param {string} ip - The IP address that was blocked.
 */
function logBlockedIP(ip) {
    const query = `INSERT INTO blocked_ips (ip) VALUES (?)`;
    db.run(query, [ip], function (err) {
        if (err) {
            console.error("❌ Error logging blocked IP:", err.message);
        } else {
            console.log(`✅ IP ${ip} logged to database.`);
        }
    });
}

/**
 * Blocks a given IP address using iptables and logs it in SQLite.
 * @param {string} ip - The IP address to block.
 */
function blockIP(ip) {
    if (!ip || !/^\d{1,3}(\.\d{1,3}){3}$/.test(ip)) {
        console.error("❌ Invalid IP address format.");
        return;
    }

    const command = `iptables -A INPUT -s ${ip} -j DROP`;

    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`❌ Error blocking IP ${ip}: ${stderr}`);
        } else {
            console.log(`✅ IP ${ip} has been blocked successfully.`);
            logBlockedIP(ip);
        }
    });
}

// Initialize table
createBlockedIpsTable();

// Example: Uncomment to test blocking
// blockIP("192.168.1.10");

module.exports = {
    blockIP,
    logBlockedIP,
    createBlockedIpsTable
};
