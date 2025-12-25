/**
 * App Header Component
 * Clean, uncluttered header with progressive disclosure
 */

import React from 'react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { useOrganization } from '../../contexts/OrganizationContext';
import { ChevronDown, MapPin, Building2, Info } from 'lucide-react';
import { ChurchLogo } from '../organization/ChurchLogo';
import { RoleSwitcher } from '../dev/RoleSwitcher';

interface AppHeaderProps {
  showProgressBadge?: boolean;
  progressText?: string;
}

export function AppHeader({ showProgressBadge = false, progressText }: AppHeaderProps) {
  const { organization, currentCampus, setCurrentCampus } = useOrganization();

  return (
    <div className="flex items-start justify-between mb-8">
      {/* Left: Church Info - 3 Lines */}
      <div className="flex-1">
        {/* Line 1: TOBC, Abuja */}
        <div className="flex items-center gap-4">
          <h1 style={{ fontSize: '2.4em', lineHeight: '1', marginBottom: '0.25em', fontWeight: '300' }}>
            {organization.acronym}, {currentCampus.city}
          </h1>
        </div>

        {/* Line 2: Full Church Name + Campus Badge with divider above */}
        <div className="inline-flex flex-col">
          <div className="h-px bg-border mb-1.5" />
          <div className="flex items-center gap-2 mb-1.5">
            <p className="text-muted-foreground">
              {organization.name}
            </p>
            <Badge 
              className="uppercase px-2 py-0.5 text-xs bg-warning text-warning-foreground"
              style={{
                fontWeight: 500,
                borderRadius: '2px',
                fontSize: '10px'
              }}
            >
              {currentCampus.name}
            </Badge>
          </div>
        </div>

        {/* Line 3: Address */}
        <p className="text-sm text-muted-foreground">
          {currentCampus.address}, {currentCampus.city} - {currentCampus.country}
        </p>
      </div>

      {/* Right: Logo and Optional Progress Badge */}
      <div className="flex flex-col items-end gap-3">
        <div className="flex items-center gap-3">
          <RoleSwitcher />
          <ChurchLogo size="lg" />
        </div>
        
        {showProgressBadge && progressText && (
          <Badge variant="secondary" className="gap-1">
            <Info className="h-3 w-3" />
            {progressText}
          </Badge>
        )}
      </div>
    </div>
  );
}