# ChurchAfrica ChMS - Design System Style Guide
**Version:** 1.0  
**Date:** November 14, 2025  
**Purpose:** Complete visual design specifications for prototype development

---

## 🎨 Colour System (OKLCH)

### Brand Colours
Our colour system uses OKLCH colour space for perceptual uniformity and better colour manipulation.

#### Primary Colours (Blue)
```css
--primary-50: oklch(0.97 0.01 250)    /* Lightest blue background */
--primary-100: oklch(0.94 0.02 250)   /* Light blue background */
--primary-200: oklch(0.87 0.05 250)   /* Subtle blue */
--primary-300: oklch(0.78 0.09 250)   /* Medium light blue */
--primary-400: oklch(0.65 0.14 250)   /* Medium blue */
--primary-500: oklch(0.55 0.18 250)   /* Primary brand blue */
--primary-600: oklch(0.48 0.16 250)   /* Dark blue */
--primary-700: oklch(0.40 0.13 250)   /* Darker blue */
--primary-800: oklch(0.32 0.10 250)   /* Very dark blue */
--primary-900: oklch(0.25 0.07 250)   /* Darkest blue */
```

**Usage:**
- Primary buttons, links, active states
- Navigation highlights
- Key interactive elements
- Focus states

#### Accent Colours (Orange/Amber)
```css
--accent-50: oklch(0.97 0.02 70)     /* Light amber background */
--accent-100: oklch(0.94 0.04 70)    /* Subtle amber */
--accent-200: oklch(0.88 0.08 70)    /* Light amber */
--accent-300: oklch(0.80 0.12 70)    /* Medium amber */
--accent-400: oklch(0.72 0.16 70)    /* Vibrant amber */
--accent-500: oklch(0.65 0.18 70)    /* Primary amber */
--accent-600: oklch(0.58 0.17 70)    /* Dark amber */
--accent-700: oklch(0.50 0.14 70)    /* Darker amber */
--accent-800: oklch(0.42 0.11 70)    /* Very dark amber */
--accent-900: oklch(0.35 0.08 70)    /* Darkest amber */
```

**Usage:**
- Secondary CTAs
- Highlights and badges
- Warning states
- Special promotions

#### Success (Green)
```css
--success-50: oklch(0.97 0.02 145)
--success-500: oklch(0.65 0.15 145)  /* Primary success green */
--success-700: oklch(0.45 0.12 145)
```

**Usage:**
- Success messages
- Positive metrics
- Completed states
- Confirmation actions

#### Warning (Yellow/Orange)
```css
--warning-50: oklch(0.98 0.03 85)
--warning-500: oklch(0.75 0.15 85)   /* Primary warning yellow */
--warning-700: oklch(0.55 0.13 85)
```

**Usage:**
- Warning messages
- Caution indicators
- Pending states
- Important notices

#### Error (Red)
```css
--error-50: oklch(0.97 0.02 25)
--error-500: oklch(0.60 0.20 25)     /* Primary error red */
--error-700: oklch(0.45 0.17 25)
```

**Usage:**
- Error messages
- Destructive actions
- Validation errors
- Critical alerts

#### Neutral/Grey Scale
```css
--neutral-50: oklch(0.98 0 0)        /* Almost white */
--neutral-100: oklch(0.96 0 0)       /* Very light grey */
--neutral-200: oklch(0.92 0 0)       /* Light grey */
--neutral-300: oklch(0.85 0 0)       /* Medium light grey */
--neutral-400: oklch(0.70 0 0)       /* Medium grey */
--neutral-500: oklch(0.55 0 0)       /* True grey */
--neutral-600: oklch(0.45 0 0)       /* Dark grey */
--neutral-700: oklch(0.35 0 0)       /* Darker grey */
--neutral-800: oklch(0.25 0 0)       /* Very dark grey */
--neutral-900: oklch(0.15 0 0)       /* Almost black */
--neutral-950: oklch(0.10 0 0)       /* Pure black */
```

**Usage:**
- Text colours (900, 700, 600)
- Borders (200, 300)
- Backgrounds (50, 100)
- Disabled states (400)

---

## 📝 Typography System

### Font Family
```css
font-family: 'Inter', system-ui, -apple-system, sans-serif;
```

**Fallback Stack:**
- Inter (Primary)
- System UI
- Apple System Font
- Generic sans-serif

### Type Scale

#### Display (Hero Headlines)
- **Display Large:** 72px / 1.1 line-height / -0.02em letter-spacing
- **Display Medium:** 60px / 1.1 line-height / -0.02em letter-spacing
- **Display Small:** 48px / 1.2 line-height / -0.01em letter-spacing

**Usage:** Landing page heroes, major section headers

