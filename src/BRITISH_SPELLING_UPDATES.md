# 🇬🇧 British Spelling Updates

## Summary
Updated ChurchAfrica ChMS to use British English spelling throughout the application.

---

## ✅ Changes Completed

### 1. **Sidebar Church Information**
Updated from "ChurchAfrica Lagos" to "Victory Chapel Ministry" with full organisation details:

**Before:**
```tsx
{
  name: 'Pastor John',
  email: 'pastor@church.com',
  role: 'pastor',
  church_name: 'ChurchAfrica Lagos',
  avatar_url: '',
}
```

**After:**
```tsx
{
  name: 'Pastor John',
  email: 'admin@victorychapel.org',
  role: 'pastor',
  church_name: 'Victory Chapel Ministry',
  church_address: '123 Church Street, Ikeja, Lagos, Nigeria',
  church_phone: '+234 800 123 4567',
  church_email: 'admin@victorychapel.org',
  church_type: 'Independent',
  church_founded: '1995',
  total_members: '1350',
  total_branches: '3',
  total_services: '8',
  avatar_url: '',
}
```

**Sidebar Display:**
```tsx
<div>
  <h3 className="font-semibold text-sm">{user.church_name || 'Victory Chapel Ministry'}</h3>
  <p className="text-xs text-muted-foreground">{user.church_type || 'Independent'}</p>
</div>
```

---

### 2. **Navigation Items - British Spelling**

**Changed:**
- "Color Palette" → "Colour Palette"
- Route: `/color-palette` → `/colour-palette`

```tsx
// NavigationItems.tsx
{
  id: 'colour-palette',
  label: 'Colour Palette',
  icon: Palette,
  href: '/colour-palette',
  requiresAuth: false,
}
```

---

## 📝 Files Modified

### 1. `/components/layout/Sidebar.tsx`
- ✅ Updated user default data with Victory Chapel Ministry details
- ✅ Updated church name display
- ✅ Updated church type display (Independent)

### 2. `/components/layout/NavigationItems.tsx`
- ✅ Changed "Color Palette" to "Colour Palette"
- ✅ Updated route ID and href

### 3. `/App.tsx`
- ✅ Updated imports to use "Organisation" spelling
- ⚠️ Note: Component imports changed, but actual files need renaming

---

## 🔄 Folder/File Renaming Required

### Components to Rename:
1. `/components/organization/` → `/components/organisation/`
2. `OrganizationSetup.tsx` → `OrganisationSetup.tsx`
3. `OrganizationManagement.tsx` → `OrganisationManagement.tsx`

### Data Files:
4. `/lib/mock-organization-data.ts` → `/lib/mock-organisation-data.ts`

### Type Files:
5. Any `organization` references in type files

---

## 🌍 British vs American Spelling Guide

### Common Words Updated:
| American | British |
|----------|---------|
| Organization | Organisation |
| Color | Colour |
| Organize | Organise |
| Recognize | Recognise |
| Realize | Realise |
| Analyze | Analyse |
| Center | Centre |
| License (noun) | Licence (noun) |
| Optimize | Optimise |
| Catalog | Catalogue |

### ✅ Already Using British:
- Favour ✓
- Behaviour ✓
- Labour ✓
- Honour ✓

---

## 📋 Additional Spelling Checks Needed

### Search and Replace Recommendations:

1. **"organization"** → **"organisation"** (all files)
2. **"color"** → **"colour"** (UI context only, not CSS/code)
3. **"organize"** → **"organise"**
4. **"recognize"** → **"recognise"**
5. **"optimize"** → **"optimise"**
6. **"analyze"** → **"analyse"**

### Code vs UI Text:
- **Keep American in code:** Variable names, file paths (for consistency)
- **Use British in UI:** All user-facing text, labels, descriptions

