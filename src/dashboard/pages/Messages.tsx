import Sidebar from '../components/Sidebar';
import ustpLogo from '../../assets/ustp-things-logo.png';
import userAvatar from '../../assets/ustp thingS/Person.png';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import homeLogo from "../../assets/ustp thingS/Home.png";
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, where, getDocs, doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../lib/firebase';
import React from 'react';

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: any;
  sender: string;
}

interface ChatRoom {
  id: string;
  participants: string[];
  lastMessage: string;
  lastMessageTime: any;
  sellerName: string;
  sellerAvatar: string;
}

// Dummy seller data
const DUMMY_SELLER = {
  id: 'seller123',
  name: 'Galdo Boutique',
  avatar: userAvatar
};

// Chat component for individual conversations
function ChatWindow({ sellerId, sellerName }: { sellerId: string; sellerName: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!auth.currentUser) return;

    setLoading(true);
    console.log("Setting up message listener for chat between:", auth.currentUser.uid, "and", sellerId);

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
        // Only include messages between the current user and this seller
        if ((data.senderId === auth.currentUser?.uid && data.receiverId === sellerId) ||
            (data.senderId === sellerId && data.receiverId === auth.currentUser?.uid)) {
          fetchedMessages.push({
            id: doc.id,
            ...data,
          } as Message);
        }
      });
      console.log("Fetched messages:", fetchedMessages.length);
      setMessages(fetchedMessages);
      setLoading(false);
      scrollToBottom();
    }, (error) => {
      console.error("Error fetching messages:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [sellerId]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !auth.currentUser) return;

    try {
      console.log("Sending message to:", sellerId);
      const messageData = {
        text: newMessage,
        senderId: auth.currentUser.uid,
        receiverId: sellerId,
        sender: auth.currentUser.email,
        timestamp: serverTimestamp(),
        participants: [auth.currentUser.uid, sellerId]
      };

      // Add the message
      const messageRef = await addDoc(collection(db, 'messages'), messageData);
      console.log("Message sent with ID:", messageRef.id);

      // Update chat room
      const chatRoomRef = collection(db, 'chatRooms');
      const q = query(
        chatRoomRef,
        where('participants', 'array-contains', auth.currentUser.uid)
      );
      const snapshot = await getDocs(q);

      let chatRoomId: string | null = null;
      snapshot.forEach((doc) => {
        const data = doc.data();
        if (data.participants.includes(sellerId)) {
          chatRoomId = doc.id;
        }
      });

      if (chatRoomId) {
        // Update existing chat room
        const docRef = doc(db, 'chatRooms', chatRoomId);
        await setDoc(docRef, {
          lastMessage: newMessage,
          lastMessageTime: serverTimestamp()
        }, { merge: true });
      } else {
        // Create new chat room
        await addDoc(chatRoomRef, {
          participants: [auth.currentUser.uid, sellerId],
          lastMessage: newMessage,
          lastMessageTime: serverTimestamp(),
          sellerName: sellerName,
          sellerAvatar: DUMMY_SELLER.avatar
        });
      }

      setNewMessage('');
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F88379]"></div>
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
                  <p className="break-words">{message.text}</p>
                  <span className="text-xs opacity-75 block mt-1">
                    {message.timestamp?.toDate().toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))}
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
            onChange={(e) => setNewMessage(e.target.value)}
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
  const [loading, setLoading] = useState(true);
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

        // First, check if there are any existing chat rooms
        const snapshot = await getDocs(q);
        console.log("Found chat rooms:", snapshot.size);

        if (snapshot.empty && !chatRooms.some(room => room.participants.includes(DUMMY_SELLER.id))) {
          // If no chat rooms exist, create one with the dummy seller
          console.log("Creating initial chat room with dummy seller");
          const newChatRoom = {
            participants: [auth.currentUser.uid, DUMMY_SELLER.id],
            lastMessage: "Start a conversation!",
            lastMessageTime: serverTimestamp(),
            sellerName: DUMMY_SELLER.name,
            sellerAvatar: DUMMY_SELLER.avatar
          };

          await addDoc(chatRoomsRef, newChatRoom);
        }

        // Set up real-time listener
        const unsubscribe = onSnapshot(q, (snapshot) => {
          const rooms: ChatRoom[] = [];
          snapshot.forEach((doc) => {
            const data = doc.data();
            rooms.push({
              id: doc.id,
              participants: data.participants || [],
              lastMessage: data.lastMessage || "",
              lastMessageTime: data.lastMessageTime,
              sellerName: data.sellerName || "Unknown Seller",
              sellerAvatar: data.sellerAvatar || userAvatar
            } as ChatRoom);
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

  // Start new chat with dummy seller
  const startDummyChat = async () => {
    if (!auth.currentUser) {
      console.log("No authenticated user found");
      return;
    }

    try {
      setLoading(true);
      
      // Create a new chat room
      const chatRoomRef = collection(db, 'chatRooms');
      await addDoc(chatRoomRef, {
        participants: [auth.currentUser.uid, DUMMY_SELLER.id],
        lastMessage: "Start a conversation!",
        lastMessageTime: serverTimestamp(),
        sellerName: DUMMY_SELLER.name,
        sellerAvatar: DUMMY_SELLER.avatar
      });

      navigate(`/dashboard/messages/${DUMMY_SELLER.name.replace(/\s+/g, '-').toLowerCase()}`);
    } catch (err) {
      console.error("Error starting dummy chat:", err);
      setError("Failed to start conversation. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F88379]"></div>
          <div className="text-gray-500">Loading conversations...</div>
        </div>
      ) : chatRooms.length === 0 ? (
        <div className="text-center">
          <p className="text-gray-500 mb-4">No conversations yet</p>
          <button
            onClick={startDummyChat}
            className="bg-[#F88379] text-white px-4 py-2 rounded-lg hover:bg-[#f96d62] transition"
          >
            Start Chat with {DUMMY_SELLER.name}
          </button>
        </div>
      ) : (
        chatRooms.map((room) => (
          <div 
            key={room.id} 
            className="bg-white rounded-xl p-4 shadow cursor-pointer hover:shadow-md transition"
            onClick={() => navigate(`/dashboard/messages/${room.sellerName.replace(/\s+/g, '-').toLowerCase()}`)}
          >
            <div className="flex items-center gap-4">
              <img src={room.sellerAvatar} alt={room.sellerName} className="w-16 h-16 rounded-full object-cover" />
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-semibold text-gray-800">{room.sellerName}</h3>
                  <span className="text-sm text-gray-500">
                    {room.lastMessageTime?.toDate()?.toLocaleString() || 'Just now'}
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
  const { sellerId } = useParams();
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
              Chat with {DUMMY_SELLER.name}
            </h1>
          </div>
        </header>
        <ChatWindow sellerId={DUMMY_SELLER.id} sellerName={DUMMY_SELLER.name} />
      </main>
    </div>
  );
}

// Main Messages page component
export default function Messages() {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const { sellerId } = useParams();

  if (sellerId) {
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

type BlockedUsersProps = {
  onSettingsClick: () => void;
};

export function BlockedUsers({ onSettingsClick }: BlockedUsersProps) {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: "100vh", background: "#fff" }}>
      {/* Header */}
      <div
        style={{
          background: "#fff",
          display: "flex",
          alignItems: "center",
          height: 72,
          paddingLeft: 55,
          paddingRight: 24,
          gap: 18,
          borderBottom: "1px solid #ccc",
          boxShadow: "0 2px 4px 0 rgba(0,0,0,0.04)",
        }}
      >
        <img
          src={homeLogo}
          alt="Home Icon"
          className="h-7 w-auto"
          style={{ cursor: "pointer" }}
          onClick={() => navigate('/dashboard')}
        />
        <div
          style={{
            width: 2,
            height: 36,
            background: "#F48C8C",
            marginLeft: 18,
            marginRight: 18,
          }}
        />
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span
            className="text-3xl font-bold"
            style={{ color: "#F88379", opacity: 0.63, cursor: "pointer" }}
            onClick={onSettingsClick}
          >
            Settings
          </span>
          <span
            className="text-3xl font-bold"
            style={{ color: "#F88379", opacity: 0.63 }}
          >
            &gt;
          </span>
          <span className="text-3xl font-bold" style={{ color: "#F88379" }}>
            Blocked Users
          </span>
        </div>
      </div>
      {/* Main content */}
      <div style={{ paddingTop: 32, paddingLeft: 24, paddingRight: 24, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ marginTop: 60, textAlign: "center" }}>
          <img
            src={require("../../assets/ustp thingS/BlockedUsers.png")}
            alt="Blocked Users"
            style={{ width: 60, height: 60, margin: "0 auto", opacity: 0.5 }}
          />
          <div style={{ color: "#F88379", fontWeight: 600, marginTop: 8 }}>
            No blocked user yet
          </div>
        </div>
      </div>
    </div>
  );
} 