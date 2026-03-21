// import React, { useState, useEffect, useCallback } from "react";
// import { User, Phone, MapPin, Coffee, CreditCard, ChevronRight, Check } from "lucide-react";

// export default function CheckoutForm({
//   customerInfo = { name: "", phone: "", table: "" },
//   setCustomerInfo,
//   tables = [],
//   onSubmit,
//   loading = false,
//   orderType = "takeaway",
//   setOrderType,
// }) {
//   const handleChange = useCallback((field, value) => {
//     setCustomerInfo?.((prev) => ({ ...prev, [field]: value }));
//   }, [setCustomerInfo]);

//   const isFormValid = customerInfo.name.trim().length > 0 && 
//                      (orderType !== "dine-in" || customerInfo.table);

//   const getOrderTypeClassName = (type) => {
//     return type === orderType
//       ? "bg-white dark:bg-slate-700 shadow-sm text-indigo-600 dark:text-indigo-400 ring-1 ring-slate-200 dark:ring-slate-600 scale-[1.02]"
//       : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 active:scale-[0.98]";
//   };

//   const getIconClassName = (type) => {
//     return type === orderType ? "text-indigo-600 dark:text-indigo-400" : "";
//   };

//   const getInputBorderClassName = (hasValue) => {
//     return hasValue 
//       ? 'border-slate-300 dark:border-slate-600' 
//       : 'border-slate-200/70 dark:border-slate-700';
//   };

//   return (
//     <div className="w-full h-full flex flex-col animate-[fade-in-up_0.5s_ease-out_forwards]">
//       {/* Premium Checkout Form Content */}
//       <div className="flex-1 overflow-y-auto pb-10">
//         <div className="space-y-8">
          
//           {/* Segmented Order Type Control */}
//           <div className="space-y-3">
//             <label className="text-[10px] font-bold tracking-widest text-slate-400 dark:text-slate-500 uppercase ml-1">
//               Dining Preference
//             </label>
//             <div className="relative p-1.5 bg-slate-100/80 dark:bg-slate-800/80 rounded-[1.25rem] flex shadow-inner border border-slate-200/50 dark:border-slate-700/50">
//               <button
//                 type="button"
//                 onClick={() => setOrderType?.("dine-in")}
//                 className={`relative z-10 flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-[1rem] font-bold text-sm transition-all duration-300 ease-out group ${getOrderTypeClassName("dine-in")}`}
//                 aria-pressed={orderType === "dine-in"}
//               >
//                 <Coffee size={18} className={`transition-colors ${getIconClassName("dine-in")}`} />
//                 <span>Dine In</span>
//               </button>
              
//               <button
//                 type="button"
//                 onClick={() => setOrderType?.("takeaway")}
//                 className={`relative z-10 flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-[1rem] font-bold text-sm transition-all duration-300 ease-out group ${getOrderTypeClassName("takeaway")}`}
//                 aria-pressed={orderType === "takeaway"}
//               >
//                 <MapPin size={18} className={`transition-colors ${getIconClassName("takeaway")}`} />
//                 <span>Takeaway</span>
//               </button>
//             </div>
//           </div>

//           {/* Input Fields Container */}
//           <div className="space-y-5">
            
//             {/* Name Field */}
//             <div className="animate-[fade-in-up_0.5s_ease-out_forwards]" style={{ animationDelay: '100ms' }}>
//               <label htmlFor="customer-name" className="text-[10px] font-bold tracking-widest text-slate-400 uppercase ml-1 block mb-2">
//                 Primary Contact <span className="text-rose-500 ml-0.5">*</span>
//               </label>
//               <div className={`relative rounded-[1.25rem] overflow-hidden bg-slate-50 dark:bg-slate-800/50 border-2 transition-all duration-300 group focus-within:!border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-500/10 ${getInputBorderClassName(customerInfo.name.trim())}`}>
//                 <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
//                   <User className="h-5 w-5 text-slate-400" />
//                 </div>
//                 <input
//                   id="customer-name"
//                   type="text"
//                   placeholder="Enter full name"
//                   value={customerInfo.name || ""}
//                   onChange={(e) => handleChange("name", e.target.value)}
//                   className="w-full py-4 pl-12 pr-5 bg-transparent text-base font-semibold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
//                   required
//                   disabled={loading}
//                 />
//               </div>
//             </div>

//             {/* Phone Field */}
//             <div className="animate-[fade-in-up_0.5s_ease-out_forwards]" style={{ animationDelay: '150ms' }}>
//               <label htmlFor="customer-phone" className="text-[10px] font-bold tracking-widest text-slate-400 uppercase ml-1 block mb-2">
//                 Phone Number <span className="font-medium normal-case text-slate-400 ml-1">(Optional)</span>
//               </label>
//               <div className="relative rounded-[1.25rem] overflow-hidden bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-200/70 dark:border-slate-700 transition-all duration-300 focus-within:!border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-500/10">
//                 <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
//                   <Phone className="h-5 w-5 text-slate-400" />
//                 </div>
//                 <input
//                   id="customer-phone"
//                   type="tel"
//                   placeholder="+1 (555) 000-0000"
//                   value={customerInfo.phone || ""}
//                   onChange={(e) => handleChange("phone", e.target.value)}
//                   className="w-full py-4 pl-12 pr-5 bg-transparent text-base font-semibold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
//                   disabled={loading}
//                 />
//               </div>
//             </div>

