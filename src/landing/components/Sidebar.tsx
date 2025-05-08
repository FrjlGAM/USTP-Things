interface SidebarProps {
  onLoginClick: () => void;
  onSignupClick: () => void;
}

export default function Sidebar({ onLoginClick, onSignupClick }: SidebarProps) {
  return (
    <div className="flex flex-col items-center gap-8 py-20 bg-pink-50 min-h-screen w-1/5">
      <button
        className="w-40 py-3 rounded-full border border-pink-300 text-pink-500 font-bold text-xl hover:bg-pink-100 transition"
        onClick={onLoginClick}
      >
        Login
      </button>
      <button
        className="w-40 py-3 rounded-full border border-pink-300 text-pink-500 font-bold text-xl hover:bg-pink-100 transition"
        onClick={onSignupClick}
      >
        Sign Up
      </button>
    </div>
  );
} 