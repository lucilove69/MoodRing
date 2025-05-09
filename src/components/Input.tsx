import React, { useState } from 'react';
import { Eye, EyeOff, X } from 'lucide-react';

interface InputProps {
  value: string;
  onChange: (value: string) => void;
  type?: 'text' | 'password' | 'email' | 'number' | 'tel' | 'url';
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  maxLength?: number;
  showCount?: boolean;
  clearable?: boolean;
  error?: string;
  label?: string;
  required?: boolean;
  autoFocus?: boolean;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
}

const Input: React.FC<InputProps> = ({
  value,
  onChange,
  type = 'text',
  placeholder,
  disabled = false,
  className = '',
  maxLength,
  showCount = false,
  clearable = false,
  error,
  label,
  required = false,
  autoFocus = false,
  prefix,
  suffix,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (maxLength && newValue.length > maxLength) return;
    onChange(newValue);
  };

  const handleClear = () => {
    onChange('');
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const inputType = type === 'password' && showPassword ? 'text' : type;

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block mb-1 text-sm text-white">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div
        className={`relative flex items-center ${
          error
            ? 'border-red-500'
            : isFocused
            ? 'border-blue-500'
            : 'border-white/10'
        } ${
          disabled
            ? 'bg-white/5 cursor-not-allowed'
            : 'bg-white/5 hover:bg-white/10'
        } border rounded-lg transition-colors duration-200`}
      >
        {prefix && (
          <div className="pl-3 text-white/50">{prefix}</div>
        )}
        <input
          type={inputType}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          maxLength={maxLength}
          required={required}
          autoFocus={autoFocus}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`w-full px-3 py-2 bg-transparent text-white placeholder-white/50 focus:outline-none ${
            disabled ? 'cursor-not-allowed' : ''
          } ${prefix ? 'pl-2' : ''} ${suffix || clearable || type === 'password' ? 'pr-10' : ''}`}
        />
        <div className="flex items-center pr-2">
          {type === 'password' && (
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="p-1 text-white/50 hover:text-white"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          )}
          {clearable && value && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 text-white/50 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          {suffix && (
            <div className="pl-2 text-white/50">{suffix}</div>
          )}
        </div>
      </div>
      {(error || showCount) && (
        <div className="flex justify-between mt-1">
          {error && (
            <span className="text-sm text-red-500">{error}</span>
          )}
          {showCount && maxLength && (
            <span className="text-sm text-white/50">
              {value.length}/{maxLength}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default Input; 