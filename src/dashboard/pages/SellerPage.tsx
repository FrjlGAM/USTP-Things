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
import productUniform from "../../assets/ustp thingS/yummy 2.png"
import AddProductModal from "../components/AddProductModal";

const initialProducts = [
  {
    id: 1,
    name: "Uniform Set USTP ...",
    price: "₱1,000,000",
    image: productUniform,
  },
  ...Array(9).fill({
    id: 2,
    name: "Genevieve Galdo",
    price: "₱1,000,000",
    image: "https://static.wikia.nocookie.net/spongebob/images/7/7e/Nat_Peterson_29.png",
  }),
];

const stats = [
  { icon: productCountIcon, label: "Product Count", value: "1,000" },
  { icon: earningsIcon, label: "Earnings" },
  { icon: followersIcon, label: "Followers", value: "9,999" },
  { icon: transactionHistoryIcon, label: "Transaction History" },
  { icon: ratingIcon, label: "Rating", value: "5/5" },
  { icon: dateIcon, label: "Date Joined", value: "March 1, 2025" },
];

const SellerPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'all' | 'collections'>('all');
  const [showOverlay, setShowOverlay] = useState(false);
  const manageBtnRef = useRef<HTMLDivElement>(null);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [deleteMode, setDeleteMode] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [products, setProducts] = useState(initialProducts);

  const collections = [
    {
      id: 1,
      name: "Frijiel's Top Favorites",
      image: productOrdersIcon,
    },
    {
      id: 2,
      name: "John Martil's Favorite Rubber Colors",
      image: "https://static.wikia.nocookie.net/spongebob/images/7/7e/Nat_Peterson_29.png",
    },
    {
      id: 3,
      name: "Carl Syker Favorite Color",
      image: "https://static.wikia.nocookie.net/spongebob/images/7/7e/Nat_Peterson_29.png",
    },
    {
      id: 4,
      name: "Karla's Favorite Boy",
      image: "https://static.wikia.nocookie.net/spongebob/images/7/7e/Nat_Peterson_29.png",
    },
    {
      id: 5,
      name: "Frijiel's Top Favorites",
      image: "https://static.wikia.nocookie.net/spongebob/images/7/7e/Nat_Peterson_29.png",
    },
  ];

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
    <div className="min-h-screen w-full bg-[#FFF3F2]">
      {/* Top bar with back button, flush with card, no white gap above */}
      <div className="flex items-center px-8 py-3 bg-[#FFF3F2] shadow-none sticky top-0 z-30" style={{marginTop: 0}}>
        <button onClick={() => navigate('/dashboard/seller-orders')}>
          <img src={LeftArrow} alt="Back" className="w-8 h-8" />
        </button>
        <span className="ml-4 text-lg text-gray-400 font-semibold">Seller Page</span>
      </div>
      {/* Profile and stats card, clean two-column layout, no overlaps */}
      <div className="w-full bg-[#FFF3F2] px-8 pt-6 pb-4 flex flex-col md:flex-row gap-8">
        {/* Left: Profile card */}
        <div className="bg-white rounded-2xl shadow p-8 flex flex-col items-center md:items-start w-full md:w-1/3 min-w-[300px] max-w-[350px]">
          <img src={profilePic} alt="Profile" className="w-24 h-24 rounded-full border-4 border-[#F88379] object-cover mb-2" />
          <div className="text-xl font-bold text-[#F88379] mt-2 text-center md:text-left">Galdo Boutique</div>
          {/* Action Buttons */}
          <div className="flex flex-col gap-3 w-full mt-8">
            <button
              className="flex items-center gap-3 px-4 py-2 rounded-full bg-[#F88379] text-white font-bold shadow hover:scale-105 transition-transform w-full justify-center"
              onClick={() => setShowOverlay((prev) => !prev)}
              type="button"
            >
              <img src={manageProductsIcon} alt="Manage Products" className="w-6 h-6" />
              Manage Products
            </button>
            <button
              className="flex items-center gap-3 px-4 py-2 rounded-full bg-[#F88379] text-white font-bold shadow hover:scale-105 transition-transform w-full justify-center"
              onClick={() => navigate('/dashboard/seller-orders')}
            >
              <img src={productOrdersIcon} alt="Product Orders" className="w-6 h-6" />
              Product Orders
            </button>
            <button
              className="flex items-center gap-3 px-4 py-2 rounded-full bg-[#F88379] text-white font-bold shadow hover:scale-105 transition-transform w-full justify-center"
              onClick={() => navigate('/dashboard/customer-messages')}
            >
              <img src={customerMessagesIcon} alt="Customer Messages" className="w-7 h-7" />
              Customer Messages
            </button>
          </div>
        </div>
        {/* Right: Stats card */}
        <div className="flex-1 bg-white rounded-2xl shadow p-8 grid grid-cols-2 gap-y-8 gap-x-12 items-center min-w-[320px]">
          {stats.map((stat, idx) => {
            if (stat.label === 'Earnings') {
              return (
                <button
                  key={idx}
                  className="flex items-center gap-4 group relative bg-transparent border-none outline-none cursor-pointer"
                  onClick={() => navigate('/dashboard/earnings')}
                  style={{ boxShadow: 'none', background: 'none', padding: 0 }}
                >
                  <img src={stat.icon} alt={stat.label} className="w-9 h-9" />
                  <span className="text-[#F88379] font-semibold text-lg">{stat.label}</span>
                </button>
              );
            }
            if (stat.label === 'Product Count' || stat.label === 'Followers' || stat.label === 'Rating' || stat.label === 'Date Joined') {
              return (
                <div key={idx} className="flex items-center gap-4 group relative">
                  <img src={stat.icon} alt={stat.label} className="w-9 h-9" />
                  <span className="text-[#F88379] font-semibold text-lg">{stat.label}</span>
                  <div
                    className="absolute left-20 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  >
                    <div className="flex items-center">
                      <span
                        className="rounded-full px-6 py-2 text-white font-bold text-lg shadow"
                        style={{
                          background: '#F88379',
                          fontStyle: stat.label === 'Date Joined' ? 'italic' : 'normal',
                          minWidth: stat.label === 'Date Joined' ? 140 : 80,
                          display: 'inline-block',
                          textAlign: 'center',
                        }}
                      >
                        {stat.value}
                      </span>
                    </div>
                  </div>
                </div>
              );
            }
            // Transaction History and other stats
            return (
              <div key={idx} className="flex items-center gap-4">
                <img src={stat.icon} alt={stat.label} className="w-9 h-9" />
                <span className="text-[#F88379] font-semibold text-lg">{stat.label}</span>
              </div>
            );
          })}
        </div>
      </div>
      {/* Tabs, minimal margin above, reduce gap below */}
      <div className="flex border-b-2 border-[#F88379] mt-2 mb-2">
        <button
          className={`flex-1 py-3 text-center font-bold text-lg ${
            activeTab === 'all'
              ? 'text-[#F88379] border-b-4 border-[#F88379] bg-[#FFF3F2]'
              : 'text-[#F88379] bg-[#FFF3F2]'
          }`}
          onClick={() => setActiveTab('all')}
        >
          All
        </button>
        <button
          className={`flex-1 py-3 text-center font-bold text-lg ${
            activeTab === 'collections'
              ? 'text-[#F88379] border-b-4 border-[#F88379] bg-[#FFF3F2]'
              : 'text-[#F88379] bg-[#FFF3F2]'
          }`}
          onClick={() => setActiveTab('collections')}
        >
          Collections
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'all' ? (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 px-8 pb-8 pt-2 relative">
          {products.map((product, idx) => (
            <div key={idx} className="bg-white rounded-2xl shadow p-4 flex flex-col items-center relative">
              {deleteMode && (
                <input
                  type="checkbox"
                  className="absolute top-2 right-2 w-6 h-6 accent-[#F88379] border-2 border-gray-300 rounded"
                  checked={selectedProducts.includes(idx)}
                  onChange={() => {
                    setSelectedProducts((prev) =>
                      prev.includes(idx)
                        ? prev.filter((i) => i !== idx)
                        : [...prev, idx]
                    );
                  }}
                />
              )}
              <img src={product.image} alt={product.name} className="w-32 h-32 object-cover rounded-xl mb-2" />
              <div className="font-semibold text-gray-800 text-center truncate w-full">{product.name}</div>
              <div className="text-[#F88379] font-bold text-center">{product.price}</div>
            </div>
          ))}
          {/* Delete/Cancel Buttons */}
          {deleteMode && (
            <div className="fixed bottom-8 right-8 flex gap-4 z-30">
              <button
                className="flex items-center gap-2 px-8 py-2 rounded-full bg-[#F88379]/20 text-[#F88379] font-bold text-lg border border-[#F88379] hover:bg-[#F88379]/40 transition"
                onClick={() => {
                  setProducts((prev) => prev.filter((_, idx) => !selectedProducts.includes(idx)));
                  setDeleteMode(false);
                  setSelectedProducts([]);
                }}
              >
                <img src={deleteIcon} alt="Delete" className="w-5 h-5" />
                Delete
              </button>
              <button
                className="flex items-center gap-2 px-8 py-2 rounded-full bg-[#F88379]/20 text-[#F88379] font-bold text-lg border border-[#F88379] hover:bg-[#F88379]/40 transition"
                onClick={() => {
                  setDeleteMode(false);
                  setSelectedProducts([]);
                }}
              >
                <span className="text-xl">×</span>
                Cancel
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-[#FFF3F2] p-8 pt-2">
          {collections.map((col, idx) => (
            <div
              key={col.id}
              className="flex items-center bg-white/60 rounded mb-2 px-4 py-3"
              style={{ borderBottom: idx !== collections.length - 1 ? '1px solid #F88379' : undefined }}
            >
              <img src={col.image} alt={col.name} className="w-12 h-12 object-cover rounded mr-4" />
              <span className="text-[#F88379] font-semibold">{col.name}</span>
            </div>
          ))}
        </div>
      )}
      <AddProductModal open={showAddProductModal} onClose={() => setShowAddProductModal(false)} />
    </div>
  );
};

export default SellerPage;