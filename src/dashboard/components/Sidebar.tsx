import { useEffect, useState } from 'react';
import { auth, db } from '../../lib/firebase';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import ustpLogo from '../../assets/ustp-things-logo.png';
import userAvatar from '../../assets/ustp thingS/Person.png';
import heartIcon from '../../assets/ustp thingS/Heart.png';
import clockIcon from '../../assets/ustp thingS/Clock.png';
import locationIcon from '../../assets/ustp thingS/location_on.png';
import starIcon from '../../assets/ustp thingS/Star.png';
import chatIcon from '../../assets/ustp thingS/Message circle.png';
import settingsIcon from '../../assets/ustp thingS/Settings.png';

// Add prop type
type SidebarProps = {
  onVerifyClick?: () => void;
};

export default function Sidebar({ onVerifyClick }: SidebarProps) {
  const [isVerified, setIsVerified] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState<string>('Username');
  const user = auth.currentUser;

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
    <aside className="h-full w-80 bg-pink-50 flex flex-col justify-between p-6 shadow-lg min-h-screen">
      <div>
        {/* User Info */}
        <div className="flex items-center gap-4 mb-6">
          <img src={userAvatar} alt="User avatar" className="w-14 h-14 rounded-full border-2 border-pink-200 object-cover" />
          <div>
            <div className="font-bold text-lg text-gray-800">{username}</div>
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
          <a href="#" className="flex items-center gap-2 text-pink-400 font-semibold text-lg">My Likes</a>
          <a href="#" className="flex items-center gap-2 text-pink-400 font-semibold text-lg">Recently Viewed</a>
          <div className="mt-4 mb-2 font-bold text-pink-600 text-xl">My Purchases</div>
          <a href="#" className="flex items-center gap-2 text-pink-400 font-semibold text-lg"><img src={locationIcon} alt="Pick Up" className="w-5 h-5" />Pick Up</a>
          <a href="#" className="flex items-center gap-2 text-pink-400 font-semibold text-lg"><img src={starIcon} alt="To Rate" className="w-5 h-5" />To Rate</a>
          <a href="#" className="flex items-center gap-2 text-pink-400 font-semibold text-lg"><img src={chatIcon} alt="Messages" className="w-5 h-5" />Messages</a>
        </nav>
        {/* Start Selling Button */}
        <button className="w-full bg-pink-300 hover:bg-pink-400 text-white font-semibold py-2 rounded-lg shadow mt-8 mb-4 transition">Start selling now!</button>
      </div>
      {/* Settings */}
      <div className="flex items-center gap-2 text-gray-400 hover:text-pink-400 cursor-pointer">
        <img src={settingsIcon} alt="Settings" className="w-5 h-5" />
        <span className="font-semibold">Settings</span>
      </div>
    </aside>
  );
} 