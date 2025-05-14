import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../../lib/firebase';
import { collection, query, where, getDocs, doc, getDoc, updateDoc } from 'firebase/firestore';
import type { DocumentData } from 'firebase/firestore';
import Sidebar from '../components/Sidebar';
import ustpLogo from '../../assets/ustp-things-logo.png';

type OrderStatus = 'To Pay' | 'Completed' | 'Cancelled';

interface Product {
  name: string;
  image: string;
}

interface Seller {
  businessName: string;
}

interface Order {
  id: string;
  productId: string;
  sellerId: string;
  status: string;
  quantity: number;
  totalAmount: number;
  createdAt: Date;
  productName?: string;
  productImage?: string;
  sellerName?: string;
}

export default function OrderStatus() {
  const [activeTab, setActiveTab] = useState<OrderStatus>('To Pay');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      if (!auth.currentUser) return;

      try {
        const ordersQuery = query(
          collection(db, 'pickupOrders'),
          where('userId', '==', auth.currentUser.uid)
        );
        
        const querySnapshot = await getDocs(ordersQuery);
        const ordersData: Order[] = [];

        for (const document of querySnapshot.docs) {
          const orderData = document.data() as DocumentData;
          
          // Get product details
          const productDocRef = doc(db, 'products', orderData.productId);
          const productDocSnap = await getDoc(productDocRef);
          const productData = productDocSnap.data() as Product | undefined;
          
          // Get seller details
          const sellerDocRef = doc(db, 'users', orderData.sellerId);
          const sellerDocSnap = await getDoc(sellerDocRef);
          const sellerData = sellerDocSnap.data() as Seller | undefined;

          ordersData.push({
            id: document.id,
            ...orderData,
            createdAt: orderData.createdAt?.toDate(),
            productName: productData?.name,
            productImage: productData?.image,
            sellerName: sellerData?.businessName || 'Unknown Seller'
          } as Order);
        }

        setOrders(ordersData);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const filteredOrders = orders.filter(order => {
    if (activeTab === 'To Pay') return order.status === 'Processing';
    if (activeTab === 'Completed') return order.status === 'Completed';
    return order.status === 'Cancelled';
  });

  const handleContactSeller = (sellerId: string) => {
    // Implement contact seller functionality
    navigate('/dashboard/message', { state: { sellerId } });
  };

  const handleCancelOrder = async (orderId: string) => {
    try {
      const orderRef = doc(db, 'pickupOrders', orderId);
      await updateDoc(orderRef, {
        status: 'Cancelled',
        cancelledAt: new Date()
      });
      
      // Update local state
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === orderId
            ? { ...order, status: 'Cancelled' }
            : order
        )
      );
    } catch (error) {
      console.error('Error cancelling order:', error);
      alert('Failed to cancel order. Please try again.');
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f7f6fd]">
      {/* Sidebar */}
      <div className="w-[348px] flex-shrink-0">
        <Sidebar
          onHomeClick={() => navigate('/dashboard')}
          onLikesClick={() => navigate('/dashboard/likes')}
          onRecentlyClick={() => navigate('/dashboard/recently-viewed')}
          onPickUpClick={() => navigate('/dashboard/pickup')}
          onRateClick={() => navigate('/dashboard/rate')}
          onMessageClick={() => navigate('/dashboard/message')}
        />
      </div>

      {/* Main Content */}
      <main className="flex-1">
        {/* Header */}
        <header className="flex items-center justify-between px-8 pr-[47px] py-4 bg-white h-[70px] shadow-[0_4px_4px_0_rgba(0,0,0,0.1)]">
          <div className="flex items-center gap-4">
            <img src={ustpLogo} alt="USTP Things Logo" className="w-[117px] h-[63px] object-contain" />
            <h1 className="text-3xl font-bold text-[#F88379] pb-1">My Orders</h1>
          </div>
        </header>

        {/* Status Tabs */}
        <div className="bg-[#F88379] rounded-full mx-10 mt-6 p-1">
          <div className="flex justify-between">
            {(['To Pay', 'Completed', 'Cancelled'] as OrderStatus[]).map((status) => (
              <button
                key={status}
                onClick={() => setActiveTab(status)}
                className={`flex-1 py-2 text-lg font-semibold rounded-full transition ${
                  activeTab === status
                    ? 'bg-white text-[#F88379]'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Orders List */}
        <div className="p-10">
          {loading ? (
            <div className="text-center text-gray-500">Loading orders...</div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center text-gray-500">No {activeTab.toLowerCase()} orders found.</div>
          ) : (
            <div className="space-y-6">
              {filteredOrders.map((order) => (
                <div key={order.id} className="bg-white rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold">{order.sellerName}</h3>
                      <button className="text-sm border border-gray-300 rounded px-2 py-1 hover:bg-gray-50">
                        View Shop
                      </button>
                    </div>
                    {activeTab === 'To Pay' && (
                      <span className="px-4 py-1 bg-[#FF9B8B] text-white rounded-full text-sm">
                        Pending
                      </span>
                    )}
                  </div>

                  <div className="flex gap-4">
                    <img
                      src={order.productImage}
                      alt={order.productName}
                      className="w-24 h-24 object-cover rounded-xl"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800">{order.productName}</h4>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-gray-600">Quantity: {order.quantity}x</span>
                        <span className="text-[#F88379] font-bold">
                          ₱{order.totalAmount.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {activeTab === 'To Pay' && (
                    <div className="flex justify-end gap-4 mt-4">
                      <button
                        onClick={() => handleContactSeller(order.sellerId)}
                        className="px-6 py-2 border-2 border-[#F88379] text-[#F88379] rounded-xl hover:bg-[#F88379] hover:text-white transition"
                      >
                        Contact Seller
                      </button>
                      <button
                        onClick={() => handleCancelOrder(order.id)}
                        className="px-6 py-2 border-2 border-red-500 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition"
                      >
                        Cancel Order
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
} 