import React from 'react';

type ProgressBarVariant = 'primary' | 'success' | 'warning' | 'error';

interface ProgressBarProps {
  value: number;
  max?: number;
  variant?: ProgressBarVariant;
  showValue?: boolean;
  animated?: boolean;
  className?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  variant = 'primary',
  showValue = false,
  animated = false,
  className = '',
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const variantClasses = {
    primary: 'bg-blue-500',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    error: 'bg-red-500',
  };

  const animationClass = animated ? 'animate-pulse' : '';

  return (
    <div className={`w-full ${className}`}>
      <div className="relative h-2 bg-white/10 rounded-full overflow-hidden">
        <div
          className={`h-full ${variantClasses[variant]} ${animationClass} transition-all duration-300 ease-out`}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
        />
      </div>
      {showValue && (
        <div className="mt-1 text-sm text-white/70 text-right">
          {Math.round(percentage)}%
        </div>
      )}
    </div>
  );
};

export default ProgressBar; 