import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../store/store';
import api from '../services/api';

// DTO usado localmente para descrever apenas os campos relevantes do ticket
// (não é exportado; serve só para tipagem dentro desta página)
interface TicketDTO {
  _id: string;
  ticketNumber?: number;
  title: string;
  // status simplificado usado na UI (nomes em português)
  status: 'aberto' | 'em andamento' | 'concluído';
  priority?: 'baixa' | 'média' | 'alta';
  // técnico ao qual o ticket foi atribuído (pode ser null)
  assignedTo?: { _id: string; name: string; email: string } | null;
  // timestamps principais (strings ISO recebidas do backend)
  createdAt: string;
  assignedAt?: string | null;
  inProgressAt?: string | null;
  resolvedAt?: string | null;
  // histórico de status com possíveis metadados (opcional)
  statusHistory?: { 
    status: string; 
    changedAt: string; 
    changedBy?: string;
    assignedTechnicianName?: string;
  }[];
}

// Página de Agenda: exibe eventos (atribuição, início, conclusão) agrupados por dia
export default function Schedule() {
  // seleciona o usuário autenticado do store (usado para filtragem / tema)
  const user = useSelector((s: RootState) => s.auth.user);

  // estado local para tickets, loading, erro e data selecionada
  const [tickets, setTickets] = useState<TicketDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  
  // preparar mês atual e mês anterior (usados para renderizar dois calendários)
  const today = new Date();
  const currentMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);

  // Efeito que carrega os tickets do backend quando o usuário muda
  // se o usuário for técnico, a ideia é filtrar por assignedTo (back-end aceita query)
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true); // sinaliza carregamento
        setError(null);    // limpa erro anterior

        // rota: se houver id do usuário (técnico), filtra por assignedTo
        const assignedId = (user as unknown as { id?: string } | null)?.id;
        const url = assignedId ? `/api/tickets?assignedTo=${assignedId}` : `/api/tickets`;

        // chamada GET ao API client (padrão do projeto)
        const { data } = await api.get<TicketDTO[]>(url);
        setTickets(data); // popula estado com resultado
      } catch (e) {
        // trata erro de forma simples: extrai mensagem se disponível
        const err = e as { response?: { data?: { message?: string } } };
        console.error('❌ Erro ao carregar tickets:', err);
        setError(err?.response?.data?.message ?? 'Erro ao carregar agenda');
      } finally {
        setLoading(false); // fim do carregamento
      }
    };

    load();
  }, [user]); // reexecuta quando o usuário autenticado muda

  // Retorna as atividades (atribuição/início/conclusão/status history) para um dia
  const getActivitiesForDay = (date: Date) => {
    // array de atividades do dia (ticket + horário + ação)
    const activities: { ticket: TicketDTO; time: string; action: string }[] = [];

    // intervalo do dia: [dayStart, dayEnd)
    const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const dayEnd = new Date(dayStart);
    dayEnd.setDate(dayEnd.getDate() + 1);

    // segurança: se tickets não for array, retorna vazio
    if (!Array.isArray(tickets)) return activities;

    // percorre cada ticket e checa se alguma data relevante está dentro do dia
    tickets.forEach(ticket => {
      // assignedAt -> Atribuição
      if (ticket.assignedAt) {
        const assignedDate = new Date(ticket.assignedAt);
        if (assignedDate >= dayStart && assignedDate < dayEnd) {
          activities.push({
            ticket,
            time: assignedDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
            action: 'Atribuído'
          });
        }
      }

      // inProgressAt -> Início do trabalho
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

      // resolvedAt -> Conclusão/Resolução
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

      // statusHistory -> eventos customizados (ex.: mudança para 'esperando usuário')
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

    // ordena por horário (string no formato HH:mm) e retorna
    return activities.sort((a, b) => a.time.localeCompare(b.time));
  };

  // Verifica se um dia tem ao menos uma atividade (usa getActivitiesForDay)
  const hasActivities = (date: Date) => {
    return getActivitiesForDay(date).length > 0;
  };

  // Função que renderiza um calendário mensal (grade de dias)
  const renderCalendar = (monthDate: Date) => {
    const year = monthDate.getFullYear();
    const month = monthDate.getMonth();

    // primeiro e último dia do mês
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay(); // índice 0..6

    // nome do mês em pt-BR (ex: 'outubro 2025')
    const monthName = monthDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

    // montar matriz semanas x dias (null para células vazias)
    const weeks: (Date | null)[][] = [];
    let currentWeek: (Date | null)[] = [];

    // Preencher dias vazios antes do primeiro dia do mês
    for (let i = 0; i < startingDayOfWeek; i++) {
      currentWeek.push(null);
    }

    // Preencher dias do mês
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      currentWeek.push(date);

      // quando completar uma semana, empilha e reinicia
      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    }

    // completar última semana com células vazias se necessário
    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) {
        currentWeek.push(null);
      }
      weeks.push(currentWeek);
    }

    // utilitários para destacar hoje e data selecionada
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

    // JSX do calendário: usa estilos inline para manter consistência com o restante
    return (
      <div style={{
        backgroundColor: user?.role === 'tech' ? 'var(--preto)' : 'var(--color-secondary-bluish-gray)',
        border: user?.role === 'tech' ? '1px solid var(--magenta)' : '1px solid var(--color-secondary-dark-gray)',
        borderRadius: '8px',
        boxShadow: user?.role === 'tech' ? '0 0 12px rgba(230, 39, 248, 0.4)' : 'var(--shadow-base)',
        padding: '1.5rem',
        flex: 1
      }}>
        {/* Cabeçalho com nome do mês */}
        <h5 className="text-white text-center text-capitalize mb-3">{monthName}</h5>
        
        {/* Grade de dias: cabeçalhos dos dias + células */}
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
                  // ao clicar em um dia válido, marca como selecionado
                  if (date) {
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
                  // efeito hover apenas quando não estiver selecionado
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

  // Atividades da data selecionada (vazia se nada selecionado)
  const selectedActivities = selectedDate ? getActivitiesForDay(selectedDate) : [];

  // Render principal da página
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', paddingBottom: '2rem' }}>
      {/* indicador simples de carregamento */}
      {loading && <div className="text-white">Carregando...</div>}
      {/* mostra erro se existir */}
      {error && <div className="alert alert-danger">{error}</div>}
      
      {!loading && !error && (
        <>
          {/* Dois calendários lado a lado: mês anterior e mês atual */}
          <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
            {renderCalendar(lastMonth)}
            {renderCalendar(currentMonth)}
          </div>

          {/* Card com atividades do dia selecionado (aparece apenas se uma data for escolhida) */}
          {selectedDate && (
            <div style={{
              backgroundColor: 'var(--preto)',
              border: '1px solid var(--magenta)',
              borderRadius: '8px',
              boxShadow: '0 0 12px rgba(230, 39, 248, 0.4)',
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
                // sem atividades no dia
                <div className="text-white-50 text-center py-4">
                  Nenhuma atividade neste dia
                </div>
              ) : (
                // lista de atividades em tabela compacta
                <div className="table-responsive">
                  <table 
                    className="table table-dark align-middle mb-0"
                    style={{
                      backgroundColor: 'var(--preto)',
                      border: '1px solid var(--magenta)',
                      borderRadius: '8px',
                      overflow: 'hidden'
                    }}
                  >
                    <thead style={{ borderBottom: '2px solid var(--magenta)' }}>
                      <tr>
                        <th style={{ color: 'var(--magenta)', fontWeight: 'bold' }}>Horário</th>
                        <th style={{ color: 'var(--magenta)', fontWeight: 'bold' }}>Ticket</th>
                        <th style={{ color: 'var(--magenta)', fontWeight: 'bold' }}>Título</th>
                        <th style={{ color: 'var(--magenta)', fontWeight: 'bold' }}>Status</th>
                        <th style={{ color: 'var(--magenta)', fontWeight: 'bold' }}>Prioridade</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedActivities.map((activity, idx) => (
                        <tr 
                          key={`${activity.ticket._id}-${idx}`}
                          style={{
                            borderBottom: idx < selectedActivities.length - 1 ? '1px solid rgba(230, 39, 248, 0.2)' : 'none'
                          }}
                        >
                          {/* coluna horário + rótulo de ação */}
                          <td>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                              <span style={{ fontWeight: 'bold', color: 'var(--magenta)', fontSize: '1rem' }}>
                                {activity.time}
                              </span>
                              <span style={{
                                padding: '0.125rem 0.5rem',
                                borderRadius: '4px',
                                backgroundColor: 'rgba(230, 39, 248, 0.2)',
                                color: 'var(--magenta)',
                                fontSize: '0.75rem',
                                fontWeight: 'bold',
                                width: 'fit-content'
                              }}>
                                {activity.action}
                              </span>
                            </div>
                          </td>

                          {/* coluna ticket (número ou sufixo do id) */}
                          <td style={{ color: 'white', fontWeight: '500' }}>
                            #{activity.ticket.ticketNumber || activity.ticket._id.slice(-6)}
                          </td>

                          {/* título do ticket */}
                          <td style={{ color: 'white' }}>{activity.ticket.title}</td>

                          {/* badge de status com cores variando por estado */}
                          <td>
                            <span style={{
                              padding: '0.25rem 0.75rem',
                              borderRadius: '4px',
                              backgroundColor: 
                                activity.ticket.status === 'concluído' ? 'var(--status-success-bg)' :
                                activity.ticket.status === 'em andamento' ? 'var(--status-warning-bg)' :
                                'var(--status-muted-bg)',
                              color: 
                                activity.ticket.status === 'concluído' ? 'var(--status-success)' :
                                activity.ticket.status === 'em andamento' ? 'var(--status-warning)' :
                                'var(--status-muted)',
                              fontSize: '0.875rem',
                              fontWeight: '500',
                              textTransform: 'capitalize'
                            }}>
                              {activity.ticket.status}
                            </span>
                          </td>

                          {/* badge de prioridade (fallback para 'média' quando ausente) */}
                          <td>
                            <span style={{
                              padding: '0.25rem 0.5rem',
                              borderRadius: '4px',
                              backgroundColor: 
                                activity.ticket.priority === 'alta' ? 'var(--priority-high-bg)' :
                                activity.ticket.priority === 'média' ? 'var(--priority-medium-bg)' :
                                'var(--priority-low-bg)',
                              color: 
                                activity.ticket.priority === 'alta' ? 'var(--priority-high)' :
                                activity.ticket.priority === 'média' ? 'var(--priority-medium)' :
                                'var(--priority-low)',
                              fontSize: '0.875rem',
                              fontWeight: '500',
                              textTransform: 'capitalize'
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
