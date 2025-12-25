/**
 * ChurchAfrica ChMS - Analytics Type Definitions
 * Comprehensive analytics for membership, attendance, and church-wide metrics
 */

import type { DateRange } from './reports';

export type AnalyticsModule = 
  | 'membership'
  | 'attendance'
  | 'giving'
  | 'engagement'
  | 'church_health'
  | 'combined';

export type TrendDirection = 'up' | 'down' | 'stable';
export type HealthScore = 'excellent' | 'good' | 'fair' | 'poor';

// Membership Analytics
export interface MembershipAnalytics {
  period: DateRange;
  total_members: number;
  active_members: number;
  inactive_members: number;
  new_members: number;
  member_retention_rate: number;
  growth_rate: number;
  churn_rate: number;
  average_member_age: number;
  gender_distribution: {
    male: number;
    female: number;
    other: number;
  };
  age_groups: {
    group: string; // e.g., "18-25", "26-35"
    count: number;
    percentage: number;
  }[];
  membership_by_status: {
    status: string;
    count: number;
    percentage: number;
  }[];
  growth_trend: {
    month: string;
    total: number;
    new: number;
    churned: number;
    net_growth: number;
  }[];
  top_growth_branches: {
    branch_id: string;
    branch_name: string;
    members: number;
    growth: number;
  }[];
}

// Attendance Analytics
export interface AttendanceAnalytics {
  period: DateRange;
  total_services: number;
  total_attendance: number;
  average_attendance: number;
  attendance_rate: number; // % of members attending
  unique_attendees: number;
  first_time_visitors: number;
  repeat_visitors: number;
  peak_attendance: number;
  peak_attendance_date: string;
  low_attendance: number;
  low_attendance_date: string;
  attendance_by_service: {
    service_id: string;
    service_name: string;
    service_type: string;
    total_attendance: number;
    average_attendance: number;
    trend: TrendDirection;
  }[];
  attendance_by_day: {
    day: string;
    attendance: number;
    services_count: number;
  }[];
  attendance_trend: {
    date: string;
    attendance: number;
    services: number;
    unique_members: number;
  }[];
  member_attendance_frequency: {
    frequency: string; // "Weekly", "Bi-weekly", "Monthly", "Occasional", "Rare"
    count: number;
    percentage: number;
  }[];
  top_branches_attendance: {
    branch_id: string;
    branch_name: string;
    attendance: number;
    average: number;
  }[];
}

// Engagement Analytics
export interface EngagementAnalytics {
  period: DateRange;
  overall_engagement_score: number; // 0-100
  highly_engaged_members: number;
  moderately_engaged_members: number;
  low_engagement_members: number;
  at_risk_members: number; // Not attending or giving recently
  engagement_by_category: {
    category: string; // "Attendance", "Giving", "Events", "Chat"
    score: number;
    trend: TrendDirection;
  }[];
  member_segments: {
    segment: string; // "Champions", "Active", "At Risk", "Dormant"
    count: number;
    percentage: number;
    characteristics: string;
  }[];
  engagement_trends: {
    month: string;
    attendance_engagement: number;
    giving_engagement: number;
    event_engagement: number;
    overall_score: number;
  }[];
  top_engaged_members: {
    member_id: string;
    member_name: string;
    engagement_score: number;
    attendance_rate: number;
    giving_frequency: number;
    event_participation: number;
  }[];
}

// Church Health Analytics
export interface ChurchHealthAnalytics {
  period: DateRange;
  overall_health_score: number; // 0-100
  health_grade: HealthScore;
  health_indicators: {
    indicator: string;
    score: number;
    status: HealthScore;
    trend: TrendDirection;
    benchmark: number; // Industry/recommended benchmark
  }[];
  growth_metrics: {
    membership_growth: number;
    attendance_growth: number;
    giving_growth: number;
    event_participation_growth: number;
  };
  retention_metrics: {
    member_retention_rate: number;
    first_timer_return_rate: number;
    active_member_retention: number;
  };
  financial_health: {
    total_giving: number;
    per_capita_giving: number;
    giving_consistency: number; // % of members giving regularly
    budget_vs_actual: number;
  };
  engagement_health: {
    average_attendance_rate: number;
    event_participation_rate: number;
    volunteer_participation_rate: number;
  };
  areas_of_strength: string[];
  areas_needing_attention: string[];
  recommended_actions: {
    action: string;
    priority: 'high' | 'medium' | 'low';
    impact: string;
  }[];
}

