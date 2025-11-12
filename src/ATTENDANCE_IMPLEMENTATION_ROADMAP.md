# ChurchAfrica ChMS - Attendance System Implementation Roadmap

## 📋 **IMPLEMENTATION STATUS OVERVIEW**

### **Current Status (as of November 12, 2024)**
- ✅ Basic event management system
- ✅ Event-based QR code generation
- ✅ Single event check-in system
- ✅ Offline-first architecture foundation
- ✅ Real-time check-in tracking
- ⚠️ Multi-service support (partial)
- ❌ Family check-in system (not implemented)
- ❌ Children's ministry integration (not implemented)
- ❌ Location-specific tracking (not implemented)
- ❌ Advanced analytics (not implemented)

---

## 🎯 **MVP PHASE 1: WEEKS 3-4 (CRITICAL FOR LAUNCH)**

### **Milestone 1: Multi-Service Attendance System**
**Target:** Week 3, Days 1-3 | **Priority:** P0 - CRITICAL

#### **Task 1.1: Service Type System**
- [ ] **1.1.1** Create service type enum and constants
  - File: `/types/service.ts`
  - Add: `ServiceType`, `ServiceStatus`, `ServiceFrequency`
  - Include: Sunday Morning, Sunday Evening, Midweek, Special Event
  
- [ ] **1.1.2** Update Event model to support service-specific fields
  - File: `/types/event.ts`
  - Add fields: `serviceType`, `recurringSchedule`, `ministryAssignments`
  - Migration: Backend database schema update needed
  
- [ ] **1.1.3** Create ServiceManager component
  - File: `/components/services/ServiceManager.tsx`
  - Features: Create/edit recurring services, view service calendar
  - UI: Service type selection, time scheduling, ministry configuration

#### **Task 1.2: Service Selection During Check-In**
- [ ] **1.2.1** Create ServiceSelector enhanced component
  - File: `/components/attendance/ServiceSelectorEnhanced.tsx`
  - Features: Active service detection, manual service selection, service info display
  - Logic: Auto-select based on current time, show upcoming services
  
- [ ] **1.2.2** Integrate service selection into check-in flow
  - Files: `/components/attendance/AttendanceTracker.tsx`, `/components/events/EventQRSystem.tsx`
  - Add: Service dropdown before check-in, remember last selected service
  - Validation: Ensure service is active before allowing check-in

- [ ] **1.2.3** Create service-specific QR codes
  - File: `/components/services/ServiceQRGenerator.tsx` (enhance existing)
  - Feature: Generate unique QR per service with service ID embedded
  - Display: Service name, time, location on QR print

#### **Task 1.3: Cross-Service Analytics**
- [ ] **1.3.1** Create service comparison component
  - File: `/components/reports/ServiceComparisonReport.tsx`
  - Metrics: Attendance by service, growth trends, service performance
  - Charts: Bar chart (service comparison), line chart (trends over time)
  
- [ ] **1.3.2** Add service filter to existing reports
  - Files: Update all report components
  - Feature: Filter attendance by service type, date range, status
  - UI: Service multi-select dropdown, quick filters (Today, This Week, This Month)

**Acceptance Criteria:**
- [ ] Can create services with specific types and schedules
- [ ] Check-in system auto-detects current service
- [ ] QR codes are service-specific and work offline
- [ ] Reports show per-service attendance breakdown
- [ ] All service data syncs when online

---

### **Milestone 2: Family Check-In System**
**Target:** Week 3, Days 4-7 | **Priority:** P0 - CRITICAL

#### **Task 2.1: Family Data Model & Backend**
- [ ] **2.1.1** Create Family type and interfaces
  - File: `/types/family.ts`
  - Interface: `Family`, `FamilyMember`, `FamilyCheckInRecord`
  - Fields: `familyId`, `familyName`, `members[]`, `primaryContact`, `emergencyContact`
  
- [ ] **2.1.2** Create family management API
  - Backend: Laravel/Supabase endpoints
  - Endpoints:
    - `GET /api/families` - List all families
    - `POST /api/families` - Create family
    - `GET /api/families/{id}` - Get family with members
    - `PUT /api/families/{id}` - Update family
    - `DELETE /api/families/{id}` - Delete family
    - `POST /api/families/{id}/members` - Add member to family
    - `DELETE /api/families/{id}/members/{memberId}` - Remove member
  
