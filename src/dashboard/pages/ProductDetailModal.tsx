import React from 'react';
import xIcon from '../../assets/ustp thingS/X button.png';

const productDetails = {
  description: `Complete USTP college uniform set for female students, includes:
・White Blouse: With USTP logo (Size: Medium)
・Black Skirt: Waist - 28", Length - Knee-length
・USTP Necktie
✅ Barely used and in excellent condition
✅ No stains, tears, or damages
✅ Ideal for students looking for an affordable and well-maintained uniform`,
  sold: 100,
  soldOut: 0,
  rating: 5.0,
};

export default function ProductDetailModal({ product, onClose }: { product: any; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-20">
      <div className="relative bg-white rounded-3xl shadow-2xl flex flex-col md:flex-row p-8 gap-8 min-w-[650px] max-w-3xl w-full border-4 border-pink-100 animate-fade-in-scale">
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-4 right-4 focus:outline-none">
          <img src={xIcon} alt="Close" className="w-8 h-8" />
        </button>
        {/* Product Image */}
        <div className="flex-shrink-0 flex flex-col items-center">
          <img src={product.image} alt={product.name} className="w-64 h-64 object-cover rounded-2xl mb-4" />
          <button className="w-56 bg-[#F88379] hover:bg-[#F88379]/90 text-white font-bold py-3 rounded-xl shadow flex items-center justify-center gap-2 mt-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 3h2l.4 2M7 13h10l4-8H5.4" /><circle cx="7" cy="21" r="1" /><circle cx="20" cy="21" r="1" /></svg>
            Add to Cart
          </button>
        </div>
        {/* Product Details */}
        <div className="flex-1 flex flex-col">
          <h2 className="text-2xl font-bold mb-2">{product.name.replace('...', '– Blouse, Skirt, and Necktie')}</h2>
          <div className="text-2xl font-bold text-[#F88379] mb-2">{product.price}</div>
          <button className="text-xs border border-gray-300 rounded px-2 py-1 mb-2">View Shop</button>
          <div className="flex items-center gap-6 mb-2">
            <span className="text-blue-400 font-bold">{productDetails.sold}</span> <span className="text-gray-500">Sold</span>
            <span className="text-blue-400 font-bold">{productDetails.soldOut}</span> <span className="text-gray-500">Sold Out</span>
          </div>
          <div className="flex items-center gap-2 mb-2">
            <button className="text-pink-400 flex items-center gap-1 text-sm"><svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 15l7-7 7 7" /></svg>Add to Favorites</button>
          </div>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-pink-400 font-bold">{'★'.repeat(Math.floor(productDetails.rating))}</span>
            <span className="text-gray-600">{productDetails.rating.toFixed(1)}/5.0</span>
          </div>
          <button className="w-full bg-[#F88379] hover:bg-[#F88379]/90 text-white font-bold py-3 rounded-xl shadow mb-4">Buy Now</button>
          <div className="text-lg font-semibold mb-1">Product Description:</div>
          <div className="bg-blue-50 rounded-xl p-4 text-gray-700 whitespace-pre-line text-sm">
            {productDetails.description}
          </div>
        </div>
      </div>
    </div>
  );
} 