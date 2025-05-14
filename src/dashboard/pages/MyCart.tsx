import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import ProductDetail from './ProductDetail';
import { db, auth } from '../../lib/firebase';
import { doc, getDoc, setDoc, arrayRemove } from 'firebase/firestore';

export default function MyCart() {
  const [products, setProducts] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    const fetchCartProducts = async () => {
      console.log('Fetching cart products...');
      if (auth.currentUser) {
        console.log('User is logged in:', auth.currentUser.uid);
        const userRef = doc(db, 'users', auth.currentUser.uid);
        const userDoc = await getDoc(userRef);
        
        if (userDoc.exists()) {
          const userData = userDoc.data();
          const cartProductIds = userData.cartProducts || [];
          console.log('Cart product IDs:', cartProductIds);
          
          // Fetch product details for each cart product
          const productsPromises = cartProductIds.map(async (productId: string) => {
            console.log('Fetching product:', productId);
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
          console.log('Fetched products:', productsList);
          setProducts(productsList);
        } else {
          console.log('User document does not exist');
        }
      } else {
        console.log('No user is logged in');
      }
    };

    fetchCartProducts();
  }, []);

  useEffect(() => {
    const checkVerification = async () => {
      if (auth.currentUser) {
        const userRef = doc(db, 'users', auth.currentUser.uid);
        const userDoc = await getDoc(userRef);
        setIsVerified(Boolean(userDoc.exists() && userDoc.data().isVerified));
      }
    };
    checkVerification();
  }, []);

  const handleProductView = (product: any) => {
    setSelectedProduct(product);
  };

  const handleRemoveFromCart = async (product: any) => {
    if (auth.currentUser) {
      const userRef = doc(db, 'users', auth.currentUser.uid);
      await setDoc(userRef, {
        cartProducts: arrayRemove(product.id)
      }, { merge: true });
      
      // Update local state
      setProducts(prevProducts => prevProducts.filter(p => p.id !== product.id));
    }
  };

  if (selectedProduct) {
    return (
      <div className="flex flex-wrap gap-8">
        <ProductDetail 
          product={selectedProduct} 
          onClose={() => setSelectedProduct(null)}
          onAddToCart={() => {}} // Empty function since we're in cart view
          isVerified={isVerified}
        />
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center text-gray-500 mt-8">
        Your cart is empty. Add products to your cart to see them here.
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
          onLikeChange={(liked) => {
            if (!liked) {
              handleRemoveFromCart(product);
            }
          }}
        />
      ))}
    </div>
  );
} 