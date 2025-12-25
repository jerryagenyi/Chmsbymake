# Migration Guide: ChMS-by-Make from React/Tailwind to Vue/Quasar/Laravel

**Objective**: To provide a detailed, step-by-step guide for a development team to convert the existing ChMS-by-Make design prototype (React/Tailwind/Vite) into a production-ready Vue.js/Quasar application powered by a Laravel REST API, maintaining the Africa-First design philosophy with offline-first functionality, mobile-first interfaces, and low-bandwidth optimisation.

---

## **Phase 1: Frontend Scaffolding & Initial Setup**

This phase focuses on creating the new Vue/Quasar project and porting over the essential visual and structural elements.

### **Step 1.1: Initialize New Quasar Project**

Create a new Quasar project using the Vite setup. This will be the home for your new frontend.

1. Run the Quasar CLI command: `pnpm create quasar` (or `npm create quasar@latest`)
2. Select the following options:
   * **Project name**: `frontend` (or your preferred name)
   * **Script type**: TypeScript
   * **Quasar version**: Quasar v2 with Vite
   * **Features**: Select `Pinia` (state management), `Axios` (HTTP client), and `TypeScript`
   * **Linting**: Choose ESLint with TypeScript support
   * **CSS Preprocessor**: SASS/SCSS (for better theming control)

### **Step 1.2: Replicate Directory Structure**

Based on the target architecture and the existing React prototype structure, create the specified directory structure within your new `frontend/src/` folder.

```
frontend/src/
├── boot/
│   ├── axios.ts          # Axios configuration and interceptors
│   └── router.ts         # Router configuration
├── components/
│   ├── ui/              # Reusable UI components (Quasar equivalents)
│   ├── layout/          # Layout components
│   ├── dashboard/       # Dashboard-specific components
│   ├── members/         # Member management components
│   ├── attendance/      # Attendance tracking components
│   ├── events/          # Event management components
│   ├── giving/          # Giving/donation components
│   ├── reports/         # Reporting components
│   ├── analytics/       # Analytics components
│   ├── chat/            # Chat/messaging components
│   ├── organization/    # Organization management components
│   ├── member-portal/  # Member portal components
│   ├── auth/            # Authentication components
│   └── landing/         # Landing page components
├── layouts/
│   ├── MainLayout.vue   # Main authenticated layout
│   ├── AuthLayout.vue   # Authentication layout
│   └── LandingLayout.vue # Landing page layout
├── pages/
│   ├── Index.vue        # Dashboard/home page
│   ├── Members.vue      # Member list page
│   ├── Attendance.vue   # Attendance pages
│   ├── Events.vue       # Event pages
│   ├── Giving.vue       # Giving pages
│   ├── Reports.vue      # Reports pages
│   ├── Analytics.vue    # Analytics pages
│   ├── Chat.vue         # Chat pages
│   ├── Settings.vue     # Settings pages
│   └── auth/
│       ├── Login.vue
│       ├── Register.vue
│       └── ForgotPassword.vue
├── router/
│   ├── index.ts         # Router instance
│   ├── routes.ts       # Route definitions
│   └── guards.ts       # Route guards (auth, permissions)
├── services/
│   ├── api.ts          # Axios instance with base config
│   ├── auth.ts         # Authentication API calls
│   ├── members.ts      # Member API calls
│   ├── attendance.ts   # Attendance API calls
│   ├── events.ts       # Event API calls
│   ├── giving.ts       # Giving API calls
│   └── ...            # Other API service files
├── stores/
│   ├── useAuthStore.ts      # Authentication store
│   ├── useMemberStore.ts    # Member data store
│   ├── useAttendanceStore.ts # Attendance data store
│   ├── useEventStore.ts     # Event data store
│   ├── useGivingStore.ts    # Giving data store
│   └── ...                  # Other Pinia stores
├── types/
│   ├── member.ts
│   ├── attendance.ts
│   ├── event.ts
│   ├── giving.ts
│   └── ...            # TypeScript type definitions
├── utils/
│   ├── formatters.ts  # Date, currency, etc. formatters
│   ├── validators.ts  # Form validation utilities
│   └── ...           # Other utility functions
└── css/
    ├── quasar.variables.sass  # Quasar theme variables
    └── app.scss              # Global styles
```

### **Step 1.3: Port Styling and Theming**

