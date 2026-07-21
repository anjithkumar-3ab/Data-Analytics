import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input, Button, Alert } from "../common";
import type { RecommendationRequest } from "../../types/recommendation";

// ------------------------------------------------------------------
// Zod schema
// ------------------------------------------------------------------
const formSchema = z.object({
  age: z.coerce.number({ message: "Required" }).int().min(1).max(120),
  gender: z.enum(["Male", "Female"]),
  height: z.coerce.number({ message: "Required" }).min(50).max(250),
  weight: z.coerce.number({ message: "Required" }).min(10).max(300),
  activity_level: z.string().min(1, "Required"),
  goal: z.string().min(1, "Required"),
  food_preference: z.string().min(1, "Required"),
  meals_per_day: z.coerce.number().int().min(3).max(6),
  preferred_cuisine: z.string().optional().default(""),
  budget_level: z.enum(["Low", "Medium", "High"]).default("Medium"),
  cooking_time: z.string().optional().default(""),
  exclude_ingredients: z.string().optional().default(""),
  allergies: z.string().optional().default(""),
  medical_conditions: z.string().optional().default(""),
  water_intake_preference: z.string().optional().default(""),
});

// ------------------------------------------------------------------
// Helpers
// ------------------------------------------------------------------
const parseCommaSeparated = (val: string): string[] =>
  val
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

// ------------------------------------------------------------------
// Props
// ------------------------------------------------------------------
interface RecommendationFormProps {
  onSubmit: (data: RecommendationRequest) => Promise<void>;
  isSubmitting: boolean;
  serverError: string | null;
}

// ------------------------------------------------------------------
// Reusable style tokens
// ------------------------------------------------------------------
const inputClass =
  "w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500";
const labelClass =
  "mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300";
const sectionClass =
  "rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900";
const sectionTitle =
  "mb-4 text-sm font-semibold text-gray-700 dark:text-gray-300";

