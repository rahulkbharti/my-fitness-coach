import Link from "next/link";
import { ArrowRight, Dumbbell, Utensils, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
// import { google } from '@ai-sdk/google';
// import { experimental_generateImage as generateImage } from 'ai';
// import { generateVoiceAction } from "@/actions/generateVoice";


// const { image } = await generateImage({
//   model: google.image('gemini-2.5-pro'),
//   prompt: 'A futuristic cityscape at sunset',
//   aspectRatio: '16:9',
// });

// console.log('Generated Image URL:', image);



export default function Home() {


  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-linear-to-b from-black to-slate-900 text-white">

      {/* --- HERO SECTION --- */}
      <section className="container mx-auto max-w-[1100px] flex flex-col items-center text-center py-24 px-4">
        <div className="mb-6 inline-flex items-center rounded-full border border-slate-700 bg-slate-800/50 px-3 py-1 text-sm text-slate-300 backdrop-blur-xl">
          <span className="mr-2 flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          Powered by GPT-4o & Gemini
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparentbg-linear-to-rfrom-blue-400 via-purple-500 to-pink-500">
          The Future of Fitness <br /> is Personalized.
        </h1>

        <p className="max-w-2xl text-lg text-slate-400 mb-10">
          Generate a completely unique workout and meal plan based on your biometrics,
          equipment, and dietary preferences. No generic PDFs.
        </p>

        <div className="flex gap-4">
          <Link href="/generate">
            <Button size="lg" className="text-lg h-14 px-8 rounded-full bg-linear-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg shadow-purple-500/50 hover:shadow-xl hover:shadow-purple-500/70 transition-all flex items-center">
              Build My Plan <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Link href="/demo">
            <Button size="lg" variant="outline" className="text-lg h-14 px-8 rounded-full border-2 border-slate-600 bg-transparent hover:bg-slate-800 hover:border-slate-500 transition-all">
              View Demo
            </Button>
          </Link>

        </div>
      </section>

      {/* --- FEATURE GRID (Glassmorphism) --- */}
      <section className="container mx-auto max-w-[1100px] py-12 px-4 grid md:grid-cols-3 gap-6">
        {/* Feature 1 */}
        <div className="p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg hover:border-blue-500/50 transition-all">
          <div className="h-12 w-12 rounded-lg bg-blue-500/20 flex items-center justify-center mb-4">
            <Dumbbell className="h-6 w-6 text-blue-400" />
          </div>
          <h3 className="text-xl font-bold mb-2">Custom Workouts</h3>
          <p className="text-slate-400">Sets, reps, and rest times tailored to your specific gym equipment.</p>
        </div>

        {/* Feature 2 */}
        <div className="p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg hover:border-purple-500/50 transition-all">
          <div className="h-12 w-12 rounded-lg bg-purple-500/20 flex items-center justify-center mb-4">
            <Utensils className="h-6 w-6 text-purple-400" />
          </div>
          <h3 className="text-xl font-bold mb-2">Diet Mechanics</h3>
          <p className="text-slate-400">Keto, Vegan, or Bulking? We calculate the macros so you don&apos;t have to.</p>
        </div>

        {/* Feature 3 */}
        <div className="p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg hover:border-pink-500/50 transition-all">
          <div className="h-12 w-12 rounded-lg bg-pink-500/20 flex items-center justify-center mb-4">
            <Sparkles className="h-6 w-6 text-pink-400" />
          </div>
          <h3 className="text-xl font-bold mb-2">AI Visualization</h3>
          <p className="text-slate-400">Don&apos;t know the exercise? We generate a visual reference instantly.</p>
        </div>
      </section>

    </main>
  );
}