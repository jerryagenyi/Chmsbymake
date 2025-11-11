/**
 * ChurchAfrica ChMS - Supabase Client Configuration
 * Frontend Supabase client for authentication and data access
 */

import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from '../utils/supabase/info';

// Supabase client configuration
const supabaseUrl = `https://${projectId}.supabase.co`;
const supabaseAnonKey = publicAnonKey;

/**
 * Singleton Supabase client instance
 * Use this throughout the application for database and auth operations
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: window.localStorage,
  },
});

/**
 * Helper function to get current user
 * Returns null if no session exists (not an error)
 */
export async function getCurrentUser() {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    // No session is not an error - user just isn't logged in
    if (!session) {
      return null;
    }
    
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) {
      // Only log actual errors, not missing sessions
      if (error.message !== 'Auth session missing!') {
        console.error('Error fetching user:', error);
      }
      return null;
    }
    return user;
  } catch (error) {
    console.error('Unexpected error fetching user:', error);
    return null;
  }
}

/**
 * Helper function to get current session
 * Returns null if no session exists (not an error)
 */
export async function getCurrentSession() {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) {
      // Only log actual errors, not missing sessions
      if (error.message !== 'Auth session missing!') {
        console.error('Error fetching session:', error);
      }
      return null;
    }
    return session;
  } catch (error) {
    console.error('Unexpected error fetching session:', error);
    return null;
  }
}

/**
 * Helper function to sign out
 */
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error('Error signing out:', error);
    throw error;
  }
}

/**
 * Server API URL for backend routes
 */
export const serverUrl = `https://${projectId}.supabase.co/functions/v1/make-server-1b8f0a52`;

/**
 * Helper function to make authenticated API calls to the server
 */
export async function apiCall(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  const session = await getCurrentSession();
  
  const headers = new Headers(options.headers || {});
  headers.set('Content-Type', 'application/json');
  
  // Use session token if available, otherwise use anon key
  const authToken = session?.access_token || publicAnonKey;
  headers.set('Authorization', `Bearer ${authToken}`);

  return fetch(`${serverUrl}${endpoint}`, {
    ...options,
    headers,
  });
}

/**
 * Vue Migration Notes:
 * 
 * // Vue 3 equivalent - composable pattern:
 * // composables/useSupabase.ts
 * import { ref, readonly } from 'vue';
 * import { createClient } from '@supabase/supabase-js';
 * 
 * const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
 * const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
 * 
 * const supabase = createClient(supabaseUrl, supabaseAnonKey, {
 *   auth: {
 *     persistSession: true,
 *     autoRefreshToken: true,
 *     storage: window.localStorage,
 *   },
 * });
 * 
 * export function useSupabase() {
 *   const user = ref(null);
 *   const session = ref(null);
 * 
 *   const getCurrentUser = async () => {
 *     const { data: { user: currentUser }, error } = await supabase.auth.getUser();
 *     if (!error) user.value = currentUser;
 *     return currentUser;
 *   };
 * 
 *   const signOut = async () => {
 *     const { error } = await supabase.auth.signOut();
 *     if (!error) {
 *       user.value = null;
 *       session.value = null;
 *     }
 *   };
 * 
 *   return {
 *     supabase: readonly(supabase),
 *     user: readonly(user),
 *     session: readonly(session),
 *     getCurrentUser,
 *     signOut,
 *   };
 * }
 * 
 * // Pinia store for auth state:
 * // stores/auth.ts
 * import { defineStore } from 'pinia';
 * import { useSupabase } from '@/composables/useSupabase';
 * 
 * export const useAuthStore = defineStore('auth', () => {
 *   const { supabase } = useSupabase();
 *   const user = ref(null);
 *   const session = ref(null);
 * 
 *   const signIn = async (email: string, password: string) => {
 *     const { data, error } = await supabase.auth.signInWithPassword({
 *       email,
 *       password,
 *     });
 *     
 *     if (!error) {
 *       user.value = data.user;
 *       session.value = data.session;
 *     }
 *     
 *     return { data, error };
 *   };
 * 
 *   const signOut = async () => {
 *     await supabase.auth.signOut();
 *     user.value = null;
 *     session.value = null;
 *   };
 * 
 *   return { user, session, signIn, signOut };
 * });
 * 
 * // Laravel Migration:
 * // Frontend makes API calls to Laravel backend instead of Supabase:
 * 
 * // services/api.ts
 * import axios from 'axios';
 * 
 * const api = axios.create({
 *   baseURL: import.meta.env.VITE_API_URL,
 *   withCredentials: true, // For Laravel Sanctum cookies
 * });
 * 
 * // Add auth token to requests
 * api.interceptors.request.use((config) => {
 *   const token = localStorage.getItem('auth_token');
 *   if (token) {
 *     config.headers.Authorization = `Bearer ${token}`;
 *   }
 *   return config;
 * });
 * 
 * export default api;
 * 
 * // stores/auth.ts (Laravel version)
 * import api from '@/services/api';
 * 
 * export const useAuthStore = defineStore('auth', () => {
 *   const user = ref(null);
 *   const token = ref(localStorage.getItem('auth_token'));
 * 
 *   const signIn = async (email: string, password: string) => {
 *     const { data } = await api.post('/api/login', { email, password });
 *     
 *     user.value = data.user;
 *     token.value = data.token;
 *     localStorage.setItem('auth_token', data.token);
 *     
 *     return data;
 *   };
 * 
 *   const signOut = async () => {
 *     await api.post('/api/logout');
 *     user.value = null;
 *     token.value = null;
 *     localStorage.removeItem('auth_token');
 *   };
 * 
 *   return { user, token, signIn, signOut };
 * });
 */