// ------------------------------------------------------------------
// Component
// ------------------------------------------------------------------
export default function RecommendationForm({
  onSubmit,
  isSubmitting,
  serverError,
}: RecommendationFormProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<any>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      age: 25,
      gender: "Male",
      height: 170,
      weight: 70,
      activity_level: "Moderate",
      goal: "Maintenance",
      food_preference: "Non-Vegetarian",
      meals_per_day: 4,
      preferred_cuisine: "",
      budget_level: "Medium",
      cooking_time: "",
      exclude_ingredients: "",
      allergies: "",
      medical_conditions: "",
      water_intake_preference: "",
    },
  });

  const onFormSubmit = async (data: Record<string, unknown>) => {
    const payload: RecommendationRequest = {
      age: data.age as number,
      gender: data.gender as RecommendationRequest["gender"],
      height: data.height as number,
      weight: data.weight as number,
      activity_level:
        data.activity_level as RecommendationRequest["activity_level"],
      goal: data.goal as RecommendationRequest["goal"],
      food_preference:
        data.food_preference as RecommendationRequest["food_preference"],
      allergies: parseCommaSeparated((data.allergies as string) ?? ""),
      medical_conditions: parseCommaSeparated(
        (data.medical_conditions as string) ?? "",
      ),
      meals_per_day: data.meals_per_day as number,
      budget:
        data.budget_level === "Low"
          ? 3000
          : data.budget_level === "Medium"
            ? 6000
            : 10000,
    };
    await onSubmit(payload);
  };

  return (
    <form
      onSubmit={handleSubmit(onFormSubmit)}
      noValidate
      className="space-y-6"
      aria-label="Diet recommendation form"
    >
      {serverError && <Alert variant="error">{serverError}</Alert>}

      {/* ================================================================
           Section: Personal Information
           ================================================================ */}
      <div className={sectionClass}>
        <h3 className={sectionTitle}>👤 Personal Information</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Age"
            type="number"
            placeholder="25"
            error={errors.age?.message as string}
            {...register("age")}
          />
          <div>
            <label className={labelClass}>Gender</label>
            <div className="mt-2 flex gap-4">
              {(["Male", "Female"] as const).map((g) => (
                <label
                  key={g}
                  className="flex cursor-pointer items-center gap-2"
                >
                  <input
                    type="radio"
                    value={g}
                    className="h-4 w-4 accent-green-600"
                    {...register("gender")}
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {g}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Input
            label="Height (cm)"
            type="number"
            step="0.1"
            placeholder="170"
            error={errors.height?.message as string}
            {...register("height")}
          />
          <Input
            label="Weight (kg)"
            type="number"
            step="0.1"
            placeholder="70"
            error={errors.weight?.message as string}
            {...register("weight")}
          />
        </div>
      </div>

      {/* ================================================================
           Section: Diet Preferences
           ================================================================ */}
      <div className={sectionClass}>
        <h3 className={sectionTitle}>🥗 Diet Preferences</h3>

        <div className="grid gap-4 sm:grid-cols-3">
          {/* Activity Level */}
          <div>
            <label className={labelClass}>Activity Level</label>
            <select className={inputClass} {...register("activity_level")}>
              {[
                "Sedentary",
                "Light",
                "Moderate",
                "Active",
                "Very Active",
              ].map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
            {errors.activity_level && (
              <p className="mt-1 text-xs text-red-500">
                {errors.activity_level.message as string}
              </p>
            )}
          </div>

          {/* Goal */}
          <div>
            <label className={labelClass}>Fitness Goal</label>
            <select className={inputClass} {...register("goal")}>
              {["Weight Loss", "Maintenance", "Weight Gain"].map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </div>

          {/* Food Preference */}
          <div>
            <label className={labelClass}>Diet Preference</label>
            <select className={inputClass} {...register("food_preference")}>
              {["Vegetarian", "Non-Vegetarian", "Vegan"].map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {/* Meals Per Day */}
          <Input
            label="Meals Per Day"
            type="number"
            min={3}
            max={6}
            placeholder="4"
            error={errors.meals_per_day?.message as string}
            {...register("meals_per_day")}
          />

          {/* Preferred Cuisine */}
          <div>
            <label className={labelClass}>
              Preferred Cuisine{" "}
              <span className="text-xs text-gray-400">(optional)</span>
            </label>
            <select className={inputClass} {...register("preferred_cuisine")}>
              <option value="">Any</option>
              {[
                "Indian",
                "Italian",
                "Chinese",
                "Mexican",
                "Mediterranean",
                "Japanese",
                "Thai",
                "American",
              ].map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </div>

          {/* Budget Level */}
          <div>
            <label className={labelClass}>Budget Level</label>
            <select className={inputClass} {...register("budget_level")}>
              {(["Low", "Medium", "High"] as const).map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {/* Cooking Time */}
          <div>
            <label className={labelClass}>
              Max Cooking Time{" "}
              <span className="text-xs text-gray-400">(optional)</span>
            </label>
            <select className={inputClass} {...register("cooking_time")}>
              <option value="">Any</option>
              <option value="15">15 min</option>
              <option value="30">30 min</option>
              <option value="45">45 min</option>
              <option value="60">60 min</option>
              <option value="90">90 min</option>
            </select>
          </div>

          {/* Water Intake Preference */}
          <div>
            <label className={labelClass}>
              Water Intake Preference{" "}
              <span className="text-xs text-gray-400">(optional)</span>
            </label>
            <select
              className={inputClass}
              {...register("water_intake_preference")}
            >
              <option value="">Standard</option>
              <option value="High">High (3+ L/day)</option>
              <option value="Moderate">Moderate (2-3 L/day)</option>
              <option value="Low">Low (under 2 L/day)</option>
            </select>
          </div>
        </div>
      </div>

      {/* ================================================================
           Section: Dietary Restrictions
           ================================================================ */}
      <div className={sectionClass}>
        <h3 className={sectionTitle}>⚠️ Dietary Restrictions</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Allergies */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Allergies
            </label>
            <textarea
              rows={2}
              placeholder="e.g., peanut, milk, gluten"
              className={inputClass}
              {...register("allergies")}
            />
            <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
              Separate with commas
            </p>
          </div>

          {/* Medical Conditions */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Medical Conditions
            </label>
            <textarea
              rows={2}
              placeholder="e.g., diabetes, hypertension"
              className={inputClass}
              {...register("medical_conditions")}
            />
            <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
              Separate with commas
            </p>
          </div>

          {/* Exclude Ingredients */}
          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Exclude Ingredients{" "}
              <span className="text-xs text-gray-400">(optional)</span>
            </label>
            <textarea
              rows={2}
              placeholder="e.g., mushrooms, bell peppers, cilantro"
              className={inputClass}
              {...register("exclude_ingredients")}
            />
            <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
              Ingredients to avoid in your meal plan. Separate with commas.
            </p>
          </div>
        </div>
      </div>

      {/* ================================================================
           Submit Button
           ================================================================ */}
      <Button
        type="submit"
        isLoading={isSubmitting}
        disabled={isSubmitting}
        className="w-full"
        size="lg"
        aria-label="Generate personalized diet plan"
      >
        {isSubmitting
          ? "🧠 Generating your plan..."
          : "🤖 Generate My Diet Plan"}
      </Button>
    </form>
  );
}
