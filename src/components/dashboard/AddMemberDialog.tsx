/**
 * AddMemberDialog - Quick action to add new member
 * Opens AddMemberForm in dialog mode
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
import { UserPlus } from 'lucide-react';
import { AddMemberForm } from '../members/AddMemberForm';
import type { Member } from '../../types/member';

interface AddMemberDialogProps {
  open: boolean;
  onClose: () => void;
  onMemberAdded?: (member: Member) => void;
}

export function AddMemberDialog({
  open,
  onClose,
  onMemberAdded,
}: AddMemberDialogProps) {
  const handleSuccess = (member: Member) => {
    if (onMemberAdded) {
      onMemberAdded(member);
    }
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-card">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-primary" />
            Add New Member
          </DialogTitle>
          <DialogDescription>
            Fill in member information below. Required fields are marked with *
          </DialogDescription>
        </DialogHeader>

        <AddMemberForm 
          onSuccess={handleSuccess}
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  );
}

// Trigger Button Component
export function AddMemberButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)} className="gap-2">
        <UserPlus className="h-4 w-4" />
        Add Member
      </Button>

      <AddMemberDialog
        open={open}
        onClose={() => setOpen(false)}
        onMemberAdded={(member) => {
          console.log('New member added:', member);
          // Show success toast
        }}
      />
    </>
  );
}

/**
 * Vue Migration Notes:
 * 
 * <template>
 *   <q-dialog v-model="open" persistent max-width="900px">
 *     <q-card>
 *       <q-card-section class="row items-center q-pb-none">
 *         <div class="text-h6">
 *           <q-icon name="person_add" color="primary" class="q-mr-sm" />
 *           Add New Member
 *         </div>
 *         <q-space />
 *         <q-btn icon="close" flat round dense v-close-popup />
 *       </q-card-section>
 * 
 *       <q-card-section>
 *         <AddMemberForm @success="handleSuccess" @cancel="open = false" />
 *       </q-card-section>
 *     </q-card>
 *   </q-dialog>
 * </template>
 */
