import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CalendarDays, ExternalLink, MapPin, Music2, PartyPopper, Sparkles, UtensilsCrossed } from 'lucide-react';
import { PageLayout } from '../components/PageLayout';
import { getDestinationGuide } from '../data/destinationGuide';

type DestinationImage = { url: string; alt: string; photographer?: string; photographerUrl?: string };
type DestinationMedia = { video: string; images: DestinationImage[] };
const FALLBACK_VIDEO = 'https://videos.pexels.com/video-files/4525107/4525107-uhd_2560_1440_24fps.mp4';

export function Destination() {
    const { name } = useParams<{ name: string }>();
    const [media, setMedia] = useState<DestinationMedia | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const displayName = name ? decodeURIComponent(name).split(/[-\s]+/).map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(' ') : 'Destination';
    const guide = useMemo(() => getDestinationGuide(displayName), [displayName]);
    const eventsLink = `https://www.google.com/search?q=${encodeURIComponent(`${displayName} upcoming concerts festivals live music`)}`;
    const goodNewsLink = `https://news.google.com/search?q=${encodeURIComponent(`${displayName} positive local news culture food`)}`;

    useEffect(() => {
        let active = true;
        setLoading(true); setError(false);
        fetch(`/api/media?location=${encodeURIComponent(displayName)}`)
            .then((response) => { if (!response.ok) throw new Error('Media request failed'); return response.json() as Promise<DestinationMedia>; })
            .then((data) => active && setMedia(data))
            .catch((requestError) => { console.error('Failed to load destination media:', requestError); if (active) setError(true); })
            .finally(() => active && setLoading(false));
        return () => { active = false; };
    }, [displayName]);

    const heroContent = <h1 className="relative z-10 mb-8 flex flex-col items-center justify-center gap-4 bg-gradient-to-r from-white via-cyan-200 to-white bg-clip-text pb-2 text-5xl font-black text-transparent md:text-7xl" style={{ textShadow: '0 4px 20px rgba(0,0,0,0.5)' }}><span className="text-2xl uppercase tracking-[10px] text-cyan-300 md:text-4xl">Discover</span>{displayName}</h1>;

    return <PageLayout videoSrc={media?.video || FALLBACK_VIDEO} videoOverlayText={heroContent} showFooter>
        <div className="min-h-screen bg-[#f7fafb] text-slate-800">
            <section className="px-6 py-20"><div className="mx-auto max-w-7xl"><div className="mb-16 text-center"><p className="mb-3 text-sm font-bold uppercase tracking-[0.22em] text-cyan-700">Visual guide</p><h2 className="text-4xl font-black text-slate-900 md:text-5xl">A glimpse of <span className="border-b-4 border-cyan-400 pb-1 text-cyan-600">{displayName}</span></h2><p className="mt-4 text-lg font-medium text-slate-500">Photos from Unsplash. The hero video behind the navbar is selected from Pexels.</p></div>
                {loading && <div className="flex items-center justify-center py-20"><div className="h-16 w-16 animate-spin rounded-full border-8 border-cyan-200 border-t-cyan-500" /></div>}
                {!loading && media?.images?.length ? <div className="grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3">{media.images.map((image) => <figure key={image.url} className="group relative h-[330px] overflow-hidden rounded-3xl bg-gray-200 shadow-xl"><img src={image.url} alt={image.alt} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-110" /><figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent px-6 pb-6 pt-16 text-white opacity-0 transition group-hover:opacity-100"><p className="flex items-center gap-2 text-xl font-bold"><MapPin size={19} /> {displayName}</p>{image.photographer && image.photographerUrl && <a href={image.photographerUrl} target="_blank" rel="noreferrer" className="mt-1 inline-block text-sm text-white/90 underline">Photo by {image.photographer} on Unsplash</a>}</figcaption></figure>)}</div> : !loading && <p className="py-10 text-center text-xl font-bold text-slate-500">{error ? 'Media could not be loaded right now. Please try again shortly.' : 'No images are available for this location yet.'}</p>}
            </div></section>

            <section className="bg-white px-6 py-20"><div className="mx-auto max-w-7xl"><div className="mb-12 max-w-3xl"><p className="mb-3 text-sm font-bold uppercase tracking-[0.22em] text-cyan-700">More than a view</p><h2 className="text-4xl font-black text-slate-900">What makes {displayName} unforgettable</h2><p className="mt-4 text-lg text-slate-600">Build your trip around the tastes, sounds, and small moments that give a place its character.</p></div><div className="grid gap-6 md:grid-cols-3">{guide.famousFor.map((item) => <div key={item} className="rounded-3xl border border-slate-100 bg-[#f6fbfc] p-7 shadow-sm"><span className="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-100 text-cyan-800"><Sparkles size={22} /></span><p className="text-xl font-bold">{item}</p><p className="mt-3 text-slate-600">A beautiful reason to slow down and make space for this part of your itinerary.</p></div>)}</div></div></section>

            <section className="px-6 py-20"><div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-2"><div className="rounded-3xl bg-[#0e2d3b] p-8 text-white"><span className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-400/20 text-cyan-200"><Music2 /></span><h2 className="text-3xl font-black">Shows, culture &amp; performance</h2><p className="mt-4 text-lg leading-relaxed text-slate-200">{guide.culture}</p><a href={eventsLink} target="_blank" rel="noreferrer" className="mt-7 inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 font-bold text-slate-900 transition hover:bg-cyan-300"><CalendarDays size={18} /> See current concerts &amp; events <ExternalLink size={16} /></a></div><div className="rounded-3xl bg-[#fff2e7] p-8 text-slate-900"><span className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-200 text-orange-800"><UtensilsCrossed /></span><h2 className="text-3xl font-black">Eat like you are local</h2><ul className="mt-5 space-y-3 text-lg text-slate-700">{guide.food.map((food) => <li key={food} className="flex gap-3"><span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-orange-500" />{food}</li>)}</ul><p className="mt-6 font-semibold text-slate-700">Restaurant ideas</p><ul className="mt-3 space-y-2 text-slate-600">{guide.restaurants.map((restaurant) => <li key={restaurant}>{restaurant}</li>)}</ul></div></div></section>

            <section className="bg-[#e8f5f8] px-6 py-20"><div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.2fr_0.8fr]"><div><p className="mb-3 text-sm font-bold uppercase tracking-[0.22em] text-cyan-700">After dark</p><h2 className="text-4xl font-black text-slate-900">The party, but on your terms.</h2><p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-600">{guide.nightlife}</p><div className="mt-8 flex flex-wrap gap-3"><span className="rounded-full bg-white px-4 py-2 font-bold text-slate-700 shadow-sm">Rooftops</span><span className="rounded-full bg-white px-4 py-2 font-bold text-slate-700 shadow-sm">Live bands</span><span className="rounded-full bg-white px-4 py-2 font-bold text-slate-700 shadow-sm">Local DJs</span></div></div><div className="rounded-3xl bg-white p-8 shadow-sm"><PartyPopper className="mb-5 text-cyan-700" size={30} /><h3 className="text-2xl font-black">Positive local pulse</h3><p className="mt-3 leading-relaxed text-slate-600">Keep it current: explore positive local culture, food, and community stories before you travel.</p><a href={goodNewsLink} target="_blank" rel="noreferrer" className="mt-6 inline-flex items-center gap-2 font-bold text-cyan-800 hover:text-cyan-600">Open latest local stories <ExternalLink size={16} /></a></div></div></section>
        </div>
    </PageLayout>;
}
