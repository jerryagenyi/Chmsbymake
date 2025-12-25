/**
 * ChurchAfrica ChMS - Location Type Definitions
 * For managing physical church locations, buildings, and rooms
 */

import { Building2, MapPin, Home, Church, Users, Calendar, type LucideIcon } from 'lucide-react';

/**
 * Location Type - What kind of location
 */
export type LocationType =
  | 'main_sanctuary'
  | 'annex'
  | 'classroom'
  | 'office'
  | 'conference_room'
  | 'outdoor'
  | 'parking'
  | 'other';

/**
 * Location Status
 */
export type LocationStatus =
  | 'active'
  | 'inactive'
  | 'under_maintenance'
  | 'reserved';

/**
 * Main Location/Building
 */
export interface Location {
  id: string;
  organizationId: string;
  branchId: string; // Which campus/branch this location belongs to
  name: string; // e.g., "Main Sanctuary", "Children's Building", "Annex Hall"
  type: LocationType;
  status: LocationStatus;
  
  // Physical details
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  
  // Capacity
  capacity?: number; // Total capacity
  seatedCapacity?: number; // Seated capacity
  standingCapacity?: number; // Standing room capacity
  
  // Features
  hasAirConditioning?: boolean;
  hasProjector?: boolean;
  hasSoundSystem?: boolean;
  hasParking?: boolean;
  isWheelchairAccessible?: boolean;
  
  // Hierarchy (if this is a building with rooms)
  parentLocationId?: string; // For sub-locations (e.g., rooms in a building)
  hasSubLocations?: boolean; // True if this location contains rooms
  
  // Management
  managerId?: string; // User ID of location manager/overseer
  contactPhone?: string;
  contactEmail?: string;
  
  // Usage tracking
  averageUtilization?: number; // Percentage (0-100)
  lastUsedDate?: string;
  maintenanceSchedule?: string; // Cron expression or next maintenance date
  
  // Metadata
  description?: string;
  notes?: string;
  imageUrl?: string;
  floorPlan?: string; // URL to floor plan image
  
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy?: string;
}

/**
 * Location with usage statistics
 */
export interface LocationWithStats extends Location {
  currentOccupancy: number;
  upcomingServices: number;
  utilizationRate: number;
  maintenanceStatus: 'good' | 'needs_attention' | 'critical';
}

/**
 * Location Assignment - Links services/events to locations
 */
export interface LocationAssignment {
  id: string;
  locationId: string;
  entityId: string; // Service ID or Event ID
  entityType: 'service' | 'event' | 'meeting';
  startDateTime: string; // ISO datetime
  endDateTime: string; // ISO datetime
  expectedAttendance?: number;
  actualAttendance?: number;
  setupTime?: number; // Minutes before event for setup
  cleanupTime?: number; // Minutes after event for cleanup
  status: 'scheduled' | 'active' | 'completed' | 'cancelled';
  notes?: string;
  createdAt: string;
}

/**
 * Location Utilization Report
 */
export interface LocationUtilization {
  locationId: string;
  locationName: string;
  period: 'day' | 'week' | 'month' | 'year';
  startDate: string;
  endDate: string;
  totalHoursAvailable: number;
  totalHoursUsed: number;
  utilizationRate: number; // Percentage
  totalEvents: number;
  totalAttendance: number;
  averageAttendance: number;
  capacityUtilization: number; // Average % of capacity used
  peakUsageTimes?: {
    dayOfWeek: string;
    timeRange: string;
    utilizationRate: number;
  }[];
}

/**
 * Location Type Labels (British English)
 */
export const LOCATION_TYPE_LABELS: Record<LocationType, string> = {
  main_sanctuary: 'Main Sanctuary',
  annex: 'Annex Hall',
  classroom: 'Classroom',
  office: 'Office',
  conference_room: 'Conference Room',
  outdoor: 'Outdoor Space',
  parking: 'Car Park',
  other: 'Other',
};

/**
 * Location Type Icons
 */
export const LOCATION_TYPE_ICONS: Record<LocationType, LucideIcon> = {
  main_sanctuary: Church,
  annex: Building2,
  classroom: Users,
  office: Home,
  conference_room: Calendar,
  outdoor: MapPin,
  parking: MapPin,
  other: Building2,
};

/**
 * Location Status Labels
 */
export const LOCATION_STATUS_LABELS: Record<LocationStatus, string> = {
  active: 'Active',
  inactive: 'Inactive',
  under_maintenance: 'Under Maintenance',
  reserved: 'Reserved',
};

/**
 * Location Status Colors (Tailwind classes)
 */
export const LOCATION_STATUS_COLORS: Record<LocationStatus, string> = {
  active: 'text-[#1CE479] bg-[#1CE479]/10',
  inactive: 'text-muted-foreground bg-muted',
  under_maintenance: 'text-yellow-500 bg-yellow-500/10',
  reserved: 'text-blue-500 bg-blue-500/10',
};

/**
 * Helper: Check if location is available at a given time
 */
