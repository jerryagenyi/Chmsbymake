/**
 * ChurchAfrica ChMS - Attendance Flow Showcase
 * Demonstrates the new single-service QR code check-in flow
 */

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import { ServiceQRGenerator } from './ServiceQRGenerator';
import { MobileCheckIn } from './MobileCheckIn';
import {
  MonitorSmartphone,
  Smartphone,
  Info,
  CheckCircle,
  QrCode,
  Users,
  Sparkles,
} from 'lucide-react';

export function AttendanceFlowShowcase() {
  const [activeTab, setActiveTab] = useState<'admin' | 'member'>('admin');

  // Mock member for demo
  const mockMember = {
    id: 'mbr-001',
    name: 'John Okonkwo',
    membershipId: 'CA-2023-045',
    photo: undefined,
    branch: 'Lagos Main Campus',
  };

  const handleCheckIn = async (serviceId: string, memberId: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    return {
      success: true,
      serviceName: 'Sunday Main Service',
      time: new Date().toLocaleTimeString(),
      location: 'Lagos Main Campus',
      isOnPlatform: Math.random() > 0.5, // Randomly decide if on platform or printed
    };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl">Attendance System</h1>
          <Badge variant="secondary" className="gap-1">
            <Sparkles className="h-3 w-3" />
            Updated Flow
          </Badge>
        </div>
        <p className="text-muted-foreground">
          Single-service QR code system for streamlined check-in
        </p>
      </div>

      {/* Info Alert */}
      <Alert className="border-primary/50 bg-primary/5">
        <Info className="h-4 w-4 text-primary" />
        <AlertDescription>
          <strong>New System:</strong> Instead of generating individual QR codes for each member,
          admins now create a single QR code per service that all members scan with their mobile app.
          This is cleaner, faster, and more practical.
        </AlertDescription>
      </Alert>

      {/* Benefits Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-border">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <QrCode className="h-5 w-5 text-primary" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm">Single QR Per Service</h4>
                <p className="text-xs text-muted-foreground">
                  One QR code for entire congregation. No individual codes needed.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <CheckCircle className="h-5 w-5 text-primary" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm">Auto Check-in</h4>
                <p className="text-xs text-muted-foreground">
                  Members scan with their app, automatically checked in by identity.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm">Real-time Feed</h4>
                <p className="text-xs text-muted-foreground">
                  Platform shows live check-ins as members arrive.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'admin' | 'member')}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="admin" className="gap-2">
            <MonitorSmartphone className="h-4 w-4" />
            Admin View (Platform)
          </TabsTrigger>
          <TabsTrigger value="member" className="gap-2">
            <Smartphone className="h-4 w-4" />
            Member View (Mobile)
          </TabsTrigger>
        </TabsList>

        <TabsContent value="admin" className="space-y-4 mt-6">
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MonitorSmartphone className="h-5 w-5 text-primary" />
                Administrator Dashboard
              </CardTitle>
              <CardDescription>
                Generate service QR codes, monitor check-ins, and manage attendance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    <strong>How it works:</strong>
                    <ol className="mt-2 space-y-1 text-sm">
                      <li>1. Generate a QR code for your service</li>
                      <li>2. Project on screen or print and display</li>
                      <li>3. Members scan with their mobile app</li>
                      <li>4. Monitor real-time check-ins below</li>
                    </ol>
                  </AlertDescription>
                </Alert>

                <ServiceQRGenerator
                  organizationId="org-001"
                  campusId="campus-lagos"
                  onCheckIn={(memberId, serviceId) => {
                    console.log('Check-in:', memberId, serviceId);
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="member" className="space-y-4 mt-6">
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="h-5 w-5 text-primary" />
                Member Mobile App
              </CardTitle>
              <CardDescription>
                Scan service QR code to check in automatically
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    <strong>How it works:</strong>
                    <ol className="mt-2 space-y-1 text-sm">
                      <li>1. Member opens their mobile app (logged in)</li>
                      <li>2. Taps "Scan QR Code" button</li>
                      <li>3. Points camera at service QR code</li>
                      <li>4. Automatically checked in with confirmation</li>
                    </ol>
                  </AlertDescription>
                </Alert>

                <div className="border-2 border-dashed rounded-lg p-4">
                  <p className="text-sm text-muted-foreground text-center mb-4">
                    Mobile App Simulation (in production, this would be a native mobile app)
                  </p>
                  
                  <div className="max-w-md mx-auto border rounded-lg overflow-hidden shadow-lg">
                    <MobileCheckIn
                      currentMember={mockMember}
                      onCheckIn={handleCheckIn}
                    />
                  </div>
                </div>

                <Alert className="border-primary/50 bg-primary/5">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <AlertDescription>
                    <strong>Smart Feedback:</strong>
                    <ul className="mt-2 space-y-1 text-sm">
                      <li>• <strong>If QR on platform:</strong> Confirmation on both platform & mobile</li>
                      <li>• <strong>If QR printed:</strong> Only mobile confirmation with sound & vibration</li>
                      <li>• <strong>If offline:</strong> Check-in queued for sync when online</li>
                    </ul>
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Comparison */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle>Old vs New System</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Old System */}
            <div className="space-y-3">
              <h4 className="flex items-center gap-2 text-destructive">
                <span className="text-lg">❌</span>
                Old System (Deprecated)
              </h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Generate individual QR code for each member</li>
                <li>• Print hundreds of QR codes</li>
                <li>• Distribute to all members</li>
                <li>• Members lose/forget their codes</li>
                <li>• Difficult to manage and update</li>
                <li>• Messy and wasteful</li>
              </ul>
            </div>

            {/* New System */}
            <div className="space-y-3">
              <h4 className="flex items-center gap-2 text-primary">
                <span className="text-lg">✅</span>
                New System (Recommended)
              </h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>Single QR code per service</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>Project or print one QR code</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>All members scan with their app</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>Auto-identified by login</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>Real-time monitoring</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>Clean, professional, eco-friendly</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/**
 * Vue Migration Notes:
 * 
 * Create similar showcase in Vue:
 * 
 * <template>
 *   <q-page padding>
 *     <div class="q-gutter-md">
 *       <q-banner class="bg-primary text-white">
 *         New attendance system with single-service QR codes
 *       </q-banner>
 * 
 *       <q-tabs v-model="activeTab">
 *         <q-tab name="admin" label="Admin View" icon="desktop_windows" />
 *         <q-tab name="member" label="Member View" icon="phone_android" />
 *       </q-tabs>
 * 
 *       <q-tab-panels v-model="activeTab">
 *         <q-tab-panel name="admin">
 *           <ServiceQRGenerator />
 *         </q-tab-panel>
 * 
 *         <q-tab-panel name="member">
 *           <MobileCheckIn :current-member="currentMember" />
 *         </q-tab-panel>
 *       </q-tab-panels>
 *     </div>
 *   </q-page>
 * </template>
 */