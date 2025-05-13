import React, { useState } from 'react';
import heartIcon from '../../assets/ustp thingS/Heart.png';
import heartFilledIcon from '../../assets/ustp thingS/Heart filled.png';

interface HeartButtonProps {
  initialLiked?: boolean;
  onLikeChange?: (liked: boolean) => void;
  className?: string;
}

export default function HeartButton({ initialLiked = false, onLikeChange, className = '' }: HeartButtonProps) {
  const [isLiked, setIsLiked] = useState(initialLiked);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event from bubbling up
    const newLikedState = !isLiked;
    setIsLiked(newLikedState);
    onLikeChange?.(newLikedState);
  };

  return (
    <button 
      onClick={handleClick}
      className={`focus:outline-none transition-transform hover:scale-110 ${className}`}
    >
      <img 
        src={isLiked ? heartFilledIcon : heartIcon} 
        alt={isLiked ? "Unlike" : "Like"} 
        className="w-7 h-7"
      />
    </button>
  );
} 