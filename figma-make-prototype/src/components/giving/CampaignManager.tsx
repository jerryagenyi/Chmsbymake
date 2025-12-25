/**
 * ChurchAfrica ChMS - Campaign Manager
 * Manage fundraising campaigns and special projects
 */

import React from 'react';
import { 
  Target, 
  TrendingUp, 
  Users, 
  Calendar,
  Plus,
  MoreVertical,
  Edit,
  Trash2,
  CheckCircle2,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import type { Campaign } from '../../types/giving';

interface CampaignManagerProps {
  campaigns: Campaign[];
  onCreateCampaign: () => void;
  onEditCampaign: (campaign: Campaign) => void;
  onDeleteCampaign: (campaignId: string) => void;
  onViewDetails: (campaign: Campaign) => void;
}

export function CampaignManager({
  campaigns,
  onCreateCampaign,
  onEditCampaign,
  onDeleteCampaign,
  onViewDetails,
}: CampaignManagerProps) {
  // Format currency
  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Calculate progress percentage
  const getProgress = (current: number, goal: number) => {
    return Math.min((current / goal) * 100, 100);
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'completed':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'cancelled':
        return 'bg-red-500/10 text-red-400 border-red-500/20';
      default:
        return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  // Get days remaining
  const getDaysRemaining = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const diff = end.getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days;
  };

  // Separate active and completed campaigns
  const activeCampaigns = campaigns.filter(c => c.status === 'active');
  const completedCampaigns = campaigns.filter(c => c.status === 'completed');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl mb-1">Fundraising Campaigns</h2>
          <p className="text-sm text-muted-foreground">
            Manage special projects and fundraising initiatives
          </p>
        </div>
        <Button onClick={onCreateCampaign} className="bg-primary hover:bg-primary/90">
          <Plus className="h-4 w-4 mr-2" />
          New Campaign
        </Button>
      </div>

      {/* Active Campaigns */}
      {activeCampaigns.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-muted-foreground">
            Active Campaigns ({activeCampaigns.length})
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {activeCampaigns.map((campaign) => {
              const progress = getProgress(campaign.current_amount, campaign.goal_amount);
              const daysRemaining = getDaysRemaining(campaign.end_date);
              
              return (
                <Card 
                  key={campaign.id}
                  className="hover:border-primary/40 transition-colors cursor-pointer"
                  onClick={() => onViewDetails(campaign)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={getStatusColor(campaign.status)}>
                            {campaign.status}
                          </Badge>
                          {daysRemaining <= 30 && daysRemaining > 0 && (
                            <Badge variant="outline" className="text-xs">
                              {daysRemaining} days left
                            </Badge>
                          )}
                        </div>
                        <CardTitle className="text-lg mb-1">{campaign.name}</CardTitle>
                        <CardDescription className="line-clamp-2">
                          {campaign.description}
                        </CardDescription>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={(e) => {
                            e.stopPropagation();
                            onEditCampaign(campaign);
                          }}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Campaign
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-red-400"
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteCampaign(campaign.id);
                            }}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Campaign
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Progress */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Progress</span>
                        <span className="text-sm font-medium">{progress.toFixed(1)}%</span>
                      </div>
                      <Progress value={progress} className="h-2" />
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-lg font-semibold text-primary">
                          {formatCurrency(campaign.current_amount, campaign.currency)}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          of {formatCurrency(campaign.goal_amount, campaign.currency)}
                        </span>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4">
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <Users className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Donors</p>
                          <p className="text-sm font-medium">{campaign.donor_count}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-green-500/10 rounded-lg">
                          <Target className="h-4 w-4 text-green-400" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Remaining</p>
                          <p className="text-sm font-medium">
                            {formatCurrency(campaign.goal_amount - campaign.current_amount, campaign.currency)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-blue-500/10 rounded-lg">
                          <Calendar className="h-4 w-4 text-blue-400" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Ends</p>
                          <p className="text-sm font-medium">
                            {new Date(campaign.end_date).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric' 
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Completed Campaigns */}
      {completedCampaigns.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-muted-foreground">
            Completed Campaigns ({completedCampaigns.length})
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {completedCampaigns.map((campaign) => {
              const progress = getProgress(campaign.current_amount, campaign.goal_amount);
              
              return (
                <Card 
                  key={campaign.id}
                  className="opacity-75 hover:opacity-100 transition-opacity cursor-pointer"
                  onClick={() => onViewDetails(campaign)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={getStatusColor(campaign.status)}>
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            {campaign.status}
                          </Badge>
                        </div>
                        <CardTitle className="text-lg mb-1">{campaign.name}</CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-semibold text-primary">
                        {formatCurrency(campaign.current_amount, campaign.currency)}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {progress.toFixed(0)}% achieved
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        {campaign.donor_count} donors contributed
                      </span>
                      <span className="text-muted-foreground">
                        {new Date(campaign.end_date).toLocaleDateString()}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Empty State */}
      {campaigns.length === 0 && (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Target className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">No Campaigns Yet</h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto mb-4">
                Create your first fundraising campaign to track special projects, building funds, or mission initiatives.
              </p>
              <Button onClick={onCreateCampaign} className="bg-primary hover:bg-primary/90">
                <Plus className="h-4 w-4 mr-2" />
                Create Campaign
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
