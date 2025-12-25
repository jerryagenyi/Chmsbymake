/**
 * ChurchAfrica ChMS - Service Comparison Report
 * Compare attendance and engagement metrics across different service types
 */

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { ScrollArea } from '../ui/scroll-area';
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Download,
  Calendar,
  Users,
  Clock,
  BarChart3,
  PieChart,
  Activity,
  Target,
  Minus,
} from 'lucide-react';
import {
  Service,
  SERVICE_TYPE_LABELS,
  SERVICE_TYPE_ICONS,
  SERVICE_TYPE_COLORS,
  getServiceTypeStats,
} from '../../types/service';
import { AttendanceRecord } from '../../types/attendance';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { cn } from '../ui/utils';

interface ServiceComparisonReportProps {
  services: Service[];
  attendanceRecords: AttendanceRecord[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  onBack?: () => void;
  onExport?: () => void;
}

export function ServiceComparisonReport({
  services,
  attendanceRecords,
  dateRange,
  onBack,
  onExport,
}: ServiceComparisonReportProps) {
  // Calculate statistics per service type
  const serviceTypeStats = React.useMemo(() => {
    const stats = getServiceTypeStats(services, attendanceRecords);
    
    return Object.entries(stats).map(([serviceType, data]) => ({
      serviceType: serviceType as Service['serviceType'],
      label: SERVICE_TYPE_LABELS[serviceType as Service['serviceType']],
      color: SERVICE_TYPE_COLORS[serviceType as Service['serviceType']],
      totalServices: data.count,
      totalAttendance: data.totalAttendance,
      averageAttendance: data.averageAttendance,
      attendanceRate: data.attendanceRate,
      trend: data.trend,
    }));
  }, [services, attendanceRecords]);

  // Prepare chart data
  const comparisonChartData = serviceTypeStats.map(stat => ({
    name: stat.label,
    average: Math.round(stat.averageAttendance),
    total: stat.totalAttendance,
    services: stat.totalServices,
    rate: Math.round(stat.attendanceRate * 100),
  }));

  // Pie chart data for service distribution
  const serviceDistributionData = serviceTypeStats.map(stat => ({
    name: stat.label,
    value: stat.totalServices,
  }));

  // Attendance distribution data
  const attendanceDistributionData = serviceTypeStats.map(stat => ({
    name: stat.label,
    value: stat.totalAttendance,
  }));

  // Chart colors
  const CHART_COLORS = [
    '#1CE479', // Primary green
    '#9D4EDD', // Purple
    '#06B6D4', // Cyan
    '#F59E0B', // Amber
    '#EF4444', // Red
    '#10B981', // Emerald
    '#8B5CF6', // Violet
    '#EC4899', // Pink
  ];

  const getTrendIcon = (trend?: number) => {
    if (!trend) return <Minus className="h-4 w-4 text-muted-foreground" />;
    if (trend > 0) return <TrendingUp className="h-4 w-4 text-success" />;
    if (trend < 0) return <TrendingDown className="h-4 w-4 text-destructive" />;
    return <Minus className="h-4 w-4 text-muted-foreground" />;
  };

  const formatTrend = (trend?: number) => {
    if (!trend) return 'No change';
    const sign = trend > 0 ? '+' : '';
    return `${sign}${trend.toFixed(1)}%`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          {onBack && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="mb-2 -ml-2"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          )}
          <h2 className="flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-[#1CE479]" />
            Service Comparison Report
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Compare attendance and engagement across service types
          </p>
        </div>
        
        {onExport && (
          <Button onClick={onExport} className="gap-2">
            <Download className="h-4 w-4" />
            Export Report
          </Button>
        )}
      </div>

      {/* Date Range Info */}
      {dateRange && (
        <Card className="bg-[#1A1A20] border-[#1CE479]/20">
          <CardContent className="py-4">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-[#1CE479]" />
              <span className="text-muted-foreground">Report Period:</span>
              <span className="font-medium">
                {dateRange.start.toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </span>
              <span className="text-muted-foreground">to</span>
              <span className="font-medium">
                {dateRange.end.toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Summary Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {serviceTypeStats.slice(0, 4).map((stat) => (
          <Card key={stat.serviceType} className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">
                  {stat.label}
                </CardTitle>
                <Badge
                  variant="outline"
                  className={cn(stat.color, "text-xs")}
                >
                  {stat.totalServices} services
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <div className="text-2xl font-bold">
                    {Math.round(stat.averageAttendance)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Avg. Attendance
                  </p>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Total</span>
                  <span className="font-medium">{stat.totalAttendance}</span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Rate</span>
                  <span className="font-medium">
                    {Math.round(stat.attendanceRate * 100)}%
                  </span>
                </div>
                
                {stat.trend !== undefined && (
                  <div className="flex items-center justify-between text-sm pt-2 border-t border-border">
                    <span className="text-muted-foreground">Trend</span>
                    <div className="flex items-center gap-1">
                      {getTrendIcon(stat.trend)}
                      <span
                        className={cn(
                          "font-medium",
                          stat.trend > 0 && "text-success",
                          stat.trend < 0 && "text-destructive"
                        )}
                      >
                        {formatTrend(stat.trend)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detailed Analysis Tabs */}
      <Tabs defaultValue="comparison" className="space-y-6">
        <TabsList className="bg-[#1A1A20]">
          <TabsTrigger value="comparison" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            Comparison
          </TabsTrigger>
          <TabsTrigger value="distribution" className="gap-2">
            <PieChart className="h-4 w-4" />
            Distribution
          </TabsTrigger>
          <TabsTrigger value="details" className="gap-2">
            <Activity className="h-4 w-4" />
            Details
          </TabsTrigger>
        </TabsList>

        {/* Comparison Charts */}
        <TabsContent value="comparison" className="space-y-6">
          {/* Average Attendance Bar Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Average Attendance by Service Type</CardTitle>
              <CardDescription>
                Compare average attendance across different service types
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={comparisonChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis
                      dataKey="name"
                      stroke="#888"
                      fontSize={12}
                      tickLine={false}
                    />
                    <YAxis
                      stroke="#888"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1A1A20',
                        border: '1px solid #333',
                        borderRadius: '8px',
                      }}
                    />
                    <Legend />
                    <Bar
                      dataKey="average"
                      fill="#1CE479"
                      radius={[8, 8, 0, 0]}
                      name="Average Attendance"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Attendance Rate Comparison */}
          <Card>
            <CardHeader>
              <CardTitle>Attendance Rate Comparison</CardTitle>
              <CardDescription>
                Percentage of expected vs actual attendance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={comparisonChartData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis
                      type="number"
                      stroke="#888"
                      fontSize={12}
                      tickLine={false}
                      domain={[0, 100]}
                    />
                    <YAxis
                      type="category"
                      dataKey="name"
                      stroke="#888"
                      fontSize={12}
                      tickLine={false}
                      width={120}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1A1A20',
                        border: '1px solid #333',
                        borderRadius: '8px',
                      }}
                      formatter={(value) => `${value}%`}
                    />
                    <Bar
                      dataKey="rate"
                      fill="#9D4EDD"
                      radius={[0, 8, 8, 0]}
                      name="Attendance Rate %"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Distribution Charts */}
        <TabsContent value="distribution" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Service Count Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Service Distribution</CardTitle>
                <CardDescription>
                  Number of services by type
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={serviceDistributionData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) =>
                          `${name}: ${(percent * 100).toFixed(0)}%`
                        }
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {serviceDistributionData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={CHART_COLORS[index % CHART_COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#1A1A20',
                          border: '1px solid #333',
                          borderRadius: '8px',
                        }}
                      />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Attendance Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Attendance Distribution</CardTitle>
                <CardDescription>
                  Total attendance by service type
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={attendanceDistributionData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) =>
                          `${name}: ${(percent * 100).toFixed(0)}%`
                        }
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {attendanceDistributionData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={CHART_COLORS[index % CHART_COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#1A1A20',
                          border: '1px solid #333',
                          borderRadius: '8px',
                        }}
                      />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Detailed Table */}
        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CardTitle>Detailed Service Statistics</CardTitle>
              <CardDescription>
                Complete breakdown of all service types
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px]">
                <div className="space-y-4">
                  {serviceTypeStats.map((stat) => (
                    <Card
                      key={stat.serviceType}
                      className="bg-[#1A1A20]"
                    >
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-base">
                            {stat.label}
                          </CardTitle>
                          <Badge
                            variant="outline"
                            className={stat.color}
                          >
                            {stat.totalServices} services
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <div className="text-2xl font-bold">
                              {Math.round(stat.averageAttendance)}
                            </div>
                            <p className="text-xs text-muted-foreground">
                              Avg. Attendance
                            </p>
                          </div>
                          
                          <div>
                            <div className="text-2xl font-bold">
                              {stat.totalAttendance}
                            </div>
                            <p className="text-xs text-muted-foreground">
                              Total Attendance
                            </p>
                          </div>
                          
                          <div>
                            <div className="text-2xl font-bold">
                              {Math.round(stat.attendanceRate * 100)}%
                            </div>
                            <p className="text-xs text-muted-foreground">
                              Attendance Rate
                            </p>
                          </div>
                          
                          <div>
                            <div className="flex items-center gap-2">
                              {getTrendIcon(stat.trend)}
                              <div
                                className={cn(
                                  "text-2xl font-bold",
                                  stat.trend && stat.trend > 0 && "text-success",
                                  stat.trend && stat.trend < 0 && "text-destructive"
                                )}
                              >
                                {formatTrend(stat.trend)}
                              </div>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              Trend vs Previous
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
