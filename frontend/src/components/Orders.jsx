import { useContext, useState } from 'react';
import { ShopContext } from '../context/ShopContext';

export default function Orders({ navigateTo }) {
  const { orders, cancelOrder } = useContext(ShopContext);
  const [trackingOrder, setTrackingOrder] = useState(null);

  if (orders.length === 0) {
    return (
      <div className="fade-in empty-state">
        <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>No Orders Yet</h2>
        <p style={{ marginBottom: '2rem', color: 'var(--text-secondary)' }}>You haven't placed any orders. Start exploring our products!</p>
        <button className="btn btn-primary" onClick={() => navigateTo('shop')}>
          Browse Products
        </button>
      </div>
    );
  }

  const getTrackingSteps = (status) => {
    // Mock simple logic based on status
    const steps = ['Confirmed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered'];
    let currentStepIdx = 0;
    if (status === 'Cancelled') return { steps: ['Confirmed', 'Cancelled'], current: 1 };
    
    if (status === 'Delivered') currentStepIdx = 4;
    else if (status === 'Shipped') currentStepIdx = 2;
    // Default our new orders to Processing
    else currentStepIdx = 1; 

    return { steps, current: currentStepIdx };
  };

  return (
    <div className="fade-in">
      <h1 className="page-title">Order History</h1>
      <div className="list-container">
        {orders.map(order => (
          <div key={order.id} className="summary-card" style={{ marginTop: 0 }}>
            <div className="order-header">
              <div>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.25rem' }}>Order #{order.id}</h3>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    {new Date(order.date).toLocaleDateString()} at {new Date(order.date).toLocaleTimeString()}
                  </p>
                  <span style={{ fontSize: '0.8rem', padding: '0.1rem 0.6rem', borderRadius: '4px', backgroundColor: 'rgba(59, 130, 246, 0.1)', color: 'var(--accent-color)' }}>
                    {order.paymentMethod || 'Online'}
                  </span>
                </div>

              </div>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <span className={`status-badge status-${order.status}`}>{order.status}</span>
                <button 
                  className="btn btn-secondary" 
                  style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
                  onClick={() => setTrackingOrder(trackingOrder === order.id ? null : order.id)}
                >
                  {trackingOrder === order.id ? 'Hide Tracking' : 'Track Order'}
                </button>
              </div>
            </div>
            
            {trackingOrder === order.id && (
              <div className="tracking-timeline fade-in" style={{ padding: '2rem 1rem', marginBottom: '1.5rem', backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-sm)' }}>
                <h4 style={{ marginBottom: '1.5rem' }}>Tracking Status</h4>
                <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
                  {/* CSS Line in background */}
                  <div style={{ position: 'absolute', top: '15px', left: '0', width: '100%', height: '4px', backgroundColor: 'var(--border-color)', zIndex: 1 }}></div>
                  
                  {(() => {
                    const trackingInfo = getTrackingSteps(order.status);
                    const steps = trackingInfo.steps;
                    const fillWidth = (trackingInfo.current / (steps.length - 1)) * 100;

                    return (
                      <>
                        <div style={{ position: 'absolute', top: '15px', left: '0', height: '4px', backgroundColor: order.status === 'Cancelled' ? 'var(--danger-color)' : 'var(--success-color)', width: `${fillWidth}%`, zIndex: 1, transition: 'width 0.5s ease' }}></div>
                        {steps.map((step, idx) => {
                          const isCompleted = idx <= trackingInfo.current;
                          const isCancelled = order.status === 'Cancelled' && idx === 1;
                          
                          return (
                            <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 2, width: '80px' }}>
                              <div style={{ 
                                width: '34px', height: '34px', borderRadius: '50%', 
                                backgroundColor: isCancelled ? 'var(--danger-color)' : (isCompleted ? 'var(--success-color)' : 'var(--surface-color)'), 
                                border: `3px solid ${isCompleted ? 'transparent' : 'var(--border-color)'}`,
                                display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white',
                                marginBottom: '0.5rem', boxShadow: '0 0 10px rgba(0,0,0,0.5)'
                              }}>
                                {isCancelled ? '✕' : (isCompleted ? '✓' : idx + 1)}
                              </div>
                              <span style={{ fontSize: '0.8rem', textAlign: 'center', color: isCompleted ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                                {step}
                              </span>
                            </div>
                          );
                        })}
                      </>
                    );
                  })()}
                </div>
              </div>
            )}
            
            <div className="list-container" style={{ gap: '0.5rem', marginBottom: '1.5rem' }}>
              {order.items.map(item => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.02)', padding: '0.75rem', borderRadius: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <img src={item.image} alt={item.name} style={{ width: '40px', height: '40px', borderRadius: '4px', objectFit: 'cover' }} />
                    <span style={{ fontWeight: '500' }}>{item.name} <span style={{ color: 'var(--text-secondary)' }}>x{item.quantity}</span></span>
                  </div>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
              <span style={{ fontSize: '1.2rem', fontWeight: '700' }}>Total: ${order.total.toFixed(2)}</span>
              {order.status === 'Processing' && (
                <button className="btn btn-danger" onClick={() => cancelOrder(order.id)}>
                  Cancel Order
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
