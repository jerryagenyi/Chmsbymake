import React from 'react';
import {
  Users,
  Calendar,
  DollarSign,
  Search,
  WifiOff,
  Filter,
  Inbox,
  FileX,
  AlertCircle,
  CheckCircle2,
  type LucideIcon,
} from 'lucide-react';
import { Button } from '../ui/button';

interface EmptyStateProps {
  variant?: 'no-data' | 'no-results' | 'offline' | 'error' | 'success' | 'custom';
  icon?: LucideIcon;
  title?: string;
  description?: string;
  primaryAction?: {
    label: string;
    onClick: () => void;
    icon?: LucideIcon;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  illustration?: 'members' | 'events' | 'donations' | 'search' | 'offline' | 'filter' | 'inbox' | 'file' | 'custom';
  customIllustration?: React.ReactNode;
  className?: string;
  compact?: boolean;
}

const illustrationMap = {
  members: Users,
  events: Calendar,
  donations: DollarSign,
  search: Search,
  offline: WifiOff,
  filter: Filter,
  inbox: Inbox,
  file: FileX,
};

const variantConfig = {
  'no-data': {
    iconColor: 'text-gray-500',
    bgColor: 'bg-gray-500/10',
    defaultTitle: 'No data yet',
    defaultDescription: 'Get started by adding your first item',
  },
  'no-results': {
    iconColor: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
    defaultTitle: 'No results found',
    defaultDescription: 'Try adjusting your filters or search terms',
  },
  'offline': {
    iconColor: 'text-orange-500',
    bgColor: 'bg-orange-500/10',
    defaultTitle: 'You\'re offline',
    defaultDescription: 'Check your internet connection and try again',
  },
  'error': {
    iconColor: 'text-red-500',
    bgColor: 'bg-red-500/10',
    defaultTitle: 'Something went wrong',
    defaultDescription: 'We encountered an error. Please try again',
  },
  'success': {
    iconColor: 'text-[#1CE479]',
    bgColor: 'bg-[#1CE479]/10',
    defaultTitle: 'All done!',
    defaultDescription: 'Everything is up to date',
  },
  'custom': {
    iconColor: 'text-gray-500',
    bgColor: 'bg-gray-500/10',
    defaultTitle: '',
    defaultDescription: '',
  },
};

export const EmptyState: React.FC<EmptyStateProps> = ({
  variant = 'no-data',
  icon: CustomIcon,
  title,
  description,
  primaryAction,
  secondaryAction,
  illustration = 'inbox',
  customIllustration,
  className = '',
  compact = false,
}) => {
  const config = variantConfig[variant];
  const IllustrationIcon = CustomIcon || illustrationMap[illustration] || Inbox;

  // Special icons for variant types
  let VariantIcon = IllustrationIcon;
  if (variant === 'error' && !CustomIcon) {
    VariantIcon = AlertCircle;
  } else if (variant === 'success' && !CustomIcon) {
    VariantIcon = CheckCircle2;
  } else if (variant === 'offline' && !CustomIcon) {
    VariantIcon = WifiOff;
  }

  return (
    <div className={`flex flex-col items-center justify-center text-center ${compact ? 'py-8' : 'py-16 px-4'} ${className}`}>
      {/* Illustration */}
      {customIllustration ? (
        <div className="mb-6">{customIllustration}</div>
      ) : (
        <div className={`
          ${compact ? 'w-16 h-16 mb-4' : 'w-24 h-24 mb-6'}
          rounded-full ${config.bgColor} flex items-center justify-center
          animate-in fade-in zoom-in duration-500
        `}>
          <VariantIcon className={`${compact ? 'w-8 h-8' : 'w-12 h-12'} ${config.iconColor}`} />
        </div>
      )}

      {/* Title */}
      <h3 className={`text-white ${compact ? 'mb-2' : 'mb-3'} animate-in fade-in slide-in-from-bottom-2 duration-500 delay-100`}>
        {title || config.defaultTitle}
      </h3>

      {/* Description */}
      {(description || config.defaultDescription) && (
        <p className={`
          text-gray-400 max-w-md mx-auto
          ${compact ? 'text-sm mb-4' : 'mb-6'}
          animate-in fade-in slide-in-from-bottom-2 duration-500 delay-150
        `}>
          {description || config.defaultDescription}
        </p>
      )}

      {/* Actions */}
      {(primaryAction || secondaryAction) && (
        <div className="flex flex-col sm:flex-row gap-3 animate-in fade-in slide-in-from-bottom-2 duration-500 delay-200">
          {primaryAction && (
            <Button
              onClick={primaryAction.onClick}
              className="bg-[#1CE479] text-[#0A0A0F] hover:bg-[#1CE479]/90"
              size={compact ? 'sm' : 'default'}
            >
              {primaryAction.icon && <primaryAction.icon className="w-4 h-4 mr-2" />}
              {primaryAction.label}
            </Button>
          )}

          {secondaryAction && (
            <Button
              onClick={secondaryAction.onClick}
              variant="outline"
              className="border-[#2A2A30] hover:border-[#1CE479] hover:bg-[#1CE479]/10"
              size={compact ? 'sm' : 'default'}
            >
              {secondaryAction.label}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

// Preset Empty States for common scenarios
export const NoMembersState: React.FC<{
  onAddMember: () => void;
}> = ({ onAddMember }) => (
  <EmptyState
    variant="no-data"
    illustration="members"
    title="No members yet"
    description="Start building your church community by adding your first member"
    primaryAction={{
      label: 'Add First Member',
      onClick: onAddMember,
      icon: Users,
    }}
  />
);

export const NoEventsState: React.FC<{
  onCreateEvent: () => void;
}> = ({ onCreateEvent }) => (
  <EmptyState
    variant="no-data"
    illustration="events"
    title="No events scheduled"
    description="Create your first event to engage with your community"
    primaryAction={{
      label: 'Create Event',
      onClick: onCreateEvent,
      icon: Calendar,
    }}
  />
);

export const NoDonationsState: React.FC<{
  onRecordDonation: () => void;
}> = ({ onRecordDonation }) => (
  <EmptyState
    variant="no-data"
    illustration="donations"
    title="No donations recorded"
    description="Start tracking your church's giving by recording the first donation"
    primaryAction={{
      label: 'Record Donation',
      onClick: onRecordDonation,
      icon: DollarSign,
    }}
  />
);

export const NoSearchResultsState: React.FC<{
  onClearFilters?: () => void;
}> = ({ onClearFilters }) => (
  <EmptyState
    variant="no-results"
    illustration="search"
    title="No results found"
    description="We couldn't find any matches. Try adjusting your search or filters"
    primaryAction={onClearFilters ? {
      label: 'Clear Filters',
      onClick: onClearFilters,
      icon: Filter,
    } : undefined}
  />
);

export const OfflineState: React.FC<{
  onRetry?: () => void;
}> = ({ onRetry }) => (
  <EmptyState
    variant="offline"
    illustration="offline"
    title="You're offline"
    description="Please check your internet connection. Your changes will sync when you're back online"
    primaryAction={onRetry ? {
      label: 'Try Again',
      onClick: onRetry,
    } : undefined}
  />
);
