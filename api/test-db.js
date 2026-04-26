const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

module.exports = async (req, res) => {
  try {
    console.log('Testing connection to:', process.env.DATABASE_URL ? 'URL Found' : 'URL MISSING');
    
    if (!process.env.DATABASE_URL) {
      return res.status(500).json({ 
        status: 'Error', 
        message: 'DATABASE_URL is missing in Vercel Environment Variables. Please add it!' 
      });
    }

    const { rows } = await pool.query('SELECT NOW(), current_database()');
    
    // Also check if tables exist
    const tables = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);

    res.status(200).json({ 
      status: 'Connected ✅', 
      time: rows[0].now,
      database: rows[0].current_database,
      available_tables: tables.rows.map(t => t.table_name)
    });
  } catch (error) {
    console.error('Diagnostic Error:', error.message);
    res.status(500).json({ 
      status: 'Connection Failed ❌', 
      error: error.message,
      hint: 'Check if your DATABASE_URL in Vercel settings is correct and matches your Neon dashboard.'
    });
  }
};
