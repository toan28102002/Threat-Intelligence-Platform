const sqlite3 = require('sqlite3').verbose();
require('dotenv').config();

const db = require('../db/db'); // Adjust the path if needed


/**
 * Generates an Incident Response Plan for a given threat type.
 * @param {string} threat - Type of security threat.
 * @returns {string} - The response plan for the threat.
 */
function generateIncidentResponsePlan(threat) {
    const plans = {
        "DDoS": `Incident Response Plan for ${threat}: 1. Identify the source of attack. 2. Apply rate limiting. 3. Enable network filtering. 4. Report incident.`,
        "SQL Injection": `Incident Response Plan for ${threat}: 1. Identify affected databases. 2. Patch vulnerable SQL endpoints. 3. Monitor network for abnormal queries. 4. Report incident.`,
        "Phishing": `Incident Response Plan for ${threat}: 1. Identify affected users. 2. Block phishing domains. 3. Notify users and reset passwords. 4. Report incident.`,
        // Add more threats as needed
    };

    return plans[threat] || `Incident Response Plan for ${threat}: 1. Identify attack vector. 2. Isolate affected systems. 3. Apply mitigation. 4. Report incident.`;
}

/**
 * Stores the generated Incident Response Plan in SQLite.
 * @param {string} threat - Type of security threat.
 * @param {string} plan - Generated Incident Response Plan.
 */
function storeIncidentResponsePlan(threat, plan) {
    const query = `INSERT INTO incident_plans (threat_name, plan) VALUES (?, ?)`;

    db.run(query, [threat, plan], function(err) {
        if (err) {
            console.error('Error storing incident response plan:', err.message);
        } else {
            console.log('Incident response plan stored successfully.');
        }
    });
}

// Example usage
const threatType = 'DDoS';
const plan = generateIncidentResponsePlan(threatType);

// Store the generated plan in the database
storeIncidentResponsePlan(threatType, plan);

// Closing the database connection (best practice for Node.js)
db.close((err) => {
    if (err) {
        console.error('Error closing the database:', err.message);
    } else {
        console.log('Database connection closed.');
    }
});

