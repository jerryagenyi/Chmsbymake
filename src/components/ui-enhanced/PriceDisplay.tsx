/**
 * PriceDisplay - Elegant price/amount display
 * Inspired by: https://uiverse.io/vinodjangid07/tender-fireant-6
 */

import React from 'react';

interface PriceDisplayProps {
  label: string;
  amount: number;
  currency?: string;
  period?: string;
  highlight?: boolean;
  className?: string;
}

export function PriceDisplay({ 
  label, 
  amount, 
  currency = '₦',
  period,
  highlight = false,
  className = '' 
}: PriceDisplayProps) {
  const formattedAmount = new Intl.NumberFormat('en-NG', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <div className="flex items-baseline gap-1">
        <span className={`text-sm ${highlight ? 'text-[#1CE479]' : 'text-muted-foreground'}`}>
          {currency}
        </span>
        <span className={`text-3xl font-bold ${highlight ? 'text-[#1CE479]' : 'text-foreground'}`}>
          {formattedAmount}
        </span>
        {period && (
          <span className="text-sm text-muted-foreground">/{period}</span>
        )}
      </div>
    </div>
  );
}

/**
 * StatCard - Statistic card with label and value
 */
interface StatCardProps {
  label: string;
  value: string | number;
  subValue?: string;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  className?: string;
}

export function StatCard({ 
  label, 
  value, 
  subValue,
  icon, 
  trend,
  trendValue,
  className = '' 
}: StatCardProps) {
  const trendColors = {
    up: 'text-[#1CE479]',
    down: 'text-[#FF4444]',
    neutral: 'text-muted-foreground'
  };

  return (
    <div className={`
      bg-[#1A1A20] border-2 border-[#2A2A35] rounded-2xl p-6
      hover:border-[#1CE479]/30 transition-all duration-300
      ${className}
    `}>
      <div className="flex items-start justify-between mb-3">
        <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          {label}
        </span>
        {icon && (
          <div className="text-[#1CE479]/70">
            {icon}
          </div>
        )}
      </div>
      
      <div className="space-y-1">
        <div className="text-3xl font-bold text-foreground">
          {value}
        </div>
        
        {(subValue || trendValue) && (
          <div className="flex items-center gap-2 text-sm">
            {subValue && (
              <span className="text-muted-foreground">{subValue}</span>
            )}
            {trendValue && trend && (
              <span className={trendColors[trend]}>
                {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'} {trendValue}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
