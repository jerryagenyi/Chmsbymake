/**
 * ChurchAfrica ChMS - Member Table Component
 * Tabular view of members with sorting and selection
 */

import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { Checkbox } from '../ui/checkbox';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { 
  ArrowUpDown, 
  ArrowUp, 
  ArrowDown,
  MoreHorizontal,
  Phone,
  Mail
} from 'lucide-react';
import { Member } from '../../types/member';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

type SortField = 'name' | 'joinDate' | 'status' | 'attendance';
type SortDirection = 'asc' | 'desc';

interface MemberTableProps {
  members: Member[];
  selectedIds?: string[];
  onSelectionChange?: (ids: string[]) => void;
  onMemberClick?: (member: Member) => void;
  onEdit?: (member: Member) => void;
  onDelete?: (member: Member) => void;
  sortable?: boolean;
}

export function MemberTable({
  members,
  selectedIds = [],
  onSelectionChange,
  onMemberClick,
  onEdit,
  onDelete,
  sortable = true,
}: MemberTableProps) {
  const [sortField, setSortField] = React.useState<SortField>('name');
  const [sortDirection, setSortDirection] = React.useState<SortDirection>('asc');

  const allSelected = members.length > 0 && selectedIds.length === members.length;
  const someSelected = selectedIds.length > 0 && selectedIds.length < members.length;

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedMembers = React.useMemo(() => {
    if (!sortable) return members;

    return [...members].sort((a, b) => {
      let comparison = 0;

      switch (sortField) {
        case 'name':
          comparison = `${a.firstName} ${a.lastName}`.localeCompare(
            `${b.firstName} ${b.lastName}`
          );
          break;
        case 'joinDate':
          comparison = new Date(a.joinDate).getTime() - new Date(b.joinDate).getTime();
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
        case 'attendance':
          comparison = (a.attendancePercentage || 0) - (b.attendancePercentage || 0);
          break;
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [members, sortField, sortDirection, sortable]);

  const toggleAll = () => {
    if (allSelected) {
      onSelectionChange?.([]);
    } else {
      onSelectionChange?.(members.map(m => m.id));
    }
  };

  const toggleMember = (id: string) => {
    const newSelection = selectedIds.includes(id)
      ? selectedIds.filter(sid => sid !== id)
      : [...selectedIds, id];
    onSelectionChange?.(newSelection);
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ArrowUpDown className="h-4 w-4" />;
    return sortDirection === 'asc' 
      ? <ArrowUp className="h-4 w-4" />
      : <ArrowDown className="h-4 w-4" />;
  };

  const statusColors: Record<Member['status'], string> = {
    active: 'bg-success/10 text-success border-success/20',
    inactive: 'bg-muted text-muted-foreground border-border',
    visitor: 'bg-info/10 text-info border-info/20',
    alumni: 'bg-accent/10 text-accent border-accent/20',
  };

  // Get the checked state for the header checkbox
  const getHeaderCheckedState = () => {
    if (allSelected) return true;
    if (someSelected) return 'indeterminate' as const;
    return false;
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {onSelectionChange && (
              <TableHead className="w-12">
                <Checkbox
                  checked={getHeaderCheckedState()}
                  onCheckedChange={toggleAll}
                />
              </TableHead>
            )}
            <TableHead>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleSort('name')}
                className="h-8 -ml-3"
              >
                Member
                {sortable && <SortIcon field="name" />}
              </Button>
            </TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleSort('status')}
                className="h-8 -ml-3"
              >
                Status
                {sortable && <SortIcon field="status" />}
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleSort('joinDate')}
                className="h-8 -ml-3"
              >
                Join Date
                {sortable && <SortIcon field="joinDate" />}
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleSort('attendance')}
                className="h-8 -ml-3"
              >
                Attendance
                {sortable && <SortIcon field="attendance" />}
              </Button>
            </TableHead>
            <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedMembers.length === 0 ? (
            <TableRow>
              <TableCell 
                colSpan={onSelectionChange ? 7 : 6} 
                className="text-center text-muted-foreground py-8"
              >
                No members found
              </TableCell>
            </TableRow>
          ) : (
            sortedMembers.map((member) => {
              const initials = `${member.firstName[0]}${member.lastName[0]}`.toUpperCase();
              const fullName = `${member.firstName} ${member.lastName}`;
              const isSelected = selectedIds.includes(member.id);

              return (
                <TableRow
                  key={member.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => onMemberClick?.(member)}
                >
                  {onSelectionChange && (
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => toggleMember(member.id)}
                      />
                    </TableCell>
                  )}
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={member.photo} alt={fullName} />
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{fullName}</div>
                        <div className="text-sm text-muted-foreground">
                          {member.membershipNumber || 'No membership #'}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {member.contact.phone && (
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-3 w-3 text-muted-foreground" />
                          <span>{member.contact.phone}</span>
                        </div>
                      )}
                      {member.contact.email && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Mail className="h-3 w-3" />
                          <span className="truncate max-w-[200px]">
                            {member.contact.email}
                          </span>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={statusColors[member.status]}>
                      {member.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(member.joinDate).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="text-sm">
                        {member.attendancePercentage !== undefined
                          ? `${member.attendancePercentage}%`
                          : 'N/A'}
                      </div>
                      {member.attendancePercentage !== undefined && (
                        <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary transition-all"
                            style={{ width: `${member.attendancePercentage}%` }}
                          />
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onMemberClick?.(member)}>
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEdit?.(member)}>
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-destructive"
                          onClick={() => onDelete?.(member)}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}

/**
 * Vue/Quasar Migration Notes:
 * 
 * Use Quasar's QTable component with built-in features:
 * - Row selection
 * - Column sorting
 * - Pagination
 * - Virtual scrolling for performance
 * 
 * <q-table
 *   :rows="members"
 *   :columns="columns"
 *   :selected.sync="selected"
 *   selection="multiple"
 *   row-key="id"
 *   :pagination.sync="pagination"
 *   @row-click="onRowClick"
 *   virtual-scroll
 * >
 *   <template v-slot:body-cell-member="props">
 *     <q-td :props="props">
 *       <div class="row items-center q-gutter-sm">
 *         <q-avatar size="40px">
 *           <img v-if="props.row.photo" :src="props.row.photo" />
 *           <span v-else>{{ getInitials(props.row) }}</span>
 *         </q-avatar>
 *         <div>
 *           <div class="text-subtitle2">{{ props.row.firstName }} {{ props.row.lastName }}</div>
 *           <div class="text-caption text-grey">{{ props.row.membershipNumber }}</div>
 *         </div>
 *       </div>
 *     </q-td>
 *   </template>
 * </q-table>
 */