import React from 'react';
import uniformImg from '../../assets/ustp thingS/Product.png';
import HeartButton from '../components/HeartButton';

const likedProducts = [
  {
    id: 1,
    name: 'Uniform Set USTP (Female) ...',
    price: '₱1,000,000',
    image: uniformImg,
    liked: true,
  },
  {
    id: 2,
    name: 'Item 2 [Desc]',
    price: '₱1,000,000',
    image: 'https://static.wikia.nocookie.net/spongebob/images/7/7e/Nat_Peterson_29.png',
    liked: true,
  },
];

export default function MyLikes() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
      {likedProducts.map((item) => (
        <div
          key={item.id}
          className="bg-white rounded-2xl shadow p-4 flex flex-col items-center border-2 border-gray-100 hover:shadow-lg transition cursor-pointer relative"
        >
          <div className="absolute top-4 right-4 z-10">
            <HeartButton 
              initialLiked={item.liked}
              onLikeChange={(liked) => {
                console.log('Product liked:', item.id, liked);
              }}
            />
          </div>
          <img src={item.image} alt={item.name} className="w-48 h-48 object-cover rounded-xl mb-4" />
          <h3 className="text-lg font-semibold text-gray-800 mb-2">{item.name}</h3>
          <p className="text-[#F88379] font-bold">{item.price}</p>
        </div>
      ))}
    </div>
  );
} 