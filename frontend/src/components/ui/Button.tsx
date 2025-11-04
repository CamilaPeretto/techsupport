import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'base' | 'lg';
  className?: string;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'base',
  className = '',
  loading = false,
  icon,
  iconPosition = 'left',
  disabled,
  ...props 
}) => {
  const getVariantStyles = (): React.CSSProperties => {
    switch (variant) {
      case 'secondary':
        return {
          backgroundColor: 'var(--color-secondary-dark-gray)',
          color: 'var(--color-primary-white)',
          border: '1px solid var(--color-primary-magenta)'
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          border: '1px solid var(--color-primary-magenta)',
          color: 'var(--color-primary-magenta)'
        };
      case 'ghost':
        return {
          backgroundColor: 'transparent',
          color: 'var(--color-primary-magenta)'
        };
      default:
        return {
          background: 'var(--gradient-primary)',
          color: 'var(--color-primary-white)',
          border: 'none'
        };
    }
  };

  const getSizeStyles = (): string => {
    switch (size) {
      case 'sm':
        return 'px-3 py-2 text-sm';
      case 'lg':
        return 'px-6 py-3 text-lg';
      default:
        return 'px-4 py-2 text-base';
    }
  };

  const isDisabled = disabled || loading;

  return (
    <button
      className={`btn ${getSizeStyles()} ${className}`}
      style={{
        ...getVariantStyles(),
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        borderRadius: 'var(--border-radius-base)',
        fontFamily: 'var(--font-family-secondary)',
        fontWeight: 'var(--font-weight-medium)',
        cursor: isDisabled ? 'not-allowed' : 'pointer',
        transition: 'all 0.2s ease',
        opacity: isDisabled ? 0.6 : 1,
        minHeight: '44px',
        border: 'none'
      }}
      disabled={isDisabled}
      {...props}
    >
      {loading && (
        <div className="loading-spinner mr-2" />
      )}
      {!loading && icon && iconPosition === 'left' && (
        <span style={{ display: 'flex', alignItems: 'center' }}>{icon}</span>
      )}
      {children}
      {!loading && icon && iconPosition === 'right' && (
        <span style={{ display: 'flex', alignItems: 'center' }}>{icon}</span>
      )}
    </button>
  );
};

export default Button;
