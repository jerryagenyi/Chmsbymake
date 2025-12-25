/**
 * ChurchAfrica ChMS - Giving Reports
 * Comprehensive giving reports with advanced filtering and export
 */

import React, { useState } from 'react';
import {
  Download,
  FileText,
  Printer,
  Filter,
  TrendingUp,
  Users,
  DollarSign,
  Calendar,
  ChevronDown,
  X,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import {
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
import type { GivingSummaryReport, DateRangePreset } from '../../types/reports';
import { formatCurrency, formatDate, exportDonationsToCSV, printReport } from '../../lib/export-utils';
import { mockDonations } from '../../lib/mock-giving-data';

interface GivingReportsProps {
  report: GivingSummaryReport;
  onBack: () => void;
}

const COLORS = {
  primary: '#1CE479',
  secondary: '#10B981',
  tertiary: '#3B82F6',
  quaternary: '#8B5CF6',
  warning: '#F59E0B',
  danger: '#EF4444',
};

export function GivingReports({ report, onBack }: GivingReportsProps) {
  const [dateRange, setDateRange] = useState<DateRangePreset>('this_month');
  const [showFilters, setShowFilters] = useState(false);

  // Prepare category data for charts
  const categoryData = Object.entries(report.by_category)
    .filter(([_, data]) => data.amount > 0)
    .map(([name, data]) => ({
      name: name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      amount: data.amount,
      count: data.count,
      percentage: data.percentage,
    }))
    .sort((a, b) => b.amount - a.amount);

  // Prepare payment method data
  const paymentData = Object.entries(report.by_payment_method)
    .filter(([_, data]) => data.amount > 0)
    .map(([name, data]) => ({
      name: name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      amount: data.amount,
      count: data.count,
    }));

  // Prepare branch data
  const branchData = Object.values(report.by_branch).map(branch => ({
    name: branch.branch_name,
    amount: branch.amount,
    count: branch.count,
  }));

  // Prepare daily trend data
  const trendData = report.daily_breakdown.slice(-14); // Last 14 days

  const handleExportPDF = () => {
    alert('PDF export functionality - In production, this would use jsPDF library');
    // In production: generatePDF('report-container', `giving-report-${report.period.start}.pdf`);
  };

  const handleExportCSV = () => {
    exportDonationsToCSV(mockDonations, `giving-report-${report.period.start}.csv`);
  };

  const handlePrint = () => {
    printReport();
  };

  return (
    <div className="space-y-6" id="report-container">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Button variant="ghost" onClick={onBack} className="mb-2 -ml-2">
            ← Back to Reports
          </Button>
          <h1 className="text-2xl mb-1">Giving Summary Report</h1>
          <p className="text-sm text-muted-foreground">
            {formatDate(report.period.start)} - {formatDate(report.period.end)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
            <Filter className="h-4 w-4 mr-2" />
            Filters
            <ChevronDown className={`h-4 w-4 ml-2 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </Button>
          <Button variant="outline" onClick={handlePrint} className="no-print">
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Button variant="outline" onClick={handleExportCSV} className="no-print">
            <FileText className="h-4 w-4 mr-2" />
            CSV
          </Button>
          <Button onClick={handleExportPDF} className="bg-primary hover:bg-primary/90 no-print">
            <Download className="h-4 w-4 mr-2" />
            PDF
          </Button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <Card className="no-print">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Report Filters</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setShowFilters(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="text-sm mb-2 block">Date Range</label>
                <Select value={dateRange} onValueChange={(v) => setDateRange(v as DateRangePreset)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="this_week">This Week</SelectItem>
                    <SelectItem value="last_week">Last Week</SelectItem>
                    <SelectItem value="this_month">This Month</SelectItem>
                    <SelectItem value="last_month">Last Month</SelectItem>
                    <SelectItem value="this_quarter">This Quarter</SelectItem>
                    <SelectItem value="this_year">This Year</SelectItem>
                    <SelectItem value="last_year">Last Year</SelectItem>
                    <SelectItem value="all_time">All Time</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm mb-2 block">Branch</label>
                <Select defaultValue="all">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Branches</SelectItem>
                    <SelectItem value="b1">Lagos HQ</SelectItem>
                    <SelectItem value="b2">Abuja Branch</SelectItem>
                    <SelectItem value="b3">Accra Branch</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm mb-2 block">Category</label>
                <Select defaultValue="all">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="tithe">Tithe</SelectItem>
                    <SelectItem value="offering">Offering</SelectItem>
                    <SelectItem value="building_fund">Building Fund</SelectItem>
                    <SelectItem value="missions">Missions</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm mb-2 block">Payment Method</label>
                <Select defaultValue="all">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Methods</SelectItem>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="mobile_money">Mobile Money</SelectItem>
                    <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 mt-4">
              <Button variant="outline" size="sm">Reset Filters</Button>
              <Button size="sm" className="bg-primary hover:bg-primary/90">Apply Filters</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Summary KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between mb-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <DollarSign className="h-5 w-5 text-primary" />
              </div>
            </div>
            <h3 className="text-2xl mb-1">{formatCurrency(report.total_amount, report.currency)}</h3>
            <p className="text-sm text-muted-foreground">Total Amount</p>
            <p className="text-xs text-muted-foreground mt-1">
              {report.transaction_count} transactions
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
            <h3 className="text-2xl mb-1">{report.donor_count}</h3>
            <p className="text-sm text-muted-foreground">Unique Donors</p>
            <p className="text-xs text-muted-foreground mt-1">
              Avg: {formatCurrency(report.average_donation, report.currency)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between mb-2">
              <div className="p-2 rounded-lg bg-green-400/10">
                <TrendingUp className="h-5 w-5 text-green-400" />
              </div>
            </div>
            <h3 className="text-2xl mb-1">{formatCurrency(report.largest_donation, report.currency)}</h3>
            <p className="text-sm text-muted-foreground">Largest Donation</p>
            <p className="text-xs text-muted-foreground mt-1">
              Smallest: {formatCurrency(report.smallest_donation, report.currency)}
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
            <h3 className="text-2xl mb-1">{report.daily_breakdown.length}</h3>
            <p className="text-sm text-muted-foreground">Days in Period</p>
            <p className="text-xs text-muted-foreground mt-1">
              Daily avg: {formatCurrency(report.total_amount / report.daily_breakdown.length, report.currency)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trend Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Daily Trend (Last 14 Days)</CardTitle>
            <CardDescription>Donation amounts per day</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={trendData}>
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
                  formatter={(value: number) => formatCurrency(value, report.currency)}
                />
                <Bar dataKey="amount" fill={COLORS.primary} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Category Breakdown</CardTitle>
            <CardDescription>Distribution by giving category</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="amount"
                  label={({ name, percentage }) => `${name} ${percentage.toFixed(0)}%`}
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
                  formatter={(value: number) => formatCurrency(value, report.currency)}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Details Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Donors */}
        <Card>
          <CardHeader>
            <CardTitle>Top Donors</CardTitle>
            <CardDescription>Highest contributors this period</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {report.top_donors.map((donor, index) => (
                <div
                  key={donor.donor_id}
                  className="flex items-center justify-between p-3 bg-[#1A1A20] rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-sm mb-1">{donor.donor_name}</p>
                      <p className="text-xs text-muted-foreground">
                        {donor.donation_count} donation{donor.donation_count > 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm font-medium">{formatCurrency(donor.amount, report.currency)}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Branch Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Branch Performance</CardTitle>
            <CardDescription>Giving by branch location</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {branchData.map((branch, index) => {
                const percentage = (branch.amount / report.total_amount) * 100;
                return (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm">{branch.name}</span>
                      <span className="text-sm font-medium">
                        {formatCurrency(branch.amount, report.currency)}
                      </span>
                    </div>
                    <div className="h-2 bg-[#1A1A20] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-xs text-muted-foreground">
                        {branch.count} transactions
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {percentage.toFixed(1)}%
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payment Methods */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Methods</CardTitle>
          <CardDescription>Breakdown by payment type</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {paymentData.map((method, index) => {
              const percentage = (method.amount / report.total_amount) * 100;
              return (
                <div key={index} className="p-4 bg-[#1A1A20] rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">{method.name}</p>
                  <p className="text-xl mb-2">{formatCurrency(method.amount, report.currency)}</p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{method.count} transactions</span>
                    <span>{percentage.toFixed(1)}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
