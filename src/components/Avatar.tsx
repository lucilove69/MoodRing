import React, { useState } from 'react';

type AvatarSize = 'small' | 'medium' | 'large' | 'xlarge';

interface AvatarProps {
  src?: string;
  alt?: string;
  size?: AvatarSize;
  className?: string;
  status?: 'online' | 'offline' | 'away' | 'busy';
  fallback?: string;
}

const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = '',
  size = 'medium',
  className = '',
  status,
  fallback,
}) => {
  const [showFallback, setShowFallback] = useState(!src);

  const sizeClasses = {
    small: 'w-8 h-8 text-sm',
    medium: 'w-10 h-10 text-base',
    large: 'w-12 h-12 text-lg',
    xlarge: 'w-16 h-16 text-xl',
  };

  const statusClasses = {
    online: 'bg-green-500',
    offline: 'bg-gray-500',
    away: 'bg-yellow-500',
    busy: 'bg-red-500',
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  const renderFallback = () => {
    if (fallback) {
      return (
        <div className="flex items-center justify-center w-full h-full bg-blue-500 text-white">
          {getInitials(fallback)}
        </div>
      );
    }
    return (
      <div className="flex items-center justify-center w-full h-full bg-white/10 text-white">
        <svg
          className="w-1/2 h-1/2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      </div>
    );
  };

  return (
    <div className="relative inline-block">
      <div
        className={`relative rounded-full overflow-hidden ${sizeClasses[size]} ${className}`}
      >
        {src && !showFallback ? (
          <img
            src={src}
            alt={alt}
            className="w-full h-full object-cover"
            onError={() => setShowFallback(true)}
          />
        ) : (
          renderFallback()
        )}
      </div>
      {status && (
        <div
          className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white/5 ${statusClasses[status]}`}
        />
      )}
    </div>
  );
};

export default Avatar; 