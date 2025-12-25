# Church Analytics System

Comprehensive analytics covering membership, attendance, engagement, and overall church health metrics for ChurchAfrica ChMS.

## Components

### AnalyticsHub
Central dashboard for accessing all analytics modules.

**Features:**
- 6 analytics module cards with live stats
- Quick overview metrics (members, attendance, engagement, health)
- Color-coded modules with trend indicators
- Feature descriptions for each module

**Props:**
```typescript
interface AnalyticsHubProps {
  onSelectModule: (moduleId: AnalyticsModule) => void;
}
```

### MembershipAnalytics
Growth, retention, demographics, and lifecycle analysis.

**Features:**
- 4 summary KPI cards (total, new, retention, average age)
- Growth trend line chart (monthly)
- Age distribution bar chart
- Gender distribution pie chart
- Membership status cards
- Branch comparison with growth rates
- Key insights summary

**Metrics:**
- Total Members, Active Members, New Members
- Member Retention Rate, Churn Rate
- Growth Rate (YoY or period)
- Average Member Age
- Gender Distribution
- Age Group Distribution
- Membership Status breakdown
- Branch-level membership and growth

### AttendanceAnalytics
Service attendance trends, patterns, and participation metrics.

**Features:**
- 4 summary KPI cards (avg attendance, rate, visitors, peak)
- Attendance trend line chart (weekly)
- Service performance breakdown
- Day of week attendance bar chart
- Member frequency pie chart
- Branch attendance comparison
- Key insights summary

**Metrics:**
- Total Services, Total Attendance
- Average Attendance per Service
- Attendance Rate (% of members attending)
- Unique Attendees
- First-Time Visitors, Repeat Visitors
- Peak & Low Attendance (with dates)
- Attendance by Service Type
- Attendance by Day of Week
- Member Attendance Frequency
- Branch-level attendance

### ChurchHealthAnalytics
Overall health indicators, benchmarks, and recommendations.

**Features:**
- Overall health score (0-100) with grade
- Health indicators radar chart (6 indicators)
- Individual indicator progress bars with benchmarks
- Growth metrics bar chart
- Retention metrics progress bars
- Engagement health metrics
- Areas of strength list
- Areas needing attention list
- Recommended actions with priority

**Health Indicators:**
1. Membership Growth
2. Attendance Rate
3. Giving Health
4. Member Engagement
5. First-Timer Retention
6. Volunteer Participation

**Metrics:**
- Overall Health Score (0-100)
- Health Grade (Excellent, Good, Fair, Poor)
- Individual Health Indicators vs Benchmarks
- Growth Metrics (membership, attendance, giving, events)
- Retention Metrics (member, first-timer, active)
- Financial Health (total, per capita, consistency)
- Engagement Health (attendance, events, volunteers)

**Recommendations:**
- Actionable initiatives
- Priority levels (High, Medium, Low)
- Expected impact descriptions

## Data Types

### MembershipAnalytics
```typescript
interface MembershipAnalytics {
  period: DateRange;
  total_members: number;
  active_members: number;
  inactive_members: number;
  new_members: number;
  member_retention_rate: number;
  growth_rate: number;
  churn_rate: number;
  average_member_age: number;
  gender_distribution: { male, female, other };
  age_groups: { group, count, percentage }[];
  membership_by_status: { status, count, percentage }[];
  growth_trend: { month, total, new, churned, net_growth }[];
  top_growth_branches: { branch_id, branch_name, members, growth }[];
}
```

### AttendanceAnalytics
```typescript
interface AttendanceAnalytics {
  period: DateRange;
  total_services: number;
  total_attendance: number;
  average_attendance: number;
  attendance_rate: number;
  unique_attendees: number;
  first_time_visitors: number;
  repeat_visitors: number;
  peak_attendance: number;
  peak_attendance_date: string;
  attendance_by_service: { service_id, service_name, service_type, total_attendance, average_attendance, trend }[];
  attendance_by_day: { day, attendance, services_count }[];
  attendance_trend: { date, attendance, services, unique_members }[];
  member_attendance_frequency: { frequency, count, percentage }[];
  top_branches_attendance: { branch_id, branch_name, attendance, average }[];
}
```

### ChurchHealthAnalytics
```typescript
interface ChurchHealthAnalytics {
  period: DateRange;
  overall_health_score: number;
  health_grade: 'excellent' | 'good' | 'fair' | 'poor';
  health_indicators: {
    indicator: string;
    score: number;
    status: HealthScore;
    trend: TrendDirection;
    benchmark: number;
  }[];
  growth_metrics: { membership_growth, attendance_growth, giving_growth, event_participation_growth };
  retention_metrics: { member_retention_rate, first_timer_return_rate, active_member_retention };
  financial_health: { total_giving, per_capita_giving, giving_consistency, budget_vs_actual };
  engagement_health: { average_attendance_rate, event_participation_rate, volunteer_participation_rate };
  areas_of_strength: string[];
  areas_needing_attention: string[];
  recommended_actions: { action, priority, impact }[];
}
```

