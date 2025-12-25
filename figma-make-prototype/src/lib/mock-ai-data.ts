/**
 * ChurchAfrica ChMS - Mock AI & ML Data
 * Sample data for predictive analytics and AI insights
 */

import type {
  ChurnPrediction,
  GivingForecast,
  AttendanceForecast,
  AIInsight,
  MemberRecommendation,
  AnomalyDetection,
  PrayerRequestAnalysis,
} from '../types/ai-ml';

// Mock Churn Predictions
export const mockChurnPredictions: ChurnPrediction[] = [
  {
    member_id: 'm45',
    member_name: 'Brother Michael Osei',
    churn_probability: 87.3,
    risk_level: 'critical',
    confidence: 92.5,
    primary_risk_factors: [
      {
        factor: 'Declining Attendance',
        impact_score: 35,
        description: 'Attendance dropped from weekly to once per month over 3 months',
      },
      {
        factor: 'Zero Giving',
        impact_score: 28,
        description: 'No donations in the past 4 months (previously consistent donor)',
      },
      {
        factor: 'No Event Participation',
        impact_score: 24,
        description: 'Has not attended any events in 6 months',
      },
    ],
    recommended_interventions: [
      {
        intervention: 'Personal pastoral visit within 48 hours',
        priority: 'urgent',
        expected_impact: 'Could reduce churn probability by 40-50%',
        suggested_timeline: 'This week',
      },
      {
        intervention: 'Assign to small group for community connection',
        priority: 'high',
        expected_impact: 'Improve engagement and sense of belonging',
        suggested_timeline: 'Next 2 weeks',
      },
      {
        intervention: 'Check if facing financial difficulties (offer support)',
        priority: 'high',
        expected_impact: 'Address root cause if financial struggles exist',
        suggested_timeline: 'During pastoral visit',
      },
    ],
    historical_engagement: {
      attendance_trend: 'declining',
      giving_trend: 'declining',
      event_participation_trend: 'declining',
    },
    predicted_churn_date: '2024-12-15',
    similar_cases: 7,
  },
  {
    member_id: 'm67',
    member_name: 'Sister Fatima Nkrumah',
    churn_probability: 72.8,
    risk_level: 'high',
    confidence: 88.2,
    primary_risk_factors: [
      {
        factor: 'Attendance Gap',
        impact_score: 42,
        description: 'Missed 6 consecutive Sundays after previously attending regularly',
      },
      {
        factor: 'Life Stage Transition',
        impact_score: 31,
        description: 'Recent major life change (new job/relocation) detected',
      },
    ],
    recommended_interventions: [
      {
        intervention: 'Phone call from small group leader',
        priority: 'high',
        expected_impact: 'Understand reasons for absence, offer support',
        suggested_timeline: 'This week',
      },
      {
        intervention: 'Connect with online/midweek service options',
        priority: 'medium',
        expected_impact: 'Provide flexible attendance alternatives',
        suggested_timeline: 'Next 2 weeks',
      },
    ],
    historical_engagement: {
      attendance_trend: 'declining',
      giving_trend: 'stable',
      event_participation_trend: 'declining',
    },
    predicted_churn_date: '2025-01-20',
    similar_cases: 12,
  },
  {
    member_id: 'm23',
    member_name: 'Brother David Kamau',
    churn_probability: 58.4,
    risk_level: 'medium',
    confidence: 79.6,
    primary_risk_factors: [
      {
        factor: 'Reduced Engagement',
        impact_score: 38,
        description: 'Engagement score dropped 25 points in 2 months',
      },
      {
        factor: 'Chat Silence',
        impact_score: 20,
        description: 'Previously active in chat, no messages in 6 weeks',
      },
    ],
    recommended_interventions: [
      {
        intervention: 'Invite to upcoming men\'s fellowship event',
        priority: 'medium',
        expected_impact: 'Re-engage through peer connections',
        suggested_timeline: 'Next event (2 weeks)',
      },
    ],
    historical_engagement: {
      attendance_trend: 'stable',
      giving_trend: 'stable',
      event_participation_trend: 'declining',
    },
    similar_cases: 18,
  },
];

