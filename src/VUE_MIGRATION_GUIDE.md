# 🔄 Vue 3 + Quasar Migration Guide

## 📋 Overview

This guide provides step-by-step instructions for converting the ChurchAfrica ChMS React prototype to Vue 3 + Quasar production implementation.

**Source Stack:** React 18 + TypeScript + Tailwind CSS + ShadCN UI  
**Target Stack:** Vue 3 + TypeScript + Quasar Framework + Tailwind CSS  
**Build Tool:** Vite (both)  
**State Management:** React Context → Pinia Stores  
**Routing:** React Router → Vue Router

---

## 🎯 Quick Migration Checklist

- [ ] Install Quasar CLI
- [ ] Create Quasar project with TypeScript
- [ ] Set up Tailwind CSS in Quasar
- [ ] Configure Pinia stores
- [ ] Set up Vue Router
- [ ] Install dependencies (axios, date-fns, etc.)
- [ ] Create type definitions from React types
- [ ] Convert components one module at a time
- [ ] Set up authentication
- [ ] Configure API client
- [ ] Test each feature thoroughly

---

## 🚀 Project Setup

### 1. Create Quasar Project

```bash
npm create quasar@latest churchafrica-chms-vue

# Choose:
# - TypeScript: Yes
# - Vite: Yes
# - Pinia: Yes
# - Router: Yes
# - ESLint: Yes
# - Prettier: Yes
```

### 2. Install Dependencies

```bash
cd churchafrica-chms-vue
npm install

# Core dependencies
npm install axios pinia date-fns qrcode zod

# UI/UX
npm install @vueuse/core motion-v

# Charts
npm install echarts vue-echarts

# QR Code
npm install qrcode-vue3

# Additional
npm install lodash-es @types/lodash-es
```

### 3. Configure Tailwind CSS

```bash
npm install -D tailwindcss@latest postcss autoprefixer
npx tailwindcss init -p
```

**quasar.config.js:**
```javascript
module.exports = function (ctx) {
  return {
    css: ['app.css'], // Import Tailwind
    build: {
      postcss: true,
    },
  };
};
```

**src/css/app.css:**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Copy globals from React prototype */
@layer base {
  :root {
    --primary: #1CE479;
    --background: #0A0A0F;
    --card: #1A1A20;
    --border: #2A2A30;
  }
  
  * {
    font-family: 'Archivo', system-ui, sans-serif;
  }
}
```

---

## 🔄 Component Conversion Patterns

### Pattern 1: Basic Component

**React (Before):**
```tsx
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';

interface MemberCardProps {
  member: Member;
  onEdit?: (member: Member) => void;
}

export const MemberCard: React.FC<MemberCardProps> = ({ member, onEdit }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card className="bg-[#1A1A20] border-[#2A2A30]">
      <CardHeader>
        <CardTitle>{member.firstName} {member.lastName}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{member.contact.email}</p>
        <Button onClick={() => onEdit?.(member)}>Edit</Button>
      </CardContent>
    </Card>
  );
};
```

**Vue 3 (After):**
```vue
<template>
  <q-card class="bg-[#1A1A20] border-[#2A2A30]">
    <q-card-section>
      <div class="text-h6">{{ member.firstName }} {{ member.lastName }}</div>
    </q-card-section>
    
    <q-card-section>
      <p>{{ member.contact.email }}</p>
      <q-btn 
        color="primary" 
        label="Edit" 
        @click="$emit('edit', member)"
      />
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { Member } from '@/types/member';

interface Props {
  member: Member;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  edit: [member: Member];
}>();

const expanded = ref(false);
</script>

<style scoped>
/* Component-specific styles */
</style>
```

---

### Pattern 2: State Management (Context → Pinia)

**React Context (Before):**
```tsx
// contexts/AuthContext.tsx
import React, { createContext, useContext, useState } from 'react';

