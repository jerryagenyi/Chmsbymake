/**
 * ChurchAfrica ChMS - Activity Feed
 * Recent church activities and updates
 */

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { ScrollArea } from '../ui/scroll-area';
import { 
  UserPlus, 
  Calendar, 
  DollarSign, 
  Users, 
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  Info
} from 'lucide-react';
import { cn } from '../ui/utils';

export type ActivityType = 
  | 'member_joined' 
  | 'event_created' 
  | 'donation_received' 
  | 'group_created'
  | 'attendance_recorded'
  | 'message_sent'
  | 'task_completed'
  | 'alert';

export interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  user?: {
    name: string;
    avatar?: string;
  };
  timestamp: string;
  metadata?: Record<string, any>;
}

const mockActivities: Activity[] = [
  {
    id: '1',
    type: 'member_joined',
    title: 'New Member Joined',
    description: 'Sarah Johnson joined the church family',
    user: { name: 'Sarah Johnson', avatar: '' },
    timestamp: '5 minutes ago',
  },
  {
    id: '2',
    type: 'donation_received',
    title: 'Donation Received',
    description: '₦50,000 received from Building Fund campaign',
    timestamp: '15 minutes ago',
    metadata: { amount: 50000, campaign: 'Building Fund' },
  },
  {
    id: '3',
    type: 'event_created',
    title: 'Event Scheduled',
    description: 'Youth Conference 2024 created for next month',
    user: { name: 'Pastor John', avatar: '' },
    timestamp: '1 hour ago',
  },
  {
    id: '4',
    type: 'attendance_recorded',
    title: 'Attendance Updated',
    description: '342 members attended Sunday Service',
    timestamp: '2 hours ago',
  },
  {
    id: '5',
    type: 'group_created',
    title: 'New Group Created',
    description: 'Women Fellowship Group established',
    user: { name: 'Sister Mary', avatar: '' },
    timestamp: '3 hours ago',
  },
  {
    id: '6',
    type: 'task_completed',
    title: 'Task Completed',
    description: 'Monthly financial report generated',
    timestamp: '4 hours ago',
  },
  {
    id: '7',
    type: 'message_sent',
    title: 'Announcement Sent',
    description: 'Service time change notification sent to all members',
    user: { name: 'Admin', avatar: '' },
    timestamp: '5 hours ago',
  },
];

const activityIcons: Record<ActivityType, React.ElementType> = {
  member_joined: UserPlus,
  event_created: Calendar,
  donation_received: DollarSign,
  group_created: Users,
  attendance_recorded: CheckCircle2,
  message_sent: MessageSquare,
  task_completed: CheckCircle2,
  alert: AlertCircle,
};

const activityColors: Record<ActivityType, string> = {
  member_joined: 'text-success',
  event_created: 'text-info',
  donation_received: 'text-primary',
  group_created: 'text-accent',
  attendance_recorded: 'text-success',
  message_sent: 'text-info',
  task_completed: 'text-success',
  alert: 'text-warning',
};

interface ActivityFeedProps {
  activities?: Activity[];
  maxHeight?: number;
  showSeeAll?: boolean;
  onSeeAll?: () => void;
}

