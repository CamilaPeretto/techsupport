// Configuração do Redux Store
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import statusReducer from './statusSlice';

// Cria e exporta o store do Redux
export const store = configureStore({
  reducer: {
    auth: authReducer,
    status: statusReducer,
  },
});

// Tipos do Redux
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
