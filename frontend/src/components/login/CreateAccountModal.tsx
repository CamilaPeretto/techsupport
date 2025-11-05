import { useState, FormEvent } from 'react';
import { Modal, Form, Button, Toast, ToastContainer } from 'react-bootstrap';
import api from '../../services/api';

interface CreateAccountModalProps {
  show: boolean;
  onHide: () => void;
}

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const CreateAccountModal = ({ show, onHide }: CreateAccountModalProps) => {
  // Estado que armazena todos os dados do formulário
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  // Estado para controlar toast
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVariant, setToastVariant] = useState<'success' | 'danger'>('success');

  // Atualiza um campo específico do formulário
  const handleChange = (field: keyof FormData, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  // Mostra toast com mensagem
  const showMessage = (message: string, variant: 'success' | 'danger' = 'danger') => {
    setToastMessage(message);
    setToastVariant(variant);
    setShowToast(true);
  };

  // Função que processa o envio do formulário
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Validação 1: Verifica se todos os campos estão preenchidos
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      showMessage('Por favor, preencha todos os campos.');
      return;
    }

    // Validação 2: Verifica se o email é válido
    if (!formData.email.includes('@')) {
      showMessage('Por favor, insira um email válido.');
      return;
    }

    // Validação 3: Verifica se a senha tem pelo menos 6 caracteres
    if (formData.password.length < 6) {
      showMessage('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    // Validação 4: Verifica se as senhas coincidem
    if (formData.password !== formData.confirmPassword) {
      showMessage('As senhas não coincidem.');
      return;
    }

    // Chama API para criar conta
    try {
      await api.post('/api/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      showMessage('Conta criada com sucesso!', 'success');
      
      // Limpa os campos e fecha o modal após 1 segundo
      setTimeout(() => {
        setFormData({
          name: '',
          email: '',
          password: '',
          confirmPassword: '',
        });
        onHide();
      }, 1000);
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Erro ao criar conta';
      showMessage(msg);
    }
  };

  return (
    <>
      <Modal 
        show={show} 
        onHide={onHide} 
        centered
        contentClassName="bg-dark text-white"
      >
        <Modal.Header closeButton closeVariant="white">
          <Modal.Title className="fw-bold">Criar Conta</Modal.Title>
        </Modal.Header>
        
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            {/* Campo Nome */}
            <Form.Group className="mb-3">
              <Form.Label>Nome</Form.Label>
              <Form.Control
                type="text"
                placeholder=""
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                style={{
                  backgroundColor: '#28282E',
                  borderColor: '#212121',
                  color: 'white',
                }}
              />
            </Form.Group>

            {/* Campo Email */}
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder=""
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                style={{
                  backgroundColor: '#28282E',
                  borderColor: '#212121',
                  color: 'white',
                }}
              />
            </Form.Group>

            {/* Campo Senha */}
            <Form.Group className="mb-3">
              <Form.Label>Senha</Form.Label>
              <Form.Control
                type="password"
                placeholder=""
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                style={{
                  backgroundColor: '#28282E',
                  borderColor: '#212121',
                  color: 'white',
                }}
              />
            </Form.Group>

            {/* Campo Confirmar Senha */}
            <Form.Group className="mb-4">
              <Form.Label>Confirmar Senha</Form.Label>
              <Form.Control
                type="password"
                placeholder=""
                value={formData.confirmPassword}
                onChange={(e) => handleChange('confirmPassword', e.target.value)}
                style={{
                  backgroundColor: '#28282E',
                  borderColor: '#212121',
                  color: 'white',
                }}
              />
            </Form.Group>

            {/* Botão Criar Conta */}
            <Button 
              type="submit" 
              className="w-100 fw-bold"
              size="lg"
              style={{
                backgroundColor: '#E627F8',
                borderColor: '#E627F8',
              }}
            >
              Criar Conta
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Toast para mensagens */}
      <ToastContainer position="top-end" className="p-3">
        <Toast 
          show={showToast} 
          onClose={() => setShowToast(false)} 
          delay={3000} 
          autohide
          bg={toastVariant}
        >
          <Toast.Header>
            <strong className="me-auto">{toastVariant === 'success' ? 'Sucesso!' : 'Erro'}</strong>
          </Toast.Header>
          <Toast.Body className="text-white">{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>
    </>
  );
};

export default CreateAccountModal;
