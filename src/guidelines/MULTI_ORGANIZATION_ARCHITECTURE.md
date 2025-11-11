# ChurchAfrica ChMS - Multi-Organization Architecture

## Overview
ChurchAfrica ChMS supports a **3-tier hierarchical multi-tenant architecture** designed for churches with multiple branches across different locations in Africa.

---

## 🏗️ Architecture Tiers

```
┌─────────────────────────────────────────────────────────┐
│ TIER 1: ORGANIZATION                                     │
│ (Parent church/denomination/ministry network)           │
│ Example: "Victory Chapel Ministry"                      │
└─────────────────────────────────────────────────────────┘
                        │
        ┌───────────────┼───────────────┐
        │               │               │
┌───────▼──────┐ ┌──────▼──────┐ ┌─────▼───────┐
│ TIER 2:      │ │ TIER 2:     │ │ TIER 2:     │
│ BRANCH       │ │ BRANCH      │ │ BRANCH      │
│              │ │             │ │             │
│ Lagos HQ     │ │ Abuja       │ │ Accra       │
│ 850 members  │ │ 320 members │ │ 180 members │
└──────┬───────┘ └──────┬──────┘ └──────┬──────┘
       │                │                │
   ┌───┴───┐        ┌───┴───┐        ┌──┴───┐
   │ TIER 3│        │ TIER 3│        │TIER 3│
   │SERVICE│        │SERVICE│        │SERVICE│
   │       │        │       │        │      │
   │Sun 1st│        │Sunday │        │Sunday│
   │Sun 2nd│        │Midweek│        │Prayer│
   │Midweek│        └───────┘        └──────┘
   │Youth  │
   └───────┘
```

---

## 📊 Data Model

### 1. Organization (Tier 1)
```typescript
interface Organization {
  id: string;                    // org_001
  name: string;                  // "Victory Chapel Ministry"
  slug: string;                  // "victory-chapel" (for subdomains)
  type: 'denomination' | 'independent' | 'network';
  
  // Contact & Location
  headquarters: {
    country: string;             // "Nigeria"
    city: string;                // "Lagos"
    address: string;
    phone: string;
    email: string;
  };
  
  // Admin & Ownership
  adminUserId: string;           // User ID of super admin
  foundedDate: string;           // "1995-03-15"
  
  // Configuration
  settings: {
    timezone: string;            // "Africa/Lagos"
    currency: string;            // "NGN"
    language: string;            // "en"
    fiscalYearStart: string;     // "01-01"
    
    // Features enabled
    features: {
      multipleServices: boolean;
      onlineGiving: boolean;
      smsNotifications: boolean;
      eventManagement: boolean;
      financialReporting: boolean;
    };
  };
  
  // Branding
  branding: {
    logoUrl?: string;
    primaryColor: string;        // "#1CE479"
    websiteUrl?: string;
  };
  
  // Subscription & Billing
  subscription: {
    plan: 'free' | 'basic' | 'premium' | 'enterprise';
    status: 'active' | 'trial' | 'suspended' | 'cancelled';
    expiresAt: string;           // "2024-12-31"
    maxBranches: number;         // 5, 20, unlimited
    maxMembersPerBranch: number; // 100, 500, unlimited
  };
  
  // Audit
  createdAt: string;
  updatedAt: string;
  createdBy: string;             // User ID
}
```

### 2. Branch (Tier 2)
```typescript
interface Branch {
  id: string;                    // branch_lagos_001
  organizationId: string;        // ← Links to parent org
  
  // Identity
  name: string;                  // "Victory Chapel Lagos"
  code: string;                  // "VCL" (short identifier)
  slug: string;                  // "lagos-hq"
  
  // Classification
  type: 'headquarters' | 'branch' | 'cell';
  isHeadquarters: boolean;
  
  // Location Details
  location: {
    country: string;             // "Nigeria"
    state: string;               // "Lagos State"
    city: string;                // "Ikeja"
    address: string;             // "123 Church Street"
    coordinates?: {
      latitude: number;
      longitude: number;
    };
    timezone: string;            // "Africa/Lagos"
  };
  
  // Contact
  contact: {
    phone: string;
    email: string;
    website?: string;
  };
  
  // Leadership
  leadership: {
    headPastorId: string;        // User ID
    assistantPastorIds: string[];
    administratorId: string;
  };
  
  // Capacity & Facilities
  facilities: {
    mainAuditoriumCapacity: number;  // 1000
    parkingSpaces?: number;
    hasChildrenChurch: boolean;
    hasMediaEquipment: boolean;
  };
  
  // Status
  status: 'active' | 'inactive' | 'under_construction';
  establishedDate: string;       // "2010-06-15"
  
  // Metadata
  metadata: {
    memberCount: number;         // Cached count
    averageAttendance: number;   // Weekly average
    lastServiceDate: string;
  };
  
  // Audit
  createdAt: string;
  updatedAt: string;
}
```

