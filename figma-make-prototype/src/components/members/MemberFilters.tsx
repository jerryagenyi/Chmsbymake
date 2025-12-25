/**
 * ChurchAfrica ChMS - Member Filters
 * Advanced filtering sidebar for member search
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { ScrollArea } from '../ui/scroll-area';
import { 
  Search, 
  X, 
  Filter,
  Calendar
} from 'lucide-react';
import { MemberFilters as MemberFiltersType } from '../../types/member';

interface MemberFiltersProps {
  filters: MemberFiltersType;
  onChange: (filters: MemberFiltersType) => void;
  onReset: () => void;
  resultCount?: number;
}

export function MemberFilters({ 
  filters, 
  onChange, 
  onReset,
  resultCount 
}: MemberFiltersProps) {
  const updateFilter = <K extends keyof MemberFiltersType>(
    key: K,
    value: MemberFiltersType[K]
  ) => {
    onChange({ ...filters, [key]: value });
  };

  const toggleArrayFilter = <K extends keyof MemberFiltersType>(
    key: K,
    value: string
  ) => {
    const current = (filters[key] as string[]) || [];
    const updated = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value];
    updateFilter(key, updated as MemberFiltersType[K]);
  };

  const hasActiveFilters = Object.entries(filters).some(([key, value]) => {
    if (key === 'search') return false;
    if (Array.isArray(value)) return value.length > 0;
    return value !== undefined && value !== null && value !== '';
  });

  const activeFilterCount = Object.entries(filters).reduce((count, [key, value]) => {
    if (key === 'search') return count;
    if (Array.isArray(value)) return count + value.length;
    return value !== undefined && value !== null && value !== '' ? count + 1 : count;
  }, 0);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            <CardTitle>Filters</CardTitle>
            {activeFilterCount > 0 && (
              <Badge variant="secondary">{activeFilterCount}</Badge>
            )}
          </div>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onReset}
              className="h-8 gap-1"
            >
              <X className="h-3 w-3" />
              Clear
            </Button>
          )}
        </div>
        {resultCount !== undefined && (
          <p className="text-sm text-muted-foreground">
            {resultCount} {resultCount === 1 ? 'result' : 'results'}
          </p>
        )}
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[calc(100vh-280px)]">
          <div className="space-y-6 pr-4">
            {/* Search */}
            <div className="space-y-2">
              <Label>Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Name, email, phone..."
                  value={filters.search || ''}
                  onChange={(e) => updateFilter('search', e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            <Separator />

            {/* Status */}
            <div className="space-y-3">
              <Label>Status</Label>
              <div className="space-y-2">
                {['active', 'inactive', 'visitor', 'alumni'].map((status) => (
                  <div key={status} className="flex items-center gap-2">
                    <Checkbox
                      id={`status-${status}`}
                      checked={(filters.status || []).includes(status as any)}
                      onCheckedChange={() => toggleArrayFilter('status', status)}
                    />
                    <Label
                      htmlFor={`status-${status}`}
                      className="text-sm font-normal capitalize cursor-pointer"
                    >
                      {status}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Gender */}
            <div className="space-y-3">
              <Label>Gender</Label>
              <div className="space-y-2">
                {['male', 'female', 'other'].map((gender) => (
                  <div key={gender} className="flex items-center gap-2">
                    <Checkbox
                      id={`gender-${gender}`}
                      checked={(filters.gender || []).includes(gender as any)}
                      onCheckedChange={() => toggleArrayFilter('gender', gender)}
                    />
                    <Label
                      htmlFor={`gender-${gender}`}
                      className="text-sm font-normal capitalize cursor-pointer"
                    >
                      {gender}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Marital Status */}
            <div className="space-y-3">
              <Label>Marital Status</Label>
              <div className="space-y-2">
                {['single', 'married', 'divorced', 'widowed'].map((status) => (
                  <div key={status} className="flex items-center gap-2">
                    <Checkbox
                      id={`marital-${status}`}
                      checked={(filters.maritalStatus || []).includes(status as any)}
                      onCheckedChange={() => toggleArrayFilter('maritalStatus', status)}
                    />
                    <Label
                      htmlFor={`marital-${status}`}
                      className="text-sm font-normal capitalize cursor-pointer"
                    >
                      {status}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Age Group */}
            <div className="space-y-3">
              <Label>Age Group</Label>
              <div className="space-y-2">
                {[
                  { value: 'child', label: 'Child (0-12)' },
                  { value: 'youth', label: 'Youth (13-17)' },
                  { value: 'young_adult', label: 'Young Adult (18-35)' },
                  { value: 'adult', label: 'Adult (36-59)' },
                  { value: 'senior', label: 'Senior (60+)' },
                ].map(({ value, label }) => (
                  <div key={value} className="flex items-center gap-2">
                    <Checkbox
                      id={`age-${value}`}
                      checked={(filters.ageGroup || []).includes(value as any)}
                      onCheckedChange={() => toggleArrayFilter('ageGroup', value)}
                    />
                    <Label
                      htmlFor={`age-${value}`}
                      className="text-sm font-normal cursor-pointer"
                    >
                      {label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Join Date Range */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Join Date Range
              </Label>
              <div className="space-y-2">
                <div>
                  <Label htmlFor="joinDateFrom" className="text-xs text-muted-foreground">
                    From
                  </Label>
                  <Input
                    id="joinDateFrom"
                    type="date"
                    value={filters.joinDateFrom || ''}
                    onChange={(e) => updateFilter('joinDateFrom', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="joinDateTo" className="text-xs text-muted-foreground">
                    To
                  </Label>
                  <Input
                    id="joinDateTo"
                    type="date"
                    value={filters.joinDateTo || ''}
                    onChange={(e) => updateFilter('joinDateTo', e.target.value)}
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Other Options */}
            <div className="space-y-3">
              <Label>Other Options</Label>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="hasPhoto"
                    checked={filters.hasPhoto || false}
                    onCheckedChange={(checked) => 
                      updateFilter('hasPhoto', checked === true ? true : undefined)
                    }
                  />
                  <Label
                    htmlFor="hasPhoto"
                    className="text-sm font-normal cursor-pointer"
                  >
                    Has profile photo
                  </Label>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

/**
 * Vue Migration Notes:
 * 
 * // components/members/MemberFilters.vue
 * <template>
 *   <q-card>
 *     <q-card-section>
 *       <div class="row items-center justify-between q-mb-md">
 *         <div class="row items-center q-gutter-sm">
 *           <q-icon name="filter_list" />
 *           <div class="text-h6">Filters</div>
 *           <q-chip v-if="activeFilterCount > 0" size="sm">
 *             {{ activeFilterCount }}
 *           </q-chip>
 *         </div>
 *         <q-btn 
 *           v-if="hasActiveFilters"
 *           flat 
 *           dense 
 *           label="Clear" 
 *           icon="close"
 *           @click="$emit('reset')"
 *         />
 *       </div>
 *       
 *       <div v-if="resultCount !== undefined" class="text-caption text-grey q-mb-md">
 *         {{ resultCount }} {{ resultCount === 1 ? 'result' : 'results' }}
 *       </div>
 *       
 *       <q-scroll-area style="height: calc(100vh - 280px)">
 *         <div class="column q-gutter-md">
 *           <!-- Search -->
 *           <q-input
 *             v-model="localFilters.search"
 *             label="Search"
 *             placeholder="Name, email, phone..."
 *             outlined
 *             dense
 *           >
 *             <template v-slot:prepend>
 *               <q-icon name="search" />
 *             </template>
 *           </q-input>
 *           
 *           <q-separator />
 *           
 *           <!-- Status -->
 *           <div>
 *             <div class="text-subtitle2 q-mb-sm">Status</div>
 *             <q-option-group
 *               v-model="localFilters.status"
 *               :options="statusOptions"
 *               type="checkbox"
 *               dense
 *             />
 *           </div>
 *           
 *           <q-separator />
 *           
 *           <!-- Gender -->
 *           <div>
 *             <div class="text-subtitle2 q-mb-sm">Gender</div>
 *             <q-option-group
 *               v-model="localFilters.gender"
 *               :options="genderOptions"
 *               type="checkbox"
 *               dense
 *             />
 *           </div>
 *           
 *           <!-- Add more filter sections as needed -->
 *         </div>
 *       </q-scroll-area>
 *     </q-card-section>
 *   </q-card>
 * </template>
 * 
 * <script setup lang="ts">
 * import { computed, watch } from 'vue';
 * import type { MemberFilters } from '@/types/member';
 * 
 * interface Props {
 *   filters: MemberFilters;
 *   resultCount?: number;
 * }
 * 
 * const props = defineProps<Props>();
 * const emit = defineEmits(['change', 'reset']);
 * 
 * const localFilters = computed({
 *   get: () => props.filters,
 *   set: (value) => emit('change', value)
 * });
 * 
 * const activeFilterCount = computed(() => {
 *   // Calculate active filters count
 * });
 * 
 * const hasActiveFilters = computed(() => {
 *   // Check if any filters are active
 * });
 * </script>
 */
