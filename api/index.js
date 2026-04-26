const express = require('express');
const cors = require('cors');
const path = require('path');

// Initialize Express
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Import your existing routes from the backend folder
// Note: We use relative paths to point to your existing logic
const authRoutes = require('../backend/routes/auth');
const productRoutes = require('../backend/routes/products');
const cartRoutes = require('../backend/routes/cart');
const orderRoutes = require('../backend/routes/orders');
const trackingRoutes = require('../backend/routes/tracking');

// Register Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/tracking', trackingRoutes);

// Health Check / Root
app.get('/api', (req, res) => {
    res.json({ status: 'Online', message: 'Aura Luxe API is active' });
});

module.exports = app;
