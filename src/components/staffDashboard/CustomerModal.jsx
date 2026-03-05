import React from "react";
import { toast } from "react-hot-toast";

export default function CustomerModal({
  customerName,
  setCustomerName,
  customerPhone,
  setCustomerPhone,
  close,
  confirm,
}) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-gray-800 w-[90%] max-w-md p-6 rounded-2xl">
        <h2 className="text-xl font-bold text-orange-500 mb-4 text-center">
          Customer Details
        </h2>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Customer Name"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="w-full p-2 rounded-lg bg-gray-700 border border-gray-600"
          />

          <input
            type="text"
            placeholder="10 Digit Phone"
            value={customerPhone}
            onChange={(e) => setCustomerPhone(e.target.value)}
            maxLength={10}
            className="w-full p-2 rounded-lg bg-gray-700 border border-gray-600"
          />
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={close}
            className="flex-1 py-2 bg-gray-600 rounded-lg"
          >
            Cancel
          </button>

          <button
            onClick={() => {
              if (!customerName.trim())
                return toast.error("Customer name required");
              if (!/^\d{10}$/.test(customerPhone))
                return toast.error("Valid 10 digit phone required");

              close();
              confirm();
            }}
            className="flex-1 py-2 bg-green-600 rounded-lg font-bold"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}