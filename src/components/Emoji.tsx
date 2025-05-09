import React from 'react';

interface EmojiProps {
  type: 'heart' | 'star' | 'music' | 'sparkle' | 'rainbow' | 'flower' | 'butterfly' | 'diamond';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const Emoji: React.FC<EmojiProps> = ({ type, size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  const emojiPaths = {
    heart: '/images/emojis/heart.gif',
    star: '/images/emojis/star.gif',
    music: '/images/emojis/music.gif',
    sparkle: '/images/emojis/sparkle.gif',
    rainbow: '/images/emojis/rainbow.gif',
    flower: '/images/emojis/flower.gif',
    butterfly: '/images/emojis/butterfly.gif',
    diamond: '/images/emojis/diamond.gif'
  };

  return (
    <img
      src={emojiPaths[type]}
      alt={type}
      className={`${sizeClasses[size]} inline-block ${className}`}
      style={{
        imageRendering: 'pixelated',
        filter: 'contrast(1.2) brightness(1.1)'
      }}
    />
  );
};

export default Emoji; 