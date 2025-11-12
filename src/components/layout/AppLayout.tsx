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
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../ui/button';

interface AppLayoutProps {
  children: React.ReactNode;
  showSecondarySidebar?: boolean;
  onNavigate?: (path: string) => void;
  currentPath?: string;
}

export function AppLayout({ children, showSecondarySidebar = true, onNavigate, currentPath }: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [secondarySidebarOpen, setSecondarySidebarOpen] = useState(false); // Changed to false - closed by default
  const isMobile = useIsMobile();

  // On mobile, sidebars should be collapsed by default
  // Load sidebar state from localStorage for desktop
  React.useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
      setSecondarySidebarOpen(false);
    } else {
      const savedLeftSidebar = localStorage.getItem('sidebar-left-open');
      const savedRightSidebar = localStorage.getItem('sidebar-right-open');
      
      if (savedLeftSidebar !== null) {
        setSidebarOpen(savedLeftSidebar === 'true');
      }
      if (savedRightSidebar !== null) {
        setSecondarySidebarOpen(savedRightSidebar === 'true');
      } else {
        // If no saved state, default to closed for right sidebar
        setSecondarySidebarOpen(false);
      }
    }
  }, [isMobile]);

  // Save sidebar state to localStorage (desktop only)
  React.useEffect(() => {
    if (!isMobile) {
      localStorage.setItem('sidebar-left-open', sidebarOpen.toString());
    }
  }, [sidebarOpen, isMobile]);

  React.useEffect(() => {
    if (!isMobile) {
      localStorage.setItem('sidebar-right-open', secondarySidebarOpen.toString());
    }
  }, [secondarySidebarOpen, isMobile]);

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
        {!isMobile && (
          <aside
            className={`
              bg-card border-r border-border flex-shrink-0
              transition-all duration-300 ease-in-out
              ${sidebarOpen ? 'w-[280px]' : 'w-0'}
            `}
          >
            <div className={`w-[280px] ${sidebarOpen ? 'block' : 'hidden'}`}>
              <Sidebar
                open={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
                isMobile={isMobile}
                onNavigate={onNavigate}
                currentPath={currentPath}
              />
            </div>
          </aside>
        )}
        
        {/* Mobile Left Sidebar (Overlay) */}
        {isMobile && (
          <Sidebar
            open={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            isMobile={isMobile}
            onNavigate={onNavigate}
            currentPath={currentPath}
          />
        )}
        
        {/* Collapse/Expand Button for Left Sidebar (Desktop only) */}
        {!isMobile && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={`
              absolute left-2 top-20 h-8 w-8 z-50 bg-card border border-border shadow-lg
              transition-all duration-300
              hover:bg-accent hover:shadow-xl
            `}
            style={{
              left: sidebarOpen ? '272px' : '8px',
            }}
            title={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            {sidebarOpen ? (
              <ChevronLeft className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
        )}

        {/* Main Content Area */}
        <main
          className={`
            flex-1 overflow-y-auto relative
            ${isMobile ? 'pb-16' : ''}
          `}
        >
          <div className="container mx-auto px-4 py-6">
            {children}
          </div>
        </main>

        {/* Right Sidebar - Chat/Secondary */}
        {showSecondarySidebar && (
          <>
            {/* Collapse/Expand Button for Right Sidebar (Desktop only) */}
            {!isMobile && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSecondarySidebarOpen(!secondarySidebarOpen)}
                className={`
                  absolute right-2 top-20 h-8 w-8 z-50 bg-card border border-border shadow-lg
                  transition-all duration-300
                  hover:bg-accent hover:shadow-xl
                `}
                style={{
                  right: secondarySidebarOpen ? '312px' : '8px',
                }}
                title={secondarySidebarOpen ? 'Collapse activity panel' : 'Expand activity panel'}
              >
                {secondarySidebarOpen ? (
                  <ChevronRight className="h-4 w-4" />
                ) : (
                  <ChevronLeft className="h-4 w-4" />
                )}
              </Button>
            )}
            
            {!isMobile && (
              <aside
                className={`
                  bg-card border-l border-border flex-shrink-0
                  transition-all duration-300 ease-in-out
                  ${secondarySidebarOpen ? 'w-[320px]' : 'w-0'}
                `}
              >
                <div className={`w-[320px] ${secondarySidebarOpen ? 'block' : 'hidden'}`}>
                  <SecondarySidebar
                    open={secondarySidebarOpen}
                    onClose={() => setSecondarySidebarOpen(false)}
                    isMobile={isMobile}
                  />
                </div>
              </aside>
            )}
            
            {/* Mobile Right Sidebar (Overlay) */}
            {isMobile && (
              <SecondarySidebar
                open={secondarySidebarOpen}
                onClose={() => setSecondarySidebarOpen(false)}
                isMobile={isMobile}
              />
            )}
          </>
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