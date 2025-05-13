import React from 'react';
import uniformImg from '../../assets/ustp thingS/Product.png';
import ProductCard from '../components/ProductCard';

const recentlyViewedProducts = [
  {
    id: 1,
    name: 'Uniform Set USTP (Female) ...',
    price: '₱1,000,000',
    image: uniformImg,
    liked: false,
  },
  {
    id: 2,
    name: 'Item 2 [Desc]',
    price: '₱1,000,000',
    image: 'https://static.wikia.nocookie.net/spongebob/images/7/7e/Nat_Peterson_29.png',
    liked: false,
  },
];

export default function RecentlyViewed() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
      {recentlyViewedProducts.map((item) => (
        <ProductCard
          key={item.id}
          product={item}
          onClick={() => {}}
          onLikeChange={(liked) => {
            console.log('Product liked:', item.id, liked);
          }}
        />
      ))}
    </div>
  );
} 