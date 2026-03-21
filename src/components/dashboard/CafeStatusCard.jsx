// import { useState, useEffect, useCallback } from 'react';
// import { WifiOff, AlertCircle, CheckCircle, RefreshCw, Coffee } from 'lucide-react';
// import { cafeStatusAPI } from '../../services/api';

// const POLL_INTERVAL = 15000;

// /* ─── Premium Keyframe Animations ─── */
// const INJECT_STYLES = `
//   @keyframes status-pulse-ring {
//     0%   { transform: scale(0.95); opacity: 1;   }
//     70%  { transform: scale(2.5);  opacity: 0;   }
//     100% { transform: scale(2.5);  opacity: 0;   }
//   }
//   @keyframes status-shimmer {
//     0%   { background-position: -800px 0; }
//     100% { background-position: 800px 0;  }
//   }
//   @keyframes status-float {
//     0%, 100% { transform: translateY(0px) scale(1); }
//     50%      { transform: translateY(-6px) scale(1.02); }
//   }
//   @keyframes status-fade-in {
//     from { opacity: 0; transform: translateY(-8px); }
//     to   { opacity: 1; transform: translateY(0);    }
//   }
//   @keyframes status-slide-up {
//     from { opacity: 0; transform: translateY(30px) scale(0.96); filter: blur(4px); }
//     to   { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
//   }
//   @keyframes status-spin {
//     from { transform: rotate(0deg); }
//     to   { transform: rotate(360deg); }
//   }

//   .status-spin-anim {
//     animation: status-spin 1s cubic-bezier(0.4, 0, 0.2, 1) infinite;
//   }
//   .status-bar-enter {
//     animation: status-fade-in 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
//   }
//   .status-card-enter {
//     animation: status-slide-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
//   }
//   .pulse-dot-active::after {
//     content: '';
//     position: absolute;
//     inset: -2px;
//     border-radius: 50%;
//     border: 1px solid #10b981;
//     animation: status-pulse-ring 2s cubic-bezier(0.16, 1, 0.3, 1) infinite;
//   }
  
//   .shimmer-bg {
//     background: linear-gradient(
//       90deg,
//       rgba(255,255,255,0.03) 0%,
//       rgba(255,255,255,0.08) 50%,
//       rgba(255,255,255,0.03) 100%
//     );
//     background-size: 800px 100%;
//     animation: status-shimmer 2s infinite linear;
//   }
  
//   /* Prevent scrolling when full screen is active */
//   body.status-locked {
//     overflow: hidden;
//   }
// `;

// let stylesInserted = false;
// function insertPremiumStyles() {
//   if (stylesInserted || typeof document === 'undefined') return;
//   const style = document.createElement('style');
//   style.textContent = INJECT_STYLES;
//   document.head.appendChild(style);
//   stylesInserted = true;
// }

// export default function CafeStatus({ children }) {
//   const [cafeStatus, setCafeStatus] = useState({ isOnline: true, message: '' });
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [lastUpdated, setLastUpdated] = useState(null);
//   const [isRefreshing, setIsRefreshing] = useState(false);

//   useEffect(() => {
//     insertPremiumStyles();
//     return () => {
//       document.body.classList.remove('status-locked');
//     };
//   }, []);

//   // Lock body scroll only when offline
//   useEffect(() => {
//     if (!loading && !error && !cafeStatus.isOnline) {
//       document.body.classList.add('status-locked');
//     } else {
//       document.body.classList.remove('status-locked');
//     }
//   }, [loading, error, cafeStatus.isOnline]);

//   const fetchCafeStatus = useCallback(async (isManual = false) => {
//     try {
//       setError(null);
//       if (isManual) {
//         setIsRefreshing(true);
//       } else {
//         setLoading(true);
//       }

//       // Format current time properly (e.g. 5:30 PM)
//       const now = new Date();
//       const timeStr = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

