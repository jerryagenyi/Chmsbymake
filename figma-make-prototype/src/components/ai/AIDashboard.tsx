/**
 * ChurchAfrica ChMS - AI Dashboard
 * Central hub for AI insights, predictions, and recommendations
 */

import React from 'react';
import {
  Sparkles,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Lightbulb,
  Users,
  DollarSign,
  Activity,
  Target,
  Brain,
  Zap,
  MessageSquare,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import { Progress } from '../ui/progress';
import type { AIInsight, ChurnPrediction } from '../../types/ai-ml';

interface AIDashboardProps {
  insights: AIInsight[];
  churnPredictions: ChurnPrediction[];
  onViewDetails: (section: 'insights' | 'predictions' | 'forecasts' | 'recommendations') => void;
}

export function AIDashboard({ insights, churnPredictions, onViewDetails }: AIDashboardProps) {
  // Get high-priority insights
  const highPriorityInsights = insights.filter(i => i.priority <= 2).slice(0, 3);
  
  // Get critical/high risk churn predictions
  const criticalChurns = churnPredictions.filter(p => p.risk_level === 'critical' || p.risk_level === 'high');

  const getCategoryIcon = (category: AIInsight['category']) => {
    switch (category) {
      case 'trend':
        return <TrendingUp className="h-4 w-4" />;
      case 'anomaly':
        return <AlertTriangle className="h-4 w-4" />;
      case 'opportunity':
        return <Target className="h-4 w-4" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4" />;
      case 'recommendation':
        return <Lightbulb className="h-4 w-4" />;
      default:
        return <Sparkles className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: AIInsight['category']) => {
    switch (category) {
      case 'trend':
        return 'text-blue-400 bg-blue-400/10';
      case 'anomaly':
        return 'text-orange-400 bg-orange-400/10';
      case 'opportunity':
        return 'text-green-400 bg-green-400/10';
      case 'warning':
        return 'text-red-400 bg-red-400/10';
      case 'recommendation':
        return 'text-purple-400 bg-purple-400/10';
      default:
        return 'text-primary bg-primary/10';
    }
  };

  const getRiskColor = (riskLevel: ChurnPrediction['risk_level']) => {
    switch (riskLevel) {
      case 'critical':
        return 'text-red-400 border-red-400';
      case 'high':
        return 'text-orange-400 border-orange-400';
      case 'medium':
        return 'text-yellow-400 border-yellow-400';
      case 'low':
        return 'text-green-400 border-green-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Brain className="h-6 w-6 text-primary" />
            <h1 className="text-2xl">AI Intelligence Hub</h1>
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
              <Sparkles className="h-3 w-3 mr-1" />
              Powered by ML
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Predictive analytics, intelligent insights, and AI-powered recommendations
          </p>
        </div>
      </div>

      {/* AI Features Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="cursor-pointer hover:border-primary/40 transition-all" onClick={() => onViewDetails('insights')}>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between mb-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <Lightbulb className="h-5 w-5 text-primary" />
              </div>
              <Badge variant="outline" className="text-primary">
                {insights.length} Active
              </Badge>
            </div>
            <h3 className="text-lg mb-1">AI Insights</h3>
            <p className="text-sm text-muted-foreground">
              {highPriorityInsights.length} high-priority
            </p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:border-primary/40 transition-all" onClick={() => onViewDetails('predictions')}>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between mb-2">
              <div className="p-2 rounded-lg bg-red-400/10">
                <Users className="h-5 w-5 text-red-400" />
              </div>
              <Badge variant="outline" className="text-red-400 border-red-400">
                {criticalChurns.length} At Risk
              </Badge>
            </div>
            <h3 className="text-lg mb-1">Churn Predictions</h3>
            <p className="text-sm text-muted-foreground">
              {churnPredictions.length} members analyzed
            </p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:border-primary/40 transition-all" onClick={() => onViewDetails('forecasts')}>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between mb-2">
              <div className="p-2 rounded-lg bg-blue-400/10">
                <TrendingUp className="h-5 w-5 text-blue-400" />
              </div>
              <Badge variant="outline" className="text-blue-400 border-blue-400">
                +17.5%
              </Badge>
            </div>
            <h3 className="text-lg mb-1">Forecasts</h3>
            <p className="text-sm text-muted-foreground">
              Giving & attendance predictions
            </p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:border-primary/40 transition-all" onClick={() => onViewDetails('recommendations')}>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between mb-2">
              <div className="p-2 rounded-lg bg-purple-400/10">
                <Target className="h-5 w-5 text-purple-400" />
              </div>
              <Badge variant="outline" className="text-purple-400 border-purple-400">
                2 New
              </Badge>
            </div>
            <h3 className="text-lg mb-1">Recommendations</h3>
            <p className="text-sm text-muted-foreground">
              Member & event suggestions
            </p>
          </CardContent>
        </Card>
      </div>

      {/* High-Priority Alerts */}
      {criticalChurns.length > 0 && (
        <Alert className="bg-red-500/5 border-red-500/20">
          <AlertTriangle className="h-4 w-4 text-red-400" />
          <AlertDescription className="text-sm">
            <strong>{criticalChurns.length} members at critical/high risk of leaving.</strong> Immediate intervention recommended.
            <Button
              variant="link"
              className="p-0 h-auto ml-2 text-red-400"
              onClick={() => onViewDetails('predictions')}
            >
              View Details →
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Top AI Insights */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-primary" />
                Top AI Insights
              </CardTitle>
              <CardDescription>High-priority insights from your data</CardDescription>
            </div>
            <Button variant="outline" onClick={() => onViewDetails('insights')}>
              View All Insights
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {highPriorityInsights.map((insight) => (
              <div key={insight.insight_id} className="p-4 bg-[#1A1A20] rounded-lg">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${getCategoryColor(insight.category)}`}>
                      {getCategoryIcon(insight.category)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{insight.title}</h4>
                        <Badge variant="outline" className="capitalize">
                          {insight.category}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{insight.description}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className={insight.impact === 'high' ? 'text-primary' : 'text-muted-foreground'}>
                    {insight.impact} impact
                  </Badge>
                </div>

                {/* Supporting Data */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                  {insight.supporting_data.slice(0, 4).map((data, index) => (
                    <div key={index} className="p-2 bg-[#0A0A0F] rounded">
                      <p className="text-xs text-muted-foreground mb-1">{data.metric}</p>
                      <p className="font-medium">{data.value}</p>
                    </div>
                  ))}
                </div>

                {/* Action Items */}
                {insight.actionable_steps && insight.actionable_steps.length > 0 && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-2">Recommended Actions:</p>
                    <ul className="space-y-1">
                      {insight.actionable_steps.slice(0, 2).map((step, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <Zap className="h-3 w-3 text-primary mt-1 flex-shrink-0" />
                          <span className="text-muted-foreground">{step}</span>
                        </li>
                      ))}
                    </ul>
                    {insight.actionable_steps.length > 2 && (
                      <p className="text-xs text-muted-foreground mt-2">
                        +{insight.actionable_steps.length - 2} more actions
                      </p>
                    )}
                  </div>
                )}

                {/* Confidence Score */}
                <div className="mt-3 flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">AI Confidence:</span>
                  <Progress value={insight.confidence} className="h-1 w-24" />
                  <span className="text-xs text-muted-foreground">{insight.confidence.toFixed(0)}%</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Churn Predictions Summary */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-400" />
                Members at Risk
              </CardTitle>
              <CardDescription>AI-predicted churn probability</CardDescription>
            </div>
            <Button variant="outline" onClick={() => onViewDetails('predictions')}>
              View All Predictions
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {churnPredictions.slice(0, 3).map((prediction) => (
              <div key={prediction.member_id} className="p-4 bg-[#1A1A20] rounded-lg">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-medium mb-1">{prediction.member_name}</h4>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={getRiskColor(prediction.risk_level)}>
                        {prediction.risk_level} risk
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {prediction.churn_probability.toFixed(1)}% churn probability
                      </span>
                    </div>
                  </div>
                  <Progress value={prediction.churn_probability} className="h-2 w-24" />
                </div>

                {/* Risk Factors */}
                <div className="mb-3">
                  <p className="text-xs text-muted-foreground mb-2">Primary Risk Factors:</p>
                  <div className="space-y-1">
                    {prediction.primary_risk_factors.slice(0, 2).map((factor, index) => (
                      <div key={index} className="flex items-start gap-2 text-sm">
                        <AlertTriangle className="h-3 w-3 text-orange-400 mt-1 flex-shrink-0" />
                        <div>
                          <span className="font-medium">{factor.factor}:</span>{' '}
                          <span className="text-muted-foreground">{factor.description}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Top Intervention */}
                {prediction.recommended_interventions[0] && (
                  <div className="p-3 bg-primary/5 border border-primary/20 rounded">
                    <p className="text-xs text-muted-foreground mb-1">Recommended Intervention:</p>
                    <p className="text-sm">
                      <strong>{prediction.recommended_interventions[0].intervention}</strong>
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {prediction.recommended_interventions[0].expected_impact}
                    </p>
                  </div>
                )}

                {/* Confidence */}
                <div className="mt-3 flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Prediction Confidence:</span>
                  <Progress value={prediction.confidence} className="h-1 w-24" />
                  <span className="text-xs text-muted-foreground">{prediction.confidence.toFixed(0)}%</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Capabilities */}
      <Card>
        <CardHeader>
          <CardTitle>AI & ML Capabilities</CardTitle>
          <CardDescription>What this system can do for you</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-primary/10 rounded">
                  <Brain className="h-4 w-4 text-primary" />
                </div>
                <h4 className="font-medium">Predictive Analytics</h4>
              </div>
              <ul className="text-sm text-muted-foreground space-y-1 ml-10">
                <li>• Churn prediction with 90%+ accuracy</li>
                <li>• Giving forecasts with confidence intervals</li>
                <li>• Attendance predictions for planning</li>
                <li>• Member lifetime value estimation</li>
              </ul>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-400/10 rounded">
                  <Lightbulb className="h-4 w-4 text-blue-400" />
                </div>
                <h4 className="font-medium">Intelligent Insights</h4>
              </div>
              <ul className="text-sm text-muted-foreground space-y-1 ml-10">
                <li>• Automated trend detection</li>
                <li>• Anomaly identification</li>
                <li>• Opportunity discovery</li>
                <li>• Actionable recommendations</li>
              </ul>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-purple-400/10 rounded">
                  <MessageSquare className="h-4 w-4 text-purple-400" />
                </div>
                <h4 className="font-medium">Natural Language AI</h4>
              </div>
              <ul className="text-sm text-muted-foreground space-y-1 ml-10">
                <li>• Ask questions in plain English</li>
                <li>• Auto-generated report summaries</li>
                <li>• Prayer request categorization</li>
                <li>• Sentiment analysis</li>
              </ul>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-green-400/10 rounded">
                  <Target className="h-4 w-4 text-green-400" />
                </div>
                <h4 className="font-medium">Smart Recommendations</h4>
              </div>
              <ul className="text-sm text-muted-foreground space-y-1 ml-10">
                <li>• Member engagement opportunities</li>
                <li>• Volunteer role matching</li>
                <li>• Event timing suggestions</li>
                <li>• Communication prioritization</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Coming Soon */}
      <Card className="bg-gradient-to-br from-primary/5 to-transparent border-primary/20">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h4 className="font-medium mb-2">Coming Soon: Advanced AI Features</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• <strong>AI Chat Assistant:</strong> Ask questions like "How many new members joined last month in Lagos?"</li>
                <li>• <strong>Auto Report Generation:</strong> AI-written narrative reports with insights</li>
                <li>• <strong>Predictive Donor Scoring:</strong> Identify high-potential donors before they give</li>
                <li>• <strong>Real-time Anomaly Alerts:</strong> Get notified instantly when something unusual happens</li>
                <li>• <strong>Member Journey Optimization:</strong> AI-suggested next steps for each member</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
