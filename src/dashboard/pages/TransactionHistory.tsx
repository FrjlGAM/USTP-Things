import React from "react";
import { useNavigate } from "react-router-dom";
import productUniform from "../../assets/ustp thingS/yummy 2.png";
import LeftArrow from "../../assets/ustp thingS/LeftArrow.png";

const transactions = [
  {
    id: 1,
    product: "Uniform Set USTP (Female) – Blouse, Skirt, and Necktie",
    qty: 1,
    status: "Pending",
    amount: "₱1,000,000",
    image: productUniform,
  },
  {
    id: 2,
    product: "Uniform Set USTP (Female) – Blouse, Skirt, and Necktie",
    qty: 1,
    status: "Completed",
    amount: "₱1,000,000",
    image: productUniform,
  },
];

const TransactionHistory: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      {/* Top bar */}
      <div className="flex items-center p-4">
        <button onClick={() => navigate(-1)}>
          <img src={LeftArrow} alt="Back" className="w-8 h-8" />
        </button>
        <span className="ml-4 text-2xl font-bold text-[#F88379]">My Transaction History</span>
      </div>
      <div className="p-8">
        <div className="bg-[#FFF3F2] rounded-2xl p-8">
          <div className="flex font-semibold text-gray-500 text-lg mb-6">
            <div className="flex-1">Order</div>
            <div className="w-1/4 text-center">Status</div>
            <div className="w-1/4 text-right">Payout Amount</div>
          </div>
          {transactions.map((tx) => (
            <div key={tx.id} className="flex items-center mb-6 last:mb-0">
              <div className="flex-1 flex items-center">
                <img src={tx.image} alt={tx.product} className="w-12 h-12 rounded object-cover mr-4" />
                <div>
                  <div className="font-semibold text-gray-800">{tx.product}</div>
                  <div className="text-xs text-gray-500">{tx.qty}x</div>
                </div>
              </div>
              <div className="w-1/4 text-center font-semibold text-[#F88379]">
                {tx.status}
              </div>
              <div className="w-1/4 text-right font-bold text-gray-700">
                {tx.amount}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TransactionHistory;
