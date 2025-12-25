/**
 * ChurchAfrica ChMS - Event Management Dashboard
 * Complete event management with creation, types, and settings
 */

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { ScrollArea } from '../ui/scroll-area';
import { Alert, AlertDescription } from '../ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import {
  Plus,
  Calendar,
  MapPin,
  Users,
  Clock,
  Tag,
  Settings,
  QrCode,
  Share2,
  Edit,
  Trash2,
  Copy,
  MoreHorizontal,
  ChevronLeft,
  AlertCircle,
  CheckCircle2,
  Video,
  Building2,
  Globe,
  Repeat,
  Bell,
  Download,
  Upload,
  X,
  Save,
  Loader2,
} from 'lucide-react';
import { Event, EventType, EventStatus, EVENT_TYPE_LABELS } from '../../types/event';
import { cn } from '../ui/utils';
import { format, addDays, addWeeks, addMonths } from 'date-fns';

import { generateQRCode } from './QRCodeGenerator';
import { PageHeader, StatCard } from '../layout/PageHeader';

interface EventManagementProps {
  events: Event[];
  onCreateEvent?: (event: Partial<Event>) => void;
  onUpdateEvent?: (eventId: string, updates: Partial<Event>) => void;
  onDeleteEvent?: (eventId: string) => void;
  onGenerateQR?: (eventId: string) => void;
  onBack?: () => void;
  className?: string;
}

interface EventTypeConfig {
  id: EventType;
  label: string;
  color: string;
  icon: React.ReactNode;
  enabled: boolean;
  requiresApproval: boolean;
  maxCapacity?: number;
}

const defaultEventTypes: EventTypeConfig[] = [
  { id: 'service', label: 'Sunday Service', color: 'text-primary', icon: <Calendar className="h-4 w-4" />, enabled: true, requiresApproval: false },
  { id: 'prayer', label: 'Prayer Meeting', color: 'text-blue-400', icon: <Users className="h-4 w-4" />, enabled: true, requiresApproval: false },
  { id: 'bible_study', label: 'Bible Study', color: 'text-purple-400', icon: <Calendar className="h-4 w-4" />, enabled: true, requiresApproval: false },
  { id: 'youth', label: 'Youth Meeting', color: 'text-orange-400', icon: <Users className="h-4 w-4" />, enabled: true, requiresApproval: false },
  { id: 'outreach', label: 'Outreach', color: 'text-success', icon: <MapPin className="h-4 w-4" />, enabled: true, requiresApproval: true },
  { id: 'training', label: 'Training', color: 'text-yellow-400', icon: <Users className="h-4 w-4" />, enabled: true, requiresApproval: false },
  { id: 'conference', label: 'Conference', color: 'text-pink-400', icon: <Calendar className="h-4 w-4" />, enabled: true, requiresApproval: true, maxCapacity: 500 },
  { id: 'other', label: 'Other', color: 'text-gray-400', icon: <MoreHorizontal className="h-4 w-4" />, enabled: true, requiresApproval: false },
];

