import { Search } from "lucide-react";
import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

export default function Header({ search, setSearch, onOpenOrders }) {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="fixed top-0 w-full z-50 bg-[#fef9f2]/80 dark:bg-[#1d1c18]/80 backdrop-blur-xl shadow-[0_8px_24px_rgba(29,28,24,0.06)] px-6 py-4 flex items-center justify-between max-w-full border-b border-[#e6e2db]/50 dark:border-white/5">
      <div className="flex items-center gap-12">
        <h1 className="font-headline italic font-black text-[#361f1a] dark:text-[#fef9f2] text-2xl tracking-tight">Varun 
          Cafe
        </h1>
        
        {/* Search Bar - tactical native integration */}
        <div className="hidden lg:flex items-center bg-[#ece7e1] dark:bg-[#32302c] rounded-full px-5 py-2 w-96 group focus-within:ring-2 ring-[#d4c3bf]/50 dark:ring-[#827471]/50 transition-all shadow-inner">
          <span className="material-symbols-outlined text-[#504442] dark:text-[#ded9d3] mr-3 text-xl">search</span>
          <input 
            value={search || ""}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent border-none focus:ring-0 text-sm w-full placeholder:text-[#827471] dark:placeholder:text-[#827471] placeholder:font-light font-body text-[#1d1c18] dark:text-[#fef9f2] outline-none" 
            placeholder="Search for your roast..." 
            type="text"
          />
        </div>
      </div>

      {/* Navigation Links (Desktop) */}
      <nav className="flex items-center gap-8">
        <div className="hidden xl:flex gap-8">
          <button type="button" onClick={onOpenOrders} className="font-label font-medium text-[#504442] dark:text-[#d4c3bf] hover:text-[#361f1a] dark:hover:text-[#fef9f2] transition-colors pb-1">Orders</button>
        </div>
        
        {/* Mobile Search Icon */}
        <div className="flex lg:hidden items-center bg-[#ece7e1] dark:bg-[#32302c] rounded-full px-4 py-2 flex-1 max-w-[200px]">
          <Search size={16} className="text-[#504442] dark:text-[#ded9d3] mr-2" />
          <input 
            value={search || ""}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent border-none text-[13px] w-full placeholder:text-[#827471] outline-none" 
            placeholder="Search..." 
          />
        </div>
        
        {/* User / Settings Profile */}
        <div className="hidden sm:flex items-center gap-3">
          {user ? (
            <div className="group relative">
              <div className="w-10 h-10 rounded-full bg-[#f8f3ec] dark:bg-[#1d1c18] border border-[#e6e2db] dark:border-white/10 flex items-center justify-center p-0.5 shadow-sm overflow-hidden cursor-pointer">
                <div className="w-full h-full rounded-full bg-[#361f1a] flex items-center justify-center text-[#ffffff] font-headline font-bold text-sm">
                  {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                </div>
              </div>
              <div className="absolute right-0 top-12 mt-2 w-48 bg-white dark:bg-[#32302c] rounded-xl shadow-lg border border-[#e6e2db] dark:border-white/10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="p-3">
                  <p className="text-sm font-medium text-[#361f1a] dark:text-[#fef9f2] truncate">{user.name}</p>
                  <p className="text-xs text-[#827471] dark:text-[#d4c3bf] truncate">{user.email}</p>
                </div>
                <div className="border-t border-[#e6e2db] dark:border-white/10 p-2">
                  <Link to={user.role === 'owner' ? '/owner' : '/staff'} className="block w-full text-left px-3 py-2 text-sm text-[#504442] dark:text-[#d4c3bf] hover:bg-[#ece7e1] dark:hover:bg-[#1d1c18] rounded-lg transition-colors">
                    Dashboard
                  </Link>
                  <button onClick={handleLogout} className="block w-full text-left px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors mt-1">
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <Link 
              to="/login" 
              className="bg-[#361f1a] hover:bg-[#504442] text-white px-6 py-2 rounded-full font-medium transition-colors text-sm shadow-sm"
            >
              Sign In
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}