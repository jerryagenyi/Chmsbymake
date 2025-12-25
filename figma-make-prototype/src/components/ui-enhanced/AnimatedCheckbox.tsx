/**
 * AnimatedCheckbox - Custom checkbox with smooth animations
 * Inspired by: https://uiverse.io/PriyanshuGupta28/tough-puma-94
 */

import React from 'react';
import { Check } from 'lucide-react';

interface AnimatedCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  id?: string;
  disabled?: boolean;
  className?: string;
}

export function AnimatedCheckbox({
  checked,
  onChange,
  label,
  id,
  disabled = false,
  className = ''
}: AnimatedCheckboxProps) {
  return (
    <label 
      htmlFor={id}
      className={`flex items-center gap-3 cursor-pointer group ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      <div className="relative">
        <input
          type="checkbox"
          id={id}
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          className="sr-only"
        />
        <div 
          className={`
            w-6 h-6 border-2 rounded-lg transition-all duration-300 flex items-center justify-center
            ${checked 
              ? 'bg-[#1CE479] border-[#1CE479] scale-100 shadow-[0_0_15px_rgba(28,228,121,0.4)]' 
              : 'bg-transparent border-[#2A2A35] group-hover:border-[#1CE479]/50'
            }
          `}
        >
          <Check 
            className={`w-4 h-4 text-[#0A0A0F] transition-all duration-300 ${
              checked ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
            }`}
            strokeWidth={3}
          />
        </div>
      </div>
      
      {label && (
        <span className="text-sm text-foreground select-none">
          {label}
        </span>
      )}
    </label>
  );
}
