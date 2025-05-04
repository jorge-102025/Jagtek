const express = require('express');
const { Pool } = require('pg');

const app = express();
const port = 3000;

// Middleware to parse JSON
app.use(express.json());

// Create a new pool instance to connect to the PostgreSQL database
const pool = new Pool({
    user: 'your_username',
    host: 'localhost',
    database: 'your_database',
    password: 'your_password',
    port: 5432,
});

// API endpoint to get orders
app.get('/api/orders', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM orders');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// API endpoint to create a new order
app.post('/api/orders', async (req, res) => {
    const { product, quantity } = req.body;
    try {
        const result = await pool.query('INSERT INTO orders (product, quantity) VALUES ($1, $2) RETURNING *', [product, quantity]);
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
