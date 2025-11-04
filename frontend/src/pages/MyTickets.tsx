import React, { useEffect, useMemo, useState } from 'react';
import { Plus, Ticket as TicketIcon, Clock, CheckCircle } from 'lucide-react';
import Button from '../components/ui/Button';
import StatsCard from '../components/ui/StatsCard';
import TicketTable from '../components/tickets/TicketTable';
import { Form } from 'react-bootstrap';
import { useAppDispatch, useAppSelector } from '../hooks/useRedux';
import { createTicket, fetchTickets, setSelectedTicketId, type Ticket as DomainTicket } from '../store/ticketsSlice';
import { openModal } from '../store/statusSlice';

const MyTickets: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items, loading } = useAppSelector(s => s.tickets);
  const user = useAppSelector(s => s.auth.user);
  const [filters, setFilters] = useState<{ status?: DomainTicket['status']; priority?: DomainTicket['priority']; type?: DomainTicket['type']; fromDate?: string; toDate?: string }>({});

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchTickets({ userId: user.id, status: filters.status, priority: filters.priority, type: filters.type, fromDate: filters.fromDate, toDate: filters.toDate }));
    }
  }, [dispatch, user?.id, filters.status, filters.priority, filters.type, filters.fromDate, filters.toDate]);

  type TableTicket = {
    id: string;
    title: string;
    status: 'open' | 'pending' | 'in-progress' | 'completed';
    priority: 'low' | 'medium' | 'high';
    dueDate?: string;
    requestingEmployee?: string;
    assignedTechnician?: string;
  };

  const tableTickets: TableTicket[] = useMemo(() => {
    const mapStatus = (s: DomainTicket['status']): TableTicket['status'] => {
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
    const mapPriority = (p: DomainTicket['priority']): TableTicket['priority'] => {
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
    return items.map((t) => ({
      id: t._id,
      title: t.title,
      status: mapStatus(t.status),
      priority: mapPriority(t.priority),
      dueDate: undefined,
      requestingEmployee: undefined,
      assignedTechnician: t.assignedTo?.name ?? undefined,
    }));
  }, [items]);

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

  const stats = useMemo(() => {
    const mine = items.filter(t => t.userId === user?.id);
    const active = mine.filter(t => t.status !== 'concluído').length;
    const completed = mine.filter(t => t.status === 'concluído').length;
    return { active, completed };
  }, [items, user?.id]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--color-primary-white)', fontFamily: 'var(--font-family-primary)', margin: 0 }}>Meus Tickets</h1>
        <Button variant="primary" icon={<Plus size={18} />} onClick={handleNewTicket}>
          Novo Ticket
        </Button>
      </div>

      {/* Filtros */}
      <div className="card p-3" style={{ background: '#1e1e24', borderColor: '#2a2a30' }}>
        <Form className="row g-3" aria-label="Filtros dos meus tickets">
          <div className="col-md-3">
            <Form.Label className="text-white">Status</Form.Label>
            <Form.Select value={filters.status || ''} onChange={(e) => { const v = e.target.value as '' | 'aberto' | 'em andamento' | 'concluído'; setFilters(f => ({ ...f, status: v || undefined })); }} aria-label="Filtro de status">
              <option value="">Todos</option>
              <option value="aberto">Aberto</option>
              <option value="em andamento">Em andamento</option>
              <option value="concluído">Concluído</option>
            </Form.Select>
          </div>
          <div className="col-md-3">
            <Form.Label className="text-white">Prioridade</Form.Label>
            <Form.Select value={filters.priority || ''} onChange={(e) => { const v = e.target.value as '' | 'baixa' | 'média' | 'alta'; setFilters(f => ({ ...f, priority: v || undefined })); }} aria-label="Filtro de prioridade">
              <option value="">Todas</option>
              <option value="baixa">Baixa</option>
              <option value="média">Média</option>
              <option value="alta">Alta</option>
            </Form.Select>
          </div>
          <div className="col-md-3">
            <Form.Label className="text-white">Tipo</Form.Label>
            <Form.Select value={filters.type || ''} onChange={(e) => setFilters(f => ({ ...f, type: (e.target.value || undefined) as DomainTicket['type'] }))} aria-label="Filtro de tipo">
              <option value="">Todos</option>
              <option value="hardware">Hardware</option>
              <option value="software">Software</option>
              <option value="rede">Rede</option>
              <option value="outros">Outros</option>
            </Form.Select>
          </div>
          <div className="col-md-3">
            <Form.Label className="text-white">De</Form.Label>
            <Form.Control type="date" value={filters.fromDate || ''} onChange={(e) => setFilters(f => ({ ...f, fromDate: e.target.value || undefined }))} aria-label="Data inicial" />
          </div>
          <div className="col-md-3">
            <Form.Label className="text-white">Até</Form.Label>
            <Form.Control type="date" value={filters.toDate || ''} onChange={(e) => setFilters(f => ({ ...f, toDate: e.target.value || undefined }))} aria-label="Data final" />
          </div>
        </Form>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {loading ? (
          <div>Carregando...</div>
        ) : (
          <TicketTable tickets={tableTickets} onTicketClick={handleTicketClick} />
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
        <StatsCard title="Ativos" value={stats.active} icon={<TicketIcon size={24} />} />
        <StatsCard title="Concluídos" value={stats.completed} icon={<CheckCircle size={24} />} />
        <StatsCard title="Tempo médio (estim.)" value={'-'} icon={<Clock size={24} />} />
      </div>
    </div>
  );
};

export default MyTickets;
