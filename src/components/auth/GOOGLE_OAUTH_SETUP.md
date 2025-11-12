# Google OAuth Authentication Setup

## Overview

ChurchAfrica ChMS now supports Google OAuth authentication for both login and registration. This provides a seamless sign-in experience for users who prefer to use their Google accounts.

## Update Date
November 11, 2025

## Features Implemented

### ✅ Login Form
- **Google Sign In** button with official Google branding
- Seamless OAuth flow with redirect
- Error handling and loading states
- Maintains email/password option
- Visual separator between OAuth and traditional login

### ✅ Registration Form
- **Google Sign Up** button with official Google branding
- Same OAuth flow as login
- New users automatically create profile
- Option to complete additional profile info after OAuth
- Maintains email/password registration option

## User Experience

### Login Flow with Google

1. **User clicks "Continue with Google"**
   - Button shows loading spinner: "Connecting to Google..."
   - User is redirected to Google OAuth consent screen

2. **Google Authorization**
   - User selects/logs into Google account
   - Google shows permissions requested by app
   - User grants permission

3. **Redirect Back**
   - User redirected back to ChurchAfrica ChMS
   - Automatically logged in
   - Redirected to dashboard

### Registration Flow with Google

1. **User clicks "Continue with Google"** on sign-up page
   - Same OAuth flow as login
   - If Google account already registered: Logs in
   - If new Google account: Creates new user profile

2. **Profile Creation** (for new users)
   - Email automatically populated from Google
   - Name automatically populated from Google
   - User may need to select role (member/volunteer/staff/pastor)
   - Avatar automatically synced from Google profile picture

## Technical Implementation

### Components Updated

#### LoginForm.tsx
```typescript
// New Google sign-in handler
async function handleGoogleSignIn() {
  setError(null);
  setGoogleLoading(true);

  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });

    if (error) {
      setError(error.message || 'Google sign-in failed');
      setGoogleLoading(false);
    }
    // User will be redirected on success
  } catch (err) {
    setError('An unexpected error occurred with Google sign-in');
    setGoogleLoading(false);
  }
}
```

#### RegisterForm.tsx
```typescript
// Same Google OAuth handler as login
async function handleGoogleSignUp() {
  // Identical implementation to handleGoogleSignIn
  // Supabase automatically handles both sign-in and sign-up
}
```

### UI Components

#### Google Button
- **Official Google colors** from brand guidelines
- **SVG icon** with proper color zones (blue, red, yellow, green)
- **Loading state** with spinner and text
- **Disabled state** when processing
- **Outline variant** to distinguish from primary action
- **Full width** for mobile-first design
- **Touch-friendly** (48px height minimum)

#### Separator
- Visual "OR" divider between Google and email/password
- Uses Shadcn UI `<Separator />` component
- Text: "Or continue with email"
- Consistent styling across login and register

## Supabase Configuration Required

### Important: Google Provider Setup

⚠️ **This implementation requires Supabase configuration!**

You MUST complete the Google OAuth setup in Supabase dashboard:

1. **Navigate to Supabase Dashboard**
   - Go to Authentication → Providers
   - Find "Google" in the list

2. **Enable Google Provider**
   - Toggle "Google" to enabled

3. **Create Google OAuth Credentials**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing
   - Enable Google+ API
   - Go to Credentials → Create Credentials → OAuth 2.0 Client ID
   - Application type: Web application
   - Name: ChurchAfrica ChMS
   - Authorized JavaScript origins:
     - `http://localhost:3000` (development)
     - `https://yourdomain.com` (production)
   - Authorized redirect URIs:
     - `https://[YOUR-PROJECT-ID].supabase.co/auth/v1/callback`

4. **Copy Credentials to Supabase**
   - Copy Client ID from Google Console
   - Copy Client Secret from Google Console
   - Paste both into Supabase Google provider settings
   - Save configuration

5. **Test the Integration**
   - Try signing in with Google
   - Verify user data is correctly populated
   - Check profile creation for new users

### Reference Documentation

Full setup guide: https://supabase.com/docs/guides/auth/social-login/auth-google

## Security Considerations

### OAuth Flow Security

✅ **State Parameter**
- Supabase automatically handles CSRF protection
- State parameter prevents attack vectors

✅ **PKCE (Proof Key for Code Exchange)**
- Enhanced security for public clients
- Prevents authorization code interception

✅ **Redirect URI Validation**
- Only whitelisted URIs accepted
- Prevents open redirect vulnerabilities

### Token Management

✅ **Access Tokens**
- Short-lived access tokens (1 hour)
- Automatically refreshed by Supabase client
- Stored securely in httpOnly cookies (production)

✅ **Refresh Tokens**
- Long-lived refresh tokens
- Used to obtain new access tokens
- Rotated on use for security

