/**
 * ChurchAfrica ChMS - Mobile Bottom Navigation
 * Touch-friendly bottom navigation for mobile devices (max 5 tabs)
 */

import React from 'react';
import { Badge } from '../ui/badge';
import { mobileBottomNavigation } from './NavigationItems';

export function MobileBottomNav() {
  const [currentPath, setCurrentPath] = React.useState('/');

  // Mock notification counts (will be replaced with real data)
  const notificationCounts: Record<string, number> = {
    chat: 5,
    members: 2,
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-card border-t border-border">
      <div className="flex items-center justify-around h-16 px-2">
        {mobileBottomNavigation.map((item) => {
          const Icon = item.icon;
          const isActive = currentPath === item.href;
          const notificationCount = notificationCounts[item.id] || 0;

          return (
            <button
              key={item.id}
              onClick={() => setCurrentPath(item.href)}
              className={`
                flex flex-col items-center justify-center gap-1
                touch-target no-select relative flex-1
                transition-colors duration-200
                ${
                  isActive
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }
              `}
            >
              <div className="relative">
                <Icon className="h-5 w-5" />
                {notificationCount > 0 && (
                  <Badge
                    variant="default"
                    className="absolute -top-2 -right-2 h-4 w-4 p-0 flex items-center justify-center text-[10px]"
                  >
                    {notificationCount > 9 ? '9+' : notificationCount}
                  </Badge>
                )}
              </div>
              <span className="text-[10px] font-medium">{item.label}</span>
              
              {/* Active indicator */}
              {isActive && (
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-12 bg-primary rounded-full" />
              )}
            </button>
          );
        })}
      </div>

      {/* Safe area spacing for iOS devices */}
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  );
}

/**
 * Vue Migration Notes:
 * 
 * // Vue 3 + Quasar equivalent:
 * <template>
 *   <q-footer class="bg-card">
 *     <q-tabs
 *       v-model="currentTab"
 *       class="text-grey"
 *       active-color="primary"
 *       indicator-color="primary"
 *       dense
 *     >
 *       <q-route-tab
 *         v-for="item in mobileBottomNavigation"
 *         :key="item.id"
 *         :name="item.id"
 *         :to="item.href"
 *         :icon="item.icon"
 *         :label="item.label"
 *       >
 *         <q-badge
 *           v-if="notificationCounts[item.id] > 0"
 *           color="primary"
 *           floating
 *         >
 *           {{ notificationCounts[item.id] > 9 ? '9+' : notificationCounts[item.id] }}
 *         </q-badge>
 *       </q-route-tab>
 *     </q-tabs>
 *   </q-footer>
 * </template>
 * 
 * <script setup lang="ts">
 * import { ref } from 'vue';
 * import { useRoute } from 'vue-router';
 * import { mobileBottomNavigation } from '@/config/navigation';
 * 
 * const route = useRoute();
 * const currentTab = ref(route.name);
 * 
 * const notificationCounts = ref({
 *   chat: 5,
 *   members: 2
 * });
 * </script>
 */
