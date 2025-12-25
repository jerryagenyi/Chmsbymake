# ChurchAfrica ChMS - Member Management System

## Overview

The Member Management System provides a comprehensive solution for managing church members with an Africa-First design philosophy. It includes member profiles, advanced search and filtering, attendance tracking integration, ministry assignments, and family connections.

## Components

### 1. **MemberList** (`MemberList.tsx`)
Main container component that orchestrates all member management functionality.

**Features:**
- Grid and Table view modes
- Quick search functionality
- Advanced filtering sidebar
- Bulk selection and actions
- Import/Export capabilities
- Real-time statistics display

**Props:**
```typescript
interface MemberListProps {
  members: Member[];
  onAddMember?: () => void;
  onEditMember?: (member: Member) => void;
  onDeleteMember?: (member: Member) => void;
  onViewMember?: (member: Member) => void;
  onExport?: () => void;
  onImport?: () => void;
}
```

### 2. **MemberCard** (`MemberCard.tsx`)
Card-based member display for grid view.

**Features:**
- Avatar with fallback initials
- Status and gender badges
- Contact information display
- Ministry count badge
- Action dropdown menu
- Compact mode option

**Props:**
```typescript
interface MemberCardProps {
  member: Member;
  onClick?: (member: Member) => void;
  onEdit?: (member: Member) => void;
  onDelete?: (member: Member) => void;
  onMessage?: (member: Member) => void;
  compact?: boolean;
}
```

### 3. **MemberTable** (`MemberTable.tsx`)
Tabular view with sorting and selection.

**Features:**
- Column sorting (name, join date, status, attendance)
- Multi-select with checkboxes
- Inline action dropdown
- Attendance progress bars
- Responsive column layout

**Props:**
```typescript
interface MemberTableProps {
  members: Member[];
  selectedIds?: string[];
  onSelectionChange?: (ids: string[]) => void;
  onMemberClick?: (member: Member) => void;
  onEdit?: (member: Member) => void;
  onDelete?: (member: Member) => void;
  sortable?: boolean;
}
```

### 4. **MemberFilters** (`MemberFilters.tsx`)
Advanced filtering sidebar.

**Features:**
- Search by name, email, phone
- Status filter (active, inactive, visitor, alumni)
- Gender filter
- Marital status filter
- Age group filter (child, youth, young adult, adult, senior)
- Join date range picker
- Photo presence filter
- Active filter count badge
- Clear all filters button

**Props:**
```typescript
interface MemberFiltersProps {
  filters: MemberFilters;
  onChange: (filters: MemberFilters) => void;
  onReset: () => void;
  resultCount?: number;
}
```

## Data Types

### **Member Type**
```typescript
interface Member {
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
  ministries?: Ministry[];
  groups?: Group[];
  skills?: string[];
  interests?: string[];
  
  // Attendance & Giving
  lastAttendance?: string;
  attendanceCount?: number;
  attendancePercentage?: number;
  lastDonation?: string;
  totalDonations?: number;
  
  // Administrative
  notes?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}
```

### **Enums**
```typescript
type MemberStatus = 'active' | 'inactive' | 'visitor' | 'alumni';
type MembershipType = 'regular' | 'founding' | 'honorary' | 'visiting';
type Gender = 'male' | 'female' | 'other' | 'prefer_not_to_say';
type MaritalStatus = 'single' | 'married' | 'divorced' | 'widowed';
type AgeGroup = 'child' | 'youth' | 'young_adult' | 'adult' | 'senior';
```

## Usage Examples

### Basic Implementation
```typescript
import { MemberList } from './components/members';
import { mockMembers } from './lib/mock-data';

function MembersPage() {
  return (
    <MemberList
      members={mockMembers}
      onAddMember={() => console.log('Add member')}
      onEditMember={(member) => console.log('Edit:', member)}
      onDeleteMember={(member) => console.log('Delete:', member)}
      onViewMember={(member) => console.log('View:', member)}
    />
  );
}
```

