/**
 * FormLabel - Enhanced form label with modern styling
 * Inspired by: https://uiverse.io/mrhyddenn/fluffy-bird-66 & https://uiverse.io/Sunhotep/curly-zebra-88
 */

import React from 'react';

interface FormLabelProps {
  children: React.ReactNode;
  required?: boolean;
  htmlFor?: string;
  className?: string;
  variant?: 'default' | 'floating' | 'uppercase';
}

export function FormLabel({ 
  children, 
  required = false, 
  htmlFor, 
  className = '',
  variant = 'default'
}: FormLabelProps) {
  const baseClasses = 'block transition-all duration-200';
  
  const variantClasses = {
    default: 'text-sm font-medium text-foreground mb-2',
    floating: 'text-xs font-semibold text-[#1CE479] uppercase tracking-wider mb-1',
    uppercase: 'text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2 opacity-80'
  };

  return (
    <label 
      htmlFor={htmlFor}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
    >
      {children}
      {required && (
        <span className="text-[#FF4444] ml-1">*</span>
      )}
    </label>
  );
}

/**
 * EnhancedInput - Styled input with focus effects
 */
interface EnhancedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export function EnhancedInput({ 
  label, 
  error, 
  icon,
  className = '',
  ...props 
}: EnhancedInputProps) {
  const [isFocused, setIsFocused] = React.useState(false);

  return (
    <div className="w-full">
      {label && (
        <FormLabel required={props.required} htmlFor={props.id} variant="floating">
          {label}
        </FormLabel>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
            {icon}
          </div>
        )}
        <input
          className={`
            w-full px-4 py-3 bg-[#1A1A20] border-2 rounded-xl
            text-foreground placeholder:text-muted-foreground
            transition-all duration-300
            ${icon ? 'pl-12' : ''}
            ${isFocused ? 'border-[#1CE479] shadow-[0_0_15px_rgba(28,228,121,0.2)]' : 'border-[#2A2A35]'}
            ${error ? 'border-[#FF4444]' : ''}
            hover:border-[#1CE479]/50
            focus:outline-none focus:border-[#1CE479] focus:shadow-[0_0_15px_rgba(28,228,121,0.2)]
            ${className}
          `}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
      </div>
      {error && (
        <p className="text-sm text-[#FF4444] mt-1 animate-slide-down">{error}</p>
      )}
    </div>
  );
}
