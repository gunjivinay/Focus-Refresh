import React from 'react';

interface CardProps {
  children: React.ReactNode;
  onClick?: () => void;
  selected?: boolean;
  className?: string;
}

export default function Card({
  children,
  onClick,
  selected = false,
  className = '',
}: CardProps) {
  const baseStyles = 'p-6 rounded-xl border-2 transition-all duration-200 cursor-pointer';
  
  const stateStyles = selected
    ? 'border-blue-600 bg-blue-50 shadow-lg scale-105'
    : 'border-gray-200 bg-white hover:border-blue-400 hover:shadow-md hover:scale-[1.02]';

  return (
    <div
      onClick={onClick}
      className={`${baseStyles} ${stateStyles} ${className}`}
    >
      {children}
    </div>
  );
}

