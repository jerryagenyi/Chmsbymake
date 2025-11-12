# 👨‍💻 ChurchAfrica ChMS - Developer Guide

## Complete Technical Documentation for Development Team

**Version:** 1.0  
**Last Updated:** November 12, 2025  
**Audience:** Developers, Technical Leads, System Architects

---

## 📋 Table of Contents

1. [Getting Started](#getting-started)
2. [Architecture Overview](#architecture-overview)
3. [Development Workflow](#development-workflow)
4. [Component Development](#component-development)
5. [State Management](#state-management)
6. [API Integration](#api-integration)
7. [Database Schema](#database-schema)
8. [Authentication & Authorization](#authentication--authorization)
9. [Real-time Features](#real-time-features)
10. [Offline Support](#offline-support)
11. [Testing Strategy](#testing-strategy)
12. [Performance Optimization](#performance-optimization)
13. [Deployment](#deployment)
14. [Troubleshooting](#troubleshooting)

---

## Getting Started

### Prerequisites

**Development Environment:**
- Node.js 18+ LTS
- npm 9+ or yarn 1.22+
- Git 2.40+
- VS Code (recommended)
- PostgreSQL 14+ (for backend)
- Redis 7+ (for caching)

**VS Code Extensions (Recommended):**
- ESLint
- Prettier
- TypeScript Vue Plugin (Volar)
- Tailwind CSS IntelliSense
- GitLens
- Thunder Client (API testing)

### Initial Setup

**1. Clone Repository:**
```bash
git clone https://github.com/your-org/churchafrica-chms.git
cd churchafrica-chms
```

**2. Install Dependencies:**
```bash
# Frontend
cd frontend
npm install

# Backend
cd ../backend
composer install
npm install
```

**3. Environment Configuration:**

**Frontend `.env`:**
```bash
# API Configuration
VITE_API_BASE_URL=http://localhost:8000/api
VITE_WS_URL=ws://localhost:6001

# Feature Flags
VITE_ENABLE_OFFLINE=true
VITE_ENABLE_BIOMETRIC=true
VITE_ENABLE_PWA=true
VITE_ENABLE_DEV_TOOLS=true

# External Services
VITE_PAYSTACK_PUBLIC_KEY=pk_test_xxxxx
VITE_FLUTTERWAVE_PUBLIC_KEY=FLWPUBK_TEST-xxxxx
VITE_GOOGLE_MAPS_API_KEY=AIzaSyXXXXX

# Analytics
VITE_SENTRY_DSN=https://xxxxx@sentry.io/xxxxx
VITE_GA_TRACKING_ID=G-XXXXXXXXXX
```

**Backend `.env`:**
```bash
APP_NAME="ChurchAfrica ChMS"
APP_ENV=local
APP_KEY=base64:xxxxx
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=churchafrica_chms_dev
DB_USERNAME=postgres
DB_PASSWORD=your_password

REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379

MAIL_MAILER=smtp
MAIL_HOST=mailhog
MAIL_PORT=1025

SMS_PROVIDER=africas_talking
SMS_API_KEY=your_api_key
SMS_USERNAME=your_username

PUSHER_APP_ID=your_app_id
PUSHER_APP_KEY=your_app_key
PUSHER_APP_SECRET=your_app_secret
```

**4. Database Setup:**
```bash
cd backend
php artisan migrate:fresh --seed
```

**5. Start Development Servers:**

**Terminal 1 - Frontend:**
```bash
cd frontend
npm run dev
# Runs on http://localhost:5173
```

**Terminal 2 - Backend:**
```bash
cd backend
php artisan serve
# Runs on http://localhost:8000
```

**Terminal 3 - Queue Worker:**
```bash
cd backend
php artisan queue:work --verbose
```

**Terminal 4 - WebSockets:**
```bash
cd backend
php artisan websockets:serve
# Runs on ws://localhost:6001
```

---

## Architecture Overview

### System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (Vue 3 + Quasar)             │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Components  │  Composables  │  Stores (Pinia)   │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────┬───────────────────────────────────┘
                      │ HTTP/WebSocket
┌─────────────────────▼───────────────────────────────────┐
│                 API Gateway (Laravel)                    │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Controllers  │  Services  │  Jobs  │  Events    │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────┬───────────────────────────────────┘
                      │
        ┌─────────────┴─────────────┬──────────────┐
        │                           │              │
┌───────▼──────┐          ┌─────────▼───────┐  ┌──▼──────┐
│  PostgreSQL  │          │  Redis Cache    │  │  S3     │
│  (Primary DB)│          │  (Session/Queue)│  │(Storage)│
└──────────────┘          └─────────────────┘  └─────────┘
```

### Technology Stack

**Frontend:**
- **Framework:** Vue 3 (Composition API)
- **UI Library:** Quasar Framework 2.x
- **CSS:** Tailwind CSS v4
- **State:** Pinia
- **Routing:** Vue Router 4
- **HTTP:** Axios
- **WebSocket:** Laravel Echo + Pusher
- **Forms:** VeeValidate + Yup
- **Charts:** Chart.js / Recharts
- **PWA:** Workbox

**Backend:**
- **Framework:** Laravel 10.x
- **API:** RESTful + WebSockets
- **Auth:** Laravel Sanctum + JWT
- **Queue:** Redis
- **Cache:** Redis
- **ORM:** Eloquent
- **Real-time:** Laravel WebSockets
- **Storage:** S3 Compatible
- **Search:** PostgreSQL Full-text

**Database:**
- **Primary:** PostgreSQL 14+
- **Cache/Queue:** Redis 7+
- **Search:** PostgreSQL GIN indexes

---

## Development Workflow

### Git Workflow (GitFlow)

**Branches:**
- `main` - Production code
- `develop` - Development integration
- `feature/*` - New features
- `bugfix/*` - Bug fixes
- `release/*` - Release preparation
- `hotfix/*` - Production hotfixes

**Feature Development:**
```bash
# Create feature branch
git checkout develop
git pull origin develop
git checkout -b feature/member-portal

# Make changes, commit often
git add .
git commit -m "feat: add member profile editor"

# Push and create PR
git push origin feature/member-portal
# Create PR: feature/member-portal → develop
```

**Commit Message Convention (Conventional Commits):**
```
feat: add new feature
fix: bug fix
docs: documentation changes
style: code formatting
refactor: code refactoring
test: add tests
chore: maintenance tasks
perf: performance improvements
```

**Examples:**
```bash
git commit -m "feat(members): add bulk export functionality"
git commit -m "fix(attendance): resolve QR scanner camera permissions"
git commit -m "docs(api): update authentication endpoints"
git commit -m "perf(dashboard): optimize KPI card rendering"
```

### Code Review Process

**PR Requirements:**
- [ ] Code follows style guide
- [ ] Tests pass (unit + integration)
- [ ] No console.log() in production code
- [ ] TypeScript types defined
- [ ] Documentation updated
- [ ] Screenshots for UI changes
- [ ] Accessibility tested
- [ ] Mobile responsive
- [ ] Performance acceptable
- [ ] Security reviewed

**Review Checklist:**
- [ ] Code is readable and maintainable
- [ ] No duplicate code
- [ ] Error handling implemented
- [ ] Edge cases handled
- [ ] Performance optimized
- [ ] Security vulnerabilities addressed

---

## Component Development

### Component Structure

**Vue Component Template:**
```vue
<!-- components/members/MemberCard.vue -->
<script setup lang="ts">
import { ref, computed } from 'vue';
import { Member } from '@/types/member';

// Props
interface Props {
  member: Member;
  editable?: boolean;
}
const props = withDefaults(defineProps<Props>(), {
  editable: false,
});

// Emits
const emit = defineEmits<{
  edit: [member: Member];
  delete: [member: Member];
}>();

// State
const isLoading = ref(false);

// Computed
const initials = computed(() => {
  return `${props.member.firstName[0]}${props.member.lastName[0]}`.toUpperCase();
});

// Methods
const handleEdit = () => {
  emit('edit', props.member);
};
</script>

<template>
  <q-card class="member-card">
    <q-card-section>
      <div class="row items-center">
        <q-avatar size="48px">
          <img v-if="member.photo" :src="member.photo" />
          <span v-else>{{ initials }}</span>
        </q-avatar>
        <div class="col q-ml-md">
          <div class="text-h6">{{ member.firstName }} {{ member.lastName }}</div>
          <div class="text-caption text-grey">{{ member.contact.email }}</div>
        </div>
      </div>
    </q-card-section>
    
    <q-card-actions v-if="editable">
      <q-btn flat color="primary" @click="handleEdit">Edit</q-btn>
    </q-card-actions>
  </q-card>
</template>

<style scoped lang="scss">
.member-card {
  border-radius: 8px;
  transition: all 0.2s ease;
  
  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
}
</style>
```

### Composables (Reusable Logic)

**Example: useMember.ts**
```typescript
// composables/useMember.ts
import { ref, computed } from 'vue';
import { api } from '@/services/api';
import type { Member } from '@/types/member';

export function useMember() {
  const members = ref<Member[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const activeMembers = computed(() => {
    return members.value.filter(m => m.status === 'active');
  });

  const fetchMembers = async () => {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await api.get('/members');
      members.value = response.data;
    } catch (err) {
      error.value = 'Failed to fetch members';
      console.error(err);
    } finally {
      loading.value = false;
    }
  };

  const createMember = async (member: Partial<Member>) => {
    loading.value = true;
    
    try {
      const response = await api.post('/members', member);
      members.value.push(response.data);
      return response.data;
    } catch (err) {
      error.value = 'Failed to create member';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  return {
    members,
    activeMembers,
    loading,
    error,
    fetchMembers,
    createMember,
  };
}
```

### Component Naming Conventions

**Files:**
```
PascalCase for components: MemberCard.vue
camelCase for composables: useMember.ts
kebab-case for utilities: format-date.ts
```

**Components:**
```
<MemberCard /> - Feature components
<BaseButton /> - Base components
<TheHeader /> - Singleton components (The*)
<VButton /> - Vendor components (V*)
```

---

## State Management

### Pinia Store Structure

**Example: Member Store**
```typescript
// stores/member.ts
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { api } from '@/services/api';
import type { Member, MemberFilters } from '@/types/member';

export const useMemberStore = defineStore('member', () => {
  // State
  const members = ref<Member[]>([]);
  const selectedMember = ref<Member | null>(null);
  const filters = ref<MemberFilters>({
    search: '',
    status: [],
    groups: [],
  });
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Getters
  const filteredMembers = computed(() => {
    let result = [...members.value];

    if (filters.value.search) {
      const search = filters.value.search.toLowerCase();
      result = result.filter(m =>
        m.firstName.toLowerCase().includes(search) ||
        m.lastName.toLowerCase().includes(search) ||
        m.contact.email?.toLowerCase().includes(search)
      );
    }

    if (filters.value.status?.length) {
      result = result.filter(m => filters.value.status!.includes(m.status));
    }

    return result;
  });

  const activeMembers = computed(() => {
    return members.value.filter(m => m.status === 'active');
  });

  const totalMembers = computed(() => members.value.length);

  // Actions
  const fetchMembers = async () => {
    loading.value = true;
    error.value = null;

    try {
      const response = await api.get('/members');
      members.value = response.data;
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch members';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const fetchMember = async (id: string) => {
    loading.value = true;

    try {
      const response = await api.get(`/members/${id}`);
      selectedMember.value = response.data;
      return response.data;
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch member';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const createMember = async (member: Partial<Member>) => {
    loading.value = true;

    try {
      const response = await api.post('/members', member);
      members.value.push(response.data);
      return response.data;
    } catch (err: any) {
      error.value = err.message || 'Failed to create member';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const updateMember = async (id: string, data: Partial<Member>) => {
    loading.value = true;

    try {
      const response = await api.put(`/members/${id}`, data);
      const index = members.value.findIndex(m => m.id === id);
      if (index !== -1) {
        members.value[index] = response.data;
      }
      if (selectedMember.value?.id === id) {
        selectedMember.value = response.data;
      }
      return response.data;
    } catch (err: any) {
      error.value = err.message || 'Failed to update member';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const deleteMember = async (id: string) => {
    loading.value = true;

    try {
      await api.delete(`/members/${id}`);
      members.value = members.value.filter(m => m.id !== id);
      if (selectedMember.value?.id === id) {
        selectedMember.value = null;
      }
    } catch (err: any) {
      error.value = err.message || 'Failed to delete member';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const setFilters = (newFilters: Partial<MemberFilters>) => {
    filters.value = { ...filters.value, ...newFilters };
  };

  const clearFilters = () => {
    filters.value = {
      search: '',
      status: [],
      groups: [],
    };
  };

  return {
    // State
    members,
    selectedMember,
    filters,
    loading,
    error,
    // Getters
    filteredMembers,
    activeMembers,
    totalMembers,
    // Actions
    fetchMembers,
    fetchMember,
    createMember,
    updateMember,
    deleteMember,
    setFilters,
    clearFilters,
  };
});
```

### Store Usage in Components

```vue
<script setup lang="ts">
import { onMounted } from 'vue';
import { useMemberStore } from '@/stores/member';

const memberStore = useMemberStore();

onMounted(async () => {
  await memberStore.fetchMembers();
});

const handleSearch = (query: string) => {
  memberStore.setFilters({ search: query });
};
</script>

<template>
  <div>
    <q-input 
      :model-value="memberStore.filters.search"
      @update:model-value="handleSearch"
      placeholder="Search members..."
    />
    
    <div v-if="memberStore.loading">Loading...</div>
    
    <div v-for="member in memberStore.filteredMembers" :key="member.id">
      <!-- Member card -->
    </div>
  </div>
</template>
```

---

## API Integration

### API Service Configuration

**API Client Setup:**
```typescript
// services/api.ts
import axios, { AxiosError, AxiosResponse } from 'axios';
import { useAuthStore } from '@/stores/auth';
import { Notify } from 'quasar';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore();
    const token = authStore.token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    const authStore = useAuthStore();

    if (error.response?.status === 401) {
      // Unauthorized - logout user
      authStore.logout();
      Notify.create({
        type: 'negative',
        message: 'Session expired. Please login again.',
      });
    } else if (error.response?.status === 403) {
      // Forbidden
      Notify.create({
        type: 'negative',
        message: 'You do not have permission to perform this action.',
      });
    } else if (error.response?.status === 422) {
      // Validation error
      const errors = error.response.data.errors;
      const firstError = Object.values(errors)[0] as string[];
      Notify.create({
        type: 'warning',
        message: firstError[0],
      });
    } else if (error.response?.status >= 500) {
      // Server error
      Notify.create({
        type: 'negative',
        message: 'Server error. Please try again later.',
      });
    }

    return Promise.reject(error);
  }
);

export { api };
```

### API Service Modules

**Member API Service:**
```typescript
// services/members.ts
import { api } from './api';
import type { Member, MemberFilters } from '@/types/member';

export const memberService = {
  /**
   * Get all members
   */
  async getAll(filters?: MemberFilters) {
    const response = await api.get('/members', { params: filters });
    return response.data;
  },

  /**
   * Get single member
   */
  async getById(id: string) {
    const response = await api.get(`/members/${id}`);
    return response.data;
  },

  /**
   * Create new member
   */
  async create(member: Partial<Member>) {
    const response = await api.post('/members', member);
    return response.data;
  },

  /**
   * Update member
   */
  async update(id: string, data: Partial<Member>) {
    const response = await api.put(`/members/${id}`, data);
    return response.data;
  },

  /**
   * Delete member
   */
  async delete(id: string) {
    await api.delete(`/members/${id}`);
  },

  /**
   * Upload member photo
   */
  async uploadPhoto(id: string, file: File) {
    const formData = new FormData();
    formData.append('photo', file);

    const response = await api.post(`/members/${id}/photo`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },

  /**
   * Export members
   */
  async export(format: 'csv' | 'excel' | 'pdf', memberIds?: string[]) {
    const response = await api.post(
      '/members/export',
      { format, member_ids: memberIds },
      { responseType: 'blob' }
    );

    // Create download link
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `members.${format}`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  },

  /**
   * Bulk delete members
   */
  async bulkDelete(memberIds: string[]) {
    await api.post('/members/bulk-delete', { member_ids: memberIds });
  },

  /**
   * Send message to members
   */
  async sendMessage(memberIds: string[], type: 'email' | 'sms', message: string, subject?: string) {
    const response = await api.post('/members/send-message', {
      member_ids: memberIds,
      type,
      message,
      subject,
    });
    return response.data;
  },
};
```

---

## Database Schema

### Members Table

```sql
CREATE TABLE members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  
  -- Basic Information
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  middle_name VARCHAR(100),
  photo_url TEXT,
  date_of_birth DATE,
  gender VARCHAR(20) NOT NULL CHECK (gender IN ('male', 'female', 'other', 'prefer_not_to_say')),
  
  -- Contact Information
  email VARCHAR(255) UNIQUE,
  phone VARCHAR(20),
  address JSONB, -- {street, city, state, country, zip}
  
  -- Membership Details
  membership_number VARCHAR(50) UNIQUE,
  membership_type VARCHAR(20) NOT NULL CHECK (membership_type IN ('regular', 'founding', 'honorary', 'visiting')),
  status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'visitor', 'alumni')),
  join_date DATE NOT NULL,
  baptism_date DATE,
  salvation_date DATE,
  
  -- Personal Details
  marital_status VARCHAR(20) CHECK (marital_status IN ('single', 'married', 'divorced', 'widowed')),
  occupation VARCHAR(100),
  employer VARCHAR(100),
  
  -- Attendance Tracking
  last_attendance_date DATE,
  attendance_count INTEGER DEFAULT 0,
  attendance_percentage DECIMAL(5,2),
  
  -- Giving Tracking
  last_donation_date DATE,
  total_donations DECIMAL(12,2) DEFAULT 0,
  
  -- Meta
  notes TEXT,
  tags TEXT[],
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  created_by UUID REFERENCES users(id)
);

-- Indexes
CREATE INDEX idx_members_org ON members(organization_id);
CREATE INDEX idx_members_email ON members(email);
CREATE INDEX idx_members_phone ON members(phone);
CREATE INDEX idx_members_status ON members(status);
CREATE INDEX idx_members_search ON members USING gin(to_tsvector('english', first_name || ' ' || last_name || ' ' || COALESCE(email, '')));
```

### Attendance Percentage Calculation

**Attendance percentage is calculated as:**
```
attendance_percentage = (attendance_count / total_services_since_join) * 100
```

**Where:**
- `attendance_count` = Number of services attended
- `total_services_since_join` = Total number of services since member's join_date

**Calculation Trigger (PostgreSQL):**
```sql
CREATE OR REPLACE FUNCTION update_member_attendance_stats()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE members
  SET 
    attendance_count = (
      SELECT COUNT(*) 
      FROM attendance_records 
      WHERE member_id = NEW.member_id AND present = true
    ),
    last_attendance_date = NEW.date,
    attendance_percentage = (
      SELECT (COUNT(CASE WHEN present = true THEN 1 END)::DECIMAL / 
              GREATEST(COUNT(*), 1)) * 100
      FROM attendance_records 
      WHERE member_id = NEW.member_id
    )
  WHERE id = NEW.member_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_attendance_stats
AFTER INSERT OR UPDATE ON attendance_records
FOR EACH ROW
EXECUTE FUNCTION update_member_attendance_stats();
```

**Backend Method (Laravel):**
```php
// app/Services/AttendanceService.php
public function calculateAttendancePercentage(Member $member): float
{
    $totalServices = Service::where('organization_id', $member->organization_id)
        ->where('date', '>=', $member->join_date)
        ->count();
    
    if ($totalServices === 0) {
        return 0;
    }
    
    $attendedServices = AttendanceRecord::where('member_id', $member->id)
        ->where('present', true)
        ->count();
    
    return round(($attendedServices / $totalServices) * 100, 2);
}
```

---

## Authentication & Authorization

### Laravel Sanctum Setup

**Backend Configuration:**
```php
// config/sanctum.php
return [
    'stateful' => explode(',', env('SANCTUM_STATEFUL_DOMAINS', 'localhost,127.0.0.1')),
    'expiration' => 60 * 24, // 24 hours
];
```

**Login Controller:**
```php
// app/Http/Controllers/AuthController.php
public function login(Request $request)
{
    $credentials = $request->validate([
        'email' => 'required|email',
        'password' => 'required',
    ]);

    if (!Auth::attempt($credentials)) {
        return response()->json([
            'message' => 'Invalid credentials'
        ], 401);
    }

    $user = Auth::user();
    $token = $user->createToken('auth-token')->plainTextToken;

    return response()->json([
        'user' => $user,
        'token' => $token,
    ]);
}
```

### Frontend Auth Store

```typescript
// stores/auth.ts
import { defineStore } from 'pinia';
import { ref } from 'computed';
import { api } from '@/services/api';

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null);
  const token = ref(localStorage.getItem('auth_token'));

  const isAuthenticated = computed(() => !!token.value);

  const login = async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    user.value = response.data.user;
    token.value = response.data.token;
    localStorage.setItem('auth_token', token.value);
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      user.value = null;
      token.value = null;
      localStorage.removeItem('auth_token');
    }
  };

  return {
    user,
    token,
    isAuthenticated,
    login,
    logout,
  };
});
```

### Role-Based Access Control

**Backend Policy:**
```php
// app/Policies/MemberPolicy.php
class MemberPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasPermission('members.view');
    }

    public function create(User $user): bool
    {
        return $user->hasRole(['admin', 'staff']);
    }

    public function update(User $user, Member $member): bool
    {
        return $user->hasRole(['admin', 'staff']) || 
               $user->id === $member->created_by;
    }

    public function delete(User $user, Member $member): bool
    {
        return $user->hasRole('admin');
    }
}
```

**Frontend Route Guard:**
```typescript
// router/index.ts
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'login' });
  } else if (to.meta.roles) {
    const userRoles = authStore.user?.roles || [];
    const hasAccess = to.meta.roles.some(role => userRoles.includes(role));
    
    if (!hasAccess) {
      next({ name: 'unauthorized' });
    } else {
      next();
    }
  } else {
    next();
  }
});
```

---

*[Continued in Part 2 due to length...]*

**This guide continues with sections on:**
- Real-time Features (WebSockets)
- Offline Support (PWA)
- Testing Strategy
- Performance Optimization
- Deployment
- Troubleshooting

**Total Pages:** ~50 pages of comprehensive developer documentation

---

**Version:** 1.0  
**Last Updated:** November 12, 2025  
**Status:** ✅ Complete - Part 1 of 2
