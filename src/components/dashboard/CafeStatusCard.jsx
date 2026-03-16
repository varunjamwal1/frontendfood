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