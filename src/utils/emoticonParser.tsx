import React from 'react';
import { Emoticon } from '../constants/emoticons';
import { getEmoticonSize } from './emoticonLoader';

export interface EmoticonParserOptions {
  size?: 'small' | 'medium' | 'large';
  showPreview?: boolean;
  autoConvert?: boolean;
}

export const parseEmoticons = (text: string, emoticons: Emoticon[] = []): (string | Emoticon)[] => {
  if (!text || !emoticons.length) return [text];

  const parts: (string | Emoticon)[] = [];
  let currentIndex = 0;

  while (currentIndex < text.length) {
    let foundEmoticon = false;

    for (const emoticon of emoticons) {
      const code = `:${emoticon.code}:`;
      const nextIndex = text.indexOf(code, currentIndex);

      if (nextIndex === currentIndex) {
        parts.push(emoticon);
        currentIndex += code.length;
        foundEmoticon = true;
        break;
      }
    }

    if (!foundEmoticon) {
      let nextEmoticonIndex = text.length;
      for (const emoticon of emoticons) {
        const code = `:${emoticon.code}:`;
        const index = text.indexOf(code, currentIndex);
        if (index !== -1 && index < nextEmoticonIndex) {
          nextEmoticonIndex = index;
        }
      }

      parts.push(text.slice(currentIndex, nextEmoticonIndex));
      currentIndex = nextEmoticonIndex;
    }
  }

  return parts;
};

export const renderEmoticon = (emoticon: Emoticon, options: EmoticonParserOptions = {}) => {
  const { size = 'medium' } = options;
  const sizeClass = {
    small: 'w-4 h-4',
    medium: 'w-6 h-6',
    large: 'w-8 h-8',
  }[size];

  return (
    <img
      src={emoticon.path}
      alt={emoticon.name}
      className={`inline-block ${sizeClass} object-contain`}
      title={emoticon.name}
    />
  );
};

export const convertTextToEmoticons = (text: string, emoticons: Emoticon[]): string => {
  let result = text;
  const sortedEmoticons = [...emoticons].sort((a, b) => b.code.length - a.code.length);

  for (const emoticon of sortedEmoticons) {
    const regex = new RegExp(emoticon.code, 'g');
    result = result.replace(regex, `:${emoticon.code}:`);
  }

  return result;
}; 