#### Headings
- **H1:** 36px / 1.2 line-height / -0.01em letter-spacing
- **H2:** 30px / 1.3 line-height / -0.01em letter-spacing
- **H3:** 24px / 1.4 line-height / -0.005em letter-spacing
- **H4:** 20px / 1.4 line-height / normal letter-spacing
- **H5:** 18px / 1.5 line-height / normal letter-spacing
- **H6:** 16px / 1.5 line-height / normal letter-spacing

**Usage:** Page titles, section headers, card titles

#### Body Text
- **Large:** 18px / 1.6 line-height / normal letter-spacing
- **Base:** 16px / 1.6 line-height / normal letter-spacing
- **Small:** 14px / 1.5 line-height / normal letter-spacing
- **XSmall:** 12px / 1.4 line-height / normal letter-spacing

**Usage:** Paragraphs, descriptions, labels, captions

#### Font Weights
- **Light:** 300 (Rarely used, special cases only)
- **Regular:** 400 (Body text, descriptions)
- **Medium:** 500 (Emphasis, form labels, navigation)
- **Semibold:** 600 (Subheadings, button text, strong emphasis)
- **Bold:** 700 (Headings, important callouts)
- **Extrabold:** 800 (Display text, hero headlines)

### Text Colours (Light Mode)
- **Primary Text:** `--neutral-900` (Main content)
- **Secondary Text:** `--neutral-700` (Supporting text)
- **Tertiary Text:** `--neutral-600` (Captions, placeholders)
- **Disabled Text:** `--neutral-400` (Inactive elements)
- **Link Text:** `--primary-600` (Interactive text)
- **Error Text:** `--error-700` (Validation messages)

### Text Colours (Dark Mode)
- **Primary Text:** `--neutral-50` (Main content)
- **Secondary Text:** `--neutral-300` (Supporting text)
- **Tertiary Text:** `--neutral-400` (Captions, placeholders)
- **Disabled Text:** `--neutral-600` (Inactive elements)
- **Link Text:** `--primary-400` (Interactive text)
- **Error Text:** `--error-400` (Validation messages)

---

## 📐 Spacing System

### Base Unit: 4px

Our spacing system uses a 4px base unit for consistency and alignment.

```css
--spacing-0: 0px
--spacing-1: 4px     /* 0.25rem */
--spacing-2: 8px     /* 0.5rem */
--spacing-3: 12px    /* 0.75rem */
--spacing-4: 16px    /* 1rem */
--spacing-5: 20px    /* 1.25rem */
--spacing-6: 24px    /* 1.5rem */
--spacing-8: 32px    /* 2rem */
--spacing-10: 40px   /* 2.5rem */
--spacing-12: 48px   /* 3rem */
--spacing-16: 64px   /* 4rem */
--spacing-20: 80px   /* 5rem */
--spacing-24: 96px   /* 6rem */
--spacing-32: 128px  /* 8rem */
```

### Usage Guidelines

#### Component Padding
- **Extra Small:** 8px (buttons, badges)
- **Small:** 12px (compact cards, inputs)
- **Medium:** 16px (standard cards, modals)
- **Large:** 24px (page sections, containers)
- **Extra Large:** 32px (major sections, hero areas)

#### Component Gaps/Spacing
- **Tight:** 4px (inline elements, icon-text pairs)
- **Compact:** 8px (form field groups, list items)
- **Normal:** 16px (cards in grid, section spacing)
- **Relaxed:** 24px (major content blocks)
- **Loose:** 32px+ (page sections)

#### Margin/Section Spacing
- **Section Top/Bottom:** 64px - 96px
- **Subsection:** 32px - 48px
- **Paragraph:** 16px - 24px

---

## 📏 Layout Grid & Breakpoints

### Responsive Breakpoints
```css
/* Mobile First Approach */
--mobile: 0px          /* Base styles */
--tablet: 640px        /* sm: */
--tablet-lg: 768px     /* md: */
--desktop: 1024px      /* lg: */
--desktop-lg: 1280px   /* xl: */
--desktop-xl: 1536px   /* 2xl: */
```

### Container Max Widths
```css
--container-sm: 640px
--container-md: 768px
--container-lg: 1024px
--container-xl: 1280px
--container-2xl: 1536px
```

### Grid System
- **12 Column Grid** (Standard desktop)
- **8 Column Grid** (Tablet)
- **4 Column Grid** (Mobile)
- **Gutter:** 16px (mobile), 24px (tablet), 32px (desktop)

### Layout Patterns

#### Dashboard Layout
```
[Sidebar: 256px] [Main Content: flex-1] [Secondary Sidebar: 320px]
```

