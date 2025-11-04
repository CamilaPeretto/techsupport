import { useNavigate } from 'react-router-dom';
import { Home } from 'lucide-react';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Container 
      fluid 
      className="d-flex align-items-center justify-content-center min-vh-100 bg-dark text-white"
    >
      <div className="text-center">
        <h1 className="display-1 fw-bold" style={{ color: '#E627F8' }}>404</h1>
        <p className="fs-3 mb-4">Página não encontrada</p>
        <button 
          onClick={() => navigate('/')} 
          className="btn btn-lg"
          style={{ 
            backgroundColor: '#E627F8', 
            borderColor: '#E627F8',
            color: 'white'
          }}
        >
          <Home className="me-2" size={20} />
          Voltar para Home
        </button>
      </div>
    </Container>
  );
};

export default NotFound;
