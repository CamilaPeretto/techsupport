import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import DashboardTest from "./pages/DashboardTest";
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from "./pages/login/Index";
import Tickets from "./pages/Tickets";
import MyTickets from "./pages/MyTickets";
import StatusUpdateModal from "./components/StatusUpdateModal";
import Profile from "./pages/Profile";
import Schedule from "./pages/Schedule";
import ProtectedRoute from "./routes/ProtectedRoute";
import { useAppDispatch } from "./hooks/useRedux";
import { loginSuccess } from "./store/authSlice";
import api from "./services/api";

// Inline placeholder for TicketDetail component (replace with the real ./pages/TicketDetail later)
const TicketDetail = () => {
  return <div>Ticket detail page (placeholder)</div>;
};

function App() {
  const dispatch = useAppDispatch();

  // Verifica se existe token ao carregar a aplicação
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Busca os dados do usuário usando o token
      api.get('/api/me')
        .then(({ data }) => {
          dispatch(loginSuccess({
            id: data.id,
            email: data.email,
            name: data.name,
            role: data.role,
            department: data.department,
            position: data.position
          }));
        })
        .catch(() => {
          // Token inválido, remove do localStorage
          localStorage.removeItem('token');
        });
    }
  }, [dispatch]);

  return (
    <Router>
      <StatusUpdateModal />
      <Routes>
        <Route path="/" element={<Login/>} />
        <Route path="/dashboard" element={<ProtectedRoute><DashboardTest /></ProtectedRoute>} />
        <Route path="/tickets" element={<ProtectedRoute><Tickets /></ProtectedRoute>} />
        <Route path="/tickets/:id" element={<ProtectedRoute><TicketDetail /></ProtectedRoute>} />
        <Route path="/my-tickets" element={<ProtectedRoute><MyTickets /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/schedule" element={<ProtectedRoute><Schedule /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
