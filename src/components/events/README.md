# Event Management System

## Overview

The Event Management System provides comprehensive event planning, registration, and tracking capabilities with calendar and list views, advanced filtering, and attendee management optimized for African church contexts.

## Key Features

🎯 **Event Management**
- Multiple event types (conference, crusade, retreat, workshop, etc.)
- Event status tracking (draft, published, ongoing, completed, cancelled)
- Physical, online, and hybrid event support
- Recurring events (daily, weekly, monthly, yearly)

📅 **Calendar & Views**
- Interactive monthly calendar view
- List view with grid/compact modes
- Filter by type, status, date, location
- Search by title, description, organizer, tags

📝 **Registration**
- Event registration with capacity limits
- Guest registration support
- Registration deadlines and fees
- Custom registration fields
- Waitlist management
- Payment tracking

👥 **Attendee Management**
- Member and guest registration
- Check-in tracking
- Attendance statistics
- Payment status tracking

🌍 **Africa-First Features**
- Offline event details viewing
- Low-bandwidth event images
- SMS reminder support (future)
- Multiple currency support
- Physical and hybrid events for connectivity challenges

## Components

### 1. **EventCard** (`EventCard.tsx`)
Display individual event in card or compact format.

**Features:**
- Event banner/image display
- Type and status badges
- Date, time, and location info
- Registration status and capacity
- Progress bar for capacity
- Registration buttons
- Organizer information
- Compact mode for lists
- Action menu (view, edit, share)

**Props:**
```typescript
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
```

### 2. **EventCalendar** (`EventCalendar.tsx`)
Calendar view with event indicators and sidebar.

**Features:**
- Monthly calendar grid
- Event count indicators on dates
- Multi-event dots on calendar days
- Selected date sidebar
- Event mini-cards in sidebar
- Today navigation
- Previous/next month navigation
- Create event from date click

**Props:**
```typescript
interface EventCalendarProps {
  events: Event[];
  selectedDate?: Date;
  onDateSelect?: (date: Date) => void;
  onEventClick?: (event: Event) => void;
  onCreateEvent?: (date: Date) => void;
  className?: string;
}
```

### 3. **EventList** (`EventList.tsx`)
Filterable list view with search and sorting.

**Features:**
- Search events by title, location, organizer, tags
- Filter by type, status, date range, location type
- Grid and list view toggle
- Active filter badges
- Clear all filters
- Empty state with suggestions
- Sorted by start date

**Props:**
```typescript
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
```

## Event Types

### Predefined Event Types

| Type | Label | Use Case |
|------|-------|----------|
| `conference` | Conference | Multi-day teaching events |
| `crusade` | Crusade | Evangelistic outreach |
| `retreat` | Retreat | Spiritual getaway events |
| `workshop` | Workshop | Training and skill development |
| `seminar` | Seminar | Educational sessions |
| `concert` | Concert | Musical performances |
| `outreach` | Outreach | Community service |
| `prayer_night` | Prayer Night | Prayer gatherings |
| `youth_camp` | Youth Camp | Youth programs |
| `children_program` | Children's Program | Kids events |
| `wedding` | Wedding | Wedding ceremonies |
| `funeral` | Funeral | Memorial services |
| `meeting` | Meeting | General meetings |
| `other` | Other | Miscellaneous events |

## Event Status

| Status | Description |
|--------|-------------|
| `draft` | Event created but not published |
| `published` | Event visible and registration open |
| `ongoing` | Event currently happening |
| `completed` | Event finished |
| `cancelled` | Event cancelled |

## Registration Management

### Registration Status

- **Open** - Accepting registrations
- **Closed** - No longer accepting registrations
- **Full** - Capacity reached
- **Invite Only** - Requires approval

### Registration Features

1. **Capacity Management**
   - Set maximum attendees
   - Track registered count
   - Automatic "Full" status
   - Waitlist support

2. **Fees & Payment**
   - Optional registration fee
   - Multiple currency support (NGN, USD, GHS, KES, etc.)
   - Payment status tracking
   - Payment methods

3. **Custom Fields**
   - Add custom registration questions
   - Text, email, phone, select, checkbox types
   - Required/optional fields
   - Collect additional attendee info

4. **Guest Registration**
   - Allow members to bring guests
   - Set guest limit per member
   - Track guest count separately

## Location Types

### Physical Events
```typescript
location: {
  type: 'physical',
  venue: 'Main Sanctuary',
  address: '123 Church Avenue',
  city: 'Lagos',
  state: 'Lagos',
  country: 'Nigeria',
  mapCoordinates: { lat: 6.5244, lng: 3.3792 }
}
```

