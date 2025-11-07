import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../../hooks/useRedux';

/**
 * Componente que redireciona o usuário para a rota padrão do seu role
 * quando há mudança de autenticação (login/logout/troca de conta)
 */
export default function RoleBasedRedirect() {
  // Seleciona usuário e flag de autenticação do store
  const user = useAppSelector(s => s.auth.user);
  const isAuthed = useAppSelector(s => s.auth.isAuthenticated);
  // hooks do react-router para navegação e localização atual
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Só age quando o usuário está autenticado e tem um papel atribuído
    if (!isAuthed || !user?.role) return;

    const currentPath = location.pathname;
    
    // Se o usuário é técnico (tech) mas está na rota de usuário, força redirecionamento
    if (user.role === 'tech' && currentPath === '/my-tickets') {
      navigate('/tickets', { replace: true });
      return;
    }
    
    // Se o usuário é comum (user) mas está em rotas destinadas a técnicos, redireciona
    if (user.role === 'user' && (currentPath === '/tickets' || currentPath === '/schedule')) {
      navigate('/my-tickets', { replace: true });
      return;
    }

    // Se o usuário acabou de entrar na raiz, envia para a rota padrão do seu papel
    if (currentPath === '/') {
      const defaultPath = user.role === 'tech' ? '/tickets' : '/my-tickets';
      navigate(defaultPath, { replace: true });
    }
  }, [user?.role, isAuthed, location.pathname, navigate]);

  // Não renderiza nada — este componente apenas observa a mudança de auth/role
  return null;
}
