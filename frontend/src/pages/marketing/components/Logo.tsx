import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function Logo({ size = 'md', className = '' }: LogoProps) {
  const sizes = {
    sm: 'h-6',
    md: 'h-10',
    lg: 'h-16'
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <img 
        src="/images/logo.png" 
        alt="RideUp" 
        className={`${sizes[size]} w-auto object-contain`} 
      />
    </div>
  );
}
