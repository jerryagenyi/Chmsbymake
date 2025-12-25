import React from 'react';
import { Skeleton } from '../ui/skeleton';

interface EnhancedSkeletonProps {
  variant?: 'text' | 'card' | 'list' | 'table' | 'profile' | 'dashboard' | 'custom';
  count?: number;
  className?: string;
  animate?: boolean;
}

export const EnhancedSkeleton: React.FC<EnhancedSkeletonProps> = ({
  variant = 'text',
  count = 1,
  className = '',
  animate = true,
}) => {
  const skeletonClass = animate ? '' : 'animate-none';

  const renderVariant = () => {
    switch (variant) {
      case 'text':
        return <TextSkeleton className={skeletonClass} />;
      case 'card':
        return <CardSkeleton className={skeletonClass} />;
      case 'list':
        return <ListSkeleton className={skeletonClass} />;
      case 'table':
        return <TableSkeleton className={skeletonClass} />;
      case 'profile':
        return <ProfileSkeleton className={skeletonClass} />;
      case 'dashboard':
        return <DashboardSkeleton className={skeletonClass} />;
      default:
        return <TextSkeleton className={skeletonClass} />;
    }
  };

  return (
    <div className={className}>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className={count > 1 ? 'mb-4' : ''}>
          {renderVariant()}
        </div>
      ))}
    </div>
  );
};

// Text Skeleton
export const TextSkeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`space-y-2 ${className}`}>
    <Skeleton className="h-4 w-full bg-[#2A2A30]" />
    <Skeleton className="h-4 w-4/5 bg-[#2A2A30]" />
    <Skeleton className="h-4 w-3/4 bg-[#2A2A30]" />
  </div>
);

// Card Skeleton
export const CardSkeleton: React.FC<{ className?: string; showImage?: boolean }> = ({ 
  className = '',
  showImage = true,
}) => (
  <div className={`bg-[#1A1A20] border border-[#2A2A30] rounded-xl p-6 ${className}`}>
    {showImage && (
      <Skeleton className="w-full h-48 rounded-lg mb-4 bg-[#2A2A30]" />
    )}
    <Skeleton className="h-6 w-3/4 mb-3 bg-[#2A2A30]" />
    <Skeleton className="h-4 w-full mb-2 bg-[#2A2A30]" />
    <Skeleton className="h-4 w-5/6 mb-4 bg-[#2A2A30]" />
    <div className="flex gap-2 mt-4">
      <Skeleton className="h-10 w-24 rounded-lg bg-[#2A2A30]" />
      <Skeleton className="h-10 w-24 rounded-lg bg-[#2A2A30]" />
    </div>
  </div>
);

// List Item Skeleton
export const ListItemSkeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`flex items-center gap-4 p-4 bg-[#1A1A20] border border-[#2A2A30] rounded-lg ${className}`}>
    <Skeleton className="w-12 h-12 rounded-full bg-[#2A2A30]" />
    <div className="flex-1 space-y-2">
      <Skeleton className="h-4 w-1/3 bg-[#2A2A30]" />
      <Skeleton className="h-3 w-1/2 bg-[#2A2A30]" />
    </div>
    <Skeleton className="h-8 w-8 rounded bg-[#2A2A30]" />
  </div>
);

// List Skeleton
export const ListSkeleton: React.FC<{ items?: number; className?: string }> = ({ 
  items = 5,
  className = '',
}) => (
  <div className={`space-y-2 ${className}`}>
    {Array.from({ length: items }).map((_, index) => (
      <ListItemSkeleton key={index} />
    ))}
  </div>
);

// Table Row Skeleton
export const TableRowSkeleton: React.FC<{ columns?: number; className?: string }> = ({ 
  columns = 4,
  className = '',
}) => (
  <div className={`flex items-center gap-4 p-4 border-b border-[#2A2A30] ${className}`}>
    {Array.from({ length: columns }).map((_, index) => (
      <Skeleton key={index} className="h-4 flex-1 bg-[#2A2A30]" />
    ))}
  </div>
);

// Table Skeleton
export const TableSkeleton: React.FC<{ rows?: number; columns?: number; className?: string }> = ({ 
  rows = 5,
  columns = 4,
  className = '',
}) => (
  <div className={`bg-[#1A1A20] border border-[#2A2A30] rounded-xl overflow-hidden ${className}`}>
    {/* Header */}
    <div className="flex items-center gap-4 p-4 border-b border-[#2A2A30] bg-[#151518]">
      {Array.from({ length: columns }).map((_, index) => (
        <Skeleton key={index} className="h-4 flex-1 bg-[#2A2A30]" />
      ))}
    </div>
    {/* Rows */}
    {Array.from({ length: rows }).map((_, index) => (
      <TableRowSkeleton key={index} columns={columns} />
    ))}
  </div>
);

