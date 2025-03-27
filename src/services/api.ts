import axios from 'axios';
import { getToken } from '../utils/localStorage';
import { clearStorage } from '../utils/localStorage';

// Create an environment variable for switching between dev and production
const isDev = import.meta.env.MODE === 'development';

// Base URL based on environment
const baseURL = isDev ? 'http://localhost:5000/api' : import.meta.env.VITE_API_BASE_URL;

console.log(import.meta.env.VITE_API_BASE_URL)

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add interceptor to add token to requests
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or unauthorized
      clearStorage();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;