- [ ] **2.1.3** Database schema for families
  ```sql
  CREATE TABLE families (
    id BIGINT PRIMARY KEY,
    organization_id BIGINT NOT NULL,
    family_name VARCHAR(255) NOT NULL,
    primary_contact_id BIGINT NOT NULL,
    address TEXT,
    phone VARCHAR(50),
    email VARCHAR(255),
    emergency_contact JSON,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (organization_id) REFERENCES organizations(id),
    FOREIGN KEY (primary_contact_id) REFERENCES members(id)
  );

  CREATE TABLE family_members (
    id BIGINT PRIMARY KEY,
    family_id BIGINT NOT NULL,
    member_id BIGINT NOT NULL,
    relationship ENUM('head', 'spouse', 'child', 'other'),
    is_primary_contact BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP,
    FOREIGN KEY (family_id) REFERENCES families(id) ON DELETE CASCADE,
    FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE,
    UNIQUE KEY unique_family_member (family_id, member_id)
  );
  ```

#### **Task 2.2: Family Check-In UI**
- [ ] **2.2.1** Create FamilyCheckIn component
  - File: `/components/attendance/FamilyCheckIn.tsx`
  - Features:
    - Search families by name
    - Display all family members with checkboxes
    - Select/deselect all members
    - Individual member selection
    - Show member photos and ages
    - Children's ministry auto-assignment
  
- [ ] **2.2.2** Create family QR code generator
  - File: `/components/families/FamilyQRGenerator.tsx`
  - Feature: Generate single QR for entire family
  - Data: `{ type: 'family-checkin', familyId, serviceId, members[] }`
  - Print: Family QR card with all member names
  
- [ ] **2.2.3** Integrate family check-in into attendance flow
  - File: `/components/attendance/AttendanceTracker.tsx`
  - Add: "Family Check-In" tab alongside Individual and QR tabs
  - Flow: Search family → Select members → Assign ministry → Confirm
  - Validation: Check capacity for each ministry assignment

#### **Task 2.3: Children's Ministry Integration**
- [ ] **2.3.1** Create ministry assignment logic
  - File: `/lib/ministry-assignment.ts`
  - Logic:
    ```typescript
    function assignMinistry(member: Member, service: Service): MinistryAssignment {
      const age = calculateAge(member.dateOfBirth);
      
      if (age < 2) return { ministry: 'nursery', room: 'A1' };
      if (age < 5) return { ministry: 'toddlers', room: 'B1' };
      if (age < 12) return { ministry: "children's-church", room: 'C1' };
      if (age < 18) return { ministry: 'youth', room: 'D1' };
      return { ministry: 'main-service', room: 'sanctuary' };
    }
    ```
  
- [ ] **2.3.2** Create child security tag system
  - File: `/components/attendance/ChildSecurityTag.tsx`
  - Feature: Generate unique security code for child check-in
  - Display: Printable security tag with code and pickup verification
  - Validation: Parent must present matching code to pick up child
  
- [ ] **2.3.3** Create ministry dashboard
  - File: `/components/ministries/MinistryDashboard.tsx`
  - Features:
    - View children checked into each ministry
    - Capacity tracking per room
    - Allergies and special needs alerts
    - Pickup verification interface

#### **Task 2.4: Family QR Code System**
- [ ] **2.4.1** Enhance QR scanner for family codes
  - File: `/components/attendance/QRCodeScanner.tsx`
  - Feature: Detect family vs individual QR codes
  - Flow: Scan family QR → Show all members → Confirm check-in all
  
- [ ] **2.4.2** Create family check-in receipt
  - File: `/components/attendance/FamilyCheckInReceipt.tsx`
  - Display:
    - Family name
    - All checked-in members
    - Children's ministry assignments
    - Security codes for child pickup
    - Check-in time and service
  - Actions: Print, email, SMS

**Acceptance Criteria:**
- [ ] Families can be created and managed
- [ ] Single scan checks in entire family
- [ ] Children auto-assigned to age-appropriate ministries
- [ ] Security tags generated for child pickup
- [ ] Family check-in works offline
- [ ] Parents receive check-in receipt with security codes

---

