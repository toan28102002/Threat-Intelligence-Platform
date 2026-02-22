// shodan_store.js
const axios = require('axios');
const sqlite3 = require('sqlite3').verbose();
require('dotenv').config();

// Import centralized environment variables
const env = require('./config/env');

// Import centralized database connection
const db = require('./database/db');

// Environment variables
const SHODAN_API_KEY = process.env.SHODAN_API_KEY || 'your_shodan_api_key';
const IP = '8.8.8.8'; // Example IP for testing
const DB_PATH = process.env.DB_PATH || './db/threat_intel.db';

// Fetch data from Shodan
async function fetchShodanData(ip) {
    const url = `https://api.shodan.io/shodan/host/${ip}?key=${SHODAN_API_KEY}`;
    try {
        const response = await axios.get(url);
        console.log('📡 Shodan data fetched successfully.');
        return response.data;
    } catch (error) {
        console.error('❌ Error fetching data from Shodan:', error.message);
        return null;
    }
}

// Store threat data in threat_data table
function storeThreatDataInMainTable(ip, ports, hostnames) {
    const query = `
        INSERT OR REPLACE INTO threat_data (
            ip_address,
            ports,
            hostnames
        ) VALUES (?, ?, ?)
    `;

    db.run(query, [ip, ports, hostnames], function (err) {
        if (err) {
            console.error('❌ Error inserting data into threat_data:', err.message);
        } else {
            console.log(`✅ IP "${ip}" successfully stored in threat_data table.`);
        }
    });
}

// Store threat data into TVA mapping table
function storeThreatData(assetId, threatName, vulnerabilityDesc, likelihood, impact) {
    const query = `
        INSERT INTO tva_mapping (
            asset_id,
            threat_name,
            vulnerability_description,
            likelihood,
            impact
        ) VALUES (?, ?, ?, ?, ?)
    `;

    db.run(query, [assetId, threatName, vulnerabilityDesc, likelihood, impact], function (err) {
        if (err) {
            console.error('❌ Error inserting data into tva_mapping:', err.message);
        } else {
            console.log(`✅ Threat "${threatName}" successfully stored in tva_mapping.`);
        }
    });
}

// Run the main logic
async function main() {
    const data = await fetchShodanData(IP);

    if (!data) {
        console.error('❌ No data returned from Shodan');
        return;
    }

    // Store in threat_data table
    const ports = data.ports ? data.ports.join(', ') : 'None';
    const hostnames = data.hostnames ? data.hostnames.join(', ') : 'None';
    storeThreatDataInMainTable(IP, ports, hostnames);

    // Store in tva_mapping table
    if (data.ports && data.ports.length > 0) {
        storeThreatData(
            'A003',
            'Exposed Ports',
            `Multiple open ports detected: ${ports}`,
            'High',
            'Moderate'
        );
    }
    
    if (data.vulns && Object.keys(data.vulns).length > 0) {
        const vulns = Object.keys(data.vulns).join(', ');
        storeThreatData(
            'A004',
            'Known Vulnerabilities',
            `CVEs detected: ${vulns}`,
            'High',
            'High'
        );
    }

    if (data.os) {
        storeThreatData(
            'A005',
            'Operating System Fingerprint',
            `OS detected: ${data.os}`,
            'Medium',
            'Low'
        );
    }

    console.log('✅ Shodan data processing complete');
}

main();