//       const response = await cafeStatusAPI.get();
//       setCafeStatus(response.data);
//       setLastUpdated(timeStr);
//     } catch (err) {
//       console.error('Cafe status error:', err);
//       setError('Connection Unavailable');
//       // Graceful fallback so they don't get blocked entirely if API fails,
//       // but show error banner
//       setCafeStatus({ isOnline: true, message: 'Welcome!' });
//     } finally {
//       requestAnimationFrame(() => {
//         setLoading(false);
//         setIsRefreshing(false);
//       });
//     }
//   }, []);

//   useEffect(() => {
//     fetchCafeStatus();
//     const interval = setInterval(fetchCafeStatus, POLL_INTERVAL);
//     return () => clearInterval(interval);
//   }, [fetchCafeStatus]);

//   /* ─── STATE 1: LOADING ─── */
//   if (loading) {
//     return (
//       <div className="status-bar-enter fixed top-0 inset-x-0 z-[100] h-14 bg-gray-900/95 backdrop-blur-xl border-b border-white/5 flex items-center shadow-sm">
//         <div className="shimmer-bg absolute inset-0 mix-blend-overlay"></div>
//         <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 flex items-center justify-between relative z-10">
//           <div className="flex items-center gap-3">
//             <Coffee className="w-4 h-4 text-white/40" />
//             <div className="h-2.5 w-32 bg-white/10 rounded-full overflow-hidden"></div>
//           </div>
//           <div className="h-2 w-16 bg-white/10 rounded-full"></div>
//         </div>
//       </div>
//     );
//   }

//   /* ─── STATE 2: ERROR ─── */
//   if (error) {
//     return (
//       <div className="status-bar-enter fixed top-0 inset-x-0 z-[100] bg-red-500/95 backdrop-blur-xl border-b border-red-400/30 text-white shadow-lg overflow-hidden">
//         {/* Subtle patterned overlay */}
//         <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-12 flex items-center justify-between relative z-10">
//           <div className="flex items-center gap-3">
//             <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
//               <AlertCircle className="w-3.5 h-3.5 text-white" />
//             </div>
//             <span className="text-sm font-semibold tracking-wide drop-shadow-sm">{error}</span>
//           </div>
//           <button
//             onClick={() => fetchCafeStatus(true)}
//             className="group flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/10 hover:bg-black/20 border border-black/5 hover:border-black/10 transition-all active:scale-95"
//           >
//             <RefreshCw className={`w-3.5 h-3.5 opacity-80 group-hover:opacity-100 ${isRefreshing ? 'status-spin-anim' : ''}`} />
//             <span className="text-xs font-medium">Retry Connect</span>
//           </button>
//         </div>
//       </div>
//     );
//   }

//   /* ─── STATE 3: CLOSED (FULL SCREEN) ─── */
//   if (!cafeStatus.isOnline) {
//     return (
//       <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center px-4 bg-[#0a0604]">
//         {/* Deep, Premium Ambient Glows */}
//         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-orange-600/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen transition-opacity duration-1000"></div>
//         <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[100px] pointer-events-none mix-blend-screen transition-opacity duration-1000"></div>
        
//         {/* Frost Glass Card */}
//         <div className="status-card-enter relative w-full max-w-[440px] z-10">
          
//           {/* Card Frame & Glass */}
//           <div className="bg-white/[0.02] backdrop-blur-[40px] border border-white/[0.08] shadow-[0_32px_80px_-12px_rgba(0,0,0,0.8)] rounded-[2rem] p-8 sm:p-10 relative overflow-hidden group">
            
//             {/* Minimalist Top Accent Highlight */}
//             <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-orange-500/50 to-transparent opacity-60"></div>

//             {/* Floating Icon */}
//             <div className="flex justify-center mb-8" style={{ animation: 'status-float 4s ease-in-out infinite' }}>
//               <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-orange-500/20 to-orange-900/40 border border-orange-500/20 shadow-[0_0_40px_rgba(249,115,22,0.15)] flex items-center justify-center relative">
//                 <div className="absolute inset-0 rounded-2xl bg-orange-500 blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-700"></div>
//                 <WifiOff className="w-8 h-8 text-orange-400 relative z-10" strokeWidth={1.5} />
//               </div>
//             </div>

