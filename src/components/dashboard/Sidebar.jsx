import React from "react";
import {
  LayoutDashboard,
  Layers,
  Utensils,
  Coffee,
  Receipt,
  LogOut,
  Users,
  Settings,
  Wallet // Added for Earning
} from "lucide-react";

export default function Sidebar({ activeTab, setActiveTab, user, onLogout }) {
  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "earning", label: "Earning", icon: Wallet }, // ✅ New Tab
    { id: "orders", label: "Orders", icon: Receipt },
    { id: "staff", label: "Staff", icon: Users },
    { id: "categories", label: "Categories", icon: Layers },
    { id: "items", label: "Items", icon: Utensils },
    { id: "tables", label: "Tables", icon: Coffee },
    { id: "taxes", label: "Taxes", icon: Settings },
  ];

  return (
    <aside className="fixed top-0 left-0 h-screen w-64 bg-slate-800 text-white flex flex-col border-r border-slate-700 z-20">
      {/* Header */}
      <div className="px-6 py-6 border-b border-slate-700">
        <h1 className="text-2xl font-extrabold text-orange-500 tracking-wide">Varun Store</h1>
        <p className="text-xs text-slate-400 mt-1">Restaurant Management</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto no-scrollbar">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-all duration-200 group ${
                isActive ? "bg-orange-500 text-white shadow-lg " : "text-slate-300 hover:bg-slate-700 hover:text-white"
              }`}
            >
              <Icon size={20} className={`${isActive ? "text-white" : "text-slate-400 group-hover:text-white"}`} />
              <span className="font-medium">{tab.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-700 bg-slate-800">
        <div className="flex items-center gap-3 mb-4 p-2 rounded-lg bg-slate-700/50">
          <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-lg">
            {user?.name?.charAt(0).toUpperCase() || "O"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate">{user?.name || "Owner"}</p>
            <p className="text-xs text-green-400">Online</p>
          </div>
        </div>
        <button onClick={onLogout} className="w-full py-2.5 text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-lg transition-colors flex items-center justify-center gap-2">
          <LogOut size={18} /> Logout
        </button>
      </div>
    </aside>
  );
}