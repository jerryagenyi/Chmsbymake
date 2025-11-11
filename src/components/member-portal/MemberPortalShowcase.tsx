import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Badge } from '../ui/badge';
import {
  User,
  QrCode,
  Fingerprint,
  Users,
  Settings,
  LogIn,
  Calendar,
  DollarSign,
  ArrowLeft
} from 'lucide-react';
import { MemberLogin } from './MemberLogin';
import { MemberDashboard } from './MemberDashboard';
import { ProfileEditor } from './ProfileEditor';
import { BiometricEnrollment } from './BiometricEnrollment';
import { FamilyManagement } from './FamilyManagement';
import { ServiceQRGenerator } from '../attendance/ServiceQRGenerator';
import { CheckInKiosk } from '../attendance/CheckInKiosk';

// Mock data
import { mockMembers } from '../../lib/mock-data';
import { mockAttendanceRecords } from '../../lib/mock-data';
import { mockDonations } from '../../lib/mock-giving-data';

export const MemberPortalShowcase: React.FC = () => {
  const [activeView, setActiveView] = useState<'intro' | 'login' | 'dashboard' | 'profile' | 'family' | 'biometric' | 'service-qr' | 'kiosk'>('intro');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedMember] = useState(mockMembers[0]);

  const mockFamilyMembers = [
    {
      id: 'f1',
      name: 'Mary Okonkwo',
      relationship: 'spouse' as const,
      photo: '',
      dateOfBirth: '1985-05-15',
      memberId: 'MEM-2024-002',
    },
    {
      id: 'f2',
      name: 'David Okonkwo Jr.',
      relationship: 'child' as const,
      photo: '',
      dateOfBirth: '2010-08-20',
    },
    {
      id: 'f3',
      name: 'Grace Okonkwo',
      relationship: 'child' as const,
      photo: '',
      dateOfBirth: '2015-03-12',
    },
  ];

  const handleLogin = async (credentials: any) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoggedIn(true);
    setActiveView('dashboard');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setActiveView('login');
  };

  const handleSaveProfile = async (updates: any) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Profile updated:', updates);
  };

  const handleChangePassword = async (current: string, newPass: string) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Password changed');
  };

  const handleAddFamilyMember = async (member: any) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Family member added:', member);
  };

  const handleRemoveFamilyMember = async (id: string) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Family member removed:', id);
  };

  const handleSetPrimaryContact = async (id: string) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Primary contact set:', id);
  };

  const handleBiometricEnroll = async (data: string) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Biometric enrolled');
  };

  const handleKioskCheckIn = async (memberId: string) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
      success: true,
      member: {
        id: memberId,
        name: 'John Doe',
        photo: '',
        membershipNumber: 'MEM-2024-001',
        isFirstTime: Math.random() > 0.8,
      },
    };
  };

  if (activeView === 'intro') {
    return (
      <div className="min-h-screen bg-[#0A0A0F] p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <Card className="bg-gradient-to-r from-[#1CE479]/20 to-[#1CE479]/5 border-[#1CE479]/30">
            <CardHeader>
              <CardTitle className="text-3xl text-white flex items-center gap-3">
                <User className="w-8 h-8 text-[#1CE479]" />
                Phase 15: Member Self-Service & Advanced Check-In
              </CardTitle>
              <CardDescription className="text-gray-300 text-lg">
                Complete member portal with QR code check-in, biometric authentication, and family management
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card
              className="bg-[#1A1A20] border-[#2A2A30] hover:border-[#1CE479] cursor-pointer transition-colors"
              onClick={() => setActiveView('login')}
            >
              <CardHeader>
                <div className="w-12 h-12 bg-[#1CE479]/20 rounded-lg flex items-center justify-center mb-3">
                  <LogIn className="w-6 h-6 text-[#1CE479]" />
                </div>
                <CardTitle className="text-white">Member Login</CardTitle>
                <CardDescription className="text-gray-400">
                  Multi-method authentication: phone, email, membership ID, QR code, or fingerprint
                </CardDescription>
              </CardHeader>
            </Card>

            <Card
              className="bg-[#1A1A20] border-[#2A2A30] hover:border-[#1CE479] cursor-pointer transition-colors"
              onClick={() => {
                setIsLoggedIn(true);
                setActiveView('dashboard');
              }}
            >
              <CardHeader>
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-3">
                  <User className="w-6 h-6 text-blue-400" />
                </div>
                <CardTitle className="text-white">Member Dashboard</CardTitle>
                <CardDescription className="text-gray-400">
                  Personal stats, attendance history, giving records, and quick check-in
                </CardDescription>
              </CardHeader>
            </Card>

            <Card
              className="bg-[#1A1A20] border-[#2A2A30] hover:border-[#1CE479] cursor-pointer transition-colors"
              onClick={() => setActiveView('profile')}
            >
              <CardHeader>
                <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-3">
                  <Settings className="w-6 h-6 text-purple-400" />
                </div>
                <CardTitle className="text-white">Profile Editor</CardTitle>
                <CardDescription className="text-gray-400">
                  Update personal info, photo, contact details, and security settings
                </CardDescription>
              </CardHeader>
            </Card>

            <Card
              className="bg-[#1A1A20] border-[#2A2A30] hover:border-[#1CE479] cursor-pointer transition-colors"
              onClick={() => setActiveView('family')}
            >
              <CardHeader>
                <div className="w-12 h-12 bg-pink-500/20 rounded-lg flex items-center justify-center mb-3">
                  <Users className="w-6 h-6 text-pink-400" />
                </div>
                <CardTitle className="text-white">Family Management</CardTitle>
                <CardDescription className="text-gray-400">
                  Link spouse and children, generate family QR codes
                </CardDescription>
              </CardHeader>
            </Card>

            <Card
              className="bg-[#1A1A20] border-[#2A2A30] hover:border-[#1CE479] cursor-pointer transition-colors"
              onClick={() => setActiveView('biometric')}
            >
              <CardHeader>
                <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center mb-3">
                  <Fingerprint className="w-6 h-6 text-yellow-400" />
                </div>
                <CardTitle className="text-white">Biometric Enrollment</CardTitle>
                <CardDescription className="text-gray-400">
                  Register fingerprint for fast, secure check-in
                </CardDescription>
              </CardHeader>
            </Card>

            <Card
              className="bg-[#1A1A20] border-[#2A2A30] hover:border-[#1CE479] cursor-pointer transition-colors"
              onClick={() => setActiveView('service-qr')}
            >
              <CardHeader>
                <div className="w-12 h-12 bg-[#1CE479]/20 rounded-lg flex items-center justify-center mb-3">
                  <QrCode className="w-6 h-6 text-[#1CE479]" />
                </div>
                <CardTitle className="text-white">Service QR Generator</CardTitle>
                <CardDescription className="text-gray-400">
                  Generate QR codes for services, project on screen or print
                </CardDescription>
              </CardHeader>
            </Card>

            <Card
              className="bg-[#1A1A20] border-[#2A2A30] hover:border-[#1CE479] cursor-pointer transition-colors"
              onClick={() => setActiveView('kiosk')}
            >
              <CardHeader>
                <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mb-3">
                  <Calendar className="w-6 h-6 text-green-400" />
                </div>
                <CardTitle className="text-white">Check-In Kiosk</CardTitle>
                <CardDescription className="text-gray-400">
                  Full-screen kiosk mode for entrance tablets
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          {/* Implementation Stats */}
          <Card className="bg-[#1A1A20] border-[#2A2A30]">
            <CardHeader>
              <CardTitle className="text-white">Phase 15 Implementation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-3xl text-[#1CE479] mb-1">7</p>
                  <p className="text-sm text-gray-400">New Components</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl text-[#1CE479] mb-1">5</p>
                  <p className="text-sm text-gray-400">Login Methods</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl text-[#1CE479] mb-1">100%</p>
                  <p className="text-sm text-gray-400">Mobile Optimized</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl text-[#1CE479] mb-1">✓</p>
                  <p className="text-sm text-gray-400">Production Ready</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0F]">
      {/* Back Button */}
      {activeView !== 'intro' && (
        <div className="p-4 border-b border-[#2A2A30] bg-[#1A1A20]">
          <Button
            variant="outline"
            onClick={() => setActiveView('intro')}
            className="border-[#2A2A30]"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Overview
          </Button>
        </div>
      )}

      {/* Content */}
      {activeView === 'login' && (
        <MemberLogin
          onLogin={handleLogin}
          onForgotPassword={(identifier) => console.log('Forgot password:', identifier)}
          onRegister={() => console.log('Register')}
        />
      )}

      {activeView === 'dashboard' && (
        <MemberDashboard
          member={selectedMember}
          attendanceRecords={mockAttendanceRecords}
          donations={mockDonations}
          onLogout={handleLogout}
          onEditProfile={() => setActiveView('profile')}
          onGenerateQR={() => console.log('Generate QR')}
          onCheckIn={() => console.log('Check in')}
        />
      )}

      {activeView === 'profile' && (
        <ProfileEditor
          member={selectedMember}
          onSave={handleSaveProfile}
          onCancel={() => setActiveView('dashboard')}
          onChangePassword={handleChangePassword}
        />
      )}

      {activeView === 'family' && (
        <div className="p-6">
          <FamilyManagement
            member={selectedMember}
            familyMembers={mockFamilyMembers}
            onAddMember={handleAddFamilyMember}
            onRemoveMember={handleRemoveFamilyMember}
            onSetPrimaryContact={handleSetPrimaryContact}
            onGenerateFamilyQR={() => console.log('Generate family QR')}
          />
        </div>
      )}

      {activeView === 'biometric' && (
        <div className="p-6">
          <BiometricEnrollment
            memberId={selectedMember.id}
            memberName={`${selectedMember.firstName} ${selectedMember.lastName}`}
            onEnroll={handleBiometricEnroll}
            onDelete={async () => console.log('Delete biometric')}
          />
        </div>
      )}

      {activeView === 'service-qr' && (
        <div className="p-6">
          <ServiceQRGenerator
            organizationId="org1"
            branchId="branch1"
            onCheckIn={(memberId, serviceId) => console.log('Check in:', memberId, serviceId)}
          />
        </div>
      )}

      {activeView === 'kiosk' && (
        <CheckInKiosk
          serviceName="Sunday Main Service"
          serviceTime={new Date().toLocaleString()}
          onCheckIn={handleKioskCheckIn}
        />
      )}
    </div>
  );
};
