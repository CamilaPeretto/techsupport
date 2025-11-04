import { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import type { RootState } from '../store/store';

interface FormState {
  name: string;
  email: string;
  password: string;
}

export default function Profile() {
  const user = useSelector((s: RootState) => s.auth.user);
  const [form, setForm] = useState<FormState>({ name: '', email: '', password: '' });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    // Se houver user com id, buscaria do backend; como o estado atual não carrega id/token, populamos do estado
    if (user) {
      setForm((f) => ({ ...f, name: user.name ?? '', email: user.email ?? '' }));
    }
  }, [user]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !(user as any).id) {
      setMessage('Faça login para editar seu perfil.');
      return;
    }
    try {
      setSaving(true);
      setMessage(null);
      const payload: Partial<FormState> = { name: form.name, email: form.email };
      if (form.password) payload.password = form.password;
      await axios.put(`/api/users/${(user as any).id}`, payload);
      setMessage('Perfil atualizado com sucesso.');
      setForm((f) => ({ ...f, password: '' }));
    } catch (err: any) {
      setMessage(err?.response?.data?.message ?? 'Erro ao atualizar perfil');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container py-4">
      <h1 className="mb-4">Editar Perfil</h1>
      <form onSubmit={onSubmit} className="row g-3" style={{ maxWidth: 560 }}>
        <div className="col-12">
          <label className="form-label" htmlFor="name">Nome</label>
          <input id="name" name="name" className="form-control" value={form.name} onChange={onChange} />
        </div>
        <div className="col-12">
          <label className="form-label" htmlFor="email">Email</label>
          <input id="email" name="email" type="email" className="form-control" value={form.email} onChange={onChange} />
        </div>
        <div className="col-12">
          <label className="form-label" htmlFor="password">Senha (opcional)</label>
          <input id="password" name="password" type="password" className="form-control" value={form.password} onChange={onChange} placeholder="Deixe em branco para manter" />
        </div>
        {message && <div className="col-12"><div className="alert alert-info">{message}</div></div>}
        <div className="col-12">
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </div>
      </form>
    </div>
  );
}
