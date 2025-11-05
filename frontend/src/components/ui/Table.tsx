import React from 'react';

interface TableProps {
  children: React.ReactNode;
  className?: string;
}

interface TableHeaderProps {
  children: React.ReactNode;
  className?: string;
}

interface TableBodyProps {
  children: React.ReactNode;
  className?: string;
}

interface TableRowProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
}

interface TableCellProps {
  children: React.ReactNode;
  className?: string;
  header?: boolean;
}

const Table: React.FC<TableProps> = ({ children, className = '', ...props }) => {
  return (
    <div style={{ 
      overflow: "auto",
      height: "100%",
      width: "100%"
    }}>
      <table style={{ 
        width: "100%",
        borderCollapse: "collapse",
        tableLayout: "fixed"
      }} className={className} {...props}>
        {children}
      </table>
    </div>
  );
};

const TableHeader: React.FC<TableHeaderProps> = ({ children, className = '', ...props }) => {
  return (
    <thead className={className} style={{
      backgroundColor: "var(--magenta)",
      display: "table-header-group",
      position: "sticky",
      top: 0,
      zIndex: 10
    }} {...props}>
      {children}
    </thead>
  );
};

const TableBody: React.FC<TableBodyProps> = ({ children, className = '', ...props }) => {
  return (
    <tbody className={className} style={{
      display: "table-row-group",
      width: "100%"
    }} {...props}>
      {children}
    </tbody>
  );
};

const TableRow: React.FC<TableRowProps> = ({ 
  children, 
  className = '', 
  onClick,
  hover = true,
  ...props 
}) => {
  return (
    <tr 
      className={className}
      style={{
        cursor: onClick ? 'pointer' : 'default',
        transition: 'background-color 0.2s ease',
        display: "table-row",
        width: "100%"
      }}
      onClick={onClick}
      onMouseEnter={(e) => {
        if (hover) {
          (e.currentTarget as HTMLTableRowElement).style.backgroundColor = 'var(--color-secondary-dark-gray)';
        }
      }}
      onMouseLeave={(e) => {
        if (hover) {
          (e.currentTarget as HTMLTableRowElement).style.backgroundColor = 'transparent';
        }
      }}
      {...props}
    >
      {children}
    </tr>
  );
};

const TableCell: React.FC<TableCellProps> = ({ 
  children, 
  className = '', 
  header = false,
  ...props 
}) => {
  const Component = header ? 'th' : 'td';
  const baseStyles: React.CSSProperties = {
    padding: header ? '1rem 1.5rem' : '1rem 1.5rem',
    textAlign: 'left',
    fontSize: header ? '0.875rem' : '0.875rem',
    fontWeight: header ? 700 : 400,
    color: 'var(--color-primary-white)',
    fontFamily: header ? 'var(--font-family-primary)' : 'var(--font-family-secondary)',
    borderBottom: header ? 'none' : '1px solid #4A4A6A',
    textTransform: header ? 'uppercase' : 'none',
    letterSpacing: header ? '0.05em' : 'normal'
  };

  return (
    <Component 
      className={className} 
      style={baseStyles}
      {...props}
    >
      {children}
    </Component>
  );
};

export { Table, TableHeader, TableBody, TableRow, TableCell };
