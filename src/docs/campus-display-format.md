# Campus Display Format Feature

## Overview

The Campus Display Format feature allows church administrators to configure how campus names are displayed throughout the ChurchAfrica ChMS platform. This accommodates different church organizational structures and naming conventions.

## Business Context

Different church ministries have different naming patterns:

### Location-Based Naming (e.g., Victory Chapel Ministry)
- Pattern: Organization + Location
- Examples: "VCM Lagos", "Victory Chapel Abuja"
- Uses location as the distinguishing factor

### Parish-Based Naming (e.g., RCCG)
- Pattern: Organization + Parish Name
- Examples: "RCCG, Throne Room", "RCCG Fountain of Life Parish"
- Uses unique parish/campus names as the distinguishing factor

### Other Patterns
- Some churches prefer using only the campus name
- Some prefer the full organization name instead of acronym

## Technical Implementation

### 1. Data Model

#### Organization Interface (`/types/organization.ts`)

```typescript
export interface Organization {
  // ... other fields
  branding: {
    logoUrl?: string;
    primaryColor: string;
    websiteUrl?: string;
    campusDisplayFormat: 'acronym-comma-name' | 'acronym-space-name' | 'name-only' | 'full-org-comma-name';
  };
}
```

#### Campus Interface (`/types/organization.ts`)

```typescript
export interface Campus {
  id: string;
  organizationId: string;
  
  // Identity
  name: string;           // Full name: "Victory Chapel Lagos (HQ)"
  code: string;           // Short identifier: "VCL", "RCCG-TR"
  shortName: string;      // Display name: "Lagos", "Throne Room"
  slug: string;
  
  // ... other fields
}
```

### 2. Format Options

| Format Value | Description | Example Output |
|--------------|-------------|----------------|
| `acronym-comma-name` | Acronym, Campus Name | "VCM, Lagos"<br>"RCCG, Throne Room" |
| `acronym-space-name` | Acronym Campus Name | "VCM Lagos"<br>"RCCG Throne Room" |
| `name-only` | Campus Name Only | "Lagos"<br>"Throne Room" |
| `full-org-comma-name` | Full Organization, Campus Name | "Victory Chapel Ministry, Lagos"<br>"Redeemed Christian Church of God, Throne Room" |

### 3. Utility Functions (`/lib/format-campus-name.ts`)

#### Core Function: `formatCampusName()`

Formats a campus name according to the organization's display format setting.

```typescript
import { formatCampusName } from './lib/format-campus-name';

const displayName = formatCampusName({
  campus: campusObject,
  organizationName: 'Victory Chapel Ministry',
  organizationAcronym: 'VCM',
  format: 'acronym-comma-name'
});

// Returns: "VCM, Lagos"
```

#### Helper Function: `getDisplayFormatLabel()`

Returns user-friendly labels for each format option (for UI dropdowns/radio groups).

```typescript
import { getDisplayFormatLabel } from './lib/format-campus-name';

const label = getDisplayFormatLabel('acronym-comma-name');
// Returns: "Acronym, Campus Name (e.g., \"VCM, Lagos\")"
```

#### Helper Function: `getDisplayFormatExample()`

Generates a live preview example for the organization's settings.

```typescript
import { getDisplayFormatExample } from './lib/format-campus-name';

const example = getDisplayFormatExample(
  'acronym-comma-name',
  'Victory Chapel Ministry',
  'VCM',
  'Lagos'
);
// Returns: "VCM, Lagos"
```

### 4. Context Integration (`/contexts/OrganizationContext.tsx`)

The OrganizationContext provides a convenient method for formatting campus names:

```typescript
import { useOrganization } from './contexts/OrganizationContext';

function MyComponent() {
  const { organization, currentCampus, formatCampusDisplayName } = useOrganization();
  
  // Automatically uses the organization's configured format
  const displayName = formatCampusDisplayName(currentCampus);
  
  return <h1>{displayName}</h1>;
}
```

