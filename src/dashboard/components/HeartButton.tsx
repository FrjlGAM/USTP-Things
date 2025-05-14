import React, { useState, useEffect } from 'react';
import heartIcon from '../../assets/ustp thingS/Heart.png';
import heartFilledIcon from '../../assets/ustp thingS/Heart filled.png';
import { db, auth } from '../../lib/firebase';
import { doc, getDoc, setDoc, arrayUnion, arrayRemove } from 'firebase/firestore';

interface HeartButtonProps {
  initialLiked?: boolean;
  onLikeChange?: (liked: boolean) => void;
  className?: string;
  productId?: string | number;
}

export default function HeartButton({ initialLiked = false, onLikeChange, className = '', productId }: HeartButtonProps) {
  const [isLiked, setIsLiked] = useState(initialLiked);

  // Sync with Firestore
  useEffect(() => {
    const checkLikedStatus = async () => {
      if (auth.currentUser && productId) {
        const userRef = doc(db, 'users', auth.currentUser.uid);
        const userDoc = await getDoc(userRef);
        
        if (userDoc.exists()) {
          const userData = userDoc.data();
          const likedProducts = userData.likedProducts || [];
          setIsLiked(likedProducts.includes(productId));
        }
      }
    };

    checkLikedStatus();
  }, [productId]);

  const handleClick = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event from bubbling up
    
    if (!auth.currentUser || !productId) return;

    const newLikedState = !isLiked;
    setIsLiked(newLikedState);
    
    // Update Firestore
    const userRef = doc(db, 'users', auth.currentUser.uid);
    if (newLikedState) {
      await setDoc(userRef, {
        likedProducts: arrayUnion(productId)
      }, { merge: true });
    } else {
      await setDoc(userRef, {
        likedProducts: arrayRemove(productId)
      }, { merge: true });
    }

    // Call the parent's onLikeChange callback
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