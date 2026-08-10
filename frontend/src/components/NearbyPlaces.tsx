import { useEffect, useState } from 'react';
import { Building2, Coffee, ExternalLink, Landmark, LoaderCircle, MapPin, UtensilsCrossed } from 'lucide-react';
import { apiUrl } from '../lib/api';

type Place = { name: string; address: string; lat: number; lon: number; website?: string; mapUrl: string; category: string; stars?: string; cuisine?: string; rating?: number; popularity?: number; photo?: { url: string; photographer?: string; photographerUrl?: string } };
type PlaceGroups = Record<'hotels' | 'restaurants' | 'cafes' | 'attractions' | 'mustSee', Place[]>;
type PlacesResponse = { location: string; center: { lat: number; lon: number }; groups: PlaceGroups };

const categories = [
    { id: 'hotels', label: 'Hotels', icon: Building2 },
    { id: 'restaurants', label: 'Restaurants', icon: UtensilsCrossed },
    { id: 'cafes', label: 'Cafes', icon: Coffee },
    { id: 'attractions', label: 'Places', icon: Landmark },
    { id: 'mustSee', label: 'Must see', icon: Landmark },
] as const;

export function NearbyPlaces({ location }: { location: string }) {
    const [data, setData] = useState<PlacesResponse | null>(null);
    const [active, setActive] = useState<keyof PlaceGroups>('restaurants');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        let mounted = true;
        setLoading(true); setError(''); setData(null);
        fetch(apiUrl(`/api/places?location=${encodeURIComponent(location)}`))
            .then(async (response) => {
                const payload = await response.json() as PlacesResponse & { error?: string };
                if (!response.ok) throw new Error(payload.error || 'Nearby places could not be loaded');
                return payload;
            })
            .then((payload) => mounted && setData(payload))
            .catch((requestError: Error) => mounted && setError(requestError.message))
            .finally(() => mounted && setLoading(false));
        return () => { mounted = false; };
    }, [location]);

    const places = data?.groups[active] || [];
    return <section className="bg-[#f0f9fb] px-6 py-20">
        <div className="mx-auto max-w-7xl">
            <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div><p className="mb-3 text-sm font-bold uppercase tracking-[0.22em] text-cyan-700">Real places nearby</p><h2 className="text-4xl font-black text-slate-900">Explore {location} like a local</h2><p className="mt-3 max-w-2xl text-lg text-slate-600">Famous hotels, restaurants, and must-see places are ranked by Foursquare popularity; Geoapify fills the rest.</p></div>
                {data && <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${data.center.lat},${data.center.lon}`)}`} target="_blank" rel="noreferrer" className="inline-flex w-fit items-center gap-2 font-bold text-cyan-800 hover:text-cyan-600">View area on map <ExternalLink size={16} /></a>}
            </div>
            <div className="mb-8 flex flex-wrap gap-3">{categories.map(({ id, label, icon: Icon }) => <button key={id} type="button" onClick={() => setActive(id)} className={`inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-bold transition ${active === id ? 'bg-slate-900 text-white shadow-lg' : 'bg-white text-slate-700 hover:bg-cyan-50'}`}><Icon size={17} />{label}</button>)}</div>
            {loading && <div className="flex min-h-44 items-center justify-center text-cyan-700"><LoaderCircle className="animate-spin" size={32} /></div>}
            {!loading && error && <div className="rounded-3xl bg-white p-7 text-slate-600 shadow-sm">{error}. Please check the Geoapify API key and try again.</div>}
            {!loading && !error && !places.length && <div className="rounded-3xl bg-white p-7 text-slate-600 shadow-sm">No nearby {active} were found for this area yet.</div>}
            {!loading && !error && places.length > 0 && <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{places.map((place) => <article key={`${place.name}-${place.lat}-${place.lon}`} className="flex min-h-64 flex-col overflow-hidden rounded-3xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">{place.photo?.url && <img src={place.photo.url} alt={`${place.name} in ${location}`} loading="lazy" className="h-36 w-full object-cover" />}<div className="flex flex-1 flex-col p-6"><div className="mb-4 flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-100 text-cyan-800"><MapPin size={20} /></div><h3 className="text-xl font-black text-slate-900">{place.name}</h3>{(place.rating !== undefined || place.stars || place.cuisine) && <p className="mt-1 text-sm font-bold text-amber-600">{place.rating !== undefined ? `★ ${place.rating.toFixed(1)} Foursquare` : place.stars ? `${place.stars}-star stay` : place.cuisine}</p>}<p className="mt-2 flex-1 text-sm leading-relaxed text-slate-500">{place.address}</p><div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-sm font-bold"><a href={place.mapUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-cyan-800 hover:text-cyan-600">Map <ExternalLink size={14} /></a>{place.website && <a href={place.website} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-slate-700 hover:text-cyan-700">Website <ExternalLink size={14} /></a>}</div>{place.photo?.photographer && place.photo.photographerUrl && <a href={`${place.photo.photographerUrl}?utm_source=dreamscapes&utm_medium=referral`} target="_blank" rel="noreferrer" className="mt-3 text-xs text-slate-400 hover:text-cyan-700">Photo by {place.photo.photographer} on Unsplash</a>}</div></article>)}</div>}
        </div>
    </section>;
}