### **Milestone 3: Location-Specific Tracking**
**Target:** Week 4, Days 1-3 | **Priority:** P0 - CRITICAL

#### **Task 3.1: Location Data Model**
- [ ] **3.1.1** Create location types and interfaces
  - File: `/types/location.ts`
  - Interfaces: `ChurchLocation`, `LocationCapacity`, `LocationAssignment`
  - Types: Building, Room, Section, Area
  
- [ ] **3.1.2** Database schema for locations
  ```sql
  CREATE TABLE church_locations (
    id BIGINT PRIMARY KEY,
    organization_id BIGINT NOT NULL,
    branch_id BIGINT NULL,
    name VARCHAR(255) NOT NULL,
    location_type ENUM('building', 'room', 'section', 'area'),
    parent_location_id BIGINT NULL, -- For hierarchical locations
    capacity INTEGER DEFAULT 0,
    current_occupancy INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    amenities JSON, -- wheelchair accessible, AV equipment, etc.
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (organization_id) REFERENCES organizations(id),
    FOREIGN KEY (branch_id) REFERENCES branches(id),
    FOREIGN KEY (parent_location_id) REFERENCES church_locations(id)
  );

  CREATE TABLE location_assignments (
    id BIGINT PRIMARY KEY,
    attendance_record_id BIGINT NOT NULL,
    location_id BIGINT NOT NULL,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    assigned_by BIGINT, -- Staff member
    seat_number VARCHAR(50),
    section VARCHAR(50),
    notes TEXT,
    FOREIGN KEY (attendance_record_id) REFERENCES attendance(id),
    FOREIGN KEY (location_id) REFERENCES church_locations(id),
    FOREIGN KEY (assigned_by) REFERENCES users(id)
  );
  ```

#### **Task 3.2: Location Management UI**
- [ ] **3.2.1** Create LocationManager component
  - File: `/components/locations/LocationManager.tsx`
  - Features:
    - Create/edit locations (buildings, rooms, sections)
    - Set capacity per location
    - Configure amenities and features
    - View location hierarchy
    - Enable/disable locations
  
- [ ] **3.2.2** Create location capacity dashboard
  - File: `/components/locations/LocationCapacityDashboard.tsx`
  - Display:
    - Real-time occupancy per location
    - Capacity utilization charts
    - Overflow alerts
    - Available spaces
  - Update: Real-time via WebSocket when check-ins occur

#### **Task 3.3: Location-Based Check-In**
- [ ] **3.3.1** Add location selection to check-in flow
  - Files: Update all check-in components
  - Feature: Dropdown to select location during check-in
  - Logic: Auto-suggest location based on service and member history
  - Validation: Check capacity before confirming check-in
  
- [ ] **3.3.2** Create location-specific QR codes
  - File: `/components/locations/LocationQRGenerator.tsx`
  - Feature: Generate QR codes for specific locations/sections
  - Use case: Place QR at entrance to building/room, scan to auto-assign location
  - Data: `{ type: 'location-checkin', locationId, serviceId }`
  
- [ ] **3.3.3** Create seating chart component (optional enhancement)
  - File: `/components/locations/SeatingChart.tsx`
  - Feature: Visual seating chart with occupied/available seats
  - Interaction: Click seat to assign member
  - Display: Member name on assigned seats

#### **Task 3.4: Location Analytics**
- [ ] **3.4.1** Create location utilization reports
  - File: `/components/reports/LocationUtilizationReport.tsx`
  - Metrics:
    - Average occupancy per location
    - Peak usage times
    - Underutilized spaces
    - Capacity trends
  - Charts: Heatmap of location usage
  
- [ ] **3.4.2** Add location filter to attendance reports
  - Files: Update all report components
  - Feature: Filter by location, view attendance per location
  - Export: Location-specific attendance lists

**Acceptance Criteria:**
- [ ] Locations can be created with hierarchy and capacity
- [ ] Check-in assigns members to specific locations
- [ ] Real-time capacity tracking prevents over-capacity
- [ ] Location-specific QR codes work for bulk assignment
- [ ] Reports show location utilization and trends

---

### **Milestone 4: Enhanced Offline-First Architecture**
**Target:** Week 4, Days 4-5 | **Priority:** P0 - CRITICAL

