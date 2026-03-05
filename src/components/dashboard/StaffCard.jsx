import React, { memo } from "react";
import { Edit, Trash2, User } from "lucide-react";

function StaffCard({ staff = {}, onEdit, onDelete }) {
  const { _id, name = "Unknown", email, phone, avatar } = staff;

  const handleEdit = () => {
    if (onEdit) onEdit(staff);
  };

  const handleDelete = () => {
    if (onDelete && _id) onDelete(_id);
  };

  const renderAvatar = () => {
    if (avatar) {
      return (
        <img
          src={avatar}
          alt={name}
          className="w-20 h-20 rounded-full object-cover shadow-sm"
        />
      );
    }

    return (
      <div className="w-20 h-20 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center text-orange-600 dark:text-orange-300 font-bold text-2xl shadow-sm">
        {name ? name.charAt(0).toUpperCase() : <User size={24} />}
      </div>
    );
  };

  return (
    <div
      className="
        group
        bg-white dark:bg-slate-800
        rounded-2xl
        border border-gray-200 dark:border-slate-700
        shadow-sm hover:shadow-xl
      
        p-6
        flex flex-col items-center text-center
        min-h-[150px]
      "
    >
      {/* Avatar */}
      <div className="mb-4">
        {renderAvatar()}
      </div>

      {/* Info */}
      <div className="flex-1 w-full">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white truncate">
          {name}
        </h3>

        {email && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 truncate">
            {email}
          </p>
        )}

        {phone && (
          <p className="text-sm text-gray-400 mt-1 truncate">
            {phone}
          </p>
        )}
      </div>

      {/* Divider */}
      <div className="w-full border-t border-gray-100 dark:border-slate-700 my-4" />

      {/* Actions */}
      <div className="flex gap-4">
        <button
          type="button"
          onClick={handleEdit}
          aria-label={`Edit ${name}`}
          className="
            flex items-center gap-2
            px-4 py-2
            bg-indigo-500 hover:bg-indigo-600
            text-white
            rounded-xl
            text-sm font-medium
            transition-all duration-200
            shadow-sm hover:shadow-md
          "
        >
          <Edit size={16} />
          Edit
        </button>

        <button
          type="button"
          onClick={handleDelete}
          aria-label={`Delete ${name}`}
          className="
            flex items-center justify-center
            w-10 h-10
            bg-rose-500 hover:bg-rose-600
            text-white
            rounded-xl
            transition-all duration-200
            shadow-sm hover:shadow-md
          "
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}

export default memo(StaffCard);