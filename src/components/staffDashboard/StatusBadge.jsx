const StatusBadge = ({ status }) => {
  const badges = {
    pending: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30 border",
    approved: "bg-blue-500/20 text-blue-300 border-blue-500/30 border",
    preparing: "bg-purple-500/20 text-purple-300 border-purple-500/30 border",
    ready: "bg-orange-500/20 text-orange-300 border-orange-500/30 border",
    completed: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30 border",
    cancelled: "bg-red-500/20 text-red-300 border-red-500/30 border",
  };

  return (
    <span
      className={`px-4 py-2 rounded-full text-xs font-semibold border-2 uppercase tracking-wide ${badges[status] || badges.pending}`}
    >
      {status}
    </span>
  );
};

export default StatusBadge;