import React from "react";
import { Link } from "react-router-dom";
import { Home, UserRound, LogOut, Layers, Bolt, LayoutDashboard, Ticket, Calendar } from "lucide-react";
import "bootstrap/dist/css/bootstrap.min.css";

// Componente funcional Sidebar que recebe uma prop 'role' para definir o que mostrar
const Sidebar = ({ role }) => {

    // Define a cor de fundo da sidebar conforme o tipo de usuário (tech ou user)
  const sidebarBg = role === "tech" ? "var(--preto)" : "var(--cinza-azulado)";

  return (
    <div
      className="d-flex flex-column vh-100 p-4"
      style={{
        backgroundColor: sidebarBg,
        borderRight: "1px solid var(--magenta)",
      }}
    >
      {/* Logo da sidebar */}
      <div className="d-flex align-items-center mb-4">
        <Layers size={20} color="var(--magenta)" className="me-2" />
        <h3 className="text-white fw-bold m-0" style={{ fontFamily: "var(--font-principal)", fontSize: "1.2rem" }}>
  Tech Support
</h3>

      </div>


      {/* Links para usuários comuns */}
      {role === "user" && (
        <>
        {/* Link para Meus Chamados */}
          <Link to="/my-tickets" className="d-flex align-items-center p-2 mb-2 rounded sidebar-btn">
            <Ticket size={18} className="me-2" />
            Meus Chamados
          </Link>

        {/* Link para Meu Perfil */}
          <Link to="/profile" className="d-flex align-items-center p-2 mb-2 rounded sidebar-btn">
            <UserRound size={18} className="me-2" />
            Meu Perfil
          </Link>

        {/* Link para Configurações */}
          <Link to="/settings" className="d-flex align-items-center p-2 mb-2 rounded sidebar-btn">
            <Bolt size={18} className="me-2" />
            Configurações
          </Link>
        </>
      )}

      {/* Links para técnicos */}
      {role === "tech" && (
        <>
          {/* Link para Meus Chamados */}
          <Link to="/my-tickets" className="d-flex align-items-center p-2 mb-2 rounded sidebar-btn">
            <Ticket size={18} className="me-2" />
            Meus Chamados
          </Link>

          {/* Link para Agenda */}
          <Link to="/schedule" className="d-flex align-items-center p-2 mb-2 rounded sidebar-btn">
            <Calendar size={18} className="me-2" />
            Agenda
          </Link>

          {/* Link para Meu Perfil */}
          <Link to="/profile" className="d-flex align-items-center p-2 mb-2 rounded sidebar-btn">
            <UserRound size={18} className="me-2" />
            Meu Perfil
          </Link>

          {/* Link para Configurações */}
          <Link to="/settings" className="d-flex align-items-center p-2 mb-2 rounded sidebar-btn">
            <Bolt size={18} className="me-2" />
            Configurações
          </Link>
        </>
      )}

      {/* Link para Sair */}
      <Link to="/logout" className="d-flex align-items-center p-2 rounded mt-auto sidebar-btn">
        <LogOut size={18} className="me-2" />
        Sair
      </Link>
    </div>
  );
};

export default Sidebar;
