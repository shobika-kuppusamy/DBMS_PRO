const { query } = require('./config/db');

async function seedLuxe() {
    try {
        console.log('🌱 Curating luxury collections...');

        // Get category IDs
        const cats = await query('SELECT category_id, category_name FROM categories ORDER BY category_id ASC');
        const eCat = cats.rows.find(c => c.category_name === 'Electronics')?.category_id;
        const aCat = cats.rows.find(c => c.category_name === 'Apparel')?.category_id;
        const hCat = cats.rows.find(c => c.category_name === 'Home & Living')?.category_id;

        const luxeProducts = [
            ['Gold-Leaf Mech Keyboard', 'Solid brass casing with 24k gold leaf keycaps.', 1250.00, 5, eCat, 'https://images.unsplash.com/photo-1595044426077-d36d9236d54a?q=80&w=800'],
            ['Silk Velvet Evening Gown', 'Hand-stitched mulberry silk with obsidian trim.', 2400.00, 3, aCat, 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=800'],
            ['Marble & Onyx Chess Set', 'Carved Italian Carrera marble vs Polished Onyx.', 450.00, 10, hCat, 'https://images.unsplash.com/photo-1529699211952-734e80c4d42b?q=80&w=800'],
            ['Silver-Ion Air Purifier', 'Aerospace grade filtration with silent turbine.', 899.00, 15, eCat, 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?q=80&w=800'],
            ['Cashmere Lounge Suit', 'Ultra-soft Tibetan cashmere for elite relaxation.', 1100.00, 20, aCat, 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=800'],
            ['Crystal Decanter Set', 'Lead-free crystal with platinum rim details.', 320.00, 30, hCat, 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=800'],
            ['Skeleton Tourbillon Watch', 'Manual wind movement with sapphire transparency.', 4200.00, 2, eCat, 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=800'],
            ['Leather Executive Desk', 'Top-grain Tuscan leather with mahogany frame.', 3100.00, 4, hCat, 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?q=80&w=800'],
            ['Diamond Studded Earbuds', 'Real diamond accents with studio-master audio.', 1500.00, 8, eCat, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800'],
            ['Vicuna Wool Overcoat', 'The rarest wool in the world, extreme warmth.', 5600.00, 1, aCat, 'https://images.unsplash.com/photo-1539533727851-6a45743a4838?q=80&w=800']
        ];

        for (const p of luxeProducts) {
            await query(
                'INSERT INTO products (name, description, price, stock, category_id, image_url) VALUES ($1, $2, $3, $4, $5, $6)',
                p
            );
        }

        console.log(`✅ ${luxeProducts.length} Luxury items added to the gallery!`);
        process.exit(0);
    } catch (err) {
        console.error('❌ Error seeding luxury:', err.message);
        process.exit(1);
    }
}

seedLuxe();
