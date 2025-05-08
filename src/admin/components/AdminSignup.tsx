import logo from '../../assets/ustp-things-logo.png';
import adminBg from '../../assets/admin.png';
import { useState } from 'react';
import { auth, db } from '../../lib/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

export default function AdminSignup() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [adminCode, setAdminCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    // This is a simple admin code check. In a real application, 
    // you would want to store this securely and validate it properly
    if (adminCode !== 'ADMIN123') {
      setError('Invalid admin code');
      setLoading(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Store additional admin information in Firestore
      await setDoc(doc(db, 'admins', userCredential.user.uid), {
        name,
        email,
        role: 'admin',
        createdAt: new Date().toISOString()
      });

      setSuccess('Admin account created successfully!');
      setName('');
      setEmail('');
      setPassword('');
      setAdminCode('');
      navigate('/admin/login');
    } catch (err: any) {
      setError(err.message || 'Failed to sign up.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${adminBg})` }}
    >
      <div className="bg-white bg-opacity-70 rounded-2xl shadow-xl p-8 w-full max-w-md mx-4 flex flex-col items-center border border-pink-200 backdrop-blur-md">
        <img src={logo} alt="USTP Things Logo" className="w-24 mx-auto mb-2" />
        <h2 className="text-2xl font-bold text-pink-400 mb-6 mt-2">Admin Sign Up</h2>
        <form className="w-full flex flex-col gap-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-left text-black font-medium mb-1">Name</label>
            <input 
              type="text" 
              value={name} 
              onChange={e => setName(e.target.value)} 
              className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:border-pink-400" 
              required 
            />
          </div>
          <div>
            <label className="block text-left text-black font-medium mb-1">Email</label>
            <input 
              type="email" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:border-pink-400" 
              required 
            />
          </div>
          <div>
            <label className="block text-left text-black font-medium mb-1">Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:border-pink-400" 
              required 
            />
          </div>
          <div>
            <label className="block text-left text-black font-medium mb-1">Admin Code</label>
            <input 
              type="password" 
              value={adminCode} 
              onChange={e => setAdminCode(e.target.value)} 
              className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:border-pink-400" 
              required 
            />
          </div>
          {error && <div className="text-red-500 text-sm text-center">{error}</div>}
          {success && <div className="text-green-600 text-sm text-center">{success}</div>}
          <button 
            type="submit" 
            className="w-full py-3 rounded-full bg-pink-300 text-white font-bold text-lg hover:bg-pink-400 transition disabled:opacity-60" 
            disabled={loading}
          >
            {loading ? 'Signing Up...' : 'Sign Up'}
          </button>
        </form>
      </div>
    </div>
  );
} 