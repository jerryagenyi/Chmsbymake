/**
 * Mock Chat and Messaging Data
 */

import { ChatRoom, ChatMessage, UserPresence } from '../types/chat';

export const mockChatRooms: ChatRoom[] = [
  {
    id: 'room_001',
    organizationId: 'org_001',
    branchId: 'branch_001',
    
    name: 'General Announcements',
    description: 'Official church announcements and updates',
    type: 'announcement',
    
    iconEmoji: '📢',
    
    participantIds: ['user_001', 'user_002', 'user_003', 'user_004', 'user_005'],
    adminIds: ['user_pastor_001', 'user_admin_001'],
    
    settings: {
      isPrivate: false,
      allowFileSharing: true,
      allowMemberInvites: false,
      muteNotifications: false,
      isPinned: true,
    },
    
    lastMessage: {
      id: 'msg_050',
      content: 'Reminder: Church conference starts this Friday!',
      senderId: 'user_pastor_001',
      senderName: 'Pastor Johnson',
      timestamp: '2024-10-25T14:30:00Z',
      type: 'announcement',
    },
    
    unreadCount: 2,
    totalMessages: 145,
    
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-10-25T14:30:00Z',
    createdBy: 'user_admin_001',
  },
  {
    id: 'room_002',
    organizationId: 'org_001',
    branchId: 'branch_001',
    
    name: 'Media Ministry',
    description: 'Media team coordination and planning',
    type: 'ministry',
    
    iconEmoji: '📹',
    
    participantIds: ['user_001', 'user_006', 'user_007', 'user_008'],
    adminIds: ['user_001'],
    
    settings: {
      isPrivate: true,
      allowFileSharing: true,
      allowMemberInvites: true,
      muteNotifications: false,
      isPinned: false,
    },
    
    lastMessage: {
      id: 'msg_125',
      content: 'Can someone check the sound system before Sunday service?',
      senderId: 'user_001',
      senderName: 'Adewale Okonkwo',
      timestamp: '2024-10-25T10:15:00Z',
      type: 'text',
    },
    
    unreadCount: 5,
    totalMessages: 328,
    
    createdAt: '2024-02-01T00:00:00Z',
    updatedAt: '2024-10-25T10:15:00Z',
    createdBy: 'user_001',
  },
  {
    id: 'room_003',
    organizationId: 'org_001',
    
    name: 'All Branches',
    description: 'Communication across all church branches',
    type: 'group',
    
    iconEmoji: '🌍',
    
    participantIds: ['user_001', 'user_pastor_001', 'user_pastor_002', 'user_pastor_003'],
    adminIds: ['user_pastor_001', 'user_admin_001'],
    
    settings: {
      isPrivate: false,
      allowFileSharing: true,
      allowMemberInvites: false,
      muteNotifications: false,
      isPinned: true,
    },
    
    lastMessage: {
      id: 'msg_089',
      content: 'Abuja branch attendance was great this Sunday! 320 people present.',
      senderId: 'user_pastor_002',
      senderName: 'Pastor Emmanuel',
      timestamp: '2024-10-27T11:30:00Z',
      type: 'text',
    },
    
    unreadCount: 0,
    totalMessages: 89,
    
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-10-27T11:30:00Z',
    createdBy: 'user_admin_001',
  },
  {
    id: 'room_004',
    organizationId: 'org_001',
    branchId: 'branch_001',
    
    name: 'Youth Ministry',
    description: 'Youth fellowship and event planning',
    type: 'ministry',
    
    iconEmoji: '🎉',
    
    participantIds: ['user_010', 'user_011', 'user_012', 'user_013', 'user_014'],
    adminIds: ['user_010'],
    
    settings: {
      isPrivate: true,
      allowFileSharing: true,
      allowMemberInvites: true,
      muteNotifications: false,
      isPinned: false,
    },
    
    lastMessage: {
      id: 'msg_201',
      content: 'Who\'s bringing snacks for the youth hangout?',
      senderId: 'user_011',
      senderName: 'Grace Adebayo',
      timestamp: '2024-10-26T16:45:00Z',
      type: 'text',
    },
    
    unreadCount: 12,
    totalMessages: 567,
    
    createdAt: '2024-01-20T00:00:00Z',
    updatedAt: '2024-10-26T16:45:00Z',
    createdBy: 'user_010',
  },
  {
    id: 'room_005',
    organizationId: 'org_001',
    branchId: 'branch_001',
    
    name: 'Prayer Warriors',
    description: 'Daily prayer requests and intercession',
    type: 'group',
    
    iconEmoji: '🙏',
    
    participantIds: ['user_002', 'user_003', 'user_009', 'user_015', 'user_016'],
    adminIds: ['user_002'],
    
    settings: {
      isPrivate: true,
      allowFileSharing: false,
      allowMemberInvites: true,
      muteNotifications: false,
      isPinned: false,
    },
    
    lastMessage: {
      id: 'msg_432',
      content: 'Please pray for Sister Mary\'s healing. She was admitted to the hospital.',
      senderId: 'user_003',
      senderName: 'Chioma Eze',
      timestamp: '2024-10-27T08:20:00Z',
      type: 'text',
    },
    
    unreadCount: 3,
    totalMessages: 892,
    
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: '2024-10-27T08:20:00Z',
    createdBy: 'user_002',
  },
  {
    id: 'room_006',
    organizationId: 'org_001',
    branchId: 'branch_001',
    
    name: 'Event Planning Committee',
    description: 'Church conference and event coordination',
    type: 'department',
    
    iconEmoji: '📅',
    
    participantIds: ['user_001', 'user_004', 'user_006', 'user_017'],
    adminIds: ['user_004'],
    
    settings: {
      isPrivate: true,
      allowFileSharing: true,
      allowMemberInvites: true,
      muteNotifications: false,
      isPinned: false,
    },
    
    lastMessage: {
      id: 'msg_156',
      content: 'Conference venue is confirmed. Let\'s finalize the schedule.',
      senderId: 'user_004',
      senderName: 'Funmi Adeleke',
      timestamp: '2024-10-24T15:10:00Z',
      type: 'text',
    },
    
    unreadCount: 0,
    totalMessages: 234,
    
    createdAt: '2024-03-01T00:00:00Z',
    updatedAt: '2024-10-24T15:10:00Z',
    createdBy: 'user_004',
  },
];

