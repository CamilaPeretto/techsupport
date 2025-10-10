import React from "react";
import { Plus } from "lucide-react";
import "bootstrap/dist/css/bootstrap.min.css";

const Header = ({ role = "user", currentPage = "Dashboard", userName = "Técnico" }) => {
  return (
    <header
      className="d-flex align-items-center justify-content-between px-3"
      style={{
        backgroundColor: "var(--cinza-azulado)",
        borderBottom: "1px solid var(--magenta)",
        height: "60px",
      }}
    >
      <h4 className="pt-2" style={{ color: "var(--branco)", fontFamily: "var(--font-principal)" }}>
        {currentPage}
      </h4>

      <div className="d-flex align-items-center">
        {role === "user" && (
          <button
            className="d-flex align-items-center justify-content-center"
            style={{
              backgroundColor: "var(--magenta)",
              color: "var(--branco)",
              border: "none",
              borderRadius: "var(--border-radius)",
              padding: "8px 12px",
              fontFamily: "var(--font-secundaria)",
              fontWeight: 500,
              fontSize: "14px",
              cursor: "pointer",
              transition: "all 0.2s ease-in-out",
              boxShadow: "var(--box-shadow)",
            }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "var(--cinza-azulado)")}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "var(--magenta)")}
          >
            <Plus size={18} className="me-2" />
            Novo Chamado
          </button>
        )}

        {role === "tech" && (
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
