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

interface PickupOrderData {
  userId: string;
  sellerId: string;
  productId: string;
  status: 'Processing' | 'Ready for pickup' | 'Completed';
  createdAt: { toDate: () => Date };
}

interface PickupOrder {
  id: string;
  sellerId: string;
  productId: string;
  status: 'Processing' | 'Ready for pickup' | 'Completed';
  createdAt: Date;
  sellerName?: string;
  productName?: string;
  sellerAvatar?: string;
}

export default function Pickup() {
  const [showModal, setShowModal] = useState(false);
  const [pickupOrders, setPickupOrders] = useState<PickupOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const isStandalone = location.pathname === '/dashboard/pickup';

  useEffect(() => {
    const fetchPickupOrders = async () => {
      if (!auth.currentUser) return;

      try {
        // Query pickup orders for the current user
        const pickupQuery = query(
          collection(db, 'pickupOrders'),
          where('userId', '==', auth.currentUser.uid),
          where('status', 'in', ['Processing', 'Ready for pickup'])
        );
        
        const querySnapshot = await getDocs(pickupQuery);
        const orders: PickupOrder[] = [];

        // Fetch additional details for each order
        for (const docSnapshot of querySnapshot.docs) {
          const orderData = docSnapshot.data() as PickupOrderData;
          
          // Get seller details
          const sellerDoc = await getDoc(doc(db, 'users', orderData.sellerId));
          const sellerData = sellerDoc.exists() ? sellerDoc.data() as SellerData : null;
          
          // Get product details
          const productDoc = await getDoc(doc(db, 'products', orderData.productId));
          const productData = productDoc.exists() ? productDoc.data() as ProductData : null;

          orders.push({
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
        orders.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        setPickupOrders(orders);
      } catch (error) {
        console.error('Error fetching pickup orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPickupOrders();
  }, []);

  const handlePickupNow = async (orderId: string) => {
    try {
      const orderRef = doc(db, 'pickupOrders', orderId);
      await updateDoc(orderRef, {
        status: 'Completed',
        completedAt: new Date()
      });
      
      // Update local state
      setPickupOrders(prevOrders => 
        prevOrders.filter(order => order.id !== orderId)
      );
    } catch (error) {
      console.error('Error updating pickup status:', error);
    }
  };

  // Sidebar navigation handler
  const handleSidebarNav = (view: 'home' | 'likes' | 'recently' | 'pickup' | 'rate' | 'message') => {
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
      case 'pickup':
        navigate('/dashboard/pickup');
        break;
      case 'rate':
        navigate('/dashboard/to-rate');
        break;
      case 'message':
        navigate('/dashboard/messages');
        break;
    }
  };

  return isStandalone ? (
    <div className="flex min-h-screen bg-[#f7f6fd]">
      {/* Sidebar */}
      <div className="w-[348px] flex-shrink-0">
        <Sidebar
          onVerifyClick={() => setShowModal(true)}
          onHomeClick={() => handleSidebarNav('home')}
          onLikesClick={() => handleSidebarNav('likes')}
          onRecentlyClick={() => handleSidebarNav('recently')}
          onPickUpClick={() => handleSidebarNav('pickup')}
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
            <h1 className="text-3xl font-bold text-[#F88379] pb-1">Pick Up</h1>
          </div>
        </header>
        {/* Pickup List */}
        <div className="flex-1 p-10">
          {loading ? (
            <div className="text-center text-gray-500 mt-8">
              Loading pickup orders...
            </div>
          ) : pickupOrders.length === 0 ? (
            <div className="text-center text-gray-500 mt-8">
              No pickup orders found. Items you purchase will appear here when they're ready for pickup.
            </div>
          ) : (
            <div className="space-y-6">
              {pickupOrders.map((order) => (
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
                        <span className={`text-sm font-semibold ${order.status === 'Ready for pickup' ? 'text-green-600' : 'text-yellow-600'}`}>
                          {order.status}
                        </span>
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
              ))}
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
          Loading pickup orders...
        </div>
      ) : pickupOrders.length === 0 ? (
        <div className="text-center text-gray-500 mt-8">
          No pickup orders found. Items you purchase will appear here when they're ready for pickup.
        </div>
      ) : (
        pickupOrders.map((order) => (
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
                  <span className={`text-sm font-semibold ${order.status === 'Ready for pickup' ? 'text-green-600' : 'text-yellow-600'}`}>
                    {order.status}
                  </span>
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
        ))
      )}
    </div>
  );
} 