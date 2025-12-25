/**
 * ChurchAfrica ChMS - Detachable QR Code
 * Floating, draggable QR code popup so admin can continue working
 * while members scan to check in
 */

import React from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import {
  X,
  Minimize2,
  Maximize2,
  QrCode as QrCodeIcon,
  Scan,
  Move,
  Clock,
  MapPin,
} from 'lucide-react';
import { Service, getServiceIcon, SERVICE_TYPE_COLORS } from '../../types/service';
import { cn } from '../ui/utils';
import QRCode from 'react-qr-code';

interface DetachableQRCodeProps {
  service: Service;
  onClose: () => void;
  position?: { x: number; y: number };
  onPositionChange?: (position: { x: number; y: number }) => void;
}

export function DetachableQRCode({
  service,
  onClose,
  position = { x: window.innerWidth - 420, y: 20 },
  onPositionChange,
}: DetachableQRCodeProps) {
  const [isMinimized, setIsMinimized] = React.useState(false);
  const [isDragging, setIsDragging] = React.useState(false);
  const [dragOffset, setDragOffset] = React.useState({ x: 0, y: 0 });
  const [currentPosition, setCurrentPosition] = React.useState(position);

  const qrCodeData = React.useMemo(() => {
    return JSON.stringify({
      type: 'service_checkin',
      serviceId: service.id,
      serviceName: service.name,
      serviceType: service.serviceType,
      date: service.scheduledDate,
      time: service.startTime,
      churchId: 'church_001',
      timestamp: new Date().toISOString(),
    });
  }, [service]);

  const ServiceIcon = getServiceIcon(service.serviceType);

  // Handle drag start
  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button')) return; // Don't drag when clicking buttons
    
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - currentPosition.x,
      y: e.clientY - currentPosition.y,
    });
  };

  // Handle dragging
  React.useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const newX = Math.max(0, Math.min(e.clientX - dragOffset.x, window.innerWidth - 400));
      const newY = Math.max(0, Math.min(e.clientY - dragOffset.y, window.innerHeight - 200));
      
      const newPosition = { x: newX, y: newY };
      setCurrentPosition(newPosition);
      onPositionChange?.(newPosition);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset, onPositionChange]);

  if (isMinimized) {
    return (
      <div
        style={{
          position: 'fixed',
          left: currentPosition.x,
          top: currentPosition.y,
          zIndex: 1000,
        }}
        className="cursor-move"
        onMouseDown={handleMouseDown}
      >
        <Card className="bg-[#1A1A20] w-[300px] shadow-2xl border-[#1CE479]/50">
          <CardHeader className="p-4 pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={cn(
                  "p-1.5 rounded",
                  SERVICE_TYPE_COLORS[service.serviceType].replace('text-', 'bg-') + '/20'
                )}>
                  <QrCodeIcon className={cn("h-4 w-4", SERVICE_TYPE_COLORS[service.serviceType])} />
                </div>
                <div>
                  <CardTitle className="text-sm">{service.name}</CardTitle>
                  <p className="text-xs text-muted-foreground">QR Code Hidden</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMinimized(false)}
                  className="h-7 w-7 p-0"
                >
                  <Maximize2 className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="h-7 w-7 p-0"
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div
      style={{
        position: 'fixed',
        left: currentPosition.x,
        top: currentPosition.y,
        zIndex: 1000,
      }}
      className={cn(
        "transition-opacity",
        isDragging ? "opacity-90 cursor-move" : "cursor-move"
      )}
      onMouseDown={handleMouseDown}
    >
      <Card className="bg-[#1A1A20] w-[380px] shadow-2xl border-[#1CE479]/50">
        <CardHeader className="border-b border-border p-4 pb-3 cursor-move">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className={cn(
                "p-2 rounded-lg",
                SERVICE_TYPE_COLORS[service.serviceType].replace('text-', 'bg-') + '/20'
              )}>
                <ServiceIcon className={cn("h-5 w-5", SERVICE_TYPE_COLORS[service.serviceType])} />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <CardTitle className="text-base">{service.name}</CardTitle>
                  {service.status === 'active' && (
                    <Badge className="bg-[#1CE479] text-black text-[10px] px-1.5 py-0">
                      Live
                    </Badge>
                  )}
                </div>
                <div className="flex flex-col gap-0.5 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-3 w-3" />
                    {service.startTime} - {service.endTime}
                  </div>
                  {service.location?.venue && (
                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-3 w-3" />
                      {service.location.venue}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(true)}
                className="h-7 w-7 p-0"
                title="Minimize"
              >
                <Minimize2 className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-7 w-7 p-0"
                title="Close"
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-muted-foreground cursor-move">
            <Move className="h-3 w-3" />
            <span>Drag to move • Click minimize to hide</span>
          </div>
        </CardHeader>

        <CardContent className="p-6 text-center space-y-4">
          {/* QR Code */}
          <div className="bg-white p-4 rounded-lg inline-block">
            <QRCode
              value={qrCodeData}
              size={240}
              level="H"
              className="mx-auto"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Scan className="h-4 w-4 text-[#1CE479]" />
              <span>Scan with phone camera to check in</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Service ID: {service.id.slice(0, 8)}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
