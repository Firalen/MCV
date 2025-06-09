import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import mug2Logo from '../assets/mug2.webp';
import axios from 'axios';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('Attempting admin login...');
      const response = await axios.post('http://localhost:3000/admin/login', {
        email,
        password
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('Admin login response:', response.data);

      // Store token in localStorage
      localStorage.setItem('token', response.data.token);
      
      // Store user info including role
      const userData = response.data.user;
      console.log('Admin user data:', userData);
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Call the login function from AuthContext
      await login(email, password);
      
      // Redirect to admin dashboard
      console.log('Admin login successful, redirecting to admin dashboard...');
      navigate('/admin', { replace: true });
    } catch (err) {
      console.error('Admin login error:', err);
      
      // Handle different types of errors
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        const errorMessage = err.response.data.message || 'Failed to login. Please try again.';
        const errorDetails = err.response.data.details;
        
        if (typeof errorDetails === 'object') {
          // Handle validation errors
          const validationErrors = Object.entries(errorDetails)
            .filter(([_, value]) => value !== null)
            .map(([field, message]) => `${field}: ${message}`)
            .join('\n');
          setError(validationErrors || errorMessage);
        } else {
          setError(errorDetails || errorMessage);
        }
      } else if (err.request) {
        // The request was made but no response was received
        console.error('No response received:', err.request);
        setError('No response from server. Please check if the server is running.');
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Request setup error:', err.message);
        setError(`Error setting up the request: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 pt-20">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-2xl overflow-hidden">
        <div className="bg-blue-600 px-6 py-8 text-center">
          <img 
            src={mug2Logo} 
            alt="Mugher Logo" 
            className="h-20 w-auto mx-auto mb-4"
          />
          <h2 className="text-3xl font-bold text-white">Admin Login</h2>
          <p className="text-blue-100 mt-2">Sign in to admin dashboard</p>
        </div>
        
        <div className="p-8">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
              <p className="font-medium">Error</p>
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                placeholder="Enter your admin email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </span>
              ) : (
                'Sign in as Admin'
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Not an admin?{' '}
              <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200">
                Go to user login
              </Link>
            </p>
            <p className="text-sm text-gray-600 mt-2">
              Need admin access?{' '}
              <Link to="/register-admin" className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200">
                Register as Admin
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin; 