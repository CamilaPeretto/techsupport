// Layout principal da aplicação: sidebar + header + área de conteúdo
import { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

// Props do componente Layout
interface LayoutProps {
  children: ReactNode; // Conteúdo renderizado na área principal
  role: "user" | "tech" | "admin"; // Papel do usuário para ajustar UI
}

const Layout = ({ children, role }: LayoutProps) => {
  // Hook que fornece a rota atual (pathname)
  const location = useLocation();
  
  // Função utilitária que mapeia a rota atual para um título legível
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

  // Escolhe cor de fundo dependendo do role (técnicos têm visual escuro)
  const bgColor = role === "tech" ? "var(--preto)" : "var(--cinza-escuro)";

  return (
    // Container principal com sidebar e conteúdo
    <div className="d-flex vh-100" style={{ backgroundColor: bgColor }}>
      {/* Sidebar fixa (lado esquerdo) */}
      <div style={{ flex: "0 0 250px" }}>
        <Sidebar role={role} />
      </div>

      {/* Conteúdo principal que ocupa o restante da largura */}
      <div className="flex-grow-1 d-flex flex-column">
        {/* Header com título e ações */}
        <Header role={role} pageTitle={getPageTitle()} currentPath={location.pathname} />

        {/* Main: área onde o conteúdo filho (páginas) será renderizado */}
        <main className="flex-grow-1 overflow-auto" style={{ padding: '2rem', backgroundColor: role === 'tech' ? 'var(--preto)' : 'transparent' }}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
