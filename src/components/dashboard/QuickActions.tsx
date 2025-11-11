/**
 * ChurchAfrica ChMS - Quick Actions
 * Fast access buttons for common tasks
 */

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { 
  UserPlus, 
  ClipboardList, 
  Calendar, 
  MessageSquare,
  DollarSign,
  Users,
  FileText,
  BarChart3
} from 'lucide-react';
import { cn } from '../ui/utils';

export interface QuickAction {
  id: string;
  label: string;
  icon: React.ElementType;
  color?: string;
  onClick: () => void;
  badge?: string;
  disabled?: boolean;
}

const defaultActions: QuickAction[] = [
  {
    id: 'add-member',
    label: 'Add Member',
    icon: UserPlus,
    color: 'primary',
    onClick: () => console.log('Add member'),
  },
  {
    id: 'record-attendance',
    label: 'Record Attendance',
    icon: ClipboardList,
    color: 'success',
    onClick: () => console.log('Record attendance'),
  },
  {
    id: 'create-event',
    label: 'Create Event',
    icon: Calendar,
    color: 'info',
    onClick: () => console.log('Create event'),
  },
  {
    id: 'send-message',
    label: 'Send Message',
    icon: MessageSquare,
    color: 'accent',
    onClick: () => console.log('Send message'),
    badge: '3',
  },
  {
    id: 'record-giving',
    label: 'Record Giving',
    icon: DollarSign,
    color: 'primary',
    onClick: () => console.log('Record giving'),
  },
  {
    id: 'manage-groups',
    label: 'Manage Groups',
    icon: Users,
    color: 'info',
    onClick: () => console.log('Manage groups'),
  },
  {
    id: 'generate-report',
    label: 'Generate Report',
    icon: FileText,
    color: 'accent',
    onClick: () => console.log('Generate report'),
  },
  {
    id: 'view-analytics',
    label: 'View Analytics',
    icon: BarChart3,
    color: 'success',
    onClick: () => console.log('View analytics'),
  },
];

interface QuickActionsProps {
  actions?: QuickAction[];
  columns?: number;
}

export function QuickActions({ 
  actions = defaultActions,
  columns = 4,
}: QuickActionsProps) {
  const gridCols = {
    2: 'grid-cols-2',
    3: 'grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-2 lg:grid-cols-4',
    5: 'grid-cols-2 lg:grid-cols-5',
  }[columns] || 'grid-cols-2 lg:grid-cols-4';

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>
          Common tasks and shortcuts
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className={cn("grid gap-3", gridCols)}>
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <Button
                key={action.id}
                variant="outline"
                className="h-auto flex-col gap-2 p-4 touch-target relative"
                onClick={action.onClick}
                disabled={action.disabled}
              >
                {action.badge && (
                  <span className="absolute top-2 right-2 h-5 w-5 rounded-full bg-destructive text-white text-xs flex items-center justify-center">
                    {action.badge}
                  </span>
                )}
                <Icon className="h-6 w-6" />
                <span className="text-xs text-center">{action.label}</span>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Vue Migration Notes:
 * 
 * // components/dashboard/QuickActions.vue
 * <template>
 *   <q-card>
 *     <q-card-section>
 *       <div class="text-h6">Quick Actions</div>
 *       <div class="text-caption text-grey">Common tasks and shortcuts</div>
 *       
 *       <div class="row q-col-gutter-sm q-mt-md">
 *         <div 
 *           v-for="action in actions" 
 *           :key="action.id"
 *           class="col-6 col-md-3"
 *         >
 *           <q-btn
 *             unelevated
 *             outline
 *             class="full-width"
 *             style="min-height: 100px;"
 *             @click="action.onClick"
 *             :disable="action.disabled"
 *           >
 *             <div class="column items-center q-gutter-xs">
 *               <q-badge 
 *                 v-if="action.badge" 
 *                 color="negative" 
 *                 floating
 *               >
 *                 {{ action.badge }}
 *               </q-badge>
 *               
 *               <q-icon :name="action.icon" size="md" />
 *               <span class="text-caption">{{ action.label }}</span>
 *             </div>
 *           </q-btn>
 *         </div>
 *       </div>
 *     </q-card-section>
 *   </q-card>
 * </template>
 * 
 * <script setup lang="ts">
 * interface QuickAction {
 *   id: string;
 *   label: string;
 *   icon: string;
 *   color?: string;
 *   onClick: () => void;
 *   badge?: string;
 *   disabled?: boolean;
 * }
 * 
 * interface Props {
 *   actions?: QuickAction[];
 * }
 * 
 * const props = withDefaults(defineProps<Props>(), {
 *   actions: () => [
 *     { id: 'add-member', label: 'Add Member', icon: 'person_add', onClick: () => {} },
 *     { id: 'record-attendance', label: 'Record Attendance', icon: 'checklist', onClick: () => {} },
 *     { id: 'create-event', label: 'Create Event', icon: 'event', onClick: () => {} },
 *     { id: 'send-message', label: 'Send Message', icon: 'message', badge: '3', onClick: () => {} },
 *     { id: 'record-giving', label: 'Record Giving', icon: 'payments', onClick: () => {} },
 *     { id: 'manage-groups', label: 'Manage Groups', icon: 'groups', onClick: () => {} },
 *     { id: 'generate-report', label: 'Generate Report', icon: 'description', onClick: () => {} },
 *     { id: 'view-analytics', label: 'View Analytics', icon: 'analytics', onClick: () => {} },
 *   ]
 * });
 * </script>
 */
