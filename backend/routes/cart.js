const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { verifyToken } = require('../middleware/auth');

// Get user cart items
router.get('/', verifyToken, async (req, res) => {
    try {
        const cartResult = await db.query('SELECT cart_id FROM cart WHERE user_id = $1', [req.user.user_id]);
        if (cartResult.rows.length === 0) return res.status(404).json({ message: 'Cart not found' });

        const items = await db.query(`
            SELECT ci.*, p.name, p.price, p.image_url 
            FROM cart_items ci
            JOIN products p ON ci.product_id = p.product_id
            WHERE ci.cart_id = $1
        `, [cartResult.rows[0].cart_id]);

        res.json(items.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add item to cart
router.post('/add', verifyToken, async (req, res) => {
    const { product_id, quantity } = req.body;
    try {
        const cartResult = await db.query('SELECT cart_id FROM cart WHERE user_id = $1', [req.user.user_id]);
        const cart_id = cartResult.rows[0].cart_id;

        // Check if item already in cart
        const existingItem = await db.query(
            'SELECT * FROM cart_items WHERE cart_id = $1 AND product_id = $2',
            [cart_id, product_id]
        );

        if (existingItem.rows.length > 0) {
            const result = await db.query(
                'UPDATE cart_items SET quantity = quantity + $1 WHERE cart_id = $2 AND product_id = $3 RETURNING *',
                [quantity || 1, cart_id, product_id]
            );
            return res.json(result.rows[0]);
        }

        const result = await db.query(
            'INSERT INTO cart_items (cart_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *',
            [cart_id, product_id, quantity || 1]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Remove item from cart
router.delete('/:item_id', verifyToken, async (req, res) => {
    try {
        await db.query('DELETE FROM cart_items WHERE cart_item_id = $1', [req.params.item_id]);
        res.json({ message: 'Item removed from cart' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
