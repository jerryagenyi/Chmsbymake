/**
 * Chat and Messaging Type Definitions
 * Real-time communication for ChurchAfrica ChMS
 */

export interface ChatRoom {
  id: string;
  organizationId: string;
  branchId?: string; // Optional: room can be org-wide or branch-specific
  
  // Identity
  name: string;
  description?: string;
  type: 'group' | 'direct' | 'announcement' | 'department' | 'ministry';
  
  // Avatar/Icon
  avatarUrl?: string;
  iconEmoji?: string;
  
  // Participants
  participantIds: string[];
  adminIds: string[];
  
  // Settings
  settings: {
    isPrivate: boolean;
    allowFileSharing: boolean;
    allowMemberInvites: boolean;
    muteNotifications: boolean;
    isPinned: boolean;
  };
  
  // Last message preview
  lastMessage?: {
    id: string;
    content: string;
    senderId: string;
    senderName: string;
    timestamp: string;
    type: 'text' | 'image' | 'file' | 'system';
  };
  
  // Metadata
  unreadCount: number;
  totalMessages: number;
  
  // Audit
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface ChatMessage {
  id: string;
  roomId: string;
  
  // Sender
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  senderRole?: string;
  
  // Content
  type: 'text' | 'image' | 'file' | 'audio' | 'video' | 'system' | 'announcement';
  content: string;
  
  // Attachments
  attachments?: ChatAttachment[];
  
  // Reply/Thread
  replyToId?: string;
  replyTo?: {
    messageId: string;
    senderName: string;
    content: string;
  };
  
  // Reactions
  reactions: ChatReaction[];
  
  // Status
  isEdited: boolean;
  editedAt?: string;
  isDeleted: boolean;
  deletedAt?: string;
  
  // Read receipts
  readBy: {
    userId: string;
    readAt: string;
  }[];
  
  // Metadata
  metadata?: {
    mentionedUserIds?: string[];
    tags?: string[];
    priority?: 'low' | 'normal' | 'high' | 'urgent';
  };
  
  // Audit
  createdAt: string;
  updatedAt: string;
}

export interface ChatAttachment {
  id: string;
  type: 'image' | 'file' | 'audio' | 'video';
  name: string;
  url: string;
  size: number; // bytes
  mimeType: string;
  thumbnail?: string;
  uploadedAt: string;
}

export interface ChatReaction {
  emoji: string;
  userIds: string[];
  count: number;
}

export interface ChatNotification {
  id: string;
  userId: string;
  roomId: string;
  messageId: string;
  
  type: 'message' | 'mention' | 'reply' | 'announcement';
  title: string;
  content: string;
  
  isRead: boolean;
  readAt?: string;
  
  createdAt: string;
}

export interface TypingIndicator {
  roomId: string;
  userId: string;
  userName: string;
  timestamp: string;
}

export interface UserPresence {
  userId: string;
  status: 'online' | 'away' | 'busy' | 'offline';
  lastSeen: string;
  currentRoomId?: string;
}

export interface ChatDraft {
  roomId: string;
  content: string;
  replyToId?: string;
  savedAt: string;
}

// Filter and search types
export interface ChatFilter {
  roomType?: ChatRoom['type'];
  hasUnread?: boolean;
  isPinned?: boolean;
  searchQuery?: string;
}

export interface MessageFilter {
  senderId?: string;
  messageType?: ChatMessage['type'];
  hasAttachment?: boolean;
  dateFrom?: string;
  dateTo?: string;
  searchQuery?: string;
}
