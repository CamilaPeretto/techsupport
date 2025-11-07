/*
  statusSlice

  Small slice used by UI components to keep track of the currently selected
  ticket status in modal workflows and whether a status modal is open.

  This is intentionally simple and stores only UI-level state. Server-side
  ticket status changes should still be performed via the tickets thunks.
*/
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
    // Set the status selected in the UI (does not perform server update)
    setStatus: (state, action: PayloadAction<StatusType>) => {
      state.currentStatus = action.payload;
    },
    // UI helpers to show/hide modals
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
