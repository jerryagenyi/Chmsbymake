/**
 * ChurchAfrica ChMS - Mock Service Data
 * Test data for multi-service attendance system
 */

import { Service, ServiceTemplate, ServiceAttendanceStats } from '../types/service';

export const mockServices: Service[] = [
  {
    id: 's1',
    organizationId: 'org1',
    branchId: 'branch1',
    name: 'Sunday Morning Worship',
    serviceType: 'sunday_morning',
    scheduledDate: new Date().toISOString().split('T')[0],
    startTime: '09:00',
    endTime: '11:00',
    status: 'active',
    frequency: 'weekly',
    dayOfWeek: 'sunday',
    capacity: 500,
    expectedAttendance: 350,
    location: {
      type: 'physical',
      venue: 'Main Sanctuary',
      buildingId: 'bldg1',
      roomId: 'sanctuary',
    },
    ministryAssignments: [
      {
        id: 'ma1',
        ageMin: 0,
        ageMax: 3,
        ministry: 'Nursery',
        room: 'Room 101',
        capacity: 20,
        staffRequired: 3,
      },
      {
        id: 'ma2',
        ageMin: 4,
        ageMax: 12,
        ministry: "Children's Church",
        room: 'Room 201',
        capacity: 50,
        staffRequired: 5,
      },
      {
        id: 'ma3',
        ageMin: 13,
        ageMax: 17,
        ministry: 'Youth Service',
        room: 'Youth Hall',
        capacity: 40,
        staffRequired: 3,
      },
    ],
    description: 'Main Sunday morning worship service with contemporary worship',
    leader: 'user1',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    createdBy: 'user1',
  },
  {
    id: 's2',
    organizationId: 'org1',
    branchId: 'branch1',
    name: 'Sunday Evening Service',
    serviceType: 'sunday_evening',
    scheduledDate: new Date().toISOString().split('T')[0],
    startTime: '17:00',
    endTime: '19:00',
    status: 'scheduled',
    frequency: 'weekly',
    dayOfWeek: 'sunday',
    capacity: 300,
    expectedAttendance: 180,
    location: {
      type: 'physical',
      venue: 'Main Sanctuary',
      buildingId: 'bldg1',
      roomId: 'sanctuary',
    },
    description: 'Evening service with prayer and praise',
    leader: 'user2',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    createdBy: 'user1',
  },
  {
    id: 's3',
    organizationId: 'org1',
    branchId: 'branch1',
    name: 'Wednesday Prayer Meeting',
    serviceType: 'prayer_meeting',
    scheduledDate: (() => {
      const d = new Date();
      const day = d.getDay();
      const diff = (3 - day + 7) % 7; // 3 is Wednesday
      d.setDate(d.getDate() + diff);
      return d.toISOString().split('T')[0];
    })(),
    startTime: '18:30',
    endTime: '20:00',
    status: 'scheduled',
    frequency: 'weekly',
    dayOfWeek: 'wednesday',
    capacity: 150,
    expectedAttendance: 80,
    location: {
      type: 'physical',
      venue: 'Prayer Hall',
      buildingId: 'bldg1',
      roomId: 'prayer-hall',
    },
    description: 'Midweek prayer and intercession',
    leader: 'user3',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    createdBy: 'user1',
  },
  {
    id: 's4',
    organizationId: 'org1',
    branchId: 'branch1',
    name: 'Friday Bible Study',
    serviceType: 'bible_study',
    scheduledDate: (() => {
      const d = new Date();
      const day = d.getDay();
      const diff = (5 - day + 7) % 7; // 5 is Friday
      d.setDate(d.getDate() + diff);
      return d.toISOString().split('T')[0];
    })(),
    startTime: '19:00',
    endTime: '20:30',
    status: 'scheduled',
    frequency: 'weekly',
    dayOfWeek: 'friday',
    capacity: 100,
    expectedAttendance: 60,
    location: {
      type: 'hybrid',
      venue: 'Fellowship Hall',
      buildingId: 'bldg1',
      roomId: 'fellowship-hall',
      onlineUrl: 'https://zoom.us/j/123456789',
    },
    description: 'In-depth Bible study and discussion',
    leader: 'user4',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    createdBy: 'user1',
  },
  {
    id: 's5',
    organizationId: 'org1',
    branchId: 'branch1',
    name: 'Youth Night',
    serviceType: 'youth_service',
    scheduledDate: (() => {
      const d = new Date();
      const day = d.getDay();
      const diff = (6 - day + 7) % 7; // 6 is Saturday
      d.setDate(d.getDate() + diff);
      return d.toISOString().split('T')[0];
    })(),
    startTime: '18:00',
    endTime: '20:00',
    status: 'scheduled',
    frequency: 'weekly',
    dayOfWeek: 'saturday',
    capacity: 120,
    expectedAttendance: 90,
    location: {
      type: 'physical',
      venue: 'Youth Centre',
      buildingId: 'bldg2',
      roomId: 'youth-centre',
    },
    description: 'Youth worship, teaching, and fellowship',
    leader: 'user5',
    notes: 'Bring friends! Snacks provided.',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    createdBy: 'user1',
  },
];

