/**
 * ChurchAfrica ChMS - Mock Analytics Data
 * Sample data for membership, attendance, and church-wide analytics
 */

import type {
  MembershipAnalytics,
  AttendanceAnalytics,
  EngagementAnalytics,
  ChurchHealthAnalytics,
  CombinedAnalytics,
  RealTimeDashboard,
} from '../types/analytics';

// Mock Membership Analytics
export const mockMembershipAnalytics: MembershipAnalytics = {
  period: {
    start: '2024-01-01',
    end: '2024-10-31',
    preset: 'this_year',
  },
  total_members: 342,
  active_members: 287,
  inactive_members: 55,
  new_members: 48,
  member_retention_rate: 91.2,
  growth_rate: 16.3,
  churn_rate: 8.8,
  average_member_age: 34.5,
  gender_distribution: {
    male: 168,
    female: 162,
    other: 12,
  },
  age_groups: [
    { group: '0-17', count: 42, percentage: 12.3 },
    { group: '18-25', count: 68, percentage: 19.9 },
    { group: '26-35', count: 95, percentage: 27.8 },
    { group: '36-45', count: 72, percentage: 21.1 },
    { group: '46-55', count: 38, percentage: 11.1 },
    { group: '56-65', count: 18, percentage: 5.3 },
    { group: '66+', count: 9, percentage: 2.6 },
  ],
  membership_by_status: [
    { status: 'Active', count: 287, percentage: 83.9 },
    { status: 'Inactive', count: 55, percentage: 16.1 },
    { status: 'New', count: 48, percentage: 14.0 },
    { status: 'Visitor', count: 23, percentage: 6.7 },
  ],
  growth_trend: [
    { month: '2024-01', total: 294, new: 5, churned: 2, net_growth: 3 },
    { month: '2024-02', total: 298, new: 6, churned: 2, net_growth: 4 },
    { month: '2024-03', total: 305, new: 8, churned: 1, net_growth: 7 },
    { month: '2024-04', total: 309, new: 5, churned: 1, net_growth: 4 },
    { month: '2024-05', total: 315, new: 7, churned: 1, net_growth: 6 },
    { month: '2024-06', total: 320, new: 6, churned: 1, net_growth: 5 },
    { month: '2024-07', total: 326, new: 8, churned: 2, net_growth: 6 },
    { month: '2024-08', total: 332, new: 7, churned: 1, net_growth: 6 },
    { month: '2024-09', total: 338, new: 7, churned: 1, net_growth: 6 },
    { month: '2024-10', total: 342, new: 5, churned: 1, net_growth: 4 },
  ],
  top_growth_branches: [
    { branch_id: 'b1', branch_name: 'Lagos Headquarters', members: 198, growth: 18.5 },
    { branch_id: 'b3', branch_name: 'Accra Branch', members: 76, growth: 22.6 },
    { branch_id: 'b2', branch_name: 'Abuja Branch', members: 68, growth: 8.0 },
  ],
};

