import Sidebar from '../components/Sidebar';
import ustpLogo from '../../assets/ustp-things-logo.png';
import heartIcon from '../../assets/ustp thingS/Heart.png';
import uniformImg from '../../assets/ustp thingS/Product.png';
import xIcon from '../../assets/ustp thingS/X button.png';
import React, { useState } from 'react';
import { db } from '../../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

const likes = [
  {
    id: 1,
    name: 'Uniform Set USTP (Female)',
    price: '₱1,000,000',
    image: uniformImg,
  },
  {
    id: 2,
    name: 'Genevieve Galdo',
    price: '₱1,000,000',
    image: 'https://static.wikia.nocookie.net/spongebob/images/7/7e/Nat_Peterson_29.png',
  },
  {
    id: 3,
    name: 'Genevieve Galdo',
    price: '₱1,000,000',
    image: 'https://static.wikia.nocookie.net/spongebob/images/7/7e/Nat_Peterson_29.png',
  },
  {
    id: 4,
    name: 'Genevieve Galdo',
    price: '₱1,000,000',
    image: 'https://static.wikia.nocookie.net/spongebob/images/7/7e/Nat_Peterson_29.png',
  },
  {
    id: 5,
    name: 'Genevieve Galdo',
    price: '₱1,000,000',
    image: 'https://static.wikia.nocookie.net/spongebob/images/7/7e/Nat_Peterson_29.png',
  },
  {
    id: 6,
    name: 'Genevieve Galdo',
    price: '₱1,000,000',
    image: 'https://static.wikia.nocookie.net/spongebob/images/7/7e/Nat_Peterson_29.png',
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

  // Pass a prop to Sidebar to trigger modal
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Fixed Sidebar */}
      <div className="fixed top-0 left-0 h-screen w-80 z-20">
        <Sidebar onVerifyClick={() => setShowModal(true)} />
      </div>
      {/* Main Content with left margin */}
      <main className="ml-80 flex flex-col bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="flex items-center gap-4 px-12 py-6 border-b border-gray-200">
          <img src={ustpLogo} alt="USTP Things Logo" className="h-12 w-auto" />
          <h1 className="text-3xl font-bold text-pink-500 border-b-4 border-pink-200 pb-1">My Likes</h1>
        </div>
        {/* Likes Grid */}
        <div className="flex-1 p-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {likes.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl shadow p-4 flex flex-col items-center border-2 border-gray-100 hover:shadow-lg transition">
                <img src={item.image} alt={item.name} className="w-48 h-48 object-cover rounded-xl mb-4" />
                <div className="w-full flex flex-col gap-1">
                  <span className="font-bold text-lg text-gray-800 truncate">{item.name}</span>
                  <span className="text-pink-500 font-semibold text-md">{item.price}</span>
                </div>
                <div className="w-full flex justify-end mt-2">
                  <img src={heartIcon} alt="Like" className="w-7 h-7" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <VerificationModal open={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
} 