// Componente do formulário de login principal
import { useState, FormEvent } from 'react';
import { Container, Form, Button, Toast, ToastContainer } from 'react-bootstrap';
import { loginStart, loginSuccess, loginFailure, clearError } from '../../store/authSlice';
import logo from '../../assets/logo.png';
import CreateAccountModal from './CreateAccountModal';
import ForgotPasswordModal from './ForgotPasswordModal';
import LoginErrorModal from './LoginErrorModal';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import api from '../../services/api';
import { useNavigate, useLocation } from 'react-router-dom';

const LoginForm = () => {
  // Estados locais para controlar os campos do formulário
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Estados para controlar os modais
  const [showCreateAccount, setShowCreateAccount] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showLoginError, setShowLoginError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  // Estado para controlar toast de sucesso
  const [showToast, setShowToast] = useState(false);

  // Redux hooks
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();

  // Função que valida e processa o login
  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();

    dispatch(loginStart());

    // Validação 1: Verifica se os campos estão preenchidos
    if (!email || !password) {
      setErrorMessage('Por favor, preencha todos os campos.');
      setShowLoginError(true);
      dispatch(loginFailure('Campos vazios'));
      return;
    }

    // Validação 2: Verifica se o email é válido
    if (!email.includes('@')) {
      setErrorMessage('Email inválido. Por favor, insira um email válido.');
      setShowLoginError(true);
      dispatch(loginFailure('Email inválido'));
      return;
    }

    // Validação 3: Verifica se a senha tem pelo menos 6 caracteres
    if (password.length < 6) {
      setErrorMessage('Senha incorreta. Por favor, tente novamente.');
      setShowLoginError(true);
      dispatch(loginFailure('Senha incorreta'));
      return;
    }

    try {
      const { data } = await api.post('/api/login', { email, password });
      const { token, user } = data;
      if (token) {
        localStorage.setItem('token', token);
      }
      dispatch(loginSuccess({ id: user.id, email: user.email, name: user.name }));
      setShowToast(true);
  const from = (location.state as { from?: { pathname?: string } } | null | undefined)?.from?.pathname || '/tickets';
      // pequeno delay para o toast aparecer rapidamente
      setTimeout(() => navigate(from, { replace: true }), 300);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Falha no login';
      setErrorMessage(message);
      setShowLoginError(true);
      dispatch(loginFailure(message));
    }
  };

  return (
    <>
      {/* Container principal com fundo preto */}
      <Container 
        fluid 
        className="min-vh-100 d-flex align-items-center justify-content-center"
        style={{
          background: '#000000',
        }}
      >
        <div style={{ width: '100%', maxWidth: '400px' }}>
          {/* Logo com efeito de brilho */}
          <div className="text-center mb-4">
            <img 
              src={logo} 
              alt="Logo" 
              style={{
                width: '80px',
                height: '80px',
                filter: 'drop-shadow(0 0 20px rgba(230, 39, 248, 0.5))',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.filter = 'drop-shadow(0 0 30px rgba(230, 39, 248, 0.7))';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.filter = 'drop-shadow(0 0 20px rgba(230, 39, 248, 0.5))';
              }}
            />
          </div>

          {/* Formulário de Login */}
          <Form onSubmit={handleLogin}>
            {/* Campo de Email */}
            <Form.Group className="mb-3">
              <Form.Label className="text-white">Email</Form.Label>
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

            {/* Campo de Senha */}
            <Form.Group className="mb-4">
              <Form.Label className="text-white">Senha</Form.Label>
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

            {/* Botão de Entrar */}
            <Button 
              type="submit" 
              className="w-100 fw-bold mb-3"
              size="lg"
              disabled={loading}
              style={{
                backgroundColor: '#E627F8',
                borderColor: '#E627F8',
              }}
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>

            {/* Link Esqueceu a Senha */}
            <div className="text-center mb-3">
              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="btn btn-link text-decoration-none"
                style={{ color: '#6272A4' }}
              >
                Esqueceu a senha?
              </button>
            </div>
          </Form>

          {/* Linha Divisória com gradiente */}
          <hr className="divider-line" />

          {/* Link Criar Conta */}
          <div className="text-center mb-4">
            <button
              onClick={() => setShowCreateAccount(true)}
              className="btn btn-link text-decoration-none"
              style={{ color: '#6272A4' }}
            >
              Criar conta
            </button>
          </div>

          {/* Copyright */}
          <div className="text-center" style={{ color: '#6272A4', fontSize: '0.875rem' }}>
            © 2025
          </div>
        </div>
      </Container>

      {/* Modais */}
      <CreateAccountModal 
        show={showCreateAccount} 
        onHide={() => setShowCreateAccount(false)} 
      />
      
      <ForgotPasswordModal 
        show={showForgotPassword} 
        onHide={() => setShowForgotPassword(false)} 
      />
      
      <LoginErrorModal 
        show={showLoginError} 
        onHide={() => {
          setShowLoginError(false);
          dispatch(clearError());
        }}
        errorMessage={errorMessage}
        email={email}
        password={password}
        onRetry={handleLogin}
      />

      {/* Toast de Sucesso */}
      <ToastContainer position="top-end" className="p-3">
        <Toast 
          show={showToast} 
          onClose={() => setShowToast(false)} 
          delay={3000} 
          autohide
          bg="success"
        >
          <Toast.Header>
            <strong className="me-auto">Sucesso!</strong>
          </Toast.Header>
          <Toast.Body className="text-white">Login realizado com sucesso!</Toast.Body>
        </Toast>
      </ToastContainer>
    </>
  );
};

export default LoginForm;