// Combined Analytics Dashboard
export interface CombinedAnalytics {
  period: DateRange;
  summary_cards: {
    total_members: { value: number; change: number; trend: TrendDirection };
    active_members: { value: number; change: number; trend: TrendDirection };
    average_attendance: { value: number; change: number; trend: TrendDirection };
    attendance_rate: { value: number; change: number; trend: TrendDirection };
    total_giving: { value: number; change: number; trend: TrendDirection };
    per_capita_giving: { value: number; change: number; trend: TrendDirection };
    engagement_score: { value: number; change: number; trend: TrendDirection };
    health_score: { value: number; change: number; trend: TrendDirection };
  };
  correlations: {
    attendance_vs_giving: number; // correlation coefficient
    engagement_vs_retention: number;
    events_vs_attendance: number;
  };
  member_lifecycle: {
    stage: string; // "Visitor", "New Member", "Growing", "Mature", "At Risk", "Inactive"
    count: number;
    percentage: number;
    avg_time_in_stage: number; // months
  }[];
  branch_comparison: {
    branch_id: string;
    branch_name: string;
    members: number;
    attendance_rate: number;
    giving_total: number;
    engagement_score: number;
    health_score: number;
  }[];
  key_insights: {
    insight: string;
    category: string;
    impact: 'positive' | 'negative' | 'neutral';
    recommendation?: string;
  }[];
}

// Real-time Dashboard Metrics
export interface RealTimeDashboard {
  current_service?: {
    service_id: string;
    service_name: string;
    start_time: string;
    current_attendance: number;
    expected_attendance: number;
    attendance_percentage: number;
    first_timers: number;
  };
  today_stats: {
    services_held: number;
    total_attendance: number;
    donations_received: number;
    donations_amount: number;
    new_members: number;
  };
  this_week: {
    services_scheduled: number;
    services_completed: number;
    total_attendance: number;
    average_attendance: number;
    total_giving: number;
    events_held: number;
  };
  live_counters: {
    online_members: number;
    active_chat_participants: number;
    pending_prayer_requests: number;
    upcoming_events_this_week: number;
  };
  alerts: {
    type: 'info' | 'warning' | 'success' | 'error';
    message: string;
    timestamp: string;
  }[];
}

// Predictive Analytics
export interface PredictiveAnalytics {
  period: DateRange;
  attendance_forecast: {
    date: string;
    predicted_attendance: number;
    confidence_interval: [number, number];
    factors: string[];
  }[];
  giving_forecast: {
    month: string;
    predicted_amount: number;
    confidence_interval: [number, number];
    based_on: string;
  }[];
  member_growth_projection: {
    month: string;
    projected_members: number;
    projected_active: number;
    projected_growth_rate: number;
  }[];
  churn_risk_members: {
    member_id: string;
    member_name: string;
    churn_probability: number;
    risk_factors: string[];
    recommended_interventions: string[];
  }[];
  high_potential_donors: {
    member_id: string;
    member_name: string;
    current_giving: number;
    predicted_capacity: number;
    engagement_score: number;
  }[];
}

// Custom Report Builder
export interface CustomReport {
  report_id: string;
  report_name: string;
  created_by: string;
  created_at: string;
  module: AnalyticsModule;
  fields: {
    field_id: string;
    field_name: string;
    field_type: 'metric' | 'dimension' | 'date' | 'filter';
    aggregation?: 'sum' | 'avg' | 'count' | 'min' | 'max';
  }[];
  filters: {
    field: string;
    operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains' | 'between';
    value: any;
  }[];
  grouping: string[];
  sorting: {
    field: string;
    direction: 'asc' | 'desc';
  }[];
  visualization: 'table' | 'bar_chart' | 'line_chart' | 'pie_chart' | 'card';
  schedule?: {
    frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
    time: string;
    recipients: string[];
    format: 'pdf' | 'csv' | 'excel';
  };
}

