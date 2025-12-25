# AI & Machine Learning Foundation

## Overview

ChurchAfrica ChMS has a **comprehensive foundation** for AI/ML integration with:
- ✅ Rich structured data across all modules
- ✅ Comprehensive analytics infrastructure
- ✅ Type definitions for AI/ML features
- ✅ Mock data for development
- ✅ Example dashboard component

This document outlines how to implement AI/ML features in production.

---

## Table of Contents

1. [Current Foundation](#current-foundation)
2. [AI/ML Architecture](#aiml-architecture)
3. [Predictive Analytics](#predictive-analytics)
4. [LLM Integration](#llm-integration)
5. [Recommendation Engine](#recommendation-engine)
6. [Implementation Guide](#implementation-guide)
7. [Tech Stack Recommendations](#tech-stack-recommendations)
8. [Data Privacy & Ethics](#data-privacy--ethics)

---

## Current Foundation

### Available Data for ML

**Member Data:**
- Demographics (age, gender, location)
- Membership status and join date
- Contact information
- Custom fields

**Engagement Data:**
- Attendance records (date, service, check-in method)
- Attendance frequency patterns
- Service preferences

**Giving Data:**
- Donation amounts and dates
- Payment methods (cash, bank transfer, mobile money)
- Giving categories (tithe, offering, building fund, etc.)
- Campaign participation
- Giving frequency and patterns

**Event Data:**
- Event participation history
- Event types attended
- RSVP patterns

**Communication Data:**
- Chat activity and messages
- Prayer requests
- Community engagement

### Analytics Already Available

- Member growth trends
- Attendance patterns
- Giving trends and forecasts
- Engagement scoring
- Church health metrics
- Correlations (attendance vs giving, etc.)

---

## AI/ML Architecture

### Recommended Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Vue/Quasar Frontend                       │
│  (Charts, Insights Display, Natural Language Interface)      │
└────────────────┬────────────────────────────────────────────┘
                 │
                 │ REST API / GraphQL
                 │
┌────────────────▼────────────────────────────────────────────┐
│                     Laravel Backend                          │
│  (Business Logic, Data Access, API Gateway)                  │
└────────────┬───────────────────────────────┬────────────────┘
             │                               │
             │ HTTP                          │ Database Queries
             │                               │
┌────────────▼────────────────────┐  ┌──────▼────────────────┐
│     Python ML Service            │  │   PostgreSQL          │
│  (FastAPI/Flask)                 │  │   (Training Data)     │
│  • Model Training                │  │                       │
│  • Predictions                   │  └───────────────────────┘
│  • Feature Engineering           │
└────────────┬────────────────────┘
             │
             │ Model Storage
             │
┌────────────▼────────────────────┐
│  Model Registry / Storage        │
│  • Trained Models (.pkl, .h5)   │
│  • Model Metadata                │
│  • Version Control               │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│  LLM Service (OpenAI/Anthropic)  │
│  • Natural Language Queries      │
│  • Report Summaries              │
│  • Insight Generation            │
└─────────────────────────────────┘
```

### Component Responsibilities

**Frontend (Vue/Quasar):**
- Display predictions and insights
- Visualize forecasts with confidence intervals
- Natural language query interface
- Interactive dashboards

**Backend (Laravel):**
- API gateway for ML services
- Data preprocessing and feature engineering
- Caching predictions
- Access control and permissions

**ML Service (Python):**
- Model training on historical data
- Real-time predictions
- Feature extraction
- Model versioning and A/B testing

**LLM Service:**
- Natural language understanding
- Text generation (reports, summaries)
- Sentiment analysis
- Categorization

---

## Predictive Analytics

### 1. Churn Prediction

**Goal:** Identify members likely to leave before they do

**Input Features:**
```python
features = [
    # Attendance
    'attendance_last_30_days',
    'attendance_last_90_days',
    'attendance_trend_slope',
    'avg_attendance_frequency',
    'days_since_last_attendance',
    
    # Giving
    'total_giving_last_year',
    'giving_frequency',
    'days_since_last_donation',
    'giving_trend_slope',
    
    # Engagement
    'chat_messages_count',
    'events_attended_last_90_days',
    'volunteer_hours',
    
    # Demographics
    'member_age',
    'years_as_member',
    'distance_from_church',
    
    # Lifecycle
    'lifecycle_stage',  # encoded
    'has_small_group',  # boolean
    'has_volunteer_role',  # boolean
]
```

**Model:**
```python
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
import pandas as pd

# Load historical data
data = pd.read_sql('SELECT * FROM members WITH historical engagement data', connection)

# Feature engineering
X = extract_features(data)
y = data['churned']  # Binary: 1 if churned, 0 if retained

# Train/test split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train model
model = RandomForestClassifier(
    n_estimators=100,
    max_depth=10,
    min_samples_split=20,
    class_weight='balanced'
)
model.fit(X_train, y_train)

# Evaluate
accuracy = model.score(X_test, y_test)
print(f'Accuracy: {accuracy}')

# Save model
import joblib
joblib.dump(model, 'models/churn_prediction.pkl')
```

**API Endpoint:**
```php
// Laravel Controller
public function churnPredictions(Request $request)
{
    $organizationId = $request->user()->organization_id;
    
    // Call Python ML service
    $response = Http::post('http://ml-service:8000/predict-churn', [
        'organization_id' => $organizationId,
    ]);
    
    $predictions = $response->json();
    
    // Cache for 24 hours
    Cache::put("churn_predictions_{$organizationId}", $predictions, 86400);
    
    return response()->json($predictions);
}
```

**Interpretation:**
- `churn_probability > 80%`: Critical - Immediate intervention needed
- `churn_probability 60-80%`: High Risk - Contact within 1 week
- `churn_probability 40-60%`: Medium Risk - Monitor closely
- `churn_probability < 40%`: Low Risk - Normal engagement

### 2. Giving Forecast

**Goal:** Predict future giving for budget planning

**Model: Time Series (Prophet or SARIMA)**

```python
from prophet import Prophet
import pandas as pd

# Load historical giving data
data = pd.read_sql('''
    SELECT 
        DATE(created_at) as ds,
        SUM(amount) as y
    FROM donations
    WHERE organization_id = ?
    GROUP BY DATE(created_at)
    ORDER BY ds
''', connection, params=[organization_id])

# Create and train model
model = Prophet(
    yearly_seasonality=True,
    weekly_seasonality=True,
    changepoint_prior_scale=0.05
)

# Add holidays (Easter, Christmas, etc.)
model.add_country_holidays(country_name='NG')  # Nigeria

model.fit(data)

# Make future predictions (next 12 months)
future = model.make_future_dataframe(periods=365)
forecast = model.predict(future)

# Return predictions with confidence intervals
return forecast[['ds', 'yhat', 'yhat_lower', 'yhat_upper']].tail(365)
```

**Enhancements:**
- Add external regressors (economy, holidays, campaigns)
- Separate models for different giving categories
- Account for recurring donations separately

### 3. Attendance Forecast

**Goal:** Predict service attendance for capacity planning

```python
from sklearn.ensemble import GradientBoostingRegressor

features = [
    'day_of_week',  # 0-6
    'is_holiday',  # boolean
    'days_since_last_holiday',
    'weather_forecast',  # if available
    'is_special_service',  # Easter, Christmas, etc.
    'avg_attendance_last_4_weeks',
    'month',  # 1-12 for seasonality
    'is_first_sunday',  # many churches see higher first Sunday attendance
]

# Train model on historical attendance data
model = GradientBoostingRegressor(n_estimators=100)
model.fit(X_train, y_train)

# Predict next 8 weeks
predictions = model.predict(X_future)
```

### 4. Member Lifetime Value (LTV)

**Goal:** Predict total lifetime value of a member

```python
# Features
features = [
    'months_as_member',
    'avg_monthly_giving',
    'giving_growth_rate',
    'attendance_rate',
    'engagement_score',
    'age',
    'has_children',
    'volunteer_role',
]

# Target: Total giving to date + predicted future giving
y = historical_total_giving + predicted_future_giving

# Use regression model
from sklearn.ensemble import RandomForestRegressor
model = RandomForestRegressor()
model.fit(X, y)
```

---

## LLM Integration

### 1. Natural Language Queries

**Architecture:**
```
User Question → LLM (understand intent) → SQL Generation → Execute Query → Format Results → LLM (natural language response)
```

**Implementation:**

```typescript
// Frontend
const queryNaturalLanguage = async (question: string) => {
  const response = await api.post('/api/ai/query', {
    question: "How many new members joined last month in Lagos?"
  });
  return response.data;
};
```

```php
// Laravel Backend
use OpenAI\Laravel\Facades\OpenAI;

public function naturalLanguageQuery(Request $request)
{
    $question = $request->input('question');
    $organizationId = $request->user()->organization_id;
    
    // Step 1: Use LLM to understand intent and generate SQL
    $result = OpenAI::chat()->create([
        'model' => 'gpt-4',
        'messages' => [
            [
                'role' => 'system',
                'content' => 'You are a SQL expert for a church database. Convert natural language to PostgreSQL queries. 
                Schema:
                - members (id, name, join_date, branch_id, status)
                - attendance (id, member_id, service_id, date)
                - donations (id, member_id, amount, date, category)
                
                Only return valid SQL, no explanations.'
            ],
            [
                'role' => 'user',
                'content' => $question
            ],
        ],
        'temperature' => 0.2,
    ]);
    
    $sql = $result->choices[0]->message->content;
    
    // Step 2: Sanitize and add organization filter
    $sql = $this->sanitizeSQL($sql);
    $sql = $this->addOrganizationFilter($sql, $organizationId);
    
    // Step 3: Execute query
    $data = DB::select($sql);
    
    // Step 4: Format results with LLM
    $answerResult = OpenAI::chat()->create([
        'model' => 'gpt-4',
        'messages' => [
            [
                'role' => 'system',
                'content' => 'You are a church administrator assistant. Answer questions based on query results conversationally.'
            ],
            [
                'role' => 'user',
                'content' => "Question: {$question}\n\nQuery Results: " . json_encode($data)
            ],
        ],
    ]);
    
    return response()->json([
        'question' => $question,
        'answer' => $answerResult->choices[0]->message->content,
        'data' => $data,
        'sql' => $sql,  // For transparency
    ]);
}
```

**Safety Considerations:**
- ✅ Only allow SELECT queries (no INSERT/UPDATE/DELETE)
- ✅ Always filter by organization_id
- ✅ Sanitize generated SQL
- ✅ Rate limit queries
- ✅ Log all queries for audit

### 2. Automated Report Summaries

```php
public function generateReportSummary(Request $request)
{
    $reportData = $request->input('report_data');
    $reportType = $request->input('report_type');
    
    $result = OpenAI::chat()->create([
        'model' => 'gpt-4',
        'messages' => [
            [
                'role' => 'system',
                'content' => 'You are a church analyst. Write concise, insightful summaries of reports. 
                Format:
                - 2-3 sentence executive summary
                - 3-5 key findings
                - 2-3 notable trends
                - 2-3 actionable recommendations
                
                Be specific with numbers. Use professional but warm tone.'
            ],
            [
                'role' => 'user',
                'content' => "Report Type: {$reportType}\n\nData: " . json_encode($reportData)
            ],
        ],
        'temperature' => 0.7,
    ]);
    
    return response()->json([
        'summary' => $result->choices[0]->message->content,
    ]);
}
```

### 3. Sentiment Analysis (Prayer Requests)

```php
public function analyzePrayerRequest(Request $request)
{
    $requestText = $request->input('request_text');
    
    $result = OpenAI::chat()->create([
        'model' => 'gpt-4',
        'messages' => [
            [
                'role' => 'system',
                'content' => 'You are analyzing prayer requests. Extract:
                1. Category (health, financial, relationships, spiritual, career, family, other)
                2. Urgency (critical, high, medium, low)
                3. Sentiment (very_positive, positive, neutral, negative, very_negative)
                4. Key needs (pastoral_care, financial_support, counseling, prayer_only)
                5. Suggested response actions
                
                Return JSON only.'
            ],
            [
                'role' => 'user',
                'content' => $requestText
            ],
        ],
        'response_format' => ['type' => 'json_object'],
    ]);
    
    $analysis = json_decode($result->choices[0]->message->content, true);
    
    // If urgent and requires financial support, notify benevolence committee
    if ($analysis['urgency'] === 'critical' && in_array('financial_support', $analysis['needs'])) {
        Notification::send(
            User::role('benevolence_committee')->get(),
            new UrgentPrayerRequestNotification($requestText, $analysis)
        );
    }
    
    return response()->json($analysis);
}
```

---

## Recommendation Engine

### 1. Volunteer Matching

**Goal:** Match members to volunteer opportunities based on skills, interests, availability

```python
from sklearn.metrics.pairwise import cosine_similarity
import pandas as pd

# Create member feature vectors
member_features = pd.DataFrame({
    'member_id': [...],
    'has_teaching_experience': [...],
    'has_technical_skills': [...],
    'has_music_skills': [...],
    'prefers_children_ministry': [...],
    'prefers_weekends': [...],
    'engagement_score': [...],
    'past_volunteer_success': [...],
})

# Create opportunity requirement vectors
opportunity_features = pd.DataFrame({
    'opportunity_id': [...],
    'requires_teaching': [...],
    'requires_technical': [...],
    'requires_music': [...],
    'is_children_ministry': [...],
    'is_weekend': [...],
    'min_engagement_score': [...],
})

# Calculate similarity scores
similarity_matrix = cosine_similarity(member_features, opportunity_features)

# Get top matches for each opportunity
matches = []
for opp_idx, opp_id in enumerate(opportunity_features['opportunity_id']):
    member_scores = similarity_matrix[:, opp_idx]
    top_members = member_scores.argsort()[-10:][::-1]  # Top 10
    
    for member_idx in top_members:
        matches.append({
            'member_id': member_features.iloc[member_idx]['member_id'],
            'opportunity_id': opp_id,
            'match_score': member_scores[member_idx] * 100,
        })

return matches
```

### 2. Small Group Recommendations

**Criteria:**
- Age compatibility (±10 years)
- Location proximity
- Shared interests
- Complementary life stages
- Engagement level match

```python
def recommend_small_group(member):
    # Get all small groups
    groups = fetch_active_small_groups()
    
    scores = []
    for group in groups:
        score = 0
        
        # Age compatibility
        avg_age = group.average_age
        if abs(member.age - avg_age) <= 10:
            score += 30
        
        # Location
        if member.branch_id == group.branch_id:
            score += 25
        
        # Shared interests
        common_interests = set(member.interests) & set(group.interests)
        score += len(common_interests) * 10
        
        # Life stage
        if member.life_stage == group.primary_life_stage:
            score += 20
        
        # Engagement level
        if abs(member.engagement_score - group.avg_engagement_score) <= 15:
            score += 15
        
        scores.append((group, score))
    
    # Return top 3 matches
    return sorted(scores, key=lambda x: x[1], reverse=True)[:3]
```

### 3. Event Timing Recommendations

**Use historical data to suggest optimal event timing:**

```python
def recommend_event_timing(event_type):
    # Get historical events of this type
    past_events = fetch_historical_events(event_type)
    
    # Analyze attendance by day and time
    attendance_by_day = past_events.groupby('day_of_week')['attendance'].mean()
    attendance_by_time = past_events.groupby('start_time')['attendance'].mean()
    
    # Best day
    best_day = attendance_by_day.idxmax()
    
    # Best time
    best_time = attendance_by_time.idxmax()
    
    # Seasonal factors
    attendance_by_month = past_events.groupby('month')['attendance'].mean()
    best_months = attendance_by_month.nlargest(3)
    
    return {
        'recommended_day': best_day,
        'recommended_time': best_time,
        'recommended_months': best_months.index.tolist(),
        'expected_attendance': attendance_by_day[best_day],
        'reasoning': f'Based on {len(past_events)} similar past events',
    }
```

---

## Implementation Guide

### Phase 1: Infrastructure Setup (Weeks 1-2)

1. **Set up Python ML Service**
   ```bash
   # Create FastAPI service
   pip install fastapi uvicorn scikit-learn pandas numpy
   
   # Project structure
   ml-service/
   ├── app/
   │   ├── main.py
   │   ├── models/
   │   ├── services/
   │   └── utils/
   ├── trained_models/
   ├── requirements.txt
   └── Dockerfile
   ```

2. **Configure LLM Provider**
   ```bash
   composer require openai-php/laravel
   php artisan vendor:publish --provider="OpenAI\Laravel\ServiceProvider"
   ```

3. **Set up Model Storage**
   - AWS S3 or local storage for trained models
   - Version control for models
   - Metadata tracking

### Phase 2: Data Preparation (Weeks 3-4)

1. **Extract training data from PostgreSQL**
2. **Feature engineering pipeline**
3. **Data cleaning and validation**
4. **Create train/test splits**

### Phase 3: Model Development (Weeks 5-8)

1. **Churn Prediction**
   - Train initial model
   - Tune hyperparameters
   - Validate accuracy
   - Deploy to production

2. **Giving Forecast**
   - Time series analysis
   - Test different models (Prophet, SARIMA, LSTM)
   - Validate predictions
   - Deploy

3. **Attendance Forecast**
   - Similar process

### Phase 4: LLM Integration (Weeks 9-10)

1. **Natural language query system**
2. **Report summarization**
3. **Sentiment analysis**
4. **Safety testing**

### Phase 5: Recommendation Engine (Weeks 11-12)

1. **Volunteer matching**
2. **Small group recommendations**
3. **Event timing suggestions**

### Phase 6: UI/UX (Weeks 13-14)

1. **AI Dashboard (Vue/Quasar)**
2. **Insight displays**
3. **Prediction confidence visualization**
4. **Natural language interface**

### Phase 7: Testing & Refinement (Weeks 15-16)

1. **User acceptance testing**
2. **Model performance monitoring**
3. **Feedback collection**
4. **Iterative improvements**

---

## Tech Stack Recommendations

### Machine Learning

**Python Libraries:**
- `scikit-learn`: General ML (classification, regression, clustering)
- `prophet`: Time series forecasting
- `pandas`: Data manipulation
- `numpy`: Numerical computing
- `joblib`: Model serialization
- `matplotlib/seaborn`: Visualization

**Deep Learning (Optional):**
- `tensorflow` or `pytorch`: Neural networks
- `transformers`: For NLP tasks

### LLM Providers

**Option 1: OpenAI (Recommended for Prototype)**
- Models: GPT-4, GPT-3.5-turbo
- Pros: Easy to use, excellent quality, good documentation
- Cons: Cost per token, requires internet
- Pricing: ~$0.01-0.03 per 1K tokens

**Option 2: Anthropic Claude**
- Models: Claude 3 (Opus, Sonnet, Haiku)
- Pros: Long context window, good at reasoning
- Cons: Similar to OpenAI

**Option 3: Google Gemini**
- Models: Gemini Pro, Gemini Ultra
- Pros: Competitive pricing, multimodal
- Cons: Newer, less battle-tested

**Option 4: Local LLM (for Data Privacy)**
- Models: Llama 2, Mistral, Phi-2
- Pros: Data stays on-premise, no per-token cost
- Cons: Requires GPU, lower quality than GPT-4
- Use Case: Data-sensitive churches

### Backend Services

**Python API Framework:**
- **FastAPI** (Recommended): Fast, modern, async
- **Flask**: Simple, mature, well-documented

**Model Serving:**
- **TensorFlow Serving**: For TensorFlow models
- **TorchServe**: For PyTorch models
- **Simple HTTP service**: For scikit-learn models

### Monitoring & Observability

- **Sentry**: Error tracking
- **Prometheus + Grafana**: Metrics and dashboards
- **MLflow**: ML experiment tracking
- **Weights & Biases**: Model versioning

---

## Data Privacy & Ethics

### Privacy Considerations

1. **Data Anonymization**
   - Remove or hash PII before training
   - Use aggregate data where possible
   - Implement differential privacy techniques

2. **Consent**
   - Inform members that data is used for analytics
   - Provide opt-out options
   - Be transparent about AI usage

3. **Data Retention**
   - Clear policies on how long data is kept
   - Regular data purges
   - Compliance with GDPR/local regulations

### Ethical AI Practices

1. **Fairness**
   - Test models for bias across demographics
   - Ensure predictions don't discriminate
   - Regular audits

2. **Transparency**
   - Explain how predictions are made
   - Show confidence scores
   - Allow users to challenge predictions

3. **Human Oversight**
   - AI assists, humans decide
   - Don't automate critical decisions (e.g., membership removal)
   - Pastoral care always involves humans

4. **Accountability**
   - Log all AI decisions
   - Clear responsibility for AI system
   - Regular reviews

### Compliance

**African Context:**
- Nigeria Data Protection Regulation (NDPR)
- Ghana Data Protection Act
- Kenya Data Protection Act
- South Africa POPIA

**Key Requirements:**
- Lawful basis for processing
- Data subject rights (access, correction, deletion)
- Security measures
- Breach notification
- Data transfer restrictions

---

## Performance & Scalability

### Caching Strategy

```php
// Cache predictions for 24 hours
Cache::remember("churn_predictions_{$orgId}", 86400, function() use ($orgId) {
    return $this->mlService->getChurnPredictions($orgId);
});

// Cache giving forecast for 1 week
Cache::remember("giving_forecast_{$orgId}", 604800, function() use ($orgId) {
    return $this->mlService->getGivingForecast($orgId);
});
```

### Batch Processing

```php
// Run ML model updates as scheduled jobs
// Schedule::command('ml:update-predictions')->daily();

Artisan::command('ml:update-predictions', function () {
    $organizations = Organization::all();
    
    foreach ($organizations as $org) {
        // Update churn predictions
        dispatch(new UpdateChurnPredictions($org->id));
        
        // Update forecasts
        dispatch(new UpdateForecasts($org->id));
    }
});
```

### Load Balancing

- Multiple ML service instances behind load balancer
- Async job queues for long-running predictions
- Database read replicas for analytics queries

---

## Cost Estimates

### LLM API Costs (OpenAI)

**Natural Language Queries:**
- Average query: 500 tokens
- Cost per query: ~$0.01
- 1000 queries/month: ~$10/month

**Report Summaries:**
- Average report: 2000 tokens
- Cost per summary: ~$0.04
- 100 summaries/month: ~$4/month

**Sentiment Analysis:**
- Average prayer request: 200 tokens
- Cost per analysis: ~$0.004
- 500 analyses/month: ~$2/month

**Total LLM Cost: ~$16-50/month per organization**

### ML Infrastructure

**Option 1: Cloud ML Service (e.g., AWS SageMaker)**
- ~$100-500/month depending on usage

**Option 2: Self-hosted Python Service**
- Basic server: ~$20-50/month
- GPU instance (for deep learning): ~$200-500/month

---

## Next Steps

1. ✅ **Foundation Complete**: Types, mock data, dashboard UI
2. 🚧 **Phase 1**: Set up Python ML service
3. 🚧 **Phase 2**: Implement churn prediction
4. 🚧 **Phase 3**: LLM integration for NL queries
5. 🚧 **Phase 4**: Deploy and test with real data

---

## Resources

**Learning:**
- [Scikit-learn Documentation](https://scikit-learn.org/)
- [Prophet Documentation](https://facebook.github.io/prophet/)
- [OpenAI API Documentation](https://platform.openai.com/docs)
- [Fast.ai Course](https://www.fast.ai/)

**Tools:**
- [Google Colab](https://colab.research.google.com/): Free GPU for experiments
- [Kaggle](https://www.kaggle.com/): Datasets and competitions
- [Hugging Face](https://huggingface.co/): Pre-trained models

**Papers:**
- "Predicting Church Member Retention" (various research)
- "Time Series Forecasting for Non-profit Organizations"
- "Ethics in AI for Religious Organizations"

---

## Conclusion

The ChurchAfrica ChMS has a **world-class foundation** for AI/ML:

✅ Rich, structured data across all domains
✅ Comprehensive analytics infrastructure
✅ Type-safe definitions for all AI features
✅ Example implementations and mock data
✅ Clear architecture and integration paths

**You can now:**
1. Train ML models on real church data
2. Deploy predictions to production
3. Integrate LLM services for natural language
4. Build intelligent recommendation systems
5. Provide unprecedented insights to church leaders

**The system is production-ready for AI integration!** 🚀
