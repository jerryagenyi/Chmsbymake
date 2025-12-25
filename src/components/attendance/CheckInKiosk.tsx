/**
 * ChurchAfrica ChMS - Check-In Kiosk
 * Full-page check-in interface with detachable QR code and manual search
 * Admin interface for managing check-ins at entrance
 */

import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import {
  Search,
  CheckCircle2,
  Users,
  Clock,
  MapPin,
  Calendar,
  User,
  Baby,
  ArrowRight,
  Home,
  BarChart3,
  Settings,
  Keyboard,
  QrCode,
  ExternalLink,
  Scan,
  Maximize,
  Minimize,
} from 'lucide-react';
import { Service, getServiceIcon, SERVICE_TYPE_LABELS, SERVICE_TYPE_COLORS } from '../../types/service';
import { Member } from '../../types/member';
import { cn } from '../ui/utils';
import { DetachableQRCode } from './DetachableQRCode';
import { CheckInToast, CheckInNotification } from './CheckInToast';
import { Checkbox } from '../ui/checkbox';
import QRCode from 'react-qr-code';
import { useOrganization } from '../../contexts/OrganizationContext';
import { ChurchLogo } from '../organization/ChurchLogo';

interface CheckInKioskProps {
  service: Service;
  members: Member[];
  recentCheckIns?: {
    member: Member;
    timestamp: Date;
    familyMembers?: Member[];
  }[];
  onCheckIn: (memberIds: string[], serviceId: string) => void;
  onNavigateHome?: () => void;
  onNavigateReports?: () => void;
  onNavigateSettings?: () => void;
  enableFamilyCheckIn?: boolean;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
}

