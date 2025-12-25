import React, { useState, useRef, useEffect } from 'react';
import { Trash2, Archive, Heart, Star, Check, X, type LucideIcon } from 'lucide-react';

export interface SwipeAction {
  id: string;
  label: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  threshold?: number; // Percentage of card width to trigger action
  onAction: () => void;
}

interface SwipeableCardProps {
  children: React.ReactNode;
  leftActions?: SwipeAction[];
  rightActions?: SwipeAction[];
  onSwipe?: (direction: 'left' | 'right', actionId: string) => void;
  className?: string;
  disabled?: boolean;
}

export const SwipeableCard: React.FC<SwipeableCardProps> = ({
  children,
  leftActions = [],
  rightActions = [],
  onSwipe,
  className = '',
  disabled = false,
}) => {
  const [offset, setOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [activeAction, setActiveAction] = useState<SwipeAction | null>(null);
  const startX = useRef(0);
  const cardRef = useRef<HTMLDivElement>(null);

  const maxSwipe = 150; // Maximum swipe distance

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || disabled) return;

      const deltaX = e.clientX - startX.current;
      const newOffset = Math.max(-maxSwipe, Math.min(maxSwipe, deltaX));
      setOffset(newOffset);

      // Determine which action is active
      const direction = newOffset > 0 ? 'right' : 'left';
      const actions = direction === 'right' ? leftActions : rightActions;
      const percentage = Math.abs(newOffset) / maxSwipe;

      const triggered = actions.find(action => 
        percentage >= (action.threshold || 0.5)
      );
      setActiveAction(triggered || null);
    };

    const handleMouseUp = () => {
      if (!isDragging) return;

      setIsDragging(false);

      if (activeAction) {
        // Execute action
        const direction = offset > 0 ? 'right' : 'left';
        onSwipe?.(direction, activeAction.id);
        activeAction.onAction();
      }

      // Reset
      setOffset(0);
      setActiveAction(null);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, offset, activeAction, leftActions, rightActions, disabled, onSwipe]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (disabled) return;
    setIsDragging(true);
    startX.current = e.clientX;
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (disabled) return;
    setIsDragging(true);
    startX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || disabled) return;

    const deltaX = e.touches[0].clientX - startX.current;
    const newOffset = Math.max(-maxSwipe, Math.min(maxSwipe, deltaX));
    setOffset(newOffset);

    const direction = newOffset > 0 ? 'right' : 'left';
    const actions = direction === 'right' ? leftActions : rightActions;
    const percentage = Math.abs(newOffset) / maxSwipe;

    const triggered = actions.find(action => 
      percentage >= (action.threshold || 0.5)
    );
    setActiveAction(triggered || null);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;

    setIsDragging(false);

    if (activeAction) {
      const direction = offset > 0 ? 'right' : 'left';
      onSwipe?.(direction, activeAction.id);
      activeAction.onAction();
    }

    setOffset(0);
    setActiveAction(null);
  };

  const getActionColor = (action: SwipeAction) => {
    return activeAction?.id === action.id ? action.color : action.bgColor;
  };

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Left Actions (shown when swiping right) */}
      {leftActions.length > 0 && offset > 0 && (
        <div className="absolute left-0 top-0 bottom-0 flex items-stretch">
          {leftActions.map((action) => {
            const ActionIcon = action.icon;
            const isActive = activeAction?.id === action.id;
            
            return (
              <div
                key={action.id}
                className={`
                  flex items-center justify-center px-6
                  transition-colors duration-200
                  ${getActionColor(action)}
                `}
                style={{
                  width: offset / leftActions.length,
                }}
              >
                <ActionIcon
                  className={`
                    transition-all duration-200
                    ${isActive ? 'w-6 h-6 scale-125' : 'w-5 h-5'}
                    text-white
                  `}
                />
              </div>
            );
          })}
        </div>
      )}

      {/* Right Actions (shown when swiping left) */}
      {rightActions.length > 0 && offset < 0 && (
        <div className="absolute right-0 top-0 bottom-0 flex items-stretch flex-row-reverse">
          {rightActions.map((action) => {
            const ActionIcon = action.icon;
            const isActive = activeAction?.id === action.id;
            
            return (
              <div
                key={action.id}
                className={`
                  flex items-center justify-center px-6
                  transition-colors duration-200
                  ${getActionColor(action)}
                `}
                style={{
                  width: Math.abs(offset) / rightActions.length,
                }}
              >
                <ActionIcon
                  className={`
                    transition-all duration-200
                    ${isActive ? 'w-6 h-6 scale-125' : 'w-5 h-5'}
                    text-white
                  `}
                />
              </div>
            );
          })}
        </div>
      )}

      {/* Card Content */}
      <div
        ref={cardRef}
        className={`
          relative bg-[#1A1A20] border border-[#2A2A30] rounded-lg
          transition-transform duration-200
          ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}
          ${disabled ? 'cursor-not-allowed opacity-50' : ''}
        `}
        style={{
          transform: `translateX(${offset}px)`,
        }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {children}
      </div>

      {/* Swipe Indicator */}
      {isDragging && activeAction && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          <div className={`
            px-4 py-2 rounded-lg ${activeAction.bgColor} text-white
            flex items-center gap-2 shadow-lg
            animate-pulse
          `}>
            <activeAction.icon className="w-5 h-5" />
            <span className="text-sm">{activeAction.label}</span>
          </div>
        </div>
      )}
    </div>
  );
};

