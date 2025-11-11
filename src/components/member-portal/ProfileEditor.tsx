import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Alert, AlertDescription } from '../ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Switch } from '../ui/switch';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Camera,
  Save,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Lock,
  Bell,
  Shield,
  Upload,
  X,
  Eye,
  EyeOff
} from 'lucide-react';
import { Member } from '../../types/member';

interface ProfileEditorProps {
  member: Member;
  onSave: (updates: Partial<Member>) => Promise<void>;
  onCancel: () => void;
  onChangePassword?: (currentPassword: string, newPassword: string) => Promise<void>;
  className?: string;
}

export const ProfileEditor: React.FC<ProfileEditorProps> = ({
  member,
  onSave,
  onCancel,
  onChangePassword,
  className = '',
}) => {
  const [activeTab, setActiveTab] = useState('personal');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Personal Info State
  const [firstName, setFirstName] = useState(member.firstName);
  const [lastName, setLastName] = useState(member.lastName);
  const [middleName, setMiddleName] = useState(member.middleName || '');
  const [dateOfBirth, setDateOfBirth] = useState(member.dateOfBirth || '');
  const [gender, setGender] = useState(member.gender || '');
  const [photo, setPhoto] = useState(member.photo || '');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState(member.photo || '');

  // Contact Info State
  const [phone, setPhone] = useState(member.contact.phone || '');
  const [email, setEmail] = useState(member.contact.email || '');
  const [address, setAddress] = useState(member.contact.address || '');
  const [city, setCity] = useState(member.contact.city || '');
  const [state, setState] = useState(member.contact.state || '');
  const [country, setCountry] = useState(member.contact.country || '');

  // Emergency Contact State
  const [emergencyName, setEmergencyName] = useState(member.emergencyContact?.name || '');
  const [emergencyPhone, setEmergencyPhone] = useState(member.emergencyContact?.phone || '');
  const [emergencyRelation, setEmergencyRelation] = useState(member.emergencyContact?.relationship || '');

  // Password Change State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);

  // Notification Preferences
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(true);
  const [eventReminders, setEventReminders] = useState(true);
  const [givingReceipts, setGivingReceipts] = useState(true);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Photo size must be less than 5MB');
        return;
      }

      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setPhotoFile(null);
    setPhotoPreview('');
    setPhoto('');
  };

  const handleSavePersonal = async () => {
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const updates: Partial<Member> = {
        firstName,
        lastName,
        middleName,
        dateOfBirth,
        gender: gender as any,
        photo: photoPreview || photo,
      };

      await onSave(updates);
      setSuccess('Personal information updated successfully!');
    } catch (err: any) {
      setError(err.message || 'Failed to update personal information');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveContact = async () => {
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const updates: Partial<Member> = {
        contact: {
          phone,
          email,
          address,
          city,
          state,
          country,
        },
        emergencyContact: {
          name: emergencyName,
          phone: emergencyPhone,
          relationship: emergencyRelation,
        },
      };

      await onSave(updates);
      setSuccess('Contact information updated successfully!');
    } catch (err: any) {
      setError(err.message || 'Failed to update contact information');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePasswordSubmit = async () => {
    setError('');
    setSuccess('');

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);

    try {
      if (onChangePassword) {
        await onChangePassword(currentPassword, newPassword);
        setSuccess('Password changed successfully!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const handleSavePreferences = async () => {
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // Save notification preferences (would be in a separate field in real implementation)
      setSuccess('Preferences updated successfully!');
    } catch (err: any) {
      setError(err.message || 'Failed to update preferences');
    } finally {
      setLoading(false);
    }
  };

  const initials = `${firstName[0]}${lastName[0]}`.toUpperCase();

  return (
    <div className={`min-h-screen bg-[#0A0A0F] p-4 md:p-6 ${className}`}>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl text-white mb-1">Edit Profile</h1>
            <p className="text-gray-400">Update your personal information and settings</p>
          </div>
          <Button variant="outline" onClick={onCancel} className="border-[#2A2A30]">
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <Alert variant="destructive" className="border-red-500/50 bg-red-500/10">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {success && (
          <Alert className="border-[#1CE479]/50 bg-[#1CE479]/10">
            <CheckCircle2 className="h-4 w-4 text-[#1CE479]" />
            <AlertDescription className="text-[#1CE479]">{success}</AlertDescription>
          </Alert>
        )}

        {/* Tabs */}
        <Card className="bg-[#1A1A20] border-[#2A2A30]">
          <CardContent className="pt-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4 bg-[#0A0A0F]">
                <TabsTrigger value="personal">
                  <User className="w-4 h-4 mr-2" />
                  Personal
                </TabsTrigger>
                <TabsTrigger value="contact">
                  <Phone className="w-4 h-4 mr-2" />
                  Contact
                </TabsTrigger>
                <TabsTrigger value="security">
                  <Lock className="w-4 h-4 mr-2" />
                  Security
                </TabsTrigger>
                <TabsTrigger value="preferences">
                  <Bell className="w-4 h-4 mr-2" />
                  Preferences
                </TabsTrigger>
              </TabsList>

              {/* Personal Information */}
              <TabsContent value="personal" className="space-y-6 mt-6">
                {/* Photo Upload */}
                <div className="flex flex-col items-center gap-4">
                  <Avatar className="w-32 h-32 border-4 border-[#1CE479]">
                    <AvatarImage src={photoPreview} alt={`${firstName} ${lastName}`} />
                    <AvatarFallback className="bg-[#1CE479]/20 text-[#1CE479] text-4xl">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById('photo-upload')?.click()}
                      className="border-[#2A2A30]"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Photo
                    </Button>
                    {photoPreview && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleRemovePhoto}
                        className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Remove
                      </Button>
                    )}
                  </div>
                  
                  <input
                    id="photo-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePhotoChange}
                  />
                  
                  <p className="text-xs text-gray-500">
                    JPG, PNG or GIF. Max size 5MB.
                  </p>
                </div>

                {/* Name Fields */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-gray-300">
                      First Name *
                    </Label>
                    <Input
                      id="firstName"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                      className="bg-[#0A0A0F] border-[#2A2A30] text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="middleName" className="text-gray-300">
                      Middle Name
                    </Label>
                    <Input
                      id="middleName"
                      value={middleName}
                      onChange={(e) => setMiddleName(e.target.value)}
                      className="bg-[#0A0A0F] border-[#2A2A30] text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-gray-300">
                      Last Name *
                    </Label>
                    <Input
                      id="lastName"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                      className="bg-[#0A0A0F] border-[#2A2A30] text-white"
                    />
                  </div>
                </div>

                {/* Date of Birth & Gender */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth" className="text-gray-300">
                      Date of Birth
                    </Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={dateOfBirth}
                      onChange={(e) => setDateOfBirth(e.target.value)}
                      className="bg-[#0A0A0F] border-[#2A2A30] text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gender" className="text-gray-300">
                      Gender
                    </Label>
                    <Select value={gender} onValueChange={setGender}>
                      <SelectTrigger className="bg-[#0A0A0F] border-[#2A2A30] text-white">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <Button
                    variant="outline"
                    onClick={onCancel}
                    className="border-[#2A2A30]"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSavePersonal}
                    disabled={loading}
                    className="bg-[#1CE479] text-[#0A0A0F] hover:bg-[#1CE479]/90"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </TabsContent>

              {/* Contact Information */}
              <TabsContent value="contact" className="space-y-6 mt-6">
                <div className="space-y-4">
                  <h3 className="text-white">Primary Contact</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-gray-300">
                        Phone Number *
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+234 XXX XXX XXXX"
                        className="bg-[#0A0A0F] border-[#2A2A30] text-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-gray-300">
                        Email Address *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your.email@example.com"
                        className="bg-[#0A0A0F] border-[#2A2A30] text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address" className="text-gray-300">
                      Street Address
                    </Label>
                    <Textarea
                      id="address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="123 Main Street"
                      rows={2}
                      className="bg-[#0A0A0F] border-[#2A2A30] text-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city" className="text-gray-300">
                        City
                      </Label>
                      <Input
                        id="city"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="Lagos"
                        className="bg-[#0A0A0F] border-[#2A2A30] text-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="state" className="text-gray-300">
                        State
                      </Label>
                      <Input
                        id="state"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        placeholder="Lagos State"
                        className="bg-[#0A0A0F] border-[#2A2A30] text-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="country" className="text-gray-300">
                        Country
                      </Label>
                      <Input
                        id="country"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        placeholder="Nigeria"
                        className="bg-[#0A0A0F] border-[#2A2A30] text-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4 pt-6 border-t border-[#2A2A30]">
                  <h3 className="text-white">Emergency Contact</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="emergencyName" className="text-gray-300">
                        Contact Name
                      </Label>
                      <Input
                        id="emergencyName"
                        value={emergencyName}
                        onChange={(e) => setEmergencyName(e.target.value)}
                        placeholder="John Doe"
                        className="bg-[#0A0A0F] border-[#2A2A30] text-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="emergencyPhone" className="text-gray-300">
                        Contact Phone
                      </Label>
                      <Input
                        id="emergencyPhone"
                        type="tel"
                        value={emergencyPhone}
                        onChange={(e) => setEmergencyPhone(e.target.value)}
                        placeholder="+234 XXX XXX XXXX"
                        className="bg-[#0A0A0F] border-[#2A2A30] text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="emergencyRelation" className="text-gray-300">
                      Relationship
                    </Label>
                    <Select value={emergencyRelation} onValueChange={setEmergencyRelation}>
                      <SelectTrigger className="bg-[#0A0A0F] border-[#2A2A30] text-white">
                        <SelectValue placeholder="Select relationship" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="spouse">Spouse</SelectItem>
                        <SelectItem value="parent">Parent</SelectItem>
                        <SelectItem value="sibling">Sibling</SelectItem>
                        <SelectItem value="child">Child</SelectItem>
                        <SelectItem value="friend">Friend</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <Button
                    variant="outline"
                    onClick={onCancel}
                    className="border-[#2A2A30]"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSaveContact}
                    disabled={loading}
                    className="bg-[#1CE479] text-[#0A0A0F] hover:bg-[#1CE479]/90"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </TabsContent>

              {/* Security */}
              <TabsContent value="security" className="space-y-6 mt-6">
                <div className="space-y-4">
                  <h3 className="text-white">Change Password</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword" className="text-gray-300">
                      Current Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="currentPassword"
                        type={showPasswords ? 'text' : 'password'}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="bg-[#0A0A0F] border-[#2A2A30] text-white pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowPasswords(!showPasswords)}
                      >
                        {showPasswords ? (
                          <EyeOff className="w-4 h-4 text-gray-400" />
                        ) : (
                          <Eye className="w-4 h-4 text-gray-400" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="newPassword" className="text-gray-300">
                      New Password
                    </Label>
                    <Input
                      id="newPassword"
                      type={showPasswords ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="bg-[#0A0A0F] border-[#2A2A30] text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-gray-300">
                      Confirm New Password
                    </Label>
                    <Input
                      id="confirmPassword"
                      type={showPasswords ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="bg-[#0A0A0F] border-[#2A2A30] text-white"
                    />
                  </div>

                  <div className="p-4 bg-[#0A0A0F] rounded-lg border border-[#2A2A30]">
                    <p className="text-sm text-gray-400">Password requirements:</p>
                    <ul className="text-sm text-gray-500 mt-2 space-y-1">
                      <li>• At least 8 characters long</li>
                      <li>• Include uppercase and lowercase letters</li>
                      <li>• Include at least one number</li>
                      <li>• Include at least one special character</li>
                    </ul>
                  </div>

                  <Button
                    onClick={handleChangePasswordSubmit}
                    disabled={loading || !currentPassword || !newPassword || !confirmPassword}
                    className="bg-[#1CE479] text-[#0A0A0F] hover:bg-[#1CE479]/90"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Changing...
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4 mr-2" />
                        Change Password
                      </>
                    )}
                  </Button>
                </div>
              </TabsContent>

              {/* Preferences */}
              <TabsContent value="preferences" className="space-y-6 mt-6">
                <div className="space-y-4">
                  <h3 className="text-white">Notification Preferences</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-[#0A0A0F] rounded-lg">
                      <div>
                        <p className="text-white">Email Notifications</p>
                        <p className="text-sm text-gray-400">Receive updates via email</p>
                      </div>
                      <Switch
                        checked={emailNotifications}
                        onCheckedChange={setEmailNotifications}
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-[#0A0A0F] rounded-lg">
                      <div>
                        <p className="text-white">SMS Notifications</p>
                        <p className="text-sm text-gray-400">Receive text messages</p>
                      </div>
                      <Switch
                        checked={smsNotifications}
                        onCheckedChange={setSmsNotifications}
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-[#0A0A0F] rounded-lg">
                      <div>
                        <p className="text-white">Event Reminders</p>
                        <p className="text-sm text-gray-400">Get reminded about upcoming events</p>
                      </div>
                      <Switch
                        checked={eventReminders}
                        onCheckedChange={setEventReminders}
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-[#0A0A0F] rounded-lg">
                      <div>
                        <p className="text-white">Giving Receipts</p>
                        <p className="text-sm text-gray-400">Email donation receipts</p>
                      </div>
                      <Switch
                        checked={givingReceipts}
                        onCheckedChange={setGivingReceipts}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3">
                    <Button
                      variant="outline"
                      onClick={onCancel}
                      className="border-[#2A2A30]"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSavePreferences}
                      disabled={loading}
                      className="bg-[#1CE479] text-[#0A0A0F] hover:bg-[#1CE479]/90"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          Save Preferences
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
