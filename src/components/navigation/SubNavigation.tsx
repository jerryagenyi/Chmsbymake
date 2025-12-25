/**
 * ChurchAfrica ChMS - SubNavigation Component
 * Reusable breadcrumb-style sub-navigation for nested tab sections
 * Used across Attendance, Events, Services, etc.
 */

import React from 'react';
import { Badge } from '../ui/badge';
import { TabsList, TabsTrigger } from '../ui/tabs';
import { ChevronRight } from 'lucide-react';

export interface SubNavigationItem {
  value: string;
  label: string;
}

interface SubNavigationProps {
  /**
   * The section name displayed in the badge (e.g., "Attendance", "Events")
   */
  sectionName: string;
  
  /**
   * Array of navigation items
   */
  items: SubNavigationItem[];
  
  /**
   * Optional badge background color (defaults to theme green)
   */
  badgeColor?: string;
}

export function SubNavigation({
  sectionName,
  items,
  badgeColor = '#1b4332',
}: SubNavigationProps) {
  return (
    <TabsList 
      className="bg-transparent border-0 justify-start h-auto p-0 gap-0"
    >
      <div className="flex items-center gap-2">
        <Badge 
          variant="default" 
          className="pointer-events-none px-2 py-0.5 uppercase"
          style={{
            background: badgeColor,
            fontWeight: 100,
            borderRadius: '2px',
            fontSize: '10px'
          }}
        >
          {sectionName}
        </Badge>
        <ChevronRight className="h-3 w-3 text-muted-foreground" />
      </div>
      
      <div className="flex items-center">
        {items.map((item, index) => (
          <React.Fragment key={item.value}>
            <TabsTrigger 
              value={item.value} 
              className="data-[state=active]:bg-transparent data-[state=inactive]:bg-transparent border-0 data-[state=active]:text-foreground data-[state=inactive]:text-muted-foreground px-2 pr-2 pl-2 font-light data-[state=active]:shadow-none rounded-sm h-auto py-0.5"
              style={{ fontSize: '0.8125rem' }}
            >
              {item.label}
            </TabsTrigger>
            {index < items.length - 1 && (
              <span 
                className="text-[#1CE479] px-1.5 leading-none self-center" 
                style={{ fontSize: '0.8125rem' }}
              >
                |
              </span>
            )}
          </React.Fragment>
        ))}
      </div>
    </TabsList>
  );
}

/**
 * Vue Migration Notes:
 * 
 * <template>
 *   <q-tabs
 *     v-model="activeTab"
 *     dense
 *     no-caps
 *     align="left"
 *     class="bg-transparent"
 *     :style="{ marginLeft: marginLeft }"
 *   >
 *     <div class="row items-center q-gutter-xs">
 *       <q-chip
 *         size="sm"
 *         :style="{
 *           background: badgeColor,
 *           fontWeight: 100,
 *           borderRadius: '2px',
 *           fontSize: '10px'
 *         }"
 *         class="text-uppercase"
 *       >
 *         {{ sectionName }}
 *       </q-chip>
 *       <q-icon name="chevron_right" size="xs" color="grey-6" />
 *     </div>
 *     
 *     <template v-for="(item, index) in items" :key="item.value">
 *       <q-tab
 *         :name="item.value"
 *         :label="item.label"
 *         no-caps
 *         class="text-caption"
 *       />
 *       <span v-if="index < items.length - 1" class="text-primary q-px-xs">|</span>
 *     </template>
 *   </q-tabs>
 * </template>
 * 
 * <script setup lang="ts">
 * import { defineProps, withDefaults } from 'vue';
 * 
 * export interface SubNavigationItem {
 *   value: string;
 *   label: string;
 * }
 * 
 * interface Props {
 *   sectionName: string;
 *   items: SubNavigationItem[];
 *   marginLeft?: string;
 *   badgeColor?: string;
 * }
 * 
 * withDefaults(defineProps<Props>(), {
 *   marginLeft: '2.25em',
 *   badgeColor: '#1b4332'
 * });
 * </script>
 */