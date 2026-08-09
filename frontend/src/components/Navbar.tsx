import { Link } from "react-router-dom";
import { Heart, User, Menu } from "lucide-react";

interface NavbarProps {
    className?: string; // allow overrides
}

export function Navbar({ className = "" }: NavbarProps) {
    return (
        <nav className={`absolute top-5 left-5 right-5 flex flex-col text-white z-50 ${className}`}>
            <ul className="flex flex-row justify-end items-center mb-4">
                <li className="mr-auto flex items-center">
                    <Link to="/">
                        <img className="max-w-[150px] md:max-w-[200px] max-h-[100px] md:max-h-[150px] opacity-90 p-2" src="/Imgaes/Logo.png" alt="Dreamscape" />
                    </Link>
                </li>
                <li className="m-2 list-none">
                    <button className="text-white hover:text-[#de8d88] transition group flex items-center justify-center p-2 rounded-full bg-black/10 hover:bg-black/30 backdrop-blur-sm">
                        <Heart size={24} className="group-hover:scale-110 transition" />
                    </button>
                </li>
                <li className="m-2 list-none">
                    <Link to="/login" className="flex items-center text-white hover:text-[#de8d88] transition font-bold px-4 py-2 rounded-full bg-black/10 hover:bg-black/30 backdrop-blur-sm group">
                        <User size={20} className="mr-2 group-hover:scale-110 transition" /> Log in
                    </Link>
                </li>
                <li className="m-2 list-none">
                    <button className="text-white hover:text-[#de8d88] transition group flex items-center justify-center p-2 rounded-full bg-black/10 hover:bg-black/30 backdrop-blur-sm">
                        <Menu size={24} className="group-hover:scale-110 transition" />
                    </button>
                </li>
            </ul>
        </nav>
    );
}
