import Sidebar from '../components/Sidebar';
import ustpLogo from '../../assets/ustp-things-logo.png';
import userAvatar from '../../assets/ustp thingS/Person.png';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Sample messages data
const messages = [
  {
    id: 1,
    sender: 'Galdo Boutique',
    lastMessage: 'Your order is ready for pickup!',
    time: '10:30 AM',
    avatar: userAvatar,
  },
  {
    id: 2,
    sender: 'USTP Bookstore',
    lastMessage: 'Thank you for your purchase!',
    time: 'Yesterday',
    avatar: userAvatar,
  },
  {
    id: 3,
    sender: 'Campus Supplies',
    lastMessage: 'Your items are in stock now.',
    time: '2 days ago',
    avatar: userAvatar,
  },
];

export default function Messages() {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  // Sidebar navigation handler
  const handleSidebarNav = (view: 'home' | 'likes' | 'recently' | 'pickup') => {
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
      case 'pickup':
        navigate('/dashboard/pickup');
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
          onPickUpClick={() => handleSidebarNav('pickup')}
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
        {/* Messages List */}
        <div className="flex-1 p-10">
          <div className="space-y-6">
            {messages.map((message) => (
              <div key={message.id} className="bg-white rounded-2xl shadow p-6">
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
        </div>
      </main>
    </div>
  );
} 