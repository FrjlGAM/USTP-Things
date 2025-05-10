import Sidebar from '../components/Sidebar';
import ustpLogo from '../../assets/ustp-things-logo.png';
import uniformImg from '../../assets/ustp thingS/Product.png';
import xIcon from '../../assets/ustp thingS/X button.png';
import React, { useState } from 'react';
import { db } from '../../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import MyLikes from './MyLikes';
import RecentlyViewed from './RecentlyViewed';
import { ProductDetails } from './ProductDetails';

const products = [
  {
    id: 1,
    name: 'Uniform Set USTP (Female) ...',
    price: '₱1,000,000',
    image: uniformImg,
  },
  {
    id: 2,
    name: 'Item 2 [Desc]',
    price: '₱1,000,000',
    image: 'https://static.wikia.nocookie.net/spongebob/images/7/7e/Nat_Peterson_29.png',
  },
];

const categories = [
  'For You',
  'Electronics',
  'Books',
  'Uniform',
  'Gel pens',
  'Graph paper',
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
      await addDoc(collection(db, 'verifications'), {
        name: form.name,
        studentId: form.id,
        email: form.email,
        agreed: form.agree,
        type: 'student',
        createdAt: new Date(),
      });
      setSuccess(true);
      setForm({ name: '', id: '', email: '', agree: false });
    } catch (err) {
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
      <div className="relative bg-white rounded-3xl shadow-2xl px-12 py-10 flex flex-col items-center min-w-[400px] min-h-[350px] border-4 border-pink-100 animate-fade-in-scale">
        <button onClick={onClose} className="absolute top-4 right-4 focus:outline-none">
          <img src={xIcon} alt="Close" className="w-8 h-8" />
        </button>
        <img src={ustpLogo} alt="USTP Things Logo" className="h-20 mb-2" />
        <h2 className="text-3xl font-bold text-pink-400 mb-8 mt-2 text-center">Account Verification</h2>
        {step === 'select' && (
          <>
            <button className="w-72 bg-pink-300 hover:bg-pink-400 text-white font-bold text-2xl py-4 rounded-2xl shadow mb-6 transition" onClick={() => setStep('student')}>I am a student.</button>
            <button className="w-72 bg-pink-300 hover:bg-pink-400 text-white font-bold text-2xl py-4 rounded-2xl shadow transition">I am a company.</button>
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
              className="w-full bg-pink-300 hover:bg-pink-400 text-white font-bold text-lg py-3 rounded-2xl shadow transition disabled:opacity-50"
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
  const [mainView, setMainView] = useState<'home' | 'likes' | 'recently' | 'purchases'>('home');
  const [selectedCategory, setSelectedCategory] = useState('For You');
  const [search, setSearch] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  // Sidebar navigation handler
  const handleSidebarNav = (view: typeof mainView) => {
    setMainView(view);
    setSelectedProduct(null); // Reset product detail when navigating
  };

  // Filtered products (dummy logic for now)
  const filteredProducts = products.filter(
    (p) =>
      (selectedCategory === 'For You' || p.name.toLowerCase().includes(selectedCategory.toLowerCase())) &&
      (search === '' || p.name.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="flex min-h-screen bg-[#f7f6fd]">
      {/* Sidebar (unchanged) */}
      <div className="w-80 flex-shrink-0">
        <Sidebar
          onVerifyClick={() => setShowModal(true)}
          onHomeClick={() => handleSidebarNav('home')}
          onLikesClick={() => handleSidebarNav('likes')}
          onRecentlyClick={() => handleSidebarNav('recently')}
          onPurchasesClick={() => handleSidebarNav('purchases')}
        />
      </div>
      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-12 py-6 border-b border-gray-200 bg-white">
          <div className="flex items-center gap-4">
            <img src={ustpLogo} alt="USTP Things Logo" className="h-12 w-auto" />
            {mainView === 'home' && <h1 className="text-3xl font-bold text-pink-500">USTP Things</h1>}
            {mainView === 'likes' && <h1 className="text-3xl font-bold text-pink-500 pb-1">My Likes</h1>}
            {mainView === 'recently' && <h1 className="text-3xl font-bold text-pink-500 pb-1">Recently Viewed</h1>}
            {mainView === 'purchases' && <h1 className="text-3xl font-bold text-pink-500 pb-1">Pick Up</h1>}
          </div>
          {/* Search bar and cart */}
          <div className="flex items-center gap-4">
            <input
              className="px-4 py-2 rounded-full border border-pink-200 focus:outline-none"
              placeholder="Search"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <div className="w-8 h-8 flex items-center justify-center bg-pink-100 rounded-full">
              🛒
            </div>
          </div>
        </div>
        {/* Category Chips (only on Home/Product Feed) */}
        {mainView === 'home' && !selectedProduct && (
          <div className="flex gap-2 px-12 py-4">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`px-4 py-1 rounded-full border text-sm font-semibold transition ${selectedCategory === cat ? 'bg-pink-400 text-white border-pink-400' : 'bg-white text-gray-600 border-gray-300 hover:bg-pink-100'}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
        {/* Main Content Switcher */}
        <div className="flex-1 p-10">
          {mainView === 'home' && selectedProduct ? (
            <ProductDetails product={selectedProduct} onBack={() => setSelectedProduct(null)} />
          ) : mainView === 'home' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {filteredProducts.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl shadow p-4 flex flex-col items-center border-2 border-gray-100 hover:shadow-lg transition cursor-pointer"
                  onClick={() => setSelectedProduct(item)}
                >
                  <img src={item.image} alt={item.name} className="w-48 h-48 object-cover rounded-xl mb-4" />
                  <div className="w-full flex flex-col gap-1">
                    <span className="font-bold text-lg text-gray-800 truncate">{item.name}</span>
                    <span className="text-pink-500 font-semibold text-md">{item.price}</span>
                  </div>
                  <div className="w-full flex justify-end mt-2">
                    <button className="text-pink-400 hover:text-pink-600">
                      <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 15l7-7 7 7" /></svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : mainView === 'likes' ? <MyLikes /> : mainView === 'recently' ? <RecentlyViewed /> : null}
          {/* Add more views for purchases, etc. as needed */}
        </div>
      </main>
      <VerificationModal open={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
} 