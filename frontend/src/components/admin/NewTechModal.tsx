import { useState } from 'react';
import { Modal, Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';
import api from '../../services/api';

// Props do modal: controlar exibição e callbacks
interface NewTechModalProps {
  show: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

// Modal para cadastro rápido de um novo técnico (role = 'tech')
export default function NewTechModal({ show, onClose, onSuccess }: NewTechModalProps) {
  // Estado do formulário: campos controlados
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    department: '',
    position: ''
  });

  // Flags de loading, mensagem de erro e sucesso
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Atualiza um campo do formulário (onChange genérico)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  // Submissão: chama a API para criar um usuário com role 'tech'
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    try {
      // Força role como 'tech' no payload
      await api.post('/api/register', {
        ...formData,
        role: 'tech' // Força o role como tech
      });

      // Indica sucesso e limpa formulário
      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        password: '',
        department: '',
        position: ''
      });

      // Fecha e dispara callback de sucesso após breve delay para UX
      setTimeout(() => {
        onSuccess?.();
        onClose();
      }, 1500);
    } catch (err: unknown) {
      // Tratamento cuidadoso de erros, priorizando mensagens do backend
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Erro ao cadastrar técnico');
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Erro ao cadastrar técnico');
      }
    } finally {
      setLoading(false);
    }
  };

  // Ao fechar manualmente, limpa estado local e executa onClose
  const handleClose = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      department: '',
      position: ''
    });
    setError(null);
    setSuccess(false);
    onClose();
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header 
        style={{
          backgroundColor: 'var(--preto)',
          borderBottom: '2px solid var(--magenta)',
          color: 'var(--branco)'
        }}
      >
        <Modal.Title style={{ fontFamily: 'var(--font-principal)', color: 'var(--magenta)' }}>
          Cadastrar Novo Técnico
        </Modal.Title>
      </Modal.Header>

      <Modal.Body style={{ backgroundColor: 'var(--preto)', padding: '2rem' }}>
        {/* Exibe mensagens de erro ou sucesso */}
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">Técnico cadastrado com sucesso!</Alert>}

        {/* Formulário controlado de cadastro */}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label style={{ color: 'var(--magenta)', fontWeight: 'bold' }}>Nome Completo</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Digite o nome completo"
              style={{
                backgroundColor: 'var(--preto)',
                border: '1px solid var(--magenta)',
                color: 'var(--branco)',
                fontFamily: 'var(--font-secundaria)'
              }}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label style={{ color: 'var(--magenta)', fontWeight: 'bold' }}>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Digite o email"
              style={{
                backgroundColor: 'var(--preto)',
                border: '1px solid var(--magenta)',
                color: 'var(--branco)',
                fontFamily: 'var(--font-secundaria)'
              }}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label style={{ color: 'var(--magenta)', fontWeight: 'bold' }}>Senha</Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
              placeholder="Mínimo 6 caracteres"
              style={{
                backgroundColor: 'var(--preto)',
                border: '1px solid var(--magenta)',
                color: 'var(--branco)',
                fontFamily: 'var(--font-secundaria)'
              }}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label style={{ color: 'var(--magenta)', fontWeight: 'bold' }}>Departamento</Form.Label>
            <Form.Control
              type="text"
              name="department"
              value={formData.department}
              onChange={handleChange}
              placeholder="Ex: Suporte Técnico (opcional)"
              style={{
                backgroundColor: 'var(--preto)',
                border: '1px solid var(--magenta)',
                color: 'var(--branco)',
                fontFamily: 'var(--font-secundaria)'
              }}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label style={{ color: 'var(--magenta)', fontWeight: 'bold' }}>Cargo</Form.Label>
            <Form.Control
              type="text"
              name="position"
              value={formData.position}
              onChange={handleChange}
              placeholder="Ex: Técnico de TI (opcional)"
              style={{
                backgroundColor: 'var(--preto)',
                border: '1px solid var(--magenta)',
                color: 'var(--branco)',
                fontFamily: 'var(--font-secundaria)'
              }}
            />
          </Form.Group>

          {/* Ações: cancelar ou submeter */}
          <div className="d-flex gap-2 justify-content-end mt-4">
            <Button
              variant="secondary"
              onClick={handleClose}
              disabled={loading}
              style={{
                backgroundColor: 'var(--cinza-escuro)',
                border: '1px solid var(--cinza-azulado)',
                fontFamily: 'var(--font-secundaria)'
              }}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading}
              style={{
                backgroundColor: 'var(--magenta)',
                border: 'none',
                fontFamily: 'var(--font-secundaria)',
                boxShadow: '0 2px 8px rgba(230, 39, 248, 0.3)'
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.backgroundColor = 'var(--cinza-azulado)')
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.backgroundColor = 'var(--magenta)')
              }
            >
              {loading ? 'Cadastrando...' : 'Cadastrar Técnico'}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}
