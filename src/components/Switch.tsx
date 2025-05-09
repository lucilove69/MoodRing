import React from 'react';

type SwitchSize = 'small' | 'medium' | 'large';

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  size?: SwitchSize;
  disabled?: boolean;
  label?: string;
  className?: string;
}

const Switch: React.FC<SwitchProps> = ({
  checked,
  onChange,
  size = 'medium',
  disabled = false,
  label,
  className = '',
}) => {
  const sizeClasses = {
    small: 'w-8 h-4',
    medium: 'w-12 h-6',
    large: 'w-16 h-8',
  };

  const dotSizeClasses = {
    small: 'w-3 h-3',
    medium: 'w-5 h-5',
    large: 'w-7 h-7',
  };

  const dotPositionClasses = {
    small: checked ? 'translate-x-4' : 'translate-x-0.5',
    medium: checked ? 'translate-x-6' : 'translate-x-0.5',
    large: checked ? 'translate-x-8' : 'translate-x-0.5',
  };

  return (
    <label
      className={`inline-flex items-center cursor-pointer ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      } ${className}`}
    >
      <div
        className={`relative ${sizeClasses[size]} rounded-full transition-colors duration-200 ${
          checked ? 'bg-blue-500' : 'bg-white/10'
        }`}
      >
        <input
          type="checkbox"
          className="sr-only"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
        />
        <div
          className={`absolute top-1/2 -translate-y-1/2 ${dotSizeClasses[size]} rounded-full bg-white shadow transform transition-transform duration-200 ${dotPositionClasses[size]}`}
        />
      </div>
      {label && (
        <span className="ml-2 text-sm text-white">{label}</span>
      )}
    </label>
  );
};

export default Switch; 