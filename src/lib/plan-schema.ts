import { z } from "zod";

// 1. Define sub-schemas for cleaner code
export const ExerciseSchema = z.object({
  name: z.string().describe("Name of the exercise, e.g., 'Bench Press'"),
  sets: z.number().describe("Number of sets, e.g., 3"),
  reps: z.string().describe("Rep range, e.g., '8-12' or 'Failure'"),
  rest: z.string().describe("Rest time in seconds, e.g., '60s'"),
  focus: z.string().describe("Target muscle group, e.g., 'Chest'"),
  description: z
    .string()
    .describe("Short form cue on how to perform it safely"),
});

export const MealSchema = z.object({
  meal: z.string().describe("Breakfast, Lunch, Snack, or Dinner"),
  name: z.string().describe("Name of the dish"),
  calories: z.number(),
  protein: z.string().describe("e.g., '30g'"),
  carbs: z.string().describe("e.g., '40g'"),
  fats: z.string().describe("e.g., '15g'"),
  items: z.array(z.string()).describe("List of ingredients/components"),
});

export const DayWorkoutSchema = z.object({
  day: z.string().describe("e.g., 'Monday (Push)'"),
  exercises: z.array(ExerciseSchema),
});

// 2. Main Schema matching your MOCK_PLAN
export const FitnessPlanSchema = z.object({
  name: z.string().describe("User's name"),
  focus: z.string().describe("Primary fitness goal, e.g., 'Muscle Gain'"),
  split: z.string().describe("Workout split type, e.g., 'Push/Pull/Legs'"),
  totalCalories: z.number().describe("Daily calorie target"),
  workoutDuration: z
    .string()
    .describe("Average workout duration, e.g., '60 mins'"),
  summary: z
    .string()
    .describe("A warm, personalized 2-sentence summary of the plan"),
  motivation: z.string().describe("A powerful motivational quote or thought"),
  tips: z.array(z.string()).describe("3 actionable health/posture tips"),
  workout: z.object({
    split: z.string().describe("The name of the split, e.g., 'Push/Pull/Legs'"),
    schedule: z.array(DayWorkoutSchema),
  }),
  diet: z.array(MealSchema),
});

// Export the Type for use in your Frontend components
export type FitnessPlan = z.infer<typeof FitnessPlanSchema>;
