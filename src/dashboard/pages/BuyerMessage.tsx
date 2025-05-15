import { useNavigate, useParams } from 'react-router-dom';
import ustpLogo from '../../assets/ustp-things-logo.png';
import sendIcon from '../../assets/ustp thingS/Send.png';
import imageIcon from '../../assets/ustp thingS/Image.png';
import cameraIcon from '../../assets/ustp thingS/Camera.png';
import Sidebar from '../components/Sidebar';
import { useState, useEffect } from 'react';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'seller';
  timestamp: Date;
}

export default function BuyerMessage() {
  const navigate = useNavigate();
  const { sellerId } = useParams();
  const [showModal, setShowModal] = useState(false);
  const [activeView, setActiveView] = useState<'home' | 'likes' | 'recently' | 'orders' | 'to-rate' | 'messages'>('messages');
  
  // Sample message for now - this would be replaced with actual messages from Firebase
  const messages: Message[] = [
    {
      id: 1,
      text: "Hi po. Naka beige top and black trousers ko po. Thnx :)",
      sender: 'user',
      timestamp: new Date()
    }
  ];

  const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: Implement send message functionality
  };

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

  const handleMessagesClick = () => {
    navigate('/dashboard/messages');
  };

  // Set initial active view
  useEffect(() => {
    setActiveView('messages');
  }, []);

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
            <div className="text-3xl font-bold pb-1">
              <span 
                className="text-[#F88379] cursor-pointer hover:underline"
                onClick={handleMessagesClick}
              >
                Messages
              </span>
              <span className="text-gray-400"> &gt; </span>
              <span className="text-[#F88379]">
                {sellerId?.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
              </span>
            </div>
          </div>
        </header>

        {/* Messages Container */}
        <div className="flex-1 flex flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-8 space-y-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`rounded-[20px] px-6 py-3 max-w-[80%] ${
                    message.sender === 'user'
                      ? 'bg-white text-gray-800 shadow-sm'
                      : 'bg-[#F88379] text-white'
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
          </div>

          {/* Message Input */}
          <div className="px-8 py-6 bg-[#f7f6fd]">
            <form onSubmit={handleSendMessage} className="flex items-center gap-4 bg-white rounded-[20px] px-4 py-3 shadow-sm">
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  className="p-2 text-gray-400 hover:text-gray-500"
                >
                  <img src={cameraIcon} alt="Camera" className="w-6 h-6" />
                </button>
                <button
                  type="button"
                  className="p-2 text-gray-400 hover:text-gray-500"
                >
                  <img src={imageIcon} alt="Attach image" className="w-6 h-6" />
                </button>
              </div>
              <input
                type="text"
                placeholder="Type message..."
                className="flex-1 outline-none text-gray-700 placeholder-gray-400 bg-transparent"
              />
              <button
                type="submit"
                className="p-2 text-[#F88379] hover:text-[#F88379]/80"
              >
                <img src={sendIcon} alt="Send" className="w-6 h-6" />
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
} 