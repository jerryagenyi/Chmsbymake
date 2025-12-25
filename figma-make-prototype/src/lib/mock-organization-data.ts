/**
 * Mock Organization, Campus, and Service Data
 */

import { Organization, Campus, CampusService } from '../types/organization';

export const mockOrganization: Organization = {
  id: 'org_001',
  name: 'Victory Chapel Ministry',
  slug: 'victory-chapel',
  type: 'independent',
  
  headquarters: {
    country: 'Nigeria',
    city: 'Lagos',
    address: '123 Church Street, Ikeja',
    phone: '+234 800 123 4567',
    email: 'admin@victorychapel.org',
  },
  
  adminUserId: 'user_admin_001',
  foundedDate: '1995-03-15',
  
  settings: {
    timezone: 'Africa/Lagos',
    currency: 'NGN',
    language: 'en',
    fiscalYearStart: '01-01',
    
    features: {
      multipleServices: true,
      onlineGiving: true,
      smsNotifications: true,
      eventManagement: true,
      financialReporting: true,
    },
  },
  
  branding: {
    logoUrl: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=200',
    primaryColor: '#1CE479',
    websiteUrl: 'https://victorychapel.org',
    campusDisplayFormat: 'acronym-space-name',
  },
  
  subscription: {
    plan: 'premium',
    status: 'active',
    expiresAt: '2025-12-31',
    maxBranches: 20,
    maxMembersPerBranch: 5000,
  },
  
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-10-25T10:30:00Z',
  createdBy: 'user_admin_001',
};

export const mockCampuses: Campus[] = [
  {
    id: 'campus_001',
    organizationId: 'org_001',
    
    name: 'Victory Chapel Lagos (HQ)',
    code: 'VCL',
    shortName: 'Lagos',
    slug: 'lagos-hq',
    
    type: 'headquarters',
    isHeadquarters: true,
    
    location: {
      country: 'Nigeria',
      state: 'Lagos',
      city: 'Ikeja',
      address: '123 Church Street, Ikeja, Lagos',
      coordinates: {
        latitude: 6.5833,
        longitude: 3.3333,
      },
      timezone: 'Africa/Lagos',
    },
    
    contact: {
      phone: '+234 800 123 4567',
      email: 'lagos@victorychapel.org',
      website: 'https://victorychapel.org/lagos',
    },
    
    leadership: {
      headPastorId: 'user_pastor_001',
      assistantPastorIds: ['user_asst_pastor_001', 'user_asst_pastor_002'],
      administratorId: 'user_admin_002',
    },
    
    facilities: {
      mainAuditoriumCapacity: 1000,
      parkingSpaces: 200,
      hasChildrenChurch: true,
      hasMediaEquipment: true,
    },
    
    status: 'active',
    establishedDate: '1995-03-15',
    
    metadata: {
      memberCount: 850,
      averageAttendance: 720,
      lastServiceDate: '2024-10-27',
    },
    
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-10-25T10:30:00Z',
  },
  {
    id: 'campus_002',
    organizationId: 'org_001',
    
    name: 'Victory Chapel Abuja',
    code: 'VCA',
    shortName: 'Abuja',
    slug: 'abuja',
    
    type: 'campus',
    isHeadquarters: false,
    
    location: {
      country: 'Nigeria',
      state: 'FCT',
      city: 'Abuja',
      address: '45 Independence Avenue, Wuse 2, Abuja',
      coordinates: {
        latitude: 9.0765,
        longitude: 7.3986,
      },
      timezone: 'Africa/Lagos',
    },
    
    contact: {
      phone: '+234 800 234 5678',
      email: 'abuja@victorychapel.org',
    },
    
    leadership: {
      headPastorId: 'user_pastor_002',
      assistantPastorIds: ['user_asst_pastor_003'],
      administratorId: 'user_admin_003',
    },
    
    facilities: {
      mainAuditoriumCapacity: 500,
      parkingSpaces: 80,
      hasChildrenChurch: true,
      hasMediaEquipment: true,
    },
    
    status: 'active',
    establishedDate: '2010-06-15',
    
    metadata: {
      memberCount: 320,
      averageAttendance: 280,
      lastServiceDate: '2024-10-27',
    },
    
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-10-25T10:30:00Z',
  },
  {
    id: 'campus_003',
    organizationId: 'org_001',
    
    name: 'Victory Chapel Accra',
    code: 'VCG',
    shortName: 'Accra',
    slug: 'accra-ghana',
    
    type: 'campus',
    isHeadquarters: false,
    
    location: {
      country: 'Ghana',
      state: 'Greater Accra',
      city: 'Accra',
      address: '23 Liberation Road, Accra',
      coordinates: {
        latitude: 5.6037,
        longitude: -0.1870,
      },
      timezone: 'Africa/Accra',
    },
    
    contact: {
      phone: '+233 30 123 4567',
      email: 'accra@victorychapel.org',
    },
    
    leadership: {
      headPastorId: 'user_pastor_003',
      assistantPastorIds: [],
      administratorId: 'user_admin_004',
    },
    
    facilities: {
      mainAuditoriumCapacity: 300,
      parkingSpaces: 50,
      hasChildrenChurch: false,
      hasMediaEquipment: true,
    },
    
    status: 'active',
    establishedDate: '2018-09-01',
    
    metadata: {
      memberCount: 180,
      averageAttendance: 150,
      lastServiceDate: '2024-10-27',
    },
    
    createdAt: '2024-02-01T00:00:00Z',
    updatedAt: '2024-10-25T10:30:00Z',
  },
];

