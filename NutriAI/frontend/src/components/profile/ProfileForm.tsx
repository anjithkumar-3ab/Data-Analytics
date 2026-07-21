import { useState, useEffect, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { defaultUser } from "../../constants/user";
import { Input, Button, Alert, Spinner } from "../common";
import { profileSchema, type ProfileFormData } from "../../validations/profile";
import { saveHealthProfile, fetchHealthProfile } from "../../services/profileService";
import type { HealthProfile } from "../../types/profile";
import GoalSelector from "./GoalSelector";
import ActivitySelector from "./ActivitySelector";
import ProfileAvatar from "./ProfileAvatar";
import type { AxiosError } from "axios";

interface ProfileFormProps {
  onProfileSaved: (profile: HealthProfile) => void;
}

/** Full health profile form with React Hook Form, Zod validation, and backend API integration. */
export default function ProfileForm({ onProfileSaved }: ProfileFormProps) {
  const user = defaultUser;
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ProfileFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(profileSchema) as any,
    defaultValues: {
      age: 0,
      gender: "Male",
      height: 0,
      weight: 0,
      activity_level: "Sedentary",
      goal: "Maintain Weight",
      food_preference: "Vegetarian",
      allergies: "",
      medical_conditions: "",
    },
  });

  /** Attempt to load existing profile on mount. */
  useEffect(() => {
    let cancelled = false;
    setIsLoadingProfile(true);
    fetchHealthProfile()
      .then((data) => {
        if (!cancelled && data) {
          const hp = data as unknown as HealthProfile;
          reset({
            age: hp.age ?? 0,
            gender: hp.gender ?? "Male",
            height: hp.height ?? 0,
            weight: hp.weight ?? 0,
            activity_level: hp.activity_level ?? "Sedentary",
            goal: hp.goal ?? "Maintain Weight",
            food_preference: hp.food_preference ?? "Vegetarian",
            allergies: hp.allergies ?? "",
            medical_conditions: hp.medical_conditions ?? "",
          });
          onProfileSaved(hp);
        }
      })
      .catch(() => {})
      .finally(() => { if (!cancelled) setIsLoadingProfile(false); });
  }, []); // eslint-disable-line

  const onSubmit = useCallback(
    async (formData: ProfileFormData) => {
      setServerError(null);
      setSuccessMsg(null);
      try {
        const result = await saveHealthProfile({
          age: formData.age,
          gender: formData.gender,
          height: formData.height,
          weight: formData.weight,
          activity_level: formData.activity_level,
          goal: formData.goal,
          food_preference: formData.food_preference,
          allergies: formData.allergies || undefined,
          medical_conditions: formData.medical_conditions || undefined,
        });
        const fullProfile: HealthProfile = {
          ...formData,
          bmi: result.bmi,
          bmi_category: result.category,
          bmr: result.bmr,
          tdee: result.tdee,
          daily_calories: result.daily_calories,
          protein: result.protein,
          carbohydrates: result.carbohydrates,
          fat: result.fat,
        };
        setSuccessMsg(result.message ?? "Profile saved successfully!");
        onProfileSaved(fullProfile);
      } catch (err: unknown) {
        const axiosErr = err as AxiosError<{ detail?: string; message?: string }>;
        setServerError(
          axiosErr.response?.data?.detail ??
          axiosErr.response?.data?.message ??
          "Failed to save profile. Please try again.",
        );
      }
    },
    [onProfileSaved],
  );

  if (isLoadingProfile) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
      {serverError && <Alert variant="error">{serverError}</Alert>}
      {successMsg && <Alert variant="success">{successMsg}</Alert>}

      <ProfileAvatar name={user?.name ?? "User"} email={user?.email ?? ""} />

      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Age"
          type="number"
          placeholder="25"
          error={errors.age?.message}
          {...register("age", { valueAsNumber: true })}
        />
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Gender <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-3">
            {(["Male", "Female"] as const).map((g) => (
              <label key={g} className="flex items-center gap-2">
                <input
                  type="radio"
                  value={g}
                  className="h-4 w-4 text-green-600 focus:ring-green-500"
                  {...register("gender")}
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">{g}</span>
              </label>
            ))}
          </div>
          {errors.gender && <p className="mt-1 text-xs text-red-500">{errors.gender.message}</p>}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Height (cm)"
          type="number"
          step="0.1"
          placeholder="172"
          error={errors.height?.message}
          {...register("height", { valueAsNumber: true })}
        />
        <Input
          label="Weight (kg)"
          type="number"
          step="0.1"
          placeholder="68"
          error={errors.weight?.message}
          {...register("weight", { valueAsNumber: true })}
        />
      </div>

      <Controller
        name="goal"
        control={control}
        render={({ field }) => (
          <GoalSelector
            value={field.value}
            onChange={field.onChange}
            error={errors.goal?.message}
            disabled={isSubmitting}
          />
        )}
      />

      <Controller
        name="activity_level"
        control={control}
        render={({ field }) => (
          <ActivitySelector
            value={field.value}
            onChange={field.onChange}
            error={errors.activity_level?.message}
            disabled={isSubmitting}
          />
        )}
      />

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Diet Preference <span className="text-red-500">*</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {(["Vegetarian", "Non-Vegetarian", "Vegan"] as const).map((pref) => (
            <label
              key={pref}
              className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm cursor-pointer hover:border-green-400 dark:border-gray-700"
            >
              <input
                type="radio"
                value={pref}
                className="h-4 w-4 text-green-600 focus:ring-green-500"
                {...register("food_preference")}
              />
              <span className="text-gray-700 dark:text-gray-300">{pref}</span>
            </label>
          ))}
        </div>
        {errors.food_preference && (
          <p className="mt-1 text-xs text-red-500">{errors.food_preference.message}</p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Allergies
          </label>
          <textarea
            rows={2}
            placeholder="e.g., peanuts, lactose"
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
            {...register("allergies")}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Medical Conditions
          </label>
          <textarea
            rows={2}
            placeholder="e.g., diabetes, hypertension"
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
            {...register("medical_conditions")}
          />
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="submit" isLoading={isSubmitting} className="flex-1">
          Save Profile
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            reset();
            setServerError(null);
            setSuccessMsg(null);
          }}
          disabled={!isDirty || isSubmitting}
        >
          Reset
        </Button>
      </div>
    </form>
  );
}
