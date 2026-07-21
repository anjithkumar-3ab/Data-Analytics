import { useEffect, useMemo, useState } from "react";
import { Save, UserRoundPlus } from "lucide-react";
import { Alert, Button, Card } from "../../components/common";
import { ConfirmationModal, EmptyState, FilterPanel, SearchBar, UserTable } from "../../components/admin";
import { fetchUsers, updateUser, deleteUser, deactivateUser, activateUser } from "../../services/adminService";
import type { AdminUser, AdminUserUpdatePayload } from "../../types/admin";

const roleOptions = [
  { label: "Admin", value: "Admin" },
  { label: "User", value: "User" },
];

const statusOptions = [
  { label: "Active", value: "Active" },
  { label: "Inactive", value: "Inactive" },
  { label: "Suspended", value: "Suspended" },
];

export default function Users() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("");
  const [sortBy, setSortBy] = useState("created_at");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [pendingDelete, setPendingDelete] = useState<AdminUser | null>(null);
  const [draft, setDraft] = useState<AdminUserUpdatePayload>({});
  const [submitting, setSubmitting] = useState(false);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const result = await fetchUsers({ search, role, status, sort_by: sortBy, sort_order: "desc" });
      setUsers(result.users);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadUsers();
  }, [search, role, status, sortBy]);

  const filteredUsers = useMemo(() => {
    const list = [...users].sort((a, b) => {
      if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      }
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
    return list;
  }, [users, sortBy]);

  const openEditor = (user: AdminUser) => {
    setEditingUser(user);
    setDraft({ name: user.name, role: user.role, status: user.status });
  };

  const handleSave = async () => {
    if (!editingUser) return;
    setSubmitting(true);
    try {
      const updated = await updateUser(editingUser._id, draft);
      setUsers((current) => current.map((user) => (user._id === updated._id ? updated : user)));
      setEditingUser(null);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update user.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!pendingDelete) return;
    try {
      await deleteUser(pendingDelete._id);
      setUsers((current) => current.filter((user) => user._id !== pendingDelete._id));
      setPendingDelete(null);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to delete user.");
    }
  };

  const handleToggleStatus = async (user: AdminUser) => {
    const action = user.status === "Active" ? "deactivate" : "activate";
    try {
      const updated = action === "deactivate"
        ? await deactivateUser(user._id)
        : await activateUser(user._id);
      setUsers((current) => current.map((entry) => (entry._id === updated._id ? updated : entry)));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update status.");
    }
  };

  return (
    <div className="space-y-6">
      {error ? <Alert variant="warning" title="User management notice">{error}</Alert> : null}
      <Card>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">User administration</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Search, filter, and manage access levels.</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <SearchBar value={search} onChange={setSearch} placeholder="Search by name or email" />
            <select value={sortBy} onChange={(event) => setSortBy(event.target.value)} className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800">
              <option value="created_at">Newest first</option>
              <option value="name">Name</option>
            </select>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <FilterPanel
            filters={[
              { key: "role", label: "Role", value: role, options: roleOptions },
              { key: "status", label: "Status", value: status, options: statusOptions },
            ]}
            onChange={(key, value) => {
              if (key === "role") setRole(value);
              if (key === "status") setStatus(value);
            }}
          />
          <Button variant="secondary" size="sm" onClick={() => void loadUsers()}>
            <UserRoundPlus size={16} className="mr-1" />
            Refresh
          </Button>
        </div>
      </Card>

      {loading ? (
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400">Loading users…</div>
      ) : filteredUsers.length === 0 ? (
        <EmptyState title="No users found" description="Try changing the search or filters." />
      ) : (
        <UserTable users={filteredUsers} onEdit={openEditor} onDelete={setPendingDelete} onToggleStatus={handleToggleStatus} />
      )}

      {editingUser ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <Card className="w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Edit user</h3>
            <div className="mt-4 space-y-4">
              <label className="block text-sm">
                <span className="mb-1 block text-gray-600 dark:text-gray-400">Name</span>
                <input value={draft.name ?? ""} onChange={(event) => setDraft((current) => ({ ...current, name: event.target.value }))} className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800" />
              </label>
              <label className="block text-sm">
                <span className="mb-1 block text-gray-600 dark:text-gray-400">Role</span>
                <select value={draft.role ?? "User"} onChange={(event) => setDraft((current) => ({ ...current, role: event.target.value as AdminUserUpdatePayload["role"] }))} className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800">
                  {roleOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                </select>
              </label>
              <label className="block text-sm">
                <span className="mb-1 block text-gray-600 dark:text-gray-400">Status</span>
                <select value={draft.status ?? "Active"} onChange={(event) => setDraft((current) => ({ ...current, status: event.target.value as AdminUserUpdatePayload["status"] }))} className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800">
                  {statusOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                </select>
              </label>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <Button variant="ghost" size="sm" onClick={() => setEditingUser(null)}>Cancel</Button>
              <Button size="sm" isLoading={submitting} onClick={() => void handleSave()}>
                <Save size={16} className="mr-1" />
                Save changes
              </Button>
            </div>
          </Card>
        </div>
      ) : null}

      <ConfirmationModal
        open={Boolean(pendingDelete)}
        onClose={() => setPendingDelete(null)}
        onConfirm={() => void handleDelete()}
        title="Delete user"
        message={`Remove ${pendingDelete?.name ?? "this user"} from the admin workspace?`}
        confirmLabel="Delete"
        variant="danger"
      />
    </div>
  );
}
