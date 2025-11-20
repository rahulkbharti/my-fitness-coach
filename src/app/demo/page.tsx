import UserDetailsForm from "@/components/forms/UserDetailsForm";

export default function DemoPage() {
    return (
        <main className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-4 relative overflow-hidden">

            {/* Background Ambient Light */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px]" />
            </div>

            <div className="z-10 text-center mb-8">
                <h1 className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-linear-to-r from-blue-400 to-purple-400">
                    Let's Build Your Plan
                </h1>
                <p className="text-slate-400">
                    Tell us about yourself so our AI can tailor a perfect routine.
                </p>
            </div>

            <div className="z-10 w-full">
                <UserDetailsForm />
            </div>
        </main>
    );
}