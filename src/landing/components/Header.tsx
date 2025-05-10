import Logo from './Logo';
import cartIcon from '../../assets/ustp thingS/Shopping cart.png';

export default function Header() {
  return (
    <header className="flex items-center justify-between px-8 py-4 bg-pink-50">
      <Logo />
      <div className="flex items-center gap-4">
        <input
          className="px-4 py-2 rounded-full border border-pink-200 focus:outline-none"
          placeholder="Search"
        />
        <img src={cartIcon} alt="Shopping Cart" className="w-[30px] h-[30px]" />
      </div>
    </header>
  );
} 