### With Backend Integration
```typescript
import { MemberList } from './components/members';
import { useMemberStore } from './stores/memberStore';

function MembersPage() {
  const { members, addMember, updateMember, deleteMember } = useMemberStore();
  
  return (
    <MemberList
      members={members}
      onAddMember={() => router.push('/members/new')}
      onEditMember={(member) => router.push(`/members/${member.id}/edit`)}
      onDeleteMember={async (member) => {
        if (confirm(`Delete ${member.firstName}?`)) {
          await deleteMember(member.id);
        }
      }}
      onViewMember={(member) => router.push(`/members/${member.id}`)}
      onExport={() => exportMembersToCSV(members)}
      onImport={() => openImportDialog()}
    />
  );
}
```

## Filtering Logic

The filtering system supports multiple simultaneous filters:

```typescript
// Example filter state
const filters: MemberFilters = {
  search: 'john',
  status: ['active', 'visitor'],
  gender: ['male'],
  ageGroup: ['adult'],
  joinDateFrom: '2020-01-01',
  joinDateTo: '2024-12-31',
  hasPhoto: true
};
```

Filters are applied with AND logic:
- Member must match ALL active filters
- Array filters use OR logic within the array
- Search is case-insensitive and checks name, email, phone, membership number

## Responsive Behavior

### Grid View
- **Mobile (<640px):** 1 column
- **Tablet (640-1024px):** 2 columns
- **Desktop (>1024px):** 3 columns

### Table View
- **Mobile:** Scrollable horizontal table
- **Tablet/Desktop:** Full table with all columns visible

### Filters
- **Mobile:** Slide-in sheet from left
- **Desktop:** Can be persistent sidebar or modal

## Mock Data

8 sample members are provided in `/lib/mock-data.ts`:

1. **Adewale Okonkwo** - Active, Male, Media Ministry Lead
2. **Chioma Nwosu** - Active, Female, Children's Teacher
3. **Emeka Adeyemi** - Active, Male Youth, Student
4. **Blessing Okoro** - Active, Female, Founding Member, Hospitality
5. **Tunde Ibrahim** - Active, Male, Finance Assistant
6. **Ngozi Eze** - Visitor, Female, New Member
7. **Oluwaseun Balogun** - Inactive, Male, Relocated
8. **Amaka Obi** - Active, Female Youth, Creative

## Vue/Laravel Migration

### Vue 3 + Quasar Components

**MemberList.vue:**
```vue
<template>
  <q-page padding>
    <div class="row items-center justify-between q-mb-lg">
      <div>
        <div class="text-h4">Members</div>
        <div class="row q-gutter-xs q-mt-sm">
          <q-chip>{{ stats.total }} Total</q-chip>
          <q-chip color="positive">{{ stats.active }} Active</q-chip>
        </div>
      </div>
      <q-btn color="primary" label="Add Member" icon="add" />
    </div>
    
    <q-input v-model="search" outlined placeholder="Search..." />
    
    <q-table
      v-if="viewMode === 'table'"
      :rows="filteredMembers"
      :columns="columns"
      row-key="id"
      selection="multiple"
      v-model:selected="selected"
    />
    
    <div v-else class="row q-col-gutter-md">
      <div 
        v-for="member in filteredMembers" 
        :key="member.id"
        class="col-12 col-md-6 col-lg-4"
      >
        <MemberCard :member="member" />
      </div>
    </div>
  </q-page>
</template>
```

### Laravel Backend

