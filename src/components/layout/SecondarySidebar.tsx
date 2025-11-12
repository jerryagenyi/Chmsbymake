/**
 * ChurchAfrica ChMS - Secondary Sidebar (Chat Panel)
 * Right sidebar (320px) for real-time messaging
 */

import React from 'react';
import { X, Search, MessageSquare, Users, Send, MoreVertical } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { ScrollArea } from '../ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Separator } from '../ui/separator';

interface SecondarySidebarProps {
  open: boolean;
  onClose: () => void;
  isMobile: boolean;
}

export function SecondarySidebar({ open, onClose, isMobile }: SecondarySidebarProps) {
  // Mobile: render as slide-out sheet from right
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
            fixed right-0 top-0 h-full w-full sm:w-[320px] bg-card border-l border-border z-50
            transform transition-transform duration-300 ease-in-out
            ${open ? 'translate-x-0' : 'translate-x-full'}
          `}
        >
          <SecondarySidebarContent onClose={onClose} isMobile={isMobile} />
        </aside>
      </>
    );
  }

  // Desktop: render as fixed sidebar
  return (
    <SecondarySidebarContent isMobile={isMobile} />
  );
}

interface SecondarySidebarContentProps {
  onClose?: () => void;
  isMobile: boolean;
}

function SecondarySidebarContent({ onClose, isMobile }: SecondarySidebarContentProps) {
  const [activeTab, setActiveTab] = React.useState('messages');
  const [searchQuery, setSearchQuery] = React.useState('');

  // Mock conversation data
  const conversations = [
    {
      id: '1',
      type: 'direct',
      name: 'Sarah Williams',
      avatar: '',
      lastMessage: 'Thank you for your prayers!',
      timestamp: '2m ago',
      unread: 2,
      online: true,
    },
    {
      id: '2',
      type: 'group',
      name: 'Youth Ministry',
      avatar: '',
      lastMessage: 'Meeting this Saturday at 3pm',
      timestamp: '15m ago',
      unread: 5,
      online: false,
    },
    {
      id: '3',
      type: 'direct',
      name: 'Pastor John',
      avatar: '',
      lastMessage: 'Can we discuss the event planning?',
      timestamp: '1h ago',
      unread: 0,
      online: true,
    },
    {
      id: '4',
      type: 'group',
      name: 'Prayer Warriors',
      avatar: '',
      lastMessage: 'New prayer request from John',
      timestamp: '2h ago',
      unread: 1,
      online: false,
    },
  ];

  // Mock activity data
  const recentActivity = [
    {
      id: '1',
      type: 'new_member',
      description: 'Sarah Williams joined the church',
      timestamp: '5m ago',
    },
    {
      id: '2',
      type: 'event',
      description: 'Youth Service scheduled for Saturday',
      timestamp: '1h ago',
    },
    {
      id: '3',
      type: 'attendance',
      description: '127 members checked in today',
      timestamp: '2h ago',
    },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Messages & Activity</h3>
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

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search conversations..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-2 mx-4 mt-2">
          <TabsTrigger value="messages" className="gap-2">
            <MessageSquare className="h-4 w-4" />
            Messages
          </TabsTrigger>
          <TabsTrigger value="activity" className="gap-2">
            <Users className="h-4 w-4" />
            Activity
          </TabsTrigger>
        </TabsList>

        {/* Messages Tab */}
        <TabsContent value="messages" className="flex-1 mt-0">
          <ScrollArea className="h-full">
            <div className="p-2">
              {conversations.map((conversation) => (
                <ConversationItem
                  key={conversation.id}
                  conversation={conversation}
                />
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        {/* Activity Tab */}
        <TabsContent value="activity" className="flex-1 mt-0">
          <ScrollArea className="h-full">
            <div className="p-4 space-y-4">
              {recentActivity.map((activity) => (
                <ActivityItem key={activity.id} activity={activity} />
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>

      {/* New Message Button */}
      <div className="p-4 border-t border-border">
        <Button className="w-full touch-target" size="lg">
          <Send className="h-4 w-4 mr-2" />
          New Message
        </Button>
      </div>
    </div>
  );
}

interface ConversationItemProps {
  conversation: {
    id: string;
    type: 'direct' | 'group';
    name: string;
    avatar: string;
    lastMessage: string;
    timestamp: string;
    unread: number;
    online: boolean;
  };
}

function ConversationItem({ conversation }: ConversationItemProps) {
  return (
    <div className="p-3 rounded-lg hover:bg-accent/50 cursor-pointer transition-colors touch-target">
      <div className="flex items-start gap-3">
        <div className="relative">
          <Avatar className="h-10 w-10">
            <AvatarImage src={conversation.avatar} alt={conversation.name} />
            <AvatarFallback className="bg-primary/10 text-primary">
              {conversation.type === 'group' ? (
                <Users className="h-5 w-5" />
              ) : (
                conversation.name.split(' ').map(n => n[0]).join('')
              )}
            </AvatarFallback>
          </Avatar>
          {conversation.online && conversation.type === 'direct' && (
            <div className="absolute bottom-0 right-0 h-3 w-3 bg-success rounded-full border-2 border-card" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <p className="font-medium text-sm truncate">{conversation.name}</p>
            <span className="text-xs text-muted-foreground">
              {conversation.timestamp}
            </span>
          </div>
          <p className="text-xs text-muted-foreground truncate">
            {conversation.lastMessage}
          </p>
        </div>

        {conversation.unread > 0 && (
          <Badge variant="default" className="ml-auto">
            {conversation.unread}
          </Badge>
        )}
      </div>
    </div>
  );
}

interface ActivityItemProps {
  activity: {
    id: string;
    type: string;
    description: string;
    timestamp: string;
  };
}

function ActivityItem({ activity }: ActivityItemProps) {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'new_member':
        return '👋';
      case 'event':
        return '📅';
      case 'attendance':
        return '✓';
      default:
        return '📌';
    }
  };

  return (
    <div className="flex items-start gap-3">
      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-lg flex-shrink-0">
        {getActivityIcon(activity.type)}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm">{activity.description}</p>
        <p className="text-xs text-muted-foreground mt-1">
          {activity.timestamp}
        </p>
      </div>
    </div>
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
 *     side="right"
 *     :width="320"
 *     bordered
 *     :breakpoint="768"
 *   >
 *     <!-- Header -->
 *     <q-toolbar class="q-pa-md">
 *       <q-toolbar-title>Messages & Activity</q-toolbar-title>
 *       <q-btn
 *         v-if="$q.screen.lt.md"
 *         flat
 *         round
 *         dense
 *         icon="close"
 *         @click="$emit('close')"
 *       />
 *     </q-toolbar>
 * 
 *     <!-- Search -->
 *     <q-input
 *       v-model="searchQuery"
 *       dense
 *       outlined
 *       placeholder="Search conversations..."
 *       class="q-mx-md"
 *     >
 *       <template v-slot:prepend>
 *         <q-icon name="search" />
 *       </template>
 *     </q-input>
 * 
 *     <!-- Tabs -->
 *     <q-tabs v-model="activeTab" class="q-mt-md">
 *       <q-tab name="messages" label="Messages" icon="chat" />
 *       <q-tab name="activity" label="Activity" icon="people" />
 *     </q-tabs>
 * 
 *     <q-separator />
 * 
 *     <q-tab-panels v-model="activeTab" animated>
 *       <!-- Messages Panel -->
 *       <q-tab-panel name="messages">
 *         <q-scroll-area style="height: calc(100vh - 250px)">
 *           <q-list>
 *             <q-item
 *               v-for="conversation in conversations"
 *               :key="conversation.id"
 *               clickable
 *             >
 *               <q-item-section avatar>
 *                 <q-avatar>
 *                   <img :src="conversation.avatar" :alt="conversation.name" />
 *                   <q-badge
 *                     v-if="conversation.online"
 *                     color="positive"
 *                     floating
 *                   />
 *                 </q-avatar>
 *               </q-item-section>
 * 
 *               <q-item-section>
 *                 <q-item-label>{{ conversation.name }}</q-item-label>
 *                 <q-item-label caption>{{ conversation.lastMessage }}</q-item-label>
 *               </q-item-section>
 * 
 *               <q-item-section side top>
 *                 <q-item-label caption>{{ conversation.timestamp }}</q-item-label>
 *                 <q-badge
 *                   v-if="conversation.unread > 0"
 *                   color="primary"
 *                   :label="conversation.unread"
 *                 />
 *               </q-item-section>
 *             </q-item>
 *           </q-list>
 *         </q-scroll-area>
 *       </q-tab-panel>
 * 
 *       <!-- Activity Panel -->
 *       <q-tab-panel name="activity">
 *         <q-scroll-area style="height: calc(100vh - 250px)">
 *           <div class="q-pa-md q-gutter-md">
 *             <div
 *               v-for="activity in recentActivity"
 *               :key="activity.id"
 *               class="row items-start q-gutter-sm"
 *             >
 *               <q-avatar size="32px" color="primary" text-color="white">
 *                 {{ getActivityIcon(activity.type) }}
 *               </q-avatar>
 *               <div class="col">
 *                 <div class="text-body2">{{ activity.description }}</div>
 *                 <div class="text-caption text-grey">{{ activity.timestamp }}</div>
 *               </div>
 *             </div>
 *           </div>
 *         </q-scroll-area>
 *       </q-tab-panel>
 *     </q-tab-panels>
 * 
 *     <!-- New Message Button -->
 *     <div class="q-pa-md">
 *       <q-btn
 *         color="primary"
 *         label="New Message"
 *         icon="send"
 *         class="full-width"
 *         unelevated
 *       />
 *     </div>
 *   </q-drawer>
 * </template>
 * 
 * <script setup lang="ts">
 * import { ref } from 'vue';
 * 
 * const activeTab = ref('messages');
 * const searchQuery = ref('');
 * 
 * const conversations = ref([
 *   // ... conversation data
 * ]);
 * 
 * const recentActivity = ref([
 *   // ... activity data
 * ]);
 * 
 * const getActivityIcon = (type: string) => {
 *   const icons = {
 *     new_member: '👋',
 *     event: '📅',
 *     attendance: '✓'
 *   };
 *   return icons[type] || '📌';
 * };
 * </script>
 */