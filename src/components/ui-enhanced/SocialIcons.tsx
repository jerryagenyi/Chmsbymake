/**
 * SocialIcons - Animated social media icons
 * Inspired by: https://uiverse.io/vinodjangid07/horrible-eel-23
 */

import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin, Youtube, Mail, Phone } from 'lucide-react';

interface SocialIconProps {
  platform: 'facebook' | 'twitter' | 'instagram' | 'linkedin' | 'youtube' | 'email' | 'phone';
  url?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'glow' | 'outline';
}

const iconMap = {
  facebook: Facebook,
  twitter: Twitter,
  instagram: Instagram,
  linkedin: Linkedin,
  youtube: Youtube,
  email: Mail,
  phone: Phone
};

const colorMap = {
  facebook: '#1877F2',
  twitter: '#1DA1F2',
  instagram: '#E4405F',
  linkedin: '#0A66C2',
  youtube: '#FF0000',
  email: '#1CE479',
  phone: '#1CE479'
};

export function SocialIcon({ platform, url, size = 'md', variant = 'glow' }: SocialIconProps) {
  const Icon = iconMap[platform];
  const color = colorMap[platform];

  const sizeMap = {
    sm: 'w-10 h-10',
    md: 'w-12 h-12',
    lg: 'w-14 h-14'
  };

  const iconSizeMap = {
    sm: 'w-5 h-5',
    md: 'w-6 h-6',
    lg: 'w-7 h-7'
  };

  const handleClick = () => {
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  if (variant === 'glow') {
    return (
      <button
        onClick={handleClick}
        className={`
          ${sizeMap[size]} rounded-full bg-[#1A1A20] flex items-center justify-center
          transition-all duration-300 hover:scale-110 active:scale-95
          hover:shadow-[0_0_20px_rgba(28,228,121,0.5)]
          border-2 border-transparent hover:border-[#1CE479]
          group relative overflow-hidden
        `}
        style={{
          '--icon-color': color
        } as React.CSSProperties}
      >
        <Icon className={`${iconSizeMap[size]} text-[#1CE479] transition-all duration-300 group-hover:rotate-12 relative z-10`} />
        
        {/* Glow effect */}
        <div className="absolute inset-0 bg-[#1CE479] opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-full" />
      </button>
    );
  }

  if (variant === 'outline') {
    return (
      <button
        onClick={handleClick}
        className={`
          ${sizeMap[size]} rounded-full border-2 border-[#1CE479] flex items-center justify-center
          transition-all duration-300 hover:scale-110 active:scale-95
          hover:bg-[#1CE479] hover:shadow-[0_0_20px_rgba(28,228,121,0.4)]
          group
        `}
      >
        <Icon className={`${iconSizeMap[size]} text-[#1CE479] group-hover:text-[#0A0A0F] transition-colors duration-300`} />
      </button>
    );
  }

  // default variant
  return (
    <button
      onClick={handleClick}
      className={`
        ${sizeMap[size]} rounded-full bg-[#1CE479] flex items-center justify-center
        transition-all duration-300 hover:scale-110 active:scale-95
        hover:shadow-[0_0_20px_rgba(28,228,121,0.5)]
      `}
    >
      <Icon className={`${iconSizeMap[size]} text-[#0A0A0F]`} />
    </button>
  );
}

/**
 * SocialIconGroup - Group of social icons
 */
interface SocialIconGroupProps {
  icons: Array<{
    platform: SocialIconProps['platform'];
    url: string;
  }>;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'glow' | 'outline';
  className?: string;
}

export function SocialIconGroup({ icons, size = 'md', variant = 'glow', className = '' }: SocialIconGroupProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {icons.map((icon, index) => (
        <SocialIcon
          key={index}
          platform={icon.platform}
          url={icon.url}
          size={size}
          variant={variant}
        />
      ))}
    </div>
  );
}
