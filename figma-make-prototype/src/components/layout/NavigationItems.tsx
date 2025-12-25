/**
 * ChurchAfrica ChMS - Navigation Items Configuration
 * Centralized navigation structure for desktop and mobile
 */

import {
  LayoutDashboard,
  Users,
  Calendar,
  UserCheck,
  MessageSquare,
  Settings,
  BarChart3,
  Heart,
  Folder,
  DollarSign,
  Palette,
  LucideIcon,
} from 'lucide-react';

export interface NavigationItem {
  id: string;
  label: string;
  icon: LucideIcon;
  href: string;
  badge?: number;
  requiresAuth?: boolean;
  roles?: string[]; // ['pastor', 'staff', 'volunteer', 'member']
}

export const primaryNavigation: NavigationItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    href: '/',
    requiresAuth: true,
  },
  {
    id: 'members',
    label: 'Members',
    icon: Users,
    href: '/members',
    requiresAuth: true,
    roles: ['pastor', 'staff'],
  },
  {
    id: 'attendance',
    label: 'Attendance',
    icon: UserCheck,
    href: '/attendance',
    requiresAuth: true,
  },
  {
    id: 'events',
    label: 'Events',
    icon: Calendar,
    href: '/events',
    requiresAuth: true,
  },
  {
    id: 'chat',
    label: 'Messages',
    icon: MessageSquare,
    href: '/chat',
    requiresAuth: true,
  },
];

export const secondaryNavigation: NavigationItem[] = [
  {
    id: 'giving',
    label: 'Giving',
    icon: DollarSign,
    href: '/giving',
    requiresAuth: true,
    roles: ['pastor', 'staff'],
  },
  {
    id: 'prayer-requests',
    label: 'Prayer Requests',
    icon: Heart,
    href: '/prayer-requests',
    requiresAuth: true,
  },
  {
    id: 'reports',
    label: 'Reports',
    icon: BarChart3,
    href: '/reports',
    requiresAuth: true,
    roles: ['pastor', 'staff'],
  },
  {
    id: 'resources',
    label: 'Resources',
    icon: Folder,
    href: '/resources',
    requiresAuth: true,
  },
];

export const utilityNavigation: NavigationItem[] = [
  {
    id: 'settings',
    label: 'Settings',
    icon: Settings,
    href: '/settings',
    requiresAuth: true,
  },
  {
    id: 'colour-palette',
    label: 'Colour Palette',
    icon: Palette,
    href: '/color-palette',
    requiresAuth: false,
  },
];

// Mobile bottom navigation (limited to 5 items for thumb reach)
export const mobileBottomNavigation: NavigationItem[] = [
  primaryNavigation[0], // Dashboard
  primaryNavigation[1], // Members
  primaryNavigation[3], // Events
  primaryNavigation[4], // Chat
  utilityNavigation[0], // Settings
];

/**
 * Filter navigation items based on user role
 */
export function filterNavigationByRole(
  items: NavigationItem[],
  userRole?: string
): NavigationItem[] {
  if (!userRole) return items;

  return items.filter(item => {
    // If item has no role restrictions, show it
    if (!item.roles || item.roles.length === 0) return true;
    
    // Check if user's role is in the allowed roles
    return item.roles.includes(userRole);
  });
}

/**
 * Vue Migration Notes:
 * 
 * // Vue 3 equivalent - same structure, different imports:
 * import type { Component } from 'vue';
 * import {
 *   LayoutDashboard,
 *   Users,
 *   Calendar,
 *   // ... other icons from lucide-vue-next
 * } from 'lucide-vue-next';
 * 
 * export interface NavigationItem {
 *   id: string;
 *   label: string;
 *   icon: Component;
 *   to: string; // Vue Router uses 'to' instead of 'href'
 *   badge?: number;
 *   meta?: {
 *     requiresAuth: boolean;
 *     roles?: string[];
 *   };
 * }
 * 
 * // In router configuration:
 * const routes = [
 *   {
 *     path: '/',
 *     name: 'dashboard',
 *     component: () => import('@/views/DashboardView.vue'),
 *     meta: { requiresAuth: true }
 *   },
 *   // ... other routes
 * ];
 */