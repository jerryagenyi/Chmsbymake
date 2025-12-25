import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { CheckCircle2, ArrowRight, ArrowLeft, Building2, MapPin, Users, Settings } from 'lucide-react';

interface SetupStep {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const steps: SetupStep[] = [
  {
    id: 1,
    title: 'Organization Details',
    description: 'Basic information about your church',
    icon: <Building2 className="h-5 w-5" />,
  },
  {
    id: 2,
    title: 'Location & Contact',
    description: 'Where is your church located',
    icon: <MapPin className="h-5 w-5" />,
  },
  {
    id: 3,
    title: 'Admin Account',
    description: 'Setup your administrator account',
    icon: <Users className="h-5 w-5" />,
  },
  {
    id: 4,
    title: 'Preferences',
    description: 'Configure your settings',
    icon: <Settings className="h-5 w-5" />,
  },
];

export function OrganizationSetup() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1
    orgName: '',
    orgType: '',
    denomination: '',
    
    // Step 2
    country: '',
    city: '',
    address: '',
    phone: '',
    email: '',
    
    // Step 3
    adminName: '',
    adminEmail: '',
    adminPhone: '',
    
    // Step 4
    timezone: '',
    currency: '',
    language: '',
  });

  const progress = (currentStep / steps.length) * 100;

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    console.log('Setup complete:', formData);
    alert('Organization setup complete! This would create the organization in the backend.');
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="orgName">Church Name *</Label>
              <Input
                id="orgName"
                placeholder="e.g., Victory Chapel Ministry"
                value={formData.orgName}
                onChange={(e) => setFormData({ ...formData, orgName: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="orgType">Organization Type *</Label>
              <Select
                value={formData.orgType}
                onValueChange={(value) => setFormData({ ...formData, orgType: value })}
              >
                <SelectTrigger id="orgType">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="independent">Independent Church</SelectItem>
                  <SelectItem value="denomination">Denomination</SelectItem>
                  <SelectItem value="network">Church Network</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="denomination">Denomination (Optional)</Label>
              <Input
                id="denomination"
                placeholder="e.g., Pentecostal, Baptist, etc."
                value={formData.denomination}
                onChange={(e) => setFormData({ ...formData, denomination: e.target.value })}
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="country">Country *</Label>
              <Select
                value={formData.country}
                onValueChange={(value) => setFormData({ ...formData, country: value })}
              >
                <SelectTrigger id="country">
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Nigeria">🇳🇬 Nigeria</SelectItem>
                  <SelectItem value="Kenya">🇰🇪 Kenya</SelectItem>
                  <SelectItem value="Ghana">🇬🇭 Ghana</SelectItem>
                  <SelectItem value="South Africa">🇿🇦 South Africa</SelectItem>
                  <SelectItem value="Tanzania">🇹🇿 Tanzania</SelectItem>
                  <SelectItem value="Uganda">🇺🇬 Uganda</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">City *</Label>
              <Input
                id="city"
                placeholder="e.g., Lagos, Nairobi, Accra"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Physical Address *</Label>
              <Input
                id="address"
                placeholder="Street address of main branch"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+234 800 000 0000"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="contact@church.org"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="adminName">Full Name *</Label>
              <Input
                id="adminName"
                placeholder="Pastor John Doe"
                value={formData.adminName}
                onChange={(e) => setFormData({ ...formData, adminName: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="adminEmail">Email Address *</Label>
              <Input
                id="adminEmail"
                type="email"
                placeholder="admin@church.org"
                value={formData.adminEmail}
                onChange={(e) => setFormData({ ...formData, adminEmail: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">
                This will be your login email
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="adminPhone">Phone Number *</Label>
              <Input
                id="adminPhone"
                type="tel"
                placeholder="+234 800 000 0000"
                value={formData.adminPhone}
                onChange={(e) => setFormData({ ...formData, adminPhone: e.target.value })}
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone *</Label>
              <Select
                value={formData.timezone}
                onValueChange={(value) => setFormData({ ...formData, timezone: value })}
              >
                <SelectTrigger id="timezone">
                  <SelectValue placeholder="Select timezone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Africa/Lagos">West Africa Time (WAT)</SelectItem>
                  <SelectItem value="Africa/Nairobi">East Africa Time (EAT)</SelectItem>
                  <SelectItem value="Africa/Johannesburg">South Africa Time (SAST)</SelectItem>
                  <SelectItem value="Africa/Accra">Greenwich Mean Time (GMT)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="currency">Default Currency *</Label>
              <Select
                value={formData.currency}
                onValueChange={(value) => setFormData({ ...formData, currency: value })}
              >
                <SelectTrigger id="currency">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NGN">🇳🇬 Nigerian Naira (NGN)</SelectItem>
                  <SelectItem value="KES">🇰🇪 Kenyan Shilling (KES)</SelectItem>
                  <SelectItem value="GHS">🇬🇭 Ghanaian Cedi (GHS)</SelectItem>
                  <SelectItem value="ZAR">🇿🇦 South African Rand (ZAR)</SelectItem>
                  <SelectItem value="TZS">🇹🇿 Tanzanian Shilling (TZS)</SelectItem>
                  <SelectItem value="UGX">🇺🇬 Ugandan Shilling (UGX)</SelectItem>
                  <SelectItem value="USD">💵 US Dollar (USD)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="language">Primary Language *</Label>
              <Select
                value={formData.language}
                onValueChange={(value) => setFormData({ ...formData, language: value })}
              >
                <SelectTrigger id="language">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                  <SelectItem value="pt">Portuguese</SelectItem>
                  <SelectItem value="sw">Swahili</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h2 className="flex items-center gap-2">
          <Building2 className="h-6 w-6" />
          Organization Setup
        </h2>
        <p className="text-muted-foreground">
          Set up your church organization in a few simple steps
        </p>
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">
            Step {currentStep} of {steps.length}
          </span>
          <span className="font-medium">{Math.round(progress)}% Complete</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Step Indicators */}
      <div className="flex justify-between">
        {steps.map((step) => (
          <div
            key={step.id}
            className={`flex flex-col items-center gap-2 flex-1 ${
              step.id !== steps.length ? 'relative' : ''
            }`}
          >
            <div
              className={`
                w-10 h-10 rounded-full flex items-center justify-center transition-all
                ${step.id < currentStep ? 'bg-primary text-primary-foreground' : ''}
                ${step.id === currentStep ? 'bg-primary/20 text-primary border-2 border-primary' : ''}
                ${step.id > currentStep ? 'bg-accent text-muted-foreground' : ''}
              `}
            >
              {step.id < currentStep ? (
                <CheckCircle2 className="h-5 w-5" />
              ) : (
                step.icon
              )}
            </div>
            <span
              className={`text-xs text-center ${
                step.id === currentStep ? 'font-medium' : 'text-muted-foreground'
              }`}
            >
              {step.title}
            </span>
            
            {step.id !== steps.length && (
              <div
                className={`absolute top-5 left-1/2 w-full h-0.5 -z-10 ${
                  step.id < currentStep ? 'bg-primary' : 'bg-accent'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Form Card */}
      <Card>
        <CardHeader>
          <CardTitle>{steps[currentStep - 1].title}</CardTitle>
          <CardDescription>{steps[currentStep - 1].description}</CardDescription>
        </CardHeader>
        <CardContent>{renderStepContent()}</CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>

          {currentStep < steps.length ? (
            <Button onClick={handleNext}>
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={handleSubmit}>
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Complete Setup
            </Button>
          )}
        </CardFooter>
      </Card>

      {/* Help Text */}
      <Card className="bg-accent/50">
        <CardContent className="pt-6">
          <h4 className="font-semibold mb-2">💡 What happens next?</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>✓ Your organization will be created</li>
            <li>✓ A headquarters branch will be set up automatically</li>
            <li>✓ Default services (Sunday, Midweek) will be created</li>
            <li>✓ You'll receive admin access to manage everything</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}