## Where to Apply Display Format

The campus display format should be used in the following locations throughout the platform:

### High Priority (User-Facing)
1. **Navigation Header** - Campus switcher/selector
2. **Dashboard Page Title** - Main heading showing current campus
3. **Breadcrumbs** - Campus navigation paths
4. **Campus Selector Dropdowns** - All campus selection UI
5. **Reports Headers** - Campus name in generated reports
6. **Mobile Navigation** - Campus display in mobile menu

### Medium Priority (Admin/Internal)
7. **Campus Management Lists** - Campus listing tables
8. **Event Management** - Campus display in events
9. **Attendance Records** - Campus identification
10. **Member Profiles** - Campus assignment display
11. **Notifications** - Campus references in messages

### Low Priority (System/Data)
12. **Exports/CSV** - Consider using full name or code instead
13. **API Responses** - May use code or slug for consistency
14. **Logs/Audit Trail** - May use code for brevity

## UI Implementation Guide

### Organization Setup Wizard

During initial organization setup, include a step for configuring the campus display format:

```typescript
// Recommended UI: Radio group with live preview

<FormField>
  <Label>How should campus names be displayed?</Label>
  <RadioGroup value={campusDisplayFormat} onChange={setCampusDisplayFormat}>
    {[
      'acronym-comma-name',
      'acronym-space-name',
      'name-only',
      'full-org-comma-name'
    ].map(format => (
      <RadioItem key={format} value={format}>
        <div>
          <div className="font-medium">
            {getDisplayFormatLabel(format)}
          </div>
          <div className="text-sm text-muted-foreground">
            Preview: {getDisplayFormatExample(
              format,
              organizationName,
              organizationAcronym,
              'Your Campus'
            )}
          </div>
        </div>
      </RadioItem>
    ))}
  </RadioGroup>
</FormField>
```

### Organization Settings

The setting should also be editable in Organization Settings under Branding:

**Location:** Settings → Organization → Branding → Campus Display Format

**UI Components:**
- Dropdown or Radio Group
- Live preview showing how current campuses will appear
- Warning if changing (affects entire platform)
- Save/Cancel buttons

## Data Migration Considerations

### For Existing Organizations

When rolling out this feature to existing organizations:

1. **Default Value:** Set to `'acronym-space-name'` (most common pattern)
2. **Campus Data:** Ensure all campuses have `code` and `shortName` populated
3. **Migration Script Needed:** Extract `shortName` from existing `name` field

### Required Campus Fields

Both `code` and `shortName` must be populated for all campuses:

```typescript
// Example migration logic
const extractShortName = (fullName: string): string => {
  // "Victory Chapel Lagos (HQ)" -> "Lagos"
  // "RCCG, Throne Room" -> "Throne Room"
  
  // Remove HQ designation
  let name = fullName.replace(/\s*\(HQ\)\s*/i, '');
  
  // Remove organization prefix if present
  name = name.replace(/^(VCM|RCCG|Victory Chapel)\s*,?\s*/i, '');
  
  return name.trim();
};

const generateCode = (shortName: string, orgAcronym: string): string => {
  // "Lagos" + "VCM" -> "VCL"
  // "Throne Room" + "RCCG" -> "RCCG-TR"
  
  if (shortName.split(' ').length > 1) {
    // Multi-word: use initials
    const initials = shortName.split(' ').map(w => w[0]).join('');
    return `${orgAcronym}-${initials}`.toUpperCase();
  } else {
    // Single word: use first 1-2 letters
    return `${orgAcronym}${shortName.substring(0, 1)}`.toUpperCase();
  }
};
```

## Examples by Church Type

### Example 1: Victory Chapel Ministry (VCM)

**Organization Data:**
```typescript
{
  name: "Victory Chapel Ministry",
  acronym: "VCM",
  branding: {
    campusDisplayFormat: "acronym-comma-name"
  }
}
```

