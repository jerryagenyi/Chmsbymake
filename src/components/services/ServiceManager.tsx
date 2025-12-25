/**
 * ChurchAfrica ChMS - Service Manager
 * Comprehensive service creation and management interface
 */

import React, { useState } from 'react';
import { 
  Service, 
  ServiceType, 
  ServiceStatus,
  ServiceFrequency,
  DayOfWeek,
  SERVICE_TYPE_LABELS, 
  SERVICE_TYPE_ICONS,
  SERVICE_TYPE_COLORS,
  SERVICE_STATUS_LABELS,
  SERVICE_FREQUENCY_LABELS,
  DAY_OF_WEEK_LABELS,
  formatServiceTime,
  isServiceActive,
} from '../../types/service';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  Plus, 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Edit, 
  Trash2, 
  Copy,
  Play,
  Pause,
  CheckCircle,
  XCircle,
  Sun,
  Moon,
  Heart,
  BookOpen,
  Baby,
  Sparkles,
} from 'lucide-react';
import { ServiceForm } from './ServiceForm';
import { ServiceList } from './ServiceList';
import { ServiceCalendar } from './ServiceCalendar';
import { cn } from '../ui/utils';
import { PageHeader, StatCard } from '../layout/PageHeader';

interface ServiceManagerProps {
  services?: Service[];
  onCreateService?: (service: Partial<Service>) => void;
  onUpdateService?: (id: string, service: Partial<Service>) => void;
  onDeleteService?: (id: string) => void;
  onDuplicateService?: (service: Service) => void;
}