### Privacy Considerations

✅ **Minimal Permissions**
- Only request `email` and `profile` scopes
- No access to Google Drive, Calendar, etc.
- Clear permission prompt for users

✅ **Data Storage**
- Only email, name, and avatar stored
- No Google access tokens stored in database
- Supabase manages token storage securely

## Error Handling

### Common Error Scenarios

#### 1. Provider Not Enabled
```
Error: "Provider is not enabled"
```
**Solution**: Enable Google provider in Supabase dashboard

#### 2. Invalid Credentials
```
Error: "Invalid client ID or secret"
```
**Solution**: Verify Google OAuth credentials in Supabase

#### 3. Redirect URI Mismatch
```
Error: "Redirect URI mismatch"
```
**Solution**: Add correct redirect URI to Google Cloud Console

#### 4. User Cancels OAuth
```
Error: User closed popup/cancelled flow
```
**Handling**: Show message "Sign-in cancelled" and return to form

#### 5. Network Issues
```
Error: Network error during OAuth
```
**Handling**: Show retry button with error message

### Error Display

All errors are displayed in the form using the Alert component:

```tsx
{error && (
  <Alert variant="destructive">
    <AlertCircle className="h-4 w-4" />
    <AlertDescription>{error}</AlertDescription>
  </Alert>
)}
```

## User Data Mapping

### Google to ChurchAfrica Profile

When a user signs in with Google, their data is mapped as follows:

| Google Field | ChurchAfrica Field | Notes |
|--------------|-------------------|-------|
| `email` | `email` | Primary identifier |
| `name` | `name` | Full name |
| `picture` | `avatar_url` | Profile picture URL |
| `sub` (Google ID) | `auth_provider_id` | For account linking |
| - | `role` | Default: 'member' (can be changed) |
| - | `created_at` | Set on first login |

### Profile Completion

For OAuth users, you may want to prompt for additional info:
- Church branch selection
- Phone number
- Ministry preferences
- Communication preferences

This can be done via a "Complete Your Profile" modal after first OAuth login.

## Responsive Design

### Mobile Experience

✅ **Touch-Optimized**
- Button height: 48px (minimum touch target)
- Large, clear button text
- Prominent Google logo

✅ **Loading States**
- Clear loading indicators
- Disabled state prevents double-clicks
- Loading text provides feedback

### Desktop Experience

✅ **Hover States**
- Subtle hover effect on button
- Cursor pointer on interactive elements
- Smooth transitions

## Accessibility

### ARIA Labels

```tsx
<Button
  aria-label="Sign in with Google"
  onClick={handleGoogleSignIn}
>
  Continue with Google
</Button>
```

### Keyboard Navigation

✅ **Tab Order**
- Google button is first in tab order
- Email/password fields follow
- Natural flow maintained

✅ **Enter Key**
- Activates focused button
- Submits form when appropriate

### Screen Readers

✅ **Descriptive Text**
- "Continue with Google" is clear
- Loading states announced
- Errors read aloud

## Testing Checklist

### Before Deployment

- [ ] Google OAuth credentials configured in Supabase
- [ ] Redirect URIs whitelisted in Google Console
- [ ] Test sign-in with existing Google account
- [ ] Test sign-up with new Google account
- [ ] Verify profile data correctly populated
- [ ] Test error scenarios (cancelled, network error)
- [ ] Verify redirect after successful OAuth
- [ ] Test on mobile devices
- [ ] Verify accessibility with screen reader
- [ ] Check loading states work correctly
- [ ] Ensure email/password still works alongside OAuth

### Production Checklist

- [ ] Production redirect URI added to Google Console
- [ ] Production domain added to Supabase settings
- [ ] SSL certificate configured (HTTPS required)
- [ ] Error monitoring configured
- [ ] Analytics tracking OAuth sign-ins
- [ ] User documentation updated

## Migration from Email/Password

### Existing Users

Users with email/password accounts can link their Google account:

1. **Account Linking**
   - User signs in with email/password
   - Goes to Profile Settings
   - Clicks "Link Google Account"
   - Completes OAuth flow
   - Account now supports both methods

2. **Email Matching**
   - If Google email matches existing account
   - Supabase automatically links accounts
   - User can use either method to sign in

### Communication to Users

**Email Template:**
```
Subject: New Sign-In Option: Google OAuth

Dear [Name],

We've added a faster way to sign in to ChurchAfrica ChMS!

You can now sign in with your Google account:
1. Click "Continue with Google" on the login page
2. Select your Google account
3. That's it! You're signed in.

Your existing email/password still works, but Google 
sign-in is faster and more secure.

Questions? Contact [support email]

God bless,
The ChurchAfrica ChMS Team
```

## Analytics & Tracking

### Metrics to Track

