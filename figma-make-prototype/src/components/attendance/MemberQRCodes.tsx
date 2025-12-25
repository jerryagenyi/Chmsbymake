/**
 * ChurchAfrica ChMS - Member QR Codes
 * View and manage member QR codes for check-in
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { ScrollArea } from '../ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import {
  Search,
  QrCode,
  Download,
  Printer,
  Grid3x3,
  List,
  Users
} from 'lucide-react';
import { Member } from '../../types/member';
import { QRCodeGenerator } from './QRCodeGenerator';
import { cn } from '../ui/utils';

interface MemberQRCodesProps {
  members: Member[];
  className?: string;
}

export function MemberQRCodes({
  members,
  className,
}: MemberQRCodesProps) {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedMember, setSelectedMember] = React.useState<Member | null>(null);
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid');

  const filteredMembers = React.useMemo(() => {
    if (!searchQuery) return members.filter(m => m.status === 'active');

    const query = searchQuery.toLowerCase();
    return members.filter(m => 
      m.status === 'active' && (
        `${m.firstName} ${m.lastName}`.toLowerCase().includes(query) ||
        m.contact.phone.toLowerCase().includes(query) ||
        m.membershipNumber?.toLowerCase().includes(query)
      )
    );
  }, [members, searchQuery]);

  const downloadAllQRCodes = () => {
    alert('Bulk download feature - Would generate ZIP file with all QR codes');
  };

  const printAllQRCodes = () => {
    alert('Bulk print feature - Would open print dialog with all QR codes');
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <h2>Member QR Codes</h2>
          <Badge variant="secondary">{filteredMembers.length} members</Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          Generate and manage QR codes for quick check-in
        </p>
      </div>

      {/* Actions Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search members by name, phone, or membership #..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* View Toggle */}
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('grid')}
              >
                <Grid3x3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>

            {/* Bulk Actions */}
            <div className="flex gap-2">
              <Button variant="outline" onClick={downloadAllQRCodes} className="gap-2">
                <Download className="h-4 w-4" />
                Download All
              </Button>
              <Button variant="outline" onClick={printAllQRCodes} className="gap-2">
                <Printer className="h-4 w-4" />
                Print All
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* QR Codes Grid/List */}
      {filteredMembers.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h4 className="mb-2">No Members Found</h4>
            <p className="text-sm text-muted-foreground">
              {searchQuery 
                ? 'Try a different search query'
                : 'No active members available'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <ScrollArea className="h-[600px]">
          <div className={cn(
            viewMode === 'grid' 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
              : "space-y-3"
          )}>
            {filteredMembers.map(member => (
              <MemberQRCard
                key={member.id}
                member={member}
                compact={viewMode === 'list'}
                onClick={() => setSelectedMember(member)}
              />
            ))}
          </div>
        </ScrollArea>
      )}

      {/* Member QR Code Detail Dialog */}
      <Dialog open={!!selectedMember} onOpenChange={() => setSelectedMember(null)}>
        <DialogContent className="sm:max-w-md" aria-describedby="member-qr-description">
          <DialogHeader className="sr-only">
            <DialogTitle>Member QR Code</DialogTitle>
            <DialogDescription id="member-qr-description">
              QR code for member check-in
            </DialogDescription>
          </DialogHeader>
          {selectedMember && (
            <QRCodeGenerator
              member={selectedMember}
              size={256}
              showActions={true}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Mini QR Card Component
interface MemberQRCardProps {
  member: Member;
  compact?: boolean;
  onClick: () => void;
}

function MemberQRCard({ member, compact = false, onClick }: MemberQRCardProps) {
  const initials = `${member.firstName[0]}${member.lastName[0]}`.toUpperCase();
  const fullName = `${member.firstName} ${member.lastName}`;

  if (compact) {
    return (
      <Card 
        className="cursor-pointer hover:shadow-md transition-all" 
        onClick={onClick}
      >
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={member.photo} alt={fullName} />
              <AvatarFallback className="bg-primary/10 text-primary">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h5 className="text-sm truncate">{fullName}</h5>
              <p className="text-xs text-muted-foreground truncate">
                {member.membershipNumber || 'No membership #'}
              </p>
            </div>
            <div className="flex-shrink-0">
              <div className="h-10 w-10 rounded bg-primary/10 flex items-center justify-center">
                <QrCode className="h-5 w-5 text-primary" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card 
      className="cursor-pointer hover:shadow-lg transition-all" 
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={member.photo} alt={fullName} />
            <AvatarFallback className="bg-primary/10 text-primary">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <CardTitle className="text-base truncate">{fullName}</CardTitle>
            <p className="text-sm text-muted-foreground truncate">
              {member.membershipNumber || 'No membership #'}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center p-4 bg-muted rounded-lg">
          <QrCode className="h-16 w-16 text-primary" />
        </div>
        <div className="mt-3 flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Click to view</span>
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
            QR Code
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Vue Migration Notes:
 * 
 * <template>
 *   <div class="q-pa-md">
 *     <div class="row items-center q-mb-md">
 *       <div class="col">
 *         <div class="text-h5">Member QR Codes</div>
 *         <div class="text-caption text-grey">
 *           Generate and manage QR codes for quick check-in
 *         </div>
 *       </div>
 *       <q-chip>{{ filteredMembers.length }} members</q-chip>
 *     </div>
 *     
 *     <q-card flat bordered class="q-mb-md">
 *       <q-card-section>
 *         <div class="row q-gutter-md">
 *           <q-input
 *             v-model="searchQuery"
 *             outlined
 *             dense
 *             placeholder="Search members..."
 *             class="col"
 *           >
 *             <template v-slot:prepend>
 *               <q-icon name="search" />
 *             </template>
 *           </q-input>
 *           
 *           <q-btn-toggle
 *             v-model="viewMode"
 *             :options="[
 *               { label: '', value: 'grid', icon: 'grid_view' },
 *               { label: '', value: 'list', icon: 'list' }
 *             ]"
 *           />
 *           
 *           <q-btn outline icon="download" label="Download All" @click="downloadAll" />
 *           <q-btn outline icon="print" label="Print All" @click="printAll" />
 *         </div>
 *       </q-card-section>
 *     </q-card>
 *     
 *     <q-scroll-area style="height: 600px">
 *       <div :class="viewMode === 'grid' ? 'row q-col-gutter-md' : 'column q-gutter-sm'">
 *         <div
 *           v-for="member in filteredMembers"
 *           :key="member.id"
 *           :class="viewMode === 'grid' ? 'col-12 col-md-6 col-lg-4' : 'col-12'"
 *         >
 *           <MemberQRCard
 *             :member="member"
 *             :compact="viewMode === 'list'"
 *             @click="selectedMember = member"
 *           />
 *         </div>
 *       </div>
 *     </q-scroll-area>
 *     
 *     <q-dialog v-model="showDialog">
 *       <QRCodeGenerator v-if="selectedMember" :member="selectedMember" />
 *     </q-dialog>
 *   </div>
 * </template>
 */