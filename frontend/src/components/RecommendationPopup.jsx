import { useState, useEffect, useContext } from 'react';
import { ShopContext } from '../context/ShopContext';

export default function RecommendationPopup({ navigateTo, setSelectedProduct }) {
  const { products } = useContext(ShopContext);
  const [show, setShow] = useState(false);
  const [recProduct, setRecProduct] = useState(null);

  useEffect(() => {
    // Show after 5 seconds of browsing
    const initialTimer = setTimeout(() => {
      const randomProduct = products[Math.floor(Math.random() * products.length)];
      setRecProduct(randomProduct);
      setShow(true);
    }, 5000);

    return () => clearTimeout(initialTimer);
  }, [products]);

  // Periodically change/show another one every 30s
  useEffect(() => {
    if (!show) {
        const interval = setInterval(() => {
            const randomProduct = products[Math.floor(Math.random() * products.length)];
            setRecProduct(randomProduct);
            setShow(true);
        }, 30000);
        return () => clearInterval(interval);
    }
  }, [show, products]);

  const handleClose = (e) => {
    e.stopPropagation();
    setShow(false);
  };

  const handleClick = () => {
    setSelectedProduct(recProduct);
    navigateTo('productDetails');
    setShow(false);
  };

  if (!show || !recProduct) return null;

  return (
    <div className="rec-popup fade-in-down" onClick={handleClick}>
      <div className="rec-popup-content">
        <div className="rec-popup-badge">Recommendation For You</div>
        <img src={recProduct.image} alt={recProduct.name} className="rec-popup-img" />
        <div className="rec-popup-info">
          <h4>{recProduct.name}</h4>
          <p>${recProduct.price.toFixed(2)} - Only a few left!</p>
        </div>
        <button className="rec-popup-close" onClick={handleClose}>✕</button>
      </div>
    </div>
  );
}
