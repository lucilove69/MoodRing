import React, { useState, useRef } from 'react';
import { Emoticon } from '../constants/emoticons';
import { parseEmoticons, renderEmoticon } from '../utils/emoticonParser';
import EmoticonPicker from './EmoticonPicker';

interface EmoticonInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const EmoticonInput: React.FC<EmoticonInputProps> = ({
  value,
  onChange,
  placeholder = 'Type a message...',
  className = ''
}) => {
  const [showPicker, setShowPicker] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleEmoticonSelect = (emoticon: Emoticon) => {
    const textarea = inputRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newValue = value.substring(0, start) + emoticon.code + value.substring(end);
    
    onChange(newValue);
    
    // Set cursor position after the inserted emoticon
    setTimeout(() => {
      if (textarea) {
        textarea.selectionStart = textarea.selectionEnd = start + emoticon.code.length;
        textarea.focus();
      }
    }, 0);
  };

  const renderContent = () => {
    const parts = parseEmoticons(value);
    return parts.map((part, index) => 
      typeof part === 'string' 
        ? part 
        : renderEmoticon(part)
    );
  };

  return (
    <div className={`relative ${className}`}>
      <div className="flex items-center border border-[#7FB3D5] rounded-lg bg-white">
        <textarea
          ref={inputRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 p-3 min-h-[80px] resize-none focus:outline-none"
          style={{ whiteSpace: 'pre-wrap' }}
        />
        <button
          onClick={() => setShowPicker(true)}
          className="p-3 text-[#2C5F8A] hover:text-[#1A4B7A] transition-colors duration-200"
          title="Add emoticon"
        >
          😊
        </button>
      </div>

      {showPicker && (
        <EmoticonPicker
          onSelect={handleEmoticonSelect}
          onClose={() => setShowPicker(false)}
        />
      )}

      <div className="mt-2 text-sm text-gray-500">
        <p>Preview:</p>
        <div className="p-2 bg-gray-50 rounded">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default EmoticonInput; 