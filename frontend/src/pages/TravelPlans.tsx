import { useState, useEffect } from 'react';
import { Plane, Clock, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { PageLayout } from '../components/PageLayout';

interface Flight {
    flightNumber: string;
    departure: string;
    arrival: string;
    status: 'On Time' | 'Delayed' | 'Cancelled';
}

const MOCK_FLIGHTS: Flight[] = [
    { flightNumber: 'AA101', departure: '10:00 AM', arrival: '2:00 PM', status: 'On Time' },
    { flightNumber: 'DL203', departure: '11:30 AM', arrival: '3:30 PM', status: 'Delayed' },
    { flightNumber: 'UA305', departure: '12:45 PM', arrival: '4:45 PM', status: 'Cancelled' },
    { flightNumber: 'BA412', departure: '2:15 PM', arrival: '6:15 PM', status: 'On Time' },
    { flightNumber: 'EK788', departure: '4:30 PM', arrival: '11:30 PM', status: 'On Time' },
];

const statusIcon = (status: Flight['status']) => {
    if (status === 'On Time') return <CheckCircle size={14} className="text-green-500" />;
    if (status === 'Delayed') return <AlertTriangle size={14} className="text-yellow-400" />;
    return <XCircle size={14} className="text-red-500" />;
};

const statusBg = (s: Flight['status']) =>
    s === 'On Time' ? 'bg-green-900/40 border-green-700 text-green-300'
        : s === 'Delayed' ? 'bg-yellow-900/40 border-yellow-700 text-yellow-300'
            : 'bg-red-900/40 border-red-700 text-red-300';

export function TravelPlans() {
    const [airportInfo, setAirportInfo] = useState<{ name: string; city: string; country: string; iata: string } | null>(null);
    const [loading, setLoading] = useState(true);
    const [iata, setIata] = useState('JFK');
    const [inputVal, setInputVal] = useState('JFK');

    const fetchAirport = async (code: string) => {
        setLoading(true);
        setAirportInfo(null);
        try {
            const res = await fetch(
                `https://airport-info.p.rapidapi.com/airport?iata=${code}`,
                {
                    headers: {
                        'x-rapidapi-key': 'c593c61ed8msha5a2ac10bd22761p102524jsnf40e70d095d7',
                        'x-rapidapi-host': 'airport-info.p.rapidapi.com',
                    },
                }
            );
            const data = await res.json();
            if (data?.name) {
                setAirportInfo({ name: data.name, city: data.city, country: data.country, iata: data.iata });
            } else {
                // fallback mock
                setAirportInfo({ name: `${code} International Airport`, city: code, country: 'Unknown', iata: code });
            }
        } catch {
            setAirportInfo({ name: `${code} International Airport`, city: code, country: 'See live data', iata: code });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchAirport(iata); }, [iata]);

    const heroContent = (
        <div className="flex flex-col items-center justify-center gap-4 drop-shadow-xl text-center">
            <div className="flex items-center justify-center gap-4 bg-black/40 backdrop-blur-md px-8 py-3 rounded-full border border-white/10">
                <Plane size={36} className="text-[#6c63ff]" />
                <h1 className="text-4xl md:text-5xl font-black tracking-tight">Flight & Airport Info</h1>
            </div>
            <p className="text-[#d8def4] font-medium text-xl bg-black/30 backdrop-blur-md px-6 py-2 rounded-full mt-2">Real-time airport lookup · Live flight status board</p>
        </div>
    );

    return (
        <PageLayout
            videoSrc="https://videos.pexels.com/video-files/4525107/4525107-uhd_2560_1440_24fps.mp4"
            videoOverlayText={heroContent}
            showFooter={true}
        >
            <div className="min-h-screen bg-gradient-to-b from-[#0a0d18] to-[#121626] text-[#e8eaf6] font-[Inter,sans-serif] px-4">
                <div className="max-w-5xl mx-auto py-12 flex flex-col gap-10">

                    {/* ── IATA Search ── */}
                    <div className="bg-[#1c2038] border border-white/[.08] shadow-2xl rounded-3xl p-8 transform hover:-translate-y-1 transition duration-300">
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                            <Plane size={24} className="text-[#6c63ff]" /> Airport Lookup
                        </h2>
                        <form
                            onSubmit={e => { e.preventDefault(); setIata(inputVal.toUpperCase().trim()); }}
                            className="flex gap-4 flex-wrap"
                        >
                            <input
                                value={inputVal}
                                onChange={e => setInputVal(e.target.value)}
                                maxLength={4}
                                placeholder="IATA code, e.g. DEL"
                                className="flex-1 min-w-[200px] bg-[#0d0f1a] border border-white/[.1] rounded-xl px-5 py-4 text-base outline-none focus:border-[#6c63ff] transition uppercase tracking-widest font-mono shadow-inner"
                            />
                            <button
                                type="submit"
                                className="px-8 py-4 rounded-xl bg-[#6c63ff] hover:bg-[#574fd6] text-white text-base font-bold transition shadow-lg hover:shadow-xl hover:scale-105"
                            >
                                Search
                            </button>
                        </form>

                        {/* Airport Result */}
                        <div className="mt-8">
                            {loading ? (
                                <div className="flex items-center gap-3 text-[#8a93b2] p-6 bg-[#0d0f1a] rounded-2xl justify-center">
                                    <div className="w-6 h-6 border-4 border-[#6c63ff] border-t-transparent rounded-full animate-spin" />
                                    <span className="font-medium text-lg">Loading airport data…</span>
                                </div>
                            ) : airportInfo ? (
                                <div className="bg-gradient-to-r from-[#141726] to-[#1c2038] border border-white/[.08] rounded-2xl p-8 text-center shadow-lg">
                                    <h3 className="text-[#6c63ff] text-3xl font-black mb-3">{airportInfo.name}</h3>
                                    <p className="text-[#b0b8d4] text-lg font-medium">📍 {airportInfo.city}, {airportInfo.country}</p>
                                    <p className="text-[#8a93b2] font-mono text-base mt-2">IATA: <span className="text-[#43e97b] font-bold text-lg bg-green-500/10 px-2 py-1 rounded">{airportInfo.iata}</span></p>
                                </div>
                            ) : (
                                <p className="text-red-400 text-base font-medium">Failed to load airport information.</p>
                            )}
                        </div>
                    </div>

                    {/* ── Flights Board ── */}
                    <div className="bg-[#1c2038] border border-white/[.08] shadow-2xl rounded-3xl p-8 transform hover:-translate-y-1 transition duration-300">
                        <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                            <Clock size={24} className="text-[#6c63ff]" /> Live Flight Status Board
                            <span className="ml-[auto] text-sm text-[#b0b8d4] font-bold border border-white/20 bg-white/5 rounded-full px-4 py-2 hidden sm:block">JFK Departures</span>
                        </h2>

                        {/* Header row */}
                        <div className="hidden md:grid grid-cols-4 gap-4 text-sm text-[#8a93b2] uppercase tracking-widest font-black pb-4 border-b border-white/[.08] mb-4">
                            <span>Flight</span><span>Departure</span><span>Arrival</span><span>Status</span>
                        </div>

                        <div className="flex flex-col gap-4">
                            {MOCK_FLIGHTS.map(fl => (
                                <div key={fl.flightNumber}
                                    className="grid grid-cols-2 md:grid-cols-4 gap-4 items-center bg-[#0d0f1a] hover:bg-black/80 rounded-2xl px-6 py-5 border border-white/[.04] transition duration-300 group shadow-md hover:shadow-xl">
                                    <div className="flex items-center gap-4">
                                        <Plane size={20} className="text-[#6c63ff] group-hover:translate-x-2 transition duration-300" />
                                        <span className="font-black font-mono text-lg">{fl.flightNumber}</span>
                                    </div>
                                    <div className="text-[#b0b8d4] text-base font-medium">🛫 {fl.departure}</div>
                                    <div className="text-[#b0b8d4] text-base font-medium">🛬 {fl.arrival}</div>
                                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold border ${statusBg(fl.status)} w-fit`}>
                                        {statusIcon(fl.status)} {fl.status}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <p className="text-sm text-[#8a93b2] mt-8 text-center font-medium">* Flight data is for demo purposes. Connect a live flight API (e.g. AviationStack) for real-time data.</p>
                    </div>

                    {/* ── Popular Airports ── */}
                    <div className="bg-[#1c2038] border border-white/[.08] shadow-2xl rounded-3xl p-8 transform hover:-translate-y-1 transition duration-300">
                        <h2 className="text-2xl font-bold mb-6">Popular Hubs</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[
                                { code: 'JFK', city: 'New York' }, { code: 'DEL', city: 'New Delhi' },
                                { code: 'DXB', city: 'Dubai' }, { code: 'LHR', city: 'London' },
                                { code: 'CDG', city: 'Paris' }, { code: 'SIN', city: 'Singapore' },
                                { code: 'NRT', city: 'Tokyo' }, { code: 'BOM', city: 'Mumbai' },
                            ].map(a => (
                                <button key={a.code}
                                    onClick={() => { setInputVal(a.code); setIata(a.code); }}
                                    className="flex flex-col items-center py-6 px-4 rounded-2xl bg-[#0d0f1a] border border-white/[.08] hover:border-[#6c63ff] hover:bg-[#6c63ff]/10 transition duration-300 group cursor-pointer shadow-md hover:shadow-xl">
                                    <span className="text-[#6c63ff] font-black text-2xl font-mono group-hover:scale-125 transition duration-500">{a.code}</span>
                                    <span className="text-[#b0b8d4] font-medium text-sm mt-2">{a.city}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </PageLayout>
    );
}
