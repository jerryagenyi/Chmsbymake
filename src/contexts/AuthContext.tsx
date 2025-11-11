/**
 * ChurchAfrica ChMS - Authentication Context
 * Manages user authentication state and role-based access
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, getCurrentUser, getCurrentSession } from '../lib/supabase';
import type { User, Session } from '@supabase/supabase-js';

export type UserRole = 'pastor' | 'staff' | 'volunteer' | 'member';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  church_id?: string;
  church_name?: string;
  avatar_url?: string;
  phone?: string;
  created_at: string;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, name: string, role?: UserRole) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ error: Error | null }>;
  hasRole: (roles: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state
  useEffect(() => {
    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        // Only log important events
        if (event !== 'INITIAL_SESSION') {
          console.log('Auth state changed:', event);
        }
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          await fetchUserProfile(session.user.id, session);
        } else {
          setProfile(null);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function initializeAuth() {
    try {
      const session = await getCurrentSession();
      const user = await getCurrentUser();

      setSession(session);
      setUser(user);

      if (user && session) {
        await fetchUserProfile(user.id, session);
      }
    } catch (error) {
      // Only log unexpected errors
      console.error('Error initializing auth:', error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchUserProfile(userId: string, userSession?: Session | null) {
    try {
      const { projectId, publicAnonKey } = await import('../utils/supabase/info');
      const currentSession = userSession || await getCurrentSession();
      
      if (!currentSession) {
        console.log('No session available, skipping profile fetch');
        return;
      }
      
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-1b8f0a52/profile/${userId}`,
        {
          headers: {
            'Authorization': `Bearer ${currentSession.access_token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setProfile(data.profile);
      } else if (response.status === 404) {
        // Profile doesn't exist yet, create default from user metadata
        const user = await getCurrentUser();
        if (user) {
          const defaultProfile: UserProfile = {
            id: user.id,
            email: user.email || '',
            name: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
            role: user.user_metadata?.role || 'member',
            created_at: user.created_at || new Date().toISOString(),
          };
          setProfile(defaultProfile);
        }
      } else {
        console.error('Failed to fetch profile:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  }

  async function signIn(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user && data.session) {
        await fetchUserProfile(data.user.id, data.session);
      }

      return { error: null };
    } catch (error) {
      console.error('Sign in error:', error);
      return { error: error as Error };
    }
  }

  async function signUp(email: string, password: string, name: string, role: UserRole = 'member') {
    try {
      const { projectId, publicAnonKey } = await import('../utils/supabase/info');
      
      // Call server to create user with role
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-1b8f0a52/signup`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({ email, password, name, role }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Sign up failed');
      }

      const data = await response.json();

      // Now sign in the user
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) throw signInError;

      return { error: null };
    } catch (error) {
      console.error('Sign up error:', error);
      return { error: error as Error };
    }
  }

  async function signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      setUser(null);
      setProfile(null);
      setSession(null);
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  }

  async function updateProfile(updates: Partial<UserProfile>) {
    if (!user || !profile) {
      return { error: new Error('No user logged in') };
    }

    try {
      const { projectId } = await import('../utils/supabase/info');
      
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-1b8f0a52/profile/${user.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session?.access_token}`,
          },
          body: JSON.stringify(updates),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Update failed');
      }

      const data = await response.json();
      setProfile(data.profile);

      return { error: null };
    } catch (error) {
      console.error('Update profile error:', error);
      return { error: error as Error };
    }
  }

  function hasRole(roles: UserRole[]): boolean {
    if (!profile) return false;
    return roles.includes(profile.role);
  }

  const value: AuthContextType = {
    user,
    profile,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile,
    hasRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

/**
 * Vue Migration Notes:
 * 
 * // Pinia store equivalent:
 * // stores/auth.ts
 * import { defineStore } from 'pinia';
 * import { ref, computed } from 'vue';
 * import { supabase } from '@/lib/supabase';
 * 
 * export const useAuthStore = defineStore('auth', () => {
 *   const user = ref(null);
 *   const profile = ref(null);
 *   const session = ref(null);
 *   const loading = ref(true);
 * 
 *   const isAuthenticated = computed(() => !!user.value);
 *   const hasRole = (roles: string[]) => {
 *     return profile.value ? roles.includes(profile.value.role) : false;
 *   };
 * 
 *   const signIn = async (email: string, password: string) => {
 *     const { data, error } = await supabase.auth.signInWithPassword({
 *       email,
 *       password,
 *     });
 *     
 *     if (!error && data.user) {
 *       user.value = data.user;
 *       session.value = data.session;
 *       await fetchProfile(data.user.id);
 *     }
 *     
 *     return { error };
 *   };
 * 
 *   const signOut = async () => {
 *     await supabase.auth.signOut();
 *     user.value = null;
 *     profile.value = null;
 *     session.value = null;
 *   };
 * 
 *   const fetchProfile = async (userId: string) => {
 *     // Fetch from Laravel API
 *     const response = await api.get(`/api/users/${userId}`);
 *     profile.value = response.data;
 *   };
 * 
 *   return {
 *     user,
 *     profile,
 *     session,
 *     loading,
 *     isAuthenticated,
 *     hasRole,
 *     signIn,
 *     signOut,
 *   };
 * });
 * 
 * // Usage in components:
 * <script setup lang="ts">
 * import { useAuthStore } from '@/stores/auth';
 * 
 * const authStore = useAuthStore();
 * </script>
 * 
 * <template>
 *   <div v-if="authStore.isAuthenticated">
 *     Welcome, {{ authStore.profile?.name }}
 *   </div>
 * </template>
 */
