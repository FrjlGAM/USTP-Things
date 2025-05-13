import React from 'react';
import HeartButton from './HeartButton';

interface ProductCardProps {
  product: {
    id: number;
    name: string;
    price: string;
    image: string;
    liked?: boolean;
  };
  onClick?: () => void;
  onLikeChange?: (liked: boolean) => void;
}

export default function ProductCard({ product, onClick, onLikeChange }: ProductCardProps) {
  return (
    <div
      style={{
        width: 306,
        height: 346,
        position: 'relative',
        opacity: 0.8,
        overflow: 'hidden',
        borderRadius: 25,
        outline: '3px rgba(230,230,230,0.8) solid',
        outlineOffset: -3,
        background: 'white',
        cursor: 'pointer',
      }}
      onClick={onClick}
    >
      <img
        src={product.image}
        alt={product.name}
        style={{
          width: 240,
          height: 240,
          left: 33,
          top: 27,
          position: 'absolute',
          borderRadius: 20,
          objectFit: 'cover',
        }}
      />
      <div
        style={{
          width: 223,
          height: 31,
          left: 33,
          top: 276,
          position: 'absolute',
          color: 'black',
          fontSize: 20,
          fontFamily: 'Inria Sans, sans-serif',
          fontWeight: 700,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
        title={product.name}
      >
        {product.name}
      </div>
      <div
        style={{
          width: 129,
          height: 25,
          left: 33,
          top: 303,
          position: 'absolute',
          color: '#F88379',
          fontSize: 20,
          fontFamily: 'Inria Sans, sans-serif',
          fontWeight: 700,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {product.price}
      </div>
      <div
        style={{
          width: 28,
          height: 28,
          left: 245,
          top: 290,
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onClick={e => { e.stopPropagation(); }}
      >
        <HeartButton
          initialLiked={product.liked}
          onLikeChange={onLikeChange}
        />
      </div>
    </div>
  );
} 