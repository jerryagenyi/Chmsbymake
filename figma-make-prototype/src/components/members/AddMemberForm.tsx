/**
 * ChurchAfrica ChMS - Add Member Form
 * Comprehensive multi-step form for adding new members with bulk import option
 */

import React, { useState } from 'react';
import { Member } from '../../types/member';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { User, Mail, Phone, MapPin, Calendar, Users, ChevronLeft, ChevronRight, Upload, Download, FileDown } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { Alert, AlertDescription } from '../ui/alert';
import { Separator } from '../ui/separator';

interface AddMemberFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (member: Partial<Member>) => void;
}

export function AddMemberForm({ open, onClose, onSubmit }: AddMemberFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [showBulkImport, setShowBulkImport] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<Partial<Member>>({
    firstName: '',
    lastName: '',
    gender: 'male',
    dateOfBirth: '',
    maritalStatus: 'single',
    contact: {
      email: '',
      phone: '',
      address: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'Nigeria',
      },
    },
    status: 'active',
    ministries: [],
    notes: '',
  });

  const steps = [
    { id: 0, label: 'Personal Info', icon: User },
    { id: 1, label: 'Contact', icon: Mail },
    { id: 2, label: 'Membership', icon: Users },
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleContactChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      contact: {
        ...prev.contact!,
        [field]: value,
      },
    }));
  };

  const handleAddressChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      contact: {
        ...prev.contact!,
        address: {
          ...prev.contact!.address!,
          [field]: value,
        },
      },
    }));
  };

  const handleNext = () => {
    // Validate current step
    if (currentStep === 0) {
      if (!formData.firstName || !formData.lastName) {
        toast.error('Please enter first and last name');
        return;
      }
    }

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!formData.firstName || !formData.lastName) {
      toast.error('Please enter first and last name');
      return;
    }

    if (!formData.contact?.email && !formData.contact?.phone) {
      toast.error('Please enter at least an email or phone number');
      return;
    }

    // Generate membership number
    const membershipNumber = `MEM-${Date.now().toString().slice(-6)}`;

    const newMember: Partial<Member> = {
      ...formData,
      id: `m${Date.now()}`,
      membershipNumber,
      joinDate: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSubmit(newMember);
    
    // Simulate sending email notification
    console.log('📧 Email sent to:', formData.contact?.email);
    console.log('Email content: Welcome! You have been added to ChurchAfrica. If you did not approve this, please click the button below to request removal from the admin.');
    
    toast.success(
      <div className="space-y-1">
        <p className="font-medium">{formData.firstName} {formData.lastName} added successfully!</p>
        <p className="text-xs text-muted-foreground">📧 Notification email sent with removal option</p>
      </div>
    );
    handleClose();
  };

  const handleDownloadTemplate = () => {
    const headers = [
      'First Name',
      'Last Name',
      'Email',
      'Phone',
      'Gender',
      'Date of Birth',
      'Marital Status',
      'Status',
      'Membership Number',
      'Join Date',
      'Street',
      'City',
      'State',
      'Zip Code',
      'Country',
      'Notes',
    ];

    const sampleRow = [
      'John',
      'Doe',
      'john.doe@email.com',
      '+234 800 000 0000',
      'male',
      '1990-01-15',
      'married',
      'active',
      'MEM-001234',
      '2024-01-01',
      '123 Main Street',
      'Lagos',
      'Lagos State',
      '100001',
      'Nigeria',
      'Sample member notes',
    ];

    const csvContent = [
      headers.join(','),
      sampleRow.map((cell) => `"${cell}"`).join(','),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'members_import_template.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success('Template downloaded successfully!');
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv') && !file.name.endsWith('.xlsx')) {
      toast.error('Please select a CSV or Excel file');
      return;
    }

    setImportFile(file);
    toast.success(`Selected: ${file.name}`);
  };

  const handleBulkImport = () => {
    if (!importFile) {
      toast.error('Please select a file to import');
      return;
    }

    // Simulate import
    toast.success(
      <div className="space-y-1">
        <p className="font-medium">Bulk import initiated!</p>
        <p className="text-xs text-muted-foreground">📧 Notification emails sent to all members with removal option</p>
      </div>
    );
    console.log('📧 Bulk notification emails sent with removal request option');
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      firstName: '',
      lastName: '',
      gender: 'male',
      dateOfBirth: '',
      maritalStatus: 'single',
      contact: {
        email: '',
        phone: '',
        address: {
          street: '',
          city: '',
          state: '',
          zipCode: '',
          country: 'Nigeria',
        },
      },
      status: 'active',
      ministries: [],
      notes: '',
    });
    setCurrentStep(0);
    setShowBulkImport(false);
    setImportFile(null);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-5 w-5 text-primary" />
            </div>
            Add New Member
          </DialogTitle>
          <DialogDescription>
            Fill in the member's information or bulk import from CSV/Excel. All new members receive email notifications with an option to request removal.
          </DialogDescription>
        </DialogHeader>

        {/* Step Indicators - Square Style */}
        <div className="flex items-center justify-center gap-2 py-4">
          {steps.map((step, index) => {
            const StepIcon = step.icon;
            const isActive = index === currentStep;
            const isCompleted = index < currentStep;

            return (
              <React.Fragment key={step.id}>
                <div className="flex flex-col items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(index)}
                    className={`
                      w-10 h-10 rounded-md flex items-center justify-center transition-all
                      ${isActive ? 'bg-primary text-primary-foreground shadow-lg scale-110' : ''}
                      ${isCompleted ? 'bg-success text-success-foreground' : ''}
                      ${!isActive && !isCompleted ? 'bg-muted text-muted-foreground' : ''}
                      hover:scale-105 cursor-pointer
                    `}
                  >
                    <StepIcon className="h-5 w-5" />
                  </button>
                  <span className={`text-xs ${isActive ? 'font-medium' : 'text-muted-foreground'}`}>
                    {step.label}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`h-0.5 w-12 ${index < currentStep ? 'bg-success' : 'bg-muted'}`} />
                )}
              </React.Fragment>
            );
          })}
        </div>

        <Separator />

        {/* Bulk Import Toggle */}
        {currentStep === 0 && (
          <div className="flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowBulkImport(!showBulkImport)}
              className="gap-2"
            >
              <Upload className="h-4 w-4" />
              {showBulkImport ? 'Single Member' : 'Bulk Import'}
            </Button>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {showBulkImport && currentStep === 0 ? (
            /* Bulk Import Mode */
            <div className="space-y-6 py-4">
              <Alert>
                <Upload className="h-4 w-4" />
                <AlertDescription>
                  Import multiple members at once from a CSV or Excel file. All members will receive email notifications with an option to request removal.
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="bulk-import-file">Select File</Label>
                  <div className="mt-2">
                    <input
                      ref={fileInputRef}
                      id="bulk-import-file"
                      type="file"
                      accept=".csv,.xlsx"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      {importFile ? importFile.name : 'Choose CSV or Excel file'}
                    </Button>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleDownloadTemplate}
                  className="w-full"
                >
                  <FileDown className="h-4 w-4 mr-2" />
                  Download Import Template
                </Button>
              </div>

              <div className="p-4 bg-muted rounded-lg space-y-2">
                <h4 className="text-sm font-medium">Template includes:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>✓ Personal information (name, gender, DOB, marital status)</li>
                  <li>✓ Contact details (email, phone, address)</li>
                  <li>✓ Membership information (number, status, join date)</li>
                  <li>✓ Additional notes</li>
                </ul>
              </div>
            </div>
          ) : (
            /* Single Member Mode */
            <div className="py-4">
              {/* Step 0: Personal Information */}
              {currentStep === 0 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">
                        First Name <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        placeholder="John"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lastName">
                        Last Name <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        placeholder="Doe"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="gender">Gender</Label>
                      <Select
                        value={formData.gender}
                        onValueChange={(value) => handleInputChange('gender', value)}
                      >
                        <SelectTrigger id="gender">
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="dateOfBirth">Date of Birth</Label>
                      <Input
                        id="dateOfBirth"
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="maritalStatus">Marital Status</Label>
                    <Select
                      value={formData.maritalStatus}
                      onValueChange={(value) => handleInputChange('maritalStatus', value)}
                    >
                      <SelectTrigger id="maritalStatus">
                        <SelectValue placeholder="Select marital status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="single">Single</SelectItem>
                        <SelectItem value="married">Married</SelectItem>
                        <SelectItem value="divorced">Divorced</SelectItem>
                        <SelectItem value="widowed">Widowed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {/* Step 1: Contact Information */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.contact?.email}
                      onChange={(e) => handleContactChange('email', e.target.value)}
                      placeholder="john.doe@email.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.contact?.phone}
                      onChange={(e) => handleContactChange('phone', e.target.value)}
                      placeholder="+234 800 000 0000"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="street" className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Street Address
                    </Label>
                    <Input
                      id="street"
                      value={formData.contact?.address?.street}
                      onChange={(e) => handleAddressChange('street', e.target.value)}
                      placeholder="123 Main Street"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={formData.contact?.address?.city}
                        onChange={(e) => handleAddressChange('city', e.target.value)}
                        placeholder="Lagos"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="state">State/Province</Label>
                      <Input
                        id="state"
                        value={formData.contact?.address?.state}
                        onChange={(e) => handleAddressChange('state', e.target.value)}
                        placeholder="Lagos State"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="zipCode">Zip/Postal Code</Label>
                      <Input
                        id="zipCode"
                        value={formData.contact?.address?.zipCode}
                        onChange={(e) => handleAddressChange('zipCode', e.target.value)}
                        placeholder="100001"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="country">Country</Label>
                      <Input
                        id="country"
                        value={formData.contact?.address?.country}
                        onChange={(e) => handleAddressChange('country', e.target.value)}
                        placeholder="Nigeria"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Membership Information */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="status">Member Status</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) => handleInputChange('status', value as Member['status'])}
                    >
                      <SelectTrigger id="status">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active Member</SelectItem>
                        <SelectItem value="inactive">Inactive Member</SelectItem>
                        <SelectItem value="visitor">Visitor/Guest</SelectItem>
                        <SelectItem value="alumni">Alumni</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      {formData.status === 'visitor' && 'Visitors are tracked separately until they become members'}
                      {formData.status === 'active' && 'Active members participate in church activities'}
                      {formData.status === 'inactive' && 'Members who are temporarily not attending'}
                      {formData.status === 'alumni' && 'Former members who have moved on'}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => handleInputChange('notes', e.target.value)}
                      placeholder="Any additional notes about this member..."
                      rows={4}
                    />
                  </div>

                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      <strong>Join Date:</strong> {new Date().toLocaleDateString()}<br />
                      <strong>Membership Number:</strong> Will be auto-generated<br />
                      <strong>Email Notification:</strong> Member will receive welcome email with removal option
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          <DialogFooter className="mt-6 gap-2">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>

            {showBulkImport && currentStep === 0 ? (
              <Button type="button" onClick={handleBulkImport} disabled={!importFile} className="gap-2">
                <Upload className="h-4 w-4" />
                Import Members
              </Button>
            ) : (
              <>
                {currentStep > 0 && (
                  <Button type="button" variant="outline" onClick={handleBack} className="gap-2">
                    <ChevronLeft className="h-4 w-4" />
                    Back
                  </Button>
                )}

                {currentStep < steps.length - 1 ? (
                  <Button type="button" onClick={handleNext} className="gap-2">
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button type="submit" className="gap-2">
                    <User className="h-4 w-4" />
                    Add Member
                  </Button>
                )}
              </>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
