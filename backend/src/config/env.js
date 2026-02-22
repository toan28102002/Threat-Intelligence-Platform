const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from srv.env
dotenv.config({ path: path.resolve(__dirname, '../../srv.env') });

module.exports = process.env; 