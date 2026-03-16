import StatusBadge from "./StatusBadge";

const OrderCard = ({ order, onCancel }) => {
  if (!order) return null;

  const {
    _id,
    customerName,
    orderNumber,
    status,
    totalAmount
  } = order;

  const handleCancel = () => {
    if (onCancel) {
      onCancel(_id, orderNumber);
    }
  };

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-200">

      {/* Header */}
      <div className="flex items-center justify-between">

        {/* Customer Info */}
        <div>
          <h2 className="text-lg md:text-xl font-semibold text-white">
            {customerName}
          </h2>

          <p className="text-sm text-gray-400">
            Order #{orderNumber}
          </p>
        </div>

        {/* Status + Amount */}
        <div className="flex items-center gap-4">
          <StatusBadge status={status} />

          <span className="text-lg font-bold text-white">
            ₹{totalAmount}
          </span>
        </div>

      </div>

      {/* Cancel Button */}
      {status === "pending" && (
        <button
          onClick={handleCancel}
          className="mt-5 w-full bg-red-500 hover:bg-red-600 active:scale-95 transition-all duration-150 text-white font-medium py-2.5 rounded-lg"
        >
          Cancel Order
        </button>
      )}

    </div>
  );
};

export default OrderCard;