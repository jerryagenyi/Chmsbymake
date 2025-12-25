/**
 * ChurchAfrica ChMS - Attendance Type Definitions
 * Comprehensive attendance tracking data structures
 */

export type ServiceType = 'sunday_first' | 'sunday_second' | 'midweek' | 'prayer' | 'special' | 'youth' | 'children';
export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused';
export type CheckInMethod = 'manual' | 'qr_code' | 'sms' | 'app' | 'nfc';
export type AgeCategory = 'children' | 'youth' | 'adults' | 'seniors';

export interface Service {
  id: string;
  name: string;
  type: ServiceType;
  date: string; // ISO date
  startTime: string; // HH:mm format
  endTime?: string;
  location?: string;
  expectedAttendance?: number;
  notes?: string;
  isActive: boolean;
  createdAt: string;
  createdBy?: string;
}

export interface AttendanceRecord {
  id: string;
  serviceId: string;
  memberId: string;
  
  // Attendance Details
  status: AttendanceStatus;
  checkInTime?: string; // ISO datetime
  checkOutTime?: string;
  checkInMethod: CheckInMethod;
  
  // Member Info (denormalized for quick access)
  memberName?: string;
  memberPhoto?: string;
  membershipNumber?: string;
  isFirstTimer?: boolean;
  isGuest?: boolean;
  
  // Additional Info
  notes?: string;
  temperature?: number; // Health screening
  hasChildren?: boolean;
  childrenCount?: number;
  
  // Metadata
  recordedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FirstTimer {
  id: string;
  serviceId: string;
  
  // Personal Information
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
  address?: string;
  
  // Additional Info
  ageGroup?: AgeCategory;
  gender?: 'male' | 'female' | 'other';
  referredBy?: string;
  interestedInMembership?: boolean;
  interests?: string[];
  
  // Follow-up
  followUpStatus?: 'pending' | 'contacted' | 'visiting_again' | 'joined';
  followUpNotes?: string;
  assignedTo?: string;
  
  // Metadata
  checkInTime: string;
  createdAt: string;
  updatedAt: string;
}

export interface AttendanceStats {
  serviceId: string;
  serviceName: string;
  serviceDate: string;
  
  // Overall Stats
  totalExpected?: number;
  totalPresent: number;
  totalAbsent: number;
  totalLate: number;
  totalExcused: number;
  attendanceRate: number; // Percentage
  
  // Demographics
  byGender: {
    male: number;
    female: number;
    other: number;
  };
  
  byAgeCategory: {
    children: number;
    youth: number;
    adults: number;
    seniors: number;
  };
  
  // Special Categories
  firstTimers: number;
  guests: number;
  newMembers: number; // Joined in last 90 days
  
  // Time Analysis
  onTimeCount: number;
  lateCount: number;
  averageCheckInTime?: string;
  peakCheckInTime?: string;
  
  // Comparison
  comparisonToPrevious?: {
    change: number; // Percentage change
    previousCount: number;
  };
  
  // Trends
  trend?: 'increasing' | 'decreasing' | 'stable';
}

export interface AttendanceSummary {
  // Date Range
  startDate: string;
  endDate: string;
  period: 'week' | 'month' | 'quarter' | 'year';
  
  // Aggregate Stats
  totalServices: number;
  totalAttendance: number;
  averageAttendance: number;
  peakAttendance: number;
  lowestAttendance: number;
  
  // Service Breakdown
  byServiceType: Record<ServiceType, {
    count: number;
    totalAttendance: number;
    averageAttendance: number;
  }>;
  
  // Member Engagement
  activeMembers: number; // Attended at least once
  regularAttendees: number; // Attended 75%+ of services
  irregularAttendees: number; // Attended <50% of services
  
  // Growth Metrics
  newMembersAttended: number;
  firstTimersTotal: number;
  firstTimersConverted: number; // Became members
  conversionRate: number;
  
  // Weekly Pattern
  attendanceByWeek: Array<{
    week: string;
    attendance: number;
    services: number;
  }>;
  
