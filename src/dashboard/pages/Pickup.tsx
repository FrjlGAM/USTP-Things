import Sidebar from '../components/Sidebar';
import ustpLogo from '../../assets/ustp-things-logo.png';
import userAvatar from '../../assets/ustp thingS/Person.png';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Sample pickup data
const pickups = [
  {
    id: 1,
    seller: 'Galdo Boutique',
    product: 'Uniform Set USTP (Female)',
    status: 'Ready for pickup',
    time: '10:30 AM',
    avatar: userAvatar,
  },
  {
    id: 2,
    seller: 'USTP Bookstore',
    product: 'USTP Notebook',
    status: 'Processing',
    time: 'Yesterday',
    avatar: userAvatar,
  },
  {
    id: 3,
    seller: 'Campus Supplies',
    product: 'USTP ID Lace',
    status: 'Ready for pickup',
    time: '2 days ago',
    avatar: userAvatar,
  },
];

export default function Pickup() {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  // Sidebar navigation handler
  const handleSidebarNav = (view: 'home' | 'likes' | 'recently' | 'pickup' | 'rate' | 'message') => {
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
      case 'rate':
        navigate('/dashboard/to-rate');
        break;
      case 'message':
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
          onPickUpClick={() => handleSidebarNav('pickup')}
          onRateClick={() => handleSidebarNav('rate')}
          onMessageClick={() => handleSidebarNav('message')}
        />
      </div>
      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between px-8 pr-[47px] py-4 bg-white h-[70px] w-full shadow-[0_4px_4px_0_rgba(0,0,0,0.1)]">
          <div className="flex items-center gap-4">
            <img src={ustpLogo} alt="USTP Things Logo" className="w-[117px] h-[63px] object-contain" />
            <h1 className="text-3xl font-bold text-[#F88379] pb-1">Pick Up</h1>
          </div>
        </header>
        {/* Pickup List */}
        <div className="flex-1 p-10">
          <div className="space-y-6">
            {pickups.map((pickup) => (
              <div key={pickup.id} className="bg-white rounded-2xl shadow p-6">
                <div className="flex items-center gap-4">
                  <img src={pickup.avatar} alt={pickup.seller} className="w-16 h-16 rounded-full object-cover" />
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-semibold text-gray-800">{pickup.seller}</h3>
                      <span className="text-sm text-gray-500">{pickup.time}</span>
                    </div>
                    <p className="text-gray-600 mt-1">{pickup.product}</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className={`text-sm font-semibold ${pickup.status === 'Ready for pickup' ? 'text-green-600' : 'text-yellow-600'}`}>
                        {pickup.status}
                      </span>
                      {pickup.status === 'Ready for pickup' && (
                        <button className="bg-[#F88379] hover:bg-[#F88379]/90 text-white font-semibold py-2 px-6 rounded-lg shadow transition">
                          Pick Up Now
                        </button>
                      )}
                    </div>
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