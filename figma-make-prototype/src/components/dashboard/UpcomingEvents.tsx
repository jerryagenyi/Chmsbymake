/**
 * ChurchAfrica ChMS - Upcoming Events
 * Display scheduled church events
 */

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Calendar, Clock, MapPin, Users, ChevronRight } from 'lucide-react';
import { cn } from '../ui/utils';

export interface ChurchEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  attendees?: number;
  maxAttendees?: number;
  category: 'service' | 'meeting' | 'conference' | 'fellowship' | 'outreach' | 'other';
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  description?: string;
}

const mockEvents: ChurchEvent[] = [
  {
    id: '1',
    title: 'Sunday Worship Service',
    date: 'Sunday, Oct 27',
    time: '9:00 AM',
    location: 'Main Sanctuary',
    attendees: 342,
    maxAttendees: 500,
    category: 'service',
    status: 'upcoming',
  },
  {
    id: '2',
    title: 'Youth Conference 2024',
    date: 'Friday, Nov 1',
    time: '6:00 PM',
    location: 'Youth Hall',
    attendees: 156,
    maxAttendees: 200,
    category: 'conference',
    status: 'upcoming',
  },
  {
    id: '3',
    title: 'Prayer Meeting',
    date: 'Wednesday, Oct 30',
    time: '7:00 PM',
    location: 'Prayer Room',
    attendees: 45,
    category: 'meeting',
    status: 'upcoming',
  },
  {
    id: '4',
    title: 'Community Outreach',
    date: 'Saturday, Nov 2',
    time: '10:00 AM',
    location: 'City Center',
    attendees: 67,
    maxAttendees: 100,
    category: 'outreach',
    status: 'upcoming',
  },
];

const categoryColors: Record<ChurchEvent['category'], string> = {
  service: 'bg-primary/10 text-primary',
  meeting: 'bg-info/10 text-info',
  conference: 'bg-accent/10 text-accent',
  fellowship: 'bg-success/10 text-success',
  outreach: 'bg-warning/10 text-warning',
  other: 'bg-muted text-muted-foreground',
};

interface UpcomingEventsProps {
  events?: ChurchEvent[];
  maxEvents?: number;
  showSeeAll?: boolean;
  onEventClick?: (event: ChurchEvent) => void;
  onSeeAll?: () => void;
}

