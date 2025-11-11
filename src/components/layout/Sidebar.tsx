/**
 * ChurchAfrica ChMS - Main Sidebar Navigation
 * Left sidebar (280px) with church navigation
 */

import React from 'react';
import { X, Church, ChevronDown } from 'lucide-react';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { Separator } from '../ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '../ui/collapsible';
import {
  primaryNavigation,
  secondaryNavigation,
  utilityNavigation,
  filterNavigationByRole,
  NavigationItem,
} from './NavigationItems';
import { useAuth } from '../../contexts/AuthContext';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  isMobile: boolean;
}

export function Sidebar({ open, onClose, isMobile }: SidebarProps) {
  const [activeSection, setActiveSection] = React.useState<string>('primary');
  const [currentPath, setCurrentPath] = React.useState('/');
  const { profile } = useAuth();
  
  // Use profile from auth or fallback to demo user
  const user = profile || {
    name: 'Pastor John',
    email: 'pastor@church.com',
    role: 'pastor',
    church_name: 'ChurchAfrica Lagos',
    avatar_url: '',
  };

  // Filter navigation based on user role
  const visiblePrimaryNav = filterNavigationByRole(primaryNavigation, user.role);
  const visibleSecondaryNav = filterNavigationByRole(secondaryNavigation, user.role);

  const handleNavClick = (item: NavigationItem) => {
    setCurrentPath(item.href);
    if (isMobile) {
      onClose();
    }
  };

  // Mobile: render as slide-out sheet
  if (isMobile) {
    return (
      <>
        {/* Backdrop */}
        {open && (
          <div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
            onClick={onClose}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`
            fixed left-0 top-0 h-full w-[280px] bg-card border-r border-border z-50
            transform transition-transform duration-300 ease-in-out
            ${open ? 'translate-x-0' : '-translate-x-full'}
          `}
        >
          <SidebarContent
            user={user}
            currentPath={currentPath}
            visiblePrimaryNav={visiblePrimaryNav}
            visibleSecondaryNav={visibleSecondaryNav}
            utilityNav={utilityNavigation}
            onNavClick={handleNavClick}
            onClose={onClose}
            isMobile={isMobile}
          />
        </aside>
      </>
    );
  }

  // Desktop: render as fixed sidebar
  return (
    <aside
      className={`
        w-[280px] bg-card border-r border-border flex-shrink-0
        transform transition-all duration-300 ease-in-out
        ${open ? 'translate-x-0' : '-translate-x-full'}
      `}
    >
      <SidebarContent
        user={user}
        currentPath={currentPath}
        visiblePrimaryNav={visiblePrimaryNav}
        visibleSecondaryNav={visibleSecondaryNav}
        utilityNav={utilityNavigation}
        onNavClick={handleNavClick}
        isMobile={isMobile}
      />
    </aside>
  );
}

interface SidebarContentProps {
  user: any;
  currentPath: string;
  visiblePrimaryNav: NavigationItem[];
  visibleSecondaryNav: NavigationItem[];
  utilityNav: NavigationItem[];
  onNavClick: (item: NavigationItem) => void;
  onClose?: () => void;
  isMobile: boolean;
}

function SidebarContent({
  user,
  currentPath,
  visiblePrimaryNav,
  visibleSecondaryNav,
  utilityNav,
  onNavClick,
  onClose,
  isMobile,
}: SidebarContentProps) {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Church className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">ChurchAfrica</h3>
              <p className="text-xs text-muted-foreground">{user.church_name || 'ChurchAfrica Lagos'}</p>
            </div>
          </div>
          {isMobile && onClose && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent/50 cursor-pointer touch-target">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user.avatar_url || user.avatar} alt={user.name} />
            <AvatarFallback className="bg-primary/10 text-primary">
              {user.name.split(' ').map((n: string) => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm truncate">{user.name}</p>
            <p className="text-xs text-muted-foreground truncate capitalize">{user.role}</p>
          </div>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </div>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {/* Primary Navigation */}
          <nav>
            <div className="space-y-1">
              {visiblePrimaryNav.map((item) => (
                <NavItem
                  key={item.id}
                  item={item}
                  isActive={currentPath === item.href}
                  onClick={() => onNavClick(item)}
                />
              ))}
            </div>
          </nav>

          <Separator />

          {/* Secondary Navigation */}
          <nav>
            <h4 className="text-xs font-semibold text-muted-foreground mb-2 px-3">
              More
            </h4>
            <div className="space-y-1">
              {visibleSecondaryNav.map((item) => (
                <NavItem
                  key={item.id}
                  item={item}
                  isActive={currentPath === item.href}
                  onClick={() => onNavClick(item)}
                />
              ))}
            </div>
          </nav>

          <Separator />

          {/* Utility Navigation */}
          <nav>
            <div className="space-y-1">
              {utilityNav.map((item) => (
                <NavItem
                  key={item.id}
                  item={item}
                  isActive={currentPath === item.href}
                  onClick={() => onNavClick(item)}
                />
              ))}
            </div>
          </nav>
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <p className="text-xs text-muted-foreground text-center">
          ChurchAfrica ChMS v1.0
        </p>
      </div>
    </div>
  );
}

interface NavItemProps {
  item: NavigationItem;
  isActive: boolean;
  onClick: () => void;
}

function NavItem({ item, isActive, onClick }: NavItemProps) {
  const Icon = item.icon;

  return (
    <button
      onClick={onClick}
      className={`
        w-full flex items-center gap-3 px-3 py-2 rounded-lg
        text-sm font-medium transition-colors
        touch-target no-select
        ${
          isActive
            ? 'bg-primary/10 text-primary'
            : 'text-foreground hover:bg-accent hover:text-accent-foreground'
        }
      `}
    >
      <Icon className="h-5 w-5 flex-shrink-0" />
      <span className="flex-1 text-left">{item.label}</span>
      {item.badge && (
        <span className="bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">
          {item.badge}
        </span>
      )}
    </button>
  );
}

/**
 * Vue Migration Notes:
 * 
 * // Vue 3 + Quasar equivalent:
 * <template>
 *   <q-drawer
 *     :model-value="open"
 *     @update:model-value="$emit('update:open', $event)"
 *     :width="280"
 *     bordered
 *     :breakpoint="768"
 *   >
 *     <!-- Header -->
 *     <q-toolbar class="q-pa-md">
 *       <q-avatar size="32px" color="primary" text-color="white">
 *         <q-icon name="church" />
 *       </q-avatar>
 *       <q-toolbar-title>
 *         <div class="text-subtitle2">ChurchAfrica</div>
 *         <div class="text-caption text-grey">{{ user.church }}</div>
 *       </q-toolbar-title>
 *     </q-toolbar>
 * 
 *     <!-- User Profile -->
 *     <q-item clickable class="q-mx-sm">
 *       <q-item-section avatar>
 *         <q-avatar>
 *           <img :src="user.avatar" :alt="user.name" />
 *         </q-avatar>
 *       </q-item-section>
 *       <q-item-section>
 *         <q-item-label>{{ user.name }}</q-item-label>
 *         <q-item-label caption>{{ user.role }}</q-item-label>
 *       </q-item-section>
 *       <q-item-section side>
 *         <q-icon name="expand_more" />
 *       </q-item-section>
 *     </q-item>
 * 
 *     <q-separator class="q-my-md" />
 * 
 *     <!-- Navigation -->
 *     <q-list padding>
 *       <q-item
 *         v-for="item in visiblePrimaryNav"
 *         :key="item.id"
 *         clickable
 *         :to="item.href"
 *         :active="$route.path === item.href"
 *         active-class="bg-primary-10 text-primary"
 *       >
 *         <q-item-section avatar>
 *           <q-icon :name="item.icon" />
 *         </q-item-section>
 *         <q-item-section>{{ item.label }}</q-item-section>
 *         <q-item-section side v-if="item.badge">
 *           <q-badge color="primary">{{ item.badge }}</q-badge>
 *         </q-item-section>
 *       </q-item>
 *     </q-list>
 *   </q-drawer>
 * </template>
 * 
 * <script setup lang="ts">
 * import { computed } from 'vue';
 * import { useRoute } from 'vue-router';
 * import { useAuthStore } from '@/stores/auth';
 * import { filterNavigationByRole } from '@/config/navigation';
 * 
 * const route = useRoute();
 * const authStore = useAuthStore();
 * 
 * const visiblePrimaryNav = computed(() => 
 *   filterNavigationByRole(primaryNavigation, authStore.user?.role)
 * );
 * </script>
 */
