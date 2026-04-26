import { useContext, useState, useRef, useEffect } from 'react';
import { ShopContext } from '../context/ShopContext';

const promoBanners = [
  {
    title: "Big Saving Days!",
    subtitle: "Get up to 40% OFF on Top Electronics & Brands.",
    image: "/laptop_1776097231661.png"
  },
  {
    title: "Flagship Smartphone Sale",
    subtitle: "Experience edge-to-edge displays. Exchange offers available.",
    image: "/smartphone_1776097249672.png"
  },
  {
    title: "Capture the Moment",
    subtitle: "Professional Mirrorless Cameras. No-cost EMI starting $49/mo.",
    image: "/camera_1776097270057.png"
  }
];

export default function Shop({ navigateTo, setSelectedProduct }) {
  const { addToCart, products, categories, searchQuery } = useContext(ShopContext);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [maxPrice, setMaxPrice] = useState(3000);
  const [minRating, setMinRating] = useState(0);
  const [bannerIndex, setBannerIndex] = useState(0);
  const [showCategories, setShowCategories] = useState(false);
  const productsRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setBannerIndex((prev) => (prev + 1) % promoBanners.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    navigateTo('productDetails');
  };

  const scrollToProducts = () => {
    productsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const filteredProducts = products.filter(p => {
    const query = searchQuery.toLowerCase().trim();
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesPrice = p.price <= maxPrice;
    const matchesRating = p.rating >= minRating;
    
    // Enhanced search: checks name, category, description and specs
    const matchesSearch = query === '' || 
                          p.name.toLowerCase().includes(query) || 
                          p.category.toLowerCase().includes(query) ||
                          p.description?.toLowerCase().includes(query) ||
                          p.specs?.some(spec => spec.toLowerCase().includes(query));
                          
    return matchesCategory && matchesPrice && matchesRating && matchesSearch;
  });


  return (
    <div className="fade-in">
      
      {/* Consolidated Catalog Dropdown */}
      <div className="catalog-dropdown-container" style={{ marginBottom: '2rem', position: 'relative', zIndex: 50 }}>
        <button 
          className="btn btn-secondary" 
          onClick={() => setShowCategories(!showCategories)}
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.75rem', 
            width: '240px', 
            justifyContent: 'space-between',
            padding: '1rem 1.5rem',
            borderRadius: '12px',
            border: '1px solid var(--accent-glow)'
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '1.2rem' }}>📦</span>
            {selectedCategory === 'All' ? 'Explore Catalog' : selectedCategory}
          </span>
          <span style={{ transform: showCategories ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }}>▼</span>
        </button>

        {showCategories && (
          <div className="dropdown-menu fade-in" style={{ 
            position: 'absolute', 
            top: '110%', 
            left: 0, 
            width: '240px', 
            padding: '0.5rem',
            background: 'var(--surface-color)',
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
            border: '1px solid var(--border-color)',
            borderRadius: '12px'
          }}>
            <div 
              className="dropdown-item" 
              onClick={() => { setSelectedCategory('All'); setShowCategories(false); }}
              style={{ padding: '0.75rem 1rem', display: 'flex', gap: '0.75rem', borderRadius: '8px' }}
            >
              <span>✨</span> All Products
            </div>
            {categories.map(cat => (
              <div 
                key={cat.id} 
                className="dropdown-item"
                onClick={() => { setSelectedCategory(cat.name); setShowCategories(false); }}
                style={{ padding: '0.75rem 1rem', display: 'flex', gap: '0.75rem', borderRadius: '8px' }}
              >
                <span>{cat.icon}</span> {cat.name}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Promotional Carousel Banner */}
      <div 
        className="promo-banner fade-in" 
        style={{ 
          backgroundImage: `linear-gradient(135deg, rgba(15, 23, 42, 0.8), rgba(0, 0, 0, 0.4)), url(${promoBanners[bannerIndex].image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          transition: 'background-image 0.5s ease-in-out'
        }}
      >
        <div className="promo-content">
          <h2>{promoBanners[bannerIndex].title}</h2>
          <p>{promoBanners[bannerIndex].subtitle}</p>
          <button className="btn btn-primary" style={{ marginTop: '1rem' }} onClick={scrollToProducts}>Shop Now</button>
        </div>
        
        <div className="carousel-indicators" style={{ position: 'absolute', bottom: '1rem', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '0.5rem' }}>
          {promoBanners.map((_, idx) => (
            <div 
              key={idx} 
              style={{
                width: idx === bannerIndex ? '20px' : '8px',
                height: '8px',
                borderRadius: '4px',
                backgroundColor: idx === bannerIndex ? 'var(--accent-color)' : 'rgba(255,255,255,0.5)',
                transition: 'width 0.3s ease, background-color 0.3s ease'
              }}
            />
          ))}
        </div>
      </div>

      <div ref={productsRef} className="shop-controls">
        <div className="controls-left">
          <h2 className="section-title">
            {selectedCategory === 'All' ? 'Explore Products' : `${selectedCategory}`}
            <span className="count-badge">{filteredProducts.length} items</span>
          </h2>
        </div>

        <div className="controls-right">
          {/* Filter Controls */}
          <div className="filter-chip-group">
            <div className="filter-dropdown">
              <label>Price: up to ${maxPrice}</label>
              <input 
                type="range" 
                min="0" 
                max="3000" 
                step="50" 
                value={maxPrice} 
                onChange={(e) => setMaxPrice(parseInt(e.target.value))} 
              />
            </div>
            
            <div className="filter-dropdown">
              <label>Rating: {minRating}+ ★</label>
              <select value={minRating} onChange={(e) => setMinRating(parseFloat(e.target.value))}>
                <option value="0">All Ratings</option>
                <option value="4">4+ Stars</option>
                <option value="4.5">4.5+ Stars</option>
              </select>
            </div>
          </div>

          {/* View Toggle */}
          <div className="view-toggle">
            <button 
              className={`toggle-btn ${viewMode === 'grid' ? 'active' : ''}`} 
              onClick={() => setViewMode('grid')}
              title="Grid View"
            >
              田
            </button>
            <button 
              className={`toggle-btn ${viewMode === 'list' ? 'active' : ''}`} 
              onClick={() => setViewMode('list')}
              title="List View"
            >
              ☰
            </button>
          </div>
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="empty-state">
           <h3>No products found match your filters</h3>
           <p>Try adjusting your price range or rating selection.</p>
           <button className="btn btn-secondary" onClick={() => { setMaxPrice(3000); setMinRating(0); setSelectedCategory('All'); }}>Clear All Filters</button>
        </div>
      ) : (
        <div className={viewMode === 'grid' ? 'product-grid' : 'product-list-view'}>
          {filteredProducts.map(product => (
            <div key={product.id} className={viewMode === 'grid' ? 'product-card' : 'list-card fade-in'}>
              
              <div className={viewMode === 'grid' ? 'product-image-container clickable' : 'list-image-container clickable'} onClick={() => handleProductClick(product)}>
                <img src={product.image} alt={product.name} className="product-img" />
                {viewMode === 'grid' && <div className="product-quick-view">Quick View</div>}
              </div>
              
              <div className={viewMode === 'grid' ? 'product-info clickable' : 'list-info-container'}>
                <div onClick={() => handleProductClick(product)} className="clickable">
                  <span className="product-category">{product.category}</span>
                  <h3 className="product-title">{product.name}</h3>
                  
                  <div className="pd-rating" style={{ marginBottom: '0.75rem', marginTop: '0.25rem' }}>
                    <span className="star-rating">★ {product.rating}</span>
                    <span className="reviews-count">({product.reviews} reviews)</span>
                  </div>

                  {viewMode === 'list' && <p className="list-description">{product.description}</p>}
                </div>

                <div className={viewMode === 'grid' ? 'product-footer' : 'list-footer'}>
                  <div className="price-stack">
                    <span className="product-price">${product.price.toFixed(2)}</span>
                    {product.discount > 0 && (
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <span className="original-price">${product.originalPrice.toFixed(2)}</span>
                        <span className="discount-tag">{product.discount}% OFF</span>
                      </div>
                    )}
                  </div>
                  
                  <button 
                    className="btn btn-primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(product);
                    }}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

