import React, { useState } from 'react';
import { Emoticon, DEFAULT_EMOTICONS, ANIMATED_EMOTICONS, EMOTICON_CATEGORIES } from '../constants/emoticons';
import { renderEmoticon } from '../utils/emoticonParser';

interface EmoticonPickerProps {
  onSelect: (emoticon: Emoticon) => void;
  onClose: () => void;
}

const EmoticonPicker: React.FC<EmoticonPickerProps> = ({ onSelect, onClose }) => {
  const [selectedCategory, setSelectedCategory] = useState<keyof typeof EMOTICON_CATEGORIES>('basic');

  const getEmoticonsForCategory = () => {
    switch (selectedCategory) {
      case 'basic':
        return DEFAULT_EMOTICONS;
      case 'reaction':
        return ANIMATED_EMOTICONS;
      case 'custom':
        return []; // TODO: Implement custom emoticons
      default:
        return [];
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 max-h-[80vh] overflow-hidden flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-[#2C5F8A]">Emoticons</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="flex space-x-2 mb-4">
          {Object.entries(EMOTICON_CATEGORIES).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setSelectedCategory(key as keyof typeof EMOTICON_CATEGORIES)}
              className={`px-3 py-1 rounded-full text-sm ${
                selectedCategory === key
                  ? 'bg-[#7FB3D5] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-6 gap-2 overflow-y-auto flex-1">
          {getEmoticonsForCategory().map((emoticon) => (
            <button
              key={emoticon.id}
              onClick={() => {
                onSelect(emoticon);
                onClose();
              }}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              title={emoticon.name}
            >
              {renderEmoticon(emoticon)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmoticonPicker; 