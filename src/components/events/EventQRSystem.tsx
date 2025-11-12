/**
 * ChurchAfrica ChMS - Event QR System
 * Comprehensive QR code system for event check-ins with multi-branch support
 */

import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { ScrollArea } from '../ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import {
  QrCode,
  Download,
  Printer,
  Share2,
  Maximize2,
  Clock,
  Users,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Copy,
  Check,
  RefreshCw,
  MapPin,
  Building2,
  Eye,
  Wifi,
  WifiOff,
  Database,
  Activity,
  X,
  ChevronLeft,
} from 'lucide-react';
import { Event, EventType } from '../../types/event';
import { cn } from '../ui/utils';
import { format } from 'date-fns';

interface EventQRData {
  type: 'event-checkin';
  eventId: string;
  eventTitle: string;
  eventType: EventType;
  startDate: string;
  endDate?: string;
  branchId: string;
  organizationId: string;
  locationVenue?: string;
  capacity?: number;
  expiresAt: string;
  timestamp: number;
  checkInUrl: string;
}

interface CheckInRecord {
  id: string;
  memberId?: string;
  name: string;
  time: Date;
  method: 'qr' | 'manual' | 'link';
  synced: boolean;
  branchId: string;
}

interface EventQRSystemProps {
  event: Event;
  organizationId: string;
  branchId: string;
  branchName?: string;
  onCheckIn?: (record: CheckInRecord) => void;
  onBack?: () => void;
  className?: string;
}

