/**
 * ChurchAfrica ChMS - Main Application
 * Africa-First Church Management System
 */

import React from 'react';
import { ThemeProvider } from './components/theme/ThemeProvider';
import { Dashboard } from './components/dashboard/Dashboard';
import { MemberList } from './components/members/MemberList';
import {
  AttendanceTracker,
  CheckInKiosk,
} from './components/attendance';
import { AppLayout } from './components/layout/AppLayout';
import { AppHeader } from './components/layout/AppHeader';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { Badge } from './components/ui/badge';
import { Button } from './components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { CheckCircle2, Sparkles, LayoutDashboard, Users, ClipboardCheck, QrCode, Calendar, MessageSquare, Building2, Settings, DollarSign, FileText, TrendingUp, Brain, Clock, Maximize, Minimize, ExternalLink, ChevronRight, MapPin, Sun } from 'lucide-react';
import { mockMembers, mockServices, mockAttendanceRecords, mockEvents } from './lib/mock-data';
import { Member } from './types/member';
import { AttendanceStatus, Service, AttendanceRecord } from './types/attendance';
import { Event } from './types/event';
import { Service as ChurchService } from './types/service';
import { mockServices as mockChurchServices } from './lib/mock-service-data';
import { mockDonations, mockGivingStats, mockGivingTrends, mockDonors, mockCampaigns } from './lib/mock-giving-data';
import { Donation } from './types/giving';
import { Location } from './types/location';
import { mockGivingSummaryReport } from './lib/mock-report-data';
import { mockMembershipAnalytics, mockAttendanceAnalytics, mockChurchHealthAnalytics } from './lib/mock-analytics-data';
import { mockAIInsights, mockChurnPredictions } from './lib/mock-ai-data';
import { mockLocations } from './lib/mock-location-data';
import { ServiceManager } from './components/services';
import { ServicesPage } from './components/services';
import { EventCalendar, EventList } from './components/events';
import { EventManagement } from './components/events';
import { DevNavigation } from './components/dev/DevNavigation';
import { AuthPage } from './components/auth/AuthPage';
import { LandingPage } from './components/landing';
import { ChatInterface } from './components/chat/ChatInterface';
import { OrganizationManagement } from './components/organization/OrganizationManagement';
import { LocationManager } from './components/organization/LocationManager';
import { MemberPortalShowcase } from './components/member-portal/MemberPortalShowcase';
import { SubNavigation, SubNavigationItem } from './components/navigation/SubNavigation';
import { PageHeader } from './components/layout/PageHeader';
import { GivingDashboard } from './components/giving/GivingDashboard';
import { DonationForm } from './components/giving/DonationForm';
import { CampaignManager } from './components/giving/CampaignManager';
import { ReportsHub } from './components/reports/ReportsHub';
import { GivingReports } from './components/reports/GivingReports';
import { DonorStatements } from './components/reports/DonorStatements';
import { TaxReceiptGenerator } from './components/reports/TaxReceiptGenerator';
import { ServiceComparisonReport } from './components/reports/ServiceComparisonReport';
import { AnalyticsHub } from './components/analytics/AnalyticsHub';
import { MembershipAnalytics } from './components/analytics';
import { AttendanceAnalytics } from './components/analytics';
import { ChurchHealthAnalytics } from './components/analytics';
import { AIDashboard } from './components/ai';
import { UIShowcase } from './components/ui-enhanced/UIShowcase';
import { UXShowcase } from './components/ui-enhanced-v2/UXShowcase';
import { ColorPalette } from './components/settings/ColorPalette';
import type { ReportType } from './types/reports';
import type { AnalyticsModule } from './types/analytics';

