import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type StatusType = 'Pendente' | 'Em andamento' | 'Concluído';

interface StatusState {
  currentStatus: StatusType;
  isModalOpen: boolean;
}

const initialState: StatusState = {
  currentStatus: 'Pendente',
  isModalOpen: false,
};

const statusSlice = createSlice({
  name: 'status',
  initialState,
  reducers: {
    setStatus: (state, action: PayloadAction<StatusType>) => {
      state.currentStatus = action.payload;
    },
    openModal: (state) => {
      state.isModalOpen = true;
    },
    closeModal: (state) => {
      state.isModalOpen = false;
    },
  },
});

export const { setStatus, openModal, closeModal } = statusSlice.actions;
export default statusSlice.reducer;