**Campus Data:**
```typescript
{
  name: "Victory Chapel Lagos (HQ)",
  code: "VCL",
  shortName: "Lagos",
}
```

**Display Output:** "VCM, Lagos"

---

### Example 2: Redeemed Christian Church of God (RCCG)

**Organization Data:**
```typescript
{
  name: "Redeemed Christian Church of God",
  acronym: "RCCG",
  branding: {
    campusDisplayFormat: "acronym-comma-name"
  }
}
```

**Campus Data:**
```typescript
{
  name: "Throne Room Parish",
  code: "RCCG-TR",
  shortName: "Throne Room",
}
```

**Display Output:** "RCCG, Throne Room"

---

### Example 3: Small Church (Single Location)

**Organization Data:**
```typescript
{
  name: "Grace Community Church",
  acronym: "GCC",
  branding: {
    campusDisplayFormat: "name-only"
  }
}
```

**Campus Data:**
```typescript
{
  name: "Main Campus",
  code: "GCC-MAIN",
  shortName: "Main",
}
```

**Display Output:** "Main"

---

### Example 4: Multi-National Ministry

**Organization Data:**
```typescript
{
  name: "Daystar Christian Centre",
  acronym: "DCC",
  branding: {
    campusDisplayFormat: "acronym-space-name"
  }
}
```

**Campus Data:**
```typescript
{
  name: "Daystar Abuja",
  code: "DCC-ABJ",
  shortName: "Abuja",
}
```

**Display Output:** "DCC Abuja"

## Testing Checklist

- [ ] All four format options render correctly
- [ ] Format applies consistently across all platform sections
- [ ] Live preview works in settings UI
- [ ] Changes to format update immediately (or after save)
- [ ] Mobile displays work with all formats
- [ ] Exports/reports use correct format
- [ ] Format persists after page refresh
- [ ] Multi-word campus names work correctly
- [ ] Special characters in campus names handled
- [ ] Empty/null values handled gracefully

## API Considerations

### GET Organization Response
```json
{
  "id": "org_001",
  "name": "Victory Chapel Ministry",
  "acronym": "VCM",
  "branding": {
    "campusDisplayFormat": "acronym-comma-name"
  }
}
```

### GET Campus Response
```json
{
  "id": "campus_001",
  "name": "Victory Chapel Lagos (HQ)",
  "code": "VCL",
  "shortName": "Lagos",
  "isHeadquarters": true
}
```

### PATCH Organization Branding
```json
{
  "branding": {
    "campusDisplayFormat": "acronym-space-name"
  }
}
```

## Performance Notes

- Format calculation is lightweight (string concatenation)
- Consider caching formatted names if used repeatedly in tight loops
- For large campus lists (100+), pre-compute display names before rendering

## Accessibility Considerations

- Ensure screen readers announce campus names correctly
- Consider aria-label with full campus name even when short format displayed
- Maintain semantic HTML structure regardless of format

## Future Enhancements

Potential future improvements:

1. **Custom Templates:** Allow admins to define custom format strings (e.g., `"{code} - {shortName}"`)
2. **Context-Aware Formatting:** Different formats for different contexts (header vs. dropdown)
3. **Multi-Language Support:** Format variations for different languages
4. **Campus Hierarchy:** Support for sub-campuses or campus groups in display

## Related Documentation

- [Organization Management](./organization-management.md)
- [Campus Management](./campus-management.md)
- [Multi-Tenant Architecture](./multi-tenant-architecture.md)
- [Branding System](./branding-system.md)

## Support

For questions or issues with the Campus Display Format feature:
- Technical: Review `/lib/format-campus-name.ts` implementation
- UI/UX: Reference examples in `/components/organization/OrganizationSettings.tsx`
- Data: Check `/types/organization.ts` interfaces

---

**Document Version:** 1.0  
**Last Updated:** November 2025  
**Maintained By:** ChurchAfrica ChMS Development Team
