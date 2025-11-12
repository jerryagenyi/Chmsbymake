/**
 * ChurchAfrica ChMS - Event Types
 * Type definitions for event management system
 */

import { ServiceType } from './service';

export type EventType =
  | 'conference'
  | 'crusade'
  | 'retreat'
  | 'workshop'
  | 'seminar'
  | 'concert'
  | 'outreach'
  | 'prayer_night'
  | 'youth_camp'
  | 'children_program'
  | 'wedding'
  | 'funeral'
  | 'meeting'
  | 'service' // NEW: For regular church services
  | 'other';

export type EventStatus = 'draft' | 'published' | 'ongoing' | 'completed' | 'cancelled';

export type RegistrationStatus = 'open' | 'closed' | 'full' | 'invite_only';

export type AttendeeStatus = 'registered' | 'confirmed' | 'attended' | 'cancelled' | 'waitlist';

export type RecurrenceType = 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly';

export interface Event {
  id: string;
  title: string;
  description: string;
  type: EventType;
  status: EventStatus;
  
  // Date & Time
  startDate: string; // ISO datetime
  endDate: string; // ISO datetime
  isAllDay: boolean;
  timezone?: string;
  
  // Recurrence
  recurrence: RecurrenceType;
  recurrenceEndDate?: string;
  recurrenceDays?: number[]; // 0-6 (Sunday-Saturday)
  
  // Service-specific fields (for type === 'service')
  serviceType?: ServiceType;
  isRecurringService?: boolean;
  linkedServiceId?: string; // Links to Service.id from /types/service.ts
  
  // Location
  location: {
    type: 'physical' | 'online' | 'hybrid';
    venue?: string;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    onlineLink?: string;
    onlinePlatform?: string; // Zoom, Teams, etc.
    buildingId?: string; // NEW: For location tracking
    roomId?: string; // NEW: For location tracking
    mapCoordinates?: {
      lat: number;
      lng: number;
    };
  };
  
  // Registration
  registration: {
    required: boolean;
    status: RegistrationStatus;
    capacity?: number;
    registeredCount: number;
    attendedCount: number;
    waitlistCount: number;
    deadline?: string; // ISO datetime
    fee?: number;
    currency?: string;
    requiresApproval: boolean;
    allowGuestRegistration: boolean;
    guestLimit?: number;
    customFields?: {
      name: string;
      type: 'text' | 'email' | 'phone' | 'select' | 'checkbox';
      required: boolean;
      options?: string[];
    }[];
  };
  
  // Organizer
  organizer: {
    id: string;
    name: string;
    email?: string;
    phone?: string;
    department?: string;
  };
  
  // Additional Details
  imageUrl?: string;
  bannerUrl?: string;
  tags?: string[];
  targetAudience?: ('all' | 'members' | 'visitors' | 'youth' | 'children' | 'adults')[];
  ministries?: string[];
  
  // Notifications
  reminders?: {
    enabled: boolean;
    times: number[]; // Minutes before event (e.g., [1440, 60] = 1 day, 1 hour)
    methods: ('email' | 'sms' | 'push')[];
  };
  
  // Metadata
  createdBy: string;
  createdByName?: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  notes?: string;
}

export interface EventAttendee {
  id: string;
  eventId: string;
  memberId?: string;
  memberName?: string;
  memberPhoto?: string;
  
  // Guest Info (if not a member)
  isGuest: boolean;
  guestName?: string;
  guestEmail?: string;
  guestPhone?: string;
  guestCount?: number; // Including self
  
  // Registration
  status: AttendeeStatus;
  registeredAt: string;
  confirmedAt?: string;
  checkInTime?: string;
  checkOutTime?: string;
  
  // Payment (if fee required)
  paymentStatus?: 'pending' | 'paid' | 'refunded' | 'waived';
  paymentMethod?: string;
  paymentAmount?: number;
  paymentDate?: string;
  paymentReference?: string;
  
  // Custom Fields
  customFieldValues?: Record<string, any>;
  
  // Metadata
  registeredBy?: string;
  notes?: string;
  source?: 'web' | 'mobile' | 'admin' | 'qr' | 'walk_in';
}

export interface EventStats {
  eventId: string;
  title: string;
  type: EventType;
  status: EventStatus;
  startDate: string;
  
  // Registration Stats
  totalCapacity?: number;
  totalRegistered: number;
  totalConfirmed: number;
  totalAttended: number;
  totalCancelled: number;
  totalWaitlist: number;
  registrationRate: number; // Percentage
  attendanceRate: number; // Percentage
  
  // Attendance Breakdown
  byStatus: {
    registered: number;
    confirmed: number;
    attended: number;
    cancelled: number;
    waitlist: number;
  };
  
  byType: {
    members: number;
    guests: number;
  };
  
