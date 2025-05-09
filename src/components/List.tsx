import React from 'react';

type ListVariant = 'default' | 'bordered' | 'striped';
type ListSize = 'small' | 'medium' | 'large';

interface ListProps {
  children: React.ReactNode;
  variant?: ListVariant;
  size?: ListSize;
  className?: string;
}

interface ListItemProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  selected?: boolean;
  hoverable?: boolean;
}

const List: React.FC<ListProps> & {
  Item: React.FC<ListItemProps>;
} = ({ children, variant = 'default', size = 'medium', className = '' }) => {
  const variantClasses = {
    default: '',
    bordered: 'divide-y divide-white/10',
    striped: 'divide-y divide-white/10',
  };

  const sizeClasses = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg',
  };

  return (
    <div
      className={`${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      role="list"
    >
      {children}
    </div>
  );
};

const ListItem: React.FC<ListItemProps> = ({
  children,
  className = '',
  onClick,
  disabled = false,
  selected = false,
  hoverable = true,
}) => {
  return (
    <div
      className={`px-4 py-2 ${
        selected ? 'bg-blue-500/20' : ''
      } ${
        hoverable && !disabled
          ? 'hover:bg-white/10 cursor-pointer'
          : ''
      } ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      } ${className}`}
      onClick={disabled ? undefined : onClick}
      role="listitem"
    >
      {children}
    </div>
  );
};

List.Item = ListItem;

export default List; 