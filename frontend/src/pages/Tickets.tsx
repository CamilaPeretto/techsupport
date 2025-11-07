import React, { useEffect, useMemo, useState } from 'react';
import { Ticket as TicketIcon, Clock, CheckCircle } from 'lucide-react';
import StatsCard from '../components/ui/StatsCard';
import TicketTable from '../components/tickets/TicketTable';
import { useAppDispatch, useAppSelector } from '../hooks/useRedux';
import { fetchTickets, type Ticket as DomainTicket } from '../store/ticketsSlice';
import AssignModal from '../components/tickets/AssignModal';
import NewTicketModal from '../components/tickets/NewTicketModal';
import TicketDetailModal from '../components/tickets/TicketDetailModal';
import { Form } from 'react-bootstrap';

// Página principal de Tickets: lista, filtros e ações (abrir, atribuir, ver detalhe)
const Tickets: React.FC = () => {
  const dispatch = useAppDispatch();

  // Seletores do Redux: itens do slice de tickets e dados do usuário
  const { items, loading } = useAppSelector(s => s.tickets);
  const user = useAppSelector(s => s.auth.user);

  // Estado local para filtros, modais e seleção de ticket
  const [filters, setFilters] = useState<{ status?: DomainTicket['status']; priority?: DomainTicket['priority']; fromDate?: string; toDate?: string }>({});
  const [assignTicketId, setAssignTicketId] = useState<string | null>(null);
  const [showNewTicket, setShowNewTicket] = useState(false);
  const [showDetailTicket, setShowDetailTicket] = useState(false);
  const [detailTicketId, setDetailTicketId] = useState<string | null>(null);

  // Carrega tickets do servidor ao montar o componente
  useEffect(() => {
    dispatch(fetchTickets({}));
  }, [dispatch]);

  // Escuta eventos globais (disparados pelo Header) para abrir modal de novo ticket
  useEffect(() => {
    const handleOpenModal = () => {
      if (!user?.id) { alert('Faça login para criar tickets.'); return; }
      setShowNewTicket(true);
    };
    window.addEventListener('openNewTicketModal', handleOpenModal);
    return () => window.removeEventListener('openNewTicketModal', handleOpenModal);
  }, [user?.id]);

  // Filtragem local: mostra apenas tickets não atribuídos ou atribuídos ao técnico atual
  const filteredItems = useMemo(() => {
    return items.filter(t => !t.assignedTo || t.assignedTo._id === user?.id);
  }, [items, user?.id]);

  // Estatísticas derivadas (cards de resumo)
  const stats = useMemo(() => {
    const inProgress = filteredItems.filter(t => t.status === 'em andamento').length;
    const completed = filteredItems.filter(t => t.status === 'concluído').length;
    const unassigned = filteredItems.filter(t => t.status === 'aberto' && !t.assignedTo).length;
    return { inProgress, completed, unassigned };
  }, [filteredItems]);

  // Mapeamentos para o formato da tabela (normalize domain -> ui)
  type TableTicket = {
    id: string;
    ticketNumber?: number;
    title: string;
    status: 'open' | 'in-progress' | 'completed' | 'pending';
    priority: 'low' | 'medium' | 'high';
    assignedTechnician?: string;
    dueDate?: string;
    requestingEmployee?: string;
  };

  // Converte status do domínio para os valores esperados pela tabela
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

  // Converte prioridade do domínio para os valores da tabela
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

  // Gera o array que será passado para o componente TicketTable
  const tableTickets: TableTicket[] = filteredItems.map((t) => ({
    id: t._id,
    ticketNumber: t.ticketNumber,
    title: t.title,
    status: mapStatusToTable(t.status),
    priority: mapPriorityToTable(t.priority),
    assignedTechnician: t.assignedTo?.name ?? undefined,
    dueDate: t.createdAt ? new Date(t.createdAt).toLocaleDateString('pt-BR') : undefined,
    requestingEmployee: undefined,
  }));

  // Handler para abrir modal de detalhe quando a linha da tabela é clicada
  const handleTicketClick = (t: TableTicket) => {
    setDetailTicketId(t.id);
    setShowDetailTicket(true);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '1.75rem', paddingBottom: '2rem' }}>
      {/* Painel superior: cards com métricas */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '1.5rem' 
      }}>
        <StatsCard title="Em Andamento" value={stats.inProgress} icon={<Clock size={24} />} />
        <StatsCard title="Concluídos" value={stats.completed} icon={<CheckCircle size={24} />} />
        <StatsCard title="Não Atribuídos" value={stats.unassigned} icon={<TicketIcon size={24} />} />
      </div>

      {/* Caixa de filtros */}
      <div style={{ 
        backgroundColor: 'var(--preto)',
        border: '1px solid var(--magenta)',
        borderRadius: '8px',
        padding: '1.5rem 2rem',
        boxShadow: '0 0 12px rgba(230, 39, 248, 0.4)'
      }}>
        <Form className="row g-3 justify-content-md-between" aria-label="Filtros de tickets">
          {/* Select de status */}
          <div className="col-12 col-md-2">
            <Form.Label className="text-white">Status</Form.Label>
            <Form.Select value={filters.status || ''} onChange={(e) => { const v = e.target.value as '' | "aberto" | "em andamento" | "concluído"; setFilters(f => ({ ...f, status: v || undefined })); }} aria-label="Filtro de status">
              <option value="">Todos</option>
              <option value="aberto">Aberto</option>
              <option value="em andamento">Em andamento</option>
              <option value="concluído">Concluído</option>
            </Form.Select>
          </div>

          {/* Select de prioridade */}
          <div className="col-12 col-md-2">
            <Form.Label className="text-white">Prioridade</Form.Label>
            <Form.Select value={filters.priority || ''} onChange={(e) => { const v = e.target.value as '' | 'baixa' | 'média' | 'alta'; setFilters(f => ({ ...f, priority: v || undefined })); }} aria-label="Filtro de prioridade">
              <option value="">Todas</option>
              <option value="baixa">Baixa</option>
              <option value="média">Média</option>
              <option value="alta">Alta</option>
            </Form.Select>
          </div>

          {/* Intervalo de datas */}
          <div className="col-6 col-md-2">
            <Form.Label className="text-white">De</Form.Label>
            <Form.Control type="date" value={filters.fromDate || ''} onChange={(e) => setFilters(f => ({ ...f, fromDate: e.target.value || undefined }))} aria-label="Data inicial" />
          </div>
          <div className="col-6 col-md-2">
            <Form.Label className="text-white">Até</Form.Label>
            <Form.Control type="date" value={filters.toDate || ''} onChange={(e) => setFilters(f => ({ ...f, toDate: e.target.value || undefined }))} aria-label="Data final" />
          </div>

          {/* Botões Filtrar / Limpar */}
          <div className="col-12 col-md-3 d-flex align-items-end justify-content-end gap-2">
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
                // Dispara fetch com os filtros aplicados
                dispatch(fetchTickets({ status: filters.status, priority: filters.priority, fromDate: filters.fromDate, toDate: filters.toDate }));
              }}
            >
              Filtrar
            </button>
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
                // Limpa filtros e recarrega
                setFilters({});
                dispatch(fetchTickets({}));
              }}
            >
              Limpar
            </button>
          </div>
        </Form>
      </div>

      {/* Área principal: tabela de tickets */}
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

      {/* Modais: Atribuir, Novo Ticket e Detalhe */}
      <AssignModal ticketId={assignTicketId} show={!!assignTicketId} onClose={() => setAssignTicketId(null)} onAssigned={() => dispatch(fetchTickets({}))} />
      <NewTicketModal show={showNewTicket} onClose={() => setShowNewTicket(false)} />
      <TicketDetailModal 
        show={showDetailTicket} 
        ticketId={detailTicketId} 
        onClose={() => setShowDetailTicket(false)} 
        onRefresh={() => dispatch(fetchTickets({}))}
      />
    </div>
  );
};

export default Tickets;
