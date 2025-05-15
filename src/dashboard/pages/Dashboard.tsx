import Sidebar from '../components/Sidebar';
import ustpLogo from '../../assets/ustp-things-logo.png';
import uniformImg from '../../assets/ustp thingS/Product.png';
import xIcon from '../../assets/ustp thingS/X button.png';
import cartIcon from '../../assets/ustp thingS/Shopping cart.png';
import searchIcon from '../../assets/ustp thingS/search.png';
import React, { useState, useEffect } from 'react';
import { db, auth } from '../../lib/firebase';
import { collection, addDoc, getDocs, doc, setDoc, arrayUnion, arrayRemove, getDoc, query, where, serverTimestamp, writeBatch, deleteDoc, limit } from 'firebase/firestore';
import type { DocumentData } from 'firebase/firestore';
import MyLikes from './MyLikes';
import RecentlyViewed from './RecentlyViewed';
import MyCart from './MyCart';
import StartSellingModal from '../components/StartSellingModal';
import { useLocation, useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import ProductDetail from './ProductDetail';
import { ToRateContent } from './ToRate';
import Orders from './Orders';
import userAvatar from '../../assets/ustp thingS/Person.png';
import BuyerMessage from './BuyerMessage';

const categories = [
  'For You',
  'Electronics',
  'Books',
  'Uniform',
  'Gel pens',
  'Graph paper',
];

const pickups = [
  {
    boutique: 'Galdo Boutique',
    product: 'Uniform Set USTP (Female) – Blouse, Skirt, and Necktie',
    image: uniformImg,
  },
  {
    boutique: 'Galdo Boutique',
    product: 'Uniform Set USTP (Female) – Blouse, Skirt, and Necktie',
    image: uniformImg,
  },
  {
    boutique: 'Galdo Boutique',
    product: 'Uniform Set USTP (Female) – Blouse, Skirt, and Necktie',
    image: uniformImg,
  },
];

function VerificationModal({ open, onClose, setVerificationRequested }: { open: boolean; onClose: () => void; setVerificationRequested: (val: boolean) => void }) {
  const [step, setStep] = React.useState<'select' | 'student'>('select');
  const [form, setForm] = React.useState({ name: '', id: '', email: '', agree: false });
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);

  React.useEffect(() => {
    if (!open) setStep('select'); // Reset step when modal closes
    if (!open) setForm({ name: '', id: '', email: '', agree: false }); // Reset form
    setSuccess(false);
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!auth.currentUser) {
        throw new Error('No user logged in');
      }
      
      // Update user document with verification request
      const userRef = doc(db, 'users', auth.currentUser.uid);
      await setDoc(userRef, {
        verificationRequested: true,
        verificationRequestedAt: new Date(),
        name: form.name,
        studentId: form.id,
        studentEmail: form.email,
        type: 'student'
      }, { merge: true });
      
      setSuccess(true);
      setForm({ name: '', id: '', email: '', agree: false });
      setVerificationRequested(true);
    } catch (err) {
      console.error('Failed to submit verification:', err);
      alert('Failed to submit verification.');
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Blurred background overlay */}
      <div className="absolute inset-0 bg-white/40 backdrop-blur transition-all duration-300" />
      {/* Modal with animation */}
      <div className="relative bg-white rounded-3xl shadow-2xl px-12 py-10 flex flex-col items-center min-w-[400px] min-h-[450px] border-4 border-[#ECB3A8] animate-fade-in-scale">
        <button onClick={onClose} className="absolute top-4 right-4 focus:outline-none">
          <img src={xIcon} alt="Close" className="w-8 h-8" />
        </button>
        <img src={ustpLogo} alt="USTP Things Logo" className="h-20 mb-2" />
        <h2 className="text-3xl font-bold text-[#F88379] mb-8 mt-2 text-center">Account Verification</h2>
        {step === 'select' && (
          <>
            <button className="w-64 bg-[#F88379] hover:bg-[#F88379]/90 text-white font-bold text-xl py-3 rounded-[23.08px] shadow mb-8 transition mt-8" onClick={() => setStep('student')}>I am a student.</button>
            <button className="w-64 bg-[#F88379] hover:bg-[#F88379]/90 text-white font-bold text-xl py-3 rounded-[23.08px] shadow transition">I am a company.</button>
          </>
        )}
        {step === 'student' && !success && (
          <form className="w-full flex flex-col items-center" onSubmit={handleSubmit}>
            <div className="w-full rounded-md mb-4 border border-gray-300">
              <div className="flex flex-col divide-y divide-gray-300">
                <input
                  type="text"
                  placeholder="Name"
                  className="px-4 py-3 outline-none border-0 bg-transparent text-lg"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  required
                />
                <input
                  type="text"
                  placeholder="Student ID Number"
                  className="px-4 py-3 outline-none border-0 bg-transparent text-lg"
                  value={form.id}
                  onChange={e => setForm(f => ({ ...f, id: e.target.value }))}
                  required
                />
                <input
                  type="email"
                  placeholder="USTP Student Email"
                  className="px-4 py-3 outline-none border-0 bg-transparent text-lg"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  required
                />
              </div>
            </div>
            <label className="flex items-center mb-4 w-full text-xs px-1">
              <input
                type="checkbox"
                className="mr-2 accent-pink-400"
                checked={form.agree}
                onChange={e => setForm(f => ({ ...f, agree: e.target.checked }))}
                required
              />
              I agree to the <a href="#" className="text-blue-500 underline ml-1">terms and conditions</a>
            </label>
            <button
              type="submit"
              className="w-full bg-[#F88379] hover:bg-[#F88379]/90 text-white font-bold text-lg py-3 rounded-2xl shadow transition disabled:opacity-50"
              disabled={!form.name || !form.id || !form.email || !form.agree || loading}
            >
              {loading ? 'Submitting...' : 'Confirm Verification'}
            </button>
          </form>
        )}
        {step === 'student' && success && (
          <div className="text-green-600 font-bold text-lg mt-8">Verification submitted successfully!</div>
        )}
      </div>
    </div>
  );
}

