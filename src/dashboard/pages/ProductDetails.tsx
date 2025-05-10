import React from 'react';

interface ProductDetailsProps {
  product: {
    id: number;
    name: string;
    price: string;
    image: string;
  };
  onBack: () => void;
}

export function ProductDetails({ product, onBack }: ProductDetailsProps) {
  return (
    <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-lg p-8 relative animate-fade-in-scale">
      <button onClick={onBack} className="absolute top-4 right-4 text-gray-400 hover:text-pink-400 text-2xl font-bold">×</button>
      <img src={product.image} alt={product.name} className="w-64 h-64 object-cover rounded-xl mx-auto mb-6" />
      <h2 className="text-2xl font-bold mb-2 text-center">{product.name}</h2>
      <div className="text-pink-500 font-semibold text-xl mb-4 text-center">{product.price}</div>
      {/* Example product description, you can customize this per product */}
      {product.id === 1 ? (
        <>
          <div className="text-gray-700 mb-4 text-center">
            Complete USTP college uniform set for female students, includes:
            <ul className="list-disc list-inside text-left mt-2">
              <li>White Blouse: With USTP logo (Size: Medium)</li>
              <li>Black Skirt: Waist - 28", Length - Knee-length</li>
              <li>USTP Necktie</li>
            </ul>
          </div>
          <div className="mb-4">
            <div className="flex items-center gap-2 text-green-600 font-semibold mb-1">✅ Barely used and in excellent condition</div>
            <div className="flex items-center gap-2 text-green-600 font-semibold mb-1">✅ No stains, tears, or damages</div>
            <div className="flex items-center gap-2 text-green-600 font-semibold">✅ Ideal for students looking for an affordable and well-maintained uniform</div>
          </div>
        </>
      ) : (
        <div className="text-gray-700 mb-4 text-center">No additional details available.</div>
      )}
      <div className="mt-6">
        <button className="w-full bg-pink-400 hover:bg-pink-500 text-white font-bold py-3 rounded-xl transition">Buy Now</button>
      </div>
    </div>
  );
}
