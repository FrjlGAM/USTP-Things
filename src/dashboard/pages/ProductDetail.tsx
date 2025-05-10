import React, { useState } from 'react';

type ProductDetailProps = {
  product: {
    image: string;
    name: string;
    price: string;
    // Add other fields as needed
  };
  onBack: () => void;
};

function ProductDetail({ product, onBack }: ProductDetailProps) {
  return (
    <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-lg p-8 relative">
      <button onClick={onBack} className="absolute top-4 right-4 text-gray-400 hover:text-pink-400 text-2xl font-bold">×</button>
      <img src={product.image} alt={product.name} className="w-64 h-64 object-cover rounded-xl mx-auto mb-6" />
      <h2 className="text-2xl font-bold mb-2">{product.name}</h2>
      <div className="text-pink-500 font-semibold text-xl mb-4">{product.price}</div>
      {/* Add your product description and details here */}
      <div className="mt-4">
        <button className="w-full bg-pink-400 hover:bg-pink-500 text-white font-bold py-3 rounded-xl transition">Buy Now</button>
      </div>
    </div>
  );
}

export default ProductDetail;
