import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  addDoc, 
  serverTimestamp, 
  getDoc,
  getDocs, 
  doc, 
  setDoc, 
  where, 
  increment,
  DocumentData,
  DocumentSnapshot,
  QuerySnapshot,
  Unsubscribe,
  updateDoc,
  Timestamp, 
  FieldValue
} from 'firebase/firestore';
import { auth, db } from '../../lib/firebase';
import userAvatar from '../../assets/ustp thingS/Person.png';

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: Timestamp;
  sender: string;
  status: 'sent' | 'delivered' | 'read';
  type: 'text' | 'image' | 'file';
  fileUrl?: string;
  fileName?: string;
}

interface ChatRoom {
  id: string;
  participants: string[];
  lastMessage: string;
  lastMessageTime: Timestamp;
  sellerName: string;
  sellerAvatar: string;
  isTyping?: boolean;
  unreadCount?: number;
  sellerId?: string;
}

// Helper function to safely format timestamp
const formatTimestamp = (timestamp: Timestamp | FieldValue | undefined, timeOnly: boolean = false): string => {
  if (!timestamp) return timeOnly ? 'Now' : 'Just now';
  
  try {
    // If it's a server timestamp that hasn't been resolved yet
    if (typeof timestamp === 'object' && timestamp !== null && 'isEqual' in timestamp) {
      const ts = timestamp as Timestamp;
      const date = ts.toDate();
      return timeOnly ? date.toLocaleTimeString() : date.toLocaleString();
    }
    
    // If it's a FieldValue (like serverTimestamp())
    if (typeof timestamp === 'object' && timestamp !== null) {
      return timeOnly ? 'Now' : 'Just now';
    }
    
    return timeOnly ? 'Now' : 'Just now';
  } catch (error) {
    console.error('Error formatting timestamp:', error);
    return timeOnly ? 'Now' : 'Just now';
  }
};

