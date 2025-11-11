/**
 * ChurchAfrica ChMS - Attendance Analytics
 * Service attendance trends, patterns, and participation metrics
 */

import React from 'react';
import {
  Activity,
  TrendingUp,
  TrendingDown,
  Minus,
  Calendar,
  Users,
  UserPlus,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { AttendanceAnalytics } from '../../types/analytics';

interface AttendanceAnalyticsProps {
  analytics: AttendanceAnalytics;
  onBack: () => void;
}

const COLORS = ['#1CE479', '#10B981', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444'];

export function AttendanceAnalyticsComponent({ analytics, onBack }: AttendanceAnalyticsProps) {
  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    if (trend === 'up') return <TrendingUp className="h-4 w-4 text-green-400" />;
    if (trend === 'down') return <TrendingDown className="h-4 w-4 text-red-400" />;
    return <Minus className="h-4 w-4 text-muted-foreground" />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Button variant="ghost" onClick={onBack} className="mb-2 -ml-2">
            ← Back to Analytics Hub
          </Button>
          <h1 className="text-2xl mb-1">Attendance Analytics</h1>
          <p className="text-sm text-muted-foreground">
            Service attendance trends, patterns, and participation metrics
          </p>
        </div>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between mb-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <Activity className="h-5 w-5 text-primary" />
              </div>
            </div>
            <h3 className="text-2xl mb-1">{analytics.average_attendance.toFixed(0)}</h3>
            <p className="text-sm text-muted-foreground">Average Attendance</p>
            <p className="text-xs text-muted-foreground mt-1">
              {analytics.total_services} services
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between mb-2">
              <div className="p-2 rounded-lg bg-blue-400/10">
                <Users className="h-5 w-5 text-blue-400" />
              </div>
            </div>
            <h3 className="text-2xl mb-1">{analytics.attendance_rate}%</h3>
            <p className="text-sm text-muted-foreground">Attendance Rate</p>
            <p className="text-xs text-muted-foreground mt-1">
              {analytics.unique_attendees} unique
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between mb-2">
              <div className="p-2 rounded-lg bg-green-400/10">
                <UserPlus className="h-5 w-5 text-green-400" />
              </div>
            </div>
            <h3 className="text-2xl mb-1">{analytics.first_time_visitors}</h3>
            <p className="text-sm text-muted-foreground">First-Time Visitors</p>
            <p className="text-xs text-muted-foreground mt-1">
              {analytics.repeat_visitors} repeat
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between mb-2">
              <div className="p-2 rounded-lg bg-purple-400/10">
                <Calendar className="h-5 w-5 text-purple-400" />
              </div>
            </div>
            <h3 className="text-2xl mb-1">{analytics.peak_attendance}</h3>
            <p className="text-sm text-muted-foreground">Peak Attendance</p>
            <p className="text-xs text-muted-foreground mt-1">
              {new Date(analytics.peak_attendance_date).toLocaleDateString()}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Attendance Trend */}
      <Card>
        <CardHeader>
          <CardTitle>Attendance Trend</CardTitle>
          <CardDescription>Weekly attendance over time</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analytics.attendance_trend.slice(-20)}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1A1A20" />
              <XAxis
                dataKey="date"
                stroke="#888888"
                fontSize={12}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return `${date.getDate()}/${date.getMonth() + 1}`;
                }}
              />
              <YAxis stroke="#888888" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1A1A20',
                  border: '1px solid #2A2A30',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="attendance"
                stroke="#1CE479"
                name="Total Attendance"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="unique_members"
                stroke="#3B82F6"
                name="Unique Members"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Service Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Service Performance</CardTitle>
          <CardDescription>Attendance by service type</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics.attendance_by_service.map((service, index) => {
              const percentage = (service.total_attendance / analytics.total_attendance) * 100;
              return (
                <div key={service.service_id}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{service.service_name}</span>
                      <Badge variant="outline" className="text-xs">
                        {service.service_type}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm">
                        Avg: {service.average_attendance.toFixed(0)}
                      </span>
                      {getTrendIcon(service.trend)}
                    </div>
                  </div>
                  <div className="h-2 bg-[#1A1A20] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-xs text-muted-foreground">
                      Total: {service.total_attendance}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {percentage.toFixed(1)}% of all attendance
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Day of Week Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Attendance by Day</CardTitle>
            <CardDescription>Total attendance per day of week</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={analytics.attendance_by_day}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1A1A20" />
                <XAxis dataKey="day" stroke="#888888" fontSize={12} />
                <YAxis stroke="#888888" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1A1A20',
                    border: '1px solid #2A2A30',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="attendance" fill="#1CE479" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Member Attendance Frequency</CardTitle>
            <CardDescription>How often members attend</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={analytics.member_attendance_frequency}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="count"
                  label={({ frequency, percentage }) => `${percentage}%`}
                >
                  {analytics.member_attendance_frequency.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1A1A20',
                    border: '1px solid #2A2A30',
                    borderRadius: '8px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {analytics.member_attendance_frequency.map((freq, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{freq.frequency}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{freq.count}</span>
                    <span className="text-xs text-muted-foreground">({freq.percentage}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Branch Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Branch Attendance</CardTitle>
          <CardDescription>Attendance comparison across branches</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {analytics.top_branches_attendance.map((branch, index) => (
              <div key={branch.branch_id} className="p-4 bg-[#1A1A20] rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">{branch.branch_name}</p>
                <p className="text-2xl mb-1">{branch.attendance.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">
                  Average: {branch.average.toFixed(0)} per service
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Key Insights */}
      <Card className="bg-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle>Key Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <p>
              • <strong>Healthy Attendance Rate:</strong> {analytics.attendance_rate}% of members attend regularly, indicating strong engagement
            </p>
            <p>
              • <strong>Growing Reach:</strong> {analytics.first_time_visitors} first-time visitors this period show effective outreach
            </p>
            <p>
              • <strong>Peak Performance:</strong> Highest attendance of {analytics.peak_attendance} achieved on {new Date(analytics.peak_attendance_date).toLocaleDateString()}
            </p>
            <p>
              • <strong>Consistent Attendance:</strong> {analytics.member_attendance_frequency[0].count} members ({analytics.member_attendance_frequency[0].percentage}%) attend weekly
            </p>
            <p>
              • <strong>Total Reach:</strong> {analytics.unique_attendees} unique individuals reached across {analytics.total_services} services
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
