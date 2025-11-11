/**
 * SuccessMessage - Animated success notification
 * Inspired by: https://uiverse.io/akshat-patel28/tough-octopus-19
 */

import React from 'react';
import { Check, X } from 'lucide-react';

interface SuccessMessageProps {
  message: string;
  description?: string;
  onClose?: () => void;
  autoClose?: boolean;
  duration?: number;
  variant?: 'success' | 'error' | 'warning' | 'info';
}

export function SuccessMessage({ 
  message, 
  description, 
  onClose, 
  autoClose = true, 
  duration = 3000,
  variant = 'success'
}: SuccessMessageProps) {
  const [isVisible, setIsVisible] = React.useState(true);

  React.useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => onClose?.(), 300);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [autoClose, duration, onClose]);

  const variants = {
    success: {
      bg: 'bg-[#1CE479]/10',
      border: 'border-[#1CE479]',
      icon: 'bg-[#1CE479]',
      text: 'text-[#1CE479]'
    },
    error: {
      bg: 'bg-[#FF4444]/10',
      border: 'border-[#FF4444]',
      icon: 'bg-[#FF4444]',
      text: 'text-[#FF4444]'
    },
    warning: {
      bg: 'bg-[#FFB800]/10',
      border: 'border-[#FFB800]',
      icon: 'bg-[#FFB800]',
      text: 'text-[#FFB800]'
    },
    info: {
      bg: 'bg-[#4A9EFF]/10',
      border: 'border-[#4A9EFF]',
      icon: 'bg-[#4A9EFF]',
      text: 'text-[#4A9EFF]'
    }
  };

  const config = variants[variant];

  if (!isVisible) return null;

  return (
    <div 
      className={`${config.bg} ${config.border} border-2 rounded-2xl p-4 flex items-start gap-4 shadow-lg backdrop-blur-sm transition-all duration-300 ${
        isVisible ? 'animate-slide-in-right' : 'animate-slide-out-right'
      }`}
      style={{
        animation: isVisible ? 'slideIn 0.3s ease-out' : 'slideOut 0.3s ease-out'
      }}
    >
      {/* Icon */}
      <div className={`${config.icon} rounded-full p-2 flex-shrink-0`}>
        <Check className="w-5 h-5 text-[#0A0A0F]" />
      </div>

      {/* Content */}
      <div className="flex-1">
        <h4 className={`font-semibold ${config.text}`}>{message}</h4>
        {description && (
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        )}
      </div>

      {/* Close button */}
      {onClose && (
        <button
          onClick={() => {
            setIsVisible(false);
            setTimeout(() => onClose(), 300);
          }}
          className={`${config.text} hover:opacity-70 transition-opacity flex-shrink-0`}
        >
          <X className="w-5 h-5" />
        </button>
      )}

      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        @keyframes slideOut {
          from {
            transform: translateX(0);
            opacity: 1;
          }
          to {
            transform: translateX(100%);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
