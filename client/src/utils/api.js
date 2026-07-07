import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.DEV ? '/api' : 'https://jmk-backend.onrender.com/api',
  timeout: 10000,
});

// Attach JWT token to all requests if available
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('jmk_admin_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('jmk_admin_token');
    }
    return Promise.reject(err);
  }
);

export default API;
