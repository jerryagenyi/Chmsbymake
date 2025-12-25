/**
 * ChurchAfrica ChMS - Theme Configuration
 * Africa-First Design System
 */

export type ThemeMode = 'light' | 'dark' | 'high-contrast' | 'system';

export interface ThemeConfig {
  mode: ThemeMode;
  autoSwitch: boolean; // Auto-switch based on time of day
  respectSystemPreference: boolean;
}

export const defaultThemeConfig: ThemeConfig = {
  mode: 'dark', // Default to Green Dark theme for Africa-First
  autoSwitch: false,
  respectSystemPreference: true,
};

/**
 * Green Dark Theme Tokens
 * Primary design for ChurchAfrica ChMS
 */
export const greenDarkTheme = {
  name: 'Green Dark',
  mode: 'dark' as const,
  colors: {
    primary: '#1CE479',
    background: '#0A0A0F',
    card: '#1A1A20',
    secondary: '#2A2A35',
    accent: '#FFB800',
    success: '#1CE479',
    warning: '#FFB800',
    error: '#FF4444',
    info: '#4A9EFF',
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    '2xl': '48px',
  },
  touchTarget: '48px',
  fontFamily: "'Archivo', -apple-system, BlinkMacSystemFont, sans-serif",
};

/**
 * Light Theme Tokens
 * Alternative for outdoor/bright sunlight use
 */
export const lightTheme = {
  name: 'Light',
  mode: 'light' as const,
  colors: {
    primary: '#1CE479',
    background: '#FFFFFF',
    card: '#F8F9FA',
    secondary: '#E9ECEF',
    accent: '#FFB800',
    success: '#1CE479',
    warning: '#FFB800',
    error: '#FF4444',
    info: '#4A9EFF',
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    '2xl': '48px',
  },
  touchTarget: '48px',
  fontFamily: "'Archivo', -apple-system, BlinkMacSystemFont, sans-serif",
};

/**
 * High Contrast Theme Tokens
 * Accessibility-focused theme
 */
export const highContrastTheme = {
  name: 'High Contrast',
  mode: 'high-contrast' as const,
  colors: {
    primary: '#00FF00',
    background: '#000000',
    card: '#1A1A1A',
    secondary: '#333333',
    accent: '#FFCC00',
    success: '#00FF00',
    warning: '#FFCC00',
    error: '#FF0000',
    info: '#00AAFF',
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    '2xl': '48px',
  },
  touchTarget: '48px',
  fontFamily: "'Archivo', -apple-system, BlinkMacSystemFont, sans-serif",
};

export const themes = {
  light: lightTheme,
  dark: greenDarkTheme,
  'high-contrast': highContrastTheme,
};

/**
 * Get theme based on system preference
 */
export function getSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'dark';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

/**
 * Storage keys for theme persistence
 */
export const THEME_STORAGE_KEY = 'churchafrica-theme-mode';
export const THEME_CONFIG_STORAGE_KEY = 'churchafrica-theme-config';
