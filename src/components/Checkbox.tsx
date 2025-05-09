import React from 'react';
import { Check } from 'lucide-react';

type CheckboxSize = 'small' | 'medium' | 'large';

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  size?: CheckboxSize;
  disabled?: boolean;
  label?: string;
  className?: string;
  indeterminate?: boolean;
}

const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  onChange,
  size = 'medium',
  disabled = false,
  label,
  className = '',
  indeterminate = false,
}) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-5 h-5',
    large: 'w-6 h-6',
  };

  const iconSizeClasses = {
    small: 'w-3 h-3',
    medium: 'w-4 h-4',
    large: 'w-5 h-5',
  };

  return (
    <label
      className={`inline-flex items-center cursor-pointer ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      } ${className}`}
    >
      <div className="relative">
        <input
          type="checkbox"
          className="sr-only"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          ref={(input) => {
            if (input) {
              input.indeterminate = indeterminate;
            }
          }}
        />
        <div
          className={`${sizeClasses[size]} border-2 rounded transition-colors duration-200 ${
            checked || indeterminate
              ? 'bg-blue-500 border-blue-500'
              : 'bg-transparent border-white/30'
          } ${
            disabled
              ? 'cursor-not-allowed'
              : 'hover:border-blue-500 cursor-pointer'
          }`}
        >
          {(checked || indeterminate) && (
            <div className="absolute inset-0 flex items-center justify-center text-white">
              {indeterminate ? (
                <div className="w-1/2 h-0.5 bg-white rounded" />
              ) : (
                <Check className={iconSizeClasses[size]} />
              )}
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

export default Checkbox; 