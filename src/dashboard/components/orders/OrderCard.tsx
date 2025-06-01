import React, { useState } from 'react';
import type { Order } from '../../types/order.types';
import StarRatingButton from '../StarRatingButton';
import { format } from 'date-fns';

interface OrderCardProps {
  order: Order;
  onPickup: (orderId: string) => Promise<void>;
  onCancel: (orderId: string) => Promise<void>;
  onContactSeller: (sellerId: string) => void;
  onRate: (orderId: string, rating: number) => Promise<void>;
  isCancelling: boolean;
  ratingLoading: boolean;
  canCancel: boolean;
}

export const OrderCard: React.FC<OrderCardProps> = ({
  order,
  onPickup,
  onCancel,
  onContactSeller,
  onRate,
  isCancelling,
  ratingLoading,
  canCancel,
}) => {
  const [currentRating, setCurrentRating] = useState(order.rating || 0);

  const handleRate = async (rating: number) => {
    if (onRate) {
      setCurrentRating(rating);
      try {
        await onRate(order.id, rating);
      } catch (error) {
        console.error('Error rating order:', error);
      }
    }
  };

  return (
    <div key={order.id} className="bg-white rounded-2xl shadow p-6">
      <div className="flex items-center gap-4">
        <img 
          src={order.productImage} 
          alt={order.productName} 
          className="w-16 h-16 rounded-full object-cover" 
        />
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">{order.productName}</h3>
              <p className="text-sm text-gray-600">Seller: {order.sellerName}</p>
            </div>
            <span className="text-sm text-gray-500">
              {order.createdAt.toLocaleDateString()} {order.createdAt.toLocaleTimeString()}
            </span>
          </div>

          <div className="mt-2">
            <p className="text-sm text-gray-600">
              Status: <span className="font-medium">{order.status}</span>
            </p>
            <p className="text-sm text-gray-600">
              Pickup: {order.pickupDate} at {order.pickupTime}
            </p>
            <p className="text-sm text-gray-600">
              Location: {order.schoolLocation}
            </p>
            <p className="text-sm text-gray-600">
              Quantity: {order.quantity}
            </p>
            <p className="text-sm font-medium text-gray-800 mt-1">
              Total: ₱{order.totalAmount.toFixed(2)}
            </p>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {order.status === 'Ready for pickup' && (
              <button
                onClick={() => onPickup(order.id)}
                className="px-4 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-medium hover:bg-green-200 transition-colors"
              >
                Mark as Picked Up
              </button>
            )}

            {canCancel && (
              <button
                onClick={() => onCancel(order.id)}
                disabled={isCancelling}
                className="px-4 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors disabled:opacity-50"
              >
                {isCancelling ? 'Cancelling...' : 'Cancel Order'}
              </button>
            )}

            <button
              onClick={() => onContactSeller(order.sellerId)}
              className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors"
            >
              Contact Seller
            </button>
          </div>

          {order.status === 'Completed' && !order.isRated && (
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-2">Rate your order:</p>
              <StarRatingButton
                value={currentRating}
                onChange={handleRate}
                size={24}
                className={ratingLoading ? 'opacity-50' : ''}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
