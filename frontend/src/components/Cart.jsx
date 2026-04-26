import { useContext, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import { AuthContext } from '../context/AuthContext';

export default function Cart({ navigateTo }) {
  const { cart, removeFromCart, updateQuantity, placeOrder } = useContext(ShopContext);
  const [checkoutStep, setCheckoutStep] = useState('cart'); // 'cart' or 'payment'
  const [paymentMethod, setPaymentMethod] = useState('online'); // 'online' or 'offline'
  const [onlineProvider, setOnlineProvider] = useState('GPay');

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const originalTotal = cart.reduce((sum, item) => sum + ((item.originalPrice || item.price) * item.quantity), 0);
  const totalSavings = originalTotal - total;

  if (cart.length === 0) {
    return (
      <div className="fade-in empty-state">
        <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Your Cart is Empty</h2>
        <p style={{ marginBottom: '2rem', color: 'var(--text-secondary)' }}>Looks like you haven't added anything to your cart yet.</p>
        <button className="btn btn-primary" onClick={() => navigateTo('shop')}>
          Start Shopping
        </button>
      </div>
    );
  }

  if (checkoutStep === 'payment') {
    return (
      <div className="fade-in">
        <button className="btn btn-secondary back-btn" onClick={() => setCheckoutStep('cart')}>
          &larr; Back to Cart
        </button>
        <div className="auth-container" style={{ minHeight: 'auto', margin: '2rem 0' }}>
          <div className="auth-card" style={{ maxWidth: '600px' }}>
            <h2 className="auth-title">Select Payment Method</h2>
            <p className="auth-subtitle" style={{ marginBottom: '2rem' }}>Choose how you want to pay for your order.</p>
            
            <div className="payment-options" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div 
                className={`payment-group ${paymentMethod === 'online' ? 'active' : ''}`}
                style={{ 
                  padding: '1.5rem', 
                  backgroundColor: 'rgba(255,255,255,0.05)', 
                  border: `2px solid ${paymentMethod === 'online' ? 'var(--accent-color)' : 'var(--border-color)'}`,
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer'
                }}
                onClick={() => setPaymentMethod('online')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: paymentMethod === 'online' ? '1.5rem' : '0' }}>
                  <input 
                    type="radio" 
                    readOnly 
                    checked={paymentMethod === 'online'} 
                    style={{ transform: 'scale(1.5)' }}
                  />
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-primary)' }}>Online Payment</h3>
                    <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Fast & Secure via UPI, Cards, or Netbanking.</p>
                  </div>
                </div>

                {paymentMethod === 'online' && (
                  <div className="online-providers" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', padding: '1rem', backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-sm)' }}>
                    {['GPay', 'PhonePe', 'Paytm', 'Cards'].map(provider => (
                      <button 
                        key={provider}
                        className={`btn ${onlineProvider === provider ? 'btn-primary' : 'btn-secondary'}`}
                        style={{ padding: '0.5rem', fontSize: '0.85rem' }}
                        onClick={(e) => { e.stopPropagation(); setOnlineProvider(provider); }}
                      >
                        {provider}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div 
                className={`payment-group ${paymentMethod === 'offline' ? 'active' : ''}`}
                style={{ 
                  padding: '1.5rem', 
                  backgroundColor: 'rgba(255,255,255,0.05)', 
                  border: `2px solid ${paymentMethod === 'offline' ? 'var(--accent-color)' : 'var(--border-color)'}`,
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer'
                }}
                onClick={() => setPaymentMethod('offline')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <input 
                    type="radio" 
                    readOnly 
                    checked={paymentMethod === 'offline'} 
                    style={{ transform: 'scale(1.5)' }}
                  />
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-primary)' }}>Cash on Delivery</h3>
                    <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Pay with cash at the time of delivery.</p>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ marginTop: '2.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '1.3rem', fontWeight: 'bold' }}>Total: ${total.toFixed(2)}</span>
              <button 
                className="btn btn-primary" 
                onClick={() => {
                  const method = paymentMethod === 'online' ? `Online (${onlineProvider})` : 'Cash on Delivery';
                  placeOrder(method);
                  navigateTo('orders');
                }}
              >
                Confirm Order
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <h1 className="page-title">Shopping Cart</h1>
      <div className="list-container">
        {cart.map(item => (
          <div key={item.id} className="list-item">
            <img src={item.image} alt={item.name} className="item-img" />
            <div className="item-details">
              <h3 className="item-title">{item.name}</h3>
              <p className="item-price">${item.price.toFixed(2)}</p>
            </div>
            <div className="quantity-controls">
              <button className="qty-btn" onClick={() => updateQuantity(item.id, -1)}>−</button>
              <span style={{ fontWeight: '600', minWidth: '20px', textAlign: 'center' }}>{item.quantity}</span>
              <button className="qty-btn" onClick={() => updateQuantity(item.id, 1)}>+</button>
            </div>
            <button 
              className="btn btn-danger" 
              style={{ marginLeft: '1rem' }}
              onClick={() => removeFromCart(item.id)}
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="summary-card">
        <div className="summary-row">
          <span>Total MRP</span>
          <span style={{ textDecoration: totalSavings > 0 ? 'line-through' : 'none', color: totalSavings > 0 ? 'var(--text-secondary)' : 'var(--text-primary)' }}>
            ${originalTotal.toFixed(2)}
          </span>
        </div>
        {totalSavings > 0 && (
          <div className="summary-row" style={{ color: 'var(--success-color)' }}>
            <span>Discount on MRP</span>
            <span>- ${totalSavings.toFixed(2)}</span>
          </div>
        )}
        <div className="summary-row">
          <span>Shipping Fee</span>
          <span style={{ color: 'var(--success-color)' }}>FREE</span>
        </div>
        <div className="summary-row summary-total">
          <span>Total Amount</span>
          <span>${total.toFixed(2)}</span>
        </div>
        
        {totalSavings > 0 && (
          <p style={{ color: 'var(--success-color)', fontWeight: '600', marginTop: '1rem', textAlign: 'center' }}>
            You will save ${totalSavings.toFixed(2)} on this order
          </p>
        )}
        <AuthContext.Consumer>
          {({ user }) => (
            <button 
              className="btn btn-primary" 
              style={{ width: '100%', marginTop: '1.5rem', padding: '1rem', fontSize: '1.1rem' }}
              onClick={() => {
                if (!user) {
                  navigateTo('auth');
                } else {
                  setCheckoutStep('payment');
                }
              }}
            >
              {user ? 'Checkout & Continue to Payment' : 'Sign in to Checkout'}
            </button>
          )}
        </AuthContext.Consumer>
      </div>
    </div>
  );
}
