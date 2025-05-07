import Logo from './Logo';

export default function Header() {
  return (
    <header className="flex items-center justify-between px-8 py-4 bg-pink-50">
      <Logo />
      <div className="flex items-center gap-4">
        <input
          className="px-4 py-2 rounded-full border border-pink-200 focus:outline-none"
          placeholder="Search"
        />
        {/* Cart Icon Placeholder */}
        <div className="w-8 h-8 flex items-center justify-center bg-pink-100 rounded-full">
          🛒
        </div>
      </div>
    </header>
  );
} 