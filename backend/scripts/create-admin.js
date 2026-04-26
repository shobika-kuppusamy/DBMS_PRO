const { query } = require('../config/db');
const bcrypt = require('bcryptjs');

async function createAdmin() {
    try {
        const name = "System Admin";
        const email = "admin@example.com";
        const password = "admin123";
        const role = "admin";

        console.log('Attempting to connect to database...');

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Check if user already exists
        const userExist = await query('SELECT * FROM users WHERE email = $1', [email]);
        
        if (userExist.rows.length > 0) {
            console.log('Admin user with this email already exists.');
            console.log('Updating user status to admin and resetting password...');
            await query(
                'UPDATE users SET role = $1, password = $2 WHERE email = $3', 
                [role, hashedPassword, email]
            );
            console.log('✅ Admin account updated and password reset to "admin123".');
        } else {
            console.log('Creating fresh Admin user...');
            await query(
                'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4)',
                [name, email, hashedPassword, role]
            );
            console.log('✅ Admin user created successfully!');
        }
        
        // Final verify
        const verify = await query('SELECT name, role FROM users WHERE email = $1', [email]);
        console.log('Verified User Role:', verify.rows[0].role);

        process.exit(0);
    } catch (err) {
        console.error('❌ Error during script execution:', err.message);
        process.exit(1);
    }
}

createAdmin();
