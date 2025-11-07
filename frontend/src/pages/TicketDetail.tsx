import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';

// Tipo local descrevendo os campos do ticket usados nesta página
type Ticket = {
  _id: string;
  title: string;
  description?: string;
  status: 'aberto' | 'em andamento' | 'concluído';
  type?: 'hardware' | 'software' | 'rede' | 'outros';
  priority?: 'baixa' | 'média' | 'alta';
  userId?: { _id: string; name: string; email: string } | string;
  assignedTo?: { _id: string; name: string; email: string } | null;
  resolution?: string;
  resolvedAt?: string | null;
  createdAt: string;
  updatedAt: string;
};

// Componente: exibe o detalhe de um único ticket
const TicketDetail: React.FC = () => {
  // Obtém o id do parâmetro de rota (ex: /tickets/:id)
  const { id } = useParams();

  // Estado local: ticket carregado, flag de loading e mensagens de erro
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Efeito que carrega os dados do ticket quando o id muda
  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        // Chamada ao backend para buscar o ticket por id
        const { data } = await api.get(`/api/tickets/${id}`);
        setTicket(data);
      } catch (e: unknown) {
        // Normaliza mensagem de erro para exibição simples
        const msg = e instanceof Error ? e.message : 'Erro ao carregar ticket';
        setError(msg);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [id]);

  // Renderizações rápidas para estados comuns
  if (loading) return <div>Carregando…</div>;
  if (error) return <div>Erro: {error}</div>;
  if (!ticket) return <div>Ticket não encontrado</div>;

  // UI: resumo do ticket e metadados
  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        {/* Título e botão de voltar para a lista */}
        <h2 className="text-white m-0">Detalhe do Ticket</h2>
        <Link to="/tickets" className="btn btn-secondary" aria-label="Voltar para lista de tickets">Voltar</Link>
      </div>

      {/* Card com informações do ticket */}
      <div className="card" style={{ background: 'var(--cinza-azulado)', color: 'var(--branco)', border: '1px solid var(--cinza-escuro)' }}>
        <div className="card-body">
          {/* Título e descrição (se existir) */}
          <h4 className="card-title">{ticket.title}</h4>
          {ticket.description && <p className="card-text">{ticket.description}</p>}

          {/* Grid com metadados: status, prioridade, tipo, responsável e datas */}
          <div className="row g-3">
            <div className="col-md-6"><strong>Status:</strong> {ticket.status}</div>
            <div className="col-md-6"><strong>Prioridade:</strong> {ticket.priority}</div>
            <div className="col-md-6"><strong>Tipo:</strong> {ticket.type}</div>
            <div className="col-md-6"><strong>Atribuído a:</strong> {typeof ticket.assignedTo === 'object' ? ticket.assignedTo?.name : ''}</div>
            <div className="col-md-6"><strong>Criado em:</strong> {new Date(ticket.createdAt).toLocaleString()}</div>
            <div className="col-md-6"><strong>Atualizado em:</strong> {new Date(ticket.updatedAt).toLocaleString()}</div>

            {/* Campos condicionais: resolução e data de conclusão */}
            {ticket.resolution && (
              <div className="col-12"><strong>Resolução:</strong> {ticket.resolution}</div>
            )}
            {ticket.resolvedAt && (
              <div className="col-12"><strong>Concluído em:</strong> {new Date(ticket.resolvedAt).toLocaleString()}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketDetail;