//             {/* Table Selection */}
//             {orderType === "dine-in" && (
//               <div className="animate-[fade-in-up_0.5s_ease-out_forwards] origin-top" style={{ animationDelay: '200ms' }}>
//                 <label htmlFor="table-select" className="text-[10px] font-bold tracking-widest text-slate-400 uppercase ml-1 block mb-2">
//                   Table Assignment <span className="text-rose-500 ml-0.5">*</span>
//                 </label>
//                 <div className="relative rounded-[1.25rem] overflow-hidden bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-200/70 dark:border-slate-700 transition-all duration-300 focus-within:!border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-500/10">
//                   <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
//                     <MapPin className="h-5 w-5 text-slate-400" />
//                   </div>
//                   <select
//                     id="table-select"
//                     value={customerInfo.table || ""}
//                     onChange={(e) => handleChange("table", e.target.value)}
//                     className="w-full py-4 pl-12 pr-12 bg-transparent text-base font-semibold text-slate-900 dark:text-white focus:outline-none appearance-none cursor-pointer"
//                     required={orderType === "dine-in"}
//                     disabled={loading}
//                   >
//                     <option value="" disabled className="text-slate-400">
//                       Select seating...
//                     </option>
//                     {tables.map((table, index) => (
//                       <option 
//                         key={table._id || table.tableNumber || index} 
//                         value={table._id || table.tableNumber}
//                       >
//                         Table {table.tableNumber || table} • {table.seats || '4'} seats
//                       </option>
//                     ))}
//                   </select>
//                   <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-400">
//                     <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//                     </svg>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* CTA Footer specifically for the Checkout Form (inside Drawer) */}
//       <div className="pt-6 border-t border-slate-100 dark:border-slate-800 sticky bottom-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl z-10 pb-2">
//         <button
//           onClick={onSubmit}
//           disabled={loading || !isFormValid}
//           className="group relative w-full h-16 rounded-[2rem] font-bold text-lg flex items-center justify-between px-6 overflow-hidden transition-all duration-500 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 shadow-[0_10px_20px_rgba(0,0,0,0.1)] hover:shadow-[0_15px_30px_rgba(0,0,0,0.2)] focus:outline-none focus:ring-4 focus:ring-indigo-500/30"
//         >
//           <span className="relative z-10 flex items-center gap-3">
//             {loading ? (
//               <>
//                 <svg className="animate-spin h-5 w-5 text-current" fill="none" viewBox="0 0 24 24">
//                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                 </svg>
//                 Processing...
//               </>
//             ) : (
//               "Confirm Details"
//             )}
//           </span>
//           {!loading && (
//             <div className="w-10 h-10 rounded-full bg-white/10 dark:bg-black/10 flex items-center justify-center group-hover:translate-x-1 transition-transform">
//               <ChevronRight size={20} />
//             </div>
//           )}
//           <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 dark:via-black/10 to-transparent -skew-x-12 transform -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-1000 ease-in-out" />
//         </button>
//         <div className="mt-4 flex items-center justify-center text-[10px] font-bold text-slate-400 tracking-widest uppercase">
//           <Check size={12} className="mr-1.5 text-indigo-500" />
//           Verified Secure Next Step
//         </div>
//       </div>
//     </div>
//   );
// }
import { CreditCard } from "lucide-react";

export default function CheckoutForm({
  customerInfo,
  setCustomerInfo,
  tables,
  onSubmit,
  loading,
  orderType,
  setOrderType
}) {
  return (
    <div className="p-4">

      <h2 className="text-xl font-bold mb-4">👤 Your Details</h2>

      {/* Order Type */}
      <div className="mb-4">

        <label className="block text-sm font-medium mb-2">
          Order Type
        </label>

        <div className="flex gap-2">

          <button
            onClick={() => setOrderType("dine-in")}
            className={`flex-1 py-2 rounded-lg font-medium ${
              orderType === "dine-in"
                ? "bg-orange-600 text-white"
                : "bg-gray-100"
            }`}
          >
            🍽️ Dine In
          </button>

          <button
            onClick={() => setOrderType("takeaway")}
            className={`flex-1 py-2 rounded-lg font-medium ${
              orderType === "takeaway"
                ? "bg-orange-600 text-white"
                : "bg-gray-100"
            }`}
          >
            📦 Takeaway
          </button>

        </div>
      </div>

      <div className="space-y-4">

        <div>
          <label className="text-sm font-medium">
            Your Name *
          </label>

          <input
            type="text"
            placeholder="Enter your name"
            value={customerInfo.name}
            onChange={(e) =>
              setCustomerInfo({
                ...customerInfo,
                name: e.target.value
              })
            }
            className="w-full border rounded-lg p-3 mt-1"
          />
        </div>

        <div>
          <label className="text-sm font-medium">
            Phone
          </label>

          <input
            type="tel"
            placeholder="Phone number"
            value={customerInfo.phone}
            onChange={(e) =>
              setCustomerInfo({
                ...customerInfo,
                phone: e.target.value
              })
            }
            className="w-full border rounded-lg p-3 mt-1"
          />
        </div>

        {orderType === "dine-in" && (
          <div>

            <label className="text-sm font-medium">
              Select Table
            </label>

            <select
              value={customerInfo.table}
              onChange={(e) =>
                setCustomerInfo({
                  ...customerInfo,
                  table: e.target.value
                })
              }
              className="w-full border rounded-lg p-3 mt-1"
            >
              <option value="">Select Table</option>

              {tables.map((table) => (
                <option
                  key={table._id}
                  value={table._id}
                >
                  Table {table.tableNumber} ({table.seats} seats)
                </option>
              ))}
            </select>

          </div>
        )}

      </div>

      <button
        onClick={onSubmit}
        disabled={loading}
        className="w-full mt-6 bg-green-600 text-white py-3 rounded-lg font-bold flex justify-center items-center gap-2"
      >
        {loading ? "Processing..." : "Continue to Payment"}
        <CreditCard size={18} />
      </button>

    </div>
  );
}