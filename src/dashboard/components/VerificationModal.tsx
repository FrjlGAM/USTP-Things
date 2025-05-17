import React, { useState, useEffect } from 'react';
import { auth, db } from '../../lib/firebase';
import { collection, addDoc, doc, setDoc } from 'firebase/firestore';
import ustpLogo from '../../assets/ustp-things-logo.png';
import xIcon from '../../assets/ustp thingS/X button.png';

interface VerificationModalProps {
  open: boolean;
  onClose: () => void;
  setVerificationRequested: (val: boolean) => void;
  verificationRequested?: boolean;
}

export default function VerificationModal({ open, onClose, setVerificationRequested, verificationRequested }: VerificationModalProps) {
  const [step, setStep] = useState<'select' | 'student'>('select');
  const [form, setForm] = useState({ name: '', id: '', email: '', agree: false });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
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
      await addDoc(collection(db, 'verifications'), {
        userId: auth.currentUser.uid,
        name: form.name,
        studentId: form.id,
        email: form.email,
        agreed: form.agree,
        type: 'student',
        status: 'pending',
        createdAt: new Date(),
      });
      // Update user document with verification request
      const userRef = doc(db, 'users', auth.currentUser.uid);
      await setDoc(userRef, {
        verificationRequested: true,
        verificationRequestedAt: new Date()
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

  // Show pending verification modal if verification is requested
  if (verificationRequested) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-white/40 backdrop-blur transition-all duration-300" />
        <div className="relative bg-white rounded-3xl shadow-2xl px-8 py-8 flex flex-col items-center w-[400px] h-[350px] border-4 border-[#ECB3A8] animate-fade-in-scale">
          <button onClick={onClose} className="absolute top-4 right-4 focus:outline-none">
            <img src={xIcon} alt="Close" className="w-8 h-8" />
          </button>
          <div className="flex flex-col items-center justify-center h-full gap-4">
            <img src={ustpLogo} alt="USTP Things Logo" className="h-20" />
            <h2 className="text-3xl font-bold text-[#F88379] text-center">Verification Pending</h2>
            <p className="text-center text-gray-600 text-lg">
              Your verification request is being processed. Please wait for admin approval.
            </p>
          </div>
        </div>
      </div>
    );
  }

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