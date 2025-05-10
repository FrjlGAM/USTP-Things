import Sidebar from '../components/Sidebar';
import productImg from '../../assets/ustp thingS/Product.png';
import ustpLogo from '../../assets/ustp-things-logo.png';
import React from 'react';

const pickups = [
  {
    boutique: 'Galdo Boutique',
    product: 'Uniform Set USTP (Female) – Blouse, Skirt, and Necktie',
    image: productImg,
  },
  {
    boutique: 'Galdo Boutique',
    product: 'Uniform Set USTP (Female) – Blouse, Skirt, and Necktie',
    image: productImg,
  },
  {
    boutique: 'Galdo Boutique',
    product: 'Uniform Set USTP (Female) – Blouse, Skirt, and Necktie',
    image: productImg,
  },
];

export default function Pickup() {
  return (
    <div style={{ background: '#E9E7FD', minHeight: '100vh' }}>
      <div className="flex">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="flex items-center bg-white shadow px-8 py-4" style={{ minHeight: 80 }}>
            <img src={ustpLogo} alt="USTP Things Logo" className="h-10 mr-4" />
            <h1 className="text-2xl font-bold text-pink-400">Pick Up</h1>
          </div>
          {/* Pickup List */}
          <div className="p-8">
            <div className="flex flex-col gap-6">
              {pickups.map((item, idx) => (
                <div key={idx} className="bg-pink-50 rounded-xl p-6 flex items-center gap-4 shadow-sm border border-pink-100">
                  <img src={item.image} alt="Product" className="w-14 h-14 rounded-lg object-cover border border-pink-200" />
                  <div>
                    <div className="font-bold text-lg text-pink-900 underline underline-offset-2 mb-1">{item.boutique}</div>
                    <div className="text-gray-700 text-base">{item.product}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
