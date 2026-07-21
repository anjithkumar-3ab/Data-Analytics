import { useEffect, useMemo, useState } from "react";
import { Save, UtensilsCrossed } from "lucide-react";
import { Alert, Button, Card } from "../../components/common";
import { EmptyState, FilterPanel, FoodTable, SearchBar } from "../../components/admin";
import { createFood, deleteFood, fetchFoods, updateFood } from "../../services/adminService";
import type { AdminFood, AdminFoodPayload } from "../../types/admin";

const categoryOptions = [
  { label: "Breakfast", value: "Breakfast" },
  { label: "Lunch", value: "Lunch" },
  { label: "Dinner", value: "Dinner" },
  { label: "Snack", value: "Snack" },
];

export default function Foods() {
  const [foods, setFoods] = useState<AdminFood[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingFood, setEditingFood] = useState<AdminFood | null>(null);
  const [draft, setDraft] = useState<AdminFoodPayload | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const loadFoods = async () => {
    setLoading(true);
    try {
      const result = await fetchFoods({ search, category, limit: 100 });
      setFoods(result.foods);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load food catalog.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadFoods();
  }, [search, category]);

  const filteredFoods = useMemo(() => foods, [foods]);

  const openEditor = (food: AdminFood) => {
    setEditingFood(food);
    setDraft({
      name: food.name,
      category: food.category,
      meal_type: food.meal_type,
      food_preference: food.food_preference,
      calories: food.calories,
      protein: food.protein,
      carbohydrates: food.carbohydrates,
      fat: food.fat,
      fiber: food.fiber,
      sugar: food.sugar,
      sodium: food.sodium,
    });
  };

  const handleSave = async () => {
    if (!draft) return;
    setSubmitting(true);
    try {
      if (editingFood) {
        const updated = await updateFood(editingFood._id, draft);
        setFoods((current) => current.map((food) => (food._id === updated._id ? updated : food)));
      } else {
        const created = await createFood(draft);
        setFoods((current) => [created, ...current]);
      }
      setEditingFood(null);
      setDraft(null);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save food.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (food: AdminFood) => {
    try {
      await deleteFood(food._id);
      setFoods((current) => current.filter((entry) => entry._id !== food._id));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to delete food.");
    }
  };

  return (
    <div className="space-y-6">
      {error ? <Alert variant="warning" title="Food catalog notice">{error}</Alert> : null}
      <Card>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Food management</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Maintain the nutrition dataset with search and category filters.</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <SearchBar value={search} onChange={setSearch} placeholder="Search foods" />
            <Button size="sm" onClick={() => { setEditingFood(null); setDraft({ name: "", category: "Breakfast", meal_type: "Breakfast", food_preference: "Vegetarian", calories: 0, protein: 0, carbohydrates: 0, fat: 0, fiber: 0, sugar: 0, sodium: 0 }); }}>
              <UtensilsCrossed size={16} className="mr-1" />
              Add food
            </Button>
          </div>
        </div>
        <div className="mt-4">
          <FilterPanel
            filters={[{ key: "category", label: "Category", value: category, options: categoryOptions }]}
            onChange={(_, value) => setCategory(value)}
          />
        </div>
      </Card>

      {loading ? (
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400">Loading foods…</div>
      ) : filteredFoods.length === 0 ? (
        <EmptyState title="No foods available" description="Add a food record to begin building the catalog." />
      ) : (
        <FoodTable foods={filteredFoods} onEdit={openEditor} onDelete={handleDelete} />
      )}

      {draft ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <Card className="w-full max-w-2xl">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{editingFood ? "Edit food" : "Create food"}</h3>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <label className="text-sm">
                <span className="mb-1 block text-gray-600 dark:text-gray-400">Name</span>
                <input value={draft.name} onChange={(event) => setDraft((current) => (current ? { ...current, name: event.target.value } : current))} className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800" />
              </label>
              <label className="text-sm">
                <span className="mb-1 block text-gray-600 dark:text-gray-400">Category</span>
                <input value={draft.category} onChange={(event) => setDraft((current) => (current ? { ...current, category: event.target.value } : current))} className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800" />
              </label>
              <label className="text-sm">
                <span className="mb-1 block text-gray-600 dark:text-gray-400">Meal type</span>
                <input value={draft.meal_type} onChange={(event) => setDraft((current) => (current ? { ...current, meal_type: event.target.value } : current))} className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800" />
              </label>
              <label className="text-sm">
                <span className="mb-1 block text-gray-600 dark:text-gray-400">Preference</span>
                <input value={draft.food_preference} onChange={(event) => setDraft((current) => (current ? { ...current, food_preference: event.target.value } : current))} className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800" />
              </label>
              <label className="text-sm">
                <span className="mb-1 block text-gray-600 dark:text-gray-400">Calories</span>
                <input type="number" value={draft.calories} onChange={(event) => setDraft((current) => (current ? { ...current, calories: Number(event.target.value) } : current))} className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800" />
              </label>
              <label className="text-sm">
                <span className="mb-1 block text-gray-600 dark:text-gray-400">Protein</span>
                <input type="number" value={draft.protein} onChange={(event) => setDraft((current) => (current ? { ...current, protein: Number(event.target.value) } : current))} className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800" />
              </label>
              <label className="text-sm">
                <span className="mb-1 block text-gray-600 dark:text-gray-400">Carbohydrates</span>
                <input type="number" value={draft.carbohydrates} onChange={(event) => setDraft((current) => (current ? { ...current, carbohydrates: Number(event.target.value) } : current))} className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800" />
              </label>
              <label className="text-sm">
                <span className="mb-1 block text-gray-600 dark:text-gray-400">Fat</span>
                <input type="number" value={draft.fat} onChange={(event) => setDraft((current) => (current ? { ...current, fat: Number(event.target.value) } : current))} className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800" />
              </label>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <Button variant="ghost" size="sm" onClick={() => { setDraft(null); setEditingFood(null); }}>Cancel</Button>
              <Button size="sm" isLoading={submitting} onClick={() => void handleSave()}>
                <Save size={16} className="mr-1" />
                Save food
              </Button>
            </div>
          </Card>
        </div>
      ) : null}
    </div>
  );
}
