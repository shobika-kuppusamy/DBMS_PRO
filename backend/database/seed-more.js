const { query } = require('../config/db');

async function seedMore() {
    try {
        console.log('🌱 Expanding inventory matrix...');

        // Get category IDs
        const cats = await query('SELECT category_id, category_name FROM categories ORDER BY category_id ASC');
        const eCat = cats.rows.find(c => c.category_name === 'Electronics')?.category_id;
        const aCat = cats.rows.find(c => c.category_name === 'Apparel')?.category_id;
        const hCat = cats.rows.find(c => c.category_name === 'Home & Living')?.category_id;

        const moreProducts = [
            ['Stealth Gaming Mouse', 'Ultra-lightweight with 26K DPI sensor.', 79.99, 120, eCat, 'https://images.unsplash.com/photo-1527814050087-37a3c71cc115?q=80&w=800'],
            ['Artisan Coffee Press', 'Double-walled stainless steel for perfect brew.', 45.00, 40, hCat, 'https://images.unsplash.com/photo-1544333346-64e4feccf77d?q=80&w=800'],
            ['Kevlar Messenger Bag', 'Bulletproof grade durability for daily commute.', 180.00, 15, aCat, 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=800'],
            ['Organic Wool Throw', 'Hand-woven sustainable home accessory.', 95.00, 25, hCat, 'https://images.unsplash.com/photo-1580302521140-143c129c5a51?q=80&w=800'],
            ['Modular Desk Shelf', 'Aluminum and walnut organizational system.', 135.00, 10, hCat, 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?q=80&w=800'],
            ['Quantum ANC Earbuds', 'Real-time noise cancellation with 32h battery.', 150.00, 80, eCat, 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=800']
        ];

        for (const p of moreProducts) {
            await query(
                'INSERT INTO products (name, description, price, stock, category_id, image_url) VALUES ($1, $2, $3, $4, $5, $6)',
                p
            );
        }

        console.log(`✅ Successfully added ${moreProducts.length} more products!`);
        process.exit(0);
    } catch (err) {
        console.error('❌ Error seeding more:', err.message);
        process.exit(1);
    }
}

seedMore();
