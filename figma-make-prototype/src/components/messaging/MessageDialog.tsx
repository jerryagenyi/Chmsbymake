/**
 * MessageDialog - Send message to member(s)
 * Can be used for single or bulk messaging
 */

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  Send, 
  Mail, 
  MessageSquare, 
  Phone,
  X,
  Users,
  Loader2
} from 'lucide-react';
import { Member } from '../../types/member';

interface MessageDialogProps {
  open: boolean;
  onClose: () => void;
  members: Member[];
  onSendEmail?: (members: Member[], subject: string, message: string) => void;
  onSendSMS?: (members: Member[], message: string) => void;
  onSendChat?: (members: Member[], message: string) => void;
}

export function MessageDialog({
  open,
  onClose,
  members,
  onSendEmail,
  onSendSMS,
  onSendChat,
}: MessageDialogProps) {
  const [messageType, setMessageType] = useState<'email' | 'sms' | 'chat'>('email');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  const isSingle = members.length === 1;
  const singleMember = isSingle ? members[0] : null;

  const characterCount = message.length;
  const smsCount = Math.ceil(characterCount / 160);
  const maxSmsChars = 480; // 3 SMS segments

  const handleSend = async () => {
    setSending(true);
    
    try {
      if (messageType === 'email' && onSendEmail) {
        await onSendEmail(members, subject, message);
      } else if (messageType === 'sms' && onSendSMS) {
        await onSendSMS(members, message);
      } else if (messageType === 'chat' && onSendChat) {
        await onSendChat(members, message);
      }

      // Reset and close
      setSubject('');
      setMessage('');
      onClose();
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setSending(false);
    }
  };

  const canSend = () => {
    if (messageType === 'email') {
      return subject.trim() && message.trim();
    }
    return message.trim();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-card">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-primary" />
            {isSingle ? `Message ${singleMember?.firstName}` : `Message ${members.length} Members`}
          </DialogTitle>
          <DialogDescription>
            {isSingle 
              ? 'Send a message via email, SMS, or in-app chat'
              : `Send a bulk message to ${members.length} selected members`
            }
          </DialogDescription>
        </DialogHeader>

        {/* Recipients */}
        <div className="space-y-3">
          <Label className="text-sm">Recipients ({members.length})</Label>
          <div className="max-h-[120px] overflow-y-auto space-y-2 p-3 bg-muted/30 rounded-md border border-border">
            {members.slice(0, 5).map((member) => {
              const initials = `${member.firstName[0]}${member.lastName[0]}`.toUpperCase();
              return (
                <div key={member.id} className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={member.photo} />
                    <AvatarFallback className="text-xs">{initials}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm truncate">
                      {member.firstName} {member.lastName}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {member.contact.email}
                    </p>
                  </div>
                </div>
              );
            })}
            {members.length > 5 && (
              <div className="text-xs text-muted-foreground flex items-center gap-1 pl-10">
                <Users className="w-3 h-3" />
                +{members.length - 5} more members
              </div>
            )}
          </div>
        </div>

        {/* Message Type Tabs */}
        <Tabs value={messageType} onValueChange={(v) => setMessageType(v as any)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="email" className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Email
            </TabsTrigger>
            <TabsTrigger value="sms" className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              SMS
            </TabsTrigger>
            <TabsTrigger value="chat" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Chat
            </TabsTrigger>
          </TabsList>

          {/* Email Tab */}
          <TabsContent value="email" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="subject">Subject *</Label>
              <input
                id="subject"
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Enter email subject..."
                className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email-message">Message *</Label>
              <Textarea
                id="email-message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message here..."
                rows={8}
                className="resize-none"
              />
              <p className="text-xs text-muted-foreground">
                {characterCount} characters
              </p>
            </div>
          </TabsContent>

          {/* SMS Tab */}
          <TabsContent value="sms" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="sms-message">Message *</Label>
              <Textarea
                id="sms-message"
                value={message}
                onChange={(e) => {
                  if (e.target.value.length <= maxSmsChars) {
                    setMessage(e.target.value);
                  }
                }}
                placeholder="Type your SMS message... (max 480 characters)"
                rows={6}
                className="resize-none"
              />
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">
                  {characterCount}/{maxSmsChars} characters
                </span>
                <Badge variant="outline" className="text-xs">
                  {smsCount} SMS {smsCount > 1 ? 'segments' : 'segment'}
                </Badge>
              </div>
            </div>
            <div className="p-3 bg-warning/10 border border-warning/20 rounded-md">
              <p className="text-xs text-warning-foreground">
                <strong>Note:</strong> SMS costs apply. Each member will receive {smsCount} SMS {smsCount > 1 ? 'messages' : 'message'}.
                {!isSingle && ` Total: ${members.length * smsCount} SMS messages.`}
              </p>
            </div>
          </TabsContent>

          {/* Chat Tab */}
          <TabsContent value="chat" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="chat-message">Message *</Label>
              <Textarea
                id="chat-message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your in-app chat message..."
                rows={8}
                className="resize-none"
              />
              <p className="text-xs text-muted-foreground">
                {characterCount} characters
              </p>
            </div>
            <div className="p-3 bg-info/10 border border-info/20 rounded-md">
              <p className="text-xs text-info-foreground">
                {isSingle 
                  ? 'Message will be sent as a direct message'
                  : 'Each member will receive an individual direct message'
                }
              </p>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={sending}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSend}
            disabled={!canSend() || sending}
            className="gap-2"
          >
            {sending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Send {messageType === 'email' ? 'Email' : messageType === 'sms' ? 'SMS' : 'Message'}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/**
 * Vue Migration Notes:
 * 
 * <template>
 *   <q-dialog v-model="open" persistent>
 *     <q-card style="min-width: 600px">
 *       <q-card-section class="row items-center q-pb-none">
 *         <div class="text-h6">
 *           <q-icon name="message" color="primary" />
 *           Message {{ isSingle ? member.firstName : `${members.length} Members` }}
 *         </div>
 *         <q-space />
 *         <q-btn icon="close" flat round dense @click="onClose" />
 *       </q-card-section>
 * 
 *       <q-card-section>
 *         <!-- Recipients list -->
 *         <div class="q-mb-md">
 *           <div class="text-caption q-mb-sm">Recipients ({{ members.length }})</div>
 *           <q-scroll-area style="height: 120px">
 *             <q-item v-for="member in members.slice(0, 5)" :key="member.id" dense>
 *               <q-item-section avatar>
 *                 <q-avatar size="32px">{{ initials }}</q-avatar>
 *               </q-item-section>
 *               <q-item-section>
 *                 <q-item-label>{{ member.firstName }} {{ member.lastName }}</q-item-label>
 *                 <q-item-label caption>{{ member.contact.email }}</q-item-label>
 *               </q-item-section>
 *             </q-item>
 *           </q-scroll-area>
 *         </div>
 * 
 *         <!-- Message type tabs -->
 *         <q-tabs v-model="messageType" dense>
 *           <q-tab name="email" icon="mail" label="Email" />
 *           <q-tab name="sms" icon="phone" label="SMS" />
 *           <q-tab name="chat" icon="message" label="Chat" />
 *         </q-tabs>
 * 
 *         <q-separator class="q-my-md" />
 * 
 *         <q-tab-panels v-model="messageType">
 *           <!-- Email panel -->
 *           <q-tab-panel name="email">
 *             <q-input
 *               v-model="subject"
 *               label="Subject *"
 *               outlined
 *               dense
 *             />
 *             <q-input
 *               v-model="message"
 *               type="textarea"
 *               label="Message *"
 *               outlined
 *               rows="8"
 *               class="q-mt-md"
 *             />
 *           </q-tab-panel>
 * 
 *           <!-- SMS panel -->
 *           <q-tab-panel name="sms">
 *             <q-input
 *               v-model="message"
 *               type="textarea"
 *               label="Message *"
 *               outlined
 *               rows="6"
 *               :maxlength="480"
 *               counter
 *             />
 *             <q-banner class="bg-warning text-warning q-mt-md">
 *               SMS costs apply...
 *             </q-banner>
 *           </q-tab-panel>
 * 
 *           <!-- Chat panel -->
 *           <q-tab-panel name="chat">
 *             <q-input
 *               v-model="message"
 *               type="textarea"
 *               label="Message *"
 *               outlined
 *               rows="8"
 *             />
 *           </q-tab-panel>
 *         </q-tab-panels>
 *       </q-card-section>
 * 
 *       <q-card-actions align="right">
 *         <q-btn flat label="Cancel" @click="onClose" />
 *         <q-btn 
 *           color="primary" 
 *           label="Send" 
 *           :loading="sending"
 *           @click="handleSend" 
 *         />
 *       </q-card-actions>
 *     </q-card>
 *   </q-dialog>
 * </template>
 */
