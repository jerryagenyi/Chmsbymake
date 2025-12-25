/**
 * ChurchAfrica ChMS - Giving Dashboard
 * Main dashboard with KPIs, charts, and recent transactions
 */

import React from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  Users, 
  Calendar,
  Smartphone,
  Banknote,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  Plus,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
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
import type { Donation, GivingStats, GivingTrend } from '../../types/giving';

interface GivingDashboardProps {
  stats: GivingStats;
  trends: GivingTrend[];
  recentDonations: Donation[];
  onRecordDonation: () => void;
  onViewReports: () => void;
}

const COLORS = {
  primary: '#1CE479',
  secondary: '#10B981',
  tertiary: '#3B82F6',
  quaternary: '#8B5CF6',
  warning: '#F59E0B',
  danger: '#EF4444',
};

export function GivingDashboard({
  stats,
  trends,
  recentDonations,
  onRecordDonation,
  onViewReports,
}: GivingDashboardProps) {
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: stats.currency,
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Format number
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  // Prepare category data for pie chart
  const categoryData = Object.entries(stats.by_category)
    .filter(([_, value]) => value > 0)
    .map(([name, value]) => ({
      name: name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      value,
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 6);

  // Prepare payment method data
  const paymentMethodData = Object.entries(stats.by_payment_method)
    .filter(([_, value]) => value > 0)
    .map(([name, value]) => ({
      name: name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      value,
    }));

  // KPI Cards
  const kpiCards = [
    {
      title: 'Total This Month',
      value: formatCurrency(stats.total_this_month),
      icon: DollarSign,
      trend: stats.trend_vs_last_month,
      trendLabel: 'vs last month',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      title: 'Total This Year',
      value: formatCurrency(stats.total_this_year),
      icon: Calendar,
      subtitle: `${formatNumber(stats.donor_count_active)} active donors`,
      color: 'text-green-400',
      bgColor: 'bg-green-400/10',
    },
    {
      title: 'Active Donors',
      value: formatNumber(stats.donor_count_active),
      icon: Users,
      subtitle: `of ${formatNumber(stats.donor_count_total)} total`,
      color: 'text-blue-400',
      bgColor: 'bg-blue-400/10',
    },
    {
      title: 'Average Donation',
      value: formatCurrency(stats.average_donation),
      icon: TrendingUp,
      subtitle: `Largest: ${formatCurrency(stats.largest_donation)}`,
      color: 'text-purple-400',
      bgColor: 'bg-purple-400/10',
    },
  ];

  // Get payment method icon
  const getPaymentIcon = (method: string) => {
    switch (method) {
      case 'mobile_money':
        return <Smartphone className="h-4 w-4" />;
      case 'cash':
        return <Banknote className="h-4 w-4" />;
      case 'bank_transfer':
      case 'card':
        return <CreditCard className="h-4 w-4" />;
      default:
        return <DollarSign className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl mb-1">Giving & Donations</h1>
          <p className="text-sm text-muted-foreground">
            Track and manage church offerings, tithes, and special projects
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={onViewReports}>
            <Download className="h-4 w-4 mr-2" />
            Reports
          </Button>
          <Button onClick={onRecordDonation} className="bg-primary hover:bg-primary/90">
            <Plus className="h-4 w-4 mr-2" />
            Record Donation
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <Card key={index}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-2">
                  <div className={`p-2 rounded-lg ${card.bgColor}`}>
                    <Icon className={`h-5 w-5 ${card.color}`} />
                  </div>
                  {card.trend !== undefined && (
                    <div className={`flex items-center text-sm ${card.trend >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {card.trend >= 0 ? (
                        <ArrowUpRight className="h-4 w-4 mr-1" />
                      ) : (
                        <ArrowDownRight className="h-4 w-4 mr-1" />
                      )}
                      {Math.abs(card.trend)}%
                    </div>
                  )}
                </div>
                <h3 className="text-2xl mb-1">{card.value}</h3>
                <p className="text-sm text-muted-foreground">{card.title}</p>
                {card.subtitle && (
                  <p className="text-xs text-muted-foreground mt-1">{card.subtitle}</p>
                )}
                {card.trendLabel && (
                  <p className="text-xs text-muted-foreground mt-1">{card.trendLabel}</p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trend Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Giving Trends (Last 30 Days)</CardTitle>
            <CardDescription>Daily giving amounts and transaction count</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trends}>
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
                  formatter={(value: number, name: string) => {
                    if (name === 'amount') return [formatCurrency(value), 'Amount'];
                    return [value, 'Transactions'];
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke={COLORS.primary}
                  strokeWidth={2}
                  dot={false}
                  name="Amount"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>By Category</CardTitle>
            <CardDescription>Top giving categories</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  fill="#8884d8"
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {categoryData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={Object.values(COLORS)[index % Object.values(COLORS).length]} 
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1A1A20',
                    border: '1px solid #2A2A30',
                    borderRadius: '8px',
                  }}
                  formatter={(value: number) => formatCurrency(value)}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Payment Methods & Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Payment Methods */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Methods</CardTitle>
            <CardDescription>Breakdown by payment type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {paymentMethodData.map((method, index) => {
                const percentage = (method.value / stats.total_this_year) * 100;
                return (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{method.name}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {formatCurrency(method.value)}
                      </span>
                    </div>
                    <div className="h-2 bg-[#1A1A20] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {percentage.toFixed(1)}% of total
                    </p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Donations</CardTitle>
            <CardDescription>Latest transactions across all branches</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentDonations.slice(0, 5).map((donation) => (
                <div
                  key={donation.id}
                  className="flex items-center justify-between p-3 bg-[#1A1A20] rounded-lg hover:bg-[#1A1A20]/70 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      {getPaymentIcon(donation.payment_method)}
                    </div>
                    <div>
                      <p className="text-sm mb-1">
                        {donation.anonymous ? 'Anonymous Donor' : donation.donor_name}
                      </p>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {donation.category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </Badge>
                        {!donation.synced_to_server && (
                          <Badge variant="secondary" className="text-xs">
                            Offline
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm mb-1">
                      {formatCurrency(donation.amount)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(donation.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
