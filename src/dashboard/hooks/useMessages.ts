import { useState, useEffect, useCallback } from 'react';
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  serverTimestamp, 
  query, 
  orderBy, 
  onSnapshot, 
  where,
  getDoc,
  Timestamp
} from 'firebase/firestore';
import { db, auth } from '../../lib/firebase';
import { Message, MessageData, MessageStatus } from '../types/message.types';

export const useMessages = (chatRoomId: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [sending, setSending] = useState(false);

  // Fetch messages for the current chat room
  useEffect(() => {
    if (!chatRoomId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const messagesRef = collection(db, 'chatRooms', chatRoomId, 'messages');
    const q = query(
      messagesRef,
      orderBy('timestamp', 'asc')
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const msgs = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as Message[];
        setMessages(msgs);
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching messages:', err);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [chatRoomId]);

  // Send a new message
  const sendMessage = useCallback(async (
    text: string,
    type: 'text' | 'image' | 'file' = 'text',
    fileData?: { url: string; name: string; size: number; type: string }
  ) => {
    const currentUser = auth.currentUser;
    if (!currentUser || !chatRoomId) return null;

    setSending(true);
    try {
      const messagesRef = collection(db, 'chatRooms', chatRoomId, 'messages');
      const chatRoomRef = doc(db, 'chatRooms', chatRoomId);
      
      const messageData: Omit<MessageData, 'id'> = {
        text,
        type,
        senderId: currentUser.uid,
        receiverId: '', // Will be set based on chat room participants
        timestamp: serverTimestamp() as Timestamp,
        status: 'sent',
        ...(type !== 'text' && fileData && {
          fileUrl: fileData.url,
          fileName: fileData.name,
          fileSize: fileData.size,
          fileType: fileData.type,
        }),
      };

      // Add message to the messages subcollection
      const messageRef = await addDoc(messagesRef, messageData);
      
      // Update chat room with last message
      await updateDoc(chatRoomRef, {
        lastMessage: text,
        lastMessageTime: serverTimestamp(),
        lastMessageSenderId: currentUser.uid,
        updatedAt: serverTimestamp(),
      });

      return messageRef.id;
    } catch (err) {
      console.error('Error sending message:', err);
      setError(err as Error);
      throw err;
    } finally {
      setSending(false);
    }
  }, [chatRoomId]);

  // Update message status (e.g., delivered, read)
  const updateMessageStatus = useCallback(async (messageId: string, status: MessageStatus) => {
    if (!chatRoomId) return;
    
    try {
      const messageRef = doc(db, 'chatRooms', chatRoomId, 'messages', messageId);
      await updateDoc(messageRef, { status });
    } catch (err) {
      console.error('Error updating message status:', err);
      setError(err as Error);
    }
  }, [chatRoomId]);

  // Mark messages as read
  const markAsRead = useCallback(async (messageIds: string[]) => {
    if (!chatRoomId) return;
    
    try {
      const batch = (await import('firebase/firestore')).writeBatch(db);
      
      messageIds.forEach(messageId => {
        const messageRef = doc(db, 'chatRooms', chatRoomId, 'messages', messageId);
        batch.update(messageRef, { status: 'read' });
      });
      
      await batch.commit();
    } catch (err) {
      console.error('Error marking messages as read:', err);
      setError(err as Error);
    }
  }, [chatRoomId]);

  return {
    messages,
    loading,
    error,
    sending,
    sendMessage,
    updateMessageStatus,
    markAsRead,
  };
};

export default useMessages;
