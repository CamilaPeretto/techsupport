// Componente do formulário de login principal (comentado em português)
import { useState, FormEvent } from 'react';
import { Container, Form, Button, Toast, ToastContainer } from 'react-bootstrap';
import { clearError, loginFailure } from '../../store/authSlice';
import { login } from '../../store/authThunks';
import logo from '../../assets/logo.png';
import CreateAccountModal from './CreateAccountModal';
import ForgotPasswordModal from './ForgotPasswordModal';
import LoginErrorModal from './LoginErrorModal';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
// Observação: a chamada HTTP direta foi movida para thunks; este componente usa dispatch(login(...))
import { useNavigate, useLocation } from 'react-router-dom';

const LoginForm = () => {
  // Estados locais para controlar os campos do formulário
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Estados para controlar os modais (criar conta, esqueceu senha, erro de login)
  const [showCreateAccount, setShowCreateAccount] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showLoginError, setShowLoginError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  // Estado para controlar toast de sucesso
  const [showToast, setShowToast] = useState(false);

  // Hooks do Redux / navegação
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();

  // Função que valida e processa o login
  // Aceita um FormEvent do formulário principal ou do modal de erro (que injeta currentTarget)
  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();

    // Extrai email e senha - pode vir do form principal (estados locais) ou do modal (currentTarget)
    let currentEmail = email;
    let currentPassword = password;
    
    // Se o evento vier do modal de erro, ele coloca os inputs em currentTarget
    const target = e.currentTarget as { email?: { value: string }; password?: { value: string } };
    if (target?.email && target?.password) {
      currentEmail = target.email.value;
      currentPassword = target.password.value;
      // Atualiza os estados locais com os valores vindos do modal
      setEmail(currentEmail);
      setPassword(currentPassword);
    }

    // Validações locais antes de chamar o thunk
    if (!currentEmail || !currentPassword) {
      setErrorMessage('Por favor, preencha todos os campos.');
      setShowLoginError(true);
      dispatch(loginFailure('Campos vazios'));
      return;
    }

    if (!currentEmail.includes('@')) {
      setErrorMessage('Email inválido. Por favor, insira um email válido.');
      setShowLoginError(true);
      dispatch(loginFailure('Email inválido'));
      return;
    }

    if (currentPassword.length < 6) {
      setErrorMessage('Senha incorreta. Por favor, tente novamente.');
      setShowLoginError(true);
      dispatch(loginFailure('Senha incorreta'));
      return;
    }

    try {
      // Dispatch do thunk de login (ele faz a chamada API, armazena token e atualiza o estado global)
      const result = await dispatch(login({ email: currentEmail, password: currentPassword })) as unknown;
      const user = (result as { role?: string } | undefined) || undefined;
      // Exibe um breve toast de sucesso antes de navegar
      setShowToast(true);
      const defaultPath = user?.role === 'tech' ? '/tickets' : '/my-tickets';
      const from = (location.state as { from?: { pathname?: string } } | null | undefined)?.from?.pathname || defaultPath;
      // Pequeno delay para o toast ficar visível antes da navegação
      setTimeout(() => navigate(from, { replace: true }), 300);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Falha no login';
      setErrorMessage(message);
      setShowLoginError(true);
      // Nota: o thunk já dispara loginFailure quando necessário
    }
  };

  return (
    <>
      {/* Container principal com fundo escuro */}
      <Container 
        fluid 
        className="min-vh-100 d-flex align-items-center justify-content-center"
        style={{
          background: 'var(--preto)',
        }}
      >
        <div style={{ width: '100%', maxWidth: '400px' }}>
          {/* Logo com efeito visual */}
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

          {/* Formulário de Login (dispara handleLogin) */}
          <Form onSubmit={handleLogin}>
            {/* Campo de Email */}
            <Form.Group className="mb-3">
              <Form.Label className="text-white" style={{ fontFamily: 'var(--font-secundaria)' }}>Email</Form.Label>
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

            {/* Campo de Senha */}
            <Form.Group className="mb-4">
              <Form.Label className="text-white" style={{ fontFamily: 'var(--font-secundaria)' }}>Senha</Form.Label>
              <Form.Control
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

            {/* Botão de Entrar */}
            <Button 
              type="submit" 
              className="w-100 fw-bold mb-3"
              size="lg"
              disabled={loading}
              style={{
                backgroundColor: 'var(--magenta)',
                borderColor: 'var(--magenta)',
                fontFamily: 'var(--font-secundaria)'
              }}
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>

            {/* Link para abrir modal de recuperação de senha */}
            <div className="text-center mb-3">
              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="btn btn-link text-decoration-none"
                style={{ color: 'var(--azul-acinzentado)', fontFamily: 'var(--font-secundaria)' }}
              >
                Esqueceu a senha?
              </button>
            </div>
          </Form>

          {/* Linha Divisória */}
          <hr className="divider-line" />

          {/* Link para abrir modal de criar conta */}
          <div className="text-center mb-4">
            <button
              onClick={() => setShowCreateAccount(true)}
              className="btn btn-link text-decoration-none"
              style={{ color: 'var(--azul-acinzentado)', fontFamily: 'var(--font-secundaria)' }}
            >
              Criar conta
            </button>
          </div>

          {/* Copyright */}
          <div className="text-center" style={{ color: 'var(--azul-acinzentado)', fontSize: '0.875rem', fontFamily: 'var(--font-secundaria)' }}>
            © 2025
          </div>
        </div>
      </Container>

      {/* Modais usados pela tela de login */}
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