//             {/* Typography */}
//             <div className="text-center mb-8">
//               <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3 bg-gradient-to-b from-white via-white to-white/60 bg-clip-text text-transparent">
//                 We're Closed
//               </h1>
//               <p className="text-[15px] leading-relaxed text-white/50 font-medium px-4">
//                 {cafeStatus.message || "We're currently taking a break. You can browse, but orders are paused."}
//               </p>
//             </div>

//             {/* Status Metadata */}
//             <div className="flex justify-center mb-8">
//               <div className="inline-flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.05]">
//                 <div className="w-1.5 h-1.5 rounded-full bg-orange-500/60 shadow-[0_0_8px_rgba(249,115,22,0.6)]"></div>
//                 <span className="text-[11px] font-semibold tracking-wider text-white/40 uppercase">
//                   Last Updated {lastUpdated}
//                 </span>
//               </div>
//             </div>

//             {/* Premium Interactive Button */}
//             <button
//               onClick={() => fetchCafeStatus(true)}
//               disabled={isRefreshing}
//               className="w-full relative h-[52px] rounded-xl flex items-center justify-center gap-2.5 font-semibold text-[15px] text-white overflow-hidden transition-all duration-300 active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100 group/btn"
//             >
//               <div className="absolute inset-0 bg-gradient-to-b from-orange-500 to-orange-600 transition-transform duration-500 group-hover/btn:scale-[1.02]"></div>
//               <div className="absolute inset-x-0 top-0 h-px bg-white/20"></div>
              
//               <RefreshCw className={`w-4 h-4 relative z-10 ${isRefreshing ? 'status-spin-anim' : ''}`} strokeWidth={2.5} />
//               <span className="relative z-10 text-shadow-sm">
//                 {isRefreshing ? 'Checking Status...' : 'Check Again'}
//               </span>
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   /* ─── STATE 4: OPEN (TOP BANNER) ─── */
//   return (
//     <>
//       <div className="status-bar-enter fixed top-0 inset-x-0 z-[100] h-[52px] bg-white/80 dark:bg-[#0f172a]/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-white/[0.06] shadow-sm transform-gpu">
//         {/* Subtle top glow line */}
//         <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-orange-500/20 to-transparent"></div>
        
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
          
//           {/* Left Side: Status */}
//           <div className="flex items-center gap-2.5 sm:gap-3">
//             {/* Glowing Dot Wrapper */}
//             <div className="relative flex items-center justify-center w-5 h-5">
//               <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-[4px]"></div>
//               <div className="relative z-10 w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] pulse-dot-active"></div>
//             </div>
            
//             <div className="flex items-center gap-2">
//               <CheckCircle className="w-4 h-4 text-emerald-500 drop-shadow-sm hidden sm:block" strokeWidth={2.5} />
//               <span className="text-[14px] font-bold text-gray-900 dark:text-white tracking-tight">
//                 Open <span className="text-gray-400 dark:text-gray-500 font-medium px-1">·</span> Accepting Orders
//               </span>
//             </div>

//             {/* Custom Message Pill (Desktop) */}
//             {cafeStatus.message && cafeStatus.message !== "Welcome!" && (
//               <div className="hidden md:flex items-center h-6 px-2.5 ml-2 mt-0.5 rounded-md bg-orange-50 dark:bg-orange-500/10 border border-orange-100 dark:border-orange-500/20">
//                 <span className="text-[11px] font-semibold text-orange-600 dark:text-orange-400">
//                   {cafeStatus.message}
//                 </span>
//               </div>
//             )}
//           </div>

//           {/* Right Side: Metadata / Controls */}
//           <div className="flex items-center gap-3">
//             {lastUpdated && (
//               <span className="hidden sm:block text-[11px] font-medium text-gray-500 dark:text-gray-400 mt-0.5">
//                 Updated {lastUpdated}
//               </span>
//             )}
            
//             <div className="h-4 w-px bg-gray-300 dark:bg-white/10 hidden sm:block"></div>
            
