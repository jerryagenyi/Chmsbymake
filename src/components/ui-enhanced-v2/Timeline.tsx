import React from 'react';
import { Circle, Check, Clock, MapPin, User, Calendar, DollarSign, Heart, type LucideIcon } from 'lucide-react';
import { Badge } from '../ui/badge';

export interface TimelineEvent {
  id: string;
  title: string;
  description?: string;
  timestamp: Date;
  icon?: LucideIcon;
  type?: 'default' | 'success' | 'warning' | 'error' | 'info';
  user?: string;
  location?: string;
  metadata?: Record<string, any>;
  badge?: string;
}

interface TimelineProps {
  events: TimelineEvent[];
  variant?: 'default' | 'compact' | 'detailed';
  showTime?: boolean;
  showIcons?: boolean;
  groupByDate?: boolean;
  className?: string;
}

const typeConfig = {
  default: {
    color: 'text-gray-400',
    bg: 'bg-gray-500/10',
    border: 'border-gray-500',
    lineColor: 'bg-[#2A2A30]',
  },
  success: {
    color: 'text-[#1CE479]',
    bg: 'bg-[#1CE479]/10',
    border: 'border-[#1CE479]',
    lineColor: 'bg-[#1CE479]/30',
  },
  warning: {
    color: 'text-orange-500',
    bg: 'bg-orange-500/10',
    border: 'border-orange-500',
    lineColor: 'bg-orange-500/30',
  },
  error: {
    color: 'text-red-500',
    bg: 'bg-red-500/10',
    border: 'border-red-500',
    lineColor: 'bg-red-500/30',
  },
  info: {
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500',
    lineColor: 'bg-blue-500/30',
  },
};

export const Timeline: React.FC<TimelineProps> = ({
  events,
  variant = 'default',
  showTime = true,
  showIcons = true,
  groupByDate = false,
  className = '',
}) => {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined,
      });
    }
  };

  // Group events by date if needed
  const groupedEvents = groupByDate
    ? events.reduce((acc, event) => {
        const dateKey = event.timestamp.toDateString();
        if (!acc[dateKey]) {
          acc[dateKey] = [];
        }
        acc[dateKey].push(event);
        return acc;
      }, {} as Record<string, TimelineEvent[]>)
    : { all: events };

  if (variant === 'compact') {
    return (
      <div className={`space-y-2 ${className}`}>
        {events.map((event, index) => {
          const config = typeConfig[event.type || 'default'];
          const Icon = event.icon || Circle;

          return (
            <div
              key={event.id}
              className="flex items-start gap-3 text-sm"
            >
              <div className={`flex-shrink-0 w-6 h-6 rounded-full ${config.bg} flex items-center justify-center mt-0.5`}>
                <Icon className={`w-3 h-3 ${config.color}`} />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-white">{event.title}</span>
                  {event.badge && (
                    <Badge variant="outline" className="text-xs">
                      {event.badge}
                    </Badge>
                  )}
                </div>
                {showTime && (
                  <div className="text-xs text-gray-500 mt-0.5">
                    {formatTime(event.timestamp)}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className={className}>
      {Object.entries(groupedEvents).map(([dateKey, dateEvents]) => (
        <div key={dateKey} className="space-y-6">
          {/* Date Header */}
          {groupByDate && (
            <div className="flex items-center gap-3 mb-4">
              <div className="text-sm text-gray-400">
                {formatDate(dateEvents[0].timestamp)}
              </div>
              <div className="flex-1 h-px bg-[#2A2A30]" />
            </div>
          )}

          {/* Timeline Events */}
          <div className="relative space-y-6 pl-8">
            {/* Vertical Line */}
            <div className="absolute left-0 top-0 bottom-0 w-px bg-[#2A2A30]" />

            {dateEvents.map((event, index) => {
              const config = typeConfig[event.type || 'default'];
              const Icon = event.icon || Circle;
              const isLast = index === dateEvents.length - 1;

              return (
                <div key={event.id} className="relative">
                  {/* Timeline Dot */}
                  <div
                    className={`
                      absolute -left-8 top-1 w-4 h-4 rounded-full border-2
                      ${config.border} ${config.bg}
                      flex items-center justify-center
                    `}
                  >
                    {showIcons && <Icon className={`w-2 h-2 ${config.color}`} />}
                  </div>

                  {/* Event Card */}
                  <div className={`
                    bg-[#1A1A20] border border-[#2A2A30] rounded-lg p-4
                    hover:border-[#1CE479]/30 transition-colors
                    ${variant === 'detailed' ? 'p-5' : ''}
                  `}>
                    {/* Header */}
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <h4 className="text-white">{event.title}</h4>
                          {event.badge && (
                            <Badge variant="outline" className="text-xs">
                              {event.badge}
                            </Badge>
                          )}
                        </div>
                        
                        {showTime && (
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {formatTime(event.timestamp)}
                            </span>
                            {event.user && (
                              <span className="flex items-center gap-1">
                                <User className="w-3 h-3" />
                                {event.user}
                              </span>
                            )}
                            {event.location && (
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {event.location}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Description */}
                    {event.description && (
                      <p className="text-sm text-gray-400 mb-3">
                        {event.description}
                      </p>
                    )}

                    {/* Metadata */}
                    {variant === 'detailed' && event.metadata && (
                      <div className="grid grid-cols-2 gap-3 pt-3 border-t border-[#2A2A30]">
                        {Object.entries(event.metadata).map(([key, value]) => (
                          <div key={key} className="text-xs">
                            <div className="text-gray-500 mb-0.5">{key}</div>
                            <div className="text-white">{String(value)}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

// Member Journey Timeline (specialized for church member history)
interface MemberJourneyEvent {
  id: string;
  type: 'joined' | 'baptized' | 'married' | 'volunteer' | 'donation' | 'attendance' | 'custom';
  title: string;
  description?: string;
  date: Date;
  details?: Record<string, any>;
}

export const MemberJourneyTimeline: React.FC<{
  events: MemberJourneyEvent[];
  memberName: string;
  className?: string;
}> = ({ events, memberName, className = '' }) => {
  const iconMap: Record<string, LucideIcon> = {
    joined: User,
    baptized: Heart,
    married: Heart,
    volunteer: Calendar,
    donation: DollarSign,
    attendance: Check,
    custom: Circle,
  };

  const typeMap: Record<string, 'default' | 'success' | 'warning' | 'error' | 'info'> = {
    joined: 'success',
    baptized: 'success',
    married: 'success',
    volunteer: 'info',
    donation: 'success',
    attendance: 'default',
    custom: 'default',
  };

  const timelineEvents: TimelineEvent[] = events.map(event => ({
    id: event.id,
    title: event.title,
    description: event.description,
    timestamp: event.date,
    icon: iconMap[event.type],
    type: typeMap[event.type],
    metadata: event.details,
  }));

  return (
    <div className={className}>
      <div className="mb-6">
        <h3 className="text-white mb-1">{memberName}'s Journey</h3>
        <p className="text-sm text-gray-400">
          Member since {events.find(e => e.type === 'joined')?.date.toLocaleDateString() || 'N/A'}
        </p>
      </div>
      
      <Timeline
        events={timelineEvents}
        variant="detailed"
        showTime={true}
        showIcons={true}
        groupByDate={true}
      />
    </div>
  );
};
