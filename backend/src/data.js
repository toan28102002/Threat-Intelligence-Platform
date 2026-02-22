const db = require('../db/db'); // Adjust path based on your file location


// Sample threat entries
const threats = [
  { ip: "203.0.113.10", ports: "80,443", hostnames: "malicious-site.com" },
  { ip: "192.0.2.50", ports: "22", hostnames: "ssh-vuln.internal" },
  { ip: "198.51.100.25", ports: "8080", hostnames: "api-legacy.net" }
];

// Sample TVA mappings
const mappings = [
  {
    threat: "SQL Injection",
    vulnerability: "Unvalidated Input",
    asset: "Web App",
    asset_id: "A001",
    threat_name: "SQLi",
    vulnerability_description: "Allows database manipulation",
    likelihood: "High",
    impact: "Critical"
  },
  {
    threat: "Command Injection",
    vulnerability: "Unsanitized Shell Input",
    asset: "Linux Server",
    asset_id: "A002",
    threat_name: "CmdInjection",
    vulnerability_description: "Execute arbitrary shell commands",
    likelihood: "Medium",
    impact: "High"
  }
];

// Sample alerts
const alerts = [
  { message: "Suspicious traffic from 203.0.113.10", level: "High" },
  { message: "Brute-force login attempt from 192.0.2.50", level: "Medium" }
];

db.serialize(() => {
  // Insert threat data
  threats.forEach(({ ip, ports, hostnames }) => {
    db.run(
      `INSERT INTO threat_data (ip_address, ports, hostnames) VALUES (?, ?, ?)`,
      [ip, ports, hostnames],
      err => {
        if (err) console.error("❌ Threat insert error:", err.message);
        else console.log(`✅ Inserted threat ${ip}`);
      }
    );
  });

  // Insert TVA mappings
  mappings.forEach(entry => {
    const {
      threat, vulnerability, asset, asset_id,
      threat_name, vulnerability_description, likelihood, impact
    } = entry;
    db.run(
      `INSERT INTO tva_mapping (threat, vulnerability, asset, asset_id, threat_name, vulnerability_description, likelihood, impact)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [threat, vulnerability, asset, asset_id, threat_name, vulnerability_description, likelihood, impact],
      err => {
        if (err) console.error("❌ Mapping insert error:", err.message);
        else console.log(`✅ Inserted TVA mapping: ${threat}`);
      }
    );
  });

  // Insert alerts
  alerts.forEach(({ message, level }) => {
    db.run(
      `INSERT INTO alerts (message, level) VALUES (?, ?)`,
      [message, level],
      err => {
        if (err) console.error("❌ Alert insert error:", err.message);
        else console.log(`✅ Inserted alert: ${message}`);
      }
    );
  });
});

db.close(() => {
  console.log("✅ Seeding complete and DB closed.");
});
