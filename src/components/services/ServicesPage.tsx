/**
 * ServicesPage - Organization-wide Services Overview
 * Displays all services across all campuses with filtering and views
 */

import React, { useState, useMemo } from 'react';
import { Service, ServiceType, ServiceStatus, SERVICE_TYPE_LABELS } from '../../types/service';
import { useUser } from '../../contexts/UserContext';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Badge } from '../ui/badge';
import { 
  Calendar, 
  List, 
  Plus, 
  Filter,
  Download,
  CalendarDays,
  MapPin,
  Clock,
  Users,
  Building2,
  Search,
} from 'lucide-react';
import { ServiceForm } from './ServiceForm';
import { ServicesListView } from './ServicesListView';
import { ServicesCalendarView } from './ServicesCalendarView';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../ui/popover';

interface ServicesPageProps {
  services: Service[];
  onServiceCreate: (service: Omit<Service, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onServiceUpdate: (id: string, updates: Partial<Service>) => void;
  onServiceDelete: (id: string) => void;
  organizationId: string;
  branches: { id: string; name: string; location: string }[];
  currentUserId: string;
}

export function ServicesPage({
  services,
  onServiceCreate,
  onServiceUpdate,
  onServiceDelete,
  organizationId,
  branches,
  currentUserId,
}: ServicesPageProps) {
  const { currentUser, hasPermission, getAccessibleBranchIds, isSuperAdmin } = useUser();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedView, setSelectedView] = useState<'list' | 'calendar'>('list');
  
  // Get accessible branches for current user
  const accessibleBranchIds = getAccessibleBranchIds(branches.map(b => b.id));
  const accessibleBranches = branches.filter(b => accessibleBranchIds.includes(b.id));
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBranch, setSelectedBranch] = useState<string>('all');
  const [selectedServiceType, setSelectedServiceType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [dateRange, setDateRange] = useState<'today' | 'week' | 'month' | 'all'>('week');

  // Filter services based on user permissions and all criteria
  const filteredServices = useMemo(() => {
    let filtered = [...services];

    // PERMISSION FILTER: Only show services from branches user has access to
    filtered = filtered.filter(service => accessibleBranchIds.includes(service.branchId));

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(service => 
        service.name.toLowerCase().includes(query) ||
        service.description?.toLowerCase().includes(query) ||
        service.location?.venue?.toLowerCase().includes(query)
      );
    }

    // Branch filter
    if (selectedBranch !== 'all') {
      filtered = filtered.filter(service => service.branchId === selectedBranch);
    }

    // Service type filter
    if (selectedServiceType !== 'all') {
      filtered = filtered.filter(service => service.serviceType === selectedServiceType);
    }

    // Status filter
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(service => service.status === selectedStatus);
    }

    // Date range filter
    if (dateRange !== 'all') {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      filtered = filtered.filter(service => {
        const serviceDate = new Date(service.scheduledDate);
        
        switch (dateRange) {
          case 'today':
            return serviceDate.toDateString() === today.toDateString();
          case 'week': {
            const weekFromNow = new Date(today);
            weekFromNow.setDate(weekFromNow.getDate() + 7);
            return serviceDate >= today && serviceDate <= weekFromNow;
          }
          case 'month': {
            const monthFromNow = new Date(today);
            monthFromNow.setMonth(monthFromNow.getMonth() + 1);
            return serviceDate >= today && serviceDate <= monthFromNow;
          }
          default:
            return true;
        }
      });
    }

    return filtered;
  }, [services, searchQuery, selectedBranch, selectedServiceType, selectedStatus, dateRange, accessibleBranchIds]);

  // Stats
  const stats = useMemo(() => {
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    
    return {
      total: filteredServices.length,
      today: filteredServices.filter(s => s.scheduledDate === today).length,
      thisWeek: filteredServices.filter(s => {
        const serviceDate = new Date(s.scheduledDate);
        const weekFromNow = new Date();
        weekFromNow.setDate(weekFromNow.getDate() + 7);
        return serviceDate >= now && serviceDate <= weekFromNow;
      }).length,
      scheduled: filteredServices.filter(s => s.status === 'scheduled').length,
      active: filteredServices.filter(s => s.status === 'active').length,
    };
  }, [filteredServices]);

  // Get branch name
  const getBranchName = (branchId: string) => {
    const branch = branches.find(b => b.id === branchId);
    return branch ? branch.name : branchId;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl">Services Overview</h1>
          <p className="text-muted-foreground mt-1">
            {isSuperAdmin 
              ? 'Manage services across all campuses' 
              : `Manage services for ${accessibleBranches.map(b => b.name).join(', ')}`
            }
          </p>
        </div>
        {hasPermission('services.create') && (
          <Button onClick={() => setShowCreateForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Service
          </Button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Services
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{stats.today}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              This Week
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{stats.thisWeek}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Scheduled
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{stats.scheduled}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Now
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-[#1CE479]">{stats.active}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filters
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchQuery('');
                setSelectedBranch('all');
                setSelectedServiceType('all');
                setSelectedStatus('all');
                setDateRange('week');
              }}
            >
              Clear All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* Search */}
            <div className="space-y-2">
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search services..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            {/* Branch Filter */}
            <div className="space-y-2">
              <Label>Campus</Label>
              <Select value={selectedBranch} onValueChange={setSelectedBranch}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    {isSuperAdmin ? 'All Campuses' : 'All Accessible'}
                  </SelectItem>
                  {accessibleBranches.map(branch => (
                    <SelectItem key={branch.id} value={branch.id}>
                      {branch.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Service Type Filter */}
            <div className="space-y-2">
              <Label>Service Type</Label>
              <Select value={selectedServiceType} onValueChange={setSelectedServiceType}>
                <SelectTrigger>
                  <SelectValue />
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
            </div>

            {/* Status Filter */}
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Date Range Filter */}
            <div className="space-y-2">
              <Label>Date Range</Label>
              <Select value={dateRange} onValueChange={(v) => setDateRange(v as typeof dateRange)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">Next 7 Days</SelectItem>
                  <SelectItem value="month">Next 30 Days</SelectItem>
                  <SelectItem value="all">All Dates</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* View Tabs */}
      <Card>
        <CardHeader>
          <Tabs value={selectedView} onValueChange={(v) => setSelectedView(v as typeof selectedView)}>
            <TabsList>
              <TabsTrigger value="list" className="flex items-center gap-2">
                <List className="h-4 w-4" />
                List View
              </TabsTrigger>
              <TabsTrigger value="calendar" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Calendar View
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          {selectedView === 'list' ? (
            <ServicesListView
              services={filteredServices}
              onServiceUpdate={onServiceUpdate}
              onServiceDelete={onServiceDelete}
              getBranchName={getBranchName}
              currentUserId={currentUserId}
            />
          ) : (
            <ServicesCalendarView
              services={filteredServices}
              onServiceUpdate={onServiceUpdate}
              getBranchName={getBranchName}
              currentUserId={currentUserId}
            />
          )}
        </CardContent>
      </Card>

      {/* Create Service Form Dialog */}
      {showCreateForm && (
        <ServiceForm
          open={showCreateForm}
          onClose={() => setShowCreateForm(false)}
          onSubmit={(data) => {
            onServiceCreate(data);
            setShowCreateForm(false);
          }}
          organizationId={organizationId}
          branchId={selectedBranch !== 'all' ? selectedBranch : branches[0]?.id || ''}
          currentUserId={currentUserId}
        />
      )}
    </div>
  );
}
