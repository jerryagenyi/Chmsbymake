# Real-time Chat System

## Overview
Real-time messaging system for church communication with support for group chats, direct messages, announcements, and file sharing.

## Features

### ✅ Implemented
- **Chat Rooms**
  - Group chats
  - Direct messages
  - Announcements
  - Department/Ministry-specific channels
  - Pinned conversations
  - Unread message tracking

- **Messaging**
  - Text messages
  - Image/file attachments
  - Reply to messages
  - Message reactions (emojis)
  - Edit and delete messages
  - Read receipts
  - Mentions (@user)

- **UI Components**
  - Chat room sidebar with search
  - Message thread view
  - File attachment preview
  - Typing indicators (planned)
  - User presence status (online/away/offline)
  - Emoji reactions

- **Organization Integration**
  - Org-wide channels
  - Branch-specific channels
  - Role-based access
  - Admin controls

### 🔄 Future Enhancements
- Real-time WebSocket integration
- Push notifications
- Voice messages
- Video calls
- Message search
- File upload to cloud storage
- Message threading
- Custom emoji reactions
- Message pinning
- Auto-delete messages
- Chat export

## Data Models

### ChatRoom
```typescript
{
  id: string;
  organizationId: string;
  branchId?: string;
  name: string;
  type: 'group' | 'direct' | 'announcement' | 'department' | 'ministry';
  participantIds: string[];
  settings: {
    isPrivate: boolean;
    allowFileSharing: boolean;
    muteNotifications: boolean;
    isPinned: boolean;
  };
  lastMessage: {...};
  unreadCount: number;
}
```

### ChatMessage
```typescript
{
  id: string;
  roomId: string;
  senderId: string;
  type: 'text' | 'image' | 'file' | 'announcement';
  content: string;
  attachments?: [...];
  replyTo?: {...};
  reactions: [{emoji, userIds, count}];
  readBy: [{userId, readAt}];
}
```

## Mock Data
Sample data includes:
- 6 chat rooms (announcements, ministry groups, prayer groups)
- 10+ messages with various types
- User presence status
- File attachments
- Message reactions

## Usage

### Basic Implementation
```tsx
import { ChatInterface } from './components/chat';

function App() {
  return <ChatInterface />;
}
```

### With Real-time (Future)
```tsx
// Connect to WebSocket
const socket = new WebSocket('wss://api.church.com/chat');

socket.on('message', (message) => {
  // Add to chat
});

socket.on('typing', (userId) => {
  // Show typing indicator
});
```

## Africa-First Considerations

### Low Bandwidth
- Text-first approach
- Image compression before sending
- Lazy load message history
- Offline message queue

### Offline Support
- Store messages in IndexedDB
- Send when connection restored
- Show sync status

### Cost Optimization
- WebSocket connection pooling
- Batch read receipts
- Compress images automatically
- Limit file upload size

## Backend Integration

### Supabase Realtime
```typescript
// Subscribe to room
const channel = supabase.channel(`room:${roomId}`)
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'messages',
    filter: `room_id=eq.${roomId}`
  }, (payload) => {
    // New message received
    addMessage(payload.new);
  })
  .subscribe();
```

### Laravel + Pusher
```php
// Broadcast message
broadcast(new MessageSent($message))->toOthers();
```

```typescript
// Listen for messages
Echo.channel(`chat.room.${roomId}`)
  .listen('MessageSent', (e) => {
    addMessage(e.message);
  });
```

## Security

- **Authorization**: Only participants can see room messages
- **Row Level Security**: Filter by organizationId/branchId
- **File Upload**: Validate file types and sizes
- **Rate Limiting**: Prevent spam
- **Encryption**: End-to-end encryption (future)

## Testing

Test scenarios:
1. Send text message
2. Send image attachment
3. Reply to message
4. Add emoji reaction
5. Search conversations
6. Create new group
7. Leave group
8. Mute notifications
9. Pin conversation
10. Mark as read/unread
