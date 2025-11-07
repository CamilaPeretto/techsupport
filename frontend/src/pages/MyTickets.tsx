import React, { useEffect, useMemo, useState } from 'react';
import { Ticket, Clock, CheckCircle } from 'lucide-react';
import StatsCard from '../components/ui/StatsCard';
import TicketTable from '../components/tickets/TicketTable';
import { Form } from 'react-bootstrap';
import { useAppDispatch, useAppSelector } from '../hooks/useRedux';
import { fetchTickets, type Ticket as DomainTicket } from '../store/ticketsSlice';
import NewTicketModal from '../components/tickets/NewTicketModal';
import TicketDetailModal from '../components/tickets/TicketDetailModal';

// Página 'Meus Chamados' — lista e filtros dos chamados do usuário logado
const MyTickets: React.FC = () => {
  // dispatch tipado do Redux
  const dispatch = useAppDispatch();
  // items e loading do slice de tickets
  const { items, loading } = useAppSelector(s => s.tickets);
  // usuário autenticado do slice auth
  const user = useAppSelector(s => s.auth.user);
  // filtros locais (status, prioridade, intervalo de datas)
  const [filters, setFilters] = useState<{ status?: DomainTicket['status']; priority?: DomainTicket['priority']; fromDate?: string; toDate?: string }>({});
  // controles de modais/local state
  const [showNewTicket, setShowNewTicket] = useState(false);
  const [showDetailTicket, setShowDetailTicket] = useState(false);
  const [detailTicketId, setDetailTicketId] = useState<string | null>(null);

  // Carrega os tickets do usuário quando o componente monta ou user.id muda
  useEffect(() => {
    if (user?.id) {
      // chama o thunk que busca tickets filtrados por userId
      dispatch(fetchTickets({ userId: user.id }));
    }
  }, [dispatch, user?.id]);

  // Listener global: quando o Header dispara 'openNewTicketModal', abre o modal
  useEffect(() => {
    const handleOpenModal = () => {
      if (!user?.id) { alert('Faça login para criar tickets.'); return; }
      setShowNewTicket(true);
    };
    window.addEventListener('openNewTicketModal', handleOpenModal);
    return () => window.removeEventListener('openNewTicketModal', handleOpenModal);
  }, [user?.id]);

  // Tipo local usado pela tabela (mapeamento do domínio para exibição)
  type TableTicket = {
    id: string;
    ticketNumber?: number;
    title: string;
    status: 'open' | 'pending' | 'in-progress' | 'completed';
    priority: 'low' | 'medium' | 'high';
    dueDate?: string;
    requestingEmployee?: string;
    assignedTechnician?: string;
  };

  // Converte tickets do domínio (pt-BR) para o formato usado na tabela (en)
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
    // Mapeia cada item do estado para a representação da tabela
    return items.map((t) => ({
      id: t._id,
      ticketNumber: t.ticketNumber,
      title: t.title,
      status: mapStatus(t.status),
      priority: mapPriority(t.priority),
      dueDate: t.createdAt ? new Date(t.createdAt).toLocaleDateString('pt-BR') : undefined,
      requestingEmployee: undefined,
      assignedTechnician: t.assignedTo?.name ?? undefined,
    }));
  }, [items]);

  // Ao clicar numa linha, abre o modal de detalhe
  const handleTicketClick = (t: TableTicket) => {
    setDetailTicketId(t.id);
    setShowDetailTicket(true);
  };

  // Estatísticas rápidas calculadas a partir dos items
  const stats = useMemo(() => {
    // Items já vem filtrados do backend para o usuário logado
    const total = items.length;
    const inProgress = items.filter(t => t.status === 'em andamento').length;
    const completed = items.filter(t => t.status === 'concluído').length;
    return { total, inProgress, completed };
  }, [items]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '1.75rem', paddingBottom: '2rem' }}>
      {/* Dashboard - Cards de estatísticas */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '1.5rem' 
      }}>
        {/* Cards reutilizáveis mostrando números importantes */}
        <StatsCard title="Total de Tickets" value={stats.total} icon={<Ticket size={24} />} />
        <StatsCard title="Em Andamento" value={stats.inProgress} icon={<Clock size={24} />} />
        <StatsCard title="Concluídos" value={stats.completed} icon={<CheckCircle size={24} />} />
      </div>

      {/* Filtros */}
      <div style={{ 
        backgroundColor: 'var(--color-secondary-bluish-gray)',
        border: '1px solid var(--color-secondary-dark-gray)',
        borderRadius: '8px',
        padding: '1.5rem 2rem',
        boxShadow: 'var(--shadow-base)'
      }}>
        <Form className="row g-3 justify-content-md-between" aria-label="Filtros dos meus tickets">
          <div className="col-12 col-md-2">
            {/* Filtro de status */}
            <Form.Label className="text-white">Status</Form.Label>
            <Form.Select value={filters.status || ''} onChange={(e) => { const v = e.target.value as '' | 'aberto' | 'em andamento' | 'concluído'; setFilters(f => ({ ...f, status: v || undefined })); }} aria-label="Filtro de status">
              <option value="">Todos</option>
              <option value="aberto">Aberto</option>
              <option value="em andamento">Em andamento</option>
              <option value="concluído">Concluído</option>
            </Form.Select>
          </div>
          <div className="col-12 col-md-2">
            {/* Filtro de prioridade */}
            <Form.Label className="text-white">Prioridade</Form.Label>
            <Form.Select value={filters.priority || ''} onChange={(e) => { const v = e.target.value as '' | 'baixa' | 'média' | 'alta'; setFilters(f => ({ ...f, priority: v || undefined })); }} aria-label="Filtro de prioridade">
              <option value="">Todas</option>
              <option value="baixa">Baixa</option>
              <option value="média">Média</option>
              <option value="alta">Alta</option>
            </Form.Select>
          </div>
          <div className="col-6 col-md-2">
            {/* Data inicial */}
            <Form.Label className="text-white">De</Form.Label>
            <Form.Control type="date" value={filters.fromDate || ''} onChange={(e) => setFilters(f => ({ ...f, fromDate: e.target.value || undefined }))} aria-label="Data inicial" />
          </div>
          <div className="col-6 col-md-2">
            {/* Data final */}
            <Form.Label className="text-white">Até</Form.Label>
            <Form.Control type="date" value={filters.toDate || ''} onChange={(e) => setFilters(f => ({ ...f, toDate: e.target.value || undefined }))} aria-label="Data final" />
          </div>
          <div className="col-12 col-md-3 d-flex align-items-end justify-content-end gap-2">
            {/* Botão Filtrar — dispara thunk com os filtros selecionados */}
            <button 
              type="button"
              style={{
                backgroundColor: 'var(--magenta)',
                color: 'var(--branco)',
                border: 'none',
                borderRadius: '8px',
                padding: '8px 16px',
                fontFamily: 'var(--font-secundaria)',
                fontWeight: 500,
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'all 0.2s ease-in-out',
                boxShadow: '0 2px 8px rgba(230, 39, 248, 0.3)'
              }}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = 'var(--cinza-azulado)')}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'var(--magenta)')}
              onClick={() => {
                if (user?.id) {
                  dispatch(fetchTickets({ userId: user.id, status: filters.status, priority: filters.priority, fromDate: filters.fromDate, toDate: filters.toDate }));
                }
              }}
            >
              Filtrar
            </button>
            {/* Botão Limpar — remove filtros e recarrega */}
            <button 
              type="button"
              style={{
                backgroundColor: 'var(--cinza-azulado)',
                color: 'var(--branco)',
                border: 'none',
                borderRadius: '8px',
                padding: '8px 16px',
                fontFamily: 'var(--font-secundaria)',
                fontWeight: 500,
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'all 0.2s ease-in-out',
                boxShadow: '0 2px 8px rgba(230, 39, 248, 0.3)'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--cinza-escuro)';
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--cinza-azulado)';
                e.currentTarget.style.transform = 'scale(1)';
              }}
              onClick={() => {
                setFilters({});
                if (user?.id) {
                  dispatch(fetchTickets({ userId: user.id }));
                }
              }}
            >
              Limpar
            </button>
          </div>
        </Form>
      </div>

      {/* Tabela */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {loading ? (
          <div>Carregando...</div>
        ) : (
          <TicketTable
            tickets={tableTickets}
            onTicketClick={handleTicketClick}
            className="mb-4"
          />
        )}
      </div>

      {/* Modais de criar novo ticket e visualizar detalhe */}
      <NewTicketModal show={showNewTicket} onClose={() => setShowNewTicket(false)} />
      <TicketDetailModal 
        show={showDetailTicket} 
        ticketId={detailTicketId} 
        onClose={() => setShowDetailTicket(false)} 
        onRefresh={() => { if (user?.id) dispatch(fetchTickets({ userId: user.id })); }}
      />
    </div>
  );
};

export default MyTickets;
