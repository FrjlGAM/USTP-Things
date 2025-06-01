import { useState, useEffect, useCallback, useRef } from 'react';
import { doc, onSnapshot, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../../lib/firebase';

export const useTypingIndicator = (chatRoomId: string, userId: string) => {
  const [isTyping, setIsTyping] = useState<{[userId: string]: boolean}>({});
  const typingTimeoutRef = useRef<NodeJS.Timeout>();
  const currentUser = auth.currentUser;

  // Listen for typing status changes
  useEffect(() => {
    if (!chatRoomId) return;

    const typingRef = doc(db, 'typing', chatRoomId);
    const unsubscribe = onSnapshot(typingRef, (doc) => {
      const data = doc.data();
      if (data) {
        // Remove current user from the typing indicators
        const othersTyping = Object.entries(data)
          .filter(([id]) => id !== currentUser?.uid)
          .reduce((acc, [id, value]) => ({
            ...acc,
            [id]: value,
          }), {});
        
        setIsTyping(othersTyping);
      }
    });

    return () => unsubscribe();
  }, [chatRoomId, currentUser?.uid]);

  // Set typing status
  const setTyping = useCallback(async (isUserTyping: boolean) => {
    if (!chatRoomId || !currentUser) return;

    // Clear any existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    const typingRef = doc(db, 'typing', chatRoomId);
    
    if (isUserTyping) {
      // Set typing status to true
      await updateDoc(typingRef, {
        [currentUser.uid]: true,
        lastUpdated: serverTimestamp(),
      }, { merge: true });

      // Set a timeout to automatically set typing to false after 3 seconds
      typingTimeoutRef.current = setTimeout(async () => {
        await updateDoc(typingRef, {
          [currentUser.uid]: false,
          lastUpdated: serverTimestamp(),
        }, { merge: true });
      }, 3000);
    } else {
      // Immediately set typing to false
      await updateDoc(typingRef, {
        [currentUser.uid]: false,
        lastUpdated: serverTimestamp(),
      }, { merge: true });
    }
  }, [chatRoomId, currentUser]);

  // Clean up timeouts on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  // Check if anyone is typing
  const isAnyoneTyping = Object.values(isTyping).some(status => status === true);
  const typingUserIds = Object.entries(isTyping)
    .filter(([_, status]) => status === true)
    .map(([userId]) => userId);

  return {
    isTyping,
    setTyping,
    isAnyoneTyping,
    typingUserIds,
  };
};

export default useTypingIndicator;
