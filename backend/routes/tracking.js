const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { verifyToken, isAdmin } = require('../middleware/auth');

// --- Payment ---

// Update payment status (Admin)
router.put('/payment/:order_id', verifyToken, isAdmin, async (req, res) => {
    const { status } = req.body;
    try {
        const result = await db.query(
            'UPDATE payment SET payment_status = $1, payment_date = NOW() WHERE order_id = $2 RETURNING *',
            [status, req.params.order_id]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- Delivery ---

// Update delivery status (Admin)
router.put('/delivery/:order_id', verifyToken, isAdmin, async (req, res) => {
    const { status } = req.body;
    try {
        const result = await db.query(
            'UPDATE delivery SET delivery_status = $1, delivery_date = CASE WHEN $1 = \'Delivered\' THEN NOW() ELSE delivery_date END WHERE order_id = $2 RETURNING *',
            [status, req.params.order_id]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get tracking info (User)
router.get('/track/:order_id', verifyToken, async (req, res) => {
    try {
        const result = await db.query(`
            SELECT o.order_id, o.status as order_status, o.order_date,
                   p.payment_status, p.payment_method,
                   d.delivery_status, d.delivery_date
            FROM orders o
            JOIN payment p ON o.order_id = p.order_id
            JOIN delivery d ON o.order_id = d.order_id
            WHERE o.order_id = $1 AND o.user_id = $2
        `, [req.params.order_id, req.user.user_id]);
        
        if (result.rows.length === 0) return res.status(404).json({ message: 'Order or tracking info not found' });
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
