import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      
      if (storedToken && storedUser) {
        try {
          // Verify token is still valid by making a test request
          axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        } catch (error) {
          // Token is invalid, clear storage
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (username, password) => {
    try {
      setLoading(true);
      const response = await axios.post('http://localhost:8080/api/auth/login', {
        username,
        password
      });

      if (response.data.success) {
        const { token: newToken, role, username: userUsername } = response.data;
        
        // Store token and user info
        localStorage.setItem('token', newToken);
        localStorage.setItem('user', JSON.stringify({ username: userUsername, role }));
        
        // Set axios default header
        axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
        
        setToken(newToken);
        setUser({ username: userUsername, role });
        
        // Ensure loading is set to false after successful login
        setLoading(false);
        
        return { success: true, role };
      } else {
        setLoading(false);
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      setLoading(false);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  const register = async (username, password, role) => {
    try {
      const response = await axios.post('http://localhost:8080/api/auth/register', {
        username,
        password,
        role
      });

      if (response.data.success) {
        return { success: true, message: response.data.message };
      } else {
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Registration failed' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
    setToken(null);
    setUser(null);
  };

  const isAdmin = () => {
    return user?.role === 'ROLE_ADMIN';
  };

  const isSales = () => {
    return user?.role === 'ROLE_SALES';
  };

  const isAuthenticated = () => {
    return !!token && !!user;
  };

  const value = {
    user,
    token,
    login,
    register,
    logout,
    isAdmin,
    isSales,
    isAuthenticated,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
