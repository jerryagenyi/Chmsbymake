/**
 * Organization, Campus, and Service Type Definitions
 * Multi-tenant architecture for ChurchAfrica ChMS
 */

export interface Organization {
  id: string;
  name: string;
  slug: string;
  type: 'denomination' | 'independent' | 'network';
  
  // Contact & Location
  headquarters: {
    country: string;
    city: string;
    address: string;
    phone: string;
    email: string;
  };
  
  // Admin & Ownership
  adminUserId: string;
  foundedDate: string;
  
  // Configuration
  settings: {
    timezone: string;
    currency: string;
    language: string;
    fiscalYearStart: string;
    
    features: {
      multipleServices: boolean;
      onlineGiving: boolean;
      smsNotifications: boolean;
      eventManagement: boolean;
      financialReporting: boolean;
    };
  };
  
  // Branding
  branding: {
    logoUrl?: string;
    primaryColor: string;
    websiteUrl?: string;
    campusDisplayFormat: 'acronym-comma-name' | 'acronym-space-name' | 'name-only' | 'full-org-comma-name';
  };
  
  // Subscription & Billing
  subscription: {
    plan: 'free' | 'basic' | 'premium' | 'enterprise';
    status: 'active' | 'trial' | 'suspended' | 'cancelled';
    expiresAt: string;
    maxBranches: number;
    maxMembersPerBranch: number;
  };
  
  // Audit
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface Campus {
  id: string;
  organizationId: string;
  
  // Identity
  name: string;
  code: string; // Short identifier like "VCL", "RCCG-TR"
  shortName: string; // Display name like "Lagos", "Throne Room"
  slug: string;
  
  // Classification
  type: 'headquarters' | 'campus' | 'cell';
  isHeadquarters: boolean;
  
  // Location Details
  location: {
    country: string;
    state: string;
    city: string;
    address: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
    timezone: string;
  };
  
  // Contact
  contact: {
    phone: string;
    email: string;
    website?: string;
  };
  
  // Leadership
  leadership: {
    headPastorId: string;
    assistantPastorIds: string[];
    administratorId: string;
  };
  
  // Capacity & Facilities
  facilities: {
    mainAuditoriumCapacity: number;
    parkingSpaces?: number;
    hasChildrenChurch: boolean;
    hasMediaEquipment: boolean;
  };
  
  // Status
  status: 'active' | 'inactive' | 'under_construction';
  establishedDate: string;
  
  // Metadata
  metadata: {
    memberCount: number;
    averageAttendance: number;
    lastServiceDate: string;
  };
  
  // Audit
  createdAt: string;
  updatedAt: string;
}

export interface CampusService {
  id: string;
  campusId: string;
  organizationId: string;
  
  // Identity
  name: string;
  type: 'sunday' | 'midweek' | 'youth' | 'prayer' | 'special';
  
  // Schedule
  schedule: {
    dayOfWeek: number; // 0 = Sunday
    startTime: string;
    endTime: string;
    duration: number; // minutes
  };
  
  // Recurrence
  recurrence: {
    frequency: 'weekly' | 'biweekly' | 'monthly' | 'once';
    isRecurring: boolean;
    startDate: string;
    endDate?: string;
  };
  
  // Location
  location: {
    venue: string;
    venueType: 'physical' | 'online' | 'hybrid';
    onlineLink?: string;
  };
  
  // Attendance
  expectedAttendance: number;
  targetGroups: string[];
  
  // Status
  isActive: boolean;
  status: 'draft' | 'active' | 'paused' | 'archived';
  
  // Audit
  createdAt: string;
  updatedAt: string;
}

export interface UserRole {
  userId: string;
  organizationId?: string;
  campusId?: string;
  role: 'super_admin' | 'org_admin' | 'campus_admin' | 'pastor' | 'dept_head' | 'staff' | 'volunteer';
  permissions: string[];
  createdAt: string;
}

export interface OrganizationInvite {
  id: string;
  organizationId: string;
  campusId?: string;
  email: string;
  role: UserRole['role'];
  invitedBy: string;
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  expiresAt: string;
  createdAt: string;
}