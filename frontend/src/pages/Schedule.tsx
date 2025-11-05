import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../store/store';
import api from '../services/api';

interface TicketDTO {
  _id: string;
  ticketNumber?: number;
  title: string;
  status: 'aberto' | 'em andamento' | 'concluído';
  priority?: 'baixa' | 'média' | 'alta';
  assignedTo?: { _id: string; name: string; email: string } | null;
  createdAt: string;
  assignedAt?: string | null;
  inProgressAt?: string | null;
  resolvedAt?: string | null;
  statusHistory?: { 
    status: string; 
    changedAt: string; 
    changedBy?: string;
    assignedTechnicianName?: string;
  }[];
}

export default function Schedule() {
  const user = useSelector((s: RootState) => s.auth.user);
  const [tickets, setTickets] = useState<TicketDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  
  // Calendário mostra mês passado e mês atual
  const today = new Date();
  const currentMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const assignedId = (user as unknown as { id?: string } | null)?.id;
        const url = assignedId ? `/api/tickets?assignedTo=${assignedId}` : `/api/tickets`;
        const { data } = await api.get<TicketDTO[]>(url);
        console.log('✅ Tickets carregados:', data);
        setTickets(data);
      } catch (e) {
        const err = e as { response?: { data?: { message?: string } } };
        console.error('❌ Erro ao carregar tickets:', err);
        setError(err?.response?.data?.message ?? 'Erro ao carregar agenda');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  // Função para obter atividades de um dia específico
  const getActivitiesForDay = (date: Date) => {
    const activities: { ticket: TicketDTO; time: string; action: string }[] = [];
    const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const dayEnd = new Date(dayStart);
    dayEnd.setDate(dayEnd.getDate() + 1);

    // Validar se tickets é um array
    if (!Array.isArray(tickets)) return activities;

    console.log('Buscando atividades para:', dayStart.toLocaleDateString('pt-BR'));
    console.log('Total de tickets:', tickets.length);

    tickets.forEach(ticket => {
      console.log('Ticket:', ticket.ticketNumber, {
        assignedAt: ticket.assignedAt,
        inProgressAt: ticket.inProgressAt,
        resolvedAt: ticket.resolvedAt
      });

      // Verificar assignedAt
      if (ticket.assignedAt) {
        const assignedDate = new Date(ticket.assignedAt);
        console.log('assignedDate:', assignedDate, 'range:', dayStart, '-', dayEnd);
        if (assignedDate >= dayStart && assignedDate < dayEnd) {
          activities.push({
            ticket,
            time: assignedDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
            action: 'Atribuído'
          });
        }
      }

      // Verificar inProgressAt
      if (ticket.inProgressAt) {
        const inProgressDate = new Date(ticket.inProgressAt);
        if (inProgressDate >= dayStart && inProgressDate < dayEnd) {
          activities.push({
            ticket,
            time: inProgressDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
            action: 'Iniciado'
          });
        }
      }

      // Verificar resolvedAt
      if (ticket.resolvedAt) {
        const resolvedDate = new Date(ticket.resolvedAt);
        if (resolvedDate >= dayStart && resolvedDate < dayEnd) {
          activities.push({
            ticket,
            time: resolvedDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
            action: 'Concluído'
          });
        }
      }

      // Verificar statusHistory
      if (ticket.statusHistory) {
        ticket.statusHistory.forEach(history => {
          const historyDate = new Date(history.changedAt);
          if (historyDate >= dayStart && historyDate < dayEnd) {
            activities.push({
              ticket,
              time: historyDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
              action: `Status: ${history.status}`
            });
          }
        });
      }
    });

    // Ordenar por horário
    return activities.sort((a, b) => a.time.localeCompare(b.time));
  };

  // Função para verificar se um dia tem atividades
  const hasActivities = (date: Date) => {
    return getActivitiesForDay(date).length > 0;
  };

  // Renderizar um mês
  const renderCalendar = (monthDate: Date) => {
    const year = monthDate.getFullYear();
    const month = monthDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const monthName = monthDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

    const weeks: (Date | null)[][] = [];
    let currentWeek: (Date | null)[] = [];

    // Preencher dias vazios antes do primeiro dia
    for (let i = 0; i < startingDayOfWeek; i++) {
      currentWeek.push(null);
    }

    // Preencher dias do mês
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      currentWeek.push(date);

      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    }

    // Preencher dias vazios após o último dia
    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) {
        currentWeek.push(null);
      }
      weeks.push(currentWeek);
    }

    const isToday = (date: Date) => {
      return date.getDate() === today.getDate() &&
             date.getMonth() === today.getMonth() &&
             date.getFullYear() === today.getFullYear();
    };

    const isSelected = (date: Date) => {
      if (!selectedDate) return false;
      return date.getDate() === selectedDate.getDate() &&
             date.getMonth() === selectedDate.getMonth() &&
             date.getFullYear() === selectedDate.getFullYear();
    };

    return (
      <div style={{
        backgroundColor: user?.role === 'tech' ? 'var(--preto)' : 'var(--color-secondary-bluish-gray)',
        border: user?.role === 'tech' ? '1px solid var(--magenta)' : '1px solid var(--color-secondary-dark-gray)',
        borderRadius: '8px',
        boxShadow: user?.role === 'tech' ? '0 0 12px rgba(230, 39, 248, 0.4)' : 'var(--shadow-base)',
        padding: '1.5rem',
        flex: 1
      }}>
        <h5 className="text-white text-center text-capitalize mb-3">{monthName}</h5>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.5rem' }}>
          {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
            <div key={day} className="text-center text-white-50 fw-bold" style={{ fontSize: '0.875rem', padding: '0.5rem 0' }}>
              {day}
            </div>
          ))}
          
          {weeks.map((week, weekIdx) => (
            week.map((date, dayIdx) => (
              <div
                key={`${weekIdx}-${dayIdx}`}
                onClick={() => {
                  if (date) {
                    console.log('📅 Dia clicado:', date.toLocaleDateString('pt-BR'));
                    setSelectedDate(date);
                  }
                }}
                style={{
                  aspectRatio: '1',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '4px',
                  cursor: date ? 'pointer' : 'default',
                  backgroundColor: date && isSelected(date) 
                    ? 'var(--magenta)' 
                    : date && isToday(date)
                    ? 'rgba(230, 39, 248, 0.3)'
                    : date && hasActivities(date)
                    ? 'rgba(230, 39, 248, 0.1)'
                    : 'transparent',
                  color: date ? 'white' : 'transparent',
                  fontWeight: date && (isToday(date) || isSelected(date)) ? 'bold' : 'normal',
                  border: date && hasActivities(date) ? '1px solid var(--magenta)' : '1px solid transparent',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  if (date && !isSelected(date)) {
                    e.currentTarget.style.backgroundColor = 'rgba(230, 39, 248, 0.2)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (date && !isSelected(date)) {
                    e.currentTarget.style.backgroundColor = isToday(date)
                      ? 'rgba(230, 39, 248, 0.3)'
                      : hasActivities(date)
                      ? 'rgba(230, 39, 248, 0.1)'
                      : 'transparent';
                  }
                }}
              >
                {date ? date.getDate() : ''}
              </div>
            ))
          ))}
        </div>
      </div>
    );
  };

  const selectedActivities = selectedDate ? getActivitiesForDay(selectedDate) : [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', paddingBottom: '2rem' }}>
      {loading && <div className="text-white">Carregando...</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      
      {!loading && !error && (
        <>
          {/* Dois calendários lado a lado */}
          <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
            {renderCalendar(lastMonth)}
            {renderCalendar(currentMonth)}
          </div>

          {/* Card com atividades do dia selecionado */}
          {selectedDate && (
            <div style={{
              backgroundColor: user?.role === 'tech' ? 'var(--preto)' : 'var(--color-secondary-bluish-gray)',
              border: user?.role === 'tech' ? '1px solid var(--magenta)' : '1px solid var(--color-secondary-dark-gray)',
              borderRadius: '8px',
              boxShadow: user?.role === 'tech' ? '0 0 12px rgba(230, 39, 248, 0.4)' : 'var(--shadow-base)',
              padding: '1.5rem'
            }}>
              <h5 className="text-white mb-3">
                Compromissos para {selectedDate.toLocaleDateString('pt-BR', { 
                  day: '2-digit', 
                  month: 'long',
                  year: 'numeric'
                })}
              </h5>

              {selectedActivities.length === 0 ? (
                <div className="text-white-50 text-center py-4">
                  Nenhuma atividade neste dia
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-dark table-striped align-middle">
                    <thead>
                      <tr>
                        <th>Horário</th>
                        <th>Ticket</th>
                        <th>Título</th>
                        <th>Ação</th>
                        <th>Status</th>
                        <th>Prioridade</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedActivities.map((activity, idx) => (
                        <tr key={`${activity.ticket._id}-${idx}`}>
                          <td style={{ fontWeight: 'bold', color: 'var(--magenta)' }}>
                            {activity.time}
                          </td>
                          <td>
                            #{activity.ticket.ticketNumber || activity.ticket._id.slice(-6)}
                          </td>
                          <td>{activity.ticket.title}</td>
                          <td>
                            <span style={{
                              padding: '0.25rem 0.75rem',
                              borderRadius: '4px',
                              backgroundColor: 'rgba(230, 39, 248, 0.2)',
                              color: 'var(--magenta)',
                              fontSize: '0.875rem',
                              fontWeight: 'bold'
                            }}>
                              {activity.action}
                            </span>
                          </td>
                          <td className="text-capitalize">{activity.ticket.status}</td>
                          <td className="text-capitalize">
                            <span style={{
                              padding: '0.25rem 0.5rem',
                              borderRadius: '4px',
                              backgroundColor: 
                                activity.ticket.priority === 'alta' ? 'rgba(220, 53, 69, 0.2)' :
                                activity.ticket.priority === 'média' ? 'rgba(255, 193, 7, 0.2)' :
                                'rgba(25, 135, 84, 0.2)',
                              color: 
                                activity.ticket.priority === 'alta' ? '#dc3545' :
                                activity.ticket.priority === 'média' ? '#ffc107' :
                                '#198754',
                              fontSize: '0.875rem'
                            }}>
                              {activity.ticket.priority || 'média'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
