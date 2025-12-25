/**
 * ChurchAfrica ChMS - Giving/Donations Chart
 * Monthly giving trends with category breakdown
 */

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend 
} from 'recharts';

const givingData = [
  { month: 'Jan', tithes: 45000, offerings: 12000, special: 5000 },
  { month: 'Feb', tithes: 48000, offerings: 13500, special: 7000 },
  { month: 'Mar', tithes: 52000, offerings: 14200, special: 6500 },
  { month: 'Apr', tithes: 55000, offerings: 15000, special: 8000 },
  { month: 'May', tithes: 58000, offerings: 16500, special: 9500 },
  { month: 'Jun', tithes: 62000, offerings: 17800, special: 10000 },
];

interface GivingChartProps {
  data?: typeof givingData;
  currency?: string;
  height?: number;
}

export function GivingChart({ 
  data = givingData, 
  currency = '₦',
  height = 300 
}: GivingChartProps) {
  const formatCurrency = (value: number) => {
    return `${currency}${(value / 1000).toFixed(0)}k`;
  };

  const totalGiving = data.reduce((sum, month) => 
    sum + month.tithes + month.offerings + month.special, 0
  );

  const avgMonthly = totalGiving / data.length;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Giving Overview</CardTitle>
        <CardDescription>
          Monthly donations and offerings breakdown
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              {/* Gradients for bars */}
              <linearGradient id="tithesGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.9}/>
                <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.7}/>
              </linearGradient>
              <linearGradient id="offeringsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4ade80" stopOpacity={0.9}/>
                <stop offset="100%" stopColor="#4ade80" stopOpacity={0.7}/>
              </linearGradient>
              <linearGradient id="specialGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--accent))" stopOpacity={0.9}/>
                <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity={0.7}/>
              </linearGradient>
            </defs>
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="hsl(var(--border))" 
              strokeOpacity={0.3}
              vertical={false}
            />
            <XAxis 
              dataKey="month" 
              stroke="hsl(var(--muted-foreground))"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              dy={10}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))"
              fontSize={11}
              tickFormatter={formatCurrency}
              tickLine={false}
              axisLine={false}
              dx={-10}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                fontSize: '12px',
              }}
              labelStyle={{ color: 'hsl(var(--foreground))', fontWeight: 500 }}
              formatter={(value: number) => formatCurrency(value)}
            />
            <Legend 
              wrapperStyle={{ fontSize: '12px' }}
              iconType="circle"
            />
            <Bar 
              dataKey="tithes" 
              stackId="a" 
              fill="url(#tithesGradient)"
              name="Tithes"
              radius={[0, 0, 0, 0]}
            />
            <Bar 
              dataKey="offerings" 
              stackId="a" 
              fill="url(#offeringsGradient)"
              name="Offerings"
              radius={[0, 0, 0, 0]}
            />
            <Bar 
              dataKey="special" 
              stackId="a" 
              fill="url(#specialGradient)"
              name="Special Giving"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t">
          <div>
            <p className="text-xs text-muted-foreground">Total (6 Months)</p>
            <p className="text-sm font-semibold">
              {formatCurrency(totalGiving)}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Monthly Average</p>
            <p className="text-sm font-semibold">
              {formatCurrency(avgMonthly)}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">This Month</p>
            <p className="text-sm font-semibold text-primary">
              {formatCurrency(
                data[data.length - 1].tithes + 
                data[data.length - 1].offerings + 
                data[data.length - 1].special
              )}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Growth</p>
            <p className="text-sm font-semibold text-success">
              +{Math.round((
                (data[data.length - 1].tithes - data[0].tithes) / 
                data[0].tithes
              ) * 100)}%
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
 * // components/dashboard/GivingChart.vue
 * <template>
 *   <q-card>
 *     <q-card-section>
 *       <div class="text-h6">Giving Overview</div>
 *       <div class="text-caption text-grey">Monthly donations and offerings breakdown</div>
 *       
 *       <apexchart
 *         type="bar"
 *         :height="height"
 *         :options="chartOptions"
 *         :series="series"
 *       />
 *       
 *       <div class="row q-col-gutter-md q-mt-md q-pt-md" style="border-top: 1px solid var(--q-border)">
 *         <div class="col-6 col-md-3">
 *           <div class="text-caption text-grey">Total (6 Months)</div>
 *           <div class="text-subtitle2">{{ formatCurrency(totalGiving) }}</div>
 *         </div>
 *         <div class="col-6 col-md-3">
 *           <div class="text-caption text-grey">Monthly Average</div>
 *           <div class="text-subtitle2">{{ formatCurrency(avgMonthly) }}</div>
 *         </div>
 *         <div class="col-6 col-md-3">
 *           <div class="text-caption text-grey">This Month</div>
 *           <div class="text-subtitle2 text-primary">{{ formatCurrency(thisMonth) }}</div>
 *         </div>
 *         <div class="col-6 col-md-3">
 *           <div class="text-caption text-grey">Growth</div>
 *           <div class="text-subtitle2 text-positive">+{{ growth }}%</div>
 *         </div>
 *       </div>
 *     </q-card-section>
 *   </q-card>
 * </template>
 * 
 * <script setup lang="ts">
 * import { ref, computed } from 'vue';
 * 
 * interface Props {
 *   currency?: string;
 *   height?: number;
 * }
 * 
 * const props = withDefaults(defineProps<Props>(), {
 *   currency: '₦',
 *   height: 300
 * });
 * 
 * const chartOptions = computed(() => ({
 *   chart: {
 *     type: 'bar',
 *     stacked: true,
 *     toolbar: { show: false },
 *   },
 *   colors: ['#1CE479', '#4ade80', '#a78bfa'],
 *   plotOptions: {
 *     bar: {
 *       borderRadius: 4,
 *     },
 *   },
 *   xaxis: {
 *     categories: givingData.map(d => d.month),
 *   },
 *   yaxis: {
 *     labels: {
 *       formatter: (value: number) => formatCurrency(value)
 *     }
 *   },
 * }));
 * 
 * const series = computed(() => [
 *   { name: 'Tithes', data: givingData.map(d => d.tithes) },
 *   { name: 'Offerings', data: givingData.map(d => d.offerings) },
 *   { name: 'Special Giving', data: givingData.map(d => d.special) }
 * ]);
 * 
 * const formatCurrency = (value: number) => {
 *   return `${props.currency}${(value / 1000).toFixed(0)}k`;
 * };
 * </script>
 */