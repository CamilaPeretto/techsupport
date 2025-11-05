// Slice do Redux para gerenciar autenticação
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Interface para o usuário
export interface User {
  id?: string;
  email: string;
  name: string;
  role?: "user" | "tech" | "admin";
  department?: string;
  position?: string;
}

// Interface para o estado de autenticação
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

// Estado inicial da autenticação
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

// Cria o slice de autenticação
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Inicia o processo de login
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    // Login bem-sucedido
    loginSuccess: (state, action: PayloadAction<User>) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload;
      state.error = null;
    },
    // Falha no login
    loginFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    // Logout
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    // Limpa erros
    clearError: (state) => {
      state.error = null;
    },
  },
});

// Exporta as ações
export const { loginStart, loginSuccess, loginFailure, logout, clearError } = authSlice.actions;

// Exporta o reducer
export default authSlice.reducer;
