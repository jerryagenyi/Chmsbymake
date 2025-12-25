/**
 * ChurchAfrica ChMS - QR Code Scanner
 * Scan member QR codes for quick check-in
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Alert, AlertDescription } from '../ui/alert';
import { Badge } from '../ui/badge';
import { 
  Camera,
  CameraOff,
  ScanLine,
  CheckCircle2,
  AlertCircle,
  Upload,
  X
} from 'lucide-react';
import { cn } from '../ui/utils';

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

interface ScanResult {
  type: 'success' | 'error' | 'info';
  message: string;
  data?: any;
}

export function QRCodeScanner({
  onScanSuccess,
  onScanError,
  isActive = false,
  className,
}: QRCodeScannerProps) {
  const [scanning, setScanning] = React.useState(false);
  const [hasCamera, setHasCamera] = React.useState(true);
  const [scanResult, setScanResult] = React.useState<ScanResult | null>(null);
  const [facingMode, setFacingMode] = React.useState<'user' | 'environment'>('environment');
  
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const streamRef = React.useRef<MediaStream | null>(null);
  const scanIntervalRef = React.useRef<NodeJS.Timeout | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Start camera (UI/UX only - not actually starting camera for prototype)
  const startCamera = async () => {
    // UI/UX PROTOTYPE: In production, this would call:
    // const stream = await navigator.mediaDevices.getUserMedia({ video: {...} })
    // For now, we just simulate the UI state
    setScanning(true);
    setHasCamera(true);
    
    // Simulate scanning UI feedback
    setTimeout(() => {
      setScanResult({
        type: 'info',
        message: 'UI/UX Prototype: Camera scanning simulated. In production, this would scan real QR codes.',
      });
    }, 1000);
  };

  // Stop camera
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }
    setScanning(false);
  };

  // Scan QR code from video frame
  const scanFrame = async () => {
    if (!videoRef.current || !canvasRef.current || !scanning) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx || video.readyState !== video.HAVE_ENOUGH_DATA) return;

    // Draw video frame to canvas
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Get image data
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    try {
      // Use jsQR library to decode
      const jsQR = await import('jsqr');
      const code = jsQR.default(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: 'dontInvert',
      });

      if (code && code.data) {
        handleScanResult(code.data);
      }
    } catch (error) {
      console.error('QR decode error:', error);
    }
  };

  // Start scanning loop
  const startScanning = () => {
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
    }
    scanIntervalRef.current = setInterval(scanFrame, 300); // Scan every 300ms
  };

  // Handle scan result
  const handleScanResult = (data: string) => {
    try {
      const parsed = JSON.parse(data);

      // Validate QR code format
      if (parsed.type === 'member-checkin' && parsed.memberId) {
        setScanResult({
          type: 'success',
          message: `Successfully scanned: ${parsed.name}`,
          data: parsed,
        });

        // Play success sound (optional)
        playSuccessSound();

        // Call success callback
        onScanSuccess({
          memberId: parsed.memberId,
          name: parsed.name,
          membershipNumber: parsed.membershipNumber,
        });

        // Stop scanning temporarily
        stopCamera();

        // Auto-clear result after 3 seconds
        setTimeout(() => {
          setScanResult(null);
        }, 3000);
      } else {
        throw new Error('Invalid QR code format');
      }
    } catch (error) {
      const errorMessage = 'Invalid QR code. Please scan a ChurchAfrica member QR code.';
      setScanResult({
        type: 'error',
        message: errorMessage,
      });
      
      if (onScanError) {
        onScanError(errorMessage);
      }

      // Auto-clear error after 3 seconds
      setTimeout(() => {
        setScanResult(null);
      }, 3000);
    }
  };

  // Upload and scan QR from image file
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const image = new Image();
      const reader = new FileReader();

      reader.onload = async (e) => {
        if (!e.target?.result || !canvasRef.current) return;

        image.onload = async () => {
          const canvas = canvasRef.current!;
          const ctx = canvas.getContext('2d');
          if (!ctx) return;

          // Draw image to canvas
          canvas.width = image.width;
          canvas.height = image.height;
          ctx.drawImage(image, 0, 0);

          // Get image data
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

          try {
            // Decode QR code
            const jsQR = await import('jsqr');
            const code = jsQR.default(imageData.data, imageData.width, imageData.height);

            if (code && code.data) {
              handleScanResult(code.data);
            } else {
              setScanResult({
                type: 'error',
                message: 'No QR code found in image. Please try another image.',
              });
            }
          } catch (error) {
            console.error('QR decode error:', error);
            setScanResult({
              type: 'error',
              message: 'Failed to decode QR code from image.',
            });
          }
        };

        image.src = e.target.result as string;
      };

      reader.readAsDataURL(file);
    } catch (error) {
      console.error('File upload error:', error);
      setScanResult({
        type: 'error',
        message: 'Failed to process image file.',
      });
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Play success sound
  const playSuccessSound = () => {
    try {
      // Simple beep sound using Web Audio API
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.2);
    } catch (error) {
      // Silently fail if audio not supported
      console.log('Audio not supported');
    }
  };

  // Toggle camera facing mode
  const toggleCamera = () => {
    stopCamera();
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
    setTimeout(startCamera, 100);
  };

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // Auto-start if active prop changes
  React.useEffect(() => {
    if (isActive && !scanning) {
      startCamera();
    } else if (!isActive && scanning) {
      stopCamera();
    }
  }, [isActive]);

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={cn(
              "h-10 w-10 rounded-full flex items-center justify-center",
              scanning ? "bg-success/10" : "bg-muted"
            )}>
              <Camera className={cn(
                "h-5 w-5",
                scanning ? "text-success" : "text-muted-foreground"
              )} />
            </div>
            <div>
              <CardTitle className="text-base">QR Code Scanner</CardTitle>
              <p className="text-sm text-muted-foreground">
                {scanning ? 'Scanning...' : 'Start camera to scan'}
              </p>
            </div>
          </div>

          {scanning && (
            <Badge variant="outline" className="bg-success/10 text-success border-success/20 gap-1">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
              </span>
              Active
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Camera View */}
        <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
          <video
            ref={videoRef}
            className={cn(
              "w-full h-full object-cover",
              !scanning && "hidden"
            )}
            playsInline
            muted
          />
          
          {!scanning && (
            <div className="absolute inset-0 flex items-center justify-center bg-muted/50">
              {hasCamera ? (
                <div className="text-center">
                  <CameraOff className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Camera inactive</p>
                </div>
              ) : (
                <div className="text-center px-4">
                  <AlertCircle className="h-12 w-12 mx-auto mb-2 text-warning" />
                  <p className="text-sm text-muted-foreground">
                    Camera not available.<br/>
                    Upload QR code image instead.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Scanning Overlay */}
          {scanning && (
            <div className="absolute inset-0 pointer-events-none">
              {/* Corner brackets */}
              <div className="absolute inset-0 m-8 border-2 border-primary rounded-lg">
                <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary rounded-tl-lg -mt-1 -ml-1"></div>
                <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary rounded-tr-lg -mt-1 -mr-1"></div>
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary rounded-bl-lg -mb-1 -ml-1"></div>
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary rounded-br-lg -mb-1 -mr-1"></div>
              </div>

              {/* Scan line animation */}
              <div className="absolute inset-x-0 top-1/2 -translate-y-1/2">
                <div className="h-0.5 bg-primary shadow-[0_0_10px_rgba(28,228,121,0.5)] animate-pulse"></div>
              </div>

              {/* Scan icon */}
              <div className="absolute top-4 left-4 bg-primary/90 rounded-lg p-2">
                <ScanLine className="h-4 w-4 text-primary-foreground" />
              </div>
            </div>
          )}

          {/* Hidden canvas for QR decoding */}
          <canvas ref={canvasRef} className="hidden" />
        </div>

        {/* Scan Result */}
        {scanResult && (
          <Alert className={cn(
            scanResult.type === 'success' 
              ? 'border-success bg-success/10'
              : 'border-destructive bg-destructive/10'
          )}>
            {scanResult.type === 'success' ? (
              <CheckCircle2 className="h-4 w-4 text-success" />
            ) : (
              <AlertCircle className="h-4 w-4 text-destructive" />
            )}
            <AlertDescription className={cn(
              scanResult.type === 'success' ? 'text-success' : 'text-destructive'
            )}>
              {scanResult.message}
            </AlertDescription>
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-2 right-2"
              onClick={() => setScanResult(null)}
            >
              <X className="h-4 w-4" />
            </Button>
          </Alert>
        )}

        {/* Control Buttons */}
        <div className="grid grid-cols-2 gap-2">
          {!scanning ? (
            <Button
              onClick={startCamera}
              className="col-span-2 gap-2"
              disabled={!hasCamera}
            >
              <Camera className="h-4 w-4" />
              Start Camera
            </Button>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={stopCamera}
                className="gap-2"
              >
                <CameraOff className="h-4 w-4" />
                Stop
              </Button>
              <Button
                variant="outline"
                onClick={toggleCamera}
                className="gap-2"
              >
                <Camera className="h-4 w-4" />
                Flip
              </Button>
            </>
          )}
        </div>

        {/* Upload Option */}
        <div className="pt-3 border-t">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
          <Button
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            className="w-full gap-2"
          >
            <Upload className="h-4 w-4" />
            Upload QR Image
          </Button>
          <p className="text-xs text-muted-foreground text-center mt-2">
            No camera? Upload a saved QR code image
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Vue Migration Notes:
 * 
 * Use Quasar's QUploader and custom camera component:
 * 
 * <template>
 *   <q-card>
 *     <q-card-section>
 *       <div class="row items-center justify-between">
 *         <div class="row items-center q-gutter-sm">
 *           <q-avatar :color="scanning ? 'positive' : 'grey'" icon="camera" />
 *           <div>
 *             <div class="text-subtitle1">QR Code Scanner</div>
 *             <div class="text-caption text-grey">
 *               {{ scanning ? 'Scanning...' : 'Start camera to scan' }}
 *             </div>
 *           </div>
 *         </div>
 *         <q-badge v-if="scanning" color="positive">
 *           <q-spinner-dots size="xs" class="q-mr-xs" />
 *           Active
 *         </q-badge>
 *       </div>
 *     </q-card-section>
 *     
 *     <q-separator />
 *     
 *     <q-card-section>
 *       <!-- Video preview -->
 *       <div class="relative bg-black rounded" style="aspect-ratio: 16/9;">
 *         <video
 *           ref="video"
 *           v-show="scanning"
 *           class="full-width full-height"
 *           playsinline
 *           muted
 *         />
 *         
 *         <div v-if="!scanning" class="absolute-center text-center">
 *           <q-icon name="videocam_off" size="48px" color="grey" />
 *           <div class="text-caption text-grey">Camera inactive</div>
 *         </div>
 *         
 *         <!-- Scanning overlay -->
 *         <div v-if="scanning" class="absolute-full">
 *           <div class="scan-frame"></div>
 *           <div class="scan-line"></div>
 *         </div>
 *       </div>
 *       
 *       <!-- Scan result -->
 *       <q-banner
 *         v-if="scanResult"
 *         :class="scanResult.type === 'success' ? 'bg-positive-1' : 'bg-negative-1'"
 *         class="q-mt-md"
 *       >
 *         <template v-slot:avatar>
 *           <q-icon
 *             :name="scanResult.type === 'success' ? 'check_circle' : 'error'"
 *             :color="scanResult.type === 'success' ? 'positive' : 'negative'"
 *           />
 *         </template>
 *         {{ scanResult.message }}
 *         <template v-slot:action>
 *           <q-btn flat icon="close" @click="scanResult = null" />
 *         </template>
 *       </q-banner>
 *     </q-card-section>
 *     
 *     <q-separator />
 *     
 *     <q-card-actions>
 *       <q-btn
 *         v-if="!scanning"
 *         color="primary"
 *         icon="camera"
 *         label="Start Camera"
 *         @click="startCamera"
 *         class="full-width"
 *       />
 *       <template v-else>
 *         <q-btn flat icon="videocam_off" label="Stop" @click="stopCamera" />
 *         <q-btn flat icon="flip_camera_ios" label="Flip" @click="toggleCamera" />
 *       </template>
 *     </q-card-actions>
 *     
 *     <q-separator />
 *     
 *     <q-card-section>
 *       <q-uploader
 *         label="Upload QR Image"
 *         accept="image/*"
 *         @added="handleFileUpload"
 *         flat
 *         bordered
 *       >
 *         <template v-slot:header>
 *           <div class="text-center full-width">
 *             <q-icon name="upload" size="sm" />
 *             <div class="text-caption">No camera? Upload QR image</div>
 *           </div>
 *         </template>
 *       </q-uploader>
 *     </q-card-section>
 *   </q-card>
 * </template>
 * 
 * <script setup lang="ts">
 * import { ref, onUnmounted } from 'vue';
 * import jsQR from 'jsqr';
 * 
 * const scanning = ref(false);
 * const video = ref<HTMLVideoElement>();
 * const stream = ref<MediaStream | null>(null);
 * const scanResult = ref<any>(null);
 * 
 * const startCamera = async () => {
 *   try {
 *     stream.value = await navigator.mediaDevices.getUserMedia({
 *       video: { facingMode: 'environment' }
 *     });
 *     
 *     if (video.value) {
 *       video.value.srcObject = stream.value;
 *       video.value.play();
 *       scanning.value = true;
 *       startScanning();
 *     }
 *   } catch (error) {
 *     console.error('Camera error:', error);
 *   }
 * };
 * 
 * const stopCamera = () => {
 *   if (stream.value) {
 *     stream.value.getTracks().forEach(track => track.stop());
 *   }
 *   scanning.value = false;
 * };
 * 
 * onUnmounted(() => stopCamera());
 * </script>
 * 
 * <style scoped>
 * .scan-frame {
 *   position: absolute;
 *   inset: 2rem;
 *   border: 2px solid #1CE479;
 *   border-radius: 8px;
 *   pointer-events: none;
 * }
 * 
 * .scan-line {
 *   position: absolute;
 *   top: 50%;
 *   left: 0;
 *   right: 0;
 *   height: 2px;
 *   background: #1CE479;
 *   box-shadow: 0 0 10px rgba(28, 228, 121, 0.5);
 *   animation: scan 2s ease-in-out infinite;
 * }
 * 
 * @keyframes scan {
 *   0%, 100% { transform: translateY(-100px); }
 *   50% { transform: translateY(100px); }
 * }
 * </style>
 */