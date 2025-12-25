/**
 * ChurchAfrica ChMS - Church Logo Component
 * Displays the current church's logo with consistent sizing and fallback
 * This is church-specific branding, not platform branding
 */

import React from 'react';
import { useOrganization } from '../../contexts/OrganizationContext';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { Church } from 'lucide-react';

interface ChurchLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showFallback?: boolean;
}

const sizeClasses = {
  sm: 'h-8 w-8',
  md: 'h-12 w-12',
  lg: 'h-20 w-20',
  xl: 'h-32 w-32',
};

export function ChurchLogo({ size = 'md', className = '', showFallback = true }: ChurchLogoProps) {
  const { organization } = useOrganization();

  return (
    <div className={`${sizeClasses[size]} ${className} flex items-center justify-center overflow-hidden`}>
      {organization.logo ? (
        <ImageWithFallback
          src={organization.logo}
          alt={`${organization.name} Logo`}
          className="h-full w-full object-contain"
        />
      ) : showFallback ? (
        <div className="h-full w-full rounded-lg bg-primary/10 flex items-center justify-center">
          <Church className="h-1/2 w-1/2 text-primary" />
        </div>
      ) : null}
    </div>
  );
}

/**
 * Vue Migration Notes:
 * 
 * <template>
 *   <div :class="logoClasses">
 *     <q-img
 *       v-if="organization.logo"
 *       :src="organization.logo"
 *       :alt="`${organization.name} Logo`"
 *       fit="contain"
 *     />
 *     <div v-else-if="showFallback" class="fallback-logo bg-primary-10">
 *       <q-icon name="church" color="primary" />
 *     </div>
 *   </div>
 * </template>
 * 
 * <script setup lang="ts">
 * import { computed } from 'vue';
 * import { useOrganizationStore } from '@/stores/organization';
 * 
 * interface Props {
 *   size?: 'sm' | 'md' | 'lg' | 'xl';
 *   showFallback?: boolean;
 * }
 * 
 * const props = withDefaults(defineProps<Props>(), {
 *   size: 'md',
 *   showFallback: true,
 * });
 * 
 * const organizationStore = useOrganizationStore();
 * const organization = computed(() => organizationStore.currentOrganization);
 * 
 * const logoClasses = computed(() => {
 *   const sizes = {
 *     sm: 'logo-sm',
 *     md: 'logo-md',
 *     lg: 'logo-lg',
 *     xl: 'logo-xl',
 *   };
 *   return `church-logo ${sizes[props.size]}`;
 * });
 * </script>
 * 
 * <style scoped>
 * .church-logo {
 *   display: flex;
 *   align-items: center;
 *   justify-content: center;
 *   overflow: hidden;
 * }
 * 
 * .logo-sm { width: 32px; height: 32px; }
 * .logo-md { width: 48px; height: 48px; }
 * .logo-lg { width: 80px; height: 80px; }
 * .logo-xl { width: 128px; height: 128px; }
 * 
 * .fallback-logo {
 *   width: 100%;
 *   height: 100%;
 *   display: flex;
 *   align-items: center;
 *   justify-content: center;
 *   border-radius: 8px;
 * }
 * </style>
 */