export function ServiceManager({
  services = [],
  onCreateService,
  onUpdateService,
  onDeleteService,
  onDuplicateService,
}: ServiceManagerProps) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [activeTab, setActiveTab] = useState('list');

  // Get active services for today
  const today = new Date().toISOString().split('T')[0];
  const todayServices = services.filter(s => s.scheduledDate === today);
  const activeServices = todayServices.filter(s => isServiceActive(s));

  // Get upcoming services
  const upcomingServices = services.filter(s => 
    s.scheduledDate >= today && s.status === 'scheduled'
  ).sort((a, b) => {
    const dateCompare = a.scheduledDate.localeCompare(b.scheduledDate);
    if (dateCompare !== 0) return dateCompare;
    return a.startTime.localeCompare(b.startTime);
  }).slice(0, 5);

  const handleCreate = (service: Partial<Service>) => {
    onCreateService?.(service);
    setShowCreateForm(false);
  };

  const handleUpdate = (id: string, service: Partial<Service>) => {
    onUpdateService?.(id, service);
    setEditingService(null);
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setShowCreateForm(true);
  };

  const handleDuplicate = (service: Service) => {
    onDuplicateService?.(service);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this service? This action cannot be undone.')) {
      onDeleteService?.(id);
    }
  };

  const handleCancel = () => {
    setShowCreateForm(false);
    setEditingService(null);
  };

  // Calculate stats for this week
  const thisWeekServices = services.filter(s => {
    const serviceDate = new Date(s.scheduledDate);
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
    return serviceDate >= weekStart && serviceDate <= weekEnd;
  }).length;

  // Prepare stats for PageHeader
  const statCards: StatCard[] = [
    {
      label: 'Total Services',
      value: services.length,
      icon: Calendar,
    },
    {
      label: 'Active Today',
      value: todayServices.length,
      icon: Play,
      iconColor: 'text-[#1CE479]',
      valueColor: 'text-[#1CE479]',
    },
    {
      label: 'This Week',
      value: thisWeekServices,
      icon: Clock,
      iconColor: 'text-blue-400',
      valueColor: 'text-blue-400',
    },
    {
      label: 'Weekly Services',
      value: services.filter(s => s.frequency === 'weekly').length,
      icon: Calendar,
      iconColor: 'text-purple-400',
      valueColor: 'text-purple-400',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Service Management"
        description="Manage church services, schedules, and attendance tracking"
        stats={statCards}
        action={
          <Button 
            onClick={() => setShowCreateForm(true)}
            className="bg-[#1CE479] hover:bg-[#1CE479]/90 text-[#0A0A0F]"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Service
          </Button>
        }
      />

      {/* Active Services Alert */}
      {activeServices.length > 0 && (
        <Card className="border-[#1CE479] bg-[#1CE479]/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#1CE479]">
              <Play className="h-5 w-5" />
              Active Services Now
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {activeServices.map(service => (
                <div 
                  key={service.id}
                  className="flex items-center justify-between p-3 bg-[#1A1A20] rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-[#1CE479]/20 flex items-center justify-center">
                      <Play className="h-5 w-5 text-[#1CE479]" />
                    </div>
                    <div>
                      <div className="font-medium">{service.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {formatServiceTime(service)} • {service.location?.venue}
                      </div>
                    </div>
                  </div>
                  <Badge variant="default" className="bg-[#1CE479] text-[#0A0A0F]">
                    <div className="animate-pulse h-2 w-2 rounded-full bg-[#0A0A0F] mr-2" />
                    Live
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Service Form Dialog */}
      {showCreateForm && (
        <ServiceForm
          service={editingService}
          onSave={editingService 
            ? (service) => handleUpdate(editingService.id, service)
            : handleCreate
          }
          onCancel={handleCancel}
        />
      )}

      {/* Service Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="list" className="gap-2">
            <Calendar className="h-4 w-4" />
            Service List
          </TabsTrigger>
          <TabsTrigger value="calendar" className="gap-2">
            <Calendar className="h-4 w-4" />
            Calendar View
          </TabsTrigger>
          <TabsTrigger value="upcoming" className="gap-2">
            <Clock className="h-4 w-4" />
            Upcoming
          </TabsTrigger>
        </TabsList>

        {/* List View */}
        <TabsContent value="list" className="mt-6">
          <ServiceList
            services={services}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onDuplicate={handleDuplicate}
          />
        </TabsContent>

        {/* Calendar View */}
        <TabsContent value="calendar" className="mt-6">
          <ServiceCalendar
            services={services}
            onServiceClick={handleEdit}
          />
        </TabsContent>

        {/* Upcoming Services */}
        <TabsContent value="upcoming" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Services</CardTitle>
              <CardDescription>
                Next {upcomingServices.length} scheduled services
              </CardDescription>
            </CardHeader>
            <CardContent>
              {upcomingServices.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No upcoming services scheduled</p>
                  <Button 
                    onClick={() => setShowCreateForm(true)}
                    variant="outline"
                    className="mt-4"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create First Service
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {upcomingServices.map(service => (
                    <UpcomingServiceCard
                      key={service.id}
                      service={service}
                      onEdit={() => handleEdit(service)}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Upcoming Service Card Component
interface UpcomingServiceCardProps {
  service: Service;
  onEdit: () => void;
}

function UpcomingServiceCard({ service, onEdit }: UpcomingServiceCardProps) {
  const iconMap: Record<ServiceType, any> = {
    sunday_morning: Sun,
    sunday_evening: Moon,
    midweek: Calendar,
    special_event: Sparkles,
    prayer_meeting: Heart,
    bible_study: BookOpen,
    youth_service: Users,
    children_service: Baby,
  };

  const Icon = iconMap[service.serviceType] || Calendar;
  const serviceDate = new Date(service.scheduledDate);
  const daysUntil = Math.ceil((serviceDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div 
      className="flex items-center justify-between p-4 bg-[#1A1A20] rounded-lg hover:bg-[#1A1A20]/70 transition-colors cursor-pointer group"
      onClick={onEdit}
    >
      <div className="flex items-center gap-4">
        <div className={cn(
          "h-12 w-12 rounded-full flex items-center justify-center",
          "bg-[#1CE479]/10 group-hover:bg-[#1CE479]/20 transition-colors"
        )}>
          <Icon className={cn("h-6 w-6", SERVICE_TYPE_COLORS[service.serviceType])} />
        </div>
        <div>
          <div className="font-medium">{service.name}</div>
          <div className="text-sm text-muted-foreground">
            {serviceDate.toLocaleDateString('en-GB', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>
          <div className="text-sm text-muted-foreground">
            {formatServiceTime(service)} • {service.location?.venue}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="text-right">
          <div className="text-sm font-medium text-[#1CE479]">
            {daysUntil === 0 ? 'Today' : daysUntil === 1 ? 'Tomorrow' : `${daysUntil} days`}
          </div>
          <Badge variant="outline" className="text-xs">
            {SERVICE_TYPE_LABELS[service.serviceType]}
          </Badge>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          className="opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Edit className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}