interface AuthContextType {
  user: User | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (credentials: LoginCredentials) => {
    const response = await api.login(credentials);
    setUser(response.user);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
```

**Pinia Store (After):**
```typescript
// stores/auth.ts
import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { User, LoginCredentials } from '@/types/auth';
import { api } from '@/services/api';

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(null);
  const token = ref<string | null>(localStorage.getItem('token'));

  // Getters
  const isAuthenticated = computed(() => !!user.value);
  const userRole = computed(() => user.value?.role);

  // Actions
  async function login(credentials: LoginCredentials) {
    try {
      const response = await api.login(credentials);
      user.value = response.user;
      token.value = response.token;
      localStorage.setItem('token', response.token);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }

  function logout() {
    user.value = null;
    token.value = null;
    localStorage.removeItem('token');
  }

  async function fetchUser() {
    if (!token.value) return;
    try {
      const response = await api.getCurrentUser();
      user.value = response.user;
    } catch (error) {
      logout();
    }
  }

  return {
    user,
    token,
    isAuthenticated,
    userRole,
    login,
    logout,
    fetchUser,
  };
});
```

**Using in Component:**
```vue
<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();

// Access state
console.log(authStore.user);

// Call actions
authStore.login({ email: 'user@example.com', password: 'pass' });
</script>
```

---

### Pattern 3: Routing (React Router → Vue Router)

**React Router (Before):**
```tsx
// App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/members" element={<MemberList />} />
        <Route path="/members/:id" element={<MemberDetail />} />
        <Route path="/attendance" element={<AttendanceTracker />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
```

**Vue Router (After):**
```typescript
// router/index.ts
import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const routes = [
  {
    path: '/',
    name: 'dashboard',
    component: () => import('@/pages/Dashboard.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/members',
    name: 'members',
    component: () => import('@/pages/MemberList.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/members/:id',
    name: 'member-detail',
    component: () => import('@/pages/MemberDetail.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/attendance',
    name: 'attendance',
    component: () => import('@/pages/AttendanceTracker.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/pages/Login.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/pages/NotFound.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation guard
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'login', query: { redirect: to.fullPath } });
  } else {
    next();
  }
});

export default router;
```

---

### Pattern 4: Forms (React Hook Form → Quasar Forms)

**React Hook Form (Before):**
```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  firstName: z.string().min(1, 'First name required'),
  email: z.string().email('Invalid email'),
  phone: z.string().min(10, 'Phone must be 10+ digits'),
});

export const MemberForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input {...register('firstName')} />
      {errors.firstName && <span>{errors.firstName.message}</span>}
      
      <Input {...register('email')} />
      {errors.email && <span>{errors.email.message}</span>}
      
      <Button type="submit">Submit</Button>
    </form>
  );
};
```

**Quasar Forms (After):**
```vue
<template>
  <q-form @submit="onSubmit" class="q-gutter-md">
    <q-input
      v-model="form.firstName"
      label="First Name"
      :rules="[val => !!val || 'First name required']"
      lazy-rules
    />
    
    <q-input
      v-model="form.email"
      type="email"
      label="Email"
      :rules="[
        val => !!val || 'Email required',
        val => /.+@.+\..+/.test(val) || 'Invalid email'
      ]"
      lazy-rules
    />
    
    <q-input
      v-model="form.phone"
      label="Phone"
      mask="(###) ### - ####"
      :rules="[val => val?.length >= 10 || 'Phone must be 10+ digits']"
      lazy-rules
    />
    
    <q-btn label="Submit" type="submit" color="primary" />
  </q-form>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { useQuasar } from 'quasar';

const $q = useQuasar();

const form = reactive({
  firstName: '',
  email: '',
  phone: '',
});

function onSubmit() {
  console.log(form);
  $q.notify({
    type: 'positive',
    message: 'Form submitted!',
  });
}
</script>
```

---

### Pattern 5: Async Data Fetching (useEffect → onMounted)

**React (Before):**
```tsx
import { useState, useEffect } from 'react';

export const MemberList = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const data = await api.getMembers();
        setMembers(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {members.map(member => (
        <MemberCard key={member.id} member={member} />
      ))}
    </div>
  );
};
```

**Vue 3 (After):**
```vue
<template>
  <div v-if="loading" class="text-center">
    <q-spinner size="50px" color="primary" />
  </div>
  
  <div v-else>
    <member-card 
      v-for="member in members" 
      :key="member.id" 
      :member="member"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { Member } from '@/types/member';
import { api } from '@/services/api';
import MemberCard from '@/components/MemberCard.vue';

