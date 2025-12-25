/**
 * ChurchAfrica ChMS Logo Component
 * Reusable logo for branding consistency
 */

import React from 'react';
import { Church } from 'lucide-react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
  className?: string;
}

export function Logo({ size = 'md', showTagline = false, className = '' }: LogoProps) {
  const sizes = {
    sm: {
      icon: 'w-8 h-8',
      iconInner: 'h-5 w-5',
      text: 'text-lg',
      tagline: 'text-[10px]',
    },
    md: {
      icon: 'w-12 h-12',
      iconInner: 'h-7 w-7',
      text: 'text-2xl',
      tagline: 'text-xs',
    },
    lg: {
      icon: 'w-16 h-16',
      iconInner: 'h-10 w-10',
      text: 'text-3xl',
      tagline: 'text-sm',
    },
  };

  const sizeConfig = sizes[size];

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className={`${sizeConfig.icon} rounded-lg bg-primary/10 flex items-center justify-center`}>
        <Church className={`${sizeConfig.iconInner} text-primary`} />
      </div>
      <div>
        <h1 className={`${sizeConfig.text} tracking-tight leading-none`}>
          Church<span className="text-primary">Africa</span>
        </h1>
        {showTagline && (
          <p className={`${sizeConfig.tagline} text-muted-foreground tracking-wide uppercase`}>
            Africa-First Church Management
          </p>
        )}
      </div>
    </div>
  );
}