/**
 * Vue/Quasar Migration Notes:
 * 
 * // Pinia store for analytics
 * // stores/analytics.ts
 * import { defineStore } from 'pinia';
 * import { ref, computed } from 'vue';
 * 
 * export const useAnalyticsStore = defineStore('analytics', () => {
 *   const membershipAnalytics = ref<MembershipAnalytics | null>(null);
 *   const attendanceAnalytics = ref<AttendanceAnalytics | null>(null);
 *   const engagementAnalytics = ref<EngagementAnalytics | null>(null);
 *   const churchHealthAnalytics = ref<ChurchHealthAnalytics | null>(null);
 *   const realTimeDashboard = ref<RealTimeDashboard | null>(null);
 *   const loading = ref(false);
 * 
 *   // Fetch membership analytics
 *   const fetchMembershipAnalytics = async (filters: { period: DateRange }) => {
 *     loading.value = true;
 *     try {
 *       const response = await api.post('/api/analytics/membership', filters);
 *       membershipAnalytics.value = response.data;
 *     } finally {
 *       loading.value = false;
 *     }
 *   };
 * 
 *   // Fetch attendance analytics
 *   const fetchAttendanceAnalytics = async (filters: { period: DateRange }) => {
 *     loading.value = true;
 *     try {
 *       const response = await api.post('/api/analytics/attendance', filters);
 *       attendanceAnalytics.value = response.data;
 *     } finally {
 *       loading.value = false;
 *     }
 *   };
 * 
 *   // Fetch real-time dashboard
 *   const fetchRealTimeDashboard = async () => {
 *     const response = await api.get('/api/analytics/realtime');
 *     realTimeDashboard.value = response.data;
 *   };
 * 
 *   // Calculate engagement score
 *   const calculateEngagementScore = (member: Member) => {
 *     let score = 0;
 *     // Attendance (40 points)
 *     score += member.attendance_rate * 40;
 *     // Giving (30 points)
 *     score += (member.giving_frequency / 52) * 30;
 *     // Event participation (20 points)
 *     score += (member.events_attended / 12) * 20;
 *     // Chat/community (10 points)
 *     score += Math.min(member.chat_messages / 10, 1) * 10;
 *     return Math.round(score);
 *   };
 * 
 *   return {
 *     membershipAnalytics,
 *     attendanceAnalytics,
 *     engagementAnalytics,
 *     churchHealthAnalytics,
 *     realTimeDashboard,
 *     loading,
 *     fetchMembershipAnalytics,
 *     fetchAttendanceAnalytics,
 *     fetchRealTimeDashboard,
 *     calculateEngagementScore,
 *   };
 * });
 * 
 * // Laravel API endpoints
 * Route::middleware('auth:sanctum')->group(function () {
 *   // Analytics
 *   Route::post('/analytics/membership', [AnalyticsController::class, 'membership']);
 *   Route::post('/analytics/attendance', [AnalyticsController::class, 'attendance']);
 *   Route::post('/analytics/engagement', [AnalyticsController::class, 'engagement']);
 *   Route::post('/analytics/church-health', [AnalyticsController::class, 'churchHealth']);
 *   Route::get('/analytics/realtime', [AnalyticsController::class, 'realtime']);
 *   Route::post('/analytics/combined', [AnalyticsController::class, 'combined']);
 *   Route::post('/analytics/predictive', [AnalyticsController::class, 'predictive']);
 *   
 *   // Custom reports
 *   Route::get('/reports/custom', [CustomReportController::class, 'index']);
 *   Route::post('/reports/custom', [CustomReportController::class, 'create']);
 *   Route::put('/reports/custom/{id}', [CustomReportController::class, 'update']);
 *   Route::delete('/reports/custom/{id}', [CustomReportController::class, 'delete']);
 *   Route::post('/reports/custom/{id}/run', [CustomReportController::class, 'run']);
 *   Route::post('/reports/custom/{id}/schedule', [CustomReportController::class, 'schedule']);
 * });
 */
