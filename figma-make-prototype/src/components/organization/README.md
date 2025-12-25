# Multi-Organization Management System

## Overview
Complete multi-tenant architecture supporting churches with multiple branches across different locations.

## Features

### ✅ Implemented

#### Organization Setup Wizard
- **4-Step Setup Process**
  1. Organization Details (name, type, denomination)
  2. Location & Contact (country, city, address, phone, email)
  3. Admin Account (name, email, phone)
  4. Preferences (timezone, currency, language)
  
- Progress tracking
- Step validation
- Visual indicators
- Help text

#### Organization Management
- **Overview Dashboard**
  - Total branches
  - Total members (cross-branch)
  - Total services
  - Organization details
  
- **Branch Management**
  - List all branches
  - Search branches
  - View branch details
  - Edit branch information
  - Delete branch (except HQ)
  - Branch statistics
  
- **Service Management**
  - View services per branch
  - Service schedules
  - Hybrid/Online/Physical services
  - Edit/Delete services
  
- **Analytics**
  - Cross-branch comparison
  - Capacity utilization
  - Attendance trends
  - Performance metrics

#### Mock Data
- 1 Organization (Victory Chapel Ministry)
- 3 Branches (Lagos HQ, Abuja, Accra)
- 8 Services across all branches
- Realistic African locations and data

### 🔄 Future Enhancements
- Branch creation wizard
- Service templates
- Staff/Pastor assignments
- Financial reporting (cross-branch)
- Resource sharing between branches
- Inter-branch transfers
- Consolidated reports
- Branch permissions
- Custom roles per branch
- Branch-specific branding

## 3-Tier Architecture

```
ORGANIZATION (Victory Chapel Ministry)
  │
  ├─ BRANCH (Lagos HQ)
  │   ├─ Service: Sunday 1st (8:00 AM)
  │   ├─ Service: Sunday 2nd (10:30 AM)
  │   ├─ Service: Midweek (Wed 6:00 PM)
  │   ├─ Service: Youth (Fri 5:00 PM)
  │   └─ Members: 850
  │
  ├─ BRANCH (Abuja)
  │   ├─ Service: Sunday (9:00 AM)
  │   ├─ Service: Midweek (Wed 5:30 PM)
  │   └─ Members: 320
  │
  └─ BRANCH (Accra, Ghana)
      ├─ Service: Sunday (10:00 AM)
      ├─ Service: Prayer (Tue 6:00 PM)
      └─ Members: 180
```

## Data Models

### Organization
```typescript
{
  id: string;
  name: string;
  type: 'denomination' | 'independent' | 'network';
  headquarters: {
    country, city, address, phone, email
  };
  settings: {
    timezone, currency, language,
    features: { multipleServices, onlineGiving, ... }
  };
  subscription: {
    plan: 'free' | 'basic' | 'premium' | 'enterprise';
    maxBranches, maxMembersPerBranch
  };
}
```

### Branch
```typescript
{
  id: string;
  organizationId: string;
  name: string;
  code: string; // "VCL", "VCA"
  type: 'headquarters' | 'branch' | 'cell';
  isHeadquarters: boolean;
  location: {
    country, state, city, address,
    coordinates: { latitude, longitude },
    timezone
  };
  leadership: {
    headPastorId,
    assistantPastorIds,
    administratorId
  };
  facilities: {
    mainAuditoriumCapacity,
    hasChildrenChurch,
    hasMediaEquipment
  };
  metadata: {
    memberCount,
    averageAttendance
  };
}
```

### BranchService
```typescript
{
  id: string;
  branchId: string;
  organizationId: string;
  name: string;
  type: 'sunday' | 'midweek' | 'youth' | 'prayer';
  schedule: {
    dayOfWeek, startTime, endTime, duration
  };
  location: {
    venue,
    venueType: 'physical' | 'online' | 'hybrid',
    onlineLink?
  };
  expectedAttendance: number;
}
```

## Permission System

### Roles
- **Super Admin**: Platform-level access (all organizations)
- **Org Admin**: All branches in organization
- **Branch Admin**: Single branch only
- **Pastor**: Branch with limited permissions
- **Dept Head**: Department only
- **Staff**: Limited access
- **Volunteer**: Very limited access

