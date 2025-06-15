import axios from 'axios';

// Get the current environment
const isDevelopment = import.meta.env.MODE === 'development';

// Set the API URL based on environment
const API_BASE_URL = isDevelopment 
  ? 'http://localhost:3000'
  : 'https://mcv-7x6t.onrender.com';

console.log('API Base URL:', API_BASE_URL); // For debugging

// Helper function to get the correct image URL
export const getImageUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;
};

export const API_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/login`,
  REGISTER: `${API_BASE_URL}/register`,
  PROFILE: `${API_BASE_URL}/profile`,
  NEWS: `${API_BASE_URL}/api/news`,
  LEAGUE: `${API_BASE_URL}/api/league`,
  ADMIN: {
    STATS: `${API_BASE_URL}/api/admin/stats`,
    PLAYERS: `${API_BASE_URL}/api/admin/players`,
    FIXTURES: `${API_BASE_URL}/api/admin/fixtures`,
    NEWS: `${API_BASE_URL}/api/admin/news`,
    LEAGUE: `${API_BASE_URL}/api/admin/league`,
    STORE: `${API_BASE_URL}/api/admin/store`
  }
};

// Create axios instance with default config
export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
});

// Add request interceptor to add auth token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.log('Request interceptor - No token available for request:', config.url);
    }
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for better error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Error response:', error.response.data);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error setting up request:', error.message);
    }
    return Promise.reject(error);
  }
);

export const fetchWithAuth = async (url, options = {}) => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Something went wrong');
    }

    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}; 