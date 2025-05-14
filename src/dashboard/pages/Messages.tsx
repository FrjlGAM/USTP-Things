import Sidebar from '../components/Sidebar';
import ustpLogo from '../../assets/ustp-things-logo.png';
import userAvatar from '../../assets/ustp thingS/Person.png';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import homeLogo from "../../assets/ustp thingS/Home.png";

// Sample messages data
const messages = [
  {
    id: 1,
    sender: 'Galdo Boutique',
    lastMessage: 'Your order is ready for pickup!',
    time: '10:30 AM',
    avatar: userAvatar,
    product: {
      id: '1',
      name: 'Uniform Set USTP (Female)',
      price: '₱1,000',
      image: userAvatar,
      description: 'Complete USTP uniform set for female students',
      category: 'Uniform'
    }
  },
  {
    id: 2,
    sender: 'USTP Bookstore',
    lastMessage: 'Thank you for your purchase!',
    time: 'Yesterday',
    avatar: userAvatar,
    product: {
      id: '2',
      name: 'USTP Notebook',
      price: '₱50',
      image: userAvatar,
      description: 'Official USTP notebook',
      category: 'School Supplies'
    }
  },
  {
    id: 3,
    sender: 'Campus Supplies',
    lastMessage: 'Your items are in stock now.',
    time: '2 days ago',
    avatar: userAvatar,
    product: {
      id: '3',
      name: 'USTP ID Lace',
      price: '₱30',
      image: userAvatar,
      description: 'Official USTP ID lace',
      category: 'Accessories'
    }
  },
];

interface Message {
  id: number;
  sender: string;
  lastMessage: string;
  time: string;
  avatar: string;
  product: {
    id: string;
    name: string;
    price: string;
    image: string;
    description: string;
    category: string;
  };
}

// Content component that can be used both standalone and embedded
export function MessagesContent() {
  const navigate = useNavigate();

  const handleMessageClick = (message: Message) => {
    navigate(`/dashboard/messages/${message.sender.replace(/\s+/g, '-').toLowerCase()}`);
  };

  return (
    <div className="space-y-4 p-10">
      {messages.map((message: Message) => (
        <div 
          key={message.id} 
          className="bg-white rounded-xl p-4 shadow cursor-pointer hover:shadow-md transition"
          onClick={() => handleMessageClick(message)}
        >
          <div className="flex items-center gap-4">
            <img src={message.avatar} alt={message.sender} className="w-16 h-16 rounded-full object-cover" />
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-semibold text-gray-800">{message.sender}</h3>
                <span className="text-sm text-gray-500">{message.time}</span>
              </div>
              <p className="text-gray-600 mt-1">{message.lastMessage}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Main Messages page component
export default function Messages() {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  // Sidebar navigation handler
  const handleSidebarNav = (view: 'home' | 'likes' | 'recently' | 'orders' | 'to-rate' | 'messages') => {
    switch (view) {
      case 'home':
        navigate('/dashboard');
        break;
      case 'likes':
        navigate('/dashboard/likes');
        break;
      case 'recently':
        navigate('/dashboard/recently-viewed');
        break;
      case 'orders':
        navigate('/dashboard/orders');
        break;
      case 'to-rate':
        navigate('/dashboard/to-rate');
        break;
      case 'messages':
        navigate('/dashboard/messages');
        break;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f7f6fd]">
      {/* Sidebar */}
      <div className="w-[348px] flex-shrink-0">
        <Sidebar
          onVerifyClick={() => setShowModal(true)}
          onHomeClick={() => handleSidebarNav('home')}
          onLikesClick={() => handleSidebarNav('likes')}
          onRecentlyClick={() => handleSidebarNav('recently')}
          onOrdersClick={() => handleSidebarNav('orders')}
          onRateClick={() => handleSidebarNav('to-rate')}
          onMessageClick={() => handleSidebarNav('messages')}
          activeButton="messages"
        />
      </div>
      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
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