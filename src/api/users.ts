import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  arrayUnion, 
  arrayRemove,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../lib/firebase/config';
import { User, UserProfile, UserPreferences, UserAddress } from '../types/user';

const USERS_COLLECTION = 'users';

export const userService = {
  // Get user profile
  getUserProfile: async (userId: string): Promise<UserProfile | null> => {
    try {
      const docRef = doc(db, USERS_COLLECTION, userId);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        return null;
      }
      
      return { 
        uid: docSnap.id, 
        ...docSnap.data() 
      } as UserProfile;
    } catch (error) {
      console.error('Error getting user profile:', error);
      throw new Error('Failed to fetch user profile');
    }
  },

  // Create or update user profile
  updateUserProfile: async (userId: string, data: Partial<UserProfile>): Promise<void> => {
    try {
      const userRef = doc(db, USERS_COLLECTION, userId);
      await setDoc(
        userRef, 
        { 
          ...data, 
          updatedAt: serverTimestamp() 
        },
        { merge: true }
      );
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw new Error('Failed to update user profile');
    }
  },

  // Update user preferences
  updateUserPreferences: async (userId: string, preferences: Partial<UserPreferences>): Promise<void> => {
    try {
      const userRef = doc(db, USERS_COLLECTION, userId);
      await updateDoc(userRef, {
        'preferences': {
          ...preferences
        },
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating user preferences:', error);
      throw new Error('Failed to update user preferences');
    }
  },

  // Add or update user address
  updateUserAddress: async (userId: string, address: UserAddress): Promise<void> => {
    try {
      const userRef = doc(db, USERS_COLLECTION, userId);
      
      // If it's the default address, unset default for all other addresses
      if (address.isDefault) {
        const userDoc = await getDoc(userRef);
        const userData = userDoc.data();
        const updatedAddresses = userData?.addresses?.map((addr: UserAddress) => ({
          ...addr,
          isDefault: false
        })) || [];
        
        // Update the current address
        const addressIndex = updatedAddresses.findIndex((a: UserAddress) => a.id === address.id);
        if (addressIndex >= 0) {
          updatedAddresses[addressIndex] = address;
        } else {
          updatedAddresses.push(address);
        }
        
        await updateDoc(userRef, {
          addresses: updatedAddresses,
          updatedAt: serverTimestamp()
        });
      } else {
        // Just update the address without changing default status
        await updateDoc(userRef, {
          addresses: arrayUnion(address),
          updatedAt: serverTimestamp()
        });
      }
    } catch (error) {
      console.error('Error updating user address:', error);
      throw new Error('Failed to update user address');
    }
  },

  // Add product to user's cart
  addToCart: async (userId: string, productId: string): Promise<void> => {
    try {
      const userRef = doc(db, USERS_COLLECTION, userId);
      await updateDoc(userRef, {
        cartItems: arrayUnion(productId),
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw new Error('Failed to add item to cart');
    }
  },

  // Remove product from user's cart
  removeFromCart: async (userId: string, productId: string): Promise<void> => {
    try {
      const userRef = doc(db, USERS_COLLECTION, userId);
      await updateDoc(userRef, {
        cartItems: arrayRemove(productId),
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error removing from cart:', error);
      throw new Error('Failed to remove item from cart');
    }
  },

  // Add product to user's wishlist
  addToWishlist: async (userId: string, productId: string): Promise<void> => {
    try {
      const userRef = doc(db, USERS_COLLECTION, userId);
      await updateDoc(userRef, {
        wishlist: arrayUnion(productId),
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      throw new Error('Failed to add item to wishlist');
    }
  },

  // Remove product from user's wishlist
  removeFromWishlist: async (userId: string, productId: string): Promise<void> => {
    try {
      const userRef = doc(db, USERS_COLLECTION, userId);
      await updateDoc(userRef, {
        wishlist: arrayRemove(productId),
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      throw new Error('Failed to remove item from wishlist');
    }
  },

  // Add product to recently viewed
  addToRecentlyViewed: async (userId: string, productId: string): Promise<void> => {
    try {
      const userRef = doc(db, USERS_COLLECTION, userId);
      const userDoc = await getDoc(userRef);
      let recentlyViewed = userDoc.data()?.recentlyViewed || [];
      
      // Remove if already exists to avoid duplicates
      recentlyViewed = recentlyViewed.filter((id: string) => id !== productId);
      // Add to beginning of array
      recentlyViewed.unshift(productId);
      // Keep only the last 10 items
      if (recentlyViewed.length > 10) {
        recentlyViewed = recentlyViewed.slice(0, 10);
      }
      
      await updateDoc(userRef, {
        recentlyViewed,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating recently viewed:', error);
      // Don't throw error for this non-critical operation
    }
  },

  // Request verification
  requestVerification: async (userId: string): Promise<void> => {
    try {
      const userRef = doc(db, USERS_COLLECTION, userId);
      await updateDoc(userRef, {
        verificationRequested: true,
        verificationRequestedAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error requesting verification:', error);
      throw new Error('Failed to request verification');
    }
  }
};
