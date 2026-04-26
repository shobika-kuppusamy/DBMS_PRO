const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

// Register
router.post('/register', async (req, res) => {
    const { name, email, password, phone, address } = req.body;
    try {
        const userExist = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userExist.rows.length > 0) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const newUser = await db.query(
            'INSERT INTO users (name, email, password, phone, address, role) VALUES ($1, $2, $3, $4, $5, $6) RETURNING user_id, name, email, role',
            [name, email, password, phone, address, 'user']
        );

        // Create a cart for the new user
        await db.query('INSERT INTO cart (user_id) VALUES ($1)', [newUser.rows[0].user_id]);

        res.status(201).json(newUser.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        if (user.rows.length === 0) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const validPass = (password === user.rows[0].password);
        if (!validPass) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { user_id: user.rows[0].user_id, role: user.rows[0].role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            token,
            user: {
                id: user.rows[0].user_id,
                name: user.rows[0].name,
                email: user.rows[0].email,
                role: user.rows[0].role
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
