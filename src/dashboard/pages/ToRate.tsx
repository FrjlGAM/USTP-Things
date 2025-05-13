import Sidebar from '../components/Sidebar';
import ustpLogo from '../../assets/ustp-things-logo.png';
import userAvatar from '../../assets/ustp thingS/Person.png';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Sample items to rate data
const itemsToRate = [
  {
    id: 1,
    seller: 'Galdo Boutique',
    product: 'Uniform Set USTP (Female)',
    image: userAvatar,
    purchaseDate: '2 days ago',
  },
  {
    id: 2,
    seller: 'USTP Bookstore',
    product: 'USTP Notebook',
    image: userAvatar,
    purchaseDate: '1 week ago',
  },
  {
    id: 3,
    seller: 'Campus Supplies',
    product: 'USTP ID Lace',
    image: userAvatar,
    purchaseDate: '2 weeks ago',
  },
];

// Content component without header and sidebar
export function ToRateContent() {
  return (
    <div className="space-y-6">
      {itemsToRate.map((item) => (
        <div key={item.id} className="bg-white rounded-2xl shadow p-6">
          <div className="flex items-center gap-4">
            <img src={item.image} alt={item.product} className="w-24 h-24 object-cover rounded-xl" />
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-semibold text-gray-800">{item.seller}</h3>
                <span className="text-sm text-gray-500">{item.purchaseDate}</span>
              </div>
              <p className="text-gray-600 mt-1">{item.product}</p>
              <button className="mt-4 bg-[#F88379] hover:bg-[#F88379]/90 text-white font-semibold py-2 px-6 rounded-lg shadow transition">
                Rate Now
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Full page component with header and sidebar
export default function ToRate() {
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
            <h1 className="text-3xl font-bold text-[#F88379] pb-1">To Rate</h1>
          </div>
        </header>
        <ToRateContent />
      </main>
    </div>
  );
} 