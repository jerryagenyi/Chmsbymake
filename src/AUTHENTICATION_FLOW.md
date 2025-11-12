# ChurchAfrica ChMS - Authentication & Registration Flow

## 🔐 Authentication Logic

### Overview
ChurchAfrica ChMS implements a **role-based authentication system** with distinct flows for administrators and church members.

---

## 👥 User Types & Registration

### 1. **Church Members** (Regular Users)
- ❌ **CANNOT self-register**
- ✅ **Added by administrators** through the Member Management system
- 🔑 Receive login credentials via email/SMS from church admin
- 📱 Use Member Portal for login

**Member Onboarding Flow:**
```
1. Admin creates member profile in Member Management
   ↓
2. System generates temporary password
   ↓
3. Member receives email/SMS with credentials
   ↓
4. Member logs in via Member Portal
   ↓
5. System prompts for password change on first login
   ↓
6. Member verifies email/phone
   ↓
7. Full access granted
```

### 2. **Administrators & Staff** (System Users)
- ✅ **CAN self-register** through registration form
- 🛡️ All registrations require approval from existing admin
- 🔐 Access to Admin Dashboard after approval
- 🎯 Roles: Staff, Pastor, System Administrator

**Admin Registration Flow:**
```
1. New admin registers via /register page
   ↓
2. Account created with "Pending Approval" status
   ↓
3. Existing admin receives notification
   ↓
4. Admin reviews and approves/rejects request
   ↓
5. New admin receives approval email
   ↓
6. Full admin access granted
```

---

## 🎭 Authentication Roles

| Role | Can Self-Register? | Added By | Access Level |
|------|-------------------|----------|--------------|
| **Member** | ❌ No | Admin via Member Management | Member Portal |
| **Volunteer** | ❌ No | Admin via Member Management | Member Portal + Volunteer Features |
| **Staff** | ✅ Yes | Self-registration (requires approval) | Admin Dashboard (Limited) |
| **Pastor** | ✅ Yes | Self-registration (requires approval) | Admin Dashboard (Full) |
| **Admin** | ✅ Yes | Self-registration (requires approval) | Admin Dashboard (Full + System Settings) |

---

## 📋 Registration Forms

### A. **Member Registration** 
**Location:** N/A - Not available  
**Purpose:** Members don't register themselves

Members are added through:
- `/admin/members` - Member Management interface
- Bulk import feature
- API integration

### B. **Admin Registration**
**Location:** `/register` or Auth page "Register" tab  
**Purpose:** Administrative staff onboarding

**Form Fields:**
- Full Name
- Email Address
- Administrative Role (Staff / Pastor / Admin)
- Password (with strength meter)
- Confirm Password

**Features:**
- ✅ Password strength meter with 700ms slide animation
- ✅ Eye toggle for password visibility
- ✅ Google OAuth option
- ✅ Clear info banner explaining admin-only registration
- ✅ Approval requirement notice

---

## 🚪 Login Portals

### 1. **Member Portal Login**
**Location:** `/member-portal`  
**Authentication Methods:**
- 📧 Email + Password
- 📱 Phone Number + Password
- 🆔 Member ID + Password
- 🔐 Google OAuth

**Features:**
- Auto-detection of identifier type
- Flexible login (email/phone/ID)
- First-time user guidance
- Password strength feedback

### 2. **Admin Dashboard Login**
**Location:** `/` or `/admin`  
**Authentication Methods:**
- 📧 Email + Password
- 🔐 Google OAuth

**Features:**
- Standard email/password login
- Google OAuth for quick access
- Forgot password flow
- Session persistence

---

## 🔄 Password Policies

### Requirements
All passwords must contain:
- ✅ Minimum 8 characters
- ✅ At least 1 lowercase letter (a-z)
- ✅ At least 1 uppercase letter (A-Z)
- ✅ At least 1 special character (!@#$%^&*)

### Strength Levels
| Score | Label | Color | Requirements Met |
|-------|-------|-------|------------------|
| 0 | Very Weak | Red | 0 requirements |
| 1 | Weak | Orange | 1 requirement |
| 2 | Fair | Yellow | 2 requirements |
| 3 | Good | Blue | 3 requirements |
| 4 | Strong | Green | All 4 requirements |

### First Login
- Members receive temporary password
- **Must change password** on first login
- New password must meet strength requirements
- Email/phone verification required

---

## 🎬 Password Strength Meter

### Animation
- **Duration:** 700ms (slower, smooth)
- **Type:** Slide-down from top
- **Trigger:** Password field has content
- **Layout:** Maintains form width (max-w-lg)

### Display
```tsx
Password Strength: Strong ⭐⭐⭐⭐⭐

Requirements:
✅ At least 8 characters
✅ One lowercase letter (a-z)
✅ One uppercase letter (A-Z)
✅ One special character (!@#$%^&*)

💡 Excellent! Your password is strong and secure
```

---

## 🔒 Security Considerations

### Password Security
- ✅ Passwords hashed with bcrypt
- ✅ Minimum complexity requirements
- ✅ Temporary passwords expire after first use
- ✅ Password reset via email/SMS

### Session Management
- ✅ JWT-based authentication
- ✅ Refresh tokens for persistent sessions
- ✅ Auto-logout after inactivity
- ✅ Device-specific sessions

### OAuth Integration
- ✅ Google OAuth for quick signup/login
- ✅ Automatic profile creation
- ✅ Email verification via Google
- ✅ Seamless integration with church email domains

---

## 🌍 Africa-First Considerations

### SMS-Based Authentication
- Phone number as primary identifier
- SMS verification for password resets
- Low-bandwidth friendly
- Works without internet (SMS delivery)

### Offline-First
- Credentials cached locally (encrypted)
- Background sync when online
- Offline login with cached credentials
- Queue password changes for sync

### Low-Bandwidth
- Minimal authentication payload
- Compressed token storage
- Progressive authentication (basic → full)
- Local validation before server check

---

## 📱 Vue/Quasar Migration Notes

### Authentication Store
```typescript
// Pinia store structure
const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: null,
    isAuthenticated: false,
    role: null,
  }),
  actions: {
    async login(credentials) { ... },
    async register(userData) { ... },
    async logout() { ... },
  }
})
```

### Route Guards
```typescript
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  
  // Check admin routes
  if (to.meta.requiresAdmin && !authStore.isAdmin) {
    next('/member-portal');
  }
  
  // Check auth
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login');
  }
  
  next();
});
```

---

## ✅ Summary

**Key Points:**
1. ❌ Members **CANNOT** self-register
2. ✅ Admins/Staff **CAN** self-register (with approval)
3. 👥 Members added by admins via Member Management
4. 🔐 Strong password requirements with visual feedback
5. 📱 Multiple login methods for flexibility
6. 🌍 Africa-First: SMS, offline-capable, low-bandwidth

This design ensures:
- **Security**: Controlled access via admin approval
- **Flexibility**: Multiple authentication methods
- **Usability**: Clear guidance for first-time users
- **Scalability**: Easy to add new members in bulk
- **Context-Appropriate**: Designed for African church operations
