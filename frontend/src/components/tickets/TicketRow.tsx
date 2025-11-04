import React from 'react';
import { TableRow, TableCell } from '../ui/Table';
import CustomBadge from '../ui/CustomBadge';

interface Ticket {
  id: string;
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
  const getStatusText = (status: string) => {
    switch (status) {
      case 'open':
        return 'Open';
      case 'pending':
        return 'Pending';
      case 'in-progress':
        return 'In Progress';
      case 'completed':
        return 'Completed';
      default:
        return status;
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'High';
      case 'medium':
        return 'Medium';
      case 'low':
        return 'Low';
      default:
        return priority;
    }
  };

  return (
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
          #{ticket.id}
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
        <CustomBadge type="status" value={ticket.status}>
          {getStatusText(ticket.status)}
        </CustomBadge>
      </TableCell>
      <TableCell>
        <span style={{ 
          color: 'var(--color-primary-white)',
          fontFamily: 'var(--font-family-secondary)'
        }}>
          {getPriorityText(ticket.priority)}
        </span>
      </TableCell>
      <TableCell>
        <span style={{ 
          color: 'var(--color-primary-white)',
          fontFamily: 'var(--font-family-secondary)'
        }}>
          {ticket.dueDate || ticket.assignedTechnician}
        </span>
      </TableCell>
      <TableCell>
        <span style={{ 
          color: 'var(--color-primary-white)',
          fontFamily: 'var(--font-family-secondary)'
        }}>
          {ticket.requestingEmployee || ticket.assignedTechnician}
        </span>
      </TableCell>
    </TableRow>
  );
};

export default TicketRow;
