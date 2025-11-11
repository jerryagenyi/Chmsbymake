import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Alert, AlertDescription } from '../ui/alert';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import {
  Fingerprint,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Shield,
  Trash2,
  RefreshCw
} from 'lucide-react';

interface BiometricEnrollmentProps {
  memberId: string;
  memberName: string;
  onEnroll: (fingerprintData: string) => Promise<void>;
  onDelete?: () => Promise<void>;
  existingEnrollment?: {
    enrolledAt: string;
    deviceInfo: string;
  };
}

export const BiometricEnrollment: React.FC<BiometricEnrollmentProps> = ({
  memberId,
  memberName,
  onEnroll,
  onDelete,
  existingEnrollment,
}) => {
  const [enrolling, setEnrolling] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [deviceConnected, setDeviceConnected] = useState(false);

  const enrollmentSteps = [
    'Connecting to fingerprint device...',
    'Place your finger on the scanner',
    'Lift and place again',
    'One more time...',
    'Processing fingerprint data',
    'Enrollment complete!',
  ];

  const checkDeviceConnection = async () => {
    setError('');
    setDeviceConnected(false);

    try {
      // Check if WebUSB is supported
      if (!navigator.usb) {
        throw new Error('WebUSB not supported. Please use Chrome, Edge, or Opera browser.');
      }

      // Request USB device (fingerprint scanner)
      const device = await navigator.usb.requestDevice({
        filters: [
          { vendorId: 0x2808 }, // ZKTeco
          { vendorId: 0x1491 }, // Futronic
          { vendorId: 0x05ba }, // Digital Persona
        ],
      });

      if (device) {
        setDeviceConnected(true);
        setSuccess('Fingerprint device connected successfully!');
      }
    } catch (err: any) {
      if (err.name === 'NotFoundError') {
        setError('No fingerprint device found. Please connect the device and try again.');
      } else if (err.name === 'SecurityError') {
        setError('Access denied. Please allow USB device access.');
      } else {
        setError(err.message || 'Failed to connect to fingerprint device');
      }
    }
  };

  const startEnrollment = async () => {
    if (!deviceConnected) {
      setError('Please connect fingerprint device first');
      return;
    }

    setEnrolling(true);
    setProgress(0);
    setCurrentStep(0);
    setError('');
    setSuccess('');

    try {
      // Simulate fingerprint enrollment process
      for (let i = 0; i < enrollmentSteps.length; i++) {
        setCurrentStep(i);
        setProgress((i / enrollmentSteps.length) * 100);

        // Wait for user action (simulated)
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Simulate device communication
        if (i === 1 || i === 2 || i === 3) {
          // Simulate fingerprint capture
          const captured = Math.random() > 0.1; // 90% success rate
          if (!captured) {
            throw new Error('Failed to capture fingerprint. Please ensure finger is clean and dry.');
          }
        }
      }

      setProgress(100);

      // Generate mock fingerprint template (in production, this comes from device)
      const fingerprintData = btoa(JSON.stringify({
        memberId,
        template: Array.from({ length: 512 }, () =>
          Math.floor(Math.random() * 256)
        ).join(','),
        quality: 95,
        enrolledAt: new Date().toISOString(),
      }));

      await onEnroll(fingerprintData);
      setSuccess('Fingerprint enrolled successfully!');
    } catch (err: any) {
      setError(err.message || 'Enrollment failed');
    } finally {
      setEnrolling(false);
    }
  };

  const handleDelete = async () => {
    if (!onDelete) return;

    if (!confirm('Are you sure you want to remove fingerprint enrollment? You will need to re-enroll to use fingerprint authentication.')) {
      return;
    }

    try {
      await onDelete();
      setSuccess('Fingerprint enrollment removed successfully');
      setDeviceConnected(false);
    } catch (err: any) {
      setError(err.message || 'Failed to remove enrollment');
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-[#1A1A20] border-[#2A2A30]">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white flex items-center gap-2">
                <Fingerprint className="w-6 h-6 text-[#1CE479]" />
                Fingerprint Enrollment
              </CardTitle>
              <CardDescription className="text-gray-400">
                Enroll your fingerprint for fast and secure check-in
              </CardDescription>
            </div>
            {existingEnrollment && (
              <Badge className="bg-[#1CE479]/10 text-[#1CE479] border-[#1CE479]/20">
                <Shield className="w-3 h-3 mr-1" />
                Enrolled
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Error/Success Messages */}
          {error && (
            <Alert variant="destructive" className="border-red-500/50 bg-red-500/10">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {success && (
            <Alert className="border-[#1CE479]/50 bg-[#1CE479]/10">
              <CheckCircle2 className="h-4 w-4 text-[#1CE479]" />
              <AlertDescription className="text-[#1CE479]">{success}</AlertDescription>
            </Alert>
          )}

          {/* Existing Enrollment Info */}
          {existingEnrollment && (
            <div className="p-4 bg-[#0A0A0F] rounded-lg border border-[#2A2A30]">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <h3 className="text-white flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-[#1CE479]" />
                    Fingerprint Enrolled
                  </h3>
                  <div className="text-sm text-gray-400 space-y-1">
                    <p>
                      <strong>Member:</strong> {memberName}
                    </p>
                    <p>
                      <strong>Enrolled:</strong>{' '}
                      {new Date(existingEnrollment.enrolledAt).toLocaleDateString()}
                    </p>
                    <p>
                      <strong>Device:</strong> {existingEnrollment.deviceInfo}
                    </p>
                  </div>
                </div>
                {onDelete && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDelete}
                    className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Remove
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Device Connection */}
          {!existingEnrollment && (
            <>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-[#0A0A0F] rounded-lg border border-[#2A2A30]">
                  <div>
                    <p className="text-white">Fingerprint Device</p>
                    <p className="text-sm text-gray-400">
                      {deviceConnected
                        ? 'Device connected and ready'
                        : 'Connect a compatible fingerprint scanner'}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={checkDeviceConnection}
                    className={
                      deviceConnected
                        ? 'border-[#1CE479] text-[#1CE479]'
                        : 'border-[#2A2A30]'
                    }
                  >
                    {deviceConnected ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Connected
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Connect Device
                      </>
                    )}
                  </Button>
                </div>

                {/* Supported Devices */}
                <div className="p-4 bg-[#0A0A0F] rounded-lg border border-[#2A2A30]">
                  <p className="text-sm text-gray-400 mb-2">Supported Devices:</p>
                  <ul className="text-sm text-gray-500 space-y-1">
                    <li>• ZKTeco fingerprint scanners</li>
                    <li>• Futronic FS88 series</li>
                    <li>• Digital Persona readers</li>
                    <li>• Any WebUSB compatible device</li>
                  </ul>
                </div>
              </div>

              {/* Enrollment Process */}
              {enrolling && (
                <div className="space-y-4 p-6 bg-[#0A0A0F] rounded-lg border-2 border-[#1CE479]/50">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-[#1CE479]/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                      <Fingerprint className="w-10 h-10 text-[#1CE479]" />
                    </div>
                    <h3 className="text-xl text-white mb-2">
                      {enrollmentSteps[currentStep]}
                    </h3>
                    <p className="text-gray-400">Step {currentStep + 1} of {enrollmentSteps.length}</p>
                  </div>

                  <Progress value={progress} className="h-3 bg-[#2A2A30]" />

                  <div className="text-center text-sm text-gray-400">
                    Please follow the instructions and keep your finger on the scanner
                  </div>
                </div>
              )}

              {/* Start Enrollment Button */}
              {!enrolling && deviceConnected && (
                <Button
                  onClick={startEnrollment}
                  disabled={!deviceConnected}
                  className="w-full bg-[#1CE479] text-[#0A0A0F] hover:bg-[#1CE479]/90"
                >
                  <Fingerprint className="w-4 h-4 mr-2" />
                  Start Fingerprint Enrollment
                </Button>
              )}
            </>
          )}

          {/* Instructions */}
          <div className="p-4 bg-[#0A0A0F] rounded-lg border border-[#2A2A30]">
            <p className="text-sm text-white mb-2">Enrollment Tips:</p>
            <ul className="text-sm text-gray-400 space-y-1">
              <li>• Ensure your finger is clean and dry</li>
              <li>• Place your finger flat on the scanner</li>
              <li>• Apply gentle, even pressure</li>
              <li>• Follow the on-screen instructions</li>
              <li>• The process takes about 30-60 seconds</li>
            </ul>
          </div>

          {/* Browser Compatibility Warning */}
          <Alert className="border-yellow-500/50 bg-yellow-500/10">
            <AlertCircle className="h-4 h-4 text-yellow-400" />
            <AlertDescription className="text-yellow-300 text-sm">
              <strong>Note:</strong> Biometric enrollment requires Chrome, Edge, or Opera browser
              with WebUSB support. Safari and Firefox are not supported.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
};
