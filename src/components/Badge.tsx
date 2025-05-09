import React from 'react';

type BadgeVariant = 'primary' | 'success' | 'warning' | 'error' | 'info';
type BadgeSize = 'small' | 'medium' | 'large';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  className?: string;
  dot?: boolean;
  outline?: boolean;
}

const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  className = '',
  dot = false,
  outline = false,
}) => {
  const variantClasses = {
    primary: outline
      ? 'border-blue-500 text-blue-500'
      : 'bg-blue-500 text-white',
    success: outline
      ? 'border-green-500 text-green-500'
      : 'bg-green-500 text-white',
    warning: outline
      ? 'border-yellow-500 text-yellow-500'
      : 'bg-yellow-500 text-white',
    error: outline
      ? 'border-red-500 text-red-500'
      : 'bg-red-500 text-white',
    info: outline
      ? 'border-gray-500 text-gray-500'
      : 'bg-gray-500 text-white',
  };

  const sizeClasses = {
    small: 'text-xs px-1.5 py-0.5',
    medium: 'text-sm px-2 py-1',
    large: 'text-base px-3 py-1.5',
  };

  const dotClasses = {
    primary: 'bg-blue-500',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    error: 'bg-red-500',
    info: 'bg-gray-500',
  };

  return (
    <div
      className={`inline-flex items-center rounded-full ${
        outline ? 'border' : ''
      } ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {dot && (
        <span
          className={`w-2 h-2 rounded-full mr-1.5 ${dotClasses[variant]}`}
        />
      )}
      {children}
    </div>
  );
};

export default Badge; 