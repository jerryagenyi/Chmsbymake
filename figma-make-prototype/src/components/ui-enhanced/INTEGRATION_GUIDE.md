# Integration Guide - Enhanced UI Components

## Quick Start

This guide shows how to integrate the new Enhanced UI components into existing ChurchAfrica ChMS pages.

## Import Pattern

```typescript
// Single import
import { AnimatedButton } from './components/ui-enhanced';

// Multiple imports
import { 
  AnimatedButton,
  LoadingSpinner,
  EnhancedInput,
  PhoneInput,
  SuccessMessage 
} from './components/ui-enhanced';
```

## Common Integration Patterns

### 1. Replace Standard Buttons

**Before:**
```tsx
import { Button } from './components/ui/button';

<Button onClick={handleClick}>Save Member</Button>
```

**After:**
```tsx
import { AnimatedButton } from './components/ui-enhanced';

<AnimatedButton 
  variant="primary" 
  onClick={handleClick}
  loading={isSaving}
>
  Save Member
</AnimatedButton>
```

### 2. Enhance Form Inputs

**Before:**
```tsx
<div>
  <label>Email</label>
  <input 
    type="email" 
    placeholder="pastor@church.org"
  />
</div>
```

**After:**
```tsx
import { EnhancedInput } from './components/ui-enhanced';
import { Mail } from 'lucide-react';

<EnhancedInput
  label="Email Address"
  type="email"
  placeholder="pastor@church.org"
  icon={<Mail className="w-5 h-5" />}
  error={emailError}
  required
/>
```

### 3. Add Phone Number Fields

**Before:**
```tsx
<div>
  <label>Phone</label>
  <input type="tel" />
</div>
```

**After:**
```tsx
import { PhoneInput } from './components/ui-enhanced';

<PhoneInput
  label="Phone Number"
  value={phone}
  onChange={setPhone}
  countryCode={countryCode}
  onCountryCodeChange={setCountryCode}
  required
/>
```

### 4. Add Loading States

**Before:**
```tsx
{isLoading && <div className="spinner">Loading...</div>}
```

**After:**
```tsx
import { LoadingSpinner } from './components/ui-enhanced';

{isLoading && <LoadingSpinner variant="dots" size="lg" />}
```

### 5. Show Success/Error Messages

**Before:**
```tsx
{success && <div className="alert">Success!</div>}
```

**After:**
```tsx
import { SuccessMessage } from './components/ui-enhanced';

{success && (
  <SuccessMessage
    message="Member Added!"
    description="John Doe has been added to your church directory."
    variant="success"
    onClose={() => setSuccess(false)}
  />
)}

{error && (
  <SuccessMessage
    message="Error"
    description="Failed to add member. Please try again."
    variant="error"
    onClose={() => setError(null)}
  />
)}
```

### 6. Replace Checkboxes

**Before:**
```tsx
<input 
  type="checkbox" 
  checked={agreed}
  onChange={(e) => setAgreed(e.target.checked)}
/>
<label>I agree</label>
```

**After:**
```tsx
import { AnimatedCheckbox } from './components/ui-enhanced';

<AnimatedCheckbox
  checked={agreed}
  onChange={setAgreed}
  label="I agree to the terms and conditions"
/>
```

## Page-Specific Examples

### Member Registration Form

```tsx
import { 
  EnhancedInput,
  PhoneInput,
  AnimatedCheckbox,
  AnimatedButton,
  SuccessMessage 
} from './components/ui-enhanced';
import { User, Mail } from 'lucide-react';

function MemberRegistration() {
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    phone: '',
    countryCode: '+234',
    agreedToTerms: false
  });
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setLoading(false);
    setSuccess(true);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-md">
      <h2>Register New Member</h2>
      
      <EnhancedInput
        label="Full Name"
        placeholder="John Doe"
        icon={<User className="w-5 h-5" />}
        value={formData.name}
        onChange={(e) => setFormData({...formData, name: e.target.value})}
        required
      />
      
      <EnhancedInput
        label="Email Address"
        type="email"
        placeholder="john@example.com"
        icon={<Mail className="w-5 h-5" />}
        value={formData.email}
        onChange={(e) => setFormData({...formData, email: e.target.value})}
        required
      />
      
      <PhoneInput
        label="Phone Number"
        value={formData.phone}
        onChange={(phone) => setFormData({...formData, phone})}
        countryCode={formData.countryCode}
        onCountryCodeChange={(code) => setFormData({...formData, countryCode: code})}
        required
      />
      
      <AnimatedCheckbox
        checked={formData.agreedToTerms}
        onChange={(agreed) => setFormData({...formData, agreedToTerms: agreed})}
        label="I agree to share my information with church leadership"
      />
      
      <AnimatedButton
        variant="primary"
        type="submit"
        loading={loading}
        disabled={!formData.agreedToTerms}
        className="w-full"
      >
        Register Member
      </AnimatedButton>
      
      {success && (
        <SuccessMessage
          message="Registration Successful!"
          description={`${formData.name} has been registered.`}
          variant="success"
          onClose={() => setSuccess(false)}
        />
      )}
    </form>
  );
}
```

