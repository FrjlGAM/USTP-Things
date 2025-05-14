import React, { useEffect } from "react";

interface AddProductProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddProduct: React.FC<AddProductProps> = ({ isOpen, onClose }) => {
  // Freeze background scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black bg-opacity-30 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-xl p-10 w-[90vw] max-w-5xl flex flex-col items-center border-2 border-[#F88379] z-10">
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-3xl text-[#F88379] hover:bg-[#F88379]/20 rounded-full p-1"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
        {/* Modal Content */}
        <div className="w-full flex flex-col md:flex-row gap-8">
          {/* Left Side */}
          <div className="flex-1 flex flex-col gap-4">
            <div className="flex justify-center">
              <div className="w-56 h-56 bg-gray-300 rounded-lg flex items-center justify-center text-6xl text-white font-bold">
                +
              </div>
            </div>
            <select className="border-b-2 py-2 px-1" defaultValue="">
              <option value="" disabled>Enter Date Slots</option>
              {/* Add options here */}
            </select>
            <select className="border-b-2 py-2 px-1" defaultValue="">
              <option value="" disabled>Enter Time Slots</option>
              {/* Add options here */}
            </select>
            <select className="border-b-2 py-2 px-1" defaultValue="">
              <option value="" disabled>Choose Campus Location</option>
              {/* Add options here */}
            </select>
            <select className="border-b-2 py-2 px-1" defaultValue="">
              <option value="" disabled>Choose Payment Method</option>
              {/* Add options here */}
            </select>
          </div>
          {/* Right Side */}
          <div className="flex-1 flex flex-col gap-4">
            <input className="border-b-2 py-2 px-1" placeholder="Enter Product Name" />
            <input className="border-b-2 py-2 px-1" placeholder="Enter Price" />
            <input className="border-b-2 py-2 px-1" placeholder="Enter Number of Stock" />
            <input className="border-b-2 py-2 px-1" placeholder="Enter Product Tags" />
            <textarea
              className="border-b-2 py-2 px-1 mt-4"
              placeholder="Enter Product Description"
              rows={4}
            />
          </div>
        </div>
        <button className="mt-8 px-8 py-3 rounded-full bg-black text-white font-bold text-lg hover:bg-gray-800 transition">
          Add Product
        </button>
      </div>
    </div>
  );
};

export default AddProduct;
