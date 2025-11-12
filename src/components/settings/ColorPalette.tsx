/**
 * ChurchAfrica ChMS - Color Palette Reference
 * Visual showcase of the TweakCN theme colors
 */

import React from 'react';
import { Palette } from 'lucide-react';

interface ColorItem {
  name: string;
  hex: string;
}

export function ColorPalette() {
  // Get computed style to extract actual color values from CSS variables
  const getColorValue = (varName: string): string => {
    if (typeof window === 'undefined') return '#000000';
    const root = document.documentElement;
    const computedStyle = getComputedStyle(root);
    const oklchValue = computedStyle.getPropertyValue(varName).trim();
    
    // For now, return the OKLCH value - browsers will handle it
    return oklchValue ? `oklch(${oklchValue})` : '#000000';
  };

  const primaryColors: ColorItem[] = [
    { name: 'Background', hex: '#121212' },
    { name: 'Foreground', hex: '#e2e8f0' },
    { name: 'Primary', hex: '#006239' },
    { name: 'Primary Foreground', hex: '#d6e8e3' },
  ];

  const secondaryAccentColors: ColorItem[] = [
    { name: 'Secondary', hex: '#242424' },
    { name: 'Secondary Foreground', hex: '#fafafa' },
    { name: 'Accent', hex: '#313131' },
    { name: 'Accent Foreground', hex: '#fafafa' },
  ];

  const uiComponentColors: ColorItem[] = [
    { name: 'Card', hex: '#171717' },
    { name: 'Card Foreground', hex: '#e2e8f0' },
    { name: 'Popover', hex: '#242424' },
    { name: 'Popover Foreground', hex: '#a9a9a9' },
    { name: 'Muted', hex: '#1f1f1f' },
    { name: 'Muted Foreground', hex: '#4a2a2a' },
  ];

  const utilityFormColors: ColorItem[] = [
    { name: 'Border', hex: '#292929' },
    { name: 'Input', hex: '#242424' },
    { name: 'Ring', hex: '#4ade80' },
  ];

  const statusFeedbackColors: ColorItem[] = [
    { name: 'Destructive', hex: '#541c15' },
    { name: 'Destructive Foreground', hex: '#dce9e8' },
    { name: 'Success', hex: '#006239' },
    { name: 'Warning', hex: '#f4c542' },
    { name: 'Info', hex: '#5b7ee5' },
  ];

  const ColorSection = ({ title, colors }: { title: string; colors: ColorItem[] }) => (
    <div className="mb-8">
      <h3 className="text-sm font-medium text-muted-foreground mb-4">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {colors.map((color) => (
          <div key={color.name} className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded border border-border shrink-0"
              style={{ backgroundColor: color.hex }}
            />
            <div>
              <p className="text-sm font-medium">{color.name}</p>
              <p className="text-xs text-muted-foreground font-mono">{color.hex}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Palette className="h-6 w-6 text-primary" />
        <div>
          <h2 className="text-2xl font-semibold">Colour Palette</h2>
          <p className="text-muted-foreground">
            TweakCN theme with Oklahoma LCH (OKLCH) colour space for perceptually uniform colours
          </p>
        </div>
      </div>

      {/* Color Sections */}
      <div className="space-y-6">
        <ColorSection title="Primary Theme Colours" colors={primaryColors} />
        <ColorSection title="Secondary & Accent Colours" colors={secondaryAccentColors} />
        <ColorSection title="UI Component Colours" colors={uiComponentColors} />
        <ColorSection title="Utility & Form Colours" colors={utilityFormColors} />
        <ColorSection title="Status & Feedback Colours" colors={statusFeedbackColors} />
      </div>
    </div>
  );
}
