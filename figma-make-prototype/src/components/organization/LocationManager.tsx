/**
 * ChurchAfrica ChMS - Location Manager
 * Comprehensive CRUD interface for managing church locations, buildings, and rooms
 */

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { Switch } from '../ui/switch';
import { ScrollArea } from '../ui/scroll-area';
import { Separator } from '../ui/separator';
import {
  Building2,
  MapPin,
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  Users,
  TrendingUp,
  AlertCircle,
  Check,
  X,
  Map,
  Calendar,
  Eye,
  Settings,
  ChevronRight,
  Phone,
  Mail,
  Accessibility,
  Wind,
  Monitor,
  Volume2,
  Car,
  Home,
  Church,
} from 'lucide-react';
import {
  Location,
  LocationStatus,
  LocationType,
  LOCATION_TYPE_LABELS,
  LOCATION_TYPE_ICONS,
  LOCATION_STATUS_LABELS,
  LOCATION_STATUS_COLORS,
  formatLocationAddress,
  getSubLocations,
  getLocationCapacityStatus,
} from '../../types/location';
import { useOrganization } from '../../contexts/OrganizationContext';
import { toast } from 'sonner@2.0.3';

interface LocationManagerProps {
  locations: Location[];
  onCreateLocation?: (location: Partial<Location>) => void;
  onUpdateLocation?: (id: string, updates: Partial<Location>) => void;
  onDeleteLocation?: (id: string) => void;
}

type ViewMode = 'grid' | 'list' | 'hierarchy';

