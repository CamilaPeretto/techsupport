import React, { useEffect, useState } from 'react';
import { Modal, Button, Badge } from 'react-bootstrap';
import api from '../../services/api';
import { useAppSelector } from '../../hooks/useRedux';
import AssignModal from './AssignModal';
import StatusUpdateModalSimple from './StatusUpdateModalSimple';

type TicketDetail = {
  _id: string;
  ticketNumber?: number;
  title: string;
  description?: string;
  status: 'aberto' | 'em andamento' | 'concluído';
  type?: 'hardware' | 'software' | 'rede' | 'outros';
  priority?: 'baixa' | 'média' | 'alta';
  userId?: { _id: string; name: string; email: string };
  assignedTo?: { _id: string; name: string; email: string } | null;
  resolution?: string;
  resolvedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  statusHistory?: {
    status: string;
    changedAt: string;
    changedBy?: { _id: string; name: string };
    assignedTechnicianName?: string;
  }[];
  assignedAt?: string | null;
  inProgressAt?: string | null;
};

type Props = {
  show: boolean;
  ticketId: string | null;
  onClose: () => void;
  onRefresh?: () => void;
};

const TicketDetailModal: React.FC<Props> = ({ show, ticketId, onClose, onRefresh }) => {
  const [ticket, setTicket] = useState<TicketDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const user = useAppSelector(s => s.auth.user);

  useEffect(() => {
    if (!show || !ticketId) return;
    const fetchTicket = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/api/tickets/${ticketId}`);
        setTicket(data);
      } catch (err) {
        console.error('Erro ao carregar ticket:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTicket();
  }, [show, ticketId]);

  const handleAssigned = () => {
    setShowAssignModal(false);
    // Recarrega o ticket
    if (ticketId) {
      api.get(`/api/tickets/${ticketId}`).then(({ data }) => setTicket(data));
    }
    onRefresh?.();
  };

  const handleStatusUpdated = () => {
    setShowStatusModal(false);
    // Recarrega o ticket
    if (ticketId) {
      api.get(`/api/tickets/${ticketId}`).then(({ data }) => setTicket(data));
    }
    onRefresh?.();
  };

  const isAssignedToCurrentUser = ticket?.assignedTo?._id === user?.id;
  const isNotAssigned = !ticket?.assignedTo;

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'aberto': return 'Aberto';
      case 'em andamento': return 'Em Andamento';
      case 'concluído': return 'Concluído';
      default: return status;
    }
  };

  const getPriorityLabel = (priority?: string) => {
    switch (priority) {
      case 'alta': return 'Alta';
      case 'média': return 'Média';
      case 'baixa': return 'Baixa';
      default: return priority ?? '-';
    }
  };

  return (
    <Modal show={show} onHide={onClose} centered size="lg" backdrop="static" keyboard={false}>
      <Modal.Header>
        <Modal.Title>Detalhes do Chamado</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading ? (
          <div className="text-center py-4">Carregando...</div>
        ) : ticket ? (
          <div>
            <div className="mb-3">
              <h5 className="text-white mb-2">
                {ticket.ticketNumber ? `#${ticket.ticketNumber}` : `#${ticket._id.slice(-6)}`} - {ticket.title}
              </h5>
              {ticket.description && (
                <p className="text-white mb-3">{ticket.description}</p>
              )}
            </div>

            <div className="row g-3">
              <div className="col-md-6">
                <strong className="text-white">Status:</strong>
                <div className="mt-1">
                  <Badge bg={ticket.status === 'concluído' ? 'success' : ticket.status === 'em andamento' ? 'warning' : 'secondary'}>
                    {getStatusLabel(ticket.status)}
                  </Badge>
                </div>
              </div>

              <div className="col-md-6">
                <strong className="text-white">Prioridade:</strong>
                <div className="mt-1">
                  <Badge bg={ticket.priority === 'alta' ? 'danger' : ticket.priority === 'média' ? 'warning' : 'info'}>
                    {getPriorityLabel(ticket.priority)}
                  </Badge>
                </div>
              </div>

              <div className="col-md-6">
                <strong className="text-white">Técnico Atribuído:</strong>
                <p className="text-white mb-0 mt-1">{ticket.assignedTo?.name || '-'}</p>
              </div>

              <div className="col-md-6">
                <strong className="text-white">Solicitante:</strong>
                <p className="text-white mb-0 mt-1">{ticket.userId?.name || '-'}</p>
              </div>

              <div className="col-md-6">
                <strong className="text-white">Email do Solicitante:</strong>
                <p className="text-white mb-0 mt-1">{ticket.userId?.email || '-'}</p>
              </div>

              <div className="col-md-6">
                <strong className="text-white">Criado em:</strong>
                <p className="text-white mb-0 mt-1">{new Date(ticket.createdAt).toLocaleString('pt-BR')}</p>
              </div>

              {ticket.resolution && (
                <div className="col-12">
                  <strong className="text-white">Resolução:</strong>
                  <p className="text-white mb-0 mt-1">{ticket.resolution}</p>
                </div>
              )}

              {ticket.resolvedAt && (
                <div className="col-12">
                  <strong className="text-white">Concluído em:</strong>
                  <p className="text-white mb-0 mt-1">{new Date(ticket.resolvedAt).toLocaleString('pt-BR')}</p>
                </div>
              )}
            </div>

            {/* Linha do Tempo */}
            <div className="mt-4">
              <h6 className="text-white mb-3">Linha do Tempo</h6>
              <div className="timeline">
                {/* Ticket Criado */}
                <div className="timeline-item">
                  <div className="timeline-marker"></div>
                  <div className="timeline-content">
                    <div className="timeline-title text-white">Ticket Criado</div>
                    <div className="timeline-date text-white-50">
                      {new Date(ticket.createdAt).toLocaleString('pt-BR')}
                    </div>
                  </div>
                </div>

                {/* Atribuído ao Técnico */}
                {ticket.assignedAt && ticket.assignedTo && (
                  <div className="timeline-item">
                    <div className="timeline-marker"></div>
                    <div className="timeline-content">
                      <div className="timeline-title text-white">
                        Atribuído a {ticket.assignedTo.name}
                      </div>
                      <div className="timeline-date text-white-50">
                        {new Date(ticket.assignedAt).toLocaleString('pt-BR')}
                      </div>
                    </div>
                  </div>
                )}

                {/* Em Andamento */}
                {ticket.inProgressAt && (
                  <div className="timeline-item">
                    <div className="timeline-marker"></div>
                    <div className="timeline-content">
                      <div className="timeline-title text-white">Em Andamento</div>
                      <div className="timeline-date text-white-50">
                        {new Date(ticket.inProgressAt).toLocaleString('pt-BR')}
                      </div>
                    </div>
                  </div>
                )}

                {/* Concluído */}
                {ticket.resolvedAt && (
                  <div className="timeline-item">
                    <div className="timeline-marker"></div>
                    <div className="timeline-content">
                      <div className="timeline-title text-white">Concluído</div>
                      <div className="timeline-date text-white-50">
                        {new Date(ticket.resolvedAt).toLocaleString('pt-BR')}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-4 text-white">Ticket não encontrado</div>
        )}
      </Modal.Body>
      <Modal.Footer>
        {user?.role === 'tech' && ticket && isNotAssigned && (
          <button
            onClick={() => setShowAssignModal(true)}
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
          >
            Atribuir
          </button>
        )}
        {user?.role === 'tech' && ticket && isAssignedToCurrentUser && (
          <button
            onClick={() => setShowStatusModal(true)}
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
          >
            Atualizar Status
          </button>
        )}
        <Button variant="secondary" onClick={onClose}>
          Fechar
        </Button>
      </Modal.Footer>

      {/* Modal de Atribuir */}
      {ticket && (
        <>
          <AssignModal
            ticketId={ticket._id}
            show={showAssignModal}
            onClose={() => setShowAssignModal(false)}
            onAssigned={handleAssigned}
          />
          {showStatusModal && (
            <StatusUpdateModalSimple
              ticketId={ticket._id}
              currentStatus={ticket.status}
              onClose={() => setShowStatusModal(false)}
              onUpdated={handleStatusUpdated}
            />
          )}
        </>
      )}
    </Modal>
  );
};

export default TicketDetailModal;
