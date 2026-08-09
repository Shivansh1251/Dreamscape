import { useEffect, useRef, useState } from 'react';
import Globe from 'react-globe.gl';
import { useNavigate } from 'react-router-dom';
import { MapPin, Sparkles } from 'lucide-react';

type Country = { properties: { ADMIN: string } };

export function InteractiveGlobe() {
    const [countries, setCountries] = useState<{ features: Country[] }>({ features: [] });
    const [hoveredCountry, setHoveredCountry] = useState<Country | null>(null);
    const globeRef = useRef<any>();
    const navigate = useNavigate();

    useEffect(() => {
        fetch('https://raw.githubusercontent.com/vasturiano/react-globe.gl/master/example/datasets/ne_110m_admin_0_countries.geojson')
            .then((response) => response.json())
            .then((data) => setCountries(data))
            .catch(() => setCountries({ features: [] }));
    }, []);

    useEffect(() => {
        if (globeRef.current) {
            globeRef.current.controls().autoRotate = true;
            globeRef.current.controls().autoRotateSpeed = 0.5;
        }
    }, []);

    const openCountry = (country: Country | null) => {
        if (!country) return;
        const countryName = country.properties.ADMIN;
        navigate(countryName.toLowerCase() === 'spain' ? '/spain' : `/destination/${encodeURIComponent(countryName)}`);
    };

    return (
        <section className="relative flex w-full flex-col items-center justify-center overflow-hidden bg-[#edf7fa] py-20">
            <div className="relative z-10 px-4 text-center">
                <p className="mb-3 flex items-center justify-center gap-2 text-sm font-bold uppercase tracking-[0.2em] text-cyan-700"><Sparkles size={16} /> Explore by feeling</p>
                <h2 className="text-4xl font-black text-slate-900 md:text-5xl">Spin the <span className="text-cyan-700">Globe</span></h2>
                <p className="mt-4 text-lg font-medium text-slate-600">Click any country for its own travel guide, photos, food, and events.</p>
                <div className="mx-auto mt-6 flex max-w-3xl flex-wrap justify-center gap-3">{['Street food', 'Live music', 'Beach days', 'Hidden cafés'].map((idea) => <span key={idea} className="rounded-full bg-white px-4 py-2 text-sm font-bold text-slate-700 shadow-sm ring-1 ring-slate-200">{idea}</span>)}</div>
            </div>

            <div className="mt-4 cursor-pointer transition duration-1000 hover:scale-105">
                <Globe
                    ref={globeRef}
                    globeImageUrl="https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
                    bumpImageUrl="https://unpkg.com/three-globe/example/img/earth-topology.png"
                    polygonsData={countries.features}
                    polygonAltitude={(country: object) => country === hoveredCountry ? 0.12 : 0.04}
                    polygonCapColor={(country: object) => country === hoveredCountry ? 'rgba(6, 182, 212, 0.7)' : 'rgba(15, 23, 42, 0.17)'}
                    polygonSideColor={() => 'rgba(8, 145, 178, 0.22)'}
                    polygonStrokeColor={() => 'rgba(15, 23, 42, 0.45)'}
                    onPolygonHover={(country) => setHoveredCountry(country as Country | null)}
                    onPolygonClick={(country) => openCountry(country as Country)}
                    polygonsTransitionDuration={300}
                    width={window.innerWidth > 768 ? 800 : window.innerWidth - 20}
                    height={600}
                    backgroundColor="rgba(0,0,0,0)"
                />
            </div>

            {hoveredCountry && <div className="pointer-events-none absolute bottom-8 rounded-2xl border border-cyan-100 bg-white/95 px-5 py-3 text-lg font-bold text-slate-900 shadow-xl backdrop-blur-md"><span className="flex items-center gap-2"><MapPin size={19} className="text-cyan-700" /> Discover {hoveredCountry.properties.ADMIN}</span></div>}
        </section>
    );
}
