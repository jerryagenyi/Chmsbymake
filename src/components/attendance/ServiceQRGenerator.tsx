import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
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
  X,
  Copy,
  Check,
  RefreshCw
} from 'lucide-react';

interface ServiceData {
  serviceId: string;
  serviceName: string;
  date: string;
  time: string;
  campusId: string;
  orgId: string;
  expiresAt: string;
}

interface ServiceQRGeneratorProps {
  organizationId: string;
  campusId: string;
  onCheckIn?: (memberId: string, serviceId: string) => void;
}

export const ServiceQRGenerator: React.FC<ServiceQRGeneratorProps> = ({
  organizationId,
  campusId,
  onCheckIn,
}) => {
  const [serviceName, setServiceName] = useState('Sunday Main Service');
  const [serviceDate, setServiceDate] = useState(new Date().toISOString().split('T')[0]);
  const [serviceTime, setServiceTime] = useState('11:00');
  const [duration, setDuration] = useState(2); // hours
  const [qrGenerated, setQrGenerated] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [serviceId, setServiceId] = useState('');
  const [expiresAt, setExpiresAt] = useState<Date | null>(null);
  const [checkInCount, setCheckInCount] = useState(0);
  const [recentCheckIns, setRecentCheckIns] = useState<any[]>([]);
  const [copied, setCopied] = useState(false);
  const [showProjection, setShowProjection] = useState(false);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const projectionCanvasRef = useRef<HTMLCanvasElement>(null);

  const qrData = useRef<ServiceData | null>(null);

  const generateServiceQR = async () => {
    // Generate unique service ID
    const newServiceId = `s-${serviceDate}-${serviceTime.replace(':', '')}`;
    setServiceId(newServiceId);

    // Calculate expiry
    const startDateTime = new Date(`${serviceDate}T${serviceTime}`);
    const expiryDateTime = new Date(startDateTime.getTime() + duration * 60 * 60 * 1000);
    setExpiresAt(expiryDateTime);

    // Create QR data
    const data: ServiceData = {
      serviceId: newServiceId,
      serviceName,
      date: serviceDate,
      time: serviceTime,
      campusId: campusId,
      orgId: organizationId,
      expiresAt: expiryDateTime.toISOString(),
    };

    qrData.current = data;

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
      setCheckInCount(0);
      setRecentCheckIns([]);
    } catch (error) {
      console.error('Failed to generate QR code:', error);
    }
  };

  const handleDownload = () => {
    if (!qrDataUrl) return;

    const link = document.createElement('a');
    link.download = `service-qr-${serviceId}.png`;
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
          <title>Service QR Code - ${serviceName}</title>
          <style>
            @page {
              size: A4;
              margin: 20mm;
            }
            body {
              font-family: 'Archivo', system-ui, sans-serif;
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
              border: 4px solid #1CE479;
              border-radius: 20px;
              padding: 40px;
              max-width: 600px;
            }
            .header {
              color: #1CE479;
              font-size: 36px;
              font-weight: bold;
              margin-bottom: 20px;
            }
            .service-name {
              font-size: 28px;
              font-weight: 600;
              margin: 20px 0;
              color: #333;
            }
            .service-info {
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
            }
            .footer {
              margin-top: 30px;
              font-size: 14px;
              color: #999;
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
            <div class="service-name">${serviceName}</div>
            <div class="service-info">
              📅 ${new Date(serviceDate).toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
            <div class="service-info">
              🕐 ${serviceTime}
            </div>
            <div class="qr-container">
              <img src="${qrDataUrl}" alt="Service QR Code" style="width: 400px; height: 400px;" />
            </div>
            <div class="instructions">
              <strong>How to Check In:</strong><br/>
              1. Open your camera or QR scanner app<br/>
              2. Point at this QR code<br/>
              3. Follow the link to complete check-in<br/>
              <br/>
              <strong>Or use the ChurchAfrica member portal</strong>
            </div>
            <div class="footer">
              Service ID: ${serviceId}<br/>
              Valid until: ${expiresAt?.toLocaleString()}
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
      const file = new File([blob], `service-qr-${serviceId}.png`, { type: 'image/png' });

      if (navigator.share) {
        await navigator.share({
          title: `${serviceName} - Check In`,
          text: `Scan this QR code to check in to ${serviceName}`,
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
    if (!qrData.current) return;

    const checkInLink = `${window.location.origin}/check-in/${serviceId}`;
    
    try {
      await navigator.clipboard.writeText(checkInLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleProjection = async () => {
    setShowProjection(true);

    // Generate larger QR for projection
    if (projectionCanvasRef.current && qrData.current) {
      try {
        const QRCode = await import('qrcode');
        await QRCode.toCanvas(projectionCanvasRef.current, JSON.stringify(qrData.current), {
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
    if (!expiresAt) return false;
    return new Date() > expiresAt;
  };

  const getTimeRemaining = () => {
    if (!expiresAt) return '';
    
    const now = new Date();
    const diff = expiresAt.getTime() - now.getTime();
    
    if (diff <= 0) return 'Expired';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m remaining`;
  };

  // Simulate real-time check-ins (in production, this would come from backend)
  useEffect(() => {
    if (!qrGenerated) return;

    const interval = setInterval(() => {
      // Simulate random check-ins for demo
      if (Math.random() > 0.7) {
        const mockMember = {
          id: `m-${Date.now()}`,
          name: ['John Doe', 'Jane Smith', 'David Johnson', 'Sarah Williams'][Math.floor(Math.random() * 4)],
          time: new Date(),
        };
        
        setRecentCheckIns(prev => [mockMember, ...prev.slice(0, 9)]);
        setCheckInCount(prev => prev + 1);
        
        if (onCheckIn) {
          onCheckIn(mockMember.id, serviceId);
        }
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [qrGenerated, serviceId, onCheckIn]);

  return (
    <div className="space-y-6">
      {/* Generator Card */}
      <Card className="bg-[#1A1A20] border-[#2A2A30]">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <QrCode className="w-6 h-6 text-[#1CE479]" />
            Generate Service QR Code
          </CardTitle>
          <CardDescription className="text-gray-400">
            Create a QR code for members to check in to a specific service
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Service Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="serviceName" className="text-gray-300">
                Service Name
              </Label>
              <Select value={serviceName} onValueChange={setServiceName}>
                <SelectTrigger className="bg-[#0A0A0F] border-[#2A2A30] text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Sunday First Service">Sunday First Service (9:00 AM)</SelectItem>
                  <SelectItem value="Sunday Main Service">Sunday Main Service (11:00 AM)</SelectItem>
                  <SelectItem value="Sunday Evening Service">Sunday Evening Service (6:00 PM)</SelectItem>
                  <SelectItem value="Wednesday Midweek">Wednesday Midweek Service</SelectItem>
                  <SelectItem value="Friday Prayer Night">Friday Prayer Night</SelectItem>
                  <SelectItem value="Special Event">Special Event</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="serviceDate" className="text-gray-300">
                Service Date
              </Label>
              <Input
                id="serviceDate"
                type="date"
                value={serviceDate}
                onChange={(e) => setServiceDate(e.target.value)}
                className="bg-[#0A0A0F] border-[#2A2A30] text-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="serviceTime" className="text-gray-300">
                Start Time
              </Label>
              <Input
                id="serviceTime"
                type="time"
                value={serviceTime}
                onChange={(e) => setServiceTime(e.target.value)}
                className="bg-[#0A0A0F] border-[#2A2A30] text-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration" className="text-gray-300">
                Duration (hours)
              </Label>
              <Select value={duration.toString()} onValueChange={(v) => setDuration(Number(v))}>
                <SelectTrigger className="bg-[#0A0A0F] border-[#2A2A30] text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 hour</SelectItem>
                  <SelectItem value="2">2 hours</SelectItem>
                  <SelectItem value="3">3 hours</SelectItem>
                  <SelectItem value="4">4 hours</SelectItem>
                  <SelectItem value="6">6 hours</SelectItem>
                  <SelectItem value="12">12 hours</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            onClick={generateServiceQR}
            className="w-full bg-[#1CE479] text-[#0A0A0F] hover:bg-[#1CE479]/90"
          >
            <QrCode className="w-4 h-4 mr-2" />
            Generate QR Code
          </Button>
        </CardContent>
      </Card>

      {/* Generated QR Display */}
      {qrGenerated && (
        <>
          <Card className="bg-[#1A1A20] border-[#2A2A30]">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white">{serviceName}</CardTitle>
                  <CardDescription className="text-gray-400">
                    {new Date(`${serviceDate}T${serviceTime}`).toLocaleString()}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  {isExpired() ? (
                    <Badge variant="destructive">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      Expired
                    </Badge>
                  ) : (
                    <Badge className="bg-[#1CE479]/10 text-[#1CE479] border-[#1CE479]/20">
                      <Clock className="w-3 h-3 mr-1" />
                      {getTimeRemaining()}
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* QR Code Display */}
              <div className="flex justify-center p-8 bg-white rounded-lg">
                <canvas
                  ref={canvasRef}
                  className="max-w-full h-auto"
                  style={{ imageRendering: 'pixelated' }}
                />
              </div>

              {/* Service Info */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-[#0A0A0F] rounded-lg">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Service ID</p>
                  <p className="text-white font-mono text-sm">{serviceId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Total Check-ins</p>
                  <p className="text-white flex items-center gap-2">
                    <Users className="w-4 h-4 text-[#1CE479]" />
                    {checkInCount}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleProjection}
                  className="border-[#2A2A30] hover:border-[#1CE479]"
                >
                  <Maximize2 className="w-4 h-4 mr-2" />
                  Project
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrint}
                  className="border-[#2A2A30] hover:border-[#1CE479]"
                >
                  <Printer className="w-4 h-4 mr-2" />
                  Print
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownload}
                  className="border-[#2A2A30] hover:border-[#1CE479]"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleShare}
                  className="border-[#2A2A30] hover:border-[#1CE479]"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyLink}
                className="w-full border-[#2A2A30] hover:border-[#1CE479]"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 mr-2 text-[#1CE479]" />
                    Link Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Check-in Link
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Real-time Check-ins */}
          <Card className="bg-[#1A1A20] border-[#2A2A30]">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-[#1CE479]" />
                Live Check-ins
              </CardTitle>
              <CardDescription className="text-gray-400">
                Recent member check-ins for this service
              </CardDescription>
            </CardHeader>

            <CardContent>
              {recentCheckIns.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No check-ins yet</p>
                  <p className="text-sm mt-1">Members will appear here as they check in</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {recentCheckIns.map((checkIn, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 bg-[#0A0A0F] rounded-lg border border-[#2A2A30] animate-in fade-in slide-in-from-top-2"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#1CE479]/10 rounded-full flex items-center justify-center">
                          <CheckCircle2 className="w-5 h-5 text-[#1CE479]" />
                        </div>
                        <div>
                          <p className="text-white">{checkIn.name}</p>
                          <p className="text-xs text-gray-500">
                            {checkIn.time.toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline" className="bg-[#1CE479]/10 text-[#1CE479]">
                        Present
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}

      {/* Projection Modal */}
      <Dialog open={showProjection} onOpenChange={setShowProjection}>
        <DialogContent className="max-w-4xl bg-[#1A1A20] border-[#2A2A30]" aria-describedby="projection-description">
          <DialogHeader>
            <DialogTitle className="text-white text-center text-3xl">
              {serviceName}
            </DialogTitle>
            <p id="projection-description" className="sr-only">
              QR code projection for {serviceName}
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
              <p className="text-xl text-white">Scan to Check In</p>
              <p className="text-gray-400">
                {new Date(`${serviceDate}T${serviceTime}`).toLocaleString()}
              </p>
              <div className="flex items-center justify-center gap-2">
                <Users className="w-5 h-5 text-[#1CE479]" />
                <span className="text-2xl text-[#1CE479]">{checkInCount}</span>
                <span className="text-gray-400">checked in</span>
              </div>
            </div>

            <Alert className="border-[#1CE479]/50 bg-[#1CE479]/10">
              <AlertCircle className="h-4 w-4 text-[#1CE479]" />
              <AlertDescription className="text-gray-300">
                Press <strong>F11</strong> for fullscreen mode. This QR code will expire in {getTimeRemaining()}.
              </AlertDescription>
            </Alert>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};