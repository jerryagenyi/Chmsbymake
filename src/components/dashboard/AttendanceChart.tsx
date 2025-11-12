/**
 * ChurchAfrica ChMS - Attendance Chart
 * Weekly/Monthly attendance trends visualization
 */

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  LineChart, 
  Line, 
  AreaChart,
  Area,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend 
} from 'recharts';

const weeklyData = [
  { date: 'Week 1', attendance: 245, visitors: 45, target: 250 },
  { date: 'Week 2', attendance: 268, visitors: 52, target: 250 },
  { date: 'Week 3', attendance: 289, visitors: 48, target: 250 },
  { date: 'Week 4', attendance: 312, visitors: 58, target: 250 },
  { date: 'Week 5', attendance: 295, visitors: 50, target: 250 },
  { date: 'Week 6', attendance: 334, visitors: 62, target: 250 },
  { date: 'Week 7', attendance: 356, visitors: 68, target: 250 },
  { date: 'Week 8', attendance: 342, visitors: 60, target: 250 },
];

const monthlyData = [
  { month: 'Jan', attendance: 980, visitors: 180, target: 1000 },
  { month: 'Feb', attendance: 1050, visitors: 195, target: 1000 },
  { month: 'Mar', attendance: 1120, visitors: 210, target: 1000 },
  { month: 'Apr', attendance: 1200, visitors: 230, target: 1000 },
  { month: 'May', attendance: 1180, visitors: 215, target: 1000 },
  { month: 'Jun', attendance: 1280, visitors: 245, target: 1000 },
];

interface AttendanceChartProps {
  data?: typeof weeklyData;
  showTargetLine?: boolean;
  height?: number;
}

export function AttendanceChart({ 
  data, 
  showTargetLine = true,
  height = 300 
}: AttendanceChartProps) {
  const [period, setPeriod] = React.useState<'weekly' | 'monthly'>('weekly');

  const chartData = period === 'weekly' ? weeklyData : monthlyData;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Attendance Trends</CardTitle>
            <CardDescription>
              Track attendance patterns and growth
            </CardDescription>
          </div>
          <Tabs value={period} onValueChange={(v) => setPeriod(v as 'weekly' | 'monthly')}>
            <TabsList>
              <TabsTrigger value="weekly">Weekly</TabsTrigger>
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="attendanceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey={period === 'weekly' ? 'date' : 'month'} 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
              labelStyle={{ color: 'hsl(var(--foreground))' }}
            />
            <Legend />
            <Area
              type="monotone"
              dataKey="attendance"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              fill="url(#attendanceGradient)"
              name="Actual Attendance"
            />
            {showTargetLine && (
              <Line
                type="monotone"
                dataKey="target"
                stroke="hsl(var(--chart-2))"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
                name="Target"
              />
            )}
          </AreaChart>
        </ResponsiveContainer>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t">
          <div>
            <p className="text-xs text-muted-foreground">Average</p>
            <p className="text-sm font-semibold">
              {Math.round(chartData.reduce((sum, d) => sum + d.attendance, 0) / chartData.length)}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Peak</p>
            <p className="text-sm font-semibold">
              {Math.max(...chartData.map(d => d.attendance))}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Growth</p>
            <p className="text-sm font-semibold text-success">
              +{Math.round(((chartData[chartData.length - 1].attendance - chartData[0].attendance) / chartData[0].attendance) * 100)}%
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">This Period</p>
            <p className="text-sm font-semibold">
              {chartData[chartData.length - 1].attendance}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Vue Migration Notes:
 * 
 * // Use ApexCharts for Vue/Quasar
 * <template>
 *   <q-card>
 *     <q-card-section>
 *       <div class="row items-center justify-between q-mb-md">
 *         <div>
 *           <div class="text-h6">Attendance Trends</div>
 *           <div class="text-caption text-grey">Track attendance patterns and growth</div>
 *         </div>
 *         <q-btn-toggle
 *           v-model="period"
 *           :options="[
 *             { label: 'Weekly', value: 'weekly' },
 *             { label: 'Monthly', value: 'monthly' }
 *           ]"
 *           outline
 *           dense
 *         />
 *       </div>
 *       
 *       <apexchart
 *         type="area"
 *         :height="height"
 *         :options="chartOptions"
 *         :series="series"
 *       />
 *       
 *       <div class="row q-col-gutter-md q-mt-md q-pt-md" style="border-top: 1px solid var(--q-border)">
 *         <div class="col-6 col-md-3">
 *           <div class="text-caption text-grey">Average</div>
 *           <div class="text-subtitle2">{{ average }}</div>
 *         </div>
 *         <div class="col-6 col-md-3">
 *           <div class="text-caption text-grey">Peak</div>
 *           <div class="text-subtitle2">{{ peak }}</div>
 *         </div>
 *         <div class="col-6 col-md-3">
 *           <div class="text-caption text-grey">Growth</div>
 *           <div class="text-subtitle2 text-positive">+{{ growth }}%</div>
 *         </div>
 *         <div class="col-6 col-md-3">
 *           <div class="text-caption text-grey">This Period</div>
 *           <div class="text-subtitle2">{{ current }}</div>
 *         </div>
 *       </div>
 *     </q-card-section>
 *   </q-card>
 * </template>
 * 
 * <script setup lang="ts">
 * import { ref, computed } from 'vue';
 * import VueApexCharts from 'vue3-apexcharts';
 * 
 * const period = ref('weekly');
 * 
 * const chartOptions = computed(() => ({
 *   chart: {
 *     type: 'area',
 *     toolbar: { show: false },
 *   },
 *   colors: ['#1CE479', '#6c757d'],
 *   dataLabels: { enabled: false },
 *   stroke: { curve: 'smooth', width: 2 },
 *   fill: {
 *     type: 'gradient',
 *     gradient: {
 *       shadeIntensity: 1,
 *       opacityFrom: 0.3,
 *       opacityTo: 0,
 *     },
 *   },
 *   xaxis: {
 *     categories: period.value === 'weekly' 
 *       ? weeklyData.map(d => d.date)
 *       : monthlyData.map(d => d.month)
 *   },
 * }));
 * 
 * const series = computed(() => [
 *   {
 *     name: 'Actual Attendance',
 *     data: period.value === 'weekly'
 *       ? weeklyData.map(d => d.attendance)
 *       : monthlyData.map(d => d.attendance)
 *   },
 *   {
 *     name: 'Target',
 *     data: period.value === 'weekly'
 *       ? weeklyData.map(d => d.target)
 *       : monthlyData.map(d => d.target)
 *   }
 * ]);
 * </script>
 */