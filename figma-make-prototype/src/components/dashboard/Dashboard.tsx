/**
 * ChurchAfrica ChMS - Main Dashboard
 * Comprehensive dashboard with customizable, draggable KPI cards
 */

import React, { useState, useCallback, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DraggableKPICard } from './DraggableKPICard';
import { DashboardCustomizer, DashboardConfig } from './DashboardCustomizer';
import { DashboardTour, useDashboardTour } from './DashboardTour';
import { AttendanceChart } from './AttendanceChart';
import { GivingChart } from './GivingChart';
import { VisitorsChart } from './VisitorsChart';
import { ActivityFeed } from './ActivityFeed';
import { QuickActions } from './QuickActions';
import { UpcomingEvents } from './UpcomingEvents';
import { 
  DEFAULT_DASHBOARD_CONFIG,
  getCardDataById,
  getCardDefinitions,
} from '../../lib/dashboard-config';
import { cn } from '../ui/utils';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Settings2, LayoutDashboard, HelpCircle } from 'lucide-react';

export function Dashboard() {
  const { isTourOpen, openTour, closeTour, completeTour, hasSeenTour } = useDashboardTour();

  // Load config from localStorage or use defaults
  const [config, setConfig] = useState<DashboardConfig>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('churchafrica-dashboard-config');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error('Failed to parse saved dashboard config:', e);
        }
      }
    }
    return DEFAULT_DASHBOARD_CONFIG;
  });

  const [cardOrder, setCardOrder] = useState<string[]>(config.visibleCards);

  // Show tour on first visit
  useEffect(() => {
    if (!hasSeenTour) {
      const timer = setTimeout(() => {
        openTour();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [hasSeenTour, openTour]);

  // Sync card order with visible cards when config changes
  useEffect(() => {
    // Add new cards that aren't in the current order
    const newCards = config.visibleCards.filter(id => !cardOrder.includes(id));
    // Remove cards that are no longer visible
    const updatedOrder = cardOrder.filter(id => config.visibleCards.includes(id));
    // Append new cards at the end
    setCardOrder([...updatedOrder, ...newCards]);
  }, [config.visibleCards]);

  // Save config to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('churchafrica-dashboard-config', JSON.stringify(config));
    }
  }, [config]);

  const handleConfigChange = useCallback((newConfig: DashboardConfig) => {
    setConfig(newConfig);
  }, []);

  const moveCard = useCallback((dragIndex: number, hoverIndex: number) => {
    setCardOrder((prevOrder) => {
      const newOrder = [...prevOrder];
      const [draggedCard] = newOrder.splice(dragIndex, 1);
      newOrder.splice(hoverIndex, 0, draggedCard);
      return newOrder;
    });
  }, []);

  // Density class mappings
  const densityClasses = {
    compact: 'gap-3',
    standard: 'gap-4',
    comfortable: 'gap-6',
  };

  const densityCardClasses = {
    compact: 'text-sm',
    standard: '',
    comfortable: 'text-base',
  };

  // Grid column classes based on cards per row
  const gridColClasses = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  } as const;

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="space-y-6">
        {/* Dashboard Tour */}
        <DashboardTour
          open={isTourOpen}
          onClose={closeTour}
          onComplete={completeTour}
        />

        {/* Dashboard Header with Customization */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <LayoutDashboard className="h-5 w-5 text-primary" />
            <div>
              <h2 className="text-2xl font-light">Dashboard Overview</h2>
              <p className="text-sm text-muted-foreground">
                {cardOrder.length} cards • {config.density} density • {config.cardsPerRow} per row
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={openTour}
              className="gap-2"
            >
              <HelpCircle className="h-4 w-4" />
              <span className="hidden sm:inline">Help</span>
            </Button>
            <DashboardCustomizer
              config={config}
              onConfigChange={handleConfigChange}
              availableCards={getCardDefinitions()}
            />
          </div>
        </div>

        {/* KPI Cards Grid - Draggable */}
        <div
          className={cn(
            'grid',
            gridColClasses[config.cardsPerRow],
            densityClasses[config.density]
          )}
        >
          {cardOrder.slice(0, config.cardsPerRow * config.rowCount).map((cardId, index) => {
            const cardData = getCardDataById(cardId);
            if (!cardData) return null;

            return (
              <DraggableKPICard
                key={cardId}
                id={cardId}
                index={index}
                moveCard={moveCard}
                isDraggingEnabled={true}
                {...cardData.cardProps}
              />
            );
          })}
        </div>

        {/* Empty State */}
        {cardOrder.length === 0 && (
          <div className="border-2 border-dashed rounded-lg p-12 text-center">
            <Settings2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="mb-2">No cards selected</h3>
            <p className="text-muted-foreground mb-4">
              Click "Customize Dashboard" to add cards to your dashboard
            </p>
            <DashboardCustomizer
              config={config}
              onConfigChange={handleConfigChange}
              availableCards={getCardDefinitions()}
            />
          </div>
        )}

        {/* Quick Actions */}
        <QuickActions />

        {/* Main Visitors Chart - Full Width */}
        <VisitorsChart />

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AttendanceChart />
          <GivingChart />
        </div>

        {/* Activity and Events Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ActivityFeed maxHeight={450} />
          <UpcomingEvents />
        </div>
      </div>
    </DndProvider>
  );
}

/**
 * Vue Migration Notes:
 * 
 * // views/DashboardView.vue
 * <template>
 *   <q-page padding>
 *     <!-- KPI Cards Grid -->
 *     <div class="row q-col-gutter-md q-mb-md">
 *       <div class="col-12 col-sm-6 col-md-4 col-lg-2">
 *         <KPICard
 *           title="Total Members"
 *           value="1,248"
 *           :change="12"
 *           change-label="vs last month"
 *           trend="up"
 *           icon="people"
 *           color="primary"
 *           subtitle="Active members"
 *         />
 *       </div>
 *       
 *       <div class="col-12 col-sm-6 col-md-4 col-lg-2">
 *         <KPICard
 *           title="Weekly Attendance"
 *           value="342"
 *           :change="8"
 *           change-label="vs last week"
 *           trend="up"
 *           icon="trending_up"
 *           color="positive"
 *           subtitle="Sunday service"
 *         />
 *       </div>
 *       
 *       <div class="col-12 col-sm-6 col-md-4 col-lg-2">
 *         <KPICard
 *           title="Monthly Giving"
 *           value="₦89.8k"
 *           :change="15"
 *           change-label="vs last month"
 *           trend="up"
 *           icon="payments"
 *           color="primary"
 *           subtitle="All sources"
 *         />
 *       </div>
 *       
 *       <div class="col-12 col-sm-6 col-md-4 col-lg-2">
 *         <KPICard
 *           title="Active Groups"
 *           value="24"
 *           :change="2"
 *           change-label="new this month"
 *           trend="up"
 *           icon="groups"
 *           color="info"
 *           subtitle="Fellowship groups"
 *         />
 *       </div>
 *       
 *       <div class="col-12 col-sm-6 col-md-4 col-lg-2">
 *         <KPICard
 *           title="Upcoming Events"
 *           value="8"
 *           :change="-1"
 *           change-label="vs last month"
 *           trend="down"
 *           icon="event"
 *           color="accent"
 *           subtitle="Next 30 days"
 *         />
 *       </div>
 *       
 *       <div class="col-12 col-sm-6 col-md-4 col-lg-2">
 *         <KPICard
 *           title="First Timers"
 *           value="23"
 *           :change="18"
 *           change-label="this month"
 *           trend="up"
 *           icon="person_add"
 *           color="positive"
 *           subtitle="New visitors"
 *         />
 *       </div>
 *     </div>
 * 
 *     <!-- Quick Actions -->
 *     <div class="q-mb-md">
 *       <QuickActions />
 *     </div>
 * 
 *     <!-- Charts Row -->
 *     <div class="row q-col-gutter-md q-mb-md">
 *       <div class="col-12 col-lg-6">
 *         <AttendanceChart />
 *       </div>
 *       <div class="col-12 col-lg-6">
 *         <GivingChart />
 *       </div>
 *       <div class="col-12 col-lg-6">
 *         <VisitorsChart />
 *       </div>
 *     </div>
 * 
 *     <!-- Activity and Events Row -->
 *     <div class="row q-col-gutter-md">
 *       <div class="col-12 col-lg-6">
 *         <ActivityFeed />
 *       </div>
 *       <div class="col-12 col-lg-6">
 *         <UpcomingEvents />
 *       </div>
 *     </div>
 *   </q-page>
 * </template>
 * 
 * <script setup lang="ts">
 * import KPICard from '@/components/dashboard/KPICard.vue';
 * import AttendanceChart from '@/components/dashboard/AttendanceChart.vue';
 * import GivingChart from '@/components/dashboard/GivingChart.vue';
 * import VisitorsChart from '@/components/dashboard/VisitorsChart.vue';
 * import ActivityFeed from '@/components/dashboard/ActivityFeed.vue';
 * import QuickActions from '@/components/dashboard/QuickActions.vue';
 * import UpcomingEvents from '@/components/dashboard/UpcomingEvents.vue';
 * 
 * // Optional: Fetch real data from API
 * import { onMounted, ref } from 'vue';
 * import api from '@/services/api';
 * 
 * const loading = ref(true);
 * const dashboardData = ref(null);
 * 
 * onMounted(async () => {
 *   try {
 *     const { data } = await api.get('/api/dashboard');
 *     dashboardData.value = data;
 *   } catch (error) {
 *     console.error('Failed to load dashboard data:', error);
 *   } finally {
 *     loading.value = false;
 *   }
 * });
 * </script>
 */