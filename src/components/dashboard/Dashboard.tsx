/**
 * ChurchAfrica ChMS - Main Dashboard
 * Comprehensive dashboard with KPIs, charts, and activity feeds
 */

import React from 'react';
import { KPICard } from './KPICard';
import { AttendanceChart } from './AttendanceChart';
import { GivingChart } from './GivingChart';
import { ActivityFeed } from './ActivityFeed';
import { QuickActions } from './QuickActions';
import { UpcomingEvents } from './UpcomingEvents';
import { 
  Users, 
  TrendingUp, 
  DollarSign, 
  UsersRound,
  Calendar,
  Target
} from 'lucide-react';

export function Dashboard() {
  return (
    <div className="space-y-6">
      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <KPICard
          title="Total Members"
          value="1,248"
          change={12}
          changeLabel="vs last month"
          trend="up"
          icon={Users}
          color="primary"
          subtitle="Active members"
        />
        
        <KPICard
          title="Weekly Attendance"
          value="342"
          change={8}
          changeLabel="vs last week"
          trend="up"
          icon={TrendingUp}
          color="success"
          subtitle="Sunday service"
        />
        
        <KPICard
          title="Monthly Giving"
          value="₦89.8k"
          change={15}
          changeLabel="vs last month"
          trend="up"
          icon={DollarSign}
          color="primary"
          subtitle="All sources"
        />
        
        <KPICard
          title="Active Groups"
          value="24"
          change={2}
          changeLabel="new this month"
          trend="up"
          icon={UsersRound}
          color="info"
          subtitle="Fellowship groups"
        />
        
        <KPICard
          title="Upcoming Events"
          value="8"
          change={-1}
          changeLabel="vs last month"
          trend="down"
          icon={Calendar}
          color="accent"
          subtitle="Next 30 days"
        />
        
        <KPICard
          title="First Timers"
          value="23"
          change={18}
          changeLabel="this month"
          trend="up"
          icon={Target}
          color="success"
          subtitle="New visitors"
        />
      </div>

      {/* Quick Actions */}
      <QuickActions />

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AttendanceChart />
        <GivingChart />
      </div>

      {/* Activity and Events Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ActivityFeed />
        <UpcomingEvents />
      </div>
    </div>
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
