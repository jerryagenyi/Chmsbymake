/**
 * ChurchAfrica ChMS - Membership Analytics
 * Comprehensive membership growth, retention, and demographics analysis
 */

import React from 'react';
import {
  Users,
  UserPlus,
  UserMinus,
  TrendingUp,
  ArrowUp,
  ArrowDown,
  Building2,
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
import type { MembershipAnalytics } from '../../types/analytics';

interface MembershipAnalyticsProps {
  analytics: MembershipAnalytics;
  onBack: () => void;
}

const COLORS = ['#1CE479', '#10B981', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444', '#EC4899'];

export function MembershipAnalyticsComponent({ analytics, onBack }: MembershipAnalyticsProps) {
  // Prepare gender data for pie chart
  const genderData = [
    { name: 'Male', value: analytics.gender_distribution.male },
    { name: 'Female', value: analytics.gender_distribution.female },
    { name: 'Other', value: analytics.gender_distribution.other },
  ].filter(item => item.value > 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Button variant="ghost" onClick={onBack} className="mb-2 -ml-2">
            ← Back to Analytics Hub
          </Button>
          <h1 className="text-2xl mb-1">Membership Analytics</h1>
          <p className="text-sm text-muted-foreground">
            Growth, retention, demographics, and lifecycle analysis
          </p>
        </div>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between mb-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <Badge variant="outline" className="text-primary">
                <ArrowUp className="h-3 w-3 mr-1" />
                +{analytics.growth_rate}%
              </Badge>
            </div>
            <h3 className="text-2xl mb-1">{analytics.total_members}</h3>
            <p className="text-sm text-muted-foreground">Total Members</p>
            <p className="text-xs text-muted-foreground mt-1">
              {analytics.active_members} active ({((analytics.active_members / analytics.total_members) * 100).toFixed(1)}%)
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
            <h3 className="text-2xl mb-1">{analytics.new_members}</h3>
            <p className="text-sm text-muted-foreground">New Members</p>
            <p className="text-xs text-muted-foreground mt-1">
              This period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between mb-2">
              <div className="p-2 rounded-lg bg-blue-400/10">
                <TrendingUp className="h-5 w-5 text-blue-400" />
              </div>
            </div>
            <h3 className="text-2xl mb-1">{analytics.member_retention_rate}%</h3>
            <p className="text-sm text-muted-foreground">Retention Rate</p>
            <p className="text-xs text-muted-foreground mt-1">
              Churn: {analytics.churn_rate}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between mb-2">
              <div className="p-2 rounded-lg bg-purple-400/10">
                <Users className="h-5 w-5 text-purple-400" />
              </div>
            </div>
            <h3 className="text-2xl mb-1">{analytics.average_member_age.toFixed(1)}</h3>
            <p className="text-sm text-muted-foreground">Average Age</p>
            <p className="text-xs text-muted-foreground mt-1">
              Years old
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Growth Trend Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Membership Growth Trend</CardTitle>
          <CardDescription>Monthly growth, new members, and churn over time</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analytics.growth_trend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1A1A20" />
              <XAxis
                dataKey="month"
                stroke="#888888"
                fontSize={12}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return `${date.toLocaleString('default', { month: 'short' })}`;
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
              <Line type="monotone" dataKey="total" stroke="#1CE479" name="Total Members" strokeWidth={2} />
              <Line type="monotone" dataKey="new" stroke="#10B981" name="New Members" strokeWidth={2} />
              <Line type="monotone" dataKey="churned" stroke="#EF4444" name="Churned" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Demographics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Age Groups */}
        <Card>
          <CardHeader>
            <CardTitle>Age Distribution</CardTitle>
            <CardDescription>Members by age group</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={analytics.age_groups}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1A1A20" />
                <XAxis dataKey="group" stroke="#888888" fontSize={12} />
                <YAxis stroke="#888888" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1A1A20',
                    border: '1px solid #2A2A30',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="count" fill="#1CE479" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {analytics.age_groups.map((group, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{group.group} years</span>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{group.count}</span>
                    <span className="text-xs text-muted-foreground">({group.percentage}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Gender Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Gender Distribution</CardTitle>
            <CardDescription>Member demographics by gender</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={genderData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {genderData.map((entry, index) => (
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
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Male</span>
                <span className="font-medium">
                  {analytics.gender_distribution.male} ({((analytics.gender_distribution.male / analytics.total_members) * 100).toFixed(1)}%)
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Female</span>
                <span className="font-medium">
                  {analytics.gender_distribution.female} ({((analytics.gender_distribution.female / analytics.total_members) * 100).toFixed(1)}%)
                </span>
              </div>
              {analytics.gender_distribution.other > 0 && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Other</span>
                  <span className="font-medium">
                    {analytics.gender_distribution.other} ({((analytics.gender_distribution.other / analytics.total_members) * 100).toFixed(1)}%)
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Membership Status */}
      <Card>
        <CardHeader>
          <CardTitle>Membership Status</CardTitle>
          <CardDescription>Current member status distribution</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {analytics.membership_by_status.map((status, index) => (
              <div key={index} className="p-4 bg-[#1A1A20] rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">{status.status}</p>
                <p className="text-2xl mb-1">{status.count}</p>
                <p className="text-xs text-muted-foreground">{status.percentage}% of total</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Branch Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Branch Comparison</CardTitle>
          <CardDescription>Membership and growth by branch</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics.top_growth_branches.map((branch, index) => (
              <div key={branch.branch_id}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Building2 className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-sm font-medium">{branch.branch_name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium">{branch.members} members</span>
                    <Badge variant="outline" className={branch.growth > 0 ? 'text-green-400' : 'text-red-400'}>
                      {branch.growth > 0 ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
                      {branch.growth}%
                    </Badge>
                  </div>
                </div>
                <div className="h-2 bg-[#1A1A20] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-500"
                    style={{ width: `${(branch.members / analytics.total_members) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics Summary */}
      <Card className="bg-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle>Key Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <p>
              • <strong>Strong Growth:</strong> {analytics.growth_rate}% increase in total membership with {analytics.new_members} new members this period
            </p>
            <p>
              • <strong>High Retention:</strong> {analytics.member_retention_rate}% retention rate indicates healthy member satisfaction and engagement
            </p>
            <p>
              • <strong>Active Community:</strong> {((analytics.active_members / analytics.total_members) * 100).toFixed(1)}% of members are currently active
            </p>
            <p>
              • <strong>Demographic Balance:</strong> Good age distribution with strongest representation in {analytics.age_groups[0].group} age group
            </p>
            <p>
              • <strong>Branch Performance:</strong> {analytics.top_growth_branches[0].branch_name} leads with {analytics.top_growth_branches[0].growth}% growth
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
