import React from 'react';
import { Table, TableHeader, TableBody, TableRow, TableCell } from '../ui/Table';
import TicketRow from './TicketRow';
import { useAppSelector } from '../../hooks/useRedux';

interface Ticket {
  id: string;
  title: string;
  status: 'open' | 'in-progress' | 'completed' | 'pending';
  priority: 'low' | 'medium' | 'high';
  assignedTechnician?: string;
  dueDate?: string;
  requestingEmployee?: string;
}

interface TicketTableProps {
  tickets: Ticket[];
  onTicketClick?: (ticket: Ticket) => void;
  className?: string;
}

const TicketTable: React.FC<TicketTableProps> = ({ 
  tickets, 
  onTicketClick,
  className = '',
}) => {
  const user = useAppSelector(s => s.auth.user);
  const isTech = user?.role === 'tech';

  return (
    <div className={className} style={{
      backgroundColor: isTech ? "var(--preto)" : "var(--color-secondary-bluish-gray)",
      borderRadius: "8px",
      boxShadow: isTech ? "0 0 12px rgba(230, 39, 248, 0.4)" : "var(--shadow-base)",
      border: isTech ? "1px solid var(--magenta)" : "1px solid var(--color-secondary-dark-gray)",
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
      height: "100%"
    }}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell header>ID</TableCell>
                <TableCell header>TÍTULO</TableCell>
                <TableCell header>STATUS</TableCell>
                <TableCell header>PRIORIDADE</TableCell>
                <TableCell header>DATA</TableCell>
                <TableCell header>TÉCNICO</TableCell>
              </TableRow>
            </TableHeader>
        <TableBody>
          {tickets.map((ticket) => (
            <TicketRow
              key={ticket.id}
              ticket={ticket}
              onClick={onTicketClick}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TicketTable;
