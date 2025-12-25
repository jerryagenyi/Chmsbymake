/**
 * ChurchAfrica ChMS - Event List
 * List view with filtering and search
 */

import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import {
  Search,
  Filter,
  Calendar,
  SlidersHorizontal,
  X,
  Grid3x3,
  List as ListIcon
} from 'lucide-react';
import { Event, EventType, EventStatus, EVENT_TYPE_LABELS, EVENT_STATUS_LABELS } from '../../types/event';
import { EventCard } from './EventCard';
import { cn } from '../ui/utils';
import { parseISO, isWithinInterval, startOfDay, endOfDay } from 'date-fns';

interface EventListProps {
  events: Event[];
  onEventView?: (event: Event) => void;
  onEventEdit?: (event: Event) => void;
  onEventRegister?: (event: Event) => void;
  onEventShare?: (event: Event) => void;
  showFilters?: boolean;
  defaultViewMode?: 'grid' | 'list';
  className?: string;
}

export function EventList({
  events,
  onEventView,
  onEventEdit,
  onEventRegister,
  onEventShare,
  showFilters = true,
  defaultViewMode = 'grid',
  className,
}: EventListProps) {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>(defaultViewMode);
  const [showFilterPanel, setShowFilterPanel] = React.useState(false);
  
  // Filters
  const [selectedType, setSelectedType] = React.useState<EventType | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = React.useState<EventStatus | 'all'>('all');
  const [selectedLocation, setSelectedLocation] = React.useState<'all' | 'physical' | 'online' | 'hybrid'>('all');
  const [dateFilter, setDateFilter] = React.useState<'all' | 'upcoming' | 'past' | 'today'>('upcoming');

  // Filter events
  const filteredEvents = React.useMemo(() => {
    return events.filter(event => {
      // Search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch = 
          event.title.toLowerCase().includes(query) ||
          event.description.toLowerCase().includes(query) ||
          event.location.venue?.toLowerCase().includes(query) ||
          event.organizer.name.toLowerCase().includes(query) ||
          event.tags?.some(tag => tag.toLowerCase().includes(query));

        if (!matchesSearch) return false;
      }

      // Event type
      if (selectedType !== 'all' && event.type !== selectedType) {
        return false;
      }

      // Event status
      if (selectedStatus !== 'all' && event.status !== selectedStatus) {
        return false;
      }

      // Location type
      if (selectedLocation !== 'all' && event.location.type !== selectedLocation) {
        return false;
      }

      // Date filter
      if (dateFilter !== 'all') {
        const eventStart = parseISO(event.startDate);
        const now = new Date();
        const today = startOfDay(now);
        const todayEnd = endOfDay(now);

        switch (dateFilter) {
          case 'upcoming':
            if (eventStart < now) return false;
            break;
          case 'past':
            if (eventStart >= now) return false;
            break;
          case 'today':
            if (!isWithinInterval(eventStart, { start: today, end: todayEnd })) {
              return false;
            }
            break;
        }
      }

      return true;
    });
  }, [events, searchQuery, selectedType, selectedStatus, selectedLocation, dateFilter]);

  // Sort events by start date
  const sortedEvents = React.useMemo(() => {
    return [...filteredEvents].sort((a, b) => {
      const dateA = parseISO(a.startDate);
      const dateB = parseISO(b.startDate);
      return dateA.getTime() - dateB.getTime();
    });
  }, [filteredEvents]);

  const activeFilterCount = React.useMemo(() => {
    let count = 0;
    if (selectedType !== 'all') count++;
    if (selectedStatus !== 'all') count++;
    if (selectedLocation !== 'all') count++;
    if (dateFilter !== 'upcoming') count++; // 'upcoming' is default
    return count;
  }, [selectedType, selectedStatus, selectedLocation, dateFilter]);

  const clearFilters = () => {
    setSelectedType('all');
    setSelectedStatus('all');
    setSelectedLocation('all');
    setDateFilter('upcoming');
    setSearchQuery('');
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Search and Filters Bar */}
      {showFilters && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col gap-4">
              {/* Search and View Toggle */}
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search events by title, location, organizer, or tags..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'outline'}
                    size="icon"
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid3x3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'outline'}
                    size="icon"
                    onClick={() => setViewMode('list')}
                  >
                    <ListIcon className="h-4 w-4" />
                  </Button>
                </div>

                <Button
                  variant={showFilterPanel ? 'default' : 'outline'}
                  onClick={() => setShowFilterPanel(!showFilterPanel)}
                  className="gap-2"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  Filters
                  {activeFilterCount > 0 && (
                    <Badge variant="secondary" className="ml-1 h-5 w-5 rounded-full p-0 flex items-center justify-center">
                      {activeFilterCount}
                    </Badge>
                  )}
                </Button>
              </div>

              {/* Filter Panel */}
              {showFilterPanel && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-3 border-t">
                  {/* Date Filter */}
                  <Select value={dateFilter} onValueChange={(v: any) => setDateFilter(v)}>
                    <SelectTrigger>
                      <Calendar className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Date" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Dates</SelectItem>
                      <SelectItem value="upcoming">Upcoming</SelectItem>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="past">Past</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Type Filter */}
                  <Select value={selectedType} onValueChange={(v: any) => setSelectedType(v)}>
                    <SelectTrigger>
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Event Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      {Object.entries(EVENT_TYPE_LABELS).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Status Filter */}
                  <Select value={selectedStatus} onValueChange={(v: any) => setSelectedStatus(v)}>
                    <SelectTrigger>
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      {Object.entries(EVENT_STATUS_LABELS).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Location Filter */}
                  <Select value={selectedLocation} onValueChange={(v: any) => setSelectedLocation(v)}>
                    <SelectTrigger>
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Locations</SelectItem>
                      <SelectItem value="physical">Physical</SelectItem>
                      <SelectItem value="online">Online</SelectItem>
                      <SelectItem value="hybrid">Hybrid</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Clear Filters */}
                  {activeFilterCount > 0 && (
                    <Button
                      variant="outline"
                      onClick={clearFilters}
                      className="sm:col-span-2 md:col-span-4 gap-2"
                    >
                      <X className="h-4 w-4" />
                      Clear All Filters
                    </Button>
                  )}
                </div>
              )}

              {/* Active Filters Display */}
              {activeFilterCount > 0 && !showFilterPanel && (
                <div className="flex flex-wrap gap-2">
                  {selectedType !== 'all' && (
                    <Badge variant="secondary" className="gap-2">
                      Type: {EVENT_TYPE_LABELS[selectedType as EventType]}
                      <button
                        onClick={() => setSelectedType('all')}
                        className="hover:bg-destructive/20 rounded-full"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  )}
                  {selectedStatus !== 'all' && (
                    <Badge variant="secondary" className="gap-2">
                      Status: {EVENT_STATUS_LABELS[selectedStatus as EventStatus]}
                      <button
                        onClick={() => setSelectedStatus('all')}
                        className="hover:bg-destructive/20 rounded-full"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  )}
                  {selectedLocation !== 'all' && (
                    <Badge variant="secondary" className="gap-2">
                      Location: {selectedLocation}
                      <button
                        onClick={() => setSelectedLocation('all')}
                        className="hover:bg-destructive/20 rounded-full"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  )}
                  {dateFilter !== 'upcoming' && (
                    <Badge variant="secondary" className="gap-2">
                      Date: {dateFilter}
                      <button
                        onClick={() => setDateFilter('upcoming')}
                        className="hover:bg-destructive/20 rounded-full"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {sortedEvents.length} {sortedEvents.length === 1 ? 'event' : 'events'}
          {searchQuery && ` matching "${searchQuery}"`}
        </p>
      </div>

      {/* Events Grid/List */}
      {sortedEvents.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h4 className="mb-2">No Events Found</h4>
            <p className="text-sm text-muted-foreground mb-4">
              {searchQuery || activeFilterCount > 0
                ? 'Try adjusting your search or filters'
                : 'No events available'}
            </p>
            {(searchQuery || activeFilterCount > 0) && (
              <Button variant="outline" onClick={clearFilters}>
                Clear Filters
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div
          className={cn(
            viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
              : 'space-y-3'
          )}
        >
          {sortedEvents.map(event => (
            <EventCard
              key={event.id}
              event={event}
              onView={onEventView}
              onEdit={onEventEdit}
              onRegister={onEventRegister}
              onShare={onEventShare}
              compact={viewMode === 'list'}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * Vue Migration Notes:
 * 
 * <template>
 *   <div class="q-gutter-md">
 *     <q-card v-if="showFilters">
 *       <q-card-section>
 *         <!-- Search -->
 *         <div class="row q-gutter-sm">
 *           <q-input
 *             v-model="searchQuery"
 *             outlined
 *             dense
 *             placeholder="Search events..."
 *             class="col"
 *           >
 *             <template v-slot:prepend>
 *               <q-icon name="search" />
 *             </template>
 *           </q-input>
 *           
 *           <q-btn-toggle
 *             v-model="viewMode"
 *             :options="[
 *               { value: 'grid', icon: 'grid_view' },
 *               { value: 'list', icon: 'list' }
 *             ]"
 *           />
 *           
 *           <q-btn
 *             :color="showFilterPanel ? 'primary' : undefined"
 *             outline
 *             icon="tune"
 *             @click="showFilterPanel = !showFilterPanel"
 *           >
 *             <q-badge v-if="activeFilterCount" color="primary" floating>
 *               {{ activeFilterCount }}
 *             </q-badge>
 *           </q-btn>
 *         </div>
 *         
 *         <!-- Filter Panel -->
 *         <div v-if="showFilterPanel" class="row q-col-gutter-sm q-mt-sm">
 *           <q-select
 *             v-model="dateFilter"
 *             :options="dateFilterOptions"
 *             outlined
 *             dense
 *             class="col-12 col-sm-6 col-md-3"
 *           />
 *           <q-select
 *             v-model="selectedType"
 *             :options="typeOptions"
 *             outlined
 *             dense
 *             class="col-12 col-sm-6 col-md-3"
 *           />
 *           <q-select
 *             v-model="selectedStatus"
 *             :options="statusOptions"
 *             outlined
 *             dense
 *             class="col-12 col-sm-6 col-md-3"
 *           />
 *           <q-select
 *             v-model="selectedLocation"
 *             :options="locationOptions"
 *             outlined
 *             dense
 *             class="col-12 col-sm-6 col-md-3"
 *           />
 *         </div>
 *       </q-card-section>
 *     </q-card>
 *     
 *     <!-- Results -->
 *     <div class="text-caption text-grey">
 *       {{ filteredEvents.length }} events
 *     </div>
 *     
 *     <!-- Events Grid/List -->
 *     <div :class="viewMode === 'grid' ? 'row q-col-gutter-md' : 'column q-gutter-sm'">
 *       <div
 *         v-for="event in sortedEvents"
 *         :key="event.id"
 *         :class="viewMode === 'grid' ? 'col-12 col-md-6 col-lg-4' : 'col-12'"
 *       >
 *         <EventCard
 *           :event="event"
 *           :compact="viewMode === 'list'"
 *           @view="$emit('view', event)"
 *           @edit="$emit('edit', event)"
 *           @register="$emit('register', event)"
 *         />
 *       </div>
 *     </div>
 *   </div>
 * </template>
 */
