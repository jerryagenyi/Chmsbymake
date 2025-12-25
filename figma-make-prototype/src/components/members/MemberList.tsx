/**
 * ChurchAfrica ChMS - Member List
 * Main member management interface with table/grid views
 */

import React from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  LayoutGrid, 
  LayoutList, 
  Plus, 
  Download, 
  Upload,
  Search,
  SlidersHorizontal,
  X
} from 'lucide-react';
import { Member, MemberFilters as MemberFiltersType } from '../../types/member';
import { MemberCard } from './MemberCard';
import { MemberTable } from './MemberTable';
import { MemberFilters } from './MemberFilters';
import { MemberDetails } from './MemberDetails';
import { AddMemberForm } from './AddMemberForm';
import { ImportExportDialog } from './ImportExportDialog';
import { BulkActionsBar } from './BulkActionsBar';
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';
import { PageHeader } from '../layout/PageHeader';

type ViewMode = 'grid' | 'table';

interface MemberListProps {
  members: Member[];
  onAddMember?: (member: Partial<Member>) => void;
  onEditMember?: (member: Member) => void;
  onDeleteMember?: (member: Member) => void;
  onViewMember?: (member: Member) => void;
  onExport?: () => void;
  onImport?: (members: Partial<Member>[]) => void;
}

