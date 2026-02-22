// populate_test_data.js
const path = require('path');
require('dotenv').config();

// Import centralized database connection
const db = require('./database/db');

console.log('🔄 Populating database with test data...');

// Insert test data into threat_data table
const insertThreatData = async () => {
  const testIPs = [
    { ip: '8.8.8.8', threat: 'moderate', confidence: 45 },
    { ip: '1.1.1.1', threat: 'low', confidence: 20 },
    { ip: '192.168.1.1', threat: 'high', confidence: 85 }
  ];

  for (const item of testIPs) {
    const query = `
      INSERT OR REPLACE INTO threat_data (
        ip_address,
        ports,
        hostnames
      ) VALUES (?, ?, ?)
    `;
    
    db.run(
      query, 
      [item.ip, `confidence: ${item.confidence}`, `threat: ${item.threat}`], 
      function(err) {
        if (err) {
          console.error(`❌ Error inserting test data for ${item.ip}:`, err.message);
        } else {
          console.log(`✅ Test data inserted for IP: ${item.ip}`);
        }
      }
    );
  }
};

// Insert test data into tva_mapping table
const insertTVAData = async () => {
  const testTVAs = [
    { 
      asset_id: 'A001', 
      threat_name: 'DNS Hijacking',
      vulnerability_description: 'Public DNS server with moderate threat level',
      likelihood: 'Medium',
      impact: 'Medium'
    },
    { 
      asset_id: 'A002', 
      threat_name: 'Router Compromise',
      vulnerability_description: 'Internal router with potential backdoor',
      likelihood: 'High',
      impact: 'High'
    }
  ];

  for (const item of testTVAs) {
    const query = `
      INSERT INTO tva_mapping (
        asset_id,
        threat_name,
        vulnerability_description,
        likelihood,
        impact
      ) VALUES (?, ?, ?, ?, ?)
    `;
    
    db.run(
      query, 
      [item.asset_id, item.threat_name, item.vulnerability_description, item.likelihood, item.impact], 
      function(err) {
        if (err) {
          console.error(`❌ Error inserting TVA mapping for ${item.asset_id}:`, err.message);
        } else {
          console.log(`✅ TVA mapping inserted for asset ID: ${item.asset_id}`);
        }
      }
    );
  }
};

// Insert test alert
const insertTestAlert = async () => {
  const query = `
    INSERT INTO alerts (
      message,
      level
    ) VALUES (?, ?)
  `;
  
  db.run(
    query, 
    ['Alert: Test threat detected from 8.8.8.8', 'Medium'], 
    function(err) {
      if (err) {
        console.error('❌ Error inserting test alert:', err.message);
      } else {
        console.log('✅ Test alert inserted');
      }
    }
  );
};

// Run all functions to populate test data
const populateAll = async () => {
  try {
    await insertThreatData();
    await insertTVAData();
    await insertTestAlert();
    
    console.log('✅ Test data population completed');
    
    // Wait for async operations to complete
    setTimeout(() => {
      process.exit(0);
    }, 1000);
  } catch (error) {
    console.error('❌ Error populating test data:', error);
    process.exit(1);
  }
};

// Execute
populateAll(); 