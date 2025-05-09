import React, { useState, useEffect } from 'react';

interface EmoticonTextProps {
  text: string;
  className?: string;
}

interface EmoticonData {
  name: string;
  data: string;
  mappings: string[];
}

const EmoticonText: React.FC<EmoticonTextProps> = ({ text, className = '' }) => {
  const [emoticons, setEmoticons] = useState<EmoticonData[]>([]);

  useEffect(() => {
    // Load saved emoticons from localStorage
    const savedEmoticons = localStorage.getItem('moodring_emoticons');
    if (savedEmoticons) {
      setEmoticons(JSON.parse(savedEmoticons));
    }
  }, []);

  // Create a map of all emoticon mappings
  const emoticonMap = emoticons.reduce((acc, emoticon) => {
    emoticon.mappings.forEach(mapping => {
      acc[mapping] = emoticon.data;
    });
    return acc;
  }, {} as { [key: string]: string });

  // Split text into parts, preserving spaces
  const parts = text.split(/(\s+)/);
  
  return (
    <span className={className}>
      {parts.map((part, index) => {
        if (part.trim() === '') {
          return <span key={index}>{part}</span>;
        }
        
        const emoticon = emoticonMap[part];
        if (emoticon) {
          return (
            <img
              key={index}
              src={emoticon}
              alt={part}
              className="inline-block w-5 h-5 align-middle"
              style={{
                imageRendering: 'pixelated',
                filter: 'contrast(1.2) brightness(1.1)'
              }}
            />
          );
        }
        
        return <span key={index}>{part}</span>;
      })}
    </span>
  );
};

export default EmoticonText; 