export const mockServiceTemplates: ServiceTemplate[] = [
  {
    id: 'st1',
    organizationId: 'org1',
    name: 'Sunday Morning Worship Template',
    serviceType: 'sunday_morning',
    frequency: 'weekly',
    dayOfWeek: 'sunday',
    startTime: '09:00',
    endTime: '11:00',
    location: {
      type: 'physical',
      venue: 'Main Sanctuary',
      buildingId: 'bldg1',
      roomId: 'sanctuary',
    },
    ministryAssignments: [
      {
        id: 'ma1',
        ageMin: 0,
        ageMax: 3,
        ministry: 'Nursery',
        room: 'Room 101',
        capacity: 20,
        staffRequired: 3,
      },
      {
        id: 'ma2',
        ageMin: 4,
        ageMax: 12,
        ministry: "Children's Church",
        room: 'Room 201',
        capacity: 50,
        staffRequired: 5,
      },
      {
        id: 'ma3',
        ageMin: 13,
        ageMax: 17,
        ministry: 'Youth Service',
        room: 'Youth Hall',
        capacity: 40,
        staffRequired: 3,
      },
    ],
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'st2',
    organizationId: 'org1',
    name: 'Midweek Service Template',
    serviceType: 'midweek',
    frequency: 'weekly',
    dayOfWeek: 'wednesday',
    startTime: '18:30',
    endTime: '20:00',
    location: {
      type: 'physical',
      venue: 'Prayer Hall',
      buildingId: 'bldg1',
      roomId: 'prayer-hall',
    },
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
  },
];

export const mockServiceStats: ServiceAttendanceStats[] = [
  {
    serviceId: 's1',
    serviceName: 'Sunday Morning Worship',
    serviceType: 'sunday_morning',
    date: new Date().toISOString().split('T')[0],
    totalAttendance: 342,
    adultsCount: 210,
    childrenCount: 85,
    youthCount: 47,
    visitorsCount: 28,
    membersCount: 314,
    capacity: 500,
    capacityPercentage: 68.4,
  },
  {
    serviceId: 's2',
    serviceName: 'Sunday Evening Service',
    serviceType: 'sunday_evening',
    date: (() => {
      const d = new Date();
      d.setDate(d.getDate() - 7);
      return d.toISOString().split('T')[0];
    })(),
    totalAttendance: 167,
    adultsCount: 125,
    childrenCount: 22,
    youthCount: 20,
    visitorsCount: 15,
    membersCount: 152,
    capacity: 300,
    capacityPercentage: 55.7,
  },
  {
    serviceId: 's3',
    serviceName: 'Wednesday Prayer Meeting',
    serviceType: 'prayer_meeting',
    date: (() => {
      const d = new Date();
      const day = d.getDay();
      const diff = (3 - day + 7) % 7 || 7;
      d.setDate(d.getDate() - diff);
      return d.toISOString().split('T')[0];
    })(),
    totalAttendance: 78,
    adultsCount: 65,
    childrenCount: 5,
    youthCount: 8,
    visitorsCount: 3,
    membersCount: 75,
    capacity: 150,
    capacityPercentage: 52.0,
  },
  {
    serviceId: 's4',
    serviceName: 'Friday Bible Study',
    serviceType: 'bible_study',
    date: (() => {
      const d = new Date();
      const day = d.getDay();
      const diff = (5 - day + 7) % 7 || 7;
      d.setDate(d.getDate() - diff);
      return d.toISOString().split('T')[0];
    })(),
    totalAttendance: 54,
    adultsCount: 45,
    childrenCount: 3,
    youthCount: 6,
    visitorsCount: 8,
    membersCount: 46,
    capacity: 100,
    capacityPercentage: 54.0,
  },
  {
    serviceId: 's5',
    serviceName: 'Youth Night',
    serviceType: 'youth_service',
    date: (() => {
      const d = new Date();
      const day = d.getDay();
      const diff = (6 - day + 7) % 7 || 7;
      d.setDate(d.getDate() - diff);
      return d.toISOString().split('T')[0];
    })(),
    totalAttendance: 87,
    adultsCount: 12,
    childrenCount: 0,
    youthCount: 75,
    visitorsCount: 22,
    membersCount: 65,
    capacity: 120,
    capacityPercentage: 72.5,
  },
];
