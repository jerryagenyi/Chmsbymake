import React from 'react';
import { AlertTriangle, Trash2, AlertCircle, Info, CheckCircle2, type LucideIcon } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';
import { Button } from '../ui/button';

interface ConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void | Promise<void>;
  onCancel?: () => void;
  variant?: 'danger' | 'warning' | 'info' | 'success';
  icon?: LucideIcon;
  destructive?: boolean;
  loading?: boolean;
  confirmationText?: string; // Optional text user must type to confirm
  children?: React.ReactNode;
}

const variantConfig = {
  danger: {
    icon: AlertTriangle,
    iconColor: 'text-red-500',
    iconBg: 'bg-red-500/10',
    buttonClass: 'bg-red-600 hover:bg-red-700 text-white',
  },
  warning: {
    icon: AlertCircle,
    iconColor: 'text-orange-500',
    iconBg: 'bg-orange-500/10',
    buttonClass: 'bg-orange-600 hover:bg-orange-700 text-white',
  },
  info: {
    icon: Info,
    iconColor: 'text-blue-500',
    iconBg: 'bg-blue-500/10',
    buttonClass: 'bg-blue-600 hover:bg-blue-700 text-white',
  },
  success: {
    icon: CheckCircle2,
    iconColor: 'text-[#1CE479]',
    iconBg: 'bg-[#1CE479]/10',
    buttonClass: 'bg-[#1CE479] hover:bg-[#1CE479]/90 text-[#0A0A0F]',
  },
};

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  variant = 'info',
  icon: CustomIcon,
  destructive = false,
  loading = false,
  confirmationText,
  children,
}) => {
  const [inputValue, setInputValue] = React.useState('');
  const [isProcessing, setIsProcessing] = React.useState(false);

  const config = variantConfig[variant];
  const Icon = CustomIcon || config.icon;

  const handleConfirm = async () => {
    if (confirmationText && inputValue !== confirmationText) {
      return;
    }

    setIsProcessing(true);
    try {
      await onConfirm();
      onOpenChange(false);
      setInputValue('');
    } catch (error) {
      console.error('Confirmation action failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancel = () => {
    onCancel?.();
    onOpenChange(false);
    setInputValue('');
  };

  const canConfirm = confirmationText ? inputValue === confirmationText : true;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-[#1A1A20] border-[#2A2A30] text-white">
        <AlertDialogHeader>
          <div className="flex items-start gap-4 mb-2">
            <div className={`w-12 h-12 rounded-full ${config.iconBg} flex items-center justify-center flex-shrink-0`}>
              <Icon className={`w-6 h-6 ${config.iconColor}`} />
            </div>
            <div className="flex-1">
              <AlertDialogTitle className="text-white text-left">
                {title}
              </AlertDialogTitle>
            </div>
          </div>
          <AlertDialogDescription className="text-gray-400 text-left">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>

        {/* Confirmation Text Input */}
        {confirmationText && (
          <div className="space-y-2">
            <p className="text-sm text-gray-400">
              Type <span className="text-white font-mono bg-[#2A2A30] px-2 py-0.5 rounded">{confirmationText}</span> to confirm:
            </p>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={confirmationText}
              className="w-full bg-[#0A0A0F] border border-[#2A2A30] rounded-lg px-3 py-2 text-white focus:border-[#1CE479] focus:outline-none"
              autoFocus
            />
          </div>
        )}

        {/* Custom Content */}
        {children && (
          <div className="py-2">
            {children}
          </div>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={handleCancel}
            disabled={isProcessing || loading}
            className="bg-transparent border-[#2A2A30] hover:bg-[#2A2A30] text-gray-300"
          >
            {cancelLabel}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={!canConfirm || isProcessing || loading}
            className={config.buttonClass}
          >
            {isProcessing || loading ? 'Processing...' : confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

// Preset Confirmation Dialogs
export const DeleteConfirmation: React.FC<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  itemName: string;
  itemType?: string;
  onConfirm: () => void | Promise<void>;
  requireConfirmation?: boolean;
}> = ({ open, onOpenChange, itemName, itemType = 'item', onConfirm, requireConfirmation = false }) => (
  <ConfirmationDialog
    open={open}
    onOpenChange={onOpenChange}
    variant="danger"
    icon={Trash2}
    title={`Delete ${itemType}?`}
    description={`Are you sure you want to delete "${itemName}"? This action cannot be undone.`}
    confirmLabel="Delete"
    confirmationText={requireConfirmation ? itemName : undefined}
    onConfirm={onConfirm}
  />
);

export const LogoutConfirmation: React.FC<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void | Promise<void>;
}> = ({ open, onOpenChange, onConfirm }) => (
  <ConfirmationDialog
    open={open}
    onOpenChange={onOpenChange}
    variant="warning"
    title="Logout"
    description="Are you sure you want to logout? Make sure all your changes are synced."
    confirmLabel="Logout"
    onConfirm={onConfirm}
  />
);

export const ArchiveConfirmation: React.FC<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  itemName: string;
  onConfirm: () => void | Promise<void>;
}> = ({ open, onOpenChange, itemName, onConfirm }) => (
  <ConfirmationDialog
    open={open}
    onOpenChange={onOpenChange}
    variant="info"
    title="Archive Item"
    description={`Are you sure you want to archive "${itemName}"? You can restore it later from the archive.`}
    confirmLabel="Archive"
    onConfirm={onConfirm}
  />
);
