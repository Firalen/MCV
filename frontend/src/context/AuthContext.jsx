import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Set up axios interceptor for token
  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log('Initial token check:', token ? 'Present' : 'Missing');
    
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      console.log('Set initial axios default headers with token');
    }

    // Add request interceptor to ensure token is set for each request
    const requestInterceptor = axios.interceptors.request.use(
      config => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
          console.log('Request interceptor - Added token to request:', config.url);
        } else {
          console.log('Request interceptor - No token available for request:', config.url);
        }
        return config;
      },
      error => {
        console.error('Request interceptor error:', error);
        return Promise.reject(error);
      }
    );

    // Add response interceptor to handle 401 errors
    const responseInterceptor = axios.interceptors.response.use(
      response => response,
      error => {
        if (error.response?.status === 401) {
          console.log('Received 401 response, clearing auth data');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          delete axios.defaults.headers.common['Authorization'];
          setUser(null);
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  useEffect(() => {
    // Check if user is logged in on mount
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      
      console.log('Checking auth on mount:', { token: !!token, storedUser: !!storedUser });
      
      if (token && storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          console.log('Found stored user:', userData);
          setUser(userData);
          
          // Set axios default headers
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          console.log('Set axios default headers with token');
        } catch (error) {
          console.error('Error parsing stored user data:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      console.log('Attempting login for:', email);
      const response = await axios.post('http://localhost:3000/login', {
        email,
        password
      });

      const { token, user: userData } = response.data;
      console.log('Login response received:', { hasToken: !!token, userData });
      
      if (!token || !userData || !userData.role) {
        throw new Error('Invalid response from server');
      }
      
      // Set axios default headers for all future requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      console.log('Set axios default headers with token');
      
      // Store in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      console.log('Stored token and user data in localStorage');
      
      // Update state
      setUser(userData);
      console.log('Updated user state:', userData);
      
      return userData;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = () => {
    console.log('Logging out user');
    
    // Remove token from axios headers
    delete axios.defaults.headers.common['Authorization'];
    console.log('Removed token from axios headers');
    
    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    console.log('Cleared localStorage');
    
    // Update state
    setUser(null);
    console.log('Reset user state');
  };

  const value = {
    user,
    loading,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 