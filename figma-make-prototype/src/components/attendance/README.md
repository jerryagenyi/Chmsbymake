# ChurchAfrica ChMS - Attendance Tracking System

## Overview

The Attendance Tracking System provides a comprehensive solution for recording and monitoring church service attendance with real-time statistics, QR code check-in, multiple service support, and Africa-First design optimizations for offline use and low-bandwidth environments.

## Key Features

🎯 **Quick Check-In**
- Manual check-in with status selection (Present/Late/Absent/Excused)
- QR code scanning for instant contactless check-in
- Bulk actions (Mark All Present, Clear All)
- Real-time statistics updates

📱 **QR Code System**
- Individual member QR code generation
- Download, Print, and Share QR codes
- QR scanner with camera support
- Upload QR image option (no camera needed)
- Offline-ready QR codes

📊 **Analytics**
- Live attendance rate calculation
- Visual stat cards (Present, Late, Absent, First Timers)
- Service comparison and trends
- Searchable member list

🌍 **Africa-First Design**
- Offline-first QR codes (no internet after generation)
- Low-bandwidth optimized
- SMS check-in ready (future)
- Works on low-end devices

## Components

### 1. **AttendanceTracker** (`AttendanceTracker.tsx`)
Main container component that orchestrates all attendance tracking functionality.

**Features:**
- Service selection interface
- Real-time attendance statistics dashboard
- Member check-in list with search
- Bulk check-in actions
- Filter tabs (All/Checked In/Pending)
- Export functionality
- Responsive 3-column layout

**Props:**
```typescript
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
```

### 2. **ServiceSelector** (`ServiceSelector.tsx`)
Service selection component with date grouping.

**Features:**
- Services grouped by date
- Relative date labels (Today, Yesterday)
- Service type badges with color coding
- Time, location, and expected attendance display
- Create new service button
- Empty state handling

**Props:**
```typescript
interface ServiceSelectorProps {
  services: Service[];
  selectedServiceId?: string;
  onSelectService: (service: Service) => void;
  onCreateService?: () => void;
}
```

### 3. **MemberCheckIn** (`MemberCheckIn.tsx`)
Individual member check-in card component.

**Features:**
- Avatar with fallback initials
- Member name and membership number
- Status badge (Present, Late, Absent, Excused)
- Check-in time display
- Attendance rate and ministry count
- Quick action buttons (Check/Clock/X)
- Visitor badge
- Compact mode option

**Props:**
```typescript
interface MemberCheckInProps {
  member: Member;
  attendance?: AttendanceRecord;
  onCheckIn: (memberId: string, status: AttendanceStatus) => void;
  disabled?: boolean;
  compact?: boolean;
}
```

### 4. **QRCodeGenerator** (`QRCodeGenerator.tsx`)
Generate QR codes for individual members.

