import React from 'react';

type RadioSize = 'small' | 'medium' | 'large';

interface RadioProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  size?: RadioSize;
  disabled?: boolean;
  label?: string;
  className?: string;
  name?: string;
  value: string;
}

const Radio: React.FC<RadioProps> = ({
  checked,
  onChange,
  size = 'medium',
  disabled = false,
  label,
  className = '',
  name,
  value,
}) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-5 h-5',
    large: 'w-6 h-6',
  };

  const dotSizeClasses = {
    small: 'w-2 h-2',
    medium: 'w-2.5 h-2.5',
    large: 'w-3 h-3',
  };

  return (
    <label
      className={`inline-flex items-center cursor-pointer ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      } ${className}`}
    >
      <div className="relative">
        <input
          type="radio"
          className="sr-only"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          name={name}
          value={value}
        />
        <div
          className={`${sizeClasses[size]} border-2 rounded-full transition-colors duration-200 ${
            checked
              ? 'border-blue-500'
              : 'border-white/30'
          } ${
            disabled
              ? 'cursor-not-allowed'
              : 'hover:border-blue-500 cursor-pointer'
          }`}
        >
          {checked && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className={`${dotSizeClasses[size]} rounded-full bg-blue-500`}
              />
            </div>
          )}
        </div>
      </div>
      {label && (
        <span className="ml-2 text-sm text-white">{label}</span>
      )}
    </label>
  );
};

export default Radio; 