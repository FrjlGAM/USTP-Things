import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import Sidebar from '../components/Sidebar';
import xIcon from '../../assets/ustp thingS/X button.png';

interface CheckOutProps {
  product: {
    id: string;
    name: string;
    price: string;
    image: string;
    sellerId: string;
  };
  onClose?: () => void;
}

export default function CheckOut({ product, onClose }: CheckOutProps) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [schoolLocation, setSchoolLocation] = useState('');
  const [pickupDate, setPickupDate] = useState('');
  const [pickupTime, setPickupTime] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');

  const handleClose = () => {
    navigate('/dashboard');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return;

    setLoading(true);
    try {
      // Create order in pickupOrders collection
      const orderRef = await addDoc(collection(db, 'pickupOrders'), {
        userId: auth.currentUser.uid,
        productId: product.id,
        sellerId: product.sellerId,
        status: 'Processing',
        schoolLocation,
        pickupDate,
        pickupTime,
        paymentMethod,
        totalAmount: parseFloat(product.price.replace('₱', '').replace(',', '')),
        createdAt: serverTimestamp()
      });

      // Navigate to success page or back to dashboard
      navigate('/dashboard/pickup');
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Failed to create order. Please try again.');
    } finally {
      setLoading(false);
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
      <main className="flex-1 p-10">
        <div className="w-full bg-white rounded-2xl shadow p-8 relative">
          {/* X Button */}
          <button
            onClick={handleClose}
            className="absolute top-6 right-6 z-10 p-2 rounded-full hover:bg-gray-100 transition bg-white shadow-md"
          >
            <img src={xIcon} alt="Close" className="w-6 h-6" />
          </button>

          <form onSubmit={handleSubmit}>
            {/* Products Ordered Section */}
            <div className="bg-[#FF9B8B] text-white p-4 rounded-t-2xl flex justify-between items-center">
              <h2 className="font-semibold text-lg">Products Ordered</h2>
              <span>{product.sellerId}</span>
            </div>
            
            <div className="bg-white p-6 border-x border-b rounded-b-2xl mb-6">
              <div className="flex items-center gap-4">
                <img src={product.image} alt={product.name} className="w-16 h-16 object-cover rounded" />
                <div className="flex-1">
                  <h3 className="font-semibold">{product.name}</h3>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-gray-600">Price</span>
                    <span className="font-semibold">{product.price}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Quantity</span>
                    <span>1</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-semibold">{product.price}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Pick Up Section */}
            <div className="bg-[#f7f6fd] p-6 rounded-2xl mb-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 bg-[#FF9B8B] rounded-full flex items-center justify-center text-white">
                  <span>📍</span>
                </div>
                <h2 className="font-semibold text-lg">Pick Up</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-gray-600 mb-1">School Location:</label>
                  <select 
                    className="w-full p-2 border rounded-lg bg-white"
                    value={schoolLocation}
                    onChange={(e) => setSchoolLocation(e.target.value)}
                    required
                  >
                    <option value="">Select location</option>
                    <option value="Main Campus">Main Campus</option>
                    <option value="CDO Campus">CDO Campus</option>
                  </select>
                </div>

                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-gray-600 mb-1">Date:</label>
                    <input 
                      type="date" 
                      className="w-full p-2 border rounded-lg bg-white"
                      value={pickupDate}
                      onChange={(e) => setPickupDate(e.target.value)}
                      required
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-gray-600 mb-1">Time:</label>
                    <input 
                      type="time" 
                      className="w-full p-2 border rounded-lg bg-white"
                      value={pickupTime}
                      onChange={(e) => setPickupTime(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method Section */}
            <div className="bg-[#f7f6fd] p-6 rounded-2xl mb-6">
              <h2 className="font-semibold text-lg mb-4">Payment Method</h2>
              <select 
                className="w-full p-2 border rounded-lg bg-white"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                required
              >
                <option value="">Choose Payment Method</option>
                <option value="Cash">Cash on Pickup</option>
                <option value="GCash">GCash</option>
              </select>

              <div className="mt-6 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Item Subtotal</span>
                  <span>{product.price}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Payment</span>
                  <span className="text-xl font-bold text-[#F88379]">{product.price}</span>
                </div>
              </div>
            </div>

            {/* Place Order Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="bg-[#F88379] hover:bg-[#F88379]/90 text-white font-bold py-3 px-8 rounded-xl shadow transition text-lg disabled:opacity-50"
              >
                {loading ? 'Processing...' : 'Place Order'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
} 