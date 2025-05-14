import Sidebar from '../components/Sidebar';
import ustpLogo from '../../assets/ustp-things-logo.png';
import userAvatar from '../../assets/ustp thingS/Person.png';
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
  createdAt: { toDate: () => Date };
}

interface Order {
  id: string;
  sellerId: string;
  productId: string;
  status: 'Processing' | 'Ready for pickup' | 'Completed' | 'Cancelled';
  createdAt: Date;
  sellerName?: string;
  productName?: string;
  sellerAvatar?: string;
}

export default function Orders() {
  const [showModal, setShowModal] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingOrder, setCancellingOrder] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const isStandalone = location.pathname === '/dashboard/orders';

  useEffect(() => {
    const fetchOrders = async () => {
      if (!auth.currentUser) return;

      try {
        // Query all orders for the current user
        const ordersQuery = query(
          collection(db, 'orders'),
          where('userId', '==', auth.currentUser.uid)
        );
        
        const querySnapshot = await getDocs(ordersQuery);
        const fetchedOrders: Order[] = [];

        // Fetch additional details for each order
        for (const docSnapshot of querySnapshot.docs) {
          const orderData = docSnapshot.data() as OrderData;
          
          // Get seller details
          const sellerDoc = await getDoc(doc(db, 'users', orderData.sellerId));
          const sellerData = sellerDoc.exists() ? sellerDoc.data() as SellerData : null;
          
          // Get product details
          const productDoc = await getDoc(doc(db, 'products', orderData.productId));
          const productData = productDoc.exists() ? productDoc.data() as ProductData : null;

          fetchedOrders.push({
            id: docSnapshot.id,
            sellerId: orderData.sellerId,
            productId: orderData.productId,
            status: orderData.status,
            createdAt: orderData.createdAt?.toDate() || new Date(),
            sellerName: sellerData?.businessName || 'Unknown Seller',
            productName: productData?.name || 'Unknown Product',
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

  // Sidebar navigation handler
  const handleSidebarNav = (view: 'home' | 'likes' | 'recently' | 'orders' | 'rate' | 'message') => {
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
      case 'orders':
        navigate('/dashboard/orders');
        break;
      case 'rate':
        navigate('/dashboard/to-rate');
        break;
      case 'message':
        navigate('/dashboard/messages');
        break;
    }
  };

  const renderOrderCard = (order: Order) => (
    <div key={order.id} className="bg-white rounded-2xl shadow p-6">
      <div className="flex items-center gap-4">
        <img src={order.sellerAvatar} alt={order.sellerName} className="w-16 h-16 rounded-full object-cover" />
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-semibold text-gray-800">{order.sellerName}</h3>
            <span className="text-sm text-gray-500">
              {order.createdAt.toLocaleDateString()} {order.createdAt.toLocaleTimeString()}
            </span>
          </div>
          <p className="text-gray-600 mt-1">{order.productName}</p>
          <div className="flex justify-between items-center mt-2">
            <span className={`text-sm font-semibold ${
              order.status === 'Ready for pickup' ? 'text-green-600' : 
              order.status === 'Processing' ? 'text-yellow-600' :
              'text-red-600'
            }`}>
              {order.status}
            </span>
            <div className="flex gap-2">
              {order.status === 'Processing' && (
                <button 
                  onClick={() => handleCancelOrder(order.id)}
                  disabled={cancellingOrder === order.id}
                  className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-lg shadow transition disabled:opacity-50"
                >
                  {cancellingOrder === order.id ? 'Cancelling...' : 'Cancel Order'}
                </button>
              )}
              {order.status === 'Ready for pickup' && (
                <button 
                  onClick={() => handlePickupNow(order.id)}
                  className="bg-[#F88379] hover:bg-[#F88379]/90 text-white font-semibold py-2 px-6 rounded-lg shadow transition"
                >
                  Pick Up Now
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return isStandalone ? (
    <div className="flex min-h-screen bg-[#f7f6fd]">
      {/* Sidebar */}
      <div className="w-[348px] flex-shrink-0">
        <Sidebar
          onVerifyClick={() => setShowModal(true)}
          onHomeClick={() => handleSidebarNav('home')}
          onLikesClick={() => handleSidebarNav('likes')}
          onRecentlyClick={() => handleSidebarNav('recently')}
          onOrdersClick={() => handleSidebarNav('orders')}
          onRateClick={() => handleSidebarNav('rate')}
          onMessageClick={() => handleSidebarNav('message')}
        />
      </div>
      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between px-8 pr-[47px] py-4 bg-white h-[70px] w-full shadow-[0_4px_4px_0_rgba(0,0,0,0.1)]">
          <div className="flex items-center gap-4">
            <img src={ustpLogo} alt="USTP Things Logo" className="w-[117px] h-[63px] object-contain" />
            <h1 className="text-3xl font-bold text-[#F88379] pb-1">My Orders</h1>
          </div>
        </header>
        {/* Orders List */}
        <div className="flex-1 p-10">
          {loading ? (
            <div className="text-center text-gray-500 mt-8">
              Loading orders...
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center text-gray-500 mt-8">
              No orders found. Items you purchase will appear here.
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map(renderOrderCard)}
            </div>
          )}
        </div>
      </main>
    </div>
  ) : (
    // Embedded version (when used inside Dashboard)
    <div className="space-y-6">
      {loading ? (
        <div className="text-center text-gray-500 mt-8">
          Loading orders...
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center text-gray-500 mt-8">
          No orders found. Items you purchase will appear here.
        </div>
      ) : (
        orders.map(renderOrderCard)
      )}
    </div>
  );
} 