/**
 * ChurchAfrica ChMS - Registration Form
 * New user registration with role selection
 */

import React, { useState } from 'react';
import { useAuth, UserRole } from '../../contexts/AuthContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Alert, AlertDescription } from '../ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Church, Mail, Lock, User, Loader2, AlertCircle, UserCircle } from 'lucide-react';

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
    role: 'member' as UserRole,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-center mb-4">
          <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
            <Church className="h-7 w-7 text-primary" />
          </div>
        </div>
        <CardTitle className="text-center">Create Account</CardTitle>
        <CardDescription className="text-center">
          Join your church community
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
                disabled={loading}
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
                disabled={loading}
                autoComplete="email"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <div className="relative">
              <UserCircle className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
              <Select
                value={formData.role}
                onValueChange={(value) => handleChange('role', value)}
                disabled={loading}
              >
                <SelectTrigger className="pl-9">
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="member">Member</SelectItem>
                  <SelectItem value="volunteer">Volunteer</SelectItem>
                  <SelectItem value="staff">Staff</SelectItem>
                  <SelectItem value="pastor">Pastor</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <p className="text-xs text-muted-foreground">
              Select the role that best describes you. Pastors and staff will need admin approval.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                className="pl-9"
                required
                disabled={loading}
                autoComplete="new-password"
                minLength={6}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={(e) => handleChange('confirmPassword', e.target.value)}
                className="pl-9"
                required
                disabled={loading}
                autoComplete="new-password"
                minLength={6}
              />
            </div>
          </div>
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
                Creating account...
              </>
            ) : (
              'Create Account'
            )}
          </Button>

          {onSwitchToLogin && (
            <div className="text-center text-sm text-muted-foreground">
              Already have an account?{' '}
              <Button
                type="button"
                variant="link"
                className="px-1 h-auto"
                onClick={onSwitchToLogin}
                disabled={loading}
              >
                Sign in
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
