import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { ChatProvider, useChat } from '../contexts/ChatContext';
import ChatWindow from '../components/chat/ChatWindow';
import ChatList from '../components/chat/ChatList';
import Sidebar from '../components/Sidebar';
import ustpLogo from '../../assets/ustp-things-logo.png';
// Simple icon components
const ArrowLeft = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="16" 
    height="16" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    className="inline-block mr-1"
  >
    <path d="M19 12H5M12 19l-7-7 7-7" />
  </svg>
);

const MessageSquare = ({ className = '' }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    className={className}
  >
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

// Main Messages Page Component with ChatProvider
const MessagesPageWithProvider: React.FC = () => {
  return (
    <ChatProvider>
      <MessagesPageContent />
    </ChatProvider>
  );
};

// Inner component that uses the chat context
const MessagesPageContent: React.FC = () => {
  const { chatRoomId } = useParams<{ chatRoomId?: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const { chatRooms, selectedChatRoomId, setSelectedChatRoomId, loading } = useChat();

  const [showChatList, setShowChatList] = useState(isDesktop);

  // Reset showChatList when location changes (e.g., when clicking browser back button)
  useEffect(() => {
    if (isDesktop) {
      setShowChatList(true);
    } else {
      setShowChatList(!chatRoomId);
    }
  }, [isDesktop, chatRoomId, location.key]);

  // Auto-select first chat on mobile if none selected
  useEffect(() => {
    if (!isDesktop && chatRooms.length > 0 && !chatRoomId) {
      const firstChatId = chatRooms[0]?.id;
      if (firstChatId) {
        navigate(`/dashboard/messages/${firstChatId}`, { replace: true });
      }
    }
  }, [isDesktop, chatRoomId, chatRooms, navigate]);

  // Update selected chat room when URL changes
  useEffect(() => {
    if (chatRoomId && chatRoomId !== selectedChatRoomId) {
      setSelectedChatRoomId(chatRoomId);
    }
  }, [chatRoomId, selectedChatRoomId, setSelectedChatRoomId]);

  const handleBackToList = useCallback(() => {
    if (!isDesktop) {
      setShowChatList(true);
    }
    setSelectedChatRoomId(null);
    navigate('/dashboard/messages');
  }, [isDesktop, navigate, setSelectedChatRoomId]);

  const handleSelectChat = useCallback((selectedId: string) => {
    if (!isDesktop) {
      setShowChatList(false);
    }
    setSelectedChatRoomId(selectedId);
    navigate(`/dashboard/messages/${selectedId}`);
  }, [isDesktop, navigate, setSelectedChatRoomId]);

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <div className="hidden md:block w-64 flex-shrink-0 border-r">
        <Sidebar
          onHomeClick={() => navigate('/dashboard')}
          onLikesClick={() => navigate('/dashboard/likes')}
          onRecentlyClick={() => navigate('/dashboard/recently-viewed')}
          onOrdersClick={() => navigate('/dashboard/orders')}
          onRateClick={() => navigate('/dashboard/to-rate')}
          onMessageClick={() => navigate('/dashboard/messages')}
          activeButton="messages"
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between p-4 border-b bg-white">
          <div className="flex items-center">
            <img src={ustpLogo} alt="USTP Things" className="h-8" />
            <h1 className="ml-3 text-xl font-semibold">Messages</h1>
          </div>
        </header>

        {/* Chat Area */}
        <div className="flex-1 flex overflow-hidden bg-gray-50">
          {/* Loading State */}
          {loading ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <>
              {/* Chat List */}
              {(isDesktop || showChatList) && (
                <div 
                  className={`${isDesktop ? 'w-80 border-r bg-white' : 'absolute inset-0 z-10 bg-white'} flex flex-col`}
                >
                  {!isDesktop && (
                    <div className="p-2 border-b">
                      <button 
                        onClick={handleBackToList}
                        className="flex items-center gap-1 px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-md"
                      >
                        <ArrowLeft />
                        <span>Back to chats</span>
                      </button>
                    </div>
                  )}
                  <ChatList 
                    onSelectChat={handleSelectChat}
                    className="flex-1 overflow-y-auto"
                  />
                </div>
              )}

              {/* Chat Window or Empty State */}
              <div className={`flex-1 flex flex-col ${!isDesktop && !showChatList ? 'flex' : 'hidden md:flex'}`}>
                {chatRoomId || selectedChatRoomId ? (
                  <ChatWindow 
                    chatRoomId={chatRoomId || selectedChatRoomId || ''} 
                    onBack={!isDesktop ? handleBackToList : undefined}
                    className="flex-1"
                  />
                ) : (
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center p-8 max-w-md">
                      <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">No chat selected</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        {chatRooms.length === 0 
                          ? 'You don\'t have any messages yet. Start a new conversation!' 
                          : 'Select a chat to start messaging'}
                      </p>
                      {chatRooms.length === 0 && (
                        <button 
                          className="mt-4 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                          onClick={() => {/* TODO: Implement new conversation */}}
                        >
                          New Message
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessagesPageWithProvider;
