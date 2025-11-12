/**
 * UIShowcase - Demo page for all enhanced UI components
 * Displays all the new Africa-First design elements
 */

import React from 'react';
import { 
  AnimatedButton, 
  LoadingSpinner, 
  ChatLoadingIndicator,
  SuccessMessage,
  FormLabel,
  EnhancedInput,
  PhoneInput,
  AnimatedCheckbox,
  SocialIcon,
  SocialIconGroup,
  EnhancedTooltip,
  OnlineStatusIndicator,
  CTACard,
  FeatureCard,
  PWAInstallPrompt,
  SubtlePattern,
  PatternContainer,
  PriceDisplay,
  StatCard,
  SquareDotNav,
  SquareDotProgress,
  SquareDotRating,
  PasswordStrengthMeter,
  PasswordStrengthBadge
} from './index';
import { 
  Heart, 
  Zap, 
  Users, 
  TrendingUp, 
  Mail,
  Calendar,
  DollarSign,
  BarChart3
} from 'lucide-react';

export function UIShowcase() {
  const [showSuccess, setShowSuccess] = React.useState(false);
  const [showPWAPrompt, setShowPWAPrompt] = React.useState(false);
  const [isChecked, setIsChecked] = React.useState(false);
  const [phoneValue, setPhoneValue] = React.useState('');
  const [countryCode, setCountryCode] = React.useState('+234');
  const [currentDot, setCurrentDot] = React.useState(0);
  const [currentStep, setCurrentStep] = React.useState(1);
  const [rating, setRating] = React.useState(3);
  const [password, setPassword] = React.useState('Password123!');

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="relative bg-[#1A1A20] border-b-2 border-[#2A2A35] overflow-hidden">
        <SubtlePattern variant="dots" opacity={0.05} />
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
          <h1 className="text-4xl font-bold text-foreground mb-3">
            Enhanced UI Library
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Africa-First design components with modern animations and interactions. 
            Optimized for mobile, touch-friendly, and beautiful.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12 space-y-16">
        {/* Buttons Section */}
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-6">Animated Buttons</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">Primary</p>
              <AnimatedButton variant="primary">Click Me</AnimatedButton>
            </div>
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">Secondary</p>
              <AnimatedButton variant="secondary">Secondary</AnimatedButton>
            </div>
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">Outline</p>
              <AnimatedButton variant="outline">Outline</AnimatedButton>
            </div>
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">Ghost</p>
              <AnimatedButton variant="ghost">Ghost</AnimatedButton>
            </div>
          </div>
          <div className="mt-6 space-y-3">
            <p className="text-sm text-muted-foreground">Sizes & States</p>
            <div className="flex flex-wrap gap-4">
              <AnimatedButton size="sm">Small</AnimatedButton>
              <AnimatedButton size="md">Medium</AnimatedButton>
              <AnimatedButton size="lg">Large</AnimatedButton>
              <AnimatedButton loading>Loading...</AnimatedButton>
            </div>
          </div>
        </section>

        {/* Loading Indicators */}
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-6">Loading Indicators</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">Dots</p>
              <LoadingSpinner variant="dots" size="lg" />
            </div>
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">Spinner</p>
              <LoadingSpinner variant="spinner" size="lg" />
            </div>
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">Pulse</p>
              <LoadingSpinner variant="pulse" size="lg" />
            </div>
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">Bars</p>
              <LoadingSpinner variant="bars" size="lg" />
            </div>
          </div>
          <div className="mt-8 space-y-3">
            <p className="text-sm text-muted-foreground">Chat Typing</p>
            <ChatLoadingIndicator />
          </div>
        </section>

        {/* Form Elements */}
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-6">Form Elements</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
            <EnhancedInput 
              label="Email Address" 
              placeholder="pastor@churchafrica.org"
              icon={<Mail className="w-5 h-5" />}
              required
            />
            <PhoneInput
              label="Phone Number"
              value={phoneValue}
              onChange={setPhoneValue}
              countryCode={countryCode}
              onCountryCodeChange={setCountryCode}
              required
            />
            <div className="col-span-full space-y-4">
              <FormLabel variant="floating">Preferences</FormLabel>
              <div className="space-y-3">
                <AnimatedCheckbox
                  checked={isChecked}
                  onChange={setIsChecked}
                  label="Send me weekly reports"
                />
                <AnimatedCheckbox
                  checked={false}
                  onChange={() => {}}
                  label="Enable SMS notifications"
                />
                <AnimatedCheckbox
                  checked={true}
                  onChange={() => {}}
                  label="Share my profile with team members"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Success Messages */}
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-6">Notifications</h2>
          <div className="space-y-4 max-w-md">
            <AnimatedButton onClick={() => setShowSuccess(true)}>
              Show Success Message
            </AnimatedButton>
            {showSuccess && (
              <SuccessMessage
                message="Member Added Successfully!"
                description="John Doe has been added to your church directory."
                onClose={() => setShowSuccess(false)}
                variant="success"
              />
            )}
          </div>
        </section>

        {/* Social Icons */}
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-6">Social Icons</h2>
          <div className="space-y-6">
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">Default</p>
              <SocialIconGroup
                icons={[
                  { platform: 'facebook', url: '#' },
                  { platform: 'twitter', url: '#' },
                  { platform: 'instagram', url: '#' },
                  { platform: 'youtube', url: '#' },
                ]}
                variant="default"
              />
            </div>
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">Glow Effect</p>
              <SocialIconGroup
                icons={[
                  { platform: 'facebook', url: '#' },
                  { platform: 'twitter', url: '#' },
                  { platform: 'instagram', url: '#' },
                  { platform: 'linkedin', url: '#' },
                ]}
                variant="glow"
              />
            </div>
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">Outline</p>
              <SocialIconGroup
                icons={[
                  { platform: 'email', url: '#' },
                  { platform: 'phone', url: '#' },
                  { platform: 'facebook', url: '#' },
                  { platform: 'instagram', url: '#' },
                ]}
                variant="outline"
              />
            </div>
          </div>
        </section>

        {/* Tooltips & Status */}
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-6">Tooltips & Status</h2>
          <div className="flex flex-wrap gap-8">
            <EnhancedTooltip content="This is a helpful tooltip" position="top">
              <AnimatedButton variant="outline">Hover Me (Top)</AnimatedButton>
            </EnhancedTooltip>
            <EnhancedTooltip content="Bottom tooltip" position="bottom">
              <AnimatedButton variant="outline">Hover Me (Bottom)</AnimatedButton>
            </EnhancedTooltip>
            <div className="flex items-center gap-4">
              <OnlineStatusIndicator isOnline={true} size="md" showLabel />
              <OnlineStatusIndicator isOnline={false} size="md" showLabel />
            </div>
          </div>
        </section>

        {/* CTA Cards */}
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-6">CTA & Feature Cards</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CTACard
              title="Upgrade to Pro"
              description="Unlock advanced features including unlimited members, custom reports, and priority support."
              buttonText="Get Started"
              onClick={() => alert('Upgrade clicked!')}
              icon={<Zap className="w-6 h-6" />}
            />
            <CTACard
              title="Invite Your Team"
              description="Collaborate with your church leadership team. Share insights and manage together."
              buttonText="Invite Members"
              onClick={() => alert('Invite clicked!')}
              icon={<Users className="w-6 h-6" />}
              gradient={false}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <FeatureCard
              title="Total Members"
              description="Active members in your database"
              icon={<Users className="w-6 h-6" />}
              stats="1,245"
            />
            <FeatureCard
              title="Average Attendance"
              description="Last 4 weeks average"
              icon={<TrendingUp className="w-6 h-6" />}
              stats="892"
            />
            <FeatureCard
              title="Monthly Giving"
              description="Total contributions this month"
              icon={<DollarSign className="w-6 h-6" />}
              stats="₦2.4M"
            />
          </div>
        </section>

        {/* Price Display & Stats */}
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-6">Price & Stats</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <PriceDisplay
              label="Monthly Giving"
              amount={2450000}
              currency="₦"
              highlight={true}
            />
            <PriceDisplay
              label="Weekly Offering"
              amount={450000}
              currency="₦"
            />
            <PriceDisplay
              label="Building Fund"
              amount={12500000}
              currency="₦"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
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
              icon={<Heart className="w-5 h-5" />}
            />
            <StatCard
              label="Engagement"
              value="94%"
              subValue="active rate"
              trend="neutral"
              icon={<BarChart3 className="w-5 h-5" />}
            />
          </div>
        </section>

        {/* Background Patterns */}
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-6">Background Patterns</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {(['dots', 'grid', 'diagonal', 'waves', 'hexagon'] as const).map((pattern) => (
              <PatternContainer key={pattern} pattern={pattern} className="relative h-32 bg-[#1A1A20] rounded-xl border-2 border-[#2A2A35] overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm text-muted-foreground capitalize bg-[#0A0A0F]/80 px-3 py-1 rounded-lg">
                    {pattern}
                  </span>
                </div>
              </PatternContainer>
            ))}
          </div>
        </section>

        {/* PWA Install Prompt */}
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-6">PWA Install Prompt</h2>
          <AnimatedButton onClick={() => setShowPWAPrompt(true)}>
            Show Install Prompt
          </AnimatedButton>
          <PWAInstallPrompt
            isOpen={showPWAPrompt}
            onClose={() => setShowPWAPrompt(false)}
            onInstall={() => {
              alert('Installing app...');
              setShowPWAPrompt(false);
            }}
          />
        </section>

        {/* Square Dot Navigation */}
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-6">Square Dot Navigation</h2>
          <div className="space-y-8">
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">Pagination Dots - Primary</p>
              <SquareDotNav
                total={5}
                current={currentDot}
                onDotClick={setCurrentDot}
                size="md"
                variant="primary"
              />
            </div>
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">Large Dots - Secondary</p>
              <SquareDotNav
                total={7}
                current={2}
                size="lg"
                variant="secondary"
              />
            </div>
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">Small Dots - Muted</p>
              <SquareDotNav
                total={10}
                current={5}
                size="sm"
                variant="muted"
              />
            </div>
          </div>
        </section>

        {/* Square Dot Progress */}
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-6">Square Dot Progress Stepper</h2>
          <div className="space-y-8 max-w-2xl">
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">Onboarding Steps</p>
              <SquareDotProgress
                steps={['Account', 'Profile', 'Church', 'Members', 'Complete']}
                currentStep={currentStep}
                showLabels={true}
                variant="primary"
              />
              <div className="flex gap-2 mt-4">
                <AnimatedButton 
                  size="sm" 
                  onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                  disabled={currentStep === 0}
                >
                  Previous
                </AnimatedButton>
                <AnimatedButton 
                  size="sm" 
                  onClick={() => setCurrentStep(Math.min(4, currentStep + 1))}
                  disabled={currentStep === 4}
                >
                  Next
                </AnimatedButton>
              </div>
            </div>
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">Event Setup</p>
              <SquareDotProgress
                steps={['Details', 'Schedule', 'Registration', 'Publish']}
                currentStep={2}
                showLabels={false}
                variant="secondary"
              />
            </div>
          </div>
        </section>

        {/* Square Dot Rating */}
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-6">Square Dot Rating</h2>
          <div className="space-y-6">
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">Rate Your Experience</p>
              <SquareDotRating
                maxRating={5}
                rating={rating}
                onRatingChange={setRating}
                size="lg"
              />
              <p className="text-xs text-muted-foreground">Rating: {rating} / 5</p>
            </div>
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">Service Quality (Read Only)</p>
              <SquareDotRating
                maxRating={5}
                rating={4}
                size="md"
                readonly
              />
            </div>
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">Small Rating</p>
              <SquareDotRating
                maxRating={5}
                rating={3}
                onRatingChange={() => {}}
                size="sm"
              />
            </div>
          </div>
        </section>

        {/* Password Strength Meter */}
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-6">Password Strength Meter</h2>
          <div className="space-y-6 max-w-md">
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Try typing a password</label>
              <input
                type="text"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password..."
                className="w-full px-4 py-2 bg-[#0A0A0F] border border-[#2A2A30] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <PasswordStrengthMeter password={password} />
            <div className="pt-4 border-t border-[#2A2A30]">
              <p className="text-sm text-muted-foreground mb-2">Compact badge version:</p>
              <PasswordStrengthBadge password={password} />
            </div>
          </div>
        </section>

        {/* Footer */}
        <section className="pt-12 pb-6 text-center">
          <p className="text-muted-foreground">
            All components are touch-friendly, mobile-optimized, and follow Africa-First design principles.
          </p>
        </section>
      </div>
    </div>
  );
}