export const mockCampusServices: CampusService[] = [
  // Lagos HQ Services
  {
    id: 'service_001',
    campusId: 'campus_001',
    organizationId: 'org_001',
    
    name: 'Sunday 1st Service',
    type: 'sunday',
    
    schedule: {
      dayOfWeek: 0,
      startTime: '08:00',
      endTime: '10:00',
      duration: 120,
    },
    
    recurrence: {
      frequency: 'weekly',
      isRecurring: true,
      startDate: '2024-01-07',
    },
    
    location: {
      venue: 'Main Auditorium',
      venueType: 'physical',
    },
    
    expectedAttendance: 450,
    targetGroups: ['adults', 'families'],
    
    isActive: true,
    status: 'active',
    
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-10-25T10:30:00Z',
  },
  {
    id: 'service_002',
    campusId: 'campus_001',
    organizationId: 'org_001',
    
    name: 'Sunday 2nd Service',
    type: 'sunday',
    
    schedule: {
      dayOfWeek: 0,
      startTime: '10:30',
      endTime: '12:30',
      duration: 120,
    },
    
    recurrence: {
      frequency: 'weekly',
      isRecurring: true,
      startDate: '2024-01-07',
    },
    
    location: {
      venue: 'Main Auditorium',
      venueType: 'physical',
    },
    
    expectedAttendance: 500,
    targetGroups: ['adults', 'families', 'youth'],
    
    isActive: true,
    status: 'active',
    
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-10-25T10:30:00Z',
  },
  {
    id: 'service_003',
    campusId: 'campus_001',
    organizationId: 'org_001',
    
    name: 'Midweek Service',
    type: 'midweek',
    
    schedule: {
      dayOfWeek: 3,
      startTime: '18:00',
      endTime: '19:30',
      duration: 90,
    },
    
    recurrence: {
      frequency: 'weekly',
      isRecurring: true,
      startDate: '2024-01-03',
    },
    
    location: {
      venue: 'Main Auditorium',
      venueType: 'hybrid',
      onlineLink: 'https://zoom.us/j/123456789',
    },
    
    expectedAttendance: 250,
    targetGroups: ['adults'],
    
    isActive: true,
    status: 'active',
    
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-10-25T10:30:00Z',
  },
  {
    id: 'service_004',
    campusId: 'campus_001',
    organizationId: 'org_001',
    
    name: 'Youth Service',
    type: 'youth',
    
    schedule: {
      dayOfWeek: 5,
      startTime: '17:00',
      endTime: '19:00',
      duration: 120,
    },
    
    recurrence: {
      frequency: 'weekly',
      isRecurring: true,
      startDate: '2024-01-05',
    },
    
    location: {
      venue: 'Youth Hall',
      venueType: 'physical',
    },
    
    expectedAttendance: 180,
    targetGroups: ['youth', 'teenagers'],
    
    isActive: true,
    status: 'active',
    
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-10-25T10:30:00Z',
  },
  
  // Abuja Campus Services
  {
    id: 'service_005',
    campusId: 'campus_002',
    organizationId: 'org_001',
    
    name: 'Sunday Service',
    type: 'sunday',
    
    schedule: {
      dayOfWeek: 0,
      startTime: '09:00',
      endTime: '11:00',
      duration: 120,
    },
    
    recurrence: {
      frequency: 'weekly',
      isRecurring: true,
      startDate: '2024-01-07',
    },
    
    location: {
      venue: 'Main Sanctuary',
      venueType: 'physical',
    },
    
    expectedAttendance: 280,
    targetGroups: ['adults', 'families'],
    
    isActive: true,
    status: 'active',
    
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-10-25T10:30:00Z',
  },
  {
    id: 'service_006',
    campusId: 'campus_002',
    organizationId: 'org_001',
    
    name: 'Midweek Service',
    type: 'midweek',
    
    schedule: {
      dayOfWeek: 3,
      startTime: '17:30',
      endTime: '19:00',
      duration: 90,
    },
    
    recurrence: {
      frequency: 'weekly',
      isRecurring: true,
      startDate: '2024-01-03',
    },
    
    location: {
      venue: 'Main Sanctuary',
      venueType: 'hybrid',
      onlineLink: 'https://zoom.us/j/987654321',
    },
    
    expectedAttendance: 150,
    targetGroups: ['adults'],
    
    isActive: true,
    status: 'active',
    
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-10-25T10:30:00Z',
  },
  
  // Accra Campus Services
  {
    id: 'service_007',
    campusId: 'campus_003',
    organizationId: 'org_001',
    
    name: 'Sunday Service',
    type: 'sunday',
    
    schedule: {
      dayOfWeek: 0,
      startTime: '10:00',
      endTime: '12:00',
      duration: 120,
    },
    
    recurrence: {
      frequency: 'weekly',
      isRecurring: true,
      startDate: '2024-02-04',
    },
    
    location: {
      venue: 'Main Hall',
      venueType: 'physical',
    },
    
    expectedAttendance: 150,
    targetGroups: ['adults', 'families'],
    
    isActive: true,
    status: 'active',
    
    createdAt: '2024-02-01T00:00:00Z',
    updatedAt: '2024-10-25T10:30:00Z',
  },
  {
    id: 'service_008',
    campusId: 'campus_003',
    organizationId: 'org_001',
    
    name: 'Prayer Meeting',
    type: 'prayer',
    
    schedule: {
      dayOfWeek: 2,
      startTime: '18:00',
      endTime: '19:00',
      duration: 60,
    },
    
    recurrence: {
      frequency: 'weekly',
      isRecurring: true,
      startDate: '2024-02-06',
    },
    
    location: {
      venue: 'Prayer Room',
      venueType: 'physical',
    },
    
    expectedAttendance: 50,
    targetGroups: ['adults'],
    
    isActive: true,
    status: 'active',
    
    createdAt: '2024-02-01T00:00:00Z',
    updatedAt: '2024-10-25T10:30:00Z',
  },
];