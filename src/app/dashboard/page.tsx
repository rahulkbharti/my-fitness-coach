"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Dumbbell,
    Utensils,
    Brain,
    Calendar,
    Clock,
    Flame,
    Play,
    Volume2,
    Download,
    RefreshCcw,
    Image as ImageIcon,
    ChevronRight
} from "lucide-react";
import { createDietScript, createWorkoutScript } from "@/lib/script-builder";
import { generateVoiceAction } from "@/actions/generateVoice";
import { useRouter } from "next/navigation";

// --- 1. MOCK DATA (This is what your AI will eventually return) ---
const MOCK_PLAN = {
    name: "Alex",
    focus: "Muscle Gain",
    split: "Push / Pull / Legs",
    totalCalories: 2400,
    workoutDuration: "60 mins",
    summary: "Based on your goal to 'Gain Muscle', we've designed a Hypertrophy-focused push/pull split.",
    motivation: "Consistency is key. You are building the version of yourself you've always wanted.",
    tips: [
        "Keep your back straight during deadlifts to avoid injury.",
        "Hydrate: Drink at least 3L of water daily.",
        "Sleep is when muscles grow—aim for 7-8 hours."
    ],
    workout: {
        split: "Push / Pull / Legs",
        schedule: [
            {
                day: "Monday (Push)",
                exercises: [
                    { name: "Barbell Bench Press", sets: 4, reps: "8-12", rest: "90s", focus: "Chest", description: "Explosive push up, slow controlled descent." },
                    { name: "Overhead Shoulder Press", sets: 3, reps: "10-12", rest: "60s", focus: "Shoulders", description: "Keep core tight, do not arch back." },
                    { name: "Incline Dumbbell Fly", sets: 3, reps: "12-15", rest: "60s", focus: "Upper Chest", description: "Focus on the stretch at the bottom." },
                    { name: "Tricep Rope Pushdown", sets: 4, reps: "15", rest: "45s", focus: "Triceps", description: "Keep elbows locked at your sides." },
                ]
            },
            {
                day: "Tuesday (Pull)",
                exercises: [
                    { name: "Deadlift", sets: 3, reps: "5-8", rest: "120s", focus: "Back/Legs", description: "Drive through heels, keep spine neutral." },
                    { name: "Lat Pulldown", sets: 4, reps: "10-12", rest: "60s", focus: "Lats", description: "Pull towards your upper chest." },
                    { name: "Face Pulls", sets: 3, reps: "15", rest: "45s", focus: "Rear Delts", description: "Pull rope to forehead level." },
                ]
            },
            {
                day: "Wednesday (Rest)",
                exercises: [
                    { name: "Light Stretching / Yoga", sets: 1, reps: "30 mins", rest: "-", focus: "Recovery", description: "Focus on mobility and blood flow." }
                ]
            }
        ]
    },
    diet: [
        { meal: "Breakfast", name: "Oatmeal & Whey Protein", calories: 450, protein: "30g", carbs: "60g", fats: "10g", items: ["1 cup Oats", "1 scoop Whey", "Blueberries"] },
        { meal: "Lunch", name: "Grilled Chicken & Rice", calories: 600, protein: "45g", carbs: "70g", fats: "15g", items: ["200g Chicken Breast", "1 cup Brown Rice", "Broccoli"] },
        { meal: "Snack", name: "Greek Yogurt & Almonds", calories: 250, protein: "15g", carbs: "10g", fats: "12g", items: ["1 cup Greek Yogurt", "10 Almonds"] },
        { meal: "Dinner", name: "Salmon & Asparagus", calories: 550, protein: "40g", carbs: "20g", fats: "25g", items: ["200g Salmon Fillet", "Steamed Asparagus", "Olive Oil"] },
    ]
};

// --- UI Components ---

const StatCard = ({ icon: Icon, label, value, color }: { icon: React.ElementType, label: string, value: string, color: string }) => (
    <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col gap-1">
        <div className="flex items-center gap-2 text-sm text-slate-400">
            <Icon size={16} className={color} /> {label}
        </div>
        <div className="font-bold text-white text-lg">{value}</div>
    </div>
);

const TabButton = ({ id, label, icon: Icon, activeTab, onClick }: { id: string, label: string, icon: React.ElementType, activeTab: string, onClick: () => void }) => (
    <button
        onClick={onClick}
        className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === id
            ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20"
            : "text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
    >
        <Icon size={16} />
        {label}
    </button>
);

