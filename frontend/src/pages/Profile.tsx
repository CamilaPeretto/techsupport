import { useEffect, useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { useAppSelector } from '../hooks/useRedux';
import api from '../services/api';
import NewTechModal from '../components/admin/NewTechModal';

// Estado do formulário de edição de perfil
interface FormState {
  name: string;
  email: string;
  department: string;
  position: string;
}

// Página de perfil do usuário — permite visualizar e editar dados básicos
export default function Profile() {
  // Usuário atual do store
  const user = useAppSelector((s) => s.auth.user);
  // Estado local do formulário
  const [form, setForm] = useState<FormState>({ 
    name: '', 
    email: '', 
    department: '', 
    position: ''
  });
  // Flags de UI
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showNewTechModal, setShowNewTechModal] = useState(false);

  // Quando o usuário está disponível, sincroniza valores iniciais no formulário
  useEffect(() => {
    if (user) {
      setForm((f) => ({ 
        ...f, 
        name: user.name ?? '', 
        email: user.email ?? '',
        department: user.department ?? '',
        position: user.position ?? ''
      }));
    }
  }, [user]);

  // Listener para abrir o modal de novo técnico disparado pelo Header
  useEffect(() => {
    const handleOpenNewTech = () => setShowNewTechModal(true);
    window.addEventListener('openNewTechModal', handleOpenNewTech);
    return () => window.removeEventListener('openNewTechModal', handleOpenNewTech);
  }, []);

  // Atualiza campos do formulário conforme input
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  // Envia alteração do perfil para o backend
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const userId = user?.id;
    if (!user || !userId) {
      setMessage({ type: 'error', text: 'Faça login para editar seu perfil.' });
      return;
    }
    try {
      setSaving(true);
      setMessage(null);
      const payload: Partial<FormState> = { 
        name: form.name, 
        email: form.email,
        department: form.department,
        position: form.position
      };
      // Chamada PUT para atualizar usuário
      await api.put(`/api/users/${userId}`, payload);
      setMessage({ type: 'success', text: 'Perfil atualizado com sucesso.' });
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      setMessage({ 
        type: 'error', 
        text: error?.response?.data?.message ?? 'Erro ao atualizar perfil' 
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      gap: '1.75rem',
      maxWidth: '800px',
      margin: '0 auto',
      width: '100%'
    }}>
      {/* Modal Novo Técnico (apenas visível quando showNewTechModal=true) */}
      <NewTechModal 
        show={showNewTechModal}
        onClose={() => setShowNewTechModal(false)}
        onSuccess={() => {
          // Feedback simples quando um técnico é criado com sucesso
          setMessage({ type: 'success', text: 'Técnico cadastrado com sucesso!' });
        }}
      />

      {/* Card contendo o formulário de edição do perfil */}
      <div style={{ 
        backgroundColor: user?.role === 'tech' ? 'var(--preto)' : 'var(--color-secondary-bluish-gray)',
        border: user?.role === 'tech' ? '1px solid var(--magenta)' : '1px solid var(--color-secondary-dark-gray)',
        borderRadius: '8px',
        padding: '2.5rem',
        boxShadow: user?.role === 'tech' ? '0 0 12px rgba(230, 39, 248, 0.4)' : 'var(--shadow-base)'
      }}>
        <Form onSubmit={onSubmit}>
          <div className="row g-3">
            <div className="col-12">
              <Form.Label style={{ color: user?.role === 'tech' ? 'var(--magenta)' : 'inherit', fontWeight: 'bold' }}>
                Nome
              </Form.Label>
              <Form.Control
                name="name"
                value={form.name}
                onChange={onChange}
                placeholder="Ex: João Silva"
                required
                style={user?.role === 'tech' ? {
                  backgroundColor: 'var(--preto)',
                  border: '1px solid var(--magenta)',
                  color: 'var(--branco)'
                } : {}}
              />
            </div>

            <div className="col-12">
              <Form.Label style={{ color: user?.role === 'tech' ? 'var(--magenta)' : 'inherit', fontWeight: 'bold' }}>
                Email
              </Form.Label>
              <Form.Control
                name="email"
                type="email"
                value={form.email}
                onChange={onChange}
                placeholder="Ex: joao.silva@empresa.com"
                required
                style={user?.role === 'tech' ? {
                  backgroundColor: 'var(--preto)',
                  border: '1px solid var(--magenta)',
                  color: 'var(--branco)'
                } : {}}
              />
            </div>

            <div className="col-12">
              <Form.Label style={{ color: user?.role === 'tech' ? 'var(--magenta)' : 'inherit', fontWeight: 'bold' }}>
                Cargo
              </Form.Label>
              <Form.Control
                name="position"
                value={form.position}
                onChange={onChange}
                placeholder="Ex: Analista de TI"
                style={user?.role === 'tech' ? {
                  backgroundColor: 'var(--preto)',
                  border: '1px solid var(--magenta)',
                  color: 'var(--branco)'
                } : {}}
              />
            </div>

            <div className="col-12">
              <Form.Label style={{ color: user?.role === 'tech' ? 'var(--magenta)' : 'inherit', fontWeight: 'bold' }}>
                Departamento
              </Form.Label>
              <Form.Control
                name="department"
                value={form.department}
                onChange={onChange}
                placeholder="Ex: Tecnologia da Informação"
                style={user?.role === 'tech' ? {
                  backgroundColor: 'var(--preto)',
                  border: '1px solid var(--magenta)',
                  color: 'var(--branco)'
                } : {}}
              />
            </div>

            {/* Exibe mensagens de erro/sucesso */}
            {message && (
              <div className="col-12">
                <Alert variant={message.type === 'success' ? 'success' : 'danger'}>
                  {message.text}
                </Alert>
              </div>
            )}

            <div className="col-12 d-flex justify-content-end gap-2">
              <Button 
                type="submit" 
                disabled={saving}
                style={user?.role === 'tech' ? {
                  backgroundColor: 'var(--magenta)',
                  border: 'none',
                  fontFamily: 'var(--font-secundaria)',
                  boxShadow: '0 2px 8px rgba(230, 39, 248, 0.3)'
                } : {}}
                onMouseOver={(e) => {
                  if (user?.role === 'tech') {
                    e.currentTarget.style.backgroundColor = 'var(--cinza-azulado)';
                  }
                }}
                onMouseOut={(e) => {
                  if (user?.role === 'tech') {
                    e.currentTarget.style.backgroundColor = 'var(--magenta)';
                  }
                }}
              >
                {saving ? 'Salvando...' : 'Salvar Alterações'}
              </Button>
            </div>
          </div>
        </Form>
      </div>
    </div>
  );
}
