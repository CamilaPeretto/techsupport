// Componente de tabela simples e reutilizável
// Comentários em português: este arquivo expõe componentes leves que
// encapsulam a marcação <table> e adicionam pequenas conveniências (sticky header,
// comportamento hover em linhas, células com estilo padrão).
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

// Container responsivo que envolve a tabela para permitir rolagem horizontal/vertical
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

// Cabeçalho com comportamento sticky (permanece visível ao rolar)
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

// Corpo da tabela (simples wrapper para manter API consistente)
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

// Linha da tabela com comportamento de hover opcional e clique
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
        // Aplica cor de fundo quando hover está habilitado
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

// Célula da tabela que pode ser th ou td conforme `header`.
// Define estilos base (padding, tipografia, borda inferior, uppercase para header).
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
      borderBottom: header ? 'none' : '1px solid var(--color-secondary-bluish-gray)',
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
