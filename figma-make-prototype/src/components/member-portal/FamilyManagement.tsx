import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import {
  Users,
  UserPlus,
  Heart,
  Baby,
  Trash2,
  Edit,
  QrCode,
  Crown,
  AlertCircle,
  CheckCircle2,
  X
} from 'lucide-react';
import { Member } from '../../types/member';

interface FamilyMember {
  id: string;
  name: string;
  relationship: 'spouse' | 'child' | 'parent' | 'sibling' | 'other';
  photo?: string;
  dateOfBirth?: string;
  memberId?: string; // If they're also a church member
}

interface FamilyManagementProps {
  member: Member;
  familyMembers: FamilyMember[];
  onAddMember: (member: Omit<FamilyMember, 'id'>) => Promise<void>;
  onRemoveMember: (memberId: string) => Promise<void>;
  onSetPrimaryContact: (memberId: string) => Promise<void>;
  onGenerateFamilyQR?: () => void;
}

export const FamilyManagement: React.FC<FamilyManagementProps> = ({
  member,
  familyMembers,
  onAddMember,
  onRemoveMember,
  onSetPrimaryContact,
  onGenerateFamilyQR,
}) => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [name, setName] = useState('');
  const [relationship, setRelationship] = useState<FamilyMember['relationship']>('child');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [memberId, setMemberId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleAddMember = async () => {
    if (!name.trim()) {
      setError('Please enter a name');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await onAddMember({
        name,
        relationship,
        dateOfBirth: dateOfBirth || undefined,
        memberId: memberId || undefined,
      });

      setSuccess('Family member added successfully!');
      setName('');
      setDateOfBirth('');
      setMemberId('');
      setShowAddDialog(false);

      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to add family member');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (id: string, name: string) => {
    if (!confirm(`Remove ${name} from your family?`)) return;

    try {
      await onRemoveMember(id);
      setSuccess('Family member removed');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to remove family member');
    }
  };

  const getRelationshipIcon = (relationship: string) => {
    switch (relationship) {
      case 'spouse':
        return <Heart className="w-4 h-4" />;
      case 'child':
        return <Baby className="w-4 h-4" />;
      case 'parent':
        return <Crown className="w-4 h-4" />;
      default:
        return <Users className="w-4 h-4" />;
    }
  };

  const getRelationshipColor = (relationship: string) => {
    switch (relationship) {
      case 'spouse':
        return 'bg-pink-500/10 text-pink-400 border-pink-500/20';
      case 'child':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'parent':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      default:
        return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  const spouseCount = familyMembers.filter(m => m.relationship === 'spouse').length;
  const childrenCount = familyMembers.filter(m => m.relationship === 'child').length;

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card className="bg-[#1A1A20] border-[#2A2A30]">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white flex items-center gap-2">
                <Users className="w-6 h-6 text-[#1CE479]" />
                Family Management
              </CardTitle>
              <CardDescription className="text-gray-400">
                Manage your family members and connections
              </CardDescription>
            </div>
            <Badge variant="outline" className="bg-[#1CE479]/10 text-[#1CE479] border-[#1CE479]/20">
              {familyMembers.length} members
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
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

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-[#0A0A0F] rounded-lg border border-[#2A2A30]">
              <div className="text-center">
                <Users className="w-6 h-6 text-[#1CE479] mx-auto mb-2" />
                <p className="text-2xl text-white">{familyMembers.length}</p>
                <p className="text-xs text-gray-400">Total</p>
              </div>
            </div>
            <div className="p-4 bg-[#0A0A0F] rounded-lg border border-[#2A2A30]">
              <div className="text-center">
                <Heart className="w-6 h-6 text-pink-400 mx-auto mb-2" />
                <p className="text-2xl text-white">{spouseCount}</p>
                <p className="text-xs text-gray-400">Spouse</p>
              </div>
            </div>
            <div className="p-4 bg-[#0A0A0F] rounded-lg border border-[#2A2A30]">
              <div className="text-center">
                <Baby className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                <p className="text-2xl text-white">{childrenCount}</p>
                <p className="text-xs text-gray-400">Children</p>
              </div>
            </div>
            <div className="p-4 bg-[#0A0A0F] rounded-lg border border-[#2A2A30]">
              <div className="text-center">
                <Crown className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                <p className="text-2xl text-white">1</p>
                <p className="text-xs text-gray-400">Primary</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
              <DialogTrigger asChild>
                <Button className="bg-[#1CE479] text-[#0A0A0F] hover:bg-[#1CE479]/90">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Add Family Member
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-[#1A1A20] border-[#2A2A30]">
                <DialogHeader>
                  <DialogTitle className="text-white">Add Family Member</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-gray-300">
                      Full Name *
                    </Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="John Doe"
                      className="bg-[#0A0A0F] border-[#2A2A30] text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="relationship" className="text-gray-300">
                      Relationship *
                    </Label>
                    <Select value={relationship} onValueChange={(v) => setRelationship(v as any)}>
                      <SelectTrigger className="bg-[#0A0A0F] border-[#2A2A30] text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="spouse">Spouse</SelectItem>
                        <SelectItem value="child">Child</SelectItem>
                        <SelectItem value="parent">Parent</SelectItem>
                        <SelectItem value="sibling">Sibling</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth" className="text-gray-300">
                      Date of Birth (Optional)
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
                    <Label htmlFor="memberId" className="text-gray-300">
                      Member ID (If they're a church member)
                    </Label>
                    <Input
                      id="memberId"
                      value={memberId}
                      onChange={(e) => setMemberId(e.target.value)}
                      placeholder="MEM-2024-001"
                      className="bg-[#0A0A0F] border-[#2A2A30] text-white"
                    />
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => setShowAddDialog(false)}
                      className="flex-1 border-[#2A2A30]"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                    <Button
                      onClick={handleAddMember}
                      disabled={loading}
                      className="flex-1 bg-[#1CE479] text-[#0A0A0F] hover:bg-[#1CE479]/90"
                    >
                      <UserPlus className="w-4 h-4 mr-2" />
                      Add Member
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            {onGenerateFamilyQR && (
              <Button
                variant="outline"
                onClick={onGenerateFamilyQR}
                className="border-[#2A2A30] hover:border-[#1CE479]"
              >
                <QrCode className="w-4 h-4 mr-2" />
                Family QR Code
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Family Members List */}
      <div className="space-y-3">
        {familyMembers.length === 0 ? (
          <Card className="bg-[#1A1A20] border-[#2A2A30]">
            <CardContent className="py-12">
              <div className="text-center text-gray-400">
                <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No family members added yet</p>
                <p className="text-sm mt-1">Click "Add Family Member" to get started</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          familyMembers.map((familyMember) => {
            const initials = familyMember.name
              .split(' ')
              .map((n) => n[0])
              .join('')
              .toUpperCase();

            return (
              <Card key={familyMember.id} className="bg-[#1A1A20] border-[#2A2A30]">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Avatar className="w-14 h-14 border-2 border-[#2A2A30]">
                        <AvatarImage src={familyMember.photo} alt={familyMember.name} />
                        <AvatarFallback className="bg-[#1CE479]/20 text-[#1CE479]">
                          {initials}
                        </AvatarFallback>
                      </Avatar>

                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-white">{familyMember.name}</h3>
                          <Badge
                            variant="outline"
                            className={getRelationshipColor(familyMember.relationship)}
                          >
                            {getRelationshipIcon(familyMember.relationship)}
                            <span className="ml-1 capitalize">{familyMember.relationship}</span>
                          </Badge>
                          {familyMember.memberId && (
                            <Badge variant="outline" className="text-xs">
                              Member
                            </Badge>
                          )}
                        </div>

                        <div className="text-sm text-gray-400 space-y-0.5">
                          {familyMember.dateOfBirth && (
                            <p>
                              Born: {new Date(familyMember.dateOfBirth).toLocaleDateString()}
                            </p>
                          )}
                          {familyMember.memberId && (
                            <p>Member ID: {familyMember.memberId}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onSetPrimaryContact(familyMember.id)}
                        className="border-[#2A2A30] hover:border-[#1CE479]"
                      >
                        <Crown className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemove(familyMember.id, familyMember.name)}
                        className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Info Card */}
      <Card className="bg-[#1A1A20] border-[#2A2A30]">
        <CardContent className="pt-6">
          <div className="space-y-2">
            <h3 className="text-white flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-[#1CE479]" />
              About Family Management
            </h3>
            <ul className="text-sm text-gray-400 space-y-1 ml-7">
              <li>• Link family members for easier management</li>
              <li>• Generate a family QR code for group check-ins</li>
              <li>• Set a primary contact for family communications</li>
              <li>• Track family attendance together</li>
              <li>• Members linked by ID can manage their own profiles</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
