import { Plus } from "lucide-react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useAppSelector } from "../../hooks/useRedux";

interface HeaderProps {
  role?: "user" | "tech" | "admin";
  pageTitle?: string;
  currentPath?: string;
}

// Componente Header reutilizável usado nas páginas do layout
const Header = ({ role = "user", pageTitle = "Dashboard", currentPath = "" }: HeaderProps) => {
  // Background muda dependendo do role (visual distinto para técnicos)
  const headerBg = role === "tech" ? "var(--preto)" : "var(--cinza-azulado)";
  // Seleciona usuário do store (para mostrar nome, caso necessário)
  const user = useAppSelector(s => s.auth.user);

  // Lógica que determina se o botão "Novo Chamado" deve aparecer
  // Usuários veem no /my-tickets, técnicos veem no /tickets
  const showNewTicketButton = (role === "user" && currentPath === "/my-tickets") ||
                             (role === "tech" && currentPath === "/tickets");

  // Lógica para exibir botão de criar novo técnico (somente técnicos na página de perfil)
  const showNewTechButton = role === "tech" && currentPath === "/profile";

  // Handler: dispara um evento customizado 'openNewTicketModal' que outras partes da app escutam
  const handleNewTicket = () => {
    window.dispatchEvent(new CustomEvent('openNewTicketModal'));
  };

  // Handler: dispara um evento customizado 'openNewTechModal' que outras partes da app escutam
  const handleNewTech = () => {
    window.dispatchEvent(new CustomEvent('openNewTechModal'));
  };

  // Render: título à esquerda, ações/contexto à direita
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
      {/* Título da página (coluna esquerda) */}
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

      {/* Coluna de ações (direita): 
          - Se for técnico, mostra botão "Novo Técnico" quando aplicável e um texto de saudação. 
          - Se não for técnico, pode mostrar o botão "Novo Chamado" quando aplicável. */}
      {role === "tech" ? (
        <div className="d-flex align-items-center gap-3">
          {/* Botão para cadastrar novo técnico (apenas em /profile) */}
          {showNewTechButton && (
            <button
              onClick={handleNewTech}
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
              Novo Técnico
            </button>
          )}

          {/* Saudação simples para técnicos (mostra o nome quando disponível) */}
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
        </div>
      ) : showNewTicketButton ? (
        /* Botão Novo Chamado para usuários/tecnicos conforme regras acima */
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

