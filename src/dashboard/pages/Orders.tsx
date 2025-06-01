import { useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import type { Order } from '../types/order.types';
import { useOrders } from '../hooks/useOrders';
import { OrderCard } from '../components/orders/OrderCard';
import Sidebar from '../components/Sidebar';
import ustpLogo from '../../assets/ustp-things-logo.png';

const Orders: React.FC = () => {
  const [cancellingOrder, setCancellingOrder] = useState<string | null>(null);
  const [ratingLoading, setRatingLoading] = useState<{ [orderId: string]: boolean }>({});
  const navigate = useNavigate();
  const location = useLocation();
  const isStandalone = location.pathname === '/dashboard/orders';

  const isWithinCancellationWindow = (orderDate: Date) => {
    const now = new Date();
    const hourInMs = 60 * 60 * 1000;
    return (now.getTime() - orderDate.getTime()) <= hourInMs;
  };

  const { 
    orders, 
    loading, 
    error,
    updateOrderStatus,
    rateOrder
  } = useOrders();

  const handlePickupNow = useCallback(async (orderId: string) => {
    try {
      await updateOrderStatus(orderId, 'Completed');
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  }, [updateOrderStatus]);

  const handleCancelOrder = useCallback(async (orderId: string) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) {
      return;
    }
    
    setCancellingOrder(orderId);
    try {
      await updateOrderStatus(orderId, 'Cancelled');
    } catch (error) {
      console.error('Error cancelling order:', error);
      alert('Failed to cancel order. Please try again.');
    } finally {
      setCancellingOrder(null);
    }
  }, [updateOrderStatus]);

  const handleContactSeller = useCallback((sellerId: string) => {
    navigate(`/dashboard/messages/${sellerId}`);
  }, [navigate]);

  const handleRateOrder = useCallback(async (orderId: string, rating: number) => {
    setRatingLoading(prev => ({ ...prev, [orderId]: true }));
    try {
      await rateOrder(orderId, rating);
    } catch (error) {
      console.error('Error rating order:', error);
      alert('Failed to submit rating. Please try again.');
    } finally {
      setRatingLoading(prev => ({ ...prev, [orderId]: false }));
    }
  }, [rateOrder]);

  const renderOrderCard = (order: Order) => (
    <OrderCard
      key={order.id}
      order={order}
      onPickup={handlePickupNow}
      onCancel={handleCancelOrder}
      onContactSeller={handleContactSeller}
      onRate={handleRateOrder}
      isCancelling={cancellingOrder === order.id}
      ratingLoading={ratingLoading[order.id] || false}
      canCancel={order.status === 'Processing' && isWithinCancellationWindow(order.createdAt)}
    />
  );


  if (error) {
    return (
      <div className="p-4 text-red-600">
        Error loading orders: {error.message}
      </div>
    );
  }
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#F88379]"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#f7f6fd]">
      {isStandalone && (
        <div className="w-[348px] flex-shrink-0">
          <Sidebar
            onHomeClick={() => navigate('/dashboard')}
            onLikesClick={() => navigate('/dashboard/likes')}
            onRecentlyClick={() => navigate('/dashboard/recently-viewed')}
            onOrdersClick={() => navigate('/dashboard/orders')}
            onRateClick={() => navigate('/dashboard/to-rate')}
            onMessageClick={() => navigate('/dashboard/messages')}
            activeButton="orders"
          />
        </div>
      )}

      <main className="flex-1 flex flex-col">
        <header className="flex items-center justify-between px-8 py-4 bg-white shadow">
          <div className="flex items-center gap-4">
            <img src={ustpLogo} alt="USTP Things Logo" className="w-32" />
            <h1 className="text-2xl font-bold text-gray-800">My Orders</h1>
          </div>
        </header>

        <div className="flex-1 p-6 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#F88379]"></div>
            </div>
          ) : error ? (
            <div className="p-4 text-red-600">
              Error loading orders: {error}
            </div>
          ) : orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <p className="text-lg mb-4">You don't have any orders yet.</p>
              <button
                onClick={() => navigate('/dashboard')}
                className="px-6 py-2 bg-[#F88379] text-white rounded-lg hover:bg-[#F88379]/90 transition"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map(renderOrderCard)}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Orders;
