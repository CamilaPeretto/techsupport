import React from 'react';
import { Plus, Ticket as TicketIcon, Clock, CheckCircle } from 'lucide-react';
import Button from '../components/ui/Button';
import StatsCard from '../components/ui/StatsCard';
import TicketTable from '../components/tickets/TicketTable';

interface Ticket {
  id: string;
  title: string;
  status: 'open' | 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  requestingEmployee?: string;
  assignedTechnician?: string;
}

const MyTickets: React.FC = () => {
  const mockTickets: Ticket[] = [
    { id: '12345', title: 'Network Connectivity Issue', status: 'pending', priority: 'high', dueDate: '2024-07-20', requestingEmployee: 'Ethan Harper' },
    { id: '12346', title: 'Software Installation Error', status: 'in-progress', priority: 'medium', dueDate: '2024-07-22', requestingEmployee: 'Olivia Bennett' },
    { id: '12347', title: 'Hardware Malfunction', status: 'completed', priority: 'high', dueDate: '2024-07-18', requestingEmployee: 'Noah Carter' },
  ];

  const handleTicketClick = (ticket: Ticket) => {
    console.log('Ticket clicked:', ticket);
  };

  const handleNewTicket = () => {
    console.log('New ticket clicked');
  };

  const averageResolutionTime = '2.5 days';
  const activeTickets = 3;
  const completedTickets = 15;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--color-primary-white)', fontFamily: 'var(--font-family-primary)', margin: 0 }}>My Tickets</h1>
        <Button variant="primary" icon={<Plus size={18} />} onClick={handleNewTicket}>
          New Ticket
        </Button>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <TicketTable tickets={mockTickets} onTicketClick={handleTicketClick} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
        <StatsCard title="Average Resolution Time" value={averageResolutionTime} icon={<Clock size={24} />} />
        <StatsCard title="Active Tickets" value={activeTickets} icon={<TicketIcon size={24} />} />
        <StatsCard title="Completed Tickets" value={completedTickets} icon={<CheckCircle size={24} />} />
      </div>
    </div>
  );
};

export default MyTickets;
