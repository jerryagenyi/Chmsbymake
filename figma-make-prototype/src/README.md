# ChurchAfrica ChMS - Design Prototype

> **Africa-First Church Management System** - Complete UI/UX Design Prototype

---

## 📋 Project Overview

**ChurchAfrica** is a comprehensive church management system built with an **Africa-First design philosophy** that prioritises:
- 🌍 **Offline-First** functionality
- 📱 **Mobile-First** interfaces  
- 📊 **Low-Bandwidth** optimisation
- 🎨 **Modern Design** using OKLCH colour space & Tailwind v4

**Current Focus:** Building a complete, pixel-perfect **design prototype** that demonstrates all UI screens, components, flows, and interactions. This serves as a reference implementation for the production Vue 3 + Quasar Framework build.

---

## 🎯 Design System Approach

This prototype focuses exclusively on **visual design and user experience**:

### ✅ What We're Building
- Complete UI screens for all features
- Comprehensive component library
- User flows and interactions
- Responsive layouts (mobile, tablet, desktop)
- Onboarding experiences
- Dashboard customization
- Form pages and tables
- Admin and member interfaces
- Design system documentation

### ❌ What We're NOT Building
- Functional backend code
- Real authentication systems
- Database integration
- API connections
- Production-ready state management

---

## 📁 Project Documentation

### Core Planning Documents
- **[DESIGN_SYSTEM_MASTER_PLAN.md](./DESIGN_SYSTEM_MASTER_PLAN.md)** - Complete project roadmap with 95+ screens mapped out
- **[TASK_TRACKER.md](./TASK_TRACKER.md)** - Daily task tracking with 6-week timeline
- **[DESIGN_SYSTEM_STYLE_GUIDE.md](./DESIGN_SYSTEM_STYLE_GUIDE.md)** - Comprehensive visual specifications
- **[COMPONENT_INVENTORY.md](./COMPONENT_INVENTORY.md)** - Complete catalogue of 115+ components

### Design System References
- **[COLOR_SYSTEM.md](./COLOR_SYSTEM.md)** - OKLCH colour palette
- **[DESIGN_SYSTEM_UPDATE_NOV_12_2025.md](./DESIGN_SYSTEM_UPDATE_NOV_12_2025.md)** - Latest design updates

---

## 🗂️ Project Structure

```
/
├── components/
│   ├── ui/                    # Core ShadCN components (45)
│   ├── ui-enhanced/           # Enhanced custom components (8)
│   ├── ui-enhanced-v2/        # Advanced UI components (15)
│   ├── layout/                # Layout components (6)
│   ├── dashboard/             # Dashboard widgets
│   ├── members/               # Member management
│   ├── attendance/            # Attendance tracking
│   ├── events/                # Event management
│   ├── giving/                # Donation & giving
│   ├── chat/                  # Messaging system
│   ├── reports/               # Reports & analytics
│   ├── services/              # Service management
│   ├── organization/          # Church settings
│   ├── member-portal/         # Member self-service
│   ├── auth/                  # Authentication screens
│   └── branding/              # Logo & branding
│
├── lib/                       # Mock data & utilities
├── types/                     # TypeScript interfaces
├── styles/                    # Global CSS & design tokens
└── docs/                      # Additional documentation
```

---

## 🎨 Design System Highlights

### Colour System (OKLCH)
- **Primary:** Blue (Brand)
- **Accent:** Orange/Amber
- **Success:** Green
- **Warning:** Yellow
- **Error:** Red
- **Neutral:** Greyscale

### Typography
- **Font:** Inter (system fallback)
- **Scale:** 6 heading levels + 4 body sizes
- **Weights:** 400, 500, 600, 700, 800

### Spacing
- **Base Unit:** 4px
- **Scale:** 0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24, 32

### Breakpoints (Mobile-First)
- **Mobile:** 0px (base)
- **Tablet:** 640px (sm)
- **Desktop:** 1024px (lg)
- **Wide:** 1280px (xl)

---

## 📊 Screen Inventory (95+ Screens)

### Current Progress: 33%

