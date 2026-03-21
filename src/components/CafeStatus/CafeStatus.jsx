import { useState, useEffect, useCallback, useRef } from 'react';
import { WifiOff, AlertCircle, CheckCircle, RefreshCw, Coffee } from 'lucide-react';
import { cafeStatusAPI } from '../../services/api';

const POLL_INTERVAL = 15000; // 15 seconds

/* ─── Premium Keyframe Animations ─── */
const INJECT_STYLES = `
  @keyframes status-pulse-ring {
    0%   { transform: scale(0.95); opacity: 1;   }
    70%  { transform: scale(2.5);  opacity: 0;   }
    100% { transform: scale(2.5);  opacity: 0;   }
  }
  @keyframes status-shimmer {
    0%   { background-position: -800px 0; }
    100% { background-position: 800px 0;  }
  }
  @keyframes status-float {
    0%, 100% { transform: translateY(0px) scale(1); }
    50%      { transform: translateY(-6px) scale(1.02); }
  }
  @keyframes status-fade-in {
    from { opacity: 0; transform: translateY(-8px); }
    to   { opacity: 1; transform: translateY(0);    }
  }
  @keyframes status-slide-up {
    from { opacity: 0; transform: translateY(30px) scale(0.96); filter: blur(4px); }
    to   { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
  }
  @keyframes status-spin {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }

  .status-spin-anim {
    animation: status-spin 1s cubic-bezier(0.4, 0, 0.2, 1) infinite;
  }
  .status-bar-enter {
    animation: status-fade-in 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }
  .status-card-enter {
    animation: status-slide-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }
  .pulse-dot-active::after {
    content: '';
    position: absolute;
    inset: -2px;
    border-radius: 50%;
    border: 1px solid #10b981;
    animation: status-pulse-ring 2s cubic-bezier(0.16, 1, 0.3, 1) infinite;
  }
  
  .shimmer-bg {
    background: linear-gradient(
      90deg,
      rgba(255,255,255,0.03) 0%,
      rgba(255,255,255,0.08) 50%,
      rgba(255,255,255,0.03) 100%
    );
    background-size: 800px 100%;
    animation: status-shimmer 2s infinite linear;
  }
`;

let stylesInserted = false;
function insertPremiumStyles() {
  if (stylesInserted || typeof document === 'undefined') return;
  const style = document.createElement('style');
  style.textContent = INJECT_STYLES;
  document.head.appendChild(style);
  stylesInserted = true;
}