1. **Tailwind CSS to Quasar CSS:** The prototype uses Tailwind heavily. Quasar has its own rich set of CSS utility classes. The goal is to map concepts, not copy classes 1:1.

   **Common Mappings:**
   * `flex`, `flex-col`, `flex-row` → `row`, `column` (Quasar flex classes)
   * `justify-between`, `justify-center` → `justify-between`, `justify-center`
   * `items-center` → `items-center`
   * `gap-4`, `gap-6` → `q-gutter-md`, `q-gutter-lg`
   * `p-4`, `p-6` → `q-pa-md`, `q-pa-lg`
   * `m-4`, `m-6` → `q-ma-md`, `q-ma-lg`
   * `rounded-lg` → `rounded-borders`
   * `shadow-md` → `shadow-2` or `elevation-2`
   * `text-sm`, `text-base` → `text-body2`, `text-body1`
   * `font-semibold` → `text-weight-medium`
   * `bg-white` → `bg-white`
   * `text-gray-600` → `text-grey-6`

2. **Theme Colors:**
   * Open the prototype's `src/styles/globals.css` or `src/index.css`
   * Open your new project's `src/css/quasar.variables.sass`
   * Map the OKLCH color variables from the prototype to Quasar SASS variables:
   
   ```sass
   // Primary brand color (Victory Chapel Ministry)
   $primary: #7C5CDB  // oklch(0.65 0.15 264)
   $secondary: #2D3748  // oklch(0.25 0.02 240)
   $accent: #F59E0B  // oklch(0.70 0.12 45)
   
   // Semantic colors
   $positive: #10B981  // Success
   $negative: #EF4444  // Error
   $warning: #F59E0B  // Warning
   $info: #3B82F6     // Info
   
   // Background colors
   $dark-page: #0F172A  // Dark mode background
   $dark: #1E293B       // Dark mode surface
   ```

3. **Fonts:**
   * The prototype uses Inter font family
   * In your Quasar project, add Inter to `src/css/app.scss`:
   ```scss
   @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
   
   body {
     font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
   }
   ```

4. **Dark Mode:**
   * Quasar has built-in dark mode support
   * Configure in `quasar.conf.js` or `quasar.config.js`:
   ```js
   framework: {
     config: {
       dark: 'auto' // or 'true' for always dark
     }
   }
   ```

---

## **Phase 2: Component & Layout Migration**

This is the most intensive phase. The goal is to recreate all UI elements from the React prototype using Vue and Quasar components.

### **Step 2.1: Rebuild Layouts**

1. **AuthLayout:** Create `src/layouts/AuthLayout.vue`
   * Look at the prototype's `src/components/auth/AuthPage.tsx`
   * Use a `q-layout` with a central `q-page-container` and `q-page` with `flex flex-center`
   * Recreate the header with the logo and app title
   * The `Logo.tsx` component can be converted to an inline SVG within a `.vue` component

2. **MainLayout:** Create `src/layouts/MainLayout.vue`
   * Look at the prototype's `src/components/layout/AppLayout.tsx`
   * Use a `q-layout` with:
     * `q-header` for the top navigation bar
     * `q-drawer` for the sidebar (desktop)
     * `q-page-container` for the main content area
     * `q-footer` or bottom navigation for mobile (using `q-tabs` or custom component)
   * The `Sidebar.tsx` will become your `q-drawer`
   * Use `q-list` and `q-item` to rebuild the navigation menu
   * Use `q-expansion-item` for collapsible sections (Members, Attendance, etc.)

3. **LandingLayout:** Create `src/layouts/LandingLayout.vue`
   * Look at the prototype's `src/components/landing/LandingPage.tsx`
   * Simple full-page layout without header/drawer

### **Step 2.2: Convert UI Components (ShadCN/Radix to Quasar)**

Systematically go through `src/components/ui/` in the prototype and find the Quasar equivalent for each.

