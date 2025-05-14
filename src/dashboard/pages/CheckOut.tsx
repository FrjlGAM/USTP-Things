import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { FirebaseError } from 'firebase/app';
import Sidebar from '../components/Sidebar';
import ConfirmOrder from '../components/ConfirmOrder';

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
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [schoolLocation, setSchoolLocation] = useState('');
  const [pickupDate, setPickupDate] = useState('');
  const [pickupTime, setPickupTime] = useState('');
  const [paymentMethod] = useState('GCash');
  const [quantity, setQuantity] = useState(1);

  // Validate product data on mount
  useEffect(() => {
    if (!product || !product.id || !product.sellerId) {
      alert('Invalid product data. Returning to previous page.');
      navigate(-1);
    }
  }, [product, navigate]);

  const handleCancel = () => {
    navigate(-1);
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 1;
    setQuantity(Math.max(1, Math.min(value, 99))); // Limit between 1 and 99
  };

  const calculateSubtotal = () => {
    const basePrice = parseFloat(product.price.replace('₱', '').replace(',', ''));
    return basePrice * quantity;
  };

  const formatPrice = (amount: number) => {
    return `₱${amount.toLocaleString()}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted with values:', {
      schoolLocation,
      pickupDate,
      pickupTime,
      quantity
    });
    setShowConfirmModal(true);
  };

  const handleConfirmOrder = async () => {
    if (!auth.currentUser) {
      alert('Please sign in to place an order.');
      return;
    }

    if (!schoolLocation || !pickupDate || !pickupTime) {
      alert('Please fill in all required fields.');
      return;
    }

    // Validate product data
    if (!product || !product.id || !product.sellerId) {
      console.error('Invalid product data:', product);
      alert('Invalid product data. Please try again.');
      return;
    }

    console.log('Product data:', {
      id: product.id,
      sellerId: product.sellerId,
      name: product.name,
      price: product.price
    });

    setLoading(true);
    try {
      // Create order in pickupOrders collection
      const orderData = {
        userId: auth.currentUser.uid,
        productId: product.id,
        sellerId: product.sellerId,
        status: 'Processing',
        schoolLocation,
        pickupDate,
        pickupTime,
        paymentMethod,
        quantity,
        totalAmount: calculateSubtotal(),
        createdAt: serverTimestamp(),
        productName: product.name,
        productImage: product.image
      };

      console.log('Creating order with data:', orderData);

      try {
        const orderRef = await addDoc(collection(db, 'pickupOrders'), orderData);
        console.log('Order created with ID:', orderRef.id);
        
        if (orderRef.id) {
          alert('Order placed successfully!');
          navigate('/dashboard/pickup');
        } else {
          throw new Error('Failed to get order ID');
        }
      } catch (dbError) {
        const error = dbError as FirebaseError;
        console.error('Database error:', error);
        throw new Error(`Failed to create order in database: ${error.message}`);
      }
    } catch (error) {
      const firebaseError = error as Error;
      console.error('Error creating order:', firebaseError);
      alert(`Failed to create order: ${firebaseError.message}. Please try again.`);
    } finally {
      setLoading(false);
      setShowConfirmModal(false);
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
                  <input
                    type="number"
                    min="1"
                    max="99"
                    value={quantity}
                    onChange={handleQuantityChange}
                    className="w-20 text-center border rounded-lg p-1 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-auto [&::-webkit-inner-spin-button]:appearance-auto"
                  />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">{formatPrice(calculateSubtotal())}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Pick Up Section */}
          <div className="bg-white p-6 rounded-2xl mb-6">
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
                  <option value="Cafeteria">USTP Cafeteria</option>
                  <option value="Building 43">Building 43 (Engineering Complex Left Wing)</option>
                  <option value="Building 44">Building 44 (ICT Building)</option>
                  <option value="Building 41">Building 41 (Science Complex)</option>
                  <option value="DRER Hall">DRER Hall</option>
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
          <div className="bg-white p-6 rounded-2xl mb-6">
            <h2 className="font-semibold text-lg mb-4">Payment Method</h2>
            <div className="w-full p-2 border rounded-lg bg-gray-100 text-gray-700 cursor-not-allowed">
              GCash
            </div>

            <div className="mt-6 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Item Subtotal</span>
                <span>{formatPrice(calculateSubtotal())}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Payment</span>
                <span className="text-xl font-bold text-[#F88379]">{formatPrice(calculateSubtotal())}</span>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={handleCancel}
              className="px-8 py-3 rounded-xl border-2 border-[#F88379] text-[#F88379] font-bold text-lg hover:bg-[#F88379] hover:text-white transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-[#F88379] hover:bg-[#F88379]/90 text-white font-bold py-3 px-8 rounded-xl shadow transition text-lg disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Place Order'}
            </button>
          </div>
        </form>
      </main>

      <ConfirmOrder 
        open={showConfirmModal}
        onConfirm={handleConfirmOrder}
        onCancel={() => setShowConfirmModal(false)}
      />
    </div>
  );
} 