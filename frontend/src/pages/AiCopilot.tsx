import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
    Map, CloudSun, Users, ShoppingBag, FileText, Receipt,
    UtensilsCrossed, Camera, ClipboardList, Route, Shield,
    Hotel, Star, ArrowLeft, Home, Sparkles
} from 'lucide-react';
import { Footer } from '../components/Footer';

// ── Types ──────────────────────────────────────────────────────────────────
type Status = 'idle' | 'loading' | 'success' | 'error';
interface ResultState { status: Status; text: string }

const EMPTY: ResultState = { status: 'idle', text: '' };

// ── Helper: post to backend ─────────────────────────────────────────────────
async function callApi(endpoint: string, body: object): Promise<string> {
    const res = await fetch(`/api/ai/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'API error');
    return data.result ?? JSON.stringify(data, null, 2);
}

// ── ResultBox component ─────────────────────────────────────────────────────
function ResultBox({ r }: { r: ResultState }) {
    if (r.status === 'idle') return null;
    const colours = {
        loading: 'bg-[rgba(108,99,255,.08)] border-[rgba(108,99,255,.2)] text-[#6c63ff]',
        success: 'bg-[rgba(67,233,123,.08)] border-[rgba(67,233,123,.2)] text-[#43e97b]',
        error: 'bg-[rgba(255,107,107,.08)] border-[rgba(255,107,107,.2)] text-[#ff6b6b]',
    };
    const labels = { loading: '⏳ Thinking…', success: '✅ Done', error: '❌ Error' };
    return (
        <div className="mt-5 rounded-xl border overflow-hidden">
            <div className={`px-4 py-3 text-[13px] font-semibold border-b ${colours[r.status]}`}>
                {labels[r.status]}
            </div>
            <div className="bg-[rgba(0,0,0,.2)] p-4">
                <pre className="text-[12.5px] leading-7 whitespace-pre-wrap break-words text-[#b0b8d4] font-mono">
                    {r.text}
                </pre>
            </div>
        </div>
    );
}

// ── Card wrapper ────────────────────────────────────────────────────────────
function AiCard({ id, icon, iconClass, title, desc, children }:
    { id: string; icon: React.ReactNode; iconClass: string; title: string; desc: string; children: React.ReactNode }) {
    return (
        <div id={id} className="bg-[#1c2038] border border-white/[.06] rounded-2xl overflow-hidden hover:shadow-[0_8px_32px_rgba(108,99,255,.12)] transition-shadow">
            <div className="px-7 py-5 flex items-center gap-4 border-b border-white/[.06]">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${iconClass}`}>{icon}</div>
                <div>
                    <h3 className="text-[16px] font-bold text-[#e8eaf6]">{title}</h3>
                    <p className="text-[13px] text-[#8a93b2] mt-0.5">{desc}</p>
                </div>
            </div>
            <div className="p-7">{children}</div>
        </div>
    );
}

// ── Input / Select helpers ──────────────────────────────────────────────────
const inp = "bg-[#141726] border border-white/[.06] rounded-lg text-[#e8eaf6] text-sm px-4 py-2.5 outline-none focus:border-[#6c63ff] transition flex-1 min-w-[140px]";
const selCls = `${inp} cursor-pointer`;
const btn = "inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#6c63ff] hover:bg-[#574fd6] text-white text-sm font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed";