#### **Task 4.1: Offline Data Sync Enhancement**
- [ ] **4.1.1** Implement comprehensive IndexedDB schema
  - File: `/lib/offline-db.ts`
  - Stores: `events`, `services`, `families`, `members`, `checkIns`, `locations`, `syncQueue`
  - Indexes: Optimize for fast search and filtering
  
- [ ] **4.1.2** Create offline sync service
  - File: `/lib/offline-sync-service.ts`
  - Features:
    - Auto-detect online/offline status
    - Queue all write operations when offline
    - Batch sync when online (max 50 records per batch)
    - Conflict resolution (last-write-wins with timestamp)
    - Retry failed syncs with exponential backoff
  
- [ ] **4.1.3** Add sync status UI
  - File: `/components/sync/SyncStatusIndicator.tsx`
  - Display:
    - Online/offline badge
    - Pending sync count
    - Last sync time
    - Manual sync button
    - Sync error alerts

#### **Task 4.2: Offline QR Code Processing**
- [ ] **4.2.1** Implement local QR validation
  - File: `/lib/qr-validator.ts`
  - Feature: Validate QR code structure and data without backend
  - Cache: Store member/family data locally for offline lookup
  
- [ ] **4.2.2** Create offline check-in queue
  - File: `/lib/offline-checkin-queue.ts`
  - Feature: Store check-ins locally with metadata
  - Display: Show queued check-ins with sync pending badge
  - Sync: Auto-upload when online, mark as synced

#### **Task 4.3: Offline Reports**
- [ ] **4.3.1** Cache report data for offline access
  - File: `/lib/report-cache.ts`
  - Feature: Store last 30 days of attendance data locally
  - Update: Refresh cache when online
  
- [ ] **4.3.2** Generate reports from local data
  - Files: Update all report components
  - Feature: Calculate stats from IndexedDB when offline
  - Display: "Offline mode - data may be incomplete" warning

**Acceptance Criteria:**
- [ ] All check-in operations work completely offline
- [ ] Family check-in works offline
- [ ] Location assignment works offline
- [ ] QR scanning works offline
- [ ] Sync queue processes reliably when online
- [ ] No data loss during offline→online transitions
- [ ] Reports show cached data when offline

---

### **Milestone 5: Basic Reporting & Export**
**Target:** Week 4, Days 6-7 | **Priority:** P0 - MVP REQUIRED

#### **Task 5.1: Core Reports**
- [ ] **5.1.1** Daily attendance summary report
  - File: `/components/reports/DailyAttendanceReport.tsx`
  - Metrics: Total attendance, by service, by ministry, by location
  - Filters: Date, service type, branch
  - Export: PDF, CSV, Excel
  
- [ ] **5.1.2** Weekly attendance trends report
  - File: `/components/reports/WeeklyTrendsReport.tsx`
  - Metrics: Week-over-week comparison, growth rate, service breakdown
  - Charts: Line chart (trend), bar chart (service comparison)
  - Export: PDF with charts
  
- [ ] **5.1.3** Member attendance history report
  - File: `/components/reports/MemberAttendanceHistory.tsx`
  - Display: Member's attendance records, frequency, last attended
  - Metrics: Attendance rate, consecutive weeks, gaps
  - Export: CSV, PDF

- [ ] **5.1.4** Visitor tracking report
  - File: `/components/reports/VisitorReport.tsx`
  - Display: First-time visitors, return visitors, visitor conversion
  - Actions: Mark for follow-up, export contact list
  - Export: CSV with contact details

#### **Task 5.2: Export Functionality**
- [ ] **5.2.1** CSV export service
  - File: `/lib/export-service.ts`
  - Function: `exportToCSV(data, filename)`
  - Format: Standard CSV with headers, UTF-8 encoding
  
- [ ] **5.2.2** PDF export service
  - File: `/lib/pdf-export-service.ts`
  - Library: Use `jspdf` or `react-pdf`
  - Templates: Branded PDF templates with logo, church info
  - Features: Multi-page reports, tables, charts
  
- [ ] **5.2.3** Excel export service
  - File: `/lib/excel-export-service.ts`
  - Library: Use `xlsx` or `exceljs`
  - Features: Multiple sheets, formulas, formatting
  
- [ ] **5.2.4** Create export queue for offline
  - File: `/lib/export-queue.ts`
  - Feature: Queue export requests when offline, process when online
  - Storage: Save export settings in IndexedDB

#### **Task 5.3: Report Scheduling (Basic)**
- [ ] **5.3.1** Create scheduled report UI
  - File: `/components/reports/ScheduledReports.tsx`
  - Features:
    - Schedule daily/weekly/monthly reports
    - Email delivery configuration
    - Report type and filter selection
  
- [ ] **5.3.2** Backend report scheduler
  - Backend: Laravel scheduled tasks
  - Feature: Generate and email reports automatically
  - Storage: Store report history for access

**Acceptance Criteria:**
- [ ] Daily, weekly, monthly reports available
- [ ] Member attendance history accessible
- [ ] Visitor reports track first-time and return visitors
- [ ] All reports export to CSV, PDF, Excel
- [ ] Export works offline (queued)
- [ ] Scheduled reports email automatically

---

## 🚀 **POST-MVP PHASE 2: WEEKS 9-16 (COMPETITIVE ADVANTAGES)**

### **Milestone 6: Advanced Analytics Dashboard**
**Target:** Weeks 9-10 | **Priority:** P1 - HIGH VALUE

#### **Task 6.1: Attendance Trend Analysis**
- [ ] **6.1.1** Growth pattern detection
  - File: `/components/analytics/GrowthPatternAnalyzer.tsx`
  - Features:
    - Identify growth/decline trends
    - Seasonal variation detection
    - Year-over-year comparison
    - Growth rate calculation
  
- [ ] **6.1.2** Service optimization insights
  - File: `/components/analytics/ServiceOptimization.tsx`
  - Metrics:
    - Best performing service times
    - Service capacity utilization
    - Optimal service frequency recommendations
  
- [ ] **6.1.3** Member engagement lifecycle
  - File: `/components/analytics/MemberEngagementLifecycle.tsx`
  - Track:
    - New member attendance patterns
    - Engagement stages (new, regular, inactive, churned)
    - Retention rates by cohort
    - Re-engagement success rates

#### **Task 6.2: Predictive Analytics**
- [ ] **6.2.1** Attendance forecasting
  - File: `/lib/attendance-forecaster.ts`
  - Algorithm: Time series analysis, seasonal adjustments
  - Output: Predicted attendance for next 4 weeks
  - UI: Forecast chart with confidence intervals
  
- [ ] **6.2.2** Member retention risk scoring
  - File: `/lib/retention-risk-scorer.ts`
  - Factors: Attendance frequency, decline rate, engagement metrics
  - Output: Risk score (low, medium, high) per member
  - Action: Trigger follow-up workflows
  
- [ ] **6.2.3** Resource optimization recommendations
  - File: `/components/analytics/ResourceOptimizer.tsx`
  - Recommendations:
    - Optimal service times based on attendance
    - Staff allocation based on ministry attendance
    - Facility usage optimization

#### **Task 6.3: Advanced Dashboards**
- [ ] **6.3.1** Executive dashboard
  - File: `/components/dashboards/ExecutiveDashboard.tsx`
  - KPIs:
    - Total attendance (current vs previous period)
    - Growth rate
    - Member retention rate
    - First-time visitor count
    - Service utilization rates
  - Charts: Trend lines, comparison charts, KPI cards
  
- [ ] **6.3.2** Ministry-specific dashboards
  - File: `/components/dashboards/MinistryDashboard.tsx`
  - Dashboards for: Children, Youth, Adults, Seniors
  - Metrics: Ministry attendance, age distribution, growth
  
- [ ] **6.3.3** Branch comparison dashboard (multi-branch orgs)
  - File: `/components/dashboards/BranchComparisonDashboard.tsx`
  - Metrics: Branch performance, attendance comparison, growth rates
  - Charts: Branch ranking, performance matrix

**Acceptance Criteria:**
- [ ] Trend analysis identifies growth/decline patterns
- [ ] Forecasting predicts attendance within ±10% accuracy
- [ ] Risk scoring identifies at-risk members
- [ ] Executive dashboard shows all key metrics
- [ ] Ministry dashboards provide actionable insights

---

