/**
 * ChurchAfrica ChMS - AI & Machine Learning Type Definitions
 * Types for predictive analytics, LLM integration, and intelligent insights
 */

import type { DateRange } from './reports';

// ============================================================================
// PREDICTIVE ANALYTICS
// ============================================================================

export interface PredictiveModel {
  model_id: string;
  model_name: string;
  model_type: 'churn_prediction' | 'giving_forecast' | 'attendance_forecast' | 'engagement_scoring';
  version: string;
  trained_date: string;
  accuracy_score: number; // 0-100
  confidence_level: 'high' | 'medium' | 'low';
  training_data_size: number;
  features_used: string[];
}

export interface ChurnPrediction {
  member_id: string;
  member_name: string;
  churn_probability: number; // 0-100
  risk_level: 'critical' | 'high' | 'medium' | 'low';
  confidence: number; // 0-100
  primary_risk_factors: {
    factor: string;
    impact_score: number;
    description: string;
  }[];
  recommended_interventions: {
    intervention: string;
    priority: 'urgent' | 'high' | 'medium' | 'low';
    expected_impact: string;
    suggested_timeline: string;
  }[];
  historical_engagement: {
    attendance_trend: 'declining' | 'stable' | 'improving';
    giving_trend: 'declining' | 'stable' | 'improving';
    event_participation_trend: 'declining' | 'stable' | 'improving';
  };
  predicted_churn_date?: string;
  similar_cases: number; // How many similar members churned
}

export interface GivingForecast {
  period: DateRange;
  forecast_type: 'monthly' | 'quarterly' | 'annual';
  predictions: {
    date: string;
    predicted_amount: number;
    lower_bound: number; // 95% confidence interval
    upper_bound: number; // 95% confidence interval
    confidence_score: number;
    contributing_factors: string[];
  }[];
  total_predicted: number;
  vs_current_trend: number; // % difference
  seasonality_factors: {
    month: string;
    multiplier: number;
    reason: string;
  }[];
  growth_projection: {
    conservative: number;
    moderate: number;
    optimistic: number;
  };
}

export interface AttendanceForecast {
  service_id?: string;
  service_name?: string;
  period: DateRange;
  predictions: {
    date: string;
    day_of_week: string;
    predicted_attendance: number;
    lower_bound: number;
    upper_bound: number;
    confidence_score: number;
    special_factors?: string[]; // e.g., "Easter Sunday", "Holiday weekend"
  }[];
  average_predicted: number;
  peak_predicted: { date: string; attendance: number };
  low_predicted: { date: string; attendance: number };
  trend: 'growing' | 'stable' | 'declining';
}

export interface MemberLifetimeValue {
  member_id: string;
  member_name: string;
  current_ltv: number; // Actual lifetime value so far
  predicted_ltv: number; // Predicted total lifetime value
  ltv_score: number; // 0-100, percentile among all members
  giving_potential: 'high' | 'medium' | 'low';
  engagement_trajectory: 'increasing' | 'stable' | 'decreasing';
  retention_probability: number; // % chance of staying active
  years_predicted_active: number;
  value_drivers: {
    driver: string;
    contribution: number; // % of total value
  }[];
}

// ============================================================================
// LLM INTEGRATION
// ============================================================================

export interface LLMProvider {
  provider: 'openai' | 'anthropic' | 'google' | 'local';
  model: string; // e.g., "gpt-4", "claude-3-opus", "gemini-pro"
  api_key_configured: boolean;
  rate_limit?: {
    requests_per_minute: number;
    requests_remaining: number;
  };
}

export interface AIInsight {
  insight_id: string;
  generated_at: string;
  category: 'trend' | 'anomaly' | 'opportunity' | 'warning' | 'recommendation';
  title: string;
  description: string;
  confidence: number; // 0-100
  impact: 'high' | 'medium' | 'low';
  supporting_data: {
    metric: string;
    value: string | number;
    context?: string;
  }[];
  actionable_steps?: string[];
  priority: number; // 1-5, 1 being highest
}