### Permission Matrix
| Action | Super Admin | Org Admin | Branch Admin | Pastor | Staff |
|--------|------------|-----------|--------------|--------|-------|
| Create branches | ✅ | ✅ | ❌ | ❌ | ❌ |
| View all branches | ✅ | ✅ | ❌ | ❌ | ❌ |
| Manage own branch | ✅ | ✅ | ✅ | ✅ | ❌ |
| Add members | ✅ | ✅ | ✅ | ✅ | ✅ |
| View reports | ✅ | ✅ | ✅ | Partial | Own dept |
| Financial access | ✅ | ✅ | ✅ | ❌ | ❌ |

## Database Schema

### Row Level Security (RLS)
```sql
-- Organizations
CREATE POLICY "org_access" ON organizations
  USING (
    id IN (
      SELECT organization_id 
      FROM user_organization_access 
      WHERE user_id = auth.uid()
    )
  );

-- Branches
CREATE POLICY "branch_access" ON branches
  USING (
    organization_id IN (
      SELECT organization_id 
      FROM user_organization_access 
      WHERE user_id = auth.uid()
    )
  );

-- Members (scoped to user's branches)
CREATE POLICY "member_branch_access" ON members
  USING (
    branch_id IN (
      SELECT branch_id 
      FROM user_branch_access 
      WHERE user_id = auth.uid()
    )
  );
```

## Migration Guide

### From Single Org to Multi-Org

```typescript
// 1. Create default organization
const defaultOrg = {
  id: 'org_default',
  name: 'My Church',
  // ... other fields
};

// 2. Create default branch
const defaultBranch = {
  id: 'branch_default',
  organizationId: 'org_default',
  name: 'Main Branch',
  isHeadquarters: true
};

// 3. Update existing data
UPDATE members 
SET organization_id = 'org_default', 
    branch_id = 'branch_default';

UPDATE services 
SET organization_id = 'org_default', 
    branch_id = 'branch_default';
```

## API Endpoints (Planned)

```
POST   /api/organizations                    Create org
GET    /api/organizations/:id                Get org
PATCH  /api/organizations/:id                Update org

POST   /api/organizations/:id/branches       Create branch
GET    /api/organizations/:id/branches       List branches
GET    /api/branches/:id                     Get branch
PATCH  /api/branches/:id                     Update branch
DELETE /api/branches/:id                     Delete branch

GET    /api/branches/:id/services            List services
POST   /api/branches/:id/services            Create service
PATCH  /api/services/:id                     Update service
DELETE /api/services/:id                     Delete service

GET    /api/branches/:id/members             List members
POST   /api/branches/:id/members             Add member
```

## Usage

### Setup New Organization
```tsx
import { OrganizationSetup } from './components/organization';

function App() {
  return <OrganizationSetup />;
}
```

### Manage Organization
```tsx
import { OrganizationManagement } from './components/organization';

function App() {
  return <OrganizationManagement />;
}
```

## Subscription Plans

### Free Plan
- 1 branch
- 100 members
- Basic features

### Basic Plan ($25/month)
- 5 branches
- 500 members per branch
- All features
- Email support

### Premium Plan ($75/month)
- 20 branches
- 5,000 members per branch
- All features
- Priority support
- Custom branding

### Enterprise Plan (Custom)
- Unlimited branches
- Unlimited members
- Dedicated support
- White-label option
- On-premise deployment

## Africa-First Considerations

### Currency Support
- NGN (Nigeria)
- KES (Kenya)
- GHS (Ghana)
- ZAR (South Africa)
- TZS (Tanzania)
- UGX (Uganda)
- USD (Universal)

### Timezone Support
- Africa/Lagos (WAT)
- Africa/Nairobi (EAT)
- Africa/Johannesburg (SAST)
- Africa/Accra (GMT)

### Language Support
- English
- French
- Portuguese
- Swahili

## Testing Scenarios

1. Create new organization
2. Add multiple branches
3. Assign services to branches
4. View cross-branch analytics
5. Search branches by location
6. Edit branch details
7. Delete non-HQ branch
8. View service schedules
9. Compare branch performance
10. Check capacity utilization

## Security Considerations

- **Data Isolation**: RLS ensures branch data separation
- **Role Validation**: Server-side permission checks
- **Audit Logging**: Track who did what and when
- **Secure Invites**: Time-limited invitation links
- **Data Export**: GDPR-compliant data export

## Performance Optimization

- **Caching**: Cache organization/branch data
- **Lazy Loading**: Load branches on demand
- **Pagination**: Limit results per page
- **Indexing**: Database indexes on orgId, branchId
- **CDN**: Serve static assets from CDN
