import axios from 'axios';

// Get API base URL from environment variable, fallback to localhost for development
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

// Check if API URL has changed (user switched environments)
const STORED_API_URL_KEY = 'api_base_url';
const storedApiUrl = localStorage.getItem(STORED_API_URL_KEY);
if (storedApiUrl && storedApiUrl !== API_BASE_URL) {
  // API URL changed - clear tokens from previous environment
  console.log('API URL changed, clearing tokens from previous environment');
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}
// Store current API URL
localStorage.setItem(STORED_API_URL_KEY, API_BASE_URL);

// Point directly to backend API
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: false
});

// Request interceptor to add JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiration and signature mismatches
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle authentication errors (401) and signature mismatch (403 from JWT validation)
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Check if it's a JWT-related error
      const errorMessage = error.response?.data?.message || error.message || '';
      const isJwtError = errorMessage.includes('JWT') || 
                        errorMessage.includes('token') || 
                        errorMessage.includes('signature') ||
                        error.response?.status === 401;
      
      if (isJwtError) {
        // Token expired, invalid, or signature mismatch - clear storage and redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Only redirect if not already on login page
        if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;


