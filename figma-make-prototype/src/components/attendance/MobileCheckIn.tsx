/**
 * ChurchAfrica ChMS - Mobile Check-In
 * Quick family check-in popup after scanning QR code
 * No redirect - just a popup for member to SELECT who is present
 */

import React from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Checkbox } from '../ui/checkbox';
import { Badge } from '../ui/badge';
import {
  CheckCircle2,
  Users,
  Clock,
  MapPin,
  User,
  Baby,
  X,
} from 'lucide-react';
import { Service, getServiceIcon, SERVICE_TYPE_LABELS, SERVICE_TYPE_COLORS } from '../../types/service';
import { Member } from '../../types/member';
import { cn } from '../ui/utils';

interface MobileCheckInProps {
  service: Service;
  member: Member;
  familyMembers: Member[];
  onCheckIn: (memberIds: string[], serviceId: string) => void;
  onClose: () => void;
  enableFamilyCheckIn?: boolean;
}

export function MobileCheckIn({
  service,
  member,
  familyMembers,
  onCheckIn,
  onClose,
  enableFamilyCheckIn = true,
}: MobileCheckInProps) {
  const [selectedMemberIds, setSelectedMemberIds] = React.useState<string[]>([member.id]);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [showSuccess, setShowSuccess] = React.useState(false);

  const ServiceIcon = getServiceIcon(service.serviceType);

  // Toggle family member selection
  const handleToggleMember = (memberId: string) => {
    if (memberId === member.id) return; // Cannot deselect primary member
    
    setSelectedMemberIds(prev =>
      prev.includes(memberId)
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    );
  };

  // Handle check-in
  const handleCheckIn = async () => {
    setIsSubmitting(true);
    
    try {
      await onCheckIn(selectedMemberIds, service.id);
      
      // Show success state briefly
      setShowSuccess(true);
      
      // Auto-close after 1.5 seconds
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error) {
      console.error('Check-in error:', error);
      setIsSubmitting(false);
    }
  };

  // Success screen
  if (showSuccess) {
    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
        <Card className="w-full max-w-md bg-[#1A1A20] border-[#1CE479] animate-in zoom-in-95">
          <CardContent className="p-8 text-center space-y-4">
            <div className="h-20 w-20 rounded-full bg-[#1CE479]/20 flex items-center justify-center mx-auto">
              <CheckCircle2 className="h-12 w-12 text-[#1CE479]" />
            </div>
            <div>
              <h3 className="text-2xl font-medium text-[#1CE479] mb-2">
                Checked In!
              </h3>
              <p className="text-muted-foreground">
                {selectedMemberIds.length === 1
                  ? 'You have been checked in'
                  : `${selectedMemberIds.length} people checked in`}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <Card className="w-full max-w-md bg-[#1A1A20] my-8">
        <CardHeader className="border-b border-border">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className={cn(
                "p-2 rounded-lg",
                SERVICE_TYPE_COLORS[service.serviceType].replace('text-', 'bg-') + '/20'
              )}>
                <ServiceIcon className={cn("h-5 w-5", SERVICE_TYPE_COLORS[service.serviceType])} />
              </div>
              <div>
                <CardTitle className="text-lg mb-1">{service.name}</CardTitle>
                <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Clock className="h-3 w-3" />
                    {service.startTime} - {service.endTime}
                  </div>
                  {service.location?.venue && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3 w-3" />
                      {service.location.venue}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {/* Primary Member - Always Selected */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4 text-[#1CE479]" />
              Select who is present
            </h3>
            
            <div className="bg-[#1CE479]/10 border-2 border-[#1CE479] rounded-lg p-4">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-[#1CE479] flex-shrink-0" />
                <div className="flex items-center gap-2 flex-1">
                  <div className="h-10 w-10 rounded-full bg-[#1CE479]/20 flex items-center justify-center">
                    <User className="h-5 w-5 text-[#1CE479]" />
                  </div>
                  <div>
                    <p className="font-medium">
                      {member.firstName} {member.lastName}
                    </p>
                    <p className="text-xs text-muted-foreground">You</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Family Members - Optional Selection */}
          {enableFamilyCheckIn && familyMembers.length > 0 && (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Select family members with you:
              </p>
              
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {familyMembers.map((familyMember) => {
                  const isSelected = selectedMemberIds.includes(familyMember.id);
                  const isChild = familyMember.dateOfBirth && 
                    new Date().getFullYear() - new Date(familyMember.dateOfBirth).getFullYear() < 18;
                  
                  return (
                    <button
                      key={familyMember.id}
                      onClick={() => handleToggleMember(familyMember.id)}
                      className={cn(
                        "w-full p-3 rounded-lg border-2 transition-all text-left flex items-center gap-3",
                        isSelected
                          ? "border-[#1CE479] bg-[#1CE479]/10"
                          : "border-border bg-background/50 hover:bg-background"
                      )}
                    >
                      <Checkbox
                        checked={isSelected}
                        className="pointer-events-none"
                      />
                      <div className="flex items-center gap-2 flex-1">
                        <div className={cn(
                          "h-10 w-10 rounded-full flex items-center justify-center",
                          isSelected ? "bg-[#1CE479]/20" : "bg-muted"
                        )}>
                          {isChild ? (
                            <Baby className="h-5 w-5" />
                          ) : (
                            <User className="h-5 w-5" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">
                            {familyMember.firstName} {familyMember.lastName}
                          </p>
                          {familyMember.dateOfBirth && (
                            <p className="text-xs text-muted-foreground">
                              Age: {new Date().getFullYear() - new Date(familyMember.dateOfBirth).getFullYear()}
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

          {/* Check-In Summary */}
          <div className="bg-background rounded-lg p-4 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Total checking in:</span>
              <span className="font-medium text-[#1CE479]">
                {selectedMemberIds.length} {selectedMemberIds.length === 1 ? 'person' : 'people'}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={handleCheckIn}
              disabled={isSubmitting || selectedMemberIds.length === 0}
              size="lg"
              className="flex-1 gap-2"
            >
              <CheckCircle2 className="h-5 w-5" />
              {isSubmitting ? 'Checking In...' : 'Check In'}
            </Button>
            <Button
              onClick={onClose}
              variant="outline"
              size="lg"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          </div>

          <p className="text-xs text-center text-muted-foreground">
            Please select everyone who is present today
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