const ExerciseCard = ({ exercise }: { exercise: any }) => (
    <div className="group relative bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-600 transition-all">
        <div className="flex justify-between items-start">
            <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-bold text-lg text-white">{exercise.name}</h4>
                    <span className="text-xs px-2 py-0.5 bg-slate-800 text-slate-400 rounded-full border border-slate-700">{exercise.focus}</span>
                </div>
                <p className="text-sm text-slate-400 mb-4">{exercise.description}</p>
                <div className="flex gap-4 text-sm">
                    <div className="px-3 py-1.5 bg-slate-950 rounded-lg border border-slate-800 text-slate-300">
                        <span className="text-slate-500 text-xs block">SETS</span> {exercise.sets}
                    </div>
                    <div className="px-3 py-1.5 bg-slate-950 rounded-lg border border-slate-800 text-slate-300">
                        <span className="text-slate-500 text-xs block">REPS</span> {exercise.reps}
                    </div>
                    <div className="px-3 py-1.5 bg-slate-950 rounded-lg border border-slate-800 text-slate-300">
                        <span className="text-slate-500 text-xs block">REST</span> {exercise.rest}
                    </div>
                </div>
            </div>
            <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-2 bg-slate-800 hover:bg-blue-600 hover:text-white rounded-lg text-slate-400 transition-colors" title="Show Visual">
                    <ImageIcon size={18} />
                </button>
                <button className="p-2 bg-slate-800 hover:bg-green-600 hover:text-white rounded-lg text-slate-400 transition-colors" title="How To Video">
                    <Play size={18} />
                </button>
            </div>
        </div>
    </div>
);

const MealCard = ({ meal }: { meal: any }) => (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row gap-6 items-start md:items-center">
        <div className="flex-1">
            <span className="text-xs font-bold tracking-wider text-blue-400 uppercase mb-1 block">{meal.meal}</span>
            <h4 className="text-lg font-bold text-white mb-2">{meal.name}</h4>
            <ul className="text-sm text-slate-400 space-y-1 list-disc list-inside">
                {meal.items.map((item: string, idx: number) => <li key={idx}>{item}</li>)}
            </ul>
        </div>
        <div className="w-full md:w-auto flex gap-3">
            <div className="text-center px-4 py-2 bg-slate-950 rounded-xl border border-slate-800">
                <div className="text-xs text-slate-500 font-bold">CALORIES</div>
                <div className="text-lg font-bold text-white">{meal.calories}</div>
            </div>
            <div className="flex flex-col gap-1 text-xs text-slate-400">
                <div className="flex justify-between w-24"><span className="text-slate-500">Protein</span> <span className="text-white">{meal.protein}</span></div>
                <div className="flex justify-between w-24"><span className="text-slate-500">Carbs</span> <span className="text-white">{meal.carbs}</span></div>
                <div className="flex justify-between w-24"><span className="text-slate-500">Fats</span> <span className="text-white">{meal.fats}</span></div>
            </div>
        </div>
        <button className="w-full md:w-auto px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 text-sm font-medium transition-colors flex items-center justify-center gap-2">
            <ImageIcon size={16} /> <span className="md:hidden">See Food</span>
        </button>
    </div>
);


