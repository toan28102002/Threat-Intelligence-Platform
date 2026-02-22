const express = require('express');
const cors = require('cors');
const { Client } = require('pg');

const app = express();
const port = 3000;

// Enable CORS to allow requests from the front-end
app.use(cors());

// Set up PostgreSQL connection
const client = new Client({
    user: 'postgres',  // Replace with your PostgreSQL username
    host: 'localhost',
    database: 'Assigment2',  // Replace with your PostgreSQL database
    password: '123',  // Replace with your PostgreSQL password
    port: 5432,
});

client.connect()
    .then(() => console.log('Connected to PostgreSQL'))
    .catch((err) => console.error('Connection error', err.stack));

// Basic route for the API
app.get('/', (req, res) => {
    res.send('Threat Intelligence Platform API');
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
