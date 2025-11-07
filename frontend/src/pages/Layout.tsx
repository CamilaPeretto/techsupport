// Hook tipado para acessar o estado do Redux (RootState)
import { useAppSelector } from "../hooks/useRedux";

// Componente de página simples que renderiza um placeholder do Dashboard
const Layout = () => {
  // Seleciona o usuário autenticado do slice `auth` do Redux
  const user = useAppSelector(s => s.auth.user);
  // Extrai o papel/role do usuário; valor padrão 'user' caso não exista
  const role = user?.role || "user";

  // JSX do componente — apenas layout estático com o role exibido
  return (
    <div className="text-white">
      {/* Título principal da página */}
      <h1>Dashboard</h1>
      {/* Descrição curta da área */}
      <p>Área de conteúdo principal do dashboard.</p>
      {/* Exibe o papel do usuário (user/tech/admin) */}
      <p>Role: {role}</p>
    </div>
  );
};

// Export padrão do componente
export default Layout;
