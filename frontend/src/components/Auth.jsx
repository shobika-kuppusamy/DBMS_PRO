import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function Auth({ navigateTo, isAdminLogin }) {
  const { login, signup, logout, authError, setAuthError } = useContext(AuthContext);
  
  const [isLogin, setIsLogin] = useState(isAdminLogin || true);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: ''
  });


  const handleChange = (e) => {
    setAuthError(null); // clear error when typing
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (isLogin) {
        const user = await login(formData.email, formData.password);
        if (isAdminLogin) {
          if (user.role === 'admin') {
            navigateTo('admin');
          } else {
            // Not an admin, log them out and show error
            logout();
            setAuthError('Unauthorized: Access Restricted to Administrators.');
          }
        } else {
          navigateTo('shop');
        }
      } else {
        const user = await signup(formData.name, formData.email, formData.password, formData.phone, formData.address);
        navigateTo('shop');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setAuthError(null);
    setFormData({ name: '', email: '', password: '', phone: '', address: '' });
  };

  return (
    <div className="auth-container fade-in">
      <div className="auth-card" style={{ border: isAdminLogin ? '1px solid var(--accent-color)' : '', boxShadow: isAdminLogin ? '0 0 30px rgba(100, 108, 255, 0.2)' : '' }}>
        <div className="auth-header">
          <h2 className="auth-title">
            {isAdminLogin ? 'Admin Portal' : (isLogin ? 'Welcome Back' : 'Create an Account')}
          </h2>
          <p className="auth-subtitle">
            {isAdminLogin 
              ? 'Authorized personnel only. Please sign in to manage inventory.' 
              : (isLogin ? 'Enter your credentials to access your account.' : 'Sign up to start shopping premium gear.')}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">

          {authError && <div className="auth-error-banner" style={{ backgroundColor: 'rgba(255, 71, 87, 0.1)', color: '#ff4757', padding: '1rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.5rem', textAlign: 'center', fontSize: '0.9rem', border: '1px solid rgba(255, 71, 87, 0.2)' }}>{authError}</div>}
          
          {!isLogin && !isAdminLogin && (
            <>
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input 
                  type="text" 
                  id="name" 
                  name="name" 
                  className="form-control" 
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  required={!isLogin}
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input 
                  type="tel" 
                  id="phone" 
                  name="phone" 
                  className="form-control" 
                  placeholder="+1 (555) 000-0000"
                  value={formData.phone}
                  onChange={handleChange}
                  required={!isLogin}
                />
              </div>
            </>
          )}

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              className="form-control" 
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          {!isLogin && !isAdminLogin && (
            <div className="form-group">
              <label htmlFor="address">Delivery Address</label>
              <textarea 
                id="address" 
                name="address" 
                className="form-control" 
                placeholder="Street address, City, State, ZIP"
                value={formData.address}
                onChange={handleChange}
                required={!isLogin}
                style={{ resize: 'vertical', minHeight: '80px' }}
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input 
              type="password" 
              id="password" 
              name="password" 
              className="form-control" 
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary auth-submit" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
            {loading ? <span className="loader"></span> : (isAdminLogin ? 'Login to Dashboard' : (isLogin ? 'Sign In' : 'Sign Up'))}
          </button>
        </form>

        {!isAdminLogin && (
          <div className="auth-footer">
            <p>
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button type="button" className="auth-link-btn" onClick={toggleMode}>
                {isLogin ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </div>
        )}
        
        {isAdminLogin && (
          <div className="auth-footer">
            <button type="button" className="auth-link-btn" onClick={() => navigateTo('shop')}>
              &larr; Return to Storefront
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
