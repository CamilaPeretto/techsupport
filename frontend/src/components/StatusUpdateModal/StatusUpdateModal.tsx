import { useState } from 'react';
import { X } from 'lucide-react';
import type { RootState } from '../../store/store';
import { setStatus, closeModal, type StatusType } from '../../store/statusSlice';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import { updateTicketStatus, type TicketStatus } from '../../store/ticketsSlice';
import './StatusUpdateModal.css';

const StatusUpdateModal = () => {
  const dispatch = useAppDispatch();
  const { currentStatus, isModalOpen } = useAppSelector((state: RootState) => state.status);
  const selectedTicketId = useAppSelector((state: RootState) => state.tickets.selectedTicketId);
  const [selectedStatus, setSelectedStatus] = useState<StatusType>(currentStatus);

  const statusOptions: StatusType[] = ['Pendente', 'Em andamento', 'Concluído'];

  const handleCancel = () => {
    setSelectedStatus(currentStatus);
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
        await dispatch(updateTicketStatus({ id: selectedTicketId, status: mapToDomain(selectedStatus) }));
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
