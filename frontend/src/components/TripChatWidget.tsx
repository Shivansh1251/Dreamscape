import { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { createPortal } from 'react-dom';
import {
    MessageSquare, X, Send, Sparkles, ChevronRight,
    CheckCircle2, Loader2, RotateCcw, ExternalLink, Minimize2
} from 'lucide-react';
import { apiUrl } from '../lib/api';
import { saveTrip } from '../lib/appData';

// ── Types ──────────────────────────────────────────────────────────────────
interface Message {
    id: string;
    role: 'assistant' | 'user';
    content: string;
    isTyping?: boolean;
}

interface TripPreferences {
    destination?: string;
    days?: number;
    budget?: string;
    travelers?: number;
    interests?: string[];
    travelStyle?: 'budget' | 'mid-range' | 'luxury';
}

type Step = 'greeting' | 'destination' | 'duration' | 'travelers' | 'budget' | 'travel_style' | 'interests' | 'confirm' | 'generating' | 'result';

// ── Constants ──────────────────────────────────────────────────────────────
const INTERESTS = [
    { id: 'beaches', label: '🏖 Beaches' },
    { id: 'history', label: '🏛 History' },
    { id: 'food', label: '🍜 Food' },
    { id: 'adventure', label: '🧗 Adventure' },
    { id: 'nature', label: '🌿 Nature' },
    { id: 'art', label: '🎨 Art' },
    { id: 'shopping', label: '🛍 Shopping' },
    { id: 'nightlife', label: '🎶 Nightlife' },
];

const STYLES = [
    { id: 'budget', label: '🎒 Budget', sub: 'Hostels & local eats' },
    { id: 'mid-range', label: '✈ Comfortable', sub: '3-star, mix of dining' },
    { id: 'luxury', label: '👑 Luxury', sub: '5-star & fine dining' },
];

const STORAGE_KEY = 'ds_widget_prefs';

function genId() { return Math.random().toString(36).slice(2, 9); }

function loadPrefs(): TripPreferences {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); } catch { return {}; }
}