export function isLocationAvailable(
  location: Location,
  startTime: Date,
  endTime: Date,
  assignments: LocationAssignment[]
): boolean {
  if (location.status !== 'active') {
    return false;
  }

  // Check for conflicting assignments
  const hasConflict = assignments.some(assignment => {
    if (assignment.locationId !== location.id) return false;
    if (assignment.status === 'cancelled') return false;

    const assignmentStart = new Date(assignment.startDateTime);
    const assignmentEnd = new Date(assignment.endDateTime);

    // Check for overlap
    return (
      (startTime >= assignmentStart && startTime < assignmentEnd) ||
      (endTime > assignmentStart && endTime <= assignmentEnd) ||
      (startTime <= assignmentStart && endTime >= assignmentEnd)
    );
  });

  return !hasConflict;
}

/**
 * Helper: Get location capacity status
 */
export function getLocationCapacityStatus(
  location: Location,
  currentOccupancy: number
): {
  status: 'low' | 'medium' | 'high' | 'full' | 'overflow';
  percentage: number;
  color: string;
} {
  const capacity = location.capacity || 100;
  const percentage = (currentOccupancy / capacity) * 100;

  if (percentage >= 100) {
    return { status: 'overflow', percentage, color: 'text-red-500' };
  } else if (percentage >= 90) {
    return { status: 'full', percentage, color: 'text-orange-500' };
  } else if (percentage >= 70) {
    return { status: 'high', percentage, color: 'text-yellow-500' };
  } else if (percentage >= 40) {
    return { status: 'medium', percentage, color: 'text-blue-500' };
  } else {
    return { status: 'low', percentage, color: 'text-[#1CE479]' };
  }
}

/**
 * Helper: Format location address
 */
export function formatLocationAddress(location: Location): string {
  const parts = [
    location.address,
    location.city,
    location.state,
    location.postalCode,
    location.country,
  ].filter(Boolean);

  return parts.join(', ');
}

/**
 * Helper: Get sub-locations (rooms) for a building
 */
export function getSubLocations(
  parentId: string,
  allLocations: Location[]
): Location[] {
  return allLocations.filter(loc => loc.parentLocationId === parentId);
}