export function UpcomingEvents({ 
  events = mockEvents,
  maxEvents = 4,
  showSeeAll = true,
  onEventClick,
  onSeeAll,
}: UpcomingEventsProps) {
  const displayEvents = events.slice(0, maxEvents);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Upcoming Events</CardTitle>
            <CardDescription>
              Scheduled church activities
            </CardDescription>
          </div>
          {showSeeAll && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onSeeAll}
              className="gap-1"
            >
              See all
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {displayEvents.map((event) => (
            <div
              key={event.id}
              className={cn(
                "p-4 rounded-lg border transition-all",
                "hover:border-primary/50 hover:shadow-sm",
                onEventClick && "cursor-pointer"
              )}
              onClick={() => onEventClick?.(event)}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="text-sm font-medium truncate">
                      {event.title}
                    </h4>
                    <Badge 
                      variant="outline" 
                      className={cn("capitalize text-xs", categoryColors[event.category])}
                    >
                      {event.category}
                    </Badge>
                  </div>

                  <div className="space-y-1 text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3 w-3" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-3 w-3" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3 w-3" />
                      <span>{event.location}</span>
                    </div>
                    {event.attendees !== undefined && (
                      <div className="flex items-center gap-2">
                        <Users className="h-3 w-3" />
                        <span>
                          {event.attendees}
                          {event.maxAttendees ? ` / ${event.maxAttendees}` : ''} attendees
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {event.maxAttendees && (
                  <div className="text-right flex-shrink-0">
                    <div className="text-xs text-muted-foreground mb-1">Capacity</div>
                    <div className="text-sm font-semibold">
                      {Math.round((event.attendees || 0) / event.maxAttendees * 100)}%
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {events.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No upcoming events</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Vue Migration Notes:
 * 
 * // components/dashboard/UpcomingEvents.vue
 * <template>
 *   <q-card>
 *     <q-card-section>
 *       <div class="row items-center justify-between q-mb-md">
 *         <div>
 *           <div class="text-h6">Upcoming Events</div>
 *           <div class="text-caption text-grey">Scheduled church activities</div>
 *         </div>
 *         <q-btn 
 *           v-if="showSeeAll"
 *           flat 
 *           dense 
 *           label="See all" 
 *           icon-right="chevron_right"
 *           @click="$emit('see-all')"
 *         />
 *       </div>
 *       
 *       <div class="column q-gutter-md">
 *         <q-card
 *           v-for="event in displayEvents"
 *           :key="event.id"
 *           bordered
 *           flat
 *           class="cursor-pointer"
 *           @click="$emit('event-click', event)"
 *         >
 *           <q-card-section>
 *             <div class="row items-start justify-between">
 *               <div class="col">
 *                 <div class="row items-center q-gutter-sm q-mb-sm">
 *                   <div class="text-subtitle2">{{ event.title }}</div>
 *                   <q-chip 
 *                     :color="getCategoryColor(event.category)" 
 *                     size="sm" 
 *                     dense
 *                   >
 *                     {{ event.category }}
 *                   </q-chip>
 *                 </div>
 *                 
 *                 <div class="column q-gutter-xs text-caption text-grey">
 *                   <div class="row items-center q-gutter-xs">
 *                     <q-icon name="event" size="xs" />
 *                     <span>{{ event.date }}</span>
 *                   </div>
 *                   <div class="row items-center q-gutter-xs">
 *                     <q-icon name="schedule" size="xs" />
 *                     <span>{{ event.time }}</span>
 *                   </div>
 *                   <div class="row items-center q-gutter-xs">
 *                     <q-icon name="place" size="xs" />
 *                     <span>{{ event.location }}</span>
 *                   </div>
 *                   <div v-if="event.attendees" class="row items-center q-gutter-xs">
 *                     <q-icon name="group" size="xs" />
 *                     <span>
 *                       {{ event.attendees }}
 *                       <template v-if="event.maxAttendees">
 *                         / {{ event.maxAttendees }}
 *                       </template>
 *                       attendees
 *                     </span>
 *                   </div>
 *                 </div>
 *               </div>
 *               
 *               <div v-if="event.maxAttendees" class="text-right">
 *                 <div class="text-caption text-grey">Capacity</div>
 *                 <div class="text-subtitle2">
 *                   {{ Math.round((event.attendees || 0) / event.maxAttendees * 100) }}%
 *                 </div>
 *               </div>
 *             </div>
 *           </q-card-section>
 *         </q-card>
 *         
 *         <div v-if="events.length === 0" class="text-center q-py-lg text-grey">
 *           <q-icon name="event" size="lg" class="q-mb-sm" style="opacity: 0.5" />
 *           <div class="text-caption">No upcoming events</div>
 *         </div>
 *       </div>
 *     </q-card-section>
 *   </q-card>
 * </template>
 * 
 * <script setup lang="ts">
 * import { computed } from 'vue';
 * 
 * interface Props {
 *   events?: ChurchEvent[];
 *   maxEvents?: number;
 *   showSeeAll?: boolean;
 * }
 * 
 * const props = withDefaults(defineProps<Props>(), {
 *   events: () => mockEvents,
 *   maxEvents: 4,
 *   showSeeAll: true
 * });
 * 
 * const emit = defineEmits(['event-click', 'see-all']);
 * 
 * const displayEvents = computed(() => props.events.slice(0, props.maxEvents));
 * 
 * const getCategoryColor = (category: string) => {
 *   const colors = {
 *     service: 'primary',
 *     meeting: 'info',
 *     conference: 'accent',
 *     fellowship: 'positive',
 *     outreach: 'warning',
 *     other: 'grey',
 *   };
 *   return colors[category] || 'grey';
 * };
 * </script>
 */