export function CheckInKiosk({
  service,
  members,
  recentCheckIns = [],
  onCheckIn,
  onNavigateHome,
  onNavigateReports,
  onNavigateSettings,
  enableFamilyCheckIn = true,
  isFullscreen = false,
  onToggleFullscreen,
}: CheckInKioskProps) {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedMember, setSelectedMember] = React.useState<Member | null>(null);
  const [selectedFamilyMemberIds, setSelectedFamilyMemberIds] = React.useState<string[]>([]);
  const [showQRPopup, setShowQRPopup] = React.useState(false);
  const [notifications, setNotifications] = React.useState<CheckInNotification[]>([]);
  const searchInputRef = React.useRef<HTMLInputElement>(null);

  // Get family members for selected member
  const familyMembers = React.useMemo(() => {
    if (!selectedMember || !enableFamilyCheckIn || !selectedMember.familyId) {
      return [];
    }
    return members.filter(
      m => m.familyId === selectedMember.familyId && m.id !== selectedMember.id
    );
  }, [selectedMember, members, enableFamilyCheckIn]);

  // Filter members based on search
  const filteredMembers = React.useMemo(() => {
    if (!searchQuery.trim()) return [];

    const query = searchQuery.toLowerCase();
    return members
      .filter(member => {
        const fullName = `${member.firstName} ${member.lastName}`.toLowerCase();
        const phone = member.phone?.toLowerCase() || '';
        const email = member.email?.toLowerCase() || '';
        return fullName.includes(query) || phone.includes(query) || email.includes(query);
      })
      .slice(0, 8);
  }, [searchQuery, members]);

  // Handle member selection
  const handleSelectMember = (member: Member) => {
    setSelectedMember(member);
    setSearchQuery('');
    setSelectedFamilyMemberIds([]); // Start with none selected
  };

  // Toggle family member selection
  const handleToggleFamilyMember = (memberId: string) => {
    setSelectedFamilyMemberIds(prev =>
      prev.includes(memberId)
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    );
  };

  // Handle check-in
  const handleCheckIn = () => {
    if (!selectedMember) return;

    const memberIds = [selectedMember.id, ...selectedFamilyMemberIds];
    onCheckIn(memberIds, service.id);

    // Add notification
    const notification: CheckInNotification = {
      id: `${Date.now()}-${selectedMember.id}`,
      member: selectedMember,
      familyCount: memberIds.length,
      timestamp: new Date(),
    };
    setNotifications(prev => [...prev, notification]);

    // Reset form
    setSelectedMember(null);
    setSelectedFamilyMemberIds([]);
    setSearchQuery('');
    searchInputRef.current?.focus();
  };

  // Remove notification
  const handleDismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // Handle keyboard shortcuts
  React.useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && selectedMember) {
        handleCheckIn();
      }
      if (e.key === 'Escape') {
        setSelectedMember(null);
        setSelectedFamilyMemberIds([]);
        setSearchQuery('');
        searchInputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [selectedMember, selectedFamilyMemberIds]);

  // Auto-focus search input on mount
  React.useEffect(() => {
    searchInputRef.current?.focus();
  }, []);

  const ServiceIcon = getServiceIcon(service.serviceType);

  // Generate QR code data for service
  const qrCodeData = React.useMemo(() => {
    return JSON.stringify({
      type: 'service_checkin',
      serviceId: service.id,
      serviceName: service.name,
      serviceType: service.serviceType,
      date: service.scheduledDate,
      time: service.startTime,
      churchId: 'church_001',
      timestamp: new Date().toISOString(),
    });
  }, [service]);

  const { organization } = useOrganization();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Toast Notifications */}
      <CheckInToast
        notifications={notifications}
        onDismiss={handleDismissNotification}
      />

      {/* Detachable QR Code Popup */}
      {showQRPopup && (
        <DetachableQRCode
          service={service}
          onClose={() => setShowQRPopup(false)}
        />
      )}

      {/* Main Content - 2 Column Grid */}
      <div className="flex-1 grid grid-cols-12 gap-6 p-8 max-w-7xl mx-auto w-full">
        {/* Left Side - QR Code */}
        <Card className="bg-[#1A1A20] col-span-12 lg:col-span-6">
          <CardContent className="p-8">
            <div className="text-center space-y-6">
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <Scan className="h-5 w-5" />
                <span>Scan to Check In</span>
              </div>
              
              {/* QR Code */}
              <div className="bg-white p-6 rounded-lg inline-block">
                <QRCode
                  value={qrCodeData}
                  size={280}
                  level="H"
                  className="mx-auto"
                />
              </div>

              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Scan this QR code with your phone camera
                </p>
                <p className="text-xs text-muted-foreground">
                  Service ID: {service.id.slice(0, 8)}
                </p>
              </div>

              {/* Instructions */}
              <div className="bg-background/50 rounded-lg p-4 text-left space-y-2">
                <h3 className="text-sm font-medium flex items-center gap-2">
                  <QrCode className="h-4 w-4 text-[#1CE479]" />
                  Mobile Check-In Instructions
                </h3>
                <ol className="text-xs text-muted-foreground space-y-1 list-decimal list-inside">
                  <li>Open your phone camera</li>
                  <li>Point at QR code above</li>
                  <li>Tap the notification/link</li>
                  <li>Select family members (if enabled)</li>
                  <li>Confirm check-in</li>
                </ol>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Right Side - Manual Search Form */}
        <div className="space-y-6 col-span-12 lg:col-span-6">
          {/* Search Form */}
          <Card className="bg-[#1A1A20]">
            <CardContent className="p-8">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-medium flex items-center gap-2">
                    <Keyboard className="h-5 w-5 text-[#1CE479]" />
                    Manual Check-In
                  </h2>
                  {enableFamilyCheckIn && (
                    <Badge variant="outline" className="text-[#1CE479] border-[#1CE479]/50">
                      Family Check-In Enabled
                    </Badge>
                  )}
                </div>

                {/* Search Input */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Type name, phone, or email and press Enter..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-14 text-lg"
                    disabled={!!selectedMember}
                  />
                </div>

                {/* Search Results */}
                {!selectedMember && filteredMembers.length > 0 && (
                  <ScrollArea className="h-[400px]">
                    <div className="space-y-2">
                      {filteredMembers.map((member) => (
                        <button
                          key={member.id}
                          onClick={() => handleSelectMember(member)}
                          className="w-full p-4 bg-background hover:bg-background/70 rounded-lg border border-border hover:border-[#1CE479]/50 transition-all text-left group"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-full bg-[#1CE479]/20 flex items-center justify-center group-hover:bg-[#1CE479]/30 transition-colors">
                                <User className="h-5 w-5 text-[#1CE479]" />
                              </div>
                              <div>
                                <p className="font-medium">
                                  {member.firstName} {member.lastName}
                                </p>
                                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                  {member.phone && <span>{member.phone}</span>}
                                  {member.email && <span>{member.email}</span>}
                                </div>
                              </div>
                            </div>
                            <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-[#1CE479] transition-colors" />
                          </div>
                          {member.familyId && enableFamilyCheckIn && (
                            <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                              <Users className="h-3 w-3" />
                              <span>Has family members</span>
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </ScrollArea>
                )}

                {/* No Results */}
                {!selectedMember && searchQuery && filteredMembers.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    <User className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>No members found matching "{searchQuery}"</p>
                    <p className="text-sm mt-1">Try a different name, phone, or email</p>
                  </div>
                )}

                {/* Selected Member - Family Selection */}
                {selectedMember && (
                  <div className="space-y-4">
                    {/* Primary Member */}
                    <div className="bg-[#1CE479]/10 border border-[#1CE479]/50 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 rounded-full bg-[#1CE479]/20 flex items-center justify-center">
                            <User className="h-6 w-6 text-[#1CE479]" />
                          </div>
                          <div>
                            <p className="font-medium text-lg">
                              {selectedMember.firstName} {selectedMember.lastName}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Primary Member
                            </p>
                          </div>
                        </div>
                        <CheckCircle2 className="h-6 w-6 text-[#1CE479]" />
                      </div>
                    </div>

                    {/* Family Members */}
                    {familyMembers.length > 0 && (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Users className="h-4 w-4" />
                          <span>Select family members to check in:</span>
                        </div>
                        
                        <div className="space-y-2 max-h-[250px] overflow-y-auto">
                          {familyMembers.map((member) => {
                            const isSelected = selectedFamilyMemberIds.includes(member.id);
                            const isChild = member.dateOfBirth && 
                              new Date().getFullYear() - new Date(member.dateOfBirth).getFullYear() < 18;
                            
                            return (
                              <button
                                key={member.id}
                                onClick={() => handleToggleFamilyMember(member.id)}
                                className={cn(
                                  "w-full p-3 rounded-lg border-2 transition-all text-left flex items-center gap-3",
                                  isSelected
                                    ? "border-[#1CE479] bg-[#1CE479]/10"
                                    : "border-border bg-background hover:bg-background/70"
                                )}
                              >
                                <Checkbox
                                  checked={isSelected}
                                  className="pointer-events-none"
                                />
                                <div className="flex items-center gap-2 flex-1">
                                  {isChild && <Baby className="h-4 w-4 text-muted-foreground" />}
                                  <div>
                                    <p className="font-medium">
                                      {member.firstName} {member.lastName}
                                    </p>
                                    {member.dateOfBirth && (
                                      <p className="text-xs text-muted-foreground">
                                        Age: {new Date().getFullYear() - new Date(member.dateOfBirth).getFullYear()}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4">
                      <Button
                        onClick={handleCheckIn}
                        size="lg"
                        className="flex-1 h-14 text-lg gap-2"
                      >
                        <CheckCircle2 className="h-5 w-5" />
                        Check In {selectedFamilyMemberIds.length > 0 && `(${selectedFamilyMemberIds.length + 1} people)`}
                      </Button>
                      <Button
                        onClick={() => {
                          setSelectedMember(null);
                          setSelectedFamilyMemberIds([]);
                          setSearchQuery('');
                          searchInputRef.current?.focus();
                        }}
                        variant="outline"
                        size="lg"
                        className="h-14"
                      >
                        Cancel
                      </Button>
                    </div>

                    <p className="text-xs text-center text-muted-foreground">
                      Press <kbd className="px-2 py-1 bg-background rounded border">Enter</kbd> to check in
                      {' • '}
                      Press <kbd className="px-2 py-1 bg-background rounded border">Esc</kbd> to cancel
                    </p>
                  </div>
                )}

                {/* Empty State */}
                {!selectedMember && !searchQuery && (
                  <div className="text-center py-12 text-muted-foreground">
                    <Search className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>Start typing to search for members</p>
                    <p className="text-sm mt-1">Search by name, phone number, or email</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Check-Ins */}
          {recentCheckIns.length > 0 && (
            <Card className="bg-[#1A1A20]">
              <CardContent className="p-4">
                <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                  <Clock className="h-4 w-4 text-[#1CE479]" />
                  Recent Check-Ins
                </h3>
                <ScrollArea className="h-32">
                  <div className="space-y-2">
                    {recentCheckIns.slice(0, 5).map((checkIn, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between text-sm py-1"
                      >
                        <span>
                          {checkIn.member.firstName} {checkIn.member.lastName}
                          {checkIn.familyMembers && checkIn.familyMembers.length > 0 && (
                            <span className="text-muted-foreground ml-2">
                              +{checkIn.familyMembers.length} family
                            </span>
                          )}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {checkIn.timestamp.toLocaleTimeString('en-GB', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Footer - Quick Links */}
      <footer className="bg-[#1A1A20] border-t border-border py-4 px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onNavigateHome}
              className="gap-2"
            >
              <Home className="h-4 w-4" />
              Dashboard
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onNavigateReports}
              className="gap-2"
            >
              <BarChart3 className="h-4 w-4" />
              Reports
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onNavigateSettings}
              className="gap-2"
            >
              <Settings className="h-4 w-4" />
              Settings
            </Button>
          </div>
          
          <div className="text-sm text-muted-foreground">
            ChurchAfrica ChMS • Check-In Kiosk Mode
          </div>
        </div>
      </footer>
    </div>
  );
}