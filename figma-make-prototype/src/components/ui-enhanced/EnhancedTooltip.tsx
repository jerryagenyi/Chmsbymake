/**
 * EnhancedTooltip - Sleek tooltip with animations
 * Inspired by: https://uiverse.io/themrsami/ordinary-lion-95 & https://uiverse.io/mihocsaszilard/nice-dodo-30
 */

import React from 'react';

interface EnhancedTooltipProps {
  children: React.ReactNode;
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
  className?: string;
}

export function EnhancedTooltip({ 
  children, 
  content, 
  position = 'top', 
  delay = 200,
  className = '' 
}: EnhancedTooltipProps) {
  const [isVisible, setIsVisible] = React.useState(false);
  const [timeoutId, setTimeoutId] = React.useState<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    const id = setTimeout(() => setIsVisible(true), delay);
    setTimeoutId(id);
  };

  const handleMouseLeave = () => {
    if (timeoutId) clearTimeout(timeoutId);
    setIsVisible(false);
  };

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 -translate-y-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 translate-y-2',
    left: 'right-full top-1/2 -translate-y-1/2 -translate-x-2',
    right: 'left-full top-1/2 -translate-y-1/2 translate-x-2'
  };

  const arrowClasses = {
    top: 'top-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent border-t-[#1A1A20]',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent border-b-[#1A1A20]',
    left: 'left-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent border-l-[#1A1A20]',
    right: 'right-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent border-r-[#1A1A20]'
  };

  return (
    <div 
      className={`relative inline-block ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      
      {isVisible && (
        <div 
          className={`
            absolute ${positionClasses[position]} z-50 
            px-3 py-2 bg-[#1A1A20] text-white text-sm 
            rounded-lg shadow-lg border border-[#1CE479]/20
            whitespace-nowrap pointer-events-none
            animate-fade-in
          `}
          style={{
            animation: 'tooltipFadeIn 0.2s ease-out'
          }}
        >
          {content}
          
          {/* Arrow */}
          <div 
            className={`absolute ${arrowClasses[position]} w-0 h-0 border-4`}
          />
        </div>
      )}

      <style>{`
        @keyframes tooltipFadeIn {
          from {
            opacity: 0;
            transform: translate(var(--tw-translate-x), var(--tw-translate-y)) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translate(var(--tw-translate-x), var(--tw-translate-y)) scale(1);
          }
        }
      `}</style>
    </div>
  );
}

/**
 * OnlineStatusIndicator - Shows online/offline status with tooltip
 * Inspired by: https://uiverse.io/mihocsaszilard/nice-dodo-30
 */
interface OnlineStatusIndicatorProps {
  isOnline: boolean;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export function OnlineStatusIndicator({ 
  isOnline, 
  size = 'md', 
  showLabel = false,
  className = '' 
}: OnlineStatusIndicatorProps) {
  const sizeMap = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4'
  };

  return (
    <EnhancedTooltip content={isOnline ? 'Online' : 'Offline'} position="top">
      <div className={`flex items-center gap-2 ${className}`}>
        <div className="relative">
          <div 
            className={`
              ${sizeMap[size]} rounded-full
              ${isOnline ? 'bg-[#1CE479]' : 'bg-[#9CA3AF]'}
              transition-colors duration-300
            `}
          />
          {isOnline && (
            <div 
              className={`
                absolute inset-0 ${sizeMap[size]} rounded-full
                bg-[#1CE479] animate-ping opacity-75
              `}
            />
          )}
        </div>
        {showLabel && (
          <span className="text-sm text-muted-foreground">
            {isOnline ? 'Online' : 'Offline'}
          </span>
        )}
      </div>
    </EnhancedTooltip>
  );
}
