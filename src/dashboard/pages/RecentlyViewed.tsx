import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import ProductDetail from './ProductDetail';
import { db, auth } from '../../lib/firebase';
import { doc, getDoc, setDoc, arrayUnion, arrayRemove } from 'firebase/firestore';

export default function RecentlyViewed() {
  const [products, setProducts] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  useEffect(() => {
    const fetchRecentlyViewed = async () => {
      if (auth.currentUser) {
        const userRef = doc(db, 'users', auth.currentUser.uid);
        const userDoc = await getDoc(userRef);
        
        if (userDoc.exists()) {
          const userData = userDoc.data();
          const recentlyViewedIds = userData.recentlyViewed || [];
          
          // Fetch product details for each recently viewed product
          const productsPromises = recentlyViewedIds.map(async (productId: string) => {
            const productRef = doc(db, 'products', productId);
            const productDoc = await getDoc(productRef);
            if (productDoc.exists()) {
              return {
                id: productDoc.id,
                ...productDoc.data()
              };
            }
            return null;
          });
          
          const productsList = (await Promise.all(productsPromises)).filter(Boolean);
          setProducts(productsList);
        }
      }
    };

    fetchRecentlyViewed();
  }, []);

  const handleProductView = (product: any) => {
    setSelectedProduct(product);
  };

  const handleLikeChange = async (product: any, liked: boolean) => {
    if (auth.currentUser) {
      const userRef = doc(db, 'users', auth.currentUser.uid);
      if (liked) {
        await setDoc(userRef, {
          likedProducts: arrayUnion(product.id)
        }, { merge: true });
      } else {
        await setDoc(userRef, {
          likedProducts: arrayRemove(product.id)
        }, { merge: true });
      }
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
        No recently viewed products. Click on products to view their details.
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-8">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onClick={() => handleProductView(product)}
          onLikeChange={(liked) => handleLikeChange(product, liked)}
        />
      ))}
    </div>
  );
} 