// Mock Giving Forecast
export const mockGivingForecast: GivingForecast = {
  period: {
    start: '2024-11-01',
    end: '2025-10-31',
    preset: 'next_year',
  },
  forecast_type: 'monthly',
  predictions: [
    {
      date: '2024-11',
      predicted_amount: 82500,
      lower_bound: 76000,
      upper_bound: 89000,
      confidence_score: 87.3,
      contributing_factors: ['Thanksgiving season boost', 'End-of-year giving campaign'],
    },
    {
      date: '2024-12',
      predicted_amount: 125000,
      lower_bound: 115000,
      upper_bound: 135000,
      confidence_score: 91.5,
      contributing_factors: ['Christmas season peak', 'Tax-deductible deadline', 'Year-end bonuses'],
    },
    {
      date: '2025-01',
      predicted_amount: 68000,
      lower_bound: 62000,
      upper_bound: 74000,
      confidence_score: 84.2,
      contributing_factors: ['Post-holiday dip', 'New Year commitments'],
    },
    {
      date: '2025-02',
      predicted_amount: 71000,
      lower_bound: 65000,
      upper_bound: 77000,
      confidence_score: 85.8,
      contributing_factors: ['Recovery from January dip', 'Valentine\'s initiatives'],
    },
    {
      date: '2025-03',
      predicted_amount: 76000,
      lower_bound: 70000,
      upper_bound: 82000,
      confidence_score: 86.5,
      contributing_factors: ['Easter campaign begins', 'Quarter-end giving'],
    },
    {
      date: '2025-04',
      predicted_amount: 95000,
      lower_bound: 88000,
      upper_bound: 102000,
      confidence_score: 89.2,
      contributing_factors: ['Easter season peak', 'Spring revival'],
    },
  ],
  total_predicted: 1050000,
  vs_current_trend: 17.5,
  seasonality_factors: [
    { month: 'December', multiplier: 1.52, reason: 'Christmas and year-end giving' },
    { month: 'April', multiplier: 1.18, reason: 'Easter season' },
    { month: 'November', multiplier: 1.08, reason: 'Thanksgiving' },
    { month: 'January', multiplier: 0.82, reason: 'Post-holiday recovery' },
  ],
  growth_projection: {
    conservative: 892000,
    moderate: 1050000,
    optimistic: 1180000,
  },
};

// Mock Attendance Forecast
export const mockAttendanceForecast: AttendanceForecast = {
  period: {
    start: '2024-11-01',
    end: '2024-12-31',
    preset: 'next_2_months',
  },
  predictions: [
    {
      date: '2024-11-03',
      day_of_week: 'Sunday',
      predicted_attendance: 168,
      lower_bound: 155,
      upper_bound: 181,
      confidence_score: 88.5,
    },
    {
      date: '2024-11-10',
      day_of_week: 'Sunday',
      predicted_attendance: 172,
      lower_bound: 158,
      upper_bound: 186,
      confidence_score: 87.2,
    },
    {
      date: '2024-11-24',
      day_of_week: 'Sunday',
      predicted_attendance: 145,
      lower_bound: 130,
      upper_bound: 160,
      confidence_score: 82.1,
      special_factors: ['Thanksgiving weekend - lower attendance expected'],
    },
    {
      date: '2024-12-01',
      day_of_week: 'Sunday',
      predicted_attendance: 185,
      lower_bound: 170,
      upper_bound: 200,
      confidence_score: 89.8,
      special_factors: ['Advent season begins', 'Christmas campaign launch'],
    },
    {
      date: '2024-12-25',
      day_of_week: 'Wednesday',
      predicted_attendance: 245,
      lower_bound: 225,
      upper_bound: 265,
      confidence_score: 93.5,
      special_factors: ['Christmas Day service - peak attendance'],
    },
  ],
  average_predicted: 175,
  peak_predicted: { date: '2024-12-25', attendance: 245 },
  low_predicted: { date: '2024-11-24', attendance: 145 },
  trend: 'growing',
};

