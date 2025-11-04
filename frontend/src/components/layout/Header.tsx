import { Plus } from "lucide-react";
import "bootstrap/dist/css/bootstrap.min.css";

interface HeaderProps {
  role?: "user" | "tech" | "admin";
  currentPage?: string;
  userName?: string;
}

const Header = ({ role = "user", currentPage = "Dashboard", userName = "Técnico" }: HeaderProps) => {
  const headerBg = role === "tech" ? "var(--preto)" : "var(--cinza-azulado)";

  return (
    <header
      className="d-flex align-items-center justify-content-between px-3"
      style={{
        backgroundColor: headerBg,
        borderBottom: "1px solid var(--magenta)",
        height: "60px",
      }}
    >
      {/* Título da página */}
      <h4
        className="pt-2 m-0"
        style={{
          color: "var(--branco)",
          fontFamily: "var(--font-principal)",
          fontWeight: "bold",
        }}
      >
        {currentPage}
      </h4>

      {/* Conteúdo da direita do header */}
      <div className="d-flex align-items-center">
        {role === "user" ? (
          <button
            className="d-flex align-items-center justify-content-center"
            style={{
              backgroundColor: "var(--magenta)",
              color: "var(--branco)",
              border: "none",
              borderRadius: "var(--border-radius)",
              padding: "8px 16px",
              fontFamily: "var(--font-secundaria)",
              fontWeight: 500,
              fontSize: "14px",
              cursor: "pointer",
              transition: "all 0.2s ease-in-out",
              boxShadow: "var(--box-shadow)",
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
        ) : (
          <span
            style={{
              color: "var(--branco)",
              fontFamily: "var(--font-secundaria)",
              fontWeight: 500,
            }}
          >
            Olá, {userName}
          </span>
        )}
      </div>
    </header>
  );
};

export default Header;
