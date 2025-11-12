/**
 * ChurchAfrica ChMS - Dashboard Customizer
 * AI-powered dashboard customization panel with layout, density, and card management
 */

import React, { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../ui/sheet';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Switch } from '../ui/switch';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { ScrollArea } from '../ui/scroll-area';
import {
  Settings,
  Sparkles,
  Rows,
  Columns,
  LayoutGrid,
  Check,
  X,
  GripVertical,
} from 'lucide-react';
import { cn } from '../ui/utils';
import { toast } from 'sonner@2.0.3';

export type DensityMode = 'compact' | 'standard' | 'comfortable';
export type CardsPerRow = 2 | 3 | 4;
export type RowCount = 1 | 2;

export interface DashboardConfig {
  cardsPerRow: CardsPerRow;
  rowCount: RowCount;
  density: DensityMode;
  visibleCards: string[];
}

export interface KPICardDefinition {
  id: string;
  title: string;
  category: 'membership' | 'attendance' | 'giving' | 'engagement' | 'events';
  recommended?: boolean;
}

interface DashboardCustomizerProps {
  config: DashboardConfig;
  onConfigChange: (config: DashboardConfig) => void;
  availableCards: KPICardDefinition[];
}

export function DashboardCustomizer({
  config,
  onConfigChange,
  availableCards,
}: DashboardCustomizerProps) {
  const [open, setOpen] = useState(false);
  const [showAISuggestions, setShowAISuggestions] = useState(false);

  const handleCardsPerRowChange = (value: string) => {
    onConfigChange({
      ...config,
      cardsPerRow: parseInt(value) as CardsPerRow,
    });
  };

  const handleRowCountChange = (value: string) => {
    onConfigChange({
      ...config,
      rowCount: parseInt(value) as RowCount,
    });
  };

  const handleDensityChange = (value: string) => {
    onConfigChange({
      ...config,
      density: value as DensityMode,
    });
  };

  const toggleCard = (cardId: string) => {
    const maxCards = config.cardsPerRow * config.rowCount;
    const isVisible = config.visibleCards.includes(cardId);

    if (isVisible) {
      // Remove card
      onConfigChange({
        ...config,
        visibleCards: config.visibleCards.filter(id => id !== cardId),
      });
      toast.success('Card removed from dashboard');
    } else {
      // Add card (check if we're at max capacity)
      if (config.visibleCards.length >= maxCards) {
        toast.error(`Maximum of ${maxCards} cards allowed (${config.cardsPerRow} per row × ${config.rowCount} rows)`);
        return;
      }
      onConfigChange({
        ...config,
        visibleCards: [...config.visibleCards, cardId],
      });
      toast.success('Card added to dashboard');
    }
  };

  const applyAISuggestions = () => {
    // AI-powered suggestions based on church context
    const recommendedCards = availableCards
      .filter(card => card.recommended)
      .slice(0, config.cardsPerRow * config.rowCount)
      .map(card => card.id);

    onConfigChange({
      ...config,
      visibleCards: recommendedCards,
    });

    toast.success('AI suggestions applied', {
      description: `${recommendedCards.length} recommended cards added`,
    });
    setShowAISuggestions(false);
  };

  const resetToDefaults = () => {
    const defaultConfig: DashboardConfig = {
      cardsPerRow: 3,
      rowCount: 2,
      density: 'standard',
      visibleCards: availableCards.slice(0, 6).map(c => c.id),
    };
    onConfigChange(defaultConfig);
    toast.success('Dashboard reset to defaults');
  };

  const maxCards = config.cardsPerRow * config.rowCount;
  const currentCards = config.visibleCards.length;

  const categoryLabels: Record<string, string> = {
    membership: 'Membership',
    attendance: 'Attendance',
    giving: 'Giving & Finance',
    engagement: 'Engagement',
    events: 'Events & Programs',
  };

  const groupedCards = availableCards.reduce((acc, card) => {
    if (!acc[card.category]) {
      acc[card.category] = [];
    }
    acc[card.category].push(card);
    return acc;
  }, {} as Record<string, KPICardDefinition[]>);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Settings className="h-4 w-4" />
          Customize Dashboard
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-xl">
        <SheetHeader>
          <SheetTitle>Dashboard Customization</SheetTitle>
          <SheetDescription>
            Personalize your dashboard layout, density, and visible cards
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-120px)] pr-4 mt-6">
          <div className="space-y-6 px-1">  {/* Added px-1 for breathing room */}
            {/* AI Suggestions */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <Label>AI Suggestions</Label>
                </div>
              </div>
              <div className="bg-card border rounded-lg p-4 space-y-3">
                <p className="text-sm text-muted-foreground">
                  Let AI analyze your church's needs and recommend the most relevant cards
                </p>
                <Button 
                  onClick={applyAISuggestions}
                  variant="outline"
                  className="w-full gap-2"
                >
                  <Sparkles className="h-4 w-4" />
                  Auto-populate with AI Suggestions
                </Button>
              </div>
            </div>

            <Separator />

            {/* Layout Settings */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <LayoutGrid className="h-4 w-4" />
                <Label>Layout Settings</Label>
              </div>

              {/* Cards Per Row */}
              <div className="space-y-2">
                <Label className="text-sm flex items-center gap-2">
                  <Columns className="h-3.5 w-3.5" />
                  Cards Per Row
                </Label>
                <RadioGroup
                  value={config.cardsPerRow.toString()}
                  onValueChange={handleCardsPerRowChange}
                  className="flex gap-2"
                >
                  <div className="flex-1">
                    <RadioGroupItem
                      value="2"
                      id="cols-2"
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor="cols-2"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-3 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                    >
                      <div className="flex gap-1 mb-2">
                        <div className="h-8 w-8 bg-primary/20 rounded" />
                        <div className="h-8 w-8 bg-primary/20 rounded" />
                      </div>
                      <span className="text-xs">2 Columns</span>
                    </Label>
                  </div>
                  <div className="flex-1">
                    <RadioGroupItem
                      value="3"
                      id="cols-3"
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor="cols-3"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-3 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                    >
                      <div className="flex gap-1 mb-2">
                        <div className="h-8 w-6 bg-primary/20 rounded" />
                        <div className="h-8 w-6 bg-primary/20 rounded" />
                        <div className="h-8 w-6 bg-primary/20 rounded" />
                      </div>
                      <span className="text-xs">3 Columns</span>
                    </Label>
                  </div>
                  <div className="flex-1">
                    <RadioGroupItem
                      value="4"
                      id="cols-4"
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor="cols-4"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-3 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                    >
                      <div className="flex gap-1 mb-2">
                        <div className="h-8 w-4 bg-primary/20 rounded" />
                        <div className="h-8 w-4 bg-primary/20 rounded" />
                        <div className="h-8 w-4 bg-primary/20 rounded" />
                        <div className="h-8 w-4 bg-primary/20 rounded" />
                      </div>
                      <span className="text-xs">4 Columns</span>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Number of Rows */}
              <div className="space-y-2">
                <Label className="text-sm flex items-center gap-2">
                  <Rows className="h-3.5 w-3.5" />
                  Number of Rows
                </Label>
                <RadioGroup
                  value={config.rowCount.toString()}
                  onValueChange={handleRowCountChange}
                  className="flex gap-2"
                >
                  <div className="flex-1">
                    <RadioGroupItem
                      value="1"
                      id="rows-1"
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor="rows-1"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-3 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                    >
                      <div className="mb-2">
                        <div className="flex gap-1">
                          <div className="h-6 w-6 bg-primary/20 rounded" />
                          <div className="h-6 w-6 bg-primary/20 rounded" />
                          <div className="h-6 w-6 bg-primary/20 rounded" />
                        </div>
                      </div>
                      <span className="text-xs">1 Row</span>
                    </Label>
                  </div>
                  <div className="flex-1">
                    <RadioGroupItem
                      value="2"
                      id="rows-2"
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor="rows-2"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-3 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                    >
                      <div className="mb-2 space-y-1">
                        <div className="flex gap-1">
                          <div className="h-4 w-6 bg-primary/20 rounded" />
                          <div className="h-4 w-6 bg-primary/20 rounded" />
                          <div className="h-4 w-6 bg-primary/20 rounded" />
                        </div>
                        <div className="flex gap-1">
                          <div className="h-4 w-6 bg-primary/20 rounded" />
                          <div className="h-4 w-6 bg-primary/20 rounded" />
                          <div className="h-4 w-6 bg-primary/20 rounded" />
                        </div>
                      </div>
                      <span className="text-xs">2 Rows</span>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="bg-muted/50 rounded-lg p-3 text-sm">
                <p className="text-muted-foreground">
                  <span className="text-foreground">{currentCards}</span> of{' '}
                  <span className="text-foreground">{maxCards}</span> card slots used
                </p>
              </div>
            </div>

            <Separator />

            {/* Density */}
            <div className="space-y-3">
              <Label>Display Density</Label>
              <RadioGroup
                value={config.density}
                onValueChange={handleDensityChange}
                className="space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="compact" id="compact" />
                  <Label htmlFor="compact" className="flex-1 cursor-pointer">
                    <div>Compact</div>
                    <p className="text-xs text-muted-foreground">
                      Minimal spacing, more information visible
                    </p>
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="standard" id="standard" />
                  <Label htmlFor="standard" className="flex-1 cursor-pointer">
                    <div>Standard</div>
                    <p className="text-xs text-muted-foreground">
                      Balanced spacing and readability
                    </p>
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="comfortable" id="comfortable" />
                  <Label htmlFor="comfortable" className="flex-1 cursor-pointer">
                    <div>Comfortable</div>
                    <p className="text-xs text-muted-foreground">
                      Generous spacing, easier on the eyes
                    </p>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <Separator />

            {/* Card Selection */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Available Cards</Label>
                <Badge variant="secondary">
                  {currentCards}/{maxCards}
                </Badge>
              </div>

              {Object.entries(groupedCards).map(([category, cards]) => (
                <div key={category} className="space-y-2">
                  <h4 className="text-sm text-muted-foreground">
                    {categoryLabels[category]}
                  </h4>
                  <div className="space-y-1">
                    {cards.map((card) => {
                      const isVisible = config.visibleCards.includes(card.id);
                      const isDisabled = !isVisible && currentCards >= maxCards;

                      return (
                        <div
                          key={card.id}
                          className={cn(
                            'flex items-center justify-between rounded-lg border p-3 transition-colors',
                            isVisible && 'bg-primary/5 border-primary/50',
                            isDisabled && 'opacity-50 cursor-not-allowed'
                          )}
                        >
                          <div className="flex items-center gap-3 flex-1">
                            <GripVertical className="h-4 w-4 text-muted-foreground" />
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="text-sm">{card.title}</span>
                                {card.recommended && (
                                  <Badge variant="secondary" className="gap-1 text-xs">
                                    <Sparkles className="h-3 w-3" />
                                    AI Pick
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                          <Switch
                            checked={isVisible}
                            onCheckedChange={() => toggleCard(card.id)}
                            disabled={isDisabled}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <Separator />

            {/* Actions */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={resetToDefaults}
                className="flex-1"
              >
                Reset to Defaults
              </Button>
              <Button
                onClick={() => {
                  setOpen(false);
                  toast.success('Dashboard customization saved');
                }}
                className="flex-1"
              >
                <Check className="h-4 w-4 mr-2" />
                Apply Changes
              </Button>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}

/**
 * Vue Migration Notes:
 * 
 * Use Quasar's q-drawer for the customizer panel
 * Use q-option-group for radio groups
 * Use q-toggle for switches
 * Store dashboard config in Pinia store
 * Implement drag-and-drop with Quasar's q-drag directive
 */