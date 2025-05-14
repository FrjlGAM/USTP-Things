import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import profilePic from "../../assets/ustp thingS/Person.png";
import manageProductsIcon from "../../assets/ustp thingS/Product.png";
import productOrdersIcon from "../../assets/ustp thingS/Bag.png";
import customerMessagesIcon from "../../assets/ustp thingS/Chat Bubble.png";
import productCountIcon from "../../assets/ustp thingS/productCount.png";
import earningsIcon from "../../assets/ustp thingS/Earnings.png";
import followersIcon from "../../assets/ustp thingS/Followers.png";
import transactionHistoryIcon from "../../assets/ustp thingS/TransactionHistory.png";
import ratingIcon from "../../assets/ustp thingS/Rating.png";
import dateIcon from "../../assets/ustp thingS/DateJoined.png";
import LeftArrow from "../../assets/ustp thingS/LeftArrow.png";
import addIcon from "../../assets/ustp thingS/Add.png";
import deleteIcon from "../../assets/ustp thingS/Delete.png";

const products = [
  {
    id: 1,
    name: "Uniform Set USTP ...",
    price: "₱1,000,000",
    image: "https://your-image-url.com/uniform.png",
  },
  ...Array(9).fill({
    id: 2,
    name: "Genevieve Galdo",
    price: "₱1,000,000",
    image: "https://static.wikia.nocookie.net/spongebob/images/7/7e/Nat_Peterson_29.png",
  }),
];

const stats = [
  { icon: productCountIcon, label: "Product Count" },
  { icon: earningsIcon, label: "Earnings" },
  { icon: followersIcon, label: "Followers" },
  { icon: transactionHistoryIcon, label: "Transaction History" },
  { icon: ratingIcon, label: "Rating" },
  { icon: dateIcon, label: "Date Joined" },
];

const SellerPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'All' | 'Collections'>('All');
  const [showOverlay, setShowOverlay] = useState(false);
  const manageBtnRef = useRef<HTMLDivElement>(null);

  // Close overlay if clicked outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (manageBtnRef.current && !manageBtnRef.current.contains(event.target as Node)) {
        setShowOverlay(false);
      }
    }
    if (showOverlay) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showOverlay]);

  // Filter products for Collections tab (example: only 'Genevieve Galdo')
  const collectionProducts = products.filter((p) => p.name === 'Genevieve Galdo');

  return (
    <div className="min-h-screen w-full bg-white">
      {/* Top bar with back button */}
      <div className="flex items-center p-4">
        <button onClick={() => navigate(-1)}>
          <img src={LeftArrow} alt="Back" className="w-8 h-8" />
        </button>
        <span className="ml-4 text-lg text-gray-400 font-semibold">Seller Page</span>
      </div>
      {/* Profile and stats card */}
      <div className="w-full bg-[#FFF3F2] rounded-none shadow px-8 py-6 flex flex-col md:flex-row gap-6">
        {/* Left: Profile and actions */}
        <div className="flex flex-col items-center md:items-start w-full md:w-1/3 md:flex md:items-center md:justify-center">
          <div className="relative flex flex-col items-center ml-41">
            <img src={profilePic} alt="Profile" className="w-24 h-24 rounded-full border-4 border-[#F88379] object-cover" />
            {/* Optional: Pencil icon overlay */}
            {/* <img src={pencilIcon} alt="Edit" className="absolute bottom-2 right-2 w-6 h-6 bg-white rounded-full p-1 border border-gray-200" /> */}
            <div className="text-xl font-bold text-[#F88379] mt-2 text-center">Galdo Boutique</div>
          </div>
          <div className="flex justify-center gap-6 mt-8">
            <div className="relative" ref={manageBtnRef}>
              {/* Overlay Buttons */}
              {showOverlay && (
                <div className="absolute -top-32 left-1/2 -translate-x-1/2 flex gap-8 z-20">
                  <div className="flex flex-col items-center">
                    <button className="w-10 h-10 rounded-full bg-[#F88379] flex items-center justify-center shadow-md hover:scale-105 transition">
                      <img src={addIcon} alt="Add Product" className="w-5 h-5" />
                    </button>
                    <span className="mt-2 text-[#F88379] font-semibold text-xs">Add Product</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <button className="w-10 h-10 rounded-full bg-[#F88379] flex items-center justify-center shadow-md hover:scale-105 transition">
                      <img src={deleteIcon} alt="Delete Product" className="w-5 h-5" />
                    </button>
                    <span className="mt-2 text-[#F88379] font-semibold text-xs">Delete Product</span>
                  </div>
                </div>
              )}
              {/* Manage Products Button */}
              <button
                className="flex items-center gap-3 px-4 py-1 rounded-full bg-[#F88379] shadow-[0_2px_8px_0_rgba(248,131,121,0.15)] hover:scale-105 transition-transform"
                style={{ minWidth: 120, fontFamily: 'Nunito, Quicksand, sans-serif', boxShadow: '0 2px 8px 0 rgba(248,131,121,0.15)' }}
                onClick={() => setShowOverlay((prev) => !prev)}
                type="button"
              >
                <img src={manageProductsIcon} alt="Manage Products" className="w-6 h-6" />
                <span className="text-white font-bold text-sm text-left" style={{ fontFamily: 'inherit', letterSpacing: '0.5px' }}>
                  Manage<br />Products
                </span>
              </button>
            </div>
            <button
              className="flex items-center gap-3 px-4 py-1 rounded-full bg-[#F88379] shadow-[0_2px_8px_0_rgba(248,131,121,0.15)] hover:scale-105 transition-transform"
              style={{ minWidth: 120, fontFamily: 'Nunito, Quicksand, sans-serif', boxShadow: '0 2px 8px 0 rgba(248,131,121,0.15)' }}
            >
              <img src={productOrdersIcon} alt="Product Orders" className="w-6 h-6" />
              <span className="text-white font-bold text-sm text-left" style={{ fontFamily: 'inherit', letterSpacing: '0.5px' }}>
                Product<br />Orders
              </span>
            </button>
            <button
              className="flex items-center gap-3 px-4 py-1 rounded-full bg-[#F88379] shadow-[0_2px_8px_0_rgba(248,131,121,0.15)] hover:scale-105 transition-transform"
              style={{ minWidth: 140, fontFamily: 'Nunito, Quicksand, sans-serif', boxShadow: '0 2px 8px 0 rgba(248,131,121,0.15)' }}
            >
              <img src={customerMessagesIcon} alt="Customer Messages" className="w-7 h-7" />
              <span className="text-white font-bold text-sm text-left" style={{ fontFamily: 'inherit', letterSpacing: '0.5px' }}>
                Customer<br />Messages
              </span>
            </button>
          </div>
        </div>
        {/* Right: Stats */}
        <div className="flex-1 grid grid-cols-2 gap-y-6 gap-x-12 items-center mt-6 md:mt-0 pl-30">
          {stats.map((stat, idx) => (
            <div key={idx} className="flex items-center gap-4">
              <img src={stat.icon} alt={stat.label} className="w-9 h-9" />
              <span className="text-[#F88379] font-semibold text-lg">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
      {/* Tabs */}
      <div className="w-full flex mt-8 bg-[#FFF3F2] rounded-none border-b-2 border-[#C9B6B6]">
        <button
          className={`flex-1 py-3 text-center font-bold text-lg rounded-t-2xl transition border-b-4 ${
            activeTab === 'All'
              ? 'text-[#F88379] border-[#F88379] bg-[#FFF3F2]'
              : 'text-[#F88379] border-transparent bg-[#FFF3F2] opacity-70'
          }`}
          onClick={() => setActiveTab('All')}
        >
          All
        </button>
        <button
          className={`flex-1 py-3 text-center font-bold text-lg rounded-t-2xl transition border-b-4 ${
            activeTab === 'Collections'
              ? 'text-[#F88379] border-[#F88379] bg-[#FFF3F2]'
              : 'text-[#F88379] border-transparent bg-[#FFF3F2] opacity-70'
          }`}
          onClick={() => setActiveTab('Collections')}
        >
          Collections
        </button>
      </div>
      {/* Products grid */}
      <div className="w-full p-8 bg-white rounded-none shadow">
        {activeTab === 'All' && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {products.map((product, idx) => (
              <div key={idx} className="bg-white rounded-2xl border border-[#F3E6E6] shadow p-4 flex flex-col items-center">
                <img src={product.image} alt={product.name} className="w-32 h-32 object-cover rounded-xl mb-2" />
                <div className="font-semibold text-gray-800 text-center truncate w-full">{product.name}</div>
                <div className="text-[#F88379] font-bold text-center">{product.price}</div>
              </div>
            ))}
          </div>
        )}
        {activeTab === 'Collections' && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {collectionProducts.map((product, idx) => (
              <div key={idx} className="bg-white rounded-2xl border border-[#F3E6E6] shadow p-4 flex flex-col items-center">
                <img src={product.image} alt={product.name} className="w-32 h-32 object-cover rounded-xl mb-2" />
                <div className="font-semibold text-gray-800 text-center truncate w-full">{product.name}</div>
                <div className="text-[#F88379] font-bold text-center">{product.price}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerPage;