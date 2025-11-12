# Attendance System - Updated Flow (November 2025)

## Overview

The attendance system has been updated to use a **single service QR code** approach instead of individual member QR codes. This provides a cleaner, more practical check-in experience for churches.

## New Flow

### For Administrators (Platform)

1. **Generate Service QR Code**
   - Admin creates a QR code for a specific service (e.g., "Sunday Main Service - Nov 17, 2025")
   - QR code contains: Service ID, Name, Date, Time, Branch, Expiry
   - QR code can be:
     - **Projected** on screen during service (fullscreen mode)
     - **Printed** and displayed at venue entrance
     - **Shared** digitally via link/image

2. **Monitor Check-ins**
   - Real-time check-in feed shows members as they scan
   - Live counter of total attendees
   - Check-in list with timestamps
   - Service status monitoring (active/expired)

3. **Manage Service QR Codes**
   - Set service duration (1-12 hours)
   - QR codes auto-expire after service ends
   - Generate new QR codes for recurring services
   - Archive past service QR codes

### For Members (Mobile App)

1. **Open Mobile App**
   - Member logs in to their account (one-time setup)
   - App remembers their identity

2. **Scan Service QR Code**
   - Tap "Scan QR Code" button
   - Point camera at service QR code (on screen or printed)
   - Automatic detection and check-in

3. **Receive Confirmation**
   - **If QR is on Platform (not printed)**:
     - Confirmation shown on both platform and mobile
     - Visual toast notification
     - Check-in appears in real-time feed
   
   - **If QR is Printed**:
     - Confirmation shown only on mobile
     - Success sound plays
     - Vibration feedback (haptic)
     - Visual check-in confirmation

4. **Offline Support**
   - Check-ins work offline
   - Queued for sync when connection restored
   - Offline indicator shown

## Key Benefits

### ✅ Cleaner Experience
- No need to generate/manage individual QR codes for each member
- One QR code serves entire congregation
- Reduces paper waste

### ✅ Faster Check-in
- Members scan once, instantly checked in
- No typing or searching required
- Works even with poor connectivity

### ✅ Better Security
- Service QR codes expire automatically
- Can't be reused for different services
- Tied to specific date/time/location

### ✅ Flexible Display
- Project on screen during service
- Print and post at entrance
- Share link for virtual attendees
- Works for both in-person and hybrid services

### ✅ Real-time Monitoring
- Admin sees check-ins as they happen
- Live attendance count
- Identify late arrivals
- Track first-timers

## Component Architecture

### Admin/Platform Components

**ServiceQRGenerator** (`/components/attendance/ServiceQRGenerator.tsx`)
- Generate service QR codes
- Configure service details (name, date, time, duration)
- Export options (Project, Print, Download, Share)
- Real-time check-in monitoring
- Live attendance feed

### Member/Mobile Components

**MobileCheckIn** (`/components/attendance/MobileCheckIn.tsx`)
- Camera-based QR scanner
- Member profile display
- Check-in confirmation with feedback
- Offline queue management
- Sound & vibration settings

## Technical Details

### Service QR Data Structure

```typescript
interface ServiceQRData {
  type: 'service-checkin';
  serviceId: string;          // Unique service identifier
  serviceName: string;        // e.g., "Sunday Main Service"
  date: string;              // ISO date string
  time: string;              // Time in HH:MM format
  branchId: string;          // Church branch ID
  orgId: string;             // Organization ID
  expiresAt: string;         // ISO datetime string
  timestamp: number;         // Generation timestamp
}
```

### Check-in Result Structure

```typescript
interface CheckInResult {
  success: boolean;
  serviceName: string;
  time: string;
  location: string;
  isOnPlatform: boolean;     // true if QR on screen, false if printed
}
```

## User Experience Flows

### Scenario 1: QR Code on Screen (Platform)

1. Admin projects service QR code on screen
2. Member scans QR with mobile app
3. System detects scan is from platform QR
4. **Platform shows**: Real-time check-in notification (toast + live feed)
5. **Mobile shows**: Success confirmation + "Checked in at [location]"
6. Both platform and mobile confirm attendance

### Scenario 2: Printed QR Code

1. Admin prints and posts QR code at entrance
2. Member scans printed QR code with mobile app
3. System detects scan is from printed QR
4. **Mobile shows**: 
   - Visual check-in confirmation
   - Success sound plays (configurable)
   - Vibration feedback (configurable)
   - "Checked in successfully" message
5. **Platform shows**: Real-time feed update (no toast interruption)

### Scenario 3: Offline Check-in

1. Member's phone has no internet connection
2. Member scans QR code
3. App shows: "Checked in (offline)"
4. Check-in queued locally on device
5. When connection restored: Auto-sync to platform
6. Notification: "Check-in synced successfully"

## Migration from Old System

### Deprecated Components

- ❌ **MemberQRCodes** - Individual member QR code generation (still available but deprecated)
- ❌ Individual QR code printing per member
- ❌ QR code download for each member

### Recommended Migration Path

1. **Inform Members**:
   - Send notification about new check-in process
   - Provide mobile app download link
   - Create tutorial video/guide

2. **Training Sessions**:
   - Walk through new check-in flow
   - Demonstrate QR scanning
   - Test with small group first

3. **Gradual Rollout**:
   - Week 1: Offer both methods (old + new)
   - Week 2-3: Promote new method
   - Week 4+: Transition fully to new system

4. **Fallback Options**:
   - Keep manual check-in available
   - Provide admin-assisted check-in kiosk
   - Support code entry for technical issues

## Admin Best Practices

### QR Code Display

**For Small Services (<50 people)**:
- Single printed QR code at entrance
- Mobile-optimized display

**For Medium Services (50-200 people)**:
- Multiple printed QR codes at different entrances
- Consider projection on side screens

**For Large Services (200+ people)**:
- Project on main screen before service
- Printed QR codes at all entrances
- Dedicated check-in stations
- Multiple admins monitoring

### Timing Recommendations

1. **Generate QR Code**: 30 minutes before service
2. **Display Duration**: From 30 mins before to service end
3. **Check-in Window**: Usually first 30 minutes of service
4. **QR Expiry**: Set to service end time + 1 hour buffer

### Security Tips

1. Generate unique QR code for each service
2. Don't reuse old QR codes
3. Monitor check-in list for anomalies
4. Set appropriate expiry times
5. Archive old QR codes for record-keeping

## Offline Capabilities

### What Works Offline

✅ Scanning QR codes (camera is local)
✅ Local check-in confirmation
✅ Sound and vibration feedback
✅ Queue check-in for sync
✅ View member profile
✅ Access check-in history (cached)

### What Requires Connection

⚠️ Syncing check-ins to platform
⚠️ Real-time feed updates
⚠️ Admin monitoring
⚠️ Cross-device synchronization

### Sync Strategy

1. Check-ins saved to device storage (IndexedDB)
2. Automatic sync when connection detected
3. Background sync (Service Worker)
4. Conflict resolution (server timestamp wins)
5. Retry failed syncs (exponential backoff)

## Future Enhancements

### Planned Features

- [ ] NFC tap-to-check-in (in addition to QR)
- [ ] Geofencing (auto check-in when entering church)
- [ ] Facial recognition check-in
- [ ] SMS check-in code for feature phones
- [ ] Check-in via USSD (for non-smartphones)
- [ ] Bluetooth beacon check-in
- [ ] Check-in analytics dashboard
- [ ] Attendance predictions with AI
- [ ] Parent check-in for children
- [ ] Group check-in (families)

## Accessibility

### Mobile App

- Large scan button (48px minimum touch target)
- Voice feedback option for check-in
- High contrast mode support
- Text-to-speech for instructions
- Screen reader compatible

### Platform

- Keyboard navigation support
- ARIA labels on all interactive elements
- Clear visual feedback
- Error messages with instructions
- Alternative check-in methods

## Support & Troubleshooting

### Common Issues

**Issue**: Camera not working
**Solution**: Check browser permissions, try different browser

**Issue**: QR code not scanning
**Solution**: Ensure good lighting, hold camera steady, try manual code entry

**Issue**: "QR code expired" error
**Solution**: Contact admin to generate new QR code

**Issue**: Offline check-in not syncing
**Solution**: Check internet connection, check-in will sync automatically when online

**Issue**: Duplicate check-ins
**Solution**: System prevents duplicates within 5-minute window

## Performance Metrics

### Expected Performance

- QR Code Generation: < 500ms
- Camera Initialization: < 2s
- QR Scan Detection: < 1s
- Check-in Processing: < 200ms
- Platform Update: Real-time (< 1s)
- Offline Queue: Unlimited capacity
- Sync Speed: ~50 check-ins per second

### Optimization Tips

1. Use high-quality camera (720p+)
2. Ensure good lighting conditions
3. Keep QR code clean and clear
4. Use error correction level H
5. Print QR codes at recommended size (minimum 4x4 inches)
6. Enable hardware acceleration in browser

## Conclusion

The new single-service QR code system provides a cleaner, faster, and more practical check-in experience for both administrators and members. By moving away from individual member QR codes, we reduce complexity while maintaining all the benefits of automated, contactless attendance tracking.

The system supports both online and offline scenarios, provides appropriate feedback based on the display method (platform vs. printed), and includes all necessary features for modern church attendance management.

---

**Last Updated**: November 11, 2025  
**Status**: ✅ Production Ready  
**Migration**: Recommended for all new implementations