**MemberController.php:**
```php
class MemberController extends Controller
{
    public function index(Request $request)
    {
        $query = Member::with(['ministries', 'groups', 'family']);
        
        // Search
        if ($request->search) {
            $query->where(function($q) use ($request) {
                $q->where('first_name', 'like', "%{$request->search}%")
                  ->orWhere('last_name', 'like', "%{$request->search}%")
                  ->orWhere('email', 'like', "%{$request->search}%");
            });
        }
        
        // Status filter
        if ($request->status) {
            $query->whereIn('status', $request->status);
        }
        
        // Gender filter
        if ($request->gender) {
            $query->whereIn('gender', $request->gender);
        }
        
        // Join date range
        if ($request->join_date_from) {
            $query->where('join_date', '>=', $request->join_date_from);
        }
        if ($request->join_date_to) {
            $query->where('join_date', '<=', $request->join_date_to);
        }
        
        return $query->paginate(50);
    }
    
    public function store(Request $request)
    {
        $validated = $request->validate([
            'first_name' => 'required|string',
            'last_name' => 'required|string',
            'gender' => 'required|in:male,female,other',
            'contact' => 'required|array',
            'contact.phone' => 'required|string',
            'contact.email' => 'nullable|email',
            'membership_type' => 'required|in:regular,founding,honorary,visiting',
            'status' => 'required|in:active,inactive,visitor,alumni',
            'join_date' => 'required|date',
            'marital_status' => 'required|in:single,married,divorced,widowed',
        ]);
        
        $member = Member::create($validated);
        
        return response()->json($member, 201);
    }
}
```

### API Routes

```php
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/members', [MemberController::class, 'index']);
    Route::post('/members', [MemberController::class, 'store']);
    Route::get('/members/{member}', [MemberController::class, 'show']);
    Route::put('/members/{member}', [MemberController::class, 'update']);
    Route::delete('/members/{member}', [MemberController::class, 'destroy']);
    
    // Bulk operations
    Route::post('/members/bulk-update', [MemberController::class, 'bulkUpdate']);
    Route::post('/members/import', [MemberController::class, 'import']);
    Route::get('/members/export', [MemberController::class, 'export']);
});
```

## Africa-First Design Considerations

### 1. **Offline-First**
- Store member data in IndexedDB/LocalStorage
- Sync changes when connection restored
- Queue operations during offline periods

### 2. **Low-Bandwidth Optimization**
- Lazy load member photos
- Paginate member lists
- Compress profile images
- Incremental search (debounced)

### 3. **Mobile-First**
- Touch-friendly tap targets (48px minimum)
- Swipe gestures for actions
- Bottom sheet for filters
- Pull-to-refresh

### 4. **Localization Ready**
- Support for multiple languages
- Date format preferences
- Phone number formats
- Address formats by country

## Next Steps

### Planned Features
1. **Member Form** - Add/Edit member with photo upload
2. **Member Details Page** - Full profile view
3. **Family Relationships** - Link family members
4. **Ministry Management** - Assign/remove from ministries
5. **Attendance Integration** - Track individual attendance
6. **Giving Integration** - Track member donations
7. **Bulk Operations** - Bulk edit, delete, messaging
8. **Import/Export** - CSV/Excel support
9. **Advanced Search** - Saved filters, custom fields
10. **Member Reports** - Generate PDF reports

### Backend Integration Tasks
1. Set up PostgreSQL database with migrations
2. Create Laravel models and relationships
3. Implement API endpoints (CRUD + filters)
4. Add photo upload to Supabase Storage
5. Implement search indexing
6. Add audit logging
7. Set up role-based permissions
8. Create automated backups

## Performance Considerations

### Optimization Strategies
- Virtual scrolling for large lists (1000+ members)
- Image lazy loading
- Debounced search (300ms)
- Memoized filter calculations
- Paginated API responses (50 per page)
- CDN for member photos
- Database query optimization with indexes

### Recommended Indexes
```sql
CREATE INDEX idx_members_status_join_date ON members(status, join_date);
CREATE INDEX idx_members_name ON members(first_name, last_name);
CREATE INDEX idx_members_contact_phone ON members((contact->>'phone'));
CREATE INDEX idx_members_contact_email ON members((contact->>'email'));
```

## Testing

### Unit Tests
- Filter logic
- Search functionality
- Sort algorithms
- Data validation

### Integration Tests
- API endpoints
- Database operations
- File uploads
- Bulk operations

### E2E Tests
- Member CRUD operations
- Search and filter workflows
- Import/Export flows
- Multi-select actions

## Support

For questions or issues with the Member Management System, refer to:
- Main documentation: `/guidelines/Guidelines.md`
- Type definitions: `/types/member.ts`
- Mock data: `/lib/mock-data.ts`
- Vue migration notes: Inline comments in each component
