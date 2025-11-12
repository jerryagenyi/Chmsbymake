/**
 * ChurchAfrica ChMS - Service Form
 * Form for creating and editing church services
 */

import React, { useState, useEffect } from 'react';
import {
  Service,
  ServiceType,
  ServiceStatus,
  ServiceFrequency,
  DayOfWeek,
  SERVICE_TYPE_LABELS,
  SERVICE_FREQUENCY_LABELS,
  DAY_OF_WEEK_LABELS,
} from '../../types/service';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
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
} from '../ui/dialog';
import { Card, CardContent } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { X, Save, Calendar, Clock, MapPin, Users, Settings } from 'lucide-react';

interface ServiceFormProps {
  service?: Service | null;
  onSave: (service: Partial<Service>) => void;
  onCancel: () => void;
}

export function ServiceForm({ service, onSave, onCancel }: ServiceFormProps) {
  const isEditing = !!service;

  const [formData, setFormData] = useState<Partial<Service>>({
    name: service?.name || '',
    serviceType: service?.serviceType || 'sunday_morning',
    scheduledDate: service?.scheduledDate || new Date().toISOString().split('T')[0],
    startTime: service?.startTime || '09:00',
    endTime: service?.endTime || '11:00',
    status: service?.status || 'scheduled',
    frequency: service?.frequency || 'weekly',
    dayOfWeek: service?.dayOfWeek || 'sunday',
    capacity: service?.capacity,
    expectedAttendance: service?.expectedAttendance,
    location: service?.location || {
      type: 'physical',
      venue: '',
    },
    description: service?.description || '',
    notes: service?.notes || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const serviceData: Partial<Service> = {
      ...formData,
      organizationId: service?.organizationId || 'org1',
      branchId: service?.branchId || 'branch1',
      createdBy: service?.createdBy || 'user1',
      createdAt: service?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSave(serviceData);
  };

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateLocation = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      location: { ...prev.location, [field]: value } as any,
    }));
  };

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Edit Service' : 'Create New Service'}
          </DialogTitle>
          <DialogDescription>
            {isEditing 
              ? 'Update service details and schedule' 
              : 'Set up a new church service with schedule and location details'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <Tabs defaultValue="basic" className="mt-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="schedule">Schedule</TabsTrigger>
              <TabsTrigger value="location">Location</TabsTrigger>
            </TabsList>

            {/* Basic Info Tab */}
            <TabsContent value="basic" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="name">Service Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => updateField('name', e.target.value)}
                  placeholder="e.g., Sunday Morning Worship"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="serviceType">Service Type *</Label>
                <Select
                  value={formData.serviceType}
                  onValueChange={(value) => updateField('serviceType', value as ServiceType)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(SERVICE_TYPE_LABELS).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => updateField('description', e.target.value)}
                  placeholder="Describe the service (optional)"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="capacity">Capacity</Label>
                  <Input
                    id="capacity"
                    type="number"
                    value={formData.capacity || ''}
                    onChange={(e) => updateField('capacity', parseInt(e.target.value) || undefined)}
                    placeholder="Maximum capacity"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expectedAttendance">Expected Attendance</Label>
                  <Input
                    id="expectedAttendance"
                    type="number"
                    value={formData.expectedAttendance || ''}
                    onChange={(e) => updateField('expectedAttendance', parseInt(e.target.value) || undefined)}
                    placeholder="Estimated attendees"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => updateField('notes', e.target.value)}
                  placeholder="Additional notes (optional)"
                  rows={2}
                />
              </div>
            </TabsContent>

            {/* Schedule Tab */}
            <TabsContent value="schedule" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="scheduledDate">Date *</Label>
                <Input
                  id="scheduledDate"
                  type="date"
                  value={formData.scheduledDate}
                  onChange={(e) => updateField('scheduledDate', e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startTime">Start Time *</Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => updateField('startTime', e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endTime">End Time *</Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => updateField('endTime', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="frequency">Frequency</Label>
                <Select
                  value={formData.frequency}
                  onValueChange={(value) => updateField('frequency', value as ServiceFrequency)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(SERVICE_FREQUENCY_LABELS).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {formData.frequency !== 'one-time' && (
                <div className="space-y-2">
                  <Label htmlFor="dayOfWeek">Day of Week</Label>
                  <Select
                    value={formData.dayOfWeek}
                    onValueChange={(value) => updateField('dayOfWeek', value as DayOfWeek)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(DAY_OF_WEEK_LABELS).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => updateField('status', value as ServiceStatus)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>

            {/* Location Tab */}
            <TabsContent value="location" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="locationType">Location Type</Label>
                <Select
                  value={formData.location?.type || 'physical'}
                  onValueChange={(value) => updateLocation('type', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="physical">Physical</SelectItem>
                    <SelectItem value="online">Online</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {(formData.location?.type === 'physical' || formData.location?.type === 'hybrid') && (
                <div className="space-y-2">
                  <Label htmlFor="venue">Venue</Label>
                  <Input
                    id="venue"
                    value={formData.location?.venue || ''}
                    onChange={(e) => updateLocation('venue', e.target.value)}
                    placeholder="e.g., Main Sanctuary, Youth Hall"
                  />
                </div>
              )}

              {(formData.location?.type === 'online' || formData.location?.type === 'hybrid') && (
                <div className="space-y-2">
                  <Label htmlFor="onlineUrl">Online Link</Label>
                  <Input
                    id="onlineUrl"
                    value={formData.location?.onlineUrl || ''}
                    onChange={(e) => updateLocation('onlineUrl', e.target.value)}
                    placeholder="https://zoom.us/j/123456789"
                    type="url"
                  />
                </div>
              )}

              <Card className="bg-[#1A1A20] border-[#1CE479]/20">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-[#1CE479] mt-0.5" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Location Tracking</p>
                      <p className="text-xs text-muted-foreground">
                        Advanced location features (buildings, rooms, capacity tracking) will be available 
                        in Milestone 3: Location-Specific Tracking.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-[#1CE479] hover:bg-[#1CE479]/90 text-[#0A0A0F]"
            >
              <Save className="h-4 w-4 mr-2" />
              {isEditing ? 'Update Service' : 'Create Service'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
