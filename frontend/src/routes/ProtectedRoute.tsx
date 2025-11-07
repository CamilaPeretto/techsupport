import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../hooks/useRedux';
import Layout from '../components/layout/Layout';

// Props: o children a ser renderizado e um papel opcional requerido
type Props = { children: React.ReactElement; requireRole?: 'tech' | 'user' | 'admin' };

const ProtectedRoute: React.FC<Props> = ({ children, requireRole }) => {
  // Lê estado de autenticação do Redux
  const isAuthed = useAppSelector(s => s.auth.isAuthenticated);
  const user = useAppSelector(s => s.auth.user);
  // Também checamos token em localStorage como fallback (antes da inicialização do store)
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const location = useLocation();

  // Se não estiver autenticado e não existir token local, manda para login
  if (!isAuthed && !token) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // Deriva o papel do usuário com fallback 'user'
  const userRole = user?.role || 'user';

  // Se a rota requer role específico e o usuário não possui, redireciona para rota apropriada
  if (requireRole && userRole !== requireRole) {
    // Escolhe fallback baseado no papel do usuário
    const fallback = userRole === 'tech' ? '/tickets' : '/my-tickets';
    return <Navigate to={fallback} replace />;
  }

  // Se passou nas checagens, renderiza o layout compartilhado e os children
  return (
    <Layout role={userRole}>
      {children}
    </Layout>
  );
};

export default ProtectedRoute;
