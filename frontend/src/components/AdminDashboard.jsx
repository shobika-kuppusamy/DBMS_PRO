import { useContext, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import { AuthContext } from '../context/AuthContext';

export default function AdminDashboard() {
  const { products, addProduct, updateProduct, deleteProduct, categories } = useContext(ShopContext);
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('inventory'); // inventory, overview, orders
  
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState({
    name: '',
    price: '',
    originalPrice: '',
    discount: '',
    image: '',
    category: categories[0]?.name || '',
    description: '',
    rating: 5,
    reviews: 0,
    specs: []
  });

  const [specInput, setSpecInput] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleAddSpec = () => {
    if (specInput.trim()) {
      setCurrentProduct(prev => ({ ...prev, specs: [...prev.specs, specInput.trim()] }));
      setSpecInput('');
    }
  };

  const handleRemoveSpec = (index) => {
    setCurrentProduct(prev => ({ ...prev, specs: prev.specs.filter((_, i) => i !== index) }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const productData = {
      ...currentProduct,
      price: parseFloat(currentProduct.price),
      originalPrice: parseFloat(currentProduct.originalPrice || currentProduct.price),
      discount: parseInt(currentProduct.discount || 0),
      rating: parseFloat(currentProduct.rating),
      reviews: parseInt(currentProduct.reviews)
    };

    if (isEditing) {
      updateProduct(productData);
    } else {
      addProduct(productData);
    }

    resetForm();
    alert(isEditing ? 'Product updated!' : 'Product added!');
  };

  const resetForm = () => {
    setIsEditing(false);
    setCurrentProduct({
      name: '',
      price: '',
      originalPrice: '',
      discount: '',
      image: '',
      category: categories[0]?.name || '',
      description: '',
      rating: 5,
      reviews: 0,
      specs: []
    });
  };

  const handleEditClick = (product) => {
    setCurrentProduct(product);
    setIsEditing(true);
    // Scroll handling is easier in the new scrollable main area
  };

  return (
    <div className="admin-portal fade-in">
      {/* --- Sidebar --- */}
      <aside className="admin-sidebar">
        <div className="admin-logo">AURA SYSTEM</div>
        
        <nav className="admin-nav">
          <button 
            className={`admin-nav-item ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            📊 Overview
          </button>
          <button 
            className={`admin-nav-item ${activeTab === 'inventory' ? 'active' : ''}`}
            onClick={() => setActiveTab('inventory')}
          >
            📦 Inventory
          </button>
          <button 
            className={`admin-nav-item ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => { setActiveTab('orders'); alert('Order management module loading...'); }}
          >
            🛒 Orders
          </button>
          <button 
            className={`admin-nav-item ${activeTab === 'customers' ? 'active' : ''}`}
            onClick={() => alert('Customer management module loading...')}
          >
            👥 Customers
          </button>
        </nav>

        <div style={{ marginTop: 'auto', paddingTop: '2rem' }}>
          <div className="card" style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)' }}>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Logged in as:</div>
            <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>{user?.name}</div>
          </div>
        </div>
      </aside>

      {/* --- Main Content --- */}
      <main className="admin-main">
        <header className="admin-top-bar">
          <div style={{ fontWeight: '700', color: '#94a3b8' }}>
            System Console / <span style={{ color: 'white' }}>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</span>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
             <button className="admin-exit-btn" onClick={() => window.location.reload()}>Exit Portal</button>
          </div>
        </header>

        <div className="admin-content-area">
          {activeTab === 'overview' && (
            <div className="fade-in">
              <div className="dash-header">
                <h1 className="dash-title">System Overview</h1>
                <p className="dash-subtitle">Real-time performance metrics and store health.</p>
              </div>

              <div className="stats-grid">
                <div className="stat-card">
                  <span className="stat-label">Total Revenue</span>
                  <div className="stat-value">$124,500.00</div>
                  <span className="stat-trend trend-up">↑ 12.5% from last month</span>
                </div>
                <div className="stat-card">
                  <span className="stat-label">Total Products</span>
                  <div className="stat-value">{products.length}</div>
                  <span className="stat-trend">Live in inventory</span>
                </div>
                <div className="stat-card">
                  <span className="stat-label">Total Orders</span>
                  <div className="stat-value">842</div>
                  <span className="stat-trend trend-up">↑ 4 new today</span>
                </div>
                <div className="stat-card">
                  <span className="stat-label">Active Users</span>
                  <div className="stat-value">1,240</div>
                  <span className="stat-trend trend-down">↓ 2.1% from last week</span>
                </div>
              </div>

              <div className="card" style={{ height: '300px', display: 'flex', alignItems: 'center', justifyCenter: 'center', opacity: 0.5 }}>
                 [ Sales Chart Analytics Module Placeholder ]
              </div>
            </div>
          )}

          {activeTab === 'inventory' && (
            <div className="fade-in">
              <div className="admin-grid" style={{ gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 2fr)' }}>
                {/* Product Form */}
                <div className="admin-form-container card">
                  <h3 style={{ marginBottom: '1.5rem' }}>{isEditing ? '✏️ Edit Product' : '➕ Add New Product'}</h3>
                  <form onSubmit={handleSubmit} className="admin-form">
                    <div className="form-group">
                      <label>Product Name</label>
                      <input 
                        name="name" 
                        value={currentProduct.name} 
                        onChange={handleInputChange} 
                        required 
                        className="form-control"
                      />
                    </div>

                    <div className="form-row" style={{ display: 'flex', gap: '1rem' }}>
                      <div className="form-group" style={{ flex: 1 }}>
                        <label>Price ($)</label>
                        <input 
                          name="price" 
                          type="number" 
                          step="0.01" 
                          value={currentProduct.price} 
                          onChange={handleInputChange} 
                          required 
                          className="form-control"
                        />
                      </div>
                      <div className="form-group" style={{ flex: 1 }}>
                        <label>Category</label>
                        <select name="category" value={currentProduct.category} onChange={handleInputChange} className="form-control">
                          {categories.map(cat => (
                            <option key={cat.id} value={cat.name}>{cat.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Image URL</label>
                      <input 
                        name="image" 
                        value={currentProduct.image} 
                        onChange={handleInputChange} 
                        className="form-control"
                        placeholder="https://example.com/item.png"
                      />
                    </div>

                    <div className="form-group">
                      <label>Description</label>
                      <textarea 
                        name="description" 
                        value={currentProduct.description} 
                        onChange={handleInputChange} 
                        rows="4"
                        className="form-control"
                      ></textarea>
                    </div>

                    <div className="form-actions" style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                      <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                        {isEditing ? 'Update Matrix' : 'Initialize Product'}
                      </button>
                      {isEditing && <button type="button" className="btn btn-secondary" onClick={resetForm}>Cancel</button>}
                    </div>
                  </form>
                </div>

                {/* Product List */}
                <div className="admin-list-container card" style={{ background: 'transparent' }}>
                  <h3 style={{ marginBottom: '1.5rem' }}>Inventory Matrix ({products.length})</h3>
                  <div className="admin-table-wrapper" style={{ maxHeight: '600px', overflowY: 'auto' }}>
                    <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead style={{ position: 'sticky', top: 0, backgroundColor: '#0f172a', zIndex: 10 }}>
                        <tr style={{ textAlign: 'left', borderBottom: '1px solid #1e293b' }}>
                          <th style={{ padding: '1rem' }}>Product</th>
                          <th style={{ padding: '1rem' }}>Category</th>
                          <th style={{ padding: '1rem' }}>Price</th>
                          <th style={{ padding: '1rem' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.map(product => {
                          const pid = product.product_id || product.id;
                          return (
                            <tr key={pid} style={{ borderBottom: '1px solid #1e293b' }}>
                              <td style={{ padding: '1rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                  <img src={product.image_url || product.image} alt="" style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '8px' }} />
                                  <div style={{ fontWeight: '600' }}>{product.name}</div>
                                </div>
                              </td>
                              <td style={{ padding: '1rem' }}><span className="status-badge status-Processing" style={{ fontSize: '0.7rem' }}>{product.category_name || product.category}</span></td>
                              <td style={{ padding: '1rem', fontWeight: '700' }}>${parseFloat(product.price).toFixed(2)}</td>
                              <td style={{ padding: '1rem' }}>
                                <div className="table-actions" style={{ display: 'flex', gap: '0.5rem' }}>
                                  <button className="icon-btn" onClick={() => handleEditClick(product)}>✏️</button>
                                  <button className="icon-btn text-danger" onClick={() => deleteProduct(pid)}>🗑️</button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
