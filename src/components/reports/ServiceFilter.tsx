/**
 * ChurchAfrica ChMS - Service Filter Component
 * Filter reports and analytics by service type
 */

import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Checkbox } from '../ui/checkbox';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../ui/popover';
import {
  Filter,
  X,
  Sun,
  Moon,
  Calendar,
  Sparkles,
  Heart,
  BookOpen,
  Users,
  Baby,
} from 'lucide-react';
import {
  Service,
  ServiceType,
  SERVICE_TYPE_LABELS,
  SERVICE_TYPE_COLORS,
} from '../../types/service';
import { cn } from '../ui/utils';

interface ServiceFilterProps {
  services: Service[];
  selectedServiceIds?: string[];
  selectedServiceTypes?: ServiceType[];
  onServiceIdsChange?: (serviceIds: string[]) => void;
  onServiceTypesChange?: (serviceTypes: ServiceType[]) => void;
  onClearFilters?: () => void;
  mode?: 'services' | 'types' | 'both'; // What to filter by
  compact?: boolean;
}

export function ServiceFilter({
  services,
  selectedServiceIds = [],
  selectedServiceTypes = [],
  onServiceIdsChange,
  onServiceTypesChange,
  onClearFilters,
  mode = 'both',
  compact = false,
}: ServiceFilterProps) {
  const iconMap: Record<ServiceType, any> = {
    sunday_morning: Sun,
    sunday_evening: Moon,
    midweek: Calendar,
    special_event: Sparkles,
    prayer_meeting: Heart,
    bible_study: BookOpen,
    youth_service: Users,
    children_service: Baby,
  };

  // Get unique service types from services
  const availableServiceTypes = React.useMemo(() => {
    const types = new Set(services.map(s => s.serviceType));
    return Array.from(types);
  }, [services]);

  // Group services by type
  const servicesByType = React.useMemo(() => {
    const grouped: Record<ServiceType, Service[]> = {} as any;
    services.forEach(service => {
      if (!grouped[service.serviceType]) {
        grouped[service.serviceType] = [];
      }
      grouped[service.serviceType].push(service);
    });
    return grouped;
  }, [services]);

  const handleServiceTypeToggle = (serviceType: ServiceType) => {
    if (!onServiceTypesChange) return;

    if (selectedServiceTypes.includes(serviceType)) {
      onServiceTypesChange(selectedServiceTypes.filter(t => t !== serviceType));
    } else {
      onServiceTypesChange([...selectedServiceTypes, serviceType]);
    }
  };

  const handleServiceToggle = (serviceId: string) => {
    if (!onServiceIdsChange) return;

    if (selectedServiceIds.includes(serviceId)) {
      onServiceIdsChange(selectedServiceIds.filter(id => id !== serviceId));
    } else {
      onServiceIdsChange([...selectedServiceIds, serviceId]);
    }
  };

  const handleSelectAllTypes = () => {
    if (!onServiceTypesChange) return;
    onServiceTypesChange(availableServiceTypes);
  };

  const handleClearAll = () => {
    if (onServiceIdsChange) onServiceIdsChange([]);
    if (onServiceTypesChange) onServiceTypesChange([]);
    if (onClearFilters) onClearFilters();
  };

  const hasFilters = selectedServiceIds.length > 0 || selectedServiceTypes.length > 0;

  // Compact mode - single dropdown
  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <Filter className="h-4 w-4" />
              Service Filter
              {hasFilters && (
                <Badge variant="secondary" className="ml-1">
                  {(selectedServiceIds.length || 0) + (selectedServiceTypes.length || 0)}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="end">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Filter Services</Label>
                {hasFilters && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClearAll}
                    className="h-auto p-1 text-xs"
                  >
                    Clear all
                  </Button>
                )}
              </div>

              {(mode === 'types' || mode === 'both') && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs text-muted-foreground">
                      Service Types
                    </Label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleSelectAllTypes}
                      className="h-auto p-1 text-xs"
                    >
                      Select all
                    </Button>
                  </div>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {availableServiceTypes.map(serviceType => {
                      const Icon = iconMap[serviceType];
                      return (
                        <div
                          key={serviceType}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={`type-${serviceType}`}
                            checked={selectedServiceTypes.includes(serviceType)}
                            onCheckedChange={() => handleServiceTypeToggle(serviceType)}
                          />
                          <Label
                            htmlFor={`type-${serviceType}`}
                            className="flex items-center gap-2 cursor-pointer flex-1"
                          >
                            <Icon className={cn("h-4 w-4", SERVICE_TYPE_COLORS[serviceType])} />
                            <span className="text-sm">
                              {SERVICE_TYPE_LABELS[serviceType]}
                            </span>
                          </Label>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {(mode === 'services' || mode === 'both') && (
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">
                    Specific Services
                  </Label>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {Object.entries(servicesByType).map(([serviceType, typeServices]) => (
                      <div key={serviceType} className="space-y-1">
                        <Label className="text-xs font-medium">
                          {SERVICE_TYPE_LABELS[serviceType as ServiceType]}
                        </Label>
                        {typeServices.map(service => (
                          <div
                            key={service.id}
                            className="flex items-center space-x-2 pl-4"
                          >
                            <Checkbox
                              id={`service-${service.id}`}
                              checked={selectedServiceIds.includes(service.id)}
                              onCheckedChange={() => handleServiceToggle(service.id)}
                            />
                            <Label
                              htmlFor={`service-${service.id}`}
                              className="text-sm cursor-pointer flex-1"
                            >
                              {service.name}
                              <span className="text-xs text-muted-foreground ml-2">
                                {new Date(service.scheduledDate).toLocaleDateString('en-GB', {
                                  day: 'numeric',
                                  month: 'short',
                                })}
                              </span>
                            </Label>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </PopoverContent>
        </Popover>

        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearAll}
            className="h-8 px-2"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    );
  }

  // Full mode - expanded card
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-[#1CE479]" />
              <Label>Service Filters</Label>
            </div>
            {hasFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearAll}
                className="gap-2"
              >
                <X className="h-4 w-4" />
                Clear Filters
              </Button>
            )}
          </div>

          {(mode === 'types' || mode === 'both') && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm">Service Types</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSelectAllTypes}
                  className="h-auto p-1 text-xs"
                >
                  Select all
                </Button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {availableServiceTypes.map(serviceType => {
                  const Icon = iconMap[serviceType];
                  const isSelected = selectedServiceTypes.includes(serviceType);
                  
                  return (
                    <button
                      key={serviceType}
                      onClick={() => handleServiceTypeToggle(serviceType)}
                      className={cn(
                        "flex items-center gap-2 p-3 rounded-lg border-2 transition-all text-left",
                        isSelected
                          ? "border-[#1CE479] bg-[#1CE479]/10"
                          : "border-transparent bg-[#1A1A20] hover:bg-[#1A1A20]/70"
                      )}
                    >
                      <Icon
                        className={cn(
                          "h-5 w-5",
                          isSelected ? "text-[#1CE479]" : SERVICE_TYPE_COLORS[serviceType]
                        )}
                      />
                      <span className="text-sm">
                        {SERVICE_TYPE_LABELS[serviceType]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {selectedServiceTypes.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {selectedServiceTypes.map(serviceType => (
                <Badge
                  key={serviceType}
                  variant="secondary"
                  className="gap-1"
                >
                  {SERVICE_TYPE_LABELS[serviceType]}
                  <button
                    onClick={() => handleServiceTypeToggle(serviceType)}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
