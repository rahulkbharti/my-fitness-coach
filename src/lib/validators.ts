import { z } from "zod";

export const userProfileSchema = z.object({
  // Step 1: Personal Info
  name: z.string().min(2, "Name is required"),
  age: z.coerce.number().min(10, "Must be at least 10 years old"),
  gender: z.enum(["Male", "Female", "Other"]),
  height: z.coerce.number().min(50, "Height in cm is required"),
  weight: z.coerce.number().min(20, "Weight in kg is required"),

  // Step 2: Fitness Profile
  goal: z.enum(["Weight Loss", "Muscle Gain", "Maintenance", "Endurance"]),
  level: z.enum(["Beginner", "Intermediate", "Advanced"]),
  location: z.enum(["Gym", "Home", "Outdoor"]),

  // Step 3: Diet & Health
  dietaryPreference: z.enum([
    "Vegetarian",
    "Non-Veg",
    "Vegan",
    "Keto",
    "Paleo",
  ]),
  conditions: z.string().optional(), // Medical history
});

export type UserProfileSchema = z.infer<typeof userProfileSchema>;
