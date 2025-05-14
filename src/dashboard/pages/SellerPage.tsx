import React from "react";
import { useNavigate } from "react-router-dom";
import profilePic from "../../assets/ustp thingS/Person.png";
import productIcon from "../../assets/ustp thingS/Product.png";
import ordersIcon from "../../assets/ustp thingS/Shopping cart.png";
import messagesIcon from "../../assets/ustp thingS/Message circle.png";
import countIcon from "../../assets/ustp thingS/Stack.png";
import earningsIcon from "../../assets/ustp thingS/Earnings.png";
import followersIcon from "../../assets/ustp thingS/Followers.png";
import historyIcon from "../../assets/ustp thingS/History.png";
import ratingIcon from "../../assets/ustp thingS/Rate.png";
import dateIcon from "../../assets/ustp thingS/Date.png";
import leftArrow from "../../assets/ustp thingS/Left Arrow.png";

const products = [
  {
    id: 1,
    name: "Uniform Set USTP ...",
    price: "₱1,000,000",
    image: productIcon,
  },
  ...Array(9).fill({
    id: 2,
    name: "Genevieve Galdo",
    price: "₱1,000,000",
    image: "https://static.wikia.nocookie.net/spongebob/images/7/7e/Nat_Peterson_29.png",
  }),
];

const SellerPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#FFF3F2]">
      {/* Top bar with back button */}
      <div className="flex items-center p-4">
        <button onClick={() => navigate(-1)}>
          <img src={leftArrow} alt="Back" className="w-8 h-8" />
        </button>
      </div>
      {/* Profile and stats */}
      <div className="flex flex-col md:flex-row items-center md:items-start justify-between px-8 pt-2 pb-6 bg-[#FFE9E6] rounded-b-3xl shadow">
        <div className="flex flex-col items-center md:items-start gap-2">
          <img src={profilePic} alt="Profile" className="w-24 h-24 rounded-full border-4 border-[#F88379] object-cover" />
          <div className="text-2xl font-bold text-[#F88379] mt-2">Galdo Boutique</div>
          <div className="flex gap-2 mt-2">
            <button className="bg-[#F88379] text-white px-4 py-2 rounded-full flex items-center gap-2 shadow font-semibold text-sm">
              <img src={productIcon} alt="Manage" className="w-5 h-5" /> Manage Products
            </button>
            <button className="bg-[#F88379] text-white px-4 py-2 rounded-full flex items-center gap-2 shadow font-semibold text-sm">
              <img src={ordersIcon} alt="Orders" className="w-5 h-5" /> Product Orders
            </button>
            <button className="bg-[#F88379] text-white px-4 py-2 rounded-full flex items-center gap-2 shadow font-semibold text-sm">
              <img src={messagesIcon} alt="Messages" className="w-5 h-5" /> Customer Messages
            </button>
          </div>
        </div>
        {/* Stats */}
        <div className="flex flex-wrap justify-center gap-8 mt-6 md:mt-0">
          <div className="flex flex-col items-center text-[#F88379] font-semibold">
            <img src={countIcon} alt="Product Count" className="w-6 h-6 mb-1" />
            Product Count
          </div>
          <div className="flex flex-col items-center text-[#F88379] font-semibold">
            <img src={followersIcon} alt="Followers" className="w-6 h-6 mb-1" />
            Followers
          </div>
          <div className="flex flex-col items-center text-[#F88379] font-semibold">
            <img src={ratingIcon} alt="Rating" className="w-6 h-6 mb-1" />
            Rating
          </div>
          <div className="flex flex-col items-center text-[#F88379] font-semibold">
            <img src={earningsIcon} alt="Earnings" className="w-6 h-6 mb-1" />
            Earnings
          </div>
          <div className="flex flex-col items-center text-[#F88379] font-semibold">
            <img src={historyIcon} alt="Transaction History" className="w-6 h-6 mb-1" />
            Transaction History
          </div>
          <div className="flex flex-col items-center text-[#F88379] font-semibold">
            <img src={dateIcon} alt="Date Joined" className="w-6 h-6 mb-1" />
            Date Joined
          </div>
        </div>
      </div>
      {/* Tabs */}
      <div className="flex mt-8 border-b-2 border-[#F88379]">
        <button className="flex-1 py-3 text-center text-[#F88379] font-bold text-lg border-b-4 border-[#F88379] bg-white">All</button>
        <button className="flex-1 py-3 text-center text-[#F88379] font-bold text-lg bg-[#FFF3F2]">Collections</button>
      </div>
      {/* Products grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-6 p-8">
        {products.map((product, idx) => (
          <div key={idx} className="bg-white rounded-2xl shadow p-4 flex flex-col items-center">
            <img src={product.image} alt={product.name} className="w-32 h-32 object-cover rounded-xl mb-2" />
            <div className="font-semibold text-gray-800 text-center truncate w-full">{product.name}</div>
            <div className="text-[#F88379] font-bold text-center">{product.price}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SellerPage;
