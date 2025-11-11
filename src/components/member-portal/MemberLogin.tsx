import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Alert, AlertDescription } from '../ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  User, 
  Lock, 
  Phone, 
  Mail, 
  QrCode, 
  Fingerprint,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  Loader2
} from 'lucide-react';

interface MemberLoginProps {
  onLogin: (credentials: LoginCredentials) => Promise<void>;
  onForgotPassword: (phoneOrEmail: string) => void;
  onRegister: () => void;
  className?: string;
}

export interface LoginCredentials {
  method: 'phone' | 'email' | 'membership' | 'qr' | 'fingerprint';
  identifier: string;
  password?: string;
  qrData?: string;
  fingerprintData?: string;
}

export const MemberLogin: React.FC<MemberLoginProps> = ({
  onLogin,
  onForgotPassword,
  onRegister,
  className = '',
}) => {
  const [loginMethod, setLoginMethod] = useState<'standard' | 'qr' | 'biometric'>('standard');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [identifierType, setIdentifierType] = useState<'phone' | 'email' | 'membership'>('phone');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await onLogin({
        method: identifierType,
        identifier,
        password,
      });
      setSuccess('Login successful!');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQRLogin = async () => {
    setError('');
    setLoading(true);

    try {
      // This would trigger QR scanner
      alert('Opening QR scanner... (To be implemented)');
      // await onLogin({ method: 'qr', identifier: '', qrData: scannedData });
    } catch (err: any) {
      setError(err.message || 'QR login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleBiometricLogin = async () => {
    setError('');
    setLoading(true);

    try {
      // Check if Web Authentication API is available
      if (!window.PublicKeyCredential) {
        throw new Error('Biometric authentication not supported on this device');
      }

      alert('Place your finger on the biometric scanner... (To be implemented)');
      // Integration with biometric devices
      // await onLogin({ method: 'fingerprint', identifier: '', fingerprintData: data });
    } catch (err: any) {
      setError(err.message || 'Biometric login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen bg-[#0A0A0F] flex items-center justify-center p-4 ${className}`}>
      <Card className="w-full max-w-md bg-[#1A1A20] border-[#2A2A30]">
        <CardHeader className="text-center space-y-2">
          <div className="w-16 h-16 bg-[#1CE479]/20 rounded-full flex items-center justify-center mx-auto mb-2">
            <User className="w-8 h-8 text-[#1CE479]" />
          </div>
          <CardTitle className="text-2xl text-white">Member Portal</CardTitle>
          <CardDescription className="text-gray-400">
            Sign in to access your church profile
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Tabs value={loginMethod} onValueChange={(v) => setLoginMethod(v as any)}>
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="standard">Standard</TabsTrigger>
              <TabsTrigger value="qr">QR Code</TabsTrigger>
              <TabsTrigger value="biometric">Biometric</TabsTrigger>
            </TabsList>

            {/* Standard Login */}
            <TabsContent value="standard">
              <form onSubmit={handleLogin} className="space-y-4">
                {/* Identifier Type Selection */}
                <div className="flex gap-2 mb-4">
                  <Button
                    type="button"
                    variant={identifierType === 'phone' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setIdentifierType('phone')}
                    className={identifierType === 'phone' ? 'bg-[#1CE479] text-[#0A0A0F]' : ''}
                  >
                    <Phone className="w-4 h-4 mr-1" />
                    Phone
                  </Button>
                  <Button
                    type="button"
                    variant={identifierType === 'email' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setIdentifierType('email')}
                    className={identifierType === 'email' ? 'bg-[#1CE479] text-[#0A0A0F]' : ''}
                  >
                    <Mail className="w-4 h-4 mr-1" />
                    Email
                  </Button>
                  <Button
                    type="button"
                    variant={identifierType === 'membership' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setIdentifierType('membership')}
                    className={identifierType === 'membership' ? 'bg-[#1CE479] text-[#0A0A0F]' : ''}
                  >
                    <User className="w-4 h-4 mr-1" />
                    Member ID
                  </Button>
                </div>

                {/* Identifier Input */}
                <div className="space-y-2">
                  <Label htmlFor="identifier" className="text-gray-300">
                    {identifierType === 'phone' && 'Phone Number'}
                    {identifierType === 'email' && 'Email Address'}
                    {identifierType === 'membership' && 'Membership Number'}
                  </Label>
                  <Input
                    id="identifier"
                    type={identifierType === 'email' ? 'email' : 'text'}
                    placeholder={
                      identifierType === 'phone' ? '+234 XXX XXX XXXX' :
                      identifierType === 'email' ? 'your.email@example.com' :
                      'MEM-2024-001'
                    }
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    required
                    className="bg-[#0A0A0F] border-[#2A2A30] text-white"
                  />
                </div>

                {/* Password Input */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-300">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="bg-[#0A0A0F] border-[#2A2A30] text-white pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4 text-gray-400" />
                      ) : (
                        <Eye className="w-4 h-4 text-gray-400" />
                      )}
                    </Button>
                  </div>
                </div>

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

                {/* Login Button */}
                <Button
                  type="submit"
                  className="w-full bg-[#1CE479] text-[#0A0A0F] hover:bg-[#1CE479]/90"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </Button>

                {/* Forgot Password */}
                <Button
                  type="button"
                  variant="link"
                  className="w-full text-gray-400 hover:text-[#1CE479]"
                  onClick={() => onForgotPassword(identifier)}
                >
                  Forgot Password?
                </Button>
              </form>
            </TabsContent>

            {/* QR Code Login */}
            <TabsContent value="qr">
              <div className="space-y-4 text-center">
                <div className="p-8 bg-[#0A0A0F] rounded-lg border-2 border-dashed border-[#2A2A30]">
                  <QrCode className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-400 mb-6">
                    Scan your personal QR code to sign in instantly
                  </p>
                  <Button
                    onClick={handleQRLogin}
                    className="bg-[#1CE479] text-[#0A0A0F] hover:bg-[#1CE479]/90"
                    disabled={loading}
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <QrCode className="w-4 h-4 mr-2" />
                    )}
                    Open QR Scanner
                  </Button>
                </div>

                <div className="text-sm text-gray-500">
                  Don't have your QR code? Contact your church admin or use standard login.
                </div>

                {error && (
                  <Alert variant="destructive" className="border-red-500/50 bg-red-500/10">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
              </div>
            </TabsContent>

            {/* Biometric Login */}
            <TabsContent value="biometric">
              <div className="space-y-4 text-center">
                <div className="p-8 bg-[#0A0A0F] rounded-lg border-2 border-dashed border-[#2A2A30]">
                  <Fingerprint className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-400 mb-6">
                    Use fingerprint scanner for secure, instant login
                  </p>
                  <Button
                    onClick={handleBiometricLogin}
                    className="bg-[#1CE479] text-[#0A0A0F] hover:bg-[#1CE479]/90"
                    disabled={loading}
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Fingerprint className="w-4 h-4 mr-2" />
                    )}
                    Scan Fingerprint
                  </Button>
                </div>

                <div className="text-sm text-gray-500">
                  Fingerprint must be enrolled at church. Contact your admin for setup.
                </div>

                {error && (
                  <Alert variant="destructive" className="border-red-500/50 bg-red-500/10">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
              </div>
            </TabsContent>
          </Tabs>

          {/* Register Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400">
              Not a member yet?{' '}
              <Button
                variant="link"
                className="text-[#1CE479] hover:text-[#1CE479]/80 p-0"
                onClick={onRegister}
              >
                Contact Church Admin
              </Button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
