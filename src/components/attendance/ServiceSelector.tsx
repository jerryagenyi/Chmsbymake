/**
 * ChurchAfrica ChMS - Service Selector
 * Select or create service for attendance tracking
 */

import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Label } from '../ui/label';
import { 
  Calendar,
  Clock,
  MapPin,
  Users,
  Plus,
  Check
} from 'lucide-react';
import { Service, ServiceType } from '../../types/attendance';
import { cn } from '../ui/utils';

interface ServiceSelectorProps {
  services: Service[];
  selectedServiceId?: string;
  onSelectService: (service: Service) => void;
  onCreateService?: () => void;
}

const SERVICE_TYPE_LABELS: Record<ServiceType, string> = {
  sunday_first: 'Sunday 1st Service',
  sunday_second: 'Sunday 2nd Service',
  midweek: 'Midweek Service',
  prayer: 'Prayer Meeting',
  special: 'Special Service',
  youth: 'Youth Service',
  children: "Children's Service",
};

const SERVICE_TYPE_COLORS: Record<ServiceType, string> = {
  sunday_first: 'bg-primary/10 text-primary border-primary/20',
  sunday_second: 'bg-primary/10 text-primary border-primary/20',
  midweek: 'bg-info/10 text-info border-info/20',
  prayer: 'bg-accent/10 text-accent border-accent/20',
  special: 'bg-warning/10 text-warning border-warning/20',
  youth: 'bg-success/10 text-success border-success/20',
  children: 'bg-pink-500/10 text-pink-500 border-pink-500/20',
};