// Chat component for individual conversations
function ChatWindow({ userId }: { userId: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const unsubscribeRef = useRef<Unsubscribe>();
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [otherUserName, setOtherUserName] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout>>();

  // Debugging logs
  useEffect(() => {
    console.log('[ChatWindow] Current user UID:', auth.currentUser?.uid);
    console.log('[ChatWindow] userId from URL:', userId);
  }, [userId, auth.currentUser]);

  // Fetch other user's username
  useEffect(() => {
    if (!userId) return;
    const fetchUsername = async (): Promise<void> => {
      try {
        const userDoc = await getDoc(doc(db, 'users', userId));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setOtherUserName(userData.username || userData.name || 'Unknown User');
        } else {
          setOtherUserName('Unknown User');
        }
      } catch (err) {
        setOtherUserName('Unknown User');
      }
    };
    fetchUsername();
  }, [userId]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle typing indicator
  const handleTyping = useCallback((): void => {
    // Clear any existing timeout
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    
    // Set a new timeout to indicate typing has stopped
    const timeout = setTimeout(() => {
      // Update typing status in Firestore
      const chatRoomRef = collection(db, 'chatRooms');
      const q = query(
        chatRoomRef,
        where('participants', 'array-contains', auth.currentUser?.uid)
      );
      
      getDocs(q).then((snapshot) => {
        snapshot.forEach((doc) => {
          updateDoc(doc.ref, { isTyping: false });
        });
      });
      
      setIsTyping(false);
    }, 1500);
    
    typingTimeoutRef.current = timeout;
    
    // Update typing status in Firestore
    const chatRoomRef = collection(db, 'chatRooms');
    const q = query(
      chatRoomRef,
      where('participants', 'array-contains', auth.currentUser?.uid)
    );
    
    getDocs(q).then((snapshot) => {
      snapshot.forEach((doc) => {
        updateDoc(doc.ref, { isTyping: true });
      });
    });
    
    setIsTyping(true);
  }, [typingTimeoutRef]);

  useEffect(() => {
    if (!auth.currentUser) return;
    setLoading(true);
    setError(null);

    try {
      // Query messages for this specific chat
      const messagesRef = collection(db, 'messages');
      const q = query(
        messagesRef,
        where('participants', 'array-contains', auth.currentUser.uid),
        orderBy('timestamp', 'asc')
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const fetchedMessages: Message[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          // Only include messages between the current user and this user
          if ((data.senderId === auth.currentUser?.uid && data.receiverId === userId) ||
              (data.senderId === userId && data.receiverId === auth.currentUser?.uid)) {
            fetchedMessages.push({
              id: doc.id,
              ...data,
              status: data.status || 'sent',
              type: data.type || 'text'
            } as Message);
          }
        });
        console.log('[ChatWindow] Fetched messages:', fetchedMessages);
        setMessages(fetchedMessages);
        setLoading(false);
        scrollToBottom();

        // Mark messages as read
        const unreadMessages = fetchedMessages.filter(
          msg => msg.senderId === userId && msg.status !== 'read'
        );
        if (unreadMessages.length > 0) {
          unreadMessages.forEach(msg => {
            const messageRef = doc(db, 'messages', msg.id);
            setDoc(messageRef, { status: 'read' }, { merge: true });
          });
        }
      }, (error) => {
        console.error('Error fetching messages:', error);
        setError('Failed to load messages. Please try again.');
        setLoading(false);
      });

      unsubscribeRef.current = unsubscribe;
    } catch (err) {
      console.error('Error in message listener:', err);
      setError('Failed to load messages. Please try again.');
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      if (unsubscribeRef.current) unsubscribeRef.current();
    };
  }, [typingTimeoutRef]);

  // Warn if userId is not a UID (simple check: UIDs are usually 28 chars, not all lowercase)
  useEffect(() => {
    if (userId && userId.length < 20) {
      console.warn('[ChatWindow] WARNING: userId from URL does not look like a Firebase UID:', userId);
    }
  }, [userId]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!newMessage.trim() || !auth.currentUser) return;

    try {
      const messageData: Omit<Message, 'id'> = {
        senderId: auth.currentUser.uid,
        receiverId: userId,
        text: newMessage,
        timestamp: serverTimestampFn() as unknown as Timestamp, // Type assertion needed
        sender: auth.currentUser.displayName || 'Anonymous',
        status: 'sent',
        type: 'text'
      };

      const messageRef = await addDoc(collection(db, 'messages'), messageData);
      
      // Update message status to delivered
      setTimeout(() => {
        setDoc(doc(db, 'messages', messageRef.id), { status: 'delivered' }, { merge: true });
      }, 1000);

      // Update or create chat room
      const chatRoomRef = collection(db, 'chatRooms');
      const q = query(
        chatRoomRef,
        where('participants', 'array-contains', auth.currentUser.uid)
      );
      const snapshot = await getDocs(q);
      let chatRoomId: string | null = null;
      snapshot.forEach((doc) => {
        const data = doc.data();
        if (data.participants.includes(userId)) {
          chatRoomId = doc.id;
        }
      });

      if (chatRoomId) {
        const docRef = doc(db, 'chatRooms', chatRoomId);
        await setDoc(docRef, {
          lastMessage: newMessage,
          lastMessageTime: serverTimestamp(),
          unreadCount: increment(1)
        }, { merge: true });
      } else {
        await addDoc(chatRoomRef, {
          participants: [auth.currentUser.uid, userId],
          lastMessage: newMessage,
          lastMessageTime: serverTimestamp(),
          unreadCount: 1
        });
      }

      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Failed to send message. Please try again.');
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat header with username */}
      <div className="flex items-center gap-4 px-8 py-4 bg-white shadow-md">
        <h2 className="text-xl font-bold text-[#F88379]">Chat with</h2>
        <span className="ml-2 text-lg text-gray-700 font-semibold">{otherUserName}</span>
      </div>
      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <p className="text-gray-500">Loading...</p>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center h-full">
            <p className="text-red-500">{error}</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            No messages yet. Start the conversation!
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.senderId === auth.currentUser?.uid ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[70%] rounded-lg p-3 ${
                    message.senderId === auth.currentUser?.uid
                      ? 'bg-[#F88379] text-white'
                      : 'bg-gray-200 text-gray-800'
                  }`}
                >
                  {message.type === 'text' ? (
                    <p className="break-words">{message.text}</p>
                  ) : message.type === 'image' ? (
                    <img src={message.fileUrl} alt="Shared image" className="max-w-full rounded-lg" />
                  ) : (
                    <a
                      href={message.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-blue-500 hover:underline"
                    >
                      <span>📎</span>
                      <span>{message.fileName}</span>
                    </a>
                  )}
                  <div className="flex items-center justify-end gap-1 mt-1">
                    <span className="text-xs opacity-75">
                      {formatTimestamp(message.timestamp, true)}
                    </span>
                    {message.senderId === auth.currentUser?.uid && (
                      <span className="text-xs">
                        {message.status === 'read' ? '✓✓' : message.status === 'delivered' ? '✓✓' : '✓'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-200 text-gray-800 rounded-lg p-3">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" />
                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-100" />
                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-200" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Message input */}
      <form onSubmit={sendMessage} className="p-4 border-t bg-white">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => {
              setNewMessage(e.target.value);
              handleTyping();
            }}
            placeholder="Type a message..."
            className="flex-1 p-2 border rounded-lg focus:outline-none focus:border-[#F88379]"
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                if (newMessage.trim()) {
                  sendMessage(e);
                }
              }
            }}
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className={`px-4 py-2 rounded-lg transition ${
              newMessage.trim()
                ? 'bg-[#F88379] text-white hover:bg-[#f96d62]'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}

