/**
 * ChurchAfrica ChMS - Login Form
 * Email/password authentication with validation
 */

import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Alert, AlertDescription } from '../ui/alert';
import { Church, Mail, Lock, Loader2, AlertCircle } from 'lucide-react';

interface LoginFormProps {
  onSuccess?: () => void;
  onSwitchToRegister?: () => void;
}

export function LoginForm({ onSuccess, onSwitchToRegister }: LoginFormProps) {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <Card className="w-full max-w-md">
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

      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

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
                disabled={loading}
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
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-9"
                required
                disabled={loading}
                autoComplete="current-password"
              />
            </div>
          </div>

          <Button
            type="button"
            variant="link"
            className="px-0 h-auto text-sm"
            disabled={loading}
          >
            Forgot password?
          </Button>
        </CardContent>

        <CardFooter className="flex flex-col space-y-4">
          <Button
            type="submit"
            className="w-full touch-target"
            disabled={loading}
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

          {onSwitchToRegister && (
            <div className="text-center text-sm text-muted-foreground">
              Don't have an account?{' '}
              <Button
                type="button"
                variant="link"
                className="px-1 h-auto"
                onClick={onSwitchToRegister}
                disabled={loading}
              >
                Sign up
              </Button>
            </div>
          )}
        </CardFooter>
      </form>
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
