/*
  Redux store configuration

  - This file creates the central Redux store using @reduxjs/toolkit's
    configureStore. It wires the app slices (auth, status, tickets) and
    exports typed helpers used across the app:
    - RootState: the complete state shape
    - AppDispatch: the dispatch type for thunks and components

  Keep this file small — add new slices here when the app grows.
*/
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import statusReducer from './statusSlice';
import ticketsReducer from './ticketsSlice';

// Create the Redux store and attach slice reducers.
export const store = configureStore({
  reducer: {
    auth: authReducer,
    status: statusReducer,
    tickets: ticketsReducer,
  },
});

// Utility types for use throughout the app (typed hooks, thunks, components)
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
