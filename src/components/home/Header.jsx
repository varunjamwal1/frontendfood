import { Search, Clock, User } from "lucide-react";
import { useMemo } from "react";

export default function Header({ search, setSearch, user }) {
  /* ===============================
      TIME-BASED GREETING
  =============================== */

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning ☀️";
    if (hour < 18) return "Good Afternoon 🌤️";
    return "Good Evening 🌙";
  }, []);

  /* ===============================
      STORE STATUS (Example: 9AM - 10PM)
  =============================== */

  const isOpen = useMemo(() => {
    const hour = new Date().getHours();
    return hour >= 9 && hour < 22;
  }, []);

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-white/90 border-b border-gray-100">
      <div className="max-w-2xl mx-auto px-4 py-4">
        
        {/* Top Row */}
        <div className="flex items-center justify-between mb-3">
          
          {/* Store Info */}
          <div>
            <h1 className="text-2xl font-extrabold text-orange-600 tracking-tight">
              ☕ Varun Store
            </h1>

            <div className="flex items-center gap-3 mt-1">
              <div
                className={`text-xs flex items-center gap-1 font-medium ${
                  isOpen ? "text-green-600" : "text-red-500"
                }`}
              >
                <Clock size={14} />
                {isOpen ? "Open Now" : "Closed"}
              </div>

              <span className="text-xs text-gray-400">
                9:00 AM - 10:00 PM
              </span>
            </div>
          </div>

          {/* User Info */}
          {user && (
            <div className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-full">
              <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white text-sm font-bold">
                {user.name?.charAt(0).toUpperCase() || <User size={16} />}
              </div>
              <div className="hidden sm:block">
                <p className="text-xs text-gray-500">{greeting}</p>
                <p className="text-sm font-semibold text-gray-700">
                  {user.name}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />

          <input
            type="text"
            placeholder="Search for burgers, drinks, snacks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-100 rounded-full text-sm
                       focus:outline-none focus:ring-2 focus:ring-orange-300
                       focus:bg-white transition-all duration-300 shadow-sm"
          />
        </div>
      </div>
    </header>
  );
}