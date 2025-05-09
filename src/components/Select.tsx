import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, X, Search } from 'lucide-react';

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps {
  options: SelectOption[];
  value: string | string[];
  onChange: (value: string | string[]) => void;
  placeholder?: string;
  searchable?: boolean;
  multiple?: boolean;
  disabled?: boolean;
  className?: string;
  maxHeight?: number;
}

const Select: React.FC<SelectProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  searchable = false,
  multiple = false,
  disabled = false,
  className = '',
  maxHeight = 300,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const selectRef = useRef<HTMLDivElement>(null);

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedOptions = Array.isArray(value)
    ? options.filter((option) => value.includes(option.value))
    : options.filter((option) => option.value === value);

  const handleSelect = (option: SelectOption) => {
    if (option.disabled) return;

    if (multiple) {
      const newValue = Array.isArray(value)
        ? value.includes(option.value)
          ? value.filter((v) => v !== option.value)
          : [...value, option.value]
        : [option.value];
      onChange(newValue);
    } else {
      onChange(option.value);
      setIsOpen(false);
    }
  };

  const handleRemove = (optionValue: string) => {
    if (multiple && Array.isArray(value)) {
      onChange(value.filter((v) => v !== optionValue));
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div
      ref={selectRef}
      className={`relative ${className}`}
    >
      <div
        className={`flex items-center justify-between p-2 border rounded-lg cursor-pointer ${
          disabled
            ? 'bg-white/5 cursor-not-allowed'
            : 'bg-white/5 hover:bg-white/10'
        } ${
          isOpen ? 'border-blue-500' : 'border-white/10'
        }`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <div className="flex flex-wrap gap-1 min-h-[24px]">
          {selectedOptions.length > 0 ? (
            multiple ? (
              selectedOptions.map((option) => (
                <div
                  key={option.value}
                  className="flex items-center gap-1 px-2 py-0.5 bg-blue-500/20 rounded text-sm"
                >
                  <span>{option.label}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemove(option.value);
                    }}
                    className="hover:text-red-400"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))
            ) : (
              <span>{selectedOptions[0].label}</span>
            )
          ) : (
            <span className="text-white/50">{placeholder}</span>
          )}
        </div>
        <ChevronDown
          className={`w-4 h-4 transition-transform ${
            isOpen ? 'transform rotate-180' : ''
          }`}
        />
      </div>

      {isOpen && (
        <div
          className="absolute z-50 w-full mt-1 bg-white/5 backdrop-blur-md border border-white/10 rounded-lg shadow-lg"
          style={{ maxHeight: `${maxHeight}px` }}
        >
          {searchable && (
            <div className="p-2 border-b border-white/10">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className="w-full pl-8 pr-2 py-1 bg-white/5 border border-white/10 rounded text-sm text-white placeholder-white/50 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          )}

          <div className="overflow-auto" style={{ maxHeight: `${maxHeight - (searchable ? 50 : 0)}px` }}>
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <div
                  key={option.value}
                  className={`px-4 py-2 cursor-pointer ${
                    option.disabled
                      ? 'opacity-50 cursor-not-allowed'
                      : 'hover:bg-white/10'
                  } ${
                    (multiple
                      ? (value as string[]).includes(option.value)
                      : value === option.value)
                      ? 'bg-blue-500/20'
                      : ''
                  }`}
                  onClick={() => handleSelect(option)}
                >
                  {option.label}
                </div>
              ))
            ) : (
              <div className="px-4 py-2 text-white/50">
                No options found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Select; 