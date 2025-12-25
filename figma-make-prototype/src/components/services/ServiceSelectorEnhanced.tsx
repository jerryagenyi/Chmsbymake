/**
 * ChurchAfrica ChMS - Service Selector Enhanced
 * Intelligent service selection for check-in flow
 */

import React, { useState, useEffect } from 'react';
import {
  Service,
  SERVICE_TYPE_LABELS,
  SERVICE_TYPE_ICONS,
  SERVICE_TYPE_COLORS,
  formatServiceTime,
  isServiceActive,
  getCurrentActiveService,
  getNextService,
  getTodayServices,
} from '../../types/service';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import {
  Calendar,
  Clock,
  MapPin,
  ChevronRight,
  Check,
  AlertCircle,
  Play,
  Sun,
  Moon,
  Heart,
  BookOpen,
  Baby,
  Sparkles,
  Users,
} from 'lucide-react';
import { cn } from '../ui/utils';

interface ServiceSelectorEnhancedProps {
  services: Service[];
  selectedServiceId?: string;
  onServiceSelect: (service: Service) => void;
  autoDetect?: boolean;
  showAllServices?: boolean;
  className?: string;
}

export function ServiceSelectorEnhanced({
  services,
  selectedServiceId,
  onServiceSelect,
  autoDetect = true,
  showAllServices = false,
  className,
}: ServiceSelectorEnhancedProps) {
  const [selectedId, setSelectedId] = useState<string | undefined>(selectedServiceId);

  // Auto-detect current service
  useEffect(() => {
    if (autoDetect && !selectedId && services.length > 0) {
      const activeService = getCurrentActiveService(services);
      if (activeService) {
        setSelectedId(activeService.id);
        onServiceSelect(activeService);
      } else {
        // If no active service, select next upcoming service
        const nextService = getNextService(services);
        if (nextService) {
          setSelectedId(nextService.id);
          onServiceSelect(nextService);
        }
      }
    }
  }, [services, autoDetect, selectedId, onServiceSelect]);

  const handleSelect = (serviceId: string) => {
    const service = services.find(s => s.id === serviceId);
    if (service) {
      setSelectedId(serviceId);
      onServiceSelect(service);
    }
  };

  // Get services to display
  const todayServices = getTodayServices(services);
  const displayServices = showAllServices ? services : todayServices;
  const activeService = getCurrentActiveService(services);

  if (displayServices.length === 0) {
    return (
      <Card className={className}>
        <CardContent className="pt-6 pb-6">
          <div className="flex items-start gap-3 text-muted-foreground">
            <AlertCircle className="h-5 w-5 mt-0.5" />
            <div>
              <p className="font-medium">No Services Available</p>
              <p className="text-sm">
                {showAllServices 
                  ? 'No services have been created yet.'
                  : 'No services scheduled for today.'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // If only one service and auto-detect is on, show compact view
  if (displayServices.length === 1 && autoDetect) {
    const service = displayServices[0];
    const isActive = isServiceActive(service);

    return (
      <Card className={cn(
        "transition-all",
        isActive && "border-[#1CE479] bg-[#1CE479]/5",
        className
      )}>
        <CardContent className="pt-6 pb-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className={cn(
                "h-10 w-10 rounded-full flex items-center justify-center",
                isActive ? "bg-[#1CE479]/20" : "bg-[#1A1A20]"
              )}>
                {isActive ? (
                  <Play className="h-5 w-5 text-[#1CE479]" />
                ) : (
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                )}
              </div>
              <div>
                <div className="font-medium">{service.name}</div>
                <div className="text-sm text-muted-foreground space-y-1">
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
              </div>
            </div>
            {isActive && (
              <Badge className="bg-[#1CE479] text-[#0A0A0F]">
                <div className="animate-pulse h-2 w-2 rounded-full bg-[#0A0A0F] mr-2" />
                Active
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Multiple services - show selection interface
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Select Service
        </CardTitle>
        <CardDescription>
          {activeService 
            ? 'Service detected - you can change if needed'
            : 'Choose the service for check-in'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup value={selectedId} onValueChange={handleSelect}>
          <div className="space-y-3">
            {displayServices.map(service => (
              <ServiceOption
                key={service.id}
                service={service}
                isSelected={selectedId === service.id}
                isActive={isServiceActive(service)}
                onSelect={() => handleSelect(service.id)}
              />
            ))}
          </div>
        </RadioGroup>

        {!showAllServices && todayServices.length < services.length && (
          <Button
            variant="ghost"
            size="sm"
            className="mt-4 w-full"
            onClick={() => {
              // This would toggle to show all services - parent component handles this
            }}
          >
            View All Services
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

// Individual Service Option Component
interface ServiceOptionProps {
  service: Service;
  isSelected: boolean;
  isActive: boolean;
  onSelect: () => void;
}

function ServiceOption({ service, isSelected, isActive, onSelect }: ServiceOptionProps) {
  const iconMap: Record<string, any> = {
    sunday_morning: Sun,
    sunday_evening: Moon,
    midweek: Calendar,
    special_event: Sparkles,
    prayer_meeting: Heart,
    bible_study: BookOpen,
    youth_service: Users,
    children_service: Baby,
  };

  const Icon = iconMap[service.serviceType] || Calendar;

  return (
    <div
      onClick={onSelect}
      className={cn(
        "flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all",
        isSelected 
          ? "border-[#1CE479] bg-[#1CE479]/5" 
          : "border-transparent bg-[#1A1A20] hover:bg-[#1A1A20]/70",
        isActive && !isSelected && "border-[#1CE479]/30"
      )}
    >
      <RadioGroupItem value={service.id} id={service.id} className="sr-only" />
      
      {/* Icon */}
      <div className={cn(
        "h-12 w-12 rounded-full flex items-center justify-center flex-shrink-0",
        isSelected ? "bg-[#1CE479]/20" : "bg-[#0A0A0F]"
      )}>
        <Icon className={cn(
          "h-6 w-6",
          isSelected ? "text-[#1CE479]" : SERVICE_TYPE_COLORS[service.serviceType]
        )} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-1">
          <Label htmlFor={service.id} className="font-medium cursor-pointer">
            {service.name}
          </Label>
          {isActive && (
            <Badge className="bg-[#1CE479] text-[#0A0A0F]" variant="default">
              <div className="animate-pulse h-1.5 w-1.5 rounded-full bg-[#0A0A0F] mr-1.5" />
              Active
            </Badge>
          )}
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

          {service.expectedAttendance && (
            <div className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              <span>~{service.expectedAttendance} expected</span>
            </div>
          )}
        </div>
      </div>

      {/* Selected Indicator */}
      {isSelected && (
        <div className="h-6 w-6 rounded-full bg-[#1CE479] flex items-center justify-center flex-shrink-0">
          <Check className="h-4 w-4 text-[#0A0A0F]" />
        </div>
      )}
    </div>
  );
}

// Compact Service Selector (for minimal UI contexts)
interface ServiceSelectorCompactProps {
  services: Service[];
  selectedServiceId?: string;
  onServiceSelect: (service: Service) => void;
  autoDetect?: boolean;
}

export function ServiceSelectorCompact({
  services,
  selectedServiceId,
  onServiceSelect,
  autoDetect = true,
}: ServiceSelectorCompactProps) {
  const [selectedId, setSelectedId] = useState<string | undefined>(selectedServiceId);

  useEffect(() => {
    if (autoDetect && !selectedId && services.length > 0) {
      const activeService = getCurrentActiveService(services);
      if (activeService) {
        setSelectedId(activeService.id);
        onServiceSelect(activeService);
      }
    }
  }, [services, autoDetect, selectedId, onServiceSelect]);

  const selectedService = services.find(s => s.id === selectedId);

  if (!selectedService) {
    return (
      <div className="text-sm text-muted-foreground flex items-center gap-2">
        <AlertCircle className="h-4 w-4" />
        No service selected
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-sm">
      <Calendar className="h-4 w-4 text-muted-foreground" />
      <span className="font-medium">{selectedService.name}</span>
      <span className="text-muted-foreground">•</span>
      <span className="text-muted-foreground">{formatServiceTime(selectedService)}</span>
      {isServiceActive(selectedService) && (
        <Badge className="bg-[#1CE479] text-[#0A0A0F]" variant="default">
          Active
        </Badge>
      )}
    </div>
  );
}
