import { ArrowUpRight, Coffee, Compass, UtensilsCrossed } from 'lucide-react';

const stories = [
    { title: 'A food-first weekend in a new city', type: 'Taste the world', icon: UtensilsCrossed, image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1000&q=80', text: 'How to find the dishes locals return for, from morning markets to one unforgettable dinner.' },
    { title: 'The art of building a slower itinerary', type: 'Travel smarter', icon: Compass, image: 'https://images.unsplash.com/photo-1488085061387-422e29b40080?auto=format&fit=crop&w=1000&q=80', text: 'Leave room for detours, small conversations, and the places you discover by accident.' },
    { title: 'Cafés worth planning a walk around', type: 'Local favourites', icon: Coffee, image: 'https://images.unsplash.com/photo-1445116572660-236099ec97a0?auto=format&fit=crop&w=1000&q=80', text: 'A simple guide to finding a great coffee, a good view, and a neighbourhood you will remember.' },
];

export function TravelJournal() {
    return <section id="Blogs" className="bg-[#f4f8fa] px-5 py-20 text-slate-900 sm:px-10">
        <div className="mx-auto max-w-7xl"><div className="mb-12 max-w-2xl"><p className="mb-3 text-sm font-bold uppercase tracking-[0.25em] text-cyan-700">Dreamscape journal</p><h2 className="text-4xl font-black leading-tight md:text-5xl">Travel stories for <span className="text-cyan-700">curious appetites.</span></h2><p className="mt-4 text-lg text-slate-600">Little guides to great meals, beautiful routes, and places that feel like a story.</p></div>
            <div className="grid gap-7 md:grid-cols-3">{stories.map(({ title, type, icon: Icon, image, text }) => <article key={title} className="group overflow-hidden rounded-3xl bg-white shadow-[0_12px_35px_rgba(15,23,42,0.09)] transition hover:-translate-y-1 hover:shadow-[0_20px_45px_rgba(15,23,42,0.14)]"><img src={image} alt="" loading="lazy" className="h-52 w-full object-cover transition duration-500 group-hover:scale-105" /><div className="p-6"><div className="mb-4 flex items-center gap-2 text-sm font-bold text-cyan-700"><Icon size={18} />{type}</div><h3 className="text-2xl font-bold">{title}</h3><p className="mt-3 leading-relaxed text-slate-600">{text}</p><button type="button" className="mt-5 flex items-center gap-2 font-bold text-slate-900 transition hover:text-cyan-700">Read story <ArrowUpRight size={18} /></button></div></article>)}</div>
        </div>
    </section>;
}
