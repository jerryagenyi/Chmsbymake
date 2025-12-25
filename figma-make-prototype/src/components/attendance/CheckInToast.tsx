/**
 * ChurchAfrica ChMS - Check-In Toast Notifications
 * Real-time, non-intrusive notifications when members check in
 * Auto-dismiss after 2 seconds
 */

import React from 'react';
import { CheckCircle2, Users, X } from 'lucide-react';
import { Member } from '../../types/member';
import { cn } from '../ui/utils';

export interface CheckInNotification {
  id: string;
  member: Member;
  familyCount?: number;
  timestamp: Date;
}

interface CheckInToastProps {
  notifications: CheckInNotification[];
  onDismiss: (id: string) => void;
}

export function CheckInToast({ notifications, onDismiss }: CheckInToastProps) {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 pointer-events-none">
      {notifications.map((notification) => (
        <CheckInToastItem
          key={notification.id}
          notification={notification}
          onDismiss={onDismiss}
        />
      ))}
    </div>
  );
}

interface CheckInToastItemProps {
  notification: CheckInNotification;
  onDismiss: (id: string) => void;
}

function CheckInToastItem({ notification, onDismiss }: CheckInToastItemProps) {
  const [isExiting, setIsExiting] = React.useState(false);

  React.useEffect(() => {
    // Auto-dismiss after 2 seconds
    const dismissTimer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => {
        onDismiss(notification.id);
      }, 300); // Wait for exit animation
    }, 2000);

    return () => clearTimeout(dismissTimer);
  }, [notification.id, onDismiss]);

  return (
    <div
      className={cn(
        "bg-[#1A1A20] border-2 border-[#1CE479] rounded-lg shadow-lg p-4 min-w-[320px] pointer-events-auto",
        "flex items-center gap-3 transition-all duration-300",
        isExiting 
          ? "animate-out slide-out-to-right-full fade-out" 
          : "animate-in slide-in-from-right-full fade-in"
      )}
    >
      {/* Icon */}
      <div className="h-10 w-10 rounded-full bg-[#1CE479]/20 flex items-center justify-center flex-shrink-0">
        <CheckCircle2 className="h-6 w-6 text-[#1CE479]" />
      </div>

      {/* Content */}
      <div className="flex-1">
        <p className="font-medium text-[#1CE479]">
          {notification.member.firstName} {notification.member.lastName}
        </p>
        <p className="text-xs text-muted-foreground">
          {notification.familyCount && notification.familyCount > 1 ? (
            <span className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              +{notification.familyCount - 1} family member{notification.familyCount > 2 ? 's' : ''}
            </span>
          ) : (
            'Checked in'
          )}
        </p>
      </div>

      {/* Dismiss Button */}
      <button
        onClick={() => {
          setIsExiting(true);
          setTimeout(() => {
            onDismiss(notification.id);
          }, 300);
        }}
        className="h-6 w-6 rounded-full hover:bg-background/50 flex items-center justify-center transition-colors flex-shrink-0"
        aria-label="Dismiss"
      >
        <X className="h-4 w-4 text-muted-foreground" />
      </button>
    </div>
  );
}