export interface NaturalLanguageQuery {
  query_id: string;
  query_text: string;
  user_id: string;
  timestamp: string;
  intent: 'data_query' | 'report_generation' | 'insight_request' | 'recommendation' | 'general';
  entities_extracted: {
    type: 'date' | 'metric' | 'member' | 'branch' | 'category';
    value: string;
  }[];
  sql_generated?: string;
  response: {
    answer_text: string;
    data?: any;
    visualizations?: string[]; // Chart types to display
    follow_up_questions?: string[];
  };
  processing_time_ms: number;
  confidence_score: number;
}

export interface AIAssistantMessage {
  message_id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  context?: {
    current_page: string;
    selected_data?: any;
    user_permissions: string[];
  };
  suggestions?: {
    action: string;
    description: string;
    icon?: string;
  }[];
  sources?: {
    type: 'database' | 'report' | 'analytics';
    description: string;
  }[];
}

export interface SmartReportSummary {
  report_id: string;
  report_type: string;
  generated_at: string;
  summary: {
    executive_summary: string; // 2-3 sentences
    key_findings: string[];
    notable_trends: string[];
    areas_of_concern?: string[];
    recommendations: string[];
  };
  narrative: string; // Full narrative report
  tone: 'formal' | 'conversational' | 'technical';
  reading_time_minutes: number;
}

// ============================================================================
// INTELLIGENT RECOMMENDATIONS
// ============================================================================

export interface RecommendationEngine {
  engine_type: 'member_engagement' | 'volunteer_matching' | 'event_suggestions' | 'giving_optimization';
  last_updated: string;
  total_recommendations: number;
}

export interface MemberRecommendation {
  recommendation_id: string;
  member_id: string;
  member_name: string;
  recommendation_type: 'engagement_opportunity' | 'volunteer_role' | 'small_group' | 'mentorship' | 'service';
  title: string;
  description: string;
  reason: string; // Why this recommendation was made
  match_score: number; // 0-100
  confidence: number; // 0-100
  action_items: {
    action: string;
    responsible_party: string;
    timeline: string;
  }[];
  expected_impact: {
    engagement_increase: number; // %
    retention_improvement: number; // %
  };
}

export interface EventRecommendation {
  event_type: string;
  recommended_date: string;
  recommended_time: string;
  target_audience: string;
  expected_attendance: number;
  reasoning: string;
  similar_past_events: {
    event_name: string;
    date: string;
    attendance: number;
    success_score: number;
  }[];
  suggested_format: 'in-person' | 'hybrid' | 'online';
  estimated_budget?: number;
  success_probability: number; // %
}

export interface CommunicationRecommendation {
  member_id: string;
  member_name: string;
  recommended_action: 'follow_up_call' | 'personal_visit' | 'email' | 'text' | 'prayer_support';
  urgency: 'immediate' | 'this_week' | 'this_month' | 'low';
  reason: string;
  suggested_message?: string; // AI-generated template
  best_contact_time?: string;
  preferred_channel?: string;
  conversation_starters?: string[];
}

export interface VolunteerMatch {
  member_id: string;
  member_name: string;
  volunteer_opportunity_id: string;
  opportunity_title: string;
  match_score: number; // 0-100
  matching_factors: {
    factor: string;
    weight: number; // % of total match score
    details: string;
  }[];
  member_skills: string[];
  opportunity_requirements: string[];
  availability_match: 'excellent' | 'good' | 'fair';
  interest_alignment: number; // 0-100
  past_volunteer_success: number; // 0-100
}

// ============================================================================
// SENTIMENT & TEXT ANALYSIS
// ============================================================================

export interface SentimentAnalysis {
  text_id: string;
  source: 'chat' | 'prayer_request' | 'feedback' | 'survey';
  text_content: string;
  analyzed_at: string;
  sentiment: {
    overall: 'very_positive' | 'positive' | 'neutral' | 'negative' | 'very_negative';
    score: number; // -1 to +1
    confidence: number; // 0-100
  };
  emotions_detected: {
    emotion: 'joy' | 'sadness' | 'anger' | 'fear' | 'surprise' | 'trust' | 'anticipation';
    intensity: number; // 0-100
  }[];
  topics_identified: string[];
  urgency_level: 'critical' | 'high' | 'medium' | 'low';
  requires_immediate_attention: boolean;
  suggested_response?: string;
}

