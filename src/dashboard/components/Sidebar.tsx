import { useEffect, useState } from 'react';
import { auth, db } from '../../lib/firebase';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import ustpLogo from '../../assets/ustp-things-logo.png';
import userAvatar from '../../assets/ustp thingS/Person.png';
import homeIcon from '../../assets/ustp thingS/Home.png';
import heartIcon from '../../assets/ustp thingS/Heart.png';
import clockIcon from '../../assets/ustp thingS/Clock.png';
import locationIcon from '../../assets/ustp thingS/location_on.png';
import rateIcon from '../../assets/ustp thingS/Rate.png';
import chatIcon from '../../assets/ustp thingS/Message circle.png';
import settingsIcon from '../../assets/ustp thingS/Settings.png';
import { useNavigate, Routes, Route } from 'react-router-dom';

// Add prop type
type SidebarProps = {
  onVerifyClick?: () => void;
  onHomeClick?: () => void;
  onLikesClick?: () => void;
  onRecentlyClick?: () => void;
  onPurchasesClick?: () => void;
};

export default function Sidebar({ onVerifyClick, onHomeClick, onLikesClick, onRecentlyClick, onPurchasesClick }: SidebarProps) {
  const [isVerified, setIsVerified] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState<string>('Username');
  const user = auth.currentUser;
  const navigate = useNavigate();

  useEffect(() => {
    const checkVerified = async () => {
      if (!user || !user.email) {
        setIsVerified(false);
        setLoading(false);
        return;
      }
      // Force lowercase for comparison
      const email = user.email.toLowerCase();
      // If you want to use UID instead, use:
      // const q = query(collection(db, 'verifiedAccounts'), where('id', '==', user.uid));
      const q = query(collection(db, 'verifiedAccounts'), where('email', '==', email));
      const snapshot = await getDocs(q);
      console.log('Checking verified for:', email);
      console.log('Query empty:', snapshot.empty);
      console.log('Docs found:', snapshot.docs.map(d => d.data()));
      setIsVerified(!snapshot.empty);
      setLoading(false);
    };
    checkVerified();
  }, [user]);

  useEffect(() => {
    const fetchUsername = async () => {
      if (!user) return;
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        setUsername(data.username || 'Username');
      }
    };
    fetchUsername();
  }, [user]);

  return (
    <aside className="fixed h-screen w-[348px] bg-[#FFF3F2] flex flex-col justify-between p-6 overflow-hidden">
      <div>
        {/* User Info */}
        <div className="flex items-center gap-4 mb-6">
          <img src={userAvatar} alt="User avatar" className="w-14 h-14 rounded-full border-2 border-pink-200 object-cover" />
          <div>
            <div className="font-bold text-lg text-gray-800 flex items-center gap-2">
              {username}
              {isVerified && (
                <span
                  title="Verified"
                  className="inline-flex items-center px-2 py-0.5 rounded-full bg-green-200 text-green-800 text-xs font-semibold ml-1"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  Verified
                </span>
              )}
            </div>
            <div className="text-xs text-gray-500">{user?.email || 'Email or Phone'}</div>
          </div>
        </div>
        {/* Verify Button */}
        {!loading && isVerified === false && (
          <button
            className="w-full bg-pink-300 hover:bg-pink-400 text-white font-semibold py-2 rounded-lg shadow mb-8 transition"
            onClick={onVerifyClick}
          >
            Verify Your Account
          </button>
        )}
        {/* Navigation */}
        <nav className="flex flex-col gap-4">
          <button onClick={onHomeClick} className="flex items-center gap-2 text-pink-400 font-semibold text-lg text-left">
            <img src={homeIcon} alt="Home" className="w-5 h-5" />Home
          </button>
          <button onClick={onLikesClick} className="flex items-center gap-2 text-pink-400 font-semibold text-lg text-left">
            <img src={heartIcon} alt="My Likes" className="w-5 h-5" />My Likes
          </button>
          <button onClick={onRecentlyClick} className="flex items-center gap-2 text-pink-400 font-semibold text-lg text-left">
            <img src={clockIcon} alt="Recently Viewed" className="w-5 h-5" />Recently Viewed
          </button>
          <div className="mt-4 mb-2 font-bold text-pink-600 text-xl">My Purchases</div>
          <button
            onClick={onPurchasesClick ? onPurchasesClick : () => navigate('/dashboard/pickup')}
            className="flex items-center gap-2 text-pink-400 font-semibold text-lg text-left"
          >
            <img src={locationIcon} alt="Pick Up" className="w-5 h-5" />Pick Up
          </button>
          <button className="flex items-center gap-2 text-pink-400 font-semibold text-lg text-left"><img src={rateIcon} alt="To Rate" className="w-5 h-5" />To Rate</button>
          <button className="flex items-center gap-2 text-pink-400 font-semibold text-lg text-left"><img src={chatIcon} alt="Messages" className="w-5 h-5" />Messages</button>
        </nav>
        {/* Start Selling Button */}
        <button className="w-full bg-pink-300 hover:bg-pink-400 text-white font-semibold py-2 rounded-lg shadow mt-8 mb-4 transition">Start selling now!</button>
      </div>
      {/* Settings */}
      <button
        onClick={() => navigate('/dashboard/settings')}
        className="flex items-center gap-2 text-gray-400 hover:text-pink-400 cursor-pointer mt-4"
      >
        <img src={settingsIcon} alt="Settings" className="w-5 h-5" />
        <span className="font-semibold">Settings</span>
      </button>
    </aside>
  );
} 