export function EventManagement({
  events,
  onCreateEvent,
  onUpdateEvent,
  onDeleteEvent,
  onGenerateQR,
  onBack,
  className,
}: EventManagementProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showTypeDialog, setShowTypeDialog] = useState(false);
  const [eventTypes, setEventTypes] = useState<EventTypeConfig[]>(defaultEventTypes);
  const [loading, setLoading] = useState(false);

  // Event form state
  const [newEvent, setNewEvent] = useState<Partial<Event>>({
    title: '',
    description: '',
    type: 'service',
    status: 'upcoming',
    startDate: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
    endDate: format(addDays(new Date(), 0), "yyyy-MM-dd'T'HH:mm"),
    location: {
      type: 'physical',
      venue: '',
    },
    capacity: undefined,
    registrationDeadline: undefined,
    tags: [],
  });

  const [recurringOptions, setRecurringOptions] = useState({
    enabled: false,
    frequency: 'weekly' as 'daily' | 'weekly' | 'monthly',
    endDate: '',
    count: 4,
  });

  // Statistics
  const stats = {
    total: events.length,
    upcoming: events.filter(e => e.status === 'upcoming').length,
    ongoing: events.filter(e => e.status === 'ongoing').length,
    completed: events.filter(e => e.status === 'completed').length,
    cancelled: events.filter(e => e.status === 'cancelled').length,
  };

  const handleCreateEvent = async () => {
    if (!newEvent.title || !newEvent.startDate) {
      return;
    }

    setLoading(true);
    
    try {
      // Generate multiple events if recurring
      if (recurringOptions.enabled) {
        const eventsToCreate: Partial<Event>[] = [];
        let currentDate = new Date(newEvent.startDate);
        
        for (let i = 0; i < recurringOptions.count; i++) {
          eventsToCreate.push({
            ...newEvent,
            title: `${newEvent.title} (${i + 1}/${recurringOptions.count})`,
            startDate: format(currentDate, "yyyy-MM-dd'T'HH:mm"),
            endDate: format(addDays(currentDate, 0), "yyyy-MM-dd'T'HH:mm"),
          });

          // Increment date based on frequency
          if (recurringOptions.frequency === 'daily') {
            currentDate = addDays(currentDate, 1);
          } else if (recurringOptions.frequency === 'weekly') {
            currentDate = addWeeks(currentDate, 1);
          } else if (recurringOptions.frequency === 'monthly') {
            currentDate = addMonths(currentDate, 1);
          }
        }

        eventsToCreate.forEach(event => onCreateEvent?.(event));
      } else {
        onCreateEvent?.(newEvent);
      }

      // Reset form
      setNewEvent({
        title: '',
        description: '',
        type: 'service',
        status: 'upcoming',
        startDate: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
        endDate: format(addDays(new Date(), 0), "yyyy-MM-dd'T'HH:mm"),
        location: {
          type: 'physical',
          venue: '',
        },
        capacity: undefined,
        registrationDeadline: undefined,
        tags: [],
      });
      setShowCreateDialog(false);
    } catch (error) {
      console.error('Error creating event:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleEventType = (typeId: EventType) => {
    setEventTypes(prev => prev.map(type => 
      type.id === typeId ? { ...type, enabled: !type.enabled } : type
    ));
  };

  const [selectedEventForQR, setSelectedEventForQR] = useState<Event | null>(null);
  
  // Prepare stats for PageHeader
  const statCards: StatCard[] = [
    {
      label: 'Total Events',
      value: stats.total,
      icon: Calendar,
    },
    {
      label: 'Upcoming',
      value: stats.upcoming,
      icon: Clock,
      iconColor: 'text-primary',
      valueColor: 'text-primary',
    },
    {
      label: 'Ongoing',
      value: stats.ongoing,
      icon: CheckCircle2,
      iconColor: 'text-success',
      valueColor: 'text-success',
    },
    {
      label: 'Completed',
      value: stats.completed,
      icon: CheckCircle2,
      iconColor: 'text-blue-400',
      valueColor: 'text-blue-400',
    },
    {
      label: 'Cancelled',
      value: stats.cancelled,
      icon: X,
      iconColor: 'text-red-400',
      valueColor: 'text-red-400',
    },
  ];
  
  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <PageHeader
        title="Event Management"
        description="Create and manage church events, services, and activities"
        stats={statCards}
        action={
          <div className="flex items-center gap-2">
            {onBack && (
              <Button variant="outline" size="sm" onClick={onBack}>
                <ChevronLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            )}
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
              <DialogTrigger asChild>
                <Button className="touch-target">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Event
                </Button>
              </DialogTrigger>
            </Dialog>
          </div>
        }
      />

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="event-types">Event Types</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              You have {stats.upcoming} upcoming events. {stats.ongoing} event(s) are currently ongoing.
            </AlertDescription>
          </Alert>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common event management tasks</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" className="h-auto flex-col py-4" onClick={() => setShowCreateDialog(true)}>
                <Plus className="h-5 w-5 mb-2" />
                <span className="text-sm">Create Event</span>
              </Button>
              <Button variant="outline" className="h-auto flex-col py-4" onClick={() => setActiveTab('event-types')}>
                <Tag className="h-5 w-5 mb-2" />
                <span className="text-sm">Manage Types</span>
              </Button>
              <Button variant="outline" className="h-auto flex-col py-4">
                <Upload className="h-5 w-5 mb-2" />
                <span className="text-sm">Import Events</span>
              </Button>
              <Button variant="outline" className="h-auto flex-col py-4">
                <Download className="h-5 w-5 mb-2" />
                <span className="text-sm">Export Events</span>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Event Types Tab */}
        <TabsContent value="event-types" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Event Types Configuration</CardTitle>
                  <CardDescription>
                    Manage event categories and their settings
                  </CardDescription>
                </div>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Custom Type
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {eventTypes.map((type) => (
                  <div
                    key={type.id}
                    className="flex items-center justify-between p-4 bg-muted/50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn('p-2 rounded-lg bg-background', type.color)}>
                        {type.icon}
                      </div>
                      <div>
                        <p className="font-medium">{type.label}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant={type.enabled ? 'default' : 'secondary'} className="text-xs">
                            {type.enabled ? 'Enabled' : 'Disabled'}
                          </Badge>
                          {type.requiresApproval && (
                            <Badge variant="outline" className="text-xs">
                              Requires Approval
                            </Badge>
                          )}
                          {type.maxCapacity && (
                            <Badge variant="outline" className="text-xs">
                              Max: {type.maxCapacity}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant={type.enabled ? 'outline' : 'default'}
                        size="sm"
                        onClick={() => handleToggleEventType(type.id)}
                      >
                        {type.enabled ? 'Disable' : 'Enable'}
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Event Settings</CardTitle>
              <CardDescription>Configure default event preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Auto-generate QR codes for new events</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically create QR codes for event check-in
                  </p>
                </div>
                <input type="checkbox" className="h-4 w-4" defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Send notifications to members</Label>
                  <p className="text-sm text-muted-foreground">
                    Notify members when new events are created
                  </p>
                </div>
                <input type="checkbox" className="h-4 w-4" defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Require registration approval</Label>
                  <p className="text-sm text-muted-foreground">
                    Admin must approve event registrations
                  </p>
                </div>
                <input type="checkbox" className="h-4 w-4" />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Enable event reminders</Label>
                  <p className="text-sm text-muted-foreground">
                    Send SMS/email reminders before events
                  </p>
                </div>
                <input type="checkbox" className="h-4 w-4" defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}