import ustpLogo from "../../assets/ustp-things-logo.png"; // Adjust path as needed

const messages = [
  {
    id: 1,
    name: "Galdo Boutique",
    avatar: ustpLogo, // Replace with actual avatar if available
    message: "Hi po. Naka beige top and black trousers ko po. Thnx :)",
  },
  {
    id: 2,
    name: "Gen Boutique",
    avatar: ustpLogo,
    message: "Hi po. Naka beige top and black trousers ko po. Thnx :)",
  },
  {
    id: 3,
    name: "Evieve Boutique",
    avatar: ustpLogo,
    message: "Hi po. Naka beige top and black trousers ko po. Thnx :)",
  },
];

export default function Messages() {
  return (
    <div className="w-full">
      <div className="flex items-center gap-4 px-8 pt-8 pb-2">
        <img src={ustpLogo} alt="USTP Things Logo" className="h-10" />
        <h1 className="text-2xl font-bold text-pink-400">My Messages</h1>
      </div>
      <div className="border-b border-gray-200 mx-8 mb-6" />
      <div className="flex flex-col gap-6 px-8 pb-8">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className="flex items-start gap-4 bg-pink-50 rounded-xl p-4 shadow-sm"
          >
            <img
              src={msg.avatar}
              alt={msg.name}
              className="w-14 h-14 rounded-full object-cover border"
            />
            <div>
              <div className="font-bold text-lg text-pink-500">{msg.name}</div>
              <div className="text-gray-700">
                <span className="font-bold">{msg.name}:</span> {msg.message}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}