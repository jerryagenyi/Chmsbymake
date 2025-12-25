/**
 * ChurchAfrica ChMS - Member Card Component
 * Compact member display card for list/grid views
 */

import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  MoreVertical,
  User,
  Heart,
  MessageSquare
} from 'lucide-react';
import { Member } from '../../types/member';
import { cn } from '../ui/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

interface MemberCardProps {
  member: Member;
  onClick?: (member: Member) => void;
  onEdit?: (member: Member) => void;
  onDelete?: (member: Member) => void;
  onMessage?: (member: Member) => void;
  compact?: boolean;
}

export function MemberCard({ 
  member, 
  onClick,
  onEdit,
  onDelete,
  onMessage,
  compact = false
}: MemberCardProps) {
  const initials = `${member.firstName[0]}${member.lastName[0]}`.toUpperCase();
  const fullName = `${member.firstName} ${member.lastName}`;
  
  const statusColors: Record<Member['status'], string> = {
    active: 'bg-success/10 text-success border-success/20',
    inactive: 'bg-muted text-muted-foreground border-border',
    visitor: 'bg-info/10 text-info border-info/20',
    alumni: 'bg-accent/10 text-accent border-accent/20',
  };

  const formatDate = (date?: string) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <Card 
      className={cn(
        "transition-all hover:shadow-md hover:border-primary/50",
        onClick && "cursor-pointer"
      )}
      onClick={() => onClick?.(member)}
    >
      <CardContent className="pt-6">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <Avatar className="h-16 w-16 flex-shrink-0">
            <AvatarImage src={member.photo} alt={fullName} />
            <AvatarFallback className="bg-primary/10 text-primary text-lg">
              {initials}
            </AvatarFallback>
          </Avatar>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex-1 min-w-0">
                <h4 className="truncate">{fullName}</h4>
                <p className="text-sm text-muted-foreground truncate">
                  {member.membershipNumber || 'No membership #'}
                </p>
              </div>

              {/* Actions Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                  <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={(e) => {
                    e.stopPropagation();
                    onClick?.(member);
                  }}>
                    <User className="h-4 w-4 mr-2" />
                    View Details
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={(e) => {
                    e.stopPropagation();
                    onEdit?.(member);
                  }}>
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={(e) => {
                    e.stopPropagation();
                    onMessage?.(member);
                  }}>
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Send Message
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="text-destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete?.(member);
                    }}
                  >
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-3">
              <Badge variant="outline" className={statusColors[member.status]}>
                {member.status}
              </Badge>
              <Badge variant="outline" className="capitalize">
                {member.gender}
              </Badge>
              {member.ministries && member.ministries.length > 0 && (
                <Badge variant="secondary">
                  {member.ministries.length} {member.ministries.length === 1 ? 'Ministry' : 'Ministries'}
                </Badge>
              )}
            </div>

            {/* Contact Info (if not compact) */}
            {!compact && (
              <div className="space-y-1 text-sm text-muted-foreground">
                {member.contact.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-3 w-3" />
                    <span className="truncate">{member.contact.phone}</span>
                  </div>
                )}
                {member.contact.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-3 w-3" />
                    <span className="truncate">{member.contact.email}</span>
                  </div>
                )}
                {member.contact.address?.city && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3 w-3" />
                    <span className="truncate">
                      {member.contact.address.city}, {member.contact.address.state}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Calendar className="h-3 w-3" />
                  <span>Joined {formatDate(member.joinDate)}</span>
                </div>
              </div>
            )}

            {/* Stats (if compact) */}
            {compact && (
              <div className="flex gap-4 text-xs text-muted-foreground">
                {member.attendancePercentage !== undefined && (
                  <div className="flex items-center gap-1">
                    <Heart className="h-3 w-3" />
                    <span>{member.attendancePercentage}%</span>
                  </div>
                )}
                <div>
                  Joined {formatDate(member.joinDate)}
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Vue Migration Notes:
 * 
 * // components/members/MemberCard.vue
 * <template>
 *   <q-card 
 *     class="member-card cursor-pointer"
 *     @click="$emit('click', member)"
 *   >
 *     <q-card-section>
 *       <div class="row items-start q-gutter-md">
 *         <!-- Avatar -->
 *         <q-avatar size="64px">
 *           <img v-if="member.photo" :src="member.photo" />
 *           <span v-else>{{ initials }}</span>
 *         </q-avatar>
 *         
 *         <!-- Content -->
 *         <div class="col">
 *           <div class="row items-start justify-between q-mb-sm">
 *             <div class="col">
 *               <div class="text-subtitle1">{{ fullName }}</div>
 *               <div class="text-caption text-grey">
 *                 {{ member.membershipNumber || 'No membership #' }}
 *               </div>
 *             </div>
 *             
 *             <!-- Actions Menu -->
 *             <q-btn 
 *               flat 
 *               dense 
 *               round 
 *               icon="more_vert"
 *               @click.stop
 *             >
 *               <q-menu>
 *                 <q-list dense>
 *                   <q-item clickable @click="$emit('click', member)">
 *                     <q-item-section avatar>
 *                       <q-icon name="person" />
 *                     </q-item-section>
 *                     <q-item-section>View Details</q-item-section>
 *                   </q-item>
 *                   <q-item clickable @click.stop="$emit('edit', member)">
 *                     <q-item-section>Edit</q-item-section>
 *                   </q-item>
 *                   <q-item clickable @click.stop="$emit('message', member)">
 *                     <q-item-section avatar>
 *                       <q-icon name="message" />
 *                     </q-item-section>
 *                     <q-item-section>Send Message</q-item-section>
 *                   </q-item>
 *                   <q-separator />
 *                   <q-item clickable @click.stop="$emit('delete', member)">
 *                     <q-item-section class="text-negative">Delete</q-item-section>
 *                   </q-item>
 *                 </q-list>
 *               </q-menu>
 *             </q-btn>
 *           </div>
 *           
 *           <!-- Badges -->
 *           <div class="row q-gutter-xs q-mb-sm">
 *             <q-chip 
 *               :color="getStatusColor(member.status)" 
 *               size="sm" 
 *               dense
 *             >
 *               {{ member.status }}
 *             </q-chip>
 *             <q-chip size="sm" dense>
 *               {{ member.gender }}
 *             </q-chip>
 *             <q-chip v-if="member.ministries?.length" size="sm" dense outline>
 *               {{ member.ministries.length }} Ministries
 *             </q-chip>
 *           </div>
 *           
 *           <!-- Contact Info -->
 *           <div v-if="!compact" class="column q-gutter-xs text-caption text-grey">
 *             <div v-if="member.contact.phone" class="row items-center q-gutter-xs">
 *               <q-icon name="phone" size="xs" />
 *               <span>{{ member.contact.phone }}</span>
 *             </div>
 *             <div v-if="member.contact.email" class="row items-center q-gutter-xs">
 *               <q-icon name="mail" size="xs" />
 *               <span>{{ member.contact.email }}</span>
 *             </div>
 *             <div v-if="member.contact.address?.city" class="row items-center q-gutter-xs">
 *               <q-icon name="place" size="xs" />
 *               <span>{{ member.contact.address.city }}, {{ member.contact.address.state }}</span>
 *             </div>
 *             <div class="row items-center q-gutter-xs">
 *               <q-icon name="event" size="xs" />
 *               <span>Joined {{ formatDate(member.joinDate) }}</span>
 *             </div>
 *           </div>
 *         </div>
 *       </div>
 *     </q-card-section>
 *   </q-card>
 * </template>
 * 
 * <script setup lang="ts">
 * import { computed } from 'vue';
 * import type { Member } from '@/types/member';
 * 
 * interface Props {
 *   member: Member;
 *   compact?: boolean;
 * }
 * 
 * const props = withDefaults(defineProps<Props>(), {
 *   compact: false
 * });
 * 
 * const emit = defineEmits(['click', 'edit', 'delete', 'message']);
 * 
 * const initials = computed(() => 
 *   `${props.member.firstName[0]}${props.member.lastName[0]}`.toUpperCase()
 * );
 * 
 * const fullName = computed(() => 
 *   `${props.member.firstName} ${props.member.lastName}`
 * );
 * 
 * const getStatusColor = (status: Member['status']) => {
 *   const colors = {
 *     active: 'positive',
 *     inactive: 'grey',
 *     visitor: 'info',
 *     alumni: 'accent',
 *   };
 *   return colors[status];
 * };
 * 
 * const formatDate = (date: string) => {
 *   return new Date(date).toLocaleDateString('en-US', { 
 *     month: 'short', 
 *     day: 'numeric', 
 *     year: 'numeric' 
 *   });
 * };
 * </script>
 * 
 * <style scoped>
 * .member-card:hover {
 *   box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
 *   border-color: var(--q-primary);
 * }
 * </style>
 */
