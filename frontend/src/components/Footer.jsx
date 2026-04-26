export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div className="footer-col">
          <h3>About Us</h3>
          <ul>
            <li><a href="#">Contact Us</a></li>
            <li><a href="#">About AuraShop</a></li>
            <li><a href="#">Careers</a></li>
            <li><a href="#">Press</a></li>
          </ul>
        </div>
        <div className="footer-col">
          <h3>Help</h3>
          <ul>
            <li><a href="#">Payments</a></li>
            <li><a href="#">Shipping</a></li>
            <li><a href="#">Cancellation & Returns</a></li>
            <li><a href="#">FAQ</a></li>
          </ul>
        </div>
        <div className="footer-col">
          <h3>Policy</h3>
          <ul>
            <li><a href="#">Return Policy</a></li>
            <li><a href="#">Terms of Use</a></li>
            <li><a href="#">Security</a></li>
            <li><a href="#">Privacy</a></li>
          </ul>
        </div>
        <div className="footer-col">
          <h3>Social</h3>
          <ul>
            <li><a href="#">Facebook</a></li>
            <li><a href="#">Twitter</a></li>
            <li><a href="#">YouTube</a></li>
            <li><a href="#">Instagram</a></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} AuraShop. All rights reserved.</p>
        <div className="payment-icons">
          <span>💳</span> <span>🏦</span> <span>📲</span>
        </div>
      </div>
    </footer>
  );
}
