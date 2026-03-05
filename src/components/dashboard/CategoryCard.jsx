import { Edit, Trash2, Image } from "lucide-react";

export default function CategoryCard({ category = {}, onEdit, onDelete }) {
  const { _id, name = "Unnamed Category", description, image } = category;

  const handleEdit = () => {
    if (onEdit) onEdit(category);
  };

  const handleDelete = () => {
    if (onDelete && _id) {
      const confirmDelete = window.confirm(
        `Are you sure you want to delete "${name}"?`
      );
      if (confirmDelete) onDelete(_id);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md border border-gray-200 dark:border-slate-700 overflow-hidden">

      {/* Image Section */}
      <div className="h-44 bg-gray-100 dark:bg-slate-700 flex items-center justify-center">
        {image ? (
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover"
          />
        ) : (
          <Image className="text-gray-400" size={42} />
        )}
      </div>

      {/* Content Section */}
      <div className="p-5">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white break-words">
         Category: {name}
        </h3>

        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 break-words">
        Description :  {description || "No description available."}
        </p>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-5">
          <button
            onClick={handleEdit}
            className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded-lg text-sm font-medium"
          >
            <Edit size={16} />
            Edit
          </button>

          <button
            onClick={handleDelete}
            className="flex items-center justify-center px-4 bg-red-600 text-white rounded-lg"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}