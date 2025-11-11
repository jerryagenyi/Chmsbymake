/**
 * ChurchAfrica ChMS - Protected Route Component
 * Wrapper for routes that require authentication
 */

import React from 'react';
import { useAuth, UserRole } from '../../contexts/AuthContext';
import { AuthPage } from './AuthPage';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Card, CardContent } from '../ui/card';
import { Loader2, ShieldAlert } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: UserRole[];
  fallback?: React.ReactNode;
}

export function ProtectedRoute({
  children,
  requiredRoles,
  fallback,
}: ProtectedRouteProps) {
  const { user, profile, loading, hasRole } = useAuth();

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 flex flex-col items-center space-y-4">
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
            <p className="text-muted-foreground">Loading...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Not authenticated - show login page
  if (!user || !profile) {
    return <AuthPage onSuccess={() => window.location.reload()} />;
  }

  // Check role requirements
  if (requiredRoles && requiredRoles.length > 0) {
    if (!hasRole(requiredRoles)) {
      return fallback || (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardContent className="pt-6">
              <Alert variant="destructive">
                <ShieldAlert className="h-4 w-4" />
                <AlertTitle>Access Denied</AlertTitle>
                <AlertDescription>
                  You don't have permission to access this page. Required role(s):{' '}
                  {requiredRoles.join(', ')}.
                  <br />
                  <br />
                  Your current role: <strong>{profile.role}</strong>
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>
      );
    }
  }

  // Authenticated and authorized - render children
  return <>{children}</>;
}

/**
 * Vue Migration Notes:
 * 
 * // Vue Router navigation guard approach:
 * // router/index.ts
 * import { createRouter, createWebHistory } from 'vue-router';
 * import { useAuthStore } from '@/stores/auth';
 * 
 * const routes = [
 *   {
 *     path: '/dashboard',
 *     name: 'dashboard',
 *     component: () => import('@/views/DashboardView.vue'),
 *     meta: {
 *       requiresAuth: true,
 *       roles: ['pastor', 'staff', 'volunteer', 'member']
 *     }
 *   },
 *   {
 *     path: '/members',
 *     name: 'members',
 *     component: () => import('@/views/MembersView.vue'),
 *     meta: {
 *       requiresAuth: true,
 *       roles: ['pastor', 'staff'] // Only pastors and staff
 *     }
 *   },
 *   {
 *     path: '/login',
 *     name: 'login',
 *     component: () => import('@/views/AuthView.vue'),
 *     meta: { requiresAuth: false }
 *   }
 * ];
 * 
 * const router = createRouter({
 *   history: createWebHistory(import.meta.env.BASE_URL),
 *   routes
 * });
 * 
 * // Global navigation guard
 * router.beforeEach(async (to, from, next) => {
 *   const authStore = useAuthStore();
 *   
 *   // Wait for auth to initialize
 *   if (authStore.loading) {
 *     await new Promise(resolve => {
 *       const unwatch = watch(() => authStore.loading, (loading) => {
 *         if (!loading) {
 *           unwatch();
 *           resolve(null);
 *         }
 *       });
 *     });
 *   }
 * 
 *   const requiresAuth = to.meta.requiresAuth;
 *   const requiredRoles = to.meta.roles as string[] | undefined;
 *   
 *   if (requiresAuth && !authStore.isAuthenticated) {
 *     // Not logged in, redirect to login
 *     next({ name: 'login', query: { redirect: to.fullPath } });
 *   } else if (requiredRoles && !authStore.hasRole(requiredRoles)) {
 *     // Logged in but doesn't have required role
 *     next({ name: 'access-denied' });
 *   } else {
 *     // Allow navigation
 *     next();
 *   }
 * });
 * 
 * export default router;
 * 
 * // Alternative: Composable approach
 * // composables/useProtectedRoute.ts
 * import { computed } from 'vue';
 * import { useRouter } from 'vue-router';
 * import { useAuthStore } from '@/stores/auth';
 * 
 * export function useProtectedRoute(requiredRoles?: string[]) {
 *   const authStore = useAuthStore();
 *   const router = useRouter();
 * 
 *   const canAccess = computed(() => {
 *     if (!authStore.isAuthenticated) return false;
 *     if (!requiredRoles) return true;
 *     return authStore.hasRole(requiredRoles);
 *   });
 * 
 *   const checkAccess = () => {
 *     if (!canAccess.value) {
 *       router.push('/login');
 *       return false;
 *     }
 *     return true;
 *   };
 * 
 *   return {
 *     canAccess,
 *     checkAccess,
 *     loading: computed(() => authStore.loading),
 *     user: computed(() => authStore.user),
 *     profile: computed(() => authStore.profile)
 *   };
 * }
 * 
 * // Usage in component:
 * <script setup lang="ts">
 * import { useProtectedRoute } from '@/composables/useProtectedRoute';
 * 
 * const { canAccess, loading } = useProtectedRoute(['pastor', 'staff']);
 * </script>
 * 
 * <template>
 *   <div v-if="loading">Loading...</div>
 *   <div v-else-if="!canAccess">Access Denied</div>
 *   <div v-else>
 *     <!-- Protected content -->
 *   </div>
 * </template>
 */
