/**
 * ChurchAfrica ChMS - Dashboard Configuration
 * Default KPI card definitions and AI recommendations
 */

import { 
  Users, 
  TrendingUp, 
  DollarSign, 
  UsersRound,
  Calendar,
  Target,
  Heart,
  UserPlus,
  Gift,
  MessageSquare,
  Activity,
  BookOpen,
  Phone,
  Mail,
  Clock,
  Award,
  Shield,
  Zap,
  TrendingDown,
  AlertCircle,
  CheckCircle,
  Star,
  Home,
} from 'lucide-react';
import { KPICardDefinition, DashboardConfig } from '../components/dashboard/DashboardCustomizer';
import { KPICardProps } from '../components/dashboard/KPICard';

export interface KPICardData extends KPICardDefinition {
  cardProps: Omit<KPICardProps, 'onClick'>;
}

// All available KPI cards with their data
export const AVAILABLE_KPI_CARDS: KPICardData[] = [
  // Membership Cards
  {
    id: 'total-members',
    title: 'Total Members',
    category: 'membership',
    recommended: true,
    cardProps: {
      title: 'Total Members',
      value: '1,248',
      change: 12,
      changeLabel: 'vs last month',
      trend: 'up',
      icon: Users,
      color: 'primary',
      subtitle: 'Active members',
    },
  },
  {
    id: 'new-members',
    title: 'New Members',
    category: 'membership',
    recommended: true,
    cardProps: {
      title: 'New Members',
      value: '32',
      change: 28,
      changeLabel: 'this month',
      trend: 'up',
      icon: UserPlus,
      color: 'success',
      subtitle: 'Monthly additions',
    },
  },
  {
    id: 'member-retention',
    title: 'Member Retention',
    category: 'membership',
    recommended: false,
    cardProps: {
      title: 'Member Retention',
      value: '94.2%',
      change: 2.1,
      changeLabel: 'vs last quarter',
      trend: 'up',
      icon: Shield,
      color: 'info',
      subtitle: '90-day retention',
    },
  },
  {
    id: 'inactive-members',
    title: 'Inactive Members',
    category: 'membership',
    recommended: false,
    cardProps: {
      title: 'Inactive Members',
      value: '87',
      change: -5,
      changeLabel: 'vs last month',
      trend: 'down',
      icon: AlertCircle,
      color: 'warning',
      subtitle: '30+ days inactive',
    },
  },

  // Attendance Cards
  {
    id: 'weekly-attendance',
    title: 'Weekly Attendance',
    category: 'attendance',
    recommended: true,
    cardProps: {
      title: 'Weekly Attendance',
      value: '342',
      change: 8,
      changeLabel: 'vs last week',
      trend: 'up',
      icon: TrendingUp,
      color: 'success',
      subtitle: 'Sunday service',
    },
  },
  {
    id: 'attendance-rate',
    title: 'Attendance Rate',
    category: 'attendance',
    recommended: false,
    cardProps: {
      title: 'Attendance Rate',
      value: '68%',
      change: 3,
      changeLabel: 'vs last month',
      trend: 'up',
      icon: Activity,
      color: 'info',
      subtitle: 'Average weekly',
    },
  },
  {
    id: 'midweek-attendance',
    title: 'Midweek Service',
    category: 'attendance',
    recommended: false,
    cardProps: {
      title: 'Midweek Service',
      value: '124',
      change: -2,
      changeLabel: 'vs last week',
      trend: 'down',
      icon: Clock,
      color: 'accent',
      subtitle: 'Wednesday service',
    },
  },
  {
    id: 'first-timers',
    title: 'First Timers',
    category: 'attendance',
    recommended: true,
    cardProps: {
      title: 'First Timers',
      value: '23',
      change: 18,
      changeLabel: 'this month',
      trend: 'up',
      icon: Target,
      color: 'success',
      subtitle: 'New visitors',
    },
  },

  // Giving & Finance Cards
  {
    id: 'monthly-giving',
    title: 'Monthly Giving',
    category: 'giving',
    recommended: true,
    cardProps: {
      title: 'Monthly Giving',
      value: '₦89.8k',
      change: 15,
      changeLabel: 'vs last month',
      trend: 'up',
      icon: DollarSign,
      color: 'primary',
      subtitle: 'All sources',
    },
  },
  {
    id: 'online-giving',
    title: 'Online Giving',
    category: 'giving',
    recommended: false,
    cardProps: {
      title: 'Online Giving',
      value: '₦42.3k',
      change: 22,
      changeLabel: 'vs last month',
      trend: 'up',
      icon: Zap,
      color: 'success',
      subtitle: 'Digital payments',
    },
  },
  {
    id: 'pledges',
    title: 'Active Pledges',
    category: 'giving',
    recommended: false,
    cardProps: {
      title: 'Active Pledges',
      value: '₦156k',
      change: 8,
      changeLabel: 'vs last month',
      trend: 'up',
      icon: Gift,
      color: 'accent',
      subtitle: 'Commitment total',
    },
  },
  {
    id: 'donors',
    title: 'Active Donors',
    category: 'giving',
    recommended: false,
    cardProps: {
      title: 'Active Donors',
      value: '284',
      change: 6,
      changeLabel: 'this month',
      trend: 'up',
      icon: Heart,
      color: 'primary',
      subtitle: 'Monthly givers',
    },
  },

  // Engagement Cards
  {
    id: 'active-groups',
    title: 'Active Groups',
    category: 'engagement',
    recommended: true,
    cardProps: {
      title: 'Active Groups',
      value: '24',
      change: 2,
      changeLabel: 'new this month',
      trend: 'up',
      icon: UsersRound,
      color: 'info',
      subtitle: 'Fellowship groups',
    },
  },
  {
    id: 'group-participation',
    title: 'Group Participation',
    category: 'engagement',
    recommended: false,
    cardProps: {
      title: 'Group Participation',
      value: '456',
      change: 12,
      changeLabel: 'active members',
      trend: 'up',
      icon: Star,
      color: 'accent',
      subtitle: 'In small groups',
    },
  },
  {
    id: 'volunteers',
    title: 'Active Volunteers',
    category: 'engagement',
    recommended: false,
    cardProps: {
      title: 'Active Volunteers',
      value: '89',
      change: 7,
      changeLabel: 'this month',
      trend: 'up',
      icon: Award,
      color: 'success',
      subtitle: 'Serving regularly',
    },
  },
  {
    id: 'prayer-requests',
    title: 'Prayer Requests',
    category: 'engagement',
    recommended: false,
    cardProps: {
      title: 'Prayer Requests',
      value: '34',
      change: 5,
      changeLabel: 'this week',
      trend: 'up',
      icon: MessageSquare,
      color: 'info',
      subtitle: 'Needs attention',
    },
  },

  // Events & Programs Cards
  {
    id: 'upcoming-events',
    title: 'Upcoming Events',
    category: 'events',
    recommended: true,
    cardProps: {
      title: 'Upcoming Events',
      value: '8',
      change: -1,
      changeLabel: 'vs last month',
      trend: 'down',
      icon: Calendar,
      color: 'accent',
      subtitle: 'Next 30 days',
    },
  },
  {
    id: 'event-registrations',
    title: 'Event Registrations',
    category: 'events',
    recommended: false,
    cardProps: {
      title: 'Event Registrations',
      value: '156',
      change: 34,
      changeLabel: 'this week',
      trend: 'up',
      icon: CheckCircle,
      color: 'success',
      subtitle: 'Upcoming events',
    },
  },
  {
    id: 'sunday-school',
    title: 'Sunday School',
    category: 'events',
    recommended: false,
    cardProps: {
      title: 'Sunday School',
      value: '78',
      change: 4,
      changeLabel: 'this week',
      trend: 'up',
      icon: BookOpen,
      color: 'info',
      subtitle: 'Children enrolled',
    },
  },
  {
    id: 'ministry-programs',
    title: 'Ministry Programs',
    category: 'events',
    recommended: false,
    cardProps: {
      title: 'Ministry Programs',
      value: '12',
      change: 1,
      changeLabel: 'active programs',
      trend: 'up',
      icon: Home,
      color: 'primary',
      subtitle: 'Running this month',
    },
  },
];

