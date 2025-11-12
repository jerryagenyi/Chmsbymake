import React, { useState } from 'react';
import { Bell, X, Check, Trash2, Settings, Filter, type LucideIcon } from 'lucide-react';
import { Button } from '../ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'announcement' | 'prayer' | 'event' | 'donation';
  title: string;
  message: string;
  icon?: LucideIcon;
  timestamp: Date;
  read: boolean;
  actionLabel?: string;
  onAction?: () => void;
  link?: string;
}

interface NotificationCenterProps {
  notifications: Notification[];
  onMarkAsRead: (notificationId: string) => void;
  onMarkAllAsRead: () => void;
  onDelete: (notificationId: string) => void;
  onClearAll: () => void;
  onNotificationClick?: (notification: Notification) => void;
  maxHeight?: string;
  className?: string;
}

const typeConfig = {
  info: { color: 'text-blue-500', bg: 'bg-blue-500/10' },
  success: { color: 'text-[#1CE479]', bg: 'bg-[#1CE479]/10' },
  warning: { color: 'text-orange-500', bg: 'bg-orange-500/10' },
  error: { color: 'text-red-500', bg: 'bg-red-500/10' },
  announcement: { color: 'text-purple-500', bg: 'bg-purple-500/10' },
  prayer: { color: 'text-pink-500', bg: 'bg-pink-500/10' },
  event: { color: 'text-cyan-500', bg: 'bg-cyan-500/10' },
  donation: { color: 'text-[#1CE479]', bg: 'bg-[#1CE479]/10' },
};

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onDelete,
  onClearAll,
  onNotificationClick,
  maxHeight = '500px',
  className = '',
}) => {
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [open, setOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;
  
  const filteredNotifications = notifications.filter(n => 
    filter === 'all' ? true : !n.read
  );

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      onMarkAsRead(notification.id);
    }
    onNotificationClick?.(notification);
    if (notification.link) {
      window.location.href = notification.link;
    }
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={`relative hover:bg-[#2A2A30] ${className}`}
        >
          <Bell className="w-5 h-5 text-gray-400" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="w-96 p-0 bg-[#1A1A20] border-[#2A2A30]"
        align="end"
      >
        {/* Header */}
        <div className="p-4 border-b border-[#2A2A30]">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-white flex items-center gap-2">
              Notifications
              {unreadCount > 0 && (
                <Badge className="bg-red-500 text-white">
                  {unreadCount}
                </Badge>
              )}
            </h3>
            <div className="flex gap-1">
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onMarkAllAsRead}
                  className="text-xs text-[#1CE479] hover:bg-[#1CE479]/10"
                >
                  <Check className="w-3 h-3 mr-1" />
                  Mark all read
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                className="hover:bg-[#2A2A30]"
              >
                <Settings className="w-4 h-4 text-gray-400" />
              </Button>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`
                flex-1 px-3 py-1.5 text-sm rounded-lg transition-colors
                ${filter === 'all'
                  ? 'bg-[#1CE479]/10 text-[#1CE479]'
                  : 'text-gray-400 hover:text-white'
                }
              `}
            >
              All ({notifications.length})
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`
                flex-1 px-3 py-1.5 text-sm rounded-lg transition-colors
                ${filter === 'unread'
                  ? 'bg-[#1CE479]/10 text-[#1CE479]'
                  : 'text-gray-400 hover:text-white'
                }
              `}
            >
              Unread ({unreadCount})
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <ScrollArea className="h-[400px]">
          {filteredNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Bell className="w-12 h-12 text-gray-600 mb-3" />
              <p className="text-gray-400">No notifications</p>
              <p className="text-sm text-gray-500 mt-1">
                {filter === 'unread' ? 'All caught up!' : 'You have no notifications'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-[#2A2A30]">
              {filteredNotifications.map((notification) => {
                const config = typeConfig[notification.type];
                const NotificationIcon = notification.icon || Bell;

                return (
                  <div
                    key={notification.id}
                    className={`
                      p-4 transition-colors cursor-pointer
                      ${!notification.read ? 'bg-[#1CE479]/5' : 'hover:bg-[#2A2A30]'}
                    `}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex gap-3">
                      {/* Icon */}
                      <div className={`flex-shrink-0 w-10 h-10 rounded-full ${config.bg} flex items-center justify-center`}>
                        <NotificationIcon className={`w-5 h-5 ${config.color}`} />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h4 className={`text-sm ${!notification.read ? 'text-white' : 'text-gray-300'}`}>
                            {notification.title}
                          </h4>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-[#1CE479] rounded-full flex-shrink-0 mt-1" />
                          )}
                        </div>
                        
                        <p className="text-sm text-gray-400 mb-2 line-clamp-2">
                          {notification.message}
                        </p>

                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">
                            {formatTimestamp(notification.timestamp)}
                          </span>

                          <div className="flex gap-1">
                            {notification.actionLabel && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  notification.onAction?.();
                                }}
                                className="h-6 px-2 text-xs text-[#1CE479] hover:bg-[#1CE479]/10"
                              >
                                {notification.actionLabel}
                              </Button>
                            )}
                            
                            {!notification.read && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onMarkAsRead(notification.id);
                                }}
                                className="h-6 px-2 text-xs hover:bg-[#2A2A30] text-gray-400 hover:text-white"
                                title="Mark as read"
                              >
                                <Check className="w-3 h-3 mr-1" />
                                Mark read
                              </Button>
                            )}

                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                onDelete(notification.id);
                              }}
                              className="h-6 px-2 text-xs hover:bg-red-500/10 text-gray-400 hover:text-red-400"
                              title="Clear notification"
                            >
                              <X className="w-3 h-3 mr-1" />
                              Clear
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>

        {/* Footer */}
        {filteredNotifications.length > 0 && (
          <div className="p-3 border-t border-[#2A2A30]">
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearAll}
              className="w-full text-gray-400 hover:text-white hover:bg-[#2A2A30]"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear all notifications
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};

// Simplified Notification Bell (just shows count)
export const NotificationBell: React.FC<{
  count: number;
  onClick: () => void;
  className?: string;
}> = ({ count, onClick, className = '' }) => (
  <button
    onClick={onClick}
    className={`relative p-2 hover:bg-[#2A2A30] rounded-lg transition-colors ${className}`}
  >
    <Bell className="w-5 h-5 text-gray-400" />
    {count > 0 && (
      <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
        {count > 9 ? '9+' : count}
      </span>
    )}
  </button>
);