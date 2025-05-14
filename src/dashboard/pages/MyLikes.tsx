import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import ProductDetail from './ProductDetail';
import { db, auth } from '../../lib/firebase';
import { doc, getDoc, setDoc, arrayRemove } from 'firebase/firestore';

interface MyLikesProps {
  onProductClick?: (product: any) => void;
}

export default function MyLikes({ onProductClick }: MyLikesProps) {
  const [products, setProducts] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  useEffect(() => {
    const fetchLikedProducts = async () => {
      if (auth.currentUser) {
        const userRef = doc(db, 'users', auth.currentUser.uid);
        const userDoc = await getDoc(userRef);
        
        if (userDoc.exists()) {
          const userData = userDoc.data();
          const likedProductIds = userData.likedProducts || [];
          
          // Fetch product details for each liked product
          const productsPromises = likedProductIds.map(async (productId: string) => {
            const productRef = doc(db, 'products', productId);
            const productDoc = await getDoc(productRef);
            if (productDoc.exists()) {
              return {
                id: productDoc.id,
                ...productDoc.data(),
                liked: true // Set liked to true since these are liked products
              };
            }
            return null;
          });
          
          const productsList = (await Promise.all(productsPromises)).filter(Boolean);
          setProducts(productsList);
        }
      }
    };

    fetchLikedProducts();
  }, []);

  const handleProductView = (product: any) => {
    setSelectedProduct(product);
  };

  const handleUnlike = async (product: any) => {
    if (auth.currentUser) {
      const userRef = doc(db, 'users', auth.currentUser.uid);
      await setDoc(userRef, {
        likedProducts: arrayRemove(product.id)
      }, { merge: true });
      
      // Update local state
      setProducts(prevProducts => prevProducts.filter(p => p.id !== product.id));
    }
  };

  if (selectedProduct) {
    return (
      <div className="flex flex-wrap gap-8">
        <ProductDetail product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center text-gray-500 mt-8">
        No liked products yet. Click the heart icon on products to add them to your likes.
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-8">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onClick={() => onProductClick?.(product)}
          onLikeChange={(liked) => {
            if (!liked) {
              handleUnlike(product);
            }
          }}
        />
      ))}
    </div>
  );
} 