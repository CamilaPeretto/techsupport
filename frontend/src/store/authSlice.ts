// Slice do Redux para gerenciar autenticação (user, isAuthenticated, loading, error)
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Interface para o usuário armazenado no estado
export interface User {
  id?: string;
  email: string;
  name: string;
  role?: "user" | "tech" | "admin";
  department?: string;
  position?: string;
}

// Estrutura do estado de autenticação
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

// Estado inicial do slice
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

// Cria o slice com reducers sincronos usados pelos thunks
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Marca começo do fluxo de login (ex: mostra spinner)
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    // Atualiza estado quando login for bem-sucedido
    loginSuccess: (state, action: PayloadAction<User>) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload;
      state.error = null;
    },
    // Trata falha no login (mensagem de erro)
    loginFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    // Logout: limpa estado de autenticação
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    // Limpa mensagem de erro manualmente
    clearError: (state) => {
      state.error = null;
    },
  },
});

// Exporta as ações para uso em thunks/componentes
export const { loginStart, loginSuccess, loginFailure, logout, clearError } = authSlice.actions;

// Exporta o reducer para combinar no store
export default authSlice.reducer;
