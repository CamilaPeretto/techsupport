import React from "react";
import { Link } from "react-router-dom";
import { Home, UserRound, LogOut, Layers, Bolt, LayoutDashboard, Ticket, Calendar } from "lucide-react";
import "bootstrap/dist/css/bootstrap.min.css";

const Sidebar = ({ role }) => {
  return (
    <div
      className="d-flex flex-column vh-100 p-4"
      style={{
        backgroundColor: "var(--cinza-azulado)",
        borderRight: "1px solid var(--magenta)",
      }}
    >
      <div className="d-flex align-items-center mb-4">
        <Layers size={20} color="var(--magenta)" className="me-2" />
        <h3 className="text-white fw-bold m-0" style={{ fontFamily: "var(--font-principal)", fontSize: "1.2rem" }}>
  Tech Support
</h3>

      </div>

      {role === "user" && (
        <>
          <Link to="/dashboard" className="d-flex align-items-center p-2 mb-2 rounded sidebar-btn">
            <LayoutDashboard size={18} className="me-2" />
            Dashboard
          </Link>
          <Link to="/my-tickets" className="d-flex align-items-center p-2 mb-2 rounded sidebar-btn">
            <Ticket size={18} className="me-2" />
            Meus Chamados
          </Link>
          <Link to="/profile" className="d-flex align-items-center p-2 mb-2 rounded sidebar-btn">
            <UserRound size={18} className="me-2" />
            Meu Perfil
          </Link>
          <Link to="/settings" className="d-flex align-items-center p-2 mb-2 rounded sidebar-btn">
            <Bolt size={18} className="me-2" />
            Configurações
          </Link>
        </>
      )}

      {role === "tech" && (
        <>
          <Link to="/dashboard" className="d-flex align-items-center p-2 mb-2 rounded sidebar-btn">
            <LayoutDashboard size={18} className="me-2" />
            Dashboard
          </Link>
          <Link to="/my-tickets" className="d-flex align-items-center p-2 mb-2 rounded sidebar-btn">
            <Ticket size={18} className="me-2" />
            Meus Chamados
          </Link>
          <Link to="/schedule" className="d-flex align-items-center p-2 mb-2 rounded sidebar-btn">
            <Calendar size={18} className="me-2" />
            Agenda
          </Link>
          <Link to="/profile" className="d-flex align-items-center p-2 mb-2 rounded sidebar-btn">
            <UserRound size={18} className="me-2" />
            Meu Perfil
          </Link>
          <Link to="/settings" className="d-flex align-items-center p-2 mb-2 rounded sidebar-btn">
            <Bolt size={18} className="me-2" />
            Configurações
          </Link>
        </>
      )}

      <Link to="/logout" className="d-flex align-items-center p-2 rounded mt-auto sidebar-btn">
        <LogOut size={18} className="me-2" />
        Sair
      </Link>
    </div>
  );
};

export default Sidebar;
