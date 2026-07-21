import { Edit, Trash2, Plus } from "lucide-react";
import StatusBadge from "./StatusBadge";
import { Button } from "../common";
import type { AdminCategory } from "../../types/admin";

interface CategoryTableProps {
  categories: AdminCategory[];
  onEdit: (cat: AdminCategory) => void;
  onDelete: (cat: AdminCategory) => void;
  onCreate: () => void;
}

/** Table for managing food, diet, goal, and activity categories. */
export default function CategoryTable({
  categories,
  onEdit,
  onDelete,
  onCreate,
}: CategoryTableProps) {
  return (
    <div>
      <div className="mb-4 flex justify-end">
        <Button size="sm" onClick={onCreate}>
          <Plus size={16} className="mr-1" />
          Add Category
        </Button>
      </div>
      {categories.length === 0 ? null : (
        <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50">
              <tr>
                <th className="px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Name</th>
                <th className="px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Type</th>
                <th className="px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Description</th>
                <th className="px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Status</th>
                <th className="px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Created</th>
                <th className="px-4 py-3 text-right font-medium text-gray-600 dark:text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {categories.map((cat) => (
                <tr
                  key={cat._id}
                  className="bg-white hover:bg-gray-50 dark:bg-gray-900 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100">
                    {cat.name}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={cat.type} />
                  </td>
                  <td className="px-4 py-3 max-w-50 truncate text-gray-500 dark:text-gray-400">
                    {cat.description ?? "—"}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge
                      status={cat.is_active ? "Active" : "Inactive"}
                      variant="dot"
                    />
                  </td>
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-400">
                    {new Date(cat.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => onEdit(cat)}
                        className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-indigo-600 dark:hover:bg-gray-800"
                        title="Edit category"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => onDelete(cat)}
                        className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-red-600 dark:hover:bg-gray-800"
                        title="Delete category"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