## Chart Types

### Membership
- **Line Chart**: Growth trend over time
- **Bar Chart**: Age distribution
- **Pie Chart**: Gender distribution
- **Progress Bars**: Branch comparison

### Attendance
- **Line Chart**: Weekly attendance trend
- **Bar Chart**: Day of week analysis
- **Pie Chart**: Attendance frequency
- **Progress Bars**: Service performance

### Church Health
- **Radar Chart**: Health indicators vs benchmarks
- **Bar Chart**: Growth metrics
- **Progress Bars**: Retention & engagement metrics

## Color Scheme

### Module Colors
- **Membership**: Primary (#1CE479)
- **Attendance**: Blue (#3B82F6)
- **Engagement**: Pink (#EC4899)
- **Church Health**: Green (#10B981)
- **Combined**: Purple (#8B5CF6)
- **Giving**: Orange (#F59E0B)

### Health Grade Colors
- **Excellent**: #1CE479
- **Good**: #10B981
- **Fair**: #F59E0B
- **Poor**: #EF4444

### Trend Indicators
- **Up**: Green (#1CE479)
- **Down**: Red (#EF4444)
- **Stable**: Muted (#888888)

## Usage Examples

### Analytics Hub
```tsx
import { AnalyticsHub } from './components/analytics';

function AnalyticsPage() {
  const [currentModule, setCurrentModule] = useState(null);

  return (
    <AnalyticsHub onSelectModule={(moduleId) => setCurrentModule(moduleId)} />
  );
}
```

### Membership Analytics
```tsx
import { MembershipAnalytics } from './components/analytics';
import { mockMembershipAnalytics } from './lib/mock-analytics-data';

function MembershipPage() {
  return (
    <MembershipAnalytics
      analytics={mockMembershipAnalytics}
      onBack={() => console.log('Back to hub')}
    />
  );
}
```

### Attendance Analytics
```tsx
import { AttendanceAnalytics } from './components/analytics';
import { mockAttendanceAnalytics } from './lib/mock-analytics-data';

function AttendancePage() {
  return (
    <AttendanceAnalytics
      analytics={mockAttendanceAnalytics}
      onBack={() => console.log('Back to hub')}
    />
  );
}
```

### Church Health
```tsx
import { ChurchHealthAnalytics } from './components/analytics';
import { mockChurchHealthAnalytics } from './lib/mock-analytics-data';

function ChurchHealthPage() {
  return (
    <ChurchHealthAnalytics
      analytics={mockChurchHealthAnalytics}
      onBack={() => console.log('Back to hub')}
    />
  );
}
```

## Vue/Quasar Migration

### Pinia Store
```typescript
// stores/analytics.ts
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useAnalyticsStore = defineStore('analytics', () => {
  const membershipAnalytics = ref<MembershipAnalytics | null>(null);
  const attendanceAnalytics = ref<AttendanceAnalytics | null>(null);
  const churchHealthAnalytics = ref<ChurchHealthAnalytics | null>(null);
  const loading = ref(false);

  const fetchMembershipAnalytics = async (period: DateRange) => {
    loading.value = true;
    try {
      const response = await api.post('/api/analytics/membership', { period });
      membershipAnalytics.value = response.data;
    } finally {
      loading.value = false;
    }
  };

  const fetchAttendanceAnalytics = async (period: DateRange) => {
    loading.value = true;
    try {
      const response = await api.post('/api/analytics/attendance', { period });
      attendanceAnalytics.value = response.data;
    } finally {
      loading.value = false;
    }
  };

  const fetchChurchHealth = async (period: DateRange) => {
    loading.value = true;
    try {
      const response = await api.post('/api/analytics/church-health', { period });
      churchHealthAnalytics.value = response.data;
    } finally {
      loading.value = false;
    }
  };

  return {
    membershipAnalytics,
    attendanceAnalytics,
    churchHealthAnalytics,
    loading,
    fetchMembershipAnalytics,
    fetchAttendanceAnalytics,
    fetchChurchHealth,
  };
});
```

### Laravel API Endpoints
```php
// routes/api.php
Route::middleware('auth:sanctum')->group(function () {
    // Analytics
    Route::post('/analytics/membership', [AnalyticsController::class, 'membership']);
    Route::post('/analytics/attendance', [AnalyticsController::class, 'attendance']);
    Route::post('/analytics/engagement', [AnalyticsController::class, 'engagement']);
    Route::post('/analytics/church-health', [AnalyticsController::class, 'churchHealth']);
    Route::post('/analytics/combined', [AnalyticsController::class, 'combined']);
    Route::get('/analytics/realtime', [AnalyticsController::class, 'realtime']);
});
```

### Laravel Controller Example
```php
namespace App\Http\Controllers\Api;

class AnalyticsController extends Controller
{
    public function membership(Request $request)
    {
        $period = $request->input('period');
        $organizationId = $request->user()->organization_id;
        
        $totalMembers = Member::where('organization_id', $organizationId)->count();
        $activeMembers = Member::where('organization_id', $organizationId)
            ->where('status', 'active')
            ->count();
        
        $newMembers = Member::where('organization_id', $organizationId)
            ->whereBetween('joined_date', [$period['start'], $period['end']])
            ->count();
        
        // Calculate retention rate
        $retentionRate = ($activeMembers / $totalMembers) * 100;
        
        // Growth trend
        $growthTrend = DB::table('members')
            ->where('organization_id', $organizationId)
            ->selectRaw('DATE_FORMAT(joined_date, "%Y-%m") as month')
            ->selectRaw('COUNT(*) as total')
            ->groupBy('month')
            ->orderBy('month')
            ->get();
        
        return response()->json([
            'total_members' => $totalMembers,
            'active_members' => $activeMembers,
            'new_members' => $newMembers,
            'member_retention_rate' => round($retentionRate, 1),
            'growth_trend' => $growthTrend,
            // ... more data
        ]);
    }
    
    public function attendance(Request $request)
    {
        $period = $request->input('period');
        $organizationId = $request->user()->organization_id;
        
        $totalServices = AttendanceRecord::where('organization_id', $organizationId)
            ->whereBetween('date', [$period['start'], $period['end']])
            ->distinct('service_id', 'date')
            ->count();
        
        $totalAttendance = AttendanceRecord::where('organization_id', $organizationId)
            ->whereBetween('date', [$period['start'], $period['end']])
            ->sum('count');
        
        $averageAttendance = $totalServices > 0 ? $totalAttendance / $totalServices : 0;
        
        return response()->json([
            'total_services' => $totalServices,
            'total_attendance' => $totalAttendance,
            'average_attendance' => round($averageAttendance, 1),
            // ... more data
        ]);
    }
}
```

### Quasar Component
```vue
<template>
  <q-page class="q-pa-md">
    <q-card>
      <q-card-section>
        <div class="text-h6">Membership Analytics</div>
      </q-card-section>

      <q-card-section v-if="loading">
        <q-skeleton height="200px" />
      </q-card-section>

      <q-card-section v-else-if="analytics">
        <div class="row q-col-gutter-md">
          <div class="col-3">
            <q-card flat bordered>
              <q-card-section>
                <div class="text-h4">{{ analytics.total_members }}</div>
                <div class="text-caption text-grey">Total Members</div>
              </q-card-section>
            </q-card>
          </div>
          <!-- More KPI cards -->
        </div>

        <!-- Charts using Quasar's built-in chart components or ApexCharts -->
        <apexchart
          type="line"
          :options="chartOptions"
          :series="series"
        />
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { useAnalyticsStore } from '@/stores/analytics';
import { onMounted } from 'vue';

const analyticsStore = useAnalyticsStore();

onMounted(async () => {
  await analyticsStore.fetchMembershipAnalytics({
    start: '2024-01-01',
    end: '2024-10-31',
  });
});
</script>
```

## Performance Optimizations

1. **Data Caching**: Cache analytics data for 15-30 minutes
2. **Lazy Loading**: Load charts only when visible
3. **Pagination**: Paginate long lists (growth trends, top members)
4. **Debouncing**: Debounce filter changes
5. **Background Processing**: Calculate complex metrics in background jobs

## Best Practices

1. **Date Range Validation**: Always validate date ranges
2. **Benchmark Updates**: Update benchmarks periodically based on industry standards
3. **Data Privacy**: Aggregate data to protect individual privacy
4. **Trend Calculation**: Use moving averages for smoother trends
5. **Health Scoring**: Weight indicators based on church priorities
6. **Actionable Insights**: Provide specific, actionable recommendations
7. **Comparison Context**: Always compare against benchmarks or previous periods
8. **Visual Hierarchy**: Highlight most important metrics
9. **Drill-down Capability**: Allow users to explore detailed data
10. **Export Options**: Enable data export for further analysis

## Future Enhancements

- **Engagement Analytics**: Detailed member engagement scoring
- **Combined Analytics**: Correlations between metrics
- **Predictive Analytics**: ML-based forecasting
- **Real-time Dashboard**: Live service metrics
- **Custom Report Builder**: User-defined analytics
- **Scheduled Reports**: Automated email delivery
- **Comparison Tools**: Compare periods, branches, demographics
- **Goal Tracking**: Set and track strategic goals
- **Alerts & Notifications**: Automatic alerts for anomalies
- **Mobile Analytics**: Mobile-optimized views

## Testing Scenarios

- Empty data sets (new church)
- Single branch vs multi-branch
- High growth vs declining trends
- Seasonal variations
- Different time periods
- Edge cases (100% retention, 0% attendance)
- Large datasets (1000+ members)
- Branch comparisons with missing data

## Documentation

- All metrics are clearly defined
- Calculations are transparent
- Benchmarks are documented
- Color coding is consistent
- Trend indicators are intuitive
- Recommendations are actionable
