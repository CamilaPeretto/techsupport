// Modal para recuperação de senha (comentários adicionados)
import { useState, FormEvent } from 'react';
import { Modal, Form, Button, Toast, ToastContainer } from 'react-bootstrap';

// Props simples: controla se o modal está visível e callback de fechamento
interface ForgotPasswordModalProps {
  show: boolean;
  onHide: () => void;
}

const ForgotPasswordModal = ({ show, onHide }: ForgotPasswordModalProps) => {
  // Campo de email controlado
  const [email, setEmail] = useState('');
  
  // Estado para controlar exibição do toast (mensagens de sucesso/erro)
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVariant, setToastVariant] = useState<'success' | 'danger'>('success');

  // Helper: mostra uma mensagem rápida via Toast
  const showMessage = (message: string, variant: 'success' | 'danger' = 'danger') => {
    setToastMessage(message);
    setToastVariant(variant);
    setShowToast(true);
  };

  // Handler do formulário: validações locais e placeholder de funcionalidade
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    // Validação 1: email preenchido
    if (!email) {
      showMessage('Por favor, insira seu email.');
      return;
    }

    // Validação 2: formato mínimo de email
    if (!email.includes('@')) {
      showMessage('Por favor, insira um email válido.');
      return;
    }

    // Observação: endpoint de recuperação pode não estar implementado no backend ainda.
    // Aqui exibimos uma mensagem informativa. Quando o backend estiver pronto, substituir por chamada API.
    showMessage('Funcionalidade em desenvolvimento. Para recuperação de senha, envie um email para: suporte@techsupport.com', 'danger');
  };

  return (
    <>
      {/* Modal centralizado com tema escuro */}
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
          {/* Instrução breve para o usuário */}
          <p className="mb-4" style={{ color: 'var(--azul-acinzentado)', fontFamily: 'var(--font-secundaria)' }}>
            Digite seu email para receber instruções de recuperação de senha.
          </p>
          
          <Form onSubmit={handleSubmit}>
            {/* Campo de email controlado */}
            <Form.Group className="mb-4">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  backgroundColor: 'var(--cinza-azulado)',
                  borderColor: 'var(--cinza-escuro)',
                  color: 'var(--branco)',
                  fontFamily: 'var(--font-secundaria)'
                }}
              />
            </Form.Group>

            {/* Botão que dispara validação / envio */}
            <Button 
              type="submit" 
              className="w-100 fw-bold"
              size="lg"
              style={{
                backgroundColor: 'var(--magenta)',
                borderColor: 'var(--magenta)',
                fontFamily: 'var(--font-principal)'
              }}
            >
              Enviar
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Toast para mensagens curtas (sucesso/erro) */}
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
