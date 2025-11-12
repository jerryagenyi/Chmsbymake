/**
 * AnimatedButton - Enhanced button with green theme and animations
 * Inspired by: https://uiverse.io/Yaya12085/nasty-firefox-13
 */

import React from 'react';

interface AnimatedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: React.ReactNode;
}

export function AnimatedButton({ 
  variant = 'primary', 
  size = 'md',
  loading = false,
  className = '', 
  children, 
  disabled,
  ...props 
}: AnimatedButtonProps) {
  const baseClasses = 'relative overflow-hidden transition-all duration-300 font-medium touch-target flex items-center justify-center gap-2';
  
  const variantClasses = {
    primary: 'bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-[0_0_20px_hsl(var(--primary)/0.3)] hover:scale-105 active:scale-95',
    secondary: 'bg-[#2A2A35] text-white hover:bg-[#3A3A45] hover:shadow-lg',
    outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground hover:shadow-[0_0_20px_hsl(var(--primary)/0.2)]',
    ghost: 'text-primary hover:bg-primary/10 hover:shadow-[0_0_15px_hsl(var(--primary)/0.15)]'
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm rounded-lg',
    md: 'px-6 py-3 rounded-xl',
    lg: 'px-8 py-4 rounded-2xl'
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      )}
      {children}
      
      {/* Ripple effect overlay */}
      <span className="absolute inset-0 bg-white/0 hover:bg-white/10 transition-all duration-300 rounded-inherit" />
    </button>
  );
}