  byAge?: {
    children: number;
    youth: number;
    adults: number;
    seniors: number;
  };
  
  byGender?: {
    male: number;
    female: number;
    other: number;
  };
  
  // Financial
  totalRevenue?: number;
  totalPaid?: number;
  totalPending?: number;
  
  // Engagement
  avgCheckInTime?: string;
  peakRegistrationDay?: string;
  lastRegistrationTime?: string;
}

export interface EventFilter {
  search?: string;
  type?: EventType[];
  status?: EventStatus[];
  dateRange?: {
    start: string;
    end: string;
  };
  location?: 'physical' | 'online' | 'hybrid';
  registrationStatus?: RegistrationStatus[];
  ministry?: string[];
  organizer?: string;
  tags?: string[];
}

export interface EventCalendarView {
  date: Date;
  events: Event[];
  hasEvents: boolean;
  isToday: boolean;
  isSelected: boolean;
}

// Event Type Labels
export const EVENT_TYPE_LABELS: Record<EventType, string> = {
  conference: 'Conference',
  crusade: 'Crusade',
  retreat: 'Retreat',
  workshop: 'Workshop',
  seminar: 'Seminar',
  concert: 'Concert',
  outreach: 'Outreach',
  prayer_night: 'Prayer Night',
  youth_camp: 'Youth Camp',
  children_program: "Children's Program",
  wedding: 'Wedding',
  funeral: 'Funeral',
  meeting: 'Meeting',
  service: 'Service', // NEW: For regular church services
  other: 'Other',
};

// Event Type Colors (for badges)
export const EVENT_TYPE_COLORS: Record<EventType, string> = {
  conference: 'primary',
  crusade: 'destructive',
  retreat: 'success',
  workshop: 'info',
  seminar: 'warning',
  concert: 'pink',
  outreach: 'purple',
  prayer_night: 'accent',
  youth_camp: 'success',
  children_program: 'pink',
  wedding: 'rose',
  funeral: 'slate',
  meeting: 'info',
  service: 'blue', // NEW: For regular church services
  other: 'secondary',
};

// Event Status Labels
export const EVENT_STATUS_LABELS: Record<EventStatus, string> = {
  draft: 'Draft',
  published: 'Published',
  ongoing: 'Ongoing',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

// Registration Status Labels
export const REGISTRATION_STATUS_LABELS: Record<RegistrationStatus, string> = {
  open: 'Open',
  closed: 'Closed',
  full: 'Full',
  invite_only: 'Invite Only',
};

/**
 * Vue Migration Notes:
 * 
 * Laravel Backend Types (app/Models):
 * 
 * Event.php:
 * - table: events
 * - fillable: title, description, type, status, start_date, end_date, is_all_day, 
 *             location, registration_settings, organizer, image_url, tags, created_by
 * - casts: location => array, registration_settings => array, organizer => array, 
 *          tags => array, start_date => datetime, end_date => datetime
 * - relationships: attendees(), creator()
 * 
 * EventAttendee.php:
 * - table: event_attendees
 * - fillable: event_id, member_id, guest_name, guest_email, guest_phone, 
 *             status, registered_at, check_in_time, payment_status
 * - casts: registered_at => datetime, check_in_time => datetime
 * - relationships: event(), member()
 * 
 * Database Migrations:
 * 
 * create_events_table:
 * - id (bigint, primary)
 * - title (string)
 * - description (text)
 * - type (enum)
 * - status (enum)
 * - start_date (datetime)
 * - end_date (datetime)
 * - is_all_day (boolean)
 * - recurrence (enum)
 * - location (json)
 * - registration_settings (json)
 * - organizer (json)
 * - image_url (string, nullable)
 * - banner_url (string, nullable)
 * - tags (json, nullable)
 * - created_by (bigint, foreign -> users.id)
 * - created_at, updated_at
 * - indexes: type, status, start_date, created_by
 * 
 * create_event_attendees_table:
 * - id (bigint, primary)
 * - event_id (bigint, foreign -> events.id)
 * - member_id (bigint, foreign -> members.id, nullable)
 * - is_guest (boolean, default false)
 * - guest_name (string, nullable)
 * - guest_email (string, nullable)
 * - guest_phone (string, nullable)
 * - guest_count (integer, default 1)
 * - status (enum)
 * - registered_at (datetime)
 * - confirmed_at (datetime, nullable)
 * - check_in_time (datetime, nullable)
 * - payment_status (enum, nullable)
 * - payment_amount (decimal, nullable)
 * - payment_reference (string, nullable)
 * - registered_by (bigint, foreign -> users.id, nullable)
 * - created_at, updated_at
 * - indexes: event_id, member_id, status, registered_at
 * - unique: [event_id, member_id] (for members)
 */