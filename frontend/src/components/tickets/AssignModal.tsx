import React, { useEffect, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import api from '../../services/api';

type User = { id: string; name: string; email: string; role?: string };
type ApiUser = { id?: string; _id?: string; name: string; email: string; role?: string };

type Props = {
  ticketId: string | null;
  show: boolean;
  onClose: () => void;
  onAssigned?: () => void;
};

const AssignModal: React.FC<Props> = ({ ticketId, show, onClose, onAssigned }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [selected, setSelected] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!show) return;
    const run = async () => {
      try {
        const { data } = await api.get<ApiUser[]>('/api/users');
        // opcional: filtrar por técnicos, quando disponível
        const techs = data.filter((u) => (u.role ? u.role === 'tech' : true));
        setUsers(techs.map((u) => ({ id: (u.id || u._id) as string, name: u.name, email: u.email, role: u.role })));
      } catch {
        setUsers([]);
      }
    };
    run();
  }, [show]);

  const handleAssign = async () => {
    if (!ticketId || !selected) return;
    setLoading(true);
    try {
      await api.put(`/api/tickets/${ticketId}/assign`, { assignedTo: selected });
      onAssigned?.();
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onClose} aria-label="Modal de atribuição de técnico" centered>
      <Modal.Header closeButton>
        <Modal.Title>Atribuir técnico</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group>
          <Form.Label>Selecione o técnico</Form.Label>
          <Form.Select value={selected} onChange={(e) => setSelected(e.target.value)} aria-label="Selecionar técnico">
            <option value="">Escolha...</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
            ))}
          </Form.Select>
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose} aria-label="Cancelar atribuição">Cancelar</Button>
        <Button variant="primary" onClick={handleAssign} disabled={!selected || loading} aria-label="Confirmar atribuição">
          {loading ? 'Atribuindo...' : 'Atribuir'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AssignModal;