// Mock AI Insights
export const mockAIInsights: AIInsight[] = [
  {
    insight_id: 'i1',
    generated_at: '2024-10-27T08:00:00Z',
    category: 'opportunity',
    title: 'Untapped Donor Potential Identified',
    description: '42 members with high engagement but low giving patterns detected. These members attend regularly and participate in events but contribute below their estimated capacity.',
    confidence: 91.5,
    impact: 'high',
    supporting_data: [
      { metric: 'Members Identified', value: 42 },
      { metric: 'Average Engagement Score', value: 78.3 },
      { metric: 'Average Annual Giving', value: '₦12,500' },
      { metric: 'Estimated Capacity', value: '₦35,000+' },
      { metric: 'Potential Additional Revenue', value: '₦945,000', context: 'If engagement translates to giving' },
    ],
    actionable_steps: [
      'Create targeted stewardship campaign for highly engaged, low-giving members',
      'Schedule personal conversations to understand barriers to giving',
      'Offer alternative giving methods (mobile money, standing orders)',
      'Share impact stories that resonate with their areas of engagement',
    ],
    priority: 1,
  },
  {
    insight_id: 'i2',
    generated_at: '2024-10-27T08:00:00Z',
    category: 'warning',
    title: 'First-Timer Retention Below Benchmark',
    description: 'Only 68.9% of first-time visitors return for a second visit, compared to industry benchmark of 75%. This represents a significant opportunity loss.',
    confidence: 95.2,
    impact: 'high',
    supporting_data: [
      { metric: 'First-Time Visitors (YTD)', value: 67 },
      { metric: 'Return Rate', value: '68.9%' },
      { metric: 'Industry Benchmark', value: '75%' },
      { metric: 'Gap', value: '-6.1%' },
      { metric: 'Lost Members (Est.)', value: 4, context: 'Per month if trend continues' },
    ],
    actionable_steps: [
      'Implement structured first-timer follow-up within 48 hours',
      'Train greeters and ushers on welcoming protocols',
      'Create first-timer welcome package with next steps',
      'Assign first-time visitors to connection team members',
      'Survey visitors who didn\'t return to understand reasons',
    ],
    priority: 1,
  },
  {
    insight_id: 'i3',
    generated_at: '2024-10-27T08:00:00Z',
    category: 'trend',
    title: 'Midweek Service Attendance Declining',
    description: 'Wednesday service attendance has decreased 18% over the past 3 months, despite Sunday service remaining stable.',
    confidence: 92.8,
    impact: 'medium',
    supporting_data: [
      { metric: '3-Month Avg (Current)', value: 42 },
      { metric: '3-Month Avg (Previous)', value: 51 },
      { metric: 'Decline', value: '-18%' },
      { metric: 'Sunday Service Trend', value: 'Stable (+2%)' },
    ],
    actionable_steps: [
      'Survey attendees about preferred midweek service time',
      'Evaluate content and format of midweek service',
      'Consider hybrid (online + in-person) option',
      'Test rotating midweek service times',
    ],
    priority: 2,
  },
  {
    insight_id: 'i4',
    generated_at: '2024-10-27T08:00:00Z',
    category: 'anomaly',
    title: 'Unusual Spike in Accra Branch Giving',
    description: 'Accra branch giving increased 156% in October compared to September average. Investigation shows this is due to a major one-time donation, not sustainable growth.',
    confidence: 97.3,
    impact: 'medium',
    supporting_data: [
      { metric: 'October Giving', value: '₦267,600' },
      { metric: 'September Giving', value: '₦104,500' },
      { metric: 'Increase', value: '+156%' },
      { metric: 'One-Time Donations', value: '₦150,000', context: '56% of October total' },
    ],
    actionable_steps: [
      'Adjust forecasts to account for one-time nature',
      'Send thank-you note to major donor',
      'Don\'t set unrealistic expectations for November',
      'Focus on growing regular donor base',
    ],
    priority: 3,
  },
  {
    insight_id: 'i5',
    generated_at: '2024-10-27T08:00:00Z',
    category: 'recommendation',
    title: 'Youth Service Shows Strong Growth Potential',
    description: 'Youth service (18-35 age group) attendance grew 28% in 6 months with minimal marketing. Demographic analysis suggests 40% growth potential with focused effort.',
    confidence: 86.7,
    impact: 'high',
    supporting_data: [
      { metric: 'Current Youth Service Attendance', value: 28 },
      { metric: '6-Month Growth', value: '+28%' },
      { metric: 'Youth in Church (Not Attending Youth Service)', value: 48 },
      { metric: 'Growth Potential', value: '40-50%', context: 'With targeted outreach' },
    ],
    actionable_steps: [
      'Allocate additional resources to youth ministry',
      'Create social media campaign targeting youth',
      'Survey youth for preferred service times and formats',
      'Develop youth leadership pipeline',
      'Partner with local universities/colleges',
    ],
    priority: 2,
  },
];