### Dashboard Stats Section

```tsx
import { StatCard, PriceDisplay } from './components/ui-enhanced';
import { Users, TrendingUp, DollarSign, Calendar } from 'lucide-react';

function DashboardStats() {
  return (
    <div className="space-y-6">
      {/* Financial Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <PriceDisplay
          label="Monthly Giving"
          amount={2450000}
          currency="₦"
          highlight={true}
        />
        <PriceDisplay
          label="Building Fund"
          amount={12500000}
          currency="₦"
        />
        <PriceDisplay
          label="This Week"
          amount={450000}
          currency="₦"
        />
      </div>
      
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          label="Total Members"
          value="1,245"
          trend="up"
          trendValue="+12%"
          icon={<Users className="w-5 h-5" />}
        />
        <StatCard
          label="This Week"
          value="892"
          subValue="attendance"
          trend="up"
          trendValue="+5%"
          icon={<Calendar className="w-5 h-5" />}
        />
        <StatCard
          label="New Members"
          value="47"
          subValue="this month"
          trend="up"
          trendValue="+23%"
          icon={<TrendingUp className="w-5 h-5" />}
        />
        <StatCard
          label="Monthly Giving"
          value="₦2.45M"
          trend="up"
          trendValue="+8%"
          icon={<DollarSign className="w-5 h-5" />}
        />
      </div>
    </div>
  );
}
```

### Call-to-Action Section

```tsx
import { CTACard, FeatureCard } from './components/ui-enhanced';
import { Zap, Users, Heart } from 'lucide-react';

function PromoSection() {
  return (
    <div className="space-y-6">
      {/* Main CTA */}
      <CTACard
        title="Upgrade to Pro Plan"
        description="Unlock unlimited members, advanced analytics, custom reports, and priority support for your growing church."
        buttonText="Upgrade Now"
        onClick={() => console.log('Upgrade clicked')}
        icon={<Zap className="w-6 h-6" />}
        gradient={true}
      />
      
      {/* Feature Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FeatureCard
          title="Unlimited Members"
          description="Add as many members as your church grows"
          icon={<Users className="w-6 h-6" />}
        />
        <FeatureCard
          title="Advanced Analytics"
          description="Deep insights into attendance and giving patterns"
          icon={<Heart className="w-6 h-6" />}
        />
        <FeatureCard
          title="Priority Support"
          description="Get help when you need it most"
          icon={<Zap className="w-6 h-6" />}
        />
      </div>
    </div>
  );
}
```

### Social Media Links

```tsx
import { SocialIconGroup } from './components/ui-enhanced';

function ChurchContact() {
  return (
    <div className="space-y-4">
      <h3>Connect With Us</h3>
      
      <SocialIconGroup
        icons={[
          { platform: 'facebook', url: 'https://facebook.com/victorychapel' },
          { platform: 'instagram', url: 'https://instagram.com/victorychapel' },
          { platform: 'twitter', url: 'https://twitter.com/victorychapel' },
          { platform: 'youtube', url: 'https://youtube.com/victorychapel' },
          { platform: 'email', url: 'mailto:info@victorychapel.org' },
          { platform: 'phone', url: 'tel:+2348012345678' },
        ]}
        variant="glow"
        size="md"
      />
    </div>
  );
}
```

### PWA Installation Prompt

```tsx
import { PWAInstallPrompt } from './components/ui-enhanced';

function App() {
  const [showInstallPrompt, setShowInstallPrompt] = React.useState(false);
  const [deferredPrompt, setDeferredPrompt] = React.useState<any>(null);

  React.useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Show prompt after 30 seconds
      setTimeout(() => setShowInstallPrompt(true), 30000);
    });
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`User response: ${outcome}`);
      setDeferredPrompt(null);
    }
    setShowInstallPrompt(false);
  };

  return (
    <>
      {/* Your app content */}
      
      <PWAInstallPrompt
        isOpen={showInstallPrompt}
        onClose={() => setShowInstallPrompt(false)}
        onInstall={handleInstall}
      />
    </>
  );
}
```

### Loading States

```tsx
import { LoadingSpinner, ChatLoadingIndicator } from './components/ui-enhanced';

function MemberList() {
  const [loading, setLoading] = React.useState(true);
  const [members, setMembers] = React.useState([]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner variant="dots" size="xl" />
      </div>
    );
  }

  return (
    <div>
      {/* Member list content */}
    </div>
  );
}

function ChatWindow() {
  const [typing, setTyping] = React.useState(false);

  return (
    <div>
      {/* Messages */}
      
      {typing && (
        <div className="flex items-start gap-3 p-4">
          <Avatar />
          <ChatLoadingIndicator />
        </div>
      )}
    </div>
  );
}
```

