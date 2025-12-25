/**
 * ChurchAfrica ChMS - Service List
 * List view of all church services with filtering and actions
 */

import React, { useState } from 'react';
import {
  Service,
  ServiceType,
  SERVICE_TYPE_LABELS,
  SERVICE_TYPE_COLORS,
  SERVICE_STATUS_LABELS,
  formatServiceTime,
  isServiceActive,
} from '../../types/service';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Card, CardContent } from '../ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import {
  Edit,
  Trash2,
  Copy,
  MoreVertical,
  Search,
  Calendar,
  MapPin,
  Users,
  Clock,
  Filter,
  Play,
} from 'lucide-react';
import { cn } from '../ui/utils';

interface ServiceListProps {
  services: Service[];
  onEdit: (service: Service) => void;
  onDelete: (id: string) => void;
  onDuplicate: (service: Service) => void;
}

export function ServiceList({
  services,
  onEdit,
  onDelete,
  onDuplicate,
}: ServiceListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<ServiceType | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'scheduled' | 'active' | 'completed' | 'cancelled'>('all');

  // Filter services
  const filteredServices = services.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         service.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || service.serviceType === filterType;
    const matchesStatus = filterStatus === 'all' || service.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  // Sort by date and time
  const sortedServices = [...filteredServices].sort((a, b) => {
    const dateCompare = a.scheduledDate.localeCompare(b.scheduledDate);
    if (dateCompare !== 0) return dateCompare;
    return a.startTime.localeCompare(b.startTime);
  });

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search services..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={filterType} onValueChange={(value) => setFilterType(value as ServiceType | 'all')}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {Object.entries(SERVICE_TYPE_LABELS).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filterStatus} onValueChange={(value: any) => setFilterStatus(value)}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="scheduled">Scheduled</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Results Count */}
      <div className="text-sm text-muted-foreground">
        Showing {sortedServices.length} of {services.length} services
      </div>

      {/* Service List */}
      <div className="space-y-3">
        {sortedServices.length === 0 ? (
          <Card>
            <CardContent className="pt-12 pb-12 text-center">
              <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50 text-muted-foreground" />
              <p className="text-muted-foreground">
                {services.length === 0 
                  ? 'No services created yet' 
                  : 'No services match your filters'}
              </p>
            </CardContent>
          </Card>
        ) : (
          sortedServices.map(service => (
            <ServiceCard
              key={service.id}
              service={service}
              onEdit={() => onEdit(service)}
              onDelete={() => onDelete(service.id)}
              onDuplicate={() => onDuplicate(service)}
            />
          ))
        )}
      </div>
    </div>
  );
}

// Individual Service Card
interface ServiceCardProps {
  service: Service;
  onEdit: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
}

function ServiceCard({ service, onEdit, onDelete, onDuplicate }: ServiceCardProps) {
  const active = isServiceActive(service);
  const serviceDate = new Date(service.scheduledDate);
  const isPast = serviceDate < new Date() && service.status === 'completed';

  return (
    <Card className={cn(
      "transition-all hover:shadow-lg",
      active && "border-[#1CE479] bg-[#1CE479]/5"
    )}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          {/* Service Info */}
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-3 flex-wrap">
              <h3 className="font-semibold text-lg">{service.name}</h3>
              {active && (
                <Badge className="bg-[#1CE479] text-[#0A0A0F]">
                  <Play className="h-3 w-3 mr-1" />
                  Live Now
                </Badge>
              )}
              <Badge 
                variant={
                  service.status === 'active' ? 'default' :
                  service.status === 'completed' ? 'secondary' :
                  service.status === 'cancelled' ? 'destructive' :
                  'outline'
                }
                className={cn(
                  service.status === 'active' && "bg-[#1CE479] text-[#0A0A0F]"
                )}
              >
                {SERVICE_STATUS_LABELS[service.status]}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {SERVICE_TYPE_LABELS[service.serviceType]}
              </Badge>
            </div>

            {service.description && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {service.description}
              </p>
            )}

            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>
                  {serviceDate.toLocaleDateString('en-GB', { 
                    weekday: 'short',
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  })}
                </span>
              </div>

              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{formatServiceTime(service)}</span>
              </div>

              {service.location?.venue && (
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{service.location.venue}</span>
                </div>
              )}

              {service.capacity && (
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>Capacity: {service.capacity}</span>
                </div>
              )}
            </div>

            {service.notes && (
              <p className="text-xs text-muted-foreground italic">
                Note: {service.notes}
              </p>
            )}
          </div>

          {/* Actions */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onEdit}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Service
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onDuplicate}>
                <Copy className="h-4 w-4 mr-2" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={onDelete}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
}