| React Component (shadcn/radix) | Quasar Equivalent | Notes |
|:-------------------------------|:------------------|:------|
| `Button.tsx` | `q-btn` | Use props like `color`, `flat`, `outline`, `unelevated`, `rounded` |
| `Card.tsx` | `q-card`, `q-card-section` | Use sections for header, content, and footer logic |
| `Input.tsx` | `q-input` | Has built-in validation, labels, icons, and error states |
| `Select.tsx` | `q-select` | Has options for filtering, multiple selection, and data-binding (`v-model`) |
| `Dialog.tsx` | `q-dialog` | Quasar dialogs are component-based with `v-model` |
| `Avatar.tsx` | `q-avatar` | Use with `q-img` or text inside, supports sizes |
| `Badge.tsx` | `q-badge`, `q-chip` | `q-chip` is more versatile for tags and labels |
| `Table.tsx` | `q-table` | Very powerful component with built-in sorting, filtering, pagination, and selection |
| `Tabs.tsx` | `q-tabs`, `q-tab-panels` | Direct equivalent for tabbed content |
| `Accordion.tsx` | `q-expansion-item` | Used for creating collapsible sections |
| `DropdownMenu.tsx` | `q-menu` with `q-btn` | Context menus and dropdowns |
| `Popover.tsx` | `q-popup-proxy` | Popover functionality |
| `Tooltip.tsx` | `q-tooltip` | Built-in tooltip support |
| `Checkbox.tsx` | `q-checkbox` | Checkbox with label support |
| `RadioGroup.tsx` | `q-radio` | Radio button groups |
| `Switch.tsx` | `q-toggle` | Toggle switches |
| `Slider.tsx` | `q-slider` | Range sliders |
| `Progress.tsx` | `q-linear-progress`, `q-circular-progress` | Progress indicators |
| `Skeleton.tsx` | `q-skeleton` | Loading placeholders |
| `Toast.tsx` | `$q.notify()` | Notification system (method-based) |
| `AlertDialog.tsx` | `$q.dialog()` | Confirmation dialogs |

**Action:** For each component in the prototype (e.g., `KPICard.tsx`, `MemberCard.tsx`, `AttendanceChart.tsx`), create a new `.vue` component in `src/components/` and rebuild its structure and style using Quasar components.

### **Step 2.3: Port Complex Components**

