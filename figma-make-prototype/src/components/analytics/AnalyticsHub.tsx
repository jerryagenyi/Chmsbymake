/**
 * ChurchAfrica ChMS - Analytics Hub
 * Central dashboard for accessing all analytics modules
 */

import React from 'react';
import {
  Users,
  TrendingUp,
  Activity,
  Heart,
  BarChart3,
  Zap,
  ArrowUp,
  ArrowDown,
  Minus,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { PageHeader, StatCard } from '../layout/PageHeader';
import type { AnalyticsModule } from '../../types/analytics';

interface AnalyticsCard {
  id: AnalyticsModule;
  title: string;
  description: string;
  icon: any;
  color: string;
  bgColor: string;
  stats?: {
    value: string;
    label: string;
    trend?: number;
  }[];
}

interface AnalyticsHubProps {
  onSelectModule: (moduleId: AnalyticsModule) => void;
}

export function AnalyticsHub({ onSelectModule }: AnalyticsHubProps) {
  const analyticsModules: AnalyticsCard[] = [
    {
      id: 'membership',
      title: 'Membership Analytics',
      description: 'Growth, retention, demographics, and member lifecycle analysis',
      icon: Users,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      stats: [
        { value: '342', label: 'Total Members', trend: 16.3 },
        { value: '287', label: 'Active', trend: 18.2 },
        { value: '91.2%', label: 'Retention', trend: 2.1 },
      ],
    },
    {
      id: 'attendance',
      title: 'Attendance Analytics',
      description: 'Service attendance trends, patterns, and participation metrics',
      icon: Activity,
      color: 'text-blue-400',
      bgColor: 'bg-blue-400/10',
      stats: [
        { value: '110', label: 'Avg Attendance', trend: 12.8 },
        { value: '67.8%', label: 'Attendance Rate', trend: 5.4 },
        { value: '168', label: 'Total Services', trend: 8.0 },
      ],
    },
    {
      id: 'engagement',
      title: 'Engagement Analytics',
      description: 'Member engagement scoring, segments, and activity patterns',
      icon: Heart,
      color: 'text-pink-400',
      bgColor: 'bg-pink-400/10',
      stats: [
        { value: '72.5', label: 'Engagement Score', trend: 6.0 },
        { value: '98', label: 'Champions', trend: 12.0 },
        { value: '21', label: 'At Risk', trend: -15.0 },
      ],
    },
    {
      id: 'church_health',
      title: 'Church Health',
      description: 'Overall health indicators, benchmarks, and recommendations',
      icon: TrendingUp,
      color: 'text-green-400',
      bgColor: 'bg-green-400/10',
      stats: [
        { value: '78.5', label: 'Health Score', trend: 4.2 },
        { value: 'Good', label: 'Health Grade', trend: 0 },
        { value: '5', label: 'Strengths', trend: 0 },
      ],
    },
    {
      id: 'combined',
      title: 'Combined Dashboard',
      description: 'Comprehensive view with correlations and key insights',
      icon: BarChart3,
      color: 'text-purple-400',
      bgColor: 'bg-purple-400/10',
      stats: [
        { value: '0.78', label: 'Attend/Give Corr', trend: 0 },
        { value: '6', label: 'Key Insights', trend: 0 },
        { value: '3', label: 'Branches', trend: 0 },
      ],
    },
    {
      id: 'giving',
      title: 'Giving Analytics',
      description: 'Donor analytics, trends, and financial health metrics',
      icon: Zap,
      color: 'text-orange-400',
      bgColor: 'bg-orange-400/10',
      stats: [
        { value: '₦892K', label: 'Total Giving', trend: 15.7 },
        { value: '₦2,607', label: 'Per Capita', trend: -0.5 },
        { value: '68.4%', label: 'Consistency', trend: 3.2 },
      ],
    },
  ];

  const getTrendIcon = (trend?: number) => {
    if (!trend || trend === 0) return <Minus className="h-3 w-3" />;
    if (trend > 0) return <ArrowUp className="h-3 w-3" />;
    return <ArrowDown className="h-3 w-3" />;
  };

  const getTrendColor = (trend?: number) => {
    if (!trend || trend === 0) return 'text-muted-foreground';
    if (trend > 0) return 'text-green-400';
    return 'text-red-400';
  };

  // Prepare stats for PageHeader
  const statCards: StatCard[] = [
    {
      label: 'Total Members',
      value: 342,
      icon: Users,
      iconColor: 'text-primary',
      valueColor: 'text-primary',
    },
    {
      label: 'Avg Attendance',
      value: 110,
      icon: Activity,
      iconColor: 'text-blue-400',
      valueColor: 'text-blue-400',
    },
    {
      label: 'Engagement Score',
      value: 72.5,
      icon: Heart,
      iconColor: 'text-pink-400',
      valueColor: 'text-pink-400',
    },
    {
      label: 'Health Score',
      value: 78.5,
      icon: TrendingUp,
      iconColor: 'text-green-400',
      valueColor: 'text-green-400',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Church Analytics"
        description="Comprehensive analytics across membership, attendance, engagement, and church health"
        stats={statCards}
      />

      {/* Analytics Modules */}
      <div>
        <h2 className="text-lg mb-4">Analytics Modules</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {analyticsModules.map((module) => {
            const Icon = module.icon;
            return (
              <Card
                key={module.id}
                className="hover:border-primary/40 transition-all cursor-pointer"
                onClick={() => onSelectModule(module.id)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <div className={`p-2 rounded-lg ${module.bgColor}`}>
                      <Icon className={`h-5 w-5 ${module.color}`} />
                    </div>
                  </div>
                  <CardTitle className="text-lg">{module.title}</CardTitle>
                  <CardDescription className="text-sm">
                    {module.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {module.stats && (
                    <div className="space-y-2 mb-4">
                      {module.stats.map((stat, index) => (
                        <div key={index} className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">{stat.label}</span>
                          <div className="flex items-center gap-1">
                            <span className="font-medium">{stat.value}</span>
                            {stat.trend !== undefined && (
                              <Badge
                                variant="outline"
                                className={`text-xs ${getTrendColor(stat.trend)}`}
                              >
                                {getTrendIcon(stat.trend)}
                                {Math.abs(stat.trend)}%
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  <Button
                    variant="default"
                    className="w-full bg-primary hover:bg-primary/90"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectModule(module.id);
                    }}
                  >
                    View Analytics
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Feature Info */}
      <Card>
        <CardHeader>
          <CardTitle>Analytics Features</CardTitle>
          <CardDescription>What you can do with Church Analytics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium">Membership Analytics</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Track growth and retention trends</li>
                <li>• Analyze demographics and age groups</li>
                <li>• Monitor member lifecycle stages</li>
                <li>• Compare branch performance</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Attendance Analytics</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Service-by-service attendance trends</li>
                <li>• Track first-time visitors</li>
                <li>• Analyze attendance patterns</li>
                <li>• Identify attendance frequency</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Engagement Analytics</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Calculate engagement scores</li>
                <li>• Segment members by engagement</li>
                <li>• Identify at-risk members</li>
                <li>• Track top contributors</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Church Health</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Overall health scoring</li>
                <li>• Benchmark against best practices</li>
                <li>• Identify strengths and weaknesses</li>
                <li>• Get actionable recommendations</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}