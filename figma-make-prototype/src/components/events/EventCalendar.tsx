/**
 * ChurchAfrica ChMS - Event Calendar
 * Calendar view for events
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Plus
} from 'lucide-react';
import { Event, EVENT_TYPE_LABELS } from '../../types/event';
import { cn } from '../ui/utils';
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  format,
  isSameMonth,
  isSameDay,
  isToday,
  parseISO
} from 'date-fns';

interface EventCalendarProps {
  events: Event[];
  selectedDate?: Date;
  onDateSelect?: (date: Date) => void;
  onEventClick?: (event: Event) => void;
  onCreateEvent?: (date: Date) => void;
  className?: string;
}

export function EventCalendar({
  events,
  selectedDate,
  onDateSelect,
  onEventClick,
  onCreateEvent,
  className,
}: EventCalendarProps) {
  const [currentMonth, setCurrentMonth] = React.useState(new Date());
  const [internalSelectedDate, setInternalSelectedDate] = React.useState<Date | null>(null);

  const activeSelectedDate = selectedDate || internalSelectedDate;

  const handleDateClick = (date: Date) => {
    if (onDateSelect) {
      onDateSelect(date);
    } else {
      setInternalSelectedDate(date);
    }
  };

  // Generate calendar days
  const calendarDays = React.useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const days: Date[] = [];
    let day = startDate;

    while (day <= endDate) {
      days.push(day);
      day = addDays(day, 1);
    }

    return days;
  }, [currentMonth]);

  // Group events by date
  const eventsByDate = React.useMemo(() => {
    const grouped: Record<string, Event[]> = {};

    events.forEach(event => {
      const eventDate = parseISO(event.startDate);
      const dateKey = format(eventDate, 'yyyy-MM-dd');

      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(event);
    });

    return grouped;
  }, [events]);

  const getEventsForDate = (date: Date): Event[] => {
    const dateKey = format(date, 'yyyy-MM-dd');
    return eventsByDate[dateKey] || [];
  };

  const selectedDateEvents = activeSelectedDate 
    ? getEventsForDate(activeSelectedDate)
    : [];

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const goToToday = () => {
    setCurrentMonth(new Date());
    handleDateClick(new Date());
  };

  return (
    <div className={cn("grid grid-cols-1 lg:grid-cols-3 gap-6", className)}>
      {/* Calendar Grid */}
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{format(currentMonth, 'MMMM yyyy')}</CardTitle>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={goToToday}>
                  Today
                </Button>
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={prevMonth}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={nextMonth}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            {/* Calendar Header */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div
                  key={day}
                  className="text-center text-sm text-muted-foreground py-2"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((day, index) => {
                const dayEvents = getEventsForDate(day);
                const hasEvents = dayEvents.length > 0;
                const isCurrentMonth = isSameMonth(day, currentMonth);
                const isDayToday = isToday(day);
                const isSelected = activeSelectedDate && isSameDay(day, activeSelectedDate);

                return (
                  <button
                    key={index}
                    onClick={() => handleDateClick(day)}
                    className={cn(
                      "relative aspect-square p-2 rounded-lg text-sm transition-all",
                      "hover:bg-muted",
                      "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                      !isCurrentMonth && "text-muted-foreground opacity-40",
                      isDayToday && "bg-primary/10 font-bold text-primary",
                      isSelected && "bg-primary text-primary-foreground hover:bg-primary/90"
                    )}
                  >
                    <div className="flex flex-col items-center justify-center h-full">
                      <span>{format(day, 'd')}</span>
                      
                      {/* Event Indicators */}
                      {hasEvents && isCurrentMonth && (
                        <div className="flex gap-0.5 mt-1">
                          {dayEvents.slice(0, 3).map((event, i) => (
                            <div
                              key={i}
                              className={cn(
                                "w-1 h-1 rounded-full",
                                isSelected ? "bg-primary-foreground" : "bg-primary"
                              )}
                            />
                          ))}
                          {dayEvents.length > 3 && (
                            <div
                              className={cn(
                                "w-1 h-1 rounded-full",
                                isSelected ? "bg-primary-foreground" : "bg-primary"
                              )}
                            />
                          )}
                        </div>
                      )}
                    </div>

                    {/* Event Count Badge */}
                    {hasEvents && isCurrentMonth && dayEvents.length > 0 && (
                      <div className="absolute top-1 right-1">
                        <div className={cn(
                          "text-[10px] w-4 h-4 rounded-full flex items-center justify-center",
                          isSelected 
                            ? "bg-primary-foreground text-primary" 
                            : "bg-primary/20 text-primary"
                        )}>
                          {dayEvents.length}
                        </div>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Selected Date Events */}
      <div>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">
                  {activeSelectedDate ? (
                    format(activeSelectedDate, 'EEEE, MMM d')
                  ) : (
                    'Select a date'
                  )}
                </CardTitle>
                {selectedDateEvents.length > 0 && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {selectedDateEvents.length} {selectedDateEvents.length === 1 ? 'event' : 'events'}
                  </p>
                )}
              </div>
              {activeSelectedDate && onCreateEvent && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onCreateEvent(activeSelectedDate)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              )}
            </div>
          </CardHeader>

          <CardContent className="p-0">
            {selectedDateEvents.length === 0 ? (
              <div className="p-6 text-center">
                <CalendarIcon className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  {activeSelectedDate ? (
                    'No events on this date'
                  ) : (
                    'Select a date to view events'
                  )}
                </p>
                {activeSelectedDate && onCreateEvent && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onCreateEvent(activeSelectedDate)}
                    className="mt-3"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Event
                  </Button>
                )}
              </div>
            ) : (
              <ScrollArea className="h-[400px]">
                <div className="p-4 space-y-3">
                  {selectedDateEvents.map(event => (
                    <EventMiniCard
                      key={event.id}
                      event={event}
                      onClick={() => onEventClick?.(event)}
                    />
                  ))}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Mini Event Card for Calendar Sidebar
interface EventMiniCardProps {
  event: Event;
  onClick?: () => void;
}

function EventMiniCard({ event, onClick }: EventMiniCardProps) {
  const startDate = parseISO(event.startDate);
  const endDate = parseISO(event.endDate);

  return (
    <button
      onClick={onClick}
      className="w-full text-left p-3 rounded-lg border bg-card hover:bg-muted transition-colors"
    >
      <div className="flex items-start gap-2 mb-2">
        <div className="flex-1 min-w-0">
          <h5 className="text-sm truncate">{event.title}</h5>
          <p className="text-xs text-muted-foreground">
            {event.isAllDay ? (
              'All Day'
            ) : (
              `${format(startDate, 'h:mm a')} - ${format(endDate, 'h:mm a')}`
            )}
          </p>
        </div>
        <Badge variant="outline" className="text-xs flex-shrink-0">
          {EVENT_TYPE_LABELS[event.type]}
        </Badge>
      </div>

      {event.location.venue && (
        <p className="text-xs text-muted-foreground truncate">
          📍 {event.location.venue}
        </p>
      )}

      {event.registration.required && (
        <p className="text-xs text-muted-foreground mt-1">
          {event.registration.registeredCount} registered
        </p>
      )}
    </button>
  );
}

/**
 * Vue Migration Notes:
 * 
 * Use Quasar's QDate component with custom event indicators:
 * 
 * <template>
 *   <div class="row q-col-gutter-md">
 *     <div class="col-12 col-lg-8">
 *       <q-card>
 *         <q-card-section>
 *           <div class="row items-center justify-between">
 *             <div class="text-h6">{{ currentMonthLabel }}</div>
 *             <div class="row q-gutter-sm">
 *               <q-btn outline label="Today" @click="goToToday" />
 *               <q-btn-group outline>
 *                 <q-btn icon="chevron_left" @click="prevMonth" />
 *                 <q-btn icon="chevron_right" @click="nextMonth" />
 *               </q-btn-group>
 *             </div>
 *           </div>
 *         </q-card-section>
 *         
 *         <q-separator />
 *         
 *         <q-card-section>
 *           <q-date
 *             v-model="selectedDate"
 *             :events="eventDates"
 *             event-color="primary"
 *             :navigation-min-year-month="minYearMonth"
 *             minimal
 *             @update:model-value="onDateSelect"
 *           >
 *             <template v-slot:event="{ date }">
 *               <q-badge
 *                 v-if="getEventsForDate(date).length > 0"
 *                 color="primary"
 *                 :label="getEventsForDate(date).length"
 *               />
 *             </template>
 *           </q-date>
 *         </q-card-section>
 *       </q-card>
 *     </div>
 *     
 *     <div class="col-12 col-lg-4">
 *       <q-card>
 *         <q-card-section>
 *           <div class="row items-center justify-between">
 *             <div>
 *               <div class="text-subtitle1">{{ selectedDateLabel }}</div>
 *               <div class="text-caption text-grey">
 *                 {{ selectedEvents.length }} events
 *               </div>
 *             </div>
 *             <q-btn
 *               v-if="selectedDate"
 *               flat
 *               round
 *               icon="add"
 *               @click="$emit('create', selectedDate)"
 *             />
 *           </div>
 *         </q-card-section>
 *         
 *         <q-separator />
 *         
 *         <q-scroll-area style="height: 400px">
 *           <div v-if="selectedEvents.length === 0" class="q-pa-md text-center">
 *             <q-icon name="event" size="48px" color="grey" />
 *             <div class="text-caption text-grey q-mt-sm">
 *               No events on this date
 *             </div>
 *           </div>
 *           
 *           <q-list v-else>
 *             <q-item
 *               v-for="event in selectedEvents"
 *               :key="event.id"
 *               clickable
 *               @click="$emit('event-click', event)"
 *             >
 *               <q-item-section>
 *                 <q-item-label>{{ event.title }}</q-item-label>
 *                 <q-item-label caption>
 *                   {{ formatTime(event) }}
 *                 </q-item-label>
 *                 <q-item-label caption v-if="event.location.venue">
 *                   📍 {{ event.location.venue }}
 *                 </q-item-label>
 *               </q-item-section>
 *               <q-item-section side>
 *                 <q-chip size="sm">{{ event.type }}</q-chip>
 *               </q-item-section>
 *             </q-item>
 *           </q-list>
 *         </q-scroll-area>
 *       </q-card>
 *     </div>
 *   </div>
 * </template>
 * 
 * <script setup lang="ts">
 * import { ref, computed } from 'vue';
 * import { format, parseISO } from 'date-fns';
 * import type { Event } from '@/types/event';
 * 
 * interface Props {
 *   events: Event[];
 * }
 * 
 * const props = defineProps<Props>();
 * 
 * const emit = defineEmits<{
 *   'date-select': [date: Date];
 *   'event-click': [event: Event];
 *   'create': [date: Date];
 * }>();
 * 
 * const selectedDate = ref<Date>(new Date());
 * const currentMonth = ref<Date>(new Date());
 * 
 * const eventDates = computed(() => {
 *   return props.events.map(e => format(parseISO(e.startDate), 'yyyy/MM/dd'));
 * });
 * 
 * const selectedEvents = computed(() => {
 *   return getEventsForDate(selectedDate.value);
 * });
 * 
 * const getEventsForDate = (date: Date) => {
 *   const dateStr = format(date, 'yyyy-MM-dd');
 *   return props.events.filter(e => 
 *     format(parseISO(e.startDate), 'yyyy-MM-dd') === dateStr
 *   );
 * };
 * </script>
 */