export default function CafeStatus({ children }) {
  // 🎯 STATE MANAGEMENT
  const [cafeStatus, setCafeStatus] = useState({ isOnline: true, message: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // 📍 REFS — using refs avoids stale closures that cause infinite loops
  const isMountedRef = useRef(false);
  const abortControllerRef = useRef(null);
  // ✅ KEY FIX: track isRefreshing in a ref so fetchCafeStatus never
  // needs it in its dependency array (which was the infinite-loop root cause)
  const isRefreshingRef = useRef(false);

  // ✅ FIXED: empty dependency array — this function NEVER changes reference
  const fetchCafeStatus = useCallback(async (isManual = false) => {
    // Prevent overlapping requests
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    if (!isMountedRef.current) return;

    // Use ref so we don't need isRefreshing in deps
    if (isManual && isRefreshingRef.current) return;

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    try {
      setError(null);

      if (isManual) {
        isRefreshingRef.current = true;
        setIsRefreshing(true);
      } else {
        setLoading(true);
      }

      const response = await cafeStatusAPI.get(undefined, {
        signal: abortController.signal,
      });

      if (abortController.signal.aborted) return;

      const now = new Date();
      const timeStr = now.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });

      setCafeStatus(response.data || { isOnline: true, message: 'Welcome!' });
      setLastUpdated(timeStr);

    } catch (err) {
      if (abortController.signal.aborted) return;

      console.error('Cafe status error:', err);
      setError('Connection Unavailable');
      setCafeStatus(prev => ({ ...prev, isOnline: false }));
    } finally {
      if (!abortController.signal.aborted && isMountedRef.current) {
        setTimeout(() => {
          if (isMountedRef.current) {
            setLoading(false);
            isRefreshingRef.current = false;
            setIsRefreshing(false);
            abortControllerRef.current = null;
          }
        }, 100);
      }
    }
  }, []); // ✅ No state in deps — stable reference forever

  // 🎯 INITIALIZATION — runs once on mount
  useEffect(() => {
    isMountedRef.current = true;
    insertPremiumStyles();
    fetchCafeStatus();

    return () => {
      isMountedRef.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
    };
  }, [fetchCafeStatus]); // fetchCafeStatus is now stable — no re-runs

  // 🔄 POLLING — runs independently, cleans up properly
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (isMountedRef.current && !isRefreshingRef.current) {
        fetchCafeStatus();
      }
    }, POLL_INTERVAL);

    return () => clearInterval(intervalId);
  }, [fetchCafeStatus]); // fetchCafeStatus is stable — interval only created once

  // **IF CAFE IS OPEN: RENDER NOTHING (just children)**
  if (!loading && !error && cafeStatus.isOnline) {
    return children;
  }

  /* ─── STATE 1: LOADING ─── */
  if (loading && !isRefreshing) {
    return (
      <div className="status-bar-enter fixed top-0 inset-x-0 z-[100] h-14 bg-gray-900/95 backdrop-blur-xl border-b border-white/5 flex items-center shadow-sm">
        <div className="shimmer-bg absolute inset-0 mix-blend-overlay"></div>
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3">
            <Coffee className="w-4 h-4 text-white/40" />
            <div className="h-2.5 w-32 bg-white/10 rounded-full overflow-hidden"></div>
          </div>
          <div className="h-2 w-16 bg-white/10 rounded-full"></div>
        </div>
      </div>
    );
  }

  /* ─── STATE 2: ERROR ─── */
  if (error) {
    return (
      <div className="status-bar-enter fixed top-0 inset-x-0 z-[100] bg-red-500/95 backdrop-blur-xl border-b border-red-400/30 text-white shadow-lg overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ 
          backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', 
          backgroundSize: '24px 24px' 
        }}></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-12 flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
              <AlertCircle className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-sm font-semibold tracking-wide drop-shadow-sm">{error}</span>
          </div>
          <button
            onClick={() => fetchCafeStatus(true)}
            disabled={isRefreshing}
            className="group flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/10 hover:bg-black/20 border border-black/5 hover:border-black/10 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`w-3.5 h-3.5 opacity-80 group-hover:opacity-100 transition-transform ${isRefreshing ? 'status-spin-anim' : ''}`} />
            <span className="text-xs font-medium">{isRefreshing ? 'Checking...' : 'Retry'}</span>
          </button>
        </div>
      </div>
    );
  }

  /* ─── STATE 3: CLOSED (FULL SCREEN) ─── */
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center px-4 bg-[#0a0604]">
      {/* Deep, Premium Ambient Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-orange-600/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen transition-opacity duration-1000"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[100px] pointer-events-none mix-blend-screen transition-opacity duration-1000"></div>
      
      {/* Frost Glass Card */}
      <div className="status-card-enter relative w-full max-w-[440px] z-10">
        <div className="bg-white/[0.02] backdrop-blur-[40px] border border-white/[0.08] shadow-[0_32px_80px_-12px_rgba(0,0,0,0.8)] rounded-[2rem] p-8 sm:p-10 relative overflow-hidden group">
          
          {/* Minimalist Top Accent Highlight */}
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-orange-500/50 to-transparent opacity-60"></div>

          {/* Floating Icon */}
          <div className="flex justify-center mb-8" style={{ animation: 'status-float 4s ease-in-out infinite' }}>
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-orange-500/20 to-orange-900/40 border border-orange-500/20 shadow-[0_0_40px_rgba(249,115,22,0.15)] flex items-center justify-center relative">
              <div className="absolute inset-0 rounded-2xl bg-orange-500 blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-700"></div>
              <WifiOff className="w-8 h-8 text-orange-400 relative z-10" strokeWidth={1.5} />
            </div>
          </div>

          {/* Typography */}
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3 bg-gradient-to-b from-white via-white to-white/60 bg-clip-text text-transparent">
              We're Closed
            </h1>
            <p className="text-[15px] leading-relaxed text-white/50 font-medium px-4">
              {cafeStatus.message || "We're currently taking a break. You can browse, but orders are paused."}
            </p>
          </div>

          {/* Status Metadata */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.05]">
              <div className="w-1.5 h-1.5 rounded-full bg-orange-500/60 shadow-[0_0_8px_rgba(249,115,22,0.6)]"></div>
              <span className="text-[11px] font-semibold tracking-wider text-white/40 uppercase">
                Last Updated {lastUpdated || 'Never'}
              </span>
            </div>
          </div>

          {/* Refresh Button */}
          <button
            onClick={() => fetchCafeStatus(true)}
            disabled={isRefreshing || loading}
            className="w-full relative h-[52px] rounded-xl flex items-center justify-center gap-2.5 font-semibold text-[15px] text-white overflow-hidden transition-all duration-300 active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100 disabled:cursor-not-allowed group/btn"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-orange-500 to-orange-600 transition-transform duration-500 group-hover/btn:scale-[1.02]"></div>
            <div className="absolute inset-x-0 top-0 h-px bg-white/20"></div>
            
            <RefreshCw className={`w-4 h-4 relative z-10 transition-transform ${isRefreshing || loading ? 'status-spin-anim' : ''}`} strokeWidth={2.5} />
            <span className="relative z-10 text-shadow-sm">
              {isRefreshing || loading ? 'Checking Status...' : 'Check Again'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}