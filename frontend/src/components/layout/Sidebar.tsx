import { Link, useNavigate } from "react-router-dom";
import { UserRound, LogOut, Layers, Ticket, Calendar } from "lucide-react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useAppDispatch } from "../../hooks/useRedux";
import { logout } from "../../store/authSlice";

interface SidebarProps {
  role: "user" | "tech" | "admin";
}

const Sidebar = ({ role }: SidebarProps) => {
  const sidebarBg = role === "tech" ? "var(--preto)" : "var(--cinza-azulado)";
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    dispatch(logout());
    navigate('/');
  };

  return (
    <div
      className="d-flex flex-column vh-100"
      style={{
        backgroundColor: sidebarBg,
        borderRight: "1px solid var(--magenta)",
        padding: "1.5rem",
        gap: "0.75rem"
      }}
    >
      {/* Logo da sidebar */}
      <div className="d-flex align-items-center" style={{ marginBottom: "1.5rem" }}>
        <Layers size={20} color="var(--magenta)" className="me-2" />
        <h3 className="text-white fw-bold m-0" style={{ fontFamily: "var(--font-principal)", fontSize: "1.2rem" }}>
          Tech Support
        </h3>
      </div>

      {/* Links para usuários comuns */}
      {role === "user" && (
        <>
          <Link to="/my-tickets" className="d-flex align-items-center p-2 rounded sidebar-btn">
            <Ticket size={18} className="me-2" />
            Meus Chamados
          </Link>

          <Link to="/profile" className="d-flex align-items-center p-2 rounded sidebar-btn">
            <UserRound size={18} className="me-2" />
            Meu Perfil
          </Link>
        </>
      )}

      {/* Links para técnicos */}
      {role === "tech" && (
        <>
          <Link to="/tickets" className="d-flex align-items-center p-2 rounded sidebar-btn">
            <Ticket size={18} className="me-2" />
            Chamados
          </Link>

          <Link to="/schedule" className="d-flex align-items-center p-2 rounded sidebar-btn">
            <Calendar size={18} className="me-2" />
            Agenda
          </Link>

          <Link to="/profile" className="d-flex align-items-center p-2 rounded sidebar-btn">
            <UserRound size={18} className="me-2" />
            Meu Perfil
          </Link>
        </>
      )}

      {/* Botão para Sair */}
      <button 
        onClick={handleLogout}
        className="d-flex align-items-center p-2 rounded mt-auto sidebar-btn w-100 border-0"
        style={{ backgroundColor: 'transparent' }}
      >
        <LogOut size={18} className="me-2" />
        Sair
      </button>
    </div>
  );
};

export default Sidebar;