export default function App() {
  // Routing state: 'public' pages vs 'app' pages
  const [currentPage, setCurrentPage] = React.useState('landing');
  const [activeTab, setActiveTab] = React.useState('dashboard');
  const [currentRoute, setCurrentRoute] = React.useState('/');
  
  // Determine if we're on a public page (landing, auth) or app page
  const isPublicPage = currentPage === 'landing' || currentPage === 'auth';
  
  const [attendanceRecords, setAttendanceRecords] = React.useState<AttendanceRecord[]>(mockAttendanceRecords);
  const [selectedServiceId, setSelectedServiceId] = React.useState<string>('s1');
  const [demoMode, setDemoMode] = React.useState(true); // Demo mode ON by default for showcase
  const [members, setMembers] = React.useState<Member[]>(mockMembers);
  const [isKioskFullscreen, setIsKioskFullscreen] = React.useState(false);
  
  // Church/Organization context
  const [currentBranch, setCurrentBranch] = React.useState<'wuse2' | 'kubwa'>('kubwa'); // Default to HQ
  const churchName = "Victory Chapel Ministry";
  const branches = {
    wuse2: "Wuse 2, Abuja",
    kubwa: "Kubwa, Abuja (HQ)"
  };
  
  // Convert branches to array format for ServicesPage
  const branchesArray = [
    { id: 'kubwa', name: 'Kubwa Campus', location: 'Kubwa, Abuja (HQ)' },
    { id: 'wuse2', name: 'Wuse 2 Campus', location: 'Wuse 2, Abuja' },
  ];
  
  // Services state
  const [services, setServices] = React.useState<ChurchService[]>(mockChurchServices);
  
  // Giving state
  const [showDonationForm, setShowDonationForm] = React.useState(false);
  const [showCampaignManager, setShowCampaignManager] = React.useState(false);
  const [donations, setDonations] = React.useState<Donation[]>(mockDonations);
  
  // Reports state
  const [currentReport, setCurrentReport] = React.useState<ReportType | null>(null);
  
  // Analytics state
  const [currentAnalyticsModule, setCurrentAnalyticsModule] = React.useState<AnalyticsModule | null>(null);
  
  // Location state
  const [locations, setLocations] = React.useState<Location[]>(mockLocations);
  
  // Sync currentPage with activeTab for pages that are also tabs
  React.useEffect(() => {
    const tabPages = ['dashboard', 'members', 'attendance', 'services', 'events', 'chat', 'organization', 'giving', 'settings'];
    if (tabPages.includes(currentPage)) {
      setActiveTab(currentPage);
    }
  }, [currentPage]);
  
  // Navigation handler from sidebar
  const handleSidebarNavigation = (path: string) => {
    console.log('Navigate to:', path);
    setCurrentRoute(path);
    
    // Map paths to pages/tabs
    const pathToPage: Record<string, string> = {
      '/': 'dashboard',
      '/dashboard': 'dashboard',
      '/members': 'members',
      '/attendance': 'attendance',
      '/events': 'events',
      '/chat': 'chat',
      '/organization': 'organization',
      '/giving': 'giving',
      '/reports': 'reports',
      '/analytics': 'analytics',
      '/ai': 'ai',
      '/settings': 'settings',
      '/color-palette': 'color-palette',
    };
    
    const page = pathToPage[path] || 'dashboard';
    setCurrentPage(page);
    setActiveTab(page);
  };
  
  // Giving handlers
  const handleRecordDonation = (donation: Partial<Donation>) => {
    const newDonation: Donation = {
      id: `dn${Date.now()}`,
      receipt_number: `RCT-2024-${String(donations.length + 1).padStart(6, '0')}`,
      branch_id: 'b1',
      organization_id: 'org1',
      recorded_by: 'demo_user',
      status: donation.synced_to_server ? 'completed' : 'offline_pending_sync',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      ...donation as Donation,
    };
    
    setDonations(prev => [newDonation, ...prev]);
    setShowDonationForm(false);
    console.log('Donation recorded:', newDonation);
  };
  
  // Member handlers
  const handleAddMember = (member: Partial<Member>) => {
    console.log('Add member:', member);
    const newMember = member as Member;
    setMembers(prev => [...prev, newMember]);
  };

  const handleEditMember = (member: Member) => {
    console.log('Edit member:', member);
    alert(`Edit ${member.firstName} ${member.lastName} - Form coming soon`);
  };

  const handleDeleteMember = (member: Member) => {
    console.log('Delete member:', member);
    if (confirm(`Delete ${member.firstName} ${member.lastName}?`)) {
      setMembers(prev => prev.filter(m => m.id !== member.id));
    }
  };

  const handleImportMembers = (importedMembers: Partial<Member>[]) => {
    console.log('Import members:', importedMembers.length);
    const newMembers = importedMembers as Member[];
    setMembers(prev => [...prev, ...newMembers]);
  };

  const handleViewMember = (member: Member) => {
    console.log('View member:', member);
    alert(`View details for ${member.firstName} ${member.lastName} - Details page coming soon`);
  };

  // Attendance handlers
  const handleCheckIn = (memberId: string, status: AttendanceStatus) => {
    console.log('Check-in:', memberId, status);
    
    const member = mockMembers.find(m => m.id === memberId);
    if (!member) return;

    setAttendanceRecords(prev => {
      const existing = prev.find(r => r.serviceId === selectedServiceId && r.memberId === memberId);
      
      if (existing) {
        // Update existing record
        return prev.map(r => 
          r.serviceId === selectedServiceId && r.memberId === memberId
            ? {
                ...r,
                status,
                checkInTime: status !== 'absent' ? new Date().toISOString() : undefined,
                updatedAt: new Date().toISOString(),
              }
            : r
        );
      } else {
        // Create new record
        const newRecord: AttendanceRecord = {
          id: `a${Date.now()}`,
          serviceId: selectedServiceId,
          memberId,
          status,
          checkInTime: status !== 'absent' ? new Date().toISOString() : undefined,
          checkInMethod: 'manual',
          memberName: `${member.firstName} ${member.lastName}`,
          membershipNumber: member.membershipNumber,
          isFirstTimer: member.status === 'visitor',
          isGuest: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        return [...prev, newRecord];
      }
    });
  };

  const handleBulkCheckIn = (memberIds: string[], status: AttendanceStatus) => {
    console.log('Bulk check-in:', memberIds.length, 'members', status);
    memberIds.forEach(memberId => handleCheckIn(memberId, status));
  };

  const handleSelectService = (service: Service) => {
    console.log('Select service:', service);
    setSelectedServiceId(service.id);
  };

  // Event handlers
  const handleEventView = (event: Event) => {
    console.log('View event:', event);
    alert(`Event Details: ${event.title}\n\nThis would open a detailed view modal with full event information, attendee list, and management options.`);
  };

  const handleEventEdit = (event: Event) => {
    console.log('Edit event:', event);
    alert(`Edit Event: ${event.title}\n\nThis would open an event editor form.`);
  };

  const handleEventRegister = (event: Event) => {
    console.log('Register for event:', event);
    alert(`Register for: ${event.title}\n\nThis would open a registration form for members or guests to sign up.`);
  };

  const handleEventShare = (event: Event) => {
    console.log('Share event:', event);
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: event.description,
        url: window.location.href,
      });
    } else {
      alert(`Share Event: ${event.title}\n\nCopy this link to share: ${window.location.href}#event-${event.id}`);
    }
  };
  
  // Location handlers
  const handleCreateLocation = (location: Partial<Location>) => {
    console.log('Create location:', location);
    const newLocation = location as Location;
    setLocations(prev => [...prev, newLocation]);
  };
  
  const handleUpdateLocation = (id: string, updates: Partial<Location>) => {
    console.log('Update location:', id, updates);
    setLocations(prev => prev.map(loc => loc.id === id ? { ...loc, ...updates } : loc));
  };
  
  const handleDeleteLocation = (id: string) => {
    console.log('Delete location:', id);
    setLocations(prev => prev.filter(loc => loc.id !== id));
  };

  // Service handlers
  const handleCreateService = (service: Omit<ChurchService, 'id' | 'createdAt' | 'updatedAt'>) => {
    console.log('Create service:', service);
    const newService: ChurchService = {
      ...service,
      id: `s${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setServices(prev => [...prev, newService]);
  };

  const handleUpdateService = (id: string, updates: Partial<ChurchService>) => {
    console.log('Update service:', id, updates);
    setServices(prev => prev.map(svc =>
      svc.id === id
        ? { ...svc, ...updates, updatedAt: new Date().toISOString() }
        : svc
    ));
  };

  const handleDeleteService = (id: string) => {
    console.log('Delete service:', id);
    if (confirm('Delete this service?')) {
      setServices(prev => prev.filter(svc => svc.id !== id));
    }
  };

  // Render content based on current page
  const renderPageContent = () => {
    // Special case: landing page is rendered without layout
    if (currentPage === 'landing') {
      return (
        <LandingPage
          onGetStarted={() => {
            setCurrentPage('auth');
            setCurrentRoute('/auth');
          }}
          onWatchDemo={() => {
            alert('Demo video coming soon! For now, you can explore the demo mode by clicking "Get Started Free".');
          }}
        />
      );
    }
    
    // Special case: auth page is rendered without layout
    if (currentPage === 'auth') {
      return (
        <AuthPage
          onBackToLanding={() => {
            setCurrentPage('landing');
            setCurrentRoute('/');
          }}
        />
      );
    }
    
    // Special case: Color Palette page
    if (currentPage === 'color-palette') {
      return <ColorPalette />;
    }
    
    // Special case: UI Showcase is rendered without layout
    if (currentPage === 'ui-showcase') {
      return <UIShowcase />;
    }
    
    // Special case: UX Showcase is rendered without layout
    if (currentPage === 'ux-showcase') {
      return <UXShowcase onBack={() => setCurrentPage('dashboard')} />;
    }
    
    // Special case: Member Portal Showcase is rendered without layout
    if (currentPage === 'member-portal') {
      return <MemberPortalShowcase />;
    }
    
    // All other pages use the main tabbed interface
    return (
      <div className="space-y-6">
        {/* App Header with Organization Branding */}
        <AppHeader 
          showProgressBadge={true}
          progressText="Phase 12 Complete"
        />

        {/* Main Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={(value) => {
          setActiveTab(value);
          setCurrentPage(value);
        }}>
              <TabsList style={{ fontWeight: '200' }}>
                <TabsTrigger value="dashboard" className="gap-2" style={{ fontWeight: '200' }}>
                  <LayoutDashboard className="h-4 w-4" style={{ strokeWidth: 1 }} />
                  Dashboard
                </TabsTrigger>
                <TabsTrigger value="members" className="gap-2" style={{ fontWeight: '200' }}>
                  <Users className="h-4 w-4" style={{ strokeWidth: 1 }} />
                  Members
                </TabsTrigger>
                <TabsTrigger value="attendance" className="gap-2" style={{ fontWeight: '200' }}>
                  <ClipboardCheck className="h-4 w-4" style={{ strokeWidth: 1 }} />
                  Attendance
                </TabsTrigger>
                <TabsTrigger value="services" className="gap-2" style={{ fontWeight: '200' }}>
                  <QrCode className="h-4 w-4" style={{ strokeWidth: 1 }} />
                  Services
                </TabsTrigger>
                <TabsTrigger value="events" className="gap-2" style={{ fontWeight: '200' }}>
                  <Calendar className="h-4 w-4" style={{ strokeWidth: 1 }} />
                  Events
                </TabsTrigger>
                <TabsTrigger value="chat" className="gap-2" style={{ fontWeight: '200' }}>
                  <MessageSquare className="h-4 w-4" style={{ strokeWidth: 1 }} />
                  Chat
                </TabsTrigger>
                <TabsTrigger value="organization" className="gap-2" style={{ fontWeight: '200' }}>
                  <Building2 className="h-4 w-4" style={{ strokeWidth: 1 }} />
                  Organisation
                </TabsTrigger>
                <TabsTrigger value="analytics" className="gap-2" style={{ fontWeight: '200' }}>
                  <TrendingUp className="h-4 w-4" style={{ strokeWidth: 1 }} />
                  Analytics
                </TabsTrigger>
                <TabsTrigger value="ai" className="gap-2" style={{ fontWeight: '200' }}>
                  <Brain className="h-4 w-4" style={{ strokeWidth: 1 }} />
                  AI Intelligence
                </TabsTrigger>
              </TabsList>

              {/* Dashboard Tab */}
              <TabsContent value="dashboard" className="space-y-6 mt-6">
                <Dashboard />
              </TabsContent>

              {/* Members Tab */}
              <TabsContent value="members" className="mt-6">
                <MemberList
                  members={members}
                  onAddMember={handleAddMember}
                  onEditMember={handleEditMember}
                  onDeleteMember={handleDeleteMember}
                  onImport={handleImportMembers}
                />
              </TabsContent>

              {/* Attendance Tab */}
              <TabsContent value="attendance" className="mt-1">
                <Tabs defaultValue="kiosk" className="space-y-4">
                  <SubNavigation
                    sectionName="Attendance"
                    items={[
                      { value: 'kiosk', label: 'Check-In Kiosk' },
                      { value: 'checkin', label: 'Manual Check-In' },
                      { value: 'history', label: 'History' },
                      { value: 'reports', label: 'Reports' },
                    ]}
                  />

                  <TabsContent value="kiosk">
                    <div className="space-y-6">
                      {/* Main Kiosk Interface */}
                      {!isKioskFullscreen ? (
                        <>
                          {/* Church & Branch Info + Service Card - Combined Header */}
                          <div className="bg-[#1A1A20] rounded-lg p-6 space-y-4">
                            {/* Header with Attendance Management on left and Church acronym + Campus badge on right */}
                            <div className="flex items-center justify-between">
                              <h1 className="mb-0 text-2xl font-light">Attendance Management</h1>
                              <div className="flex items-center gap-2">
                                <span className="text-lg">TOBC</span>
                                <Badge 
                                  variant="outline" 
                                  className="bg-[#F1C40F]/20 text-[#F1C40F] border-[#F1C40F]/50 uppercase"
                                  style={{ fontSize: '0.75rem' }}
                                >
                                  {currentBranch === 'kubwa' ? 'Kubwa Campus' : 'Wuse 2 Campus'}
                                </Badge>
                              </div>
                            </div>

                            {/* Service Card */}
                            <Card className="bg-[#0F0F12] border-border/50">
                              <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-4">
                                    <div className="p-3 rounded-lg bg-[#1CE479]/20">
                                      <Sun className="h-6 w-6 text-[#1CE479]" />
                                    </div>
                                    <div>
                                      <div className="flex items-center gap-3 mb-2">
                                        <h2 className="text-xl">{mockChurchServices.find(s => s.isActive)?.name || 'Sunday Morning Worship'}</h2>
                                        <Badge 
                                          variant="outline" 
                                          className="text-[#1CE479] border-[#1CE479]/50"
                                          style={{ fontSize: '0.75rem' }}
                                        >
                                          Sunday Morning Service
                                        </Badge>
                                      </div>
                                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                        <div className="flex items-center gap-1.5">
                                          <Calendar className="h-4 w-4" />
                                          <span>Wednesday 12 November 2025</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                          <Clock className="h-4 w-4" />
                                          <span>09:00 - 11:00</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                          <MapPin className="h-4 w-4" />
                                          <span>Main Sanctuary</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                          <Users className="h-4 w-4" />
                                          <span>Expected: 350</span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <div className="text-3xl font-bold text-[#1CE479]">
                                      {attendanceRecords.filter(r => r.status === 'present' || r.status === 'late').length}
                                    </div>
                                    <div className="text-sm text-muted-foreground">Checked In</div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>

                            {/* Kiosk Mode Actions */}
                            <div className="bg-[#0F0F12] rounded-lg border border-[#1CE479]/20 p-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <QrCode className="h-4 w-4 text-[#1CE479]" />
                                  <span>Kiosk Mode</span>
                                  <span className="text-xs">•</span>
                                  <span className="text-xs">Best viewed in fullscreen</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      const url = window.location.href.split('#')[0] + '#kiosk-fullscreen';
                                      window.open(url, '_blank', 'fullscreen=yes');
                                    }}
                                    className="gap-2"
                                  >
                                    <ExternalLink className="h-4 w-4" />
                                    Open Kiosk in New Window
                                  </Button>
                                  <Button
                                    variant="default"
                                    size="sm"
                                    onClick={() => setIsKioskFullscreen(true)}
                                    className="gap-2"
                                  >
                                    <Maximize className="h-4 w-4" />
                                    Fullscreen
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>

                          <CheckInKiosk
                            service={mockChurchServices.find(s => s.isActive) || mockChurchServices[0]}
                            members={mockMembers}
                            recentCheckIns={attendanceRecords
                              .filter(r => r.status === 'present' || r.status === 'late')
                              .slice(0, 10)
                              .map(r => ({
                                member: mockMembers.find(m => m.id === r.memberId)!,
                                timestamp: new Date(r.checkInTime || r.createdAt),
                              }))}
                            onCheckIn={(memberIds, serviceId) => {
                              memberIds.forEach(memberId => handleCheckIn(memberId, 'present'));
                            }}
                            onNavigateHome={() => setActiveTab('dashboard')}
                            onNavigateReports={() => {
                              // Switch to reports tab
                            }}
                            onNavigateSettings={() => setActiveTab('settings')}
                            enableFamilyCheckIn={true}
                            isFullscreen={false}
                            onToggleFullscreen={() => setIsKioskFullscreen(true)}
                          />
                        </>
                      ) : (
                        <div className="fixed inset-0 z-50 bg-background p-8 overflow-y-auto">
                          {/* Church & Branch Info + Service Card - Fullscreen Header */}
                          <div className="bg-[#1A1A20] rounded-lg p-6 space-y-4 mb-6">
                            {/* Header with Attendance Management on left and Church acronym + Campus badge on right */}
                            <div className="flex items-center justify-between">
                              <h1 className="mb-0 text-2xl font-light">Attendance Management</h1>
                              <div className="flex items-center gap-2">
                                <span className="text-lg">TOBC</span>
                                <Badge 
                                  variant="outline" 
                                  className="bg-[#F1C40F]/20 text-[#F1C40F] border-[#F1C40F]/50 uppercase"
                                  style={{ fontSize: '0.75rem' }}
                                >
                                  {currentBranch === 'kubwa' ? 'Kubwa Campus' : 'Wuse 2 Campus'}
                                </Badge>
                              </div>
                            </div>

                            {/* Service Card */}
                            <Card className="bg-[#0F0F12] border-border/50">
                              <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-4">
                                    <div className="p-3 rounded-lg bg-[#1CE479]/20">
                                      <Sun className="h-6 w-6 text-[#1CE479]" />
                                    </div>
                                    <div>
                                      <div className="flex items-center gap-3 mb-2">
                                        <h2 className="text-xl">{mockChurchServices.find(s => s.isActive)?.name || 'Sunday Morning Worship'}</h2>
                                        <Badge 
                                          variant="outline" 
                                          className="text-[#1CE479] border-[#1CE479]/50"
                                          style={{ fontSize: '0.75rem' }}
                                        >
                                          Sunday Morning Service
                                        </Badge>
                                      </div>
                                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                        <div className="flex items-center gap-1.5">
                                          <Calendar className="h-4 w-4" />
                                          <span>Wednesday 12 November 2025</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                          <Clock className="h-4 w-4" />
                                          <span>09:00 - 11:00</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                          <MapPin className="h-4 w-4" />
                                          <span>Main Sanctuary</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                          <Users className="h-4 w-4" />
                                          <span>Expected: 350</span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <div className="text-3xl font-bold text-[#1CE479]">
                                      {attendanceRecords.filter(r => r.status === 'present' || r.status === 'late').length}
                                    </div>
                                    <div className="text-sm text-muted-foreground">Checked In</div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>

                            {/* Kiosk Mode Actions */}
                            <div className="bg-[#0F0F12] rounded-lg border border-[#1CE479]/20 p-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <QrCode className="h-4 w-4 text-[#1CE479]" />
                                  <span>Kiosk Mode</span>
                                  <span className="text-xs">•</span>
                                  <span className="text-xs">Best viewed in fullscreen</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Button
                                    variant="default"
                                    size="sm"
                                    onClick={() => setIsKioskFullscreen(false)}
                                    className="gap-2"
                                  >
                                    <Minimize className="h-4 w-4" />
                                    Exit Fullscreen
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>

                          <CheckInKiosk
                            service={mockChurchServices.find(s => s.isActive) || mockChurchServices[0]}
                            members={mockMembers}
                            recentCheckIns={attendanceRecords
                              .filter(r => r.status === 'present' || r.status === 'late')
                              .slice(0, 10)
                              .map(r => ({
                                member: mockMembers.find(m => m.id === r.memberId)!,
                                timestamp: new Date(r.checkInTime || r.createdAt),
                              }))}
                            onCheckIn={(memberIds, serviceId) => {
                              memberIds.forEach(memberId => handleCheckIn(memberId, 'present'));
                            }}
                            onNavigateHome={() => setActiveTab('dashboard')}
                            onNavigateReports={() => {
                              // Switch to reports tab
                            }}
                            onNavigateSettings={() => setActiveTab('settings')}
                            enableFamilyCheckIn={true}
                            isFullscreen={true}
                            onToggleFullscreen={() => setIsKioskFullscreen(false)}
                          />
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="checkin">
                    <div className="space-y-6">
                      <PageHeader
                        title="Manual Check-In"
                        description="Record attendance manually for services"
                      />
                      <AttendanceTracker
                        services={mockServices}
                        members={mockMembers}
                        attendanceRecords={attendanceRecords}
                        onCheckIn={handleCheckIn}
                        onBulkCheckIn={handleBulkCheckIn}
                        selectedServiceId={selectedServiceId}
                        onSelectService={handleSelectService}
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="history">
                    <div className="space-y-6">
                      <PageHeader
                        title="Attendance History"
                        description="View historical attendance records"
                      />
                      <Card>
                        <CardContent>
                          <div className="text-center py-12">
                            <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <p className="text-sm text-muted-foreground">
                              Attendance history view coming soon
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value="reports">
                    <div className="space-y-6">
                      <PageHeader
                        title="Attendance Reports"
                        description="Generate attendance reports and analytics"
                      />
                      <Card>
                        <CardContent>
                          <div className="text-center py-12">
                            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <p className="text-sm text-muted-foreground">
                              Attendance reports coming soon
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                </Tabs>
              </TabsContent>

              {/* Services Tab */}
              <TabsContent value="services" className="mt-6">
                <ServicesPage
                  services={services}
                  onServiceCreate={handleCreateService}
                  onServiceUpdate={handleUpdateService}
                  onServiceDelete={handleDeleteService}
                  organizationId="org1"
                  branches={branchesArray}
                  currentUserId="demo_user"
                />
              </TabsContent>

              {/* Events Tab */}
              <TabsContent value="events" className="mt-1">
                <Tabs defaultValue="management" className="space-y-4">
                  <SubNavigation
                    sectionName="Events"
                    items={[
                      { value: 'management', label: 'Event Management' },
                      { value: 'list', label: 'Event List' },
                      { value: 'calendar', label: 'Calendar' },
                    ]}
                  />

                  <TabsContent value="management">
                    <EventManagement
                      events={mockEvents}
                      onCreateEvent={(event) => {
                        console.log('Create event:', event);
                        alert(`Event "${event.title}" created successfully!`);
                      }}
                      onUpdateEvent={(eventId, updates) => {
                        console.log('Update event:', eventId, updates);
                        alert('Event updated successfully!');
                      }}
                      onDeleteEvent={(eventId) => {
                        if (confirm('Delete this event?')) {
                          console.log('Delete event:', eventId);
                          alert('Event deleted successfully!');
                        }
                      }}
                      onGenerateQR={(eventId) => {
                        console.log('Generate QR for event:', eventId);
                        alert('QR code generated! (Feature implementation pending)');
                      }}
                    />
                  </TabsContent>

                  <TabsContent value="list">
                    <div className="space-y-6">
                      <PageHeader
                        title="Event List"
                        description="Browse all upcoming and past events"
                      />
                      <EventList
                        events={mockEvents}
                        onEventView={handleEventView}
                        onEventEdit={handleEventEdit}
                        onEventRegister={handleEventRegister}
                        onEventShare={handleEventShare}
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="calendar">
                    <div className="space-y-6">
                      <PageHeader
                        title="Event Calendar"
                        description="View events in calendar format"
                      />
                      <EventCalendar
                        events={mockEvents}
                        onEventClick={handleEventView}
                        onCreateEvent={(date) => alert(`Create event on ${date.toLocaleDateString()}`)}
                      />
                    </div>
                  </TabsContent>
                </Tabs>
              </TabsContent>

              {/* Chat Tab */}
              <TabsContent value="chat" className="mt-6">
                <ChatInterface />
              </TabsContent>

              {/* Organization Tab */}
              <TabsContent value="organization" className="mt-1">
                <Tabs defaultValue="overview" className="space-y-4">
                  <SubNavigation
                    sectionName="Organisation"
                    items={[
                      { value: 'overview', label: 'Overview' },
                      { value: 'locations', label: 'Locations' },
                      { value: 'settings', label: 'Settings' },
                    ]}
                  />
                  
                  <TabsContent value="overview">
                    <OrganizationManagement />
                  </TabsContent>
                  
                  <TabsContent value="locations">
                    <div className="space-y-6">
                      <LocationManager
                        locations={locations}
                        onCreateLocation={handleCreateLocation}
                        onUpdateLocation={handleUpdateLocation}
                        onDeleteLocation={handleDeleteLocation}
                      />
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="settings">
                    <div className="space-y-6">
                      <PageHeader
                        title="Organisation Settings"
                        description="Configure your organisation settings"
                      />
                      <Card>
                        <CardContent className="pt-6 text-center py-12">
                          <Settings className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                          <p className="text-sm text-muted-foreground">
                            Organisation settings coming soon
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                </Tabs>
              </TabsContent>

              {/* Giving Tab */}
              <TabsContent value="giving" className="mt-1">
                <Tabs defaultValue="dashboard" className="space-y-4">
                  <SubNavigation
                    sectionName="Giving"
                    items={[
                      { value: 'dashboard', label: 'Dashboard' },
                      { value: 'record', label: 'Record Donation' },
                      { value: 'campaigns', label: 'Campaigns' },
                      { value: 'reports', label: 'Reports' },
                    ]}
                  />

                  <TabsContent value="dashboard">
                    <div className="space-y-6">
                      <PageHeader
                        title="Giving Dashboard"
                        description="Overview of donations and giving trends"
                      />
                      <GivingDashboard
                        stats={mockGivingStats}
                        trends={mockGivingTrends}
                        recentDonations={donations}
                        onRecordDonation={() => {
                          setShowDonationForm(true);
                          setActiveTab('giving');
                        }}
                        onViewReports={() => {
                          // Switch to reports tab (within giving tab)
                          const reportsTab = document.querySelector('[value="reports"]') as HTMLButtonElement;
                          if (reportsTab) reportsTab.click();
                        }}
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="record">
                    <div className="space-y-6">
                      <PageHeader
                        title="Record Donation"
                        description="Record a new donation or offering"
                      />
                      <DonationForm
                        donors={mockDonors}
                        onSubmit={handleRecordDonation}
                        onCancel={() => setShowDonationForm(false)}
                        isOffline={!navigator.onLine}
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="campaigns">
                    <div className="space-y-6">
                      <PageHeader
                        title="Giving Campaigns"
                        description="Manage fundraising campaigns and initiatives"
                      />
                      <CampaignManager
                        campaigns={mockCampaigns}
                        onCreateCampaign={() => alert('Campaign creation form coming soon')}
                        onEditCampaign={(campaign) => alert(`Edit campaign: ${campaign.name}`)}
                        onDeleteCampaign={(id) => {
                          if (confirm('Delete this campaign?')) {
                            console.log('Delete campaign:', id);
                          }
                        }}
                        onViewDetails={(campaign) => alert(`View details: ${campaign.name}`)}
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="reports">
                    {!currentReport ? (
                      <>
                        <PageHeader
                          title="Giving Reports"
                          description="Generate and view giving reports"
                        />
                        <ReportsHub onSelectReport={(reportId) => setCurrentReport(reportId as ReportType)} />
                      </>
                    ) : currentReport === 'giving_summary' ? (
                      <GivingReports
                        report={mockGivingSummaryReport}
                        onBack={() => setCurrentReport(null)}
                      />
                    ) : currentReport === 'donor_statements' ? (
                      <DonorStatements
                        donors={mockDonors}
                        onBack={() => setCurrentReport(null)}
                      />
                    ) : currentReport === 'tax_receipts' ? (
                      <TaxReceiptGenerator
                        donors={mockDonors}
                        onBack={() => setCurrentReport(null)}
                      />
                    ) : currentReport === 'service_comparison' ? (
                      <ServiceComparisonReport
                        services={mockChurchServices}
                        attendanceRecords={attendanceRecords}
                        dateRange={{
                          start: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
                          end: new Date(),
                        }}
                        onBack={() => setCurrentReport(null)}
                        onExport={() => alert('Export service comparison report')}
                      />
                    ) : (
                      <div className="text-center py-12">
                        <p className="text-muted-foreground">
                          This report type is coming soon
                        </p>
                        <Button
                          variant="outline"
                          className="mt-4"
                          onClick={() => setCurrentReport(null)}
                        >
                          ← Back to Reports
                        </Button>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </TabsContent>

              {/* Analytics Tab */}
              <TabsContent value="analytics" className="mt-6">
                {!currentAnalyticsModule ? (
                  <AnalyticsHub onSelectModule={(moduleId) => setCurrentAnalyticsModule(moduleId)} />
                ) : currentAnalyticsModule === 'membership' ? (
                  <MembershipAnalytics
                    analytics={mockMembershipAnalytics}
                    onBack={() => setCurrentAnalyticsModule(null)}
                  />
                ) : currentAnalyticsModule === 'attendance' ? (
                  <AttendanceAnalytics
                    analytics={mockAttendanceAnalytics}
                    onBack={() => setCurrentAnalyticsModule(null)}
                  />
                ) : currentAnalyticsModule === 'church_health' ? (
                  <ChurchHealthAnalytics
                    analytics={mockChurchHealthAnalytics}
                    onBack={() => setCurrentAnalyticsModule(null)}
                  />
                ) : currentAnalyticsModule === 'giving' ? (
                  <>
                    <PageHeader
                      title="Giving Analytics"
                      description="Analytics for giving and donations"
                    />
                    <div className="text-center py-12">
                      <p className="text-muted-foreground mb-2">
                        Giving analytics are available in the Giving → Reports section
                      </p>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setActiveTab('giving');
                          setCurrentAnalyticsModule(null);
                        }}
                      >
                        Go to Giving Reports
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <PageHeader
                      title="Analytics Module"
                      description="View detailed analytics for your church"
                    />
                    <div className="text-center py-12">
                      <p className="text-muted-foreground">
                        This analytics module is coming soon
                      </p>
                      <Button
                        variant="outline"
                        className="mt-4"
                        onClick={() => setCurrentAnalyticsModule(null)}
                      >
                        ← Back to Analytics Hub
                      </Button>
                    </div>
                  </>
                )}
              </TabsContent>

              {/* AI Intelligence Tab */}
              <TabsContent value="ai" className="mt-6">
                <PageHeader
                  title="AI Intelligence"
                  description="AI-powered insights and predictions for your church"
                />
                <AIDashboard
                  insights={mockAIInsights}
                  churnPredictions={mockChurnPredictions}
                  onViewDetails={(section) => {
                    console.log('View AI section:', section);
                    // In production, would navigate to detailed views
                  }}
                />
              </TabsContent>

              {/* Settings Tab - Placeholder */}
              <TabsContent value="settings" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Settings</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Configure your church management system
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12">
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                        <Settings className="h-8 w-8 text-primary" />
                      </div>
                      <h3 className="font-semibold mb-2">Settings Coming Soon</h3>
                      <p className="text-sm text-muted-foreground max-w-md mx-auto">
                        System settings, user preferences, and configuration options will be available in a future update.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Status Info */}
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="mb-1">Phase 12 Complete: AI & ML Foundation 🤖</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Comprehensive AI/ML foundation with predictive analytics and intelligent insights:
                    </p>
                    <ul className="text-sm text-muted-foreground space-y-1 mb-4">
                      <li>✓ Complete type system for AI/ML features (churn, forecasts, LLM, recommendations)</li>
                      <li>✓ AI Dashboard with insights, predictions, and forecasts</li>
                      <li>✓ Churn Prediction types & mock data (risk levels, interventions, confidence)</li>
                      <li>✓ Giving & Attendance Forecast types with confidence intervals</li>
                      <li>✓ Natural Language Query system types (LLM integration ready)</li>
                      <li>✓ Intelligent Recommendations (volunteer matching, small groups, events)</li>
                      <li>✓ Sentiment Analysis & Prayer Request categorization types</li>
                      <li>✓ Anomaly Detection framework</li>
                      <li>✓ Comprehensive AI Integration Guide (50+ pages)</li>
                      <li>✓ Production-ready architecture for ML services</li>
                    </ul>
                    <div className="p-3 bg-[#1A1A20] rounded-lg border border-primary/20">
                      <p className="text-xs text-muted-foreground">
                        <strong className="text-primary">Phase 11:</strong> Church Analytics (membership, attendance, health) | 
                        <strong className="text-primary"> Phase 10:</strong> Reports & Analytics | 
                        <strong className="text-primary"> Phase 9:</strong> Giving/Donations | 
                        <strong className="text-primary"> Previous:</strong> Auth, Dashboard, Members, Attendance, Events, Chat, Multi-org
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );
  };

  // PUBLIC PAGES: Landing and Auth (like chms.com, chms.com/login)
  // These pages have NO layout, NO sidebars, NO app chrome
  if (isPublicPage && !demoMode) {
    return (
      <ThemeProvider>
        <AuthProvider>
          <UserProvider>
            {renderPageContent()}
            {/* DevNavigation only shown on public pages in prototype for easy navigation */}
            {/* In production, this would not exist on public pages */}
            <DevNavigation 
              currentPage={currentPage} 
              onNavigate={setCurrentPage}
              demoMode={demoMode}
              onToggleDemoMode={() => setDemoMode(!demoMode)}
            />
          </UserProvider>
        </AuthProvider>
      </ThemeProvider>
    );
  }

  // APP PAGES: Dashboard, Members, etc. (like app.chms.com/*)
  // These pages have full AppLayout with sidebars and navigation
  return (
    <ThemeProvider>
      {/* Design prototype - always runs in demo mode, no auth required */}
      <AppLayout 
        showSecondarySidebar={true}
        onNavigate={handleSidebarNavigation}
        currentPath={currentRoute}
      >
        {renderPageContent()}
      </AppLayout>
      
      {/* Developer Navigation - Prototype tool for easy page switching */}
      {/* In production, this would not exist */}
      <DevNavigation 
        currentPage={currentPage} 
        onNavigate={setCurrentPage}
        demoMode={demoMode}
        onToggleDemoMode={() => setDemoMode(!demoMode)}
      />
    </ThemeProvider>
  );
}