export function EventQRSystem({
  event,
  organizationId,
  branchId,
  branchName = 'Main Branch',
  onCheckIn,
  onBack,
  className,
}: EventQRSystemProps) {
  const [qrGenerated, setQrGenerated] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [checkInCount, setCheckInCount] = useState(0);
  const [recentCheckIns, setRecentCheckIns] = useState<CheckInRecord[]>([]);
  const [copied, setCopied] = useState(false);
  const [showProjection, setShowProjection] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [offlineQueue, setOfflineQueue] = useState<CheckInRecord[]>([]);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const projectionCanvasRef = useRef<HTMLCanvasElement>(null);
  const qrDataRef = useRef<EventQRData | null>(null);

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Auto-sync when coming online
  useEffect(() => {
    if (isOnline && offlineQueue.length > 0) {
      syncOfflineQueue();
    }
  }, [isOnline]);

  const syncOfflineQueue = async () => {
    console.log('Syncing offline queue:', offlineQueue.length, 'records');
    // In production, send to backend
    const synced = offlineQueue.map(record => ({ ...record, synced: true }));
    setRecentCheckIns(prev => 
      prev.map(r => offlineQueue.find(q => q.id === r.id) ? { ...r, synced: true } : r)
    );
    setOfflineQueue([]);
  };

  const generateEventQR = async () => {
    // Calculate expiry (event end date + 1 hour grace period)
    const endDate = new Date(event.endDate || event.startDate);
    const expiryDate = new Date(endDate.getTime() + 60 * 60 * 1000); // +1 hour

    // Create QR data with comprehensive event info
    const data: EventQRData = {
      type: 'event-checkin',
      eventId: event.id,
      eventTitle: event.title,
      eventType: event.type,
      startDate: event.startDate,
      endDate: event.endDate,
      branchId,
      organizationId,
      locationVenue: event.location?.venue,
      capacity: event.capacity,
      expiresAt: expiryDate.toISOString(),
      timestamp: Date.now(),
      checkInUrl: `${window.location.origin}/events/check-in/${event.id}`,
    };

    qrDataRef.current = data;

    // Generate QR code
    try {
      const QRCode = await import('qrcode');
      
      if (canvasRef.current) {
        await QRCode.toCanvas(canvasRef.current, JSON.stringify(data), {
          width: 400,
          margin: 2,
          color: {
            dark: '#0A0A0F',
            light: '#FFFFFF',
          },
          errorCorrectionLevel: 'H',
        });

        const dataUrl = canvasRef.current.toDataURL('image/png');
        setQrDataUrl(dataUrl);
      }

      setQrGenerated(true);
    } catch (error) {
      console.error('Failed to generate QR code:', error);
    }
  };

  useEffect(() => {
    if (event) {
      generateEventQR();
    }
  }, [event]);

  const handleCheckIn = (memberId: string, memberName: string, method: 'qr' | 'manual' | 'link' = 'qr') => {
    const record: CheckInRecord = {
      id: `ci-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      memberId,
      name: memberName,
      time: new Date(),
      method,
      synced: isOnline,
      branchId,
    };

    setRecentCheckIns(prev => [record, ...prev.slice(0, 49)]); // Keep last 50
    setCheckInCount(prev => prev + 1);

    if (!isOnline) {
      setOfflineQueue(prev => [...prev, record]);
    }

    onCheckIn?.(record);
  };

  const handleDownload = () => {
    if (!qrDataUrl) return;

    const link = document.createElement('a');
    link.download = `event-qr-${event.id}-${event.title.replace(/\s+/g, '-')}.png`;
    link.href = qrDataUrl;
    link.click();
  };

  const handlePrint = () => {
    if (!canvasRef.current) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Event QR Code - ${event.title}</title>
          <style>
            @page {
              size: A4;
              margin: 20mm;
            }
            body {
              font-family: 'Outfit', system-ui, sans-serif;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              margin: 0;
              padding: 40px;
            }
            .print-container {
              text-align: center;
              border: 4px solid oklch(71.76% 0.203 155.44);
              border-radius: 20px;
              padding: 40px;
              max-width: 600px;
            }
            .header {
              color: oklch(71.76% 0.203 155.44);
              font-size: 36px;
              font-weight: bold;
              margin-bottom: 20px;
            }
            .event-title {
              font-size: 28px;
              font-weight: 600;
              margin: 20px 0;
              color: #333;
            }
            .event-info {
              font-size: 18px;
              color: #666;
              margin: 10px 0;
            }
            .qr-container {
              margin: 30px 0;
              display: flex;
              justify-content: center;
            }
            .instructions {
              font-size: 16px;
              color: #666;
              margin-top: 30px;
              line-height: 1.6;
              text-align: left;
            }
            .footer {
              margin-top: 30px;
              font-size: 14px;
              color: #999;
              border-top: 2px solid #eee;
              padding-top: 20px;
            }
            @media print {
              body {
                background: white;
              }
            }
          </style>
        </head>
        <body>
          <div class="print-container">
            <div class="header">ChurchAfrica ChMS</div>
            <div class="event-title">${event.title}</div>
            <div class="event-info">
              📅 ${format(new Date(event.startDate), 'EEEE, MMMM d, yyyy')}
            </div>
            <div class="event-info">
              🕐 ${format(new Date(event.startDate), 'h:mm a')}
            </div>
            ${event.location?.venue ? `
              <div class="event-info">
                📍 ${event.location.venue}
              </div>
            ` : ''}
            <div class="qr-container">
              <img src="${qrDataUrl}" alt="Event QR Code" style="width: 400px; height: 400px;" />
            </div>
            <div class="instructions">
              <strong>How to Check In:</strong><br/><br/>
              <strong>Option 1: QR Code Scanner</strong><br/>
              • Open your camera or QR scanner app<br/>
              • Point at this QR code<br/>
              • Follow the link to complete check-in<br/><br/>
              
              <strong>Option 2: Manual Entry</strong><br/>
              • Visit: ${window.location.origin}/events/check-in<br/>
              • Enter Event ID: ${event.id}<br/><br/>
              
              <strong>Option 3: Member Portal</strong><br/>
              • Log in to ChurchAfrica member portal<br/>
              • Navigate to Events and check in
            </div>
            <div class="footer">
              <strong>Event ID:</strong> ${event.id}<br/>
              <strong>Branch:</strong> ${branchName}<br/>
              <strong>Organisation:</strong> ${organizationId}<br/>
              ${event.capacity ? `<strong>Capacity:</strong> ${event.capacity} people<br/>` : ''}
              <strong>Valid until:</strong> ${format(new Date(qrDataRef.current?.expiresAt || event.endDate || event.startDate), 'PPpp')}
            </div>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    
    setTimeout(() => {
      printWindow.print();
    }, 250);
  };

  const handleShare = async () => {
    if (!qrDataUrl) return;

    try {
      const response = await fetch(qrDataUrl);
      const blob = await response.blob();
      const file = new File([blob], `event-qr-${event.id}.png`, { type: 'image/png' });

      if (navigator.share) {
        await navigator.share({
          title: `${event.title} - Check In`,
          text: `Scan this QR code to check in to ${event.title}`,
          files: [file],
        });
      } else {
        handleDownload();
      }
    } catch (error) {
      console.error('Failed to share:', error);
      handleDownload();
    }
  };

  const handleCopyLink = async () => {
    if (!qrDataRef.current) return;

    try {
      await navigator.clipboard.writeText(qrDataRef.current.checkInUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleProjection = async () => {
    setShowProjection(true);

    // Generate larger QR for projection
    if (projectionCanvasRef.current && qrDataRef.current) {
      try {
        const QRCode = await import('qrcode');
        await QRCode.toCanvas(projectionCanvasRef.current, JSON.stringify(qrDataRef.current), {
          width: 800,
          margin: 4,
          color: {
            dark: '#0A0A0F',
            light: '#FFFFFF',
          },
          errorCorrectionLevel: 'H',
        });
      } catch (error) {
        console.error('Failed to generate projection QR:', error);
      }
    }
  };

  const isExpired = () => {
    if (!qrDataRef.current) return false;
    return new Date() > new Date(qrDataRef.current.expiresAt);
  };

  const getTimeRemaining = () => {
    if (!qrDataRef.current) return '';
    
    const now = new Date();
    const expiry = new Date(qrDataRef.current.expiresAt);
    const diff = expiry.getTime() - now.getTime();
    
    if (diff <= 0) return 'Expired';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `${days}d ${hours}h remaining`;
    if (hours > 0) return `${hours}h ${minutes}m remaining`;
    return `${minutes}m remaining`;
  };

  const getCapacityStatus = () => {
    if (!event.capacity) return null;
    
    const percentage = (checkInCount / event.capacity) * 100;
    const remaining = event.capacity - checkInCount;
    
    return {
      percentage,
      remaining,
      isFull: checkInCount >= event.capacity,
      isNearCapacity: percentage >= 90,
    };
  };

  const capacityStatus = getCapacityStatus();

  // Simulate demo check-ins (remove in production)
  useEffect(() => {
    if (!qrGenerated) return;

    const interval = setInterval(() => {
      if (Math.random() > 0.85) {
        const mockNames = [
          'Kofi Mensah', 'Amina Okafor', 'Tendai Moyo', 'Zainab Hassan',
          'Mandla Nkosi', 'Fatima Diop', 'Kwame Asante', 'Aisha Kamara',
          'Thabo Dlamini', 'Zara Mwangi'
        ];
        
        const name = mockNames[Math.floor(Math.random() * mockNames.length)];
        handleCheckIn(`m-${Date.now()}`, name, 'qr');
      }
    }, 8000);

    return () => clearInterval(interval);
  }, [qrGenerated]);

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {onBack && (
            <Button variant="outline" size="sm" onClick={onBack}>
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          )}
          <div>
            <h2 className="text-2xl font-bold">{event.title}</h2>
            <p className="text-sm text-muted-foreground">
              Event QR Code System - {branchName}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isOnline ? (
            <Badge variant="outline" className="gap-1">
              <Wifi className="h-3 w-3" />
              Online
            </Badge>
          ) : (
            <Badge variant="outline" className="gap-1 bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
              <WifiOff className="h-3 w-3" />
              Offline
            </Badge>
          )}
          {offlineQueue.length > 0 && (
            <Badge variant="outline" className="gap-1 bg-info/10 text-info border-info/20">
              <Database className="h-3 w-3" />
              {offlineQueue.length} queued
            </Badge>
          )}
        </div>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="qr-code">QR Code</TabsTrigger>
          <TabsTrigger value="check-ins">Check-Ins</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Check-Ins</p>
                    <p className="text-3xl font-bold text-success">{checkInCount}</p>
                  </div>
                  <Users className="h-10 w-10 text-success/50" />
                </div>
              </CardContent>
            </Card>

            {event.capacity && (
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Capacity</p>
                      <p className="text-3xl font-bold">
                        {capacityStatus?.remaining || 0}
                      </p>
                      <p className="text-xs text-muted-foreground">remaining</p>
                    </div>
                    <Activity className="h-10 w-10 text-muted-foreground/50" />
                  </div>
                  {capacityStatus && (
                    <div className="mt-3">
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className={cn(
                            "h-full transition-all",
                            capacityStatus.isFull ? "bg-red-500" :
                            capacityStatus.isNearCapacity ? "bg-yellow-500" :
                            "bg-success"
                          )}
                          style={{ width: `${Math.min(capacityStatus.percentage, 100)}%` }}
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    {isExpired() ? (
                      <Badge variant="destructive" className="mt-2">Expired</Badge>
                    ) : (
                      <>
                        <Badge className="mt-2 bg-success">Active</Badge>
                        <p className="text-xs text-muted-foreground mt-1">
                          {getTimeRemaining()}
                        </p>
                      </>
                    )}
                  </div>
                  <Clock className="h-10 w-10 text-muted-foreground/50" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Event Details */}
          <Card>
            <CardHeader>
              <CardTitle>Event Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{format(new Date(event.startDate), 'PPpp')}</span>
                  </div>
                  {event.location?.venue && (
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{event.location.venue}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <span>{branchName}</span>
                  </div>
                </div>
                <Badge>{event.type.replace('_', ' ')}</Badge>
              </div>
              
              {capacityStatus?.isNearCapacity && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Event is at {Math.round(capacityStatus.percentage)}% capacity. Only {capacityStatus.remaining} spots remaining.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* QR Code Tab */}
        <TabsContent value="qr-code" className="space-y-4">
          {qrGenerated && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <QrCode className="h-5 w-5 text-primary" />
                  Event Check-In QR Code
                </CardTitle>
                <CardDescription>
                  Display this QR code for attendees to check in
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* QR Code Display */}
                <div className="flex justify-center p-8 bg-white rounded-lg border-4 border-primary/20">
                  <canvas
                    ref={canvasRef}
                    className="max-w-full h-auto"
                    style={{ imageRendering: 'pixelated' }}
                  />
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleProjection}
                  >
                    <Maximize2 className="w-4 h-4 mr-2" />
                    Project
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePrint}
                  >
                    <Printer className="w-4 h-4 mr-2" />
                    Print
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDownload}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleShare}
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyLink}
                  className="w-full"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 mr-2 text-success" />
                      Link Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2" />
                      Copy Check-in Link
                    </>
                  )}
                </Button>

                {/* QR Info */}
                <div className="p-4 bg-muted rounded-lg space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Event ID:</span>
                    <code className="bg-background px-2 py-1 rounded">{event.id}</code>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Check-in URL:</span>
                    <code className="bg-background px-2 py-1 rounded text-xs">
                      /events/check-in/{event.id}
                    </code>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Check-Ins Tab */}
        <TabsContent value="check-ins" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-success" />
                Live Check-Ins
              </CardTitle>
              <CardDescription>
                Real-time attendance tracking for this event
              </CardDescription>
            </CardHeader>

            <CardContent>
              {recentCheckIns.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
                  <p className="text-muted-foreground">No check-ins yet</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Attendees will appear here as they check in
                  </p>
                </div>
              ) : (
                <ScrollArea className="h-[400px]">
                  <div className="space-y-2">
                    {recentCheckIns.map((checkIn, idx) => (
                      <div
                        key={checkIn.id}
                        className="flex items-center justify-between p-3 bg-muted rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-success/10 rounded-full flex items-center justify-center">
                            <CheckCircle2 className="w-5 h-5 text-success" />
                          </div>
                          <div>
                            <p className="font-medium">{checkIn.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {checkIn.time.toLocaleTimeString()} • {checkIn.method.toUpperCase()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={checkIn.synced ? 'default' : 'secondary'} className="text-xs">
                            {checkIn.synced ? 'Synced' : 'Pending'}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Projection Modal */}
      <Dialog open={showProjection} onOpenChange={setShowProjection}>
        <DialogContent className="max-w-4xl" aria-describedby="projection-description">
          <DialogHeader>
            <DialogTitle className="text-center text-3xl">
              {event.title}
            </DialogTitle>
            <p id="projection-description" className="sr-only">
              QR code projection for {event.title}
            </p>
          </DialogHeader>

          <div className="space-y-6">
            <div className="flex justify-center p-8 bg-white rounded-lg">
              <canvas
                ref={projectionCanvasRef}
                className="max-w-full h-auto"
                style={{ imageRendering: 'pixelated' }}
              />
            </div>

            <div className="text-center space-y-2">
              <p className="text-2xl font-bold">Scan to Check In</p>
              <p className="text-muted-foreground">
                {format(new Date(event.startDate), 'PPpp')}
              </p>
              <div className="flex items-center justify-center gap-2">
                <Users className="w-6 h-6 text-success" />
                <span className="text-3xl font-bold text-success">{checkInCount}</span>
                <span className="text-muted-foreground">checked in</span>
              </div>
            </div>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Press <strong>F11</strong> for fullscreen mode. This QR code will expire in {getTimeRemaining()}.
              </AlertDescription>
            </Alert>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
