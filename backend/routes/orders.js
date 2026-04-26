const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { verifyToken } = require('../middleware/auth');

// Place Order
router.post('/place', verifyToken, async (req, res) => {
    const { payment_method } = req.body;
    try {
        // 1. Get cart items
        const cartResult = await db.query('SELECT cart_id FROM cart WHERE user_id = $1', [req.user.user_id]);
        const cart_id = cartResult.rows[0].cart_id;
        
        const cartItems = await db.query(`
            SELECT ci.*, p.price, p.stock 
            FROM cart_items ci 
            JOIN products p ON ci.product_id = p.product_id 
            WHERE ci.cart_id = $1
        `, [cart_id]);

        if (cartItems.rows.length === 0) return res.status(400).json({ message: 'Cart is empty' });

        // Calculate total
        const totalAmount = cartItems.rows.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        // 2. Create Order
        const orderResult = await db.query(
            'INSERT INTO orders (user_id, total_amount, status) VALUES ($1, $2, $3) RETURNING *',
            [req.user.user_id, totalAmount, 'Pending']
        );
        const order_id = orderResult.rows[0].order_id;

        // 3. Move items to order_items and update stock
        for (const item of cartItems.rows) {
            await db.query(
                'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)',
                [order_id, item.product_id, item.quantity, item.price]
            );
            await db.query(
                'UPDATE products SET stock = stock - $1 WHERE product_id = $2',
                [item.quantity, item.product_id]
            );
        }

        // 4. Create Payment entry
        await db.query(
            'INSERT INTO payment (order_id, payment_method, payment_status) VALUES ($1, $2, $3)',
            [order_id, payment_method, 'Pending']
        );

        // 5. Create Delivery entry
        await db.query(
            'INSERT INTO delivery (order_id, delivery_status) VALUES ($1, $2)',
            [order_id, 'Ordered']
        );

        // 6. Clear Cart
        await db.query('DELETE FROM cart_items WHERE cart_id = $1', [cart_id]);

        res.status(201).json(orderResult.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get user orders
router.get('/my-orders', verifyToken, async (req, res) => {
    try {
        const result = await db.query(`
            SELECT o.*, 
                   (SELECT json_agg(items) FROM (
                       SELECT oi.*, p.name FROM order_items oi 
                       JOIN products p ON oi.product_id = p.product_id 
                       WHERE oi.order_id = o.order_id
                   ) items) as order_items,
                   p.payment_status, p.payment_method,
                   d.delivery_status
            FROM orders o
            LEFT JOIN payment p ON o.order_id = p.order_id
            LEFT JOIN delivery d ON o.order_id = d.order_id
            WHERE o.user_id = $1
            ORDER BY o.order_date DESC
        `, [req.user.user_id]);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
