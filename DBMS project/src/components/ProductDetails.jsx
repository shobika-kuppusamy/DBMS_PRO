import { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';

export default function ProductDetails({ product, navigateTo, setSelectedProduct, onBack }) {
  const { addToCart, products } = useContext(ShopContext);

  if (!product) return null;


  const recommendations = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  // Generate unique sales data based on product ID
  const salesData = [...Array(7)].map((_, i) => {
    const seed = (product.id.length + i) * 13;
    return 20 + (seed % 80);
  });

  // Mock unique reviews based on category/id
  const getMockReviews = () => {
    const reviewPool = [
      { user: "Sarah J.", comment: "Absolutely love the quality of this!", date: "2 days ago" },
      { user: "Michael R.", comment: "Great value for money. Highly recommended.", date: "1 week ago" },
      { user: "Emily D.", comment: "Fast shipping and amazing support.", date: "3 days ago" },
      { user: "John K.", comment: "Exactly as described. Perfect!", date: "Yesterday" },
      { user: "Lisa M.", comment: "The design is very modern and sleek.", date: "5 days ago" },
      { user: "Alex T.", comment: "Exceeded my expectations entirely.", date: "2 weeks ago" }
    ];
    // Pick 3 reviews based on product id
    return reviewPool.filter((_, i) => (product.id.length + i) % 2 === 0).slice(0, 3);
  };

  const reviewsList = getMockReviews();

  // Pie Chart Data (Rating Distribution)
  const fiveStars = Math.min(90, product.rating * 18);
  const others = 100 - fiveStars;

  return (
    <div className="fade-in">
      <button className="btn btn-secondary back-btn" onClick={onBack}>
        &larr; Back to Shop
      </button>

      <div className="product-details-container">
        <div className="pd-image-col">
          <div className="pd-main-image-container">
            <img src={product.image} alt={product.name} className="pd-main-image" />
          </div>
          
          {/* Detailed Stats Section */}
          <div className="detailed-stats">
            <div className="sales-trend-card">
              <h4>Sales Performance</h4>
              <div className="graph-container">
                <svg viewBox="0 0 400 150" className="trend-line-svg">
                  <path
                    d={`M ${salesData.map((d, i) => `${(i * 60) + 20},${130 - d}`).join(' L ')}`}
                    fill="none"
                    stroke="var(--accent-color)"
                    strokeWidth="3"
                  />
                  {salesData.map((d, i) => (
                    <circle key={i} cx={(i * 60) + 20} cy={130 - d} r="4" fill="var(--accent-color)" />
                  ))}
                  <line x1="20" y1="140" x2="380" y2="140" stroke="var(--border-color)" strokeWidth="1" />
                </svg>
                <div className="graph-labels">
                  <span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span>
                </div>
              </div>
            </div>

            <div className="pie-chart-card">
              <h4>Satisfaction Index</h4>
              <div className="pie-container">
                <div 
                  className="donut-chart" 
                  style={{ 
                    background: `conic-gradient(var(--accent-color) ${fiveStars}%, var(--border-color) 0)` 
                  }}
                  title={`${fiveStars}% Positive Feedback`}
                >
                  <div className="donut-center">
                    <span className="donut-val">{product.rating}</span>
                    <span className="donut-label">Stars</span>
                  </div>
                </div>
                <div className="pie-legend">
                  <div className="legend-item"><span className="dot" style={{ background: 'var(--accent-color)' }}></span> Positive Reviews</div>
                  <div className="legend-item"><span className="dot" style={{ background: 'var(--border-color)' }}></span> Neutral Feedback</div>
                </div>
              </div>
            </div>

          </div>
        </div>

        <div className="pd-info-col">
          <div className="pd-category">{product.category}</div>
          <h1 className="pd-title">{product.name}</h1>
          
          <div className="pd-rating">
            <span className="star-rating">★ {product.rating}</span>
            <span className="reviews-count">({product.reviews} Ratings & Reviews)</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem', marginBottom: '1.5rem' }}>
            <div className="pd-price">${product.price.toFixed(2)}</div>
            {product.discount > 0 && (
              <div style={{ textDecoration: 'line-through', color: 'var(--text-secondary)', fontSize: '1.2rem' }}>
                ${product.originalPrice.toFixed(2)}
              </div>
            )}
          </div>
          
          <p className="pd-description">{product.description}</p>

          <div className="pd-specs">
            <h3>Key Specifications</h3>
            <ul>
              {product.specs?.map((spec, i) => (
                <li key={i}>{spec}</li>
              ))}
            </ul>
          </div>

          <div className="pd-actions">
            <button className="btn btn-primary" style={{ flex: 1, padding: '1rem' }} onClick={() => addToCart(product)}>Add to Cart</button>
            <button className="btn btn-secondary" style={{ flex: 1, padding: '1rem', backgroundColor: 'var(--accent-color)', color: 'white', border: 'none' }} onClick={() => { addToCart(product); navigateTo('cart'); }}>Buy Now</button>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="reviews-section" style={{ marginTop: '4rem' }}>
        <h2 className="section-title">Customer Reviews</h2>
        <div className="reviews-grid">
          {reviewsList.map((rev, i) => (
            <div key={i} className="review-card">
              <div className="review-header">
                <span className="review-user">{rev.user}</span>
                <span className="review-stars">★ {product.rating}</span>
              </div>
              <p className="review-comment">{rev.comment}</p>
              <span className="review-date">{rev.date}</span>
            </div>
          ))}
        </div>
      </div>

      {recommendations.length > 0 && (


        <div className="recommendations-section" style={{ marginTop: '4rem' }}>
          <h2 className="section-title" style={{ marginBottom: '2rem' }}>You May Also Like</h2>
          <div className="product-grid">
            {recommendations.map(rec => (
              <div 
                key={rec.id} 
                className="product-card" 
                onClick={() => { 
                  setSelectedProduct(rec); 
                  window.scrollTo({ top: 0, behavior: 'smooth' }); 
                }}
              >

                <div className="product-image-container clickable" style={{ height: '200px' }}>
                  <img src={rec.image} alt={rec.name} className="product-img" />
                </div>
                <div className="product-info" style={{ padding: '1rem' }}>
                  <h3 className="product-title" style={{ fontSize: '1rem' }}>{rec.name}</h3>
                  <div className="product-price">${rec.price.toFixed(2)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

