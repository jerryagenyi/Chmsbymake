import React, { useState } from 'react';
import { ArrowLeft, Users, Calendar, DollarSign, MessageSquare, Camera, Search } from 'lucide-react';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

// Import all components
import { EnhancedSearch } from './EnhancedSearch';
import { FileUpload } from './FileUpload';
import { EmptyState, NoMembersState, NoEventsState, OfflineState } from './EmptyState';
import { EnhancedDateTimePicker, EnhancedDateRangePicker } from './EnhancedDateTimePicker';
import { ProgressStepper, CampaignProgress } from './ProgressStepper';
import { ConfirmationDialog, DeleteConfirmation } from './ConfirmationDialog';
import { ImageGallery } from './ImageGallery';
import { NotificationCenter, type Notification } from './NotificationCenter';
import { Timeline, MemberJourneyTimeline, type TimelineEvent } from './Timeline';
import { Rating, FeedbackForm, QuickReaction } from './Rating';
import { TagManager, TagInput, type Tag } from './TagManager';
import { FloatingActionButton, ChurchQuickActions, type FABAction } from './FloatingActionButton';
import { SwipeableCard, deleteAction, archiveAction } from './SwipeableCard';
import { VoiceInput, VoiceButton, VoiceNoteRecorder } from './VoiceInput';
import { EnhancedSkeleton, DashboardSkeleton, MemberCardSkeleton } from './EnhancedSkeleton';

export const UXShowcase: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [selectedTab, setSelectedTab] = useState('search');

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white">
      {/* Header */}
      <div className="border-b border-[#2A2A30] bg-[#1A1A20]">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4 mb-4">
            <Button
              onClick={onBack}
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
          
          <div>
            <h1 className="text-2xl mb-2">Advanced UX Components Library</h1>
            <p className="text-gray-400">
              Phase 14: 15 production-ready components for enhanced user experience
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="mb-6 bg-[#1A1A20] p-1">
            <TabsTrigger value="search">Search</TabsTrigger>
            <TabsTrigger value="upload">Upload</TabsTrigger>
            <TabsTrigger value="empty">Empty States</TabsTrigger>
            <TabsTrigger value="datetime">Date/Time</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
            <TabsTrigger value="dialog">Dialogs</TabsTrigger>
            <TabsTrigger value="gallery">Gallery</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="rating">Rating</TabsTrigger>
            <TabsTrigger value="tags">Tags</TabsTrigger>
            <TabsTrigger value="fab">FAB</TabsTrigger>
            <TabsTrigger value="swipe">Swipe</TabsTrigger>
            <TabsTrigger value="voice">Voice</TabsTrigger>
            <TabsTrigger value="skeleton">Skeleton</TabsTrigger>
          </TabsList>

          {/* 1. Enhanced Search */}
          <TabsContent value="search" className="space-y-6">
            <ComponentSection
              title="Enhanced Search Bar"
              description="Smart search with autocomplete, voice input, and recent searches"
            >
              <SearchDemo />
            </ComponentSection>
          </TabsContent>

          {/* 2. File Upload */}
          <TabsContent value="upload" className="space-y-6">
            <ComponentSection
              title="File Upload Component"
              description="Drag & drop, camera capture, and progress tracking"
            >
              <FileUploadDemo />
            </ComponentSection>
          </TabsContent>

          {/* 3. Empty States */}
          <TabsContent value="empty" className="space-y-6">
            <ComponentSection
              title="Empty State Components"
              description="Beautiful empty states for different scenarios"
            >
              <EmptyStatesDemo />
            </ComponentSection>
          </TabsContent>

          {/* 4. Date/Time Picker */}
          <TabsContent value="datetime" className="space-y-6">
            <ComponentSection
              title="Enhanced Date/Time Picker"
              description="Church-optimized date picker with service time presets"
            >
              <DateTimeDemo />
            </ComponentSection>
          </TabsContent>

          {/* 5. Progress Stepper */}
          <TabsContent value="progress" className="space-y-6">
            <ComponentSection
              title="Progress & Stepper Components"
              description="Multi-step forms and campaign progress tracking"
            >
              <ProgressDemo />
            </ComponentSection>
          </TabsContent>

          {/* 6. Confirmation Dialogs */}
          <TabsContent value="dialog" className="space-y-6">
            <ComponentSection
              title="Confirmation Dialogs"
              description="Beautiful confirmation modals with variants"
            >
              <DialogDemo />
            </ComponentSection>
          </TabsContent>

          {/* 7. Image Gallery */}
          <TabsContent value="gallery" className="space-y-6">
            <ComponentSection
              title="Image Gallery & Lightbox"
              description="Touch-friendly gallery with zoom and navigation"
            >
              <GalleryDemo />
            </ComponentSection>
          </TabsContent>

          {/* 8. Notifications */}
          <TabsContent value="notifications" className="space-y-6">
            <ComponentSection
              title="Notification Center"
              description="Grouped notifications with actions and filtering"
            >
              <NotificationsDemo />
            </ComponentSection>
          </TabsContent>

          {/* 9. Timeline */}
          <TabsContent value="timeline" className="space-y-6">
            <ComponentSection
              title="Timeline Component"
              description="Member journey and activity history"
            >
              <TimelineDemo />
            </ComponentSection>
          </TabsContent>

          {/* 10. Rating */}
          <TabsContent value="rating" className="space-y-6">
            <ComponentSection
              title="Rating & Feedback"
              description="Star ratings, emoji reactions, and feedback forms"
            >
              <RatingDemo />
            </ComponentSection>
          </TabsContent>

          {/* 11. Tags */}
          <TabsContent value="tags" className="space-y-6">
            <ComponentSection
              title="Tag Manager"
              description="Smart tag input with suggestions and color coding"
            >
              <TagsDemo />
            </ComponentSection>
          </TabsContent>

          {/* 12. FAB */}
          <TabsContent value="fab" className="space-y-6">
            <ComponentSection
              title="Floating Action Button"
              description="Quick access to common actions"
            >
              <FABDemo />
            </ComponentSection>
          </TabsContent>

          {/* 13. Swipeable Cards */}
          <TabsContent value="swipe" className="space-y-6">
            <ComponentSection
              title="Swipeable Cards"
              description="Mobile-native swipe gestures for actions"
            >
              <SwipeDemo />
            </ComponentSection>
          </TabsContent>

          {/* 14. Voice Input */}
          <TabsContent value="voice" className="space-y-6">
            <ComponentSection
              title="Voice Input"
              description="Speech-to-text for prayers, notes, and testimonies"
            >
              <VoiceDemo />
            </ComponentSection>
          </TabsContent>

          {/* 15. Skeleton Loaders */}
          <TabsContent value="skeleton" className="space-y-6">
            <ComponentSection
              title="Enhanced Skeleton Loaders"
              description="Content placeholders for better perceived performance"
            >
              <SkeletonDemo />
            </ComponentSection>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

