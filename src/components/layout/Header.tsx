/**
 * ChurchAfrica ChMS - Header Component
 * Top navigation bar with search, notifications, and profile
 */

import React from 'react';
import { Menu, Search, Bell, MessageSquare, Church, X } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { ThemeToggle } from '../theme/ThemeToggle';
import { useIsMobile } from '../ui/use-mobile';
import { useAuth } from '../../contexts/AuthContext';

interface HeaderProps {
  onToggleSidebar: () => void;
  onToggleSecondarySidebar?: () => void;
}

export function Header({ onToggleSidebar, onToggleSecondarySidebar }: HeaderProps) {
  const [searchOpen, setSearchOpen] = React.useState(false);
  const isMobile = useIsMobile();

  // Mock notification count (will be replaced with real data)
  const notificationCount = 3;
  const messageCount = 5;

  // Get user from auth context
  const { profile, signOut } = useAuth();
  
  const user = profile || {
    name: 'Pastor John',
    email: 'pastor@church.com',
    church_name: 'ChurchAfrica Lagos',
    avatar_url: '',
  };
  
  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  };

  return (
    <header className="h-16 bg-card/80 backdrop-blur-sm border-b border-border sticky top-0 z-40">
      <div className="h-full px-4 flex items-center justify-between gap-4">
        {/* Left Section */}
        <div className="flex items-center gap-3">
          {/* Sidebar Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleSidebar}
            className="touch-target"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle sidebar</span>
          </Button>

          {/* Logo - Desktop only */}
          {!isMobile && (
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Church className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h1 className="text-sm font-semibold">ChurchAfrica ChMS</h1>
              </div>
            </div>
          )}
        </div>

        {/* Center Section - Search */}
        <div className="flex-1 max-w-md">
          {isMobile ? (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSearchOpen(!searchOpen)}
              className="touch-target"
            >
              <Search className="h-5 w-5" />
            </Button>
          ) : (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search members, events..."
                className="pl-9 bg-background/50"
              />
            </div>
          )}
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative touch-target"
              >
                <Bell className="h-5 w-5" />
                {notificationCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
                  >
                    {notificationCount}
                  </Badge>
                )}
                <span className="sr-only">Notifications</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-[300px] overflow-y-auto">
                <NotificationItem
                  title="New Member Joined"
                  description="Sarah Williams joined the congregation"
                  time="5 minutes ago"
                  onClear={() => console.log('Clear notification 1')}
                />
                <NotificationItem
                  title="Event Reminder"
                  description="Youth Service starts in 1 hour"
                  time="45 minutes ago"
                  onClear={() => console.log('Clear notification 2')}
                />
                <NotificationItem
                  title="Prayer Request"
                  description="John Smith requested prayer for healing"
                  time="2 hours ago"
                  onClear={() => console.log('Clear notification 3')}
                />
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Messages - Desktop only */}
          {!isMobile && onToggleSecondarySidebar && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleSecondarySidebar}
              className="relative touch-target"
            >
              <MessageSquare className="h-5 w-5" />
              {messageCount > 0 && (
                <Badge
                  variant="default"
                  className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
                >
                  {messageCount}
                </Badge>
              )}
              <span className="sr-only">Messages</span>
            </Button>
          )}

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* User Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-10 w-10 rounded-full touch-target"
              >
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user.avatar_url || user.avatar} alt={user.name} />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {user.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                  <p className="text-xs text-muted-foreground">{user.church_name || user.church || 'ChurchAfrica'}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile Settings</DropdownMenuItem>
              <DropdownMenuItem>Church Settings</DropdownMenuItem>
              <DropdownMenuItem>Preferences</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="text-destructive"
                onClick={() => handleSignOut().catch(console.error)}
              >
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Mobile Search Overlay */}
      {isMobile && searchOpen && (
        <div className="absolute top-16 left-0 right-0 bg-card border-b border-border p-4 z-50">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search members, events..."
              className="pl-9"
              autoFocus
              onBlur={() => setTimeout(() => setSearchOpen(false), 200)}
            />
          </div>
        </div>
      )}
    </header>
  );
}

interface NotificationItemProps {
  title: string;
  description: string;
  time: string;
  onClear?: () => void;
}

