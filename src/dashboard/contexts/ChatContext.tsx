import { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import { useChatRooms } from '../hooks/useChatRooms';
import type { ChatRoom } from '../types/message.types';

interface ChatContextType {
  selectedChatRoomId: string | null;
  setSelectedChatRoomId: (id: string | null) => void;
  chatRooms: ChatRoom[];
  loading: boolean;
  error: Error | null;
  getOrCreateChatRoom: (sellerId: string, customerId: string) => Promise<any>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedChatRoomId, setSelectedChatRoomId] = useState<string | null>(null);
  const { 
    chatRooms, 
    loading, 
    error, 
    getOrCreateChatRoom: fetchOrCreateChatRoom 
  } = useChatRooms();

  // Wrapper function to update the selected chat room after creation
  const getOrCreateChatRoom = useCallback(async (sellerId: string, customerId: string) => {
    const chatRoom = await fetchOrCreateChatRoom(sellerId, customerId);
    setSelectedChatRoomId(chatRoom.id);
    return chatRoom;
  }, [fetchOrCreateChatRoom]);

  return (
    <ChatContext.Provider 
      value={{
        selectedChatRoomId,
        setSelectedChatRoomId,
        chatRooms,
        loading,
        error,
        getOrCreateChatRoom,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = (): ChatContextType => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

export default ChatContext;
