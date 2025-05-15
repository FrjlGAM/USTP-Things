import React from 'react';
import { useNavigate } from 'react-router-dom';

const customerMessages = [
  {
    id: 1,
    name: 'Customer 1',
    avatar: 'https://static.wikia.nocookie.net/spongebob/images/7/7e/Nat_Peterson_29.png',
    message: 'Hello. Naa nako CEA, asa ka ani po?'
  },
  {
    id: 2,
    name: 'Customer 2',
    avatar: 'https://static.wikia.nocookie.net/spongebob/images/7/7e/Nat_Peterson_29.png',
    message: 'Hello. Naa nako CEA, asa ka ani po?'
  },
  {
    id: 3,
    name: 'Customer 3',
    avatar: 'https://static.wikia.nocookie.net/spongebob/images/7/7e/Nat_Peterson_29.png',
    message: 'Hello. Naa nako CEA, asa ka ani po?'
  },
];

const CustomerMessages: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen w-full bg-[#FFF3F2]">
      {/* Top bar with back button and header */}
      <header className="flex items-center justify-between px-8 pr-[47px] py-4 bg-white h-[70px] shadow-[0_4px_4px_0_rgba(0,0,0,0.1)]">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)}>
            <span className="text-[#F88379] text-3xl font-bold">&#8592;</span>
          </button>
          <h1 className="text-3xl font-bold text-[#F88379] pb-1">Customer Messages</h1>
        </div>
      </header>
      <div className="p-8 space-y-6">
        {customerMessages.map((msg) => (
          <div key={msg.id} className="flex items-center bg-white rounded-2xl px-6 py-4 shadow" style={{ minHeight: 80 }}>
            <img src={msg.avatar} alt={msg.name} className="w-14 h-14 rounded-full object-cover mr-6" />
            <div>
              <div className="font-bold text-[#F88379] text-lg">{msg.name}</div>
              <div className="text-gray-800 text-base"><span className="font-bold">Customer:</span> {msg.message}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomerMessages; 