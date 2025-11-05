import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import api from '../services/api';

export type TicketStatus = 'aberto' | 'em andamento' | 'concluído';
export type TicketPriority = 'baixa' | 'média' | 'alta';
export type TicketType = 'hardware' | 'software' | 'rede' | 'outros';

export interface Ticket {
  _id: string;
  ticketNumber?: number;
  title: string;
  description?: string;
  status: TicketStatus;
  userId: string;
  assignedTo?: { _id: string; name: string; email: string } | null;
  priority?: TicketPriority;
  type?: TicketType;
  createdAt: string;
  updatedAt: string;
}

export interface TicketsState {
  items: Ticket[];
  loading: boolean;
  error: string | null;
  selectedTicketId: string | null;
}

const initialState: TicketsState = {
  items: [],
  loading: false,
  error: null,
  selectedTicketId: null,
};

export const fetchTickets = createAsyncThunk<
  Ticket[],
  | {
      assignedTo?: string;
      userId?: string;
      status?: TicketStatus;
      priority?: TicketPriority;
      type?: TicketType;
      fromDate?: string;
      toDate?: string;
    }
  | undefined
>(
  'tickets/fetch',
  async (params) => {
    const { data } = await api.get<Ticket[]>('/api/tickets', { params });
    return data;
  }
);

export const createTicket = createAsyncThunk<Ticket, { title: string; description?: string; userId: string; priority?: TicketPriority }>(
  'tickets/create',
  async (payload) => {
    const { data } = await api.post<{ ticket: Ticket }>('/api/tickets', payload);
    return data.ticket;
  }
);

export const updateTicketStatus = createAsyncThunk<Ticket, { id: string; status: TicketStatus; resolution?: string }>(
  'tickets/updateStatus',
  async ({ id, status, resolution }) => {
    const { data } = await api.put<{ ticket: Ticket }>(`/api/tickets/${id}/status`, { status, resolution });
    return data.ticket;
  }
);

export const assignTicket = createAsyncThunk<Ticket, { id: string; assignedTo: string }>(
  'tickets/assign',
  async ({ id, assignedTo }) => {
    const { data } = await api.put<{ ticket: Ticket }>(`/api/tickets/${id}/assign`, { assignedTo });
    return data.ticket;
  }
);

const ticketsSlice = createSlice({
  name: 'tickets',
  initialState,
  reducers: {
    setSelectedTicketId: (state, action: PayloadAction<string | null>) => {
      state.selectedTicketId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTickets.pending, (state) => {
        state.loading = true; state.error = null;
      })
      .addCase(fetchTickets.fulfilled, (state, action) => {
        state.loading = false; state.items = action.payload;
      })
      .addCase(fetchTickets.rejected, (state, action) => {
        state.loading = false; state.error = action.error.message || 'Erro ao carregar tickets';
      })

      .addCase(createTicket.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })

      .addCase(updateTicketStatus.fulfilled, (state, action) => {
        const idx = state.items.findIndex(t => t._id === action.payload._id);
        if (idx >= 0) state.items[idx] = action.payload;
      })

      .addCase(assignTicket.fulfilled, (state, action) => {
        const idx = state.items.findIndex(t => t._id === action.payload._id);
        if (idx >= 0) state.items[idx] = action.payload;
      });
  }
});

export const { setSelectedTicketId } = ticketsSlice.actions;
export default ticketsSlice.reducer;