interface SellerData {
  businessName: string;
  avatar?: string;
}

interface OrderData {
  userId: string;
  sellerId: string;
  productId: string;
  status: 'Completed';
  schoolLocation: string;
  pickupDate: string;
  pickupTime: string;
  paymentMethod: string;
  quantity: number;
  totalAmount: number;
  createdAt: { toDate: () => Date };
  completedAt: { toDate: () => Date };
  productName: string;
  productImage: string;
  isRated?: boolean;
}

interface Order {
  id: string;
  sellerId: string;
  productId: string;
  status: 'Completed';
  schoolLocation: string;
  pickupDate: string;
  pickupTime: string;
  paymentMethod: string;
  quantity: number;
  totalAmount: number;
  createdAt: Date;
  completedAt: Date;
  productName: string;
  productImage: string;
  sellerName?: string;
  sellerAvatar?: string;
  isRated?: boolean;
}

export default function Dashboard() {
  const [showModal, setShowModal] = useState(false);
  const [mainView, setMainView] = useState<'home' | 'likes' | 'recently' | 'orders' | 'to-rate' | 'messages' | 'product' | 'cart'>('home');
  const [selectedCategory, setSelectedCategory] = useState('For You');
  const [search, setSearch] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  const [showStartSellingModal, setShowStartSellingModal] = useState(false);
  const location = useLocation();
  const [verificationRequested, setVerificationRequested] = useState(false);
  const navigate = useNavigate();
  const [toRateOrders, setToRateOrders] = useState<Order[]>([]);
  const [toRateLoading, setToRateLoading] = useState(true);

  // Check if user is verified
  useEffect(() => {
    const checkVerification = async () => {
      if (auth.currentUser) {
        try {
          const userRef = doc(db, 'users', auth.currentUser.uid);
          const userDoc = await getDoc(userRef);
          if (userDoc.exists()) {
            const data = userDoc.data();
            setIsVerified(Boolean(data.isVerified));
            setVerificationRequested(Boolean(data.verificationRequested));
          } else {
            setIsVerified(false);
            setVerificationRequested(false);
          }
        } catch (error) {
          console.error('Error checking verification:', error);
          setIsVerified(false);
          setVerificationRequested(false);
        }
      }
    };
    checkVerification();
  }, []);

  // Fetch products from Firebase
  useEffect(() => {
    const fetchProducts = async () => {
      if (!auth.currentUser) return;

      try {
        setIsLoading(true);
        const productsCollection = collection(db, 'products');
        
        // Delete all existing products first
        const existingProducts = await getDocs(productsCollection);
        const deletePromises = existingProducts.docs.map(doc => deleteDoc(doc.ref));
        await Promise.all(deletePromises);
        console.log('Deleted all existing products');

        // Create a seller account for sample products
        const sellerRef = doc(db, 'users', 'sample-seller');
        await setDoc(sellerRef, {
          businessName: 'Galdo Boutique',
          isVerified: true,
          role: 'seller'
        });

        const sampleProducts = [
          {
            name: 'Uniform Set USTP (Female)',
            price: '₱1,000',
            image: uniformImg,
            category: 'Uniform',
            description: 'Complete USTP uniform set for female students including blouse, skirt, and necktie.',
            sellerId: 'sample-seller',
            sold: 100,
            soldOut: 0,
            rating: 5.0,
            createdAt: serverTimestamp(),
            stock: 50,
            details: [
              'White Blouse: With USTP logo (Size: Medium)',
              'Black Skirt: Waist - 28", Length - Knee-length',
              'USTP Necktie',
              'Barely used and in excellent condition',
              'No stains, tears, or damages',
              'Ideal for students looking for an affordable and well-maintained uniform'
            ]
          },
          {
            name: 'USTP ID Lace',
            price: '₱50',
            image: uniformImg,
            category: 'Accessories',
            description: 'High-quality ID lace for USTP student ID.',
            sellerId: 'sample-seller',
            sold: 250,
            soldOut: 0,
            rating: 4.8,
            createdAt: serverTimestamp(),
            stock: 1000,
            details: [
              'Official USTP ID lace',
              'Durable material',
              'Standard length',
              'USTP branding'
            ]
          },
          {
            name: 'USTP Ballpen',
            price: '₱20',
            image: uniformImg,
            category: 'School Supplies',
            description: 'Official USTP ballpen with school logo.',
            sellerId: 'sample-seller',
            sold: 500,
            soldOut: 0,
            rating: 4.5,
            createdAt: serverTimestamp(),
            stock: 2000,
            details: [
              'Official USTP branded ballpen',
              'Smooth writing experience',
              'Blue ink',
              'Long-lasting'
            ]
          }
        ];

        // Create new products
        for (const product of sampleProducts) {
          try {
            const docRef = await addDoc(productsCollection, product);
            console.log('Added product:', product.name, 'with ID:', docRef.id);
          } catch (error) {
            console.error('Error adding product:', error);
          }
        }

        // Fetch all products with seller information
        console.log('Fetching updated products...');
        const allProductsSnapshot = await getDocs(productsCollection);
        const productsWithSellers = await Promise.all(
          allProductsSnapshot.docs.map(async (docSnapshot) => {
            const productData = docSnapshot.data() as DocumentData;
            console.log('Fetched product data:', productData);
            
            let sellerData: SellerData = { businessName: 'Unknown Seller' };

            if (productData.sellerId) {
              const sellerDocRef = doc(db, 'users', productData.sellerId);
              const sellerDocSnap = await getDoc(sellerDocRef);
              if (sellerDocSnap.exists()) {
                const data = sellerDocSnap.data();
                sellerData = {
                  businessName: data.businessName || 'Unknown Seller',
                  avatar: data.avatar
                };
              }
            }

            return {
              id: docSnapshot.id,
              ...productData,
              sellerName: sellerData.businessName,
              sellerAvatar: sellerData.avatar
            };
          })
        );

        setProducts(productsWithSellers);
      } catch (error) {
        console.error('Error fetching/updating products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Update mainView based on URL path
  useEffect(() => {
    const path = location.pathname;
    // Check if user is trying to access restricted pages through URL
    if (!isVerified && (
      path === '/dashboard/cart' ||
      path === '/dashboard/orders' ||
      path === '/dashboard/to-rate' ||
      path === '/dashboard/messages' ||
      path.includes('/dashboard/messages/')
    )) {
      setShowModal(true);
      setMainView('home');
      return;
    }

    let newView: typeof mainView = 'home';

    if (path === '/dashboard/likes') {
      newView = 'likes';
    } else if (path === '/dashboard/recently-viewed') {
      newView = 'recently';
    } else if (path === '/dashboard/orders') {
      newView = 'orders';
    } else if (path === '/dashboard/to-rate') {
      newView = 'to-rate';
    } else if (path === '/dashboard/messages' || path.includes('/dashboard/messages/')) {
      newView = 'messages';
    } else if (path.startsWith('/dashboard/product/')) {
      // Keep the previous view when viewing product details
      return;
    } else if (path === '/dashboard/cart') {
      newView = 'cart';
    } else if (path === '/dashboard') {
      newView = 'home';
    }

    setMainView(newView);
  }, [location, isVerified]);

  // Sidebar navigation handler
  const handleSidebarNav = (view: 'home' | 'likes' | 'recently' | 'orders' | 'to-rate' | 'messages' | 'product' | 'cart') => {
    // Check if user is trying to access restricted pages
    if (!isVerified && ['cart', 'orders', 'to-rate', 'messages'].includes(view)) {
      setShowModal(true);
      return;
    }

    // Don't reset selected product when navigating to product details
    if (view !== 'product') {
      setSelectedProduct(null);
    }
    
    setMainView(view);

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
      case 'to-rate':
        navigate('/dashboard/to-rate');
        break;
      case 'messages':
        navigate('/dashboard/messages');
        break;
      default:
        if (view !== 'product' && view !== 'cart') {
          navigate('/dashboard');
        }
    }
  };

  // Cart icon click handler
  const handleCartClick = () => {
    if (!isVerified) {
      setShowModal(true);
      return;
    }
    setMainView('cart');
  };

  // Filtered products
  const filteredProducts = products.filter(
    (p) =>
      (selectedCategory === 'For You' || p.name.toLowerCase().includes(selectedCategory.toLowerCase())) &&
      (search === '' || p.name.toLowerCase().includes(search.toLowerCase()))
  );

  const handleAddToCart = async (product: any) => {
    if (auth.currentUser) {
      const userRef = doc(db, 'users', auth.currentUser.uid);
      const userDoc = await getDoc(userRef);
      if (!userDoc.exists()) {
        await setDoc(userRef, {
          cartProducts: [],
          likedProducts: [],
          recentlyViewed: []
        });
      }
      await setDoc(userRef, {
        cartProducts: arrayUnion(product.id)
      }, { merge: true });
      console.log('Added to cart:', product.id);
    }
  };

  // Add function to track product views
  const handleProductView = async (product: any) => {
    setSelectedProduct(product);
    if (auth.currentUser) {
      try {
        const userRef = doc(db, 'users', auth.currentUser.uid);
        const userDoc = await getDoc(userRef);
        
        // Initialize user document if it doesn't exist
        if (!userDoc.exists()) {
          await setDoc(userRef, {
            cartProducts: [],
            likedProducts: [],
            recentlyViewed: []
          });
        }

        // Add to recently viewed, removing old entry if it exists
        const userData = userDoc.exists() ? userDoc.data() : {};
        const recentlyViewed = userData.recentlyViewed || [];
        
        // Remove the product if it's already in the list
        const filteredViewed = recentlyViewed.filter((id: string) => id !== product.id);
        
        // Add the product to the beginning of the array (most recent)
        const updatedViewed = [product.id, ...filteredViewed].slice(0, 20); // Keep only last 20 items
        
        await setDoc(userRef, {
          recentlyViewed: updatedViewed
        }, { merge: true });
      } catch (error) {
        console.error('Error updating recently viewed:', error);
      }
    }
  };

  const handleLikeChange = async (item: any, liked: boolean) => {
    if (auth.currentUser) {
      const userRef = doc(db, 'users', auth.currentUser.uid);
      if (liked) {
        await setDoc(userRef, {
          likedProducts: arrayUnion(item.id)
        }, { merge: true });
      } else {
        await setDoc(userRef, {
          likedProducts: arrayRemove(item.id)
        }, { merge: true });
      }
    }
  };

  // Add effect to handle body overflow
  useEffect(() => {
    if (selectedProduct) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    // Cleanup
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [selectedProduct]);

  useEffect(() => {
    const fetchToRateOrders = async () => {
      if (!auth.currentUser) return;

      try {
        const ordersQuery = query(
          collection(db, 'pickupOrders'),
          where('userId', '==', auth.currentUser.uid),
          where('status', '==', 'Completed'),
          where('isRated', '==', false),
          // Limit to 3 most recent orders for dashboard
          limit(3)
        );
        
        const querySnapshot = await getDocs(ordersQuery);
        const fetchedOrders: Order[] = [];

        for (const docSnapshot of querySnapshot.docs) {
          const orderData = docSnapshot.data() as OrderData;
          
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
            completedAt: orderData.completedAt?.toDate() || new Date(),
            productName: orderData.productName,
            productImage: orderData.productImage,
            sellerName: sellerData?.businessName || 'Unknown Seller',
            sellerAvatar: sellerData?.avatar || userAvatar,
            isRated: orderData.isRated
          });
        }

        fetchedOrders.sort((a, b) => b.completedAt.getTime() - a.completedAt.getTime());
        setToRateOrders(fetchedOrders);
      } catch (error) {
        console.error('Error fetching to-rate orders:', error);
      } finally {
        setToRateLoading(false);
      }
    };

    fetchToRateOrders();
  }, []);

  const handleRateNow = (order: Order) => {
    navigate(`/dashboard/rate/${order.id}`, { state: { order } });
  };

  return (
    <div className={`flex min-h-screen bg-[#f7f6fd] ${selectedProduct ? 'overflow-hidden' : ''}`}>
      {/* Sidebar */}
      <div className="w-[348px] flex-shrink-0">
        <Sidebar
          onVerifyClick={() => setShowModal(true)}
          onHomeClick={() => handleSidebarNav('home')}
          onLikesClick={() => handleSidebarNav('likes')}
          onRecentlyClick={() => handleSidebarNav('recently')}
          onOrdersClick={() => handleSidebarNav('orders')}
          onRateClick={() => handleSidebarNav('to-rate')}
          onMessageClick={() => handleSidebarNav('messages')}
          onStartSellingClick={() => {
            if (isVerified) {
              setShowStartSellingModal(true);
            } else {
              alert("Verify muna bago benta :P!");
            }
          }}
          verificationRequested={verificationRequested}
          activeButton={mainView === 'recently' ? 'recently' : 
                       mainView === 'to-rate' ? 'to-rate' : 
                       mainView === 'product' ? 'home' : mainView}
        />
      </div>
      {/* Main Content */}
      <main className="flex-1 flex flex-col relative">
        {/* Header */}
        {!selectedProduct && (
          <header className="flex items-center justify-between px-8 pr-[47px] py-4 bg-white h-[70px] shadow-[0_4px_4px_0_rgba(0,0,0,0.1)]">
            <div className="flex items-center gap-4">
              <img src={ustpLogo} alt="USTP Things Logo" className="w-[117px] h-[63px] object-contain" />
              {mainView === 'likes' && <h1 className="text-3xl font-bold text-[#F88379] pb-1">My Likes</h1>}
              {mainView === 'recently' && <h1 className="text-3xl font-bold text-[#F88379] pb-1">Recently Viewed</h1>}
              {mainView === 'orders' && <h1 className="text-3xl font-bold text-[#F88379] pb-1">My Orders</h1>}
              {mainView === 'to-rate' && <h1 className="text-3xl font-bold text-[#F88379] pb-1">To Rate</h1>}
              {mainView === 'messages' && <h1 className="text-3xl font-bold text-[#F88379] pb-1">Messages</h1>}
              {mainView === 'product' && <h1 className="text-3xl font-bold text-[#F88379] pb-1">Product Details</h1>}
              {mainView === 'cart' && <h1 className="text-3xl font-bold text-[#F88379] pb-1">My Cart</h1>}
            </div>
            {/* Search bar and cart */}
            {mainView === 'home' && (
              <div className="flex items-center gap-[27px]">
                <div className="relative">
                  <input
                    className="w-[371px] h-[41px] pl-12 pr-4 py-2 rounded-full border-2 border-[rgba(230,230,230,0.80)] focus:outline-none text-[rgba(248,131,121,0.80)] placeholder-[rgba(248,131,121,0.80)]"
                    placeholder="Search"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                  />
                  <img 
                    src={searchIcon} 
                    alt="Search" 
                    className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2" 
                  />
                </div>
                <button onClick={handleCartClick}>
                  <img src={cartIcon} alt="Shopping Cart" className="w-[30px] h-[30px]" />
                </button>
              </div>
            )}
          </header>
        )}
        {/* Category Chips (only on Home/Product Feed) */}
        {mainView === 'home' && !selectedProduct && (
          <div className="flex gap-2 px-10 py-2">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`px-4 py-1 rounded-full border text-sm font-semibold transition ${selectedCategory === cat ? 'bg-[#F88379] text-white border-[#F88379]' : 'bg-white text-gray-600 border-gray-300 hover:bg-pink-100'}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
        {/* Main Content Switcher */}
        <div className={`flex-1 px-10 pt-4 pb-10`}>
          {mainView === 'home' ? (
            isLoading ? (
              <div className="flex items-center justify-center h-[calc(100vh-200px)]">
                <div className="text-center">
                  <div className="w-16 h-16 border-4 border-[#F88379] border-t-transparent rounded-full animate-spin mb-4 mx-auto"></div>
                  <p className="text-lg text-[#F88379] font-semibold">Loading products...</p>
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap gap-8">
                {filteredProducts.map((item) => (
                  <ProductCard
                    key={item.id}
                    product={item}
                    onClick={() => handleProductView(item)}
                    onLikeChange={(liked) => handleLikeChange(item, liked)}
                  />
                ))}
              </div>
            )
          ) : mainView === 'likes' ? (
            <MyLikes onProductClick={handleProductView} />
          ) : mainView === 'recently' ? (
            <RecentlyViewed onProductClick={handleProductView} />
          ) : mainView === 'orders' ? (
            <Orders />
          ) : mainView === 'cart' ? (
            <MyCart onProductClick={handleProductView} />
          ) : mainView === 'to-rate' ? (
            toRateOrders.length > 0 ? (
              <>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">To Rate</h2>
                  <button
                    onClick={() => navigate('/dashboard/to-rate')}
                    className="text-[#F88379] hover:text-[#F88379]/80 font-medium"
                  >
                    View All
                  </button>
                </div>
                <ToRateContent 
                  orders={toRateOrders}
                  onRateNow={handleRateNow}
                  loading={toRateLoading}
                />
              </>
            ) : (
              <div className="text-center text-gray-500 mt-8">No orders to rate at the moment.</div>
            )
          ) : null}
        </div>
      </main>

      {/* Product Detail Overlay */}
      {selectedProduct && (
        <div className="fixed inset-0 left-[348px] top-0 z-50 bg-white overflow-y-auto">
          <ProductDetail 
            product={selectedProduct} 
            onClose={() => setSelectedProduct(null)} 
            onAddToCart={() => {
              if (!isVerified) {
                setShowModal(true);
                return;
              }
              handleAddToCart(selectedProduct);
            }}
            isVerified={isVerified}
            onVerifyClick={() => setShowModal(true)}
          />
        </div>
      )}

      <VerificationModal
        open={showModal}
        onClose={() => setShowModal(false)}
        setVerificationRequested={setVerificationRequested}
      />
      <StartSellingModal
        open={showStartSellingModal}
        onClose={() => setShowStartSellingModal(false)}
        onStartSelling={() => {
          setShowStartSellingModal(false);
          navigate('/dashboard/seller');
        }}
      />
    </div>
  );
}
