// Configuração do Redux Store
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';

// Cria e exporta o store do Redux
export const store = configureStore({
  reducer: {
    auth: authReducer, // Gerencia autenticação
  },
});
export default store;