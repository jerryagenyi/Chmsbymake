/**
 * ChurchAfrica ChMS - Member Type Definitions
 * Comprehensive member data structures
 */

export type MemberStatus = 'active' | 'inactive' | 'visitor' | 'alumni';
export type MembershipType = 'regular' | 'founding' | 'honorary' | 'visiting';
export type Gender = 'male' | 'female' | 'other' | 'prefer_not_to_say';
export type MaritalStatus = 'single' | 'married' | 'divorced' | 'widowed';
export type AgeGroup = 'child' | 'youth' | 'young_adult' | 'adult' | 'senior';

export interface ContactInfo {
  phone: string;
  email?: string;
  whatsapp?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
  };
}

export interface FamilyMember {
  id: string;
  name: string;
  relationship: 'spouse' | 'child' | 'parent' | 'sibling' | 'guardian' | 'other';
  memberId?: string; // If they're also a church member
}

export interface Ministry {
  id: string;
  name: string;
  role: string;
  startDate: string;
  endDate?: string;
  isActive: boolean;
}

export interface Group {
  id: string;
  name: string;
  type: 'fellowship' | 'ministry' | 'small_group' | 'committee';
  role?: string;
  joinedDate: string;
}

export interface AttendanceRecord {
  id: string;
  date: string;
  serviceType: 'sunday' | 'midweek' | 'special' | 'event';
  present: boolean;
  notes?: string;
}

export interface Member {
  id: string;
  
  // Basic Information
  firstName: string;
  lastName: string;
  middleName?: string;
  photo?: string;
  dateOfBirth?: string;
  gender: Gender;
  
  // Contact Information
  contact: ContactInfo;
  
  // Membership Details
  membershipNumber?: string;
  membershipType: MembershipType;
  status: MemberStatus;
  joinDate: string;
  baptismDate?: string;
  salvationDate?: string;
  
  // Personal Details
  maritalStatus: MaritalStatus;
  occupation?: string;
  employer?: string;
  
  // Church Involvement
  family?: FamilyMember[];
  familyId?: string; // Link members in same family
  ministries?: Ministry[];
  groups?: Group[];
  skills?: string[];
  interests?: string[];
  
  // Attendance
  lastAttendance?: string;
  attendanceCount?: number;
  attendancePercentage?: number;
  
  // Giving
  lastDonation?: string;
  totalDonations?: number;
  
  // Administrative
  notes?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
}

export interface MemberFilters {
  search?: string;
  status?: MemberStatus[];
  gender?: Gender[];
  maritalStatus?: MaritalStatus[];
  ageGroup?: AgeGroup[];
  ministry?: string[];
  group?: string[];
  hasPhoto?: boolean;
  joinDateFrom?: string;
  joinDateTo?: string;
}

export interface MemberStats {
  total: number;
  active: number;
  inactive: number;
  visitors: number;
  newThisMonth: number;
  byGender: Record<Gender, number>;
  byMaritalStatus: Record<MaritalStatus, number>;
  byAgeGroup: Record<AgeGroup, number>;
  averageAttendance: number;
}

