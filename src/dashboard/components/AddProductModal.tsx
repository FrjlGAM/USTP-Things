import React, { useRef, useState } from "react";

interface AddProductModalProps {
  open: boolean;
  onClose: () => void;
}

const AddProductModal: React.FC<AddProductModalProps> = ({ open, onClose }) => {
  const [productImage, setProductImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!open) return null;

  // Handle image upload (Cloudinary, like MyProfile)
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = e.target.files[0];
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'profile_picture'); // your unsigned preset name
      const response = await fetch(
        'https://api.cloudinary.com/v1_1/dr7t6evpc/image/upload',
        {
          method: 'POST',
          body: formData,
        }
      );
      const data = await response.json();
      if (!data.secure_url) throw new Error("No secure_url returned from Cloudinary");
      setProductImage(data.secure_url);
    } catch (error) {
      alert("Failed to upload image. Check console for details.");
      console.error("Image upload error:", error);
    }
    setUploading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#FFF3F2]/80 backdrop-blur-[2px]">
      <div className="bg-white rounded-2xl shadow-lg p-10 w-[900px] max-w-full relative border-2 border-black">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#F88379] hover:bg-[#F88379]/10 rounded-full w-10 h-10 flex items-center justify-center border-2 border-[#F88379]"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F88379" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <line x1="6" y1="6" x2="18" y2="18"/>
            <line x1="6" y1="18" x2="18" y2="6"/>
          </svg>
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
            <input
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              ref={fileInputRef}
              onChange={handleImageChange}
            />
            <div
              className="w-48 h-48 bg-gray-200 rounded-lg flex items-center justify-center cursor-pointer overflow-hidden border-2 border-gray-300"
              onClick={() => !uploading && fileInputRef.current?.click()}
              style={{ position: 'relative' }}
            >
              {uploading ? (
                <span className="text-2xl text-gray-400 font-light animate-pulse">Uploading...</span>
              ) : productImage ? (
                <img src={productImage} alt="Product" className="object-cover w-full h-full" />
              ) : (
                <span className="text-7xl text-gray-400 font-light">+</span>
              )}
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
