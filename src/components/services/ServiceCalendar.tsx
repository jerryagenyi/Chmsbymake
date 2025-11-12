/**
 * ChurchAfrica ChMS - Service Calendar
 * Calendar view of services (simplified for MVP)
 */

import React from 'react';
import { Service, SERVICE_TYPE_LABELS, formatServiceTime } from '../../types/service';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { cn } from '../ui/utils';

interface ServiceCalendarProps {
  services: Service[];
  onServiceClick: (service: Service) => void;
}

export function ServiceCalendar({ services, onServiceClick }: ServiceCalendarProps) {
  // Group services by date
  const servicesByDate = services.reduce((acc, service) => {
    const date = service.scheduledDate;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(service);
    return acc;
  }, {} as Record<string, Service[]>);

  // Sort dates
  const sortedDates = Object.keys(servicesByDate).sort();

  // Get upcoming dates (next 30 days)
  const today = new Date();
  const thirtyDaysFromNow = new Date(today);
  thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

  const upcomingDates = sortedDates.filter(date => {
    const serviceDate = new Date(date);
    return serviceDate >= today && serviceDate <= thirtyDaysFromNow;
  });

  if (upcomingDates.length === 0) {
    return (
      <Card>
        <CardContent className="pt-12 pb-12 text-center">
          <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50 text-muted-foreground" />
          <p className="text-muted-foreground">
            No services scheduled in the next 30 days
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {upcomingDates.map(date => {
        const dateServices = servicesByDate[date].sort((a, b) => 
          a.startTime.localeCompare(b.startTime)
        );
        const serviceDate = new Date(date);
        const isToday = date === today.toISOString().split('T')[0];
        const isTomorrow = date === new Date(today.getTime() + 86400000).toISOString().split('T')[0];

        return (
          <Card key={date} className={cn(
            isToday && "border-[#1CE479] bg-[#1CE479]/5"
          )}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5" />
                  <span>
                    {serviceDate.toLocaleDateString('en-GB', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </span>
                  {isToday && (
                    <Badge className="bg-[#1CE479] text-[#0A0A0F]">Today</Badge>
                  )}
                  {isTomorrow && (
                    <Badge variant="outline">Tomorrow</Badge>
                  )}
                </div>
                <Badge variant="secondary">
                  {dateServices.length} {dateServices.length === 1 ? 'service' : 'services'}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {dateServices.map(service => (
                  <div
                    key={service.id}
                    onClick={() => onServiceClick(service)}
                    className="p-4 bg-[#1A1A20] rounded-lg hover:bg-[#1A1A20]/70 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-medium">{service.name}</h4>
                          <Badge variant="outline" className="text-xs">
                            {SERVICE_TYPE_LABELS[service.serviceType]}
                          </Badge>
                        </div>

                        <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{formatServiceTime(service)}</span>
                          </div>

                          {service.location?.venue && (
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              <span>{service.location.venue}</span>
                            </div>
                          )}
                        </div>

                        {service.description && (
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {service.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
