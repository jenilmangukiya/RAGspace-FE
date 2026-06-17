import React from 'react';
import { clsx } from 'clsx';

export interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Loader: React.FC<LoaderProps> = ({ size = 'md', className }) => {
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-2',
    lg: 'h-12 w-12 border-3',
  };

  return (
    <div className={clsx('flex items-center justify-center', className)}>
      <div
        className={clsx(
          'animate-spin rounded-full border-t-indigo-500 border-r-transparent border-b-transparent border-l-transparent',
          sizeClasses[size]
        )}
        style={{ borderColor: 'rgba(255, 255, 255, 0.1) rgba(99, 102, 241, 1) rgba(99, 102, 241, 0.1) rgba(99, 102, 241, 0.1)' }}
      />
    </div>
  );
};
