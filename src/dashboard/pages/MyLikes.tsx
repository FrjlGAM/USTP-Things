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

export default function MyLikes() {
  return (
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
  );
} 