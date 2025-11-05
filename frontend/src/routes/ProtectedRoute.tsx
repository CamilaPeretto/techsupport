import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../hooks/useRedux';
import DashboardLayout from '../components/layout/DashboardLayout';

type Props = { children: React.ReactElement };

const ProtectedRoute: React.FC<Props> = ({ children }) => {
  const isAuthed = useAppSelector(s => s.auth.isAuthenticated);
  const user = useAppSelector(s => s.auth.user);
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const location = useLocation();

  if (!isAuthed && !token) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // Pega o role do usuário, com fallback para "user"
  const userRole = user?.role || "user";

  return (
    <DashboardLayout role={userRole}>
      {children}
    </DashboardLayout>
  );
};

export default ProtectedRoute;
