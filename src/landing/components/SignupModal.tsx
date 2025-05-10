import logo from '../../assets/ustp-things-logo.png';
import emailIcon from '../../assets/ustp thingS/Email.png';
import usernameIcon from '../../assets/ustp thingS/Username.png';
import eyeIcon from '../../assets/ustp thingS/Eye.png';
import eyeOffIcon from '../../assets/ustp thingS/Eye off.png';
import { useState } from 'react';
import { auth, db } from '../../lib/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SignupModal({ isOpen, onClose }: SignupModalProps) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // Save username and email to Firestore 'users' collection
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        username,
        email: email.toLowerCase(),
        createdAt: new Date(),
      });
      setSuccess('Account created successfully!');
      setUsername('');
      setEmail('');
      setPassword('');
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to sign up.');
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
        <h2 className="text-2xl font-bold text-pink-400 mb-6 mt-2">Sign Up</h2>
        <form className="w-full flex flex-col gap-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-left text-black font-medium mb-1">Username</label>
            <div className="relative">
              <input 
                type="text" 
                value={username} 
                onChange={e => setUsername(e.target.value)} 
                className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:border-pink-400" 
                required 
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2">
                <img src={usernameIcon} alt="Username" className="w-5 h-5" />
              </span>
            </div>
          </div>
          <div>
            <label className="block text-left text-black font-medium mb-1">Email</label>
            <div className="relative">
              <input 
                type="email" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:border-pink-400" 
                required 
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2">
                <img src={emailIcon} alt="Email" className="w-5 h-5" />
              </span>
            </div>
          </div>
          <div>
            <label className="block text-left text-black font-medium mb-1">Password</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:border-pink-400" 
                required 
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 focus:outline-none"
              >
                <img 
                  src={showPassword ? eyeIcon : eyeOffIcon} 
                  alt={showPassword ? "Hide password" : "Show password"} 
                  className="w-5 h-5"
                />
              </button>
            </div>
          </div>
          {error && <div className="text-red-500 text-sm text-center">{error}</div>}
          {success && <div className="text-green-600 text-sm text-center">{success}</div>}
          <button type="submit" className="w-full py-3 rounded-full bg-pink-300 text-white font-bold text-lg hover:bg-pink-400 transition disabled:opacity-60" disabled={loading}>{loading ? 'Signing Up...' : 'Sign Up'}</button>
        </form>
      </div>
    </div>
  );
} 