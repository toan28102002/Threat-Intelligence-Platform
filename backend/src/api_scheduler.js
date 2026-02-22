const axios = require('axios');
const nodemailer = require('nodemailer');
const schedule = require('node-schedule');
const assert = require('assert');
require('dotenv').config();

// Import shared SQLite connection
const db = require('../db/db'); // Adjust path if needed

const SHODAN_API_KEY = process.env.SHODAN_API_KEY;
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;
const RECIPIENT_EMAIL = process.env.RECIPIENT_EMAIL;

const IP = "8.8.8.8";

// Fetching data from Shodan API
async function fetchShodanData(ip) {
  const url = `https://api.shodan.io/shodan/host/${ip}?key=${SHODAN_API_KEY}`;
  try {
    const response = await axios.get(url);
    const data = response.data;

    // Save data to DB
    const query = `
      INSERT INTO threat_data (ip_address, ports, hostnames)
      VALUES (?, ?, ?)
    `;
    const ports = (data.ports || []).join(',');
    const hostnames = (data.hostnames || []).join(',');

    db.run(query, [ip, ports, hostnames], (err) => {
      if (err) {
        console.error("❌ DB insert error:", err.message);
      } else {
        console.log(`✅ Shodan data for ${ip} saved to DB.`);
      }
    });

    return data;
  } catch (err) {
    console.error("Error fetching Shodan data:", err.message);
  }
}

// Schedule every 6 hours
schedule.scheduleJob('0 */6 * * *', async () => {
  await runOsintUpdates();
  console.log("🕒 Scheduled OSINT update complete");
});

async function runOsintUpdates() {
  console.log("📡 Fetching Shodan threat intel...");
  const data = await fetchShodanData(IP);
  if (data) console.log("✅ Shodan data updated.");
}

// Send email alert
async function sendAlert(threat, riskScore) {
  if (riskScore <= 20) {
    console.log(`⚠️ Low-risk threat (${riskScore}): ${threat}`);
    return;
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS
    }
  });

  const mailOptions = {
    from: EMAIL_USER,
    to: RECIPIENT_EMAIL,
    subject: '🚨 Critical Threat Alert',
    text: `High-Risk Threat Detected: ${threat} with Risk Score ${riskScore}`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) console.error("❌ Email error:", error);
    else console.log("📧 Alert sent:", info.response);
  });
}

// Tests
async function testShodanApi() {
  const data = await fetchShodanData("8.8.8.8");
  assert.ok(data.ports, "Missing 'ports' in Shodan response");
  assert.ok(Array.isArray(data.ports), "'ports' should be an array");
  assert.ok(data.hostnames, "Missing 'hostnames'");
}

function testRiskAlert() {
  assert.doesNotThrow(() => sendAlert("SQL Injection", 25));
  assert.doesNotThrow(() => sendAlert("Port Scan", 10));
}

// Manual test run
sendAlert("SQL Injection", 25);
testShodanApi().catch(err => console.error("❌ Shodan API test failed:", err));
testRiskAlert();
