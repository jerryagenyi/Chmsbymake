import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { ScrollArea } from '../ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  MessageSquare, 
  Send, 
  Paperclip, 
  Search, 
  MoreVertical, 
  Users,
  Pin,
  Bell,
  BellOff,
  Image as ImageIcon,
  Smile,
  Phone,
  Video,
  Info,
  Plus
} from 'lucide-react';
import { mockChatRooms, mockChatMessages, mockUserPresence } from '../../lib/mock-chat-data';
import { ChatRoom, ChatMessage } from '../../types/chat';
import { format } from 'date-fns';
import { PageHeader } from '../layout/PageHeader';

export function ChatInterface() {
  const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(mockChatRooms[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const filteredRooms = mockChatRooms.filter(room => {
    const matchesSearch = room.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeTab === 'all') return matchesSearch;
    if (activeTab === 'pinned') return matchesSearch && room.settings.isPinned;
    if (activeTab === 'unread') return matchesSearch && room.unreadCount > 0;
    
    return matchesSearch;
  });

  const selectedRoomMessages = selectedRoom 
    ? mockChatMessages.filter(msg => msg.roomId === selectedRoom.id)
    : [];

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedRoom) return;
    
    console.log('Sending message:', newMessage);
    // In real app: send via API/WebSocket
    setNewMessage('');
  };

  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return format(date, 'HH:mm');
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday ' + format(date, 'HH:mm');
    } else {
      return format(date, 'MMM dd, HH:mm');
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getStatusColor = (userId: string) => {
    const presence = mockUserPresence.find(p => p.userId === userId);
    if (!presence) return 'bg-gray-400';
    
    switch (presence.status) {
      case 'online': return 'bg-success';
      case 'away': return 'bg-yellow-500';
      case 'busy': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Real-time Chat"
        description="Communicate with your church community"
        action={
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Group
          </Button>
        }
      />

      {/* Main Chat Layout */}
      <div className="grid grid-cols-12 gap-6 h-[calc(100vh-250px)]">
        {/* Chat Rooms Sidebar */}
        <div className="col-span-4 space-y-4">
          <Card className="h-full flex flex-col">
            <CardHeader className="pb-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardHeader>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
              <TabsList className="mx-6 mb-2">
                <TabsTrigger value="all" className="flex-1">All</TabsTrigger>
                <TabsTrigger value="unread" className="flex-1">
                  Unread
                  {mockChatRooms.filter(r => r.unreadCount > 0).length > 0 && (
                    <Badge variant="destructive" className="ml-2 h-5 px-1.5 text-xs">
                      {mockChatRooms.filter(r => r.unreadCount > 0).length}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="pinned" className="flex-1">Pinned</TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab} className="flex-1 m-0">
                <ScrollArea className="h-full px-6">
                  <div className="space-y-2 pb-4">
                    {filteredRooms.map((room) => (
                      <button
                        key={room.id}
                        onClick={() => setSelectedRoom(room)}
                        className={`
                          w-full p-3 rounded-lg transition-all text-left
                          ${selectedRoom?.id === room.id 
                            ? 'bg-primary/10 border border-primary/20' 
                            : 'hover:bg-accent/50 border border-transparent'}
                        `}
                      >
                        <div className="flex items-start gap-3">
                          <div className="relative flex-shrink-0">
                            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-lg">
                              {room.iconEmoji || '💬'}
                            </div>
                            {room.settings.isPinned && (
                              <div className="absolute -top-1 -right-1 bg-primary rounded-full p-0.5">
                                <Pin className="h-3 w-3" />
                              </div>
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2 mb-1">
                              <span className="font-medium truncate">{room.name}</span>
                              {room.lastMessage && (
                                <span className="text-xs text-muted-foreground whitespace-nowrap">
                                  {formatMessageTime(room.lastMessage.timestamp)}
                                </span>
                              )}
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <p className="text-sm text-muted-foreground truncate flex-1">
                                {room.lastMessage?.content || 'No messages yet'}
                              </p>
                              {room.unreadCount > 0 && (
                                <Badge variant="default" className="rounded-full h-5 px-2">
                                  {room.unreadCount}
                                </Badge>
                              )}
                            </div>

                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-xs">
                                {room.type}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {room.participantIds.length} members
                              </span>
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </Card>
        </div>

        {/* Chat Messages Area */}
        <div className="col-span-8">
          {selectedRoom ? (
            <Card className="h-full flex flex-col">
              {/* Chat Header */}
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      {selectedRoom.iconEmoji || '💬'}
                    </div>
                    <div>
                      <h3 className="font-semibold">{selectedRoom.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {selectedRoom.participantIds.length} members
                        {selectedRoom.description && ` • ${selectedRoom.description}`}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon">
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Video className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Info className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {/* Messages */}
              <ScrollArea className="flex-1 p-6">
                <div className="space-y-6">
                  {selectedRoomMessages.map((message) => {
                    const isAnnouncement = message.type === 'announcement';
                    
                    return (
                      <div key={message.id} className={isAnnouncement ? 'space-y-2' : ''}>
                        {isAnnouncement && (
                          <div className="flex justify-center">
                            <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
                              📢 Announcement
                            </Badge>
                          </div>
                        )}

                        <div className="flex gap-3">
                          <Avatar className="h-8 w-8 flex-shrink-0">
                            <AvatarImage src={message.senderAvatar} />
                            <AvatarFallback className="text-xs">
                              {getInitials(message.senderName)}
                            </AvatarFallback>
                          </Avatar>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-baseline gap-2 mb-1">
                              <span className="font-medium text-sm">{message.senderName}</span>
                              {message.senderRole && (
                                <Badge variant="secondary" className="text-xs h-5">
                                  {message.senderRole}
                                </Badge>
                              )}
                              <span className="text-xs text-muted-foreground">
                                {formatMessageTime(message.createdAt)}
                              </span>
                            </div>

                            {message.replyTo && (
                              <div className="mb-2 p-2 border-l-2 border-primary bg-accent/30 rounded text-sm">
                                <span className="text-muted-foreground text-xs">
                                  Replying to {message.replyTo.senderName}
                                </span>
                                <p className="text-muted-foreground truncate">
                                  {message.replyTo.content}
                                </p>
                              </div>
                            )}

                            <p className="text-sm break-words">{message.content}</p>

                            {message.attachments && message.attachments.length > 0 && (
                              <div className="mt-2 space-y-2">
                                {message.attachments.map((attachment) => (
                                  <div key={attachment.id}>
                                    {attachment.type === 'image' ? (
                                      <img
                                        src={attachment.url}
                                        alt={attachment.name}
                                        className="rounded-lg max-w-sm cursor-pointer hover:opacity-90 transition"
                                      />
                                    ) : (
                                      <div className="flex items-center gap-2 p-2 border rounded-lg max-w-sm">
                                        <Paperclip className="h-4 w-4 text-muted-foreground" />
                                        <div className="flex-1 min-w-0">
                                          <p className="text-sm font-medium truncate">{attachment.name}</p>
                                          <p className="text-xs text-muted-foreground">
                                            {(attachment.size / 1024).toFixed(1)} KB
                                          </p>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}

                            {message.reactions.length > 0 && (
                              <div className="flex gap-1 mt-2">
                                {message.reactions.map((reaction, idx) => (
                                  <button
                                    key={idx}
                                    className="px-2 py-1 bg-accent/50 hover:bg-accent rounded-full text-sm flex items-center gap-1"
                                  >
                                    <span>{reaction.emoji}</span>
                                    <span className="text-xs">{reaction.count}</span>
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>

              {/* Message Input */}
              <div className="border-t p-4">
                <div className="flex items-end gap-2">
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" className="shrink-0">
                      <Paperclip className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="shrink-0">
                      <ImageIcon className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="shrink-0">
                      <Smile className="h-4 w-4" />
                    </Button>
                  </div>

                  <Textarea
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    className="flex-1 min-h-[44px] max-h-32 resize-none"
                    rows={1}
                  />

                  <Button 
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    className="shrink-0"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Press Enter to send, Shift + Enter for new line
                </p>
              </div>
            </Card>
          ) : (
            <Card className="h-full flex items-center justify-center">
              <CardContent className="text-center">
                <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold mb-2">No chat selected</h3>
                <p className="text-sm text-muted-foreground">
                  Select a conversation from the list to start chatting
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}