// ── Widget ─────────────────────────────────────────────────────────────────
export function TripChatWidget() {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [step, setStep] = useState<Step>('greeting');
    const [prefs, setPrefs] = useState<TripPreferences>(loadPrefs);
    const [input, setInput] = useState('');
    const [interests, setInterests] = useState<string[]>(loadPrefs().interests || []);
    const [style, setStyle] = useState('');
    const [itinerary, setItinerary] = useState<any>(null);
    const [isTyping, setIsTyping] = useState(false);
    const [pulsing, setPulsing] = useState(true);
    const [nearPageEnd, setNearPageEnd] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const bottomRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Stop pulsing after first open
    const handleOpen = () => { setOpen(true); setPulsing(false); };

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Keep the floating assistant away from the community block and footer.
    useEffect(() => {
        const targets = [document.querySelector('#Aboutus'), document.querySelector('footer')].filter(Boolean) as Element[];
        if (!targets.length) return;
        const observer = new IntersectionObserver((entries) => {
            const overlapping = entries.some((entry) => entry.isIntersecting);
            setNearPageEnd(overlapping);
            if (overlapping) setOpen(false);
        }, { threshold: 0.08 });
        targets.forEach((target) => observer.observe(target));
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        const syncDrawer = (event: Event) => {
            const isOpen = Boolean((event as CustomEvent<boolean>).detail);
            setDrawerOpen(isOpen);
            if (isOpen) setOpen(false);
        };
        window.addEventListener('dreamscape-drawer-state', syncDrawer);
        return () => window.removeEventListener('dreamscape-drawer-state', syncDrawer);
    }, []);

    // ── Bot message with typing delay ──────────────────
    const botSay = useCallback((text: string, delay = 600) => {
        const typingId = genId() + '_t';
        setIsTyping(true);
        setMessages(p => [...p, { id: typingId, role: 'assistant', content: '', isTyping: true }]);
        setTimeout(() => {
            setMessages(p => [
                ...p.filter(m => m.id !== typingId),
                { id: genId(), role: 'assistant', content: text }
            ]);
            setIsTyping(false);
            setTimeout(() => inputRef.current?.focus(), 80);
        }, delay);
    }, []);

    const userSay = useCallback((text: string) => {
        setMessages(p => [...p, { id: genId(), role: 'user', content: text }]);
    }, []);

    // ── Start conversation on open ─────────────────────
    useEffect(() => {
        if (open && messages.length === 0) {
            setTimeout(() => {
                botSay("Hi! ✈️ I'm **DreamBot**.\n\nTell me where you'd love to go and I'll build a personalised trip plan in seconds.\n\nWhere are you dreaming of travelling? 🌍", 800);
                setTimeout(() => setStep('destination'), 1500);
            }, 200);
        }
    }, [open]); // eslint-disable-line

    // ── Advance conversation ───────────────────────────
    const advance = useCallback((val: string, updated: TripPreferences) => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        switch (step) {
            case 'destination':
                botSay(`✨ **${updated.destination}** — great pick!\n\nHow many days are you planning?`);
                setStep('duration');
                break;
            case 'duration':
                botSay(`${updated.days} days sounds perfect 🗓\n\nHow many people are travelling?`);
                setStep('travelers');
                break;
            case 'travelers':
                botSay(`Got it — **${updated.travelers}** traveller(s).\n\nWhat's your total budget? (e.g. ₹40,000 or $800)`);
                setStep('budget');
                break;
            case 'budget':
                botSay(`Budget noted 💰\n\nPick your travel style:`);
                setStep('travel_style');
                break;
            case 'travel_style':
                botSay(`**${val}** — nice! One last thing — what are your interests? Pick a few:`);
                setStep('interests');
                break;
            case 'interests':
                botSay(`✅ All set!\n\n📍 **${updated.destination}** · ${updated.days} days · ${updated.travelers} person(s) · ${updated.budget} · ${updated.interests?.join(', ')}\n\nShall I generate your itinerary? Type **yes** to confirm.`);
                setStep('confirm');
                break;
            case 'confirm':
                if (val.toLowerCase().includes('yes') || val.toLowerCase().includes('go') || val.toLowerCase().includes('sure')) {
                    setStep('generating');
                    botSay(`🚀 Crafting your **${updated.destination}** itinerary…\n\nThis takes ~10 seconds!`, 400);
                    generateItinerary(updated);
                } else if (val.toLowerCase().includes('restart')) {
                    handleRestart();
                } else {
                    botSay(`Type **yes** to generate or **restart** to begin again! 😊`);
                }
                break;
        }
    }, [step, botSay]); // eslint-disable-line

    async function generateItinerary(p: TripPreferences) {
        try {
            const res = await fetch(apiUrl('/api/ai/itinerary'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    destination: p.destination,
                    days: p.days,
                    budget: p.budget,
                    travelers: p.travelers,
                    interests: p.interests,
                    travelStyle: p.travelStyle,
                }),
            });
            const data = await res.json();
            if (!res.ok || !data.success) throw new Error(data.error || 'Generation failed');
            setItinerary(data.data);
            saveTrip({
                destination: p.destination || data.data.destination,
                days: p.days || data.data.days?.length || 1,
                budget: p.budget || data.data.budgetBreakdown?.total || 'Not specified',
                travelers: p.travelers || 1,
                interests: p.interests || [],
                travelStyle: p.travelStyle || 'mid-range',
                itinerary: data.data,
            });
            setStep('result');
            botSay(`🎉 Your **${p.destination}** plan is ready! Scroll down to see it below.`, 500);
        } catch (err: any) {
            botSay(`❌ ${err.message}. Type **restart** to try again.`, 500);
            setStep('confirm');
        }
    }

    const handleSubmit = useCallback(() => {
        const val = input.trim();
        if (!val || isTyping || step === 'generating') return;
        setInput('');
        userSay(val);

        if (val.toLowerCase() === 'restart') { handleRestart(); return; }

        let updated = { ...prefs };
        switch (step) {
            case 'destination': updated.destination = val; break;
            case 'duration': updated.days = Math.max(1, parseInt(val) || 3); break;
            case 'travelers': updated.travelers = Math.max(1, parseInt(val) || 1); break;
            case 'budget': updated.budget = val; break;
        }
        setPrefs(updated);
        advance(val, updated);
    }, [input, isTyping, step, prefs, userSay, advance]);

    const handleStyleSelect = (id: string, label: string) => {
        const updated = { ...prefs, travelStyle: id as TripPreferences['travelStyle'] };
        setStyle(id);
        setPrefs(updated);
        userSay(label);
        advance(label, updated);
    };

    const handleInterestsDone = () => {
        if (interests.length === 0) return;
        const updated = { ...prefs, interests };
        setPrefs(updated);
        userSay(interests.join(', '));
        advance(interests.join(', '), updated);
    };

    function handleRestart() {
        localStorage.removeItem(STORAGE_KEY);
        setMessages([]);
        setStep('greeting');
        setPrefs({});
        setInput('');
        setInterests([]);
        setStyle('');
        setItinerary(null);
        setTimeout(() => {
            botSay("Hi again! ✈️ Where would you like to travel?", 600);
            setTimeout(() => setStep('destination'), 1200);
        }, 100);
    }

    function toggleInterest(id: string) {
        setInterests(p => p.includes(id) ? p.filter(i => i !== id) : [...p, id]);
    }

    // Render bold markdown
    function renderText(text: string) {
        return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
            part.startsWith('**') && part.endsWith('**')
                ? <strong key={i} className="font-bold text-slate-900">{part.slice(2, -2)}</strong>
                : <span key={i}>{part}</span>
        );
    }

    const showInputBar = !['travel_style', 'interests', 'generating'].includes(step)
        && step !== 'result';

    return createPortal(
        <>
            {/* ── FAB Button ── */}
            <button
                onClick={() => open ? setOpen(false) : handleOpen()}
                className={`fixed bottom-6 right-6 z-[999] flex items-center gap-2.5 rounded-2xl px-5 py-3.5 shadow-2xl transition-all duration-300 ${nearPageEnd || drawerOpen ? 'translate-y-24 opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'} ${open ? 'bg-slate-800' : 'bg-slate-900'}`}
                style={{ boxShadow: pulsing ? '0 0 0 0 rgba(33,124,170,0.7)' : '0 8px 32px rgba(5,32,60,0.5)' }}
            >
                {/* Pulse ring */}
                {pulsing && (
                    <span className="absolute inset-0 rounded-2xl animate-ping opacity-30 bg-[#217caa]" />
                )}
                {open
                    ? <Minimize2 size={18} className="text-slate-400" />
                    : <MessageSquare size={18} className="text-white" />
                }
                <span className="text-sm font-bold text-white">{open ? 'Minimise' : 'Plan a Trip'}</span>
                {!open && <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-emerald-400 text-[9px] font-black text-white flex items-center justify-center">AI</span>}
            </button>

            {/* ── Chat Panel ── */}
            <div
                className={`fixed bottom-20 right-6 z-[999] flex flex-col rounded-2xl overflow-hidden shadow-2xl transition-all duration-400 origin-bottom-right
                    ${open && !nearPageEnd && !drawerOpen ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'}`}
                style={{
                    width: 'min(380px, calc(100vw - 24px))',
                    maxHeight: 'min(520px, calc(100vh - 120px))',
                    background: '#f8fafc',
                    border: '1px solid #cbd5e1',
                }}
            >
                {/* Header */}
                <div className="flex shrink-0 items-center gap-3 border-b border-slate-200 bg-white px-4 py-3">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                        style={{ background: '#0f172a' }}>
                        <Sparkles size={16} className="text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold leading-none text-slate-900">DreamBot</p>
                        <p className="mt-0.5 text-[11px] text-slate-500">AI Trip Planner · Personalised</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Link to="/trip-planner" title="Open full planner"
                            className="rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900">
                            <ExternalLink size={14} />
                        </Link>
                        <button onClick={handleRestart} title="Restart"
                            className="rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900">
                            <RotateCcw size={14} />
                        </button>
                        <button onClick={() => setOpen(false)}
                            className="rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900">
                            <X size={16} />
                        </button>
                    </div>
                </div>

                {/* Messages */}
                <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-4" style={{ scrollbarWidth: 'thin', scrollbarColor: '#cbd5e1 transparent' }}>
                    {messages.map(msg => (
                        <div key={msg.id} className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                            {msg.role === 'assistant' && (
                                <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                                    style={{ background: '#e2e8f0' }}>
                                    <Sparkles size={12} style={{ color: '#334155' }} />
                                </div>
                            )}
                            <div className={`max-w-[82%] px-3.5 py-2.5 rounded-2xl text-[13px] leading-6 whitespace-pre-line
                                ${msg.role === 'user' ? 'rounded-tr-sm' : 'rounded-tl-sm'}`}
                                style={msg.role === 'user'
                                    ? { background: '#0f172a', color: 'white' }
                                    : { background: '#ffffff', color: '#334155', border: '1px solid #e2e8f0' }
                                }>
                                {msg.isTyping
                                    ? <span className="flex gap-1 items-center py-0.5">
                                        {[0, 1, 2].map(i => (
                                            <span key={i} className="w-1.5 h-1.5 rounded-full bg-[#59b3dc]"
                                                style={{ animation: `bounce 1.2s infinite ${i * 0.2}s` }} />
                                        ))}
                                    </span>
                                    : renderText(msg.content)
                                }
                            </div>
                        </div>
                    ))}

                    {/* Quick-select panels */}
                    {!isTyping && step === 'travel_style' && (
                        <div className="flex flex-col gap-2 mt-1">
                            {STYLES.map(s => (
                                <button key={s.id} onClick={() => handleStyleSelect(s.id, s.label)}
                                    className={`text-left px-3.5 py-2.5 rounded-xl border text-sm transition-all
                                        ${style === s.id ? 'border-[#217caa] bg-[rgba(33,124,170,0.18)]' : 'border-white/[.07] bg-white/[.03] hover:border-[#217caa]/50'}`}
                                    style={{ color: style === s.id ? 'white' : '#8aaccc' }}>
                                    <div className="font-semibold">{s.label}</div>
                                    <div className="text-[11px] mt-0.5 opacity-70">{s.sub}</div>
                                </button>
                            ))}
                        </div>
                    )}

                    {!isTyping && step === 'interests' && (
                        <div className="mt-1">
                            <div className="flex flex-wrap gap-1.5 mb-3">
                                {INTERESTS.map(opt => (
                                    <button key={opt.id} onClick={() => toggleInterest(opt.id)}
                                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all
                                            ${interests.includes(opt.id) ? 'border-[#217caa] bg-[rgba(33,124,170,0.2)] text-white' : 'border-white/[.08] text-[#8aaccc] hover:border-white/20'}`}>
                                        {opt.label}
                                        {interests.includes(opt.id) && <CheckCircle2 size={10} className="inline ml-1 text-emerald-400" />}
                                    </button>
                                ))}
                            </div>
                            {interests.length > 0 && (
                                <button onClick={handleInterestsDone}
                                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all text-white"
                                    style={{ background: '#217caa' }}>
                                    Confirm {interests.length} interest{interests.length !== 1 ? 's' : ''} <ChevronRight size={13} />
                                </button>
                            )}
                        </div>
                    )}

                    {step === 'generating' && (
                        <div className="flex items-center gap-3 px-3 py-3 rounded-xl"
                            style={{ background: 'rgba(33,124,170,0.08)', border: '1px solid rgba(33,124,170,0.2)' }}>
                            <Loader2 size={16} className="animate-spin shrink-0" style={{ color: '#59b3dc' }} />
                            <span className="text-xs" style={{ color: '#8aaccc' }}>Building your personalised itinerary…</span>
                        </div>
                    )}

                    {/* Itinerary Result */}
                    {step === 'result' && itinerary && (
                        <div className="mt-2 rounded-xl overflow-hidden"
                            style={{ border: '1px solid rgba(33,124,170,0.3)', background: 'rgba(255,255,255,0.03)' }}>
                            <div className="px-4 py-3 border-b border-white/[.05]"
                                style={{ background: 'rgba(33,124,170,0.1)' }}>
                                <p className="text-sm font-bold text-white">{itinerary.destination}</p>
                                <p className="text-[11px] mt-0.5 text-[#8aaccc]">{itinerary.summary?.slice(0, 90)}…</p>
                            </div>
                            {itinerary.days?.slice(0, 3).map((day: any) => (
                                <div key={day.day} className="px-4 py-2.5 border-b border-white/[.04]">
                                    <p className="text-xs font-bold text-white/80">Day {day.day} — {day.title}</p>
                                    <p className="text-[11px] text-[#6a8aaa] mt-0.5">
                                        🌅 {day.morning?.activity} · ☀️ {day.afternoon?.activity} · 🌙 {day.evening?.activity}
                                    </p>
                                </div>
                            ))}
                            <div className="px-4 py-3 flex items-center gap-3">
                                <span className="text-xs font-bold" style={{ color: '#43c97b' }}>Total: {itinerary.budgetBreakdown?.total}</span>
                                <Link to="/trip-planner"
                                    className="ml-auto flex items-center gap-1 text-[11px] font-bold px-3 py-1.5 rounded-lg transition"
                                    style={{ background: '#217caa', color: 'white' }}>
                                    Full Plan <ExternalLink size={10} />
                                </Link>
                                <button onClick={handleRestart}
                                    className="text-[11px] font-semibold px-2.5 py-1.5 rounded-lg transition"
                                    style={{ background: 'rgba(255,255,255,0.06)', color: '#8aaccc' }}>
                                    Retry
                                </button>
                            </div>
                        </div>
                    )}

                    <div ref={bottomRef} />
                </div>

                {/* Input bar */}
                {showInputBar && (
                    <div className="shrink-0 border-t border-slate-200 bg-white p-3">
                        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                            <input
                                ref={inputRef}
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                                placeholder={
                                    step === 'destination' ? 'e.g. Goa, Paris, Tokyo…' :
                                        step === 'duration' ? 'Number of days…' :
                                            step === 'travelers' ? 'Number of people…' :
                                                step === 'budget' ? 'e.g. ₹40,000 or $800…' :
                                                    step === 'confirm' ? 'yes / restart' :
                                                        'Type a message…'
                                }
                                disabled={isTyping}
                                className="flex-1 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
                            />
                            <button
                                onClick={handleSubmit}
                                disabled={!input.trim() || isTyping}
                                className="w-7 h-7 rounded-lg flex items-center justify-center transition-all shrink-0"
                                style={{ background: input.trim() && !isTyping ? '#0f172a' : '#e2e8f0', color: input.trim() && !isTyping ? 'white' : '#94a3b8' }}>
                                <Send size={13} />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Bounce keyframes */}
            <style>{`
                @keyframes bounce {
                    0%, 80%, 100% { transform: translateY(0); opacity: 0.5; }
                    40% { transform: translateY(-4px); opacity: 1; }
                }
            `}</style>
        </>, document.body
    );
}
