import React from 'react';
import { parseEmoticons, renderEmoticon } from '../utils/emoticonParser';

interface MessageContentProps {
  content: string;
  className?: string;
}

const MessageContent: React.FC<MessageContentProps> = ({ content, className = '' }) => {
  const parts = parseEmoticons(content);
  
  return (
    <div className={`whitespace-pre-wrap break-words ${className}`}>
      {parts.map((part, index) => 
        typeof part === 'string' 
          ? part 
          : renderEmoticon(part)
      )}
    </div>
  );
};

export default MessageContent; 