1. **Dashboard Components:**
   * `Dashboard.tsx` → `pages/Index.vue`
   * `KPICard.tsx` → `components/dashboard/KPICard.vue`
   * `AttendanceChart.tsx` → `components/dashboard/AttendanceChart.vue` (use Quasar's chart components or integrate Recharts)
   * `QuickActions.tsx` → `components/dashboard/QuickActions.vue`

2. **Member Components:**
   * `MemberList.tsx` → `components/members/MemberList.vue` (use `q-table`)
   * `MemberCard.tsx` → `components/members/MemberCard.vue`
   * `AddMemberForm.tsx` → `components/members/AddMemberForm.vue` (use `q-form` with validation)

3. **Attendance Components:**
   * `AttendanceTracker.tsx` → `components/attendance/AttendanceTracker.vue`
   * `CheckInKiosk.tsx` → `components/attendance/CheckInKiosk.vue`
   * `QRCodeScanner.tsx` → `components/attendance/QRCodeScanner.vue` (use Quasar's camera API or integrate jsQR)

4. **Giving Components:**
   * `GivingDashboard.tsx` → `components/giving/GivingDashboard.vue`
   * `DonationForm.tsx` → `components/giving/DonationForm.vue`
   * `CampaignManager.tsx` → `components/giving/CampaignManager.vue`

---

## **Phase 3: Page & Logic Migration**

With layouts and components ready, you can now rebuild the pages and wire up the application logic.

### **Step 3.1: Recreate Pages**

For each page in the prototype's routing structure (managed in `App.tsx`), create a corresponding `.vue` file in your `frontend/src/pages/` directory.

**Page Mapping:**
* Dashboard → `pages/Index.vue`
* Members → `pages/Members.vue`
* Member Details → `pages/MemberDetails.vue` (with route param `:id`)
* Attendance → `pages/Attendance.vue`
* Events → `pages/Events.vue`
* Event Details → `pages/EventDetails.vue` (with route param `:id`)
* Giving → `pages/Giving.vue`
* Reports → `pages/Reports.vue`
* Analytics → `pages/Analytics.vue`
* Chat → `pages/Chat.vue`
* Settings → `pages/Settings.vue`
* Login → `pages/auth/Login.vue`
* Register → `pages/auth/Register.vue`

### **Step 3.2: Implement State Management (Pinia)**

1. **Auth Store:** Create `src/stores/useAuthStore.ts`
   ```typescript
   import { defineStore } from 'pinia'
   import { ref, computed } from 'vue'
   import { authService } from '@/services/auth'
   
   export const useAuthStore = defineStore('auth', () => {
     const user = ref(null)
     const token = ref<string | null>(localStorage.getItem('token'))
     const isAuthenticated = computed(() => !!token.value)
     
     async function login(email: string, password: string) {
       const response = await authService.login(email, password)
       token.value = response.token
       user.value = response.user
       localStorage.setItem('token', response.token)
     }
     
     function logout() {
       token.value = null
       user.value = null
       localStorage.removeItem('token')
     }
     
     return { user, token, isAuthenticated, login, logout }
   })
   ```

2. **Data Stores:** Create stores for each data type:
   * `useMemberStore.ts` - Member data and operations
   * `useAttendanceStore.ts` - Attendance records
   * `useEventStore.ts` - Events
   * `useGivingStore.ts` - Donations and giving
   
   **Example (`useMemberStore.ts`):**
   ```typescript
   import { defineStore } from 'pinia'
   import { ref } from 'vue'
   import { memberService } from '@/services/members'
   import type { Member } from '@/types/member'
   
   export const useMemberStore = defineStore('members', () => {
     const members = ref<Member[]>([])
     const loading = ref(false)
     const error = ref<string | null>(null)
     
     async function fetchMembers() {
       loading.value = true
       try {
         members.value = await memberService.getAll()
       } catch (err) {
         error.value = err.message
       } finally {
         loading.value = false
       }
     }
     
     async function createMember(memberData: Partial<Member>) {
       const newMember = await memberService.create(memberData)
       members.value.push(newMember)
       return newMember
     }
     
     return { members, loading, error, fetchMembers, createMember }
   })
   ```

### **Step 3.3: Implement Routing & Guards**

1. **Route Definitions:** Open the prototype's `src/App.tsx` to see the routing structure. Define your routes in `src/router/routes.ts`:

   ```typescript
   import { RouteRecordRaw } from 'vue-router'
   
   const routes: RouteRecordRaw[] = [
     {
       path: '/',
       component: () => import('layouts/MainLayout.vue'),
       children: [
         { path: '', component: () => import('pages/Index.vue') },
         { path: 'members', component: () => import('pages/Members.vue') },
         { path: 'members/:id', component: () => import('pages/MemberDetails.vue') },
         { path: 'attendance', component: () => import('pages/Attendance.vue') },
         { path: 'events', component: () => import('pages/Events.vue') },
         { path: 'giving', component: () => import('pages/Giving.vue') },
         { path: 'reports', component: () => import('pages/Reports.vue') },
         { path: 'analytics', component: () => import('pages/Analytics.vue') },
         { path: 'chat', component: () => import('pages/Chat.vue') },
         { path: 'settings', component: () => import('pages/Settings.vue') },
       ]
     },
     {
       path: '/auth',
       component: () => import('layouts/AuthLayout.vue'),
       children: [
         { path: 'login', component: () => import('pages/auth/Login.vue') },
         { path: 'register', component: () => import('pages/auth/Register.vue') },
         { path: 'forgot-password', component: () => import('pages/auth/ForgotPassword.vue') },
       ]
     },
     {
       path: '/landing',
       component: () => import('layouts/LandingLayout.vue'),
       children: [
         { path: '', component: () => import('pages/Landing.vue') },
       ]
     },
   ]
   
   export default routes
   ```

2. **Navigation Guards:** Create `src/router/guards.ts`:

   ```typescript
   import { RouteLocationNormalized, NavigationGuardNext } from 'vue-router'
   import { useAuthStore } from '@/stores/useAuthStore'
   
   export function authGuard(
     to: RouteLocationNormalized,
     from: RouteLocationNormalized,
     next: NavigationGuardNext
   ) {
     const authStore = useAuthStore()
     
     if (to.meta.requiresAuth && !authStore.isAuthenticated) {
       next({ name: 'login', query: { redirect: to.fullPath } })
     } else {
       next()
     }
   }
   ```

   Apply the guard in `src/router/index.ts`:
   ```typescript
   import { createRouter, createWebHistory } from 'vue-router'
   import routes from './routes'
   import { authGuard } from './guards'
   
   const router = createRouter({
     history: createWebHistory(),
     routes
   })
   
   router.beforeEach(authGuard)
   
   export default router
   ```

### **Step 3.4: Connect Pages to Stores**

In your page components (`<script setup>` block), import and use your Pinia stores to get data and perform actions.

**Example (`pages/Members.vue`):**
```vue
<template>
  <q-page padding>
    <div class="row q-mb-md">
      <div class="col">
        <h4 class="text-h4 q-ma-none">Members</h4>
      </div>
      <div class="col-auto">
        <q-btn
          color="primary"
          label="Add Member"
          icon="add"
          @click="showAddDialog = true"
        />
      </div>
    </div>
    
    <q-table
      :rows="members"
      :columns="columns"
      :loading="loading"
      row-key="id"
    >
      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <q-btn
            flat
            round
            icon="edit"
            @click="editMember(props.row)"
          />
        </q-td>
      </template>
    </q-table>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useMemberStore } from '@/stores/useMemberStore'

const memberStore = useMemberStore()
const members = computed(() => memberStore.members)
const loading = computed(() => memberStore.loading)

onMounted(() => {
  memberStore.fetchMembers()
})
</script>
```

---

## **Phase 4: Feature-Specific Migration**

This phase addresses the complex features that require special attention.

### **Step 4.1: Authentication Flow**

1. Rebuild the Login, Register, and Forgot Password pages from `src/components/auth/`
2. In `pages/auth/Login.vue`'s submit handler, call the `authStore.login()` action
3. On success, the `authGuard` will allow navigation to the dashboard
4. On failure, use Quasar's notification system: `$q.notify({ type: 'negative', message: 'Login failed' })`

**Example Login Page:**
```vue
<template>
  <q-page class="flex flex-center">
    <q-card style="min-width: 350px">
      <q-card-section>
        <div class="text-h6">Login</div>
      </q-card-section>
      
      <q-card-section>
        <q-form @submit="onSubmit">
          <q-input
            v-model="email"
            label="Email"
            type="email"
            :rules="[val => !!val || 'Email is required']"
          />
          <q-input
            v-model="password"
            label="Password"
            type="password"
            :rules="[val => !!val || 'Password is required']"
          />
          <q-btn
            type="submit"
            color="primary"
            label="Login"
            class="full-width q-mt-md"
            :loading="loading"
          />
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useAuthStore } from '@/stores/useAuthStore'

const router = useRouter()
const $q = useQuasar()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const loading = ref(false)

async function onSubmit() {
  loading.value = true
  try {
    await authStore.login(email.value, password.value)
    router.push('/')
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: error.message || 'Login failed'
    })
  } finally {
    loading.value = false
  }
}
</script>
```

### **Step 4.2: QR Code Functionality**

The prototype uses QR codes for attendance check-in. In Quasar:

1. **QR Code Generation:** Use a library like `qrcode` (same as prototype) or Quasar's built-in QR code component if available
2. **QR Code Scanning:** Use Quasar's camera API or integrate `jsQR` library (same as prototype)

**Example QR Scanner Component:**
```vue
<template>
  <div>
    <q-btn @click="startScanning">Start Scanning</q-btn>
    <q-dialog v-model="showCamera">
      <q-card>
        <q-card-section>
          <video ref="videoRef" autoplay playsinline></video>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import jsQR from 'jsqr'

const showCamera = ref(false)
const videoRef = ref<HTMLVideoElement | null>(null)

function startScanning() {
  showCamera.value = true
  // Access camera and scan QR codes
  // Implementation similar to prototype's QRCodeScanner.tsx
}
</script>
```

### **Step 4.3: Charts and Analytics**

The prototype uses Recharts for data visualization. Options for Quasar:

1. **Option 1:** Continue using Recharts (it works with Vue)
2. **Option 2:** Use Quasar's chart components (if available)
3. **Option 3:** Use a Vue-specific charting library like `vue-chartjs` or `echarts-for-vue`

**Example with Recharts (Vue wrapper):**
```vue
<template>
  <div>
    <LineChart :data="chartData" />
  </div>
</template>

<script setup lang="ts">
import { LineChart } from 'vue-chartjs' // or recharts Vue wrapper
// Use same chart data structure as prototype
</script>
```

### **Step 4.4: Form Handling**

The prototype uses `react-hook-form`. In Vue/Quasar:

1. **Option 1:** Use Quasar's built-in form validation with `q-form` and `:rules` prop
2. **Option 2:** Use `vee-validate` (Vue equivalent of react-hook-form)

**Example with Quasar Forms:**
```vue
<template>
  <q-form @submit="onSubmit" ref="formRef">
    <q-input
      v-model="formData.firstName"
      label="First Name"
      :rules="[val => !!val || 'Required']"
    />
    <q-input
      v-model="formData.email"
      label="Email"
      type="email"
      :rules="[
        val => !!val || 'Required',
        val => /.+@.+\..+/.test(val) || 'Invalid email'
      ]"
    />
    <q-btn type="submit" color="primary" label="Submit" />
  </q-form>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const formRef = ref()
const formData = ref({
  firstName: '',
  email: ''
})

function onSubmit() {
  formRef.value.validate().then(success => {
    if (success) {
      // Submit form
    }
  })
}
</script>
```

### **Step 4.5: Real-time Features (Chat)**

The prototype has a chat interface. For real-time functionality:

1. **WebSocket Integration:** Use Laravel Echo with Pusher or Socket.io
2. **Quasar's WebSocket Plugin:** Or use Quasar's built-in WebSocket support
3. **State Management:** Update Pinia stores when messages are received

---

## **Phase 5: API Integration**

### **Step 5.1: Configure Axios**

Create `src/boot/axios.ts`:

```typescript
import { boot } from 'quasar/wrappers'
import axios, { AxiosInstance } from 'axios'

const api: AxiosInstance = axios.create({
  baseURL: process.env.API_URL || 'http://localhost:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized - redirect to login
      localStorage.removeItem('token')
      window.location.href = '/auth/login'
    }
    return Promise.reject(error)
  }
)

export default boot(({ app }) => {
  app.config.globalProperties.$api = api
})

export { api }
```

### **Step 5.2: Create API Services**

Create service files in `src/services/` for each domain:

**Example (`src/services/members.ts`):**
```typescript
import { api } from '@/boot/axios'
import type { Member } from '@/types/member'

export const memberService = {
  async getAll(): Promise<Member[]> {
    const { data } = await api.get('/members')
    return data
  },
  
  async getById(id: string): Promise<Member> {
    const { data } = await api.get(`/members/${id}`)
    return data
  },
  
  async create(member: Partial<Member>): Promise<Member> {
    const { data } = await api.post('/members', member)
    return data
  },
  
  async update(id: string, member: Partial<Member>): Promise<Member> {
    const { data } = await api.put(`/members/${id}`, member)
    return data
  },
  
  async delete(id: string): Promise<void> {
    await api.delete(`/members/${id}`)
  }
}
```

---

## **Phase 6: Mobile-First & Offline-First Implementation**

### **Step 6.1: Responsive Design**

Quasar is mobile-first by default. Use Quasar's responsive utilities:

```vue
<template>
  <div class="row">
    <div class="col-12 col-md-6 col-lg-4">
      <!-- Content adapts to screen size -->
    </div>
  </div>
</template>
```

### **Step 6.2: Offline-First with Service Workers**

1. **Enable PWA Mode:** In `quasar.config.js`:
   ```js
   pwa: {
     workboxPluginMode: 'InjectManifest',
     workboxOptions: {
       swSrc: 'src-pwa/custom-service-worker.js'
     }
   }
   ```

2. **Service Worker:** Create `src-pwa/custom-service-worker.js` to cache API responses and assets

3. **Offline Detection:** Use Quasar's `$q.platform.is.online` or browser's `navigator.onLine`

### **Step 6.3: Low-Bandwidth Optimisation**

1. **Lazy Loading:** Use Vue's `defineAsyncComponent` for route-based code splitting
2. **Image Optimization:** Use Quasar's `q-img` with lazy loading
3. **Data Pagination:** Implement pagination for all list views
4. **Compression:** Enable gzip compression on the Laravel backend

---

## **Phase 7: Testing & Quality Assurance**

### **Step 7.1: Component Testing**

Use Vue Test Utils or Quasar's testing utilities to test components.

### **Step 7.2: E2E Testing**

Use Cypress or Playwright to test critical user flows (login, member creation, attendance check-in).

### **Step 7.3: Performance Testing**

1. Use Lighthouse to test performance metrics
2. Test on low-end devices (simulate African market conditions)
3. Test with throttled network speeds

---

## **Phase 8: Deployment Preparation**

### **Step 8.1: Environment Configuration**

Create `.env` files for different environments:
```
.env.development
.env.staging
.env.production
```

### **Step 8.2: Build Configuration**

Configure `quasar.config.js` for production builds:
```js
build: {
  env: {
    API_URL: process.env.API_URL || 'https://api.churchafrica.com/api/v1'
  }
}
```

### **Step 8.3: Deployment**

1. Build the Quasar app: `quasar build`
2. Deploy the `dist/` folder to your hosting provider (CDN, S3, etc.)
3. Configure the Laravel backend to serve the API
4. Set up CORS properly for production domains

---

## **Migration Checklist**

### **Frontend (Vue/Quasar)**
- [ ] Project initialized with Quasar CLI
- [ ] Directory structure created
- [ ] Theme colors and fonts configured
- [ ] All layouts migrated (Main, Auth, Landing)
- [ ] All UI components converted to Quasar equivalents
- [ ] All pages created and routed
- [ ] Pinia stores implemented for all data domains
- [ ] API services created and integrated
- [ ] Authentication flow working
- [ ] QR code functionality working
- [ ] Charts and analytics displaying correctly
- [ ] Forms validated and submitting
- [ ] Mobile responsive design verified
- [ ] Offline-first functionality implemented
- [ ] PWA configured and working
- [ ] Dark mode working
- [ ] All routes protected with auth guards

### **Backend (Laravel)**
- [ ] Laravel project initialized
- [ ] Database schema created (see `DATABASE_SCHEMA.md`)
- [ ] API routes defined
- [ ] Controllers created for all resources
- [ ] Authentication (Laravel Sanctum) configured
- [ ] CORS configured
- [ ] API documentation (if using)
- [ ] Database migrations run
- [ ] Seeders created for initial data
- [ ] File storage configured
- [ ] Email service configured
- [ ] Queue system configured (for background jobs)

### **Integration**
- [ ] Frontend connecting to backend API
- [ ] Authentication tokens working
- [ ] All CRUD operations working
- [ ] File uploads working
- [ ] Real-time features (chat) working
- [ ] Error handling implemented
- [ ] Loading states implemented

---

## **Common Pitfalls & Solutions**

### **1. State Management Confusion**
**Problem:** Mixing component state with Pinia stores  
**Solution:** Use Pinia for shared/global state, component state for local UI state

### **2. Quasar Component API Differences**
**Problem:** Quasar components have different prop names than React components  
**Solution:** Always refer to Quasar documentation when converting components

### **3. Form Validation**
**Problem:** Quasar's validation rules work differently than react-hook-form  
**Solution:** Use Quasar's `:rules` prop or integrate `vee-validate` for complex forms

### **4. Routing Navigation**
**Problem:** Vue Router navigation is different from React Router  
**Solution:** Use `useRouter()` composable and `router.push()` instead of `useNavigate()`

### **5. Reactive Data**
**Problem:** Forgetting to use `ref()` or `reactive()` for reactive data  
**Solution:** Always wrap data that should trigger re-renders in `ref()` or `reactive()`

---

## **Resources & References**

- **Quasar Documentation:** https://quasar.dev
- **Vue 3 Documentation:** https://vuejs.org
- **Pinia Documentation:** https://pinia.vuejs.org
- **Vue Router Documentation:** https://router.vuejs.org
- **Laravel Documentation:** https://laravel.com/docs
- **Database Schema:** See `src/docs/DATABASE_SCHEMA.md`
- **UX Design Specifications:** See `src/docs/UX_DESIGN_SPECIFICATIONS.md`

---

## **Conclusion**

This migration guide provides a comprehensive roadmap for converting the ChMS-by-Make React prototype to a production-ready Vue/Quasar/Laravel application. Follow each phase systematically, test thoroughly, and refer to the documentation files for detailed specifications.

The key to a successful migration is:
1. **Systematic approach** - Don't skip phases
2. **Component-by-component** - Convert one component at a time
3. **Test as you go** - Verify each component works before moving on
4. **Maintain design consistency** - Keep the Africa-First design philosophy
5. **Performance first** - Optimize for low-bandwidth and mobile devices

Good luck with your migration!
