import React, { useState, useEffect, useContext } from "react";
import { LogOut, User, Clock } from "lucide-react";
import { AuthContext } from "../../context/AuthContext";

const Header = ({ activeTab, setActiveTab }) => {
  const { user, logout } = useContext(AuthContext);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Real-time Clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <header className="w-full h-16 flex justify-between items-center px-6 bg-gray-800 border-b border-gray-700 shadow-md">
      
      {/* LEFT SIDE */}
      <div className="flex items-center gap-8">
        <h1 className="text-xl md:text-2xl font-extrabold text-orange-500 tracking-wide">
          POS SYSTEM
        </h1>

        {/* Tabs */}
        <div className="flex bg-gray-700 rounded-lg p-1">
          <button
            onClick={() => setActiveTab("pos")}
            className={`px-5 py-1.5 rounded-md text-sm font-semibold transition-all ${
              activeTab === "pos"
                ? "bg-orange-500 text-white shadow-md"
                : "text-gray-400 hover:text-white"
            }`}
          >
            New Order
          </button>

          <button
            onClick={() => setActiveTab("history")}
            className={`px-5 py-1.5 rounded-md text-sm font-semibold transition-all ${
              activeTab === "history"
                ? "bg-orange-500 text-white shadow-md"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Order History
          </button>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-6">
        {/* Clock */}
        <div className="text-right text-sm hidden md:block">
          <div className="flex items-center gap-2 font-mono text-white font-bold">
            <Clock size={16} className="text-orange-500" />
            {currentTime.toLocaleTimeString()}
          </div>
          <span className="text-xs text-gray-400">
            {formatDate(currentTime)}
          </span>
        </div>

        <div className="h-8 w-[1px] bg-gray-600"></div>

        {/* User */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden md:block">
            <p className="text-sm font-bold text-white">
              {user?.name || "Staff"}
            </p>
            <p className="text-xs text-green-400">Active</p>
          </div>

          <div className="bg-gray-700 p-2 rounded-full border border-gray-600">
            <User size={18} />
          </div>

          <button
            onClick={logout}
            className="p-2 bg-red-600/20 text-red-500 hover:bg-red-600 hover:text-white rounded-lg transition"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;