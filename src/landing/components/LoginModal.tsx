import logo from '../../assets/ustp-things-logo.png';
import { useState } from 'react';
import { auth } from '../../lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to login.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      <div className="relative bg-white bg-opacity-70 rounded-2xl shadow-xl p-8 w-full max-w-md mx-4 flex flex-col items-center border border-pink-200 backdrop-blur-md pointer-events-auto">
        <button
          className="absolute top-4 right-4 text-3xl text-pink-400 hover:text-pink-600 focus:outline-none"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
        <img src={logo} alt="USTP Things Logo" className="w-24 mx-auto mb-2" />
        <h2 className="text-2xl font-bold text-pink-400 mb-6 mt-2">Login</h2>
        <form className="w-full flex flex-col gap-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-left text-black font-medium mb-1">Email</label>
            <div className="relative">
              <input
                type="email"
                className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:border-pink-400"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">✉️</span>
            </div>
          </div>
          <div>
            <label className="block text-left text-black font-medium mb-1">Password</label>
            <div className="relative">
              <input
                type="password"
                className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:border-pink-400 pr-10"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer">👁️</span>
            </div>
          </div>
          <div className="flex items-center justify-between text-sm mb-2">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="accent-pink-400" /> Remember me
            </label>
            <a href="#" className="text-pink-400 hover:underline">Forget Password</a>
          </div>
          {error && <div className="text-red-500 text-sm text-center">{error}</div>}
          <button type="submit" className="w-full py-3 rounded-full bg-pink-300 text-white font-bold text-lg hover:bg-pink-400 transition disabled:opacity-60" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
} 