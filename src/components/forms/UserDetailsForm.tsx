"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, Sparkles, Activity, Dumbbell, Utensils } from "lucide-react";
import { userProfileSchema, type UserProfileSchema } from "@/lib/validators";
import { useRouter } from "next/navigation";
import { useEffect, useState, type KeyboardEvent } from "react"; // FIXED: Added KeyboardEvent import
import { generatePlanAction } from "@/actions/generateDiet";

export default function UserDetailsForm() {
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    // Solves hydration mismatch issues
    const [isClient, setIsClient] = useState(false);
    useEffect(() => {
        setIsClient(true);
    }, []);

    const form = useForm({
        resolver: zodResolver(userProfileSchema),
        defaultValues: {
            name: "",
            age: 25,
            gender: "Male",
            height: 170,
            weight: 70,
            goal: "Muscle Gain",
            level: "Beginner",
            location: "Gym",
            dietaryPreference: "Non-Veg",
            conditions: "",
        },
    });

    const { register, handleSubmit, formState: { errors }, trigger, watch } = form;
    const goal = watch("goal");
    const dietaryPreference = watch("dietaryPreference");

    // VALIDATION LOGIC
    const nextStep = async () => {
        let isValid = false;
        if (step === 1) {
            isValid = await trigger(["name", "age", "gender", "height", "weight"]);
        } else if (step === 2) {
            isValid = await trigger(["goal", "level", "location"]);
        }

        if (isValid && step < 3) {
            setStep((prev) => prev + 1);
        }
    };

    const prevStep = () => setStep((prev) => prev - 1);

    // KEYBOARD HANDLER: Pressing Enter triggers Next Step, NOT Submit
    const handleKeyDown = (e: KeyboardEvent<HTMLFormElement>) => {
        if (e.key === "Enter") {
            e.preventDefault(); // KILL the default form submit
            if (step < 3) {
                nextStep();
            }
        }
    };

    // FINAL SUBMISSION
    const onFinalSubmit = async (data: UserProfileSchema) => {
        setIsLoading(true);
        console.log("Form Data Submitted:", data);

        try {
            // 1. Call the Server Action
            const result = await generatePlanAction(data);

            console.log("Generation Result:", result);

            if (result.success && result.data) {
                // 2. Store the Real Gemini Data
                // (In a real app, use Zustand/Context. For speed, we use localStorage)
                console.log("Generated Plan:", result.data);
                localStorage.setItem("fitnessPlan", JSON.stringify(result.data));

                // 3. Redirect
                router.push("/dashboard");
            } else {
                alert("AI is busy. Please try again!");
                setIsLoading(false);
            }
        } catch (error) {
            console.error(error);
            setIsLoading(false);
        }
    };

    // ANIMATION VARIANTS
    const slideVariants = {
        enter: (direction: number) => ({ x: direction > 0 ? 50 : -50, opacity: 0 }),
        center: { x: 0, opacity: 1 },
        exit: (direction: number) => ({ x: direction < 0 ? 50 : -50, opacity: 0 }),
    };

    return (
        <div className="w-full max-w-2xl mx-auto p-6 bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-2xl shadow-2xl text-white">

            {/* Progress Bar */}
            <div className="mb-8">
                <div className="flex justify-between mb-2 text-sm text-slate-400">
                    <span>Personal</span>
                    <span>Fitness</span>
                    <span>Nutrition</span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-linear-to-r from-blue-500 to-purple-500" // FIXED: bg-gradient
                        initial={{ width: "33%" }}
                        animate={{ width: `${(step / 3) * 100}%` }}
                    />
                </div>
            </div>

            {/* FORM START: Removed onSubmit from here to prevent auto-triggering */}
            <form
                onKeyDown={handleKeyDown}
                className="relative min-h-[400px]"
            >
                <AnimatePresence mode="wait" initial={false}>

                    {/* STEP 1: PERSONAL INFO */}
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            variants={slideVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            className="space-y-6"
                        >
                            <h2 className="text-2xl font-bold flex items-center gap-2"><Activity className="text-blue-400" /> Your Biometrics</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-300">Full Name</label>
                                    <input {...register("name")} className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700 focus:border-blue-500 outline-none" placeholder="John Doe" />
                                    {errors.name && <p className="text-red-400 text-xs">{errors.name.message}</p>}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-300">Age</label>
                                    <input type="number" {...register("age")} className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700 focus:border-blue-500 outline-none" placeholder="25" />
                                    {errors.age && <p className="text-red-400 text-xs">{errors.age.message}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-300">Weight (kg)</label>
                                    <input type="number" {...register("weight")} className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700 focus:border-blue-500 outline-none" placeholder="75" />
                                    {errors.weight && <p className="text-red-400 text-xs">{errors.weight.message}</p>}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-300">Height (cm)</label>
                                    <input type="number" {...register("height")} className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700 focus:border-blue-500 outline-none" placeholder="175" />
                                    {errors.height && <p className="text-red-400 text-xs">{errors.height.message}</p>}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300">Gender</label>
                                <select {...register("gender")} className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700 focus:border-blue-500 outline-none">
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 2: FITNESS GOALS */}
                    {step === 2 && (
                        <motion.div
                            key="step2"
                            variants={slideVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            className="space-y-6"
                        >
                            <h2 className="text-2xl font-bold flex items-center gap-2"><Dumbbell className="text-purple-400" /> Training Style</h2>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300">Main Goal</label>
                                <div className="grid grid-cols-2 gap-3">
                                    {["Weight Loss", "Muscle Gain", "Endurance", "Maintenance"].map((g) => (
                                        <label key={g} className={`p-3 rounded-lg border cursor-pointer transition-all ${isClient && goal === g ? "bg-purple-500/20 border-purple-500 text-white" : "bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600"}`}>
                                            <input type="radio" value={g} {...register("goal")} className="hidden" />
                                            <span className="text-center block">{g}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300">Experience Level</label>
                                <select {...register("level")} className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700 focus:border-purple-500 outline-none">
                                    <option value="Beginner">Beginner (0-1 years)</option>
                                    <option value="Intermediate">Intermediate (1-3 years)</option>
                                    <option value="Advanced">Advanced (3+ years)</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300">Workout Location</label>
                                <select {...register("location")} className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700 focus:border-purple-500 outline-none">
                                    <option value="Gym">Commercial Gym</option>
                                    <option value="Home">Home (Dumbbells/Bands)</option>
                                    <option value="Outdoor">Outdoor / Bodyweight</option>
                                </select>
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 3: DIET & SUBMIT */}
                    {step === 3 && (
                        <motion.div
                            key="step3"
                            variants={slideVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            className="space-y-6"
                        >
                            <h2 className="text-2xl font-bold flex items-center gap-2"><Utensils className="text-green-400" /> Nutrition & Health</h2>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300">Dietary Preference</label>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                    {["Vegetarian", "Non-Veg", "Vegan", "Keto", "Paleo"].map((d) => (
                                        <label key={d} className={`p-3 rounded-lg border cursor-pointer transition-all ${isClient && dietaryPreference === d ? "bg-green-500/20 border-green-500 text-white" : "bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600"}`}>
                                            <input type="radio" value={d} {...register("dietaryPreference")} className="hidden" />
                                            <span className="text-center block text-sm">{d}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300">Medical Conditions / Injuries (Optional)</label>
                                <textarea
                                    {...register("conditions")}
                                    className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700 focus:border-green-500 outline-none min-h-[100px]"
                                    placeholder="e.g., Lower back pain, Lactose intolerance..."
                                />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* NAVIGATION BUTTONS */}
                <div className="flex justify-between mt-8 pt-4 border-t border-slate-800">
                    {step > 1 ? (
                        <button
                            type="button"
                            onClick={prevStep}
                            className="flex items-center px-6 py-3 rounded-lg text-slate-300 hover:bg-slate-800 transition-colors"
                        >
                            <ChevronLeft className="w-5 h-5 mr-1" /> Back
                        </button>
                    ) : <div></div>}

                    {step < 3 ? (
                        <button
                            type="button"
                            onClick={nextStep}
                            className="flex items-center px-8 py-3 rounded-lg bg-white text-black font-bold hover:bg-gray-200 transition-colors"
                        >
                            Next Step <ChevronRight className="w-5 h-5 ml-1" />
                        </button>
                    ) : (
                        // FIXED: Moved handleSubmit here. It ONLY fires when this button is clicked.
                        <button
                            type="button"
                            onClick={handleSubmit(onFinalSubmit)}
                            disabled={isLoading}
                            className="flex items-center px-8 py-3 rounded-lg bg-linear-to-r from-blue-500 to-purple-500 text-white font-bold hover:opacity-90 transition-opacity"
                        >
                            {isLoading ? (
                                <span className="flex items-center animate-pulse">Generating Plan...</span>
                            ) : (
                                <span className="flex items-center">Generate Plan <Sparkles className="w-5 h-5 ml-2" /></span>
                            )}
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
}