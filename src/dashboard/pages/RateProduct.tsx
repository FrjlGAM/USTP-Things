import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { doc, getDoc, updateDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../../lib/firebase';
// Import local icons
import starIcon from '../../assets/ustp thingS/Star.png';
import xIcon from '../../assets/ustp thingS/X.png';
import Sidebar from '../components/Sidebar';
import ustpLogo from '../../assets/ustp-things-logo.png';

interface Order {
  id: string;
  sellerId: string;
  productId: string;
  productName: string;
  productImage: string;
  sellerName?: string;
  sellerAvatar?: string;
  quantity: number;
  totalAmount: number;
  completedAt: Date;
}

export default function RateProduct() {
  const { orderId } = useParams<{ orderId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Get order data from location state or fetch it
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        // First try to get from location state
        if (location.state?.order) {
          setOrder(location.state.order);
          setLoading(false);
          return;
        }

        // If not in state, fetch from Firestore
        if (orderId) {
          const orderDoc = await getDoc(doc(db, 'orders', orderId));
          if (orderDoc.exists()) {
            const data = orderDoc.data();
            setOrder({
              id: orderDoc.id,
              sellerId: data.sellerId,
              productId: data.productId,
              productName: data.productName,
              productImage: data.productImage,
              sellerName: data.sellerName,
              sellerAvatar: data.sellerAvatar,
              quantity: data.quantity,
              totalAmount: data.totalAmount,
              completedAt: data.completedAt?.toDate() || new Date(),
            });
          } else {
            setError('Order not found');
          }
        }
      } catch (err) {
        console.error('Error fetching order:', err);
        setError('Failed to load order details');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, location.state]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!order || !rating) {
      setError('Please provide a rating');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      // Add the review to the reviews collection
      await addDoc(collection(db, 'reviews'), {
        orderId: order.id,
        productId: order.productId,
        sellerId: order.sellerId,
        userId: auth.currentUser?.uid,
        rating,
        review,
        createdAt: serverTimestamp(),
      });

      // Update the order to mark it as rated
      await updateDoc(doc(db, 'orders', order.id), {
        isRated: true,
      });

      // Navigate back to the to-rate page
      navigate('/dashboard/to-rate', { 
        state: { message: 'Thank you for your review!' } 
      });
    } catch (err) {
      console.error('Error submitting review:', err);
      setError('Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center p-6 bg-white rounded-lg shadow-lg">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error || 'Order not found'}</p>
          <button
            onClick={handleBack}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#f7f6fd]">
      {/* Sidebar */}
      <div className="w-[348px] flex-shrink-0">
        <Sidebar
          onHomeClick={() => navigate('/dashboard')}
          onLikesClick={() => navigate('/dashboard/likes')}
          onRecentlyClick={() => navigate('/dashboard/recently-viewed')}
          onOrdersClick={() => navigate('/dashboard/orders')}
          onRateClick={() => navigate('/dashboard/to-rate')}
          onMessageClick={() => navigate('/dashboard/messages')}
          activeButton="to-rate"
        />
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between px-8 pr-[47px] py-4 bg-white h-[70px] w-full shadow-[0_4px_4px_0_rgba(0,0,0,0.1)]">
          <div className="flex items-center gap-4">
            <img src={ustpLogo} alt="USTP Things Logo" className="w-[117px] h-[63px] object-contain" />
            <h1 className="text-3xl font-bold text-[#F88379] pb-1">Rate Your Purchase</h1>
          </div>
        </header>

        <div className="p-10">
          <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-md overflow-hidden">
            {/* Order Summary */}
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              <div className="flex gap-6">
                <div className="w-32 h-32 flex-shrink-0">
                  <img 
                    src={order.productImage} 
                    alt={order.productName} 
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-medium">{order.productName}</h3>
                  <p className="text-gray-600">Seller: {order.sellerName || 'Unknown Seller'}</p>
                  <p className="text-gray-600">Quantity: {order.quantity}</p>
                  <p className="text-gray-600">Total: ₱{order.totalAmount.toLocaleString()}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Purchased on: {new Date(order.completedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Rating Form */}
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-6">How was your experience?</h2>
              
              {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <label className="block text-gray-700 mb-2">Rating</label>
                  <div className="flex items-center space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="focus:outline-none"
                      >
                        <img 
                          src={starIcon} 
                          alt="Star" 
                          className={`w-10 h-10 ${star <= rating ? 'opacity-100' : 'opacity-30'}`}
                        />
                      </button>
                    ))}
                    <span className="ml-2 text-gray-500">
                      {rating > 0 ? `${rating} ${rating === 1 ? 'star' : 'stars'}` : 'Rate this product'}
                    </span>
                  </div>
                </div>

                <div className="mb-6">
                  <label htmlFor="review" className="block text-gray-700 mb-2">
                    Write a review (optional)
                  </label>
                  <textarea
                    id="review"
                    rows={4}
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Share your experience with this product..."
                  />
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || rating === 0}
                    className={`px-6 py-2 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isSubmitting || rating === 0 ? 'bg-blue-300' : 'bg-blue-600 hover:bg-blue-700'}`}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Review'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
