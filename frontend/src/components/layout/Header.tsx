import { Plus } from "lucide-react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useAppSelector } from "../../hooks/useRedux";

interface HeaderProps {
  role?: "user" | "tech" | "admin";
  pageTitle?: string;
  currentPath?: string;
}

const Header = ({ role = "user", pageTitle = "Dashboard", currentPath = "" }: HeaderProps) => {
  const headerBg = role === "tech" ? "var(--preto)" : "var(--cinza-azulado)";
  const user = useAppSelector(s => s.auth.user);
  
  // Define se deve mostrar o botão "Novo Chamado"
  const showNewTicketButton = (role === "user" && currentPath === "/my-tickets") || 
                               (role === "tech" && currentPath === "/tickets");

  const handleNewTicket = () => {
    // Dispatch um evento customizado para a página capturar
    window.dispatchEvent(new CustomEvent('openNewTicketModal'));
  };

  return (
    <header
      className="d-flex align-items-center justify-content-between"
      style={{
        backgroundColor: headerBg,
        borderBottom: "1px solid var(--magenta)",
        height: "70px",
        padding: "0 2rem",
        gap: "1.5rem"
      }}
    >
      {/* Título da página */}
      <h4
        className="m-0"
        style={{
          color: "var(--branco)",
          fontFamily: "var(--font-principal)",
          fontWeight: "bold",
          fontSize: "1.5rem",
        }}
      >
        {pageTitle}
      </h4>

      {/* Botão Novo Chamado para usuários ou Olá para técnicos */}
      {role === "tech" ? (
        <span
          style={{
            color: "var(--branco)",
            fontFamily: "var(--font-secundaria)",
            fontSize: "1rem",
            fontWeight: 500,
          }}
        >
          Olá, {user?.name || "Técnico"}
        </span>
      ) : showNewTicketButton ? (
        <button
          onClick={handleNewTicket}
          className="d-flex align-items-center justify-content-center"
          style={{
            backgroundColor: "var(--magenta)",
            color: "var(--branco)",
            border: "none",
            borderRadius: "8px",
            padding: "10px 20px",
            fontFamily: "var(--font-secundaria)",
            fontWeight: 500,
            fontSize: "14px",
            cursor: "pointer",
            transition: "all 0.2s ease-in-out",
            boxShadow: "0 2px 8px rgba(230, 39, 248, 0.3)",
          }}
          onMouseOver={(e) =>
            (e.currentTarget.style.backgroundColor = "var(--cinza-azulado)")
          }
          onMouseOut={(e) =>
            (e.currentTarget.style.backgroundColor = "var(--magenta)")
          }
        >
          <Plus size={18} className="me-2" />
          Novo Chamado
        </button>
      ) : null}
    </header>
  );
};

export default Header;