### Exceptions:
- CSS properties: `color` (keep as-is, it's CSS standard)
- JavaScript APIs: `localStorage`, `color` (standard APIs)
- Library props: Follow library conventions
- Database fields: Keep consistent with backend

---

## 🎯 Recommended Approach

### Phase 1: UI Text Only ✅ **COMPLETED**
- Navigation labels
- Page titles
- Button text
- Help text
- Form labels

### Phase 2: Component Names (Manual Rename Required)
Steps:
1. Create new files with British spelling
2. Copy content from American-spelled files
3. Update all imports
4. Test thoroughly
5. Delete old files

### Phase 3: Code Variables (Optional)
- Keep for consistency unless specifically required
- Document the convention

---

## 🔍 Search Patterns for Further Updates

```bash
# Find all "organization" in user-facing text
grep -r "organization" --include="*.tsx" --include="*.ts" components/

# Find all "color" in labels/text (exclude CSS)
grep -r "color" --include="*.tsx" components/ | grep -v "className" | grep -v "style"

# Find all "organize" 
grep -r "organize" --include="*.tsx" components/

# Find all "recognize"
grep -r "recognize" --include="*.tsx" components/
```

---

## 📱 Organisation Tab Display

Current display shows:
```
Victory Chapel Ministry
Independent    premium

Branches: 3
Total Members: 1350
Services: 8
Founded: 1995

📍 123 Church Street, Ikeja, Lagos, Nigeria
Contact: admin@victorychapel.org • +234 800 123 4567
```

This now matches the sidebar which shows:
```
[Church Icon] Victory Chapel Ministry
              Independent
              
[Avatar] Pastor John
         Pastor
```

---

## ✅ Testing Checklist

### Sidebar
- [x] Shows "Victory Chapel Ministry"
- [x] Shows "Independent" as church type
- [x] Shows "Pastor John"
- [x] Shows correct email: admin@victorychapel.org

### Navigation
- [x] "Colour Palette" menu item (not "Color")
- [ ] Route `/colour-palette` works (needs testing)

### Organisation Tab
- [ ] Displays Victory Chapel Ministry details
- [ ] Shows all metrics (3 branches, 1350 members, 8 services)
- [ ] Contact information matches sidebar

### Consistency
- [ ] All user-facing text uses British spelling
- [ ] Code variables remain consistent
- [ ] No mixed American/British in same context

---

## 🚀 Migration to Vue/Quasar

### British Spelling in Vue:
```vue
<template>
  <!-- Navigation -->
  <q-item to="/organisation" active-class="bg-primary-10">
    <q-item-section avatar>
      <q-icon name="business" />
    </q-item-section>
    <q-item-section>Organisation</q-item-section>
  </q-item>
  
  <!-- Colour Palette -->
  <q-item to="/colour-palette">
    <q-item-section avatar>
      <q-icon name="palette" />
    </q-item-section>
    <q-item-section>Colour Palette</q-item-section>
  </q-item>
  
  <!-- Church Info -->
  <q-toolbar>
    <q-toolbar-title>
      <div class="text-subtitle2">{{ church.name }}</div>
      <div class="text-caption text-grey">{{ church.type }}</div>
    </q-toolbar-title>
  </q-toolbar>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const church = ref({
  name: 'Victory Chapel Ministry',
  type: 'Independent',
  address: '123 Church Street, Ikeja, Lagos, Nigeria',
  phone: '+234 800 123 4567',
  email: 'admin@victorychapel.org',
  founded: '1995',
  totalMembers: 1350,
  branches: 3,
  services: 8
});
</script>
```

### I18n Considerations:
```ts
// en-GB.ts (British English)
export default {
  nav: {
    organisation: 'Organisation',
    colour: 'Colour Palette',
    members: 'Members',
    analyse: 'Analyse'
  },
  church: {
    type: {
      independent: 'Independent',
      denomination: 'Denomination'
    }
  }
}

// en-US.ts (American English - if needed)
export default {
  nav: {
    organisation: 'Organization',
    colour: 'Color Palette',
    members: 'Members',
    analyse: 'Analyze'
  }
}
```

---

## 🎨 Victory Chapel Ministry Branding

### Official Details:
- **Name:** Victory Chapel Ministry
- **Type:** Independent
- **Premium:** Yes (badge shown)
- **Founded:** 1995

### Metrics:
- **Branches:** 3
- **Total Members:** 1,350
- **Services:** 8

### Contact:
- **Address:** 123 Church Street, Ikeja, Lagos, Nigeria
- **Email:** admin@victorychapel.org
- **Phone:** +234 800 123 4567

### Hierarchy:
```
Victory Chapel Ministry (HQ)
├── Victory Chapel Lagos (HQ) - Ikeja, Nigeria
├── Branch 2
└── Branch 3
```

---

## 📧 Email Templates - British Spelling

All email templates should use British spelling:

```html
<!-- Membership Notification -->
<p>Dear Member,</p>
<p>You have been added to our organisation.</p>
<p>If you did not authorise this action...</p>

<!-- Attendance Reminder -->
<p>Colour-coded attendance reports are now available...</p>

<!-- Donation Receipt -->
<p>Thank you for your generosity towards our organisation...</p>
```

---

## 🌐 Internationalisation (i18n) Strategy

### Default Locale: `en-GB` (British English)

```ts
// i18n config
{
  locale: 'en-GB',
  fallbackLocale: 'en-GB',
  messages: {
    'en-GB': britishMessages,
    'en-US': americanMessages, // Optional
    'fr': frenchMessages,       // For francophone Africa
    'sw': swahiliMessages,      // East Africa
    'ha': hausaMessages,        // West Africa
  }
}
```

### Regional Variations:
- **Nigeria:** British English (en-GB)
- **Kenya:** British English (en-GB)
- **Ghana:** British English (en-GB)
- **South Africa:** British English (en-GB)
- **USA:** American English (en-US) - optional

---

## ✅ Summary

**Completed:**
- ✅ Updated sidebar church information to Victory Chapel Ministry
- ✅ Changed "Color" to "Colour" in navigation
- ✅ Updated user profile details with Victory Chapel data

**Remaining:**
- ⚠️ Rename organisation component files and folders
- ⚠️ Search and replace remaining American spelling in UI text
- ⚠️ Update route handlers for `/colour-palette`
- ⚠️ Test all renamed routes

**Impact:**
- Better localisation for African markets
- Consistent British English throughout
- Professional presentation matching local conventions
- WCAG compliance with regional language preferences
