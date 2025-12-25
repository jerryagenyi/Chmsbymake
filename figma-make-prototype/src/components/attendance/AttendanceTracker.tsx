/**
 * ChurchAfrica ChMS - Attendance Tracker
 * Main attendance recording interface
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { ScrollArea } from '../ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { 
  Search,
  Users,
  CheckCircle2,
  Clock,
  XCircle,
  UserPlus,
  Download,
  Upload,
  Filter,
  TrendingUp,
  TrendingDown,
  Minus,
  QrCode,
  ScanLine
} from 'lucide-react';
import { Member } from '../../types/member';
import { Service, AttendanceRecord, AttendanceStatus, AttendanceStats } from '../../types/attendance';
import { MemberCheckIn } from './MemberCheckIn';
import { ServiceSelector } from './ServiceSelector';
import { AttendanceServiceSelector } from './AttendanceServiceSelector';
import { QRCodeScanner } from './QRCodeScanner';
import { cn } from '../ui/utils';

interface AttendanceTrackerProps {
  services: Service[];
  members: Member[];
  attendanceRecords: AttendanceRecord[];
  onCheckIn: (memberId: string, status: AttendanceStatus) => void;
  onBulkCheckIn?: (memberIds: string[], status: AttendanceStatus) => void;
  onCreateService?: () => void;
  onExport?: () => void;
  selectedServiceId?: string;
  onSelectService?: (service: Service) => void;
}

export function AttendanceTracker({
  services,
  members,
  attendanceRecords,
  onCheckIn,
  onBulkCheckIn,
  onCreateService,
  onExport,
  selectedServiceId: propSelectedServiceId,
  onSelectService,
}: AttendanceTrackerProps) {
  const [internalSelectedServiceId, setInternalSelectedServiceId] = React.useState<string>();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [filterStatus, setFilterStatus] = React.useState<'all' | 'checked-in' | 'not-checked-in'>('all');
  const [showQRScanner, setShowQRScanner] = React.useState(false);

  const selectedServiceId = propSelectedServiceId || internalSelectedServiceId;
  
  const handleSelectService = (service: Service) => {
    if (onSelectService) {
      onSelectService(service);
    } else {
      setInternalSelectedServiceId(service.id);
    }
  };

  const selectedService = services.find(s => s.id === selectedServiceId);

  // Filter attendance records for selected service
  const serviceAttendance = React.useMemo(() => {
    if (!selectedServiceId) return [];
    return attendanceRecords.filter(record => record.serviceId === selectedServiceId);
  }, [attendanceRecords, selectedServiceId]);

  // Create attendance lookup
  const attendanceByMember = React.useMemo(() => {
    const lookup: Record<string, AttendanceRecord> = {};
    serviceAttendance.forEach(record => {
      lookup[record.memberId] = record;
    });
    return lookup;
  }, [serviceAttendance]);

  // Calculate statistics
  const stats: AttendanceStats = React.useMemo(() => {
    const totalMembers = members.filter(m => m.status === 'active').length;
    const present = serviceAttendance.filter(r => r.status === 'present').length;
    const late = serviceAttendance.filter(r => r.status === 'late').length;
    const absent = serviceAttendance.filter(r => r.status === 'absent').length;
    const excused = serviceAttendance.filter(r => r.status === 'excused').length;
    const firstTimers = serviceAttendance.filter(r => r.isFirstTimer).length;
    const totalCheckedIn = present + late;
    
    return {
      serviceId: selectedServiceId || '',
      serviceName: selectedService?.name || '',
      serviceDate: selectedService?.date || '',
      totalExpected: totalMembers,
      totalPresent: present,
      totalAbsent: absent,
      totalLate: late,
      totalExcused: excused,
      attendanceRate: totalMembers > 0 ? Math.round((totalCheckedIn / totalMembers) * 100) : 0,
      byGender: { male: 0, female: 0, other: 0 },
      byAgeCategory: { children: 0, youth: 0, adults: 0, seniors: 0 },
      firstTimers,
      guests: serviceAttendance.filter(r => r.isGuest).length,
      newMembers: 0,
      onTimeCount: present,
      lateCount: late,
    };
  }, [serviceAttendance, members, selectedService, selectedServiceId]);

  // Filter members
  const filteredMembers = React.useMemo(() => {
    let filtered = members.filter(m => m.status === 'active' || m.status === 'visitor');
    
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(m => 
        `${m.firstName} ${m.lastName}`.toLowerCase().includes(query) ||
        m.contact.phone.toLowerCase().includes(query) ||
        m.membershipNumber?.toLowerCase().includes(query)
      );
    }
    
    // Status filter
    if (filterStatus === 'checked-in') {
      filtered = filtered.filter(m => {
        const attendance = attendanceByMember[m.id];
        return attendance?.status === 'present' || attendance?.status === 'late';
      });
    } else if (filterStatus === 'not-checked-in') {
      filtered = filtered.filter(m => {
        const attendance = attendanceByMember[m.id];
        return !attendance || attendance.status === 'absent';
      });
    }
    
    // Sort: not checked-in first
    return filtered.sort((a, b) => {
      const aChecked = attendanceByMember[a.id]?.status === 'present' || attendanceByMember[a.id]?.status === 'late';
      const bChecked = attendanceByMember[b.id]?.status === 'present' || attendanceByMember[b.id]?.status === 'late';
      if (aChecked === bChecked) return 0;
      return aChecked ? 1 : -1;
    });
  }, [members, searchQuery, filterStatus, attendanceByMember]);

  const getTrendIcon = () => {
    if (!stats.comparisonToPrevious) return <Minus className="h-4 w-4" />;
    if (stats.comparisonToPrevious.change > 0) return <TrendingUp className="h-4 w-4 text-success" />;
    if (stats.comparisonToPrevious.change < 0) return <TrendingDown className="h-4 w-4 text-destructive" />;
    return <Minus className="h-4 w-4" />;
  };

  // Handle QR scan success
  const handleQRScan = (data: { memberId: string; name: string; membershipNumber?: string }) => {
    console.log('QR Scanned:', data);
    onCheckIn(data.memberId, 'present');
    // Keep scanner open for next scan
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2>Attendance Tracking</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Record and monitor service attendance
          </p>
        </div>
        <div className="flex gap-2">
          {selectedServiceId && (
            <Button 
              variant="outline" 
              onClick={() => setShowQRScanner(true)} 
              className="gap-2"
            >
              <QrCode className="h-4 w-4" />
              QR Scan
            </Button>
          )}
          {onExport && selectedServiceId && (
            <Button variant="outline" onClick={onExport} className="gap-2">
              <Download className="h-4 w-4" />
              Export Report
            </Button>
          )}
        </div>
      </div>

      {/* Service Selection */}
      {!selectedServiceId && (
        <>
          {/* Enhanced Service Selector (NEW) */}
          <AttendanceServiceSelector
            services={services}
            selectedServiceId={selectedServiceId}
            onSelectService={handleSelectService}
            onCreateService={onCreateService}
          />
        </>
      )}

      {/* Attendance Interface */}
      {selectedServiceId && selectedService && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Stats & Actions */}
          <div className="lg:col-span-1 space-y-4">
            {/* Service Info Card */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-base">{selectedService.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {new Date(selectedService.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSelectService(selectedService)}
                  >
                    Change
                  </Button>
                </div>
              </CardHeader>
            </Card>

            {/* Stats Cards */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Attendance Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Progress Bar */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">Attendance Rate</span>
                    <span className="text-2xl font-bold">{stats.attendanceRate}%</span>
                  </div>
                  <Progress value={stats.attendanceRate} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1">
                    {stats.totalPresent + stats.totalLate} of {stats.totalExpected} members
                  </p>
                </div>

                {/* Stat Items */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-success/10 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <CheckCircle2 className="h-4 w-4 text-success" />
                      <span className="text-xs text-muted-foreground">Present</span>
                    </div>
                    <p className="text-2xl font-bold">{stats.totalPresent}</p>
                  </div>

                  <div className="bg-warning/10 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Clock className="h-4 w-4 text-warning" />
                      <span className="text-xs text-muted-foreground">Late</span>
                    </div>
                    <p className="text-2xl font-bold">{stats.totalLate}</p>
                  </div>

                  <div className="bg-muted rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <XCircle className="h-4 w-4 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">Absent</span>
                    </div>
                    <p className="text-2xl font-bold">{stats.totalAbsent}</p>
                  </div>

                  <div className="bg-info/10 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <UserPlus className="h-4 w-4 text-info" />
                      <span className="text-xs text-muted-foreground">First Timers</span>
                    </div>
                    <p className="text-2xl font-bold">{stats.firstTimers}</p>
                  </div>
                </div>

                {stats.comparisonToPrevious && (
                  <div className="pt-3 border-t">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">vs. Last Service</span>
                      <div className="flex items-center gap-1">
                        {getTrendIcon()}
                        <span className={cn(
                          "text-sm font-medium",
                          stats.comparisonToPrevious.change > 0 && "text-success",
                          stats.comparisonToPrevious.change < 0 && "text-destructive"
                        )}>
                          {stats.comparisonToPrevious.change > 0 && '+'}
                          {stats.comparisonToPrevious.change}%
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            {onBulkCheckIn && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2"
                    onClick={() => {
                      const uncheckedIds = filteredMembers
                        .filter(m => !attendanceByMember[m.id] || attendanceByMember[m.id].status === 'absent')
                        .map(m => m.id);
                      if (uncheckedIds.length > 0) {
                        onBulkCheckIn(uncheckedIds, 'present');
                      }
                    }}
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Mark All Present
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2"
                    onClick={() => {
                      const checkedIds = filteredMembers
                        .filter(m => attendanceByMember[m.id]?.status === 'present' || attendanceByMember[m.id]?.status === 'late')
                        .map(m => m.id);
                      if (checkedIds.length > 0) {
                        onBulkCheckIn(checkedIds, 'absent');
                      }
                    }}
                  >
                    <XCircle className="h-4 w-4" />
                    Clear All
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column: Member List */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="flex-1">
                    <CardTitle>Check-In Members</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {filteredMembers.length} {filteredMembers.length === 1 ? 'member' : 'members'}
                    </p>
                  </div>

                  <Tabs value={filterStatus} onValueChange={(v) => setFilterStatus(v as any)}>
                    <TabsList>
                      <TabsTrigger value="all">All</TabsTrigger>
                      <TabsTrigger value="checked-in">
                        Checked In
                        <Badge variant="secondary" className="ml-2">
                          {stats.totalPresent + stats.totalLate}
                        </Badge>
                      </TabsTrigger>
                      <TabsTrigger value="not-checked-in">
                        Pending
                        <Badge variant="secondary" className="ml-2">
                          {stats.totalExpected - (stats.totalPresent + stats.totalLate)}
                        </Badge>
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>

                {/* Search */}
                <div className="relative mt-4">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search members by name, phone, or membership #..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </CardHeader>

              <CardContent>
                <ScrollArea className="h-[600px] pr-4">
                  <div className="space-y-2">
                    {filteredMembers.length === 0 ? (
                      <div className="text-center py-12 text-muted-foreground">
                        <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p>No members found</p>
                      </div>
                    ) : (
                      filteredMembers.map(member => (
                        <MemberCheckIn
                          key={member.id}
                          member={member}
                          attendance={attendanceByMember[member.id]}
                          onCheckIn={onCheckIn}
                          compact
                        />
                      ))
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* QR Code Scanner Dialog */}
      <Dialog open={showQRScanner} onOpenChange={setShowQRScanner}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ScanLine className="h-5 w-5 text-primary" />
              QR Code Check-In
            </DialogTitle>
          </DialogHeader>
          <QRCodeScanner />
        </DialogContent>
      </Dialog>
    </div>
  );
}

/**
 * Vue Migration Notes:
 * 
 * Use Quasar's QSplitter for responsive layout:
 * 
 * <q-splitter v-model="splitterModel">
 *   <template v-slot:before>
 *     <!-- Stats panel -->
 *   </template>
 *   <template v-slot:after>
 *     <!-- Member check-in list -->
 *   </template>
 * </q-splitter>
 * 
 * Use QVirtualScroll for performance with large member lists:
 * 
 * <q-virtual-scroll
 *   :items="filteredMembers"
 *   virtual-scroll-item-size="80"
 * >
 *   <template v-slot="{ item }">
 *     <MemberCheckIn :member="item" />
 *   </template>
 * </q-virtual-scroll>
 */