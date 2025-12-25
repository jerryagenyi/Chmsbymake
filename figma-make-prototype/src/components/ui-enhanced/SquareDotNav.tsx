/**
 * SquareDotNav - Square dot navigation indicator
 * Modern pagination/progress indicator with square dots
 */

import React from 'react';
import { cn } from '../ui/utils';

interface SquareDotNavProps {
  total: number;
  current: number;
  onDotClick?: (index: number) => void;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'muted';
  className?: string;
}

export function SquareDotNav({
  total,
  current,
  onDotClick,
  size = 'md',
  variant = 'primary',
  className = '',
}: SquareDotNavProps) {
  const sizeClasses = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-2.5 h-2.5',
  };

  const gapClasses = {
    sm: 'gap-1.5',
    md: 'gap-2',
    lg: 'gap-2.5',
  };

  const variantClasses = {
    primary: {
      active: 'bg-primary',
      inactive: 'bg-primary/30',
    },
    secondary: {
      active: 'bg-secondary-foreground',
      inactive: 'bg-secondary-foreground/30',
    },
    muted: {
      active: 'bg-muted-foreground',
      inactive: 'bg-muted-foreground/30',
    },
  };

  return (
    <div className={cn('flex items-center justify-center', gapClasses[size], className)}>
      {Array.from({ length: total }).map((_, index) => (
        <button
          key={index}
          onClick={() => onDotClick?.(index)}
          className={cn(
            'rounded-sm transition-all duration-300',
            sizeClasses[size],
            index === current
              ? variantClasses[variant].active
              : variantClasses[variant].inactive,
            onDotClick && 'cursor-pointer hover:scale-110',
            !onDotClick && 'cursor-default'
          )}
          aria-label={`Go to slide ${index + 1}`}
          aria-current={index === current ? 'true' : 'false'}
        />
      ))}
    </div>
  );
}

/**
 * SquareDotProgress - Square dot progress indicator with percentage
 */
interface SquareDotProgressProps {
  steps: string[];
  currentStep: number;
  variant?: 'primary' | 'secondary' | 'muted';
  showLabels?: boolean;
  className?: string;
}

export function SquareDotProgress({
  steps,
  currentStep,
  variant = 'primary',
  showLabels = false,
  className = '',
}: SquareDotProgressProps) {
  const variantClasses = {
    primary: {
      completed: 'bg-primary',
      current: 'bg-primary border-2 border-primary',
      upcoming: 'bg-primary/20',
      line: 'bg-primary',
    },
    secondary: {
      completed: 'bg-secondary-foreground',
      current: 'bg-secondary-foreground border-2 border-secondary-foreground',
      upcoming: 'bg-secondary-foreground/20',
      line: 'bg-secondary-foreground',
    },
    muted: {
      completed: 'bg-muted-foreground',
      current: 'bg-muted-foreground border-2 border-muted-foreground',
      upcoming: 'bg-muted-foreground/20',
      line: 'bg-muted-foreground',
    },
  };

  return (
    <div className={cn('w-full', className)}>
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <React.Fragment key={index}>
            {/* Step indicator */}
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  'w-3 h-3 rounded-sm transition-all duration-300',
                  index < currentStep && variantClasses[variant].completed,
                  index === currentStep && variantClasses[variant].current,
                  index > currentStep && variantClasses[variant].upcoming
                )}
              />
              {showLabels && (
                <span
                  className={cn(
                    'text-xs mt-2 text-center',
                    index <= currentStep ? 'text-foreground' : 'text-muted-foreground'
                  )}
                >
                  {step}
                </span>
              )}
            </div>

            {/* Connecting line */}
            {index < steps.length - 1 && (
              <div className="flex-1 h-0.5 mx-2 bg-muted-foreground/20 relative">
                <div
                  className={cn(
                    'absolute inset-y-0 left-0 transition-all duration-300',
                    variantClasses[variant].line
                  )}
                  style={{
                    width: index < currentStep ? '100%' : '0%',
                  }}
                />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

/**
 * SquareDotRating - Square dot rating component
 */
interface SquareDotRatingProps {
  maxRating?: number;
  rating: number;
  onRatingChange?: (rating: number) => void;
  size?: 'sm' | 'md' | 'lg';
  readonly?: boolean;
  className?: string;
}

export function SquareDotRating({
  maxRating = 5,
  rating,
  onRatingChange,
  size = 'md',
  readonly = false,
  className = '',
}: SquareDotRatingProps) {
  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4',
  };

  const gapClasses = {
    sm: 'gap-1',
    md: 'gap-1.5',
    lg: 'gap-2',
  };

  return (
    <div className={cn('flex items-center', gapClasses[size], className)}>
      {Array.from({ length: maxRating }).map((_, index) => (
        <button
          key={index}
          onClick={() => !readonly && onRatingChange?.(index + 1)}
          disabled={readonly}
          className={cn(
            'rounded-sm transition-all duration-200',
            sizeClasses[size],
            index < rating ? 'bg-primary' : 'bg-primary/20',
            !readonly && 'hover:scale-110 cursor-pointer',
            readonly && 'cursor-default'
          )}
          aria-label={`Rate ${index + 1} out of ${maxRating}`}
        />
      ))}
    </div>
  );
}
