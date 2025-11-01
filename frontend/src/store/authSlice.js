// Slice do Redux para gerenciar autenticação
import { createSlice } from '@reduxjs/toolkit';

// Estado inicial da autenticação
const initialState = {
  user: null, // Dados do usuário logado
  isAuthenticated: false, // Se o usuário está logado
  loading: false, // Status de carregamento
  error: null, // Mensagem de erro
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
    loginSuccess: (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload;
      state.error = null;
    },
    // Falha no login
    loginFailure: (state, action) => {
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