  // Top Performers
  mostConsistentMembers: Array<{
    memberId: string;
    memberName: string;
    attendanceRate: number;
  }>;
}

export interface AttendanceFilters {
  serviceId?: string;
  serviceType?: ServiceType[];
  dateFrom?: string;
  dateTo?: string;
  status?: AttendanceStatus[];
  checkInMethod?: CheckInMethod[];
  isFirstTimer?: boolean;
  isGuest?: boolean;
  ageCategory?: AgeCategory[];
  search?: string; // Member name/number
}

export interface BulkAttendanceInput {
  serviceId: string;
  memberIds: string[];
  status: AttendanceStatus;
  checkInMethod: CheckInMethod;
  checkInTime?: string;
  notes?: string;
}

export interface AttendanceReport {
  id: string;
  name: string;
  type: 'service' | 'member' | 'summary' | 'trend';
  generatedAt: string;
  generatedBy: string;
  dateFrom: string;
  dateTo: string;
  data: AttendanceSummary | AttendanceStats | any;
  format: 'pdf' | 'excel' | 'csv';
  downloadUrl?: string;
}

/**
 * Vue/Laravel Migration Notes:
 * 
 * // Laravel Models
 * 
 * // app/Models/Service.php
 * class Service extends Model {
 *   protected $fillable = [
 *     'name', 'type', 'date', 'start_time', 'end_time',
 *     'location', 'expected_attendance', 'notes', 'is_active',
 *     'created_by'
 *   ];
 *   
 *   protected $casts = [
 *     'date' => 'date',
 *     'is_active' => 'boolean',
 *   ];
 *   
 *   public function attendanceRecords() {
 *     return $this->hasMany(AttendanceRecord::class);
 *   }
 *   
 *   public function stats() {
 *     return [
 *       'total_present' => $this->attendanceRecords()->where('status', 'present')->count(),
 *       'total_late' => $this->attendanceRecords()->where('status', 'late')->count(),
 *       'first_timers' => $this->attendanceRecords()->where('is_first_timer', true)->count(),
 *       'attendance_rate' => $this->calculateAttendanceRate(),
 *     ];
 *   }
 * }
 * 
 * // app/Models/AttendanceRecord.php
 * class AttendanceRecord extends Model {
 *   protected $fillable = [
 *     'service_id', 'member_id', 'status', 'check_in_time',
 *     'check_out_time', 'check_in_method', 'is_first_timer',
 *     'is_guest', 'notes', 'temperature', 'has_children',
 *     'children_count', 'recorded_by'
 *   ];
 *   
 *   protected $casts = [
 *     'check_in_time' => 'datetime',
 *     'check_out_time' => 'datetime',
 *     'is_first_timer' => 'boolean',
 *     'is_guest' => 'boolean',
 *     'has_children' => 'boolean',
 *   ];
 *   
 *   public function service() {
 *     return $this->belongsTo(Service::class);
 *   }
 *   
 *   public function member() {
 *     return $this->belongsTo(Member::class);
 *   }
 *   
 *   public function recorder() {
 *     return $this->belongsTo(User::class, 'recorded_by');
 *   }
 * }
 * 
 * // app/Models/FirstTimer.php
 * class FirstTimer extends Model {
 *   protected $fillable = [
 *     'service_id', 'first_name', 'last_name', 'phone', 'email',
 *     'address', 'age_group', 'gender', 'referred_by',
 *     'interested_in_membership', 'interests', 'follow_up_status',
 *     'follow_up_notes', 'assigned_to', 'check_in_time'
 *   ];
 *   
 *   protected $casts = [
 *     'check_in_time' => 'datetime',
 *     'interested_in_membership' => 'boolean',
 *     'interests' => 'array',
 *   ];
 *   
 *   public function service() {
 *     return $this->belongsTo(Service::class);
 *   }
 *   
 *   public function assignee() {
 *     return $this->belongsTo(User::class, 'assigned_to');
 *   }
 * }
 * 
 * // Database Migrations
 * 
 * // database/migrations/xxxx_create_services_table.php
 * Schema::create('services', function (Blueprint $table) {
 *   $table->id();
 *   $table->string('name');
 *   $table->enum('type', ['sunday_first', 'sunday_second', 'midweek', 'prayer', 'special', 'youth', 'children']);
 *   $table->date('date');
 *   $table->time('start_time');
 *   $table->time('end_time')->nullable();
 *   $table->string('location')->nullable();
 *   $table->integer('expected_attendance')->nullable();
 *   $table->text('notes')->nullable();
 *   $table->boolean('is_active')->default(true);
 *   $table->foreignId('created_by')->nullable()->constrained('users');
 *   $table->timestamps();
 *   
 *   $table->index(['date', 'type']);
 *   $table->index('is_active');
 * });
 * 
 * // database/migrations/xxxx_create_attendance_records_table.php
 * Schema::create('attendance_records', function (Blueprint $table) {
 *   $table->id();
 *   $table->foreignId('service_id')->constrained()->onDelete('cascade');
 *   $table->foreignId('member_id')->constrained()->onDelete('cascade');
 *   $table->enum('status', ['present', 'absent', 'late', 'excused']);
 *   $table->dateTime('check_in_time')->nullable();
 *   $table->dateTime('check_out_time')->nullable();
 *   $table->enum('check_in_method', ['manual', 'qr_code', 'sms', 'app', 'nfc']);
 *   $table->boolean('is_first_timer')->default(false);
 *   $table->boolean('is_guest')->default(false);
 *   $table->text('notes')->nullable();
 *   $table->decimal('temperature', 4, 1)->nullable();
 *   $table->boolean('has_children')->default(false);
 *   $table->integer('children_count')->default(0);
 *   $table->foreignId('recorded_by')->nullable()->constrained('users');
 *   $table->timestamps();
 *   
 *   $table->unique(['service_id', 'member_id']);
 *   $table->index(['service_id', 'status']);
 *   $table->index('check_in_time');
 * });
 * 
 * // database/migrations/xxxx_create_first_timers_table.php
 * Schema::create('first_timers', function (Blueprint $table) {
 *   $table->id();
 *   $table->foreignId('service_id')->constrained()->onDelete('cascade');
 *   $table->string('first_name');
 *   $table->string('last_name');
 *   $table->string('phone');
 *   $table->string('email')->nullable();
 *   $table->text('address')->nullable();
 *   $table->enum('age_group', ['children', 'youth', 'adults', 'seniors'])->nullable();
 *   $table->enum('gender', ['male', 'female', 'other'])->nullable();
 *   $table->string('referred_by')->nullable();
 *   $table->boolean('interested_in_membership')->default(false);
 *   $table->json('interests')->nullable();
 *   $table->enum('follow_up_status', ['pending', 'contacted', 'visiting_again', 'joined'])->default('pending');
 *   $table->text('follow_up_notes')->nullable();
 *   $table->foreignId('assigned_to')->nullable()->constrained('users');
 *   $table->dateTime('check_in_time');
 *   $table->timestamps();
 *   
 *   $table->index('phone');
 *   $table->index('follow_up_status');
 * });
 * 
 * // API Controllers
 * 
 * // app/Http/Controllers/AttendanceController.php
 * class AttendanceController extends Controller {
 *   public function checkIn(Request $request) {
 *     $validated = $request->validate([
 *       'service_id' => 'required|exists:services,id',
 *       'member_id' => 'required|exists:members,id',
 *       'status' => 'required|in:present,late',
 *       'check_in_method' => 'required|in:manual,qr_code,sms,app,nfc',
 *     ]);
 *     
 *     $attendance = AttendanceRecord::updateOrCreate(
 *       ['service_id' => $validated['service_id'], 'member_id' => $validated['member_id']],
 *       array_merge($validated, ['check_in_time' => now()])
 *     );
 *     
 *     return response()->json($attendance, 201);
 *   }
 *   
 *   public function bulkCheckIn(Request $request) {
 *     $validated = $request->validate([
 *       'service_id' => 'required|exists:services,id',
 *       'member_ids' => 'required|array',
 *       'member_ids.*' => 'exists:members,id',
 *       'status' => 'required|in:present,absent,late,excused',
 *     ]);
 *     
 *     $records = [];
 *     foreach ($validated['member_ids'] as $memberId) {
 *       $records[] = AttendanceRecord::updateOrCreate(
 *         ['service_id' => $validated['service_id'], 'member_id' => $memberId],
 *         ['status' => $validated['status'], 'check_in_time' => now()]
 *       );
 *     }
 *     
 *     return response()->json($records, 201);
 *   }
 *   
 *   public function stats($serviceId) {
 *     $service = Service::findOrFail($serviceId);
 *     $stats = [
 *       'total_present' => $service->attendanceRecords()->where('status', 'present')->count(),
 *       'total_late' => $service->attendanceRecords()->where('status', 'late')->count(),
 *       'total_absent' => $service->attendanceRecords()->where('status', 'absent')->count(),
 *       'first_timers' => $service->attendanceRecords()->where('is_first_timer', true)->count(),
 *       // Add more stats
 *     ];
 *     
 *     return response()->json($stats);
 *   }
 * }
 */