export function ActivityFeed({ 
  activities = mockActivities,
  maxHeight = 500,
  showSeeAll = true,
  onSeeAll,
}: ActivityFeedProps) {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest updates and events
            </CardDescription>
          </div>
          {showSeeAll && (
            <button
              onClick={onSeeAll}
              className="text-sm text-primary hover:underline"
            >
              See all
            </button>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden">
        <ScrollArea className={cn("pr-4")} style={{ maxHeight }}>
          <div className="space-y-4">
            {activities.map((activity, index) => {
              const Icon = activityIcons[activity.type];
              const colorClass = activityColors[activity.type];

              return (
                <div
                  key={activity.id}
                  className={cn(
                    "flex gap-3 pb-4",
                    index !== activities.length - 1 && "border-b"
                  )}
                >
                  <div className={cn(
                    "h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0",
                    "bg-muted"
                  )}>
                    <Icon className={cn("h-5 w-5", colorClass)} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <p className="text-sm font-medium">{activity.title}</p>
                        <p className="text-sm text-muted-foreground mt-0.5">
                          {activity.description}
                        </p>
                        {activity.user && (
                          <div className="flex items-center gap-2 mt-2">
                            <Avatar className="h-5 w-5">
                              <AvatarImage src={activity.user.avatar} />
                              <AvatarFallback className="text-xs">
                                {activity.user.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-xs text-muted-foreground">
                              {activity.user.name}
                            </span>
                          </div>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {activity.timestamp}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

/**
 * Vue Migration Notes:
 * 
 * // components/dashboard/ActivityFeed.vue
 * <template>
 *   <q-card>
 *     <q-card-section>
 *       <div class="row items-center justify-between q-mb-md">
 *         <div>
 *           <div class="text-h6">Recent Activity</div>
 *           <div class="text-caption text-grey">Latest updates and events</div>
 *         </div>
 *         <q-btn 
 *           v-if="showSeeAll"
 *           flat 
 *           dense 
 *           label="See all" 
 *           color="primary" 
 *           @click="$emit('see-all')"
 *         />
 *       </div>
 *       
 *       <q-scroll-area :style="`max-height: ${maxHeight}px`">
 *         <q-list separator>
 *           <q-item 
 *             v-for="activity in activities" 
 *             :key="activity.id"
 *             class="q-px-none"
 *           >
 *             <q-item-section avatar>
 *               <q-avatar :color="getActivityColor(activity.type)" text-color="white">
 *                 <q-icon :name="getActivityIcon(activity.type)" />
 *               </q-avatar>
 *             </q-item-section>
 *             
 *             <q-item-section>
 *               <q-item-label>{{ activity.title }}</q-item-label>
 *               <q-item-label caption>{{ activity.description }}</q-item-label>
 *               
 *               <div v-if="activity.user" class="row items-center q-gutter-xs q-mt-xs">
 *                 <q-avatar size="20px">
 *                   <img v-if="activity.user.avatar" :src="activity.user.avatar" />
 *                   <span v-else>{{ getUserInitials(activity.user.name) }}</span>
 *                 </q-avatar>
 *                 <span class="text-caption text-grey">{{ activity.user.name }}</span>
 *               </div>
 *             </q-item-section>
 *             
 *             <q-item-section side>
 *               <q-item-label caption>{{ activity.timestamp }}</q-item-label>
 *             </q-item-section>
 *           </q-item>
 *         </q-list>
 *       </q-scroll-area>
 *     </q-card-section>
 *   </q-card>
 * </template>
 * 
 * <script setup lang="ts">
 * interface Props {
 *   activities?: Activity[];
 *   maxHeight?: number;
 *   showSeeAll?: boolean;
 * }
 * 
 * const props = withDefaults(defineProps<Props>(), {
 *   activities: () => mockActivities,
 *   maxHeight: 500,
 *   showSeeAll: true
 * });
 * 
 * const emit = defineEmits(['see-all']);
 * 
 * const getActivityIcon = (type: ActivityType) => {
 *   const icons = {
 *     member_joined: 'person_add',
 *     event_created: 'event',
 *     donation_received: 'payments',
 *     group_created: 'groups',
 *     attendance_recorded: 'check_circle',
 *     message_sent: 'message',
 *     task_completed: 'task_alt',
 *     alert: 'warning',
 *   };
 *   return icons[type];
 * };
 * 
 * const getActivityColor = (type: ActivityType) => {
 *   const colors = {
 *     member_joined: 'positive',
 *     event_created: 'info',
 *     donation_received: 'primary',
 *     group_created: 'accent',
 *     attendance_recorded: 'positive',
 *     message_sent: 'info',
 *     task_completed: 'positive',
 *     alert: 'warning',
 *   };
 *   return colors[type];
 * };
 * </script>
 */