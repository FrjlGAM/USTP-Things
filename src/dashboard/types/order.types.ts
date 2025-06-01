export type OrderStatus = 'Processing' | 'Ready for pickup' | 'Completed' | 'Cancelled';

export interface OrderData {
  userId: string;
  sellerId: string;
  productId: string;
  status: OrderStatus;
  schoolLocation: string;
  pickupDate: string;
  pickupTime: string;
  paymentMethod: string;
  quantity: number;
  totalAmount: number;
  createdAt: { toDate: () => Date };
  productName: string;
  productImage: string;
  rating?: number;
  isRated?: boolean;
}

export interface Order extends Omit<OrderData, 'createdAt'> {
  id: string;
  createdAt: Date;
  sellerName?: string;
  sellerAvatar?: string;
}

export interface OrderCardProps {
  order: Order;
  onPickup: (orderId: string) => Promise<void>;
  onCancel: (orderId: string) => Promise<void>;
  onContactSeller: (sellerId: string) => void;
  onRate: (orderId: string, rating: number) => Promise<void>;
  isCancelling: boolean;
  ratingLoading: boolean;
  canCancel: boolean;
}
