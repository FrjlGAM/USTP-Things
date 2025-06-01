import { useState, useEffect, useCallback } from 'react';
import { collection, query, where, onSnapshot, doc, updateDoc, serverTimestamp, getDoc, setDoc } from 'firebase/firestore';
import { db, auth } from '../../lib/firebase';
import { ChatRoom, ChatRoomData } from '../types/message.types';

export const useChatRooms = () => {
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Get or create a chat room
  const getOrCreateChatRoom = useCallback(async (sellerId: string, customerId: string) => {
    try {
      setLoading(true);
      
      // Check if chat room already exists
      const chatRoomsRef = collection(db, 'chatRooms');
      const q = query(
        chatRoomsRef,
        where('participants', 'array-contains', customerId)
      );
      
      const querySnapshot = await getDocs(q);
      let chatRoom = querySnapshot.docs.find(doc => {
        const data = doc.data();
        return data.participants.includes(sellerId) && 
               data.participants.length === 2;
      });

      // If chat room doesn't exist, create a new one
      if (!chatRoom) {
        const newChatRoom: Omit<ChatRoomData, 'id'> = {
          participants: [sellerId, customerId],
          sellerId,
          customerId,
          sellerName: '', // Will be updated by the server
          sellerAvatar: '',
          customerName: '',
          customerAvatar: '',
          lastMessage: '',
          lastMessageTime: serverTimestamp(),
          unreadCount: 0,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        };
        
        const docRef = doc(collection(db, 'chatRooms'));
        await setDoc(docRef, newChatRoom);
        chatRoom = { id: docRef.id, ...newChatRoom } as any;
      }

      return chatRoom;
    } catch (err) {
      console.error('Error getting/creating chat room:', err);
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch chat rooms for the current user
  useEffect(() => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const chatRoomsRef = collection(db, 'chatRooms');
    const q = query(
      chatRoomsRef,
      where('participants', 'array-contains', currentUser.uid),
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const rooms = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as ChatRoom[];
        setChatRooms(rooms);
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching chat rooms:', err);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Update last seen
  const updateLastSeen = useCallback(async (chatRoomId: string) => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    try {
      const userChatRoomRef = doc(db, 'userChatRooms', `${currentUser.uid}_${chatRoomId}`);
      await updateDoc(userChatRoomRef, {
        lastSeen: serverTimestamp(),
      });
    } catch (err) {
      console.error('Error updating last seen:', err);
    }
  }, []);

  return {
    chatRooms,
    loading,
    error,
    getOrCreateChatRoom,
    updateLastSeen,
  };
};

export default useChatRooms;