// Default dashboard configuration
export const DEFAULT_DASHBOARD_CONFIG: DashboardConfig = {
  cardsPerRow: 3,
  rowCount: 2,
  density: 'standard',
  visibleCards: [
    'total-members',
    'weekly-attendance',
    'monthly-giving',
    'active-groups',
    'upcoming-events',
    'first-timers',
  ],
};

// AI-recommended card sets based on church size and focus
export const AI_RECOMMENDATIONS = {
  'small-church': [
    'total-members',
    'weekly-attendance',
    'first-timers',
    'monthly-giving',
    'active-groups',
    'upcoming-events',
  ],
  'medium-church': [
    'total-members',
    'new-members',
    'weekly-attendance',
    'first-timers',
    'monthly-giving',
    'active-groups',
    'upcoming-events',
    'volunteers',
  ],
  'large-church': [
    'total-members',
    'new-members',
    'weekly-attendance',
    'attendance-rate',
    'monthly-giving',
    'online-giving',
    'active-groups',
    'group-participation',
  ],
  'growth-focused': [
    'new-members',
    'first-timers',
    'member-retention',
    'weekly-attendance',
    'attendance-rate',
    'event-registrations',
  ],
  'finance-focused': [
    'monthly-giving',
    'online-giving',
    'donors',
    'pledges',
    'total-members',
    'weekly-attendance',
  ],
  'engagement-focused': [
    'active-groups',
    'group-participation',
    'volunteers',
    'prayer-requests',
    'weekly-attendance',
    'upcoming-events',
  ],
};

// Get card data by ID
export function getCardDataById(id: string): KPICardData | undefined {
  return AVAILABLE_KPI_CARDS.find(card => card.id === id);
}

// Get card definitions (without data) for the customizer
export function getCardDefinitions(): KPICardDefinition[] {
  return AVAILABLE_KPI_CARDS.map(({ id, title, category, recommended }) => ({
    id,
    title,
    category,
    recommended,
  }));
}
