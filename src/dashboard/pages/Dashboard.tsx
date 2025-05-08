import Sidebar from '../components/Sidebar';
import ustpLogo from '../../assets/ustp-things-logo.png';
import heartIcon from '../../assets/ustp thingS/Heart.png';
import uniformImg from '../../assets/ustp thingS/Product.png';

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

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Fixed Sidebar */}
      <div className="fixed top-0 left-0 h-screen w-80 z-20">
        <Sidebar />
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
    </div>
  );
} 