| Feature Area | Screens | Complete | Status |
|--------------|---------|----------|--------|
| **Public** | 5 | 3 | 60% |
| **Onboarding** | 7 | 0 | 0% |
| **Dashboard** | 4 | 3 | 75% |
| **Members** | 12 | 5 | 42% |
| **Attendance** | 10 | 5 | 50% |
| **Events** | 9 | 3 | 33% |
| **Giving** | 8 | 3 | 38% |
| **Communication** | 8 | 2 | 25% |
| **Reports** | 7 | 3 | 43% |
| **Settings** | 15 | 2 | 13% |
| **Mobile** | 10 | 0 | 0% |

---

## 🚀 Quick Start

### View the Prototype
```bash
# The prototype runs in Figma Make's React environment
# All screens are accessible through the main App.tsx router
```

### Navigate Screens
- **Landing Page:** Public-facing site
- **Auth Pages:** Login, Register
- **Dashboard:** Main admin dashboard
- **Members:** Member directory and management
- **Attendance:** Check-in system with QR codes
- **Events:** Calendar and event management
- **Giving:** Donations and campaigns
- **Reports:** Analytics dashboards
- **Settings:** Organization configuration

---

## 📅 Development Timeline

### Week 1: Foundation (Nov 14-20, 2025)
- ✅ Project cleanup and documentation
- ✅ Design system style guide
- 🔲 Component state matrix
- 🔲 Forgot password flow
- 🔲 Onboarding wizard (7 screens)
- 🔲 Empty/loading/error states

### Week 2: Member Management (Nov 21-27, 2025)
- 🔲 Edit member form
- 🔲 Advanced filters
- 🔲 Member timeline
- 🔲 Member merge interface
- 🔲 Manual attendance check-in
- 🔲 Attendance reports

### Week 3: Events & Giving (Nov 28 - Dec 4, 2025)
- 🔲 Event management forms
- 🔲 Event registration
- 🔲 Recurring giving setup
- 🔲 Campaign dashboard
- 🔲 Donor segmentation
- 🔲 Tax receipts

### Week 4: Communication & Reports (Dec 5-11, 2025)
- 🔲 Message composer
- 🔲 Email campaign builder
- 🔲 Custom report builder
- 🔲 Notification centre
- 🔲 Member portal enhancements

### Week 5: Settings & Admin (Dec 12-18, 2025)
- 🔲 Branding customization
- 🔲 User & role management
- 🔲 Permission matrix
- 🔲 System settings
- 🔲 Audit trail

### Week 6: Mobile & Polish (Dec 19-25, 2025)
- 🔲 Mobile-specific screens (10)
- 🔲 AI feature interfaces
- 🔲 Final polish & consistency
- 🔲 Design system documentation
- 🔲 Handoff package

---

## 🎯 Key Features

### For Church Administrators
- **Dashboard:** Real-time KPIs and church health metrics
- **Member Management:** Complete directory with relationships
- **Attendance Tracking:** QR code check-in system
- **Event Management:** Calendar with registration
- **Giving Tracking:** Donations, campaigns, receipts
- **Communication:** Chat, messaging, broadcasts
- **Reports:** Comprehensive analytics

### For Church Members
- **Member Portal:** Personal dashboard
- **Profile Management:** Edit info, family management
- **Digital Member Card:** QR code for check-in
- **Giving History:** Personal donation tracking
- **Event Registration:** RSVP and check-in
- **Attendance History:** Personal attendance tracking

### For Multi-Campus Churches
- **Campus Management:** Multiple locations
- **Campus Comparison:** Cross-location analytics
- **Branding Customization:** Per-church branding
- **Role-Based Access:** Granular permissions

---

## 💾 Tech Stack (Design Prototype)

### Frontend Framework
- **React 18** with TypeScript
- **Tailwind CSS v4** (OKLCH colour space)
- **ShadCN UI** component library
- **Lucide React** icons
- **Recharts** for data visualization

### Utilities
- **React Hook Form** - Form handling
- **Motion (Framer Motion)** - Animations
- **React Router** - Navigation
- **Date-fns** - Date manipulation

### Note on Production
> The production system will use **Vue 3 + Quasar Framework + Laravel + PostgreSQL**. This React prototype serves as a visual reference.

---

## 🎨 Design Principles

