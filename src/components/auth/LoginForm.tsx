/**
 * ChurchAfrica ChMS - Login Form
 * Email/password authentication with Google OAuth support
 */

import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Alert, AlertDescription } from '../ui/alert';
import { Separator } from '../ui/separator';
import { PasswordStrengthMeter } from '../ui-enhanced/PasswordStrengthMeter';
import { Church, Mail, Lock, Loader2, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface LoginFormProps {
  onSuccess?: () => void;
  onSwitchToRegister?: () => void;
}

export function LoginForm({ onSuccess, onSwitchToRegister }: LoginFormProps) {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { error } = await signIn(email, password);

      if (error) {
        setError(error.message || 'Invalid email or password');
      } else {
        onSuccess?.();
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleSignIn() {
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
        setError(error.message || 'Google sign-in failed');
        setGoogleLoading(false);
      }
      // If successful, the user will be redirected
      // Don't set loading to false as the page will redirect
    } catch (err) {
      setError('An unexpected error occurred with Google sign-in');
      console.error('Google sign-in error:', err);
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
        <CardTitle className="text-center">Welcome Back</CardTitle>
        <CardDescription className="text-center">
          Sign in to ChurchAfrica ChMS
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Google Sign In Button */}
        <Button
          type="button"
          variant="outline"
          className="w-full touch-target"
          onClick={handleGoogleSignIn}
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
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="pastor@church.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-9"
                required
                disabled={loading || googleLoading}
                autoComplete="email"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-9"
                required
                disabled={loading || googleLoading}
                autoComplete="current-password"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </div>
            </div>
          </div>

          <PasswordStrengthMeter password={password} />

          <Button
            type="button"
            variant="link"
            className="px-0 h-auto text-sm"
            disabled={loading || googleLoading}
          >
            Forgot password?
          </Button>

          <Button
            type="submit"
            className="w-full touch-target"
            disabled={loading || googleLoading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </Button>
        </form>
      </CardContent>

      <CardFooter>
        {onSwitchToRegister && (
          <div className="text-center text-sm text-muted-foreground w-full">
            Don't have an account?{' '}
            <Button
              type="button"
              variant="link"
              className="px-1 h-auto"
              onClick={onSwitchToRegister}
              disabled={loading || googleLoading}
            >
              Sign up
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
 *   <q-card class="login-card">
 *     <q-card-section class="text-center">
 *       <q-avatar size="48px" color="primary" class="q-mb-md">
 *         <q-icon name="church" />
 *       </q-avatar>
 *       <div class="text-h6">Welcome Back</div>
 *       <div class="text-subtitle2 text-grey">Sign in to ChurchAfrica ChMS</div>
 *     </q-card-section>
 * 
 *     <q-form @submit="handleSubmit">
 *       <q-card-section>
 *         <q-banner v-if="error" class="bg-negative text-white q-mb-md">
 *           <template v-slot:avatar>
 *             <q-icon name="error" />
 *           </template>
 *           {{ error }}
 *         </q-banner>
 * 
 *         <q-input
 *           v-model="email"
 *           label="Email"
 *           type="email"
 *           outlined
 *           :disable="loading"
 *           :rules="[val => !!val || 'Email is required']"
 *         >
 *           <template v-slot:prepend>
 *             <q-icon name="mail" />
 *           </template>
 *         </q-input>
 * 
 *         <q-input
 *           v-model="password"
 *           label="Password"
 *           :type="showPassword ? 'text' : 'password'"
 *           outlined
 *           :disable="loading"
 *           class="q-mt-md"
 *           :rules="[val => !!val || 'Password is required']"
 *         >
 *           <template v-slot:prepend>
 *             <q-icon name="lock" />
 *           </template>
 *           <template v-slot:append>
 *             <q-icon
 *               :name="showPassword ? 'visibility_off' : 'visibility'"
 *               @click="showPassword = !showPassword"
 *               class="cursor-pointer"
 *             />
 *           </template>
 *         </q-input>
 * 
 *         <div class="text-right q-mt-sm">
 *           <q-btn flat label="Forgot password?" size="sm" />
 *         </div>
 *       </q-card-section>
 * 
 *       <q-card-actions vertical>
 *         <q-btn
 *           type="submit"
 *           color="primary"
 *           label="Sign In"
 *           :loading="loading"
 *           unelevated
 *           class="full-width"
 *         />
 * 
 *         <div class="text-center q-mt-md">
 *           Don't have an account?
 *           <q-btn flat label="Sign up" @click="$emit('switch-to-register')" />
 *         </div>
 *       </q-card-actions>
 *     </q-form>
 *   </q-card>
 * </template>
 * 
 * <script setup lang="ts">
 * import { ref } from 'vue';
 * import { useAuthStore } from '@/stores/auth';
 * import { useRouter } from 'vue-router';
 * 
 * const authStore = useAuthStore();
 * const router = useRouter();
 * 
 * const email = ref('');
 * const password = ref('');
 * const showPassword = ref(false);
 * const loading = ref(false);
 * const error = ref(null);
 * 
 * const handleSubmit = async () => {
 *   error.value = null;
 *   loading.value = true;
 * 
 *   try {
 *     const result = await authStore.signIn(email.value, password.value);
 *     
 *     if (result.error) {
 *       error.value = result.error.message;
 *     } else {
 *       router.push('/dashboard');
 *     }
 *   } catch (err) {
 *     error.value = 'An unexpected error occurred';
 *   } finally {
 *     loading.value = false;
 *   }
 * };
 * </script>
 */