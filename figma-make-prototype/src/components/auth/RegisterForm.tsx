/**
 * ChurchAfrica ChMS - Registration Form
 * New user registration with Google OAuth support
 */

import React, { useState } from 'react';
import { useAuth, UserRole } from '../../contexts/AuthContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Alert, AlertDescription } from '../ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Separator } from '../ui/separator';
import { PasswordStrengthMeter } from '../ui-enhanced/PasswordStrengthMeter';
import { Church, Mail, Lock, User, Loader2, AlertCircle, UserCircle, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface RegisterFormProps {
  onSuccess?: () => void;
  onSwitchToLogin?: () => void;
}

export function RegisterForm({ onSuccess, onSwitchToLogin }: RegisterFormProps) {
  const { signUp } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'staff' as UserRole,
  });
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  function handleChange(field: string, value: string) {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    // Validation
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!formData.name.trim()) {
      setError('Name is required');
      return;
    }

    setLoading(true);

    try {
      const { error } = await signUp(
        formData.email,
        formData.password,
        formData.name,
        formData.role
      );

      if (error) {
        setError(error.message || 'Registration failed');
      } else {
        onSuccess?.();
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleSignUp() {
    setError(null);
    setGoogleLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) {
        setError(error.message || 'Google sign-up failed');
        setGoogleLoading(false);
      }
      // If successful, the user will be redirected
      // Don't set loading to false as the page will redirect
    } catch (err) {
      setError('An unexpected error occurred with Google sign-up');
      console.error('Google sign-up error:', err);
      setGoogleLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-lg">
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-center mb-4">
          <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
            <Church className="h-7 w-7 text-primary" />
          </div>
        </div>
        <CardTitle className="text-center">Create Admin Account</CardTitle>
        <CardDescription className="text-center">
          Register as a church administrator or staff member
        </CardDescription>
        <Alert className="mt-4 bg-info/10 border-info/20 text-info-foreground">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-xs">
            This registration is for church administrators and staff only. Regular members are added by administrators through the Member Management system.
          </AlertDescription>
        </Alert>
      </CardHeader>

      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Google Sign Up Button */}
        <Button
          type="button"
          variant="outline"
          className="w-full touch-target"
          onClick={handleGoogleSignUp}
          disabled={loading || googleLoading}
        >
          {googleLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Connecting to Google...
            </>
          ) : (
            <>
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </>
          )}
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator className="w-full" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with email
            </span>
          </div>
        </div>

        {/* Email/Password Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="pl-9"
                required
                disabled={loading || googleLoading}
                autoComplete="name"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="john@church.com"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="pl-9"
                required
                disabled={loading || googleLoading}
                autoComplete="email"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Administrative Role</Label>
            <div className="relative">
              <UserCircle className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
              <Select
                value={formData.role}
                onValueChange={(value) => handleChange('role', value)}
                disabled={loading || googleLoading}
              >
                <SelectTrigger className="pl-9">
                  <SelectValue placeholder="Select your administrative role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="staff">Staff Member</SelectItem>
                  <SelectItem value="pastor">Pastor / Minister</SelectItem>
                  <SelectItem value="admin">System Administrator</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <p className="text-xs text-muted-foreground">
              All registrations require approval from an existing administrator before access is granted.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                className="pl-9"
                required
                disabled={loading || googleLoading}
                autoComplete="new-password"
                minLength={6}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <PasswordStrengthMeter password={formData.password} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={(e) => handleChange('confirmPassword', e.target.value)}
                className="pl-9"
                required
                disabled={loading || googleLoading}
                autoComplete="new-password"
                minLength={6}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full touch-target"
            disabled={loading || googleLoading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating account...
              </>
            ) : (
              'Create Account'
            )}
          </Button>
        </form>
      </CardContent>

      <CardFooter>
        {onSwitchToLogin && (
          <div className="text-center text-sm text-muted-foreground w-full">
            Already have an account?{' '}
            <Button
              type="button"
              variant="link"
              className="px-1 h-auto"
              onClick={onSwitchToLogin}
              disabled={loading || googleLoading}
            >
              Sign in
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}

/**
 * Vue Migration Notes:
 * 
 * // Vue 3 + Quasar equivalent:
 * <template>
 *   <q-card class="register-card">
 *     <q-card-section class="text-center">
 *       <q-avatar size="48px" color="primary" class="q-mb-md">
 *         <q-icon name="church" />
 *       </q-avatar>
 *       <div class="text-h6">Create Account</div>
 *       <div class="text-subtitle2 text-grey">Join your church community</div>
 *     </q-card-section>
 * 
 *     <q-form @submit="handleSubmit">
 *       <q-card-section>
 *         <q-banner v-if="error" class="bg-negative text-white q-mb-md">
 *           {{ error }}
 *         </q-banner>
 * 
 *         <q-input
 *           v-model="formData.name"
 *           label="Full Name"
 *           outlined
 *           :disable="loading"
 *           :rules="[val => !!val || 'Name is required']"
 *         >
 *           <template v-slot:prepend>
 *             <q-icon name="person" />
 *           </template>
 *         </q-input>
 * 
 *         <q-input
 *           v-model="formData.email"
 *           label="Email"
 *           type="email"
 *           outlined
 *           class="q-mt-md"
 *           :disable="loading"
 *           :rules="[val => !!val || 'Email is required']"
 *         >
 *           <template v-slot:prepend>
 *             <q-icon name="mail" />
 *           </template>
 *         </q-input>
 * 
 *         <q-select
 *           v-model="formData.role"
 *           label="Role"
 *           outlined
 *           class="q-mt-md"
 *           :disable="loading"
 *           :options="roleOptions"
 *           emit-value
 *           map-options
 *         >
 *           <template v-slot:prepend>
 *             <q-icon name="badge" />
 *           </template>
 *         </q-select>
 * 
 *         <q-input
 *           v-model="formData.password"
 *           label="Password"
 *           type="password"
 *           outlined
 *           class="q-mt-md"
 *           :disable="loading"
 *           :rules="[
 *             val => !!val || 'Password is required',
 *             val => val.length >= 6 || 'At least 6 characters'
 *           ]"
 *         >
 *           <template v-slot:prepend>
 *             <q-icon name="lock" />
 *           </template>
 *         </q-input>
 * 
 *         <q-input
 *           v-model="formData.confirmPassword"
 *           label="Confirm Password"
 *           type="password"
 *           outlined
 *           class="q-mt-md"
 *           :disable="loading"
 *           :rules="[
 *             val => !!val || 'Please confirm password',
 *             val => val === formData.password || 'Passwords do not match'
 *           ]"
 *         >
 *           <template v-slot:prepend>
 *             <q-icon name="lock" />
 *           </template>
 *         </q-input>
 *       </q-card-section>
 * 
 *       <q-card-actions vertical>
 *         <q-btn
 *           type="submit"
 *           color="primary"
 *           label="Create Account"
 *           :loading="loading"
 *           unelevated
 *           class="full-width"
 *         />
 * 
 *         <div class="text-center q-mt-md">
 *           Already have an account?
 *           <q-btn flat label="Sign in" @click="$emit('switch-to-login')" />
 *         </div>
 *       </q-card-actions>
 *     </q-form>
 *   </q-card>
 * </template>
 * 
 * <script setup lang="ts">
 * import { ref, reactive } from 'vue';
 * import { useAuthStore } from '@/stores/auth';
 * 
 * const authStore = useAuthStore();
 * 
 * const formData = reactive({
 *   name: '',
 *   email: '',
 *   password: '',
 *   confirmPassword: '',
 *   role: 'member'
 * });
 * 
 * const roleOptions = [
 *   { label: 'Member', value: 'member' },
 *   { label: 'Volunteer', value: 'volunteer' },
 *   { label: 'Staff', value: 'staff' },
 *   { label: 'Pastor', value: 'pastor' }
 * ];
 * 
 * const loading = ref(false);
 * const error = ref(null);
 * 
 * const handleSubmit = async () => {
 *   // Validation and submission logic
 * };
 * </script>
 */