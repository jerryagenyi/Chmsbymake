/**
 * LoadingSpinner - Various loading indicator styles
 * Includes: dots, spinner, pulse, and bars variants
 */

interface LoadingSpinnerProps {
  variant?: 'dots' | 'spinner' | 'pulse' | 'bars';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function LoadingSpinner({ 
  variant = 'spinner', 
  size = 'md',
  className = '' 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const dotSizes = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-3 h-3'
  };

  const barHeights = {
    sm: 'h-4',
    md: 'h-6',
    lg: 'h-8'
  };

  if (variant === 'dots') {
    return (
      <div className={`flex items-center gap-1.5 ${className}`}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={`${dotSizes[size]} bg-primary rounded-full`}
            style={{
              animation: `bounce 1.4s ease-in-out ${i * 0.16}s infinite`
            }}
          />
        ))}
        <style>{`
          @keyframes bounce {
            0%, 80%, 100% { transform: scale(0); }
            40% { transform: scale(1); }
          }
        `}</style>
      </div>
    );
  }

  if (variant === 'pulse') {
    return (
      <div className={`${sizeClasses[size]} ${className}`}>
        <div className="w-full h-full bg-primary rounded-full animate-pulse" 
          style={{
            animation: 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite'
          }}
        />
      </div>
    );
  }

  if (variant === 'bars') {
    return (
      <div className={`flex items-center gap-1 ${className}`}>
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={`w-1 ${barHeights[size]} bg-primary rounded-full`}
            style={{
              animation: `bars 1.2s ease-in-out ${i * 0.1}s infinite`
            }}
          />
        ))}
        <style>{`
          @keyframes bars {
            0%, 40%, 100% { transform: scaleY(0.4); }
            20% { transform: scaleY(1); }
          }
        `}</style>
      </div>
    );
  }

  // Default: spinner variant
  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      <div className="w-full h-full border-4 border-muted border-t-primary rounded-full animate-spin" />
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
          className="w-2 h-2 bg-primary rounded-full"
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