/**
 * ChurchAfrica ChMS - Dashboard Tour
 * Interactive tour/guide for new dashboard customization features
 */

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import {
  Sparkles,
  GripVertical,
  Columns,
  Rows,
  Maximize,
  CheckCircle,
  ChevronRight,
  ChevronLeft,
  X,
} from 'lucide-react';
import { cn } from '../ui/utils';

interface TourStep {
  title: string;
  description: string;
  icon: React.ElementType;
  image?: string;
  tips?: string[];
}

const TOUR_STEPS: TourStep[] = [
  {
    title: 'Welcome to Your Customizable Dashboard',
    description: 'Your dashboard is now fully customizable! Drag, drop, and configure KPI cards to match your church\'s unique needs.',
    icon: Sparkles,
    tips: [
      'Choose which metrics matter most to you',
      'Arrange cards in any order you prefer',
      'Adjust layout and density for optimal viewing',
    ],
  },
  {
    title: 'Drag & Drop to Reorder',
    description: 'Hover over any card to reveal the drag handle, then click and drag to reorder your cards.',
    icon: GripVertical,
    tips: [
      'Drag handle appears on hover',
      'Visual feedback shows where card will drop',
      'Changes are saved automatically',
    ],
  },
  {
    title: 'Choose Your Layout',
    description: 'Configure your perfect grid layout with flexible rows and columns.',
    icon: Columns,
    tips: [
      'Select 2, 3, or 4 cards per row',
      'Choose 1 or 2 rows of cards',
      'Maximum 8 cards on screen at once',
    ],
  },
  {
    title: 'Adjust Display Density',
    description: 'Pick the spacing that works best for you - from compact to comfortable.',
    icon: Maximize,
    tips: [
      'Compact: Maximum information density',
      'Standard: Balanced and readable (recommended)',
      'Comfortable: Generous spacing, easier on eyes',
    ],
  },
  {
    title: 'AI-Powered Suggestions',
    description: 'Let AI recommend the most relevant cards based on church management best practices.',
    icon: Sparkles,
    tips: [
      'One-click auto-population',
      'Curated for typical church needs',
      'AI-recommended cards marked with badges',
    ],
  },
  {
    title: 'Add & Remove Cards',
    description: 'Choose from 20+ KPI metrics across 5 categories: Membership, Attendance, Giving, Engagement, and Events.',
    icon: CheckCircle,
    tips: [
      'Toggle cards on/off with switches',
      'Organized by category for easy browsing',
      'See card slot usage in real-time',
    ],
  },
];

interface DashboardTourProps {
  open: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export function DashboardTour({ open, onClose, onComplete }: DashboardTourProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < TOUR_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    onComplete();
    onClose();
    setCurrentStep(0);
  };

  const handleSkip = () => {
    onComplete(); // Mark tour as seen even when skipping
    onClose();
    setCurrentStep(0);
  };

  const handleDialogClose = (open: boolean) => {
    if (!open) {
      // When dialog is closed by any means (X button, ESC, outside click)
      // Mark the tour as seen so it doesn't pop up again
      handleSkip();
    }
  };

  const step = TOUR_STEPS[currentStep];
  const Icon = step.icon;
  const isLastStep = currentStep === TOUR_STEPS.length - 1;

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <div className="flex items-center justify-between mb-2">
            <Badge variant="secondary">
              Step {currentStep + 1} of {TOUR_STEPS.length}
            </Badge>
          </div>
          <DialogTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 rounded-lg bg-primary/10">
              <Icon className="h-6 w-6 text-primary" />
            </div>
            {step.title}
          </DialogTitle>
          <DialogDescription className="text-base pt-2">
            {step.description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Visual Demo Area */}
          <div className="bg-muted/30 rounded-lg p-8 min-h-[200px] flex items-center justify-center border-2 border-dashed">
            <div className="text-center space-y-4">
              <Icon className="h-16 w-16 text-primary mx-auto" />
              <p className="text-sm text-muted-foreground">
                Interactive demo would go here
              </p>
            </div>
          </div>

          {/* Tips */}
          {step.tips && step.tips.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm text-muted-foreground">Quick Tips:</h4>
              <ul className="space-y-2">
                {step.tips.map((tip, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Progress Dots */}
          <div className="flex items-center justify-center gap-2 pt-4">
            {TOUR_STEPS.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentStep(index)}
                className={cn(
                  'h-2 rounded-full transition-all',
                  index === currentStep
                    ? 'w-8 bg-primary'
                    : 'w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50'
                )}
                aria-label={`Go to step ${index + 1}`}
              />
            ))}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between pt-4 border-t">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>

            <Button variant="ghost" onClick={handleSkip} className="text-muted-foreground">
              Skip Tour
            </Button>

            <Button onClick={handleNext}>
              {isLastStep ? (
                <>
                  Get Started
                  <Sparkles className="h-4 w-4 ml-1" />
                </>
              ) : (
                <>
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/**
 * Hook to manage tour state
 */
export function useDashboardTour() {
  const [hasSeenTour, setHasSeenTour] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('churchafrica-dashboard-tour-seen') === 'true';
    }
    return false;
  });

  const [isTourOpen, setIsTourOpen] = useState(false);

  const openTour = () => setIsTourOpen(true);
  const closeTour = () => setIsTourOpen(false);

  const completeTour = () => {
    setHasSeenTour(true);
    if (typeof window !== 'undefined') {
      localStorage.setItem('churchafrica-dashboard-tour-seen', 'true');
    }
  };

  const resetTour = () => {
    setHasSeenTour(false);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('churchafrica-dashboard-tour-seen');
    }
  };

  return {
    hasSeenTour,
    isTourOpen,
    openTour,
    closeTour,
    completeTour,
    resetTour,
  };
}

/**
 * Vue Migration Notes:
 * 
 * Use Quasar's q-dialog for the tour dialog
 * Use Quasar's q-stepper for step progression
 * Store tour state in Pinia
 * 
 * // composables/useDashboardTour.ts
 * export function useDashboardTour() {
 *   const hasSeenTour = useLocalStorage('dashboard-tour-seen', false);
 *   const currentStep = ref(0);
 *   
 *   return {
 *     hasSeenTour,
 *     currentStep,
 *     // ... methods
 *   };
 * }
 */