#### Content Layout
```
[Content: max-width-4xl] [Centered with auto margins]
```

#### Form Layout
```
[2-column on desktop, 1-column on mobile]
[Label above input on mobile, side-by-side on desktop]
```

---

## 🎯 Border Radius

### Radius Scale
```css
--radius-none: 0px
--radius-sm: 4px      /* Small elements, badges */
--radius-md: 6px      /* Buttons, inputs */
--radius-lg: 8px      /* Cards, modals */
--radius-xl: 12px     /* Large cards, containers */
--radius-2xl: 16px    /* Hero sections, features */
--radius-3xl: 24px    /* Special containers */
--radius-full: 9999px /* Circular elements, pills */
```

### Usage
- **Buttons:** `--radius-md` (6px)
- **Inputs:** `--radius-md` (6px)
- **Cards:** `--radius-lg` (8px)
- **Modals/Dialogs:** `--radius-xl` (12px)
- **Avatars:** `--radius-full` (circular)
- **Badges/Pills:** `--radius-full`

---

## 🔲 Borders

### Border Widths
```css
--border-0: 0px
--border-1: 1px      /* Standard borders */
--border-2: 2px      /* Emphasis, focus states */
--border-4: 4px      /* Strong emphasis */
```

### Border Colours (Light Mode)
```css
--border-light: var(--neutral-200)     /* Subtle dividers */
--border-medium: var(--neutral-300)    /* Standard borders */
--border-dark: var(--neutral-400)      /* Strong borders */
--border-focus: var(--primary-500)     /* Focus states */
```

### Border Styles
- **Default:** 1px solid `--border-medium`
- **Subtle:** 1px solid `--border-light`
- **Focus:** 2px solid `--border-focus`
- **Error:** 1px solid `--error-500`

---

## 🌓 Shadow System

### Elevation Shadows
```css
/* Light Mode */
--shadow-xs: 0 1px 2px 0 rgb(0 0 0 / 0.05)
--shadow-sm: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)
--shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)
--shadow-2xl: 0 25px 50px -12px rgb(0 0 0 / 0.25)
```

### Usage
- **Cards:** `--shadow-sm`
- **Dropdown Menus:** `--shadow-md`
- **Modals/Dialogs:** `--shadow-xl`
- **Tooltips:** `--shadow-md`
- **Floating Action Buttons:** `--shadow-lg`

### Focus Shadows
```css
--shadow-focus: 0 0 0 3px var(--primary-500) / 0.2
--shadow-error: 0 0 0 3px var(--error-500) / 0.2
```

---

## 🎬 Animation & Transitions

### Timing Functions
```css
--ease-in: cubic-bezier(0.4, 0, 1, 1)
--ease-out: cubic-bezier(0, 0, 0.2, 1)
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1)
--ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55)
```

### Duration
```css
--duration-fast: 150ms      /* Quick interactions */
--duration-normal: 200ms    /* Standard transitions */
--duration-slow: 300ms      /* Deliberate animations */
--duration-slower: 500ms    /* Page transitions */
```

### Common Transitions
```css
/* Hover States */
transition: all 200ms ease-out;

/* Color Changes */
transition: color 150ms ease-out, background-color 150ms ease-out;

/* Transform */
transition: transform 200ms ease-out;

/* Opacity */
transition: opacity 200ms ease-out;
```

### Animation Patterns
- **Hover:** Scale slightly (1.02-1.05), lift with shadow
- **Click:** Scale down (0.98), then return
- **Page Enter:** Fade in + slide up (20px)
- **Modal Enter:** Scale from 0.95 + fade in
- **Toast Notification:** Slide in from top/bottom

---

## 🖼️ Iconography

### Icon Library
**Primary:** Lucide React  
**Size Scale:**
- **XSmall:** 12px
- **Small:** 16px
- **Medium:** 20px (Default)
- **Large:** 24px
- **XLarge:** 32px
- **2XLarge:** 48px

### Icon Usage
- **Navigation:** 20px
- **Buttons:** 16px-20px
- **Input Prefixes:** 16px
- **List Items:** 20px
- **Headers:** 24px
- **Feature Cards:** 32px-48px

### Icon Colours
- **Primary:** Same as text colour
- **Muted:** `--neutral-600` (light mode)
- **Interactive:** `--primary-600`
- **Success:** `--success-600`
- **Warning:** `--warning-600`
- **Error:** `--error-600`

---

## 📱 Mobile-First Considerations

### Touch Targets
- **Minimum Size:** 44px × 44px (iOS guideline)
- **Preferred Size:** 48px × 48px (Android guideline)
- **Spacing:** 8px minimum between interactive elements

