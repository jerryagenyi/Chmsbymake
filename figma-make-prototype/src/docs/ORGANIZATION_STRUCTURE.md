# ChurchAfrica ChMS - Organization Structure Variables

## Overview
This document defines the standard organizational structure variables used throughout the ChurchAfrica ChMS application.

## Organizational Hierarchy

### 1. Organization / Church Name
**Variable Name**: `churchName` or `organization_name`  
**Type**: `string`  
**Description**: The official name of the church or religious organization  
**Example**: `"The OliveBrook Church, Abuja"`

**Usage**:
```typescript
const churchName = "The OliveBrook Church, Abuja";
```

### 2. Branch / Parish / Campus Name
**Variable Name**: `branchName`, `parishName`, or `campusName`  
**Type**: `string`  
**Description**: The name of a specific branch, campus, or parish within the organization  
**Example**: `"Kubwa Campus"`, `"Wuse 2 Campus"`

**Usage**:
```typescript
const branches = {
  wuse2: "Wuse 2, Abuja",
  kubwa: "Kubwa, Abuja (HQ)"
};

const currentBranch = "kubwa"; // or "wuse2"
const branchName = branches[currentBranch];
```

### 3. Branch Address
**Variable Name**: `branchAddress` or `branch_address`  
**Type**: `string`  
**Description**: The physical address of the specific branch/campus  
**Example**: `"Kubwa, Abuja, Nigeria"`, `"Wuse 2, Abuja, Nigeria"`

**Usage**:
```typescript
const branchAddresses = {
  wuse2: "Wuse 2, Abuja, Nigeria",
  kubwa: "Kubwa, Abuja, Nigeria"
};
```

### 4. Organization Contact Details
**Variable Names**: Various contact-related fields  
**Type**: `string`  
**Description**: Contact information for the organization or branch

**Fields**:
- `organization_phone` / `church_phone`: e.g., `"+234 800 OLIVE 00"`
- `organization_email` / `church_email`: e.g., `"info@olivebrookchurch.org"`
- `organization_website` / `church_website`: e.g., `"www.olivebrookchurch.org"`

### 5. Branch Type Indicator
**Variable Name**: `branchType` or `church_type`  
**Type**: `string`  
**Description**: Indicates if branch is HQ or satellite campus  
**Example**: `"HQ"`, `"Campus"`, `"Kubwa Campus"`

**Usage**:
```typescript
const branches = {
  wuse2: {
    name: "Wuse 2, Abuja",
    type: "Campus",
    isHQ: false
  },
  kubwa: {
    name: "Kubwa, Abuja",
    type: "HQ",
    isHQ: true
  }
};
```

## Current Implementation Example

### App.tsx
```typescript
// Church/Organization context
const [currentBranch, setCurrentBranch] = React.useState<'wuse2' | 'kubwa'>('kubwa');
const churchName = "The OliveBrook Church, Abuja";
const branches = {
  wuse2: "Wuse 2, Abuja",
  kubwa: "Kubwa, Abuja (HQ)"
};
```

### Sidebar.tsx
```typescript
const user = {
  name: 'Pastor John',
  email: 'admin@olivebrookchurch.org',
  role: 'pastor',
  church_name: 'The OliveBrook Church, Abuja',
  church_type: 'Kubwa Campus',
  church_address: 'Kubwa, Abuja, Nigeria',
  church_phone: '+234 800 OLIVE 00',
  church_email: 'info@olivebrookchurch.org',
};
```

## Display Patterns

### Welcome Message (3-line format)
```
Welcome to
The OliveBrook Church, Abuja
Kubwa Campus
```

Implementation:
```typescript
<p className="text-sm text-muted-foreground">Welcome to</p>
<h1>{churchName}</h1>
<div className="h-px bg-border/50 mb-2 max-w-md"></div>
<p className="text-sm text-muted-foreground">{branches[currentBranch]}</p>
```

### Sidebar Display
```
The OliveBrook Church, Abuja
Kubwa Campus
```

### Reports & Documents
For official documents (donor statements, tax receipts, etc.), use:
```
Organization Name: The OliveBrook Church, Abuja
Branch/Campus: Kubwa Campus
Address: Kubwa, Abuja, Nigeria
```

## Migration Notes for Vue Team

When implementing in Vue 3 + Quasar:

```typescript
// Composable or Store
export const useOrganization = () => {
  const currentBranch = ref<'wuse2' | 'kubwa'>('kubwa');
  
  const organization = {
    name: 'The OliveBrook Church, Abuja',
    branches: {
      wuse2: {
        name: 'Wuse 2, Abuja',
        address: 'Wuse 2, Abuja, Nigeria',
        isHQ: false
      },
      kubwa: {
        name: 'Kubwa, Abuja',
        address: 'Kubwa, Abuja, Nigeria',
        isHQ: true
      }
    }
  };
  
  const currentBranchData = computed(() => 
    organization.branches[currentBranch.value]
  );
  
  return {
    organization,
    currentBranch,
    currentBranchData
  };
};
```

## Important Notes

1. **Never hardcode "Victory Chapel Ministry"** - This was demo/placeholder text and should be replaced with actual organization data
2. **Always use variables** - Don't hardcode church names in components
3. **Support multi-branch** - Design all features to work with multiple branches/campuses
4. **British English** - Use "Organisation" in user-facing text, but keep "organization" in code variables
5. **Context awareness** - Components should adapt to show relevant branch information based on current context

## Related Types

See `/types/organization.ts` for TypeScript type definitions (when implemented).

## Last Updated
2024-11-12 - Phase 8 Complete
