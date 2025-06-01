import { useState, useEffect, useCallback } from 'react';
import { db } from '../../lib/firebase';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import type { Order, OrderData } from '../types/order.types';
import { auth } from '../../lib/firebase';

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [updatingOrders, setUpdatingOrders] = useState<Set<string>>(new Set());



  const updateOrderStatus = useCallback(async (orderId: string, status: Order['status']) => {
    setUpdatingOrders(prev => new Set(prev).add(orderId));
    try {
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, {
        status,
        ...(status === 'Completed' ? { completedAt: new Date() } : {})
      });
      
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId 
            ? { 
                ...order, 
                status,
                ...(status === 'Completed' ? { completedAt: new Date() } : {}) 
              } 
            : order
        )
      );
      return true;
    } catch (error) {
      console.error('Error updating order status:', error);
      return false;
    } finally {
      setUpdatingOrders(prev => {
        const newSet = new Set(prev);
        newSet.delete(orderId);
        return newSet;
      });
    }
  }, []);

  const rateOrder = useCallback(async (orderId: string, rating: number) => {
    try {
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, {
        rating,
        isRated: true
      });
      
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === orderId ? { ...order, rating, isRated: true } : order
        )
      );
      
      return true;
    } catch (error) {
      console.error('Error rating order:', error);
      throw error;
    }
  }, []);

  useEffect(() => {
    const loadOrders = async () => {
      if (!auth.currentUser?.uid) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const q = query(
          collection(db, 'orders'),
          where('userId', '==', auth.currentUser.uid)
        );
        
        const querySnapshot = await getDocs(q);
        const ordersList: Order[] = [];
        
        querySnapshot.forEach((docSnap) => {
          const data = docSnap.data() as OrderData;
          ordersList.push({
            id: docSnap.id,
            ...data,
            createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(),
          });
        });
        
        setOrders(ordersList);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch orders'));
      } finally {
        setLoading(false);
      }
    };
    
    loadOrders();
    
    // Set up real-time updates if needed
    const unsubscribe = () => {}; // Implement real-time updates if needed
    
    return () => {
      unsubscribe();
    };
  }, []);

  return {
    orders,
    loading,
    error,
    updateOrderStatus,
    rateOrder,
    isUpdating: (orderId: string) => updatingOrders.has(orderId),
  };
};