const members = ref<Member[]>([]);
const loading = ref(true);

onMounted(async () => {
  try {
    const data = await api.getMembers();
    members.value = data;
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
});
</script>
```

---

## 🎨 UI Component Mapping

### ShadCN UI → Quasar Components

| React (ShadCN) | Vue (Quasar) | Notes |
|----------------|--------------|-------|
| `<Card>` | `<q-card>` | Direct replacement |
| `<Button>` | `<q-btn>` | Similar API |
| `<Input>` | `<q-input>` | Built-in validation |
| `<Select>` | `<q-select>` | More features |
| `<Dialog>` | `<q-dialog>` | Composition API |
| `<Badge>` | `<q-badge>` or `<q-chip>` | Multiple styles |
| `<Avatar>` | `<q-avatar>` | Same concept |
| `<Tabs>` | `<q-tabs>` + `<q-tab-panels>` | Similar |
| `<Table>` | `<q-table>` | Very powerful |
| `<Switch>` | `<q-toggle>` | Same functionality |
| `<Checkbox>` | `<q-checkbox>` | Direct replacement |
| `<Alert>` | `<q-banner>` or `$q.notify()` | Choose based on use |
| `<Progress>` | `<q-linear-progress>` | Same concept |
| `<Sheet>` | `<q-drawer>` | Sidebar/drawer |
| `<Popover>` | `<q-menu>` | Context menus |
| `<Tooltip>` | `<q-tooltip>` | Hover tooltips |
| `<Separator>` | `<q-separator>` | Divider lines |
| `<Skeleton>` | `<q-skeleton>` | Loading placeholders |

### Custom Tailwind Classes

Both React and Vue can use the same Tailwind classes:
- `bg-[#1A1A20]` - Card background
- `border-[#2A2A30]` - Border color
- `text-[#1CE479]` - Primary green
- `bg-[#0A0A0F]` - Dark background

---

## 🔧 API Service Setup

**src/services/api.ts:**
```typescript
import axios from 'axios';
import { useAuthStore } from '@/stores/auth';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add auth token
apiClient.interceptors.request.use((config) => {
  const authStore = useAuthStore();
  if (authStore.token) {
    config.headers.Authorization = `Bearer ${authStore.token}`;
  }
  return config;
});

// Response interceptor - handle errors
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      const authStore = useAuthStore();
      authStore.logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const api = {
  // Auth
  login: (credentials) => apiClient.post('/auth/login', credentials),
  register: (data) => apiClient.post('/auth/register', data),
  logout: () => apiClient.post('/auth/logout'),
  
  // Members
  getMembers: () => apiClient.get('/members'),
  getMember: (id) => apiClient.get(`/members/${id}`),
  createMember: (data) => apiClient.post('/members', data),
  updateMember: (id, data) => apiClient.put(`/members/${id}`, data),
  deleteMember: (id) => apiClient.delete(`/members/${id}`),
  
  // Attendance
  getAttendance: (params) => apiClient.get('/attendance', { params }),
  checkIn: (data) => apiClient.post('/attendance/checkin', data),
  
  // Events
  getEvents: () => apiClient.get('/events'),
  getEvent: (id) => apiClient.get(`/events/${id}`),
  createEvent: (data) => apiClient.post('/events', data),
  
  // Giving
  getDonations: (params) => apiClient.get('/donations', { params }),
  createDonation: (data) => apiClient.post('/donations', data),
  
  // Add all other endpoints from API_SPECIFICATION.md
};
```

---

## 📱 Mobile-First Quasar Features

### 1. Platform Detection

```vue
<script setup lang="ts">
import { useQuasar } from 'quasar';

const $q = useQuasar();

// Check platform
console.log($q.platform.is.mobile); // true on mobile
console.log($q.platform.is.desktop); // true on desktop
console.log($q.platform.is.ios); // true on iOS
console.log($q.platform.is.android); // true on Android
</script>
```

### 2. Responsive Layout

```vue
<template>
  <q-layout view="lHh Lpr lFf">
    <!-- Header -->
    <q-header elevated class="bg-[#1A1A20]">
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />
        <q-toolbar-title>ChurchAfrica ChMS</q-toolbar-title>
      </q-toolbar>
    </q-header>

    <!-- Drawer/Sidebar -->
    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      :width="250"
      :breakpoint="768"
      class="bg-[#0A0A0F]"
    >
      <!-- Navigation items -->
    </q-drawer>

    <!-- Page Content -->
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>
```

### 3. Touch Gestures

```vue
<template>
  <div v-touch-swipe.left="onSwipeLeft" v-touch-swipe.right="onSwipeRight">
    Swipe me!
  </div>
</template>

<script setup lang="ts">
function onSwipeLeft() {
  console.log('Swiped left');
}

function onSwipeRight() {
  console.log('Swiped right');
}
</script>
```

---

## 🎯 Module-by-Module Migration Plan

### Phase 1: Foundation (Week 1)
- [ ] Set up Quasar project
- [ ] Configure Tailwind CSS
- [ ] Create type definitions
- [ ] Set up API client
- [ ] Create auth store (Pinia)
- [ ] Implement login/register pages
- [ ] Set up routing with guards

### Phase 2: Core Features (Week 2-3)
- [ ] **Dashboard**
  - KPI cards
  - Charts (use vue-echarts)
  - Activity feed
  - Quick actions

- [ ] **Members**
  - Member list with filters
  - Member detail page
  - Add/edit member form
  - Member search

### Phase 3: Attendance & Events (Week 4-5)
- [ ] **Attendance**
  - QR code generator (qrcode-vue3)
  - QR code scanner
  - Check-in interface
  - Attendance reports

- [ ] **Events**
  - Event calendar (q-date)
  - Event list with filters
  - Event registration
  - Event management

### Phase 4: Advanced Features (Week 6-7)
- [ ] **Giving/Donations**
  - Donation dashboard
  - Donation form
  - Campaign manager
  - Reports

- [ ] **Chat**
  - Real-time messaging (Socket.io)
  - Chat interface
  - Notifications

- [ ] **Organization**
  - Multi-org support
  - Branch management
  - Settings

### Phase 5: Member Portal (Week 8)
- [ ] **Member Self-Service**
  - Member login (5 methods)
  - Member dashboard
  - Profile editor
  - Family management
  - Biometric enrollment
  - Service QR generator
  - Check-in kiosk

### Phase 6: Reports & Analytics (Week 9)
- [ ] **Reports**
  - Report templates
  - Export functionality
  - Donor statements
  - Tax receipts

- [ ] **Analytics**
  - Membership analytics
  - Attendance analytics
  - Giving analytics
  - Church health metrics

### Phase 7: Polish & Testing (Week 10)
- [ ] PWA configuration
- [ ] Offline functionality
- [ ] Performance optimization
- [ ] Cross-browser testing
- [ ] Mobile testing
- [ ] Documentation

---

## 🚨 Common Pitfalls & Solutions

### 1. Reactivity Issues

**Problem:** Vue 3 reactivity doesn't work
```javascript
// ❌ Wrong
const state = { count: 0 };
state.count++; // Not reactive

// ✅ Correct
const state = reactive({ count: 0 });
state.count++; // Reactive

// Or use ref for primitives
const count = ref(0);
count.value++; // Reactive
```

### 2. Template Refs

**Problem:** Accessing DOM elements
```vue
<template>
  <input ref="inputRef" />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

const inputRef = ref<HTMLInputElement | null>(null);

onMounted(() => {
  inputRef.value?.focus();
});
</script>
```

### 3. Watch vs WatchEffect

```typescript
// Watch specific value
watch(() => props.memberId, (newId, oldId) => {
  console.log('Member ID changed:', newId);
});

// WatchEffect - runs immediately and tracks dependencies
watchEffect(() => {
  console.log('Member:', props.memberId);
  // Automatically re-runs when props.memberId changes
});
```

### 4. Computed Properties

```typescript
const fullName = computed(() => {
  return `${member.value.firstName} ${member.value.lastName}`;
});

// Use in template as: {{ fullName }}
// Not: {{ fullName() }}
```

---

## 🎨 Theming & Styling

### Quasar Theme Configuration

**quasar.config.js:**
```javascript
module.exports = function (ctx) {
  return {
    framework: {
      config: {
        brand: {
          primary: '#1CE479', // Green
          secondary: '#0A0A0F', // Dark background
          accent: '#1A1A20', // Card background
          dark: '#0A0A0F',
          positive: '#1CE479',
          negative: '#C10015',
          info: '#31CCEC',
          warning: '#F2C037',
        },
      },
    },
  };
};
```

### Dark Mode (Built-in)

```vue
<script setup lang="ts">
import { useQuasar } from 'quasar';

const $q = useQuasar();

// Toggle dark mode
$q.dark.set(true);  // Enable
$q.dark.set(false); // Disable
$q.dark.toggle();   // Toggle
$q.dark.set('auto'); // Auto based on OS
</script>
```

---

## 🧪 Testing Strategy

### Unit Testing (Vitest)

```typescript
// MemberCard.spec.ts
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import MemberCard from '@/components/MemberCard.vue';

describe('MemberCard', () => {
  it('renders member name', () => {
    const wrapper = mount(MemberCard, {
      props: {
        member: {
          id: '1',
          firstName: 'John',
          lastName: 'Doe',
        },
      },
    });

    expect(wrapper.text()).toContain('John Doe');
  });

  it('emits edit event', async () => {
    const wrapper = mount(MemberCard, { /* props */ });
    await wrapper.find('.edit-btn').trigger('click');
    
    expect(wrapper.emitted('edit')).toBeTruthy();
  });
});
```

### E2E Testing (Cypress)

```javascript
// login.cy.js
describe('Login Flow', () => {
  it('logs in successfully', () => {
    cy.visit('/login');
    cy.get('[data-cy=email]').type('admin@church.com');
    cy.get('[data-cy=password]').type('password123');
    cy.get('[data-cy=submit]').click();
    
    cy.url().should('include', '/dashboard');
    cy.contains('Welcome back').should('be.visible');
  });
});
```

---

## 📚 Resources

### Official Documentation
- [Vue 3 Docs](https://vuejs.org/)
- [Quasar Framework](https://quasar.dev/)
- [Pinia](https://pinia.vuejs.org/)
- [Vue Router](https://router.vuejs.org/)
- [VueUse](https://vueuse.org/) - Vue composables

### Migration Guides
- [React to Vue Cheat Sheet](https://vue-community.org/guide/ecosystem/react-to-vue.html)
- [Composition API RFC](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0013-composition-api.md)

### Tools
- [Vue DevTools](https://devtools.vuejs.org/)
- [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) - VS Code extension
- [TypeScript Vue Plugin](https://www.npmjs.com/package/@vue/typescript-plugin)

---

## ✅ Migration Checklist per Component

For each component, verify:

- [ ] Props correctly typed with TypeScript
- [ ] Emits declared with types
- [ ] Reactive state uses `ref` or `reactive`
- [ ] Computed properties are `computed()`
- [ ] Lifecycle hooks converted (useEffect → onMounted, etc.)
- [ ] Event handlers use `@click` not `onClick`
- [ ] Conditional rendering uses `v-if` not ternaries
- [ ] Lists use `v-for` with `:key`
- [ ] Two-way binding uses `v-model`
- [ ] Styles are scoped or use Tailwind
- [ ] Quasar components replace ShadCN
- [ ] API calls use axios service
- [ ] Loading states handled
- [ ] Error handling implemented
- [ ] Mobile responsive
- [ ] Accessibility (ARIA labels)

---

## 🎉 Success Criteria

Your Vue migration is complete when:

✅ All pages render correctly  
✅ Authentication flow works  
✅ All CRUD operations functional  
✅ Real-time features working  
✅ Mobile responsive on all screens  
✅ Offline mode functional  
✅ Performance metrics met (< 3s load)  
✅ All tests passing  
✅ No console errors  
✅ Lighthouse score > 90

---

## 🆘 Getting Help

If you encounter issues:

1. **Check this guide** - Most patterns are covered
2. **Vue DevTools** - Inspect component state
3. **Quasar Discord** - Active community
4. **Stack Overflow** - Tag with `vue3` and `quasar`
5. **GitHub Discussions** - ChurchAfrica ChMS repo

---

**Built for ChurchAfrica ChMS**  
React → Vue 3 + Quasar Migration Guide  
© 2024 All Rights Reserved
