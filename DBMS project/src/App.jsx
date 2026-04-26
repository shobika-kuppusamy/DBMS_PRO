import { useState, useContext, useRef, useEffect } from 'react';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { ShopProvider, ShopContext } from './context/ShopContext';
import Shop from './components/Shop';
import Cart from './components/Cart';
import Orders from './components/Orders';
import Auth from './components/Auth';
import ProductDetails from './components/ProductDetails';
import Footer from './components/Footer';
import Contact from './components/Contact';
import AdminDashboard from './components/AdminDashboard';

function UserMenu({ navigateTo }) {
  const { user, logout } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) {
    return (
      <button className="btn btn-primary" onClick={() => navigateTo('auth')}>
        Sign In
      </button>
    );
  }

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigateTo('shop');
  };

  return (
    <div className="profile-menu" ref={menuRef}>
      <button className="profile-avatar-btn" onClick={() => setIsOpen(!isOpen)}>
        <div className="avatar-circle">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <span className="profile-name" style={{ display: 'none' }}>{user.name}</span>
      </button>

      {isOpen && (
        <div className="dropdown-menu">
          <div style={{ padding: '0.75rem 1.25rem', borderBottom: '1px solid var(--border-color)', marginBottom: '0.5rem' }}>
            <div style={{ fontWeight: '600' }}>{user.name}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{user.email}</div>
          </div>
          <button className="dropdown-item" onClick={() => { setIsOpen(false); navigateTo('orders'); }}>
            My Orders
          </button>
          <button className="dropdown-item text-danger" onClick={handleLogout}>
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}

import RecommendationPopup from './components/RecommendationPopup';

function MainApp() {
  const [currentView, setCurrentView] = useState('shop');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { user } = useContext(AuthContext);
  const { searchQuery, setSearchQuery, products } = useContext(ShopContext);
  
  const suggestions = searchQuery.length > 1 
    ? products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 5)
    : [];

  return (
    <div className="app-container">
      <nav className="navbar">
        <h1 className="navbar-brand" onClick={() => setCurrentView('shop')}>
          AuraShop
        </h1>
        
        <div className="nav-search" style={{ position: 'relative' }}>
          <span className="nav-search-icon" style={{ cursor: 'pointer' }} onClick={() => {
            if (searchQuery.trim()) {
              setShowSuggestions(false);
              setCurrentView('shop');
            }
          }}>🔍</span>
          <input 
            type="text" 
            placeholder="Search for products, brands and more" 
            value={searchQuery}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                setShowSuggestions(false);
                setCurrentView('shop');
              }
            }}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (currentView !== 'shop' && currentView !== 'productDetails') {
                setCurrentView('shop');
              }
            }}
          />
          {searchQuery && (
            <button 
              className="search-clear-btn" 
              onClick={() => {
                setSearchQuery('');
                setShowSuggestions(false);
                setCurrentView('shop');
              }}
              style={{
                position: 'absolute',
                right: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                fontSize: '1.2rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0.2rem'
              }}
            >
              ×
            </button>
          )}

          {showSuggestions && suggestions.length > 0 && (
            <div className="search-suggestions fade-in">
              {suggestions.map(s => (
                <div 
                  key={s.id} 
                  className="suggestion-item"
                  onClick={() => {
                    setSelectedProduct(s);
                    setCurrentView('productDetails');
                    setSearchQuery('');
                    setShowSuggestions(false);
                  }}
                >
                  <img src={s.image} alt={s.name} className="suggestion-img" />
                  <div className="suggestion-info">
                    <h5>{s.name}</h5>
                    <p>{s.category} • ${s.price}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>



        <div className="nav-links">
          <button 
            className={`nav-btn ${currentView === 'shop' || currentView === 'productDetails' ? 'active' : ''}`}
            onClick={() => setCurrentView('shop')}
          >
            Shop
          </button>
          
          <ShopContext.Consumer>
            {({ cart }) => (
              <button 
                className={`nav-btn ${currentView === 'cart' ? 'active' : ''}`}
                style={{ position: 'relative' }}
                onClick={() => setCurrentView('cart')}
              >
                Cart
                {cart.length > 0 && <span className="badge">{cart.reduce((total, item) => total + item.quantity, 0)}</span>}
              </button>
            )}
          </ShopContext.Consumer>

          {user && (
            <button 
              className={`nav-btn ${currentView === 'orders' ? 'active' : ''}`}
              onClick={() => setCurrentView('orders')}
            >
              Orders
            </button>
          )}

          <button 
            className={`nav-btn ${currentView === 'contact' ? 'active' : ''}`}
            onClick={() => setCurrentView('contact')}
          >
            Contact
          </button>

          {/* Admin Link - Visible to non-admins as a way to login, visible to admins as a link to dashboard */}
          <button 
            className={`nav-btn admin-link ${currentView === 'admin' || currentView === 'admin-login' ? 'active' : ''}`}
            onClick={() => user?.role === 'admin' ? setCurrentView('admin') : setCurrentView('admin-login')}
            style={{ color: 'var(--accent-color)', fontWeight: '600' }}
          >
            Admin
          </button>
        </div>

        <div style={{ marginLeft: '1rem' }}>
          <UserMenu navigateTo={setCurrentView} />
        </div>
      </nav>

      <main className="main-content">
        {currentView === 'shop' && <Shop navigateTo={setCurrentView} setSelectedProduct={setSelectedProduct} />}
        {currentView === 'productDetails' && (
          <ProductDetails 
            product={selectedProduct} 
            navigateTo={setCurrentView} 
            setSelectedProduct={setSelectedProduct}
            onBack={() => setCurrentView('shop')} 
          />
        )}

        {currentView === 'auth' && <Auth navigateTo={setCurrentView} />}
        {currentView === 'admin-login' && <Auth navigateTo={setCurrentView} isAdminLogin={true} />}
        {currentView === 'cart' && <Cart navigateTo={setCurrentView} />}
        {currentView === 'orders' && <Orders navigateTo={setCurrentView} />}
        {currentView === 'contact' && <Contact />}
        {currentView === 'admin' && (
          user?.role === 'admin' ? <AdminDashboard /> : <Auth navigateTo={setCurrentView} isAdminLogin={true} />
        )}
      </main>



      <Footer />
      <RecommendationPopup navigateTo={setCurrentView} setSelectedProduct={setSelectedProduct} />
    </div>
  );
}



function App() {
  return (
    <AuthProvider>
      <ShopProvider>
        <MainApp />
      </ShopProvider>
    </AuthProvider>
  );
}

export default App;
