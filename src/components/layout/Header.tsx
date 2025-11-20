"use client";

import Link from "next/link";
import { Dumbbell } from "lucide-react";
import { useState } from "react";

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-black/70 backdrop-blur-lg ">
            <div className="mx-auto flex h-16 max-w-[1100px] items-center justify-between px-4">
                <Link href="/" className="flex items-center gap-2">
                    <Dumbbell className="h-8 w-8 text-blue-500" />
                    <span className="text-xl font-bold text-white">MyFitnessCoach</span>
                </Link>
                <nav className="hidden md:flex gap-6">
                    <Link href="/#features" className="text-slate-300 hover:text-white transition-colors">Features</Link>
                    <Link href="/pricing" className="text-slate-300 hover:text-white transition-colors">Pricing</Link>
                    <Link href="/blog" className="text-slate-300 hover:text-white transition-colors">Blog</Link>
                </nav>
                {/* Mobile Menu Button */}
                <button
                    className="md:hidden text-white"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    title="Open menu"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"} />
                    </svg>
                </button>
            </div>
            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-slate-900/80 backdrop-blur-lg">
                    <nav className="flex flex-col items-center gap-4 py-4">
                        <Link href="/#features" className="text-slate-300 hover:text-white transition-colors" onClick={() => setIsMenuOpen(false)}>Features</Link>
                        <Link href="/pricing" className="text-slate-300 hover:text-white transition-colors" onClick={() => setIsMenuOpen(false)}>Pricing</Link>
                        <Link href="/blog" className="text-slate-300 hover:text-white transition-colors" onClick={() => setIsMenuOpen(false)}>Blog</Link>
                    </nav>
                </div>
            )}
        </header>
    );
};

export default Header;
