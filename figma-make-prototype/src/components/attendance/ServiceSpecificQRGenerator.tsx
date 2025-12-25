/**
 * ChurchAfrica ChMS - Service-Specific QR Code Generator
 * Generate QR codes tied to specific services for enhanced tracking
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  Download,
  Printer,
  QrCode,
  Calendar,
  Clock,
  MapPin,
  Copy,
  Check,
  Share2,
} from 'lucide-react';
import { Service } from '../../types/service';
import { SERVICE_TYPE_LABELS, formatServiceTime } from '../../types/service';
import { cn } from '../ui/utils';

interface ServiceSpecificQRGeneratorProps {
  service: Service;
  memberId?: string; // Optional: for member-specific service QR
  memberName?: string;
  size?: number;
  showServiceInfo?: boolean;
  showActions?: boolean;
  className?: string;
}

export function ServiceSpecificQRGenerator({
  service,
  memberId,
  memberName,
  size = 200,
  showServiceInfo = true,
  showActions = true,
  className,
}: ServiceSpecificQRGeneratorProps) {
  const [copied, setCopied] = React.useState(false);
  const [qrDataUrl, setQrDataUrl] = React.useState<string>('');
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  // QR Code data payload with service information
  const qrData = React.useMemo(() => {
    const payload: any = {
      type: 'service-checkin',
      version: '2.0', // Enhanced version with service info
      serviceId: service.id,
      serviceName: service.name,
      serviceType: service.serviceType,
      serviceDate: service.scheduledDate,
      serviceTime: service.startTime,
      timestamp: Date.now(),
    };

    // Add member info if provided (for personalized QR codes)
    if (memberId && memberName) {
      payload.memberId = memberId;
      payload.memberName = memberName;
      payload.personalized = true;
    }

    return JSON.stringify(payload);
  }, [service, memberId, memberName]);

  // Generate QR Code
  React.useEffect(() => {
    const generateQRCode = async () => {
      if (!canvasRef.current) return;

      try {
        const QRCode = await import('qrcode');
        await QRCode.toCanvas(canvasRef.current, qrData, {
          width: size,
          margin: 2,
          color: {
            dark: '#0A0A0F',
            light: '#FFFFFF',
          },
          errorCorrectionLevel: 'H', // High error correction for better scanning
        });

        const dataUrl = canvasRef.current.toDataURL('image/png');
        setQrDataUrl(dataUrl);
      } catch (error) {
        console.error('Failed to generate service QR code:', error);
      }
    };

    generateQRCode();
  }, [qrData, size]);

  // Download QR code
  const handleDownload = () => {
    if (!qrDataUrl) return;

    const link = document.createElement('a');
    const filename = memberId
      ? `qr-${service.id}-${memberId}.png`
      : `qr-service-${service.id}.png`;
    
    link.href = qrDataUrl;
    link.download = filename;
    link.click();
  };

  // Print QR code
  const handlePrint = () => {
    if (!qrDataUrl) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Service QR Code - ${service.name}</title>
          <style>
            body {
              font-family: system-ui, -apple-system, sans-serif;
              display: flex;
              flex-direction: column;
              align-items: center;
              padding: 2rem;
              margin: 0;
            }
            .header {
              text-align: center;
              margin-bottom: 2rem;
            }
            h1 {
              margin: 0 0 0.5rem 0;
              font-size: 1.5rem;
            }
            .service-info {
              color: #666;
              margin: 0.25rem 0;
            }
            .qr-container {
              border: 2px solid #1CE479;
              border-radius: 8px;
              padding: 1rem;
              background: white;
            }
            .footer {
              margin-top: 2rem;
              text-align: center;
              font-size: 0.875rem;
              color: #999;
            }
            @media print {
              body { padding: 0; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${service.name}</h1>
            <div class="service-info">${new Date(service.scheduledDate).toLocaleDateString('en-GB', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</div>
            <div class="service-info">${formatServiceTime(service)}</div>
            ${service.location?.venue ? `<div class="service-info">${service.location.venue}</div>` : ''}
            ${memberName ? `<div class="service-info"><strong>${memberName}</strong></div>` : ''}
          </div>
          <div class="qr-container">
            <img src="${qrDataUrl}" alt="Service QR Code" />
          </div>
          <div class="footer">
            <p>ChurchAfrica ChMS - Scan to check in</p>
            <p>${memberId ? 'Personalized QR Code' : 'Service QR Code'}</p>
          </div>
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.print();
  };

  // Copy QR data
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(qrData);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy QR data:', error);
    }
  };

  // Share QR code
  const handleShare = async () => {
    if (!qrDataUrl) return;

    try {
      // Convert data URL to blob
      const response = await fetch(qrDataUrl);
      const blob = await response.blob();
      const file = new File([blob], `service-qr-${service.id}.png`, { type: 'image/png' });

      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: `${service.name} - Check-in QR`,
          text: `Check-in QR code for ${service.name} on ${new Date(service.scheduledDate).toLocaleDateString()}`,
          files: [file],
        });
      } else {
        // Fallback: download
        handleDownload();
      }
    } catch (error) {
      console.error('Failed to share QR code:', error);
    }
  };

  const serviceDate = new Date(service.scheduledDate);

  return (
    <Card className={cn("overflow-hidden", className)}>
      {showServiceInfo && (
        <CardHeader className="bg-[#1A1A20] border-b border-[#1CE479]/20">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <CardTitle className="flex items-center gap-2 mb-2">
                <QrCode className="h-5 w-5 text-[#1CE479]" />
                {memberId ? 'Personalized Service QR' : 'Service Check-In QR'}
              </CardTitle>
              <CardDescription>
                {memberId 
                  ? `For ${memberName} at ${service.name}`
                  : `Scan to check in to ${service.name}`
                }
              </CardDescription>
            </div>
            <Badge variant="outline" className="shrink-0">
              {SERVICE_TYPE_LABELS[service.serviceType]}
            </Badge>
          </div>

          <div className="flex flex-col gap-2 mt-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>
                {serviceDate.toLocaleDateString('en-GB', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{formatServiceTime(service)}</span>
            </div>
            {service.location?.venue && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>{service.location.venue}</span>
              </div>
            )}
          </div>
        </CardHeader>
      )}

      <CardContent className="p-6">
        <div className="flex flex-col items-center">
          {/* QR Code Canvas */}
          <div className="relative">
            <div className="p-4 bg-white rounded-lg border-2 border-[#1CE479]">
              <canvas ref={canvasRef} className="block" />
            </div>
            
            {/* Service overlay badge for non-personalized codes */}
            {!memberId && (
              <div className="absolute -top-2 -right-2">
                <Badge className="bg-[#1CE479] text-[#0A0A0F]">
                  Service QR
                </Badge>
              </div>
            )}
          </div>

          {/* QR Code ID */}
          <p className="text-xs text-muted-foreground mt-4 font-mono">
            ID: {service.id.substring(0, 8).toUpperCase()}
            {memberId && `-${memberId.substring(0, 6).toUpperCase()}`}
          </p>

          {/* Actions */}
          {showActions && (
            <div className="grid grid-cols-2 gap-2 w-full mt-6">
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
                disabled={!qrDataUrl}
                className="gap-2"
              >
                <Download className="h-4 w-4" />
                Download
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handlePrint}
                disabled={!qrDataUrl}
                className="gap-2"
              >
                <Printer className="h-4 w-4" />
                Print
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleShare}
                disabled={!qrDataUrl}
                className="gap-2"
              >
                <Share2 className="h-4 w-4" />
                Share
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                disabled={!qrData}
                className="gap-2"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 text-success" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copy Data
                  </>
                )}
              </Button>
            </div>
          )}

          {/* Info text */}
          <div className="mt-6 p-3 bg-[#1A1A20] rounded-lg text-xs text-center text-muted-foreground">
            {memberId ? (
              <p>
                This QR code is personalized for <strong>{memberName}</strong>.
                Scanning it will automatically check them in to this specific service.
              </p>
            ) : (
              <p>
                This QR code is specific to <strong>{service.name}</strong>.
                Any member scanning it will be checked in to this service.
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