export function ServiceSelector({
  services,
  selectedServiceId,
  onSelectService,
  onCreateService,
}: ServiceSelectorProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { 
        weekday: 'short',
        month: 'short', 
        day: 'numeric',
        year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
      });
    }
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  // Group services by date
  const servicesByDate = React.useMemo(() => {
    const grouped: Record<string, Service[]> = {};
    services.forEach(service => {
      if (!grouped[service.date]) {
        grouped[service.date] = [];
      }
      grouped[service.date].push(service);
    });
    
    // Sort by date (most recent first)
    return Object.entries(grouped).sort(([a], [b]) => 
      new Date(b).getTime() - new Date(a).getTime()
    );
  }, [services]);

  if (services.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h4 className="mb-2">No Services Available</h4>
          <p className="text-sm text-muted-foreground mb-4">
            Create a service to start recording attendance
          </p>
          {onCreateService && (
            <Button onClick={onCreateService} className="gap-2">
              <Plus className="h-4 w-4" />
              Create Service
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>Select Service</Label>
        {onCreateService && (
          <Button variant="outline" size="sm" onClick={onCreateService} className="gap-2">
            <Plus className="h-4 w-4" />
            New Service
          </Button>
        )}
      </div>

      <div className="space-y-6">
        {servicesByDate.map(([date, dateServices]) => (
          <div key={date}>
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">{formatDate(date)}</span>
              <span className="text-sm text-muted-foreground">
                ({new Date(date).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric',
                  year: 'numeric'
                })})
              </span>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {dateServices.map(service => {
                const isSelected = service.id === selectedServiceId;
                
                return (
                  <Card
                    key={service.id}
                    className={cn(
                      "cursor-pointer transition-all hover:shadow-md",
                      isSelected && "border-primary shadow-md"
                    )}
                    onClick={() => onSelectService(service)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div 
                          className={cn(
                            "h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0",
                            isSelected ? "bg-primary" : "bg-muted"
                          )}
                        >
                          {isSelected ? (
                            <Check className="h-5 w-5 text-primary-foreground" />
                          ) : (
                            <Clock className={cn(
                              "h-5 w-5",
                              isSelected ? "text-primary-foreground" : "text-muted-foreground"
                            )} />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div>
                              <h5 className="truncate">{service.name}</h5>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Clock className="h-3 w-3" />
                                <span>{formatTime(service.startTime)}</span>
                                {service.endTime && (
                                  <>
                                    <span>-</span>
                                    <span>{formatTime(service.endTime)}</span>
                                  </>
                                )}
                              </div>
                            </div>
                            
                            <Badge 
                              variant="outline" 
                              className={SERVICE_TYPE_COLORS[service.type]}
                            >
                              {SERVICE_TYPE_LABELS[service.type]}
                            </Badge>
                          </div>

                          <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                            {service.location && (
                              <div className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                <span>{service.location}</span>
                              </div>
                            )}
                            {service.expectedAttendance && (
                              <div className="flex items-center gap-1">
                                <Users className="h-3 w-3" />
                                <span>Expected: {service.expectedAttendance}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Vue Migration Notes:
 * 
 * <template>
 *   <div>
 *     <div class="row items-center justify-between q-mb-md">
 *       <div class="text-subtitle2">Select Service</div>
 *       <q-btn 
 *         v-if="onCreateService"
 *         outline 
 *         size="sm" 
 *         label="New Service" 
 *         icon="add"
 *         @click="onCreateService"
 *       />
 *     </div>
 *     
 *     <div v-if="services.length === 0" class="text-center q-pa-xl">
 *       <q-icon name="event" size="48px" color="grey" />
 *       <div class="text-h6 q-mt-md">No Services Available</div>
 *       <div class="text-body2 text-grey q-mb-md">
 *         Create a service to start recording attendance
 *       </div>
 *       <q-btn color="primary" label="Create Service" icon="add" @click="onCreateService" />
 *     </div>
 *     
 *     <div v-else class="column q-gutter-lg">
 *       <div v-for="[date, dateServices] in servicesByDate" :key="date">
 *         <div class="row items-center q-gutter-xs q-mb-sm">
 *           <q-icon name="event" size="sm" />
 *           <span class="text-subtitle2">{{ formatDate(date) }}</span>
 *           <span class="text-caption text-grey">
 *             ({{ new Date(date).toLocaleDateString() }})
 *           </span>
 *         </div>
 *         
 *         <div class="column q-gutter-sm">
 *           <q-card
 *             v-for="service in dateServices"
 *             :key="service.id"
 *             :class="{'border-primary': service.id === selectedServiceId}"
 *             clickable
 *             @click="$emit('select', service)"
 *           >
 *             <q-card-section>
 *               <div class="row items-start q-gutter-md">
 *                 <q-avatar 
 *                   :color="service.id === selectedServiceId ? 'primary' : 'grey'"
 *                   :icon="service.id === selectedServiceId ? 'check' : 'schedule'"
 *                 />
 *                 
 *                 <div class="col">
 *                   <div class="row items-start justify-between q-mb-xs">
 *                     <div>
 *                       <div class="text-subtitle1">{{ service.name }}</div>
 *                       <div class="row items-center q-gutter-xs text-caption text-grey">
 *                         <q-icon name="schedule" size="xs" />
 *                         <span>{{ formatTime(service.startTime) }}</span>
 *                       </div>
 *                     </div>
 *                     <q-chip size="sm" :color="getServiceTypeColor(service.type)">
 *                       {{ getServiceTypeLabel(service.type) }}
 *                     </q-chip>
 *                   </div>
 *                   
 *                   <div class="row q-gutter-md text-caption text-grey">
 *                     <div v-if="service.location" class="row items-center q-gutter-xs">
 *                       <q-icon name="place" size="xs" />
 *                       <span>{{ service.location }}</span>
 *                     </div>
 *                     <div v-if="service.expectedAttendance" class="row items-center q-gutter-xs">
 *                       <q-icon name="people" size="xs" />
 *                       <span>Expected: {{ service.expectedAttendance }}</span>
 *                     </div>
 *                   </div>
 *                 </div>
 *               </div>
 *             </q-card-section>
 *           </q-card>
 *         </div>
 *       </div>
 *     </div>
 *   </div>
 * </template>
 */
