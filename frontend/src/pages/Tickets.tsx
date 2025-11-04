import React, { useEffect, useMemo } from 'react';
import { Plus, Ticket as TicketIcon, Clock, CheckCircle } from 'lucide-react';
import Button from '../components/ui/Button';
import StatsCard from '../components/ui/StatsCard';
import TicketTable from '../components/tickets/TicketTable';
import { useAppDispatch, useAppSelector } from '../hooks/useRedux';
import { createTicket, fetchTickets, setSelectedTicketId, type Ticket as DomainTicket } from '../store/ticketsSlice';
import { openModal } from '../store/statusSlice';

const Tickets: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items, loading } = useAppSelector(s => s.tickets);
  const user = useAppSelector(s => s.auth.user);

  useEffect(() => {
    dispatch(fetchTickets(undefined));
  }, [dispatch]);

  const stats = useMemo(() => {
    const total = items.length;
    const inProgress = items.filter(t => t.status === 'em andamento').length;
    const resolved = items.filter(t => t.status === 'concluído').length;
    return { total, inProgress, resolved };
  }, [items]);

  type TableTicket = {
    id: string;
    title: string;
    status: 'open' | 'in-progress' | 'completed' | 'pending';
    priority: 'low' | 'medium' | 'high';
    assignedTechnician?: string;
    dueDate?: string;
    requestingEmployee?: string;
  };

  const mapStatusToTable = (s: DomainTicket['status']): TableTicket['status'] => {
    switch (s) {
      case 'aberto':
        return 'open';
      case 'em andamento':
        return 'in-progress';
      case 'concluído':
        return 'completed';
      default:
        return 'pending';
    }
  };

  const mapPriorityToTable = (p: DomainTicket['priority']): TableTicket['priority'] => {
    switch (p) {
      case 'alta':
        return 'high';
      case 'média':
        return 'medium';
      case 'baixa':
        return 'low';
      default:
        return 'medium';
    }
  };

  const tableTickets: TableTicket[] = items.map((t) => ({
    id: t._id,
    title: t.title,
    status: mapStatusToTable(t.status),
    priority: mapPriorityToTable(t.priority),
    assignedTechnician: t.assignedTo?.name ?? undefined,
    dueDate: undefined,
    requestingEmployee: undefined,
  }));

  const handleTicketClick = (t: TableTicket) => {
    dispatch(setSelectedTicketId(t.id));
    dispatch(openModal());
  };

  const handleNewTicket = async () => {
    if (!user?.id) { alert('Faça login para criar tickets.'); return; }
    const title = window.prompt('Título do ticket:');
    if (!title) return;
    await dispatch(createTicket({ title, userId: user.id }));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--color-primary-white)', fontFamily: 'var(--font-family-primary)', margin: 0 }}>Tickets</h1>
        <Button variant="primary" icon={<Plus size={18} />} onClick={handleNewTicket}>
          Novo Ticket
        </Button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
        <StatsCard title="Total" value={stats.total} icon={<TicketIcon size={24} />} />
        <StatsCard title="Em andamento" value={stats.inProgress} icon={<Clock size={24} />} />
        <StatsCard title="Concluídos" value={stats.resolved} icon={<CheckCircle size={24} />} />
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {loading ? (
          <div>Carregando...</div>
        ) : (
          <TicketTable tickets={tableTickets} onTicketClick={handleTicketClick} />
        )}
      </div>
    </div>
  );
};

export default Tickets;