/**
 * Vue Migration Notes:
 * 
 * // Pinia Store - locationStore.ts
 * import { defineStore } from 'pinia';
 * 
 * export const useLocationStore = defineStore('location', {
 *   state: () => ({
 *     locations: [] as Location[],
 *     assignments: [] as LocationAssignment[],
 *     selectedLocation: null as Location | null,
 *   }),
 *   
 *   getters: {
 *     activeLocations: (state) => 
 *       state.locations.filter(loc => loc.status === 'active'),
 *     
 *     mainLocations: (state) =>
 *       state.locations.filter(loc => !loc.parentLocationId),
 *     
 *     getSubLocations: (state) => (parentId: string) =>
 *       state.locations.filter(loc => loc.parentLocationId === parentId),
 *   },
 *   
 *   actions: {
 *     async fetchLocations() {
 *       const response = await api.get('/locations');
 *       this.locations = response.data;
 *     },
 *     
 *     async createLocation(location: Partial<Location>) {
 *       const response = await api.post('/locations', location);
 *       this.locations.push(response.data);
 *       return response.data;
 *     },
 *     
 *     async updateLocation(id: string, updates: Partial<Location>) {
 *       const response = await api.put(`/locations/${id}`, updates);
 *       const index = this.locations.findIndex(l => l.id === id);
 *       if (index !== -1) {
 *         this.locations[index] = response.data;
 *       }
 *       return response.data;
 *     },
 *     
 *     async deleteLocation(id: string) {
 *       await api.delete(`/locations/${id}`);
 *       this.locations = this.locations.filter(l => l.id !== id);
 *     },
 *     
 *     checkAvailability(locationId: string, start: Date, end: Date) {
 *       const location = this.locations.find(l => l.id === locationId);
 *       if (!location) return false;
 *       return isLocationAvailable(location, start, end, this.assignments);
 *     },
 *   },
 * });
 * 
 * // Laravel Model - Location.php
 * namespace App\Models;
 * 
 * class Location extends Model {
 *   protected $fillable = [
 *     'organization_id', 'branch_id', 'name', 'type', 'status',
 *     'address', 'city', 'state', 'country', 'postal_code',
 *     'latitude', 'longitude', 'capacity', 'seated_capacity',
 *     'standing_capacity', 'has_air_conditioning', 'has_projector',
 *     'has_sound_system', 'has_parking', 'is_wheelchair_accessible',
 *     'parent_location_id', 'has_sub_locations', 'manager_id',
 *     'contact_phone', 'contact_email', 'description', 'notes',
 *     'image_url', 'floor_plan', 'created_by', 'updated_by'
 *   ];
 *   
 *   protected $casts = [
 *     'capacity' => 'integer',
 *     'seated_capacity' => 'integer',
 *     'standing_capacity' => 'integer',
 *     'has_air_conditioning' => 'boolean',
 *     'has_projector' => 'boolean',
 *     'has_sound_system' => 'boolean',
 *     'has_parking' => 'boolean',
 *     'is_wheelchair_accessible' => 'boolean',
 *     'has_sub_locations' => 'boolean',
 *   ];
 *   
 *   public function organization() {
 *     return $this->belongsTo(Organization::class);
 *   }
 *   
 *   public function branch() {
 *     return $this->belongsTo(Branch::class);
 *   }
 *   
 *   public function parent() {
 *     return $this->belongsTo(Location::class, 'parent_location_id');
 *   }
 *   
 *   public function subLocations() {
 *     return $this->hasMany(Location::class, 'parent_location_id');
 *   }
 *   
 *   public function assignments() {
 *     return $this->hasMany(LocationAssignment::class);
 *   }
 *   
 *   public function manager() {
 *     return $this->belongsTo(User::class, 'manager_id');
 *   }
 *   
 *   // Scope for active locations
 *   public function scopeActive($query) {
 *     return $query->where('status', 'active');
 *   }
 *   
 *   // Check if location is available
 *   public function isAvailableAt($startTime, $endTime) {
 *     if ($this->status !== 'active') return false;
 *     
 *     return !$this->assignments()
 *       ->where('status', '!=', 'cancelled')
 *       ->where(function($query) use ($startTime, $endTime) {
 *         $query->whereBetween('start_date_time', [$startTime, $endTime])
 *               ->orWhereBetween('end_date_time', [$startTime, $endTime])
 *               ->orWhere(function($q) use ($startTime, $endTime) {
 *                 $q->where('start_date_time', '<=', $startTime)
 *                   ->where('end_date_time', '>=', $endTime);
 *               });
 *       })
 *       ->exists();
 *   }
 * }
 * 
 * // Database Migration
 * Schema::create('locations', function (Blueprint $table) {
 *   $table->id();
 *   $table->foreignId('organization_id')->constrained()->cascadeOnDelete();
 *   $table->foreignId('branch_id')->constrained()->cascadeOnDelete();
 *   $table->string('name');
 *   $table->enum('type', ['main_sanctuary', 'annex', 'classroom', 'office', 
 *                          'conference_room', 'outdoor', 'parking', 'other']);
 *   $table->enum('status', ['active', 'inactive', 'under_maintenance', 'reserved'])->default('active');
 *   
 *   // Physical details
 *   $table->string('address')->nullable();
 *   $table->string('city')->nullable();
 *   $table->string('state')->nullable();
 *   $table->string('country')->nullable();
 *   $table->string('postal_code')->nullable();
 *   $table->decimal('latitude', 10, 7)->nullable();
 *   $table->decimal('longitude', 10, 7)->nullable();
 *   
 *   // Capacity
 *   $table->integer('capacity')->nullable();
 *   $table->integer('seated_capacity')->nullable();
 *   $table->integer('standing_capacity')->nullable();
 *   
 *   // Features
 *   $table->boolean('has_air_conditioning')->default(false);
 *   $table->boolean('has_projector')->default(false);
 *   $table->boolean('has_sound_system')->default(false);
 *   $table->boolean('has_parking')->default(false);
 *   $table->boolean('is_wheelchair_accessible')->default(false);
 *   
 *   // Hierarchy
 *   $table->foreignId('parent_location_id')->nullable()->constrained('locations')->nullOnDelete();
 *   $table->boolean('has_sub_locations')->default(false);
 *   
 *   // Management
 *   $table->foreignId('manager_id')->nullable()->constrained('users')->nullOnDelete();
 *   $table->string('contact_phone')->nullable();
 *   $table->string('contact_email')->nullable();
 *   
 *   // Metadata
 *   $table->text('description')->nullable();
 *   $table->text('notes')->nullable();
 *   $table->string('image_url')->nullable();
 *   $table->string('floor_plan')->nullable();
 *   
 *   $table->foreignId('created_by')->constrained('users');
 *   $table->foreignId('updated_by')->nullable()->constrained('users');
 *   $table->timestamps();
 *   
 *   $table->index(['organization_id', 'branch_id']);
 *   $table->index(['status']);
 *   $table->index(['type']);
 * });
 * 
 * Schema::create('location_assignments', function (Blueprint $table) {
 *   $table->id();
 *   $table->foreignId('location_id')->constrained()->cascadeOnDelete();
 *   $table->string('entity_id'); // Service or Event ID
 *   $table->enum('entity_type', ['service', 'event', 'meeting']);
 *   $table->dateTime('start_date_time');
 *   $table->dateTime('end_date_time');
 *   $table->integer('expected_attendance')->nullable();
 *   $table->integer('actual_attendance')->nullable();
 *   $table->integer('setup_time')->nullable(); // Minutes
 *   $table->integer('cleanup_time')->nullable(); // Minutes
 *   $table->enum('status', ['scheduled', 'active', 'completed', 'cancelled'])->default('scheduled');
 *   $table->text('notes')->nullable();
 *   $table->timestamps();
 *   
 *   $table->index(['location_id', 'start_date_time', 'end_date_time']);
 *   $table->index(['entity_id', 'entity_type']);
 *   $table->index(['status']);
 * });
 */
