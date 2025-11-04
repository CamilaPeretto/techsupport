import React from 'react';
import { Table, TableHeader, TableBody, TableRow, TableCell } from '../ui/Table';
import TicketRow from './TicketRow';

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
  renderActions?: (ticket: Ticket) => React.ReactNode;
}

const TicketTable: React.FC<TicketTableProps> = ({ 
  tickets, 
  onTicketClick,
  className = '',
  renderActions,
}) => {
  return (
    <div className={className} style={{
      backgroundColor: "var(--color-secondary-bluish-gray)",
      borderRadius: "8px",
      boxShadow: "var(--shadow-base)",
      border: "1px solid var(--color-secondary-dark-gray)",
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
      height: "100%"
    }}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell header>ID</TableCell>
                <TableCell header>TITLE</TableCell>
                <TableCell header>STATUS</TableCell>
                <TableCell header>PRIORITY</TableCell>
                <TableCell header>DUE DATE</TableCell>
                <TableCell header>REQUESTING EMPLOYEE</TableCell>
                {renderActions && <TableCell header>ACTIONS</TableCell>}
              </TableRow>
            </TableHeader>
        <TableBody>
          {tickets.map((ticket) => (
            <TicketRow
              key={ticket.id}
              ticket={ticket}
              actions={renderActions?.(ticket)}
              onClick={onTicketClick}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TicketTable;
