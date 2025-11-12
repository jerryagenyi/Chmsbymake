/**
 * ChurchAfrica ChMS - Attendance Service Selector
 * Bridge component that integrates ServiceSelectorEnhanced with attendance tracking
 */

import React from 'react';
import { Service as ChurchService } from '../../types/service';
import { Service as AttendanceService } from '../../types/attendance';
import { ServiceSelectorEnhanced } from '../services/ServiceSelectorEnhanced';
import { mockServices as mockChurchServices } from '../../lib/mock-service-data';

interface AttendanceServiceSelectorProps {
  services: AttendanceService[];
  selectedServiceId?: string;
  onSelectService: (service: AttendanceService) => void;
  onCreateService?: () => void;
}

/**
 * Converts new Church Service to old Attendance Service format
 * This is a temporary bridge until we fully migrate to new service types
 */
function convertToAttendanceService(churchService: ChurchService): AttendanceService {
  return {
    id: churchService.id,
    name: churchService.name,
    date: churchService.scheduledDate,
    startTime: churchService.startTime,
    endTime: churchService.endTime,
    type: mapServiceType(churchService.serviceType),
    location: churchService.location?.venue,
    expectedAttendance: churchService.expectedAttendance,
    status: churchService.status === 'active' ? 'active' : 
            churchService.status === 'completed' ? 'completed' : 'scheduled',
  };
}

/**
 * Maps new service types to old attendance service types
 */
function mapServiceType(serviceType: ChurchService['serviceType']): AttendanceService['type'] {
  const mapping: Record<string, AttendanceService['type']> = {
    sunday_morning: 'sunday_first',
    sunday_evening: 'sunday_second',
    midweek: 'midweek',
    prayer_meeting: 'prayer',
    bible_study: 'midweek',
    youth_service: 'youth',
    children_service: 'children',
    special_event: 'special',
  };
  
  return mapping[serviceType] || 'special';
}

export function AttendanceServiceSelector({
  services,
  selectedServiceId,
  onSelectService,
  onCreateService,
}: AttendanceServiceSelectorProps) {
  // Use mock church services for now (in production, this would come from a real data source)
  const churchServices = mockChurchServices;

  const handleServiceSelect = (churchService: ChurchService) => {
    // Convert to attendance service format and notify parent
    const attendanceService = convertToAttendanceService(churchService);
    onSelectService(attendanceService);
  };

  return (
    <ServiceSelectorEnhanced
      services={churchServices}
      selectedServiceId={selectedServiceId}
      onServiceSelect={handleServiceSelect}
      autoDetect={true}
      showAllServices={false}
    />
  );
}
