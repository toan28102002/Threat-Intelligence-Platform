const express = require("express");
const nodemailer = require("nodemailer");
const axios = require("axios");
require("dotenv").config();

const router = express.Router();

// ✅ Use shared database connection
const db = require('../db/db');  // Adjust the path if needed

// Set up email transporter
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.ALERT_EMAIL_USER,
        pass: process.env.ALERT_EMAIL_PASS,
    }
});

// Create alerts table if needed
const createTableQuery = `
CREATE TABLE IF NOT EXISTS threat_alerts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ip TEXT NOT NULL,
    risk_score INTEGER NOT NULL,
    details TEXT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);
`;
db.run(createTableQuery, (err) => {
    if (err) {
        console.error("Error creating threat_alerts table:", err.message);
    } else {
        console.log("✅ threat_alerts table checked/created.");
    }
});

async function sendEmailAlert(threat) {
    const recipient = process.env.ALERT_EMAIL_RECIPIENT || process.env.ALERT_EMAIL_USER;
    if (!recipient) return console.error("❌ No recipient for email alerts.");

    const mailOptions = {
        from: `"Threat Monitor" <${process.env.ALERT_EMAIL_USER}>`,
        to: recipient,
        subject: `🚨 High Risk Threat Detected (Score: ${threat.riskScore})`,
        text: `A high-risk threat has been detected:\n\nIP: ${threat.ip}\nRisk Score: ${threat.riskScore}\nDetails: ${threat.details}`
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log("✅ Email alert sent.");
    } catch (err) {
        console.error("❌ Email error:", err.message);
    }
}

async function sendWebhookAlert(threat) {
    const url = process.env.ALERT_WEBHOOK_URL;
    if (!url) return console.warn("⚠️ No webhook URL defined.");

    try {
        await axios.post(url, {
            type: "THREAT_ALERT",
            threat,
        });
        console.log("✅ Webhook alert sent.");
    } catch (err) {
        console.error("❌ Webhook error:", err.message);
    }
}

async function handleThreat(threat) {
    const insertQuery = `
    INSERT INTO threat_alerts (ip, risk_score, details)
    VALUES (?, ?, ?)
    `;
    db.run(insertQuery, [threat.ip, threat.riskScore, threat.details], function (err) {
        if (err) {
            console.error("❌ DB insert error:", err.message);
        } else {
            console.log(`✅ Stored alert ID ${this.lastID}`);
        }
    });

    if (threat.riskScore > 20) {
        await sendEmailAlert(threat);
        await sendWebhookAlert(threat);
    } else {
        console.log(`ℹ️ Risk score ${threat.riskScore} does not trigger alert.`);
    }
}

router.post("/alert-threat", async (req, res) => {
    const { ip, riskScore, details } = req.body;
    if (!ip || !riskScore || !details) {
        return res.status(400).json({ error: "Missing required fields." });
    }

    try {
        await handleThreat({ ip, riskScore, details });
        res.status(200).json({ message: "Alert handled." });
    } catch (err) {
        console.error("❌ Error handling alert:", err.message);
        res.status(500).json({ error: "Internal server error." });
    }
});

module.exports = router;
