import React, { useState } from "react";
import Header from "../components/StaffDashboard/Header";
import POS from "./POS";
import OrderHistory from "../components/StaffDashboard/OrderHistory";
import ReceiptModal from "../components/StaffDashboard/ReceiptModal";

export default function StaffDashboard() {
  const [activeTab, setActiveTab] = useState("pos");
  const [receipt, setReceipt] = useState(null);

  // Close receipt and switch back to POS if needed
  const handleCloseReceipt = () => {
    setReceipt(null);
    if (activeTab === 'history') setActiveTab('pos'); // Optional: Auto switch to POS
  };

  return (
    <div className="h-screen flex flex-col bg-gray-900 text-white font-sans">
      {/* Header with Nav, Time, Logout */}
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden relative">
        {activeTab === "pos" && <POS setReceipt={setReceipt} />}
        {activeTab === "history" && <OrderHistory />}
      </div>

      {/* Success Receipt Modal */}
      <ReceiptModal 
        isOpen={!!receipt} 
        order={receipt} 
        onClose={handleCloseReceipt} 
      />
    </div>
  );
}