export function MemberList({
  members,
  onAddMember,
  onEditMember,
  onDeleteMember,
  onViewMember,
  onExport,
  onImport,
}: MemberListProps) {
  const [viewMode, setViewMode] = React.useState<ViewMode>('grid');
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
  const [filters, setFilters] = React.useState<MemberFiltersType>({});
  const [quickSearch, setQuickSearch] = React.useState('');
  const [selectedMember, setSelectedMember] = React.useState<Member | null>(null);
  const [showAddForm, setShowAddForm] = React.useState(false);
  const [showImportDialog, setShowImportDialog] = React.useState(false);
  const [showExportDialog, setShowExportDialog] = React.useState(false);

  // Filter members based on current filters
  const filteredMembers = React.useMemo(() => {
    return members.filter((member) => {
      // Quick search (name, email, phone)
      if (quickSearch) {
        const search = quickSearch.toLowerCase();
        const fullName = `${member.firstName} ${member.lastName}`.toLowerCase();
        const email = member.contact.email?.toLowerCase() || '';
        const phone = member.contact.phone?.toLowerCase() || '';
        
        if (
          !fullName.includes(search) &&
          !email.includes(search) &&
          !phone.includes(search)
        ) {
          return false;
        }
      }

      // Advanced search
      if (filters.search) {
        const search = filters.search.toLowerCase();
        const fullName = `${member.firstName} ${member.lastName}`.toLowerCase();
        const email = member.contact.email?.toLowerCase() || '';
        const phone = member.contact.phone?.toLowerCase() || '';
        
        if (
          !fullName.includes(search) &&
          !email.includes(search) &&
          !phone.includes(search) &&
          !(member.membershipNumber?.toLowerCase().includes(search))
        ) {
          return false;
        }
      }

      // Status filter
      if (filters.status && filters.status.length > 0) {
        if (!filters.status.includes(member.status)) return false;
      }

      // Gender filter
      if (filters.gender && filters.gender.length > 0) {
        if (!filters.gender.includes(member.gender)) return false;
      }

      // Marital status filter
      if (filters.maritalStatus && filters.maritalStatus.length > 0) {
        if (!filters.maritalStatus.includes(member.maritalStatus)) return false;
      }

      // Age group filter
      if (filters.ageGroup && filters.ageGroup.length > 0) {
        const age = member.dateOfBirth
          ? Math.floor(
              (new Date().getTime() - new Date(member.dateOfBirth).getTime()) /
                (365.25 * 24 * 60 * 60 * 1000)
            )
          : null;
        
        if (age === null) return false;
        
        const ageGroup =
          age < 13 ? 'child' :
          age < 18 ? 'youth' :
          age < 36 ? 'young_adult' :
          age < 60 ? 'adult' : 'senior';
        
        if (!filters.ageGroup.includes(ageGroup)) return false;
      }

      // Join date range
      if (filters.joinDateFrom) {
        if (new Date(member.joinDate) < new Date(filters.joinDateFrom)) {
          return false;
        }
      }
      if (filters.joinDateTo) {
        if (new Date(member.joinDate) > new Date(filters.joinDateTo)) {
          return false;
        }
      }

      // Has photo filter
      if (filters.hasPhoto !== undefined) {
        if (filters.hasPhoto && !member.photo) return false;
        if (!filters.hasPhoto && member.photo) return false;
      }

      return true;
    });
  }, [members, filters, quickSearch]);

  const resetFilters = () => {
    setFilters({});
    setQuickSearch('');
  };

  const stats = React.useMemo(() => {
    return {
      total: filteredMembers.length,
      active: filteredMembers.filter(m => m.status === 'active').length,
      visitors: filteredMembers.filter(m => m.status === 'visitor').length,
      selected: selectedIds.length,
    };
  }, [filteredMembers, selectedIds]);

  const handleViewMember = (member: Member) => {
    setSelectedMember(member);
    onViewMember?.(member);
  };

  const handleBackToList = () => {
    setSelectedMember(null);
  };

  // If a member is selected, show detail view
  if (selectedMember) {
    return (
      <MemberDetails
        member={selectedMember}
        onBack={handleBackToList}
        onEdit={onEditMember}
        onDelete={(member) => {
          onDeleteMember?.(member);
          handleBackToList();
        }}
        onMessage={(member) => {
          alert(`Message feature coming soon for ${member.firstName} ${member.lastName}`);
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <PageHeader
        title="Members"
        action={
          <div className="flex items-center gap-2">
            {onImport && (
              <Button variant="outline" onClick={() => setShowImportDialog(true)} className="gap-2">
                <Upload className="h-4 w-4" />
                Import
              </Button>
            )}
            {onExport && (
              <Button variant="outline" onClick={() => setShowExportDialog(true)} className="gap-2">
                <Download className="h-4 w-4" />
                Export
              </Button>
            )}
            {onAddMember && (
              <Button onClick={() => setShowAddForm(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                Add Member
              </Button>
            )}
          </div>
        }
      >
        {/* Stats badges */}
        <div className="bg-[#0F0F12] rounded-lg border border-border/50 p-4">
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{stats.total} Total</Badge>
            <Badge variant="outline" className="bg-success/10 text-success border-success/20">
              {stats.active} Active
            </Badge>
            <Badge variant="outline" className="bg-info/10 text-info border-info/20">
              {stats.visitors} Visitors
            </Badge>
            {stats.selected > 0 && (
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                {stats.selected} Selected
              </Badge>
            )}
          </div>
        </div>
      </PageHeader>

      {/* Search and View Controls */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Quick search by name, email, or phone..."
            value={quickSearch}
            onChange={(e) => setQuickSearch(e.target.value)}
            className="pl-9 pr-9"
          />
          {quickSearch && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
              onClick={() => setQuickSearch('')}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Advanced Filters (Mobile Sheet) */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="gap-2">
                <SlidersHorizontal className="h-4 w-4" />
                Filters
                {Object.keys(filters).filter(k => k !== 'search' && filters[k as keyof MemberFiltersType]).length > 0 && (
                  <Badge variant="secondary" className="ml-1">
                    {Object.keys(filters).filter(k => k !== 'search' && filters[k as keyof MemberFiltersType]).length}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80">
              <MemberFilters
                filters={filters}
                onChange={setFilters}
                onReset={resetFilters}
                resultCount={filteredMembers.length}
              />
            </SheetContent>
          </Sheet>

          {/* View Mode Toggle */}
          <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as ViewMode)}>
            <TabsList>
              <TabsTrigger value="grid" className="gap-2">
                <LayoutGrid className="h-4 w-4" />
                <span className="hidden sm:inline">Grid</span>
              </TabsTrigger>
              <TabsTrigger value="table" className="gap-2">
                <LayoutList className="h-4 w-4" />
                <span className="hidden sm:inline">Table</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Member List/Grid */}
      {filteredMembers.length === 0 ? (
        <div className="text-center py-12 border rounded-lg bg-muted/20">
          <p className="text-muted-foreground mb-4">No members found</p>
          {(quickSearch || Object.keys(filters).some(k => filters[k as keyof MemberFiltersType])) && (
            <Button variant="outline" onClick={resetFilters}>
              Clear Filters
            </Button>
          )}
          {!quickSearch && Object.keys(filters).length === 0 && onAddMember && (
            <Button onClick={() => setShowAddForm(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Your First Member
            </Button>
          )}
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMembers.map((member) => (
            <MemberCard
              key={member.id}
              member={member}
              onClick={handleViewMember}
              onEdit={onEditMember}
              onDelete={onDeleteMember}
            />
          ))}
        </div>
      ) : (
        <div className="relative">
          <MemberTable
            members={filteredMembers}
            selectedIds={selectedIds}
            onSelectionChange={setSelectedIds}
            onMemberClick={handleViewMember}
            onEdit={onEditMember}
            onDelete={onDeleteMember}
          />
          
          {/* Bulk Actions Bar - Shows when members are selected */}
          {selectedIds.length > 0 && (
            <BulkActionsBar
              selectedCount={selectedIds.length}
              onExport={() => {
                console.log('Exporting selected members:', selectedIds);
                alert(`Exporting ${selectedIds.length} members...`);
              }}
              onDelete={() => {
                if (confirm(`Are you sure you want to delete ${selectedIds.length} members?`)) {
                  console.log('Deleting members:', selectedIds);
                  alert('Delete functionality would be implemented here');
                  setSelectedIds([]);
                }
              }}
              onSendMessage={() => {
                console.log('Sending message to:', selectedIds);
                alert(`Messaging ${selectedIds.length} members...`);
              }}
              onAddToGroup={() => {
                console.log('Adding to group:', selectedIds);
                alert(`Adding ${selectedIds.length} members to group...`);
              }}
              onAddTags={() => {
                console.log('Adding tags to:', selectedIds);
                alert(`Adding tags to ${selectedIds.length} members...`);
              }}
              onChangeStatus={() => {
                console.log('Changing status for:', selectedIds);
                alert(`Changing status for ${selectedIds.length} members...`);
              }}
              onClose={() => setSelectedIds([])}
            />
          )}
        </div>
      )}

      {/* Add Member Form Dialog */}
      <AddMemberForm
        open={showAddForm}
        onClose={() => setShowAddForm(false)}
        onSubmit={(member) => {
          onAddMember?.(member);
          setShowAddForm(false);
        }}
      />

      {/* Import Dialog */}
      <ImportExportDialog
        open={showImportDialog}
        onClose={() => setShowImportDialog(false)}
        mode="import"
        onImport={(importedMembers) => {
          onImport?.(importedMembers);
          setShowImportDialog(false);
        }}
      />

      {/* Export Dialog */}
      <ImportExportDialog
        open={showExportDialog}
        onClose={() => setShowExportDialog(false)}
        mode="export"
        members={members}
      />
    </div>
  );
}

/**
 * Vue Migration Notes:
 * 
 * // views/MembersView.vue
 * <template>
 *   <q-page padding>
 *     <!-- Use Quasar's layout components -->
 *     <div class="row items-center justify-between q-mb-lg">
 *       <div>
 *         <div class="text-h4">Members</div>
 *         <div class="row q-gutter-xs q-mt-sm">
 *           <q-chip size="sm">{{ stats.total }} Total</q-chip>
 *           <q-chip size="sm" color="positive">{{ stats.active }} Active</q-chip>
 *           <q-chip size="sm" color="info">{{ stats.visitors }} Visitors</q-chip>
 *         </div>
 *       </div>
 *       
 *       <div class="row q-gutter-sm">
 *         <q-btn outline label="Import" icon="upload" @click="onImport" />
 *         <q-btn outline label="Export" icon="download" @click="onExport" />
 *         <q-btn color="primary" label="Add Member" icon="add" @click="onAddMember" />
 *       </div>
 *     </div>
 *     
 *     <div class="row items-center q-gutter-md q-mb-lg">
 *       <q-input
 *         v-model="quickSearch"
 *         outlined
 *         dense
 *         placeholder="Quick search..."
 *         class="col"
 *       >
 *         <template v-slot:prepend>
 *           <q-icon name="search" />
 *         </template>
 *       </q-input>
 *       
 *       <q-btn outline icon="filter_list" @click="showFilters = true">
 *         Filters
 *         <q-badge v-if="activeFilterCount > 0" color="primary" floating>
 *           {{ activeFilterCount }}
 *         </q-badge>
 *       </q-btn>
 *       
 *       <q-btn-toggle
 *         v-model="viewMode"
 *         :options="[
 *           { value: 'grid', icon: 'grid_view' },
 *           { value: 'table', icon: 'view_list' }
 *         ]"
 *         outline
 *       />
 *     </div>
 *     
 *     <!-- Grid View -->
 *     <div v-if="viewMode === 'grid'" class="row q-col-gutter-md">
 *       <div 
 *         v-for="member in filteredMembers" 
 *         :key="member.id"
 *         class="col-12 col-md-6 col-lg-4"
 *       >
 *         <MemberCard
 *           :member="member"
 *           @click="onViewMember"
 *           @edit="onEditMember"
 *           @delete="onDeleteMember"
 *         />
 *       </div>
 *     </div>
 *     
 *     <!-- Table View -->
 *     <MemberTable
 *       v-else
 *       :members="filteredMembers"
 *       v-model:selected="selected"
 *       @row-click="onViewMember"
 *       @edit="onEditMember"
 *       @delete="onDeleteMember"
 *     />
 *     
 *     <!-- Filters Drawer -->
 *     <q-drawer v-model="showFilters" side="left" overlay>
 *       <MemberFilters
 *         v-model="filters"
 *         :result-count="filteredMembers.length"
 *         @reset="resetFilters"
 *       />
 *     </q-drawer>
 *   </q-page>
 * </template>
 * 
 * <script setup lang="ts">
 * import { ref, computed } from 'vue';
 * import { useMemberStore } from '@/stores/member';
 * import MemberCard from '@/components/members/MemberCard.vue';
 * import MemberTable from '@/components/members/MemberTable.vue';
 * import MemberFilters from '@/components/members/MemberFilters.vue';
 * 
 * const memberStore = useMemberStore();
 * const viewMode = ref('grid');
 * const quickSearch = ref('');
 * const showFilters = ref(false);
 * const filters = ref({});
 * const selected = ref([]);
 * 
 * const filteredMembers = computed(() => {
 *   // Filter logic here
 *   return memberStore.members.filter(member => {
 *     // Apply filters
 *   });
 * });
 * 
 * const stats = computed(() => ({
 *   total: filteredMembers.value.length,
 *   active: filteredMembers.value.filter(m => m.status === 'active').length,
 *   visitors: filteredMembers.value.filter(m => m.status === 'visitor').length,
 * }));
 * </script>
 */