import { Timestamp } from 'firebase/firestore';

export type MessageStatus = 'sent' | 'delivered' | 'read';
export type MessageType = 'text' | 'image' | 'file';

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: Timestamp;
  sender: string;
  status: MessageStatus;
  type: MessageType;
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  fileType?: string;
}

export interface ChatRoom {
  id: string;
  participants: string[];
  lastMessage: string;
  lastMessageTime: Timestamp;
  lastMessageSenderId?: string;
  sellerName: string;
  sellerAvatar: string;
  sellerId: string;
  customerId: string;
  customerName: string;
  customerAvatar: string;
  isTyping?: boolean;
  unreadCount?: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface User {
  id: string;
  displayName: string;
  photoURL: string;
  email: string;
  lastSeen: Timestamp;
  isOnline: boolean;
}

export interface TypingStatus {
  userId: string;
  chatRoomId: string;
  isTyping: boolean;
  lastTypingTime: Timestamp;
}

export interface MessageData {
  id: string;
  text: string;
  senderId: string;
  receiverId: string;
  timestamp: Timestamp;
  status: MessageStatus;
  type: MessageType;
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  fileType?: string;
}

export interface ChatRoomData {
  participants: string[];
  lastMessage: string;
  lastMessageTime: Timestamp;
  lastMessageSenderId?: string;
  sellerName: string;
  sellerAvatar: string;
  sellerId: string;
  customerId: string;
  customerName: string;
  customerAvatar: string;
  unreadCount: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
