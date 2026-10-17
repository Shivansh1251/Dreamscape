import { useEffect, useRef, useState } from 'react';
import Globe from 'react-globe.gl';
import { MapPin, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type Country = { properties: { ADMIN: string } };

export function InteractiveGlobe() {
    const [countries, setCountries] = useState<{ features: Country[] }>({ features: [] });
    const [hoveredCountry, setHoveredCountry] = useState<Country | null>(null);
    const [globeWidth, setGlobeWidth] = useState(580);
    const globeRef = useRef<any>();
    const navigate = useNavigate();

    useEffect(() => {
        const controller = new AbortController();
        fetch('/globe/ne_110m_admin_0_countries.geojson', { signal: controller.signal })
            .then((response) => {
                if (!response.ok) throw new Error(`Country data request failed: ${response.status}`);
                return response.json();
            })
            .then((data) => setCountries(data))
            .catch((error: unknown) => {
                if (error instanceof DOMException && error.name === 'AbortError') return;
                setCountries({ features: [] });
            });

        return () => controller.abort();
    }, []);

    useEffect(() => {
        const resize = () => setGlobeWidth(Math.min(580, Math.max(290, window.innerWidth - 48)));
        resize();
        window.addEventListener('resize', resize);
        return () => window.removeEventListener('resize', resize);
    }, []);

    const configureControls = () => {
        const controls = globeRef.current?.controls();
        if (!controls) return;
        controls.autoRotate = true;
        controls.autoRotateSpeed = 0.35;
        controls.enableRotate = true;
        controls.enablePan = false;
    };

    return (
        <section className="relative overflow-hidden bg-[#edf7fa] py-14 sm:py-16">
            <div className="relative z-10 px-4 text-center">
                <p className="flex items-center justify-center gap-2 text-sm font-bold uppercase tracking-[0.2em] text-cyan-700">
                    <Sparkles size={16} /> Spin &amp; discover
                </p>
                <h2 className="mt-2 text-4xl font-black text-slate-900 md:text-5xl">
                    Spin the <span className="text-cyan-700">Globe</span>
                </h2>
            </div>

            <div className="relative mx-auto mt-3 flex min-h-[520px] max-w-[1100px] items-center justify-center px-4 md:px-24">
                <div className="cursor-pointer transition duration-700 hover:scale-[1.02]">
                    <Globe
                        ref={globeRef}
                        globeImageUrl="/globe/earth-day.jpg"
                        bumpImageUrl="/globe/earth-topology.png"
                        onGlobeReady={configureControls}
                        polygonsData={countries.features}
                        polygonAltitude={(country: object) => country === hoveredCountry ? 0.12 : 0.04}
                        polygonCapColor={(country: object) => country === hoveredCountry ? 'rgba(6, 182, 212, 0.7)' : 'rgba(15, 23, 42, 0.17)'}
                        polygonSideColor={() => 'rgba(8, 145, 178, 0.22)'}
                        polygonStrokeColor={() => 'rgba(15, 23, 42, 0.45)'}
                        onPolygonHover={(country) => setHoveredCountry(country as Country | null)}
                        onPolygonClick={(country) => {
                            const selected = country as Country;
                            if (selected) navigate(`/destination/${encodeURIComponent(selected.properties.ADMIN)}`);
                        }}
                        polygonsTransitionDuration={300}
                        width={globeWidth}
                        height={globeWidth}
                        backgroundColor="rgba(0,0,0,0)"
                        showAtmosphere
                        atmosphereColor="#38bdf8"
                        atmosphereAltitude={0.12}
                    />
                </div>
            </div>

            {hoveredCountry && (
                <div className="pointer-events-none absolute bottom-7 left-1/2 z-30 -translate-x-1/2 rounded-2xl border border-cyan-100 bg-white/95 px-5 py-3 text-lg font-bold text-slate-900 shadow-xl backdrop-blur-md">
                    <span className="flex items-center gap-2">
                        <MapPin size={19} className="text-cyan-700" /> Discover {hoveredCountry.properties.ADMIN}
                    </span>
                </div>
            )}
        </section>
    );
}
