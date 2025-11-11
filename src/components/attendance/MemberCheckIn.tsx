/**
 * ChurchAfrica ChMS - Member Check-In Card
 * Individual member check-in component
 */

import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { 
  Check, 
  X, 
  Clock,
  User,
  Star,
  UserPlus
} from 'lucide-react';
import { Member } from '../../types/member';
import { AttendanceRecord, AttendanceStatus } from '../../types/attendance';
import { cn } from '../ui/utils';

interface MemberCheckInProps {
  member: Member;
  attendance?: AttendanceRecord;
  onCheckIn: (memberId: string, status: AttendanceStatus) => void;
  disabled?: boolean;
  compact?: boolean;
}

export function MemberCheckIn({
  member,
  attendance,
  onCheckIn,
  disabled = false,
  compact = false,
}: MemberCheckInProps) {
  const initials = `${member.firstName[0]}${member.lastName[0]}`.toUpperCase();
  const fullName = `${member.firstName} ${member.lastName}`;
  const isCheckedIn = attendance?.status === 'present' || attendance?.status === 'late';
  
  const formatCheckInTime = (time?: string) => {
    if (!time) return '';
    const date = new Date(time);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const statusColors: Record<AttendanceStatus, string> = {
    present: 'bg-success/10 text-success border-success/20',
    late: 'bg-warning/10 text-warning border-warning/20',
    absent: 'bg-muted text-muted-foreground border-border',
    excused: 'bg-info/10 text-info border-info/20',
  };

  return (
    <Card 
      className={cn(
        "transition-all",
        isCheckedIn && "border-success shadow-sm"
      )}
    >
      <CardContent className={cn("p-4", compact && "p-3")}>
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <Avatar className={cn("flex-shrink-0", compact ? "h-10 w-10" : "h-12 w-12")}>
            <AvatarImage src={member.photo} alt={fullName} />
            <AvatarFallback className="bg-primary/10 text-primary">
              {initials}
            </AvatarFallback>
          </Avatar>

          {/* Member Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <h5 className="truncate text-sm">{fullName}</h5>
                <p className="text-xs text-muted-foreground truncate">
                  {member.membershipNumber || 'No membership #'}
                </p>
              </div>

              {/* Status Badge or Check-in Time */}
              {attendance ? (
                <div className="flex flex-col items-end gap-1">
                  <Badge 
                    variant="outline" 
                    className={cn("text-xs", statusColors[attendance.status])}
                  >
                    {attendance.status}
                  </Badge>
                  {attendance.checkInTime && (
                    <span className="text-xs text-muted-foreground">
                      {formatCheckInTime(attendance.checkInTime)}
                    </span>
                  )}
                </div>
              ) : member.status === 'visitor' ? (
                <Badge variant="outline" className="bg-info/10 text-info border-info/20 text-xs">
                  <UserPlus className="h-3 w-3 mr-1" />
                  Visitor
                </Badge>
              ) : null}
            </div>

            {/* Additional Info */}
            {!compact && (
              <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                {member.attendancePercentage !== undefined && (
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3" />
                    <span>{member.attendancePercentage}% rate</span>
                  </div>
                )}
                {member.ministries && member.ministries.length > 0 && (
                  <div className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    <span>{member.ministries.length} {member.ministries.length === 1 ? 'ministry' : 'ministries'}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          {!disabled && (
            <div className="flex items-center gap-1 flex-shrink-0">
              {isCheckedIn ? (
                <Button
                  variant="outline"
                  size="icon"
                  className="h-9 w-9 border-success text-success hover:bg-success hover:text-success-foreground"
                  onClick={() => onCheckIn(member.id, 'absent')}
                  title="Undo check-in"
                >
                  <X className="h-4 w-4" />
                </Button>
              ) : (
                <>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-9 w-9 hover:bg-success hover:text-success-foreground hover:border-success"
                    onClick={() => onCheckIn(member.id, 'present')}
                    title="Mark present"
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-9 w-9 hover:bg-warning hover:text-warning-foreground hover:border-warning"
                    onClick={() => onCheckIn(member.id, 'late')}
                    title="Mark late"
                  >
                    <Clock className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Vue Migration Notes:
 * 
 * <template>
 *   <q-card 
 *     :class="{'border-positive': isCheckedIn}"
 *     flat
 *     bordered
 *   >
 *     <q-card-section :class="compact ? 'q-pa-sm' : 'q-pa-md'">
 *       <div class="row items-center q-gutter-sm">
 *         <!-- Avatar -->
 *         <q-avatar :size="compact ? '40px' : '48px'">
 *           <img v-if="member.photo" :src="member.photo" />
 *           <span v-else>{{ initials }}</span>
 *         </q-avatar>
 *         
 *         <!-- Member Info -->
 *         <div class="col">
 *           <div class="row items-start justify-between q-gutter-xs">
 *             <div class="col">
 *               <div class="text-subtitle2">{{ fullName }}</div>
 *               <div class="text-caption text-grey">
 *                 {{ member.membershipNumber || 'No membership #' }}
 *               </div>
 *             </div>
 *             
 *             <!-- Status -->
 *             <div v-if="attendance" class="column items-end q-gutter-xs">
 *               <q-chip 
 *                 size="sm" 
 *                 :color="getStatusColor(attendance.status)"
 *               >
 *                 {{ attendance.status }}
 *               </q-chip>
 *               <div v-if="attendance.checkInTime" class="text-caption text-grey">
 *                 {{ formatCheckInTime(attendance.checkInTime) }}
 *               </div>
 *             </div>
 *             <q-chip 
 *               v-else-if="member.status === 'visitor'"
 *               size="sm"
 *               color="info"
 *             >
 *               <q-icon name="person_add" size="xs" left />
 *               Visitor
 *             </q-chip>
 *           </div>
 *           
 *           <!-- Additional Info -->
 *           <div v-if="!compact" class="row q-gutter-md q-mt-xs text-caption text-grey">
 *             <div v-if="member.attendancePercentage" class="row items-center q-gutter-xs">
 *               <q-icon name="star" size="xs" />
 *               <span>{{ member.attendancePercentage }}% rate</span>
 *             </div>
 *             <div v-if="member.ministries?.length" class="row items-center q-gutter-xs">
 *               <q-icon name="person" size="xs" />
 *               <span>{{ member.ministries.length }} ministries</span>
 *             </div>
 *           </div>
 *         </div>
 *         
 *         <!-- Action Buttons -->
 *         <div v-if="!disabled" class="row q-gutter-xs">
 *           <q-btn
 *             v-if="isCheckedIn"
 *             outline
 *             round
 *             icon="close"
 *             color="positive"
 *             @click="$emit('check-in', member.id, 'absent')"
 *           >
 *             <q-tooltip>Undo check-in</q-tooltip>
 *           </q-btn>
 *           <template v-else>
 *             <q-btn
 *               outline
 *               round
 *               icon="check"
 *               @click="$emit('check-in', member.id, 'present')"
 *             >
 *               <q-tooltip>Mark present</q-tooltip>
 *             </q-btn>
 *             <q-btn
 *               outline
 *               round
 *               icon="schedule"
 *               @click="$emit('check-in', member.id, 'late')"
 *             >
 *               <q-tooltip>Mark late</q-tooltip>
 *             </q-btn>
 *           </template>
 *         </div>
 *       </div>
 *     </q-card-section>
 *   </q-card>
 * </template>
 * 
 * <script setup lang="ts">
 * import { computed } from 'vue';
 * import type { Member } from '@/types/member';
 * import type { AttendanceRecord, AttendanceStatus } from '@/types/attendance';
 * 
 * interface Props {
 *   member: Member;
 *   attendance?: AttendanceRecord;
 *   disabled?: boolean;
 *   compact?: boolean;
 * }
 * 
 * const props = withDefaults(defineProps<Props>(), {
 *   disabled: false,
 *   compact: false
 * });
 * 
 * const emit = defineEmits(['check-in']);
 * 
 * const initials = computed(() => 
 *   `${props.member.firstName[0]}${props.member.lastName[0]}`.toUpperCase()
 * );
 * 
 * const fullName = computed(() => 
 *   `${props.member.firstName} ${props.member.lastName}`
 * );
 * 
 * const isCheckedIn = computed(() => 
 *   props.attendance?.status === 'present' || props.attendance?.status === 'late'
 * );
 * </script>
 */
