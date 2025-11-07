// Roteamento da aplicação React
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
// Página principal (dashboard/layout) — renomeada para Layout/DashboardPage
import DashboardPage from "./pages/Layout";
// Observação: o CSS global do Bootstrap é importado apenas em main.tsx
// para evitar carregamento duplicado.
import Login from "./pages/Login";
import Tickets from "./pages/Tickets";
import MyTickets from "./pages/MyTickets";
import StatusUpdateModal from "./components/StatusUpdateModal";
import Profile from "./pages/Profile";
import Schedule from "./pages/Schedule";
import ProtectedRoute from "./routes/ProtectedRoute";
import RoleBasedRedirect from "./components/layout/RoleBasedRedirect";
import { useAppSelector } from "./hooks/useRedux";

// Placeholder inline para uma página de detalhe de ticket (substituir pelo real)
const TicketDetail = () => {
  return <div>Ticket detail page (placeholder)</div>;
};

function App() {
  // Seleciona usuário e estado de autenticação do Redux
  const user = useAppSelector(s => s.auth.user);
  const isAuthed = useAppSelector(s => s.auth.isAuthenticated);

  // Observação: a inicialização de auth (checar /api/me) é feita no main.tsx

  return (
    <Router>
      {/* Componente que cuida de redirecionamentos por role (sem renderizar UI) */}
      <RoleBasedRedirect />
      {/* Modal global para atualização de status (controlado via slice `status`) */}
      <StatusUpdateModal />
      <Routes>
        {/* Rota raiz: se autenticado redireciona para rota padrão do role, senão mostra Login */}
        <Route path="/" element={
          isAuthed && user?.role ? (
            <Navigate to={user.role === 'tech' ? '/tickets' : '/my-tickets'} replace />
          ) : (
            <Login />
          )
        } />

        {/* Rotas protegidas para técnicos */}
        <Route path="/tickets" element={<ProtectedRoute requireRole="tech"><Tickets /></ProtectedRoute>} />
        <Route path="/tickets/:id" element={<ProtectedRoute requireRole="tech"><TicketDetail /></ProtectedRoute>} />
        <Route path="/schedule" element={<ProtectedRoute requireRole="tech"><Schedule /></ProtectedRoute>} />

        {/* Rotas para usuários comuns */}
        <Route path="/my-tickets" element={<ProtectedRoute><MyTickets /></ProtectedRoute>} />

        {/* Outras rotas compartilhadas (dashboard, profile) */}
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

        {/* Rota fallback — redireciona para raiz */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
