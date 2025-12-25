/**
 * ChurchAfrica ChMS - Theme Provider
 * Manages theme state and persistence across the application
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  ThemeMode,
  ThemeConfig,
  defaultThemeConfig,
  getSystemTheme,
  THEME_STORAGE_KEY,
  THEME_CONFIG_STORAGE_KEY,
} from '../../lib/theme-config';

interface ThemeContextType {
  theme: ThemeMode;
  config: ThemeConfig;
  setTheme: (theme: ThemeMode) => void;
  updateConfig: (config: Partial<ThemeConfig>) => void;
  toggleTheme: () => void;
  effectiveTheme: 'light' | 'dark' | 'high-contrast'; // Resolved theme (system -> actual)
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>('dark');
  const [config, setConfig] = useState<ThemeConfig>(defaultThemeConfig);
  const [mounted, setMounted] = useState(false);

  // Initialize theme from localStorage or default
  useEffect(() => {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode | null;
    const savedConfig = localStorage.getItem(THEME_CONFIG_STORAGE_KEY);

    if (savedTheme) {
      setThemeState(savedTheme);
    } else if (config.respectSystemPreference) {
      setThemeState('system');
    }

    if (savedConfig) {
      try {
        setConfig(JSON.parse(savedConfig));
      } catch (error) {
        console.error('Failed to parse theme config:', error);
      }
    }

    setMounted(true);
  }, []);

  // Calculate effective theme (resolve 'system' to actual theme)
  const effectiveTheme: 'light' | 'dark' | 'high-contrast' = 
    theme === 'system' ? getSystemTheme() : theme;

  // Apply theme to document
  useEffect(() => {
    if (!mounted) return;

    const root = document.documentElement;
    
    // Remove all theme classes
    root.classList.remove('light', 'dark', 'high-contrast');
    
    // Add current theme class
    root.classList.add(effectiveTheme);

    // Save theme preference
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme, effectiveTheme, mounted]);

  // Listen for system theme changes
  useEffect(() => {
    if (!mounted || theme !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      // Force re-render to update effectiveTheme
      setThemeState('system');
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme, mounted]);

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
    localStorage.setItem(THEME_STORAGE_KEY, newTheme);
  };

  const updateConfig = (newConfig: Partial<ThemeConfig>) => {
    const updatedConfig = { ...config, ...newConfig };
    setConfig(updatedConfig);
    localStorage.setItem(THEME_CONFIG_STORAGE_KEY, JSON.stringify(updatedConfig));
  };

  const toggleTheme = () => {
    const themeOrder: ThemeMode[] = ['light', 'dark', 'high-contrast'];
    const currentIndex = themeOrder.indexOf(effectiveTheme);
    const nextIndex = (currentIndex + 1) % themeOrder.length;
    setTheme(themeOrder[nextIndex]);
  };

  // Prevent flash of unstyled content
  if (!mounted) {
    return null;
  }

  return (
    <ThemeContext.Provider
      value={{
        theme,
        config,
        setTheme,
        updateConfig,
        toggleTheme,
        effectiveTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * Hook to access theme context
 */
export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

/**
 * Vue Migration Notes:
 * 
 * React Context → Vue Provide/Inject
 * 
 * // Vue 3 Composition API equivalent:
 * import { provide, inject, ref, computed } from 'vue';
 * 
 * const ThemeSymbol = Symbol('theme');
 * 
 * export function provideTheme() {
 *   const theme = ref<ThemeMode>('dark');
 *   const effectiveTheme = computed(() => 
 *     theme.value === 'system' ? getSystemTheme() : theme.value
 *   );
 *   
 *   provide(ThemeSymbol, { theme, effectiveTheme, setTheme });
 * }
 * 
 * export function useTheme() {
 *   return inject(ThemeSymbol);
 * }
 */
