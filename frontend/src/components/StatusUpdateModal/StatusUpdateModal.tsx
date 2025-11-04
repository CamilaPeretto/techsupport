import { useState } from 'react';
import { X } from 'lucide-react';
import type { RootState } from '../../store/store';
import { setStatus, closeModal, type StatusType } from '../../store/statusSlice';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import { updateTicketStatus, type TicketStatus } from '../../store/ticketsSlice';
import { Form } from 'react-bootstrap';
import './StatusUpdateModal.css';

const StatusUpdateModal = () => {
  const dispatch = useAppDispatch();
  const { currentStatus, isModalOpen } = useAppSelector((state: RootState) => state.status);
  const selectedTicketId = useAppSelector((state: RootState) => state.tickets.selectedTicketId);
  const [selectedStatus, setSelectedStatus] = useState<StatusType>(currentStatus);
  const [resolution, setResolution] = useState<string>('');

  const statusOptions: StatusType[] = ['Pendente', 'Em andamento', 'Concluído'];

  const handleCancel = () => {
    setSelectedStatus(currentStatus);
    setResolution('');
    dispatch(closeModal());
  };

  const handleUpdate = async () => {
    try {
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
      if (selectedTicketId) {
        const payload: { id: string; status: TicketStatus; resolution?: string } = {
          id: selectedTicketId,
          status: mapToDomain(selectedStatus),
        };
        if (payload.status === 'concluído' && resolution.trim()) {
          payload.resolution = resolution.trim();
        }
        await dispatch(updateTicketStatus(payload));
      }
      dispatch(setStatus(selectedStatus));
    } finally {
      dispatch(closeModal());
    }
  };

  if (!isModalOpen) return null;

  return (
    <div className="status-modal-overlay" onClick={handleCancel}>
      <div className="status-modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="status-modal-header">
          <h2 className="status-modal-title">Atualizar Status</h2>
          <button className="status-modal-close" onClick={handleCancel} aria-label="Fechar">
            <X size={20} />
          </button>
        </div>

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

        {selectedStatus === 'Concluído' && (
          <div className="mt-3" aria-label="Campo de resolução">
            <Form.Label className="text-white">Resolução</Form.Label>
            <Form.Control as="textarea" rows={3} value={resolution} onChange={(e) => setResolution(e.target.value)} placeholder="Descreva a resolução do chamado" />
          </div>
        )}

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
