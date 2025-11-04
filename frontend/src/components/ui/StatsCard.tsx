import React from 'react';

interface StatsCardProps {
  title: string;
  value: string | number;
  className?: string;
  icon?: React.ReactNode;
}

const StatsCard: React.FC<StatsCardProps> = ({ 
  title, 
  value, 
  className = '',
  icon 
}) => {
  return (
    <div className={className} style={{ 
      backgroundColor: "var(--color-secondary-bluish-gray)",
      border: "1px solid var(--color-secondary-dark-gray)",
      borderRadius: "8px",
      padding: "1.5rem",
      textAlign: "center",
      boxShadow: "var(--shadow-base)"
    }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        {icon && (
          <div style={{ 
            marginBottom: "0.75rem", 
            color: "var(--color-primary-magenta)" 
          }}>
            {icon}
          </div>
        )}
        <h3 style={{ 
          fontSize: "2rem", 
          fontWeight: "bold", 
          color: "var(--color-primary-white)", 
          fontFamily: "var(--font-family-primary)",
          margin: "0 0 0.5rem 0"
        }}>
          {value}
        </h3>
        <p style={{ 
          fontSize: "0.875rem", 
          color: "var(--color-secondary-grayish-blue)",
          margin: 0,
          fontFamily: "var(--font-family-secondary)"
        }}>
          {title}
        </p>
      </div>
    </div>
  );
};

export default StatsCard;