// Mock Member Recommendations
export const mockMemberRecommendations: MemberRecommendation[] = [
  {
    recommendation_id: 'r1',
    member_id: 'm15',
    member_name: 'Sister Joy Mensah',
    recommendation_type: 'volunteer_role',
    title: 'Excellent Fit for Children\'s Ministry Leader',
    description: 'Based on professional background in education, consistent attendance, high engagement, and expressed interests.',
    reason: 'Has teaching degree, volunteers regularly with kids programs, attends 95% of services, expressed interest in leadership',
    match_score: 94.2,
    confidence: 91.8,
    action_items: [
      { action: 'Schedule meeting with Children\'s Ministry Director', responsible_party: 'Pastor James', timeline: 'This week' },
      { action: 'Provide volunteer role description', responsible_party: 'Children\'s Ministry', timeline: 'Before meeting' },
      { action: 'Discuss training and onboarding timeline', responsible_party: 'HR/Admin', timeline: 'During meeting' },
    ],
    expected_impact: {
      engagement_increase: 15,
      retention_improvement: 25,
    },
  },
  {
    recommendation_id: 'r2',
    member_id: 'm34',
    member_name: 'Brother Samuel Adeyemi',
    recommendation_type: 'small_group',
    title: 'Join Men\'s Bible Study Group',
    description: 'Member shows signs of isolation despite regular attendance. Would benefit from deeper community connection.',
    reason: 'Attends alone, no small group participation, low social engagement score, same age bracket as existing group',
    match_score: 87.5,
    confidence: 84.3,
    action_items: [
      { action: 'Personal invitation from small group leader', responsible_party: 'Brother Emmanuel', timeline: 'Next Sunday' },
      { action: 'Share group meeting details and topics', responsible_party: 'Small Groups Coordinator', timeline: 'This week' },
    ],
    expected_impact: {
      engagement_increase: 32,
      retention_improvement: 40,
    },
  },
];

// Mock Anomaly Detection
export const mockAnomalies: AnomalyDetection[] = [
  {
    anomaly_id: 'a1',
    detected_at: '2024-10-27T09:15:00Z',
    category: 'giving',
    severity: 'medium',
    title: 'Sudden Drop in Mobile Money Donations',
    description: 'Mobile money donations decreased 42% this week compared to 4-week average with no technical issues reported.',
    metric_affected: 'Mobile Money Donation Volume',
    expected_value: 45,
    actual_value: 26,
    deviation_percentage: -42.2,
    confidence: 88.5,
    possible_causes: [
      'Network provider issues in Lagos area',
      'Competing mobile money promotions elsewhere',
      'Change in member payment preferences',
      'Seasonal variation (mid-month low)',
    ],
    recommended_actions: [
      'Check with mobile money provider for any technical issues',
      'Send reminder about mobile money option',
      'Survey members about payment preferences',
      'Monitor trend over next 2 weeks',
    ],
    historical_context: {
      has_occurred_before: true,
      last_occurrence: '2024-07-15',
      typical_resolution: 'Recovered within 2 weeks with no intervention',
    },
    auto_resolved: false,
  },
];

// Mock Prayer Request Analysis
export const mockPrayerRequestAnalysis: PrayerRequestAnalysis[] = [
  {
    prayer_request_id: 'pr1',
    member_id: 'm78',
    member_name: 'Sister Grace Okafor',
    request_text: 'Please pray for my family. My husband lost his job two months ago and we are struggling to pay rent. I am worried about my children\'s school fees.',
    submitted_at: '2024-10-26T14:30:00Z',
    analysis: {
      category: 'financial',
      urgency: 'high',
      sentiment: {
        overall: 'negative',
        score: -0.67,
        confidence: 93.2,
      },
      requires_pastoral_care: true,
      requires_financial_support: true,
      requires_counseling: false,
    },
    similar_requests: [
      { request_id: 'pr45', similarity_score: 0.82, resolution_status: 'Resolved - Benevolence fund provided' },
      { request_id: 'pr67', similarity_score: 0.76, resolution_status: 'Resolved - Job placement assistance' },
    ],
    suggested_support_team: ['Benevolence Committee', 'Job Placement Ministry', 'Pastor Emmanuel'],
    follow_up_recommended: true,
    follow_up_schedule: 'Within 24 hours',
  },
  {
    prayer_request_id: 'pr2',
    member_id: 'm92',
    member_name: 'Brother John Mwangi',
    request_text: 'Thank God for healing! The doctors said the tumor is gone. Grateful for all your prayers.',
    submitted_at: '2024-10-27T10:15:00Z',
    analysis: {
      category: 'health',
      urgency: 'low',
      sentiment: {
        overall: 'very_positive',
        score: 0.89,
        confidence: 96.8,
      },
      requires_pastoral_care: false,
      requires_financial_support: false,
      requires_counseling: false,
    },
    similar_requests: [],
    suggested_support_team: ['Celebrations Team'],
    follow_up_recommended: true,
    follow_up_schedule: 'Testimony sharing opportunity',
  },
];
