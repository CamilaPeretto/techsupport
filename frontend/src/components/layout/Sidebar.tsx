import { Link, useNavigate } from "react-router-dom";
import { UserRound, LogOut, Layers, Ticket, Calendar } from "lucide-react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useAppDispatch } from "../../hooks/useRedux";
import { logout } from "../../store/authThunks";
// Barra lateral (sidebar) com links dependentes do papel do usuário
interface SidebarProps {
  role: "user" | "tech" | "admin";
}

const Sidebar = ({ role }: SidebarProps) => {
  // Ajuste de cor de fundo dependendo se é técnico ou usuário comum
  const sidebarBg = role === "tech" ? "var(--preto)" : "var(--cinza-azulado)";
  // Hooks do Redux e do Router usados para ações e navegação
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // Quando o usuário clica em sair, chamamos o thunk de logout que limpa token/estado
  const handleLogout = async () => {
    // logout thunk faz remoção de token e limpa o estado de auth
    await dispatch(logout());
    // Redireciona para a rota pública (home/login)
    navigate('/');
  };

  return (
    // Container vertical ocupando toda a altura da viewport
    <div
      className="d-flex flex-column vh-100"
      style={{
        backgroundColor: sidebarBg,
        borderRight: "1px solid var(--magenta)",
        padding: "1.5rem",
        gap: "0.75rem"
      }}
    >
      {/* Logo e título da aplicação na sidebar */}
      <div className="d-flex align-items-center" style={{ marginBottom: "1.5rem" }}>
        <Layers size={20} color={"var(--magenta)"} className="me-2" />
        <h3 className="text-white fw-bold m-0" style={{ fontFamily: "var(--font-principal)", fontSize: "1.2rem" }}>
          Tech Support
        </h3>
      </div>

      {/* Links visíveis apenas para usuários comuns (role === 'user') */}
      {role === "user" && (
        <>
          {/* Link para a lista de chamados do usuário */}
          <Link to="/my-tickets" className="d-flex align-items-center p-2 rounded sidebar-btn">
            <Ticket size={18} className="me-2" />
            Meus Chamados
          </Link>

          {/* Link para o perfil do usuário */}
          <Link to="/profile" className="d-flex align-items-center p-2 rounded sidebar-btn">
            <UserRound size={18} className="me-2" />
            Meu Perfil
          </Link>
        </>
      )}

      {/* Links visíveis apenas para técnicos (role === 'tech')
          Observação: o conteúdo foi resumido no arquivo fonte fornecido; aqui
          mantemos a condicional e preservamos os trechos omitidos. */}
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

      {/* Botão de logout posicionado no final da sidebar */}
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
