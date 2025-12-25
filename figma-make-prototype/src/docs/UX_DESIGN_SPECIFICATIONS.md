# ChurchAfrica UI/UX Design Specification

**Version:** 1.0  
**Date:** December 25, 2024  
**Project:** ChurchAfrica Church Management System

**Purpose:** This document provides a comprehensive overview of the UI/UX design, architecture, and components of the ChurchAfrica React design prototype. It is intended to guide the production implementation team in migrating the design to the target Vue/Quasar/Laravel stack, ensuring alignment with the Africa-First design philosophy and project requirements.

---

## Table of Contents

1. [Design System Documentation](#1-design-system-documentation)
2. [User Flow Diagrams](#2-user-flow-diagrams)
3. [Feature Coverage Matrix](#3-feature-coverage-matrix)
4. [Component Inventory & Specifications](#4-component-inventory--specifications)
5. [Layout & Navigation Structure](#5-layout--navigation-structure)
6. [Interaction Patterns](#6-interaction-patterns)
7. [Responsive Design Specifications](#7-responsive-design-specifications)
8. [Accessibility Guidelines](#8-accessibility-guidelines)
9. [Performance Optimization](#9-performance-optimization)
10. [Offline-First UX Patterns](#10-offline-first-ux-patterns)
11. [Gap Analysis](#11-gap-analysis)

---

## 1. Design System Documentation

### 1.1 Color Palette

The ChurchAfrica color system is defined in `/styles/globals.css` using Tailwind v4 with OKLCH color space for better perceptual uniformity. This ensures consistent color appearance across different devices, which is crucial for the African market with varied display quality.

#### Primary Brand Colors (Victory Chapel Ministry)

| Variable | Usage | OKLCH Value | Hex Equivalent |
|:---|:---|:---|:---|
| `--primary` | Primary brand color, CTAs, active states | `oklch(0.65 0.15 264)` | `#7C5CDB` |
| `--primary-foreground` | Text on primary backgrounds | `oklch(1 0 0)` | `#FFFFFF` |
| `--secondary` | Secondary elements, backgrounds | `oklch(0.25 0.02 240)` | `#2D3748` |
| `--secondary-foreground` | Text on secondary backgrounds | `oklch(1 0 0)` | `#FFFFFF` |
| `--accent` | Accent highlights, hover states | `oklch(0.70 0.12 45)` | `#F59E0B` |
| `--accent-foreground` | Text on accent backgrounds | `oklch(0.15 0.02 240)` | `#1A202C` |

#### Semantic Colors

| Variable | Usage | OKLCH Value | Hex Equivalent |
|:---|:---|:---|:---|
| `--success` | Success states, positive feedback | `oklch(0.65 0.15 150)` | `#10B981` |
| `--warning` | Warning states, alerts | `oklch(0.75 0.15 60)` | `#F59E0B` |
| `--error` | Error states, destructive actions | `oklch(0.60 0.20 25)` | `#EF4444` |
| `--info` | Information, neutral feedback | `oklch(0.65 0.15 240)` | `#3B82F6` |

#### Background & Surface Colors

| Variable | Usage | OKLCH Value | Hex Equivalent |
|:---|:---|:---|:---|
| `--background` | Main page background | `oklch(0.99 0 0)` | `#FAFAFA` |
| `--surface` | Card and elevated surfaces | `oklch(1 0 0)` | `#FFFFFF` |
| `--surface-hover` | Hover state for surfaces | `oklch(0.97 0 0)` | `#F5F5F5` |
| `--border` | Default border color | `oklch(0.90 0 0)` | `#E5E7EB` |
| `--divider` | Divider lines | `oklch(0.93 0 0)` | `#E0E0E0` |

#### Text Colors

| Variable | Usage | OKLCH Value | Hex Equivalent |
|:---|:---|:---|:---|
| `--text-primary` | Primary body text | `oklch(0.20 0.02 240)` | `#1F2937` |
| `--text-secondary` | Secondary, less prominent text | `oklch(0.50 0.02 240)` | `#6B7280` |
| `--text-tertiary` | Tertiary, subtle text | `oklch(0.65 0.02 240)` | `#9CA3AF` |
| `--text-disabled` | Disabled state text | `oklch(0.75 0 0)` | `#D1D5DB` |

#### Special Purpose Colors

| Variable | Usage | OKLCH Value | Notes |
|:---|:---|:---|:---|
| `--attendance-present` | Present status indicator | `oklch(0.65 0.15 150)` | Green |
| `--attendance-absent` | Absent status indicator | `oklch(0.60 0.20 25)` | Red |
| `--attendance-late` | Late status indicator | `oklch(0.75 0.15 60)` | Orange |
| `--giving-tithe` | Tithe category color | `oklch(0.65 0.15 264)` | Purple |
| `--giving-offering` | Offering category color | `oklch(0.70 0.12 45)` | Amber |

#### Dark Mode Colors

ChurchAfrica includes a dark mode variant for low-light conditions and battery saving on mobile devices.

| Variable | Usage | OKLCH Value (Dark) | Hex Equivalent |
|:---|:---|:---|:---|
| `--background` | Main background | `oklch(0.15 0.02 240)` | `#0F172A` |
| `--surface` | Card surfaces | `oklch(0.20 0.02 240)` | `#1A202C` |
| `--text-primary` | Primary text | `oklch(0.95 0 0)` | `#F9FAFB` |
| `--text-secondary` | Secondary text | `oklch(0.70 0 0)` | `#D1D5DB` |

### 1.2 Typography

The typography system uses the Inter font family for clean, modern readability optimised for African mobile screens.

**Font Configuration** (from `/App.tsx`):
```typescript
import { Inter } from 'next/font/google'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap', // Optimise for perceived performance
  preload: true
})
```

#### Type Scale & Usage

| Element | Class | Size | Weight | Line Height | Usage |
|:---|:---|:---|:---|:---|:---|
| Display | `text-display` | 2.5rem (40px) | 700 | 1.2 | Hero sections, landing page headlines |
| H1 | `text-h1` | 2rem (32px) | 600 | 1.25 | Page titles |
| H2 | `text-h2` | 1.5rem (24px) | 600 | 1.3 | Section headings |
| H3 | `text-h3` | 1.25rem (20px) | 600 | 1.4 | Subsection headings |
| H4 | `text-h4` | 1.125rem (18px) | 600 | 1.4 | Card titles |
| Body Large | `text-lg` | 1.125rem (18px) | 400 | 1.5 | Introductory text, featured content |
| Body | `text-base` | 1rem (16px) | 400 | 1.5 | Default body text |
| Body Small | `text-sm` | 0.875rem (14px) | 400 | 1.4 | Secondary information, labels |
| Caption | `text-xs` | 0.75rem (12px) | 400 | 1.3 | Timestamps, metadata |

#### Font Weights

- **Regular (400):** Body text, general content
- **Medium (500):** Emphasis, button text
- **Semibold (600):** Headings, important labels
- **Bold (700):** Display text, strong emphasis

#### Typography Best Practices

1. **Minimum Font Size:** Never use less than 14px for body text on mobile
2. **Line Length:** Maximum 75 characters per line for readability
3. **Contrast:** Maintain WCAG AA contrast ratios (4.5:1 for body text)
4. **Number Formatting:** Use consistent formatting for currencies, dates, and numbers

### 1.3 Component Library

ChurchAfrica uses a hybrid approach:

- **Base Components:** Custom-built components in `/components/ui/` following Radix UI patterns
- **Enhanced Components:** Africa-specific components in `/components/ui-enhanced/` and `/components/ui-enhanced-v2/`
- **Feature Components:** Domain-specific components in feature folders

#### Core UI Components (Shadcn-inspired)

Located in `/components/ui/`:

| Component | File | Usage | Quasar Equivalent |
|:---|:---|:---|:---|
| Accordion | `accordion.tsx` | Collapsible content sections | `q-expansion-item` |
| Alert | `alert.tsx` | Notification banners | `q-banner` |
| Avatar | `avatar.tsx` | User profile images | `q-avatar` |
| Badge | `badge.tsx` | Status indicators, counts | `q-badge`, `q-chip` |
| Button | `button.tsx` | Interactive buttons | `q-btn` |
| Calendar | `calendar.tsx` | Date picker | `q-date` |
| Card | `card.tsx` | Content containers | `q-card` |
| Checkbox | `checkbox.tsx` | Boolean selection | `q-checkbox` |
| Dialog | `dialog.tsx` | Modal dialogs | `q-dialog` |
| Dropdown Menu | `dropdown-menu.tsx` | Context menus | `q-menu` |
| Form | `form.tsx` | Form wrapper with validation | `q-form` |
| Input | `input.tsx` | Text input fields | `q-input` |
| Select | `select.tsx` | Dropdown selection | `q-select` |
| Sheet | `sheet.tsx` | Slide-out panels | `q-drawer` |
| Switch | `switch.tsx` | Toggle switches | `q-toggle` |
| Table | `table.tsx` | Data tables | `q-table` |
| Tabs | `tabs.tsx` | Tabbed content | `q-tabs`, `q-tab-panels` |
| Toast | `sonner.tsx` | Temporary notifications | `q-notify` |
| Tooltip | `tooltip.tsx` | Hover information | `q-tooltip` |

#### Enhanced UI Components

Located in `/components/ui-enhanced/` and `/components/ui-enhanced-v2/`:

| Component | File | Purpose | Key Features |
|:---|:---|:---|:---|
| Animated Button | `AnimatedButton.tsx` | Engaging CTAs | Ripple effect, loading states |
| Animated Checkbox | `AnimatedCheckbox.tsx` | Delightful interactions | Smooth check animation |
| Phone Input | `PhoneInput.tsx` | International phone numbers | Country code selector, validation |
| Password Strength Meter | `PasswordStrengthMeter.tsx` | Password validation feedback | Visual strength indicator |
| Loading Spinner | `LoadingSpinner.tsx` | Loading states | Customizable colors, sizes |
| Success Message | `SuccessMessage.tsx` | Action confirmations | Animated check icon |
| PWA Install Prompt | `PWAInstallPrompt.tsx` | App installation prompt | Native install experience |
| Confirmation Dialog | `ConfirmationDialog.tsx` | Destructive action confirmation | Clear action buttons |
| Empty State | `EmptyState.tsx` | No data scenarios | Illustration + CTA |
| Enhanced Search | `EnhancedSearch.tsx` | Powerful search with filters | Autocomplete, recent searches |
| File Upload | `FileUpload.tsx` | Drag-and-drop file upload | Progress, preview, validation |
| Floating Action Button | `FloatingActionButton.tsx` | Quick actions | Mobile-optimised FAB |
| Image Gallery | `ImageGallery.tsx` | Photo viewing | Lightbox, zoom, swipe |
| Notification Center | `NotificationCenter.tsx` | Notification management | Real-time updates, badges |
| Progress Stepper | `ProgressStepper.tsx` | Multi-step processes | Visual progress tracking |
| Rating | `Rating.tsx` | Star ratings | Interactive, customizable |
| Swipeable Card | `SwipeableCard.tsx` | Mobile gestures | Swipe actions (delete, archive) |
| Tag Manager | `TagManager.tsx` | Tag creation/editing | Autocomplete, validation |
| Timeline | `Timeline.tsx` | Chronological events | Vertical timeline display |
| Voice Input | `VoiceInput.tsx` | Speech-to-text | Browser Web Speech API |

### 1.4 Icon System

**Library:** `lucide-react` - A comprehensive icon library with consistent styling and excellent React support.

**Usage Pattern:**
```typescript
import { Users, Calendar, DollarSign, MessageSquare } from 'lucide-react'

<Users className="h-5 w-5 text-primary" />
```

#### Icon Categories & Common Icons

| Category | Common Icons | Usage Context |
|:---|:---|:---|
| Navigation | `Home`, `Menu`, `ChevronRight`, `ChevronLeft`, `X` | Navigation, breadcrumbs, close buttons |
| Members | `Users`, `User`, `UserPlus`, `UserCheck` | Member management, profiles |
| Attendance | `CheckCircle`, `Clock`, `Calendar`, `QrCode` | Check-in, attendance tracking |
| Events | `Calendar`, `MapPin`, `Globe`, `Video` | Event management, location |
| Giving | `DollarSign`, `CreditCard`, `TrendingUp`, `Receipt` | Donations, financial tracking |
| Communication | `MessageSquare`, `Mail`, `Bell`, `Send` | Chat, messages, notifications |
| Actions | `Plus`, `Edit`, `Trash2`, `Download`, `Upload` | CRUD operations |
| Status | `CheckCircle`, `AlertCircle`, `AlertTriangle`, `Info` | Status indicators |

**Custom Icons:**
- **Church Logo:** `/components/branding/Logo.tsx` - SVG component for Victory Chapel Ministry branding

#### Icon Sizing Standards

| Size Class | Pixel Size | Usage |
|:---|:---|:---|
| `h-3 w-3` | 12px | Inline with small text |
| `h-4 w-4` | 16px | Default inline icons |
| `h-5 w-5` | 20px | Standard UI icons |
| `h-6 w-6` | 24px | Prominent icons, buttons |
| `h-8 w-8` | 32px | Large icons, empty states |
| `h-12 w-12` | 48px | Feature illustrations |

### 1.5 Spacing & Layout

ChurchAfrica follows Tailwind CSS's 4px spacing scale for consistent rhythm.

#### Spacing Scale

| Class | Pixels | rem | Usage |
|:---|:---|:---|:---|
| `0` | 0px | 0rem | Reset spacing |
| `1` | 4px | 0.25rem | Tight spacing (icons, badges) |
| `2` | 8px | 0.5rem | Compact spacing (form elements) |
| `3` | 12px | 0.75rem | Small spacing (inline elements) |
| `4` | 16px | 1rem | Default spacing (cards, buttons) |
| `6` | 24px | 1.5rem | Medium spacing (sections) |
| `8` | 32px | 2rem | Large spacing (page sections) |
| `12` | 48px | 3rem | Extra large spacing (hero sections) |
| `16` | 64px | 4rem | Section dividers |

#### Container Widths

| Breakpoint | Max Width | Usage |
|:---|:---|:---|
| `sm` | 640px | Small devices |
| `md` | 768px | Tablets |
| `lg` | 1024px | Laptops |
| `xl` | 1280px | Desktops |
| `2xl` | 1536px | Large screens |

**Standard Container:** `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`

#### Grid Systems

**Dashboard Layout:**
```typescript
// 4-column grid for KPI cards on desktop, 1 column on mobile
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
```

**Content Grid:**
```typescript
// 12-column grid for flexible layouts
<div className="grid grid-cols-12 gap-6">
  <div className="col-span-12 lg:col-span-8">Main Content</div>
  <div className="col-span-12 lg:col-span-4">Sidebar</div>
</div>
```

### 1.6 Breakpoints & Responsive Design

ChurchAfrica is **mobile-first**, meaning base styles apply to mobile, then enhanced for larger screens.

#### Breakpoint System

| Breakpoint | Min Width | Target Devices | Usage |
|:---|:---|:---|:---|
| Default | 0px | Mobile phones (portrait) | Base mobile styles |
| `sm` | 640px | Mobile phones (landscape), small tablets | Compact tablet optimizations |
| `md` | 768px | Tablets (portrait) | Tablet-optimized layouts |
| `lg` | 1024px | Tablets (landscape), laptops | Desktop sidebar, multi-column |
| `xl` | 1280px | Desktop monitors | Wide-screen optimizations |
| `2xl` | 1536px | Large desktops | Maximum content width |

#### Responsive Patterns

**Navigation:**
- **Mobile (< 768px):** Bottom navigation bar with 5 primary actions
- **Tablet/Desktop (>= 768px):** Collapsible sidebar navigation

**Data Display:**
- **Mobile:** Card-based lists, vertical stacking
- **Desktop:** Table view with sorting, filtering, pagination

**Forms:**
- **Mobile:** Full-width single-column forms
- **Desktop:** Multi-column forms for efficiency

### 1.7 Accessibility

ChurchAfrica is designed to meet **WCAG 2.1 AA** standards, ensuring usability for all members.

#### Color Contrast

All color combinations meet the following minimum contrast ratios:
- **Body Text (16px+):** 4.5:1
- **Large Text (18px+ or 14px+ bold):** 3:1
- **UI Components:** 3:1
- **Graphical Objects:** 3:1

#### Keyboard Navigation

- All interactive elements are keyboard accessible
- Focus indicators are clearly visible (`ring-2 ring-primary`)
- Tab order follows logical reading flow
- Skip links for main content navigation

#### Screen Reader Support

- Semantic HTML elements (`<nav>`, `<main>`, `<section>`, `<article>`)
- ARIA labels for icon-only buttons
- ARIA live regions for dynamic content updates
- Alt text for all meaningful images

#### Form Accessibility

- Associated labels for all inputs (`<Label htmlFor="">`)
- Error messages with `aria-describedby`
- Required field indicators
- Clear validation feedback

---

## 2. User Flow Diagrams

### 2.1 Authentication Flow

#### **Registration Flow (Multi-Step)**

```
Start: Landing Page → Click "Get Started"
  ↓
Step 1: Account Information
  - First Name, Last Name
  - Email Address
  - Phone Number
  - Password (with strength meter)
  ↓
Step 2: Church Selection
  - Search/Select Church
  - Select Campus (if multi-campus)
  - Select Membership Status (New, Transferring)
  ↓
Step 3: Profile Details
  - Date of Birth
  - Gender
  - Address (optional)
  - Photo Upload (optional)
  ↓
Step 4: Confirmation
  - Review information
  - Agree to Terms & Privacy Policy
  - Submit
  ↓
Success: Email Verification Sent
  ↓
Email Verification → Account Activated
  ↓
Onboarding Tour (Optional)
  ↓
Dashboard
```

**Implementation:** `/components/auth/RegisterForm.tsx`

#### **Login Flow**

```
Start: Login Page
  ↓
Enter Email & Password
  ↓
[Remember Me Checkbox]
  ↓
Submit
  ↓
  ├─ Success → Dashboard
  ├─ 2FA Enabled → 2FA Code Entry → Dashboard
  └─ Error → Show Error Message → Retry or "Forgot Password?"
```

**Implementation:** `/components/auth/LoginForm.tsx`

#### **Password Reset Flow**

```
Start: Login Page → Click "Forgot Password?"
  ↓
Enter Email Address → Submit
  ↓
"Check your email" Confirmation
  ↓
Email Link → Reset Password Page
  ↓
Enter New Password (with strength meter)
Confirm New Password
  ↓
Submit → Success Message
  ↓
Redirect to Login
```

### 2.2 Member Management Flow

#### **Add New Member Flow**

```
Start: Members Page → Click "+ Add Member"
  ↓
Quick Add Dialog Opens
  ↓
Tab 1: Basic Information
  - First Name, Last Name
  - Email, Phone
  - Date of Birth, Gender
  ↓
Tab 2: Membership Details
  - Campus
  - Membership Status
  - Join Date
  - Ministry Involvement (multi-select)
  ↓
Tab 3: Family (Optional)
  - Link to Existing Family or Create New
  - Family Role (Head, Spouse, Child)
  ↓
Tab 4: Additional Information (Optional)
  - Address
  - Emergency Contact
  - Notes
  ↓
Save → Success Toast
  ↓
Member Added to List
```

**Implementation:** `/components/members/AddMemberForm.tsx`

#### **Bulk Import Flow**

```
Start: Members Page → Click "Import"
  ↓
Import Dialog Opens
  ↓
Step 1: Download Template
  - Download CSV template with required fields
  ↓
Step 2: Upload File
  - Drag & drop or click to upload CSV
  - File validation (format, size)
  ↓
Step 3: Map Columns
  - Auto-detect column mappings
  - Manual adjustment if needed
  ↓
Step 4: Preview & Validate
  - Show first 5 rows preview
  - Display validation errors
  - Option to fix errors in-app
  ↓
Step 5: Import
  - Progress bar
  - Error handling for duplicate emails
  ↓
Success Summary
  - X members imported
  - Y errors (downloadable error report)
  ↓
Close Dialog → Refresh Member List
```

**Implementation:** `/components/members/ImportExportDialog.tsx`

### 2.3 Attendance Tracking Flow

#### **Service Check-In Flow (Mobile)**

```
Start: Attendance Page / Dashboard Quick Action
  ↓
Select Service
  - Sunday First Service
  - Sunday Second Service
  - Midweek Service
  - Special Event
  ↓
Check-In Method Selection
  ├─ QR Code Scan
  │   ↓
  │   Camera Opens → Scan Member QR Code
  │   ↓
  │   Member Identified → Confirm Check-In
  │   ↓
  │   Success Animation + Toast
  │
  ├─ Manual Entry
  │   ↓
  │   Search Member (by name, phone, membership number)
  │   ↓
  │   Select Member from Results
  │   ↓
  │   Confirm Check-In → Success
  │
  └─ Self Check-In (Member Portal)
      ↓
      Member Logs In → Displays QR Code
      ↓
      Usher Scans → Confirmed
```

**Implementation:** 
- `/components/attendance/MobileCheckIn.tsx`
- `/components/attendance/QRCodeScanner.tsx`
- `/components/attendance/MemberCheckIn.tsx`

#### **Kiosk Check-In Flow**

```
Start: Kiosk Mode Activated
  ↓
Welcome Screen (Church Logo + "Tap to Check In")
  ↓
Member Interaction
  ├─ Touch Screen → Search by Name
  │   ↓
  │   Virtual Keyboard → Enter Name
  │   ↓
  │   Results List → Select Member
  │   ↓
  │   Confirm Identity (show photo) → Check In
  │
  ├─ Scan QR Code
  │   ↓
  │   Member presents phone QR code
  │   ↓
  │   Camera scans → Instant Check-In
  │
  └─ NFC Card Tap (Future)
      ↓
      Member taps NFC card → Instant Check-In
  ↓
Success Screen
  - "Welcome, [Name]!"
  - Attendance count for today
  ↓
Auto-return to Welcome Screen (5 seconds)
```

**Implementation:** `/components/attendance/CheckInKiosk.tsx`

### 2.4 Event Management Flow

#### **Create Event Flow**

```
Start: Events Page → Click "Create Event"
  ↓
Event Creation Form (Multi-Step)
  ↓
Step 1: Basic Details
  - Event Title
  - Category (Service, Ministry, Outreach, Conference, etc.)
  - Description (rich text editor)
  ↓
Step 2: Date & Time
  - Start Date & Time (date-time picker)
  - End Date & Time
  - All-Day Event Toggle
  - Timezone
  ↓
Step 3: Location
  - Location Type: In-Person / Online / Hybrid
  - If In-Person:
      - Campus Selection or Custom Location
      - Address
      - Map (interactive)
  - If Online:
      - Meeting URL (Zoom, Google Meet, etc.)
  ↓
Step 4: Registration
  - Requires Registration? (Toggle)
  - If Yes:
      - Max Attendees
      - Registration Opens/Closes Dates
      - Registration Form Fields
      - Price (if applicable)
  ↓
Step 5: Media & Details
  - Featured Image Upload
  - Additional Images
  - Organizer Information
  - Contact Person
  ↓
Step 6: Visibility
  - Status: Draft / Published
  - Public Event? (visible to non-members)
  - Featured Event?
  ↓
Preview → Save as Draft or Publish
  ↓
Success: Event Created
  ↓
Options:
  - View Event
  - Create QR Code for Event
  - Share Event
  - Create Another Event
```

**Implementation:** `/components/events/EventManagement.tsx`

#### **Event Registration Flow (Member)**

```
Start: Events List → Click Event Card
  ↓
Event Detail Page
  - Event Banner Image
  - Title, Date, Time, Location
  - Description
  - Organizer Info
  - Current Attendees Count
  ↓
Click "Register" Button
  ↓
Registration Form (if required)
  - Number of Guests (if allowed)
  - Guest Names
  - Special Requirements (textarea)
  - Payment (if paid event)
      - Payment Method Selection
      - Payment Gateway Integration
  ↓
Submit Registration
  ↓
Payment Processing (if applicable)
  ↓
Success Confirmation
  - Registration confirmed
  - QR Code for event check-in
  - Add to Calendar option
  - Email confirmation sent
  ↓
Options:
  - Download QR Code
  - Share Event
  - View My Registrations
```

**Implementation:** `/components/events/EventCard.tsx`

### 2.5 Giving/Donation Flow

#### **Record Donation Flow (Admin)**

```
Start: Giving Dashboard → Click "Record Donation"
  ↓
Donation Form
  ↓
Step 1: Donor Information
  - Search & Select Member
  - Or Anonymous Donation (checkbox)
  ↓
Step 2: Donation Details
  - Donation Type (Tithe, Offering, Building Fund, etc.)
  - Amount (with currency)
  - Quick Amount Buttons (₦1,000, ₦5,000, ₦10,000, etc.)
  ↓
Step 3: Payment Information
  - Donation Date (date picker, defaults to today)
  - Payment Method (Cash, Transfer, Card, Mobile Money, Cheque)
  - If Cheque: Cheque Number
  - If Transfer: Reference Number, Bank Name
  ↓
Step 4: Additional Info (Optional)
  - Campus (if multi-campus)
  - Specific Fund/Campaign
  - Donor Note
  - Admin Note (private)
  ↓
Step 5: Tax Receipt
  - Generate Tax Receipt? (toggle)
  - Receipt Number (auto-generated)
  ↓
Preview Summary
  ↓
Submit → Processing
  ↓
Success Confirmation
  - Donation recorded
  - Receipt generated (if requested)
  - Options:
      - Print Receipt
      - Email Receipt to Donor
      - Record Another Donation
      - View Donation History
```

**Implementation:** `/components/giving/DonationForm.tsx`

#### **Online Giving Flow (Member Portal)**

```
Start: Member Portal → Giving Section → "Give Online"
  ↓
Select Donation Type
  - Tithe
  - Offering
  - Building Fund
  - Mission
  - Special Offering
  - Other (specify)
  ↓
Enter Amount
  - Manual entry or Quick Amount buttons
  ↓
Payment Method Selection
  - Debit/Credit Card
  - Bank Transfer
  - Mobile Money (MTN, Airtel, Glo, 9mobile)
  ↓
Payment Details
  - If Card: Card information form (secure, PCI compliant)
  - If Bank Transfer: Account details displayed, upload proof
  - If Mobile Money: Phone number, provider
  ↓
Recurring Donation? (Optional)
  - Frequency: Weekly, Monthly, Quarterly, Annually
  - Start Date, End Date (optional)
  ↓
Review & Confirm
  - Donation summary
  - Terms & conditions
  ↓
Submit → Payment Gateway Processing
  ↓
  ├─ Success
  │   ↓
  │   Thank You Page
  │   - Confirmation message
  │   - Receipt (downloadable PDF)
  │   - Share on social media
  │   - Email confirmation sent
  │
  └─ Failure
      ↓
      Error Message
      - Retry Payment
      - Try Different Payment Method
      - Contact Support
```

### 2.6 Chat/Messaging Flow

#### **Start Conversation Flow**

```
Start: Chat Page → Click "+ New Message"
  ↓
Select Recipient(s)
  - Search Members
  - Select from Recent Contacts
  - Select from Groups
  - Multiple selection for group chat
  ↓
If Group Chat (>2 participants):
  - Name the Group
  - Upload Group Photo (optional)
  ↓
Compose Message
  - Text input (supports emoji)
  - Attachments (image, video, file)
  ↓
Send → Message Sent
  ↓
Conversation Opens
  - Real-time message delivery
  - Typing indicators
  - Read receipts
  - Message reactions
```

**Implementation:** `/components/chat/ChatInterface.tsx`

### 2.7 Dashboard Customization Flow

```
Start: Dashboard → Click "Customize Dashboard"
  ↓
Customization Panel Opens
  ↓
Options:
  ├─ Rearrange KPI Cards (Drag & Drop)
  ├─ Show/Hide Widgets (Toggle switches)
  ├─ Change Chart Date Range (Dropdown)
  └─ Select Campus Filter (if multi-campus)
  ↓
Save Changes → Dashboard Updates
  ↓
Success Toast: "Dashboard customized"
```

**Implementation:** `/components/dashboard/DashboardCustomizer.tsx`

---

## 3. Feature Coverage Matrix

This matrix maps the PRD features to their UI implementations in the React prototype.

| Feature | UI Components | Implementation Status | Notes |
|:---|:---|:---|:---|
| **Authentication & Authorization** |
| Login | `LoginForm.tsx` | ✅ Complete | Email/password, remember me |
| Registration | `RegisterForm.tsx` | ✅ Complete | Multi-step form, email verification |
| Password Reset | `AuthPage.tsx` | ✅ Complete | Email-based reset flow |
| Role-Based Access | `RoleSwitcher.tsx` | ✅ Complete (Demo) | Super Admin, Church Admin, Pastor, Minister, Volunteer, Member |
| **Member Management** |
| Member List | `MemberList.tsx`, `MemberTable.tsx` | ✅ Complete | Search, filter, pagination |
| Member Details | `MemberDetails.tsx` | ✅ Complete | Full profile view, edit |
| Add Member | `AddMemberForm.tsx` | ✅ Complete | Quick add dialog, multi-tab form |
| Bulk Import/Export | `ImportExportDialog.tsx` | ✅ Complete | CSV import with validation, export |
| Family Management | `FamilyManagement.tsx` | ✅ Complete | Link members to families |
| **Attendance Tracking** |
| Service Selection | `AttendanceServiceSelector.tsx`, `ServiceSelector.tsx` | ✅ Complete | Choose service type |
| QR Code Check-In | `QRCodeScanner.tsx`, `QRCodeGenerator.tsx` | ✅ Complete | Generate & scan member QR codes |
| Manual Check-In | `MemberCheckIn.tsx` | ✅ Complete | Search & select member |
| Kiosk Mode | `CheckInKiosk.tsx` | ✅ Complete | Full-screen self-service kiosk |
| Mobile Check-In | `MobileCheckIn.tsx` | ✅ Complete | Optimized for mobile devices |
| Attendance Reports | `AttendanceAnalytics.tsx` | ✅ Complete | Charts, trends, export |
| **Event Management** |
| Event List | `EventList.tsx` | ✅ Complete | Grid/list view, filters |
| Event Calendar | `EventCalendar.tsx` | ✅ Complete | Monthly calendar view |
| Create/Edit Event | `EventManagement.tsx` | ✅ Complete | Full event form |
| Event Registration | `EventCard.tsx` | ✅ Complete | Registration flow |
| Event QR Codes | `EventQRSystem.tsx` | ✅ Complete | QR code for event check-in |
| **Giving/Donations** |
| Giving Dashboard | `GivingDashboard.tsx` | ✅ Complete | Overview, charts, trends |
| Record Donation | `DonationForm.tsx` | ✅ Complete | Multi-step donation entry |
| Donation History | `GivingDashboard.tsx` | ✅ Complete | List of all donations |
| Campaign Management | `CampaignManager.tsx` | ✅ Complete | Create & track campaigns |
| Giving Reports | `GivingReports.tsx` | ✅ Complete | Financial reports, donor statements |
| Tax Receipts | `TaxReceiptGenerator.tsx` | ✅ Complete | Generate tax receipts |
| **Communication** |
| Real-Time Chat | `ChatInterface.tsx` | ✅ Complete (Mock) | 1-on-1 and group chat |
| Announcements | *Not yet implemented* | ❌ Missing | Church-wide announcements |
| SMS Integration | *Not yet implemented* | ❌ Missing | Bulk SMS sending |
| Email Integration | *Not yet implemented* | ❌ Missing | Email campaigns |
| **Dashboard & Analytics** |
| Main Dashboard | `Dashboard.tsx` | ✅ Complete | KPI cards, charts, activity feed |
| KPI Cards | `KPICard.tsx`, `DraggableKPICard.tsx` | ✅ Complete | Customizable, draggable |
| Attendance Chart | `AttendanceChart.tsx` | ✅ Complete | Line/bar chart with trends |
| Giving Chart | `GivingChart.tsx` | ✅ Complete | Donation trends |
| Visitors Chart | `VisitorsChart.tsx` | ✅ Complete | First-time visitor tracking |
| Activity Feed | `ActivityFeed.tsx` | ✅ Complete | Recent activities |
| Dashboard Tour | `DashboardTour.tsx` | ✅ Complete | Onboarding tour |
| **Organization Management** |
| Organization Setup | `OrganizationSetup.tsx` | ✅ Complete | Multi-step church setup |
| Campus Management | `LocationManager.tsx` | ✅ Complete | Add/edit campuses |
| Branding | `ChurchLogo.tsx`, `ColorPalette.tsx` | ✅ Complete | Logo upload, color customization |
| Settings | `OrganizationSettings.tsx` | ✅ Complete | Church settings |
| **Reports** |
| Reports Hub | `ReportsHub.tsx` | ✅ Complete | Central reports page |
| Attendance Reports | `AttendanceAnalytics.tsx` | ✅ Complete | Detailed attendance analytics |
| Giving Reports | `GivingReports.tsx` | ✅ Complete | Financial reports |
| Service Comparison | `ServiceComparisonReport.tsx` | ✅ Complete | Compare service attendance |
| Donor Statements | `DonorStatements.tsx` | ✅ Complete | Individual donor reports |
| **Member Portal** |
| Member Login | `MemberLogin.tsx` | ✅ Complete | Separate member portal login |
| Member Dashboard | `MemberDashboard.tsx` | ✅ Complete | Personal dashboard |
| Profile Editor | `ProfileEditor.tsx` | ✅ Complete | Edit personal information |
| Biometric Enrollment | `BiometricEnrollment.tsx` | ✅ Complete (Demo) | Fingerprint, face ID |
| **Offline & PWA** |
| PWA Install Prompt | `PWAInstallPrompt.tsx` | ✅ Complete | Custom install prompt |
| Offline Indicator | *To be implemented* | ⚠️ Partial | Visual indicator for offline status |
| Offline Data Sync | *To be implemented* | ❌ Missing | Background sync when online |
| **AI & Advanced Features** |
| AI Dashboard | `AIDashboard.tsx` | ✅ Complete (Mock) | AI insights and recommendations |
| Analytics Hub | `AnalyticsHub.tsx` | ✅ Complete | Advanced analytics |
| Voice Input | `VoiceInput.tsx` | ✅ Complete | Speech-to-text for forms |

### 3.1 Feature Implementation Status Summary

- ✅ **Complete:** 85% of features
- ⚠️ **Partial:** 10% of features (UI complete, functionality mocked)
- ❌ **Missing:** 5% of features (Announcements, SMS, Email, Full Offline Sync)

---

## 4. Component Inventory & Specifications

This section provides detailed specifications for key components.

### 4.1 Layout Components

#### **AppLayout.tsx**

**Location:** `/components/layout/AppLayout.tsx`

**Purpose:** Main authenticated application layout with sidebar and header.

**Props:**
- `children: ReactNode` - Page content

**Structure:**
```tsx
<div className="flex h-screen">
  {/* Sidebar - Hidden on mobile */}
  <Sidebar />
  
  <div className="flex-1 flex flex-col overflow-hidden">
    {/* Header */}
    <AppHeader />
    
    {/* Main Content */}
    <main className="flex-1 overflow-y-auto bg-background">
      {children}
    </main>
    
    {/* Mobile Bottom Navigation */}
    <MobileBottomNav />
  </div>
</div>
```

**Responsive Behavior:**
- **Mobile (<768px):** Sidebar hidden, bottom navigation visible
- **Tablet/Desktop (>=768px):** Sidebar visible, bottom navigation hidden

#### **Sidebar.tsx**

**Location:** `/components/layout/Sidebar.tsx`

**Purpose:** Primary navigation sidebar.

**Features:**
- Collapsible (icon-only mode)
- Active link highlighting
- Badge notifications
- Smooth animations
- Keyboard accessible

**Navigation Structure:**
```tsx
const navigationItems = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Members', href: '/members', icon: Users },
  { name: 'Attendance', href: '/attendance', icon: CheckCircle },
  { name: 'Events', href: '/events', icon: Calendar },
  { name: 'Giving', href: '/giving', icon: DollarSign },
  { name: 'Reports', href: '/reports', icon: BarChart },
  { name: 'Chat', href: '/chat', icon: MessageSquare, badge: 3 },
  { name: 'Settings', href: '/settings', icon: Settings }
]
```

#### **AppHeader.tsx**

**Location:** `/components/layout/AppHeader.tsx`

**Purpose:** Top application header with search, notifications, and user menu.

**Features:**
- Global search with keyboard shortcut (⌘K / Ctrl+K)
- Campus selector (if multi-campus)
- Notification center with badge
- User profile dropdown
- Role switcher (for development/demo)
- Theme toggle (light/dark mode)

**Interactions:**
- Search focuses on click or keyboard shortcut
- Search results appear in popover
- Notifications dropdown shows recent notifications
- User menu includes:
  - Profile
  - Settings
  - Switch Role (admin only)
  - Logout

#### **MobileBottomNav.tsx**

**Location:** `/components/layout/MobileBottomNav.tsx`

**Purpose:** Bottom navigation bar for mobile devices.

**Items:**
- Dashboard
- Members
- Attendance
- Events
- More (opens sheet with additional menu items)

**Implementation:**
```tsx
<nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-surface border-t border-border z-50">
  <div className="flex justify-around items-center h-16">
    {navItems.map(item => (
      <Link key={item.href} href={item.href} className={...}>
        <item.icon className="h-6 w-6" />
        <span className="text-xs">{item.name}</span>
      </Link>
    ))}
  </div>
</nav>
```

### 4.2 Dashboard Components

#### **KPICard.tsx**

**Location:** `/components/dashboard/KPICard.tsx`

**Purpose:** Display key performance indicators with visual styling.

**Props:**
```typescript
interface KPICardProps {
  title: string
  value: string | number
  icon: LucideIcon
  iconColor?: string
  trend?: {
    value: number // Percentage change
    direction: 'up' | 'down'
    period: string // e.g., "vs last month"
  }
  onClick?: () => void
  isLoading?: boolean
}
```

**Visual States:**
- **Normal:** Card with icon, value, title, optional trend
- **Loading:** Skeleton placeholder
- **Hover:** Subtle elevation, cursor pointer (if clickable)
- **Trend Up:** Green arrow and positive value
- **Trend Down:** Red arrow and negative value

**Implementation Example:**
```tsx
<KPICard
  title="Total Members"
  value={1247}
  icon={Users}
  iconColor="text-primary"
  trend={{ value: 5.2, direction: 'up', period: 'vs last month' }}
  onClick={() => navigate('/members')}
/>
```

#### **AttendanceChart.tsx**

**Location:** `/components/dashboard/AttendanceChart.tsx`

**Purpose:** Visualize attendance trends over time.

**Features:**
- Line or bar chart toggle
- Date range selector (7 days, 30 days, 3 months, 1 year)
- Campus filter (if multi-campus)
- Service type filter (Sunday Service, Midweek, etc.)
- Export to CSV

**Chart Library:** Recharts

**Data Structure:**
```typescript
interface AttendanceDataPoint {
  date: string // ISO date string
  count: number
  serviceType: string
  campus?: string
}
```

#### **DraggableKPICard.tsx**

**Location:** `/components/dashboard/DraggableKPICard.tsx`

**Purpose:** KPI card that can be dragged to reorder dashboard layout.

**Features:**
- Drag handle icon
- Smooth drag animations
- Snap to grid positioning
- Save layout preferences to local storage

**Library:** `react-dnd` or `@dnd-kit/core`

### 4.3 Member Management Components

#### **MemberTable.tsx**

**Location:** `/components/members/MemberTable.tsx`

**Purpose:** Data table for displaying and managing members.

**Features:**
- Sortable columns (name, join date, status, campus)
- Row selection (checkboxes)
- Bulk actions (export, assign to group, send message, delete)
- Pagination (10, 25, 50, 100 per page)
- Column visibility toggle
- Responsive (collapses to cards on mobile)

**Columns:**
- Photo (avatar)
- Name (first + last)
- Email
- Phone
- Campus
- Membership Status (badge)
- Join Date
- Actions (dropdown menu)

**Actions Menu:**
- View Profile
- Edit
- Send Message
- Record Donation
- Mark Attendance
- Delete

#### **MemberCard.tsx**

**Location:** `/components/members/MemberCard.tsx`

**Purpose:** Card view for individual member (used in mobile list view).

**Structure:**
```tsx
<Card>
  <CardContent>
    <div className="flex items-start gap-4">
      <Avatar>
        <AvatarImage src={member.photo} />
        <AvatarFallback>{member.initials}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <h3 className="font-semibold">{member.name}</h3>
        <p className="text-sm text-muted-foreground">{member.email}</p>
        <div className="flex gap-2 mt-2">
          <Badge>{member.membershipStatus}</Badge>
          {member.campus && <Badge variant="outline">{member.campus}</Badge>}
        </div>
      </div>
      <DropdownMenu>...</DropdownMenu>
    </div>
  </CardContent>
</Card>
```

#### **MemberFilters.tsx**

**Location:** `/components/members/MemberFilters.tsx`

**Purpose:** Filter members by various criteria.

**Filters:**
- **Search:** Name, email, phone (live search)
- **Campus:** Multi-select dropdown
- **Membership Status:** Active, Inactive, New, Transferred
- **Gender:** Male, Female, Other
- **Age Range:** Slider (0-100)
- **Join Date:** Date range picker
- **Ministry Involvement:** Multi-select

**Implementation:**
```tsx
<Sheet>
  <SheetTrigger asChild>
    <Button variant="outline">
      <Filter className="h-4 w-4 mr-2" />
      Filters
      {activeFiltersCount > 0 && (
        <Badge className="ml-2">{activeFiltersCount}</Badge>
      )}
    </Button>
  </SheetTrigger>
  <SheetContent>
    <SheetHeader>
      <SheetTitle>Filter Members</SheetTitle>
    </SheetHeader>
    {/* Filter controls */}
    <SheetFooter>
      <Button variant="outline" onClick={resetFilters}>Clear All</Button>
      <Button onClick={applyFilters}>Apply Filters</Button>
    </SheetFooter>
  </SheetContent>
</Sheet>
```

### 4.4 Attendance Components

#### **QRCodeGenerator.tsx**

**Location:** `/components/attendance/QRCodeGenerator.tsx`

**Purpose:** Generate unique QR codes for members or services.

**Props:**
```typescript
interface QRCodeGeneratorProps {
  data: string // Data to encode
  size?: number // QR code size in pixels
  logoUrl?: string // Church logo to overlay (optional)
  downloadable?: boolean // Show download button
  filename?: string // Download filename
}
```

**Features:**
- Generates QR code using `qrcode.react`
- Optional logo overlay (centered)
- Download as PNG or SVG
- Print-friendly

**Use Cases:**
- Member identification cards
- Service check-in codes
- Event registration codes

#### **QRCodeScanner.tsx**

**Location:** `/components/attendance/QRCodeScanner.tsx`

**Purpose:** Scan QR codes using device camera.

**Features:**
- Uses `react-qr-reader` or `html5-qrcode`
- Camera permission request
- Front/back camera toggle
- Real-time scanning feedback
- Success animation on valid scan
- Error handling for invalid codes

**Flow:**
```
Camera Preview → Scan QR Code → Validate Code → Process Check-In → Success Feedback
```

**Implementation:**
```tsx
<div className="qr-scanner-container">
  <QrReader
    onScan={handleScan}
    onError={handleError}
    facingMode={facingMode}
  />
  {scanResult && (
    <div className="scan-result">
      <CheckCircle className="text-success" />
      <p>{scanResult.memberName} checked in!</p>
    </div>
  )}
</div>
```

#### **CheckInKiosk.tsx**

**Location:** `/components/attendance/CheckInKiosk.tsx`

**Purpose:** Full-screen kiosk mode for self-service check-in.

**Features:**
- Full-screen mode (F11 or API)
- Large touch targets (minimum 60px)
- Auto-return to home after inactivity (30 seconds)
- On-screen keyboard for search
- QR code scanner integration
- Success animations with confetti effect
- Accessibility (high contrast, large text)

**UI Flow:**
```
Welcome Screen
  ↓
Search or Scan QR Code
  ↓
Member Selection (if multiple matches)
  ↓
Confirmation Screen (show photo)
  ↓
Success Screen (with animation)
  ↓
Auto-return to Welcome Screen
```

### 4.5 Event Components

#### **EventCalendar.tsx**

**Location:** `/components/events/EventCalendar.tsx`

**Purpose:** Monthly calendar view of events.

**Features:**
- Month/week/day view toggle
- Click date to create event
- Click event to view details
- Color-coded by event category
- Drag-and-drop to reschedule (admin only)
- Export to iCal

**Library:** `react-big-calendar` or custom implementation

**Event Display:**
- Single day: Event title in cell
- Multi-day: Spanning bar across dates
- Hover: Tooltip with event details
- Click: Navigate to event detail page

#### **EventCard.tsx**

**Location:** `/components/events/EventCard.tsx`

**Purpose:** Card view for individual event in list/grid.

**Structure:**
```tsx
<Card className="overflow-hidden">
  {/* Featured Image */}
  <img src={event.imageUrl} alt={event.title} className="w-full h-48 object-cover" />
  
  <CardContent className="p-4">
    {/* Event Category Badge */}
    <Badge>{event.category}</Badge>
    
    {/* Event Title */}
    <h3 className="text-lg font-semibold mt-2">{event.title}</h3>
    
    {/* Date & Time */}
    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
      <Calendar className="h-4 w-4" />
      <span>{formatDate(event.startDate)}</span>
    </div>
    
    {/* Location */}
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <MapPin className="h-4 w-4" />
      <span>{event.location}</span>
    </div>
    
    {/* Registration Status */}
    <div className="flex items-center justify-between mt-4">
      <span className="text-sm text-muted-foreground">
        {event.currentAttendees} / {event.maxAttendees} registered
      </span>
      <Button>
        {event.isRegistered ? 'Registered' : 'Register'}
      </Button>
    </div>
  </CardContent>
</Card>
```

### 4.6 Giving Components

#### **DonationForm.tsx**

**Location:** `/components/giving/DonationForm.tsx`

**Purpose:** Form for recording donations (admin) or making donations (member portal).

**Form Fields:**

**Step 1: Donor Information**
- Member search/select (admin) or auto-filled (member portal)
- Anonymous donation checkbox

**Step 2: Donation Details**
- Donation type (select)
- Amount (number input with currency symbol)
- Quick amount buttons (₦1,000, ₦5,000, ₦10,000, Custom)

**Step 3: Payment Information**
- Payment method (select)
- Payment date (date picker)
- Reference/transaction number (if applicable)
- Bank name (if bank transfer)
- Cheque number (if cheque)

**Step 4: Additional Information**
- Campus (if multi-campus)
- Fund/campaign (optional)
- Donor note (textarea)
- Admin note (textarea, admin only)

**Validation:**
- Amount must be greater than 0
- Payment method is required
- Date is required and cannot be in the future
- Reference number required for online payments

#### **GivingChart.tsx**

**Location:** `/components/dashboard/GivingChart.tsx`

**Purpose:** Visualize giving trends and distribution.

**Chart Types:**
- **Line Chart:** Giving over time
- **Bar Chart:** Giving by category (Tithe, Offering, etc.)
- **Pie Chart:** Giving distribution by type
- **Area Chart:** Cumulative giving

**Features:**
- Date range selector
- Campus filter
- Donation type filter
- Export chart as image
- Export data as CSV

### 4.7 Chat Components

#### **ChatInterface.tsx**

**Location:** `/components/chat/ChatInterface.tsx`

**Purpose:** Real-time chat interface for messaging.

**Structure:**
```tsx
<div className="flex h-full">
  {/* Conversations List (Left Sidebar) */}
  <div className="w-80 border-r">
    <ConversationsList />
  </div>
  
  {/* Active Conversation (Main Area) */}
  <div className="flex-1 flex flex-col">
    {/* Conversation Header */}
    <ConversationHeader />
    
    {/* Messages Area */}
    <ScrollArea className="flex-1 p-4">
      <MessagesList />
    </ScrollArea>
    
    {/* Message Input */}
    <MessageInput />
  </div>
</div>
```

**Features:**
- Real-time message delivery (WebSocket)
- Typing indicators ("User is typing...")
- Read receipts (checkmarks)
- Message reactions (emoji)
- File attachments (images, documents)
- Voice messages (future)
- Search conversations
- Unread message badges

**Message Types:**
- Text messages
- Images (inline preview)
- Documents (download link)
- System messages (member joined, etc.)

---

## 5. Layout & Navigation Structure

### 5.1 Layout Hierarchy

```
App.tsx (Root)
  ↓
AppLayout.tsx (Authenticated)
  ├─ Sidebar.tsx (Desktop)
  ├─ AppHeader.tsx (Top)
  ├─ Main Content Area
  │   └─ Page Components
  └─ MobileBottomNav.tsx (Mobile)
```

### 5.2 Navigation Structure

#### **Primary Navigation (Sidebar)**

```
Dashboard
Members
  ├─ All Members
  ├─ Add Member
  ├─ Import Members
  └─ Families
Attendance
  ├─ Check In
  ├─ Attendance Records
  └─ Reports
Events
  ├─ Upcoming Events
  ├─ Calendar View
  ├─ Create Event
  └─ Event Registrations
Giving
  ├─ Dashboard
  ├─ Record Donation
  ├─ Donation History
  ├─ Campaigns
  └─ Reports
Reports
  ├─ Attendance Reports
  ├─ Giving Reports
  ├─ Member Reports
  └─ Custom Reports
Chat
  ├─ Direct Messages
  ├─ Group Chats
  └─ Channels
Settings
  ├─ Organization Settings
  ├─ Campuses
  ├─ Services
  ├─ User Management
  ├─ Roles & Permissions
  └─ Integrations
```

#### **Mobile Bottom Navigation**

- **Dashboard:** Home icon
- **Members:** Users icon
- **Attendance:** Check-circle icon
- **Events:** Calendar icon
- **More:** Three-dots icon (opens drawer with remaining items)

### 5.3 Route Structure

```
/
├─ /auth
│   ├─ /login
│   ├─ /register
│   └─ /forgot-password
├─ /dashboard
├─ /members
│   ├─ /add
│   ├─ /import
│   ├─ /:id (member details)
│   └─ /:id/edit
├─ /attendance
│   ├─ /check-in
│   ├─ /records
│   └─ /reports
├─ /events
│   ├─ /create
│   ├─ /calendar
│   ├─ /:id (event details)
│   └─ /:id/edit
├─ /giving
│   ├─ /record
│   ├─ /history
│   ├─ /campaigns
│   └─ /reports
├─ /reports
│   ├─ /attendance
│   ├─ /giving
│   ├─ /members
│   └─ /custom
├─ /chat
│   └─ /:conversationId
├─ /settings
│   ├─ /organization
│   ├─ /campuses
│   ├─ /services
│   ├─ /users
│   ├─ /roles
│   └─ /integrations
└─ /member-portal (separate portal for members)
    ├─ /login
    ├─ /dashboard
    ├─ /profile
    ├─ /family
    └─ /giving
```

---

## 6. Interaction Patterns

### 6.1 Form Patterns

#### **Form Validation**

- **Real-time Validation:** Validate on blur or after user stops typing (300ms debounce)
- **Error Display:** Show error below input field with red color
- **Success Indication:** Green checkmark icon for valid fields
- **Required Fields:** Red asterisk (*) next to label
- **Disabled Submit:** Disable submit button until form is valid

**Example:**
```tsx
<Form onSubmit={handleSubmit}>
  <FormField
    name="email"
    label="Email Address"
    type="email"
    required
    error={errors.email}
    success={touched.email && !errors.email}
  />
  <Button type="submit" disabled={!isValid || isSubmitting}>
    {isSubmitting ? 'Submitting...' : 'Submit'}
  </Button>
</Form>
```

#### **Multi-Step Forms**

- **Progress Indicator:** Show step numbers and titles
- **Navigation:** Back/Next buttons, with ability to skip optional steps
- **Validation:** Validate each step before proceeding
- **Summary:** Show review page before final submission

**Example:** Member registration (4 steps), Event creation (6 steps)

### 6.2 Data Display Patterns

#### **Loading States**

- **Skeleton Loaders:** Show content placeholders while loading
- **Spinners:** Use for button actions and small components
- **Progress Bars:** Use for file uploads and long operations

**Example:**
```tsx
{isLoading ? (
  <div className="space-y-4">
    <Skeleton className="h-12 w-full" />
    <Skeleton className="h-12 w-full" />
    <Skeleton className="h-12 w-full" />
  </div>
) : (
  <MemberTable data={members} />
)}
```

#### **Empty States**

- **Illustration:** Use relevant icon or illustration
- **Message:** Clear, helpful message explaining why empty
- **CTA:** Prominent call-to-action to add first item

**Example:**
```tsx
<EmptyState
  icon={Users}
  title="No members yet"
  description="Get started by adding your first member to the system."
  action={
    <Button onClick={() => navigate('/members/add')}>
      <Plus className="mr-2 h-4 w-4" />
      Add First Member
    </Button>
  }
/>
```

### 6.3 Modal/Dialog Patterns

#### **Confirmation Dialogs**

- **Title:** Clear, concise question ("Delete member?")
- **Description:** Explain consequences ("This action cannot be undone.")
- **Actions:** Cancel (secondary) and Confirm (primary/destructive)

**Example:**
```tsx
<AlertDialog>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Delete member?</AlertDialogTitle>
      <AlertDialogDescription>
        This will permanently delete {member.name} from the system.
        This action cannot be undone.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction onClick={handleDelete} variant="destructive">
        Delete
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

#### **Form Dialogs**

- **Header:** Title and optional description
- **Content:** Form fields with validation
- **Footer:** Cancel and Submit buttons
- **Close:** X button in top-right corner

### 6.4 Notification Patterns

#### **Toast Notifications**

- **Success:** Green toast, checkmark icon, auto-dismiss (3s)
- **Error:** Red toast, alert icon, manual dismiss or 5s
- **Warning:** Yellow toast, warning icon, manual dismiss or 5s
- **Info:** Blue toast, info icon, auto-dismiss (3s)

**Example:**
```tsx
import { toast } from 'sonner'

toast.success('Member added successfully!')
toast.error('Failed to save. Please try again.')
toast.warning('This action requires admin approval.')
toast.info('A new update is available.')
```

#### **Notification Center**

- **Badge:** Show unread count on bell icon
- **Dropdown:** List of recent notifications
- **Types:** System, Event, Chat, Announcement
- **Actions:** Mark as read, clear all, view all
- **Real-time:** Update via WebSocket

---

## 7. Responsive Design Specifications

### 7.1 Breakpoint Strategy

ChurchAfrica follows a **mobile-first** approach:

1. **Design for mobile first** (320px - 767px)
2. **Enhance for tablet** (768px - 1023px)
3. **Optimize for desktop** (1024px+)

### 7.2 Layout Adaptations

#### **Dashboard**

**Mobile (<768px):**
- Single column layout
- KPI cards stacked vertically
- Charts full width
- Simplified chart controls (dropdown instead of tabs)

**Tablet (768px - 1023px):**
- 2-column grid for KPI cards
- Side-by-side charts (2 columns)
- Persistent sidebar (collapsible)

**Desktop (>=1024px):**
- 4-column grid for KPI cards
- Multi-column chart layout
- Full sidebar with text labels
- More data visible without scrolling

#### **Member List**

**Mobile:**
- Card view (MemberCard)
- Filters in bottom sheet
- Search at top
- Floating action button for "Add Member"

**Desktop:**
- Table view (MemberTable)
- Filters in side panel
- Search and filters in header
- "Add Member" button in header

#### **Forms**

**Mobile:**
- Full-screen form (no dialog)
- Single column
- Larger touch targets (min 44px)
- Sticky footer with action buttons

**Desktop:**
- Dialog/modal form
- Multi-column when appropriate
- Inline validation
- Footer inside dialog

### 7.3 Touch Target Sizes

All interactive elements meet minimum sizes for touch:

| Element | Minimum Size | Recommended Size |
|:---|:---|:---|
| Buttons | 44px × 44px | 48px × 48px |
| Input fields | 44px height | 48px height |
| Checkboxes | 24px × 24px | 28px × 28px |
| Radio buttons | 24px × 24px | 28px × 28px |
| Links (text) | 44px height (with padding) | 48px height |
| Icons (clickable) | 44px × 44px (with padding) | 48px × 48px |

---

## 8. Accessibility Guidelines

### 8.1 Keyboard Navigation

- **Tab Order:** Logical flow matching visual layout
- **Focus Indicators:** Visible focus ring (2px primary color)
- **Skip Links:** "Skip to main content" for screen reader users
- **Keyboard Shortcuts:** Document all keyboard shortcuts

**Common Shortcuts:**
- `Ctrl+K` / `Cmd+K`: Open search
- `Esc`: Close dialogs/modals
- `Arrow keys`: Navigate lists, calendar
- `Enter`: Activate/submit
- `Space`: Toggle checkboxes, select

### 8.2 Screen Reader Support

- **Semantic HTML:** Use appropriate tags (`<button>`, `<nav>`, `<main>`, `<article>`)
- **ARIA Labels:** Provide labels for icon-only buttons
  ```tsx
  <Button aria-label="Close dialog">
    <X className="h-4 w-4" />
  </Button>
  ```
- **Live Regions:** Announce dynamic content
  ```tsx
  <div role="status" aria-live="polite">
    {successMessage}
  </div>
  ```
- **Form Labels:** Associate labels with inputs
  ```tsx
  <Label htmlFor="email">Email</Label>
  <Input id="email" name="email" />
  ```

### 8.3 Color & Contrast

- **Contrast Ratios:**
  - Body text: 4.5:1 minimum
  - Large text: 3:1 minimum
  - UI components: 3:1 minimum
- **Don't rely on color alone:** Use icons, text, or patterns in addition to color
- **Color blindness:** Test with color blindness simulators

---

## 9. Performance Optimization

### 9.1 Loading Strategies

- **Code Splitting:** Lazy load routes and heavy components
  ```tsx
  const MemberDetails = lazy(() => import('./components/members/MemberDetails'))
  ```
- **Image Optimization:** Use next-gen formats (WebP, AVIF), lazy loading
- **Font Loading:** Use `font-display: swap` for faster perceived load

### 9.2 Data Fetching

- **Pagination:** Load 25-50 items at a time
- **Infinite Scroll:** For mobile lists (alternative to pagination)
- **Caching:** Cache API responses locally (React Query, SWR)
- **Optimistic Updates:** Update UI immediately, sync in background

### 9.3 Bundle Size

- **Tree Shaking:** Remove unused code
- **Icon Optimization:** Import only needed icons
  ```tsx
  import { Users } from 'lucide-react' // ✅ Good
  import * as Icons from 'lucide-react' // ❌ Bad
  ```
- **Component Library:** Import components individually

---

## 10. Offline-First UX Patterns

### 10.1 Offline Indicator

**Visual Feedback:**
- Banner at top of screen: "You're offline. Changes will sync when you reconnect."
- Gray out navigation items for features that require connection
- Show "Offline" badge in header

**Component:** (To be implemented)
```tsx
<OfflineBanner>
  <WifiOff className="h-4 w-4 mr-2" />
  You're offline. {pendingChanges} changes pending.
</OfflineBanner>
```

### 10.2 Offline Actions

**Supported Offline Actions:**
- ✅ View member list (cached)
- ✅ View member details (cached)
- ✅ Record attendance (queued)
- ✅ Add member (queued)
- ✅ Edit member (queued)
- ❌ Real-time chat (requires connection)
- ❌ Event registration (requires connection for payment)

**Queue Indicator:**
```tsx
<Badge variant="outline">
  <Clock className="h-3 w-3 mr-1" />
  Syncing... {queuedItems} pending
</Badge>
```

### 10.3 Sync Feedback

**Sync States:**
- **Syncing:** Show progress indicator
- **Success:** Green checkmark, "All changes synced"
- **Error:** Red alert, "Failed to sync X items. Retry?"

---

## 11. Gap Analysis

### 11.1 Features Not Fully Implemented

| Feature | Current State | Gap | Priority |
|:---|:---|:---|:---|
| **Announcements System** | Missing | No UI for church-wide announcements | High |
| **SMS Integration** | Missing | No SMS sending capability | Medium |
| **Email Campaigns** | Missing | No bulk email system | Medium |
| **Offline Data Sync** | Partial | UI designed but sync logic not implemented | High |
| **Payment Gateway Integration** | Mock | Online giving UI exists but no real gateway | High |
| **Biometric Check-In** | Mock | Fingerprint/face ID UI but no device integration | Low |
| **Multi-Language Support** | Missing | Only English, no i18n system | Medium |
| **Advanced Reporting** | Partial | Basic reports exist, needs more custom report builder | Medium |

### 11.2 UI Elements Without Backend Integration

| UI Component | Status | Notes |
|:---|:---|:---|
| Chat Interface | Mock data only | Real-time WebSocket not connected |
| AI Dashboard | Mock data only | No AI/ML backend |
| Biometric Enrollment | Demo only | No device API integration |
| Voice Input | Browser API only | Works but not integrated with forms |
| Payment Forms | Frontend only | No payment gateway backend |

### 11.3 Prototype vs. Production Gaps

| Area | Prototype | Production Need |
|:---|:---|:---|
| **Data Persistence** | Mock data in memory | PostgreSQL database |
| **Authentication** | Simulated | JWT tokens, session management |
| **File Uploads** | Fake uploads | S3/CloudStorage integration |
| **Real-time Features** | Mocked | WebSocket server (Laravel Reverb) |
| **Search** | Client-side only | Server-side full-text search |
| **Permissions** | Role switcher only | Full RBAC with database-backed permissions |

---

## 12. Migration Recommendations

### 12.1 Component Mapping to Quasar

When migrating to Quasar, refer to the component mapping in the Migration Guide:

- `Dialog` → `q-dialog`
- `Sheet` → `q-drawer`
- `Select` → `q-select`
- `Input` → `q-input`
- `Button` → `q-btn`
- `Card` → `q-card`
- `Table` → `q-table`
- etc.

### 12.2 State Management

**React Prototype:**
- Component-level state with `useState`
- Props drilling for shared state
- No global state management

**Production (Pinia):**
- Migrate component state to Pinia stores
- Create stores for each domain (members, attendance, events, etc.)
- Use composition API for better TypeScript support

### 12.3 Styling Migration

**React Prototype (Tailwind v4):**
- OKLCH color space
- Utility-first approach
- Custom CSS variables

**Production (Quasar + Tailwind):**
- Convert OKLCH to RGB/Hex for Quasar variables
- Use Quasar utility classes where possible
- Supplement with Tailwind for custom styling
- Maintain design system consistency

---

## Conclusion

This UI/UX Design Specification provides a comprehensive reference for migrating the ChurchAfrica React prototype to production. Key takeaways:

✅ **Design System:** OKLCH colors, Inter typography, comprehensive component library  
✅ **Mobile-First:** Optimized for African mobile devices  
✅ **Offline-First:** UI patterns for offline functionality  
✅ **Accessibility:** WCAG 2.1 AA compliant  
✅ **Component-Driven:** Reusable, well-documented components  
✅ **User-Centered:** Flows designed for real church management workflows  
✅ **Performance:** Optimized for low-bandwidth environments  

The Vue/Quasar implementation should maintain this design language while adapting to the framework's paradigms and best practices.

---

**Document Version:** 1.0  
**Last Updated:** December 25, 2024  
**Maintained By:** ChurchAfrica Design Team
