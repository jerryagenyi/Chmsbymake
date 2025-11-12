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

interface AppHeaderProps {
  showProgressBadge?: boolean;
  progressText?: string;
}

export function AppHeader({ showProgressBadge = false, progressText }: AppHeaderProps) {
  const { organization, currentBranch, setCurrentBranch } = useOrganization();

  return (
    <div className="flex items-start justify-between mb-8">
      {/* Left: Church Info - 3 Lines */}
      <div>
        {/* Line 1: TOBC, Abuja */}
        <h1 style={{ fontSize: '2.4em', lineHeight: '1', marginBottom: '0.25em' }}>
          {organization.abbreviation}, {currentBranch.city}
        </h1>

        {/* Line 2: Full Church Name + Campus Badge */}
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
            {currentBranch.name}
          </Badge>
        </div>

        {/* Line 3: Address */}
        <p className="text-sm text-muted-foreground">
          {currentBranch.address}, {currentBranch.city} - {currentBranch.country}
        </p>
      </div>

      {/* Right: Logo and Optional Progress Badge */}
      <div className="flex flex-col items-end gap-3">
        <img
          src="https://images.unsplash.com/photo-1678235679649-ad276187fb9e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaHVyY2glMjBsb2dvJTIwc2ltcGxlfGVufDF8fHx8MTc2Mjk4Mzg5NHww&ixlib=rb-4.1.0&q=80&w=1080"
          alt={`${organization.name} Logo`}
          className="h-20 w-20 object-cover rounded-lg"
        />
        
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