/**
 * SubtlePattern - Background pattern component
 * Inspired by: https://uiverse.io/kennyotsu/short-warthog-33
 */

import React from 'react';

interface SubtlePatternProps {
  variant?: 'dots' | 'grid' | 'diagonal' | 'waves' | 'hexagon';
  opacity?: number;
  className?: string;
}

export function SubtlePattern({ 
  variant = 'dots', 
  opacity = 0.03,
  className = '' 
}: SubtlePatternProps) {
  const patterns = {
    dots: (
      <div 
        className={`absolute inset-0 ${className}`}
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, rgba(0, 98, 57, ${opacity}) 1px, transparent 0)`,
          backgroundSize: '32px 32px',
          opacity
        }}
      />
    ),
    grid: (
      <div 
        className={`absolute inset-0 ${className}`}
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 98, 57, ${opacity}) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 98, 57, ${opacity}) 1px, transparent 1px)
          `,
          backgroundSize: '32px 32px',
          opacity
        }}
      />
    ),
    diagonal: (
      <div 
        className={`absolute inset-0 ${className}`}
        style={{
          backgroundImage: `repeating-linear-gradient(
            45deg,
            transparent,
            transparent 20px,
            rgba(0, 98, 57, ${opacity}) 20px,
            rgba(0, 98, 57, ${opacity}) 21px
          )`,
          opacity
        }}
      />
    ),
    waves: (
      <svg className={`absolute inset-0 w-full h-full ${className}`} style={{ opacity }}>
        <defs>
          <pattern id="wave-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
            <path 
              d="M0 50 Q 25 25, 50 50 T 100 50" 
              stroke="rgba(0, 98, 57, 0.3)" 
              fill="none" 
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#wave-pattern)" />
      </svg>
    ),
    hexagon: (
      <div 
        className={`absolute inset-0 ${className}`}
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='50' height='43.4' viewBox='0 0 50 43.4' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M25 0l12.5 7.2v14.5L25 28.9 12.5 21.7V7.2L25 0z' fill='none' stroke='rgba(0, 98, 57, ${opacity})' stroke-width='1'/%3E%3C/svg%3E")`,
          backgroundSize: '50px 43.4px',
          opacity
        }}
      />
    )
  };

  return patterns[variant];
}

/**
 * PatternContainer - Container with pattern background
 */
interface PatternContainerProps {
  children: React.ReactNode;
  pattern?: 'dots' | 'grid' | 'diagonal' | 'waves' | 'hexagon';
  className?: string;
}

export function PatternContainer({ children, pattern = 'dots', className = '' }: PatternContainerProps) {
  return (
    <div className={`relative ${className}`}>
      <SubtlePattern variant={pattern} />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}