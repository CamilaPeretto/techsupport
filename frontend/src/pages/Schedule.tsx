import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import type { RootState } from '../store/store';

interface TicketDTO {
  _id: string;
  title: string;
  status: 'aberto' | 'em andamento' | 'concluído';
  priority?: 'baixa' | 'média' | 'alta';
  assignedTo?: { _id: string; name: string; email: string } | null;
  createdAt: string;
}

export default function Schedule() {
  const user = useSelector((s: RootState) => s.auth.user);
  const [tickets, setTickets] = useState<TicketDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
  const assignedId = (user as unknown as { id?: string } | null)?.id;
        const url = assignedId ? `/api/tickets?assignedTo=${assignedId}` : `/api/tickets`;
        const { data } = await axios.get<TicketDTO[]>(url);
        setTickets(data);
      } catch (e) {
        const err = e as { response?: { data?: { message?: string } } };
        setError(err?.response?.data?.message ?? 'Erro ao carregar agenda');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  const mine = useMemo(() => {
    if (!user) return tickets;
  if (user?.id) return tickets; // já filtrado pelo backend quando id existe
  if (user?.name) return tickets.filter(t => t.assignedTo?.name === user.name);
    return tickets;
  }, [tickets, user]);

  return (
    <div className="container py-4">
      <h1 className="mb-4">Agenda Técnica</h1>
      {loading && <div>Carregando...</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      {!loading && !error && (
        <div className="table-responsive">
          <table className="table table-dark table-striped align-middle">
            <thead>
              <tr>
                <th>Título</th>
                <th>Status</th>
                <th>Prioridade</th>
                <th>Técnico</th>
                <th>Criado em</th>
              </tr>
            </thead>
            <tbody>
              {mine.map(t => (
                <tr key={t._id}>
                  <td>{t.title}</td>
                  <td className="text-capitalize">{t.status}</td>
                  <td className="text-capitalize">{t.priority ?? 'média'}</td>
                  <td>{t.assignedTo?.name ?? '-'}</td>
                  <td>{new Date(t.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
