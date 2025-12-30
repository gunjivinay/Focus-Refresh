import React from 'react';

interface LoadingSkeletonProps {
  width?: string;
  height?: string;
  className?: string;
  type?: 'text' | 'circle' | 'rect';
  count?: number;
}

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  width = '100%',
  height = '1em',
  className = '',
  type = 'text',
  count = 1,
}) => {
  const baseClasses = 'animate-pulse bg-gray-200 rounded-md';
  let typeClasses = '';

  switch (type) {
    case 'circle':
      typeClasses = 'rounded-full';
      break;
    case 'rect':
      typeClasses = 'rounded-lg';
      break;
    case 'text':
    default:
      typeClasses = ''; // Default rounded-md is fine
      break;
  }

  if (count > 1) {
    return (
      <>
        {Array.from({ length: count }).map((_, index) => (
          <div
            key={index}
            className={`${baseClasses} ${typeClasses} ${className}`}
            style={{ width, height, marginBottom: index < count - 1 ? '0.5rem' : '0' }}
            aria-hidden="true"
          />
        ))}
      </>
    );
  }

  return (
    <div
      className={`${baseClasses} ${typeClasses} ${className}`}
      style={{ width, height }}
      aria-hidden="true"
    />
  );
};

export default LoadingSkeleton;
