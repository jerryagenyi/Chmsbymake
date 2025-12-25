/**
 * ChurchAfrica ChMS - Page Header Component
 * Standardized page heading with optional contextual information cards
 */

import React from 'react';
import { Card, CardContent } from '../ui/card';
import { LucideIcon } from 'lucide-react';

export interface StatCard {
  label: string;
  value: string | number;
  icon: LucideIcon;
  iconColor?: string;
  valueColor?: string;
}

interface PageHeaderProps {
  /**
   * Page title displayed at top left
   */
  title: string;
  
  /**
   * Optional description text
   */
  description?: string;
  
  /**
   * Optional action button or element
   */
  action?: React.ReactNode;
  
  /**
   * Optional statistics cards to display below the header
   */
  stats?: StatCard[];
  
  /**
   * Optional additional content (info cards, action sections, etc.)
   */
  children?: React.ReactNode;
}

export function PageHeader({ title, description, action, stats, children }: PageHeaderProps) {
  // Dynamically determine grid columns based on number of stats
  const getGridCols = (count: number) => {
    if (count <= 2) return 'md:grid-cols-2';
    if (count === 3) return 'md:grid-cols-3';
    if (count === 4) return 'md:grid-cols-4';
    if (count === 5) return 'md:grid-cols-5';
    return 'md:grid-cols-6';
  };

  return (
    <div className="bg-[#1A1A20] rounded-lg p-6 space-y-4">
      {/* Page Title with optional action */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="mb-0 text-2xl font-light">{title}</h1>
          {description && (
            <p className="text-muted-foreground mt-1">{description}</p>
          )}
        </div>
        {action && <div>{action}</div>}
      </div>
      
      {/* Optional contextual information cards */}
      {children}
      
      {/* Optional statistics cards */}
      {stats && stats.length > 0 && (
        <div className={`grid grid-cols-1 ${getGridCols(stats.length)} gap-4`}>
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                      <p className={`text-2xl font-bold ${stat.valueColor || ''}`}>
                        {stat.value}
                      </p>
                    </div>
                    <Icon className={`h-8 w-8 ${stat.iconColor || 'text-muted-foreground'}`} />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}