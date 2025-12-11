// src/lib/axios.js
import axios from 'axios';
import { toast } from 'react-hot-toast';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach token from localStorage to every request (if present)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Global response handler: auto-logout on 401 (optional)
api.interceptors.response.use(
  (res) => res,
  (err) => {
    // If token expired or unauthorized, the backend usually returns 401
    if (err?.response?.status === 401) {
      // Optionally show a toast, clear token
      localStorage.removeItem('token');
      toast.error('Session expired. Please login again.');
      // Note: we don't call React navigation here (no access). ProtectedRoute/loadUser will handle redirect.
    }
    return Promise.reject(err);
  }
);

export default api;