### Online Events
```typescript
location: {
  type: 'online',
  onlineLink: 'https://zoom.us/j/123456789',
  onlinePlatform: 'Zoom' // Zoom, Teams, Meet, etc.
}
```

### Hybrid Events
```typescript
location: {
  type: 'hybrid',
  venue: 'Youth Center',
  address: '45 Youth Street',
  city: 'Lagos',
  onlineLink: 'https://zoom.us/j/987654321',
  onlinePlatform: 'Zoom'
}
```

## Recurring Events

### Recurrence Types

- **None** - One-time event
- **Daily** - Repeats every day
- **Weekly** - Repeats every week
- **Monthly** - Repeats every month
- **Yearly** - Repeats every year

### Recurrence Configuration

```typescript
recurrence: 'weekly',
recurrenceDays: [3], // Wednesday (0=Sunday, 6=Saturday)
recurrenceEndDate: '2024-12-31T23:59:59Z'
```

## Reminders

### Reminder Configuration

```typescript
reminders: {
  enabled: true,
  times: [10080, 1440, 60], // Minutes before: 1 week, 1 day, 1 hour
  methods: ['email', 'sms', 'push']
}
```

**Common Reminder Times:**
- 10080 = 1 week (7 days)
- 4320 = 3 days
- 2880 = 2 days
- 1440 = 1 day
- 720 = 12 hours
- 120 = 2 hours
- 60 = 1 hour
- 15 = 15 minutes

## Usage Examples

### Basic Event List

```typescript
import { EventList } from './components/events';
import { mockEvents } from './lib/mock-data';

function EventsPage() {
  const handleEventView = (event: Event) => {
    console.log('View event:', event);
  };

  return (
    <EventList
      events={mockEvents}
      onEventView={handleEventView}
    />
  );
}
```

### Calendar View

```typescript
import { EventCalendar } from './components/events';

function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <EventCalendar
      events={mockEvents}
      selectedDate={selectedDate}
      onDateSelect={setSelectedDate}
      onEventClick={(event) => console.log(event)}
    />
  );
}
```

### Event Registration Flow

```typescript
const handleRegister = async (event: Event) => {
  // Check if registration is open
  if (event.registration.status !== 'open') {
    alert('Registration is closed');
    return;
  }

  // Check capacity
  if (event.registration.capacity) {
    const spotsLeft = event.registration.capacity - event.registration.registeredCount;
    if (spotsLeft <= 0) {
      alert('Event is full. Would you like to join the waitlist?');
      return;
    }
  }

  // Show registration form
  showRegistrationModal(event);
};
```

## Data Structure

### Event Type
```typescript
interface Event {
  id: string;
  title: string;
  description: string;
  type: EventType;
  status: EventStatus;
  
  // Dates
  startDate: string; // ISO datetime
  endDate: string;
  isAllDay: boolean;
  timezone?: string;
  
  // Recurrence
  recurrence: RecurrenceType;
  recurrenceEndDate?: string;
  recurrenceDays?: number[];
  
  // Location
  location: {
    type: 'physical' | 'online' | 'hybrid';
    venue?: string;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    onlineLink?: string;
    onlinePlatform?: string;
    mapCoordinates?: { lat: number; lng: number };
  };
  
  // Registration
  registration: {
    required: boolean;
    status: RegistrationStatus;
    capacity?: number;
    registeredCount: number;
    attendedCount: number;
    waitlistCount: number;
    deadline?: string;
    fee?: number;
    currency?: string;
    requiresApproval: boolean;
    allowGuestRegistration: boolean;
    guestLimit?: number;
    customFields?: CustomField[];
  };
  
  // Organizer
  organizer: {
    id: string;
    name: string;
    email?: string;
    phone?: string;
    department?: string;
  };
  
  // Metadata
  imageUrl?: string;
  bannerUrl?: string;
  tags?: string[];
  targetAudience?: string[];
  ministries?: string[];
  reminders?: ReminderConfig;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}
```

## Mock Data

The system includes 8 sample events:

1. **Annual Church Conference 2024** - Conference (Nov 15-17)
   - 500 capacity, 342 registered
   - 5,000 NGN fee
   - Physical event in Main Sanctuary

2. **Youth Empowerment Crusade** - Crusade (Nov 2)
   - 300 capacity, 187 registered
   - Hybrid event (Youth Center + Zoom)
   - Free admission

3. **Marriage Retreat Weekend** - Retreat (Nov 8-10)
   - 50 capacity, 38 registered, 5 waitlist
   - 45,000 NGN fee
   - Requires approval
   - Custom fields (Anniversary Date, Dietary Requirements)

4. **Leadership Training Workshop** - Workshop (Oct 28)
   - 80 capacity, 64 registered
   - Requires approval
   - Members only