export function LocationManager({
  locations,
  onCreateLocation,
  onUpdateLocation,
  onDeleteLocation,
}: LocationManagerProps) {
  const { organization, branch } = useOrganization();
  
  // State
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<LocationStatus | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<LocationType | 'all'>('all');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [formData, setFormData] = useState<Partial<Location>>({});
  
  // Filtered locations
  const filteredLocations = useMemo(() => {
    return locations.filter(location => {
      // Filter by branch
      if (location.branchId !== branch.id) return false;
      
      // Filter by search
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesName = location.name.toLowerCase().includes(query);
        const matchesAddress = location.address?.toLowerCase().includes(query);
        const matchesCity = location.city?.toLowerCase().includes(query);
        if (!matchesName && !matchesAddress && !matchesCity) return false;
      }
      
      // Filter by status
      if (statusFilter !== 'all' && location.status !== statusFilter) return false;
      
      // Filter by type
      if (typeFilter !== 'all' && location.type !== typeFilter) return false;
      
      return true;
    });
  }, [locations, branch.id, searchQuery, statusFilter, typeFilter]);
  
  // Main locations (not sub-locations)
  const mainLocations = useMemo(() => {
    return filteredLocations.filter(loc => !loc.parentLocationId);
  }, [filteredLocations]);
  
  // Statistics
  const stats = useMemo(() => {
    const branchLocations = locations.filter(loc => loc.branchId === branch.id);
    return {
      total: branchLocations.length,
      active: branchLocations.filter(loc => loc.status === 'active').length,
      totalCapacity: branchLocations.reduce((sum, loc) => sum + (loc.capacity || 0), 0),
      avgUtilization: Math.round(
        branchLocations.reduce((sum, loc) => sum + (loc.averageUtilization || 0), 0) / branchLocations.length
      ),
    };
  }, [locations, branch.id]);
  
  // Handlers
  const handleCreate = () => {
    setFormData({
      organizationId: organization.id,
      branchId: branch.id,
      status: 'active',
      type: 'main_sanctuary',
      hasAirConditioning: false,
      hasProjector: false,
      hasSoundSystem: false,
      hasParking: false,
      isWheelchairAccessible: false,
      hasSubLocations: false,
    });
    setShowCreateDialog(true);
  };
  
  const handleEdit = (location: Location) => {
    setSelectedLocation(location);
    setFormData(location);
    setShowEditDialog(true);
  };
  
  const handleDelete = (location: Location) => {
    setSelectedLocation(location);
    setShowDeleteDialog(true);
  };
  
  const handleView = (location: Location) => {
    setSelectedLocation(location);
    setShowDetailsDialog(true);
  };
  
  const handleSaveCreate = () => {
    if (!formData.name) {
      toast.error('Please enter a location name');
      return;
    }
    
    const newLocation: Partial<Location> = {
      ...formData,
      id: `loc-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'current-user-id',
    };
    
    onCreateLocation?.(newLocation);
    toast.success(`Location "${formData.name}" created successfully`);
    setShowCreateDialog(false);
    setFormData({});
  };
  
  const handleSaveEdit = () => {
    if (!selectedLocation || !formData.name) {
      toast.error('Please enter a location name');
      return;
    }
    
    const updates: Partial<Location> = {
      ...formData,
      updatedAt: new Date().toISOString(),
      updatedBy: 'current-user-id',
    };
    
    onUpdateLocation?.(selectedLocation.id, updates);
    toast.success(`Location "${formData.name}" updated successfully`);
    setShowEditDialog(false);
    setSelectedLocation(null);
    setFormData({});
  };
  
  const handleConfirmDelete = () => {
    if (!selectedLocation) return;
    
    // Check for sub-locations
    const subLocs = getSubLocations(selectedLocation.id, locations);
    if (subLocs.length > 0) {
      toast.error(`Cannot delete location with ${subLocs.length} sub-location(s). Delete sub-locations first.`);
      return;
    }
    
    onDeleteLocation?.(selectedLocation.id);
    toast.success(`Location "${selectedLocation.name}" deleted successfully`);
    setShowDeleteDialog(false);
    setSelectedLocation(null);
  };
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="font-medium text-foreground">Location Management</h2>
        <p className="text-sm text-muted-foreground">
          Manage church locations, buildings, and rooms for {branch.name}
        </p>
      </div>
      
      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Locations</p>
                <p className="text-2xl font-semibold">{stats.total}</p>
              </div>
              <Building2 className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-2xl font-semibold text-[#1CE479]">{stats.active}</p>
              </div>
              <Check className="h-8 w-8 text-[#1CE479]" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Capacity</p>
                <p className="text-2xl font-semibold">{stats.totalCapacity.toLocaleString()}</p>
              </div>
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg. Utilisation</p>
                <p className="text-2xl font-semibold">{stats.avgUtilization}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Toolbar */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search locations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            {/* Filters and Actions */}
            <div className="flex items-center gap-2">
              {/* Status Filter */}
              <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  {Object.entries(LOCATION_STATUS_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {/* Type Filter */}
              <Select value={typeFilter} onValueChange={(value: any) => setTypeFilter(value)}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {Object.entries(LOCATION_TYPE_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {/* View Mode */}
              <div className="flex border rounded-md">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-r-none"
                >
                  Grid
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-none border-x"
                >
                  List
                </Button>
                <Button
                  variant={viewMode === 'hierarchy' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('hierarchy')}
                  className="rounded-l-none"
                >
                  Tree
                </Button>
              </div>
              
              {/* Create Button */}
              <Button onClick={handleCreate} className="gap-2">
                <Plus className="h-4 w-4" />
                Add Location
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Locations Display */}
      {filteredLocations.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              {searchQuery || statusFilter !== 'all' || typeFilter !== 'all'
                ? 'No locations match your filters'
                : 'No locations yet. Create your first location to get started.'}
            </p>
            {!searchQuery && statusFilter === 'all' && typeFilter === 'all' && (
              <Button onClick={handleCreate} className="mt-4 gap-2">
                <Plus className="h-4 w-4" />
                Create First Location
              </Button>
            )}
          </CardContent>
        </Card>
      ) : viewMode === 'grid' ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredLocations.map((location) => (
            <LocationCard
              key={location.id}
              location={location}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onView={handleView}
              subLocations={getSubLocations(location.id, locations)}
            />
          ))}
        </div>
      ) : viewMode === 'list' ? (
        <Card>
          <ScrollArea className="h-[600px]">
            <div className="divide-y">
              {filteredLocations.map((location) => (
                <LocationListItem
                  key={location.id}
                  location={location}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onView={handleView}
                  subLocations={getSubLocations(location.id, locations)}
                />
              ))}
            </div>
          </ScrollArea>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-6">
            <ScrollArea className="h-[600px]">
              <div className="space-y-4">
                {mainLocations.map((location) => (
                  <LocationHierarchyItem
                    key={location.id}
                    location={location}
                    subLocations={getSubLocations(location.id, filteredLocations)}
                    allLocations={filteredLocations}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onView={handleView}
                  />
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
      
      {/* Create Dialog */}
      <LocationFormDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        title="Create New Location"
        description="Add a new location to your church campus"
        formData={formData}
        onFormDataChange={setFormData}
        onSave={handleSaveCreate}
        locations={locations}
      />
      
      {/* Edit Dialog */}
      <LocationFormDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        title="Edit Location"
        description="Update location details"
        formData={formData}
        onFormDataChange={setFormData}
        onSave={handleSaveEdit}
        locations={locations}
      />
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Location</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{selectedLocation?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Details Dialog */}
      {selectedLocation && (
        <LocationDetailsDialog
          location={selectedLocation}
          open={showDetailsDialog}
          onOpenChange={setShowDetailsDialog}
          onEdit={() => {
            setShowDetailsDialog(false);
            handleEdit(selectedLocation);
          }}
          subLocations={getSubLocations(selectedLocation.id, locations)}
        />
      )}
    </div>
  );
}

// Location Card Component
function LocationCard({
  location,
  onEdit,
  onDelete,
  onView,
  subLocations,
}: {
  location: Location;
  onEdit: (location: Location) => void;
  onDelete: (location: Location) => void;
  onView: (location: Location) => void;
  subLocations: Location[];
}) {
  const IconComponent = LOCATION_TYPE_ICONS[location.type];
  const statusColors = LOCATION_STATUS_COLORS[location.status];
  
  return (
    <Card className="group hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <IconComponent className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base">{location.name}</CardTitle>
              <CardDescription className="text-xs">
                {LOCATION_TYPE_LABELS[location.type]}
              </CardDescription>
            </div>
          </div>
          <Badge variant="secondary" className={statusColors}>
            {LOCATION_STATUS_LABELS[location.status]}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Capacity */}
        {location.capacity && (
          <div className="flex items-center gap-2 text-sm">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Capacity:</span>
            <span className="font-medium">{location.capacity.toLocaleString()}</span>
          </div>
        )}
        
        {/* Address */}
        {(location.address || location.city) && (
          <div className="flex items-start gap-2 text-sm">
            <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
            <span className="text-muted-foreground line-clamp-2">
              {formatLocationAddress(location)}
            </span>
          </div>
        )}
        
        {/* Features */}
        <div className="flex flex-wrap gap-1">
          {location.hasAirConditioning && (
            <Badge variant="outline" className="text-xs gap-1">
              <Wind className="h-3 w-3" /> A/C
            </Badge>
          )}
          {location.hasProjector && (
            <Badge variant="outline" className="text-xs gap-1">
              <Monitor className="h-3 w-3" /> Projector
            </Badge>
          )}
          {location.hasSoundSystem && (
            <Badge variant="outline" className="text-xs gap-1">
              <Volume2 className="h-3 w-3" /> Sound
            </Badge>
          )}
          {location.isWheelchairAccessible && (
            <Badge variant="outline" className="text-xs gap-1">
              <Accessibility className="h-3 w-3" /> Accessible
            </Badge>
          )}
        </div>
        
        {/* Sub-locations */}
        {subLocations.length > 0 && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Building2 className="h-4 w-4" />
            <span>{subLocations.length} sub-location{subLocations.length !== 1 ? 's' : ''}</span>
          </div>
        )}
        
        {/* Actions */}
        <div className="flex gap-2 pt-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button variant="outline" size="sm" onClick={() => onView(location)} className="flex-1 gap-2">
            <Eye className="h-4 w-4" />
            View
          </Button>
          <Button variant="outline" size="sm" onClick={() => onEdit(location)} className="gap-2">
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(location)}
            className="gap-2 hover:bg-destructive hover:text-destructive-foreground"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Location List Item Component
function LocationListItem({
  location,
  onEdit,
  onDelete,
  onView,
  subLocations,
}: {
  location: Location;
  onEdit: (location: Location) => void;
  onDelete: (location: Location) => void;
  onView: (location: Location) => void;
  subLocations: Location[];
}) {
  const IconComponent = LOCATION_TYPE_ICONS[location.type];
  const statusColors = LOCATION_STATUS_COLORS[location.status];
  
  return (
    <div className="p-4 hover:bg-accent/50 transition-colors group">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          <div className="p-2 bg-primary/10 rounded-lg">
            <IconComponent className="h-5 w-5 text-primary" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-1">
              <h3 className="font-medium truncate">{location.name}</h3>
              <Badge variant="secondary" className={`${statusColors} text-xs`}>
                {LOCATION_STATUS_LABELS[location.status]}
              </Badge>
              {subLocations.length > 0 && (
                <Badge variant="outline" className="text-xs">
                  {subLocations.length} sub-location{subLocations.length !== 1 ? 's' : ''}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>{LOCATION_TYPE_LABELS[location.type]}</span>
              {location.capacity && (
                <>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {location.capacity.toLocaleString()}
                  </span>
                </>
              )}
              {(location.address || location.city) && (
                <>
                  <span>•</span>
                  <span className="flex items-center gap-1 truncate">
                    <MapPin className="h-3 w-3" />
                    {location.city || location.address}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button variant="ghost" size="sm" onClick={() => onView(location)}>
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onEdit(location)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(location)}
            className="hover:bg-destructive hover:text-destructive-foreground"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

// Location Hierarchy Item Component
function LocationHierarchyItem({
  location,
  subLocations,
  allLocations,
  onEdit,
  onDelete,
  onView,
  level = 0,
}: {
  location: Location;
  subLocations: Location[];
  allLocations: Location[];
  onEdit: (location: Location) => void;
  onDelete: (location: Location) => void;
  onView: (location: Location) => void;
  level?: number;
}) {
  const [isExpanded, setIsExpanded] = useState(true);
  const IconComponent = LOCATION_TYPE_ICONS[location.type];
  const statusColors = LOCATION_STATUS_COLORS[location.status];
  
  return (
    <div style={{ paddingLeft: `${level * 24}px` }}>
      <div className="flex items-center justify-between p-3 hover:bg-accent/50 rounded-lg transition-colors group">
        <div className="flex items-center gap-3 flex-1">
          {subLocations.length > 0 ? (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <ChevronRight
                className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
              />
            </Button>
          ) : (
            <div className="w-6" />
          )}
          
          <div className="p-2 bg-primary/10 rounded-lg">
            <IconComponent className="h-4 w-4 text-primary" />
          </div>
          
          <div className="flex items-center gap-3">
            <span className="font-medium">{location.name}</span>
            <Badge variant="secondary" className={`${statusColors} text-xs`}>
              {LOCATION_STATUS_LABELS[location.status]}
            </Badge>
            {location.capacity && (
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <Users className="h-3 w-3" />
                {location.capacity.toLocaleString()}
              </span>
            )}
          </div>
        </div>
        
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button variant="ghost" size="sm" onClick={() => onView(location)}>
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onEdit(location)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(location)}
            className="hover:bg-destructive hover:text-destructive-foreground"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {isExpanded && subLocations.length > 0 && (
        <div className="mt-1 space-y-1">
          {subLocations.map((subLoc) => (
            <LocationHierarchyItem
              key={subLoc.id}
              location={subLoc}
              subLocations={getSubLocations(subLoc.id, allLocations)}
              allLocations={allLocations}
              onEdit={onEdit}
              onDelete={onDelete}
              onView={onView}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Location Form Dialog Component
function LocationFormDialog({
  open,
  onOpenChange,
  title,
  description,
  formData,
  onFormDataChange,
  onSave,
  locations,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  formData: Partial<Location>;
  onFormDataChange: (data: Partial<Location>) => void;
  onSave: () => void;
  locations: Location[];
}) {
  const [activeTab, setActiveTab] = useState('basic');
  
  const updateField = (field: keyof Location, value: any) => {
    onFormDataChange({ ...formData, [field]: value });
  };
  
  // Available parent locations (only buildings that can have sub-locations)
  const availableParents = locations.filter(
    loc => loc.hasSubLocations && loc.id !== formData.id
  );
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
          </TabsList>
          
          {/* Basic Info Tab */}
          <TabsContent value="basic" className="space-y-4 mt-4">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Location Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g., Main Sanctuary"
                  value={formData.name || ''}
                  onChange={(e) => updateField('name', e.target.value)}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="type">Location Type *</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value: LocationType) => updateField('type', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(LOCATION_TYPE_LABELS).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="status">Status *</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: LocationStatus) => updateField('status', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(LOCATION_STATUS_LABELS).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {availableParents.length > 0 && (
                <div className="grid gap-2">
                  <Label htmlFor="parentLocation">Parent Location (Optional)</Label>
                  <Select
                    value={formData.parentLocationId || 'none'}
                    onValueChange={(value) => updateField('parentLocationId', value === 'none' ? undefined : value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None (Main Location)</SelectItem>
                      {availableParents.map((loc) => (
                        <SelectItem key={loc.id} value={loc.id}>
                          {loc.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Set if this is a room within a building
                  </p>
                </div>
              )}
              
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Brief description of this location..."
                  value={formData.description || ''}
                  onChange={(e) => updateField('description', e.target.value)}
                  rows={3}
                />
              </div>
            </div>
          </TabsContent>
          
          {/* Details Tab */}
          <TabsContent value="details" className="space-y-4 mt-4">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label>Capacity</Label>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="capacity" className="text-xs text-muted-foreground">Total</Label>
                    <Input
                      id="capacity"
                      type="number"
                      placeholder="1000"
                      value={formData.capacity || ''}
                      onChange={(e) => updateField('capacity', parseInt(e.target.value) || undefined)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="seatedCapacity" className="text-xs text-muted-foreground">Seated</Label>
                    <Input
                      id="seatedCapacity"
                      type="number"
                      placeholder="800"
                      value={formData.seatedCapacity || ''}
                      onChange={(e) => updateField('seatedCapacity', parseInt(e.target.value) || undefined)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="standingCapacity" className="text-xs text-muted-foreground">Standing</Label>
                    <Input
                      id="standingCapacity"
                      type="number"
                      placeholder="200"
                      value={formData.standingCapacity || ''}
                      onChange={(e) => updateField('standingCapacity', parseInt(e.target.value) || undefined)}
                    />
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="grid gap-2">
                <Label>Address</Label>
                <div className="grid gap-3">
                  <Input
                    placeholder="Street address"
                    value={formData.address || ''}
                    onChange={(e) => updateField('address', e.target.value)}
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      placeholder="City"
                      value={formData.city || ''}
                      onChange={(e) => updateField('city', e.target.value)}
                    />
                    <Input
                      placeholder="State"
                      value={formData.state || ''}
                      onChange={(e) => updateField('state', e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      placeholder="Postal code"
                      value={formData.postalCode || ''}
                      onChange={(e) => updateField('postalCode', e.target.value)}
                    />
                    <Input
                      placeholder="Country"
                      value={formData.country || ''}
                      onChange={(e) => updateField('country', e.target.value)}
                    />
                  </div>
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Additional notes, maintenance schedules, special instructions..."
                  value={formData.notes || ''}
                  onChange={(e) => updateField('notes', e.target.value)}
                  rows={3}
                />
              </div>
            </div>
          </TabsContent>
          
          {/* Features Tab */}
          <TabsContent value="features" className="space-y-4 mt-4">
            <div className="grid gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Wind className="h-4 w-4 text-muted-foreground" />
                  <Label htmlFor="hasAirConditioning">Air Conditioning</Label>
                </div>
                <Switch
                  id="hasAirConditioning"
                  checked={formData.hasAirConditioning || false}
                  onCheckedChange={(checked) => updateField('hasAirConditioning', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Monitor className="h-4 w-4 text-muted-foreground" />
                  <Label htmlFor="hasProjector">Projector</Label>
                </div>
                <Switch
                  id="hasProjector"
                  checked={formData.hasProjector || false}
                  onCheckedChange={(checked) => updateField('hasProjector', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Volume2 className="h-4 w-4 text-muted-foreground" />
                  <Label htmlFor="hasSoundSystem">Sound System</Label>
                </div>
                <Switch
                  id="hasSoundSystem"
                  checked={formData.hasSoundSystem || false}
                  onCheckedChange={(checked) => updateField('hasSoundSystem', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Car className="h-4 w-4 text-muted-foreground" />
                  <Label htmlFor="hasParking">Car Park</Label>
                </div>
                <Switch
                  id="hasParking"
                  checked={formData.hasParking || false}
                  onCheckedChange={(checked) => updateField('hasParking', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Accessibility className="h-4 w-4 text-muted-foreground" />
                  <Label htmlFor="isWheelchairAccessible">Wheelchair Accessible</Label>
                </div>
                <Switch
                  id="isWheelchairAccessible"
                  checked={formData.isWheelchairAccessible || false}
                  onCheckedChange={(checked) => updateField('isWheelchairAccessible', checked)}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="hasSubLocations">Has Sub-Locations</Label>
                  <p className="text-xs text-muted-foreground">
                    Enable if this location contains rooms
                  </p>
                </div>
                <Switch
                  id="hasSubLocations"
                  checked={formData.hasSubLocations || false}
                  onCheckedChange={(checked) => updateField('hasSubLocations', checked)}
                />
              </div>
            </div>
          </TabsContent>
          
          {/* Contact Tab */}
          <TabsContent value="contact" className="space-y-4 mt-4">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="contactPhone">Contact Phone</Label>
                <div className="flex gap-2">
                  <Phone className="h-9 w-9 p-2 bg-accent rounded-md text-muted-foreground" />
                  <Input
                    id="contactPhone"
                    type="tel"
                    placeholder="+234 803 123 4567"
                    value={formData.contactPhone || ''}
                    onChange={(e) => updateField('contactPhone', e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="contactEmail">Contact Email</Label>
                <div className="flex gap-2">
                  <Mail className="h-9 w-9 p-2 bg-accent rounded-md text-muted-foreground" />
                  <Input
                    id="contactEmail"
                    type="email"
                    placeholder="location@church.org"
                    value={formData.contactEmail || ''}
                    onChange={(e) => updateField('contactEmail', e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>
              
              <Separator />
              
              <div className="grid gap-2">
                <Label htmlFor="imageUrl">Image URL</Label>
                <Input
                  id="imageUrl"
                  type="url"
                  placeholder="https://example.com/location-photo.jpg"
                  value={formData.imageUrl || ''}
                  onChange={(e) => updateField('imageUrl', e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Optional photo of the location
                </p>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="floorPlan">Floor Plan URL</Label>
                <Input
                  id="floorPlan"
                  type="url"
                  placeholder="https://example.com/floor-plan.pdf"
                  value={formData.floorPlan || ''}
                  onChange={(e) => updateField('floorPlan', e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Optional floor plan document or image
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onSave}>
            {title.includes('Create') ? 'Create Location' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Location Details Dialog Component
function LocationDetailsDialog({
  location,
  open,
  onOpenChange,
  onEdit,
  subLocations,
}: {
  location: Location;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: () => void;
  subLocations: Location[];
}) {
  const IconComponent = LOCATION_TYPE_ICONS[location.type];
  const statusColors = LOCATION_STATUS_COLORS[location.status];
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/10 rounded-lg">
              <IconComponent className="h-6 w-6 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-xl">{location.name}</DialogTitle>
              <DialogDescription className="flex items-center gap-2 mt-1">
                {LOCATION_TYPE_LABELS[location.type]}
                <span>•</span>
                <Badge variant="secondary" className={statusColors}>
                  {LOCATION_STATUS_LABELS[location.status]}
                </Badge>
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Image */}
          {location.imageUrl && (
            <div className="rounded-lg overflow-hidden">
              <img
                src={location.imageUrl}
                alt={location.name}
                className="w-full h-48 object-cover"
              />
            </div>
          )}
          
          {/* Description */}
          {location.description && (
            <div>
              <h4 className="text-sm font-medium mb-2">Description</h4>
              <p className="text-sm text-muted-foreground">{location.description}</p>
            </div>
          )}
          
          {/* Capacity */}
          {location.capacity && (
            <div>
              <h4 className="text-sm font-medium mb-3">Capacity</h4>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-accent rounded-lg p-3">
                  <p className="text-xs text-muted-foreground mb-1">Total</p>
                  <p className="text-xl font-semibold">{location.capacity.toLocaleString()}</p>
                </div>
                {location.seatedCapacity && (
                  <div className="bg-accent rounded-lg p-3">
                    <p className="text-xs text-muted-foreground mb-1">Seated</p>
                    <p className="text-xl font-semibold">{location.seatedCapacity.toLocaleString()}</p>
                  </div>
                )}
                {location.standingCapacity && (
                  <div className="bg-accent rounded-lg p-3">
                    <p className="text-xs text-muted-foreground mb-1">Standing</p>
                    <p className="text-xl font-semibold">{location.standingCapacity.toLocaleString()}</p>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Address */}
          {(location.address || location.city) && (
            <div>
              <h4 className="text-sm font-medium mb-2">Address</h4>
              <div className="flex items-start gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 mt-0.5" />
                <span>{formatLocationAddress(location)}</span>
              </div>
            </div>
          )}
          
          {/* Features */}
          <div>
            <h4 className="text-sm font-medium mb-3">Features</h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2">
                <Wind className={`h-4 w-4 ${location.hasAirConditioning ? 'text-[#1CE479]' : 'text-muted-foreground'}`} />
                <span className="text-sm">Air Conditioning</span>
                {location.hasAirConditioning ? (
                  <Check className="h-4 w-4 text-[#1CE479] ml-auto" />
                ) : (
                  <X className="h-4 w-4 text-muted-foreground ml-auto" />
                )}
              </div>
              <div className="flex items-center gap-2">
                <Monitor className={`h-4 w-4 ${location.hasProjector ? 'text-[#1CE479]' : 'text-muted-foreground'}`} />
                <span className="text-sm">Projector</span>
                {location.hasProjector ? (
                  <Check className="h-4 w-4 text-[#1CE479] ml-auto" />
                ) : (
                  <X className="h-4 w-4 text-muted-foreground ml-auto" />
                )}
              </div>
              <div className="flex items-center gap-2">
                <Volume2 className={`h-4 w-4 ${location.hasSoundSystem ? 'text-[#1CE479]' : 'text-muted-foreground'}`} />
                <span className="text-sm">Sound System</span>
                {location.hasSoundSystem ? (
                  <Check className="h-4 w-4 text-[#1CE479] ml-auto" />
                ) : (
                  <X className="h-4 w-4 text-muted-foreground ml-auto" />
                )}
              </div>
              <div className="flex items-center gap-2">
                <Car className={`h-4 w-4 ${location.hasParking ? 'text-[#1CE479]' : 'text-muted-foreground'}`} />
                <span className="text-sm">Car Park</span>
                {location.hasParking ? (
                  <Check className="h-4 w-4 text-[#1CE479] ml-auto" />
                ) : (
                  <X className="h-4 w-4 text-muted-foreground ml-auto" />
                )}
              </div>
              <div className="flex items-center gap-2">
                <Accessibility className={`h-4 w-4 ${location.isWheelchairAccessible ? 'text-[#1CE479]' : 'text-muted-foreground'}`} />
                <span className="text-sm">Wheelchair Accessible</span>
                {location.isWheelchairAccessible ? (
                  <Check className="h-4 w-4 text-[#1CE479] ml-auto" />
                ) : (
                  <X className="h-4 w-4 text-muted-foreground ml-auto" />
                )}
              </div>
            </div>
          </div>
          
          {/* Sub-locations */}
          {subLocations.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-3">
                Sub-Locations ({subLocations.length})
              </h4>
              <div className="space-y-2">
                {subLocations.map((subLoc) => {
                  const SubIcon = LOCATION_TYPE_ICONS[subLoc.type];
                  return (
                    <div key={subLoc.id} className="flex items-center gap-3 p-2 bg-accent rounded-lg">
                      <SubIcon className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm flex-1">{subLoc.name}</span>
                      {subLoc.capacity && (
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {subLoc.capacity}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          
          {/* Contact */}
          {(location.contactPhone || location.contactEmail) && (
            <div>
              <h4 className="text-sm font-medium mb-3">Contact Information</h4>
              <div className="space-y-2">
                {location.contactPhone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{location.contactPhone}</span>
                  </div>
                )}
                {location.contactEmail && (
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{location.contactEmail}</span>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Notes */}
          {location.notes && (
            <div>
              <h4 className="text-sm font-medium mb-2">Notes</h4>
              <p className="text-sm text-muted-foreground">{location.notes}</p>
            </div>
          )}
          
          {/* Utilization */}
          {location.averageUtilization !== undefined && (
            <div>
              <h4 className="text-sm font-medium mb-2">Average Utilisation</h4>
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-accent rounded-full h-2">
                  <div
                    className="bg-[#1CE479] h-2 rounded-full transition-all"
                    style={{ width: `${location.averageUtilization}%` }}
                  />
                </div>
                <span className="text-sm font-medium">{location.averageUtilization}%</span>
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button onClick={onEdit} className="gap-2">
            <Edit className="h-4 w-4" />
            Edit Location
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}