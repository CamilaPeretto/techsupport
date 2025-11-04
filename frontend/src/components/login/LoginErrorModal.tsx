// Modal exibido quando ocorre erro no login
import { useState, useEffect, FormEvent } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import { AlertCircle } from 'lucide-react';

interface LoginErrorModalProps {
  show: boolean;
  onHide: () => void;
  errorMessage: string;
  email: string;
  password: string;
  onRetry: (e: FormEvent) => void;
}

const LoginErrorModal = ({ 
  show, 
  onHide, 
  errorMessage, 
  email: initialEmail, 
  password: initialPassword, 
  onRetry 
}: LoginErrorModalProps) => {
  // Estados para armazenar os valores editados
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState(initialPassword);

  // Atualiza os campos quando os props mudam
  useEffect(() => {
    setEmail(initialEmail);
    setPassword(initialPassword);
  }, [initialEmail, initialPassword]);

  // Função que tenta fazer login novamente
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onRetry(e);
    onHide();
  };

  return (
    <Modal 
      show={show} 
      onHide={onHide} 
      centered
      contentClassName="bg-dark text-white"
    >
      <Modal.Header closeButton closeVariant="white" className="border-0">
        {/* Ícone de erro */}
        <div className="w-100 d-flex flex-column align-items-center mb-2">
          <div 
            className="rounded-circle d-flex align-items-center justify-content-center mb-3"
            style={{
              width: '64px',
              height: '64px',
              backgroundColor: 'rgba(230, 39, 248, 0.1)',
              border: '2px solid rgba(230, 39, 248, 0.3)',
            }}
          >
            <AlertCircle size={32} color="#E627F8" strokeWidth={2.5} />
          </div>
          <Modal.Title className="fw-bold">Erro de Login</Modal.Title>
        </div>
      </Modal.Header>
      
      <Modal.Body>
        {/* Mensagem de erro */}
        <p className="text-center mb-4" style={{ color: '#6272A4' }}>
          {errorMessage}
        </p>
        
        <Form onSubmit={handleSubmit}>
          {/* Campo Email */}
          <Form.Group className="mb-3">
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

          {/* Campo Senha */}
          <Form.Group className="mb-4">
            <Form.Label>Senha</Form.Label>
            <Form.Control
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                backgroundColor: '#28282E',
                borderColor: '#212121',
                color: 'white',
              }}
            />
          </Form.Group>

          {/* Botões */}
          <div className="d-flex gap-2">
            <Button 
              variant="outline-secondary" 
              className="flex-fill fw-bold"
              onClick={onHide}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              className="flex-fill fw-bold"
              style={{
                backgroundColor: '#E627F8',
                borderColor: '#E627F8',
              }}
            >
              Tentar Novamente
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default LoginErrorModal;
