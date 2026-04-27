import { createContext, useState, useEffect, useContext } from 'react';
import { products as initialProducts, categories as initialCategories } from '../data';
import { AuthContext } from './AuthContext';

export const ShopContext = createContext();

export const ShopProvider = ({ children }) => {
  const { user } = useContext(AuthContext);

  const [products, setProducts] = useState(initialProducts);
  const [categories, setCategories] = useState(initialCategories);

  const [cart, setCart] = useState([]);
  
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('orders');
    return saved ? JSON.parse(saved) : [];
  });

  const [searchQuery, setSearchQuery] = useState('');

  const fetchCart = async () => {
    if (!user) return;
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch(`${API_URL}/api/cart`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        const mappedCart = data.map(item => ({
          id: item.product_id,
          name: item.name,
          price: parseFloat(item.price),
          image: item.image_url,
          quantity: item.quantity,
          cart_item_id: item.cart_item_id
        }));
        setCart(mappedCart);
      }
    } catch (err) {
      console.error('Error fetching cart:', err);
    }
  };

  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setCart([]);
    }
  }, [user]);

  useEffect(() => {

    localStorage.setItem('products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('orders', JSON.stringify(orders));
  }, [orders]);

  const API_URL = import.meta.env.VITE_API_URL || 
                  (window.location.hostname === 'localhost' ? 'http://localhost:5000' : '');

  // Fetch products from backend
  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_URL}/api/products`);
      if (response.ok) {
        const data = await response.json();
        // Map backend fields to frontend expected fields
        const mappedData = data.map(p => ({
          ...p,
          id: p.product_id,
          category: p.category_name,
          image: p.image_url,
          price: parseFloat(p.price),
          rating: p.rating || 4.5, // Default rating if missing
          reviews: p.reviews || 0,
          specs: Array.isArray(p.specs) ? p.specs : []
        }));
        setProducts(mappedData);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
    }
  };

  // Fetch categories from backend
  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_URL}/api/products/categories`);
      if (response.ok) {
        const data = await response.json();
        const mappedCats = data.map(c => ({
          id: c.category_id,
          name: c.category_name,
          icon: c.category_name === 'Electronics' ? '💻' : 
                c.category_name === 'Apparel' ? '🧥' : 
                c.category_name === 'Home & Living' ? '🏠' : '📦'
        }));
        setCategories(mappedCats);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const addProduct = (product) => {
    setProducts(prev => [...prev, { ...product, id: Date.now() }]);
  };

  const updateProduct = (updatedProduct) => {
    setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
  };

  const deleteProduct = async (productId) => {
    const token = localStorage.getItem('token');
    if (!token) return alert('Unauthorized: No token found');

    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      const response = await fetch(`${API_URL}/api/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setProducts(prev => prev.filter(p => (p.product_id || p.id) !== productId));
        alert('Product deleted successfully');
      } else {
        const data = await response.json();
        alert(`Error: ${data.message || 'Failed to delete product'}`);
      }
    } catch (err) {
      console.error('Delete error:', err);
      alert('Error connecting to server');
    }
  };

  const addToCart = async (product) => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        await fetch(`${API_URL}/api/cart/add`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ product_id: product.id, quantity: 1 })
        });
        fetchCart(); // Refresh from backend to get cart_item_id
      } catch (err) {
        console.error('Error adding to backend cart:', err);
      }
    } else {
      setCart(prev => {
        const existing = prev.find(item => item.id === product.id);
        if (existing) {
          return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
        }
        return [...prev, { ...product, quantity: 1 }];
      });
    }
  };

  const removeFromCart = async (productId) => {
    const itemToRemove = cart.find(item => item.id === productId);
    if (!itemToRemove) return;

    const token = localStorage.getItem('token');
    if (token && itemToRemove.cart_item_id) {
      try {
        await fetch(`${API_URL}/api/cart/${itemToRemove.cart_item_id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        fetchCart(); // Refresh from backend
      } catch (err) {
        console.error('Error removing from backend cart:', err);
      }
    } else {
      setCart(prev => prev.filter(item => item.id !== productId));
    }
  };

  const updateQuantity = async (productId, amount) => {
    // Only allow update if quantity will be >= 1
    const item = cart.find(i => i.id === productId);
    if (item && item.quantity + amount < 1) return;

    const token = localStorage.getItem('token');
    if (token) {
      try {
        await fetch(`${API_URL}/api/cart/add`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ product_id: productId, quantity: amount })
        });
        fetchCart(); // Refresh from backend
      } catch (err) {
        console.error('Error updating backend cart:', err);
      }
    } else {
      setCart(prev => prev.map(item => {
        if (item.id === productId) {
          const newQuantity = Math.max(1, item.quantity + amount);
          return { ...item, quantity: newQuantity };
        }
        return item;
      }));
    }
  };

  const placeOrder = (paymentMethod = 'Online') => {
    if (cart.length === 0) return;
    
    const newOrder = {
      id: `ORD-${Math.floor(Math.random() * 100000)}`,
      date: new Date().toISOString(),
      items: [...cart],
      total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
      status: 'Processing',
      paymentMethod: paymentMethod
    };
    
    setOrders(prev => [newOrder, ...prev]);
    setCart([]);
  };


  const cancelOrder = (orderId) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status: 'Cancelled' } : order
    ));
  };

  return (
    <ShopContext.Provider value={{ 
      products, categories, cart, orders, searchQuery, setSearchQuery,
      addProduct, updateProduct, deleteProduct,
      addToCart, removeFromCart, updateQuantity, placeOrder, cancelOrder 
    }}>
      {children}
    </ShopContext.Provider>
  );

};

