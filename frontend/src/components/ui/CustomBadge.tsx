// Componente CustomBadge
// Comentários em português: componente pequeno que mapeia valores de 'status' ou 'priority'
// para estilos (background/text) via variáveis CSS do tema.
import React from 'react';

interface CustomBadgeProps {
  // conteúdo exibido dentro do badge (normalmente o rótulo legível)
  children: React.ReactNode;
  // tipo define o conjunto de cores a ser usado (status x prioridade)
  type: 'status' | 'priority';
  // valor que será mapeado para cores (ex: 'open', 'high')
  value: string;
  className?: string;
}

const CustomBadge: React.FC<CustomBadgeProps> = ({ 
  children, 
  type, 
  value,
  className = '' 
}) => {
  // Retorna um objeto de estilo inline baseado no tipo e no valor.
  // Usa variáveis CSS (themes) para manter consistência visual no app.
  const getBadgeStyle = (): React.CSSProperties => {
    // Mapa de cores para status (valores esperados em inglês para compatibilidade com TicketRow)
    const statusColors: Record<string, { bg: string; text: string }> = {
      'open': { bg: 'var(--status-open-bg)', text: 'var(--status-open)' },
      'pending': { bg: 'var(--status-open-bg)', text: 'var(--status-open)' },
      'in-progress': { bg: 'var(--status-in-progress-bg)', text: 'var(--status-in-progress)' },
      'completed': { bg: 'var(--status-completed-bg)', text: 'var(--status-completed)' }
    };

    // Mapa de cores para prioridade
    const priorityColors: Record<string, { bg: string; text: string }> = {
      'high': { bg: 'var(--priority-high-bg)', text: 'var(--priority-high)' },
      'medium': { bg: 'var(--priority-medium-bg)', text: 'var(--priority-medium)' },
      'low': { bg: 'var(--priority-low-bg)', text: 'var(--priority-low)' }
    };

    // Escolhe o mapa correto conforme o tipo
    const colorMap = type === 'status' ? statusColors : priorityColors;
    // Faz lookup com lowercase para ser robusto a casing
    const colors = colorMap[value.toLowerCase()] || { bg: 'var(--neutral-info-bg)', text: 'var(--neutral-info)' };

    // Estilos base do badge (inline para simplicidade e consistência)
    return {
      backgroundColor: colors.bg,
      color: colors.text,
      padding: '8px 16px',
      borderRadius: '16px',
      fontSize: '12px',
      fontWeight: 600,
      fontFamily: 'var(--font-secundaria)',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      minWidth: '80px',
      whiteSpace: 'nowrap',
      // borda sutil usando a cor de texto com transparência
      border: `1px solid ${colors.text}20`
    };
  };

  return (
    <span 
      style={getBadgeStyle()}
      className={className}
    >
      {children}
    </span>
  );
};

export default CustomBadge;
