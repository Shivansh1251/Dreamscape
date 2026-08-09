import { FormEvent, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart, Menu, X, UserRound, LayoutDashboard, Map, Bot, Users, LogOut, Search } from "lucide-react";
import { AuthModal } from "./AuthModal";

interface NavbarProps { className?: string; }

export function Navbar({ className = "" }: NavbarProps) {
    const navigate = useNavigate();
    const [authOpen, setAuthOpen] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [user, setUser] = useState(localStorage.getItem('currentUser'));
    const [destination, setDestination] = useState('');

    useEffect(() => {
        const sync = () => setUser(localStorage.getItem('currentUser'));
        window.addEventListener('storage', sync);
        return () => window.removeEventListener('storage', sync);
    }, []);

    const avatar = user ? `https://ui-avatars.com/api/?name=${encodeURIComponent(user)}&background=176df5&color=fff&bold=true` : '';
    const logout = () => { localStorage.removeItem('currentUser'); setUser(null); setDrawerOpen(false); navigate('/login'); };
    const searchDestination = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const place = destination.trim();
        if (!place) return;
        navigate(place.toLowerCase() === 'spain' ? '/spain' : `/destination/${encodeURIComponent(place)}`);
        setDestination('');
    };

    return (
        <>
            <nav className={`absolute left-5 right-5 top-5 z-50 flex flex-col text-white ${className}`}>
                <ul className="mb-4 flex flex-row items-center justify-end">
                    <li className="mr-auto flex items-center"><Link to="/"><img className="max-h-[100px] max-w-[150px] p-2 opacity-90 md:max-h-[150px] md:max-w-[200px]" src="/Imgaes/Logo.png" alt="Dreamscape" /></Link></li>
                    <li className="mx-3 hidden flex-1 lg:block"><form onSubmit={searchDestination} className="mx-auto flex max-w-sm overflow-hidden rounded-full border border-white/30 bg-black/20 p-1 backdrop-blur-md"><input value={destination} onChange={(event) => setDestination(event.target.value)} placeholder="Search a destination" className="min-w-0 flex-1 bg-transparent px-4 py-2 text-sm text-white outline-none placeholder:text-white/70" /><button type="submit" aria-label="Search destination" className="rounded-full bg-white p-2 text-[#05203c] transition hover:bg-cyan-200"><Search size={17} /></button></form></li>
                    <li className="m-2 list-none"><button type="button" aria-label="Saved trips" onClick={() => navigate('/travel-plans')} className="group flex items-center justify-center rounded-full bg-black/10 p-2 text-white backdrop-blur-sm transition hover:bg-black/30 hover:text-[#de8d88]"><Heart size={24} className="transition group-hover:scale-110" /></button></li>
                    <li className="m-2 list-none">
                        {user ? <button type="button" onClick={() => setDrawerOpen(true)} aria-label="Open account menu" className="flex items-center rounded-full bg-black/20 p-1 backdrop-blur-sm"><img src={avatar} alt="Your avatar" className="h-10 w-10 rounded-full border-2 border-white/80" /></button> : <button type="button" onClick={() => setAuthOpen(true)} className="group flex items-center rounded-full bg-black/10 px-4 py-2 font-bold text-white backdrop-blur-sm transition hover:bg-black/30 hover:text-[#de8d88]"><UserRound size={20} className="mr-2 transition group-hover:scale-110" /> Log in</button>}
                    </li>
                    <li className="m-2 list-none"><button type="button" aria-label="Open menu" onClick={() => setDrawerOpen(true)} className="group flex items-center justify-center rounded-full bg-black/10 p-2 text-white backdrop-blur-sm transition hover:bg-black/30 hover:text-[#de8d88]"><Menu size={24} className="transition group-hover:scale-110" /></button></li>
                </ul>
            </nav>

            {authOpen && <AuthModal onClose={() => setAuthOpen(false)} onSuccess={(username) => { setUser(username); setAuthOpen(false); }} />}
            {drawerOpen && <div className="fixed inset-0 z-[90] bg-black/35 backdrop-blur-md" onClick={() => setDrawerOpen(false)}>
                <aside className="absolute right-0 top-0 flex h-full w-[min(340px,90vw)] flex-col bg-[#071524]/95 p-6 text-white shadow-2xl backdrop-blur-xl sm:p-7" onClick={(event) => event.stopPropagation()}>
                    <div className="mb-10 flex items-center justify-between"><span className="text-xl font-bold">Dreamscape menu</span><button type="button" aria-label="Close menu" onClick={() => setDrawerOpen(false)}><X /></button></div>
                    <div className="space-y-2">
                        <form onSubmit={(event) => { searchDestination(event); setDrawerOpen(false); }} className="mb-5 flex overflow-hidden rounded-xl border border-white/20 bg-white/10 p-1 lg:hidden"><input value={destination} onChange={(event) => setDestination(event.target.value)} placeholder="Search a destination" className="min-w-0 flex-1 bg-transparent px-3 py-2 text-white outline-none placeholder:text-white/60" /><button type="submit" aria-label="Search destination" className="rounded-lg bg-white p-2 text-[#071524]"><Search size={17} /></button></form>
                        <Link to="/dashboard" onClick={() => setDrawerOpen(false)} className="flex items-center gap-3 rounded-lg px-4 py-3 hover:bg-white/10"><LayoutDashboard size={19} /> Dashboard</Link>
                        <Link to="/travel-plans" onClick={() => setDrawerOpen(false)} className="flex items-center gap-3 rounded-lg px-4 py-3 hover:bg-white/10"><Map size={19} /> Travel Plans</Link>
                        <Link to="/ai-copilot" onClick={() => setDrawerOpen(false)} className="flex items-center gap-3 rounded-lg px-4 py-3 hover:bg-white/10"><Bot size={19} /> AI Copilot</Link>
                        <Link to="/roamies" onClick={() => setDrawerOpen(false)} className="flex items-center gap-3 rounded-lg px-4 py-3 hover:bg-white/10"><Users size={19} /> Roamies</Link>
                    </div>
                    <div className="mt-auto">{user ? <button type="button" onClick={logout} className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-red-300 hover:bg-red-500/10"><LogOut size={19} /> Log out</button> : <button type="button" onClick={() => { setDrawerOpen(false); setAuthOpen(true); }} className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold hover:bg-blue-700">Log in / Sign up</button>}</div>
                </aside>
            </div>}
        </>
    );
}
