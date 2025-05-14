import { useEffect, useState } from 'react';
import HeartButton from '../components/HeartButton';
import cartIcon from '../../assets/ustp thingS/Shopping cart.png';
import xIcon from '../../assets/ustp thingS/X button.png';

const productDetails = {
  description: [
    'White Blouse: With USTP logo (Size: Medium)',
    'Black Skirt: Waist - 28", Length - Knee-length',
    'USTP Necktie',
    'Barely used and in excellent condition',
    'No stains, tears, or damages',
    'Ideal for students looking for an affordable and well-maintained uniform',
  ],
  sold: 100,
  soldOut: 0,
  rating: 5.0,
};

interface ProductDetailProps {
  product: {
    id: string;
    name: string;
    price: string;
    image: string;
    description: string;
    category: string;
  };
  onClose: () => void;
  onAddToCart?: () => void;
}

export default function ProductDetail({ product, onClose, onAddToCart }: ProductDetailProps) {
  const [isLiked, setIsLiked] = useState(false);

  // Load liked state from localStorage
  useEffect(() => {
    const savedLikes = localStorage.getItem('likedProducts');
    if (savedLikes) {
      const likedProducts = JSON.parse(savedLikes);
      setIsLiked(likedProducts.some((p: { id: string }) => p.id === product.id));
    }
  }, [product.id]);

  const handleLikeChange = (liked: boolean) => {
    setIsLiked(liked);
    
    // Update localStorage
    const savedLikes = localStorage.getItem('likedProducts');
    let likedProducts = savedLikes ? JSON.parse(savedLikes) : [];
    
    if (liked) {
      // Add to liked products if not already present
      if (!likedProducts.some((p: { id: string }) => p.id === product.id)) {
        likedProducts.push(product);
      }
    } else {
      // Remove from liked products
      likedProducts = likedProducts.filter((p: { id: string }) => p.id !== product.id);
    }
    
    localStorage.setItem('likedProducts', JSON.stringify(likedProducts));
    // Trigger storage event for MyLikes component
    window.dispatchEvent(new Event('storage'));
  };

  return (
    <div className="w-full bg-white rounded-2xl shadow p-4 md:pl-10 md:pr-16 md:py-10 relative">
      {/* X Button */}
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-0 p-1 rounded-full hover:bg-gray-100 transition"
        >
          <img src={xIcon} alt="Close" className="w-8 h-8" />
        </button>
      )}
      <div className="flex flex-col md:flex-row gap-8">
        {/* Product Image Section */}
        <div className="flex flex-col items-center md:w-[420px]">
          <div className="bg-[#f7f6fd] rounded-2xl p-4 flex items-center justify-center w-full mb-4">
            <img src={product.image} alt={product.name} className="w-[320px] h-[320px] object-cover rounded-xl" />
          </div>
          {onAddToCart && (
            <button 
              onClick={onAddToCart}
              className="flex items-center justify-center gap-2 w-full bg-[#FFB085] hover:bg-[#F88379] text-white font-bold py-3 rounded-xl shadow transition text-lg mt-2"
            >
              <img src={cartIcon} alt="Add to Cart" className="w-6 h-6" />
              Add to Cart
            </button>
          )}
        </div>
        {/* Product Details Section */}
        <div className="flex-1 flex flex-col justify-between pr-0 md:pr-6">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-tight pt-[10px]">{product.name.replace('...', '– Blouse, Skirt, and Necktie')}</h2>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl md:text-4xl font-bold text-[#F88379]">{product.price}</span>
              <button className="ml-3 text-sm border border-gray-300 rounded px-3 py-1 w-fit hover:bg-gray-50 transition">View Shop</button>
            </div>
            <div className="flex flex-col mb-4">
              <div className="flex items-center gap-3">
                <span className="text-xl text-blue-400 font-bold">{productDetails.sold}</span> <span className="text-xl text-gray-500">Sold</span>
              </div>
              <div className="flex items-center gap-3 mt-2">
                <span className="text-xl text-blue-400 font-bold">{productDetails.soldOut}</span> <span className="text-xl text-gray-500">Sold Out</span>
              </div>
            </div>
            <div className="flex items-center gap-3 mb-3">
              <HeartButton initialLiked={isLiked} onLikeChange={handleLikeChange} productId={product.id} />
              <span className="text-xl text-gray-500">Add to Favorites</span>
            </div>
            <div className="flex items-center gap-3 mb-8">
              <span className="text-[#F88379] text-2xl">{'★'.repeat(Math.floor(productDetails.rating))}</span>
              <span className="text-xl text-gray-600 font-semibold">{productDetails.rating.toFixed(1)}/5.0</span>
            </div>
          </div>
          {/* Buy Now button only */}
          <div className="flex mt-2">
            <button className="flex-1 bg-[#F88379] hover:bg-[#F88379]/90 text-white font-bold py-3 rounded-xl shadow transition text-lg">Buy Now</button>
          </div>
        </div>
      </div>
      {/* Product Description Full Width */}
      <div className="mt-8">
        <div className="text-md font-semibold mb-2">Product Description:</div>
        <div className="bg-blue-50 rounded-xl p-6 text-gray-700 text-sm">
          <ul className="list-disc pl-5 space-y-1">
            <li><span className="font-semibold">Complete USTP college uniform set for female students, includes:</span></li>
            {productDetails.description.slice(0,3).map((line, idx) => (
              <li key={idx}>{line}</li>
            ))}
          </ul>
          <ul className="mt-3 space-y-1">
            {productDetails.description.slice(3).map((line, idx) => (
              <li key={idx} className="flex items-center gap-2">
                <span className="text-green-500 text-lg">✔️</span>
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
} 