5. **Online Prayer Meeting** - Prayer Night (Oct 30)
   - Weekly recurring (Wednesdays)
   - Online via Zoom
   - No registration required

6. **Community Outreach - Orphanage Visit** - Outreach (Nov 9)
   - 40 capacity, 28 registered
   - Physical event
   - Guest registration allowed

7. **Children's Fun Day** - Children's Program (Nov 23)
   - 200 capacity, 145 registered
   - 2,000 NGN fee
   - Custom fields (Child Age, Allergies)

8. **Financial Freedom Seminar** - Seminar (Oct 19)
   - Completed event
   - 150 capacity, 132 attended
   - Historical data for analytics

## Africa-First Optimizations

### Low-Bandwidth Considerations

1. **Image Optimization**
   - Lazy load event banners
   - Compress images
   - Provide text fallback

2. **Offline Support**
   - Cache event list locally
   - View event details offline
   - Queue registrations for sync

3. **SMS Integration**
   - Send event reminders via SMS
   - Allow SMS RSVP
   - Confirmation codes via SMS

4. **Data Efficiency**
   - Paginate large event lists
   - Incremental loading
   - Minimal API calls

### Mobile Optimization

- Touch-friendly cards and buttons
- Swipe gestures for calendar
- Bottom sheet for event details
- Share to WhatsApp/Telegram
- Add to phone calendar

## Vue/Quasar Migration

### Component Mapping

**React (Current) → Vue/Quasar**

- `EventCard` → `QCard` with event data
- `EventCalendar` → `QDate` with event indicators
- `EventList` → `QList` with `QItem`
- `Badge` → `QBadge` or `QChip`
- `Button` → `QBtn`
- `Input` → `QInput`
- `Select` → `QSelect`
- `Dialog` → `QDialog`
- `Progress` → `QLinearProgress`

### Example Vue Component

```vue
<template>
  <q-card class="event-card">
    <q-img v-if="event.bannerUrl" :src="event.bannerUrl" height="200px">
      <div class="absolute-top-right q-pa-sm">
        <q-badge :color="statusColor">{{ statusLabel }}</q-badge>
      </div>
    </q-img>
    
    <q-card-section>
      <div class="text-h6">{{ event.title }}</div>
      <div class="text-caption text-grey">{{ event.description }}</div>
    </q-card-section>
    
    <q-separator />
    
    <q-card-section>
      <div class="row items-center q-gutter-sm">
        <q-icon name="event" />
        <div>{{ formatDate(event.startDate) }}</div>
      </div>
      
      <div class="row items-center q-gutter-sm q-mt-sm">
        <q-icon :name="locationIcon" />
        <div>{{ locationText }}</div>
      </div>
    </q-card-section>
    
    <q-separator />
    
    <q-card-actions>
      <q-btn 
        v-if="canRegister"
        color="primary" 
        icon="person_add"
        label="Register"
        @click="$emit('register', event)"
      />
      <q-btn 
        flat 
        icon="visibility"
        label="View Details"
        @click="$emit('view', event)"
      />
    </q-card-actions>
  </q-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { format } from 'date-fns';
import type { Event } from '@/types/event';

interface Props {
  event: Event;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  view: [event: Event];
  register: [event: Event];
}>();

const canRegister = computed(() => 
  props.event.registration.status === 'open' &&
  (!props.event.registration.capacity || 
   props.event.registration.registeredCount < props.event.registration.capacity)
);

const locationText = computed(() => {
  if (props.event.location.type === 'online') return 'Online Event';
  return props.event.location.venue || 'TBA';
});
</script>
```

## Best Practices

1. **Event Creation**
   - Always set realistic capacity
   - Include clear description
   - Add banner images
   - Set registration deadlines
   - Configure reminders

2. **Registration**
   - Send confirmation emails
   - Track payment status
   - Send reminders before event
   - Manage waitlist fairly

3. **Communication**
   - Send updates via email/SMS
   - Post announcements
   - Share on social media
   - Update event status

4. **Analytics**
   - Track registration rates
   - Monitor attendance
   - Analyze demographics
   - Improve future events

## Future Enhancements

- [ ] Event check-in with QR codes
- [ ] Attendee management interface
- [ ] Event analytics dashboard
- [ ] Email/SMS blast to registrants
- [ ] Event templates
- [ ] Duplicate events
- [ ] Export attendee list
- [ ] Print name badges
- [ ] Ticket generation
- [ ] Live stream integration
- [ ] Post-event surveys
- [ ] Event photo gallery

## Support

For questions or issues:
- Check inline component documentation
- Review Vue migration notes
- Consult type definitions
- Test with mock data

---

Built for ChurchAfrica ChMS  
© 2024 All Rights Reserved
