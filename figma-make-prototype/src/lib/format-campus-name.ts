/**
 * Utility to format campus display names based on organization settings
 */

import { Campus } from '../types/organization';

export type CampusDisplayFormat = 'acronym-comma-name' | 'acronym-space-name' | 'name-only' | 'full-org-comma-name';

interface FormatCampusNameOptions {
  campus: Campus;
  organizationName: string;
  organizationAcronym: string;
  format: CampusDisplayFormat;
}

/**
 * Formats campus name according to organization's display format setting
 * 
 * Examples:
 * - 'acronym-comma-name' → "VCM, Lagos" or "RCCG, Throne Room"
 * - 'acronym-space-name' → "VCM Lagos" or "RCCG Throne Room"
 * - 'name-only' → "Lagos" or "Throne Room"
 * - 'full-org-comma-name' → "Victory Chapel Ministry, Lagos"
 */
export function formatCampusName(options: FormatCampusNameOptions): string {
  const { campus, organizationName, organizationAcronym, format } = options;

  switch (format) {
    case 'acronym-comma-name':
      return `${organizationAcronym}, ${campus.shortName}`;
    
    case 'acronym-space-name':
      return `${organizationAcronym} ${campus.shortName}`;
    
    case 'name-only':
      return campus.shortName;
    
    case 'full-org-comma-name':
      return `${organizationName}, ${campus.shortName}`;
    
    default:
      // Fallback to acronym-space-name
      return `${organizationAcronym} ${campus.shortName}`;
  }
}

/**
 * Get display format label for UI
 */
export function getDisplayFormatLabel(format: CampusDisplayFormat): string {
  switch (format) {
    case 'acronym-comma-name':
      return 'Acronym, Campus Name (e.g., "VCM, Lagos")';
    
    case 'acronym-space-name':
      return 'Acronym Campus Name (e.g., "VCM Lagos")';
    
    case 'name-only':
      return 'Campus Name Only (e.g., "Lagos")';
    
    case 'full-org-comma-name':
      return 'Full Organization, Campus Name (e.g., "Victory Chapel Ministry, Lagos")';
    
    default:
      return 'Unknown Format';
  }
}

/**
 * Get example text for display format preview
 */
export function getDisplayFormatExample(
  format: CampusDisplayFormat,
  organizationName: string,
  organizationAcronym: string,
  campusShortName: string = 'Lagos'
): string {
  return formatCampusName({
    campus: { shortName: campusShortName } as Campus,
    organizationName,
    organizationAcronym,
    format,
  });
}
