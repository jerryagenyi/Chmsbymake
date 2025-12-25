/**
 * BulkActionsBar - Actions for selected members
 * Export, Delete, Message, Tag, etc.
 */

import React, { useState } from 'react';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
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
import {
  Download,
  Trash2,
  MessageSquare,
  Tag,
  UserPlus,
  Mail,
  Phone,
  MoreHorizontal,
  X,
  FileSpreadsheet,
  FileText,
  Users,
} from 'lucide-react';
import { Member } from '../../types/member';
import { Badge } from '../ui/badge';

interface BulkActionsBarProps {
  selectedMembers: Member[];
  onClearSelection: () => void;
  onExport: (format: 'csv' | 'excel' | 'pdf', members: Member[]) => void;
  onDelete: (members: Member[]) => void;
  onMessage: (members: Member[]) => void;
  onAddToGroup?: (members: Member[]) => void;
  onAddTags?: (members: Member[]) => void;
}

export function BulkActionsBar({
  selectedMembers,
  onClearSelection,
  onExport,
  onDelete,
  onMessage,
  onAddToGroup,
  onAddTags,
}: BulkActionsBarProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  if (selectedMembers.length === 0) return null;

  const handleDelete = () => {
    onDelete(selectedMembers);
    setShowDeleteDialog(false);
  };

  return (
    <>
      <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-40 animate-in slide-in-from-bottom-4">
        <div className="bg-card border-2 border-primary shadow-2xl rounded-lg px-4 py-3 flex items-center gap-3">
          {/* Selection Count */}
          <div className="flex items-center gap-2">
            <Badge variant="default" className="text-sm px-3 py-1">
              {selectedMembers.length} selected
            </Badge>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={onClearSelection}
              title="Clear selection"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="h-8 w-px bg-border" />

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            {/* Message */}
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => onMessage(selectedMembers)}
            >
              <MessageSquare className="h-4 w-4" />
              Message
            </Button>

            {/* Export Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Download className="h-4 w-4" />
                  Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" className="w-48">
                <DropdownMenuLabel>Export Format</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onExport('csv', selectedMembers)}>
                  <FileText className="mr-2 h-4 w-4" />
                  CSV File
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onExport('excel', selectedMembers)}>
                  <FileSpreadsheet className="mr-2 h-4 w-4" />
                  Excel File
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onExport('pdf', selectedMembers)}>
                  <FileText className="mr-2 h-4 w-4" />
                  PDF Report
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* More Actions */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <MoreHorizontal className="h-4 w-4" />
                  More
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" className="w-56">
                <DropdownMenuLabel>More Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                
                {onAddToGroup && (
                  <DropdownMenuItem onClick={() => onAddToGroup(selectedMembers)}>
                    <Users className="mr-2 h-4 w-4" />
                    Add to Group
                  </DropdownMenuItem>
                )}
                
                {onAddTags && (
                  <DropdownMenuItem onClick={() => onAddTags(selectedMembers)}>
                    <Tag className="mr-2 h-4 w-4" />
                    Add Tags
                  </DropdownMenuItem>
                )}
                
                <DropdownMenuItem>
                  <Mail className="mr-2 h-4 w-4" />
                  Send Email Campaign
                </DropdownMenuItem>
                
                <DropdownMenuItem>
                  <Phone className="mr-2 h-4 w-4" />
                  Send Bulk SMS
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />
                
                <DropdownMenuItem>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Change Status
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />
                
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={() => setShowDeleteDialog(true)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Selected
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="bg-card">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {selectedMembers.length} Members?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the selected members
              and remove their data from the database.
              {selectedMembers.length <= 5 && (
                <div className="mt-4 space-y-1">
                  <p className="font-medium text-foreground">Members to be deleted:</p>
                  {selectedMembers.map((m) => (
                    <p key={m.id} className="text-sm">
                      • {m.firstName} {m.lastName}
                    </p>
                  ))}
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete {selectedMembers.length} Members
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

/**
 * Vue Migration Notes:
 * 
 * <template>
 *   <!-- Floating action bar -->
 *   <teleport to="body">
 *     <transition name="slide-up">
 *       <div 
 *         v-if="selectedMembers.length > 0"
 *         class="fixed bottom-20 left-1/2 -translate-x-1/2 z-50"
 *       >
 *         <q-card class="shadow-2xl" bordered>
 *           <q-card-section horizontal class="items-center q-pa-md">
 *             <!-- Selection count -->
 *             <q-chip color="primary" text-color="white">
 *               {{ selectedMembers.length }} selected
 *             </q-chip>
 *             
 *             <q-btn 
 *               flat 
 *               round 
 *               dense 
 *               icon="close" 
 *               @click="onClearSelection"
 *             />
 *             
 *             <q-separator vertical class="q-mx-md" />
 *             
 *             <!-- Actions -->
 *             <q-btn 
 *               outline 
 *               icon="message" 
 *               label="Message"
 *               @click="onMessage"
 *             />
 *             
 *             <q-btn-dropdown 
 *               outline 
 *               icon="download" 
 *               label="Export"
 *             >
 *               <q-list>
 *                 <q-item clickable @click="onExport('csv')">
 *                   <q-item-section avatar>
 *                     <q-icon name="description" />
 *                   </q-item-section>
 *                   <q-item-section>CSV File</q-item-section>
 *                 </q-item>
 *                 <q-item clickable @click="onExport('excel')">
 *                   <q-item-section avatar>
 *                     <q-icon name="table_chart" />
 *                   </q-item-section>
 *                   <q-item-section>Excel File</q-item-section>
 *                 </q-item>
 *               </q-list>
 *             </q-btn-dropdown>
 *             
 *             <q-btn-dropdown outline icon="more_horiz" label="More">
 *               <q-list>
 *                 <q-item clickable @click="onAddToGroup">
 *                   <q-item-section avatar><q-icon name="group_add" /></q-item-section>
 *                   <q-item-section>Add to Group</q-item-section>
 *                 </q-item>
 *                 <q-separator />
 *                 <q-item clickable @click="confirmDelete">
 *                   <q-item-section avatar><q-icon name="delete" color="negative" /></q-item-section>
 *                   <q-item-section class="text-negative">Delete Selected</q-item-section>
 *                 </q-item>
 *               </q-list>
 *             </q-btn-dropdown>
 *           </q-card-section>
 *         </q-card>
 *       </div>
 *     </transition>
 *   </teleport>
 * 
 *   <!-- Delete confirmation -->
 *   <q-dialog v-model="showDeleteDialog">
 *     <q-card>
 *       <q-card-section>
 *         <div class="text-h6">Delete {{ selectedMembers.length }} Members?</div>
 *       </q-card-section>
 *       <q-card-section class="q-pt-none">
 *         This action cannot be undone...
 *       </q-card-section>
 *       <q-card-actions align="right">
 *         <q-btn flat label="Cancel" v-close-popup />
 *         <q-btn 
 *           color="negative" 
 *           label="Delete" 
 *           @click="handleDelete" 
 *           v-close-popup 
 *         />
 *       </q-card-actions>
 *     </q-card>
 *   </q-dialog>
 * </template>
 */