// Mock Attendance Analytics
export const mockAttendanceAnalytics: AttendanceAnalytics = {
  period: {
    start: '2024-01-01',
    end: '2024-10-31',
    preset: 'this_year',
  },
  total_services: 168,
  total_attendance: 18456,
  average_attendance: 109.9,
  attendance_rate: 67.8, // % of members attending on average
  unique_attendees: 312,
  first_time_visitors: 67,
  repeat_visitors: 245,
  peak_attendance: 245,
  peak_attendance_date: '2024-04-21', // Easter Sunday
  low_attendance: 48,
  low_attendance_date: '2024-08-04',
  attendance_by_service: [
    {
      service_id: 's1',
      service_name: 'Sunday Service (Lagos HQ)',
      service_type: 'Main Sunday Service',
      total_attendance: 8920,
      average_attendance: 168,
      trend: 'up',
    },
    {
      service_id: 's2',
      service_name: 'Sunday Service (Abuja)',
      service_type: 'Main Sunday Service',
      total_attendance: 3584,
      average_attendance: 67,
      trend: 'stable',
    },
    {
      service_id: 's3',
      service_name: 'Sunday Service (Accra)',
      service_type: 'Main Sunday Service',
      total_attendance: 2688,
      average_attendance: 50,
      trend: 'up',
    },
    {
      service_id: 's4',
      service_name: 'Midweek Service (Lagos)',
      service_type: 'Midweek Service',
      total_attendance: 1792,
      average_attendance: 42,
      trend: 'stable',
    },
    {
      service_id: 's5',
      service_name: 'Youth Service (Lagos)',
      service_type: 'Youth Service',
      total_attendance: 896,
      average_attendance: 28,
      trend: 'up',
    },
    {
      service_id: 's7',
      service_name: 'Prayer Meeting (Lagos)',
      service_type: 'Prayer Meeting',
      total_attendance: 576,
      average_attendance: 18,
      trend: 'down',
    },
  ],
  attendance_by_day: [
    { day: 'Sunday', attendance: 15192, services_count: 90 },
    { day: 'Wednesday', attendance: 2368, services_count: 48 },
    { day: 'Thursday', attendance: 576, services_count: 18 },
    { day: 'Friday', attendance: 320, services_count: 12 },
  ],
  attendance_trend: Array.from({ length: 40 }, (_, i) => {
    const date = new Date(2024, 0, i * 7 + 1);
    const baseAttendance = 110;
    const seasonalVariation = Math.sin(i / 4) * 20;
    const randomVariation = (Math.random() - 0.5) * 15;
    
    return {
      date: date.toISOString().split('T')[0],
      attendance: Math.round(baseAttendance + seasonalVariation + randomVariation),
      services: i % 4 === 0 ? 5 : 4,
      unique_members: Math.round((baseAttendance + seasonalVariation + randomVariation) * 0.85),
    };
  }),
  member_attendance_frequency: [
    { frequency: 'Weekly (4+ times/month)', count: 142, percentage: 41.5 },
    { frequency: 'Bi-weekly (2-3 times/month)', count: 89, percentage: 26.0 },
    { frequency: 'Monthly (1 time/month)', count: 54, percentage: 15.8 },
    { frequency: 'Occasional (1-3 times/quarter)', count: 38, percentage: 11.1 },
    { frequency: 'Rare (<1 time/quarter)', count: 19, percentage: 5.6 },
  ],
  top_branches_attendance: [
    { branch_id: 'b1', branch_name: 'Lagos Headquarters', attendance: 11584, average: 168 },
    { branch_id: 'b2', branch_name: 'Abuja Branch', attendance: 3584, average: 67 },
    { branch_id: 'b3', branch_name: 'Accra Branch', attendance: 3288, average: 61 },
  ],
};

// Mock Engagement Analytics
export const mockEngagementAnalytics: EngagementAnalytics = {
  period: {
    start: '2024-01-01',
    end: '2024-10-31',
    preset: 'this_year',
  },
  overall_engagement_score: 72.5,
  highly_engaged_members: 98,
  moderately_engaged_members: 156,
  low_engagement_members: 67,
  at_risk_members: 21,
  engagement_by_category: [
    { category: 'Attendance', score: 76.2, trend: 'up' },
    { category: 'Giving', score: 68.9, trend: 'stable' },
    { category: 'Events', score: 71.3, trend: 'up' },
    { category: 'Chat/Community', score: 73.8, trend: 'up' },
  ],
  member_segments: [
    {
      segment: 'Champions',
      count: 98,
      percentage: 28.7,
      characteristics: 'High attendance, consistent giving, active in events and community',
    },
    {
      segment: 'Active',
      count: 156,
      percentage: 45.6,
      characteristics: 'Regular attendance, occasional giving, participates in some events',
    },
    {
      segment: 'At Risk',
      count: 67,
      percentage: 19.6,
      characteristics: 'Declining attendance, minimal giving, low event participation',
    },
    {
      segment: 'Dormant',
      count: 21,
      percentage: 6.1,
      characteristics: 'Rarely attends, no recent giving, no event participation',
    },
  ],
  engagement_trends: [
    { month: '2024-01', attendance_engagement: 71.2, giving_engagement: 65.3, event_engagement: 68.7, overall_score: 68.4 },
    { month: '2024-02', attendance_engagement: 72.5, giving_engagement: 66.1, event_engagement: 69.8, overall_score: 69.5 },
    { month: '2024-03', attendance_engagement: 73.8, giving_engagement: 67.5, event_engagement: 70.2, overall_score: 70.5 },
    { month: '2024-04', attendance_engagement: 75.2, giving_engagement: 68.9, event_engagement: 71.8, overall_score: 72.0 },
    { month: '2024-05', attendance_engagement: 74.8, giving_engagement: 68.2, event_engagement: 70.9, overall_score: 71.3 },
    { month: '2024-06', attendance_engagement: 75.1, giving_engagement: 69.1, event_engagement: 71.5, overall_score: 71.9 },
    { month: '2024-07', attendance_engagement: 76.3, giving_engagement: 69.8, event_engagement: 72.1, overall_score: 72.7 },
    { month: '2024-08', attendance_engagement: 75.9, giving_engagement: 68.9, event_engagement: 71.3, overall_score: 72.0 },
    { month: '2024-09', attendance_engagement: 76.5, giving_engagement: 69.5, event_engagement: 71.9, overall_score: 72.6 },
    { month: '2024-10', attendance_engagement: 76.2, giving_engagement: 68.9, event_engagement: 71.3, overall_score: 72.5 },
  ],
  top_engaged_members: [
    {
      member_id: 'm1',
      member_name: 'Pastor Emmanuel Adeyemi',
      engagement_score: 95.8,
      attendance_rate: 98.0,
      giving_frequency: 52,
      event_participation: 18,
    },
    {
      member_id: 'm2',
      member_name: 'Sister Grace Okonkwo',
      engagement_score: 92.3,
      attendance_rate: 95.0,
      giving_frequency: 48,
      event_participation: 16,
    },
    {
      member_id: 'm5',
      member_name: 'Brother David Mensah',
      engagement_score: 89.7,
      attendance_rate: 92.0,
      giving_frequency: 44,
      event_participation: 15,
    },
    {
      member_id: 'm8',
      member_name: 'Sister Esther Kamau',
      engagement_score: 87.2,
      attendance_rate: 90.0,
      giving_frequency: 42,
      event_participation: 14,
    },
    {
      member_id: 'm12',
      member_name: 'Brother Samuel Nkrumah',
      engagement_score: 85.6,
      attendance_rate: 88.0,
      giving_frequency: 40,
      event_participation: 13,
    },
  ],
};

