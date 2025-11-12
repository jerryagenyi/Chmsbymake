/**
 * ChurchAfrica ChMS - Visitors Chart
 * Smooth stacked area chart showing Desktop vs Mobile visitors (inspired by TweakCN)
 */

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { 
  AreaChart,
  Area,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
} from 'recharts';

const visitorData = [
  { date: 'Jun 1', mobile: 165, desktop: 195 },
  { date: 'Jun 3', mobile: 178, desktop: 210 },
  { date: 'Jun 5', mobile: 142, desktop: 185 },
  { date: 'Jun 7', mobile: 188, desktop: 225 },
  { date: 'Jun 9', mobile: 195, desktop: 240 },
  { date: 'Jun 11', mobile: 172, desktop: 205 },
  { date: 'Jun 13', mobile: 185, desktop: 220 },
  { date: 'Jun 15', mobile: 198, desktop: 235 },
  { date: 'Jun 17', mobile: 212, desktop: 250 },
  { date: 'Jun 19', mobile: 205, desktop: 240 },
  { date: 'Jun 21', mobile: 220, desktop: 260 },
  { date: 'Jun 24', mobile: 235, desktop: 275 },
  { date: 'Jun 27', mobile: 228, desktop: 265 },
  { date: 'Jun 30', mobile: 245, desktop: 285 },
];

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-lg shadow-lg p-3">
        <p className="font-medium mb-2">{label}</p>
        {payload.reverse().map((entry, index) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <div 
              className="w-3 h-3 rounded-sm" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-muted-foreground">{entry.name}:</span>
            <span className="font-semibold ml-auto">{entry.value}</span>
          </div>
        ))}
        <div className="border-t border-border mt-2 pt-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Total:</span>
            <span className="font-semibold">
              {payload.reduce((sum, entry) => sum + entry.value, 0)}
            </span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

interface VisitorsChartProps {
  height?: number;
}

export function VisitorsChart({ height = 320 }: VisitorsChartProps) {
  const totalVisitors = visitorData.reduce((sum, d) => sum + d.mobile + d.desktop, 0);
  const avgDaily = Math.round(totalVisitors / visitorData.length);
  const latestTotal = visitorData[visitorData.length - 1].mobile + visitorData[visitorData.length - 1].desktop;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Total Visitors</CardTitle>
            <CardDescription>
              Attendance for the last month
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm">Last 3 months</Button>
            <Button variant="ghost" size="sm">Last 30 days</Button>
            <Button variant="ghost" size="sm" className="bg-accent/10">Last 7 days</Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          <AreaChart 
            data={visitorData}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              {/* Desktop Gradient - Dark Blue/Gray */}
              <linearGradient id="desktopGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#60a5fa" stopOpacity={0.4}/>
                <stop offset="100%" stopColor="#60a5fa" stopOpacity={0.05}/>
              </linearGradient>
              {/* Mobile Gradient - Green */}
              <linearGradient id="mobileGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.5}/>
                <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="hsl(var(--border))" 
              strokeOpacity={0.3}
              vertical={false}
            />
            
            <XAxis 
              dataKey="date" 
              stroke="hsl(var(--muted-foreground))"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              dy={10}
            />
            
            <YAxis 
              stroke="hsl(var(--muted-foreground))"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              dx={-10}
            />
            
            <Tooltip content={<CustomTooltip />} />
            
            {/* Stack areas - Desktop first (bottom), then Mobile (top) */}
            <Area
              type="monotone"
              dataKey="desktop"
              stackId="1"
              stroke="#60a5fa"
              strokeWidth={1.5}
              fill="url(#desktopGradient)"
              name="Desktop"
            />
            <Area
              type="monotone"
              dataKey="mobile"
              stackId="1"
              stroke="hsl(var(--primary))"
              strokeWidth={1.5}
              fill="url(#mobileGradient)"
              name="Mobile"
            />
          </AreaChart>
        </ResponsiveContainer>

        {/* Legend and Stats */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-[#60a5fa]" />
              <span className="text-sm text-muted-foreground">Mobile</span>
              <span className="text-sm font-semibold ml-1">
                {visitorData[visitorData.length - 1].mobile}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: 'hsl(var(--primary))' }} />
              <span className="text-sm text-muted-foreground">Desktop</span>
              <span className="text-sm font-semibold ml-1">
                {visitorData[visitorData.length - 1].desktop}
              </span>
            </div>
          </div>
          <div className="text-sm text-muted-foreground">
            Average: <span className="font-semibold text-foreground">{avgDaily}</span> per day
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
