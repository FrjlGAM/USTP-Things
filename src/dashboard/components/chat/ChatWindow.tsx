import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useChat } from '../../contexts/ChatContext';
import { useMessages } from '../../hooks/useMessages';
import { useTypingIndicator } from '../../hooks/useTypingIndicator';
import { auth } from '../../../lib/firebase';
import type { Message } from '../../types/message.types';

interface ChatWindowProps {
  chatRoomId: string;
  onBack?: () => void;
  className?: string;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ 
  chatRoomId, 
  onBack,
  className = '' 
}) => {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentUser = auth.currentUser;
  
  const { messages, loading, error, sendMessage: sendMessageToHook, markAsRead } = useMessages(chatRoomId);
  
  const sendMessage = useCallback(async (message: Omit<Message, 'id' | 'timestamp'>) => {
    if (!chatRoomId) return;
    
    if (message.type === 'text') {
      await sendMessageToHook(message.text, 'text');
    } else if (message.type === 'image' && message.fileUrl) {
      await sendMessageToHook(
        message.text,
        'image',
        {
          url: message.fileUrl,
          name: message.fileName || 'image',
          size: message.fileSize || 0,
          type: message.fileType || 'image/jpeg'
        }
      );
    } else if (message.type === 'file' && message.fileUrl) {
      await sendMessageToHook(
        message.text,
        'file',
        {
          url: message.fileUrl,
          name: message.fileName || 'file',
          size: message.fileSize || 0,
          type: message.fileType || 'application/octet-stream'
        }
      );
    }
  }, [sendMessageToHook, chatRoomId]);
  const { chatRooms } = useChat();
  const { setTyping, isAnyoneTyping, typingUserIds } = useTypingIndicator(chatRoomId, currentUser?.uid || '');
  
  const currentChatRoom = chatRooms.find(room => room.id === chatRoomId);
  const otherUserId = currentChatRoom?.participants?.find(id => id !== currentUser?.uid) || '';
  const otherUserName = currentChatRoom?.customerId === currentUser?.uid 
    ? currentChatRoom?.sellerName || 'Seller'
    : currentChatRoom?.customerName || 'User';
  const otherUserAvatar = currentChatRoom?.customerId === currentUser?.uid 
    ? currentChatRoom?.sellerAvatar 
    : currentChatRoom?.customerAvatar;
  
  // Mark messages as read when chat is opened
  useEffect(() => {
    if (chatRoomId && currentUser?.uid) {
      markAsRead([chatRoomId]);
    }
  }, [chatRoomId, currentUser?.uid, markAsRead]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
    // Mark messages as read when opening the chat
    const unreadMessages = messages
      .filter(msg => msg.senderId !== currentUser?.uid && msg.status !== 'read')
      .map(msg => msg.id);
    
    if (unreadMessages.length > 0) {
      markAsRead(unreadMessages);
    }
  }, [messages, currentUser?.uid, markAsRead]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !currentUser || !chatRoomId) return;
    
    const newMessage: Omit<Message, 'id' | 'timestamp'> = {
      text: message.trim(),
      senderId: currentUser.uid,
      receiverId: otherUserId,
      status: 'sent',
      type: 'text',
      sender: currentUser.displayName || 'Unknown',
      fileUrl: undefined,
      fileName: undefined,
      fileSize: undefined,
      fileType: undefined
    };
    
    try {
      await sendMessage(newMessage);
      setMessage('');
      scrollToBottom();
    } catch (err) {
      console.error('Failed to send message:', err);
      // TODO: Show error to user
    }
  };

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
    if (!isTyping) {
      setTyping(true);
      setIsTyping(true);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e as any);
    }
  };

  const handleBlur = useCallback(() => {
    if (isTyping) {
      setTyping(false);
      setIsTyping(false);
    }
  }, [isTyping, setTyping]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-600">
        Error loading messages: {error.message}
      </div>
    );
  }

  const renderMessage = (msg: Message, index: number) => {
    const isMe = msg.senderId === currentUser?.uid;
    const isGrouped = index > 0 && messages[index - 1]?.senderId === msg.senderId;
    
    return (
      <div 
        key={msg.id} 
        className={`flex ${isMe ? 'justify-end' : 'justify-start'} ${!isGrouped ? 'mt-4' : 'mt-1'}`}
      >
        {!isMe && !isGrouped && (
          <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-500 font-medium mr-2">
            {msg.sender?.[0] || 'U'}
          </div>
        )}
        <div 
          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
            isMe 
              ? 'bg-blue-500 text-white rounded-br-none' 
              : 'bg-gray-100 text-gray-800 rounded-bl-none'
          } ${isGrouped ? (isMe ? 'mr-11' : 'ml-11') : ''}`}
        >
          {msg.type === 'text' ? (
            <p className="break-words">{msg.text}</p>
          ) : msg.type === 'image' && msg.fileUrl ? (
            <img 
              src={msg.fileUrl} 
              alt={msg.fileName || 'Image'} 
              className="max-w-full h-auto rounded" 
            />
          ) : msg.fileUrl ? (
            <a 
              href={msg.fileUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline flex items-center"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              {msg.fileName || 'Download file'}
            </a>
          ) : (
            <p className="break-words">[Unsupported message type]</p>
          )}
          <div className={`text-xs mt-1 flex items-center ${isMe ? 'justify-end' : 'justify-start'}`}>
            <span className={`${isMe ? 'text-blue-100' : 'text-gray-500'}`}>
              {msg.timestamp?.toDate ? 
                new Date(msg.timestamp.toDate()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 
                'Just now'}
            </span>
            {isMe && (
              <span className="ml-1">
                {msg.status === 'read' ? '✓✓' : msg.status === 'delivered' ? '✓✓' : '✓'}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* Header */}
      <div className="flex items-center p-4 border-b">
        {onBack && (
          <button 
            onClick={onBack}
            className="md:hidden mr-2 p-2 rounded-full hover:bg-gray-100"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </button>
        )}
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
            {otherUserAvatar ? (
              <img src={otherUserAvatar} alt={otherUserName} className="h-full w-full object-cover" />
            ) : (
              <span className="text-gray-500">{otherUserName?.[0]?.toUpperCase() || 'U'}</span>
            )}
          </div>
          <div>
            <h2 className="font-semibold">{otherUserName || 'User'}</h2>
            {isAnyoneTyping && typingUserIds.includes(otherUserId || '') && (
              <p className="text-xs text-gray-500">typing...</p>
            )}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            No messages yet. Say hello! 👋
          </div>
        ) : (
          messages.map((msg, index) => renderMessage(msg, index))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="border-t p-4">
        <form onSubmit={handleSendMessage} className="flex space-x-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={message}
              onChange={handleTyping}
              onKeyDown={handleKeyDown}
              onBlur={handleBlur}
              placeholder="Type a message..."
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-24"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex space-x-1">
              <button
                type="button"
                className="p-1 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                onClick={() => {}}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </button>
              <button
                type="button"
                className="p-1 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                onClick={() => {}}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                </svg>
              </button>
            </div>
          </div>
          <button 
            type="submit" 
            disabled={!message.trim()}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatWindow;