// Content component that can be used both standalone and embedded
export function MessagesContent() {
  const navigate = useNavigate();
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchChatRooms() {
      setLoading(true);
      setError(null);

      try {
        if (!auth.currentUser) {
          console.log("No authenticated user found");
          setLoading(false);
          return;
        }

        console.log("Fetching chat rooms for user:", auth.currentUser.uid);

        const chatRoomsRef = collection(db, 'chatRooms');
        const q = query(
          chatRoomsRef,
          where('participants', 'array-contains', auth.currentUser.uid)
        );

        // Set up real-time listener
        const unsubscribe: Unsubscribe = onSnapshot(q, (snapshot: QuerySnapshot<DocumentData>) => {
          const rooms: ChatRoom[] = [];
          snapshot.forEach((doc) => {
            const data = doc.data() as DocumentData;
            // Only include rooms where the current user is the customer
            if (data.sellerId && data.sellerId !== auth.currentUser?.uid) {
              rooms.push({
                id: doc.id,
                participants: data.participants || [],
                lastMessage: data.lastMessage || "",
                lastMessageTime: data.lastMessageTime,
                sellerName: data.sellerName || "Unknown Seller",
                sellerAvatar: data.sellerAvatar || userAvatar
              } as ChatRoom);
            }
          });
          console.log("Updated chat rooms:", rooms);
          setChatRooms(rooms);
          setLoading(false);
        }, (error) => {
          console.error("Error fetching chat rooms:", error);
          setError("Failed to load conversations. Please try again.");
          setLoading(false);
        });

        return () => unsubscribe();
      } catch (err) {
        console.error("Error in fetchChatRooms:", err);
        setError("Failed to load conversations. Please try again.");
        setLoading(false);
      }
    }

    fetchChatRooms();
  }, []);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-10 space-y-4">
        <div className="text-red-500">{error}</div>
        <button
          onClick={() => window.location.reload()}
          className="bg-[#F88379] text-white px-4 py-2 rounded-lg hover:bg-[#f96d62] transition"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-10">
      {loading ? (
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="text-gray-500">Loading conversations...</div>
        </div>
      ) : chatRooms.length === 0 ? (
        <div className="text-center">
          <p className="text-gray-500 mb-4">No messages from sellers yet</p>
        </div>
      ) : (
        chatRooms
          .filter(room => room.participants.every(id => typeof id === 'string' && id.length >= 20 && !id.includes(' ')))
          .map((room) => (
            <div 
              key={room.id} 
              className="bg-white rounded-xl p-4 shadow cursor-pointer hover:shadow-md transition"
              onClick={() => {
                // Find the seller's ID
                const sellerId = room.participants.find((id) => id !== auth.currentUser?.uid);
                if (sellerId) navigate(`/dashboard/messages/${sellerId}`);
              }}
            >
              <div className="flex items-center gap-4">
                <img src={room.sellerAvatar} alt={room.sellerName} className="w-16 h-16 rounded-full object-cover" />
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-semibold text-gray-800">{room.sellerName}</h3>
                    <span className="text-sm text-gray-500">
                      {formatTimestamp(room.lastMessageTime, false)}
                    </span>
                  </div>
                  <p className="text-gray-600 mt-1">{room.lastMessage}</p>
                </div>
              </div>
            </div>
          ))
      )}
    </div>
  );
}

// Individual chat page component
function ChatPage() {
  const { userId } = useParams();
  const navigate = useNavigate();
  return (
    <div className="flex min-h-screen bg-[#f7f6fd]">
      <div className="w-[348px] flex-shrink-0">
        <Sidebar
          onHomeClick={() => navigate('/dashboard')}
          onLikesClick={() => navigate('/dashboard/likes')}
          onRecentlyClick={() => navigate('/dashboard/recently')}
          onOrdersClick={() => navigate('/dashboard/orders')}
          onRateClick={() => navigate('/dashboard/to-rate')}
          onMessageClick={() => navigate('/dashboard/messages')}
          activeButton="messages"
        />
      </div>
      <main className="flex-1 flex flex-col">
        <header className="flex items-center justify-between px-8 py-4 bg-white shadow-md">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/dashboard/messages')}
              className="text-[#F88379] hover:text-[#f96d62]"
            >
              ← Back
            </button>
            <h1 className="text-2xl font-bold text-[#F88379]">
              Chat
            </h1>
          </div>
        </header>
        {userId && <ChatWindow userId={userId} />}
      </main>
    </div>
  );
}

