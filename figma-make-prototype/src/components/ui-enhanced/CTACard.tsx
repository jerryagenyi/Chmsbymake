/**
 * CTACard - Call-to-action card with engaging design
 * Inspired by: https://uiverse.io/satyamchaudharydev/itchy-chipmunk-95
 */

import React from 'react';
import { ArrowRight } from 'lucide-react';

interface CTACardProps {
  title: string;
  description: string;
  buttonText: string;
  onClick: () => void;
  icon?: React.ReactNode;
  gradient?: boolean;
  className?: string;
}

export function CTACard({ 
  title, 
  description, 
  buttonText, 
  onClick, 
  icon,
  gradient = true,
  className = '' 
}: CTACardProps) {
  return (
    <div 
      className={`
        relative overflow-hidden rounded-2xl p-6
        ${gradient 
          ? 'bg-gradient-to-br from-[#1CE479]/20 via-[#1A1A20] to-[#1A1A20]' 
          : 'bg-[#1A1A20]'
        }
        border-2 border-[#1CE479]/20 
        hover:border-[#1CE479]/50 
        transition-all duration-300
        hover:shadow-[0_0_30px_rgba(28,228,121,0.2)]
        group
        ${className}
      `}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, #1CE479 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      {/* Content */}
      <div className="relative z-10 space-y-4">
        {/* Icon */}
        {icon && (
          <div className="w-12 h-12 bg-[#1CE479]/10 rounded-xl flex items-center justify-center text-[#1CE479] group-hover:scale-110 transition-transform duration-300">
            {icon}
          </div>
        )}

        {/* Text Content */}
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-foreground">
            {title}
          </h3>
          <p className="text-muted-foreground leading-relaxed">
            {description}
          </p>
        </div>

        {/* CTA Button */}
        <button
          onClick={onClick}
          className="
            inline-flex items-center gap-2 px-6 py-3
            bg-[#1CE479] text-[#0A0A0F] rounded-xl
            font-medium transition-all duration-300
            hover:shadow-[0_0_20px_rgba(28,228,121,0.4)]
            hover:scale-105 active:scale-95
            group/button
          "
        >
          {buttonText}
          <ArrowRight className="w-5 h-5 group-hover/button:translate-x-1 transition-transform duration-300" />
        </button>
      </div>

      {/* Decorative Element */}
      <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#1CE479]/5 rounded-full blur-3xl group-hover:bg-[#1CE479]/10 transition-all duration-500" />
    </div>
  );
}

/**
 * FeatureCard - Feature showcase card
 */
interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  stats?: string;
  className?: string;
}

export function FeatureCard({ title, description, icon, stats, className = '' }: FeatureCardProps) {
  return (
    <div className={`
      bg-[#1A1A20] border-2 border-[#2A2A35] rounded-2xl p-6
      hover:border-[#1CE479]/50 transition-all duration-300
      hover:shadow-[0_0_20px_rgba(28,228,121,0.15)]
      group
      ${className}
    `}>
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-[#1CE479]/10 rounded-xl flex items-center justify-center text-[#1CE479] flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
        
        <div className="flex-1 space-y-2">
          <h3 className="font-semibold text-foreground">{title}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
          {stats && (
            <p className="text-2xl font-bold text-[#1CE479] mt-3">{stats}</p>
          )}
        </div>
      </div>
    </div>
  );
}
