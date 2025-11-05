import { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

interface DashboardLayoutProps {
  children: ReactNode;
  role: "user" | "tech" | "admin";
}

const DashboardLayout = ({ children, role }: DashboardLayoutProps) => {
  const location = useLocation();
  
  // Mapeia a rota para o título da página
  const getPageTitle = () => {
    switch (location.pathname) {
      case "/my-tickets":
        return "Meus Chamados";
      case "/tickets":
        return "Chamados";
      case "/profile":
        return "Meu Perfil";
      case "/schedule":
        return "Agenda";
      case "/dashboard":
        return "Dashboard";
      default:
        return "Dashboard";
    }
  };

  const bgColor = role === "tech" ? "var(--preto)" : "var(--cinza-escuro)";

  return (
    <div className="d-flex vh-100" style={{ backgroundColor: bgColor }}>
      {/* Sidebar fixa */}
      <div style={{ flex: "0 0 250px" }}>
        <Sidebar role={role} />
      </div>

      {/* Conteúdo principal */}
      <div className="flex-grow-1 d-flex flex-column">
        {/* Header */}
        <Header role={role} pageTitle={getPageTitle()} currentPath={location.pathname} />

        {/* Área principal */}
        <main className="flex-grow-1 overflow-auto" style={{ padding: '2rem', backgroundColor: role === 'tech' ? 'var(--preto)' : 'transparent' }}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