export interface PrayerRequestAnalysis {
  prayer_request_id: string;
  member_id: string;
  member_name: string;
  request_text: string;
  submitted_at: string;
  analysis: {
    category: 'health' | 'financial' | 'relationships' | 'spiritual' | 'career' | 'family' | 'other';
    urgency: 'critical' | 'high' | 'medium' | 'low';
    sentiment: SentimentAnalysis['sentiment'];
    requires_pastoral_care: boolean;
    requires_financial_support: boolean;
    requires_counseling: boolean;
  };
  similar_requests: {
    request_id: string;
    similarity_score: number;
    resolution_status: string;
  }[];
  suggested_support_team: string[];
  follow_up_recommended: boolean;
  follow_up_schedule?: string;
}

// ============================================================================
// ANOMALY DETECTION
// ============================================================================

export interface AnomalyDetection {
  anomaly_id: string;
  detected_at: string;
  category: 'attendance' | 'giving' | 'engagement' | 'financial' | 'membership';
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  metric_affected: string;
  expected_value: number;
  actual_value: number;
  deviation_percentage: number;
  confidence: number; // 0-100
  possible_causes: string[];
  recommended_actions: string[];
  historical_context: {
    has_occurred_before: boolean;
    last_occurrence?: string;
    typical_resolution?: string;
  };
  auto_resolved: boolean;
}

// ============================================================================
// MEMBER SEGMENTATION (ML-based)
// ============================================================================

export interface MLMemberSegment {
  segment_id: string;
  segment_name: string;
  segment_description: string;
  segmentation_method: 'kmeans' | 'hierarchical' | 'rfm' | 'behavioral';
  member_count: number;
  created_at: string;
  characteristics: {
    characteristic: string;
    average_value: number;
    range: [number, number];
  }[];
  typical_profile: {
    age_range: string;
    attendance_frequency: string;
    giving_pattern: string;
    engagement_level: string;
  };
  recommended_strategies: {
    strategy: string;
    expected_outcome: string;
    implementation_priority: 'high' | 'medium' | 'low';
  }[];
  growth_potential: 'high' | 'medium' | 'low';
  retention_risk: 'high' | 'medium' | 'low';
}

// ============================================================================
// AI CONFIGURATION
// ============================================================================

export interface AIConfiguration {
  features_enabled: {
    predictive_analytics: boolean;
    churn_prediction: boolean;
    giving_forecasts: boolean;
    attendance_forecasts: boolean;
    natural_language_queries: boolean;
    ai_insights: boolean;
    smart_recommendations: boolean;
    sentiment_analysis: boolean;
    anomaly_detection: boolean;
  };
  llm_provider: LLMProvider;
  model_settings: {
    update_frequency: 'daily' | 'weekly' | 'monthly';
    auto_retrain: boolean;
    confidence_threshold: number; // Minimum confidence to show predictions
  };
  data_privacy: {
    anonymize_predictions: boolean;
    data_retention_days: number;
    share_for_training: boolean;
  };
}