### **Milestone 7: Automated Follow-Up System**
**Target:** Weeks 11-12 | **Priority:** P1 - HIGH VALUE

#### **Task 7.1: Absent Member Detection**
- [ ] **7.1.1** Create absence detection service
  - File: `/lib/absence-detector.ts`
  - Logic:
    - Detect members with declining attendance
    - Identify members absent for X weeks (configurable)
    - Track absence patterns (sporadic vs consistent)
  
- [ ] **7.1.2** Absence alert system
  - File: `/components/followup/AbsenceAlerts.tsx`
  - Features:
    - Dashboard showing absent members
    - Severity levels (1 week, 2 weeks, 1 month, 3 months)
    - Bulk actions (assign follow-up, mark contacted)
  
- [ ] **7.1.3** Customizable absence thresholds
  - File: `/components/settings/AbsenceSettings.tsx`
  - Settings:
    - Absence threshold (e.g., 3 consecutive weeks)
    - Member groups (regular vs irregular attenders)
    - Alert triggers and notifications

#### **Task 7.2: Follow-Up Workflow Automation**
- [ ] **7.2.1** Create follow-up task system
  - File: `/components/followup/FollowUpTaskManager.tsx`
  - Features:
    - Auto-create follow-up tasks for absent members
    - Assign to staff based on small groups, ministry, or relationship
    - Task types: Call, visit, email, SMS
  - Workflow: Detected absence → Create task → Assign → Track completion
  
- [ ] **7.2.2** Follow-up templates
  - File: `/components/followup/FollowUpTemplates.tsx`
  - Templates for:
    - Phone call scripts
    - Email messages
    - SMS messages
    - Visit checklist
  - Personalization: Member name, last attended date, church name
  
- [ ] **7.2.3** Follow-up effectiveness tracking
  - File: `/components/reports/FollowUpEffectivenessReport.tsx`
  - Metrics:
    - Follow-up completion rate
    - Re-engagement success rate (members who returned)
    - Average time to re-engagement
    - Staff effectiveness by follow-up method

#### **Task 7.3: Visitor Follow-Up Automation**
- [ ] **7.3.1** First-time visitor identification
  - Logic: Automatically flag first check-in
  - Action: Create welcome task for pastoral team
  
- [ ] **7.3.2** Visitor journey tracking
  - File: `/components/visitors/VisitorJourney.tsx`
  - Track:
    - First visit date
    - Return visits count
    - Days between visits
    - Conversion to member status
  - Stages: First-timer → Return visitor → Regular attender → Member
  
- [ ] **7.3.3** Automated visitor follow-up workflow
  - Triggers:
    - Day 1: Welcome email/SMS
    - Day 3: Pastoral call
    - Week 2: Invitation to connect event
    - Month 1: Membership class invitation
  - Customization: Configure workflow steps and timing

**Acceptance Criteria:**
- [ ] System auto-detects absent members based on thresholds
- [ ] Follow-up tasks created and assigned automatically
- [ ] Templates available for all follow-up methods
- [ ] Effectiveness tracked and reported
- [ ] Visitor journey tracked from first visit to membership
- [ ] Automated workflows reduce manual follow-up effort

---

### **Milestone 8: Child Check-In Security Enhancement**
**Target:** Weeks 13-14 | **Priority:** P2 - IMPORTANT

#### **Task 8.1: Enhanced Security Tag System**
- [ ] **8.1.1** Unique security code generation
  - File: `/lib/security-code-generator.ts`
  - Algorithm: 6-digit unique code per child per service
  - Validation: Parent must present code to pick up child
  
- [ ] **8.1.2** Security tag printing
  - File: `/components/childcare/SecurityTagPrinter.tsx`
  - Template: Name, age, security code, allergies, parent pickup code
  - Hardware: Support for label printers
  
- [ ] **8.1.3** Parent verification system
  - File: `/components/childcare/ParentVerification.tsx`
  - Flow: Parent presents code → Staff validates → Child released
  - Log: Track pickup time and staff who processed

#### **Task 8.2: Child Allergy & Special Needs Tracking**
- [ ] **8.2.1** Add allergy/special needs to member profile
  - File: `/types/member.ts`
  - Fields: `allergies[]`, `specialNeeds[]`, `medications[]`, `emergencyInstructions`
  
