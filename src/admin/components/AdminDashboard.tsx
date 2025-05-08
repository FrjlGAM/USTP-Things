import { useEffect, useState } from 'react';
import { auth, db } from '../../lib/firebase';
import { useNavigate } from 'react-router-dom';
import Logo from '../../landing/components/Logo';
import productImg from '../../assets/ustp thingS/Product.png';
import userAvatar from '../../assets/ustp thingS/Person.png';
import { collection, getDocs, deleteDoc, doc, setDoc } from 'firebase/firestore';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(auth.currentUser);
  const [tab, setTab] = useState<'dashboard' | 'account' | 'verified'>('dashboard');
  const [verifications, setVerifications] = useState<any[]>([]);
  const [loadingVerifications, setLoadingVerifications] = useState(false);
  const [verifiedAccounts, setVerifiedAccounts] = useState<any[]>([]);
  const [loadingVerified, setLoadingVerified] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        navigate('/admin/login');
      } else {
        setUser(user);
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (tab === 'account') {
      fetchVerifications();
    }
    if (tab === 'verified') {
      fetchVerifiedAccounts();
    }
    // eslint-disable-next-line
  }, [tab]);

  const fetchVerifications = async () => {
    setLoadingVerifications(true);
    const querySnapshot = await getDocs(collection(db, 'verifications'));
    const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setVerifications(data);
    setLoadingVerifications(false);
  };

  const fetchVerifiedAccounts = async () => {
    setLoadingVerified(true);
    const querySnapshot = await getDocs(collection(db, 'verifiedAccounts'));
    const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setVerifiedAccounts(data);
    setLoadingVerified(false);
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/admin/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleConfirm = async (id: string) => {
    // Find the verification data
    const verification = verifications.find(v => v.id === id);
    if (!verification) return;
    // Add to verifiedAccounts
    await setDoc(doc(db, 'verifiedAccounts', id), verification);
    // Remove from verifications
    await deleteDoc(doc(db, 'verifications', id));
    setVerifications(v => v.filter(item => item.id !== id));
    // Optionally, refresh verified accounts if on that tab
    if (tab === 'verified') fetchVerifiedAccounts();
  };

  const handleReject = async (id: string) => {
    await deleteDoc(doc(db, 'verifications', id));
    setVerifications(v => v.filter(item => item.id !== id));
  };

  // Dummy data for transactions
  const transactions = [
    {
      name: 'Uniform Set USTP (Female) – Blouse, Skirt, and Necktie',
      price: '₱1,000,000',
      quantity: 456,
      image: productImg,
    },
    {
      name: 'Uniform Set USTP (Female) – Blouse, Skirt, and Necktie',
      price: '₱1,000,000',
      quantity: 456,
      image: productImg,
    },
    {
      name: 'Uniform Set USTP (Female) – Blouse, Skirt, and Necktie',
      price: '₱1,000,000',
      quantity: 456,
      image: productImg,
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8F6FF] p-2">
      {/* Navigation Bar */}
      <nav className="bg-white rounded-xl shadow flex items-center px-8 py-3 mb-6 border border-pink-100">
        <Logo />
        <div className="flex-1 flex justify-center gap-12">
          <button className={`text-lg font-semibold pb-1 px-2 ${tab === 'dashboard' ? 'text-pink-400 border-b-2 border-pink-300' : 'text-gray-500 hover:text-pink-400'}`} onClick={() => setTab('dashboard')}>Dashboard</button>
          <button className={`text-lg font-semibold pb-1 px-2 ${tab === 'account' ? 'text-pink-400 border-b-2 border-pink-300' : 'text-gray-500 hover:text-pink-400'}`} onClick={() => setTab('account')}>Account Confirmation</button>
          <button className={`text-lg font-semibold pb-1 px-2 ${tab === 'verified' ? 'text-pink-400 border-b-2 border-pink-300' : 'text-gray-500 hover:text-pink-400'}`} onClick={() => setTab('verified')}>Verified Accounts</button>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-pink-400 text-2xl"><svg width="28" height="28" fill="none" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="currentColor"/></svg></span>
          <button onClick={handleLogout} className="text-pink-400 font-semibold hover:underline text-lg">Logout</button>
        </div>
      </nav>

      {/* Dashboard Tab */}
      {tab === 'dashboard' && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-xl border-2 border-pink-100 p-6 flex flex-col items-start">
              <span className="text-gray-500 font-medium mb-1">Total Sales</span>
              <span className="text-2xl font-bold text-gray-700">₱1,000,000</span>
            </div>
            <div className="bg-white rounded-xl border-2 border-pink-300 p-6 flex flex-col items-start">
              <span className="text-gray-500 font-medium mb-1">Total Users</span>
              <span className="text-2xl font-bold text-gray-700">10,000</span>
            </div>
            <div className="bg-yellow-50 rounded-xl border-2 border-yellow-100 p-6 flex-1">
              <span className="text-gray-500 font-medium mb-1">Earnings</span>
              <div className="flex flex-wrap gap-6 mt-2">
                <div>
                  <div className="text-xs text-gray-500">Total Earnings</div>
                  <div className="font-bold text-lg text-gray-700">₱1,000,000</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Total Revenue</div>
                  <div className="font-bold text-lg text-gray-700">₱1,000,000</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">This Week</div>
                  <div className="font-bold text-lg text-gray-700">₱1,000,000</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">This Month</div>
                  <div className="font-bold text-lg text-gray-700">₱1,000,000</div>
                </div>
              </div>
            </div>
          </div>

          {/* Transactions Table */}
          <div className="bg-[#FDF3E7] rounded-2xl border-2 border-pink-100 p-6">
            <div className="text-lg font-semibold mb-4">Transactions</div>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="text-left text-gray-500 text-base border-b border-pink-100">
                    <th className="py-2 px-2 font-medium">Name</th>
                    <th className="py-2 px-2 font-medium">Price</th>
                    <th className="py-2 px-2 font-medium">Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx, idx) => (
                    <tr key={idx} className="border-b border-pink-100 last:border-0">
                      <td className="flex items-center gap-3 py-3 px-2">
                        <img src={tx.image} alt="Product" className="w-10 h-10 rounded-full border border-pink-200" />
                        <span className="text-gray-700">{tx.name}</span>
                      </td>
                      <td className="py-3 px-2 font-semibold text-gray-700">{tx.price}</td>
                      <td className="py-3 px-2 font-semibold text-gray-700">{tx.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Account Confirmation Tab */}
      {tab === 'account' && (
        <div className="bg-white rounded-2xl border-2 border-pink-100 p-6">
          <div className="text-xl font-bold mb-4">Pending Accounts</div>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="text-left text-gray-700 text-base">
                  <th className="py-2 px-4 font-semibold bg-pink-200 rounded-l-full">Username</th>
                  <th className="py-2 px-4 font-semibold bg-pink-200">ID Number and Email</th>
                  <th className="py-2 px-4 font-semibold bg-pink-200">Date Applied</th>
                  <th className="py-2 px-4 font-semibold bg-pink-200 rounded-r-full">Confirm</th>
                </tr>
              </thead>
              <tbody>
                {loadingVerifications ? (
                  <tr><td colSpan={4} className="text-center py-8">Loading...</td></tr>
                ) : verifications.length === 0 ? (
                  <tr><td colSpan={4} className="text-center py-8 text-gray-400">No pending accounts.</td></tr>
                ) : (
                  verifications.map((v, idx) => (
                    <tr key={v.id} className="bg-yellow-50 rounded-full my-2">
                      <td className="flex items-center gap-3 py-4 px-4 rounded-l-full">
                        <img src={userAvatar} alt="Avatar" className="w-10 h-10 rounded-full border border-pink-200" />
                        <span className="font-semibold text-gray-800">{v.name || 'Unknown'}</span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="font-medium text-gray-700">{v.studentId || 'N/A'}</div>
                        <div className="text-gray-500 text-sm">{v.email}</div>
                      </td>
                      <td className="py-4 px-4">
                        {(() => {
                          const dateObj = v.createdAt?.toDate ? v.createdAt.toDate() : new Date(v.createdAt);
                          return (
                            <>
                              <div>{!isNaN(dateObj) ? dateObj.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}</div>
                              <div className="text-xs text-gray-500">{!isNaN(dateObj) ? dateObj.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }) : ''}</div>
                            </>
                          );
                        })()}
                      </td>
                      <td className="py-4 px-4 rounded-r-full flex gap-2">
                        <button onClick={() => handleConfirm(v.id)} className="bg-yellow-400 hover:bg-yellow-500 text-white font-bold px-4 py-1 rounded shadow">CONFIRM</button>
                        <button onClick={() => handleReject(v.id)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold px-4 py-1 rounded shadow">REJECT</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Verified Accounts Tab */}
      {tab === 'verified' && (
        <div className="bg-white rounded-2xl border-2 border-pink-100 p-6">
          <div className="text-xl font-bold mb-4">Verified Accounts</div>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="text-left text-gray-700 text-base">
                  <th className="py-2 px-4 font-semibold bg-pink-200 rounded-l-full">Username</th>
                  <th className="py-2 px-4 font-semibold bg-pink-200">ID Number and Email</th>
                  <th className="py-2 px-4 font-semibold bg-pink-200">Date Verified</th>
                  <th className="py-2 px-4 font-semibold bg-pink-200 rounded-r-full">Email</th>
                </tr>
              </thead>
              <tbody>
                {loadingVerified ? (
                  <tr><td colSpan={4} className="text-center py-8">Loading...</td></tr>
                ) : verifiedAccounts.length === 0 ? (
                  <tr><td colSpan={4} className="text-center py-8 text-gray-400">No verified accounts.</td></tr>
                ) : (
                  verifiedAccounts.map((v, idx) => (
                    <tr key={v.id} className="bg-yellow-50 rounded-full my-2">
                      <td className="flex items-center gap-3 py-4 px-4 rounded-l-full">
                        <img src={userAvatar} alt="Avatar" className="w-10 h-10 rounded-full border border-pink-200" />
                        <span className="font-semibold text-gray-800">{v.name || 'Unknown'}</span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="font-medium text-gray-700">{v.studentId || 'N/A'}</div>
                        <div className="text-gray-500 text-sm">{v.email}</div>
                      </td>
                      <td className="py-4 px-4">
                        {(() => {
                          const dateObj = v.createdAt?.toDate ? v.createdAt.toDate() : new Date(v.createdAt);
                          return (
                            <>
                              <div>{!isNaN(dateObj) ? dateObj.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}</div>
                              <div className="text-xs text-gray-500">{!isNaN(dateObj) ? dateObj.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }) : ''}</div>
                            </>
                          );
                        })()}
                      </td>
                      <td className="py-4 px-4 rounded-r-full">
                        <div className="text-gray-700">{v.email}</div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
} 