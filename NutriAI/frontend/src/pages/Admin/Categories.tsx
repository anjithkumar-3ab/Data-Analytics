import { useEffect, useMemo, useState } from "react";
import { Save, Tags } from "lucide-react";
import { Alert, Button, Card } from "../../components/common";
import { CategoryTable, EmptyState } from "../../components/admin";
import { createCategory, deleteCategory, fetchCategories, updateCategory } from "../../services/adminService";
import type { AdminCategory, AdminCategoryPayload } from "../../types/admin";

export default function Categories() {
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingCategory, setEditingCategory] = useState<AdminCategory | null>(null);
  const [draft, setDraft] = useState<AdminCategoryPayload | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const result = await fetchCategories({});
      setCategories(result.categories);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load categories.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadCategories();
  }, []);

  const sortedCategories = useMemo(() => [...categories].sort((a, b) => a.name.localeCompare(b.name)), [categories]);

  const openEditor = (category: AdminCategory) => {
    setEditingCategory(category);
    setDraft({ name: category.name, type: category.type, description: category.description ?? "", is_active: category.is_active });
  };

  const handleSave = async () => {
    if (!draft) return;
    setSubmitting(true);
    try {
      if (editingCategory) {
        const updated = await updateCategory(editingCategory._id, draft);
        setCategories((current) => current.map((category) => (category._id === updated._id ? updated : category)));
      } else {
        const created = await createCategory(draft);
        setCategories((current) => [created, ...current]);
      }
      setEditingCategory(null);
      setDraft(null);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save category.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (category: AdminCategory) => {
    try {
      await deleteCategory(category._id);
      setCategories((current) => current.filter((entry) => entry._id !== category._id));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to delete category.");
    }
  };

  return (
    <div className="space-y-6">
      {error ? <Alert variant="warning" title="Categories notice">{error}</Alert> : null}
      <Card>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Category management</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Coordinate food, diet, nutrition and activity groups.</p>
          </div>
          <Button size="sm" onClick={() => { setEditingCategory(null); setDraft({ name: "", type: "food", description: "", is_active: true }); }}>
            <Tags size={16} className="mr-1" />
            Add category
          </Button>
        </div>
      </Card>

      {loading ? (
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400">Loading categories…</div>
      ) : sortedCategories.length === 0 ? (
        <EmptyState title="No categories found" description="Create a category to organize the content model." />
      ) : (
        <CategoryTable categories={sortedCategories} onEdit={openEditor} onDelete={handleDelete} onCreate={() => { setEditingCategory(null); setDraft({ name: "", type: "food", description: "", is_active: true }); }} />
      )}

      {draft ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <Card className="w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{editingCategory ? "Edit category" : "Create category"}</h3>
            <div className="mt-4 space-y-4">
              <label className="block text-sm">
                <span className="mb-1 block text-gray-600 dark:text-gray-400">Name</span>
                <input value={draft.name} onChange={(event) => setDraft((current) => (current ? { ...current, name: event.target.value } : current))} className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800" />
              </label>
              <label className="block text-sm">
                <span className="mb-1 block text-gray-600 dark:text-gray-400">Type</span>
                <select value={draft.type} onChange={(event) => setDraft((current) => (current ? { ...current, type: event.target.value as AdminCategoryPayload["type"] } : current))} className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800">
                  <option value="food">Food</option>
                  <option value="diet">Diet</option>
                  <option value="goal">Goal</option>
                  <option value="activity">Activity</option>
                </select>
              </label>
              <label className="block text-sm">
                <span className="mb-1 block text-gray-600 dark:text-gray-400">Description</span>
                <textarea value={draft.description ?? ""} onChange={(event) => setDraft((current) => (current ? { ...current, description: event.target.value } : current))} className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800" rows={3} />
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <input type="checkbox" checked={draft.is_active ?? true} onChange={(event) => setDraft((current) => (current ? { ...current, is_active: event.target.checked } : current))} />
                Active
              </label>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <Button variant="ghost" size="sm" onClick={() => { setDraft(null); setEditingCategory(null); }}>Cancel</Button>
              <Button size="sm" isLoading={submitting} onClick={() => void handleSave()}>
                <Save size={16} className="mr-1" />
                Save category
              </Button>
            </div>
          </Card>
        </div>
      ) : null}
    </div>
  );
}
