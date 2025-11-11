/**
 * ChurchAfrica ChMS - Main Application Layout
 * 3-Column Responsive Grid: Sidebar + Main Content + Secondary (Chat)
 */

import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { SecondarySidebar } from './SecondarySidebar';
import { Header } from './Header';
import { MobileBottomNav } from './MobileBottomNav';
import { useIsMobile } from '../ui/use-mobile';

interface AppLayoutProps {
  children: React.ReactNode;
  showSecondarySidebar?: boolean;
}

export function AppLayout({ children, showSecondarySidebar = true }: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [secondarySidebarOpen, setSecondarySidebarOpen] = useState(true);
  const isMobile = useIsMobile();

  // On mobile, sidebars should be collapsed by default
  React.useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
      setSecondarySidebarOpen(false);
    } else {
      setSidebarOpen(true);
      setSecondarySidebarOpen(true);
    }
  }, [isMobile]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header - Always visible */}
      <Header
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        onToggleSecondarySidebar={() => setSecondarySidebarOpen(!secondarySidebarOpen)}
      />

      {/* Main Layout Grid */}
      <div className="flex h-[calc(100vh-64px)]">
        {/* Left Sidebar - Navigation */}
        <Sidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          isMobile={isMobile}
        />

        {/* Main Content Area */}
        <main
          className={`
            flex-1 overflow-y-auto
            ${isMobile ? 'pb-16' : ''}
          `}
        >
          <div className="container mx-auto px-4 py-6">
            {children}
          </div>
        </main>

        {/* Right Sidebar - Chat/Secondary */}
        {showSecondarySidebar && (
          <SecondarySidebar
            open={secondarySidebarOpen}
            onClose={() => setSecondarySidebarOpen(false)}
            isMobile={isMobile}
          />
        )}
      </div>

      {/* Mobile Bottom Navigation */}
      {isMobile && <MobileBottomNav />}
    </div>
  );
}

/**
 * Vue Migration Notes:
 * 
 * // Vue 3 + Quasar equivalent:
 * <template>
 *   <q-layout view="hHh lpR fFf">
 *     <!-- Header -->
 *     <q-header elevated class="bg-card">
 *       <Header 
 *         @toggle-sidebar="toggleSidebar"
 *         @toggle-secondary="toggleSecondarySidebar"
 *       />
 *     </q-header>
 * 
 *     <!-- Left Drawer (Sidebar) -->
 *     <q-drawer
 *       v-model="sidebarOpen"
 *       :width="280"
 *       :breakpoint="768"
 *       bordered
 *     >
 *       <Sidebar />
 *     </q-drawer>
 * 
 *     <!-- Right Drawer (Chat) -->
 *     <q-drawer
 *       v-model="secondarySidebarOpen"
 *       side="right"
 *       :width="320"
 *       :breakpoint="768"
 *       bordered
 *     >
 *       <SecondarySidebar />
 *     </q-drawer>
 * 
 *     <!-- Main Content -->
 *     <q-page-container>
 *       <q-page padding>
 *         <slot />
 *       </q-page>
 *     </q-page-container>
 * 
 *     <!-- Mobile Bottom Nav -->
 *     <q-footer v-if="$q.screen.lt.md">
 *       <MobileBottomNav />
 *     </q-footer>
 *   </q-layout>
 * </template>
 * 
 * <script setup lang="ts">
 * import { ref, watch } from 'vue';
 * import { useQuasar } from 'quasar';
 * 
 * const $q = useQuasar();
 * const sidebarOpen = ref(!$q.screen.lt.md);
 * const secondarySidebarOpen = ref(!$q.screen.lt.md);
 * 
 * // Watch screen size changes
 * watch(() => $q.screen.lt.md, (isMobile) => {
 *   sidebarOpen.value = !isMobile;
 *   secondarySidebarOpen.value = !isMobile;
 * });
 * </script>
 */
