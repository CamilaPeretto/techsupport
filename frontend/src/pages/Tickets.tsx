import React, { useEffect, useMemo, useState } from 'react';
import { Plus, Ticket as TicketIcon, Clock, CheckCircle } from 'lucide-react';
import Button from '../components/ui/Button';
import StatsCard from '../components/ui/StatsCard';
import TicketTable from '../components/tickets/TicketTable';
import { useAppDispatch, useAppSelector } from '../hooks/useRedux';
import { createTicket, fetchTickets, setSelectedTicketId, type Ticket as DomainTicket, type TicketType } from '../store/ticketsSlice';
import { openModal } from '../store/statusSlice';
import AssignModal from '../components/tickets/AssignModal';
import { Form } from 'react-bootstrap';

const Tickets: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items, loading } = useAppSelector(s => s.tickets);
  const user = useAppSelector(s => s.auth.user);
  const [filters, setFilters] = useState<{ status?: DomainTicket['status']; priority?: DomainTicket['priority']; type?: TicketType; fromDate?: string; toDate?: string }>({});
  const [assignTicketId, setAssignTicketId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchTickets({ status: filters.status, priority: filters.priority, type: filters.type, fromDate: filters.fromDate, toDate: filters.toDate }));
  }, [dispatch, filters.status, filters.priority, filters.type, filters.fromDate, filters.toDate]);

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

      {/* Filtros */}
      <div className="card p-3" style={{ background: '#1e1e24', borderColor: '#2a2a30' }}>
        <Form className="row g-3" aria-label="Filtros de tickets">
          <div className="col-md-3">
            <Form.Label className="text-white">Status</Form.Label>
            <Form.Select value={filters.status || ''} onChange={(e) => { const v = e.target.value as '' | "aberto" | "em andamento" | "concluído"; setFilters(f => ({ ...f, status: v || undefined })); }} aria-label="Filtro de status">
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
            <Form.Select value={filters.type || ''} onChange={(e) => setFilters(f => ({ ...f, type: (e.target.value || undefined) as TicketType | undefined }))} aria-label="Filtro de tipo">
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

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
        <StatsCard title="Total" value={stats.total} icon={<TicketIcon size={24} />} />
        <StatsCard title="Em andamento" value={stats.inProgress} icon={<Clock size={24} />} />
        <StatsCard title="Concluídos" value={stats.resolved} icon={<CheckCircle size={24} />} />
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {loading ? (
          <div>Carregando...</div>
        ) : (
          <TicketTable
            tickets={tableTickets}
            onTicketClick={handleTicketClick}
            renderActions={(t) => (
              <div className="d-flex gap-2">
                <button className="btn btn-sm btn-outline-primary" onClick={(e) => { e.stopPropagation(); setAssignTicketId(t.id); }} aria-label={`Atribuir ticket ${t.id}`}>
                  Atribuir
                </button>
                <a className="btn btn-sm btn-outline-secondary" href={`/tickets/${t.id}`} onClick={(e)=> e.stopPropagation()} aria-label={`Ver detalhes do ticket ${t.id}`}>
                  Detalhes
                </a>
              </div>
            )}
          />
        )}
      </div>

      <AssignModal ticketId={assignTicketId} show={!!assignTicketId} onClose={() => setAssignTicketId(null)} onAssigned={() => dispatch(fetchTickets({ ...filters }))} />
    </div>
  );
};

export default Tickets;
