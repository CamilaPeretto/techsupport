import React from 'react';
import { Plus, Ticket as TicketIcon, Clock, CheckCircle } from 'lucide-react';
import Button from '../components/ui/Button';
import StatsCard from '../components/ui/StatsCard';
import TicketTable from '../components/tickets/TicketTable';

interface Ticket {
  id: string;
  title: string;
  status: 'open' | 'in-progress' | 'completed' | 'pending';
  priority: 'low' | 'medium' | 'high';
  assignedTechnician?: string;
  dueDate?: string;
  requestingEmployee?: string;
}

const Tickets: React.FC = () => {
  const mockTickets: Ticket[] = [
    { id: '12345', title: 'Network Connectivity Issue', status: 'open', priority: 'high', assignedTechnician: 'Alex Johnson' },
    { id: '12346', title: 'Software Installation Error', status: 'in-progress', priority: 'medium', assignedTechnician: 'Sarah Williams' },
    { id: '12347', title: 'Hardware Malfunction', status: 'completed', priority: 'high', assignedTechnician: 'David Lee' },
    { id: '12348', title: 'Email Configuration Problem', status: 'open', priority: 'low', assignedTechnician: 'Emily Chen' },
    { id: '12349', title: 'System Performance Degradation', status: 'in-progress', priority: 'medium', assignedTechnician: 'Michael Brown' },
    { id: '12350', title: 'Data Recovery Request', status: 'completed', priority: 'high', assignedTechnician: 'Jessica Davis' },
  ];

  const handleTicketClick = (ticket: Ticket) => {
    console.log('Ticket clicked:', ticket);
  };

  const handleNewTicket = () => {
    console.log('New ticket clicked');
  };

  const totalTickets = 120;
  const inProgressTickets = 45;
  const resolvedTickets = 75;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--color-primary-white)', fontFamily: 'var(--font-family-primary)', margin: 0 }}>Tickets</h1>
        <Button variant="primary" icon={<Plus size={18} />} onClick={handleNewTicket}>
          New Ticket
        </Button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
        <StatsCard title="Total Tickets" value={totalTickets} icon={<TicketIcon size={24} />} />
        <StatsCard title="In Progress" value={inProgressTickets} icon={<Clock size={24} />} />
        <StatsCard title="Resolved" value={resolvedTickets} icon={<CheckCircle size={24} />} />
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <TicketTable tickets={mockTickets} onTicketClick={handleTicketClick} />
      </div>
    </div>
  );
};

export default Tickets;
