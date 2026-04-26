const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { verifyToken, isAdmin } = require('../middleware/auth');

// --- Categories ---

// Get all categories
router.get('/categories', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM categories');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add category (Admin only)
router.post('/categories', verifyToken, isAdmin, async (req, res) => {
    const { name, description } = req.body;
    try {
        const result = await db.query(
            'INSERT INTO categories (category_name, category_description) VALUES ($1, $2) RETURNING *',
            [name, description]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- Products ---

// Get all products
router.get('/', async (req, res) => {
    try {
        const result = await db.query(`
            SELECT p.*, c.category_name 
            FROM products p 
            LEFT JOIN categories c ON p.category_id = c.category_id
        `);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get single product
router.get('/:id', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM products WHERE product_id = $1', [req.params.id]);
        if (result.rows.length === 0) return res.status(404).json({ message: 'Product not found' });
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add product (Admin only)
router.post('/', verifyToken, isAdmin, async (req, res) => {
    const { name, description, price, stock, category_id, image_url } = req.body;
    try {
        const result = await db.query(
            'INSERT INTO products (name, description, price, stock, category_id, image_url) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [name, description, price, stock, category_id, image_url]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update product (Admin only)
router.put('/:id', verifyToken, isAdmin, async (req, res) => {
    const { name, description, price, stock, category_id, image_url } = req.body;
    try {
        const result = await db.query(
            'UPDATE products SET name=$1, description=$2, price=$3, stock=$4, category_id=$5, image_url=$6 WHERE product_id=$7 RETURNING *',
            [name, description, price, stock, category_id, image_url, req.params.id]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete product (Admin only)
router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
    try {
        await db.query('DELETE FROM products WHERE product_id = $1', [req.params.id]);
        res.json({ message: 'Product deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