// Component Section Wrapper
const ComponentSection: React.FC<{
  title: string;
  description: string;
  children: React.ReactNode;
}> = ({ title, description, children }) => (
  <div className="bg-[#1A1A20] border border-[#2A2A30] rounded-xl p-6">
    <div className="mb-6">
      <h2 className="text-xl mb-2">{title}</h2>
      <p className="text-gray-400">{description}</p>
    </div>
    <div>{children}</div>
  </div>
);

// Demo Components
const SearchDemo = () => {
  const [query, setQuery] = useState('');
  const suggestions = [
    { id: '1', text: 'John Doe', type: 'suggestion' as const, category: 'Member' },
    { id: '2', text: 'Sunday Service', type: 'suggestion' as const, category: 'Event' },
    { id: '3', text: 'Building Fund', type: 'suggestion' as const, category: 'Campaign' },
  ];

  return (
    <EnhancedSearch
      suggestions={suggestions}
      recentSearches={['Jane Smith', 'Youth Meeting']}
      onSearch={(q) => console.log('Search:', q)}
      onVoiceSearch={() => console.log('Voice search')}
      showFilters={true}
    />
  );
};

const FileUploadDemo = () => (
  <FileUpload
    accept="image/*"
    maxSize={5}
    maxFiles={3}
    onUpload={async (files) => {
      console.log('Uploading:', files);
      await new Promise(resolve => setTimeout(resolve, 2000));
    }}
    allowCamera={true}
    showPreview={true}
  />
);

const EmptyStatesDemo = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <NoMembersState onAddMember={() => console.log('Add member')} />
    <NoEventsState onCreateEvent={() => console.log('Create event')} />
    <OfflineState onRetry={() => console.log('Retry')} />
    <EmptyState
      variant="success"
      title="All caught up!"
      description="You're doing great. No pending tasks."
    />
  </div>
);

const DateTimeDemo = () => {
  const [date, setDate] = useState<Date>();
  const [range, setRange] = useState<any>();

  return (
    <div className="space-y-4">
      <EnhancedDateTimePicker
        value={date}
        onChange={setDate}
        showTime={true}
        showPresets={true}
      />
      <EnhancedDateRangePicker
        value={range}
        onChange={setRange}
        showPresets={true}
      />
    </div>
  );
};

const ProgressDemo = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const steps = [
    { id: '1', label: 'Personal Info', icon: Users },
    { id: '2', label: 'Contact Details', icon: MessageSquare },
    { id: '3', label: 'Membership', icon: Calendar },
    { id: '4', label: 'Review', icon: Search },
  ];

  return (
    <div className="space-y-6">
      <ProgressStepper
        steps={steps}
        currentStep={currentStep}
        onStepClick={setCurrentStep}
        showProgress={true}
      />
      <CampaignProgress
        title="New Church Building"
        current={75000}
        goal={100000}
        currency="$"
        daysLeft={30}
        supporters={125}
      />
    </div>
  );
};

