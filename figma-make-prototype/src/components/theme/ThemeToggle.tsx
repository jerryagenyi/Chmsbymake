/**
 * ChurchAfrica ChMS - Theme Toggle Component
 * UI component for switching between themes
 */

import React from 'react';
import { Sun, Moon, Contrast } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

export function ThemeToggle() {
  const { theme, setTheme, effectiveTheme } = useTheme();

  const themeIcons = {
    light: <Sun className="h-5 w-5" />,
    dark: <Moon className="h-5 w-5" />,
    'high-contrast': <Contrast className="h-5 w-5" />,
  };

  const themeLabels = {
    light: 'Light Mode',
    dark: 'Green Dark',
    'high-contrast': 'High Contrast',
    system: 'System Default',
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="touch-target no-select"
          aria-label="Toggle theme"
        >
          {themeIcons[effectiveTheme]}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem
          onClick={() => setTheme('light')}
          className="flex items-center gap-2 touch-target"
        >
          <Sun className="h-4 w-4" />
          <span>Light Mode</span>
          {theme === 'light' && (
            <span className="ml-auto text-primary">✓</span>
          )}
        </DropdownMenuItem>
        
        <DropdownMenuItem
          onClick={() => setTheme('dark')}
          className="flex items-center gap-2 touch-target"
        >
          <Moon className="h-4 w-4" />
          <span>Green Dark</span>
          {theme === 'dark' && (
            <span className="ml-auto text-primary">✓</span>
          )}
        </DropdownMenuItem>
        
        <DropdownMenuItem
          onClick={() => setTheme('high-contrast')}
          className="flex items-center gap-2 touch-target"
        >
          <Contrast className="h-4 w-4" />
          <span>High Contrast</span>
          {theme === 'high-contrast' && (
            <span className="ml-auto text-primary">✓</span>
          )}
        </DropdownMenuItem>
        
        <DropdownMenuItem
          onClick={() => setTheme('system')}
          className="flex items-center gap-2 touch-target border-t border-border mt-1 pt-1"
        >
          <div className="h-4 w-4 flex items-center justify-center">
            <div className="h-3 w-3 rounded-full border-2 border-current" />
          </div>
          <span>System Default</span>
          {theme === 'system' && (
            <span className="ml-auto text-primary">✓</span>
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/**
 * Simple Theme Toggle Button (for mobile)
 */
export function ThemeToggleButton() {
  const { toggleTheme, effectiveTheme } = useTheme();

  const themeIcons = {
    light: <Sun className="h-5 w-5" />,
    dark: <Moon className="h-5 w-5" />,
    'high-contrast': <Contrast className="h-5 w-5" />,
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="touch-target no-select"
      aria-label="Toggle theme"
    >
      {themeIcons[effectiveTheme]}
    </Button>
  );
}

/**
 * Vue Migration Notes:
 * 
 * // Vue 3 equivalent using Quasar Framework:
 * <template>
 *   <q-btn-dropdown flat round :icon="currentIcon">
 *     <q-list>
 *       <q-item clickable @click="setTheme('light')">
 *         <q-item-section avatar>
 *           <q-icon name="light_mode" />
 *         </q-item-section>
 *         <q-item-section>Light Mode</q-item-section>
 *         <q-item-section side v-if="theme === 'light'">
 *           <q-icon name="check" color="primary" />
 *         </q-item-section>
 *       </q-item>
 *       <!-- More items... -->
 *     </q-list>
 *   </q-btn-dropdown>
 * </template>
 * 
 * <script setup lang="ts">
 * import { computed } from 'vue';
 * import { useTheme } from '@/composables/useTheme';
 * 
 * const { theme, setTheme, effectiveTheme } = useTheme();
 * 
 * const currentIcon = computed(() => {
 *   const icons = {
 *     light: 'light_mode',
 *     dark: 'dark_mode',
 *     'high-contrast': 'contrast'
 *   };
 *   return icons[effectiveTheme.value];
 * });
 * </script>
 */
