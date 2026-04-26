import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    // Ensure default admin user exists
    const users = JSON.parse(localStorage.getItem('registered_users') || '[]');
    const adminExists = users.some(u => u.email.toLowerCase() === 'admin@aura.com');
    
    if (!adminExists) {
      const defaultAdmin = { name: 'Super Admin', email: 'admin@aura.com', password: 'admin123' };
      localStorage.setItem('registered_users', JSON.stringify([defaultAdmin, ...users]));
    }
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const login = async (email, password) => {
    setAuthError(null);
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Store token for future requests
      localStorage.setItem('token', data.token);
      setUser(data.user);
      return data.user;
    } catch (err) {
      setAuthError(err.message);
      throw err;
    }
  };

  const signup = async (name, email, password, phone, address) => {
    setAuthError(null);
    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, phone, address })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      // Automatically login after signup
      return login(email, password);
    } catch (err) {
      setAuthError(err.message);
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, authError, setAuthError }}>
      {children}
    </AuthContext.Provider>
  );
};
