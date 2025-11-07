// Modal responsável por permitir que um técnico seja atribuído a um chamado.
// Comentários em português explicativos sem alterar a lógica original.
import React, { useEffect, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import api from '../../services/api';
import { useAppSelector } from '../../hooks/useRedux';

// Tipos locais para usuários retornados pela API
type User = { id: string; name: string; email: string; role?: string };
type ApiUser = { id?: string; _id?: string; name: string; email: string; role?: string };

// Props do componente: id do ticket, controle do modal e callbacks
type Props = {
  ticketId: string | null;
  show: boolean;
  onClose: () => void;
  onAssigned?: () => void;
};

const AssignModal: React.FC<Props> = ({ ticketId, show, onClose, onAssigned }) => {
  // Usuário atual (do store) usado para limitar opções se for técnico
  const currentUser = useAppSelector(s => s.auth.user);

  // Estado local: lista de técnicos disponíveis, item selecionado e flag de loading
  const [users, setUsers] = useState<User[]>([]);
  const [selected, setSelected] = useState<string>('');
  const [loading, setLoading] = useState(false);

  // Ao abrir o modal, busca usuários da API e filtra apenas técnicos
  useEffect(() => {
    if (!show) return;
    const run = async () => {
      try {
        const { data } = await api.get<ApiUser[]>('/api/users');
        // Filtra apenas usuários com role 'tech'; se role ausente, mantém (compatibilidade)
        let techs = data.filter((u) => (u.role ? u.role === 'tech' : true));
        
        // Se o usuário logado for técnico, mostrar apenas ele (string id pode vir como id ou _id)
        if (currentUser?.role === 'tech' && currentUser?.id) {
          techs = techs.filter((u) => (u.id || u._id) === currentUser.id);
        }

        // Normaliza para o tipo User e popula o estado
        setUsers(techs.map((u) => ({ id: (u.id || u._id) as string, name: u.name, email: u.email, role: u.role })));

        // Se existir apenas um técnico disponível, seleciona automaticamente
        if (techs.length === 1) {
          setSelected((techs[0].id || techs[0]._id) as string);
        }
      } catch {
        // Em caso de erro, limpa a lista (comportamento silencioso)
        setUsers([]);
      }
    };
    run();
  }, [show, currentUser?.id, currentUser?.role]);

  // Envia a atribuição para a API
  const handleAssign = async () => {
    if (!ticketId || !selected) return; // validação mínima
    setLoading(true);
    try {
      await api.put(`/api/tickets/${ticketId}/assign`, { assignedTo: selected });
      // Callback opcional para atualizar a lista externa
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
