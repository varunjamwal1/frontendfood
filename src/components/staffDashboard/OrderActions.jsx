const OrderActions = ({ order, onApprove, onComplete, onCancel }) => {
  return (
    <div className="flex flex-col sm:flex-row gap-2">
      {order.status === "pending" && (
        <>
          <button
            onClick={() => onApprove(order._id)}
            className="px-4 py-2 bg-emerald-600/90 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold shadow-lg"
        >
          
             Approve
          </button>
          <button
            onClick={() => onCancel(order._id, order.orderNumber)}
            className="px-4 py-2 bg-red-600/90 hover:bg-red-700 text-white rounded-xl text-sm font-semibold "
        >
          
          Cancel
          </button>
        </>
      )}
      
      {order.status === "approved" && (
        <button
          onClick={() => onComplete(order._id)}
          className="px-6 py-2 bg-gradient-to-r from-orange-600 to-orange-600 hover:from-green-700 hover:to-green-700 text-white rounded-xl text-sm font-semibold cursor-pointer"
        >
       Complete
        </button>
      )}
    </div>
  );
};

export default OrderActions;