/**
 * Vue/Laravel Migration Notes:
 * 
 * // Laravel Models
 * 
 * // app/Models/Member.php
 * class Member extends Model {
 *   protected $fillable = [
 *     'first_name', 'last_name', 'middle_name', 'photo',
 *     'date_of_birth', 'gender', 'contact', 'membership_number',
 *     'membership_type', 'status', 'join_date', 'baptism_date',
 *     'salvation_date', 'marital_status', 'occupation', 'employer',
 *     'skills', 'interests', 'notes', 'tags'
 *   ];
 *   
 *   protected $casts = [
 *     'contact' => 'array',
 *     'skills' => 'array',
 *     'interests' => 'array',
 *     'tags' => 'array',
 *     'date_of_birth' => 'date',
 *     'join_date' => 'date',
 *     'baptism_date' => 'date',
 *     'salvation_date' => 'date',
 *   ];
 *   
 *   public function family() {
 *     return $this->hasMany(FamilyMember::class);
 *   }
 *   
 *   public function ministries() {
 *     return $this->belongsToMany(Ministry::class)
 *                 ->withPivot('role', 'start_date', 'end_date', 'is_active');
 *   }
 *   
 *   public function groups() {
 *     return $this->belongsToMany(Group::class)
 *                 ->withPivot('role', 'joined_date');
 *   }
 *   
 *   public function attendance() {
 *     return $this->hasMany(Attendance::class);
 *   }
 *   
 *   public function donations() {
 *     return $this->hasMany(Donation::class);
 *   }
 * }
 * 
 * // app/Models/FamilyMember.php
 * class FamilyMember extends Model {
 *   protected $fillable = ['member_id', 'name', 'relationship', 'related_member_id'];
 *   
 *   public function member() {
 *     return $this->belongsTo(Member::class);
 *   }
 *   
 *   public function relatedMember() {
 *     return $this->belongsTo(Member::class, 'related_member_id');
 *   }
 * }
 * 
 * // Database Migrations
 * 
 * // database/migrations/xxxx_create_members_table.php
 * Schema::create('members', function (Blueprint $table) {
 *   $table->id();
 *   $table->string('first_name');
 *   $table->string('last_name');
 *   $table->string('middle_name')->nullable();
 *   $table->string('photo')->nullable();
 *   $table->date('date_of_birth')->nullable();
 *   $table->enum('gender', ['male', 'female', 'other', 'prefer_not_to_say']);
 *   $table->json('contact');
 *   $table->string('membership_number')->unique()->nullable();
 *   $table->enum('membership_type', ['regular', 'founding', 'honorary', 'visiting']);
 *   $table->enum('status', ['active', 'inactive', 'visitor', 'alumni']);
 *   $table->date('join_date');
 *   $table->date('baptism_date')->nullable();
 *   $table->date('salvation_date')->nullable();
 *   $table->enum('marital_status', ['single', 'married', 'divorced', 'widowed']);
 *   $table->string('occupation')->nullable();
 *   $table->string('employer')->nullable();
 *   $table->json('skills')->nullable();
 *   $table->json('interests')->nullable();
 *   $table->text('notes')->nullable();
 *   $table->json('tags')->nullable();
 *   $table->foreignId('created_by')->nullable()->constrained('users');
 *   $table->timestamps();
 *   $table->softDeletes();
 *   
 *   $table->index(['status', 'join_date']);
 *   $table->index(['first_name', 'last_name']);
 * });
 * 
 * // database/migrations/xxxx_create_family_members_table.php
 * Schema::create('family_members', function (Blueprint $table) {
 *   $table->id();
 *   $table->foreignId('member_id')->constrained()->onDelete('cascade');
 *   $table->string('name');
 *   $table->enum('relationship', ['spouse', 'child', 'parent', 'sibling', 'guardian', 'other']);
 *   $table->foreignId('related_member_id')->nullable()->constrained('members');
 *   $table->timestamps();
 * });
 * 
 * // database/migrations/xxxx_create_member_ministry_table.php
 * Schema::create('member_ministry', function (Blueprint $table) {
 *   $table->id();
 *   $table->foreignId('member_id')->constrained()->onDelete('cascade');
 *   $table->foreignId('ministry_id')->constrained()->onDelete('cascade');
 *   $table->string('role');
 *   $table->date('start_date');
 *   $table->date('end_date')->nullable();
 *   $table->boolean('is_active')->default(true);
 *   $table->timestamps();
 * });
 * 
 * // database/migrations/xxxx_create_member_group_table.php
 * Schema::create('member_group', function (Blueprint $table) {
 *   $table->id();
 *   $table->foreignId('member_id')->constrained()->onDelete('cascade');
 *   $table->foreignId('group_id')->constrained()->onDelete('cascade');
 *   $table->string('role')->nullable();
 *   $table->date('joined_date');
 *   $table->timestamps();
 * });
 */