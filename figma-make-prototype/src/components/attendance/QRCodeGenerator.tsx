/**
 * ChurchAfrica ChMS - QR Code Generator
 * Generate QR codes for member check-in
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { 
  Download,
  Printer,
  QrCode,
  Share2,
  Copy,
  Check,
  RefreshCw
} from 'lucide-react';
import { Member } from '../../types/member';
import { cn } from '../ui/utils';

interface QRCodeGeneratorProps {
  member: Member;
  size?: number;
  showActions?: boolean;
  className?: string;
}

export function QRCodeGenerator({
  member,
  size = 200,
  showActions = true,
  className,
}: QRCodeGeneratorProps) {
  const [copied, setCopied] = React.useState(false);
  const [qrDataUrl, setQrDataUrl] = React.useState<string>('');
  const [refreshKey, setRefreshKey] = React.useState(0);
  const [isGenerating, setIsGenerating] = React.useState(false);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  const initials = `${member.firstName[0]}${member.lastName[0]}`.toUpperCase();
  const fullName = `${member.firstName} ${member.lastName}`;

  // QR Code data payload - includes refreshKey to force regeneration
  const qrData = React.useMemo(() => {
    return JSON.stringify({
      type: 'member-checkin',
      memberId: member.id,
      name: fullName,
      membershipNumber: member.membershipNumber,
      timestamp: Date.now(),
      refresh: refreshKey, // Include refresh key to make data unique
    });
  }, [member.id, fullName, member.membershipNumber, refreshKey]);

  // Generate QR Code using canvas
  React.useEffect(() => {
    const generateQRCode = async () => {
      if (!canvasRef.current) return;

      setIsGenerating(true);
      try {
        // Use qrcode library
        const QRCode = await import('qrcode');
        await QRCode.toCanvas(canvasRef.current, qrData, {
          width: size,
          margin: 1,
          color: {
            dark: '#0A0A0F', // Green Dark background
            light: '#FFFFFF',
          },
          errorCorrectionLevel: 'M',
        });

        // Get data URL for download
        const dataUrl = canvasRef.current.toDataURL('image/png');
        setQrDataUrl(dataUrl);
      } catch (error) {
        console.error('Failed to generate QR code:', error);
      } finally {
        setIsGenerating(false);
      }
    };

    generateQRCode();
  }, [qrData, size]);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handleDownload = () => {
    if (!qrDataUrl) return;

    const link = document.createElement('a');
    link.download = `qr-${member.membershipNumber || member.id}.png`;
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
          <title>QR Code - ${fullName}</title>
          <style>
            body {
              font-family: 'Archivo', system-ui, sans-serif;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              margin: 0;
              padding: 20px;
            }
            .print-card {
              text-align: center;
              border: 2px solid #1CE479;
              border-radius: 12px;
              padding: 24px;
              max-width: 400px;
            }
            .header {
              color: #1CE479;
              font-size: 24px;
              font-weight: bold;
              margin-bottom: 8px;
            }
            .name {
              font-size: 20px;
              font-weight: 600;
              margin: 16px 0 8px;
            }
            .membership {
              color: #666;
              font-size: 14px;
              margin-bottom: 16px;
            }
            .qr-container {
              margin: 16px 0;
            }
            .instructions {
              font-size: 12px;
              color: #666;
              margin-top: 16px;
            }
            @media print {
              body {
                background: white;
              }
            }
          </style>
        </head>
        <body>
          <div class="print-card">
            <div class="header">ChurchAfrica ChMS</div>
            <div class="name">${fullName}</div>
            <div class="membership">Membership: ${member.membershipNumber || 'N/A'}</div>
            <div class="qr-container">
              <img src="${qrDataUrl}" alt="QR Code" style="max-width: 100%;" />
            </div>
            <div class="instructions">
              Scan this QR code at church for quick check-in
            </div>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    
    // Wait for image to load, then print
    setTimeout(() => {
      printWindow.print();
    }, 250);
  };

  const handleShare = async () => {
    if (!qrDataUrl) return;

    try {
      // Convert data URL to blob
      const response = await fetch(qrDataUrl);
      const blob = await response.blob();
      const file = new File([blob], `qr-${member.membershipNumber}.png`, { type: 'image/png' });

      if (navigator.share) {
        await navigator.share({
          title: `QR Code - ${fullName}`,
          text: `Check-in QR code for ${fullName}`,
          files: [file],
        });
      } else {
        // Fallback: copy to clipboard
        await handleCopy();
      }
    } catch (error) {
      console.error('Failed to share:', error);
      // Fallback to download
      handleDownload();
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(qrData);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={member.photo} alt={fullName} />
            <AvatarFallback className="bg-primary/10 text-primary">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <CardTitle className="text-base">{fullName}</CardTitle>
            <p className="text-sm text-muted-foreground">
              {member.membershipNumber || 'No membership #'}
            </p>
          </div>
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
            <QrCode className="h-3 w-3 mr-1" />
            QR Code
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* QR Code Display */}
        <div className="flex justify-center p-6 bg-white rounded-lg">
          <canvas
            ref={canvasRef}
            className="max-w-full h-auto"
            style={{ imageRendering: 'pixelated' }}
          />
        </div>

        {/* Instructions */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Scan this QR code at church for instant check-in
          </p>
        </div>

        {/* Action Buttons */}
        {showActions && (
          <div className="space-y-2">
            {/* Top row: Download, Print, Share */}
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
                className="gap-2"
              >
                <Download className="h-4 w-4" />
                Download
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handlePrint}
                className="gap-2"
              >
                <Printer className="h-4 w-4" />
                Print
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleShare}
                className="gap-2"
              >
                <Share2 className="h-4 w-4" />
                Share
              </Button>
            </div>
            
            {/* Bottom row: Copy and Refresh */}
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                className="gap-2"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copy Data
                  </>
                )}
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                className="gap-2"
                disabled={isGenerating}
              >
                <RefreshCw className={cn("h-4 w-4", isGenerating && "animate-spin")} />
                Refresh
              </Button>
            </div>
          </div>
        )}

        {/* Member Info */}
        <div className="pt-3 border-t text-xs text-muted-foreground space-y-1">
          <div className="flex justify-between">
            <span>Status:</span>
            <span className="font-medium capitalize">{member.status}</span>
          </div>
          {member.contact.phone && (
            <div className="flex justify-between">
              <span>Phone:</span>
              <span className="font-medium">{member.contact.phone}</span>
            </div>
          )}
          {member.contact.email && (
            <div className="flex justify-between">
              <span>Email:</span>
              <span className="font-medium truncate ml-2">{member.contact.email}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Vue Migration Notes:
 * 
 * <template>
 *   <q-card>
 *     <q-card-section>
 *       <div class="row items-center q-gutter-sm">
 *         <q-avatar size="48px">
 *           <img v-if="member.photo" :src="member.photo" />
 *           <span v-else>{{ initials }}</span>
 *         </q-avatar>
 *         <div class="col">
 *           <div class="text-subtitle1">{{ fullName }}</div>
 *           <div class="text-caption text-grey">{{ member.membershipNumber }}</div>
 *         </div>
 *         <q-chip size="sm" color="primary" icon="qr_code">
 *           QR Code
 *         </q-chip>
 *       </div>
 *     </q-card-section>
 *     
 *     <q-separator />
 *     
 *     <q-card-section class="text-center">
 *       <!-- QR Code Canvas -->
 *       <div class="q-pa-md bg-white rounded">
 *         <canvas ref="qrCanvas"></canvas>
 *       </div>
 *       
 *       <div class="text-caption text-grey q-mt-md">
 *         Scan this QR code at church for instant check-in
 *       </div>
 *     </q-card-section>
 *     
 *     <q-separator />
 *     
 *     <q-card-actions>
 *       <q-btn flat icon="download" label="Download" @click="download" />
 *       <q-btn flat icon="print" label="Print" @click="print" />
 *       <q-btn flat icon="share" label="Share" @click="share" />
 *     </q-card-actions>
 *   </q-card>
 * </template>
 * 
 * <script setup lang="ts">
 * import { ref, computed, onMounted } from 'vue';
 * import QRCode from 'qrcode';
 * import type { Member } from '@/types/member';
 * 
 * interface Props {
 *   member: Member;
 *   size?: number;
 * }
 * 
 * const props = withDefaults(defineProps<Props>(), {
 *   size: 200
 * });
 * 
 * const qrCanvas = ref<HTMLCanvasElement>();
 * const qrDataUrl = ref('');
 * 
 * const qrData = computed(() => JSON.stringify({
 *   type: 'member-checkin',
 *   memberId: props.member.id,
 *   name: `${props.member.firstName} ${props.member.lastName}`,
 *   membershipNumber: props.member.membershipNumber,
 *   timestamp: Date.now()
 * }));
 * 
 * onMounted(async () => {
 *   if (qrCanvas.value) {
 *     await QRCode.toCanvas(qrCanvas.value, qrData.value, {
 *       width: props.size,
 *       margin: 1,
 *       color: { dark: '#0A0A0F', light: '#FFFFFF' }
 *     });
 *     qrDataUrl.value = qrCanvas.value.toDataURL('image/png');
 *   }
 * });
 * 
 * const download = () => {
 *   const link = document.createElement('a');
 *   link.download = `qr-${props.member.membershipNumber}.png`;
 *   link.href = qrDataUrl.value;
 *   link.click();
 * };
 * </script>
 */