// src/components/CafeStatus.jsx
import { useState, useEffect } from 'react';

const CafeStatus = ({ children }) => {
  const [cafeStatus, setCafeStatus] = useState({ isOnline: true });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCafeStatus();
    
    // Poll every 30 seconds
    const interval = setInterval(fetchCafeStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchCafeStatus = async () => {
    try {
      const response = await fetch('/api/cafe-status');
      const data = await response.json();
      setCafeStatus(data);
    } catch (error) {
      console.error('Error fetching cafe status:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed top-0 left-0 w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-4 z-50">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-2"></div>
          Loading cafe status...
        </div>
      </div>
    );
  }

  if (!cafeStatus.isOnline) {
    return (
      <div className="fixed top-0 left-0 w-full bg-gradient-to-r from-red-500 to-red-600 text-white p-6 z-50 text-center shadow-2xl">
        <div className="max-w-2xl mx-auto">
          <div className="text-4xl mb-4">🍽️</div>
          <h2 className="text-2xl font-bold mb-2">We're Currently Offline</h2>
          <p className="text-lg mb-4">{cafeStatus.message}</p>
          <div className="flex flex-wrap gap-2 justify-center">
            <button 
              onClick={fetchCafeStatus}
              className="bg-white text-red-600 px-6 py-2 rounded-full font-semibold hover:bg-gray-100 transition-all"
            >
              🔄 Refresh Status
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="fixed top-0 left-0 w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white p-4 z-50 shadow-lg">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-300 rounded-full animate-pulse mr-2"></div>
            <span className="font-semibold">✅ Open - Accepting Orders</span>
          </div>
          <div className="text-sm opacity-90">{cafeStatus.message}</div>
        </div>
      </div>
      <div style={{ paddingTop: '120px' }}>
        {children}
      </div>
    </>
  );
};

export default CafeStatus;