// Versão simples do modal de atualização de status usada em listas/ações rápidas
// Comentários em português para documentar estados e fluxo
import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import api from '../../services/api';

type Props = {
  ticketId: string;
  currentStatus: 'aberto' | 'em andamento' | 'concluído';
  onClose: () => void;
  onUpdated: () => void;
};

const StatusUpdateModalSimple: React.FC<Props> = ({ ticketId, currentStatus, onClose, onUpdated }) => {
  // Estado local: status atual selecionado e campo de resolução (quando necessário)
  const [status, setStatus] = useState<'aberto' | 'em andamento' | 'concluído'>(currentStatus);
  const [resolution, setResolution] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Envia a atualização para a API. payload inclui resolução somente se aplicável.
  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      const payload: { status: string; resolution?: string } = { status };
      if (status === 'concluído' && resolution.trim()) {
        payload.resolution = resolution.trim();
      }
      await api.put(`/api/tickets/${ticketId}/status`, payload);
      // Notifica o componente pai que houve atualização e fecha o modal
      onUpdated();
      onClose();
    } catch (err) {
      console.error('Erro ao atualizar status:', err);
      // Feedback simples: alerta (pode ser substituído por Toast global)
      alert('Erro ao atualizar o status do chamado.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal show onHide={onClose} centered backdrop="static" keyboard={false}>
      <Modal.Header>
        <Modal.Title>Atualizar Status</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group className="mb-3">
          <Form.Label className="text-white">Status</Form.Label>
          <Form.Select value={status} onChange={(e) => setStatus(e.target.value as 'aberto' | 'em andamento' | 'concluído')}>
            <option value="aberto">Aberto</option>
            <option value="em andamento">Em Andamento</option>
            <option value="concluído">Concluído</option>
          </Form.Select>
        </Form.Group>

        {/* Quando o status for concluído, exibimos o campo de resolução */}
        {status === 'concluído' && (
          <Form.Group className="mb-3">
            <Form.Label className="text-white">Resolução</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={resolution}
              onChange={(e) => setResolution(e.target.value)}
              placeholder="Descreva a resolução do chamado"
            />
          </Form.Group>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose} disabled={submitting}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleSubmit} disabled={submitting}>
          {submitting ? 'Atualizando...' : 'Atualizar'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default StatusUpdateModalSimple;
