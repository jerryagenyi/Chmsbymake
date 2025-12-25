/**
 * ChurchAfrica ChMS - Member Details Page
 * Full profile view with tabs for different information sections
 */

import React, { useState } from 'react';
import { Member } from '../../types/member';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Separator } from '../ui/separator';
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Users,
  Heart,
  MessageSquare,
  Edit,
  Trash2,
  Download,
  UserPlus,
  Activity,
  Gift,
  CheckCircle,
} from 'lucide-react';
import { cn } from '../ui/utils';

interface MemberDetailsProps {
  member: Member;
  onBack: () => void;
  onEdit?: (member: Member) => void;
  onDelete?: (member: Member) => void;
  onMessage?: (member: Member) => void;
}

export function MemberDetails({
  member,
  onBack,
  onEdit,
  onDelete,
  onMessage,
}: MemberDetailsProps) {
  const [activeTab, setActiveTab] = useState('overview');

  const initials = `${member.firstName[0]}${member.lastName[0]}`.toUpperCase();
  const fullName = `${member.firstName} ${member.lastName}`;

  const statusColors: Record<Member['status'], string> = {
    active: 'bg-success/10 text-success border-success/20',
    inactive: 'bg-muted text-muted-foreground border-border',
    visitor: 'bg-info/10 text-info border-info/20',
    alumni: 'bg-accent/10 text-accent border-accent/20',
  };

  const formatDate = (date?: string) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getAge = (dob?: string) => {
    if (!dob) return 'N/A';
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Members
        </Button>

        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => onMessage?.(member)} className="gap-2">
            <MessageSquare className="h-4 w-4" />
            Message
          </Button>
          <Button variant="outline" onClick={() => onEdit?.(member)} className="gap-2">
            <Edit className="h-4 w-4" />
            Edit
          </Button>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button
            variant="outline"
            onClick={() => onDelete?.(member)}
            className="gap-2 text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      {/* Profile Header Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Avatar and Basic Info */}
            <div className="flex flex-col items-center md:items-start gap-4">
              <Avatar className="h-32 w-32">
                <AvatarImage src={member.photo} alt={fullName} />
                <AvatarFallback className="bg-primary/10 text-primary text-3xl">
                  {initials}
                </AvatarFallback>
              </Avatar>

              <div className="flex flex-wrap justify-center md:justify-start gap-2">
                <Badge variant="outline" className={statusColors[member.status]}>
                  {member.status}
                </Badge>
                <Badge variant="outline" className="capitalize">
                  {member.gender}
                </Badge>
                {member.ministries && member.ministries.length > 0 && (
                  <Badge variant="secondary">
                    {member.ministries.length} Ministries
                  </Badge>
                )}
              </div>
            </div>

            {/* Main Info */}
            <div className="flex-1 space-y-4">
              <div>
                <h1 className="text-3xl mb-1">{fullName}</h1>
                <p className="text-muted-foreground">
                  Member #{member.membershipNumber || 'N/A'}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                {member.contact.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <a
                      href={`mailto:${member.contact.email}`}
                      className="text-primary hover:underline"
                    >
                      {member.contact.email}
                    </a>
                  </div>
                )}

                {member.contact.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <a
                      href={`tel:${member.contact.phone}`}
                      className="text-primary hover:underline"
                    >
                      {member.contact.phone}
                    </a>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>
                    Joined {formatDate(member.joinDate)}
                  </span>
                </div>

                {member.dateOfBirth && (
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {getAge(member.dateOfBirth)} years old
                    </span>
                  </div>
                )}

                {member.contact.address && (
                  <div className="flex items-center gap-2 md:col-span-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {member.contact.address.street && `${member.contact.address.street}, `}
                      {member.contact.address.city}, {member.contact.address.state}{' '}
                      {member.contact.address.zipCode}
                      {member.contact.address.country && `, ${member.contact.address.country}`}
                    </span>
                  </div>
                )}
              </div>

              {/* Quick Stats */}
              <div className="flex gap-6 pt-4">
                {member.attendancePercentage !== undefined && (
                  <div className="text-center">
                    <div className="flex items-center gap-1 text-2xl text-primary">
                      <Heart className="h-5 w-5" />
                      {member.attendancePercentage}%
                    </div>
                    <div className="text-xs text-muted-foreground">Attendance</div>
                  </div>
                )}

                {member.ministries && (
                  <div className="text-center">
                    <div className="text-2xl text-primary">
                      {member.ministries.length}
                    </div>
                    <div className="text-xs text-muted-foreground">Ministries</div>
                  </div>
                )}

                <div className="text-center">
                  <div className="text-2xl text-primary">
                    {member.status === 'active' ? <CheckCircle className="h-6 w-6" /> : '—'}
                  </div>
                  <div className="text-xs text-muted-foreground">Status</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full justify-start">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="family">Family</TabsTrigger>
          <TabsTrigger value="ministries">Ministries</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="giving">Giving</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <div className="text-muted-foreground">Full Name</div>
                  <div>{fullName}</div>
                </div>
                <Separator />
                <div>
                  <div className="text-muted-foreground">Date of Birth</div>
                  <div>
                    {formatDate(member.dateOfBirth)}
                    {member.dateOfBirth && ` (${getAge(member.dateOfBirth)} years old)`}
                  </div>
                </div>
                <Separator />
                <div>
                  <div className="text-muted-foreground">Gender</div>
                  <div className="capitalize">{member.gender}</div>
                </div>
                <Separator />
                <div>
                  <div className="text-muted-foreground">Marital Status</div>
                  <div className="capitalize">{member.maritalStatus || 'Not specified'}</div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <div className="text-muted-foreground">Email</div>
                  <div>
                    {member.contact.email ? (
                      <a
                        href={`mailto:${member.contact.email}`}
                        className="text-primary hover:underline"
                      >
                        {member.contact.email}
                      </a>
                    ) : (
                      'Not provided'
                    )}
                  </div>
                </div>
                <Separator />
                <div>
                  <div className="text-muted-foreground">Phone</div>
                  <div>
                    {member.contact.phone ? (
                      <a
                        href={`tel:${member.contact.phone}`}
                        className="text-primary hover:underline"
                      >
                        {member.contact.phone}
                      </a>
                    ) : (
                      'Not provided'
                    )}
                  </div>
                </div>
                <Separator />
                <div>
                  <div className="text-muted-foreground">Address</div>
                  <div>
                    {member.contact.address ? (
                      <>
                        {member.contact.address.street && (
                          <>
                            {member.contact.address.street}
                            <br />
                          </>
                        )}
                        {member.contact.address.city}, {member.contact.address.state}{' '}
                        {member.contact.address.zipCode}
                        {member.contact.address.country && (
                          <>
                            <br />
                            {member.contact.address.country}
                          </>
                        )}
                      </>
                    ) : (
                      'Not provided'
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Membership Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Membership Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <div className="text-muted-foreground">Membership Number</div>
                  <div>{member.membershipNumber || 'Not assigned'}</div>
                </div>
                <Separator />
                <div>
                  <div className="text-muted-foreground">Join Date</div>
                  <div>{formatDate(member.joinDate)}</div>
                </div>
                <Separator />
                <div>
                  <div className="text-muted-foreground">Status</div>
                  <div>
                    <Badge variant="outline" className={statusColors[member.status]}>
                      {member.status}
                    </Badge>
                  </div>
                </div>
                <Separator />
                <div>
                  <div className="text-muted-foreground">Notes</div>
                  <div className="text-muted-foreground italic">
                    {member.notes || 'No notes added'}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Ministry Involvement */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Ministry Involvement
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                {member.ministries && member.ministries.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {member.ministries.map((ministry, index) => (
                      <Badge key={index} variant="secondary">
                        {typeof ministry === 'string' ? ministry : ministry.name || 'Unknown Ministry'}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <div className="text-muted-foreground italic">
                    Not involved in any ministries yet
                  </div>
                )}
                <Separator />
                <div>
                  <div className="text-muted-foreground">Attendance Rate</div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-success"
                        style={{ width: `${member.attendancePercentage || 0}%` }}
                      />
                    </div>
                    <span>{member.attendancePercentage || 0}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Family Tab */}
        <TabsContent value="family">
          <Card>
            <CardHeader>
              <CardTitle>Family Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center text-muted-foreground py-8">
                Family information will be displayed here
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Ministries Tab */}
        <TabsContent value="ministries">
          <Card>
            <CardHeader>
              <CardTitle>Ministry Participation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center text-muted-foreground py-8">
                Detailed ministry participation history will be displayed here
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Attendance Tab */}
        <TabsContent value="attendance">
          <Card>
            <CardHeader>
              <CardTitle>Attendance History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center text-muted-foreground py-8">
                Attendance records and statistics will be displayed here
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Giving Tab */}
        <TabsContent value="giving">
          <Card>
            <CardHeader>
              <CardTitle>Giving History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center text-muted-foreground py-8">
                Donation history and giving patterns will be displayed here
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Activity Tab */}
        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>Activity Log</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center text-muted-foreground py-8">
                Member activity timeline will be displayed here
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}