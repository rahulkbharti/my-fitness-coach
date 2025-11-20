"use server";

import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import { FitnessPlanSchema } from "@/lib/plan-schema";
import { UserProfileSchema } from "@/lib/validators"; // Your form validator

export async function generatePlanAction(data: UserProfileSchema) {
  try {
    console.log("📡 Connecting to Gemini...");

    const prompt = `
      Generate a highly personalized workout and diet plan for the following user:
      
      Name: ${data.name}
      Age: ${data.age}, Gender: ${data.gender}
      Height: ${data.height}cm, Weight: ${data.weight}kg
      Goal: ${data.goal}
      Experience Level: ${data.level}
      Workout Location: ${
        data.location
      } (This is CRITICAL. If "Home", only use dumbbells/bodyweight. If "Gym", use machines.)
      Dietary Preference: ${data.dietaryPreference}
      Medical Conditions: ${data.conditions || "None"}
      
      REQUIREMENTS:
      1. Create a weekly workout schedule based on their experience level.
      2. Create a daily meal plan that fits their goal (Calorie deficit for weight loss, Surplus for muscle gain).
      3. Ensure the tone is encouraging and professional.
      4. Dont add Rest Days in the workout schedule.
      5. Use the FitnessPlanSchema to format the output strictly.
    `;

    const { object } = await generateObject({
      model: google("gemini-2.5-flash"), // Flash is faster & cheaper for this task
      schema: FitnessPlanSchema,
      prompt: prompt,
      temperature: 0.7, // Creative but structured
    });

    console.log("✅ Plan Generated successfully");
    return { success: true, data: object };
  } catch (error) {
    console.error("❌ Gemini API Error:", error);
    return {
      success: false,
      error: "Failed to generate plan. Please try again.",
    };
  }
}