// Main Messages page component
export default function Messages() {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const { userId } = useParams();

  if (userId) {
    return <ChatPage />;
  }

  return (
    <div className="flex min-h-screen bg-[#f7f6fd]">
      <div className="w-[348px] flex-shrink-0">
        <Sidebar
          onVerifyClick={() => setShowModal(true)}
          onHomeClick={() => navigate('/dashboard')}
          onLikesClick={() => navigate('/dashboard/likes')}
          onRecentlyClick={() => navigate('/dashboard/recently')}
          onOrdersClick={() => navigate('/dashboard/orders')}
          onRateClick={() => navigate('/dashboard/to-rate')}
          onMessageClick={() => navigate('/dashboard/messages')}
          activeButton="messages"
        />
      </div>
      <main className="flex-1 flex flex-col">
        <header className="flex items-center justify-between px-8 pr-[47px] py-4 bg-white h-[70px] w-full shadow-[0_4px_4px_0_rgba(0,0,0,0.1)]">
          <div className="flex items-center gap-4">
            <img src={ustpLogo} alt="USTP Things Logo" className="w-[117px] h-[63px] object-contain" />
            <h1 className="text-3xl font-bold text-[#F88379] pb-1">Messages</h1>
          </div>
        </header>
        <MessagesContent />
      </main>
    </div>
  );
}

interface BlockedUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  blockedAt: Date;
  reason?: string;
}

type BlockedUsersProps = {
  onSettingsClick: () => void;
};

export function BlockedUsers({ onSettingsClick }: BlockedUsersProps) {
  const navigate = useNavigate();
  const [blockedUsers, setBlockedUsers] = useState<BlockedUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch blocked users
  useEffect(() => {
    const fetchBlockedUsers = async () => {
      try {
        setLoading(true);
        // TODO: Replace with actual API call
        // const response = await fetch('/api/blocked-users');
        // const data = await response.json();
        // setBlockedUsers(data);
        
        // Mock empty data
        setTimeout(() => {
          setBlockedUsers([]);
          setLoading(false);
        }, 500);
      } catch (err) {
        console.error('Error fetching blocked users:', err);
        setError('Failed to load blocked users');
        setLoading(false);
      }
    };

    fetchBlockedUsers();
  }, []);

  const handleUnblockUser = async (userId: string) => {
    try {
      // TODO: Replace with actual API call
      // await fetch(`/api/blocked-users/${userId}`, { method: 'DELETE' });
      setBlockedUsers(prev => prev.filter(user => user.id !== userId));
    } catch (err) {
      console.error('Error unblocking user:', err);
      // Show error toast
    }
  };

  // Handle image loading errors
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    target.src = userAvatar;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#F88379]"></div>
        <p className="mt-4 text-gray-600">Loading blocked users...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 mb-4">{error}</div>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-[#F88379] text-white rounded-md hover:bg-[#e57373] transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <button 
            onClick={onSettingsClick}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Back to settings"
          >
            <svg 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              className="text-[#F88379]"
            >
              <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <h1 className="text-2xl font-bold text-gray-800">Blocked Users</h1>
        </div>
      </div>

      {blockedUsers.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm">
          <div className="mx-auto w-20 h-20 bg-[#FEE2E2] rounded-full flex items-center justify-center mb-4">
            <svg 
              width="32" 
              height="32" 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              className="text-[#F88379]"
            >
              <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No blocked users</h3>
          <p className="text-gray-500 max-w-md mx-auto">
            You haven't blocked any users. Blocked users won't be able to message you or see your profile.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <ul className="divide-y divide-gray-200">
            {blockedUsers.map((user) => (
              <li key={user.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <img
                      src={user.avatar || userAvatar}
                      alt={user.name}
                      className="w-12 h-12 rounded-full object-cover"
                      onError={handleImageError}
                      crossOrigin="anonymous"
                    />
                    <div>
                      <h3 className="font-medium text-gray-900">{user.name}</h3>
                      <p className="text-sm text-gray-500">{user.email}</p>
                      {user.reason && (
                        <p className="text-xs text-gray-400 mt-1">Reason: {user.reason}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-gray-400">
                      Blocked {new Date(user.blockedAt).toLocaleDateString()}
                    </span>
                    <button
                      onClick={() => handleUnblockUser(user.id)}
                      className="px-3 py-1.5 text-sm text-white bg-[#F88379] rounded-md hover:bg-[#e57373] transition-colors"
                    >
                      Unblock
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}