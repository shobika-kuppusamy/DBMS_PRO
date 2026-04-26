require('dotenv').config({ path: 'backend/.env' });
const { Client } = require('pg');
const bcrypt = require('bcryptjs');

async function updatePassword() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash('password123', salt);
  await client.query('UPDATE users SET password = $1 WHERE email = $2', [hashedPassword, 'shobikak.24cse@kongu.edu']);
  console.log('Password reset to password123');
  await client.end();
}
updatePassword();
