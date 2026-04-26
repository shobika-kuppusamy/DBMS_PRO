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

  // Load user-specific cart when user changes
  useEffect(() => {
    if (user) {
      const userCartKey = `aura_cart_${user.email}`;
      const saved = localStorage.getItem(userCartKey);
      setCart(saved ? JSON.parse(saved) : []);
    } else {
      setCart([]); // Clear cart on logout
    }
  }, [user]);

  // Save user-specific cart whenever it changes
  useEffect(() => {
    if (user) {
      const userCartKey = `aura_cart_${user.email}`;
      localStorage.setItem(userCartKey, JSON.stringify(cart));
    }
  }, [cart, user]);

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

  // Fetch products from backend
  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/products');
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
      const response = await fetch('http://localhost:5000/api/products/categories');
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
      const response = await fetch(`http://localhost:5000/api/products/${productId}`, {
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

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, amount) => {
    setCart(prev => prev.map(item => {
      if (item.id === productId) {
        const newQuantity = Math.max(1, item.quantity + amount);
        return { ...item, quantity: newQuantity };
      }
      return item;
    }));
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

