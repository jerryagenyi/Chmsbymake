/**
 * ChurchAfrica ChMS - Church Health Analytics
 * Overall health indicators, benchmarks, and actionable recommendations
 */

import React from 'react';
import {
  Heart,
  TrendingUp,
  TrendingDown,
  Minus,
  CheckCircle2,
  AlertTriangle,
  Target,
  Lightbulb,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
} from 'recharts';
import type { ChurchHealthAnalytics, HealthScore } from '../../types/analytics';

interface ChurchHealthAnalyticsProps {
  analytics: ChurchHealthAnalytics;
  onBack: () => void;
}

const HEALTH_COLORS = {
  excellent: '#1CE479',
  good: '#10B981',
  fair: '#F59E0B',
  poor: '#EF4444',
};

export function ChurchHealthAnalyticsComponent({ analytics, onBack }: ChurchHealthAnalyticsProps) {
  const getHealthColor = (grade: HealthScore) => HEALTH_COLORS[grade];
  
  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    if (trend === 'up') return <TrendingUp className="h-4 w-4 text-green-400" />;
    if (trend === 'down') return <TrendingDown className="h-4 w-4 text-red-400" />;
    return <Minus className="h-4 w-4 text-muted-foreground" />;
  };

  // Prepare radar chart data
  const radarData = analytics.health_indicators.map(indicator => ({
    indicator: indicator.indicator.split(' ').slice(0, 2).join(' '), // Shorten names
    score: indicator.score,
    benchmark: indicator.benchmark,
  }));

  // Prepare growth metrics data
  const growthData = [
    { name: 'Membership', value: analytics.growth_metrics.membership_growth },
    { name: 'Attendance', value: analytics.growth_metrics.attendance_growth },
    { name: 'Giving', value: analytics.growth_metrics.giving_growth },
    { name: 'Events', value: analytics.growth_metrics.event_participation_growth },
  ];

  const getPriorityColor = (priority: 'high' | 'medium' | 'low') => {
    if (priority === 'high') return 'text-red-400 border-red-400';
    if (priority === 'medium') return 'text-orange-400 border-orange-400';
    return 'text-blue-400 border-blue-400';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Button variant="ghost" onClick={onBack} className="mb-2 -ml-2">
            ← Back to Analytics Hub
          </Button>
          <h1 className="text-2xl mb-1">Church Health Analytics</h1>
          <p className="text-sm text-muted-foreground">
            Overall health indicators, benchmarks, and recommendations
          </p>
        </div>
      </div>

      {/* Overall Health Score */}
      <Card className="bg-gradient-to-br from-primary/10 to-transparent border-primary/20">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Overall Health Score</p>
              <div className="flex items-baseline gap-2">
                <h2 className="text-5xl font-bold" style={{ color: getHealthColor(analytics.health_grade) }}>
                  {analytics.overall_health_score.toFixed(1)}
                </h2>
                <span className="text-2xl text-muted-foreground">/ 100</span>
              </div>
              <Badge
                variant="outline"
                className="mt-2"
                style={{ color: getHealthColor(analytics.health_grade), borderColor: getHealthColor(analytics.health_grade) }}
              >
                {analytics.health_grade.toUpperCase()} HEALTH
              </Badge>
            </div>
            <div className="p-6 bg-primary/10 rounded-full">
              <Heart className="h-16 w-16 text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Health Indicators Radar */}
      <Card>
        <CardHeader>
          <CardTitle>Health Indicators</CardTitle>
          <CardDescription>Performance vs. benchmarks</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#1A1A20" />
              <PolarAngleAxis dataKey="indicator" stroke="#888888" fontSize={12} />
              <PolarRadiusAxis angle={90} domain={[0, 100]} stroke="#888888" />
              <Radar
                name="Your Score"
                dataKey="score"
                stroke="#1CE479"
                fill="#1CE479"
                fillOpacity={0.3}
                strokeWidth={2}
              />
              <Radar
                name="Benchmark"
                dataKey="benchmark"
                stroke="#888888"
                fill="#888888"
                fillOpacity={0.1}
                strokeWidth={1}
                strokeDasharray="5 5"
              />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Individual Health Indicators */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Health Indicators</CardTitle>
          <CardDescription>Individual metric performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics.health_indicators.map((indicator, index) => {
              const percentOfBenchmark = (indicator.score / indicator.benchmark) * 100;
              const isAboveBenchmark = indicator.score >= indicator.benchmark;
              
              return (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{indicator.indicator}</span>
                      <Badge
                        variant="outline"
                        style={{
                          color: getHealthColor(indicator.status),
                          borderColor: getHealthColor(indicator.status),
                        }}
                      >
                        {indicator.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm">
                        {indicator.score.toFixed(1)} / {indicator.benchmark.toFixed(1)}
                      </span>
                      {getTrendIcon(indicator.trend)}
                    </div>
                  </div>
                  <div className="relative h-2 bg-[#1A1A20] rounded-full overflow-hidden">
                    <div
                      className="absolute h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(percentOfBenchmark, 100)}%`,
                        backgroundColor: getHealthColor(indicator.status),
                      }}
                    />
                    {/* Benchmark marker */}
                    <div
                      className="absolute h-4 w-0.5 bg-white -mt-1"
                      style={{ left: '100%' }}
                    />
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-xs text-muted-foreground">
                      {isAboveBenchmark ? 'Above' : 'Below'} benchmark
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {percentOfBenchmark.toFixed(0)}% of target
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Growth Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Growth Metrics</CardTitle>
          <CardDescription>Year-over-year growth across key areas</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={growthData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1A1A20" />
              <XAxis dataKey="name" stroke="#888888" fontSize={12} />
              <YAxis stroke="#888888" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1A1A20',
                  border: '1px solid #2A2A30',
                  borderRadius: '8px',
                }}
                formatter={(value: number) => `${value.toFixed(1)}%`}
              />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {growthData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.value > 15 ? '#1CE479' : entry.value > 10 ? '#10B981' : '#F59E0B'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Retention & Engagement */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Retention Metrics</CardTitle>
            <CardDescription>Member retention performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">Member Retention Rate</span>
                  <span className="text-sm font-medium">{analytics.retention_metrics.member_retention_rate}%</span>
                </div>
                <div className="h-2 bg-[#1A1A20] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full"
                    style={{ width: `${analytics.retention_metrics.member_retention_rate}%` }}
                  />
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">First-Timer Return Rate</span>
                  <span className="text-sm font-medium">{analytics.retention_metrics.first_timer_return_rate}%</span>
                </div>
                <div className="h-2 bg-[#1A1A20] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-orange-400 rounded-full"
                    style={{ width: `${analytics.retention_metrics.first_timer_return_rate}%` }}
                  />
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">Active Member Retention</span>
                  <span className="text-sm font-medium">{analytics.retention_metrics.active_member_retention}%</span>
                </div>
                <div className="h-2 bg-[#1A1A20] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-400 rounded-full"
                    style={{ width: `${analytics.retention_metrics.active_member_retention}%` }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Engagement Health</CardTitle>
            <CardDescription>Member participation rates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">Average Attendance Rate</span>
                  <span className="text-sm font-medium">{analytics.engagement_health.average_attendance_rate}%</span>
                </div>
                <div className="h-2 bg-[#1A1A20] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full"
                    style={{ width: `${analytics.engagement_health.average_attendance_rate}%` }}
                  />
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">Event Participation Rate</span>
                  <span className="text-sm font-medium">{analytics.engagement_health.event_participation_rate}%</span>
                </div>
                <div className="h-2 bg-[#1A1A20] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-400 rounded-full"
                    style={{ width: `${analytics.engagement_health.event_participation_rate}%` }}
                  />
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">Volunteer Participation</span>
                  <span className="text-sm font-medium">{analytics.engagement_health.volunteer_participation_rate}%</span>
                </div>
                <div className="h-2 bg-[#1A1A20] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-purple-400 rounded-full"
                    style={{ width: `${analytics.engagement_health.volunteer_participation_rate}%` }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Areas of Strength */}
      <Card className="bg-green-500/5 border-green-500/20">
        <CardHeader>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-400" />
            <CardTitle>Areas of Strength</CardTitle>
          </div>
          <CardDescription>What your church is doing well</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {analytics.areas_of_strength.map((strength, index) => (
              <li key={index} className="flex items-start gap-2 text-sm">
                <CheckCircle2 className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                <span>{strength}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Areas Needing Attention */}
      <Card className="bg-orange-500/5 border-orange-500/20">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-400" />
            <CardTitle>Areas Needing Attention</CardTitle>
          </div>
          <CardDescription>Opportunities for improvement</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {analytics.areas_needing_attention.map((area, index) => (
              <li key={index} className="flex items-start gap-2 text-sm">
                <AlertTriangle className="h-4 w-4 text-orange-400 mt-0.5 flex-shrink-0" />
                <span>{area}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Recommended Actions */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-primary" />
            <CardTitle>Recommended Actions</CardTitle>
          </div>
          <CardDescription>Strategic initiatives to improve church health</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics.recommended_actions.map((action, index) => (
              <div key={index} className="p-4 bg-[#1A1A20] rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-primary flex-shrink-0" />
                    <h4 className="text-sm font-medium">{action.action}</h4>
                  </div>
                  <Badge variant="outline" className={getPriorityColor(action.priority)}>
                    {action.priority} priority
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  <strong>Expected Impact:</strong> {action.impact}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
