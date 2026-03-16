import React, { useState, useEffect, useContext, useCallback, useMemo } from "react";
import { toast } from "react-hot-toast";
import { useCart } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { itemsAPI, tablesAPI, ordersAPI, categoriesAPI } from "../services/api";

import ItemsPanel from "../components/staffDashboard/ItemsPanel";
import CartPanel from "../components/staffDashboard/CartPanel";
import CustomerModal from "../components/staffDashboard/CustomerModal";

const round = (num) => Number(num.toFixed(2));

export default function POS({ setReceipt }) {
  const { user } = useContext(AuthContext);
  const { cart, clearCart, subtotal, total } = useCart();

  /*** State ***/
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tables, setTables] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [orderType, setOrderType] = useState("dine-in");
  const [selectedTable, setSelectedTable] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [loading, setLoading] = useState(false);

  /*** Data Fetching ***/
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [categoriesRes, itemsRes, tablesRes] = await Promise.all([
        categoriesAPI.getAll(),
        itemsAPI.getAll(),
        tablesAPI.getAll(),
      ]);

      setCategories(Array.isArray(categoriesRes.data) ? categoriesRes.data : []);
      setItems(Array.isArray(itemsRes.data) ? itemsRes.data : []);
      setTables(Array.isArray(tablesRes.data) ? tablesRes.data : []);
    } catch (error) {
      console.error("Failed to fetch data:", error);
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  /*** 🔥 PERFECT CATEGORY FILTERING - Works with ANY category field ***/
  const filteredItems = useMemo(() => {
    let result = items;

    // 1. Category Filter - Handles multiple category field formats
    if (activeCategory !== "all") {
      result = result.filter(item => {
        // Check all possible category field names
        return item.category?._id === activeCategory ||
               item.categoryId === activeCategory ||
               item.category === activeCategory ||
               item.categoryName === categories.find(c => c._id === activeCategory)?.name;
      });
    }

    // 2. Search Filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(item =>
        item.name?.toLowerCase().includes(query) ||
        item.categoryName?.toLowerCase().includes(query) ||
        item.description?.toLowerCase().includes(query)
      );
    }

    return result;
  }, [items, activeCategory, searchQuery, categories]);

  /*** Category Item Count - Cached ***/
  const categoryCounts = useMemo(() => {
    const counts = { all: items.length };
    
    categories.forEach(category => {
      counts[category._id] = items.filter(item => 
        item.category?._id === category._id ||
        item.categoryId === category._id ||
        item.category === category._id
      ).length;
    });
    
    return counts;
  }, [items, categories]);

  /*** Reset Order ***/
  const resetOrder = useCallback(() => {
    clearCart();
    setSelectedTable("");
    setCustomerName("");
    setCustomerPhone("");
    setOrderType("dine-in");
  }, [clearCart]);

  /*** Place Order ***/
  const handleOrder = useCallback(async () => {
    if (cart.length === 0) return toast.error("Cart is empty");
    if (orderType === "dine-in" && !selectedTable) return toast.error("Please select a table for dine-in");
    if (!customerName.trim()) return toast.error("Customer name is required");

    try {
      setPlacingOrder(true);

      const orderData = {
        orderSource: "staff",
        orderType,
        customerName: customerName.trim(),
        phone: customerPhone || null,
        table: orderType === "dine-in" ? selectedTable : null,
        items: cart.map(({ _id, name, price, qty }) => ({ 
          item: _id, 
          name, 
          price, 
          quantity: qty 
        })),
        subtotal: round(subtotal),
        totalAmount: round(total),
        paymentMethod: "cash",
        createdBy: user?._id,
        notes: `POS Order - ${new Date().toLocaleString()}`,
      };

      const { data: order } = await ordersAPI.create(orderData);
      toast.success(`✅ Order #${order.orderNumber} created!`);
      setReceipt(order);
      resetOrder();
    } catch (error) {
      console.error("Order error:", error);
      toast.error(error.response?.data?.message || "Failed to place order");
    } finally {
      setPlacingOrder(false);
    }
  }, [cart, orderType, selectedTable, customerName, customerPhone, subtotal, total, user?._id, setReceipt, resetOrder]);

  const isPlaceDisabled = placingOrder || cart.length === 0 || (orderType === "dine-in" && !selectedTable);

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden">
      
      {/* LEFT PANEL: CATEGORIES + ITEMS (70%) */}
      <div className="w-full lg:w-[70%] bg-gray-900/80 backdrop-blur-xl border-r border-white/10 flex flex-col">
        
        {/* HEADER: Search + Category Pills */}
        <div className="p-6 border-b border-white/10 sticky top-0 bg-gray-900/95 z-20 shrink-0">
          
          {/* 🔥 Search Box */}
          <div className="relative mb-6">
            <input
              type="text"
              placeholder="Search items, categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-4 pl-12 pr-12 bg-gray-800/50 border border-gray-600 rounded-2xl 
                         focus:ring-4 focus:ring-orange-500/30 focus:border-orange-500 
                         transition-all duration-300 text-white placeholder-gray-400 
                         text-lg font-medium shadow-lg"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white 
                         p-1.5 rounded-full hover:bg-gray-700/50 transition-all shadow-md"
                title="Clear search"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* 🔥 Category Pills - Horizontal Scroll */}
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-900 no-scrollbar">
            <button
              onClick={() => setActiveCategory("all")}
              className={`flex-shrink-0 px-6 py-3 rounded-full font-semibold transition-all duration-300 whitespace-nowrap shadow-lg ${
                activeCategory === "all"
                  ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white "
                  : "bg-gray-700/70 text-gray-200 hover:bg-gray-600 hover:scale-105 border border-gray-600"
              }`}
            >
          All ({categoryCounts.all})
            </button>
            
            {categories.map((category) => (
              <button
                key={category._id}
                onClick={() => setActiveCategory(category._id)}
                className={`flex-shrink-0 px-6 py-3 rounded-full font-semibold sroup ${
                  activeCategory === category._id
                    ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-blue-500/50 scale-105"
                    : "bg-gray-700/70 text-gray-200 hover:bg-gray-600 hover:scale-105 border border-gray-600"
                }`}
                title={`Show ${category.name} items`}
              >
                {category.name} 
                <span className="ml-1 text-xs opacity-90">({categoryCounts[category._id] || 0})</span>
              </button>
            ))}
          </div>

          {/* Active Filter Badge */}
          {(activeCategory !== "all" || searchQuery) && (
            <div className="mt-4 p-3 bg-gray-800/50 rounded-xl border border-gray-700 flex items-center gap-3 text-sm">
              <div className="text-orange-400">
                {activeCategory !== "all" 
                  ? `Showing ${categoryCounts[activeCategory] || 0} items in "${categories.find(c => c._id === activeCategory)?.name || 'Unknown'}"`
                  : `Found ${filteredItems.length} items`
                }
              </div>
              <button
                onClick={() => {
                  setActiveCategory("all");
                  setSearchQuery("");
                }}
                className="ml-auto text-gray-400 hover:text-white p-1 rounded-full hover:bg-gray-700 transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* Items Grid */}
        <div className="flex-1 p-6 overflow-y-auto">
          <ItemsPanel 
            items={filteredItems} 
            loading={loading}
            activeCategory={activeCategory}
            searchQuery={searchQuery}
            totalItems={filteredItems.length}
          />
        </div>
      </div>

      {/* RIGHT PANEL: CART & ORDER (30%) */}
      <div className="w-full lg:w-[30%] flex flex-col border-l border-white/10 bg-gradient-to-b from-gray-900/95 to-gray-800/90 backdrop-blur-2xl overflow-hidden no-scrollbar">
        
        {/* Cart Content */}
        <div className="flex-1 p-4 overflow-y-auto pr-2">
          <CartPanel
            orderType={orderType}
            setOrderType={setOrderType}
            tables={tables}
            selectedTable={selectedTable}
            setSelectedTable={setSelectedTable}
            total={round(total)}
            placingOrder={placingOrder}
            cart={cart}
            openCustomerModal={() => setShowCustomerModal(true)}
            customerName={customerName}
            customerPhone={customerPhone}
            setCustomerName={setCustomerName}
            setCustomerPhone={setCustomerPhone}
            
          />
           <div className="bg-gradient-to-t from-gray-900/100 to-transparent border-t border-white/20 p-6 backdrop-blur-xl shadow-2xl z-10 shrink-0">
          <div className="space-y-4">
            {/* Total Display */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
              <h2 className="text-2xl font-black bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 bg-clip-text text-transparent">
                Order Summary
              </h2>
              <div className="text-4xl font-black text-orange-400 drop-shadow-2xl">
                ₹{round(total)}
              </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 gap-4 mb-6">
              {/* Amount Card */}
              <div className="p-4 bg-gray-800/60 backdrop-blur-sm rounded-2xl border border-gray-700 shadow-xl">
                <div className="flex justify-between text-gray-300 mb-2">
                  <span className="text-lg">Subtotal</span>
                  <span className="text-lg">₹{round(subtotal)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-white/20">
                  <span className="text-2xl font-bold text-white">Total</span>
                  <span className="text-2xl font-bold text-orange-400">₹{round(total)}</span>
                </div>
              </div>

              {/* Order Info Card */}
              <div className="p-4 bg-gray-800/40 backdrop-blur-sm rounded-xl border border-gray-700 text-sm">
                <div className="grid grid-cols-2 gap-4 text-gray-300">
                  <div>
                    <span className="block text-gray-400 mb-1">Type</span>
                    <span className="font-bold capitalize text-orange-400">{orderType}</span>
                  </div>
                  {orderType === "dine-in" && selectedTable && (
                    <div>
                      <span className="block text-gray-400 mb-1">Table</span>
                      <span className="font-bold text-emerald-400">
                        {tables.find(t => t._id === selectedTable)?.name || "N/A"}
                      </span>
                    </div>
                  )}
                  <div>
                    <span className="block text-gray-400 mb-1">Customer</span>
                    <span className="font-bold text-white truncate pr-4">
                      {customerName || "Add customer"}
                    </span>
                  </div>
                  <div>
                    <span className="block text-gray-400 mb-1">Items</span>
                    <span className="font-mono font-bold text-orange-400">{cart.length}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            
          </div>
        </div>
        </div>

        {/* FIXED Order Summary Footer */}
       
      </div>

      {/* Customer Modal */}
      {showCustomerModal && (
        <CustomerModal
          customerName={customerName}
          setCustomerName={setCustomerName}
          customerPhone={customerPhone}
          setCustomerPhone={setCustomerPhone}
          onClose={() => setShowCustomerModal(false)}
          onConfirm={handleOrder}
          placingOrder={placingOrder}
        />
      )}
    </div>
  );
}