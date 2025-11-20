import Link from "next/link";
import { Github, Twitter, Instagram } from "lucide-react";

const Footer = () => {
    return (
        <footer className="bg-slate-900 border-t border-slate-800 text-slate-400">
            <div className="container mx-auto max-w-[1100px] flex flex-col md:flex-row items-center justify-between py-6 px-4">
                <div className="text-center md:text-left mb-4 md:mb-0">
                    <p>&copy; {new Date().getFullYear()} MyFitnessCoach. All rights reserved.</p>
                    <p className="text-sm">Built with Next.js and Tailwind CSS</p>
                </div>
                <div className="flex gap-6">
                    <Link href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                        <Github className="h-6 w-6" />
                    </Link>
                    <Link href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                        <Twitter className="h-6 w-6" />
                    </Link>
                    <Link href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                        <Instagram className="h-6 w-6" />
                    </Link>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
