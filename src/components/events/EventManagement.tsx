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
  
  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {onBack && (
            <Button variant="outline" size="sm" onClick={onBack}>
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          )}
          <div>
            <h1 className="text-2xl font-bold">Event Management</h1>
            <p className="text-sm text-muted-foreground">
              Create and manage church events, services, and activities
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button className="touch-target">
                <Plus className="h-4 w-4 mr-2" />
                Create Event
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Event</DialogTitle>
                <DialogDescription>
                  Set up a new event for your church community
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                {/* Basic Information */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Event Title *</Label>
                    <Input
                      id="title"
                      value={newEvent.title}
                      onChange={(e) => setNewEvent(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="e.g., Sunday Morning Service"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={newEvent.description}
                      onChange={(e) => setNewEvent(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe the event purpose and details..."
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="type">Event Type *</Label>
                      <Select
                        value={newEvent.type}
                        onValueChange={(value) => setNewEvent(prev => ({ ...prev, type: value as EventType }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {eventTypes.filter(t => t.enabled).map(type => (
                            <SelectItem key={type.id} value={type.id}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="status">Status</Label>
                      <Select
                        value={newEvent.status}
                        onValueChange={(value) => setNewEvent(prev => ({ ...prev, status: value as EventStatus }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="upcoming">Upcoming</SelectItem>
                          <SelectItem value="ongoing">Ongoing</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Date & Time */}
                <div className="space-y-4">
                  <h4 className="font-medium flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Date & Time
                  </h4>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="startDate">Start Date & Time *</Label>
                      <Input
                        id="startDate"
                        type="datetime-local"
                        value={newEvent.startDate}
                        onChange={(e) => setNewEvent(prev => ({ ...prev, startDate: e.target.value }))}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="endDate">End Date & Time</Label>
                      <Input
                        id="endDate"
                        type="datetime-local"
                        value={newEvent.endDate}
                        onChange={(e) => setNewEvent(prev => ({ ...prev, endDate: e.target.value }))}
                      />
                    </div>
                  </div>

                  {/* Recurring Events */}
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Repeat className="h-4 w-4 text-muted-foreground" />
                      <Label htmlFor="recurring" className="cursor-pointer">Recurring Event</Label>
                    </div>
                    <input
                      type="checkbox"
                      id="recurring"
                      checked={recurringOptions.enabled}
                      onChange={(e) => setRecurringOptions(prev => ({ ...prev, enabled: e.target.checked }))}
                      className="h-4 w-4"
                    />
                  </div>

                  {recurringOptions.enabled && (
                    <div className="grid grid-cols-2 gap-4 pl-4">
                      <div>
                        <Label>Frequency</Label>
                        <Select
                          value={recurringOptions.frequency}
                          onValueChange={(value: any) => setRecurringOptions(prev => ({ ...prev, frequency: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="daily">Daily</SelectItem>
                            <SelectItem value="weekly">Weekly</SelectItem>
                            <SelectItem value="monthly">Monthly</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label>Number of Occurrences</Label>
                        <Input
                          type="number"
                          min={1}
                          max={52}
                          value={recurringOptions.count}
                          onChange={(e) => setRecurringOptions(prev => ({ ...prev, count: parseInt(e.target.value) || 1 }))}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Location */}
                <div className="space-y-4">
                  <h4 className="font-medium flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Location
                  </h4>

                  <div>
                    <Label>Location Type</Label>
                    <Select
                      value={newEvent.location?.type || 'physical'}
                      onValueChange={(value: any) => setNewEvent(prev => ({
                        ...prev,
                        location: { ...prev.location, type: value }
                      }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="physical">
                          <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4" />
                            Physical Venue
                          </div>
                        </SelectItem>
                        <SelectItem value="online">
                          <div className="flex items-center gap-2">
                            <Video className="h-4 w-4" />
                            Online Only
                          </div>
                        </SelectItem>
                        <SelectItem value="hybrid">
                          <div className="flex items-center gap-2">
                            <Globe className="h-4 w-4" />
                            Hybrid (Physical + Online)
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {(newEvent.location?.type === 'physical' || newEvent.location?.type === 'hybrid') && (
                    <div>
                      <Label htmlFor="venue">Venue Address</Label>
                      <Input
                        id="venue"
                        value={newEvent.location?.venue || ''}
                        onChange={(e) => setNewEvent(prev => ({
                          ...prev,
                          location: { ...prev.location, venue: e.target.value }
                        }))}
                        placeholder="Church main building, Room 101"
                      />
                    </div>
                  )}

                  {(newEvent.location?.type === 'online' || newEvent.location?.type === 'hybrid') && (
                    <div>
                      <Label htmlFor="onlineUrl">Online Meeting Link</Label>
                      <Input
                        id="onlineUrl"
                        value={newEvent.location?.onlineUrl || ''}
                        onChange={(e) => setNewEvent(prev => ({
                          ...prev,
                          location: { ...prev.location, onlineUrl: e.target.value }
                        }))}
                        placeholder="https://zoom.us/j/123456789"
                      />
                    </div>
                  )}
                </div>

                {/* Capacity & Registration */}
                <div className="space-y-4">
                  <h4 className="font-medium flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Capacity & Registration
                  </h4>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="capacity">Maximum Capacity</Label>
                      <Input
                        id="capacity"
                        type="number"
                        min={1}
                        value={newEvent.capacity || ''}
                        onChange={(e) => setNewEvent(prev => ({
                          ...prev,
                          capacity: e.target.value ? parseInt(e.target.value) : undefined
                        }))}
                        placeholder="Leave empty for unlimited"
                      />
                    </div>

                    <div>
                      <Label htmlFor="deadline">Registration Deadline</Label>
                      <Input
                        id="deadline"
                        type="datetime-local"
                        value={newEvent.registrationDeadline || ''}
                        onChange={(e) => setNewEvent(prev => ({
                          ...prev,
                          registrationDeadline: e.target.value || undefined
                        }))}
                      />
                    </div>
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <Label htmlFor="tags">Tags (comma-separated)</Label>
                  <Input
                    id="tags"
                    value={newEvent.tags?.join(', ') || ''}
                    onChange={(e) => setNewEvent(prev => ({
                      ...prev,
                      tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean)
                    }))}
                    placeholder="worship, family, youth"
                  />
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateEvent} disabled={loading || !newEvent.title || !newEvent.startDate}>
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Create Event
                    </>
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Events</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <Calendar className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Upcoming</p>
                <p className="text-2xl font-bold text-primary">{stats.upcoming}</p>
              </div>
              <Clock className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Ongoing</p>
                <p className="text-2xl font-bold text-success">{stats.ongoing}</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold text-blue-400">{stats.completed}</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Cancelled</p>
                <p className="text-2xl font-bold text-red-400">{stats.cancelled}</p>
              </div>
              <X className="h-8 w-8 text-red-400" />
            </div>
          </CardContent>
        </Card>
      </div>

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