// --- 2. MAIN COMPONENT ---
export default function DashboardPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<"workout" | "diet" | "analysis">("workout");
    const [selectedDay, setSelectedDay] = useState(0);
    const [plan, setPlan] = useState<typeof MOCK_PLAN | null>(null);
    const [workoutScript, setWorkoutScript] = useState("");
    const [dietScript, setDietScript] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const initializePlan = async () => {
            setIsLoading(true);
            await new Promise(res => setTimeout(res, 1500)); // Simulate loading
            try {
                const stored = localStorage.getItem("fitnessPlan");
                const parsedPlan = stored ? JSON.parse(stored) : MOCK_PLAN;
                setPlan(parsedPlan);
                if (!stored) {
                    localStorage.setItem("fitnessPlan", JSON.stringify(MOCK_PLAN));
                }
                setWorkoutScript(createWorkoutScript(parsedPlan, selectedDay));
                setDietScript(createDietScript(parsedPlan));

                // Welcome message
                // generateVoiceAction(`Welcome back, ${parsedPlan.name}. Let's review your plan for today.`).catch(console.error);

            } catch (err) {
                console.error("Failed to load plan:", err);
                setPlan(MOCK_PLAN); // Fallback
            } finally {
                setIsLoading(false);
            }
        };

        initializePlan();
    }, []);


    useEffect(() => {
        if (plan) {
            setWorkoutScript(createWorkoutScript(plan, selectedDay));
        }
    }, [selectedDay, plan]);


    const ReadAloud = async (script: string) => {
        console.log('Generating audio for script:', script);
        try {
            const { success, audio, error } = await generateVoiceAction(script);
            if (success && audio) {
                const audioPlayer = new Audio(audio);
                audioPlayer.play();
            } else {
                console.error('Audio generation failed:', error);
            }
        } catch (error) {
            console.error('Failed to generate workout audio:', error);
        }
    }

    const handleGenerateNewPlan = () => {
        // localStorage.removeItem("fitnessPlan");
        router.push('/demo');
    }

    if (isLoading || !plan) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center text-white">
                <div className="flex flex-col items-center gap-4">
                    <Dumbbell className="animate-spin" size={48} />
                    <p className="text-lg text-slate-400">Generating your personalized plan...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-linear-to-b from-black to-slate-900 text-slate-200 pb-20 pt-16">

            <main className="max-w-5xl mx-auto px-4 py-8">

                {/* WELCOME & SUMMARY */}
                <section className="mb-8">
                    <div className="flex justify-between items-center mb-2">
                        <h2 className="text-3xl font-bold text-white mb-2">Ready to crush it, {plan.name}? 🚀</h2>
                        <button onClick={handleGenerateNewPlan} className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm font-medium transition-colors">
                            <RefreshCcw size={14} />
                            New Plan
                        </button>
                    </div>
                    <p className="text-slate-400 max-w-2xl">{plan.summary}</p>

                    {/* Stats Row */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                        <StatCard label="Focus" value={plan.focus} icon={Flame} color="text-orange-500" />
                        <StatCard label="Split" value={plan.split} icon={Calendar} color="text-blue-500" />
                        <StatCard label="Calories" value={`${plan.totalCalories.toLocaleString()} / day`} icon={Utensils} color="text-green-500" />
                        <StatCard label="Duration" value={plan.workoutDuration} icon={Clock} color="text-purple-500" />
                    </div>
                </section>

                {/* TABS NAVIGATION */}
                <div className="flex gap-2 mb-8 p-1 bg-slate-900/50 rounded-xl border border-slate-800 w-full md:w-fit">
                    <TabButton id="workout" label="Workout Plan" icon={Dumbbell} activeTab={activeTab} onClick={() => setActiveTab("workout")} />
                    <TabButton id="diet" label="Diet & Macros" icon={Utensils} activeTab={activeTab} onClick={() => setActiveTab("diet")} />
                    <TabButton id="analysis" label="AI Coach Tips" icon={Brain} activeTab={activeTab} onClick={() => setActiveTab("analysis")} />
                </div>

                {/* CONTENT AREA */}
                <AnimatePresence mode="wait">

                    {/* --- WORKOUT TAB --- */}
                    {activeTab === "workout" && (
                        <motion.div
                            key="workout"
                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                            className="space-y-6"
                        >
                            {/* Day Selector */}
                            <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                                {plan.workout.schedule.map((day, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedDay(index)}
                                        className={`whitespace-nowrap px-4 py-2 rounded-full border text-sm transition-all ${selectedDay === index
                                            ? "bg-white text-black border-white font-bold"
                                            : "bg-transparent text-slate-400 border-slate-700 hover:border-slate-500"
                                            }`}
                                    >
                                        {day.day}
                                    </button>
                                ))}
                            </div>

                            {/* Exercise List */}
                            <div className="grid gap-4">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-xl font-bold text-white">{plan.workout.schedule[selectedDay].day}</h3>
                                    <button className="text-xs flex items-center gap-1 text-blue-400 hover:underline" onClick={() => ReadAloud(workoutScript)}>
                                        <Volume2 size={14} /> Read Routine
                                    </button>
                                </div>

                                {plan.workout.schedule[selectedDay].exercises.map((ex, i) => (
                                    <ExerciseCard key={i} exercise={ex} />
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* --- DIET TAB --- */}
                    {activeTab === "diet" && (
                        <motion.div
                            key="diet"
                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                            className="space-y-4"
                        >
                            <div className="flex justify-between items-center">
                                <h3 className="text-xl font-bold text-white">Daily Meal Plan</h3>
                                <button className="text-xs flex items-center gap-1 text-green-400 hover:underline" onClick={() => ReadAloud(dietScript)}>
                                    <Volume2 size={14} /> Listen to Plan
                                </button>
                            </div>

                            {plan.diet.map((meal, i) => (
                                <MealCard key={i} meal={meal} />
                            ))}
                        </motion.div>
                    )}

                    {/* --- ANALYSIS TAB --- */}
                    {activeTab === "analysis" && (
                        <motion.div
                            key="analysis"
                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                            className="grid md:grid-cols-2 gap-6"
                        >
                            <div className="bg-linear-to-br from-slate-900 to-slate-900/50 border border-slate-800 p-6 rounded-2xl">
                                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                    <Flame className="text-orange-500" /> Daily Motivation
                                </h3>
                                <blockquote className="text-lg text-slate-300 italic border-l-4 border-orange-500 pl-4 py-2">
                                    "{plan.motivation}"
                                </blockquote>
                            </div>

                            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
                                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                    <Brain className="text-purple-500" /> Coach Tips
                                </h3>
                                <ul className="space-y-3">
                                    {plan.tips.map((tip: string, i: number) => (
                                        <li key={i} className="flex gap-3 text-slate-300">
                                            <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0" />
                                            {tip}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </motion.div>
                    )}

                </AnimatePresence>
            </main>
        </div>
    );
}