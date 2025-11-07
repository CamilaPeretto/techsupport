// Importa navegacao do react-router e componentes visuais do bootstrap
import { useNavigate } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { Home } from 'lucide-react';

// Página 404 - rota não encontrada
const NotFound = () => {
  // hook para navegar programaticamente
  const navigate = useNavigate();

  return (
    // Container centralizado que ocupa a altura total da viewport
    <Container 
      fluid 
      className="d-flex align-items-center justify-content-center min-vh-100 bg-dark text-white"
    >
      <div className="text-center">
        {/* Código grande 404 com estilo da marca */}
        <h1 className="display-1 fw-bold" style={{ color: 'var(--magenta)', fontFamily: 'var(--font-principal)' }}>404</h1>
        {/* Mensagem explicativa */}
        <p className="fs-3 mb-4" style={{ fontFamily: 'var(--font-secundaria)' }}>Página não encontrada</p>
        {/* Botão que leva de volta à home */}
        <button 
          onClick={() => navigate('/')} 
          className="btn btn-lg"
          style={{ 
            backgroundColor: 'var(--magenta)', 
            borderColor: 'var(--magenta)',
            color: 'var(--branco)',
            fontFamily: 'var(--font-secundaria)'
          }}
        >
          {/* Ícone e rótulo do botão */}
          <Home className="me-2" size={20} />
          Voltar para Home
        </button>
      </div>
    </Container>
  );
};

// Export padrão do componente NotFound
export default NotFound;
