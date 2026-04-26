import { useState } from 'react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState('idle'); // idle, loading, success

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('loading');
    
    // Simulate network request
    setTimeout(() => {
      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 1500);
  };

  return (
    <div className="fade-in">
      <div className="contact-banner">
        <h1 className="page-title" style={{ marginBottom: '1rem', color: 'white' }}>Contact Us</h1>
        <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.8)', maxWidth: '600px', margin: '0 auto' }}>
          We'd love to hear from you. Please fill out the feedback form or contact us using the details below.
        </p>
      </div>

      <div className="contact-container">
        
        {/* Left Column: Company Info */}
        <div className="contact-info">
          <h2>Company Details</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
            AuraShop is a premier global destination for electronics and modern tech.
          </p>

          <div className="info-block">
            <div className="info-icon">📍</div>
            <div>
              <span className="info-title">Headquarters Address</span>
              <span className="info-detail">404 Innovation Drive, Tech Park<br/>Silicon Valley, CA 94025</span>
            </div>
          </div>

          <div className="info-block">
            <div className="info-icon">📞</div>
            <div>
              <span className="info-title">Phone Number</span>
              <span className="info-detail">+1 (800) 123-4567<br/>Mon-Fri, 9am - 6pm EST</span>
            </div>
          </div>

          <div className="info-block">
            <div className="info-icon">✉️</div>
            <div>
              <span className="info-title">Email Address</span>
              <span className="info-detail">support@aurashop.com<br/>feedback@aurashop.com</span>
            </div>
          </div>
        </div>

        {/* Right Column: Feedback Form */}
        <div className="contact-form-wrapper">
          <h2>Send us a Message/Feedback</h2>
          
          {status === 'success' ? (
            <div className="success-message">
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
              <h3>Thank you for reaching out!</h3>
              <p>We've received your message and will process your feedback shortly.</p>
              <button 
                className="btn btn-secondary" 
                style={{ marginTop: '1.5rem' }}
                onClick={() => setStatus('idle')}
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Your Name</label>
                <input 
                  type="text" 
                  id="name" 
                  name="name" 
                  className="form-control" 
                  value={formData.name}
                  onChange={handleChange}
                  required 
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Your Email</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  className="form-control" 
                  value={formData.email}
                  onChange={handleChange}
                  required 
                />
              </div>

              <div className="form-group">
                <label htmlFor="subject">Subject</label>
                <input 
                  type="text" 
                  id="subject" 
                  name="subject" 
                  className="form-control" 
                  value={formData.subject}
                  onChange={handleChange}
                  required 
                />
              </div>

              <div className="form-group">
                <label htmlFor="message">Feedback / Message</label>
                <textarea 
                  id="message" 
                  name="message" 
                  className="form-control" 
                  rows="5"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  style={{ resize: 'vertical' }}
                />
              </div>

              <button 
                type="submit" 
                className="btn btn-primary" 
                disabled={status === 'loading'}
                style={{ width: '100%', padding: '1rem', marginTop: '0.5rem', fontSize: '1.1rem' }}
              >
                {status === 'loading' ? <span className="loader"></span> : 'Submit Feedback'}
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}
