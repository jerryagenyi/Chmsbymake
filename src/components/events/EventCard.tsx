/**
 * ChurchAfrica ChMS - Event Card
 * Display individual event in card format
 */

import React from 'react';
import { Card, CardContent, CardHeader } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Progress } from '../ui/progress';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Video,
  DollarSign,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Eye,
  Edit,
  MoreVertical,
  UserPlus,
  Share2
} from 'lucide-react';
import { Event, EVENT_TYPE_LABELS, EVENT_STATUS_LABELS } from '../../types/event';
import { cn } from '../ui/utils';
import { format, isPast, isFuture, isToday } from 'date-fns';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

interface EventCardProps {
  event: Event;
  onView?: (event: Event) => void;
  onEdit?: (event: Event) => void;
  onRegister?: (event: Event) => void;
  onShare?: (event: Event) => void;
  showActions?: boolean;
  compact?: boolean;
  className?: string;
}

export function EventCard({
  event,
  onView,
  onEdit,
  onRegister,
  onShare,
  showActions = true,
  compact = false,
  className,
}: EventCardProps) {
  const startDate = new Date(event.startDate);
  const endDate = new Date(event.endDate);
  const isEventPast = isPast(endDate);
  const isEventToday = isToday(startDate);
  const isEventFuture = isFuture(startDate);

  const registrationPercentage = event.registration.capacity
    ? (event.registration.registeredCount / event.registration.capacity) * 100
    : 0;

  const isRegistrationOpen = 
    event.registration.required && 
    event.registration.status === 'open' &&
    !isEventPast;

  const canRegister = isRegistrationOpen && (
    !event.registration.capacity || 
    event.registration.registeredCount < event.registration.capacity
  );

  const getStatusColor = () => {
    switch (event.status) {
      case 'published':
        if (isEventPast) return 'text-muted-foreground';
        if (isEventToday) return 'text-success';
        return 'text-primary';
      case 'ongoing':
        return 'text-success';
      case 'completed':
        return 'text-muted-foreground';
      case 'cancelled':
        return 'text-destructive';
      case 'draft':
        return 'text-warning';
      default:
        return 'text-muted-foreground';
    }
  };

  const getRegistrationStatusBadge = () => {
    if (!event.registration.required) return null;

    if (event.registration.status === 'full') {
      return (
        <Badge variant="secondary" className="gap-1 bg-destructive/10 text-destructive border-destructive/20">
          <AlertCircle className="h-3 w-3" />
          Full
        </Badge>
      );
    }

    if (event.registration.status === 'closed') {
      return (
        <Badge variant="secondary" className="gap-1">
          <XCircle className="h-3 w-3" />
          Closed
        </Badge>
      );
    }

    if (isRegistrationOpen && canRegister) {
      return (
        <Badge variant="secondary" className="gap-1 bg-success/10 text-success border-success/20">
          <CheckCircle2 className="h-3 w-3" />
          Open
        </Badge>
      );
    }

    return null;
  };

  if (compact) {
    return (
      <Card 
        className={cn(
          "cursor-pointer hover:shadow-md transition-all",
          isEventPast && "opacity-60",
          className
        )}
        onClick={() => onView?.(event)}
      >
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            {/* Date Badge */}
            <div className="flex-shrink-0 text-center bg-primary/10 rounded-lg p-2 min-w-[50px]">
              <div className="text-xs text-primary uppercase">
                {format(startDate, 'MMM')}
              </div>
              <div className="text-xl text-primary">
                {format(startDate, 'd')}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-1">
                <h5 className="truncate">{event.title}</h5>
                {getRegistrationStatusBadge()}
              </div>
              
              <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {format(startDate, 'h:mm a')}
                </span>
                {event.location.type === 'online' ? (
                  <span className="flex items-center gap-1">
                    <Video className="h-3 w-3" />
                    Online
                  </span>
                ) : (
                  <span className="flex items-center gap-1 truncate">
                    <MapPin className="h-3 w-3" />
                    {event.location.venue || 'TBA'}
                  </span>
                )}
              </div>

              {event.registration.required && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Users className="h-3 w-3" />
                  <span>
                    {event.registration.registeredCount}
                    {event.registration.capacity && ` / ${event.registration.capacity}`} registered
                  </span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card 
      className={cn(
        "overflow-hidden hover:shadow-lg transition-all",
        isEventPast && "opacity-75",
        className
      )}
    >
      {/* Event Image/Banner */}
      {event.bannerUrl && (
        <div className="relative h-48 overflow-hidden">
          <img
            src={event.bannerUrl}
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          
          {/* Status Badge on Image */}
          <div className="absolute top-3 right-3">
            <Badge 
              variant="secondary" 
              className={cn("backdrop-blur-sm", getStatusColor())}
            >
              {EVENT_STATUS_LABELS[event.status]}
            </Badge>
          </div>

          {/* Event Type Badge */}
          <div className="absolute top-3 left-3">
            <Badge variant="secondary" className="backdrop-blur-sm">
              {EVENT_TYPE_LABELS[event.type]}
            </Badge>
          </div>
        </div>
      )}

      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              {!event.bannerUrl && (
                <>
                  <Badge variant="outline">
                    {EVENT_TYPE_LABELS[event.type]}
                  </Badge>
                  <Badge 
                    variant="outline" 
                    className={cn("border-current", getStatusColor())}
                  >
                    {EVENT_STATUS_LABELS[event.status]}
                  </Badge>
                </>
              )}
              {getRegistrationStatusBadge()}
            </div>
            
            <h4 className="mb-1">{event.title}</h4>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {event.description}
            </p>
          </div>

          {showActions && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="flex-shrink-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {onView && (
                  <DropdownMenuItem onClick={() => onView(event)}>
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </DropdownMenuItem>
                )}
                {onEdit && (
                  <DropdownMenuItem onClick={() => onEdit(event)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Event
                  </DropdownMenuItem>
                )}
                {onShare && (
                  <DropdownMenuItem onClick={() => onShare(event)}>
                    <Share2 className="h-4 w-4 mr-2" />
                    Share Event
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Date & Time */}
        <div className="flex items-start gap-3">
          <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
          <div className="flex-1">
            <p className="text-sm">
              {format(startDate, 'EEEE, MMMM d, yyyy')}
            </p>
            <p className="text-xs text-muted-foreground">
              {event.isAllDay ? (
                'All Day'
              ) : (
                `${format(startDate, 'h:mm a')} - ${format(endDate, 'h:mm a')}`
              )}
            </p>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-start gap-3">
          {event.location.type === 'online' ? (
            <Video className="h-4 w-4 text-muted-foreground mt-0.5" />
          ) : (
            <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
          )}
          <div className="flex-1">
            <p className="text-sm">
              {event.location.type === 'online' ? (
                'Online Event'
              ) : event.location.type === 'hybrid' ? (
                'Hybrid Event'
              ) : (
                event.location.venue || 'Venue TBA'
              )}
            </p>
            {event.location.address && (
              <p className="text-xs text-muted-foreground">
                {event.location.address}
              </p>
            )}
            {event.location.type === 'online' && event.location.onlinePlatform && (
              <p className="text-xs text-muted-foreground">
                Via {event.location.onlinePlatform}
              </p>
            )}
          </div>
        </div>

        {/* Registration Info */}
        {event.registration.required && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span>
                  {event.registration.registeredCount} registered
                  {event.registration.capacity && ` of ${event.registration.capacity}`}
                </span>
              </span>
              {event.registration.capacity && (
                <span className="text-muted-foreground">
                  {Math.round(registrationPercentage)}%
                </span>
              )}
            </div>
            
            {event.registration.capacity && (
              <Progress value={registrationPercentage} className="h-2" />
            )}

            {event.registration.fee && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <DollarSign className="h-4 w-4" />
                <span>
                  {event.registration.currency || 'NGN'} {event.registration.fee.toLocaleString()}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Organizer */}
        {event.organizer && (
          <div className="flex items-center gap-2 pt-2 border-t">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary/10 text-primary text-xs">
                {event.organizer.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground">Organized by</p>
              <p className="text-sm truncate">{event.organizer.name}</p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {showActions && (
          <div className="flex gap-2 pt-2">
            {onRegister && canRegister && (
              <Button 
                onClick={() => onRegister(event)}
                className="flex-1 gap-2"
              >
                <UserPlus className="h-4 w-4" />
                Register
              </Button>
            )}
            {onView && (
              <Button 
                variant={canRegister ? "outline" : "default"}
                onClick={() => onView(event)}
                className={cn("gap-2", canRegister ? "" : "flex-1")}
              >
                <Eye className="h-4 w-4" />
                View Details
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/**
 * Vue Migration Notes:
 * 
 * <template>
 *   <q-card :class="{ 'opacity-60': isEventPast }">
 *     <!-- Banner -->
 *     <q-img v-if="event.bannerUrl" :src="event.bannerUrl" height="200px">
 *       <div class="absolute-top-right q-pa-sm">
 *         <q-badge :color="statusColor">{{ statusLabel }}</q-badge>
 *       </div>
 *       <div class="absolute-top-left q-pa-sm">
 *         <q-badge>{{ typeLabel }}</q-badge>
 *       </div>
 *     </q-img>
 *     
 *     <q-card-section>
 *       <div class="row items-start justify-between">
 *         <div class="col">
 *           <div class="row q-gutter-xs q-mb-sm">
 *             <q-chip size="sm">{{ typeLabel }}</q-chip>
 *             <q-chip size="sm" :color="statusColor">{{ statusLabel }}</q-chip>
 *           </div>
 *           <div class="text-h6">{{ event.title }}</div>
 *           <div class="text-caption text-grey">{{ event.description }}</div>
 *         </div>
 *         
 *         <q-btn flat round icon="more_vert">
 *           <q-menu>
 *             <q-list>
 *               <q-item clickable @click="$emit('view', event)">
 *                 <q-item-section avatar>
 *                   <q-icon name="visibility" />
 *                 </q-item-section>
 *                 <q-item-section>View Details</q-item-section>
 *               </q-item>
 *               <q-item clickable @click="$emit('edit', event)">
 *                 <q-item-section avatar>
 *                   <q-icon name="edit" />
 *                 </q-item-section>
 *                 <q-item-section>Edit Event</q-item-section>
 *               </q-item>
 *             </q-list>
 *           </q-menu>
 *         </q-btn>
 *       </div>
 *     </q-card-section>
 *     
 *     <q-separator />
 *     
 *     <q-card-section class="q-gutter-sm">
 *       <!-- Date -->
 *       <div class="row items-start">
 *         <q-icon name="event" class="q-mr-sm" />
 *         <div>
 *           <div>{{ formatDate(event.startDate) }}</div>
 *           <div class="text-caption text-grey">{{ formatTime(event) }}</div>
 *         </div>
 *       </div>
 *       
 *       <!-- Location -->
 *       <div class="row items-start">
 *         <q-icon :name="locationIcon" class="q-mr-sm" />
 *         <div>
 *           <div>{{ locationText }}</div>
 *           <div v-if="event.location.address" class="text-caption text-grey">
 *             {{ event.location.address }}
 *           </div>
 *         </div>
 *       </div>
 *       
 *       <!-- Registration -->
 *       <div v-if="event.registration.required">
 *         <div class="row items-center justify-between">
 *           <div class="row items-center">
 *             <q-icon name="people" class="q-mr-sm" />
 *             <span>{{ event.registration.registeredCount }} registered</span>
 *           </div>
 *           <span v-if="event.registration.capacity">
 *             {{ registrationPercentage }}%
 *           </span>
 *         </div>
 *         <q-linear-progress
 *           v-if="event.registration.capacity"
 *           :value="registrationPercentage / 100"
 *           class="q-mt-xs"
 *         />
 *       </div>
 *     </q-card-section>
 *     
 *     <q-separator />
 *     
 *     <q-card-actions>
 *       <q-btn
 *         v-if="canRegister"
 *         color="primary"
 *         icon="person_add"
 *         label="Register"
 *         @click="$emit('register', event)"
 *       />
 *       <q-btn
 *         flat
 *         icon="visibility"
 *         label="View Details"
 *         @click="$emit('view', event)"
 *       />
 *     </q-card-actions>
 *   </q-card>
 * </template>
 * 
 * <script setup lang="ts">
 * import { computed } from 'vue';
 * import { format, isPast, isToday } from 'date-fns';
 * import type { Event } from '@/types/event';
 * 
 * interface Props {
 *   event: Event;
 *   showActions?: boolean;
 *   compact?: boolean;
 * }
 * 
 * const props = withDefaults(defineProps<Props>(), {
 *   showActions: true,
 *   compact: false
 * });
 * 
 * const emit = defineEmits<{
 *   view: [event: Event];
 *   edit: [event: Event];
 *   register: [event: Event];
 * }>();
 * 
 * const isEventPast = computed(() => isPast(new Date(props.event.endDate)));
 * const canRegister = computed(() => 
 *   props.event.registration.status === 'open' && !isEventPast.value
 * );
 * </script>
 */
