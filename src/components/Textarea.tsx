import React, { useState, useEffect, useRef } from 'react';

interface TextareaProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  maxLength?: number;
  minRows?: number;
  maxRows?: number;
  showCount?: boolean;
  autoFocus?: boolean;
}

const Textarea: React.FC<TextareaProps> = ({
  value,
  onChange,
  placeholder,
  disabled = false,
  className = '',
  maxLength,
  minRows = 3,
  maxRows = 10,
  showCount = false,
  autoFocus = false,
}) => {
  const [height, setHeight] = useState('auto');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = 'auto';
    const newHeight = Math.min(
      Math.max(textarea.scrollHeight, minRows * 24),
      maxRows * 24
    );
    textarea.style.height = `${newHeight}px`;
    setHeight(`${newHeight}px`);
  };

  useEffect(() => {
    adjustHeight();
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    if (maxLength && newValue.length > maxLength) return;
    onChange(newValue);
  };

  return (
    <div className="relative">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-blue-500 resize-none ${
          disabled ? 'opacity-50 cursor-not-allowed' : ''
        } ${className}`}
        style={{ height }}
        autoFocus={autoFocus}
      />
      {showCount && maxLength && (
        <div className="absolute bottom-2 right-2 text-sm text-white/50">
          {value.length}/{maxLength}
        </div>
      )}
    </div>
  );
};

export default Textarea; 