- [ ] **8.2.2** Allergy alerts on check-in
  - Feature: Show prominent alert when child with allergies checks in
  - Print: Allergy information on security tag
  - Dashboard: Ministry dashboard shows all children with allergies
  
- [ ] **8.2.3** Special needs accommodation tracking
  - Feature: Track accommodations provided (e.g., sensory room, one-on-one helper)
  - Report: Special needs children attendance and accommodations

#### **Task 8.3: Child Ratio Monitoring**
- [ ] **8.3.1** Staff-to-child ratio configuration
  - Settings: Set ratios by age group (e.g., 1:3 for infants, 1:5 for toddlers)
  - Alerts: Warn when ratio exceeded
  
- [ ] **8.3.2** Volunteer management integration
  - Feature: Track volunteer check-in for children's ministry
  - Dashboard: Show current ratios and coverage
  - Alerts: Notify when more volunteers needed

**Acceptance Criteria:**
- [ ] Unique security codes generated for each child
- [ ] Security tags print with all required info
- [ ] Parent verification works reliably
- [ ] Allergy alerts displayed prominently
- [ ] Staff-to-child ratios monitored and enforced
- [ ] All security events logged

---

### **Milestone 9: Multi-Campus/Location Support**
**Target:** Weeks 15-16 | **Priority:** P2 - STRATEGIC

#### **Task 9.1: Campus/Branch Management**
- [ ] **9.1.1** Create campus/branch model
  - File: `/types/campus.ts`
  - Fields: `campusId`, `name`, `address`, `timezone`, `pastorInCharge`, `capacity`
  
- [ ] **9.1.2** Campus-specific settings
  - Settings:
    - Service times per campus
    - Staff assignments per campus
    - Reporting preferences
  
- [ ] **9.1.3** Campus selection UI
  - Component: Campus switcher in navigation
  - Storage: Remember last selected campus
  - Permissions: Restrict data access by campus

#### **Task 9.2: Cross-Campus Analytics**
- [ ] **9.2.1** Aggregated reporting
  - Report: All-campus attendance summary
  - Metrics: Total attendance, growth by campus, performance comparison
  
- [ ] **9.2.2** Campus comparison dashboard
  - Display: Side-by-side campus metrics
  - Charts: Campus ranking, growth trends
  
- [ ] **9.2.3** Inter-campus member tracking
  - Feature: Track when members attend different campuses
  - Report: Member mobility patterns

#### **Task 9.3: Campus-Specific QR Codes**
- [ ] **9.3.1** QR codes with campus info
  - Data: Include `campusId` in QR code
  - Validation: Ensure member checks in to correct campus
  
- [ ] **9.3.2** Campus-specific check-in kiosks
  - Feature: Self-service kiosks configured per campus
  - Display: Campus branding and info

**Acceptance Criteria:**
- [ ] Multiple campuses can be created and managed
- [ ] Attendance tracked per campus
- [ ] Cross-campus reports available
- [ ] QR codes campus-specific
- [ ] Member can attend any campus, data tracked correctly

---

## 📊 **IMPLEMENTATION TRACKING**

### **Phase 1 MVP Summary (Weeks 3-4)**
| Milestone | Tasks | Status | Completion Date |
|-----------|-------|--------|----------------|
| 1. Multi-Service System | 9 tasks | ⬜ Not Started | Target: Week 3 |
| 2. Family Check-In | 12 tasks | ⬜ Not Started | Target: Week 3-4 |
| 3. Location Tracking | 11 tasks | ⬜ Not Started | Target: Week 4 |
| 4. Offline Enhancement | 7 tasks | ⬜ Not Started | Target: Week 4 |
| 5. Basic Reporting | 11 tasks | ⬜ Not Started | Target: Week 4 |

**Total MVP Tasks:** 50 tasks  
**Completed:** 0 (0%)  
**Target Completion:** End of Week 4

### **Phase 2 Post-MVP Summary (Weeks 9-16)**
| Milestone | Tasks | Status | Completion Date |
|-----------|-------|--------|----------------|
| 6. Advanced Analytics | 10 tasks | ⬜ Not Started | Target: Weeks 9-10 |
| 7. Automated Follow-Up | 9 tasks | ⬜ Not Started | Target: Weeks 11-12 |
| 8. Child Security | 7 tasks | ⬜ Not Started | Target: Weeks 13-14 |
| 9. Multi-Campus | 8 tasks | ⬜ Not Started | Target: Weeks 15-16 |

