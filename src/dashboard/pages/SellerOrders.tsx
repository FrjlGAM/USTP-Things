import Sidebar from '../components/Sidebar';
import ustpLogo from '../../assets/ustp-things-logo.png';
import userAvatar from '../../assets/ustp thingS/Person.png';
import leftArrow from '../../assets/ustp thingS/LeftArrow.png';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { db, auth } from '../../lib/firebase';
import { collection, query, where, getDocs, doc, getDoc, updateDoc } from 'firebase/firestore';

interface SellerData {
  businessName: string;
  avatar?: string;
}

interface ProductData {
  name: string;
}

interface OrderData {
  userId: string;
  sellerId: string;
  productId: string;
  status: 'Processing' | 'Ready for pickup' | 'Completed' | 'Cancelled';
  schoolLocation: string;
  pickupDate: string;
  pickupTime: string;
  paymentMethod: string;
  quantity: number;
  totalAmount: number;
  createdAt: { toDate: () => Date };
  productName: string;
  productImage: string;
}

interface Order {
  id: string;
  sellerId: string;
  productId: string;
  status: 'Processing' | 'Ready for pickup' | 'Completed' | 'Cancelled';
  schoolLocation: string;
  pickupDate: string;
  pickupTime: string;
  paymentMethod: string;
  quantity: number;
  totalAmount: number;
  createdAt: Date;
  productName: string;
  productImage: string;
  sellerName?: string;
  sellerAvatar?: string;
}

export default function SellerOrders() {
  const [showModal, setShowModal] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingOrder, setCancellingOrder] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const isStandalone = location.pathname === '/dashboard/seller-orders';

  useEffect(() => {
    const fetchOrders = async () => {
      if (!auth.currentUser) return;

      try {
        // Query all orders for the current seller
        const ordersQuery = query(
          collection(db, 'pickupOrders'),
          where('sellerId', '==', auth.currentUser.uid)
        );
        
        const querySnapshot = await getDocs(ordersQuery);
        const fetchedOrders: Order[] = [];

        // Fetch additional details for each order
        for (const docSnapshot of querySnapshot.docs) {
          const orderData = docSnapshot.data() as OrderData;
          
          // Get seller details
          const sellerDoc = await getDoc(doc(db, 'users', orderData.sellerId));
          const sellerData = sellerDoc.exists() ? sellerDoc.data() as SellerData : null;

          fetchedOrders.push({
            id: docSnapshot.id,
            sellerId: orderData.sellerId,
            productId: orderData.productId,
            status: orderData.status,
            schoolLocation: orderData.schoolLocation,
            pickupDate: orderData.pickupDate,
            pickupTime: orderData.pickupTime,
            paymentMethod: orderData.paymentMethod,
            quantity: orderData.quantity,
            totalAmount: orderData.totalAmount,
            createdAt: orderData.createdAt?.toDate() || new Date(),
            productName: orderData.productName,
            productImage: orderData.productImage,
            sellerName: sellerData?.businessName || 'Unknown Seller',
            sellerAvatar: sellerData?.avatar || userAvatar
          });
        }

        // Sort orders by date, most recent first
        fetchedOrders.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        setOrders(fetchedOrders);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handlePickupNow = async (orderId: string) => {
    try {
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, {
        status: 'Completed',
        completedAt: new Date()
      });
      
      // Update local state
      setOrders(prevOrders => 
        prevOrders.filter(order => order.id !== orderId)
      );
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) {
      return;
    }

    setCancellingOrder(orderId);
    try {
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, {
        status: 'Cancelled',
        cancelledAt: new Date()
      });
      
      // Update local state
      setOrders(prevOrders => 
        prevOrders.filter(order => order.id !== orderId)
      );
      alert('Order cancelled successfully');
    } catch (error) {
      console.error('Error cancelling order:', error);
      alert('Failed to cancel order. Please try again.');
    } finally {
      setCancellingOrder(null);
    }
  };

  const handleContactBuyer = (userId: string) => {
    navigate(`/dashboard/messages/${userId}`);
  };

  // Sidebar navigation handler
  const handleSidebarNav = (view: 'home' | 'likes' | 'recently' | 'seller-orders' | 'rate' | 'message') => {
    switch (view) {
      case 'home':
        navigate('/dashboard');
        break;
      case 'likes':
        navigate('/dashboard/likes');
        break;
      case 'recently':
        navigate('/dashboard/recently-viewed');
        break;
      case 'seller-orders':
        navigate('/dashboard/seller-orders');
        break;
      case 'rate':
        navigate('/dashboard/to-rate');
        break;
      case 'message':
        navigate('/dashboard/messages');
        break;
    }
  };

  const isWithinCancellationWindow = (orderDate: Date) => {
    const now = new Date();
    const hourInMilliseconds = 60 * 60 * 1000; // 1 hour in milliseconds
    const timeDifference = now.getTime() - orderDate.getTime();
    return timeDifference <= hourInMilliseconds;
  };

  const renderOrderCard = (order: Order) => {
    const canCancel = order.status === 'Processing' && isWithinCancellationWindow(order.createdAt);
    
    return (
      <div key={order.id} className="bg-white rounded-2xl shadow p-6">
        <div className="flex items-center gap-4">
          <img src={order.productImage} alt={order.productName} className="w-16 h-16 rounded-full object-cover" />
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{order.productName}</h3>
                <p className="text-sm text-gray-600">Buyer: {order.sellerName}</p>
              </div>
              <span className="text-sm text-gray-500">
                Ordered on: {order.createdAt.toLocaleDateString()} {order.createdAt.toLocaleTimeString()}
              </span>
            </div>
            <div className="mt-2 space-y-1">
              <p className="text-gray-600">Quantity: {order.quantity}</p>
              <p className="text-gray-600">Total Amount: ₱{order.totalAmount.toLocaleString()}</p>
              <p className="text-gray-600">Pickup: {order.schoolLocation}</p>
              <p className="text-gray-600">Date & Time: {order.pickupDate} at {order.pickupTime}</p>
              <p className="text-gray-600">Payment: {order.paymentMethod}</p>
            </div>
            <div className="flex justify-end mt-4 gap-2">
              <button 
                onClick={() => handleContactBuyer(order.sellerId)}
                className="bg-[#F88379] hover:bg-[#F88379]/90 text-white font-semibold py-2 px-6 rounded-lg shadow transition"
              >
                Contact Buyer
              </button>
              {canCancel && (
                <button
                  onClick={() => handleCancelOrder(order.id)}
                  className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-lg shadow transition"
                  disabled={cancellingOrder === order.id}
                >
                  {cancellingOrder === order.id ? 'Cancelling...' : 'Cancel Order'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#f7f6fd]">
      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="flex items-center px-8 pr-[47px] py-4 bg-[#FFF3F2] h-[70px] shadow-[0_4px_4px_0_rgba(0,0,0,0.1)] sticky top-0 z-30">
          <button onClick={() => navigate('/dashboard/seller')} className="mt-0">
            <img src={leftArrow} alt="Back" className="h-10" />
          </button>
          <img src={ustpLogo} alt="USTP Things Logo" className="w-[117px] h-[63px] object-contain ml-4" />
          <span className="ml-4 text-3xl font-bold text-[#F88379]">Product Orders</span>
        </header>
        <div className="p-10">
          {loading ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="w-16 h-16 border-4 border-[#F88379] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center text-gray-500 mt-8">No orders found.</div>
          ) : (
            <div className="space-y-6">
              {orders.map(renderOrderCard)}
            </div>
          )}
        </div>
      </main>
    </div>
  );
} 