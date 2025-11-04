// Hooks customizados do Redux com tipagem
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from '../store/store';

// Hook useDispatch tipado
export const useAppDispatch = () => useDispatch<AppDispatch>();

// Hook useSelector tipado
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
