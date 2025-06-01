import React, { useMemo } from 'react';
import { useChat } from '../../contexts/ChatContext';
import { auth } from '../../../lib/firebase';
import { formatDistanceToNow } from 'date-fns';
import type { ChatRoom } from '../../types/message.types';

interface ChatListProps {
  onSelectChat: (chatId: string) => void;
  searchQuery?: string;
  className?: string;
  selectedChatId?: string | null;
}

const ChatList: React.FC<ChatListProps> = ({ 
  onSelectChat, 
  searchQuery = '', 
  className = '',
  selectedChatId = null
}) => {
  const { chatRooms, loading, error } = useChat();
  const currentUser = auth.currentUser;

  const filteredChats = useMemo(() => {
    if (!currentUser) return [];
    
    return [...chatRooms]
      .filter((chat: ChatRoom) => {
        const searchLower = searchQuery.toLowerCase();
        const otherUser = chat.participants?.find(p => p !== currentUser.uid) || '';
        const otherUserName = chat.customerId === currentUser.uid 
          ? chat.sellerName 
          : chat.customerName || 'User';
        
        return (
          otherUser && (
            otherUserName?.toLowerCase().includes(searchLower) ||
            (chat.lastMessage?.toLowerCase().includes(searchLower) || '')
          )
        );
      })
      .sort((a: ChatRoom, b: ChatRoom) => {
        const timeA = a.lastMessageTime?.toMillis() || 0;
        const timeB = b.lastMessageTime?.toMillis() || 0;
        return timeB - timeA;
      });
  }, [chatRooms, searchQuery, currentUser]);

  if (loading) return <div className="p-4 text-center">Loading chats...</div>;
  if (error) return <div className="p-4 text-red-500">Error loading chats: {error.message}</div>;
  
  if (filteredChats.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center text-gray-500">
        <svg className="w-12 h-12 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        <h3 className="text-lg font-medium">No conversations yet</h3>
        <p className="mt-1">Start a new conversation by messaging a seller or customer</p>
      </div>
    );
  }

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* Search Bar */}
      <div className="p-4 border-b border-gray-200">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search messages..."
            value={searchQuery}
            readOnly
            className="w-full px-4 py-2 pl-10 border rounded-lg bg-gray-100 cursor-not-allowed"
            title="Search functionality coming soon"
          />
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        <ul className="divide-y">
          {filteredChats.map((chat: ChatRoom) => {
            const isUnread = (chat.unreadCount || 0) > 0;
            const lastMessageSenderIsMe = chat.lastMessageSenderId === currentUser?.uid;
            const otherUserName = chat.customerId === currentUser?.uid 
              ? chat.sellerName || 'Seller' 
              : chat.customerName || 'Customer';
            
            return (
              <li 
                key={chat.id}
                onClick={() => onSelectChat(chat.id)}
                className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                  selectedChatId === chat.id ? 'bg-blue-50' : ''
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-medium">
                      {otherUserName[0].toUpperCase()}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <h3 className={`text-sm font-medium ${isUnread ? 'text-gray-900' : 'text-gray-700'}`}>
                        {otherUserName}
                      </h3>
                      {chat.lastMessageTime && (
                        <span className="text-xs text-gray-400">
                          {formatDistanceToNow(chat.lastMessageTime.toDate(), { addSuffix: true })}
                        </span>
                      )}
                    </div>
                    <p className={`text-sm truncate ${isUnread ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
                      {lastMessageSenderIsMe && 'You: '}
                      {chat.lastMessage || 'No messages yet'}
                    </p>
                    {isUnread && (
                      <div className="mt-1">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {chat.unreadCount} unread
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default ChatList;