//             <button
//               onClick={() => fetchCafeStatus(true)}
//               disabled={isRefreshing}
//               className="p-1.5 -mr-1.5 rounded-full text-gray-400 hover:text-gray-700 dark:text-gray-500 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors disabled:opacity-50 group"
//               aria-label="Refresh status"
//             >
//               <RefreshCw className={`w-3.5 h-3.5 group-active:scale-95 ${isRefreshing ? 'status-spin-anim text-orange-500' : ''}`} />
//             </button>
//           </div>
          
//         </div>
//       </div>
      
//       {/* 
//         This div reserves space for the absolute/fixed top bar, preventing the content 
//         below from snapping underneath. It sets pt-[52px] to match the h-[52px].
//       */}
//       <div className="pt-[52px]">
//         {children}
//       </div>
//     </>
//   );
// }
import { useState } from 'react';
import { Wifi, WifiOff, AlertCircle, CheckCircle, Edit3, RefreshCw } from 'lucide-react';

const CafeStatusCard = ({ 
  cafeStatus, 
  onUpdateStatus, 
  loading,
  onRefresh 
}) => {
  const [showMessageInput, setShowMessageInput] = useState(false);
  const [tempMessage, setTempMessage] = useState(cafeStatus.message || '');

  const handleStatusToggle = async () => {
    const newStatus = !cafeStatus.isOnline;
    const message = newStatus 
      ? "We're open! Place your order now 🎉" 
      : tempMessage || "We're temporarily closed. Back soon!";

    await onUpdateStatus(newStatus, message);
  };

  const handleMessageUpdate = async () => {
    await onUpdateStatus(cafeStatus.isOnline, tempMessage);
    setShowMessageInput(false);
  };

  return (
    <div className="bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-500 group hover:-translate-y-2">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-6 border-b border-slate-700/50">
        <div className="flex items-center gap-3">
          <div className={`w-5 h-5 rounded-full shadow-lg transition-all duration-700 ${
            cafeStatus.isOnline 
              ? 'bg-green-500 shadow-green-500/50 animate-pulse' 
              : 'bg-red-500 shadow-red-500/50'
          }`}></div>
          <div>
            <h3 className="text-2xl font-black bg-gradient-to-r from-emerald-400 via-white to-emerald-400 bg-clip-text">
              Live Cafe Status
            </h3>
            <p className="text-sm text-slate-400">Controls online ordering for customers</p>
          </div>
        </div>
        
        <button 
          onClick={onRefresh}
          disabled={loading}
          className="p-2.5 rounded-xl bg-slate-800/50 hover:bg-slate-700 text-slate-400 hover:text-emerald-400 transition-all group-hover:scale-110 flex items-center gap-1"
          title="Refresh Status"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Main Status Toggle Button */}
      <div className="mb-8">
        <button
          onClick={handleStatusToggle}
          disabled={loading}
          className={`group relative w-full p-8 rounded-3xl font-bold text-xl transition-all duration-500 shadow-2xl flex items-center justify-center gap-4 h-28 border-4 ${
            cafeStatus.isOnline
              ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border-emerald-400/60 hover:from-emerald-500/40 hover:to-teal-500/40 shadow-emerald-500/30 hover:shadow-emerald-500/50'
              : 'bg-gradient-to-r from-red-500/20 to-rose-500/20 border-red-400/60 hover:from-red-500/40 hover:to-rose-500/40 shadow-red-500/30 hover:shadow-red-500/50'
          }`}
        >
          {cafeStatus.isOnline ? (
            <>
              <CheckCircle className="w-10 h-10 text-emerald-400 group-hover:scale-110 transition-transform duration-300" />
              <span className="text-2xl tracking-wide">🟢 ONLINE<br/>Accepting Orders</span>
              <Wifi className="w-8 h-8 text-emerald-400 ml-auto group-hover:rotate-12 transition-transform duration-300" />
            </>
          ) : (
            <>
              <AlertCircle className="w-10 h-10 text-red-400 group-hover:scale-110 transition-transform duration-300" />
              <span className="text-2xl tracking-wide">🔴 OFFLINE<br/>No Orders</span>
              <WifiOff className="w-8 h-8 text-red-400 ml-auto group-hover:rotate-12 transition-transform duration-300" />
            </>
          )}
          
          {loading && (
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm rounded-3xl flex items-center justify-center">
              <RefreshCw className="w-10 h-10 animate-spin text-white" />
            </div>
          )}
        </button>
      </div>

      {/* Status Message Editor */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4 p-4 bg-slate-800/50 border border-slate-700/50 rounded-2xl">
          <Edit3 className="w-5 h-5 text-slate-400 flex-shrink-0" />
          <span className="text-sm font-semibold text-slate-200">Customer Message</span>
          {!showMessageInput && (
            <button
              onClick={() => setShowMessageInput(true)}
              className="ml-auto p-1.5 hover:bg-slate-700/50 rounded-xl transition-all text-slate-400 hover:text-white hover:scale-110"
              title="Edit Message"
            >
              <Edit3 className="w-4 h-4" />
            </button>
          )}
        </div>
        
        {showMessageInput ? (
          <div className="flex gap-3 p-4 bg-slate-900/50 border-2 border-slate-600/50 rounded-2xl backdrop-blur-sm">
            <input
              type="text"
              value={tempMessage}
              onChange={(e) => setTempMessage(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none text-white text-lg placeholder-slate-400 font-medium px-4 py-3"
              placeholder="What message should customers see?"
              maxLength={120}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleMessageUpdate();
                if (e.key === 'Escape') {
                  setTempMessage(cafeStatus.message);
                  setShowMessageInput(false);
                }
              }}
            />
            <div className="flex gap-2">
              <button
                onClick={handleMessageUpdate}
                disabled={loading || !tempMessage.trim()}
                className="px-6 py-3 bg-emerald-600/90 hover:bg-emerald-500 text-white rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:scale-[1.02]"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setTempMessage(cafeStatus.message);
                  setShowMessageInput(false);
                }}
                className="p-3 hover:bg-slate-700/50 rounded-xl text-slate-400 hover:text-white transition-all hover:scale-110"
              >
                ✕
              </button>
            </div>
          </div>
        ) : (
          <div className="p-6 bg-gradient-to-r from-slate-800/60 to-slate-900/60 border border-slate-700/50 rounded-2xl backdrop-blur-sm hover:bg-slate-800/80 transition-all group/message">
            <p className="text-slate-200 text-lg leading-relaxed pl-1">
              "{cafeStatus.message}"
            </p>
            <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
              <span>Updated:</span>
              <span>{new Date(cafeStatus.updatedAt).toLocaleString()}</span>
            </div>
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-700/50">
        <div className="text-center p-5 rounded-2xl bg-slate-800/40 backdrop-blur-sm border border-slate-700/30 hover:bg-slate-800/60 transition-all">
          <div className={`text-3xl font-black mb-1 ${
            cafeStatus.isOnline ? 'text-emerald-400' : 'text-red-400'
          }`}>
            {cafeStatus.isOnline ? '✅ LIVE' : '⏸️ PAUSED'}
          </div>
          <div className="text-xs text-slate-500 uppercase tracking-wider">Ordering Status</div>
        </div>
        <div className="text-center p-5 rounded-2xl bg-slate-800/40 backdrop-blur-sm border border-slate-700/30 hover:bg-slate-800/60 transition-all">
          <div className="text-2xl font-bold text-blue-400 mb-1">
            {new Date(cafeStatus.updatedAt).toLocaleTimeString()}
          </div>
          <div className="text-xs text-slate-500 uppercase tracking-wider">Last Update</div>
        </div>
      </div>

      {/* Impact Notice */}
      <div className="mt-6 p-4 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-2xl backdrop-blur-sm">
        <p className="text-sm text-yellow-200 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>⚡ Status changes instantly affect ALL customer orders</span>
        </p>
      </div>
    </div>
  );
};

export default CafeStatusCard;