// Mock Church Health Analytics
export const mockChurchHealthAnalytics: ChurchHealthAnalytics = {
  period: {
    start: '2024-01-01',
    end: '2024-10-31',
    preset: 'this_year',
  },
  overall_health_score: 78.5,
  health_grade: 'good',
  health_indicators: [
    {
      indicator: 'Membership Growth',
      score: 82.3,
      status: 'good',
      trend: 'up',
      benchmark: 75.0,
    },
    {
      indicator: 'Attendance Rate',
      score: 76.8,
      status: 'good',
      trend: 'up',
      benchmark: 70.0,
    },
    {
      indicator: 'Giving Health',
      score: 73.2,
      status: 'good',
      trend: 'stable',
      benchmark: 70.0,
    },
    {
      indicator: 'Member Engagement',
      score: 72.5,
      status: 'good',
      trend: 'up',
      benchmark: 65.0,
    },
    {
      indicator: 'First-Timer Retention',
      score: 68.9,
      status: 'fair',
      trend: 'stable',
      benchmark: 75.0,
    },
    {
      indicator: 'Volunteer Participation',
      score: 65.4,
      status: 'fair',
      trend: 'down',
      benchmark: 70.0,
    },
  ],
  growth_metrics: {
    membership_growth: 16.3,
    attendance_growth: 12.8,
    giving_growth: 15.7,
    event_participation_growth: 18.9,
  },
  retention_metrics: {
    member_retention_rate: 91.2,
    first_timer_return_rate: 68.9,
    active_member_retention: 94.5,
  },
  financial_health: {
    total_giving: 892000,
    per_capita_giving: 2607,
    giving_consistency: 68.4, // % giving regularly
    budget_vs_actual: 103.7, // 103.7% of budget
  },
  engagement_health: {
    average_attendance_rate: 67.8,
    event_participation_rate: 45.2,
    volunteer_participation_rate: 32.6,
  },
  areas_of_strength: [
    'Strong membership growth (+16.3%)',
    'Excellent member retention (91.2%)',
    'Above-budget giving (103.7%)',
    'High engagement scores (72.5/100)',
    'Growing event participation (+18.9%)',
  ],
  areas_needing_attention: [
    'First-timer retention below benchmark (68.9% vs 75%)',
    'Declining volunteer participation',
    'At-risk member count growing (21 members)',
    'Midweek service attendance declining',
  ],
  recommended_actions: [
    {
      action: 'Implement first-timer follow-up program',
      priority: 'high',
      impact: 'Improve retention from 68.9% to 75%+',
    },
    {
      action: 'Launch volunteer recruitment campaign',
      priority: 'high',
      impact: 'Increase volunteer rate from 32.6% to 40%',
    },
    {
      action: 'Create re-engagement strategy for at-risk members',
      priority: 'medium',
      impact: 'Reduce churn rate from 8.8% to <5%',
    },
    {
      action: 'Revitalize midweek service format',
      priority: 'medium',
      impact: 'Increase midweek attendance by 20%',
    },
    {
      action: 'Expand small group ministry',
      priority: 'low',
      impact: 'Increase overall engagement by 5-10 points',
    },
  ],
};