// Profile Skeleton
export const ProfileSkeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`bg-[#1A1A20] border border-[#2A2A30] rounded-xl overflow-hidden ${className}`}>
    {/* Cover Image */}
    <Skeleton className="w-full h-32 bg-[#2A2A30]" />
    
    {/* Profile Info */}
    <div className="p-6">
      <div className="flex items-start gap-4 -mt-16 mb-6">
        <Skeleton className="w-24 h-24 rounded-full border-4 border-[#1A1A20] bg-[#2A2A30]" />
        <div className="flex-1 mt-16 space-y-2">
          <Skeleton className="h-6 w-1/3 bg-[#2A2A30]" />
          <Skeleton className="h-4 w-1/4 bg-[#2A2A30]" />
        </div>
        <Skeleton className="h-10 w-24 rounded-lg mt-16 bg-[#2A2A30]" />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="text-center">
            <Skeleton className="h-8 w-16 mx-auto mb-2 bg-[#2A2A30]" />
            <Skeleton className="h-3 w-20 mx-auto bg-[#2A2A30]" />
          </div>
        ))}
      </div>

      {/* Bio */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-full bg-[#2A2A30]" />
        <Skeleton className="h-4 w-5/6 bg-[#2A2A30]" />
        <Skeleton className="h-4 w-4/6 bg-[#2A2A30]" />
      </div>
    </div>
  </div>
);

// Dashboard KPI Card Skeleton
export const KPICardSkeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`bg-[#1A1A20] border border-[#2A2A30] rounded-xl p-6 ${className}`}>
    <div className="flex items-start justify-between mb-4">
      <div className="flex-1">
        <Skeleton className="h-4 w-24 mb-2 bg-[#2A2A30]" />
        <Skeleton className="h-8 w-32 bg-[#2A2A30]" />
      </div>
      <Skeleton className="w-12 h-12 rounded-full bg-[#2A2A30]" />
    </div>
    <Skeleton className="h-3 w-20 bg-[#2A2A30]" />
  </div>
);

// Dashboard Skeleton
export const DashboardSkeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`space-y-6 ${className}`}>
    {/* KPI Cards */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map((i) => (
        <KPICardSkeleton key={i} />
      ))}
    </div>

    {/* Charts */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-[#1A1A20] border border-[#2A2A30] rounded-xl p-6">
        <Skeleton className="h-6 w-1/3 mb-4 bg-[#2A2A30]" />
        <Skeleton className="w-full h-64 rounded-lg bg-[#2A2A30]" />
      </div>
      <div className="bg-[#1A1A20] border border-[#2A2A30] rounded-xl p-6">
        <Skeleton className="h-6 w-1/3 mb-4 bg-[#2A2A30]" />
        <Skeleton className="w-full h-64 rounded-lg bg-[#2A2A30]" />
      </div>
    </div>

    {/* Table */}
    <div className="bg-[#1A1A20] border border-[#2A2A30] rounded-xl p-6">
      <Skeleton className="h-6 w-1/4 mb-4 bg-[#2A2A30]" />
      <TableSkeleton rows={5} columns={4} className="!border-0" />
    </div>
  </div>
);

// Member Card Skeleton
export const MemberCardSkeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`bg-[#1A1A20] border border-[#2A2A30] rounded-xl p-6 ${className}`}>
    <div className="flex items-start gap-4 mb-4">
      <Skeleton className="w-16 h-16 rounded-full bg-[#2A2A30]" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-5 w-1/2 bg-[#2A2A30]" />
        <Skeleton className="h-4 w-1/3 bg-[#2A2A30]" />
        <Skeleton className="h-3 w-2/3 bg-[#2A2A30]" />
      </div>
    </div>
    
    <div className="flex gap-2 pt-4 border-t border-[#2A2A30]">
      <Skeleton className="h-8 flex-1 rounded-lg bg-[#2A2A30]" />
      <Skeleton className="h-8 flex-1 rounded-lg bg-[#2A2A30]" />
    </div>
  </div>
);

// Event Card Skeleton
export const EventCardSkeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`bg-[#1A1A20] border border-[#2A2A30] rounded-xl overflow-hidden ${className}`}>
    <Skeleton className="w-full h-48 bg-[#2A2A30]" />
    <div className="p-6 space-y-3">
      <div className="flex items-center gap-2">
        <Skeleton className="w-6 h-6 rounded bg-[#2A2A30]" />
        <Skeleton className="h-4 w-32 bg-[#2A2A30]" />
      </div>
      <Skeleton className="h-6 w-3/4 bg-[#2A2A30]" />
      <Skeleton className="h-4 w-full bg-[#2A2A30]" />
      <Skeleton className="h-4 w-5/6 bg-[#2A2A30]" />
      <div className="flex gap-2 pt-3">
        <Skeleton className="h-10 flex-1 rounded-lg bg-[#2A2A30]" />
        <Skeleton className="h-10 w-10 rounded-lg bg-[#2A2A30]" />
      </div>
    </div>
  </div>
);

// Chat Message Skeleton
export const ChatMessageSkeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`flex gap-3 p-4 ${className}`}>
    <Skeleton className="w-10 h-10 rounded-full flex-shrink-0 bg-[#2A2A30]" />
    <div className="flex-1 space-y-2">
      <Skeleton className="h-4 w-24 bg-[#2A2A30]" />
      <Skeleton className="h-4 w-full bg-[#2A2A30]" />
      <Skeleton className="h-4 w-3/4 bg-[#2A2A30]" />
    </div>
  </div>
);

// Form Skeleton
export const FormSkeleton: React.FC<{ fields?: number; className?: string }> = ({ 
  fields = 5,
  className = '',
}) => (
  <div className={`bg-[#1A1A20] border border-[#2A2A30] rounded-xl p-6 space-y-6 ${className}`}>
    <Skeleton className="h-8 w-1/3 mb-6 bg-[#2A2A30]" />
    
    {Array.from({ length: fields }).map((_, index) => (
      <div key={index} className="space-y-2">
        <Skeleton className="h-4 w-24 bg-[#2A2A30]" />
        <Skeleton className="h-10 w-full rounded-lg bg-[#2A2A30]" />
      </div>
    ))}

    <div className="flex gap-3 pt-4">
      <Skeleton className="h-10 w-24 rounded-lg bg-[#2A2A30]" />
      <Skeleton className="h-10 w-32 rounded-lg bg-[#2A2A30]" />
    </div>
  </div>
);