### Background Patterns

```tsx
import { PatternContainer, SubtlePattern } from './components/ui-enhanced';

function HeroSection() {
  return (
    <PatternContainer pattern="dots" className="min-h-[400px] bg-[#1A1A20] rounded-2xl">
      <div className="p-12 text-center">
        <h1>Welcome to ChurchAfrica ChMS</h1>
        <p>Modern church management for the African context</p>
      </div>
    </PatternContainer>
  );
}

// Or use standalone pattern
function CustomSection() {
  return (
    <div className="relative bg-[#1A1A20] rounded-2xl overflow-hidden">
      <SubtlePattern variant="grid" opacity={0.05} />
      <div className="relative z-10 p-12">
        {/* Content */}
      </div>
    </div>
  );
}
```

## Tips & Best Practices

### 1. Consistent Variants
Use the same variant throughout related actions:
```tsx
// Primary actions
<AnimatedButton variant="primary">Save</AnimatedButton>
<AnimatedButton variant="primary">Submit</AnimatedButton>

// Secondary actions
<AnimatedButton variant="secondary">Cancel</AnimatedButton>
<AnimatedButton variant="secondary">Back</AnimatedButton>
```

### 2. Loading States
Always show loading state for async operations:
```tsx
const [loading, setLoading] = React.useState(false);

const handleSave = async () => {
  setLoading(true);
  try {
    await saveData();
  } finally {
    setLoading(false);
  }
};

<AnimatedButton loading={loading} onClick={handleSave}>
  Save Changes
</AnimatedButton>
```

### 3. Form Validation
Use error prop to show validation errors:
```tsx
const [errors, setErrors] = React.useState({});

<EnhancedInput
  label="Email"
  error={errors.email}
  onChange={(e) => {
    // Clear error on change
    setErrors({...errors, email: undefined});
  }}
/>
```

### 4. Success Feedback
Always provide feedback for user actions:
```tsx
const [showSuccess, setShowSuccess] = React.useState(false);

const handleSubmit = async () => {
  // ... submit logic
  setShowSuccess(true);
  
  // Auto-hide after 3 seconds (default)
};

{showSuccess && (
  <SuccessMessage
    message="Saved!"
    description="Your changes have been saved successfully."
    onClose={() => setShowSuccess(false)}
  />
)}
```

### 5. Tooltips for Context
Add tooltips to icons and abbreviated text:
```tsx
import { EnhancedTooltip } from './components/ui-enhanced';

<EnhancedTooltip content="Edit member profile" position="top">
  <button className="icon-button">
    <Edit className="w-5 h-5" />
  </button>
</EnhancedTooltip>
```

## Migration Checklist

When upgrading an existing page:

- [ ] Replace standard buttons with `AnimatedButton`
- [ ] Replace input fields with `EnhancedInput`
- [ ] Add `PhoneInput` for phone number fields
- [ ] Replace checkboxes with `AnimatedCheckbox`
- [ ] Add loading states with `LoadingSpinner`
- [ ] Add success/error messages with `SuccessMessage`
- [ ] Add tooltips with `EnhancedTooltip`
- [ ] Add online status with `OnlineStatusIndicator`
- [ ] Consider adding `CTACard` for promotions
- [ ] Use `StatCard` or `PriceDisplay` for metrics
- [ ] Add social links with `SocialIconGroup`
- [ ] Consider background patterns for visual interest
- [ ] Test on mobile devices
- [ ] Verify touch targets are 48px minimum
- [ ] Check accessibility with screen reader

## Performance Considerations

1. **Tree Shaking**: Import only what you need
   ```tsx
   // Good - specific imports
   import { AnimatedButton, EnhancedInput } from './components/ui-enhanced';
   
   // Avoid - imports everything
   import * as UI from './components/ui-enhanced';
   ```

2. **Lazy Loading**: For heavy components
   ```tsx
   const PWAInstallPrompt = React.lazy(() => 
     import('./components/ui-enhanced').then(m => ({ 
       default: m.PWAInstallPrompt 
     }))
   );
   ```

3. **Memoization**: For expensive renders
   ```tsx
   const MemoizedStatCard = React.memo(StatCard);
   ```

## Need Help?

- **Full Documentation**: `/components/ui-enhanced/README.md`
- **Live Examples**: Visit UI Showcase page in the app
- **Source Code**: Check component files for implementation details
- **Type Definitions**: TypeScript interfaces in each component file

---

Happy coding! 🚀
