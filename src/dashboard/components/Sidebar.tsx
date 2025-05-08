export default function Sidebar() {
  return (
    <aside className="h-full w-64 bg-white shadow flex flex-col p-4">
      <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
      <nav className="flex flex-col gap-4">
        <a href="#" className="text-gray-700 hover:text-pink-500">Home</a>
        <a href="#" className="text-gray-700 hover:text-pink-500">Profile</a>
        <a href="#" className="text-gray-700 hover:text-pink-500">Settings</a>
        <a href="#" className="text-gray-700 hover:text-pink-500">Logout</a>
      </nav>
    </aside>
  );
} 