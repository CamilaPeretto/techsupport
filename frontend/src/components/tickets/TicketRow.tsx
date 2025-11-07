// Linha da tabela representando um único chamado
// Comentários em português: explica props, mapeamentos e estrutura de render
import React from 'react';
import { TableRow, TableCell } from '../ui/Table';
import CustomBadge from '../ui/CustomBadge';

// Tipo simplificado de um ticket usado nesta tabela
interface Ticket {
  id: string;
  ticketNumber?: number;
  title: string;
  status: 'open' | 'in-progress' | 'completed' | 'pending';
  priority: 'low' | 'medium' | 'high';
  assignedTechnician?: string;
  dueDate?: string;
  requestingEmployee?: string;
}

interface TicketRowProps {
  ticket: Ticket;
  onClick?: (ticket: Ticket) => void;
}

const TicketRow: React.FC<TicketRowProps> = ({ ticket, onClick }) => {
  // Funções utilitárias que transformam valores internos em rótulos legíveis
  const getStatusText = (status: string) => {
    switch (status) {
      case 'open':
        return 'Aberto';
      case 'pending':
        return 'Pendente';
      case 'in-progress':
        return 'Em Andamento';
      case 'completed':
        return 'Concluído';
      default:
        return status;
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'Alta';
      case 'medium':
        return 'Média';
      case 'low':
        return 'Baixa';
      default:
        return priority;
    }
  };

  return (
    // TableRow é um componente da UI reutilizável (provavelmente estilizado)
    <TableRow 
      onClick={() => onClick?.(ticket)}
      hover={!!onClick}
    >
      <TableCell>
        <span style={{ 
          fontFamily: 'var(--font-family-primary)',
          color: 'var(--color-primary-magenta)',
          fontWeight: 500
        }}>
          {/* Exibe número amigável quando disponível, senão usa o final do id */}
          {ticket.ticketNumber !== undefined && ticket.ticketNumber !== null
            ? `#${ticket.ticketNumber}`
            : `#${ticket.id.slice(-6)}`}
        </span>
      </TableCell>
      <TableCell>
        <span style={{ 
          color: 'var(--color-primary-white)',
          fontFamily: 'var(--font-family-secondary)'
        }}>
          {ticket.title}
        </span>
      </TableCell>
      <TableCell>
        {/* Badge customizado para o status */}
        <CustomBadge type="status" value={ticket.status}>
          {getStatusText(ticket.status)}
        </CustomBadge>
      </TableCell>
      <TableCell>
        {/* Badge customizado para prioridade */}
        <CustomBadge type="priority" value={ticket.priority}>
          {getPriorityText(ticket.priority)}
        </CustomBadge>
      </TableCell>
      <TableCell>
        <span style={{ 
          color: 'var(--color-primary-white)',
          fontFamily: 'var(--font-family-secondary)'
        }}>
          {ticket.dueDate || '-'}
        </span>
      </TableCell>
      <TableCell>
        <span style={{ 
          color: 'var(--color-primary-white)',
          fontFamily: 'var(--font-family-secondary)'
        }}>
          {ticket.assignedTechnician || '-'}
        </span>
      </TableCell>
    </TableRow>
  );
};

export default TicketRow;
