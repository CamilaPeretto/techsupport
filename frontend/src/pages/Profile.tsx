import { useEffect, useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { useAppSelector } from '../hooks/useRedux';
import api from '../services/api';

interface FormState {
  name: string;
  email: string;
  department: string;
  position: string;
}

export default function Profile() {
  const user = useAppSelector((s) => s.auth.user);
  const [form, setForm] = useState<FormState>({ 
    name: '', 
    email: '', 
    department: '', 
    position: ''
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

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

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

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
      {/* Card do formulário */}
      <div style={{ 
        backgroundColor: 'var(--color-secondary-bluish-gray)',
        border: '1px solid var(--color-secondary-dark-gray)',
        borderRadius: '8px',
        padding: '2.5rem',
        boxShadow: 'var(--shadow-base)'
      }}>
        <Form onSubmit={onSubmit}>
          <div className="row g-3">
            <div className="col-12">
              <Form.Label>Nome</Form.Label>
              <Form.Control
                name="name"
                value={form.name}
                onChange={onChange}
                placeholder="Ex: João Silva"
                required
              />
            </div>

            <div className="col-12">
              <Form.Label>Email</Form.Label>
              <Form.Control
                name="email"
                type="email"
                value={form.email}
                onChange={onChange}
                placeholder="Ex: joao.silva@empresa.com"
                required
              />
            </div>

            <div className="col-12">
              <Form.Label>Cargo</Form.Label>
              <Form.Control
                name="position"
                value={form.position}
                onChange={onChange}
                placeholder="Ex: Analista de TI"
              />
            </div>

            <div className="col-12">
              <Form.Label>Departamento</Form.Label>
              <Form.Control
                name="department"
                value={form.department}
                onChange={onChange}
                placeholder="Ex: Tecnologia da Informação"
              />
            </div>

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
                variant="primary" 
                disabled={saving}
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
