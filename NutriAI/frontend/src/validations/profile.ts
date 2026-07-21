import { z } from "zod";

export const profileSchema = z.object({
  age: z
    .number({ message: "Age must be a number" })
    .int("Age must be a whole number")
    .min(1, "Age must be at least 1")
    .max(120, "Age must be under 120"),
  gender: z.enum(["Male", "Female"] as const, { message: "Gender is required" }),
  height: z
    .number({ message: "Height must be a number" })
    .min(50, "Height must be at least 50 cm")
    .max(300, "Height must be under 300 cm"),
  weight: z
    .number({ message: "Weight must be a number" })
    .min(20, "Weight must be at least 20 kg")
    .max(500, "Weight must be under 500 kg"),
  activity_level: z.enum(
    ["Sedentary", "Light", "Moderate", "Active", "Very Active"] as const,
    { message: "Activity level is required" },
  ),
  goal: z.enum(
    ["Weight Loss", "Weight Gain", "Maintain Weight"] as const,
    { message: "Goal is required" },
  ),
  food_preference: z.enum(
    ["Vegetarian", "Non-Vegetarian", "Vegan"] as const,
    { message: "Food preference is required" },
  ),
  allergies: z.string().optional().default(""),
  medical_conditions: z.string().optional().default(""),
});

export type ProfileFormData = z.infer<typeof profileSchema>;