export const mockChatMessages: ChatMessage[] = [
  // General Announcements Room
  {
    id: 'msg_048',
    roomId: 'room_001',
    
    senderId: 'user_pastor_001',
    senderName: 'Pastor Johnson',
    senderAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
    senderRole: 'Senior Pastor',
    
    type: 'announcement',
    content: 'Beloved congregation, we\'re excited to announce our upcoming Church Conference from Nov 15-17!',
    
    reactions: [
      { emoji: '🙏', userIds: ['user_001', 'user_002', 'user_003', 'user_004'], count: 4 },
      { emoji: '❤️', userIds: ['user_005', 'user_006'], count: 2 },
    ],
    
    isEdited: false,
    isDeleted: false,
    
    readBy: [
      { userId: 'user_001', readAt: '2024-10-25T13:10:00Z' },
      { userId: 'user_002', readAt: '2024-10-25T13:15:00Z' },
    ],
    
    metadata: {
      priority: 'high',
      tags: ['conference', 'announcement'],
    },
    
    createdAt: '2024-10-25T13:00:00Z',
    updatedAt: '2024-10-25T13:00:00Z',
  },
  {
    id: 'msg_049',
    roomId: 'room_001',
    
    senderId: 'user_001',
    senderName: 'Adewale Okonkwo',
    senderAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100',
    
    type: 'text',
    content: 'Looking forward to it! Will there be live streaming for members who can\'t attend?',
    
    replyTo: {
      messageId: 'msg_048',
      senderName: 'Pastor Johnson',
      content: 'Beloved congregation, we\'re excited to announce our upcoming Church Conference...',
    },
    
    reactions: [
      { emoji: '👍', userIds: ['user_005'], count: 1 },
    ],
    
    isEdited: false,
    isDeleted: false,
    
    readBy: [
      { userId: 'user_pastor_001', readAt: '2024-10-25T13:25:00Z' },
    ],
    
    createdAt: '2024-10-25T13:20:00Z',
    updatedAt: '2024-10-25T13:20:00Z',
  },
  {
    id: 'msg_050',
    roomId: 'room_001',
    
    senderId: 'user_pastor_001',
    senderName: 'Pastor Johnson',
    senderAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
    senderRole: 'Senior Pastor',
    
    type: 'announcement',
    content: 'Reminder: Church conference starts this Friday!',
    
    reactions: [],
    
    isEdited: false,
    isDeleted: false,
    
    readBy: [],
    
    metadata: {
      priority: 'urgent',
    },
    
    createdAt: '2024-10-25T14:30:00Z',
    updatedAt: '2024-10-25T14:30:00Z',
  },
  
  // Media Ministry Room
  {
    id: 'msg_123',
    roomId: 'room_002',
    
    senderId: 'user_006',
    senderName: 'Tunde Bakare',
    senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
    
    type: 'text',
    content: 'The new camera arrived! We can start testing it this week.',
    
    attachments: [
      {
        id: 'att_001',
        type: 'image',
        name: 'new-camera.jpg',
        url: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800',
        size: 245600,
        mimeType: 'image/jpeg',
        thumbnail: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=200',
        uploadedAt: '2024-10-25T09:00:00Z',
      },
    ],
    
    reactions: [
      { emoji: '🎉', userIds: ['user_001', 'user_007'], count: 2 },
    ],
    
    isEdited: false,
    isDeleted: false,
    
    readBy: [
      { userId: 'user_001', readAt: '2024-10-25T09:15:00Z' },
    ],
    
    createdAt: '2024-10-25T09:00:00Z',
    updatedAt: '2024-10-25T09:00:00Z',
  },
  {
    id: 'msg_124',
    roomId: 'room_002',
    
    senderId: 'user_007',
    senderName: 'Blessing Okoro',
    senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
    
    type: 'text',
    content: 'Great! I can help with testing on Thursday evening if that works.',
    
    reactions: [],
    
    isEdited: false,
    isDeleted: false,
    
    readBy: [],
    
    createdAt: '2024-10-25T09:30:00Z',
    updatedAt: '2024-10-25T09:30:00Z',
  },
  {
    id: 'msg_125',
    roomId: 'room_002',
    
    senderId: 'user_001',
    senderName: 'Adewale Okonkwo',
    senderAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100',
    
    type: 'text',
    content: 'Can someone check the sound system before Sunday service?',
    
    reactions: [],
    
    isEdited: false,
    isDeleted: false,
    
    readBy: [],
    
    metadata: {
      mentionedUserIds: ['user_006', 'user_007'],
    },
    
    createdAt: '2024-10-25T10:15:00Z',
    updatedAt: '2024-10-25T10:15:00Z',
  },
  
  // All Branches Room
  {
    id: 'msg_087',
    roomId: 'room_003',
    
    senderId: 'user_pastor_001',
    senderName: 'Pastor Johnson',
    senderAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
    senderRole: 'Senior Pastor',
    
    type: 'text',
    content: 'How was attendance across all branches this Sunday?',
    
    reactions: [],
    
    isEdited: false,
    isDeleted: false,
    
    readBy: [
      { userId: 'user_pastor_002', readAt: '2024-10-27T10:30:00Z' },
      { userId: 'user_pastor_003', readAt: '2024-10-27T10:45:00Z' },
    ],
    
    createdAt: '2024-10-27T10:00:00Z',
    updatedAt: '2024-10-27T10:00:00Z',
  },
  {
    id: 'msg_088',
    roomId: 'room_003',
    
    senderId: 'user_pastor_003',
    senderName: 'Pastor Samuel',
    senderAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100',
    senderRole: 'Branch Pastor - Accra',
    
    type: 'text',
    content: 'Accra had 150 people. Great service today!',
    
    reactions: [
      { emoji: '🙏', userIds: ['user_pastor_001'], count: 1 },
    ],
    
    isEdited: false,
    isDeleted: false,
    
    readBy: [
      { userId: 'user_pastor_001', readAt: '2024-10-27T11:00:00Z' },
    ],
    
    createdAt: '2024-10-27T11:00:00Z',
    updatedAt: '2024-10-27T11:00:00Z',
  },
  {
    id: 'msg_089',
    roomId: 'room_003',
    
    senderId: 'user_pastor_002',
    senderName: 'Pastor Emmanuel',
    senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
    senderRole: 'Branch Pastor - Abuja',
    
    type: 'text',
    content: 'Abuja branch attendance was great this Sunday! 320 people present.',
    
    reactions: [
      { emoji: '🎉', userIds: ['user_pastor_001', 'user_pastor_003'], count: 2 },
      { emoji: '🙏', userIds: ['user_001'], count: 1 },
    ],
    
    isEdited: false,
    isDeleted: false,
    
    readBy: [
      { userId: 'user_pastor_001', readAt: '2024-10-27T11:35:00Z' },
    ],
    
    createdAt: '2024-10-27T11:30:00Z',
    updatedAt: '2024-10-27T11:30:00Z',
  },
];

export const mockUserPresence: UserPresence[] = [
  {
    userId: 'user_001',
    status: 'online',
    lastSeen: '2024-10-27T12:00:00Z',
    currentRoomId: 'room_002',
  },
  {
    userId: 'user_pastor_001',
    status: 'online',
    lastSeen: '2024-10-27T12:00:00Z',
    currentRoomId: 'room_001',
  },
  {
    userId: 'user_002',
    status: 'away',
    lastSeen: '2024-10-27T10:30:00Z',
  },
  {
    userId: 'user_003',
    status: 'online',
    lastSeen: '2024-10-27T11:55:00Z',
    currentRoomId: 'room_005',
  },
  {
    userId: 'user_pastor_002',
    status: 'offline',
    lastSeen: '2024-10-27T11:30:00Z',
  },
];
