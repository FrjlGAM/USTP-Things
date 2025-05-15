import React from "react";

interface AddProductModalProps {
  open: boolean;
  onClose: () => void;
}

const AddProductModal: React.FC<AddProductModalProps> = ({ open, onClose }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#FFF3F2]/80 backdrop-blur-[2px]">
      <div className="bg-white rounded-2xl shadow-lg p-10 w-[900px] max-w-full relative border-2 border-black">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-3xl text-[#F88379] hover:bg-[#F88379]/10 rounded-full w-10 h-10 flex items-center justify-center border-2 border-[#F88379]"
        >
          <span style={{ fontSize: 32, fontWeight: "bold" }}>×</span>
        </button>
        <div className="flex gap-8">
          {/* Left Side */}
          <div className="flex-1 flex flex-col gap-6 pr-2">
            <h2 className="text-4xl font-bold mb-2 text-black italic">Delivery Details</h2>
            <select className="border-b-2 border-gray-300 py-2 focus:outline-none font-semibold">
              <option>Enter Date Slots</option>
            </select>
            <select className="border-b-2 border-gray-300 py-2 focus:outline-none font-semibold">
              <option>Enter Time Slots</option>
            </select>
            <select className="border-b-2 border-gray-300 py-2 focus:outline-none font-semibold text-gray-400">
              <option>Choose Campus Location</option>
            </select>
            <select className="border-b-2 border-gray-300 py-2 focus:outline-none font-semibold text-gray-400">
              <option>Choose Payment Method</option>
            </select>
            <textarea
              className="border-b-2 border-gray-300 py-2 focus:outline-none resize-none font-semibold mt-2"
              placeholder="Enter Product Description"
              rows={3}
            />
          </div>
          {/* Center Image Upload */}
          <div className="flex flex-col items-center justify-center pt-6">
            <div className="w-48 h-48 bg-gray-200 rounded-lg flex items-center justify-center cursor-pointer">
              <span className="text-7xl text-gray-400 font-light">+</span>
            </div>
          </div>
          {/* Right Side */}
          <div className="flex-1 flex flex-col gap-6 pl-2 pt-2">
            <input
              className="border-b-2 border-gray-300 py-2 focus:outline-none font-semibold"
              placeholder="Enter Product Name"
            />
            <input
              className="border-b-2 border-gray-300 py-2 focus:outline-none font-semibold"
              placeholder="Enter Price"
              type="number"
            />
            <input
              className="border-b-2 border-gray-300 py-2 focus:outline-none font-semibold"
              placeholder="Enter Number of Stock"
              type="number"
            />
            <input
              className="border-b-2 border-gray-300 py-2 focus:outline-none font-semibold"
              placeholder="Enter Product Tags"
            />
          </div>
        </div>
        {/* Add Product Button */}
        <div className="flex justify-center mt-8">
          <button className="bg-black text-white px-10 py-2 rounded-full font-bold text-lg hover:bg-[#F88379] transition">
            Add Product
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddProductModal;