### 3. Service (Tier 3)
```typescript
interface Service {
  id: string;                    // service_001
  branchId: string;              // ← Links to branch
  organizationId: string;        // ← For faster querying
  
  // Identity
  name: string;                  // "Sunday 1st Service"
  type: 'sunday' | 'midweek' | 'youth' | 'prayer' | 'special';
  
  // Schedule
  schedule: {
    dayOfWeek: number;           // 0 = Sunday, 1 = Monday, etc.
    startTime: string;           // "08:00"
    endTime: string;             // "10:00"
    duration: number;            // 120 (minutes)
  };
  
  // Recurrence
  recurrence: {
    frequency: 'weekly' | 'biweekly' | 'monthly' | 'once';
    isRecurring: boolean;
    startDate: string;
    endDate?: string;            // For limited series
  };
  
  // Location
  location: {
    venue: string;               // "Main Auditorium"
    venueType: 'physical' | 'online' | 'hybrid';
    onlineLink?: string;         // Zoom/YouTube link
  };
  
  // Attendance
  expectedAttendance: number;    // 450
  targetGroups: string[];        // ["adults", "youth", "children"]
  
  // Status
  isActive: boolean;
  status: 'draft' | 'active' | 'paused' | 'archived';
  
  // Audit
  createdAt: string;
  updatedAt: string;
}
```

### 4. Updated Data Models (Add Organization/Branch Context)

#### Members
```typescript
interface Member {
  id: string;
  organizationId: string;        // ← ADD THIS
  branchId: string;              // ← ADD THIS (primary branch)
  
  // Allow members to attend multiple branches
  associatedBranchIds: string[]; // Secondary branches
  
  // ... rest of existing fields
}
```

#### Attendance Records
```typescript
interface AttendanceRecord {
  id: string;
  organizationId: string;        // ← ADD THIS
  branchId: string;              // ← ADD THIS
  serviceId: string;             // Already linked to service
  
  // ... rest of existing fields
}
```

#### Events
```typescript
interface Event {
  id: string;
  organizationId: string;        // ← ADD THIS
  
  // Event scope
  scope: 'organization' | 'branch' | 'public';
  organizingBranchId?: string;   // Which branch is hosting
  invitedBranchIds: string[];    // Which branches are invited
  
  // ... rest of existing fields
}
```

#### Donations/Giving
```typescript
interface Donation {
  id: string;
  organizationId: string;        // ← ADD THIS
  branchId: string;              // ← ADD THIS (where given)
  
  // Allocation
  allocation: {
    destinationBranchId?: string; // If transferred to another branch
    destinationType: 'local' | 'headquarters' | 'missions';
  };
  
  // ... rest of fields
}
```

---

## 🔐 Permissions & Access Control

### Role Hierarchy

```
SUPER ADMIN (Platform Level)
  ↓
ORGANIZATION ADMIN
  ↓
BRANCH ADMIN / SENIOR PASTOR
  ↓
DEPARTMENT HEADS
  ↓
STAFF MEMBERS
  ↓
VOLUNTEERS
```

### Permission Matrix

| Feature | Super Admin | Org Admin | Branch Admin | Dept Head | Staff | Volunteer |
|---------|------------|-----------|--------------|-----------|-------|-----------|
| Manage all orgs | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Create branches | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Manage org settings | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| View all branches | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Manage own branch | ✅ | ✅ | ✅ | Partial | ❌ | ❌ |
| Add members | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| Mark attendance | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| View reports | ✅ | ✅ | ✅ | Own dept | Own dept | ❌ |
| Financial access | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |

---

## 🗄️ Database Schema (PostgreSQL/Supabase)

### Row Level Security (RLS) Policies

```sql
-- Organizations table
CREATE POLICY "org_isolation" ON organizations
  USING (
    id IN (
      SELECT organization_id FROM user_organization_access 
      WHERE user_id = auth.uid()
    )
  );

-- Branches table
CREATE POLICY "branch_access" ON branches
  USING (
    organization_id IN (
      SELECT organization_id FROM user_organization_access 
      WHERE user_id = auth.uid()
    )
  );

-- Members table (can only see members from your branches)
CREATE POLICY "member_branch_access" ON members
  USING (
    branch_id IN (
      SELECT branch_id FROM user_branch_access 
      WHERE user_id = auth.uid()
    )
  );

-- Attendance records (same branch isolation)
CREATE POLICY "attendance_branch_access" ON attendance_records
  USING (
    branch_id IN (
      SELECT branch_id FROM user_branch_access 
      WHERE user_id = auth.uid()
    )
  );
```

### User Access Table
```sql
CREATE TABLE user_organization_access (
  user_id UUID REFERENCES auth.users(id),
  organization_id UUID REFERENCES organizations(id),
  role TEXT CHECK (role IN ('super_admin', 'org_admin', 'viewer')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, organization_id)
);

CREATE TABLE user_branch_access (
  user_id UUID REFERENCES auth.users(id),
  branch_id UUID REFERENCES branches(id),
  role TEXT CHECK (role IN ('branch_admin', 'pastor', 'dept_head', 'staff', 'volunteer')),
  permissions JSONB, -- Custom permissions
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, branch_id)
);
```

---

## 🚀 Registration Flow

### Organization Setup Wizard

```typescript
// Step 1: Organization Details
{
  name: "Victory Chapel Ministry",
  type: "independent",
  country: "Nigeria",
  timezone: "Africa/Lagos",
  currency: "NGN"
}

// Step 2: Admin Account
{
  adminName: "Pastor John Doe",
  adminEmail: "john@victorychapel.org",
  adminPhone: "+234-800-000-0000"
}

// Step 3: First Branch (Headquarters)
{
  branchName: "Victory Chapel Lagos HQ",
  city: "Lagos",
  address: "123 Church Street, Ikeja",
  capacity: 1000,
  isHeadquarters: true
}

// Step 4: Subscription Plan
{
  plan: "basic", // or "premium"
  billingCycle: "annual",
  paymentMethod: "card" // or "bank_transfer"
}

// Result:
// - Organization created
// - Admin user created with org_admin role
// - First branch created
// - Default services created (Sunday 1st, Sunday 2nd, Midweek)
// - Sample data seeded (optional)
```

---

## 📡 API Structure

### RESTful Endpoints

```typescript
// Organization Management
GET    /api/organizations                    // List user's orgs
POST   /api/organizations                    // Create new org
GET    /api/organizations/:orgId            // Get org details
PATCH  /api/organizations/:orgId            // Update org
DELETE /api/organizations/:orgId            // Delete org

// Branch Management
GET    /api/organizations/:orgId/branches              // List branches
POST   /api/organizations/:orgId/branches              // Create branch
GET    /api/organizations/:orgId/branches/:branchId    // Get branch
PATCH  /api/organizations/:orgId/branches/:branchId    // Update branch
DELETE /api/organizations/:orgId/branches/:branchId    // Delete branch

// Service Management
GET    /api/branches/:branchId/services                // List services
POST   /api/branches/:branchId/services                // Create service
GET    /api/branches/:branchId/services/:serviceId     // Get service
PATCH  /api/branches/:branchId/services/:serviceId     // Update service
DELETE /api/branches/:branchId/services/:serviceId     // Delete service

// Member Management (Branch-scoped)
GET    /api/branches/:branchId/members                 // List members
POST   /api/branches/:branchId/members                 // Add member
GET    /api/branches/:branchId/members/:memberId       // Get member
PATCH  /api/branches/:branchId/members/:memberId       // Update member
DELETE /api/branches/:branchId/members/:memberId       // Remove member

// Attendance (Service-scoped)
GET    /api/services/:serviceId/attendance             // Get attendance
POST   /api/services/:serviceId/attendance/check-in    // Check in member
GET    /api/services/:serviceId/attendance/stats       // Attendance stats

// Cross-branch queries (Org-level)
GET    /api/organizations/:orgId/members/search        // Search all members
GET    /api/organizations/:orgId/attendance/stats      // Org-wide attendance
GET    /api/organizations/:orgId/reports/weekly        // Consolidated reports
```

---

## 🌍 Multi-Tenancy Strategies

### Strategy 1: Subdomain Isolation (Recommended for SaaS)
```
https://victory-chapel.churchafrica.com
https://redeemed.churchafrica.com
https://winners.churchafrica.com
```

**Pros:**
- Clear separation
- Custom branding per org
- Easy to scale

**Cons:**
- Requires wildcard SSL
- DNS management

### Strategy 2: Path-based (Good for Single Installation)
```
https://churchafrica.com/victory-chapel
https://churchafrica.com/redeemed
https://churchafrica.com/winners
```

**Pros:**
- Simpler deployment
- Single SSL certificate
- Shared authentication

**Cons:**
- Less professional
- Harder to white-label

### Strategy 3: Database-per-Tenant (Enterprise)
```
Each organization gets:
- Separate database
- Separate Supabase project
- Complete isolation
```

