import React, { useState } from 'react';
import { Plus, X, Users, Calendar, DollarSign, MessageSquare, Camera, FileText, type LucideIcon } from 'lucide-react';
import { Button } from '../ui/button';

export interface FABAction {
  id: string;
  label: string;
  icon: LucideIcon;
  onClick: () => void;
  color?: string;
}

interface FloatingActionButtonProps {
  actions?: FABAction[];
  position?: 'bottom-right' | 'bottom-left' | 'bottom-center';
  variant?: 'default' | 'expandable' | 'contextual';
  mainIcon?: LucideIcon;
  mainLabel?: string;
  onMainClick?: () => void;
  className?: string;
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  actions = [],
  position = 'bottom-right',
  variant = 'default',
  mainIcon: MainIcon = Plus,
  mainLabel = 'Quick Actions',
  onMainClick,
  className = '',
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const positionClasses = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
    'bottom-center': 'bottom-6 left-1/2 -translate-x-1/2',
  };

  const handleMainClick = () => {
    if (variant === 'expandable' && actions.length > 0) {
      setIsExpanded(!isExpanded);
    } else if (onMainClick) {
      onMainClick();
    }
  };

  const handleActionClick = (action: FABAction) => {
    action.onClick();
    setIsExpanded(false);
  };

  if (variant === 'default' && !onMainClick && actions.length === 0) {
    return null;
  }

  return (
    <div className={`fixed ${positionClasses[position]} z-50 ${className}`}>
      {/* Action Buttons (appear when expanded) */}
      {variant === 'expandable' && isExpanded && (
        <div className="absolute bottom-20 right-0 flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-4 duration-300">
          {actions.map((action, index) => {
            const ActionIcon = action.icon;
            
            return (
              <div
                key={action.id}
                className="flex items-center gap-3 animate-in fade-in slide-in-from-right duration-300"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Label */}
                <div className="bg-[#1A1A20] border border-[#2A2A30] rounded-lg px-3 py-2 shadow-lg">
                  <span className="text-sm text-white whitespace-nowrap">
                    {action.label}
                  </span>
                </div>

                {/* Action Button */}
                <button
                  onClick={() => handleActionClick(action)}
                  className={`
                    w-12 h-12 rounded-full shadow-lg
                    flex items-center justify-center
                    transition-all duration-300 hover:scale-110
                    ${action.color || 'bg-[#2A2A30] hover:bg-[#3A3A40]'}
                  `}
                  title={action.label}
                >
                  <ActionIcon className="w-5 h-5 text-white" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Main FAB Button */}
      <button
        onClick={handleMainClick}
        className={`
          w-14 h-14 rounded-full shadow-2xl
          bg-[#1CE479] hover:bg-[#1CE479]/90
          text-[#0A0A0F]
          flex items-center justify-center
          transition-all duration-300 hover:scale-110
          ${isExpanded ? 'rotate-45' : ''}
        `}
        title={mainLabel}
        aria-label={mainLabel}
      >
        {isExpanded ? (
          <X className="w-6 h-6" />
        ) : (
          <MainIcon className="w-6 h-6" />
        )}
      </button>

      {/* Backdrop */}
      {isExpanded && (
        <div
          className="fixed inset-0 -z-10 bg-black/20 animate-in fade-in duration-300"
          onClick={() => setIsExpanded(false)}
        />
      )}
    </div>
  );
};

// Preset FABs for common church actions
export const ChurchQuickActions: React.FC<{
  onAddMember: () => void;
  onRecordDonation: () => void;
  onCreateEvent: () => void;
  onCheckIn: () => void;
  position?: 'bottom-right' | 'bottom-left' | 'bottom-center';
}> = ({
  onAddMember,
  onRecordDonation,
  onCreateEvent,
  onCheckIn,
  position = 'bottom-right',
}) => {
  const actions: FABAction[] = [
    {
      id: 'add-member',
      label: 'Add Member',
      icon: Users,
      onClick: onAddMember,
      color: 'bg-blue-600 hover:bg-blue-700',
    },
    {
      id: 'record-donation',
      label: 'Record Donation',
      icon: DollarSign,
      onClick: onRecordDonation,
      color: 'bg-green-600 hover:bg-green-700',
    },
    {
      id: 'create-event',
      label: 'Create Event',
      icon: Calendar,
      onClick: onCreateEvent,
      color: 'bg-purple-600 hover:bg-purple-700',
    },
    {
      id: 'check-in',
      label: 'Check In',
      icon: Camera,
      onClick: onCheckIn,
      color: 'bg-orange-600 hover:bg-orange-700',
    },
  ];

  return (
    <FloatingActionButton
      actions={actions}
      position={position}
      variant="expandable"
    />
  );
};

// Speed Dial FAB (always shows actions in a fan layout)
export const SpeedDialFAB: React.FC<{
  actions: FABAction[];
  className?: string;
}> = ({ actions, className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
      {/* Speed Dial Actions */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 flex flex-col gap-3">
          {actions.map((action, index) => {
            const ActionIcon = action.icon;
            const angle = (index / (actions.length - 1)) * 90 - 45; // Fan out in 90-degree arc
            const radius = 80;
            const x = Math.cos((angle * Math.PI) / 180) * radius;
            const y = Math.sin((angle * Math.PI) / 180) * radius;

            return (
              <button
                key={action.id}
                onClick={() => {
                  action.onClick();
                  setIsOpen(false);
                }}
                className={`
                  absolute w-12 h-12 rounded-full shadow-lg
                  flex items-center justify-center
                  transition-all duration-300
                  ${action.color || 'bg-[#2A2A30] hover:bg-[#3A3A40]'}
                  hover:scale-110
                `}
                style={{
                  transform: `translate(${x}px, ${-y}px)`,
                  opacity: isOpen ? 1 : 0,
                }}
                title={action.label}
              >
                <ActionIcon className="w-5 h-5 text-white" />
              </button>
            );
          })}
        </div>
      )}

      {/* Main Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-14 h-14 rounded-full shadow-2xl
          bg-[#1CE479] hover:bg-[#1CE479]/90
          text-[#0A0A0F]
          flex items-center justify-center
          transition-all duration-300 hover:scale-110
          ${isOpen ? 'rotate-45' : ''}
        `}
      >
        {isOpen ? <X className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 -z-10 bg-black/20"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

// Mini FAB (smaller, simpler version)
export const MiniFAB: React.FC<{
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  color?: string;
  position?: 'bottom-right' | 'bottom-left';
  className?: string;
}> = ({
  icon: Icon,
  label,
  onClick,
  color = 'bg-[#1CE479]',
  position = 'bottom-right',
  className = '',
}) => {
  const positionClasses = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
  };

  return (
    <button
      onClick={onClick}
      className={`
        fixed ${positionClasses[position]} z-50
        w-12 h-12 rounded-full shadow-lg
        ${color} hover:opacity-90
        text-white
        flex items-center justify-center
        transition-all duration-300 hover:scale-110
        ${className}
      `}
      title={label}
      aria-label={label}
    >
      <Icon className="w-5 h-5" />
    </button>
  );
};
