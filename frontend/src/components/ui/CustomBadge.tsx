import React from 'react';

interface CustomBadgeProps {
  children: React.ReactNode;
  type: 'status' | 'priority';
  value: string;
  className?: string;
}

const CustomBadge: React.FC<CustomBadgeProps> = ({ 
  children, 
  type, 
  value,
  className = '' 
}) => {
  const getBadgeStyle = (): React.CSSProperties => {
    const statusColors: Record<string, { bg: string; text: string }> = {
      'open': { bg: 'rgba(0, 123, 255, 0.2)', text: '#007BFF' },
      'pending': { bg: 'rgba(0, 123, 255, 0.2)', text: '#007BFF' },
      'in-progress': { bg: 'rgba(138, 43, 226, 0.2)', text: '#8A2BE2' },
      'completed': { bg: 'rgba(40, 167, 69, 0.2)', text: '#28A745' }
    };

    const priorityColors: Record<string, { bg: string; text: string }> = {
      'high': { bg: 'rgba(255, 0, 7, 0.2)', text: '#FF0007' },
      'medium': { bg: 'rgba(255, 132, 27, 0.2)', text: '#FF841B' },
      'low': { bg: 'rgba(255, 215, 0, 0.2)', text: '#FFD700' }
    };

    const colorMap = type === 'status' ? statusColors : priorityColors;
    const colors = colorMap[value.toLowerCase()] || { bg: 'rgba(98, 114, 164, 0.2)', text: '#6272A4' };

    return {
      backgroundColor: colors.bg,
      color: colors.text,
      padding: '8px 16px',
      borderRadius: '16px',
      fontSize: '12px',
      fontWeight: 600,
      fontFamily: 'Inter, sans-serif',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      minWidth: '80px',
      whiteSpace: 'nowrap',
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
