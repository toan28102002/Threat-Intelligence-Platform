const fs = require('fs');
const path = require('path');

// Path to the src directory
const srcDir = __dirname;

// Function to process a file
const processFile = (filePath) => {
  // Skip the current script
  if (filePath.includes('fix-imports.js')) return;
  
  // Skip the already fixed files
  if (filePath.includes('config/env.js') || filePath.includes('database/db.js')) return;
  
  console.log(`Processing ${filePath}...`);
  
  // Read the file
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Replace old database imports
  if (content.includes("require('../db/db')")) {
    content = content.replace(
      "const db = require('../db/db');", 
      "// Import centralized database connection\nconst db = require('./database/db');"
    );
    console.log(`- Fixed database import in ${filePath}`);
  }
  
  // Replace dotenv config
  if (content.includes("require('dotenv').config()")) {
    content = content.replace(
      "require('dotenv').config();", 
      "// Import centralized environment variables\nconst env = require('./config/env');"
    );
    
    // Also replace process.env references with env
    content = content.replace(/process\.env\./g, 'env.');
    console.log(`- Fixed dotenv config in ${filePath}`);
  }
  
  // Write the file back
  fs.writeFileSync(filePath, content);
};

// Process all JS files in src directory
const processDir = (dir) => {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      // Skip config and database directories as they're already fixed
      if (entry.name !== 'config' && entry.name !== 'database') {
        processDir(fullPath);
      }
    } else if (entry.name.endsWith('.js')) {
      processFile(fullPath);
    }
  }
};

// Create config and database directories if they don't exist
const configDir = path.join(srcDir, 'config');
const dbDir = path.join(srcDir, 'database');

if (!fs.existsSync(configDir)) {
  fs.mkdirSync(configDir);
  console.log('Created config directory');
}

if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir);
  console.log('Created database directory');
}

// Start processing
processDir(srcDir);

console.log('All files processed!'); 