/**
 * Vue/Quasar Migration Notes:
 * 
 * // Pinia store for AI/ML
 * // stores/ai.ts
 * import { defineStore } from 'pinia';
 * import { ref } from 'vue';
 * 
 * export const useAIStore = defineStore('ai', () => {
 *   const aiConfig = ref<AIConfiguration | null>(null);
 *   const churnPredictions = ref<ChurnPrediction[]>([]);
 *   const givingForecasts = ref<GivingForecast | null>(null);
 *   const aiInsights = ref<AIInsight[]>([]);
 *   const loading = ref(false);
 * 
 *   // Fetch churn predictions
 *   const fetchChurnPredictions = async () => {
 *     loading.value = true;
 *     try {
 *       const response = await api.get('/api/ai/churn-predictions');
 *       churnPredictions.value = response.data;
 *     } finally {
 *       loading.value = false;
 *     }
 *   };
 * 
 *   // Natural language query
 *   const queryNaturalLanguage = async (query: string) => {
 *     loading.value = true;
 *     try {
 *       const response = await api.post('/api/ai/query', { query });
 *       return response.data;
 *     } finally {
 *       loading.value = false;
 *     }
 *   };
 * 
 *   // Get AI insights
 *   const fetchAIInsights = async () => {
 *     const response = await api.get('/api/ai/insights');
 *     aiInsights.value = response.data;
 *   };
 * 
 *   return {
 *     aiConfig,
 *     churnPredictions,
 *     givingForecasts,
 *     aiInsights,
 *     loading,
 *     fetchChurnPredictions,
 *     queryNaturalLanguage,
 *     fetchAIInsights,
 *   };
 * });
 * 
 * // Laravel API endpoints
 * Route::middleware('auth:sanctum')->group(function () {
 *   // Predictive Analytics
 *   Route::get('/ai/churn-predictions', [AIController::class, 'churnPredictions']);
 *   Route::get('/ai/giving-forecast', [AIController::class, 'givingForecast']);
 *   Route::get('/ai/attendance-forecast', [AIController::class, 'attendanceForecast']);
 *   
 *   // LLM Integration
 *   Route::post('/ai/query', [AIController::class, 'naturalLanguageQuery']);
 *   Route::get('/ai/insights', [AIController::class, 'getInsights']);
 *   Route::post('/ai/generate-report-summary', [AIController::class, 'generateReportSummary']);
 *   
 *   // Recommendations
 *   Route::get('/ai/recommendations/members', [AIController::class, 'memberRecommendations']);
 *   Route::get('/ai/recommendations/events', [AIController::class, 'eventRecommendations']);
 *   Route::get('/ai/recommendations/volunteers', [AIController::class, 'volunteerMatching']);
 *   
 *   // Analysis
 *   Route::post('/ai/sentiment-analysis', [AIController::class, 'sentimentAnalysis']);
 *   Route::get('/ai/anomalies', [AIController::class, 'detectAnomalies']);
 *   Route::post('/ai/prayer-request-analysis', [AIController::class, 'analyzePrayerRequest']);
 * });
 * 
 * // Example Laravel Controller using OpenAI
 * namespace App\Http\Controllers\Api;
 * 
 * use OpenAI\Laravel\Facades\OpenAI;
 * 
 * class AIController extends Controller
 * {
 *     public function naturalLanguageQuery(Request $request)
 *     {
 *         $query = $request->input('query');
 *         $organizationId = $request->user()->organization_id;
 *         
 *         // Use OpenAI to understand the query
 *         $result = OpenAI::chat()->create([
 *             'model' => 'gpt-4',
 *             'messages' => [
 *                 ['role' => 'system', 'content' => 'You are a church management assistant. Convert natural language queries to SQL.'],
 *                 ['role' => 'user', 'content' => $query],
 *             ],
 *         ]);
 *         
 *         $sqlQuery = $result->choices[0]->message->content;
 *         
 *         // Execute SQL safely (with proper sanitization)
 *         // Return results
 *         
 *         return response()->json([
 *             'answer_text' => 'Based on the data...',
 *             'data' => $data,
 *         ]);
 *     }
 *     
 *     public function churnPredictions(Request $request)
 *     {
 *         $organizationId = $request->user()->organization_id;
 *         
 *         // Load trained ML model (e.g., from Python service)
 *         // Make predictions
 *         // Return high-risk members
 *         
 *         return response()->json($predictions);
 *     }
 * }
 * 
 * // Python ML Service (FastAPI)
 * from fastapi import FastAPI
 * import pandas as pd
 * from sklearn.ensemble import RandomForestClassifier
 * import joblib
 * 
 * app = FastAPI()
 * 
 * @app.post("/predict-churn")
 * async def predict_churn(organization_id: str):
 *     # Load member data
 *     members = get_members(organization_id)
 *     
 *     # Load trained model
 *     model = joblib.load(f'models/churn_{organization_id}.pkl')
 *     
 *     # Make predictions
 *     features = extract_features(members)
 *     predictions = model.predict_proba(features)
 *     
 *     # Return high-risk members
 *     return {
 *         'predictions': predictions.tolist(),
 *         'risk_factors': get_feature_importance(model, features)
 *     }
 */
