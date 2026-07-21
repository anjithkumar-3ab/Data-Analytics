import { Edit, Trash2, UserCheck, UserX } from "lucide-react";
import StatusBadge from "./StatusBadge";
import type { AdminUser } from "../../types/admin";

interface UserTableProps {
  users: AdminUser[];
  onEdit: (user: AdminUser) => void;
  onDelete: (user: AdminUser) => void;
  onToggleStatus: (user: AdminUser) => void;
}

/** Sortable, responsive table for managing users. */
export default function UserTable({
  users,
  onEdit,
  onDelete,
  onToggleStatus,
}: UserTableProps) {
  if (users.length === 0) return null;

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50">
          <tr>
            <th className="px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Name</th>
            <th className="px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Email</th>
            <th className="px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Role</th>
            <th className="px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Status</th>
            <th className="px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Created</th>
            <th className="px-4 py-3 text-right font-medium text-gray-600 dark:text-gray-400">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
          {users.map((user) => (
            <tr
              key={user._id}
              className="bg-white hover:bg-gray-50 dark:bg-gray-900 dark:hover:bg-gray-800/50 transition-colors"
            >
              <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100">
                {user.name}
              </td>
              <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                {user.email}
              </td>
              <td className="px-4 py-3">
                <StatusBadge status={user.role} />
              </td>
              <td className="px-4 py-3">
                <StatusBadge status={user.status} variant="dot" />
              </td>
              <td className="px-4 py-3 text-gray-500 dark:text-gray-400">
                {new Date(user.created_at).toLocaleDateString()}
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-1">
                  <button
                    onClick={() => onEdit(user)}
                    className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-indigo-600 dark:hover:bg-gray-800"
                    title="Edit user"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => onToggleStatus(user)}
                    className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-amber-600 dark:hover:bg-gray-800"
                    title={user.status === "Active" ? "Deactivate" : "Activate"}
                  >
                    {user.status === "Active" ? <UserX size={16} /> : <UserCheck size={16} />}
                  </button>
                  <button
                    onClick={() => onDelete(user)}
                    className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-red-600 dark:hover:bg-gray-800"
                    title="Delete user"
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
  );
}
