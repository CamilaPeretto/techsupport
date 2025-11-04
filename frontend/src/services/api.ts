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

export default api;
