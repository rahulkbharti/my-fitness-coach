import { FitnessPlan } from "./plan-schema";

export const createWorkoutScript = (plan: FitnessPlan, dayIndex: number) => {
  const day = plan.workout.schedule[dayIndex];

  // 1. Intro: Engaging Hook
  let script = `Let's get moving. Today is ${day.day}. We are focusing on ${day.exercises[0].focus}. `;

  // 2. Motivation Injection
  script += `Remember, ${plan.motivation} `;

  // 3. The Workout Loop
  day.exercises.forEach((ex, index) => {
    // Add natural pauses with ellipses (...)
    script += `Exercise ${index + 1}: ${ex.name}. ... `;

    // NORMALIZE THE DATA: "3" -> "three", "lbs" -> "pounds"
    script += `I want you to do ${ex.sets} sets. `;
    script += `Aim for ${ex.reps} reps per set. `;

    // Add Tips naturally
    script += `Here is a tip: ${ex.description}. ... `;

    // Rest Instructions
    if (ex.rest && ex.rest !== "0") {
      script += `Rest for ${ex.rest.replace(
        "s",
        " seconds"
      )} between sets. ... `;
    }
  });

  // 4. Outro
  script += "Great work. Go crush it.";

  return script;
};

export const createDietScript = (plan: FitnessPlan) => {
  let script = `Here is your fuel plan for today. ... `;

  plan.diet.forEach((meal) => {
    script += `For ${meal.meal}, you are having ${meal.name}. `;
    script += `This meal contains ${meal.calories} calories. ... `;

    // List items naturally
    const ingredients = meal.items.join(", ");
    script += `The main ingredients are: ${ingredients}. ... `;
  });

  script += `Stay hydrated and stick to the plan.`;
  return script;
};
