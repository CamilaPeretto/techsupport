// Modal exibido quando ocorre erro no login (comentado em português)
import { useState, useEffect, FormEvent } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import { AlertCircle } from 'lucide-react';

// Props: mensagem de erro, valores iniciais e callback para tentar novamente
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
  // Estados para editar localmente email e senha antes de reenviar
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState(initialPassword);

  // Sincroniza os estados locais quando as props mudam
  useEffect(() => {
    setEmail(initialEmail);
    setPassword(initialPassword);
  }, [initialEmail, initialPassword]);

  // Handler: tenta submeter novamente os dados para login
  // Observação: o componente pai espera um FormEvent semelhante ao de um submit
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // Pegamos os campos diretamente do form para garantir os valores atuais
    const form = e.target as HTMLFormElement;
    const emailInput = form.elements.namedItem('email') as HTMLInputElement;
    const passwordInput = form.elements.namedItem('password') as HTMLInputElement;
    
    if (emailInput && passwordInput) {
      // Criamos um "evento sintético" com currentTarget contendo os inputs necessários
      // Isso é consumido pelo handler de login no componente pai (que lê currentTarget.email.value)
      const syntheticEvent = {
        ...e,
        currentTarget: {
          email: emailInput,
          password: passwordInput
        }
      } as unknown as FormEvent;
      
      // Chama o callback do pai para tentar login novamente
      onRetry(syntheticEvent);
    }
    // Fecha o modal após disparar a tentativa
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
        {/* Ícone de erro e título centralizados */}
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
            <AlertCircle size={32} color="var(--magenta)" strokeWidth={2.5} />
          </div>
          <Modal.Title className="fw-bold">Erro de Login</Modal.Title>
        </div>
      </Modal.Header>
      
      <Modal.Body>
        {/* Mensagem de erro fornecida pelo pai */}
        <p className="text-center mb-4" style={{ color: 'var(--azul-acinzentado)', fontFamily: 'var(--font-secundaria)' }}>
          {errorMessage}
        </p>
        
        {/* Form que permite editar email/senha e reenviar */}
        <Form onSubmit={handleSubmit}>
          {/* Campo Email */}
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              name="email"
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

          {/* Campo Senha */}
          <Form.Group className="mb-4">
            <Form.Label>Senha</Form.Label>
            <Form.Control
              name="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                backgroundColor: 'var(--cinza-azulado)',
                borderColor: 'var(--cinza-escuro)',
                color: 'var(--branco)',
                fontFamily: 'var(--font-secundaria)'
              }}
            />
          </Form.Group>

          {/* Botões: cancelar ou tentar novamente */}
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
                backgroundColor: 'var(--magenta)',
                borderColor: 'var(--magenta)',
                fontFamily: 'var(--font-principal)'
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