**Features:**
- High-quality QR code generation using `qrcode` library
- Member info display (avatar, name, membership #)
- Download QR as PNG image
- Print QR with member details
- Share QR via native share API
- Copy QR data to clipboard
- Customizable size (default 200px)
- White background for better scanning

**Props:**
```typescript
interface QRCodeGeneratorProps {
  member: Member;
  size?: number;
  showActions?: boolean;
  className?: string;
}
```

**QR Code Data Format:**
```json
{
  "type": "member-checkin",
  "memberId": "1",
  "name": "Adewale Okonkwo",
  "membershipNumber": "CA-2020-001",
  "timestamp": 1698345600000
}
```

### 5. **QRCodeScanner** (`QRCodeScanner.tsx`)
Scan member QR codes using device camera or uploaded images.

**Features:**
- Live camera feed with auto-scanning
- Front/back camera toggle
- Scanning overlay with visual feedback
- Success/error alerts
- Upload QR image option (fallback for no camera)
- Auto-close after successful scan
- Success sound notification
- Uses `jsqr` library for decoding

**Props:**
```typescript
interface QRCodeScannerProps {
  onScanSuccess: (data: {
    memberId: string;
    name: string;
    membershipNumber?: string;
  }) => void;
  onScanError?: (error: string) => void;
  isActive?: boolean;
  className?: string;
}
```

### 6. **MemberQRCodes** (`MemberQRCodes.tsx`)
Manage and view QR codes for all members.

**Features:**
- Grid/List view toggle
- Search members
- Click to view full QR code
- Bulk download all QR codes
- Bulk print all QR codes
- Shows only active members
- Member count badge
- Opens individual QR in dialog

**Props:**
```typescript
interface MemberQRCodesProps {
  members: Member[];
  className?: string;
}
```

## Data Types

### **Service Type**
```typescript
interface Service {
  id: string;
  name: string;
  type: ServiceType;
  date: string; // ISO date (YYYY-MM-DD)
  startTime: string; // HH:mm format
  endTime?: string;
  location?: string;
  expectedAttendance?: number;
  notes?: string;
  isActive: boolean;
  createdAt: string;
  createdBy?: string;
}
```

### **AttendanceRecord Type**
```typescript
interface AttendanceRecord {
  id: string;
  serviceId: string;
  memberId: string;
  status: AttendanceStatus;
  checkInTime?: string; // ISO datetime
  checkOutTime?: string;
  checkInMethod: CheckInMethod;
  memberName?: string;
  memberPhoto?: string;
  membershipNumber?: string;
  isFirstTimer?: boolean;
  isGuest?: boolean;
  notes?: string;
  recordedBy?: string;
  createdAt: string;
  updatedAt: string;
}
```

### **AttendanceStats Type**
```typescript
interface AttendanceStats {
  serviceId: string;
  serviceName: string;
  serviceDate: string;
  totalExpected?: number;
  totalPresent: number;
  totalAbsent: number;
  totalLate: number;
  totalExcused: number;
  attendanceRate: number; // Percentage
  byGender: { male: number; female: number; other: number };
  byAgeCategory: { children: number; youth: number; adults: number; seniors: number };
  firstTimers: number;
  guests: number;
  newMembers: number;
  onTimeCount: number;
  lateCount: number;
  comparisonToPrevious?: {
    change: number;
    previousCount: number;
  };
}
```

### **Enums**
```typescript
type ServiceType = 'sunday_first' | 'sunday_second' | 'midweek' | 'prayer' | 'special' | 'youth' | 'children';
type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused';
type CheckInMethod = 'manual' | 'qr_code' | 'sms' | 'app' | 'nfc';
```

## Usage Examples

### Basic Implementation
```typescript
import { AttendanceTracker } from './components/attendance';
import { mockServices, mockMembers, mockAttendanceRecords } from './lib/mock-data';

function AttendancePage() {
  const [records, setRecords] = React.useState(mockAttendanceRecords);
  
  const handleCheckIn = (memberId: string, status: AttendanceStatus) => {
    // Create or update attendance record
    const newRecord = {
      id: `a${Date.now()}`,
      serviceId: selectedServiceId,
      memberId,
      status,
      checkInTime: new Date().toISOString(),
      checkInMethod: 'manual',
      // ... other fields
    };
    setRecords([...records, newRecord]);
  };
  
  return (
    <AttendanceTracker
      services={mockServices}
      members={mockMembers}
      attendanceRecords={records}
      onCheckIn={handleCheckIn}
    />
  );
}
```

### With Backend Integration
```typescript
import { AttendanceTracker } from './components/attendance';
import { useAttendanceStore } from './stores/attendanceStore';

function AttendancePage() {
  const { 
    services, 
    members, 
    attendanceRecords,
    checkIn,
    bulkCheckIn,
    createService,
    exportReport 
  } = useAttendanceStore();
  
  return (
    <AttendanceTracker
      services={services}
      members={members}
      attendanceRecords={attendanceRecords}
      onCheckIn={async (memberId, status) => {
        await checkIn(selectedServiceId, memberId, status);
      }}
      onBulkCheckIn={async (memberIds, status) => {
        await bulkCheckIn(selectedServiceId, memberIds, status);
      }}
      onCreateService={() => router.push('/services/new')}
      onExport={() => exportReport(selectedServiceId)}
    />
  );
}
```

## Service Types

### Predefined Service Types

| Type | Label | Use Case |
|------|-------|----------|
| `sunday_first` | Sunday 1st Service | Early morning service |
| `sunday_second` | Sunday 2nd Service | Late morning service |
| `midweek` | Midweek Service | Wednesday Bible study |
| `prayer` | Prayer Meeting | Prayer services |
| `special` | Special Service | Conferences, crusades |
| `youth` | Youth Service | Youth gatherings |
| `children` | Children's Service | Kids programs |

### Service Type Colors

```typescript
const SERVICE_TYPE_COLORS = {
  sunday_first: 'primary',
  sunday_second: 'primary',
  midweek: 'info',
  prayer: 'accent',
  special: 'warning',
  youth: 'success',
  children: 'pink',
};
```

## Check-In Methods

### Supported Check-In Methods

1. **Manual** - Default method, receptionist check-in
2. **QR Code** - Member scans personal QR code (✅ Implemented)
3. **SMS** - Check-in via SMS confirmation (Future)
4. **App** - Mobile app check-in (Future)
5. **NFC** - Near-field communication tap (Future)

## QR Code System

### How It Works

1. **Generate QR Codes**
   - Navigate to Attendance → QR Codes
   - Each active member gets a unique QR code
   - QR contains: member ID, name, membership #, timestamp
   - Download individual or bulk download all

2. **Distribute to Members**
   - Print QR codes on member cards
   - Email/SMS QR code to members
   - Share via WhatsApp/Telegram
   - Members save to phone wallet/photos

3. **Check-In Process**
   - Receptionist clicks "QR Scan" button
   - Member presents QR code (phone or card)
   - System auto-checks in member as "Present"
   - Success notification shown
   - Stats update instantly

### QR Code Benefits

✅ **Speed**
- Check-in takes 1-2 seconds vs 10-20 seconds manual
- No typing needed
- No searching through lists
- Perfect for large congregations (1000+ members)

✅ **Accuracy**
- Zero typos or wrong selections
- Member ID directly encoded
- Prevents duplicate check-ins

✅ **Offline-First**
- QR codes work without internet
- Generated once, usable forever
- No server required for scanning
- Perfect for rural/low-connectivity areas

✅ **Low-Bandwidth**
- Minimal data transfer
- Only member ID sent to server
- Works on 2G networks

✅ **Accessibility**
- Works on any smartphone
- No special app required
- Can use printed cards for elderly

### QR Code Specification

**Format:** JSON string
```json
{
  "type": "member-checkin",
  "memberId": "unique-id",
  "name": "Full Name",
  "membershipNumber": "CA-2020-001",
  "timestamp": 1698345600000
}
```

**Size:** 200x200px (default), scalable to 256x256px for printing

**Error Correction:** Medium (M level)
- Can tolerate up to 15% damage
- Readable even with minor scratches/dirt

**Colors:**
- Dark: #0A0A0F (matches theme)
- Light: #FFFFFF (white background)

### Printing QR Codes

**Single Member Card Template:**
```
┌─────────────────────────┐
│  ChurchAfrica ChMS      │
│                         │
│   [QR CODE 200x200]     │
│                         │
│   Adewale Okonkwo       │
│   CA-2020-001           │
│                         │
│  Scan for quick check-in│
└─────────────────────────┘
```

**Recommended Sizes:**
- Business card: 3.5" x 2" (QR: 1" x 1")
- Badge/Lanyard: 4" x 3" (QR: 1.5" x 1.5")
- Phone wallet card: 2" x 3" (QR: 1.2" x 1.2")

### Scanner Configuration

**Camera Requirements:**
- Minimum: VGA (640x480)
- Recommended: HD (1280x720)
- Auto-focus supported
- Flash optional (for dark environments)

**Scan Settings:**
- Frame rate: 300ms per scan (3.3 fps)
- Auto-detect from live video
- Success: Auto-close after 2 seconds
- Error: Stay open for retry

**Fallback Options:**
1. Upload QR image if no camera
2. Manual entry if QR unreadable
3. SMS check-in as alternative

## Statistics Calculation

### Attendance Rate Formula
```typescript
attendanceRate = ((totalPresent + totalLate) / totalExpected) * 100
```

### Member Categorization
- **On Time:** Check-in before or at service start time
- **Late:** Check-in after service start time
- **First Timer:** Member with status 'visitor' or marked as first timer
- **New Member:** Member who joined within last 90 days

## Responsive Behavior

### Desktop (≥1024px)
```
┌─────────────┬──────────────────────────┐
│   Stats     │   Member Check-In List   │
│   Panel     │                          │
│             │                          │
│  (1 col)    │      (2 cols)            │
└─────────────┴──────────────────────────┘
```

### Tablet/Mobile (<1024px)
```
┌──────────────────────────┐
│      Stats Panel         │
├──────────────────────────┤
│   Member Check-In List   │
│      (Scrollable)        │
└──────────────────────────┘
```

## Mock Data

### Sample Services
```typescript
5 services provided:
1. Sunday 1st Service (Oct 27, 8:00 AM) - Active
2. Sunday 2nd Service (Oct 27, 10:30 AM) - Active
3. Wednesday Bible Study (Oct 23, 6:00 PM) - Active
4. Sunday Service (Oct 20, 9:00 AM) - Historical
5. Youth Service (Oct 26, 4:00 PM) - Active
```

### Sample Attendance Records
```typescript
16 attendance records across 2 services:
- Service s1 (Oct 27): 4 records (3 present, 1 late)
- Service s4 (Oct 20): 6 records (all present)
```

## Vue/Laravel Migration

### Vue 3 + Quasar Components

**AttendanceTracker.vue:**
```vue
<template>
  <q-page padding>
    <q-splitter v-model="splitterModel">
      <!-- Stats Panel -->
      <template v-slot:before>
        <q-card>
          <q-card-section>
            <div class="text-h6">{{ selectedService.name }}</div>
            <div class="text-caption text-grey">{{ formatDate(selectedService.date) }}</div>
          </q-card-section>
          
          <!-- Attendance Rate Progress -->
          <q-card-section>
            <div class="text-subtitle2 q-mb-xs">Attendance Rate</div>
            <div class="text-h3 text-primary">{{ stats.attendanceRate }}%</div>
            <q-linear-progress 
              :value="stats.attendanceRate / 100" 
              color="primary"
              size="8px"
            />
            <div class="text-caption text-grey q-mt-xs">
              {{ stats.totalPresent + stats.totalLate }} of {{ stats.totalExpected }} members
            </div>
          </q-card-section>
          
          <!-- Stat Cards Grid -->
          <q-card-section>
            <div class="row q-col-gutter-sm">
              <div class="col-6">
                <q-card class="bg-positive-1">
                  <q-card-section class="q-pa-sm">
                    <div class="row items-center q-gutter-xs">
                      <q-icon name="check_circle" color="positive" />
                      <span class="text-caption">Present</span>
                    </div>
                    <div class="text-h4">{{ stats.totalPresent }}</div>
                  </q-card-section>
                </q-card>
              </div>
              
              <div class="col-6">
                <q-card class="bg-warning-1">
                  <q-card-section class="q-pa-sm">
                    <div class="row items-center q-gutter-xs">
                      <q-icon name="schedule" color="warning" />
                      <span class="text-caption">Late</span>
                    </div>
                    <div class="text-h4">{{ stats.totalLate }}</div>
                  </q-card-section>
                </q-card>
              </div>
              
              <!-- Absent and First Timers cards... -->
            </div>
          </q-card-section>
          
          <!-- Quick Actions -->
          <q-card-section>
            <div class="text-subtitle2 q-mb-sm">Quick Actions</div>
            <q-btn 
              outline 
              color="positive" 
              label="Mark All Present" 
              icon="check_circle"
              class="full-width q-mb-sm"
              @click="markAllPresent"
            />
            <q-btn 
              outline 
              label="Clear All" 
              icon="close"
              class="full-width"
              @click="clearAll"
            />
          </q-card-section>
        </q-card>
      </template>
      
      <!-- Member Check-In List -->
      <template v-slot:after>
        <q-card>
          <q-card-section>
            <div class="row items-center justify-between q-mb-md">
              <div>
                <div class="text-h6">Check-In Members</div>
                <div class="text-caption text-grey">{{ filteredMembers.length }} members</div>
              </div>
              
              <q-tabs v-model="filterTab" dense>
                <q-tab name="all" label="All" />
                <q-tab name="checked-in">
                  <div class="row items-center q-gutter-xs">
                    <span>Checked In</span>
                    <q-badge>{{ stats.totalPresent + stats.totalLate }}</q-badge>
                  </div>
                </q-tab>
                <q-tab name="pending">
                  <div class="row items-center q-gutter-xs">
                    <span>Pending</span>
                    <q-badge>{{ stats.totalExpected - (stats.totalPresent + stats.totalLate) }}</q-badge>
                  </div>
                </q-tab>
              </q-tabs>
            </div>
            
            <q-input
              v-model="searchQuery"
              outlined
              dense
              placeholder="Search members..."
            >
              <template v-slot:prepend>
                <q-icon name="search" />
              </template>
            </q-input>
          </q-card-section>
          
          <q-separator />
          
          <!-- Virtual Scroll for Performance -->
          <q-virtual-scroll
            :items="filteredMembers"
            virtual-scroll-item-size="80"
            style="max-height: 600px"
          >
            <template v-slot="{ item }">
              <MemberCheckIn
                :member="item"
                :attendance="attendanceByMember[item.id]"
                @check-in="handleCheckIn"
                compact
              />
            </template>
          </q-virtual-scroll>
        </q-card>
      </template>
    </q-splitter>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useAttendanceStore } from '@/stores/attendance';
import MemberCheckIn from '@/components/attendance/MemberCheckIn.vue';

const attendanceStore = useAttendanceStore();
const splitterModel = ref(30);
const filterTab = ref('all');
const searchQuery = ref('');

const filteredMembers = computed(() => {
  // Filter logic
});

const stats = computed(() => {
  // Stats calculation
});

const handleCheckIn = (memberId: string, status: string) => {
  attendanceStore.checkIn(selectedServiceId.value, memberId, status);
};

const markAllPresent = () => {
  const uncheckedIds = filteredMembers.value
    .filter(m => !attendanceByMember.value[m.id])
    .map(m => m.id);
  attendanceStore.bulkCheckIn(selectedServiceId.value, uncheckedIds, 'present');
};
</script>
```

### Laravel Backend

**AttendanceController.php:**
```php
class AttendanceController extends Controller
{
    public function checkIn(Request $request)
    {
        $validated = $request->validate([
            'service_id' => 'required|exists:services,id',
            'member_id' => 'required|exists:members,id',
            'status' => 'required|in:present,late,absent,excused',
            'check_in_method' => 'nullable|in:manual,qr_code,sms,app,nfc',
        ]);
        
        $service = Service::findOrFail($validated['service_id']);
        $member = Member::findOrFail($validated['member_id']);
        
        $attendance = AttendanceRecord::updateOrCreate(
            [
                'service_id' => $validated['service_id'],
                'member_id' => $validated['member_id']
            ],
            [
                'status' => $validated['status'],
                'check_in_time' => $validated['status'] !== 'absent' ? now() : null,
                'check_in_method' => $validated['check_in_method'] ?? 'manual',
                'is_first_timer' => $member->status === 'visitor',
                'recorded_by' => auth()->id(),
            ]
        );
        
        return response()->json($attendance);
    }
    
    public function bulkCheckIn(Request $request)
    {
        $validated = $request->validate([
            'service_id' => 'required|exists:services,id',
            'member_ids' => 'required|array',
            'member_ids.*' => 'exists:members,id',
            'status' => 'required|in:present,late,absent,excused',
        ]);
        
        $records = [];
        foreach ($validated['member_ids'] as $memberId) {
            $records[] = AttendanceRecord::updateOrCreate(
                ['service_id' => $validated['service_id'], 'member_id' => $memberId],
                [
                    'status' => $validated['status'],
                    'check_in_time' => $validated['status'] !== 'absent' ? now() : null,
                    'check_in_method' => 'manual',
                    'recorded_by' => auth()->id(),
                ]
            );
        }
        
        return response()->json($records);
    }
    
    public function stats($serviceId)
    {
        $service = Service::with('attendanceRecords')->findOrFail($serviceId);
        
        $totalMembers = Member::where('status', 'active')->count();
        $present = $service->attendanceRecords()->where('status', 'present')->count();
        $late = $service->attendanceRecords()->where('status', 'late')->count();
        $absent = $service->attendanceRecords()->where('status', 'absent')->count();
        $firstTimers = $service->attendanceRecords()->where('is_first_timer', true)->count();
        
        $stats = [
            'service_id' => $service->id,
            'service_name' => $service->name,
            'service_date' => $service->date,
            'total_expected' => $totalMembers,
            'total_present' => $present,
            'total_late' => $late,
            'total_absent' => $absent,
            'first_timers' => $firstTimers,
            'attendance_rate' => $totalMembers > 0 ? round((($present + $late) / $totalMembers) * 100) : 0,
        ];
        
        return response()->json($stats);
    }
    
    public function export($serviceId)
    {
        $service = Service::with(['attendanceRecords.member'])->findOrFail($serviceId);
        
        return Excel::download(
            new AttendanceExport($service),
            "attendance_{$service->date}.xlsx"
        );
    }
}
```

### API Routes

```php
Route::middleware('auth:sanctum')->group(function () {
    // Services
    Route::get('/services', [ServiceController::class, 'index']);
    Route::post('/services', [ServiceController::class, 'store']);
    Route::get('/services/{service}', [ServiceController::class, 'show']);
    
    // Attendance
    Route::post('/attendance/check-in', [AttendanceController::class, 'checkIn']);
    Route::post('/attendance/bulk-check-in', [AttendanceController::class, 'bulkCheckIn']);
    Route::get('/attendance/stats/{serviceId}', [AttendanceController::class, 'stats']);
    Route::get('/attendance/export/{serviceId}', [AttendanceController::class, 'export']);
    
    // First Timers
    Route::get('/first-timers', [FirstTimerController::class, 'index']);
    Route::post('/first-timers', [FirstTimerController::class, 'store']);
    Route::put('/first-timers/{firstTimer}', [FirstTimerController::class, 'update']);
});
```

## Africa-First Design

### 1. **Offline-First**
```typescript
// Store attendance locally, sync when online
const checkInOffline = (memberId: string, status: AttendanceStatus) => {
  const record = {
    id: generateOfflineId(),
    serviceId,
    memberId,
    status,
    checkInTime: new Date().toISOString(),
    _offline: true,
  };
  
  // Store in IndexedDB
  await db.attendance.add(record);
  
  // Sync when online
  if (navigator.onLine) {
    syncAttendance();
  }
};
```

### 2. **QR Code Check-In** (Low Bandwidth)
```typescript
// Generate member QR codes
const generateMemberQR = (member: Member) => {
  const qrData = {
    memberId: member.id,
    name: `${member.firstName} ${member.lastName}`,
    membershipNumber: member.membershipNumber,
  };
  
  return QRCode.toDataURL(JSON.stringify(qrData));
};

// Scan and check-in
const scanQRCheckIn = async (qrData: string) => {
  const { memberId } = JSON.parse(qrData);
  await checkIn(memberId, 'present', 'qr_code');
};
```

### 3. **SMS Check-In** (No Internet)
```typescript
// Members text "PRESENT" to church number
// System auto-checks them in
const handleSMSCheckIn = (phone: string, message: string) => {
  const member = findMemberByPhone(phone);
  if (member && message.toUpperCase() === 'PRESENT') {
    checkIn(member.id, 'present', 'sms');
    sendSMS(phone, `✓ Checked in for ${serviceName}`);
  }
};
```

## Performance Optimization

### Virtual Scrolling
For large congregations (1000+ members), implement virtual scrolling:

```typescript
import { FixedSizeList } from 'react-window';

<FixedSizeList
  height={600}
  itemCount={filteredMembers.length}
  itemSize={80}
  width="100%"
>
  {({ index, style }) => (
    <div style={style}>
      <MemberCheckIn member={filteredMembers[index]} />
    </div>
  )}
</FixedSizeList>
```

### Database Indexes
```sql
CREATE INDEX idx_attendance_service_member ON attendance_records(service_id, member_id);
CREATE INDEX idx_attendance_service_status ON attendance_records(service_id, status);
CREATE INDEX idx_attendance_checkin_time ON attendance_records(check_in_time);
CREATE INDEX idx_services_date_active ON services(date, is_active);
```

## Export Formats

### CSV Export
```csv
Member Name,Membership #,Status,Check-In Time,Method
Adewale Okonkwo,CA-2020-001,Present,7:55 AM,App
Chioma Nwosu,CA-2021-045,Present,8:05 AM,Manual
Blessing Okoro,CA-2018-012,Late,8:20 AM,Manual
```

### Excel Export
- Summary sheet with stats
- Detailed attendance sheet
- Charts and graphs
- Formatted with church branding

### PDF Report
- Service information header
- Attendance statistics summary
- Member list with photos
- Signatures section for leadership

## Next Steps

### Planned Features
1. **First-Timer Form** - Capture visitor details
2. **Check-Out Tracking** - Record service exit time
3. **Health Screening** - Temperature checks, COVID protocols
4. **Children Check-In** - Parent/guardian verification
5. **Multi-Service Check-In** - Attend multiple services
6. **Attendance Trends** - Historical analytics
7. **Member Notifications** - SMS/Email confirmations
8. **QR Code Generation** - Personal member QR codes
9. **Kiosk Mode** - Self-service check-in stations
10. **Geo-fencing** - Auto check-in when near church

## Support

For questions or issues with the Attendance Tracking System, refer to:
- Type definitions: `/types/attendance.ts`
- Mock data: `/lib/mock-data.ts`
- Vue migration notes: Inline comments in components
