/**
 * LoadingSpinner - Animated loading indicators
 * Inspired by: https://uiverse.io/aaronross1/wicked-rat-49
 */

import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'dots' | 'spinner' | 'pulse' | 'bars';
  className?: string;
}

export function LoadingSpinner({ size = 'md', variant = 'dots', className = '' }: LoadingSpinnerProps) {
  const sizeMap = {
    sm: 16,
    md: 24,
    lg: 32,
    xl: 48
  };

  const dimension = sizeMap[size];

  if (variant === 'dots') {
    return (
      <div className={`flex items-center justify-center gap-1 ${className}`}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="rounded-full bg-[#1CE479]"
            style={{
              width: dimension / 4,
              height: dimension / 4,
              animation: `bounce 1.4s ease-in-out ${i * 0.16}s infinite both`
            }}
          />
        ))}
        <style>{`
          @keyframes bounce {
            0%, 80%, 100% { transform: scale(0); opacity: 0.5; }
            40% { transform: scale(1); opacity: 1; }
          }
        `}</style>
      </div>
    );
  }

  if (variant === 'spinner') {
    return (
      <div 
        className={`border-4 border-[#2A2A35] border-t-[#1CE479] rounded-full animate-spin ${className}`}
        style={{ width: dimension, height: dimension }}
      />
    );
  }

  if (variant === 'pulse') {
    return (
      <div className={`relative ${className}`} style={{ width: dimension, height: dimension }}>
        <div 
          className="absolute inset-0 bg-[#1CE479] rounded-full opacity-75"
          style={{ animation: 'pulse 1.5s ease-in-out infinite' }}
        />
        <div 
          className="absolute inset-0 bg-[#1CE479] rounded-full opacity-75"
          style={{ animation: 'pulse 1.5s ease-in-out 0.5s infinite' }}
        />
        <style>{`
          @keyframes pulse {
            0% { transform: scale(0.8); opacity: 1; }
            50% { transform: scale(1.2); opacity: 0.5; }
            100% { transform: scale(0.8); opacity: 1; }
          }
        `}</style>
      </div>
    );
  }

  // bars variant
  return (
    <div className={`flex items-center justify-center gap-1 ${className}`}>
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          className="bg-[#1CE479] rounded-sm"
          style={{
            width: dimension / 6,
            height: dimension,
            animation: `stretch 1.2s ease-in-out ${i * 0.1}s infinite`
          }}
        />
      ))}
      <style>{`
        @keyframes stretch {
          0%, 40%, 100% { transform: scaleY(0.4); }
          20% { transform: scaleY(1); }
        }
      `}</style>
    </div>
  );
}

/**
 * ChatLoadingIndicator - Three-dot typing animation for chat
 * Inspired by: https://uiverse.io/sahilxkhadka/proud-octopus-27
 */
export function ChatLoadingIndicator({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-1 px-4 py-2 bg-[#1A1A20] rounded-2xl w-fit ${className}`}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="w-2 h-2 bg-[#1CE479] rounded-full"
          style={{
            animation: `typing 1.4s ease-in-out ${i * 0.2}s infinite`
          }}
        />
      ))}
      <style>{`
        @keyframes typing {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.7; }
          30% { transform: translateY(-10px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
