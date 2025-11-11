import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { QRCodeScanner } from './QRCodeScanner';
import {
  CheckCircle2,
  User,
  Clock,
  AlertCircle,
  Users,
  Sparkles
} from 'lucide-react';

interface CheckInKioskProps {
  serviceName: string;
  serviceTime: string;
  onCheckIn: (memberId: string) => Promise<{
    success: boolean;
    member?: {
      id: string;
      name: string;
      photo?: string;
      membershipNumber?: string;
      isFirstTime?: boolean;
    };
    message?: string;
  }>;
}

export const CheckInKiosk: React.FC<CheckInKioskProps> = ({
  serviceName,
  serviceTime,
  onCheckIn,
}) => {
  const [currentMember, setCurrentMember] = useState<any>(null);
  const [checkInCount, setCheckInCount] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleScan = async (data: { memberId: string; name: string; membershipNumber?: string }) => {
    setError('');

    try {
      const result = await onCheckIn(data.memberId);

      if (result.success && result.member) {
        setCurrentMember(result.member);
        setShowSuccess(true);
        setCheckInCount(prev => prev + 1);

        // Auto-reset after 3 seconds
        setTimeout(() => {
          setShowSuccess(false);
          setCurrentMember(null);
        }, 3000);
      } else {
        setError(result.message || 'Check-in failed');
        setTimeout(() => setError(''), 3000);
      }
    } catch (err: any) {
      setError(err.message || 'Check-in failed');
      setTimeout(() => setError(''), 3000);
    }
  };

  const initials = currentMember
    ? currentMember.name.split(' ').map((n: string) => n[0]).join('').toUpperCase()
    : '';

  return (
    <div className="min-h-screen bg-[#0A0A0F] flex flex-col">
      {/* Header */}
      <div className="bg-[#1A1A20] border-b border-[#2A2A30] p-6">
        <div className="max-w-2xl mx-auto">
          <div className="text-center space-y-2">
            <h1 className="text-3xl text-white">{serviceName}</h1>
            <p className="text-xl text-gray-400">{serviceTime}</p>
            <div className="flex items-center justify-center gap-2 mt-4">
              <Users className="w-5 h-5 text-[#1CE479]" />
              <span className="text-2xl text-[#1CE479]">{checkInCount}</span>
              <span className="text-gray-400">checked in</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-2xl w-full">
          {showSuccess && currentMember ? (
            /* Success State */
            <Card className="bg-[#1A1A20] border-[#1CE479] border-2 animate-in fade-in zoom-in">
              <CardContent className="pt-12 pb-12">
                <div className="text-center space-y-6">
                  <div className="w-24 h-24 bg-[#1CE479]/20 rounded-full flex items-center justify-center mx-auto animate-pulse">
                    <CheckCircle2 className="w-12 h-12 text-[#1CE479]" />
                  </div>

                  <div className="space-y-2">
                    <h2 className="text-4xl text-white">Welcome!</h2>
                    {currentMember.isFirstTime && (
                      <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                        <Sparkles className="w-3 h-3 mr-1" />
                        First Time Visitor
                      </Badge>
                    )}
                  </div>

                  <Avatar className="w-32 h-32 mx-auto border-4 border-[#1CE479]">
                    <AvatarImage src={currentMember.photo} alt={currentMember.name} />
                    <AvatarFallback className="bg-[#1CE479]/20 text-[#1CE479] text-4xl">
                      {initials}
                    </AvatarFallback>
                  </Avatar>

                  <div className="space-y-1">
                    <h3 className="text-3xl text-white">{currentMember.name}</h3>
                    {currentMember.membershipNumber && (
                      <p className="text-xl text-gray-400">
                        {currentMember.membershipNumber}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-center gap-2 text-[#1CE479]">
                    <CheckCircle2 className="w-6 h-6" />
                    <span className="text-2xl">Checked In Successfully</span>
                  </div>

                  <p className="text-gray-400 text-lg">
                    Have a blessed service! 🙏
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : error ? (
            /* Error State */
            <Card className="bg-[#1A1A20] border-red-500/50 border-2 animate-in fade-in shake">
              <CardContent className="pt-12 pb-12">
                <div className="text-center space-y-6">
                  <div className="w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center mx-auto">
                    <AlertCircle className="w-12 h-12 text-red-400" />
                  </div>

                  <div className="space-y-2">
                    <h2 className="text-3xl text-white">Oops!</h2>
                    <p className="text-xl text-red-400">{error}</p>
                  </div>

                  <p className="text-gray-400">
                    Please try again or contact an admin for assistance
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            /* Scanning State */
            <Card className="bg-[#1A1A20] border-[#2A2A30]">
              <CardContent className="pt-8 pb-8">
                <div className="space-y-6">
                  <div className="text-center space-y-2">
                    <div className="w-20 h-20 bg-[#1CE479]/20 rounded-full flex items-center justify-center mx-auto">
                      <User className="w-10 h-10 text-[#1CE479]" />
                    </div>
                    <h2 className="text-3xl text-white">Scan Your QR Code</h2>
                    <p className="text-lg text-gray-400">
                      Position your QR code in front of the camera
                    </p>
                  </div>

                  <div className="max-w-md mx-auto">
                    <QRCodeScanner
                      onScanSuccess={handleScan}
                      onScanError={(err) => setError(err)}
                      isActive={true}
                    />
                  </div>

                  <div className="text-center space-y-2 pt-6 border-t border-[#2A2A30]">
                    <p className="text-sm text-gray-500">
                      Don't have a QR code?
                    </p>
                    <p className="text-sm text-gray-400">
                      Contact a greeter or admin for assistance
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="bg-[#1A1A20] border-t border-[#2A2A30] p-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 text-gray-500 text-sm">
            <Clock className="w-4 h-4" />
            <span>{new Date().toLocaleTimeString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