// Mock Combined Analytics
export const mockCombinedAnalytics: CombinedAnalytics = {
  period: {
    start: '2024-01-01',
    end: '2024-10-31',
    preset: 'this_year',
  },
  summary_cards: {
    total_members: { value: 342, change: 16.3, trend: 'up' },
    active_members: { value: 287, change: 18.2, trend: 'up' },
    average_attendance: { value: 110, change: 12.8, trend: 'up' },
    attendance_rate: { value: 67.8, change: 5.4, trend: 'up' },
    total_giving: { value: 892000, change: 15.7, trend: 'up' },
    per_capita_giving: { value: 2607, change: -0.5, trend: 'stable' },
    engagement_score: { value: 72.5, change: 6.0, trend: 'up' },
    health_score: { value: 78.5, change: 4.2, trend: 'up' },
  },
  correlations: {
    attendance_vs_giving: 0.78, // Strong positive correlation
    engagement_vs_retention: 0.85, // Very strong positive correlation
    events_vs_attendance: 0.62, // Moderate positive correlation
  },
  member_lifecycle: [
    { stage: 'Visitor', count: 23, percentage: 6.7, avg_time_in_stage: 0.5 },
    { stage: 'New Member', count: 48, percentage: 14.0, avg_time_in_stage: 3.2 },
    { stage: 'Growing', count: 89, percentage: 26.0, avg_time_in_stage: 8.5 },
    { stage: 'Mature', count: 127, percentage: 37.1, avg_time_in_stage: 24.7 },
    { stage: 'At Risk', count: 34, percentage: 9.9, avg_time_in_stage: 18.3 },
    { stage: 'Inactive', count: 21, percentage: 6.1, avg_time_in_stage: 6.8 },
  ],
  branch_comparison: [
    {
      branch_id: 'b1',
      branch_name: 'Lagos Headquarters',
      members: 198,
      attendance_rate: 70.2,
      giving_total: 534000,
      engagement_score: 74.8,
      health_score: 80.3,
    },
    {
      branch_id: 'b3',
      branch_name: 'Accra Branch',
      members: 76,
      attendance_rate: 68.5,
      giving_total: 267600,
      engagement_score: 71.2,
      health_score: 77.8,
    },
    {
      branch_id: 'b2',
      branch_name: 'Abuja Branch',
      members: 68,
      attendance_rate: 63.7,
      giving_total: 90400,
      engagement_score: 69.8,
      health_score: 75.2,
    },
  ],
  key_insights: [
    {
      insight: 'Strong correlation (0.78) between attendance and giving patterns',
      category: 'Giving',
      impact: 'positive',
      recommendation: 'Focus attendance growth initiatives to boost giving',
    },
    {
      insight: 'Highly engaged members have 94.5% retention vs 85% for low engagement',
      category: 'Engagement',
      impact: 'positive',
      recommendation: 'Invest in engagement programs to improve retention',
    },
    {
      insight: 'Lagos HQ outperforms other branches across all metrics',
      category: 'Branches',
      impact: 'neutral',
      recommendation: 'Share best practices from Lagos to other branches',
    },
    {
      insight: '37% of members in "Mature" stage - largest segment',
      category: 'Lifecycle',
      impact: 'positive',
      recommendation: 'Create leadership development pathways for mature members',
    },
    {
      insight: 'First-timer return rate (68.9%) below industry benchmark (75%)',
      category: 'Retention',
      impact: 'negative',
      recommendation: 'Implement comprehensive first-timer follow-up system',
    },
    {
      insight: 'Event participation correlates moderately (0.62) with attendance',
      category: 'Events',
      impact: 'positive',
      recommendation: 'Use events as engagement tool to boost attendance',
    },
  ],
};

// Mock Real-Time Dashboard
export const mockRealTimeDashboard: RealTimeDashboard = {
  current_service: {
    service_id: 's1',
    service_name: 'Sunday Service (Lagos HQ)',
    start_time: '2024-10-27T10:00:00Z',
    current_attendance: 187,
    expected_attendance: 168,
    attendance_percentage: 111.3,
    first_timers: 4,
  },
  today_stats: {
    services_held: 3,
    total_attendance: 312,
    donations_received: 47,
    donations_amount: 124500,
    new_members: 2,
  },
  this_week: {
    services_scheduled: 8,
    services_completed: 5,
    total_attendance: 542,
    average_attendance: 108,
    total_giving: 387000,
    events_held: 2,
  },
  live_counters: {
    online_members: 89,
    active_chat_participants: 23,
    pending_prayer_requests: 7,
    upcoming_events_this_week: 3,
  },
  alerts: [
    {
      type: 'success',
      message: 'Sunday service attendance above expected! (111.3%)',
      timestamp: '2024-10-27T11:30:00Z',
    },
    {
      type: 'info',
      message: '4 first-time visitors today - follow-up needed',
      timestamp: '2024-10-27T11:25:00Z',
    },
    {
      type: 'warning',
      message: '21 members flagged as at-risk - intervention recommended',
      timestamp: '2024-10-27T09:00:00Z',
    },
  ],
};
