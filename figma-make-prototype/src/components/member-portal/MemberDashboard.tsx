import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import {
  User,
  Calendar,
  DollarSign,
  QrCode,
  Settings,
  LogOut,
  Edit,
  Camera,
  CheckCircle2,
  Clock,
  TrendingUp,
  Heart,
  Users,
  Award,
  Download
} from 'lucide-react';
import { Member } from '../../types/member';
import { AttendanceRecord } from '../../types/attendance';
import { Donation } from '../../types/giving';
import { useOrganization } from '../../contexts/OrganizationContext';
import { ChurchLogo } from '../organization/ChurchLogo';

interface MemberDashboardProps {
  member: Member;
  attendanceRecords: AttendanceRecord[];
  donations: Donation[];
  onLogout: () => void;
  onEditProfile: () => void;
  onGenerateQR: () => void;
  onCheckIn: () => void;
}

export const MemberDashboard: React.FC<MemberDashboardProps> = ({
  member,
  attendanceRecords,
  donations,
  onLogout,
  onEditProfile,
  onGenerateQR,
  onCheckIn,
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const { organization } = useOrganization();

  const initials = `${member.firstName[0]}${member.lastName[0]}`.toUpperCase();
  const fullName = `${member.firstName} ${member.lastName}`;

  // Calculate stats
  const totalAttendance = attendanceRecords.filter(r => r.member_id === member.id).length;
  const thisMonthAttendance = attendanceRecords.filter(r => {
    const recordDate = new Date(r.check_in_time);
    const now = new Date();
    return recordDate.getMonth() === now.getMonth() && 
           recordDate.getFullYear() === now.getFullYear() &&
           r.member_id === member.id;
  }).length;

  const totalGiving = donations
    .filter(d => d.donor_id === member.id)
    .reduce((sum, d) => sum + d.amount, 0);

  const thisMonthGiving = donations
    .filter(d => {
      const donationDate = new Date(d.date);
      const now = new Date();
      return donationDate.getMonth() === now.getMonth() && 
             donationDate.getFullYear() === now.getFullYear() &&
             d.donor_id === member.id;
    })
    .reduce((sum, d) => sum + d.amount, 0);

  const attendanceRate = (totalAttendance / 52) * 100; // Assuming 52 weeks in a year

  return (
    <div className="min-h-screen bg-[#0A0A0F]">
      {/* Top Bar with Church Logo */}
      <div className="bg-[#1A1A20] border-b border-[#2A2A30] px-4 md:px-6 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ChurchLogo size="sm" />
            <div>
              <p className="text-white text-sm">{organization.name}</p>
              <p className="text-gray-500 text-xs">Member Portal</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onLogout}
            className="text-gray-400 hover:text-white"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 md:p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl text-white mb-1">Welcome back, {member.firstName}!</h1>
              <p className="text-gray-400">Manage your church profile and activities</p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={onCheckIn}
                className="bg-[#1CE479] text-[#0A0A0F] hover:bg-[#1CE479]/90"
              >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Quick Check-In
              </Button>
            </div>
          </div>

          {/* Profile Card */}
          <Card className="bg-[#1A1A20] border-[#2A2A30]">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Avatar */}
                <div className="flex flex-col items-center gap-3">
                  <div className="relative">
                    <Avatar className="w-24 h-24 border-2 border-[#1CE479]">
                      <AvatarImage src={member.photo} alt={fullName} />
                      <AvatarFallback className="bg-[#1CE479]/20 text-[#1CE479] text-2xl">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <Button
                      size="sm"
                      className="absolute bottom-0 right-0 h-8 w-8 rounded-full p-0 bg-[#1CE479] hover:bg-[#1CE479]/90"
                      onClick={onEditProfile}
                    >
                      <Camera className="w-4 h-4 text-[#0A0A0F]" />
                    </Button>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onGenerateQR}
                    className="border-[#1CE479] text-[#1CE479] hover:bg-[#1CE479]/10"
                  >
                    <QrCode className="w-4 h-4 mr-2" />
                    My QR Code
                  </Button>
                </div>

                {/* Info */}
                <div className="flex-1 space-y-4">
                  <div>
                    <h2 className="text-xl text-white mb-1">{fullName}</h2>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="bg-[#1CE479]/10 text-[#1CE479] border-[#1CE479]/20">
                        {member.membershipNumber || 'No ID'}
                      </Badge>
                      <Badge variant="outline" className="capitalize">
                        {member.status}
                      </Badge>
                      {member.groups?.some(g => g.name.toLowerCase() === 'leaders') && (
                        <Badge variant="outline" className="bg-purple-500/10 text-purple-400">
                          <Award className="w-3 h-3 mr-1" />
                          Leader
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <div className="text-gray-500 mb-1">Phone</div>
                      <div className="text-white">{member.contact.phone || 'Not set'}</div>
                    </div>
                    <div>
                      <div className="text-gray-500 mb-1">Email</div>
                      <div className="text-white truncate">{member.contact.email || 'Not set'}</div>
                    </div>
                    <div>
                      <div className="text-gray-500 mb-1">Date of Birth</div>
                      <div className="text-white">
                        {member.dateOfBirth ? new Date(member.dateOfBirth).toLocaleDateString() : 'Not set'}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-500 mb-1">Gender</div>
                      <div className="text-white capitalize">{member.gender || 'Not set'}</div>
                    </div>
                    <div>
                      <div className="text-gray-500 mb-1">Member Since</div>
                      <div className="text-white">
                        {new Date(member.joinDate).toLocaleDateString()}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-500 mb-1">Groups</div>
                      <div className="text-white">{member.groups.length} groups</div>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onEditProfile}
                    className="border-[#2A2A30] hover:border-[#1CE479]"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-[#1A1A20] border-[#2A2A30]">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Total Attendance</p>
                    <p className="text-3xl text-white">{totalAttendance}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-blue-400" />
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <TrendingUp className="w-4 h-4 text-[#1CE479]" />
                  <span>{thisMonthAttendance} this month</span>
                </div>
                <Progress value={attendanceRate} className="mt-3 h-2 bg-[#2A2A30]" />
                <p className="text-xs text-gray-500 mt-2">{attendanceRate.toFixed(0)}% attendance rate</p>
              </CardContent>
            </Card>

            <Card className="bg-[#1A1A20] border-[#2A2A30]">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Total Giving</p>
                    <p className="text-3xl text-white">₦{totalGiving.toLocaleString()}</p>
                  </div>
                  <div className="w-12 h-12 bg-[#1CE479]/10 rounded-full flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-[#1CE479]" />
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Heart className="w-4 h-4 text-[#1CE479]" />
                  <span>₦{thisMonthGiving.toLocaleString()} this month</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-3 border-[#2A2A30] hover:border-[#1CE479]"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Statement
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-[#1A1A20] border-[#2A2A30]">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">My Groups</p>
                    <p className="text-3xl text-white">{member.groups.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-500/10 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-purple-400" />
                  </div>
                </div>
                <div className="space-y-1">
                  {member.groups.slice(0, 3).map((group, idx) => (
                    <div key={idx} className="text-sm text-gray-400 capitalize">
                      • {group.name.replace('-', ' ')}
                    </div>
                  ))}
                  {member.groups.length > 3 && (
                    <div className="text-sm text-gray-500">+{member.groups.length - 3} more</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Info Tabs */}
          <Card className="bg-[#1A1A20] border-[#2A2A30]">
            <CardHeader>
              <CardTitle className="text-white">My Church Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="w-full bg-[#0A0A0F]">
                  <TabsTrigger value="overview" className="flex-1">Overview</TabsTrigger>
                  <TabsTrigger value="attendance" className="flex-1">Attendance</TabsTrigger>
                  <TabsTrigger value="giving" className="flex-1">Giving</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4 mt-6">
                  <div className="space-y-3">
                    <h3 className="text-white">Recent Activity</h3>
                    {attendanceRecords.slice(0, 5).map((record, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-[#0A0A0F] rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-[#1CE479]/10 rounded-full flex items-center justify-center">
                            <CheckCircle2 className="w-5 h-5 text-[#1CE479]" />
                          </div>
                          <div>
                            <p className="text-white text-sm">Checked In</p>
                            <p className="text-gray-500 text-xs">
                              {new Date(record.check_in_time).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {record.service_id}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="attendance" className="mt-6">
                  <div className="space-y-3">
                    {attendanceRecords.length === 0 ? (
                      <div className="text-center py-12 text-gray-400">
                        <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p>No attendance records yet</p>
                      </div>
                    ) : (
                      attendanceRecords.map((record, idx) => (
                        <div key={idx} className="flex items-center justify-between p-4 bg-[#0A0A0F] rounded-lg">
                          <div>
                            <p className="text-white">{record.service_id}</p>
                            <p className="text-gray-400 text-sm">
                              {new Date(record.check_in_time).toLocaleString()}
                            </p>
                          </div>
                          <Badge variant="outline" className="capitalize bg-[#1CE479]/10 text-[#1CE479]">
                            {record.status}
                          </Badge>
                        </div>
                      ))
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="giving" className="mt-6">
                  <div className="space-y-3">
                    {donations.length === 0 ? (
                      <div className="text-center py-12 text-gray-400">
                        <Heart className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p>No giving records yet</p>
                      </div>
                    ) : (
                      donations.map((donation, idx) => (
                        <div key={idx} className="flex items-center justify-between p-4 bg-[#0A0A0F] rounded-lg">
                          <div>
                            <p className="text-white">₦{donation.amount.toLocaleString()}</p>
                            <p className="text-gray-400 text-sm capitalize">{donation.type}</p>
                            <p className="text-gray-500 text-xs">
                              {new Date(donation.date).toLocaleDateString()}
                            </p>
                          </div>
                          <Badge variant="outline" className="capitalize">
                            {donation.method}
                          </Badge>
                        </div>
                      ))
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};