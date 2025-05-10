import React from 'react';

type ProductDetailProps = {
  product: {
    image: string;
    name: string;
    price: string;
    // Add other fields as needed
  };
  onBack: () => void;
};

const stats = {
  sold: 100,
  soldOut: 0,
  rating: 5.0,
};

const ProductDetail: React.FC<ProductDetailProps> = ({ product, onBack }) => (
  <div className="w-full h-full bg-white rounded-2xl shadow-lg p-8 relative max-w-4xl mx-auto mt-8">
    {/* Close Button */}
    <button
      onClick={onBack}
      className="absolute top-4 right-4 text-gray-400 hover:text-pink-400 text-3xl font-bold z-10"
      aria-label="Close"
    >
      ×
    </button>
    {/* Product Card */}
    <div className="flex flex-row gap-8">
      {/* Product Image */}
      <div className="flex-shrink-0 flex flex-col items-center">
        <img
          src={product.image}
          alt={product.name}
          className="w-56 h-56 object-cover rounded-xl border mb-4"
        />
        <button className="w-48 bg-orange-100 hover:bg-orange-200 text-orange-600 font-bold py-2 rounded-xl transition mb-2">
          Add to Cart
        </button>
      </div>
      {/* Product Info */}
      <div className="flex-1 flex flex-col">
        <h2 className="text-xl font-bold mb-2">{product.name}</h2>
        <div className="text-pink-500 font-bold text-2xl mb-2">{product.price}</div>
        <div className="flex items-center gap-4 mb-2">
          <span className="text-gray-500 text-sm">{stats.sold} Sold</span>
          <span className="text-gray-400 text-sm">{stats.soldOut} Sold Out</span>
        </div>
        <div className="flex items-center gap-2 mb-2">
          <button className="text-gray-400 hover:text-pink-400" title="Add to Favorites">
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </button>
          <span className="text-pink-500 font-semibold">{stats.rating}/5.0</span>
        </div>
        <button className="w-full bg-pink-400 hover:bg-pink-500 text-white font-bold py-3 rounded-xl transition mt-4">
          Buy Now
        </button>
      </div>
    </div>
    {/* Product Description */}
    <div className="mt-8">
      <h3 className="font-bold text-base mb-2">Product Description:</h3>
      <div className="bg-blue-100 rounded-xl p-4 text-gray-800">
        <div>Complete USTP college uniform set for female students, includes:</div>
        <ul className="list-disc list-inside ml-4 mt-2">
          <li>White Blouse: With USTP logo (Size: Medium)</li>
          <li>Black Skirt: Waist - 28&quot;, Length - Knee-length</li>
          <li>USTP Necktie</li>
        </ul>
        <div className="mt-3 flex flex-col gap-1">
          <div className="flex items-center gap-2 text-green-700 font-semibold">
            <span>✅</span> Barely used and in excellent condition
          </div>
          <div className="flex items-center gap-2 text-green-700 font-semibold">
            <span>✅</span> No stains, tears, or damages
          </div>
          <div className="flex items-center gap-2 text-green-700 font-semibold">
            <span>✅</span> Ideal for students looking for an affordable and well-maintained uniform
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default ProductDetail;
