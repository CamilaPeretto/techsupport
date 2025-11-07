// Cliente HTTP centralizado usando Axios. Mantemos um único ponto para
// configurar baseURL, interceptors (autorização e tratamento de 401) e
// outras opções globais.
import axios from 'axios';
// Observação: atualmente importamos o store aqui apenas para disparar logout no
// interceptor de resposta. É funcional, mas cria dependência circular potencial
// se o store também importar este módulo — considerar expor um `setUnauthorizedHandler`
// em vez de importar o store diretamente.
import store from '../store/store';
import { logout as logoutAction } from '../store/authSlice';

// baseURL lido das variáveis de ambiente Vite (VITE_API_URL). Fallback para localhost.
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Cria instância Axios com configurações padrão
export const api = axios.create({
  baseURL,
  withCredentials: false, // usamos token em header, não cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor de request: injeta Authorization: Bearer <token> quando presente
api.interceptors.request.use((config) => {
  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) {
      config.headers = config.headers || {};
      // usa Reflect.set para compatibilidade com tipos genéricos de headers
      Reflect.set(config.headers as object, 'Authorization', `Bearer ${token}`);
    }
  } catch {
    // Ignore erros de leitura do localStorage
  }
  return config;
});

// Interceptor de response: se o servidor retornar 401, limpar estado de auth
// e remover token local. Isso centraliza o tratamento de tokens expirados.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    try {
      const status = error?.response?.status;
      if (status === 401) {
        try {
          // Remove token do localStorage (defensivo) e despacha ação de logout
          if (typeof window !== 'undefined') localStorage.removeItem('token');
          store.dispatch(logoutAction());
        } catch {
          // Se algo falhar aqui, não queremos mascarar o erro original
        }
      }
    } catch {
      // Ignore problemas ao inspecionar o erro
    }
    return Promise.reject(error);
  }
);

export default api;