### Africa-First Philosophy
1. **Offline-First UI** - Clear indicators for connectivity status
2. **Low-Bandwidth** - Minimal images, optimized assets
3. **Mobile-First** - Touch-friendly, thumb-zone optimized
4. **Progressive Enhancement** - Core functionality works everywhere
5. **Local Context** - African colour preferences, familiar patterns

### Visual Language
1. **Modern & Professional** - Clean, minimal, trustworthy
2. **Warm & Welcoming** - Church environment, community-focused
3. **Data-Rich** - Charts, graphs, KPIs prominently displayed
4. **Action-Oriented** - Clear CTAs, quick actions accessible
5. **Consistent** - Design system strictly followed

### Accessibility
- **WCAG AA Compliant** - 4.5:1 colour contrast minimum
- **Keyboard Navigation** - Full keyboard support
- **Screen Reader Friendly** - Proper ARIA labels
- **Touch-Friendly** - 44px minimum touch targets
- **Reduced Motion** - Respects user preferences

---

## 🌍 Internationalization

### Language
- **UI Text:** British English spelling
- **Code:** American English (file names, variables)

### Formats
- **Dates:** DD/MM/YYYY
- **Time:** 24-hour format preferred
- **Currency:** Configurable (£, $, R, etc.)
- **Phone:** International format with country codes

---

## 📦 Component Library (115+ Components)

### Core UI (45 components)
Buttons, Inputs, Selects, Checkboxes, Radio, Switch, Slider, Calendar, Dialog, Sheet, Drawer, Popover, Tooltip, Dropdown Menu, Navigation Menu, Tabs, Accordion, Card, Badge, Avatar, Alert, Table, Progress, Skeleton, and more.

### Enhanced Custom (23 components)
Phone Input, Password Strength, Animated Buttons, Loading Spinners, File Upload, Image Gallery, Timeline, Rating, Tag Manager, Progress Stepper, Swipeable Cards, Empty States, and more.

### Layout (6 components)
App Layout, Header, Sidebar, Secondary Sidebar, Mobile Bottom Nav, Page Header.

### Domain-Specific (20+ components)
KPI Cards, Activity Feed, Event Cards, Member Cards, QR Generators/Scanners, Check-in Kiosk, Donation Forms, Campaign Cards, Chat Interface, and more.

See **[COMPONENT_INVENTORY.md](./COMPONENT_INVENTORY.md)** for complete details.

---

## 📝 Example Church: Victory Chapel Ministry (VCM)

The prototype uses **Victory Chapel Ministry** as the example church:

- **Name:** Victory Chapel Ministry
- **Abbreviation:** VCM
- **Campuses:** Multiple (Main, North, East, South)
- **Branding:** Custom logo and colours
- **Use Case:** Multi-campus megachurch

---

## 🤝 Contributing to Design

### Design Guidelines
1. Review the **[DESIGN_SYSTEM_STYLE_GUIDE.md](./DESIGN_SYSTEM_STYLE_GUIDE.md)**
2. Check **[COMPONENT_INVENTORY.md](./COMPONENT_INVENTORY.md)** for existing components
3. Follow the colour system (OKLCH only)
4. Use typography scale (no custom font sizes)
5. Follow spacing system (4px base unit)
6. Test on mobile, tablet, and desktop
7. Include empty, loading, and error states

### Before Creating a Screen
- [ ] Check if similar patterns exist
- [ ] Plan for mobile, tablet, desktop
- [ ] Design empty, loading, error states
- [ ] Consider keyboard navigation
- [ ] Verify colour contrast (4.5:1 min)
- [ ] Check touch target sizes (44px min)

---

## 📞 Contact & Support

**Project:** ChurchAfrica ChMS  
**Version:** 1.0 (Design Prototype)  
**Last Updated:** November 14, 2025  
**Status:** Active Development

---

## 📄 License

This is a design prototype for ChurchAfrica ChMS. All rights reserved.

---

## 🙏 Acknowledgments

- **ShadCN UI** for the excellent component library
- **Tailwind Labs** for Tailwind CSS v4
- **Lucide** for beautiful icons
- **African church communities** for inspiration and feedback

---

**Built with ❤️ for African Churches**
