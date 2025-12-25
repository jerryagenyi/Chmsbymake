/**
 * ServicesCalendarView - Calendar grid view of services
 */

import React, { useState, useMemo } from 'react';
import { Service, getServiceTypeDisplayName } from '../../types/service';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card, CardContent } from '../ui/card';
import { 
  ChevronLeft, 
  ChevronRight,
  Clock,
  MapPin,
  Building2,
} from 'lucide-react';
import { ServiceForm } from './ServiceForm';

interface ServicesCalendarViewProps {
  services: Service[];
  onServiceUpdate: (id: string, updates: Partial<Service>) => void;
  getBranchName: (branchId: string) => string;
  currentUserId: string;
}

export function ServicesCalendarView({
  services,
  onServiceUpdate,
  getBranchName,
  currentUserId,
}: ServicesCalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  // Get calendar data
  const calendarData = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // First day of month
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    // Start from previous month's days to fill the week
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    // End at next month's days to fill the week
    const endDate = new Date(lastDay);
    endDate.setDate(endDate.getDate() + (6 - lastDay.getDay()));
    
    // Generate all days
    const days: Date[] = [];
    const currentDay = new Date(startDate);
    
    while (currentDay <= endDate) {
      days.push(new Date(currentDay));
      currentDay.setDate(currentDay.getDate() + 1);
    }
    
    return { days, firstDay, lastDay };
  }, [currentDate]);

  // Group services by date
  const servicesByDate = useMemo(() => {
    const map = new Map<string, Service[]>();
    
    services.forEach(service => {
      const dateKey = service.scheduledDate;
      if (!map.has(dateKey)) {
        map.set(dateKey, []);
      }
      map.get(dateKey)!.push(service);
    });
    
    // Sort services by time within each date
    map.forEach((serviceList) => {
      serviceList.sort((a, b) => a.startTime.localeCompare(b.startTime));
    });
    
    return map;
  }, [services]);

  // Navigation
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Check if date is today
  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  // Check if date is in current month
  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentDate.getMonth();
  };

  // Format month/year
  const monthYear = currentDate.toLocaleDateString('en-GB', {
    month: 'long',
    year: 'numeric',
  });

  // Get services for a date
  const getServicesForDate = (date: Date): Service[] => {
    const dateKey = date.toISOString().split('T')[0];
    return servicesByDate.get(dateKey) || [];
  };

  // Status color
  const getStatusColor = (status: Service['status']) => {
    switch (status) {
      case 'active':
        return 'bg-[#1CE479]';
      case 'scheduled':
        return 'bg-blue-500';
      case 'completed':
        return 'bg-gray-500';
      case 'cancelled':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-4">
      {/* Calendar Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">{monthYear}</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={goToToday}>
            Today
          </Button>
          <Button variant="outline" size="sm" onClick={goToPreviousMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={goToNextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="border rounded-lg overflow-hidden">
        {/* Day Headers */}
        <div className="grid grid-cols-7 border-b bg-muted/50">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div
              key={day}
              className="p-2 text-center text-sm font-medium text-muted-foreground"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7">
          {calendarData.days.map((date, index) => {
            const dayServices = getServicesForDate(date);
            const isCurrentMonthDay = isCurrentMonth(date);
            const isTodayDate = isToday(date);

            return (
              <div
                key={index}
                className={`min-h-[120px] border-r border-b p-2 ${
                  !isCurrentMonthDay ? 'bg-muted/20' : ''
                } ${isTodayDate ? 'bg-[#1CE479]/10' : ''}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`text-sm ${
                      !isCurrentMonthDay ? 'text-muted-foreground' : ''
                    } ${isTodayDate ? 'font-bold text-[#1CE479]' : ''}`}
                  >
                    {date.getDate()}
                  </span>
                  {dayServices.length > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      {dayServices.length}
                    </Badge>
                  )}
                </div>

                {/* Services for this day */}
                <div className="space-y-1">
                  {dayServices.slice(0, 3).map((service) => (
                    <button
                      key={service.id}
                      onClick={() => setSelectedService(service)}
                      className="w-full text-left p-1.5 rounded text-xs hover:bg-muted transition-colors"
                    >
                      <div className="flex items-start gap-1.5">
                        <div
                          className={`w-1.5 h-1.5 rounded-full mt-1 flex-shrink-0 ${getStatusColor(
                            service.status
                          )}`}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium truncate">{service.name}</div>
                          <div className="text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {service.startTime}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                  {dayServices.length > 3 && (
                    <div className="text-xs text-muted-foreground text-center py-1">
                      +{dayServices.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Service Details Dialog */}
      {selectedService && (
        <ServiceForm
          open={!!selectedService}
          onClose={() => setSelectedService(null)}
          onSubmit={(data) => {
            onServiceUpdate(selectedService.id, data);
            setSelectedService(null);
          }}
          service={selectedService}
          organizationId={selectedService.organizationId}
          branchId={selectedService.branchId}
          currentUserId={currentUserId}
        />
      )}
    </div>
  );
}
