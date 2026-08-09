import { useEffect, useState, useRef } from 'react';
import Globe from 'react-globe.gl';
import { useNavigate } from 'react-router-dom';

export function InteractiveGlobe() {
    const [countries, setCountries] = useState({ features: [] });
    const [hoverD, setHoverD] = useState<any>(null);
    const globeRef = useRef<any>();
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch country polygon data
        fetch('https://raw.githubusercontent.com/vasturiano/react-globe.gl/master/example/datasets/ne_110m_admin_0_countries.geojson')
            .then(res => res.json())
            .then(data => {
                setCountries(data);
            });
    }, []);

    useEffect(() => {
        // Auto-rotate the globe slowly
        if (globeRef.current) {
            globeRef.current.controls().autoRotate = true;
            globeRef.current.controls().autoRotateSpeed = 0.5;
        }
    }, [globeRef.current]);

    const handlePolygonClick = (polygon: any) => {
        if (!polygon) return;
        const countryName = polygon.properties.ADMIN;

        // Smooth transition camera to the country
        // Let's jump to the Spain page if they click Spain, or just travel-plans for others
        if (countryName.toLowerCase() === 'spain') {
            navigate('/spain');
        } else {
            // General redirect for all other clicked countries
            navigate('/travel-plans');
        }
    };

    return (
        <div className="w-full flex flex-col items-center justify-center bg-[#05203c] py-20 overflow-hidden relative">
            <div className="absolute top-10 text-center z-10 pointer-events-none px-4">
                <h2 className="text-4xl md:text-5xl font-black text-white drop-shadow-2xl">
                    Spin the <span className="text-cyan-400">Globe</span>
                </h2>
                <p className="mt-4 text-gray-300 text-lg font-medium">Click on any country to discover your next adventure!</p>
                <p className="mt-2 text-sm text-cyan-200">(Try clicking Spain)</p>
            </div>

            <div className="cursor-pointer hover:scale-105 transition duration-1000 mt-[50px]">
                <Globe
                    ref={globeRef}
                    globeImageUrl="https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
                    bumpImageUrl="https://unpkg.com/three-globe/example/img/earth-topology.png"
                    polygonsData={countries.features}
                    polygonAltitude={(d: any) => (d === hoverD ? 0.12 : 0.04)}
                    polygonCapColor={(d: any) => (d === hoverD ? 'rgba(0, 255, 255, 0.5)' : 'rgba(255, 255, 255, 0.1)')}
                    polygonSideColor={() => 'rgba(0, 100, 255, 0.15)'}
                    polygonStrokeColor={() => '#111'}
                    onPolygonHover={setHoverD}
                    onPolygonClick={handlePolygonClick}
                    polygonsTransitionDuration={300}
                    width={window.innerWidth > 768 ? 800 : window.innerWidth - 20}
                    height={600}
                    backgroundColor="rgba(0,0,0,0)"
                />
            </div>

            {hoverD && (
                <div className="absolute bottom-10 bg-black/60 backdrop-blur-md px-6 py-3 rounded-full text-white font-bold text-xl pointer-events-none shadow-2xl border border-white/20">
                    📍 {hoverD.properties.ADMIN}
                </div>
            )}
        </div>
    );
}
