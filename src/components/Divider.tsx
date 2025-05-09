import React from 'react';

type DividerOrientation = 'horizontal' | 'vertical';
type DividerVariant = 'solid' | 'dashed' | 'dotted';

interface DividerProps {
  orientation?: DividerOrientation;
  variant?: DividerVariant;
  className?: string;
  text?: string;
  color?: string;
}

const Divider: React.FC<DividerProps> = ({
  orientation = 'horizontal',
  variant = 'solid',
  className = '',
  text,
  color = 'white/10',
}) => {
  const variantClasses = {
    solid: 'border-solid',
    dashed: 'border-dashed',
    dotted: 'border-dotted',
  };

  if (orientation === 'vertical') {
    return (
      <div
        className={`h-full w-px border-l ${variantClasses[variant]} border-${color} ${className}`}
        role="separator"
      />
    );
  }

  return (
    <div
      className={`flex items-center ${className}`}
      role="separator"
    >
      <div className={`flex-1 border-t ${variantClasses[variant]} border-${color}`} />
      {text && (
        <div className="px-4 text-sm text-white/50">{text}</div>
      )}
      <div className={`flex-1 border-t ${variantClasses[variant]} border-${color}`} />
    </div>
  );
};

export default Divider; 