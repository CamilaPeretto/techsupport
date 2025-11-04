import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { X } from 'lucide-react';
import type { RootState } from '../../store/store';
import { setStatus, closeModal, type StatusType } from '../../store/statusSlice';
import './StatusUpdateModal.css';

const StatusUpdateModal = () => {
  const dispatch = useDispatch();
  const { currentStatus, isModalOpen } = useSelector((state: RootState) => state.status);
  const [selectedStatus, setSelectedStatus] = useState<StatusType>(currentStatus);

  const statusOptions: StatusType[] = ['Pendente', 'Em andamento', 'Concluído'];

  const handleCancel = () => {
    setSelectedStatus(currentStatus);
    dispatch(closeModal());
  };

  const handleUpdate = async () => {
    // Aqui poderia chamar API com axios para persistir
    dispatch(setStatus(selectedStatus));
    dispatch(closeModal());
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
