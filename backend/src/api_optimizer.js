// api_optimizer.js

const axios = require("axios");
const redis = require("redis");
const path = require("path");

// Import centralized environment variables
const env = require('./config/env');

// Import centralized database connection
const db = require('./database/db');

// Redis client setup
const client = redis.createClient({
  url: env.REDIS_URL || "redis://localhost:6379",
});

client.connect()
  .then(() => console.log("✅ Connected to Redis"))
  .catch((err) => console.error("❌ Redis connection error:", err.message));

// Fetch from Shodan API
async function fetchFromOSINT(ip) {
  const SHODAN_API_KEY = process.env.SHODAN_API_KEY;
  const url = `https://api.shodan.io/shodan/host/${ip}?key=${SHODAN_API_KEY}`;

  try {
    const response = await axios.get(url);
    const threat_level = response.data.tags.includes("malicious") ? "high" : "moderate";
    const confidence = response.data.ports?.length ? Math.min(100, response.data.ports.length * 10) : 30;

    return {
      ip,
      threat_level,
      confidence
    };
  } catch (error) {
    console.error(`❌ Error fetching OSINT for ${ip}:`, error.message);
    return {
      ip,
      threat_level: "unknown",
      confidence: 0
    };
  }
}

// Store in SQLite
function storeThreatData(ip, threat_level, confidence) {
  // First try to get existing data to avoid duplicate entries
  db.get("SELECT * FROM threat_data WHERE ip_address = ?", [ip], (err, row) => {
    if (err) {
      console.error("❌ SQLite read error:", err.message);
      return;
    }

    // Format the data for storage
    const ports = `confidence: ${confidence}`;
    const hostnames = `threat: ${threat_level}`;

    let query;
    let values;
    
    if (row) {
      // Update existing record
      query = `
        UPDATE threat_data 
        SET ports = ?, hostnames = ?
        WHERE ip_address = ?
      `;
      values = [ports, hostnames, ip];
    } else {
      // Insert new record
      query = `
        INSERT INTO threat_data (ip_address, ports, hostnames)
        VALUES (?, ?, ?)
      `;
      values = [ip, ports, hostnames];
    }

    db.run(query, values, function (err) {
      if (err) {
        console.error("❌ SQLite insert/update error:", err.message);
      } else {
        console.log(`✅ Data for ${ip} saved to SQLite (ID: ${this.lastID || 'updated existing'}).`);
        
        // Also add to TVA mapping if this is a new threat
        if (!row) {
          const tvaQuery = `
            INSERT INTO tva_mapping (
              asset_id, 
              threat_name, 
              vulnerability_description, 
              likelihood, 
              impact
            ) VALUES (?, ?, ?, ?, ?)
          `;
          const assetId = `IP-${ip.replace(/\./g, '')}`;
          const threatName = threat_level === 'high' ? 'High Risk IP' : 'Potential Threat';
          const vulnDesc = `IP ${ip} identified with ${threat_level} threat level (confidence: ${confidence}%)`;
          const likelihood = threat_level === 'high' ? 'High' : 'Medium';
          const impact = confidence > 70 ? 'High' : 'Medium';
          
          db.run(tvaQuery, [assetId, threatName, vulnDesc, likelihood, impact], function(err) {
            if (err) {
              console.error("❌ SQLite TVA insert error:", err.message);
            } else {
              console.log(`✅ TVA mapping created for ${ip}`);
            }
          });
        }
      }
    });
  });
}

// Get threat data from Redis > SQLite > OSINT
async function getThreatData(ip) {
  console.log(`🔍 Getting threat data for IP: ${ip}`);
  
  try {
    // Check Redis
    let cached;
    try {
      cached = await client.get(ip);
    } catch (redisErr) {
      console.error("❌ Redis error:", redisErr.message);
      // Continue without Redis if it fails
    }

    if (cached) {
      console.log(`🟢 Redis cache hit for IP: ${ip}`);
      return JSON.parse(cached);
    }

    // Check SQLite
    return new Promise((resolve, reject) => {
      db.get("SELECT * FROM threat_data WHERE ip_address = ?", [ip], async (err, row) => {
        if (err) {
          console.error("❌ SQLite read error:", err.message);
          return reject(err);
        }

        if (row) {
          console.log(`🟡 SQLite hit for IP: ${ip}`);
          let threat_level = "unknown";
          let confidence = 0;
          
          try {
            if (row.hostnames && row.hostnames.includes('threat:')) {
              threat_level = row.hostnames.split('threat:')[1].trim();
            }
            
            if (row.ports && row.ports.includes('confidence:')) {
              confidence = parseInt(row.ports.split('confidence:')[1].trim()) || 0;
            }
          } catch (parseErr) {
            console.warn(`⚠️ Error parsing data for ${ip}:`, parseErr.message);
          }
          
          const data = {
            ip: row.ip_address,
            threat_level,
            confidence,
            source: "local_database",
            last_updated: new Date().toISOString()
          };

          // Store in Redis for future use
          try {
            await client.setEx(ip, 3600, JSON.stringify(data));
          } catch (redisErr) {
            console.warn("⚠️ Redis caching error:", redisErr.message);
            // Continue without Redis if it fails
          }
          
          return resolve(data);
        }

        // Fallback to OSINT
        console.log(`🔴 No data found in local storage — fetching from Shodan...`);
        let data;
        
        try {
          data = await fetchFromOSINT(ip);
          
          // Add metadata
          data.source = "shodan_api";
          data.last_updated = new Date().toISOString();
          
          // Cache in Redis
          try {
            await client.setEx(ip, 3600, JSON.stringify(data));
          } catch (redisErr) {
            console.warn("⚠️ Redis caching error:", redisErr.message);
            // Continue without Redis if it fails
          }
          
          // Store in SQLite for future use
          storeThreatData(data.ip, data.threat_level, data.confidence);
        } catch (osintErr) {
          console.error("❌ OSINT fetch error:", osintErr.message);
          // Return basic data if OSINT fails
          data = {
            ip,
            threat_level: "unknown",
            confidence: 0,
            source: "error",
            error: osintErr.message,
            last_updated: new Date().toISOString()
          };
        }

        return resolve(data);
      });
    });
  } catch (error) {
    console.error("❌ Error in getThreatData:", error.message);
    // Return basic data even if everything fails
    return {
      ip,
      threat_level: "unknown",
      confidence: 0,
      source: "error",
      error: error.message,
      last_updated: new Date().toISOString()
    };
  }
}

module.exports = {
  getThreatData,
  fetchFromOSINT,
  storeThreatData
};