const DialogDemo = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-4">
      <Button onClick={() => setOpen(true)} className="bg-red-600 hover:bg-red-700">
        Delete Member
      </Button>
      <DeleteConfirmation
        open={open}
        onOpenChange={setOpen}
        itemName="John Doe"
        itemType="member"
        onConfirm={async () => {
          await new Promise(resolve => setTimeout(resolve, 1000));
          console.log('Deleted');
        }}
      />
    </div>
  );
};

const GalleryDemo = () => {
  const images = [
    { id: '1', src: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=400', alt: 'Event 1', title: 'Sunday Service' },
    { id: '2', src: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=400', alt: 'Event 2', title: 'Youth Meeting' },
    { id: '3', src: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400', alt: 'Event 3', title: 'Prayer Night' },
  ];

  return <ImageGallery images={images} columns={3} aspectRatio="square" />;
};

const NotificationsDemo = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'info',
      title: 'New Member Joined',
      message: 'Sarah Johnson has joined the church',
      timestamp: new Date(Date.now() - 300000),
      read: false,
    },
    {
      id: '2',
      type: 'event',
      title: 'Upcoming Event',
      message: 'Youth meeting tomorrow at 6 PM',
      timestamp: new Date(Date.now() - 3600000),
      read: true,
    },
  ]);

  return (
    <div className="flex justify-center">
      <NotificationCenter
        notifications={notifications}
        onMarkAsRead={(id) => setNotifications(prev =>
          prev.map(n => n.id === id ? { ...n, read: true } : n)
        )}
        onMarkAllAsRead={() => setNotifications(prev =>
          prev.map(n => ({ ...n, read: true }))
        )}
        onDelete={(id) => setNotifications(prev => prev.filter(n => n.id !== id))}
        onClearAll={() => setNotifications([])}
      />
    </div>
  );
};

const TimelineDemo = () => {
  const events: TimelineEvent[] = [
    {
      id: '1',
      title: 'Joined Church',
      description: 'Became a member of Grace Community Church',
      timestamp: new Date('2023-01-15'),
      type: 'success',
      icon: Users,
    },
    {
      id: '2',
      title: 'Baptized',
      description: 'Water baptism ceremony',
      timestamp: new Date('2023-03-20'),
      type: 'success',
      icon: DollarSign,
    },
    {
      id: '3',
      title: 'Started Volunteering',
      description: 'Joined the worship team',
      timestamp: new Date('2023-06-10'),
      type: 'info',
      icon: Calendar,
    },
  ];

  return <Timeline events={events} variant="default" showTime={true} groupByDate={true} />;
};

const RatingDemo = () => {
  const [rating, setRating] = useState(0);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm text-gray-400 mb-3">Star Rating</h3>
        <Rating value={rating} onChange={setRating} variant="stars" size="lg" showValue />
      </div>
      <FeedbackForm
        onSubmit={async (data) => {
          console.log('Feedback:', data);
        }}
        variant="emoji"
      />
    </div>
  );
};

const TagsDemo = () => {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const tags: Tag[] = [
    { id: '1', label: 'Youth', color: 'Blue' },
    { id: '2', label: 'Worship', color: 'Purple' },
    { id: '3', label: 'Prayer', color: 'Pink' },
  ];

  return (
    <TagManager
      tags={tags}
      selectedTags={selectedTags}
      onTagsChange={setSelectedTags}
      allowCreate={true}
      onCreate={(label) => console.log('Create tag:', label)}
    />
  );
};

const FABDemo = () => {
  const actions: FABAction[] = [
    { id: '1', label: 'Add Member', icon: Users, onClick: () => console.log('Add member') },
    { id: '2', label: 'New Event', icon: Calendar, onClick: () => console.log('New event') },
    { id: '3', label: 'Record Donation', icon: DollarSign, onClick: () => console.log('Donation') },
  ];

  return (
    <div className="relative h-96 bg-[#0A0A0F] rounded-lg border border-[#2A2A30]">
      <p className="text-center text-gray-400 pt-20">
        Check bottom-right corner for the Floating Action Button
      </p>
      <FloatingActionButton actions={actions} variant="expandable" />
    </div>
  );
};

const SwipeDemo = () => (
  <div className="space-y-2">
    {['Member 1', 'Member 2', 'Member 3'].map((name, i) => (
      <SwipeableCard
        key={i}
        leftActions={[]}
        rightActions={[
          {
            ...deleteAction,
            onAction: () => console.log('Delete', name),
          },
        ]}
      >
        <div className="p-4">
          <h3 className="text-white">{name}</h3>
          <p className="text-gray-400 text-sm">Swipe left to delete</p>
        </div>
      </SwipeableCard>
    ))}
  </div>
);

const VoiceDemo = () => {
  const [text, setText] = useState('');

  return (
    <VoiceInput
      value={text}
      onChange={setText}
      placeholder="Click to start recording..."
      continuous={false}
    />
  );
};

const SkeletonDemo = () => (
  <div className="space-y-6">
    <MemberCardSkeleton />
    <DashboardSkeleton />
  </div>
);
