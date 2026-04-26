const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

pool.on('connect', () => {
    console.log('✅ Successfully connected to Supabase PostgreSQL');
});

// Test the connection immediately
pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('❌ Database connection error:', err.message);
    } else {
        console.log('🚀 Database connection verified at:', res.rows[0].now);
    }
});

module.exports = {
    query: (text, params) => pool.query(text, params),
};
