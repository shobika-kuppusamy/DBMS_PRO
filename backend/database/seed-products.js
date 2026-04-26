const { query } = require('../config/db');

async function seed() {
    try {
        console.log('🌱 Analyzing database status...');

        // 1. Ensure categories exist
        const catCheck = await query('SELECT count(*) FROM categories');
        if (parseInt(catCheck.rows[0].count) === 0) {
            console.log('Inserting default categories...');
            await query(`
                INSERT INTO categories (category_name, category_description) 
                VALUES 
                ('Electronics', 'Next-gen gadgets and hardware'), 
                ('Apparel', 'Architectural fashion and techwear'), 
                ('Home & Living', 'Modern interior design and lighting')
            `);
        }

        // Get category IDs
        const cats = await query('SELECT category_id FROM categories ORDER BY category_id ASC');
        const eCat = cats.rows[0].category_id;
        const aCat = cats.rows[1].category_id;
        const hCat = cats.rows[2].category_id;

        // 2. Add Sample Products
        const sampleProducts = [
            ['Aether Pulse Pro', 'Professional grade wireless audio with neural noise cancellation.', 299.99, 50, eCat, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800'],
            ['Midnight Techwear Hoodie', 'High-performance architectural fashion with waterproof membrane.', 150.00, 30, aCat, 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=800'],
            ['Neural Keyboard', 'Low-profile mechanical switches with reactive RGB lighting.', 120.50, 100, eCat, 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?q=80&w=800'],
            ['Modernist Table Lamp', 'Geometric minimalist lighting for creative workstation setups.', 85.00, 20, hCat, 'https://images.unsplash.com/photo-1507473885765-e6ed03473211?q=80&w=800'],
            ['X2 Smart Watch', 'Biometric tracking with 14-day battery and AMOLED display.', 199.00, 45, eCat, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800']
        ];

        console.log('Planting products into the matrix...');
        for (const p of sampleProducts) {
            await query(
                'INSERT INTO products (name, description, price, stock, category_id, image_url) VALUES ($1, $2, $3, $4, $5, $6)',
                p
            );
        }

        console.log('✅ Database seeding complete! Your store is now live with inventory.');
        process.exit(0);
    } catch (err) {
        console.error('❌ Error seeding database:', err.message);
        process.exit(1);
    }
}

seed();