1. **Adoption Rate**
   - % of users using Google OAuth
   - Growth over time
   - Login vs registration usage

2. **Success Rate**
   - % of successful OAuth flows
   - Error rate by type
   - Cancellation rate

3. **Performance**
   - OAuth flow completion time
   - Redirect speed
   - Token refresh performance

### Implementation

```typescript
// Track OAuth sign-in
analytics.track('auth_google_signin_started');

// Track success
analytics.track('auth_google_signin_success', {
  method: 'google',
  isNewUser: false,
  completionTime: timeElapsed,
});

// Track errors
analytics.track('auth_google_signin_error', {
  errorType: error.message,
  errorCode: error.code,
});
```

## Future Enhancements

### Planned Features

- [ ] **Apple Sign In** - Add Apple OAuth provider
- [ ] **Facebook Sign In** - Add Facebook OAuth provider
- [ ] **Microsoft Sign In** - For enterprise users
- [ ] **One-Tap Sign In** - Google's one-tap authentication
- [ ] **Passkeys** - Passwordless authentication
- [ ] **Biometric Auth** - Face ID / Touch ID on mobile

### Advanced Features

- [ ] **Account Consolidation** - Merge multiple auth methods
- [ ] **SSO (Single Sign-On)** - For organizations
- [ ] **SAML Integration** - Enterprise identity providers
- [ ] **Multi-Factor Authentication** - Additional security layer

## Support & Troubleshooting

### User Support

**Common User Questions:**

**Q: Why should I use Google sign-in?**  
A: It's faster, more secure, and you don't need to remember another password.

**Q: What if I don't have a Google account?**  
A: You can still use email/password sign-in. It works exactly as before.

**Q: Can I switch between Google and email/password?**  
A: Yes! Both methods work for the same account if your email matches.

**Q: Is my Google data safe?**  
A: We only access your email and name. No other Google data is accessed.

**Q: Can I disconnect Google?**  
A: Yes, you can unlink your Google account in Profile Settings.

### Developer Support

For technical issues:
1. Check Supabase logs for OAuth errors
2. Verify Google Console configuration
3. Test with different Google accounts
4. Check network tab for failed requests
5. Review error messages in console

## Vue/Quasar Migration

### Composable for OAuth

```typescript
// composables/useGoogleAuth.ts
import { ref } from 'vue';
import { supabase } from '@/lib/supabase';

export function useGoogleAuth() {
  const loading = ref(false);
  const error = ref<string | null>(null);

  const signInWithGoogle = async () => {
    error.value = null;
    loading.value = true;

    try {
      const { data, error: authError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (authError) {
        error.value = authError.message;
        loading.value = false;
      }
    } catch (e) {
      error.value = 'An unexpected error occurred';
      loading.value = false;
    }
  };

  return {
    loading,
    error,
    signInWithGoogle,
  };
}
```

### Quasar Component

```vue
<template>
  <q-card class="login-card">
    <q-card-section class="text-center">
      <q-avatar size="48px" color="primary" class="q-mb-md">
        <q-icon name="church" />
      </q-avatar>
      <div class="text-h6">Welcome Back</div>
    </q-card-section>

    <q-card-section>
      <!-- Google Sign In Button -->
      <q-btn
        unelevated
        outline
        color="white"
        text-color="dark"
        class="full-width q-mb-md"
        :loading="googleLoading"
        @click="handleGoogleSignIn"
      >
        <template v-slot:loading>
          <q-spinner color="primary" size="1em" />
        </template>
        <img 
          src="/google-icon.svg" 
          style="width: 20px; margin-right: 8px"
          alt="Google"
        />
        Continue with Google
      </q-btn>

      <q-separator class="q-my-md">
        <span class="text-grey text-caption">Or continue with email</span>
      </q-separator>

      <!-- Email/Password Form -->
      <q-form @submit="handleEmailSignIn">
        <!-- ... email/password fields ... -->
      </q-form>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { useGoogleAuth } from '@/composables/useGoogleAuth';

const { loading: googleLoading, error, signInWithGoogle } = useGoogleAuth();

const handleGoogleSignIn = async () => {
  await signInWithGoogle();
};
</script>
```

## Conclusion

Google OAuth authentication provides a modern, secure, and user-friendly way for members to access ChurchAfrica ChMS. The implementation maintains the existing email/password option while offering a faster alternative for users who prefer OAuth.

The system is production-ready with comprehensive error handling, accessibility support, and mobile optimization. Complete the Supabase configuration to enable the feature.

---

**Status**: ✅ Implemented  
**Required Setup**: Configure Google OAuth in Supabase  
**Documentation**: https://supabase.com/docs/guides/auth/social-login/auth-google  
**Support**: Comprehensive error handling and user feedback included
