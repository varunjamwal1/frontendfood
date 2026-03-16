import React, { useState } from "react";
import Header from "../components/staffDashboard/Header";
import POS from "./POS";
import OrderHistory from "../components/staffDashboard/OrderHistory";
import CustomerCounter from "../components/staffDashboard/CustomerCounter"; // ✅ NEW
import ReceiptModal from "../components/staffDashboard/ReceiptModal";

export default function StaffDashboard() {
  const [activeTab, setActiveTab] = useState("pos");
  const [receipt, setReceipt] = useState(null);

  const handleCloseReceipt = () => {
    setReceipt(null);
    if (activeTab === 'history') setActiveTab('pos');
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 text-white font-sans">
      {/* Header with Nav, Time, Logout */}
      <Header 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        tabs={["pos", "counter", "history"]} // ✅ Added "counter"
      />

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden relative">
        {activeTab === "pos" && <POS setReceipt={setReceipt} />}
        {activeTab === "counter" && <CustomerCounter />}
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