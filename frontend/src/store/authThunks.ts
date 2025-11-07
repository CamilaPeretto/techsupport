// Thunks de autenticação: login, logout e inicialização (authInit)
import type { AppDispatch } from './store';
import api from '../services/api';
import { loginStart, loginSuccess, loginFailure, logout as logoutAction } from './authSlice';

// Tipo do payload de login
interface LoginPayload {
  email: string;
  password: string;
}

// Thunk para login: chama a API, salva token no localStorage e atualiza estado
export const login = ({ email, password }: LoginPayload) => {
  return async (dispatch: AppDispatch) => {
    try {
      // Indica início do processo de login (loading)
      dispatch(loginStart());

      // Chamada HTTP para /api/login
      const { data } = await api.post('/api/login', { email, password });
      const { token, user } = data;

      // Salva token local para futuros requests (interceptor usa localStorage)
      if (typeof window !== 'undefined' && token) {
        localStorage.setItem('token', token);
      }

      // Atualiza o slice com informações do usuário autenticado
      dispatch(loginSuccess(user));
      return user;
    } catch (err: unknown) {
      // Extrai mensagem de erro de forma defensiva
      let message = 'Erro ao fazer login';
      try {
        if (typeof err === 'object' && err !== null) {
          const e = err as { response?: { data?: { message?: string } }; message?: string };
          message = e.response?.data?.message || e.message || message;
        }
      } catch {
        // Mantém mensagem padrão
      }
      // Dispara ação de falha no slice
      dispatch(loginFailure(message));
      throw err;
    }
  };
};

// Thunk para logout: remove token do localStorage e limpa estado
export const logout = () => {
  return async (dispatch: AppDispatch) => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
      }
    } finally {
      // Garante que o estado seja atualizado mesmo se localStorage falhar
      dispatch(logoutAction());
    }
  };
};

// Thunk para inicializar autenticação quando a app carrega
export const authInit = () => {
  return async (dispatch: AppDispatch) => {
    if (typeof window === 'undefined') return; // SSR-safety
    const token = localStorage.getItem('token');
    if (!token) return; // sem token, nada a fazer

    try {
      // Pings /api/me para validar o token e obter dados do usuário
      const { data } = await api.get('/api/me');
      // Esperamos que `data` seja o objeto do usuário
      dispatch(loginSuccess(data));
    } catch (err) {
      // Token inválido/expirado -> limpa token e estado
      try {
        localStorage.removeItem('token');
      } catch (e) {
        console.debug('authInit: failed to remove token', e);
      }
      console.debug('authInit failed', err);
      dispatch(logoutAction());
    }
  };
};
