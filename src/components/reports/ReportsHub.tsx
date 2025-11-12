/**
 * ChurchAfrica ChMS - Reports Hub
 * Main reports dashboard with quick access to all report types
 */

import React from 'react';
import {
  FileText,
  TrendingUp,
  Users,
  Target,
  PieChart,
  BarChart3,
  Download,
  Calendar,
  Receipt,
  Building2,
  Clock,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

interface ReportCard {
  id: string;
  title: string;
  description: string;
  icon: any;
  color: string;
  bgColor: string;
  available: boolean;
}

interface ReportsHubProps {
  onSelectReport: (reportId: string) => void;
}

export function ReportsHub({ onSelectReport }: ReportsHubProps) {
  const reportCategories: ReportCard[] = [
    {
      id: 'service_comparison',
      title: 'Service Comparison',
      description: 'Compare attendance and engagement across different service types',
      icon: Clock,
      color: 'text-[#1CE479]',
      bgColor: 'bg-[#1CE479]/10',
      available: true,
    },
    {
      id: 'giving_summary',
      title: 'Giving Summary',
      description: 'Comprehensive overview of all donations with trends and breakdowns',
      icon: TrendingUp,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      available: true,
    },
    {
      id: 'donor_statements',
      title: 'Donor Statements',
      description: 'Individual donor giving history and annual statements',
      icon: Users,
      color: 'text-blue-400',
      bgColor: 'bg-blue-400/10',
      available: true,
    },
    {
      id: 'tax_receipts',
      title: 'Tax Receipts',
      description: 'Generate official tax receipts for donors',
      icon: Receipt,
      color: 'text-green-400',
      bgColor: 'bg-green-400/10',
      available: true,
    },
    {
      id: 'campaign_performance',
      title: 'Campaign Performance',
      description: 'Track fundraising campaign progress and donor engagement',
      icon: Target,
      color: 'text-purple-400',
      bgColor: 'bg-purple-400/10',
      available: true,
    },
    {
      id: 'branch_comparison',
      title: 'Branch Comparison',
      description: 'Compare giving metrics across all branches',
      icon: Building2,
      color: 'text-orange-400',
      bgColor: 'bg-orange-400/10',
      available: true,
    },
    {
      id: 'monthly_trends',
      title: 'Monthly Trends',
      description: 'Analyze giving patterns and growth over time',
      icon: BarChart3,
      color: 'text-pink-400',
      bgColor: 'bg-pink-400/10',
      available: true,
    },
    {
      id: 'category_analysis',
      title: 'Category Analysis',
      description: 'Breakdown by giving categories and payment methods',
      icon: PieChart,
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-400/10',
      available: true,
    },
    {
      id: 'attendance_reports',
      title: 'Attendance Reports',
      description: 'Service attendance trends and member participation',
      icon: Calendar,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-400/10',
      available: false,
    },
  ];

  const quickStats = [
    { label: 'Reports Generated', value: '1,245', trend: '+12%' },
    { label: 'Exports This Month', value: '89', trend: '+5%' },
    { label: 'Tax Receipts Issued', value: '234', trend: '+18%' },
    { label: 'Active Campaigns', value: '3', trend: '0%' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl mb-1">Reports & Analytics</h1>
        <p className="text-sm text-muted-foreground">
          Generate comprehensive reports and export data for analysis
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickStats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <Badge variant="outline" className="text-xs">
                  {stat.trend}
                </Badge>
              </div>
              <p className="text-2xl">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Report Categories */}
      <div>
        <h2 className="text-lg mb-4">Available Reports</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reportCategories.map((report) => {
            const Icon = report.icon;
            return (
              <Card
                key={report.id}
                className={`hover:border-primary/40 transition-all cursor-pointer ${
                  !report.available ? 'opacity-50' : ''
                }`}
                onClick={() => report.available && onSelectReport(report.id)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <div className={`p-2 rounded-lg ${report.bgColor}`}>
                      <Icon className={`h-5 w-5 ${report.color}`} />
                    </div>
                    {!report.available && (
                      <Badge variant="secondary" className="text-xs">
                        Coming Soon
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-lg">{report.title}</CardTitle>
                  <CardDescription className="text-sm">
                    {report.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    variant={report.available ? 'default' : 'outline'}
                    className={report.available ? 'w-full bg-primary hover:bg-primary/90' : 'w-full'}
                    size="sm"
                    disabled={!report.available}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (report.available) onSelectReport(report.id);
                    }}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    {report.available ? 'Generate Report' : 'Coming Soon'}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Recent Reports */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Reports</CardTitle>
              <CardDescription>Your recently generated reports and exports</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              {
                name: 'October Giving Summary',
                type: 'Giving Summary',
                date: '2024-10-24',
                format: 'PDF',
              },
              {
                name: 'Q3 2024 Donor Statements',
                type: 'Donor Statements',
                date: '2024-10-20',
                format: 'PDF',
              },
              {
                name: 'Building Campaign Report',
                type: 'Campaign Performance',
                date: '2024-10-18',
                format: 'CSV',
              },
              {
                name: 'Annual Tax Receipts 2024',
                type: 'Tax Receipts',
                date: '2024-10-15',
                format: 'PDF',
              },
            ].map((report, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-[#1A1A20] rounded-lg hover:bg-[#1A1A20]/70 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <FileText className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm mb-1">{report.name}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{report.type}</span>
                      <span>•</span>
                      <span>{new Date(report.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {report.format}
                  </Badge>
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Export Options */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Download className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="mb-1">Export Options</h3>
              <p className="text-sm text-muted-foreground mb-4">
                All reports can be exported in multiple formats: PDF for printing and sharing, 
                CSV for data analysis in Excel, or direct print for immediate use.
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">PDF Export</Badge>
                <Badge variant="outline">CSV Export</Badge>
                <Badge variant="outline">Print Ready</Badge>
                <Badge variant="outline">Email Delivery</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}