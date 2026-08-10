import { useEffect, useRef, useState } from 'react';
import Globe from 'react-globe.gl';
import { Heart, MapPin, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type Country = { properties: { ADMIN: string } };
type TravelPost = { name: string; place: string; caption: string; photo: string; likes: number };
type FloatingPost = TravelPost & { id: number; position: string };

const posts: TravelPost[] = [
    { name: 'Maya', place: 'Goa', caption: 'Beach day 🏖️', photo: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=360&q=85', likes: 248 },
    { name: 'Arjun', place: 'Barcelona', caption: 'Live tonight 🎶', photo: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=360&q=85', likes: 179 },
    { name: 'Sofia', place: 'Rome', caption: 'Pasta break 🍝', photo: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=360&q=85', likes: 321 },
    { name: 'Neha', place: 'Kashmir', caption: 'Mountain mood ✨', photo: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=360&q=85', likes: 406 },
    { name: 'Leo', place: 'Lisbon', caption: 'Ocean glow 💛', photo: 'https://images.unsplash.com/photo-1484291470158-b8f8d608850d?auto=format&fit=crop&w=360&q=85', likes: 267 },
];
const positions = ['left-1 top-12', 'right-1 top-8', 'left-1 bottom-16', 'right-1 bottom-14'];

function Moment({ post }: { post: FloatingPost }) {
    return <article className={`absolute z-20 hidden animate-[fadein_500ms_ease-out] items-center gap-2 rounded-full border border-white/80 bg-white/80 py-1.5 pl-1.5 pr-3 shadow-[0_12px_28px_rgba(15,23,42,0.18)] backdrop-blur-md md:flex ${post.position}`}><img src={post.photo} alt={`${post.place} travel post`} className="h-12 w-12 rounded-full object-cover ring-2 ring-white" /><div><p className="flex items-center gap-1 text-xs font-black text-slate-900">{post.place} <Heart size={12} fill="currentColor" className="text-pink-500" /></p><p className="text-[11px] font-bold text-slate-600">{post.caption}</p></div></article>;
}

export function InteractiveGlobe() {
    const [countries, setCountries] = useState<{ features: Country[] }>({ features: [] });
    const [hoveredCountry, setHoveredCountry] = useState<Country | null>(null);
    const [globeWidth, setGlobeWidth] = useState(580);
    const [moments, setMoments] = useState<FloatingPost[]>([]);
    const globeRef = useRef<any>();
    const nextPost = useRef(0);
    const nextId = useRef(0);
    const navigate = useNavigate();

    useEffect(() => { fetch('https://raw.githubusercontent.com/vasturiano/react-globe.gl/master/example/datasets/ne_110m_admin_0_countries.geojson').then((response) => response.json()).then((data) => setCountries(data)).catch(() => setCountries({ features: [] })); }, []);
    useEffect(() => { const resize = () => setGlobeWidth(Math.min(580, Math.max(290, window.innerWidth - 48))); resize(); window.addEventListener('resize', resize); return () => window.removeEventListener('resize', resize); }, []);
    useEffect(() => { if (globeRef.current) { globeRef.current.controls().autoRotate = true; globeRef.current.controls().autoRotateSpeed = 0.35; globeRef.current.controls().enableRotate = true; } }, []);
    useEffect(() => {
        const addMoment = () => {
            const id = nextId.current++; const post = posts[nextPost.current++ % posts.length];
            const moment = { ...post, id, position: positions[id % positions.length] };
            setMoments((current) => [...current.slice(-3), moment]);
            window.setTimeout(() => setMoments((current) => current.filter((item) => item.id !== id)), 10500);
        };
        addMoment(); const interval = window.setInterval(addMoment, 2800); return () => window.clearInterval(interval);
    }, []);

    return <section className="relative overflow-hidden bg-[#edf7fa] py-14 sm:py-16"><div className="relative z-10 px-4 text-center"><p className="flex items-center justify-center gap-2 text-sm font-bold uppercase tracking-[0.2em] text-cyan-700"><Sparkles size={16} /> Spin &amp; discover</p><h2 className="mt-2 text-4xl font-black text-slate-900 md:text-5xl">Spin the <span className="text-cyan-700">Globe</span></h2><div className="mx-auto mt-5 flex max-w-3xl flex-wrap justify-center gap-2">{['🍜 Food', '🎶 Music', '🏖️ Beach', '💛 Vibes'].map((idea) => <span key={idea} className="rounded-full bg-white px-4 py-2 text-sm font-bold text-slate-700 shadow-sm ring-1 ring-slate-200">{idea}</span>)}</div></div>
        <div className="relative mx-auto mt-3 flex min-h-[520px] max-w-[1100px] items-center justify-center px-4 md:px-24">{moments.map((post) => <Moment key={post.id} post={post} />)}<div className="cursor-pointer transition duration-700 hover:scale-[1.02]"><Globe ref={globeRef} globeImageUrl="https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg" bumpImageUrl="https://unpkg.com/three-globe/example/img/earth-topology.png" polygonsData={countries.features} polygonAltitude={(country: object) => country === hoveredCountry ? 0.12 : 0.04} polygonCapColor={(country: object) => country === hoveredCountry ? 'rgba(6, 182, 212, 0.7)' : 'rgba(15, 23, 42, 0.17)'} polygonSideColor={() => 'rgba(8, 145, 178, 0.22)'} polygonStrokeColor={() => 'rgba(15, 23, 42, 0.45)'} onPolygonHover={(country) => setHoveredCountry(country as Country | null)} onPolygonClick={(country) => { const selected = country as Country; if (selected) navigate(`/destination/${encodeURIComponent(selected.properties.ADMIN)}`); }} polygonsTransitionDuration={300} width={globeWidth} height={globeWidth} backgroundColor="rgba(0,0,0,0)" /></div></div>
        {hoveredCountry && <div className="pointer-events-none absolute bottom-7 left-1/2 z-30 -translate-x-1/2 rounded-2xl border border-cyan-100 bg-white/95 px-5 py-3 text-lg font-bold text-slate-900 shadow-xl backdrop-blur-md"><span className="flex items-center gap-2"><MapPin size={19} className="text-cyan-700" /> Discover {hoveredCountry.properties.ADMIN}</span></div>}
    </section>;
}