**Total Post-MVP Tasks:** 34 tasks  
**Completed:** 0 (0%)  
**Target Completion:** End of Week 16

---

## 🎯 **QUICK START GUIDE**

### **Week 3 Focus: Multi-Service & Family Check-In**
**Start here on Monday of Week 3:**

1. **Day 1-2:** Implement service type system (Tasks 1.1.1 - 1.1.3)
2. **Day 3:** Service selection during check-in (Tasks 1.2.1 - 1.2.3)
3. **Day 4-5:** Family data model and backend (Tasks 2.1.1 - 2.1.3)
4. **Day 6-7:** Family check-in UI (Tasks 2.2.1 - 2.2.3)

### **Week 4 Focus: Location, Offline, Reports**
**Continue on Monday of Week 4:**

1. **Day 1-2:** Location tracking system (Tasks 3.1.1 - 3.2.2)
2. **Day 3:** Location-based check-in (Tasks 3.3.1 - 3.3.3)
3. **Day 4-5:** Enhanced offline architecture (Tasks 4.1.1 - 4.3.2)
4. **Day 6-7:** Basic reporting and export (Tasks 5.1.1 - 5.3.2)

### **Testing Schedule**
- **End of Week 3:** Test multi-service and family check-in
- **Mid Week 4:** Test location tracking
- **End of Week 4:** Full integration testing
- **Week 5:** User acceptance testing, bug fixes

---

## 📝 **NOTES FOR VUE/QUASAR MIGRATION**

### **Component Mapping**
When migrating to Vue/Quasar, map React components as follows:

| React Component | Vue Component | Quasar Components Used |
|----------------|---------------|------------------------|
| `ServiceManager.tsx` | `ServiceManager.vue` | `q-select`, `q-input`, `q-date`, `q-time` |
| `FamilyCheckIn.tsx` | `FamilyCheckIn.vue` | `q-list`, `q-checkbox`, `q-avatar`, `q-expansion-item` |
| `LocationManager.tsx` | `LocationManager.vue` | `q-tree`, `q-input`, `q-badge` |
| `AttendanceTracker.tsx` | `AttendanceTracker.vue` | `q-tabs`, `q-tab-panels`, `q-card` |
| Reports | Report components | `q-table`, `q-chart` (via Chart.js plugin) |

### **Backend API Implementation**
All tasks marked "Backend: Laravel/Supabase endpoints" require:
1. Laravel controller creation
2. API route registration
3. Database migration
4. Model relationships
5. API documentation

Refer to `/ATTENDANCE_QR_SYSTEM.md` for detailed API specifications.

---

## ✅ **SUCCESS CRITERIA**

### **MVP Phase 1 Success Metrics**
- [ ] **Multi-Service:** Can create and manage 5+ services per week
- [ ] **Family Check-In:** 80% of families use family check-in feature
- [ ] **Location Tracking:** 100% of check-ins assigned to location
- [ ] **Offline:** 95% offline sync success rate
- [ ] **Reports:** All basic reports export successfully

### **Post-MVP Phase 2 Success Metrics**
- [ ] **Analytics:** Dashboard loads in < 2 seconds with 1 year of data
- [ ] **Follow-Up:** 90% of absent members receive automated follow-up
- [ ] **Child Security:** 100% child pickup verification compliance
- [ ] **Multi-Campus:** Support 10+ campuses without performance degradation

---

## 🚀 **LET'S GET STARTED!**

**NEXT STEPS:**
1. ✅ Review this roadmap
2. ⬜ Start with Task 1.1.1 (Service Type System)
3. ⬜ Complete Milestone 1 by end of Day 3
4. ⬜ Daily standup to track progress
5. ⬜ Check off tasks as you complete them

**TRACK PROGRESS:**
- Mark completed tasks with ✅
- Mark in-progress tasks with 🔄
- Mark blocked tasks with ⚠️
- Update completion dates as you go

---

**Document Version:** 1.0  
**Last Updated:** November 12, 2024  
**Next Review:** End of Week 3 (after MVP Milestones 1-2 completion)