// Preset swipe actions for common use cases
export const deleteAction: SwipeAction = {
  id: 'delete',
  label: 'Delete',
  icon: Trash2,
  color: 'text-white',
  bgColor: 'bg-red-600',
  threshold: 0.6,
  onAction: () => {},
};

export const archiveAction: SwipeAction = {
  id: 'archive',
  label: 'Archive',
  icon: Archive,
  color: 'text-white',
  bgColor: 'bg-gray-600',
  threshold: 0.5,
  onAction: () => {},
};

export const favoriteAction: SwipeAction = {
  id: 'favorite',
  label: 'Favorite',
  icon: Star,
  color: 'text-white',
  bgColor: 'bg-yellow-600',
  threshold: 0.5,
  onAction: () => {},
};

export const approveAction: SwipeAction = {
  id: 'approve',
  label: 'Approve',
  icon: Check,
  color: 'text-white',
  bgColor: 'bg-[#1CE479]',
  threshold: 0.5,
  onAction: () => {},
};

export const rejectAction: SwipeAction = {
  id: 'reject',
  label: 'Reject',
  icon: X,
  color: 'text-white',
  bgColor: 'bg-red-600',
  threshold: 0.6,
  onAction: () => {},
};

// Example usage component
export const SwipeableList: React.FC<{
  items: Array<{ id: string; content: React.ReactNode }>;
  onDelete?: (id: string) => void;
  onArchive?: (id: string) => void;
  onFavorite?: (id: string) => void;
}> = ({ items, onDelete, onArchive, onFavorite }) => {
  const leftActions = [
    onFavorite && {
      ...favoriteAction,
      onAction: () => {},
    },
  ].filter(Boolean) as SwipeAction[];

  const rightActions = [
    onArchive && {
      ...archiveAction,
      onAction: () => {},
    },
    onDelete && {
      ...deleteAction,
      onAction: () => {},
    },
  ].filter(Boolean) as SwipeAction[];

  return (
    <div className="space-y-2">
      {items.map((item) => (
        <SwipeableCard
          key={item.id}
          leftActions={leftActions.map(action => ({
            ...action,
            onAction: () => {
              if (action.id === 'favorite') onFavorite?.(item.id);
            },
          }))}
          rightActions={rightActions.map(action => ({
            ...action,
            onAction: () => {
              if (action.id === 'delete') onDelete?.(item.id);
              if (action.id === 'archive') onArchive?.(item.id);
            },
          }))}
        >
          {item.content}
        </SwipeableCard>
      ))}
    </div>
  );
};