function NotificationItem({ title, description, time, onClear }: NotificationItemProps) {
  return (
    <div className="p-3 hover:bg-accent/50 cursor-pointer border-b border-border last:border-0 touch-target group">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium">{title}</p>
          <p className="text-xs text-muted-foreground">{description}</p>
          <p className="text-xs text-muted-foreground mt-1">{time}</p>
        </div>
        {onClear && (
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onClear();
            }}
            className="h-6 px-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/10 text-muted-foreground hover:text-red-500"
          >
            <X className="h-3 w-3 mr-1" />
            Clear
          </Button>
        )}
      </div>
    </div>
  );
}

/**
 * Vue Migration Notes:
 * 
 * // Vue 3 + Quasar equivalent:
 * <template>
 *   <q-header elevated class="bg-card">
 *     <q-toolbar>
 *       <!-- Menu Button -->
 *       <q-btn
 *         flat
 *         round
 *         dense
 *         icon="menu"
 *         @click="$emit('toggle-sidebar')"
 *       />
 * 
 *       <!-- Logo -->
 *       <q-toolbar-title v-if="!$q.screen.lt.md">
 *         <div class="row items-center q-gutter-sm">
 *           <q-avatar size="32px" color="primary">
 *             <q-icon name="church" />
 *           </q-avatar>
 *           <div>ChurchAfrica ChMS</div>
 *         </div>
 *       </q-toolbar-title>
 * 
 *       <!-- Search -->
 *       <q-input
 *         v-if="!$q.screen.lt.md"
 *         dense
 *         outlined
 *         placeholder="Search members, events..."
 *         class="q-mx-md"
 *         style="max-width: 400px;"
 *       >
 *         <template v-slot:prepend>
 *           <q-icon name="search" />
 *         </template>
 *       </q-input>
 * 
 *       <q-space />
 * 
 *       <!-- Notifications -->
 *       <q-btn flat round dense icon="notifications">
 *         <q-badge color="negative" floating>{{ notificationCount }}</q-badge>
 *         <q-menu>
 *           <q-list style="min-width: 300px">
 *             <q-item-label header>Notifications</q-item-label>
 *             <q-separator />
 *             <q-item
 *               v-for="notif in notifications"
 *               :key="notif.id"
 *               clickable
 *             >
 *               <q-item-section>
 *                 <q-item-label>{{ notif.title }}</q-item-label>
 *                 <q-item-label caption>{{ notif.description }}</q-item-label>
 *               </q-item-section>
 *             </q-item>
 *           </q-list>
 *         </q-menu>
 *       </q-btn>
 * 
 *       <!-- Messages -->
 *       <q-btn
 *         flat
 *         round
 *         dense
 *         icon="chat"
 *         @click="$emit('toggle-secondary-sidebar')"
 *       >
 *         <q-badge color="primary" floating>{{ messageCount }}</q-badge>
 *       </q-btn>
 * 
 *       <!-- Theme Toggle -->
 *       <ThemeToggle />
 * 
 *       <!-- User Profile -->
 *       <q-btn flat round>
 *         <q-avatar size="32px">
 *           <img :src="user.avatar" :alt="user.name" />
 *         </q-avatar>
 *         <q-menu>
 *           <q-list style="min-width: 200px">
 *             <q-item>
 *               <q-item-section>
 *                 <q-item-label>{{ user.name }}</q-item-label>
 *                 <q-item-label caption>{{ user.email }}</q-item-label>
 *               </q-item-section>
 *             </q-item>
 *             <q-separator />
 *             <q-item clickable to="/settings">
 *               <q-item-section>Profile Settings</q-item-section>
 *             </q-item>
 *             <q-separator />
 *             <q-item clickable @click="signOut">
 *               <q-item-section class="text-negative">Sign Out</q-item-section>
 *             </q-item>
 *           </q-list>
 *         </q-menu>
 *       </q-btn>
 *     </q-toolbar>
 *   </q-header>
 * </template>
 * 
 * <script setup lang="ts">
 * import { ref } from 'vue';
 * import { useQuasar } from 'quasar';
 * import { useAuthStore } from '@/stores/auth';
 * import ThemeToggle from '@/components/ThemeToggle.vue';
 * 
 * const $q = useQuasar();
 * const authStore = useAuthStore();
 * 
 * const notificationCount = ref(3);
 * const messageCount = ref(5);
 * 
 * const user = computed(() => authStore.user);
 * 
 * const signOut = async () => {
 *   await authStore.signOut();
 * };
 * </script>
 */