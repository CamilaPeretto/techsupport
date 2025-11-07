// Página de entrada (login)
// Observação: o formulário real está em `components/login/LoginForm`
import LoginForm from '../components/login/LoginForm';

// Componente simples que encapsula o formulário de login
const Login = () => {
  // Retorna o componente do formulário — toda a lógica de login está nele
  return <LoginForm />;
};

// Export padrão
export default Login;
