import Sidebar from '../components/Sidebar';
import ustpLogo from '../../assets/ustp-things-logo.png';
import uniformImg from '../../assets/ustp thingS/Product.png';
import xIcon from '../../assets/ustp thingS/X button.png';
import cartIcon from '../../assets/ustp thingS/Shopping cart.png';
import searchIcon from '../../assets/ustp thingS/search.png';
import React, { useState, useEffect } from 'react';
import { db, auth } from '../../lib/firebase';
import { collection, addDoc, getDocs, doc, setDoc, arrayUnion, arrayRemove, getDoc, query, where } from 'firebase/firestore';
import MyLikes from './MyLikes';
import RecentlyViewed from './RecentlyViewed';
import MyCart from './MyCart';
import StartSellingModal from '../components/StartSellingModal';
import { useLocation, useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import ProductDetail from './ProductDetail';
import { MessagesContent } from './Messages';
import { ToRateContent } from './ToRate';

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

function VerificationModal({ open, onClose }: { open: boolean; onClose: () => void }) {
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
      // setVerificationRequested(true); // <-- Commented out because it's not defined
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

export default function Dashboard() {
  const [showModal, setShowModal] = useState(false);
  const [mainView, setMainView] = useState<'home' | 'likes' | 'recently' | 'pickup' | 'rate' | 'message' | 'product' | 'cart'>('home');
  const [selectedCategory, setSelectedCategory] = useState('For You');
  const [search, setSearch] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [isVerified, setIsVerified] = useState(false);
  const [showStartSellingModal, setShowStartSellingModal] = useState(false);
  const location = useLocation();
  const [verificationRequested, setVerificationRequested] = useState(false);
  const navigate = useNavigate();

  // Check if user is verified
  useEffect(() => {
    const checkVerification = async () => {
      if (auth.currentUser) {
        try {
          // Check user document first
          const userRef = doc(db, 'users', auth.currentUser.uid);
          const userDoc = await getDoc(userRef);
          if (userDoc.exists() && userDoc.data().isVerified === true) {
            console.log('User is verified from user document');
            setIsVerified(true);
            return;
          }
          // If not verified, set to false
          setIsVerified(false);
        } catch (error) {
          console.error('Error checking verification:', error);
          setIsVerified(false);
        }
      }
    };
    checkVerification();
  }, []);

  // Fetch products from Firebase
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsCollection = collection(db, 'products');
        const productsSnapshot = await getDocs(productsCollection);
        if (productsSnapshot.empty) {
          const sampleProducts = [
            {
              name: 'Uniform Set USTP (Female)',
              price: '₱1,000',
              image: uniformImg,
              category: 'Uniform',
              description: 'Complete USTP uniform set for female students including blouse, skirt, and necktie.'
            },
            {
              name: 'USTP ID Lace',
              price: '₱50',
              image: uniformImg,
              category: 'Accessories',
              description: 'High-quality ID lace for USTP student ID.'
            },
            {
              name: 'USTP Ballpen',
              price: '₱20',
              image: uniformImg,
              category: 'School Supplies',
              description: 'Official USTP ballpen with school logo.'
            }
          ];
          for (const product of sampleProducts) {
            await addDoc(productsCollection, product);
          }
          const newSnapshot = await getDocs(productsCollection);
          const productsList = newSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setProducts(productsList);
        } else {
          const productsList = productsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          if (auth.currentUser) {
            const userRef = doc(db, 'users', auth.currentUser.uid);
            const userDoc = await getDoc(userRef);
            if (userDoc.exists()) {
              const userData = userDoc.data();
              const likedProducts = userData.likedProducts || [];
              const productsWithLikes = productsList.map(product => ({
                ...product,
                liked: likedProducts.includes(product.id)
              }));
              setProducts(productsWithLikes);
              return;
            }
          }
          setProducts(productsList);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const path = location.pathname;
    // Check if user is trying to access restricted pages through URL
    if (!isVerified && (
      path === '/dashboard/cart' ||
      path === '/dashboard/pickup' ||
      path === '/dashboard/rate' ||
      path === '/dashboard/message'
    )) {
      setShowModal(true);
      setMainView('home');
      return;
    }

    if (path === '/dashboard/likes') {
      setMainView('likes');
    } else if (path === '/dashboard/recently-viewed') {
      setMainView('recently');
    } else if (path === '/dashboard/pickup') {
      setMainView('pickup');
    } else if (path === '/dashboard/rate') {
      setMainView('rate');
    } else if (path === '/dashboard/message') {
      setMainView('message');
    } else if (path.startsWith('/dashboard/product/')) {
      setMainView('product');
    } else if (path === '/dashboard/cart') {
      setMainView('cart');
    } else if (path === '/dashboard') {
      setMainView('home');
    }
  }, [location, isVerified]);

  // Sidebar navigation handler
  const handleSidebarNav = (view: typeof mainView) => {
    // Check if user is trying to access restricted pages
    if (!isVerified && ['cart', 'pickup', 'rate', 'message'].includes(view)) {
      setShowModal(true);
      return;
    }
    setMainView(view);
    setSelectedProduct(null);
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

  return (
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
          onStartSellingClick={() => {
            if (isVerified) {
              setShowStartSellingModal(true);
            } else {
              alert("Verify muna bago benta :P!");
            }
          }}
          verificationRequested={verificationRequested}
        />
      </div>
      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        {!selectedProduct && (
          <header className="fixed top-0 right-0 left-[348px] z-10 flex items-center justify-between px-8 pr-[47px] py-4 bg-white h-[70px] shadow-[0_4px_4px_0_rgba(0,0,0,0.1)]">
            <div className="flex items-center gap-4">
              <img src={ustpLogo} alt="USTP Things Logo" className="w-[117px] h-[63px] object-contain" />
              {mainView === 'likes' && <h1 className="text-3xl font-bold text-[#F88379] pb-1">My Likes</h1>}
              {mainView === 'recently' && <h1 className="text-3xl font-bold text-[#F88379] pb-1">Recently Viewed</h1>}
              {mainView === 'pickup' && <h1 className="text-3xl font-bold text-[#F88379] pb-1">Pick Up</h1>}
              {mainView === 'rate' && <h1 className="text-3xl font-bold text-[#F88379] pb-1">Rate</h1>}
              {mainView === 'message' && <h1 className="text-3xl font-bold text-[#F88379] pb-1">Messages</h1>}
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
          <div className="flex gap-2 px-10 py-2 mt-[80px]">
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
        <div className={`flex-1 px-10 pt-4 pb-10 ${mainView === 'home' && !selectedProduct ? 'mt-1' : selectedProduct ? 'mt-0' : 'mt-[70px]'}`}>
          {mainView === 'home' ? (
            selectedProduct ? (
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
            <MyLikes />
          ) : mainView === 'recently' ? (
            <RecentlyViewed />
          ) : mainView === 'pickup' ? (
            <div className="space-y-6">
              {pickups.map((pickup, index) => (
                <div key={index} className="bg-white rounded-2xl shadow p-6">
                  <div className="flex items-center gap-4">
                    <img src={pickup.image} alt={pickup.product} className="w-24 h-24 object-cover rounded-xl" />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">{pickup.boutique}</h3>
                      <p className="text-gray-600">{pickup.product}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : mainView === 'cart' ? (
            <MyCart />
          ) : mainView === 'rate' ? (
            <ToRateContent />
          ) : mainView === 'message' ? (
            <MessagesContent />
          ) : null}
        </div>
      </main>
      <VerificationModal open={showModal} onClose={() => setShowModal(false)} />
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
