import React from "react";

interface AddProductModalProps {
  open: boolean;
  onClose: () => void;
}

const AddProductModal: React.FC<AddProductModalProps> = ({ open, onClose }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-[800px] max-w-full relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-2xl text-[#F88379] hover:bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center"
        >
          <span style={{ fontSize: 28, fontWeight: "bold" }}>×</span>
        </button>
        <div className="flex gap-8">
          {/* Left Side */}
          <div className="flex-1 flex flex-col gap-4">
            <h2 className="text-3xl font-bold mb-2 text-[#222]">Delivery Details</h2>
            <select className="border-b-2 border-gray-300 py-2 focus:outline-none">
              <option>Enter Date Slots</option>
            </select>
            <select className="border-b-2 border-gray-300 py-2 focus:outline-none">
              <option>Enter Time Slots</option>
            </select>
            <select className="border-b-2 border-gray-300 py-2 focus:outline-none">
              <option>Choose Campus Location</option>
            </select>
            <select className="border-b-2 border-gray-300 py-2 focus:outline-none">
              <option>Choose Payment Method</option>
            </select>
            <textarea
              className="border-b-2 border-gray-300 py-2 focus:outline-none resize-none"
              placeholder="Enter Product Description"
              rows={2}
            />
          </div>
          {/* Center Image Upload */}
          <div className="flex flex-col items-center justify-center">
            <div className="w-40 h-40 bg-gray-200 rounded-lg flex items-center justify-center cursor-pointer">
              <span className="text-6xl text-gray-400">+</span>
            </div>
          </div>
          {/* Right Side */}
          <div className="flex-1 flex flex-col gap-4">
            <input
              className="border-b-2 border-gray-300 py-2 focus:outline-none"
              placeholder="Enter Product Name"
            />
            <input
              className="border-b-2 border-gray-300 py-2 focus:outline-none"
              placeholder="Enter Price"
              type="number"
            />
            <input
              className="border-b-2 border-gray-300 py-2 focus:outline-none"
              placeholder="Enter Number of Stock"
              type="number"
            />
            <input
              className="border-b-2 border-gray-300 py-2 focus:outline-none"
              placeholder="Enter Product Tags"
            />
          </div>
        </div>
        {/* Add Product Button */}
        <div className="flex justify-end mt-8">
          <button className="bg-black text-white px-8 py-2 rounded-full font-bold text-lg hover:bg-[#F88379] transition">
            Add Product
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddProductModal;
