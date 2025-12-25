# ChurchAfrica ChMS - Color System Documentation

## 🎨 Overview

ChurchAfrica ChMS uses a **forest green (#006239)** primary color with a complete design token system built in OKLCH color space for consistent, accessible, and reusable colors throughout the application.

---

## 🌳 Primary Brand Color

**Forest Green**: `#006239`
- **Light Mode**: `oklch(0.38 0.12 156)` 
- **Dark Mode**: `oklch(0.4365 0.1044 156.7556)`

This green represents **growth, life, and community** - core values of the African church.

---

## 📐 Design Token Usage

### ✅ DO: Use Design Tokens

```tsx
// ✅ CORRECT - Uses design tokens
<div className="bg-primary text-primary-foreground">
<div className="bg-success text-success-foreground">
<div className="text-primary hover:text-primary/80">
```

### ❌ DON'T: Hardcode Colors

```tsx
// ❌ WRONG - Hardcoded colors
<div className="bg-green-500 text-white">
<div className="bg-[#006239] text-white">
<div className="text-green-400 hover:text-green-300">
```

---

## 🎯 Available Color Tokens

### Core Colors

| Token | Use Case | Example |
|-------|----------|---------|
| `bg-primary` | Primary actions, branding | Buttons, headers |
| `text-primary` | Primary text on light backgrounds | Button text |
| `bg-primary-foreground` | Text on primary backgrounds | White/light text |
| `text-primary-foreground` | Foreground on primary | - |

### Semantic Colors

| Token | Use Case | Class Examples |
|-------|----------|----------------|
| **Success** | Positive actions, confirmations | `bg-success`, `text-success` |
| **Warning** | Cautions, alerts | `bg-warning`, `text-warning` |
| **Destructive** | Errors, deletions | `bg-destructive`, `text-destructive` |
| **Info** | Information, tips | `bg-info`, `text-info` |

### UI Colors

| Token | Use Case |
|-------|----------|
| `bg-background` | Page background |
| `bg-foreground` | Primary text color |
| `bg-card` | Card backgrounds |
| `bg-muted` | Subdued backgrounds |
| `text-muted-foreground` | Secondary text |
| `border-border` | Border colors |
| `ring-ring` | Focus rings |

---

## 🔧 Opacity Modifiers

You can add opacity to any token:

```tsx
// 10% opacity
<div className="bg-primary/10">

// 20% opacity
<div className="bg-success/20 text-success">

// 50% opacity
<div className="bg-muted/50">
```

---

## 📝 Common Patterns

### Primary Buttons
```tsx
<Button className="bg-primary text-primary-foreground hover:bg-primary/90">
  Click Me
</Button>
```

### Success Indicators
```tsx
<div className="bg-success/10 border border-success/20">
  <CheckCircle className="text-success" />
  <span className="text-success">Success!</span>
</div>
```

### Status Badges
```tsx
// Online status - use success token
<Badge className="bg-success/20 text-success">Online</Badge>

// Warning status
<Badge className="bg-warning/20 text-warning">Pending</Badge>

// Error status
<Badge className="bg-destructive/20 text-destructive">Failed</Badge>
```

### Progress Bars
```tsx
// Completed portion - use success
<div className="h-2 bg-muted rounded-full">
  <div className="h-full bg-success rounded-full" style={{width: '75%'}} />
</div>
```

---

## 🚨 Migration Guide

If you find hardcoded green colors, replace them:

### Before (Wrong)
```tsx
<div className="bg-green-500 text-green-400">
  <CheckCircle className="text-green-400" />
</div>
```

### After (Correct)
```tsx
<div className="bg-success/10 text-success">
  <CheckCircle className="text-success" />
</div>
```

---

## 🎭 Dark Mode Support

All tokens automatically adjust for dark mode:

```css
/* Light Mode */
--primary: oklch(0.38 0.12 156);           /* Darker green */
--success: oklch(0.38 0.12 156);           /* Same as primary */

/* Dark Mode */
--primary: oklch(0.4365 0.1044 156.7556);  /* Lighter green */
--success: oklch(0.4365 0.1044 156.7556);  /* Same as primary */
```

The system handles contrast automatically - no manual color switching needed!

---

## 🌍 Africa-First Considerations

### Low Bandwidth
- Tokens use CSS variables (small payload)
- No inline color calculations
- Efficient color transitions

### Offline-First
- All colors cached in CSS
- No external color APIs
- Works completely offline

### Accessibility
- OKLCH provides perceptually uniform colors
- Automatic contrast ratios
- WCAG AA+ compliance built-in

---

## 📦 Extending the System

To add a new semantic color:

### 1. Add to globals.css
```css
:root {
  --new-color: oklch(0.5 0.15 200);
  --new-color-foreground: oklch(0.98 0 0);
}

.dark {
  --new-color: oklch(0.6 0.12 200);
  --new-color-foreground: oklch(0.95 0 0);
}
```

### 2. Add to theme config
```css
@theme inline {
  --color-new-color: var(--new-color);
  --color-new-color-foreground: var(--new-color-foreground);
}
```

### 3. Use in components
```tsx
<div className="bg-new-color text-new-color-foreground">
```

---

## ✅ Checklist for New Components

- [ ] Use `bg-primary` instead of `bg-green-*`
- [ ] Use `text-success` for positive states
- [ ] Use `bg-success/10` for subtle success backgrounds
- [ ] Use opacity modifiers (`/10`, `/20`) for tints
- [ ] Test in both light and dark mode
- [ ] Verify contrast ratios meet WCAG AA

---

## 📚 Quick Reference

```tsx
// Primary Actions
bg-primary text-primary-foreground

// Success States
bg-success/10 text-success border-success/20

// Muted/Secondary
bg-muted text-muted-foreground

// Cards
bg-card text-card-foreground border-border

// Interactive States
hover:bg-primary/90 active:bg-primary/95 focus:ring-primary
```

---

## 🆘 Need Help?

If you're unsure which token to use:

1. **Check this guide** for common patterns
2. **Look at similar components** in `/components`
3. **Use `bg-primary`** for brand colors (green)
4. **Use `bg-success`** for positive states (same green)
5. **Never hardcode** hex colors or Tailwind color values

---

**Remember**: Consistent color usage = Professional UI + Easy maintenance + Better UX! 🎨✨
