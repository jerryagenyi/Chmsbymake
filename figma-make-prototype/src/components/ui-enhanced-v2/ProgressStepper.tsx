import React from 'react';
import { Check, Circle, LucideIcon } from 'lucide-react';
import { Progress } from '../ui/progress';

interface Step {
  id: string;
  label: string;
  description?: string;
  icon?: LucideIcon;
}

interface ProgressStepperProps {
  steps: Step[];
  currentStep: number;
  onStepClick?: (stepIndex: number) => void;
  variant?: 'default' | 'compact' | 'vertical';
  showProgress?: boolean;
  allowSkip?: boolean;
  className?: string;
}

export const ProgressStepper: React.FC<ProgressStepperProps> = ({
  steps,
  currentStep,
  onStepClick,
  variant = 'default',
  showProgress = true,
  allowSkip = false,
  className = '',
}) => {
  const progress = ((currentStep) / (steps.length - 1)) * 100;

  const getStepStatus = (index: number): 'completed' | 'current' | 'upcoming' => {
    if (index < currentStep) return 'completed';
    if (index === currentStep) return 'current';
    return 'upcoming';
  };

  const handleStepClick = (index: number) => {
    if (!onStepClick) return;
    
    // Only allow clicking on completed steps or current step, unless allowSkip is true
    if (allowSkip || index <= currentStep) {
      onStepClick(index);
    }
  };

  if (variant === 'vertical') {
    return (
      <div className={`space-y-2 ${className}`}>
        {steps.map((step, index) => {
          const status = getStepStatus(index);
          const Icon = step.icon;
          const isClickable = allowSkip || index <= currentStep;

          return (
            <div
              key={step.id}
              className={`
                flex gap-4 pb-8 relative
                ${index === steps.length - 1 ? 'pb-0' : ''}
              `}
            >
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div
                  className={`
                    absolute left-4 top-10 bottom-0 w-0.5
                    ${status === 'completed' ? 'bg-[#1CE479]' : 'bg-[#2A2A30]'}
                  `}
                />
              )}

              {/* Step Circle */}
              <button
                onClick={() => handleStepClick(index)}
                disabled={!isClickable}
                className={`
                  relative z-10 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center
                  transition-all duration-300
                  ${status === 'completed'
                    ? 'bg-[#1CE479] text-[#0A0A0F]'
                    : status === 'current'
                    ? 'bg-[#1CE479]/20 border-2 border-[#1CE479] text-[#1CE479]'
                    : 'bg-[#2A2A30] border-2 border-[#2A2A30] text-gray-500'
                  }
                  ${isClickable ? 'cursor-pointer hover:scale-110' : 'cursor-not-allowed'}
                `}
              >
                {status === 'completed' ? (
                  <Check className="w-4 h-4" />
                ) : Icon ? (
                  <Icon className="w-4 h-4" />
                ) : (
                  <span className="text-xs">{index + 1}</span>
                )}
              </button>

              {/* Step Content */}
              <div className="flex-1 pt-0.5">
                <button
                  onClick={() => handleStepClick(index)}
                  disabled={!isClickable}
                  className={`
                    text-left w-full
                    ${isClickable ? 'cursor-pointer' : 'cursor-not-allowed'}
                  `}
                >
                  <div className={`
                    transition-colors
                    ${status === 'current' ? 'text-[#1CE479]' : status === 'completed' ? 'text-white' : 'text-gray-500'}
                  `}>
                    {step.label}
                  </div>
                  {step.description && (
                    <div className="text-xs text-gray-500 mt-0.5">
                      {step.description}
                    </div>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={`space-y-2 ${className}`}>
        {/* Progress Bar */}
        {showProgress && (
          <div className="mb-4">
            <div className="flex justify-between text-xs text-gray-400 mb-2">
              <span>Step {currentStep + 1} of {steps.length}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2 bg-[#2A2A30]" />
          </div>
        )}

        {/* Current Step Info */}
        <div className="bg-[#1A1A20] border border-[#2A2A30] rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#1CE479]/20 border-2 border-[#1CE479] flex items-center justify-center text-[#1CE479]">
              {steps[currentStep].icon ? (
                React.createElement(steps[currentStep].icon!, { className: "w-5 h-5" })
              ) : (
                <span>{currentStep + 1}</span>
              )}
            </div>
            <div className="flex-1">
              <div className="text-white">{steps[currentStep].label}</div>
              {steps[currentStep].description && (
                <div className="text-sm text-gray-400 mt-0.5">
                  {steps[currentStep].description}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Step Indicators */}
        <div className="flex gap-2">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`
                h-1 flex-1 rounded-full transition-all duration-300
                ${index <= currentStep ? 'bg-[#1CE479]' : 'bg-[#2A2A30]'}
              `}
            />
          ))}
        </div>
      </div>
    );
  }

  // Default horizontal stepper
  return (
    <div className={className}>
      {/* Progress Bar */}
      {showProgress && (
        <div className="mb-6">
          <Progress value={progress} className="h-1 bg-[#2A2A30]" />
        </div>
      )}

      {/* Steps */}
      <div className="relative">
        {/* Connector Line */}
        <div className="absolute top-4 left-0 right-0 h-0.5 bg-[#2A2A30]">
          <div
            className="h-full bg-[#1CE479] transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Step Items */}
        <div className="relative flex justify-between">
          {steps.map((step, index) => {
            const status = getStepStatus(index);
            const Icon = step.icon;
            const isClickable = allowSkip || index <= currentStep;

            return (
              <div
                key={step.id}
                className="flex flex-col items-center"
                style={{ width: `${100 / steps.length}%` }}
              >
                {/* Step Circle */}
                <button
                  onClick={() => handleStepClick(index)}
                  disabled={!isClickable}
                  className={`
                    w-8 h-8 rounded-full flex items-center justify-center mb-2
                    transition-all duration-300
                    ${status === 'completed'
                      ? 'bg-[#1CE479] text-[#0A0A0F] scale-100'
                      : status === 'current'
                      ? 'bg-[#1CE479]/20 border-2 border-[#1CE479] text-[#1CE479] scale-110'
                      : 'bg-[#2A2A30] border-2 border-[#2A2A30] text-gray-500'
                    }
                    ${isClickable ? 'cursor-pointer hover:scale-110' : 'cursor-not-allowed'}
                  `}
                >
                  {status === 'completed' ? (
                    <Check className="w-4 h-4" />
                  ) : Icon ? (
                    <Icon className="w-4 h-4" />
                  ) : (
                    <span className="text-xs">{index + 1}</span>
                  )}
                </button>

                {/* Step Label */}
                <button
                  onClick={() => handleStepClick(index)}
                  disabled={!isClickable}
                  className={`
                    text-center max-w-full px-2
                    ${isClickable ? 'cursor-pointer' : 'cursor-not-allowed'}
                  `}
                >
                  <div className={`
                    text-sm transition-colors
                    ${status === 'current' ? 'text-[#1CE479]' : status === 'completed' ? 'text-white' : 'text-gray-500'}
                  `}>
                    {step.label}
                  </div>
                  {step.description && (
                    <div className="text-xs text-gray-500 mt-0.5 hidden sm:block">
                      {step.description}
                    </div>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// Campaign Progress Component (for donation campaigns, building funds, etc.)
interface CampaignProgressProps {
  title: string;
  current: number;
  goal: number;
  currency?: string;
  daysLeft?: number;
  supporters?: number;
  showAnimation?: boolean;
  className?: string;
}

export const CampaignProgress: React.FC<CampaignProgressProps> = ({
  title,
  current,
  goal,
  currency = '$',
  daysLeft,
  supporters,
  showAnimation = true,
  className = '',
}) => {
  const percentage = Math.min((current / goal) * 100, 100);
  const remaining = goal - current;

  return (
    <div className={`bg-[#1A1A20] border border-[#2A2A30] rounded-xl p-6 ${className}`}>
      {/* Header */}
      <div className="mb-4">
        <h3 className="text-white mb-1">{title}</h3>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl text-[#1CE479]">
            {currency}{current.toLocaleString()}
          </span>
          <span className="text-gray-400">of {currency}{goal.toLocaleString()}</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="h-3 bg-[#2A2A30] rounded-full overflow-hidden">
          <div
            className={`h-full bg-gradient-to-r from-[#1CE479] to-[#14B35E] rounded-full transition-all duration-1000 ${showAnimation ? 'animate-pulse' : ''}`}
            style={{ width: `${percentage}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-400 mt-2">
          <span>{percentage.toFixed(1)}% funded</span>
          <span>{currency}{remaining.toLocaleString()} to go</span>
        </div>
      </div>

      {/* Stats */}
      <div className="flex gap-4 pt-4 border-t border-[#2A2A30]">
        {supporters !== undefined && (
          <div className="flex-1">
            <div className="text-xl text-white">{supporters}</div>
            <div className="text-xs text-gray-400">Supporters</div>
          </div>
        )}
        {daysLeft !== undefined && (
          <div className="flex-1">
            <div className="text-xl text-white">{daysLeft}</div>
            <div className="text-xs text-gray-400">Days Left</div>
          </div>
        )}
      </div>
    </div>
  );
};
