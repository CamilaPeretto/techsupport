// Hooks customizados do Redux com tipagem para evitar casts espalhados
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from '../store/store';

// useAppDispatch: wrapper tipado de useDispatch para usar AppDispatch
export const useAppDispatch = () => useDispatch<AppDispatch>();

// useAppSelector: wrapper tipado de useSelector para usar RootState
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
