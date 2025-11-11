/**
 * ChurchAfrica ChMS - KPI Card Component
 * Reusable metric card with trend indicators
 */

import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '../ui/utils';

export type TrendDirection = 'up' | 'down' | 'neutral';

export interface KPICardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  trend?: TrendDirection;
  icon: LucideIcon;
  color?: 'primary' | 'success' | 'accent' | 'info' | 'warning';
  subtitle?: string;
  loading?: boolean;
  onClick?: () => void;
}

export function KPICard({
  title,
  value,
  change,
  changeLabel,
  trend = 'neutral',
  icon: Icon,
  color = 'primary',
  subtitle,
  loading = false,
  onClick,
}: KPICardProps) {
  const colorClasses = {
    primary: 'bg-primary/10 text-primary',
    success: 'bg-success/10 text-success',
    accent: 'bg-accent/10 text-accent',
    info: 'bg-info/10 text-info',
    warning: 'bg-warning/10 text-warning',
  };

  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-3 w-3" />;
      case 'down':
        return <TrendingDown className="h-3 w-3" />;
      default:
        return <Minus className="h-3 w-3" />;
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return 'text-success';
      case 'down':
        return 'text-destructive';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <Card 
      className={cn(
        "transition-all hover:shadow-lg",
        onClick && "cursor-pointer hover:border-primary/50"
      )}
      onClick={onClick}
    >
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm text-muted-foreground mb-1">{title}</p>
            {loading ? (
              <div className="h-8 w-24 bg-muted animate-pulse rounded" />
            ) : (
              <h3 className="mb-2">{value}</h3>
            )}
            
            {change !== undefined && (
              <div className="flex items-center gap-2">
                <Badge 
                  variant="outline" 
                  className={cn("gap-1 px-2 py-0 h-5", getTrendColor())}
                >
                  {getTrendIcon()}
                  <span className="text-xs">
                    {change > 0 ? '+' : ''}{change}%
                  </span>
                </Badge>
                {changeLabel && (
                  <span className="text-xs text-muted-foreground">
                    {changeLabel}
                  </span>
                )}
              </div>
            )}
            
            {subtitle && (
              <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
            )}
          </div>
          
          <div className={cn(
            "h-12 w-12 rounded-lg flex items-center justify-center flex-shrink-0",
            colorClasses[color]
          )}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Vue Migration Notes:
 * 
 * // components/dashboard/KPICard.vue
 * <template>
 *   <q-card 
 *     class="kpi-card"
 *     :class="{ 'cursor-pointer': onClick }"
 *     @click="onClick"
 *   >
 *     <q-card-section>
 *       <div class="row items-start justify-between">
 *         <div class="col">
 *           <div class="text-caption text-grey">{{ title }}</div>
 *           
 *           <div v-if="loading" class="q-mt-xs">
 *             <q-skeleton type="text" width="60px" height="32px" />
 *           </div>
 *           <div v-else class="text-h4 q-mt-xs">{{ value }}</div>
 *           
 *           <div v-if="change !== undefined" class="row items-center q-mt-sm q-gutter-xs">
 *             <q-chip 
 *               :color="trendColor" 
 *               text-color="white" 
 *               size="sm"
 *               dense
 *             >
 *               <q-icon :name="trendIcon" size="xs" class="q-mr-xs" />
 *               {{ change > 0 ? '+' : '' }}{{ change }}%
 *             </q-chip>
 *             <span v-if="changeLabel" class="text-caption text-grey">
 *               {{ changeLabel }}
 *             </span>
 *           </div>
 *           
 *           <div v-if="subtitle" class="text-caption text-grey q-mt-xs">
 *             {{ subtitle }}
 *           </div>
 *         </div>
 *         
 *         <q-avatar :color="iconColor" size="48px" text-color="white">
 *           <q-icon :name="icon" />
 *         </q-avatar>
 *       </div>
 *     </q-card-section>
 *   </q-card>
 * </template>
 * 
 * <script setup lang="ts">
 * import { computed } from 'vue';
 * 
 * interface Props {
 *   title: string;
 *   value: string | number;
 *   change?: number;
 *   changeLabel?: string;
 *   trend?: 'up' | 'down' | 'neutral';
 *   icon: string;
 *   color?: string;
 *   subtitle?: string;
 *   loading?: boolean;
 *   onClick?: () => void;
 * }
 * 
 * const props = withDefaults(defineProps<Props>(), {
 *   trend: 'neutral',
 *   color: 'primary',
 *   loading: false,
 * });
 * 
 * const trendIcon = computed(() => {
 *   switch (props.trend) {
 *     case 'up': return 'trending_up';
 *     case 'down': return 'trending_down';
 *     default: return 'remove';
 *   }
 * });
 * 
 * const trendColor = computed(() => {
 *   switch (props.trend) {
 *     case 'up': return 'positive';
 *     case 'down': return 'negative';
 *     default: return 'grey';
 *   }
 * });
 * 
 * const iconColor = computed(() => {
 *   return props.color || 'primary';
 * });
 * </script>
 */
