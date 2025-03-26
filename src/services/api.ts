import axios from 'axios';
import { getToken } from '../utils/localStorage';

// Create an environment variable for switching between dev and production
const isDev = import.meta.env.MODE === 'development';

// Base URL based on environment
const baseURL = isDev 
  ? 'http://localhost:5000/api' 
  : 'https://production-api.example.com/api';

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

export default api;