**Pros:**
- Maximum security
- Custom backups
- Performance isolation

**Cons:**
- Complex management
- Higher cost
- Harder to do cross-org analytics

---

## 💾 Data Migration

### Current State → Multi-Org Migration

```typescript
// Step 1: Create default organization for existing data
const defaultOrg = {
  id: 'org_default',
  name: 'ChurchAfrica Default Church',
  slug: 'default-church',
  // ... other fields
};

// Step 2: Create default branch
const defaultBranch = {
  id: 'branch_default',
  organizationId: 'org_default',
  name: 'Main Branch',
  isHeadquarters: true,
  // ... other fields
};

// Step 3: Update all existing records
UPDATE members 
SET organization_id = 'org_default', 
    branch_id = 'branch_default';

UPDATE attendance_records 
SET organization_id = 'org_default', 
    branch_id = 'branch_default';

UPDATE events 
SET organization_id = 'org_default';

UPDATE services 
SET organization_id = 'org_default', 
    branch_id = 'branch_default';
```

---

## 📊 Reporting & Analytics

### Branch-Level Reports
- Weekly attendance by service
- Member growth trends
- First-timer conversion rate
- Giving patterns

### Organization-Level Reports
- Cross-branch comparisons
- Top-performing branches
- Organization-wide trends
- Consolidated financials
- Multi-branch event attendance

---

## 🔄 Data Synchronization

### Offline-First Considerations

```typescript
// Each device caches:
{
  organizationId: 'org_001',
  branchId: 'branch_lagos_001',
  lastSyncTime: '2024-10-25T10:30:00Z',
  
  localData: {
    members: [...],        // Only this branch's members
    services: [...],       // Only this branch's services
    attendance: [...],     // Recent attendance records
  },
  
  pendingSync: {
    newAttendance: [...],  // To upload
    updatedMembers: [...], // To upload
  }
}
```

---

## 🎯 Implementation Phases

### Phase 1: Core Multi-Tenancy
- [ ] Organization registration flow
- [ ] Branch creation UI
- [ ] Service management per branch
- [ ] Update all data models with orgId/branchId
- [ ] Implement RLS policies

### Phase 2: Access Control
- [ ] User role management
- [ ] Permission matrix implementation
- [ ] Branch switching UI
- [ ] Admin dashboards

### Phase 3: Cross-Branch Features
- [ ] Organization-wide reports
- [ ] Multi-branch events
- [ ] Member transfers between branches
- [ ] Consolidated giving reports

### Phase 4: Advanced Features
- [ ] Subdomain routing
- [ ] Custom branding per org
- [ ] White-label options
- [ ] API access for third-party integrations

---

## 🛠️ Backend Technology Recommendations

### Option 1: Supabase (Current - Best for MVP)
**Pros:**
- ✅ Built-in RLS (perfect for multi-tenancy)
- ✅ Real-time subscriptions
- ✅ Auth included
- ✅ File storage included
- ✅ Postgre SQL (production-ready)
- ✅ Self-hostable (can run on localhost/own server)

**Cons:**
- ❌ Costs at scale (but affordable for churches)
- ❌ Limited customization in cloud version

**Recommendation:** Use Supabase cloud for MVP, then self-host when you have DevOps capacity

### Option 2: PostgreSQL + Laravel
**Pros:**
- ✅ Full control
- ✅ Mature ecosystem
- ✅ Better for complex business logic
- ✅ Large African PHP developer community
- ✅ Better integration with Vue/Quasar

**Cons:**
- ❌ Need to build auth system
- ❌ Need to implement real-time features
- ❌ More code to maintain

**Recommendation:** Best for production after prototype phase

### Option 3: Self-Hosted Supabase
**Pros:**
- ✅ All Supabase features
- ✅ Free (except hosting costs)
- ✅ Full data control
- ✅ Can customize

**Cons:**
- ❌ Requires DevOps expertise
- ❌ Need to manage updates
- ❌ Responsible for backups

**Recommendation:** Good middle ground for churches with technical capacity

---

## 🌟 Conclusion

The multi-organization architecture enables ChurchAfrica ChMS to serve:
- **Single churches** (1 org, 1 branch)
- **Churches with satellite branches** (1 org, multiple branches)
- **Denominations** (multiple orgs, each with multiple branches)
- **Church networks** (federation of independent churches)

All while maintaining data isolation, security, and performance for the African context.

---

**Next Steps:**
1. Decide on backend: Keep Supabase vs Laravel migration
2. Implement organization registration flow
3. Add multi-tenancy to existing features
4. Build branch switching UI
5. Implement RLS policies
