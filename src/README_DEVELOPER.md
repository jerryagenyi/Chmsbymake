# ChurchAfrica ChMS - Developer Guide

## 🎯 Quick Start

### Current Status
- ✅ **Phase 1-12 Complete:** Full system with AI/ML, Analytics, Reports, Giving, Multi-Org
- ✨ **NEW: Enhanced UI Library** - Modern animated components inspired by uiverse.io
- 📍 **Current Stack:** React + Tailwind + Supabase
- 🎨 **Theme:** Green Dark (#1CE479 primary, #0A0A0F background)

### Developer Navigation

**🔧 Quick Testing (No Login Required):**
1. Look for **purple floating button** (bottom left)
2. Click to open **Developer Navigation Panel**
3. Jump to any page instantly

**Available Pages:**
- Authentication
- Dashboard
- Members
- Attendance
- Events
- Chat
- Organization Management
- Giving/Donations
- Reports & Analytics
- AI Intelligence
- ✨ **UI Components Showcase** (NEW)

---

## 📁 Project Structure

```
churchafrica-chms/
├── components/
│   ├── ai/                  # AI Dashboard & ML insights
│   ├── analytics/           # Analytics hub & modules
│   ├── attendance/          # Attendance tracking, QR codes
│   ├── auth/                # Login, register, protected routes
│   ├── chat/                # Real-time messaging
│   ├── dashboard/           # KPI cards, charts, quick actions
│   ├── dev/                 # Developer navigation
│   ├── events/              # Event management, calendar
│   ├── giving/              # Donations & campaigns
│   ├── layout/              # App layout, sidebars, header
│   ├── members/             # Member management
│   ├── organization/        # Multi-org management
│   ├── reports/             # Reports & exports
│   ├── theme/               # Theme provider, toggle
│   ├── ui/                  # Shadcn components
│   └── ui-enhanced/         # ✨ NEW: Enhanced animated components
├── contexts/
│   └── AuthContext.tsx      # Authentication state
├── guidelines/              # 🆕 Documentation
│   ├── MULTI_ORGANIZATION_ARCHITECTURE.md
│   ├── BACKEND_OPTIONS.md
│   ├── PWA_IMPLEMENTATION.md
│   └── QUESTIONS_ANSWERED.md
├── lib/
│   ├── mock-data.ts         # Sample data (members, events, etc.)
│   ├── supabase.ts          # Supabase client
│   └── theme-config.ts      # Theme configuration
├── types/
│   ├── attendance.ts        # Attendance types
│   ├── event.ts             # Event types
│   └── member.ts            # Member types
└── App.tsx                  # Main application
```

---

## 🏗️ Architecture Overview

### Current: Single Organization
```
App
 ├── Members (50 members)
 ├── Services (5 services)
 ├── Attendance (120 records)
 └── Events (8 events)
```

### Future: Multi-Organization (Planned)
```
Organization (Victory Chapel Ministry)
 ├── Branch (Lagos HQ)
 │   ├── Services (4 services)
 │   └── Members (850)
 ├── Branch (Abuja)
 │   ├── Services (2 services)
 │   └── Members (320)
 └── Branch (Accra)
     ├── Services (2 services)
     └── Members (180)
```

**See:** `/guidelines/MULTI_ORGANIZATION_ARCHITECTURE.md`

---

## 🎨 Design System

### Colors
```css
Primary:     #1CE479 (Green)
Background:  #0A0A0F (Very Dark)
Cards:       #1A1A20 (Dark Gray)
Accent:      #1CE479 (Same as primary)
Text:        #FFFFFF (White)
Muted:       #6B7280 (Gray)
```

### Typography
- **Font:** Archivo
- **DON'T use:** text-2xl, font-bold classes (we have defaults)
- **DO use:** h1, h2, h3, p tags (pre-styled in globals.css)

### Spacing
- Cards: `space-y-6` (24px vertical)
- Sections: `gap-6` (24px gap)
- Padding: `p-6` (24px padding)

---

## 🔐 Authentication

### Current Implementation
```typescript
// Supabase Auth
await supabase.auth.signUp({ email, password })
await supabase.auth.signInWithPassword({ email, password })
await supabase.auth.signOut()

// Protected routes wrap content
<ProtectedRoute>
  <YourContent />
</ProtectedRoute>
```

### Demo Accounts
```
Email: admin@church.com
Password: password123

Email: pastor@church.com
Password: password123
```

### Bypass for Testing
Use the **Developer Navigation Panel** (purple button) to skip login.

---

## 📊 Data Flow

### Mock Data (Current)
```typescript
// lib/mock-data.ts
export const mockMembers: Member[] = [...]      // 50 members
export const mockServices: Service[] = [...]    // 5 services
export const mockAttendanceRecords = [...]      // 120 records
export const mockEvents: Event[] = [...]        // 8 events
```

### Future: API Integration
```typescript
// services/api.ts (to be created)
export async function getMembers(branchId: string) {
  const response = await fetch(`/api/branches/${branchId}/members`);
  return response.json();
}
```

---

## 🧩 Key Features

### ✅ Implemented

**1. Member Management**
- Grid/Table views
- Search & filters (status, gender, department)
- Mock CRUD operations
- 50 sample members

**2. Attendance Tracking**
- Service selection (5 services)
- Real-time check-in interface
- QR code generation per member
- QR code scanner (camera-based)
- Live statistics (present, late, absent, first-timers)
- 120 sample attendance records

**3. Event Management**
- Calendar view (monthly)
- List view with filters
- 8 event types (conference, crusade, retreat, etc.)
- Registration tracking
- Online/Hybrid/Physical events
- 8 sample events

**4. Dashboard**
- 6 KPI cards (total members, attendance rate, etc.)
- Attendance trend chart (Recharts)
- Giving trend chart
- Activity feed
- Upcoming events widget
- Quick actions

**5. Giving/Donations System** ✅
- Donation tracking with offline support
- Multiple payment methods (Cash, Mobile Money, Bank Transfer, Card)
- African payment integrations (Paystack, Flutterwave)
- Campaign management
- Giving reports & analytics
- Tax receipt generation

**6. Real-time Chat** ✅
- 6 sample chat rooms (General, Prayer, Youth, Leaders, Tech, Events)
- Direct messages
- Typing indicators
- Online status
- Message timestamps

**7. Multi-Organization** ✅
- 3-tier structure (Organization → Branch → Member)
- Organization setup wizard
- Branch management
- Cross-branch reporting
- Role-based access

**8. Reports & Analytics** ✅
- Giving reports (trends, donors, campaigns)
- Donor statements & tax receipts
- PDF export functionality
- Membership, Attendance, Church Health analytics

**9. AI & Machine Learning** ✅
- Predictive analytics (attendance, giving, churn)
- Member engagement scoring
- LLM integration capabilities
- Intelligent recommendations

**10. Enhanced UI Components** ✨ NEW
- 12 animated component types
- Africa-First design
- Touch-friendly (48px targets)
- Mobile-optimized
- Inspired by modern UI patterns

---

## 🛠️ Common Tasks

### Add a New Page
```typescript
// 1. Create component
// components/giving/GivingPage.tsx
export function GivingPage() {
  return <div>Giving Page</div>
}

// 2. Add to DevNavigation
// components/dev/DevNavigation.tsx
const pages = [
  // ...
  { id: 'giving', label: 'Giving', icon: DollarSign }
]

// 3. Add to App.tsx
import { GivingPage } from './components/giving/GivingPage';

// In render:
if (currentPage === 'giving') {
  return <GivingPage />
}
```

### Add a New Mock Data Entity
```typescript
// 1. Create type
// types/donation.ts
export interface Donation {
  id: string;
  memberId: string;
  amount: number;
  currency: string;
  // ...
}

// 2. Add mock data
// lib/mock-data.ts
export const mockDonations: Donation[] = [
  {
    id: 'd1',
    memberId: 'm1',
    amount: 10000,
    currency: 'NGN'
  }
]

// 3. Use in component
import { mockDonations } from '../lib/mock-data';
```

### Add a Shadcn Component
```bash
# Components already available in /components/ui/
# Just import and use:
import { Button } from './components/ui/button';
import { Dialog } from './components/ui/dialog';
import { Table } from './components/ui/table';
```

### Use Enhanced UI Components ✨
```typescript
// Import from the enhanced UI library
import { 
  AnimatedButton,
  LoadingSpinner,
  EnhancedInput,
  PhoneInput,
  SuccessMessage,
  CTACard
} from './components/ui-enhanced';

// Example usage
<AnimatedButton variant="primary" size="md">
  Click Me
</AnimatedButton>

<PhoneInput
  label="Phone Number"
  value={phone}
  onChange={setPhone}
  countryCode="+234"
  required
/>

<SuccessMessage
  message="Success!"
  description="Action completed successfully"
  variant="success"
/>

// See /components/ui-enhanced/README.md for full documentation
// Or visit the UI Showcase page in the app for live demos
```

---

## 📚 Documentation

### Essential Reading

1. **Multi-Organization Architecture**
   - Path: `/guidelines/MULTI_ORGANIZATION_ARCHITECTURE.md`
   - Topics: 3-tier hierarchy, data models, permissions, RLS

2. **Backend Options Comparison**
   - Path: `/guidelines/BACKEND_OPTIONS.md`
   - Topics: Supabase vs Laravel vs PostgreSQL, costs, African context

3. **PWA Implementation Guide**
   - Path: `/guidelines/PWA_IMPLEMENTATION.md`
   - Topics: Why PWA for Africa, offline-first, Quasar vs React

4. **Questions & Answers**
   - Path: `/guidelines/QUESTIONS_ANSWERED.md`
   - Topics: All architecture decisions explained

---

## 🎯 Recommended Next Steps

### For Prototype (React)
1. ✅ Implement Giving/Donations module
2. ✅ Implement Real-time Chat
3. ✅ Polish UI/UX
4. ✅ Complete documentation
5. ⏰ (Optional) Add multi-organization

### For Production (Vue + Laravel)
1. Setup Laravel backend with PostgreSQL
2. Build RESTful API (follow React prototype)
3. Rebuild frontend in Vue + Quasar
4. Add African payment integrations
5. Add SMS notifications
6. Build as PWA
7. Deploy to African hosting

**See migration roadmap:** `/guidelines/BACKEND_OPTIONS.md`

---

## 🌍 Africa-First Principles

This project is optimized for African church contexts:

### 1. Offline-First
- Works without internet
- Data syncs when online
- Local storage for critical data

### 2. Low-Bandwidth Optimization
- Minimal API calls
- Compressed assets
- Progressive image loading
- Data saver mode

### 3. Mobile-First
- Touch-optimized UI
- Responsive design
- Works on low-end devices
- Small bundle size

### 4. Cost-Effective
- Avoid expensive API calls
- Minimize data transfer
- Free tier friendly
- Shared hosting compatible

### 5. Culturally Relevant
- Multi-language support (planned)
- African payment methods
- Local SMS providers
- African currencies

---

## 🔧 Tech Stack

### Current (Prototype)
```
Frontend:
- React 18
- TypeScript
- Tailwind CSS 4.0
- Shadcn/UI components
- Lucide icons
- Recharts (charts)

Backend:
- Supabase (Auth, Database, Storage)
- PostgreSQL (via Supabase)
- Edge Functions (Deno)

Build:
- Vite
- PostCSS
```

### Recommended (Production)
```
Frontend:
- Vue 3
- Quasar Framework
- TypeScript
- Pinia (state management)

Backend:
- Laravel 10+
- PostgreSQL
- Laravel Sanctum (auth)
- Laravel Queue (background jobs)

Hosting:
- Vultr Johannesburg
- OR DigitalOcean
- OR African hosting (Whogohost, Qservers)
```

---

## 💡 Tips & Best Practices

### Component Development
```typescript
// ✅ DO: Use TypeScript
interface Props {
  member: Member;
  onEdit: (member: Member) => void;
}

// ✅ DO: Export from index files
// components/members/index.ts
export { MemberList } from './MemberList';
export { MemberCard } from './MemberCard';

// ✅ DO: Use composition
<Card>
  <CardHeader>
    <CardTitle>Members</CardTitle>
  </CardHeader>
  <CardContent>
    <MemberList />
  </CardContent>
</Card>

// ❌ DON'T: Create giant components
// Break into smaller, reusable pieces
```

### State Management
```typescript
// ✅ DO: Keep state close to where it's used
function MemberList() {
  const [members, setMembers] = useState(mockMembers);
  // Only this component needs members
}

// ✅ DO: Lift state when sharing between components
function App() {
  const [selectedMember, setSelectedMember] = useState<Member>();
  
  return (
    <>
      <MemberList onSelect={setSelectedMember} />
      <MemberDetails member={selectedMember} />
    </>
  )
}
```

### Performance
```typescript
// ✅ DO: Memoize expensive calculations
const stats = useMemo(() => {
  return calculateAttendanceStats(records);
}, [records]);

// ✅ DO: Use keys in lists
members.map(member => (
  <MemberCard key={member.id} member={member} />
))

// ❌ DON'T: Inline functions in render (if performance critical)
// Use useCallback for event handlers passed to children
```

---

## 🐛 Common Issues

### Issue: "Module not found"
```bash
# Solution: Check import path
# ✅ Correct:
import { Button } from './components/ui/button';

# ❌ Wrong:
import { Button } from 'components/ui/button'; // missing ./
```

### Issue: "Type error in component"
```typescript
// Solution: Define proper types
interface Member {
  id: string;
  firstName: string;
  // ...all required fields
}

// Don't use 'any'
```

### Issue: "Supabase not connected"
```typescript
// Check: utils/supabase/info.tsx
// Ensure projectId and publicAnonKey are set
```

### Issue: "Dev Navigation not showing"
```typescript
// Check: App.tsx
// Ensure <DevNavigation /> is rendered
// Should be visible in bottom left corner
```

---

## 📞 Support & Resources

### Documentation
- React Docs: https://react.dev
- Tailwind CSS: https://tailwindcss.com
- Shadcn/UI: https://ui.shadcn.com
- Supabase: https://supabase.com/docs
- Vue (for production): https://vuejs.org
- Quasar (for production): https://quasar.dev
- Laravel (for production): https://laravel.com

### African Tech Communities
- Laravel Nigeria: https://laravelnigeria.com
- Vue Kenya: Meetup groups
- DevCareers Africa: https://devcareer.io
- She Code Africa: https://shecodeafrica.org

---

## 🚀 Deployment

### Current (Prototype)
```bash
# Build React app
npm run build

# Deploy to:
- Netlify (free)
- Vercel (free)
- Cloudflare Pages (free)
```

### Production (Recommended)
```bash
# Build Quasar PWA
quasar build -m pwa

# Deploy to:
- Vultr Johannesburg ($10-30/month)
- DigitalOcean ($12-50/month)
- Whogohost Nigeria ($2-10/month)
```

---

## 📈 Roadmap

### Completed (Phases 1-7)
- ✅ Design system setup
- ✅ Layout architecture
- ✅ Authentication system
- ✅ Dashboard with KPIs
- ✅ Member management
- ✅ Attendance tracking
- ✅ Event management

### In Progress (Phase 8-9)
- 🚧 Giving/Donations system
- 🚧 Real-time chat

### Planned (Phase 10+)
- ⏰ Multi-organization support
- ⏰ SMS notifications
- ⏰ African payment integrations
- ⏰ Advanced reporting
- ⏰ Mobile apps (Android/iOS)
- ⏰ Email campaigns
- ⏰ Volunteer management
- ⏰ Children's ministry module

---

## 🎉 Quick Wins

Want to contribute? Here are easy wins:

1. **Add more mock data**
   - More members (diverse names, ages)
   - More events (different types)
   - More attendance records

2. **Improve UI polish**
   - Add loading states
   - Add empty states
   - Add error states
   - Add success toasts

3. **Add helper utilities**
   - Date formatting
   - Currency formatting
   - Name formatting
   - Phone number formatting

4. **Write documentation**
   - Component usage examples
   - API endpoint specs
   - Setup instructions
   - Troubleshooting guide

---

**Happy Coding! 🚀🇿🇦🇳🇬🇰🇪🇬🇭**

For questions, check `/guidelines/QUESTIONS_ANSWERED.md`
