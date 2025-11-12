import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Alert, AlertDescription } from '../ui/alert';
import { PasswordStrengthMeter } from '../ui-enhanced/PasswordStrengthMeter';
import { 
  User, 
  Mail,
  Phone,
  IdCard,
  Eye,
  EyeOff,
  AlertCircle,
  Loader2,
  Calendar
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface MemberLoginProps {
  onLogin: (credentials: LoginCredentials) => Promise<void>;
  onForgotPassword: (phoneOrEmail: string) => void;
  onRegister: () => void;
  className?: string;
}

export interface LoginCredentials {
  method: 'email' | 'phone' | 'memberid' | 'google';
  identifier: string;
  password?: string;
}

export const MemberLogin: React.FC<MemberLoginProps> = ({
  onLogin,
  onForgotPassword,
  onRegister,
  className = '',
}) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');

  // Auto-detect identifier type
  const detectIdentifierType = (value: string): 'email' | 'phone' | 'memberid' => {
    if (value.includes('@')) return 'email';
    if (value.startsWith('+') || value.startsWith('0') || /^\d+$/.test(value)) return 'phone';
    return 'memberid'; // Assume Member ID format like MEM-2024-001
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setGoogleLoading(true);

    try {
      const { data, error: authError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/member-portal`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (authError) {
        setError(authError.message || 'Google sign-in failed. Please try again.');
        setGoogleLoading(false);
      }
      // If successful, the user will be redirected
    } catch (err: any) {
      setError('An unexpected error occurred with Google sign-in');
      console.error('Google sign-in error:', err);
      setGoogleLoading(false);
    }
  };

  const handleStandardLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const identifierType = detectIdentifierType(identifier);
      
      await onLogin({
        method: identifierType,
        identifier,
        password,
      });
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const getPlaceholderText = () => {
    if (identifier.includes('@')) return 'e.g., member@email.com';
    if (identifier.startsWith('+') || identifier.startsWith('0')) return 'e.g., +234 XXX XXX XXXX';
    if (identifier.length > 0) return 'e.g., MEM-2024-001';
    return 'Email, Phone, or Member ID';
  };

  const getIdentifierIcon = () => {
    if (identifier.includes('@')) return <Mail className="w-4 h-4 text-gray-400" />;
    if (identifier.startsWith('+') || identifier.startsWith('0')) return <Phone className="w-4 h-4 text-gray-400" />;
    if (identifier.length > 0) return <IdCard className="w-4 h-4 text-gray-400" />;
    return <User className="w-4 h-4 text-gray-400" />;
  };

  return (
    <div className={`min-h-screen bg-[#0A0A0F] flex items-center justify-center p-4 ${className}`}>
      <Card className="w-full max-w-lg bg-[#1A1A20] border-[#2A2A30]">
        <CardHeader className="text-center space-y-2">
          <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-2">
            <User className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl text-white">Member Portal</CardTitle>
          <CardDescription className="text-gray-400">
            Sign in to access your church profile
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Google Sign-In - PRIMARY METHOD */}
          <div className="space-y-3">
            <Button
              onClick={handleGoogleSignIn}
              disabled={googleLoading}
              className="w-full bg-white text-gray-900 hover:bg-gray-100 border border-gray-300"
              size="lg"
            >
              {googleLoading ? (
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              ) : (
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              )}
              {googleLoading ? 'Signing in...' : 'Continue with Google'}
            </Button>

            <p className="text-xs text-center text-gray-500">
              Recommended: Fast and secure with your Google account
            </p>
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#2A2A30]"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2 bg-[#1A1A20] text-gray-500">Or sign in with credentials</span>
            </div>
          </div>

          {/* Standard Login Form */}
          <form onSubmit={handleStandardLogin} className="space-y-4">
            {/* Flexible Identifier Input */}
            <div className="space-y-2">
              <Label htmlFor="identifier" className="text-gray-300">
                Email, Phone, or Member ID
              </Label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  {getIdentifierIcon()}
                </div>
                <Input
                  id="identifier"
                  type="text"
                  placeholder={getPlaceholderText()}
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  required
                  className="bg-[#0A0A0F] border-[#2A2A30] text-white pl-10"
                />
              </div>
              <p className="text-xs text-gray-500">
                Enter your email, phone number (+234...), or Member ID (MEM-2024-XXX)
              </p>
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
              <PasswordStrengthMeter password={password} />
            </div>

            {/* Error Message */}
            {error && (
              <Alert variant="destructive" className="border-red-500/50 bg-red-500/10">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Sign In Button */}
            <Button
              type="submit"
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
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
              className="w-full text-gray-400 hover:text-primary"
              onClick={() => onForgotPassword(identifier)}
            >
              Forgot Password?
            </Button>
          </form>

          {/* First Time User Help */}
          <div className="bg-[#0A0A0F] border border-[#2A2A30] rounded-lg p-4 space-y-2">
            <p className="text-sm text-gray-400 font-medium flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              First time signing in?
            </p>
            <p className="text-xs text-gray-500">
              Check your email/SMS for your temporary password sent by the church admin. After your first login, you'll be asked to create a secure password and verify your email.
            </p>
          </div>

          {/* Register Link */}
          <div className="text-center pt-2">
            <p className="text-sm text-gray-400">
              Not a member yet?{' '}
              <Button
                variant="link"
                className="text-primary hover:text-primary/80 p-0"
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