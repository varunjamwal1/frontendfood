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