import React, { useEffect, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import { createTicket, type TicketPriority } from '../../store/ticketsSlice';

type Props = {
  show: boolean;
  onClose: () => void;
};

const NewTicketModal: React.FC<Props> = ({ show, onClose }) => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(s => s.auth.user);
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<TicketPriority>('média');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!show) {
      setTitle('');
      setPriority('média');
      setDescription('');
      setSaving(false);
    }
  }, [show]);

  const handleSave = async () => {
    if (!title.trim() || !user?.id) return;
    setSaving(true);
    try {
      await dispatch(createTicket({ title: title.trim(), description: description.trim() || undefined, priority, userId: user.id })).unwrap();
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal show={show} onHide={onClose} centered aria-label="Modal de novo chamado" backdrop="static" keyboard={false}>
      <Modal.Header>
        <Modal.Title>Novo Chamado</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Título</Form.Label>
            <Form.Control
              type="text"
              placeholder="Descreva brevemente o problema"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              aria-label="Título do chamado"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Prioridade</Form.Label>
            <Form.Select value={priority} onChange={(e) => setPriority(e.target.value as TicketPriority)} aria-label="Prioridade do chamado">
              <option value="baixa">Baixa</option>
              <option value="média">Média</option>
              <option value="alta">Alta</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-0">
            <Form.Label>Descrição</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              placeholder="Detalhe seu problema, passos para reproduzir, mensagens de erro, etc."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              aria-label="Descrição do chamado"
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose} aria-label="Cancelar criação do chamado">
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleSave} disabled={!title.trim() || saving} aria-label="Salvar novo chamado">
          {saving ? 'Salvando...' : 'Salvar'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default NewTicketModal;