### Mobile Patterns
- **Bottom Navigation:** 56px height, 5 items max
- **Fixed Headers:** 56px height on mobile
- **Thumb Zone:** Bottom 1/3 of screen (easy reach)
- **Swipe Gestures:** Left/right for navigation, up/down for refresh
- **Pull to Refresh:** 60px trigger distance

### Progressive Enhancement
1. **Base:** Mobile layout (320px+)
2. **Enhanced:** Tablet layout (768px+)
3. **Full:** Desktop layout (1024px+)

---

## ♿ Accessibility Guidelines

### Colour Contrast
- **Normal Text:** 4.5:1 minimum (WCAG AA)
- **Large Text:** 3:1 minimum (WCAG AA)
- **UI Components:** 3:1 minimum
- **Target:** WCAG AAA (7:1 for normal text)

### Focus States
- **Visible:** All interactive elements must have clear focus
- **Style:** 2px solid primary colour with 3px offset
- **Keyboard Navigation:** Tab order follows visual order

### Screen Readers
- **Alt Text:** All images and icons
- **ARIA Labels:** For icon-only buttons
- **Landmark Regions:** Header, nav, main, aside, footer
- **Skip Links:** Skip to main content

### Motion
- **Respect Prefers-Reduced-Motion:**
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 📸 Photography & Imagery

### Image Guidelines
- **Aspect Ratios:**
  - Hero Images: 16:9 or 21:9
  - Cards: 4:3 or 16:9
  - Avatars: 1:1 (square)
  - Thumbnails: 1:1 or 4:3

- **Quality:** Use Unsplash for placeholder images
- **Optimization:** WebP format preferred, JPEG fallback
- **Size:** Max 1920px width for heroes, 800px for cards

### African Context
- **Representation:** Use diverse, representative imagery
- **Cultural Sensitivity:** Respect local customs and traditions
- **Authenticity:** Real church settings when possible
- **Inclusivity:** All ages, genders, abilities represented

---

## 🎨 Illustration Style

### Characteristics
- **Style:** Simple, minimal, friendly
- **Colours:** Use brand palette
- **Line Weight:** 2-3px consistent
- **Usage:** Empty states, onboarding, error pages

### Empty State Illustrations
- **Size:** 200-300px
- **Placement:** Centered in container
- **Message:** Clear, actionable text below

---

## 📦 Component States

### Interactive States Matrix

#### Button States
- **Default:** Base colours, medium shadow
- **Hover:** Slightly darker, larger shadow
- **Active:** Scale down 98%, pressed shadow
- **Focus:** Focus ring, high contrast
- **Disabled:** Reduced opacity (40%), no pointer
- **Loading:** Spinner, disabled interaction

#### Input States
- **Default:** Border subtle, background white
- **Focus:** Primary border, focus ring
- **Filled:** Subtle background change
- **Error:** Red border, error text below
- **Disabled:** Grey background, no interaction
- **Read-Only:** Border dashed, no focus state

#### Card States
- **Default:** Subtle shadow, white background
- **Hover:** Elevated shadow, slight lift
- **Selected:** Primary border, highlight background
- **Loading:** Skeleton screen
- **Empty:** Illustration + message
- **Error:** Error icon + message

---

## 🌐 Internationalization

### Text Direction
- **Primary:** LTR (Left-to-Right)
- **Future:** RTL support planned

### Language
- **UI Text:** British English
- **Code:** American English (file names, variables)

### Number Formats
- **Currency:** £ symbol, 2 decimal places
- **Dates:** DD/MM/YYYY (British format)
- **Time:** 24-hour format preferred

---

## 📋 Design Tokens

All design tokens are defined in `/styles/globals.css` using CSS custom properties.

### Token Naming Convention
```css
--{category}-{property}-{variant}

Examples:
--color-primary-500
--spacing-4
--radius-md
--shadow-lg
```

### Usage in Code
```css
/* Preferred */
background-color: var(--color-primary-500);
padding: var(--spacing-4);

/* Avoid */
background-color: #3b82f6;
padding: 16px;
```

---

## ✅ Design Checklist

### Before Designing a Screen
- [ ] Review similar patterns in existing screens
- [ ] Check mobile, tablet, desktop layouts
- [ ] Consider empty, loading, error states
- [ ] Plan keyboard navigation
- [ ] Verify colour contrast
- [ ] Check touch target sizes (mobile)

### Before Handoff
- [ ] All screens have responsive variants
- [ ] Component states documented
- [ ] Spacing follows system
- [ ] Colours from palette only
- [ ] Typography scale followed
- [ ] Accessibility checked
- [ ] Assets exported and named

---

**Last Updated:** November 14, 2025  
**Maintained By:** Design Team  
**Next Review:** Monthly or as needed
