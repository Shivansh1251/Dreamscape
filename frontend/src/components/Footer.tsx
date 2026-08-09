import { Link } from 'react-router-dom';
import { Facebook, Instagram, Youtube, Twitter, Music2, Pin } from 'lucide-react';

interface FooterProps { connected?: boolean; }

export function Footer({ connected = false }: FooterProps) {
    return (
        <footer className={`relative z-20 min-h-[400px] bg-black px-10 pb-8 text-white ${connected ? '-mt-14 pt-28' : 'pt-16'}`} style={connected ? { clipPath: 'polygon(0 3.5rem, 100% 0, 100% 100%, 0 100%)' } : undefined}>
            <div className="mx-auto flex max-w-7xl flex-wrap justify-between gap-10">
                <div className="flex flex-col gap-3"><div className="mb-2 text-xl font-bold">Follow Us On</div><div className="flex gap-4">
                    <a aria-label="Facebook" href="https://www.facebook.com" target="_blank" rel="noreferrer" className="transition hover:text-cyan-400"><Facebook /></a>
                    <a aria-label="X" href="https://www.x.com" target="_blank" rel="noreferrer" className="transition hover:text-cyan-400"><Twitter /></a>
                    <a aria-label="Instagram" href="https://www.instagram.com" target="_blank" rel="noreferrer" className="transition hover:text-cyan-400"><Instagram /></a>
                    <a aria-label="YouTube" href="https://www.youtube.com" target="_blank" rel="noreferrer" className="transition hover:text-cyan-400"><Youtube /></a>
                    <a aria-label="Pinterest" href="https://www.pinterest.com" target="_blank" rel="noreferrer" className="transition hover:text-cyan-400"><Pin /></a>
                    <a aria-label="TikTok" href="https://www.tiktok.com" target="_blank" rel="noreferrer" className="transition hover:text-cyan-400"><Music2 /></a>
                </div></div>
                <div className="flex flex-col gap-2"><div className="mb-2 text-lg font-bold">Accommodation</div><a href="#" className="hover:text-cyan-400">Hostels</a><a href="#" className="hover:text-cyan-400">Hotels</a><a href="#" className="hover:text-cyan-400">Bed and Breakfast</a></div>
                <div className="flex flex-col gap-2"><div className="mb-2 text-lg font-bold">Quick Links</div><a href="#Blogs" className="hover:text-cyan-400">Blogs</a><Link to="/roamies" className="hover:text-cyan-400">Tours &amp; Experiences</Link><a href="#" className="hover:text-cyan-400">Student Discount</a><a href="#" className="hover:text-cyan-400">Solo Travel</a></div>
                <div className="flex flex-col gap-2"><div className="mb-2 text-lg font-bold">About Us</div><Link to="/" className="hover:text-cyan-400">Dreamscape.co.ltd</Link><a href="#" className="hover:text-cyan-400">Careers</a><a href="#" className="hover:text-cyan-400">Press</a></div>
                <div className="flex flex-col gap-2"><div className="mb-2 text-lg font-bold">Customer Support</div><a href="#" className="hover:text-cyan-400">Talk to us</a><a href="#" className="hover:text-cyan-400">Help</a><a href="#" className="hover:text-cyan-400">Contact</a></div>
            </div>
            <div className="mx-auto mt-10 flex w-full max-w-7xl flex-wrap justify-between gap-4 border-t border-gray-800 pt-8 text-sm font-medium"><div>© 2024 DreamscapeWorld.com</div><div className="flex flex-wrap gap-4"><a href="#" className="text-gray-400 hover:text-white">Terms &amp; Legal</a><a href="#" className="text-gray-400 hover:text-white">Vouchers</a><a href="#" className="text-gray-400 hover:text-white">Coupons</a><a href="#" className="text-gray-400 hover:text-white">Site Map</a><a href="#" className="text-gray-400 hover:text-white">Cookie Preferences</a></div></div>
        </footer>
    );
}
