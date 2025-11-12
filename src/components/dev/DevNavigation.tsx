import { useState } from 'react';
import { Code, X, Home, Users, Calendar, ClipboardList, DollarSign, MessageSquare, Settings, LogIn, Shield, ShieldOff, Sparkles, User, QrCode, Fingerprint } from 'lucide-react';
import { Button } from '../ui/button';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '../ui/sheet';
import { ScrollArea } from '../ui/scroll-area';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';

interface DevNavigationProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  demoMode?: boolean;
  onToggleDemoMode?: () => void;
}

export function DevNavigation({ currentPage, onNavigate, demoMode = false, onToggleDemoMode }: DevNavigationProps) {
  const [open, setOpen] = useState(false);

  const pages = [
    { id: 'auth', label: 'Authentication', icon: LogIn, color: 'text-blue-400' },
    { id: 'dashboard', label: 'Dashboard', icon: Home, color: 'text-green-400' },
    { id: 'members', label: 'Members', icon: Users, color: 'text-purple-400' },
    { id: 'attendance', label: 'Attendance', icon: ClipboardList, color: 'text-orange-400' },
    { id: 'events', label: 'Events', icon: Calendar, color: 'text-pink-400' },
    { id: 'chat', label: 'Chat', icon: MessageSquare, color: 'text-cyan-400' },
    { id: 'organization', label: 'Organization', icon: Settings, color: 'text-indigo-400' },
    { id: 'giving', label: 'Giving/Donations', icon: DollarSign, color: 'text-yellow-400' },
    { id: 'member-portal', label: '👤 Member Portal', icon: User, color: 'text-[#1CE479]' },
    { id: 'ui-showcase', label: '✨ UI Components', icon: Code, color: 'text-[#1CE479]' },
    { id: 'ux-showcase', label: '🚀 UX Components', icon: Sparkles, color: 'text-cyan-400' },
    { id: 'settings', label: 'Settings', icon: Settings, color: 'text-gray-400' },
  ];

  const handleNavigate = (pageId: string) => {
    onNavigate(pageId);
    setOpen(false);
  };

  return (
    <div className="fixed bottom-6 left-6 z-50">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <div className="flex flex-col items-center gap-2">
            <Button
              size="lg"
              className="h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 bg-[#1CE479] hover:bg-[#1CE479]/90 text-[#0A0A0F]"
            >
              <Code className="h-6 w-6" />
            </Button>
            <span className="text-xs font-medium text-[#1CE479] bg-[#0A0A0F]/80 px-2 py-1 rounded-md">
              View Inner Page
            </span>
          </div>
        </SheetTrigger>
        <SheetContent side="left" className="w-80 bg-[#0A0A0F] border-[#1A1A20]">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2 text-[#1CE479]">
              <Code className="h-5 w-5" />
              Developer Navigation
            </SheetTitle>
            <SheetDescription className="text-gray-400">
              Quick navigation for testing. Toggle demo mode to bypass authentication.
            </SheetDescription>
          </SheetHeader>
          
          <div className="mt-6">
            {/* Demo Mode Toggle */}
            {onToggleDemoMode && (
              <div className="mb-4 p-4 bg-[#1A1A20] rounded-lg border border-[#1CE479]/20">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {demoMode ? (
                      <ShieldOff className="h-4 w-4 text-orange-400" />
                    ) : (
                      <Shield className="h-4 w-4 text-green-400" />
                    )}
                    <Label htmlFor="demo-mode" className="text-sm font-medium cursor-pointer">
                      Demo Mode
                    </Label>
                  </div>
                  <Switch
                    id="demo-mode"
                    checked={demoMode}
                    onCheckedChange={onToggleDemoMode}
                  />
                </div>
                <p className="text-xs text-gray-400">
                  {demoMode 
                    ? '🔓 Auth bypassed - navigate freely' 
                    : '🔒 Auth required - real user system'}
                </p>
              </div>
            )}

            <div className="mb-4 p-3 bg-[#1A1A20] rounded-lg border border-[#1CE479]/20">
              <p className="text-xs text-gray-400 mb-1">Current Page:</p>
              <p className="text-sm font-medium text-[#1CE479]">
                {pages.find(p => p.id === currentPage)?.label || 'Unknown'}
              </p>
            </div>

            <ScrollArea className="h-[calc(100vh-280px)]">
              <div className="space-y-2">
                {pages.map((page) => {
                  const Icon = page.icon;
                  const isActive = currentPage === page.id;
                  
                  return (
                    <button
                      key={page.id}
                      onClick={() => handleNavigate(page.id)}
                      className={`
                        w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200
                        ${isActive 
                          ? 'bg-[#1CE479]/20 border border-[#1CE479] shadow-lg' 
                          : 'bg-[#1A1A20] border border-[#1A1A20] hover:border-[#1CE479]/40 hover:bg-[#1A1A20]/70'
                        }
                      `}
                    >
                      <Icon className={`h-5 w-5 ${isActive ? 'text-[#1CE479]' : page.color}`} />
                      <span className={`text-sm font-medium ${isActive ? 'text-[#1CE479]' : 'text-gray-300'}`}>
                        {page.label}
                      </span>
                      {isActive && (
                        <div className="ml-auto h-2 w-2 rounded-full bg-[#1CE479] animate-pulse" />
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="mt-6 p-4 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-lg border border-blue-500/20">
                <h4 className="text-xs font-semibold text-blue-400 mb-2">💡 Developer Tools</h4>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Enable demo mode to bypass authentication and freely navigate between pages for testing. This panel only appears in the prototype.
                </p>
              </div>

              <div className="mt-4 p-4 bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-lg border border-orange-500/20">
                <h4 className="text-xs font-semibold text-orange-400 mb-2">🏗️ Architecture</h4>
                <div className="text-xs text-gray-400 space-y-1">
                  <div>Organization → Branches → Services</div>
                  <div className="text-[10px] text-gray-500 mt-2">
                    Multi-tenant with branch isolation
                  </div>
                </div>
              </div>
            </ScrollArea>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}