// ── Main page ───────────────────────────────────────────────────────────────
export function AiCopilot() {
    // ── Per-feature state ──
    const [itinR, setItinR] = useState<ResultState>(EMPTY);
    const [wxR, setWxR] = useState<ResultState>(EMPTY);
    const [crowdR, setCrowdR] = useState<ResultState>(EMPTY);
    const [packR, setPackR] = useState<ResultState>(EMPTY);
    const [visaR, setVisaR] = useState<ResultState>(EMPTY);
    const [expR, setExpR] = useState<ResultState>(EMPTY);
    const [foodR, setFoodR] = useState<ResultState>(EMPTY);
    const [photoR, setPhotoR] = useState<ResultState>(EMPTY);
    const [sumR, setSumR] = useState<ResultState>(EMPTY);
    const [routeR, setRouteR] = useState<ResultState>(EMPTY);
    const [safeR, setSafeR] = useState<ResultState>(EMPTY);
    const [hotelR, setHotelR] = useState<ResultState>(EMPTY);
    const [reviewR, setReviewR] = useState<ResultState>(EMPTY);

    // ── Refs ──
    const itinDest = useRef<HTMLInputElement>(null);
    const itinDays = useRef<HTMLInputElement>(null);
    const itinBudget = useRef<HTMLInputElement>(null);
    const itinTravelers = useRef<HTMLInputElement>(null);
    const itinInterests = useRef<HTMLInputElement>(null);
    const itinStyle = useRef<HTMLSelectElement>(null);

    async function run(setter: (r: ResultState) => void, fn: () => Promise<string>) {
        setter({ status: 'loading', text: 'AI is thinking…' });
        try {
            const text = await fn();
            setter({ status: 'success', text });
        } catch (e: unknown) {
            setter({ status: 'error', text: e instanceof Error ? e.message : String(e) });
        }
    }

    return (
        <div className="flex flex-col min-h-screen" style={{ fontFamily: "'Inter',sans-serif", background: '#0d0f1a', color: '#e8eaf6' }}>
            <div className="flex flex-1">

                {/* ── Sidebar ── */}
                <nav className="w-[280px] bg-[#141726] border-r border-white/[.06] flex flex-col sticky top-0 h-screen overflow-y-auto shrink-0 hidden lg:flex">
                    <div className="px-6 py-7 border-b border-white/[.06]">
                        <h1 className="text-[22px] font-black text-[#6c63ff]">✈ Dreamscapes</h1>
                        <p className="text-[12px] text-[#8a93b2] mt-0.5">AI Travel Copilot</p>
                    </div>
                    <div className="flex items-center gap-2 mx-6 my-4 px-4 py-2.5 rounded-lg text-sm text-[#43e97b] bg-[rgba(67,233,123,.09)] border border-[rgba(67,233,123,.2)]">
                        <span className="w-2 h-2 rounded-full bg-[#43e97b] animate-pulse" /> Connected to backend
                    </div>
                    <div className="flex-1 p-3 space-y-0.5">
                        {[
                            ['itinerary', 'Itinerary Generator'],
                            ['weather', 'Weather Modifications'],
                            ['crowd', 'Crowd Prediction'],
                            ['packing', 'Packing Checklist'],
                            ['visa', 'Visa Summary'],
                            ['expense', 'Expense Splitter'],
                            ['food', 'Food Recommendations'],
                            ['photos', 'Photo Spots'],
                            ['summary', 'Trip Summarizer'],
                            ['route', 'Route Optimization'],
                            ['safety', 'Safety Alerts'],
                            ['hotel', 'Hotel Comparison'],
                            ['review', 'Review Analysis'],
                        ].map(([id, label]) => (
                            <a key={id} href={`#${id}`}
                                className="flex items-center gap-3 w-full px-3.5 py-2.5 rounded-lg text-[14px] text-[#8a93b2] hover:bg-[rgba(108,99,255,.15)] hover:text-[#6c63ff] transition font-medium">
                                {label}
                            </a>
                        ))}
                    </div>
                    <div className="p-3 border-t border-white/[.06] space-y-0.5">
                        <Link to="/dashboard" className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-[14px] text-[#8a93b2] hover:bg-white/5 hover:text-white transition">
                            <ArrowLeft size={16} /> Dashboard
                        </Link>
                        <Link to="/" className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-[14px] text-[#8a93b2] hover:bg-white/5 hover:text-white transition">
                            <Home size={16} /> Home
                        </Link>
                    </div>
                </nav>

                {/* ── Main ── */}
                <div className="flex-1 overflow-x-hidden">
                    {/* Header */}
                    <div className="px-10 py-7 border-b border-white/[.06] flex items-center justify-between bg-[#141726] sticky top-0 z-10">
                        <div>
                            <h2 className="text-[20px] font-bold flex items-center gap-2">
                                <Sparkles size={18} className="text-[#6c63ff]" /> AI Travel Copilot
                            </h2>
                            <p className="text-[14px] text-[#8a93b2] mt-0.5">Powered by OpenAI GPT-4o-mini · 13 AI features</p>
                        </div>
                        <Link to="/dashboard" className="flex items-center gap-2 text-[13px] text-[#8a93b2] hover:text-white transition">
                            <ArrowLeft size={16} /> Dashboard
                        </Link>
                    </div>

                    {/* Stats */}
                    <div className="px-10 pt-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {[
                            { val: '13', lbl: 'AI Features', col: '#6c63ff' },
                            { val: 'Live', lbl: 'Backend Status', col: '#43e97b' },
                            { val: 'Mock', lbl: 'Data Mode', col: '#f9ca24' },
                            { val: 'REST', lbl: 'API Type', col: '#ff6584' },
                        ].map(s => (
                            <div key={s.lbl} className="bg-[#1c2038] border border-white/[.06] rounded-xl px-5 py-4">
                                <div className="text-[26px] font-black" style={{ color: s.col }}>{s.val}</div>
                                <div className="text-[12px] text-[#8a93b2] mt-0.5">{s.lbl}</div>
                            </div>
                        ))}
                    </div>

                    {/* Cards */}
                    <div className="px-10 py-8 flex flex-col gap-7">

                        {/* 1. Itinerary */}
                        <AiCard id="itinerary" icon={<Map size={18} />} iconClass="bg-[rgba(108,99,255,.16)] text-[#6c63ff]"
                            title="AI Itinerary Generator" desc="Full day-by-day plan with budget breakdown, hidden gems & meal suggestions">
                            <div className="flex flex-wrap gap-3 mb-4">
                                <input ref={itinDest} defaultValue="Goa" placeholder="Destination" className={inp} />
                                <input ref={itinDays} type="number" defaultValue="3" placeholder="Days" className={`${inp} w-24 flex-none`} />
                                <input ref={itinBudget} defaultValue="₹50,000" placeholder="Budget" className={inp} />
                                <input ref={itinTravelers} type="number" defaultValue="2" placeholder="Travelers" className={`${inp} w-28 flex-none`} />
                                <input ref={itinInterests} defaultValue="beaches, food, history" placeholder="Interests (comma-sep)" className={inp} />
                                <select ref={itinStyle} className={selCls} style={{ color: '#e8eaf6' }}>
                                    <option value="budget">Budget</option>
                                    <option value="mid-range" selected>Mid-Range</option>
                                    <option value="luxury">Luxury</option>
                                </select>
                            </div>
                            <button className={btn} onClick={() => run(setItinR, () => callApi('itinerary', {
                                destination: itinDest.current?.value,
                                days: Number(itinDays.current?.value),
                                budget: itinBudget.current?.value,
                                travelers: Number(itinTravelers.current?.value),
                                interests: itinInterests.current?.value?.split(',').map(s => s.trim()),
                                travelStyle: itinStyle.current?.value,
                            }))}>
                                <Sparkles size={16} /> Generate Plan
                            </button>
                            <ResultBox r={itinR} />
                        </AiCard>

                        {/* 2. Weather */}
                        <AiCard id="weather" icon={<CloudSun size={18} />} iconClass="bg-[rgba(52,152,219,.14)] text-[#3498db]"
                            title="Weather-Aware Trip Modifications" desc="Real-time weather data combined with AI to adapt your itinerary">
                            {(() => {
                                const [dest, setDest] = useState('Goa'); return (<>
                                    <div className="flex flex-wrap gap-3 mb-4">
                                        <input value={dest} onChange={e => setDest(e.target.value)} placeholder="City / Destination" className={inp} />
                                    </div>
                                    <button className={btn} onClick={() => run(setWxR, () => callApi('weather', { destination: dest }))}>
                                        <CloudSun size={16} /> Analyse Weather
                                    </button>
                                    <ResultBox r={wxR} />
                                </>)
                            })()}
                        </AiCard>

                        {/* 3. Crowd */}
                        <AiCard id="crowd" icon={<Users size={18} />} iconClass="bg-[rgba(230,126,34,.14)] text-[#e67e22]"
                            title="Crowd Prediction" desc="AI optimal timing & photo opportunities">
                            {(() => {
                                const [dest, setDest] = useState('Agra, India'); const [places, setPlaces] = useState('Taj Mahal, Agra Fort'); return (<>
                                    <div className="flex flex-wrap gap-3 mb-4">
                                        <input value={dest} onChange={e => setDest(e.target.value)} placeholder="Destination" className={inp} />
                                        <input value={places} onChange={e => setPlaces(e.target.value)} placeholder="Attractions (comma-sep)" className={inp} />
                                    </div>
                                    <button className={btn} onClick={() => run(setCrowdR, () => callApi('crowd-prediction', { destination: dest, attractions: places.split(',').map(s => s.trim()) }))}>
                                        <Users size={16} /> Predict Crowds
                                    </button>
                                    <ResultBox r={crowdR} />
                                </>)
                            })()}
                        </AiCard>

                        {/* 4. Packing */}
                        <AiCard id="packing" icon={<ShoppingBag size={18} />} iconClass="bg-[rgba(0,206,201,.14)] text-[#00cec9]"
                            title="AI Packing Checklist" desc="Smart personalized packing list">
                            {(() => {
                                const [dest, setDest] = useState('Manali'); const [days, setDays] = useState('5'); const [season, setSeason] = useState('winter'); const [acts, setActs] = useState('trekking, skiing'); return (<>
                                    <div className="flex flex-wrap gap-3 mb-4">
                                        <input value={dest} onChange={e => setDest(e.target.value)} placeholder="Destination" className={inp} />
                                        <input value={days} type="number" onChange={e => setDays(e.target.value)} placeholder="Days" className={`${inp} w-24 flex-none`} />
                                        <input value={season} onChange={e => setSeason(e.target.value)} placeholder="Season" className={inp} />
                                        <input value={acts} onChange={e => setActs(e.target.value)} placeholder="Activities" className={inp} />
                                    </div>
                                    <button className={btn} onClick={() => run(setPackR, () => callApi('packing', { destination: dest, days: Number(days), season, activities: acts.split(',').map(s => s.trim()) }))}>
                                        <ShoppingBag size={16} /> Get Checklist
                                    </button>
                                    <ResultBox r={packR} />
                                </>)
                            })()}
                        </AiCard>

                        {/* 5. Visa */}
                        <AiCard id="visa" icon={<FileText size={18} />} iconClass="bg-[rgba(249,202,36,.14)] text-[#f9ca24]"
                            title="AI Visa Requirement Summary" desc="Visa rules, process steps, and costs for any country pair">
                            {(() => {
                                const [nat, setNat] = useState('Indian'); const [dest, setDest] = useState('Japan'); const [purpose, setPurpose] = useState('tourism'); return (<>
                                    <div className="flex flex-wrap gap-3 mb-4">
                                        <input value={nat} onChange={e => setNat(e.target.value)} placeholder="Your Nationality" className={inp} />
                                        <input value={dest} onChange={e => setDest(e.target.value)} placeholder="Destination Country" className={inp} />
                                        <input value={purpose} onChange={e => setPurpose(e.target.value)} placeholder="Purpose" className={inp} />
                                    </div>
                                    <button className={btn} onClick={() => run(setVisaR, () => callApi('visa', { nationality: nat, destination: dest, purpose }))}>
                                        <FileText size={16} /> Check Visa
                                    </button>
                                    <ResultBox r={visaR} />
                                </>)
                            })()}
                        </AiCard>

                        {/* 6. Expense */}
                        <AiCard id="expense" icon={<Receipt size={18} />} iconClass="bg-[rgba(67,233,123,.14)] text-[#43e97b]"
                            title="AI Group Expense Splitter" desc="Minimizes transactions to settle group trip expenses fairly">
                            <p className="text-sm text-[#8a93b2] mb-4">Demo: 3-person trip. Alice paid ₹600 Hotel; Bob paid ₹400 Dinner.</p>
                            <button className={btn} onClick={() => run(setExpR, () => callApi('expenses', {
                                participants: ['Alice', 'Bob', 'Charlie'],
                                expenses: [{ payer: 'Alice', amount: 600, description: 'Hotel' }, { payer: 'Bob', amount: 400, description: 'Dinner' }]
                            }))}>
                                <Receipt size={16} /> Calculate Splits
                            </button>
                            <ResultBox r={expR} />
                        </AiCard>

                        {/* 7. Food */}
                        <AiCard id="food" icon={<UtensilsCrossed size={18} />} iconClass="bg-[rgba(255,101,132,.14)] text-[#ff6584]"
                            title="AI Local Food Recommendations" desc="Must-try dishes, authentic eateries, and insider food tips">
                            {(() => {
                                const [dest, setDest] = useState('Bangkok'); const [pref, setPref] = useState('street food'); const [budget, setBudget] = useState('moderate'); return (<>
                                    <div className="flex flex-wrap gap-3 mb-4">
                                        <input value={dest} onChange={e => setDest(e.target.value)} placeholder="Destination" className={inp} />
                                        <input value={pref} onChange={e => setPref(e.target.value)} placeholder="Preferences" className={inp} />
                                        <select value={budget} onChange={e => setBudget(e.target.value)} className={selCls} style={{ color: '#e8eaf6' }}>
                                            <option value="cheap">Cheap</option>
                                            <option value="moderate">Moderate</option>
                                            <option value="expensive">Expensive</option>
                                        </select>
                                    </div>
                                    <button className={btn} onClick={() => run(setFoodR, () => callApi('food', { destination: dest, preferences: [pref], budget }))}>
                                        <UtensilsCrossed size={16} /> Recommend
                                    </button>
                                    <ResultBox r={foodR} />
                                </>)
                            })()}
                        </AiCard>

                        {/* 8. Photo Spots */}
                        <AiCard id="photos" icon={<Camera size={18} />} iconClass="bg-[rgba(232,67,147,.14)] text-[#e84393]"
                            title="AI Photo Spot Finder" desc="Hidden photo gems, golden-hour timings & composition tips">
                            {(() => {
                                const [dest, setDest] = useState('Santorini'); return (<>
                                    <div className="flex flex-wrap gap-3 mb-4">
                                        <input value={dest} onChange={e => setDest(e.target.value)} placeholder="Destination" className={inp} />
                                    </div>
                                    <button className={btn} onClick={() => run(setPhotoR, () => callApi('photo-spots', { destination: dest }))}>
                                        <Camera size={16} /> Find Spots
                                    </button>
                                    <ResultBox r={photoR} />
                                </>)
                            })()}
                        </AiCard>

                        {/* 9. Trip Summarizer */}
                        <AiCard id="summary" icon={<ClipboardList size={18} />} iconClass="bg-[rgba(108,99,255,.16)] text-[#6c63ff]"
                            title="AI Trip Summarizer" desc="Turn your trip notes into a shareable travel story">
                            {(() => {
                                const [notes, setNotes] = useState('We visited Paris for 5 days. Saw the Eiffel Tower, Louvre, and ate croissants.'); return (<>
                                    <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3} placeholder="Paste your trip notes…"
                                        className="w-full bg-[#141726] border border-white/[.06] rounded-lg text-[#e8eaf6] text-sm px-4 py-2.5 outline-none focus:border-[#6c63ff] transition resize-y mb-4" />
                                    <button className={btn} onClick={() => run(setSumR, () => callApi('trip-summary', { tripNotes: notes }))}>
                                        <ClipboardList size={16} /> Summarize Trip
                                    </button>
                                    <ResultBox r={sumR} />
                                </>)
                            })()}
                        </AiCard>

                        {/* 10. Route Optimization */}
                        <AiCard id="route" icon={<Route size={18} />} iconClass="bg-[rgba(52,152,219,.14)] text-[#3498db]"
                            title="AI Route Optimization" desc="Optimal travel sequence to minimize time & costs">
                            {(() => {
                                const [dest, setDest] = useState('Paris'); const [places, setPlaces] = useState('Eiffel Tower, Louvre, Notre Dame, Montmartre'); return (<>
                                    <div className="flex flex-wrap gap-3 mb-4">
                                        <input value={dest} onChange={e => setDest(e.target.value)} placeholder="City" className={inp} />
                                        <input value={places} onChange={e => setPlaces(e.target.value)} placeholder="Places (comma-sep)" className={inp} />
                                    </div>
                                    <button className={btn} onClick={() => run(setRouteR, () => callApi('route-optimization', { destination: dest, places: places.split(',').map(s => s.trim()) }))}>
                                        <Route size={16} /> Optimize Route
                                    </button>
                                    <ResultBox r={routeR} />
                                </>)
                            })()}
                        </AiCard>

                        {/* 11. Safety */}
                        <AiCard id="safety" icon={<Shield size={18} />} iconClass="bg-[rgba(67,233,123,.14)] text-[#43e97b]"
                            title="AI Safety Alerts" desc="Real-time safety ratings and local tips">
                            {(() => {
                                const [dest, setDest] = useState('Mexico City'); const [nat, setNat] = useState('Indian'); return (<>
                                    <div className="flex flex-wrap gap-3 mb-4">
                                        <input value={dest} onChange={e => setDest(e.target.value)} placeholder="Destination" className={inp} />
                                        <input value={nat} onChange={e => setNat(e.target.value)} placeholder="Your Nationality" className={inp} />
                                    </div>
                                    <button className={btn} onClick={() => run(setSafeR, () => callApi('safety', { destination: dest, nationality: nat }))}>
                                        <Shield size={16} /> Get Safety Info
                                    </button>
                                    <ResultBox r={safeR} />
                                </>)
                            })()}
                        </AiCard>

                        {/* 12. Hotel Comparison */}
                        <AiCard id="hotel" icon={<Hotel size={18} />} iconClass="bg-[rgba(230,126,34,.14)] text-[#e67e22]"
                            title="AI Hotel Comparison" desc="Side-by-side hotel analysis with value scores">
                            {(() => {
                                const [dest, setDest] = useState('Bali'); const [budget, setBudget] = useState('moderate'); const [nights, setNights] = useState('5'); return (<>
                                    <div className="flex flex-wrap gap-3 mb-4">
                                        <input value={dest} onChange={e => setDest(e.target.value)} placeholder="Destination" className={inp} />
                                        <input value={nights} type="number" onChange={e => setNights(e.target.value)} placeholder="Nights" className={`${inp} w-24 flex-none`} />
                                        <select value={budget} onChange={e => setBudget(e.target.value)} className={selCls} style={{ color: '#e8eaf6' }}>
                                            <option value="budget">Budget</option>
                                            <option value="moderate">Moderate</option>
                                            <option value="luxury">Luxury</option>
                                        </select>
                                    </div>
                                    <button className={btn} onClick={() => run(setHotelR, () => callApi('hotel-comparison', { destination: dest, budget, nights: Number(nights) }))}>
                                        <Hotel size={16} /> Compare Hotels
                                    </button>
                                    <ResultBox r={hotelR} />
                                </>)
                            })()}
                        </AiCard>

                        {/* 13. Review Analysis */}
                        <AiCard id="review" icon={<Star size={18} />} iconClass="bg-[rgba(249,202,36,.14)] text-[#f9ca24]"
                            title="AI Review Analysis" desc="Cut through fake reviews — get authentic sentiment insights">
                            {(() => {
                                const [place, setPlace] = useState('Eiffel Tower Cafe, Paris'); return (<>
                                    <div className="flex flex-wrap gap-3 mb-4">
                                        <input value={place} onChange={e => setPlace(e.target.value)} placeholder="Place name" className={inp} />
                                    </div>
                                    <button className={btn} onClick={() => run(setReviewR, () => callApi('review-analysis', { placeName: place }))}>
                                        <Star size={16} /> Analyse Reviews
                                    </button>
                                    <ResultBox r={reviewR} />
                                </>)
                            })()}
                        </AiCard>

                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
