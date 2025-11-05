// Modal para recuperação de senha
import { useState, FormEvent } from 'react';
import { Modal, Form, Button, Toast, ToastContainer } from 'react-bootstrap';

interface ForgotPasswordModalProps {
  show: boolean;
  onHide: () => void;
}

const ForgotPasswordModal = ({ show, onHide }: ForgotPasswordModalProps) => {
  const [email, setEmail] = useState('');
  
  // Estado para controlar toast
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVariant, setToastVariant] = useState<'success' | 'danger'>('success');

  // Mostra toast com mensagem
  const showMessage = (message: string, variant: 'success' | 'danger' = 'danger') => {
    setToastMessage(message);
    setToastVariant(variant);
    setShowToast(true);
  };

  // Função que processa o envio do formulário
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    // Validação 1: Verifica se o email foi preenchido
    if (!email) {
      showMessage('Por favor, insira seu email.');
      return;
    }

    // Validação 2: Verifica se o email é válido
    if (!email.includes('@')) {
      showMessage('Por favor, insira um email válido.');
      return;
    }

    // Funcionalidade de recuperação de senha ainda não implementada no backend
    showMessage('Funcionalidade de recuperação de senha em desenvolvimento. Entre em contato com o suporte.', 'danger');
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
          <Modal.Title className="fw-bold">Esqueci Senha</Modal.Title>
        </Modal.Header>
        
        <Modal.Body>
          <p className="mb-4" style={{ color: '#6272A4' }}>
            Digite seu email para receber instruções de recuperação de senha.
          </p>
          
          <Form onSubmit={handleSubmit}>
            {/* Campo Email */}
            <Form.Group className="mb-4">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  backgroundColor: '#28282E',
                  borderColor: '#212121',
                  color: 'white',
                }}
              />
            </Form.Group>

            {/* Botão Enviar */}
            <Button 
              type="submit" 
              className="w-100 fw-bold"
              size="lg"
              style={{
                backgroundColor: '#E627F8',
                borderColor: '#E627F8',
              }}
            >
              Enviar
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

export default ForgotPasswordModal;
