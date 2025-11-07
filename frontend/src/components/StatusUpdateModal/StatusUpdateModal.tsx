// Modal para atualizar o status de um chamado
// Comentários em português explicando o propósito de cada parte
import { useState } from 'react';
import { X } from 'lucide-react';
import type { RootState } from '../../store/store';
import { setStatus, closeModal, type StatusType } from '../../store/statusSlice';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import { updateTicketStatus, type TicketStatus } from '../../store/ticketsSlice';
import { Form } from 'react-bootstrap';
import './StatusUpdateModal.css';

const StatusUpdateModal = () => {
  // Dispatch do Redux para disparar ações (fechar modal, atualizar status, etc.)
  const dispatch = useAppDispatch();

  // Estado global do modal (status atual selecionado e se o modal está aberto)
  const { currentStatus, isModalOpen } = useAppSelector((state: RootState) => state.status);

  // Id do chamado selecionado (pego do slice de tickets)
  const selectedTicketId = useAppSelector((state: RootState) => state.tickets.selectedTicketId);

  // Estado local para o status selecionado no modal (inicia com o status atual)
  const [selectedStatus, setSelectedStatus] = useState<StatusType>(currentStatus);

  // Campo de texto opcional usado quando o chamado for marcado como concluído
  const [resolution, setResolution] = useState<string>('');

  // Opções apresentadas ao usuário no modal (texto amigável)
  const statusOptions: StatusType[] = ['Pendente', 'Em andamento', 'Concluído'];

  // Ao cancelar, restaura o estado local e fecha o modal
  const handleCancel = () => {
    setSelectedStatus(currentStatus);
    setResolution('');
    dispatch(closeModal());
  };

  // Quando o usuário confirma a atualização, mapear para o domínio e disparar o thunk
  const handleUpdate = async () => {
    try {
      // Mapear o rótulo de UI para o valor interno usado pela API/slice
      const mapToDomain = (s: StatusType): TicketStatus => {
        switch (s) {
          case 'Pendente':
            return 'aberto';
          case 'Em andamento':
            return 'em andamento';
          case 'Concluído':
          default:
            return 'concluído';
        }
      };

      // Se houver um ticket selecionado, construir o payload e dispatch do thunk
      if (selectedTicketId) {
        const payload: { id: string; status: TicketStatus; resolution?: string } = {
          id: selectedTicketId,
          status: mapToDomain(selectedStatus),
        };

        // Se o status for concluído, aceitamos uma resolução opcional para registro
        if (payload.status === 'concluído' && resolution.trim()) {
          payload.resolution = resolution.trim();
        }

        // updateTicketStatus é um thunk que faz a chamada API e atualiza o estado global
        await dispatch(updateTicketStatus(payload));
      }

      // Atualiza o estado local/global de status no slice
      dispatch(setStatus(selectedStatus));
    } finally {
      // Garante que o modal seja fechado mesmo em caso de erro
      dispatch(closeModal());
    }
  };

  // Não renderiza nada se o modal estiver fechado
  if (!isModalOpen) return null;

  // Estrutura do modal: overlay que fecha ao clicar fora, e container que impede propagação
  return (
    <div className="status-modal-overlay" onClick={handleCancel}>
      <div className="status-modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="status-modal-header">
          {/* Título do modal */}
          <h2 className="status-modal-title">Atualizar Status</h2>
          {/* Botão de fechar com ícone */}
          <button className="status-modal-close" onClick={handleCancel} aria-label="Fechar">
            <X size={20} />
          </button>
        </div>

        {/* Botões que representam as opções de status. O botão selecionado recebe classe distinta. */}
        <div className="status-options-container">
          {statusOptions.map((status) => (
            <button
              key={status}
              className={`status-option ${selectedStatus === status ? 'status-option-selected' : ''}`}
              onClick={() => setSelectedStatus(status)}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Quando o usuário escolhe 'Concluído', exibe um textarea para a resolução */}
        {selectedStatus === 'Concluído' && (
          <div className="mt-3" aria-label="Campo de resolução">
            <Form.Label className="text-white">Resolução</Form.Label>
            <Form.Control as="textarea" rows={3} value={resolution} onChange={(e) => setResolution(e.target.value)} placeholder="Descreva a resolução do chamado" />
          </div>
        )}

        {/* Ações: cancelar ou confirmar atualização */}
        <div className="status-modal-actions">
          <button className="status-btn-cancel" onClick={handleCancel}>
            Cancelar
          </button>
          <button className="status-btn-update" onClick={handleUpdate}>
            Atualizar
          </button>
        </div>
      </div>
    </div>
  );
};

export default StatusUpdateModal;
