import axios from 'axios';

// Vite typings
declare const importMetaEnv: ImportMeta['env'];
const baseURL = importMetaEnv?.VITE_API_URL || 'http://localhost:3000';

export const api = axios.create({
  baseURL,
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Inject Authorization header from localStorage token
api.interceptors.request.use((config) => {
  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) {
      config.headers = config.headers || {};
      Reflect.set(config.headers as object, 'Authorization', `Bearer ${token}`);
    }
  } catch {
    // ignore
  }
  return config;
});

export default api;
