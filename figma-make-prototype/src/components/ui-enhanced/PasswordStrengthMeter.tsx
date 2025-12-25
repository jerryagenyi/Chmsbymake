/**
 * PasswordStrengthMeter - Visual password strength indicator
 * Checks: lowercase, uppercase, special characters, minimum length
 */

import React from 'react';
import { Check, X } from 'lucide-react';

export interface PasswordStrength {
  score: number; // 0-4
  hasLowercase: boolean;
  hasUppercase: boolean;
  hasSpecialChar: boolean;
  hasMinLength: boolean;
  feedback: string;
}

interface PasswordStrengthMeterProps {
  password: string;
  minLength?: number;
  showRequirements?: boolean;
  className?: string;
  onStrengthChange?: (strength: PasswordStrength) => void;
}

export function PasswordStrengthMeter({
  password,
  minLength = 8,
  showRequirements = true,
  className = '',
  onStrengthChange
}: PasswordStrengthMeterProps) {
  const strength = calculatePasswordStrength(password, minLength);
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    if (password) {
      // Small delay before showing to ensure smooth animation
      const timer = setTimeout(() => setIsVisible(true), 50);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [password]);

  React.useEffect(() => {
    if (onStrengthChange) {
      onStrengthChange(strength);
    }
  }, [password, onStrengthChange]);

  if (!password) return null;

  const getStrengthColor = (score: number) => {
    if (score === 0) return 'bg-red-500';
    if (score === 1) return 'bg-orange-500';
    if (score === 2) return 'bg-yellow-500';
    if (score === 3) return 'bg-blue-500';
    return 'bg-success';
  };

  const getStrengthText = (score: number) => {
    if (score === 0) return 'Very Weak';
    if (score === 1) return 'Weak';
    if (score === 2) return 'Fair';
    if (score === 3) return 'Good';
    return 'Strong';
  };

  return (
    <div 
      className={`overflow-hidden transition-all duration-700 ease-out ${className}`}
      style={{
        maxHeight: isVisible ? '500px' : '0',
        opacity: isVisible ? 1 : 0,
      }}
    >
      <div className="space-y-3 w-full">{/* Strength Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400">Password Strength</span>
            <span className={`text-xs font-medium ${
              strength.score === 0 ? 'text-red-400' :
              strength.score === 1 ? 'text-orange-400' :
              strength.score === 2 ? 'text-yellow-400' :
              strength.score === 3 ? 'text-blue-400' :
              'text-success'
            }`}>
              {getStrengthText(strength.score)}
            </span>
          </div>
          
          <div className="flex gap-1">
            {[0, 1, 2, 3, 4].map((level) => (
              <div
                key={level}
                className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                  level < strength.score
                    ? getStrengthColor(strength.score)
                    : 'bg-[#2A2A30]'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Requirements Checklist */}
        {showRequirements && (
          <div className="space-y-1.5 bg-[#0A0A0F] border border-[#2A2A30] rounded-lg p-3 w-full">
            <p className="text-xs font-medium text-gray-400 mb-2">Password must contain:</p>
            
            <RequirementItem
              met={strength.hasMinLength}
              text={`At least ${minLength} characters`}
            />
            <RequirementItem
              met={strength.hasLowercase}
              text="One lowercase letter (a-z)"
            />
            <RequirementItem
              met={strength.hasUppercase}
              text="One uppercase letter (A-Z)"
            />
            <RequirementItem
              met={strength.hasSpecialChar}
              text="One special character (!@#$%^&*)"
            />
          </div>
        )}

        {/* Feedback Message */}
        {strength.feedback && (
          <p className="text-xs text-gray-500 italic">
            💡 {strength.feedback}
          </p>
        )}
      </div>
    </div>
  );
}

function RequirementItem({ met, text }: { met: boolean; text: string }) {
  return (
    <div className="flex items-center gap-2 text-xs">
      <div className={`flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center ${
        met ? 'bg-success/20' : 'bg-[#2A2A30]'
      }`}>
        {met ? (
          <Check className="w-3 h-3 text-success" />
        ) : (
          <X className="w-2.5 h-2.5 text-gray-600" />
        )}
      </div>
      <span className={met ? 'text-gray-300' : 'text-gray-500'}>{text}</span>
    </div>
  );
}

export function calculatePasswordStrength(
  password: string,
  minLength: number = 8
): PasswordStrength {
  const hasLowercase = /[a-z]/.test(password);
  const hasUppercase = /[A-Z]/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
  const hasMinLength = password.length >= minLength;
  const hasNumber = /\d/.test(password);

  let score = 0;
  let feedback = '';

  // Calculate score (0-4)
  if (hasMinLength) score++;
  if (hasLowercase) score++;
  if (hasUppercase) score++;
  if (hasSpecialChar) score++;

  // Bonus point for having numbers
  if (hasNumber && score === 4) {
    score = 4; // Keep at max
  }

  // Generate feedback
  if (score === 0) {
    feedback = 'Try adding uppercase, lowercase, and special characters';
  } else if (score === 1) {
    feedback = 'Add more variety to make your password stronger';
  } else if (score === 2) {
    feedback = 'Getting better! Add special characters for extra security';
  } else if (score === 3) {
    feedback = 'Almost there! One more requirement to go';
  } else {
    feedback = 'Excellent! Your password is strong and secure';
  }

  return {
    score,
    hasLowercase,
    hasUppercase,
    hasSpecialChar,
    hasMinLength,
    feedback
  };
}

/**
 * Compact version for inline use
 */
export function PasswordStrengthBadge({ 
  password, 
  className = '' 
}: { 
  password: string; 
  className?: string; 
}) {
  if (!password) return null;

  const strength = calculatePasswordStrength(password);

  const getBadgeColor = (score: number) => {
    if (score === 0) return 'bg-red-500/20 text-red-400 border-red-500/30';
    if (score === 1) return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
    if (score === 2) return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    if (score === 3) return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    return 'bg-green-500/20 text-green-400 border-green-500/30';
  };

  const getStrengthText = (score: number) => {
    if (score === 0) return 'Very Weak';
    if (score === 1) return 'Weak';
    if (score === 2) return 'Fair';
    if (score === 3) return 'Good';
    return 'Strong';
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full border text-xs font-medium ${getBadgeColor(strength.score)} ${className}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {getStrengthText(strength.score)}
    </span>
  );
}