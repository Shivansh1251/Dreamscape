import { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
    ArrowLeft, Send, Sparkles, MapPin, Calendar, DollarSign,
    Heart, Zap, RotateCcw, CheckCircle2,
    Plane, Home, Bot, ChevronRight, Loader2, Copy, Check
} from 'lucide-react';
import { apiUrl } from '../lib/api';
import { saveTrip } from '../lib/appData';

// ── Types ──────────────────────────────────────────────────────────────────
interface Message {
    id: string;
    role: 'assistant' | 'user';
    content: string;
    timestamp: Date;
    isTyping?: boolean;
}

interface TripPreferences {
    destination?: string;
    days?: number;
    budget?: string;
    travelers?: number;
    interests?: string[];
    travelStyle?: 'budget' | 'mid-range' | 'luxury';
    startDate?: string;
    companions?: string;
    accommodation?: string;
    dietaryRestrictions?: string;
    physicalAbility?: string;
}

interface ItineraryDay {
    day: number;
    date: string;
    title: string;
    morning: { time: string; activity: string; location: string; tip: string };
    afternoon: { time: string; activity: string; location: string; tip: string };
    evening: { time: string; activity: string; location: string; tip: string };
    meals: { breakfast: string; lunch: string; dinner: string };
    estimatedDayCost: string;
}

interface Itinerary {
    destination: string;
    summary: string;
    budgetBreakdown: {
        accommodation: string;
        food: string;
        transport: string;
        activities: string;
        misc: string;
        total: string;
    };
    days: ItineraryDay[];
    generalTips: string[];
    bestTimeToVisit: string;
}

// ── Conversation flow ───────────────────────────────────────────────────────
type Step =
    | 'greeting'
    | 'destination'
    | 'duration'
    | 'travelers'
    | 'companions'
    | 'budget'
    | 'travel_style'
    | 'interests'
    | 'start_date'
    | 'accommodation'
    | 'dietary'
    | 'physical'
    | 'confirm'
    | 'generating'
    | 'result';

const INTEREST_OPTIONS = [
    { id: 'beaches', label: '🏖 Beaches', color: 'from-blue-500 to-cyan-400' },
    { id: 'history', label: '🏛 History', color: 'from-amber-500 to-yellow-400' },
    { id: 'food', label: '🍜 Food', color: 'from-orange-500 to-red-400' },
    { id: 'adventure', label: '🧗 Adventure', color: 'from-green-500 to-emerald-400' },
    { id: 'nature', label: '🌿 Nature', color: 'from-teal-500 to-green-400' },
    { id: 'nightlife', label: '🎶 Nightlife', color: 'from-purple-500 to-pink-400' },
    { id: 'art', label: '🎨 Art & Culture', color: 'from-indigo-500 to-purple-400' },
    { id: 'shopping', label: '🛍 Shopping', color: 'from-pink-500 to-rose-400' },
    { id: 'wellness', label: '🧘 Wellness', color: 'from-violet-500 to-indigo-400' },
    { id: 'photography', label: '📸 Photography', color: 'from-sky-500 to-blue-400' },
];

const COMPANION_OPTIONS = [
    { id: 'solo', label: '🧍 Solo traveler', icon: '🧍' },
    { id: 'couple', label: '💑 Couple', icon: '💑' },
    { id: 'family', label: '👨‍👩‍👧‍👦 Family with kids', icon: '👨‍👩‍👧‍👦' },
    { id: 'friends', label: '👯 Friend group', icon: '👯' },
    { id: 'business', label: '💼 Business trip', icon: '💼' },
];

const STYLE_OPTIONS = [
    { id: 'budget', label: '🎒 Budget Explorer', desc: 'Hostels, local eats, free activities', color: '#43e97b' },
    { id: 'mid-range', label: '✈️ Comfortable Traveler', desc: '3-star hotels, mix of dining options', color: '#6c63ff' },
    { id: 'luxury', label: '👑 Luxury Voyager', desc: '5-star stays, fine dining, VIP experiences', color: '#f9ca24' },
];

// ── Utility ─────────────────────────────────────────────────────────────────
function genId() { return Math.random().toString(36).slice(2); }

function buildGreeting(): string {
    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
    return `${greeting}! ✈️ I'm **DreamBot**, your personal AI travel planner.\n\nI'll help you create a **personalized itinerary** by asking you a few quick questions. The whole process takes less than 2 minutes!\n\nReady to plan your dream trip? Let's start with the destination! 🌍`;
}

const STORAGE_KEY = 'dreamscapes_trip_prefs';

function loadSavedPrefs(): TripPreferences {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); }
    catch { return {}; }
}

function savePrefs(prefs: TripPreferences) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
}

// ── Main component ───────────────────────────────────────────────────────────
export function TripPlannerChat() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [step, setStep] = useState<Step>('greeting');
    const [prefs, setPrefs] = useState<TripPreferences>(loadSavedPrefs);
    const [input, setInput] = useState('');
    const [selectedInterests, setSelectedInterests] = useState<string[]>(prefs.interests || []);
    const [selectedStyle, setSelectedStyle] = useState<string>(prefs.travelStyle || '');
    const [selectedCompanion, setSelectedCompanion] = useState<string>(prefs.companions || '');
    const [itinerary, setItinerary] = useState<Itinerary | null>(null);
    const [copyDone, setCopyDone] = useState(false);
    const [isTypingEffect, setIsTypingEffect] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, []);

    useEffect(() => { scrollToBottom(); }, [messages, scrollToBottom]);

    // ── Push assistant message with typing effect ─────
    const pushAssistant = useCallback((content: string, delay = 400) => {
        const id = genId();
        setIsTypingEffect(true);
        // Show typing indicator first
        setMessages(prev => [...prev, { id: id + '_typing', role: 'assistant', content: '...', isTyping: true, timestamp: new Date() }]);

        setTimeout(() => {
            setMessages(prev => [
                ...prev.filter(m => m.id !== id + '_typing'),
                { id, role: 'assistant', content, timestamp: new Date() }
            ]);
            setIsTypingEffect(false);
            setTimeout(() => inputRef.current?.focus(), 100);
        }, delay);
    }, []);

    // ── Push user message ─────────────────────────────
    const pushUser = useCallback((content: string) => {
        setMessages(prev => [...prev, { id: genId(), role: 'user', content, timestamp: new Date() }]);
    }, []);

    // ── Initial greeting ─────────────────────────────
    useEffect(() => {
        const timer = setTimeout(() => {
            pushAssistant(buildGreeting(), 600);
            setTimeout(() => {
                setStep('destination');
            }, 1200);
        }, 300);
        return () => clearTimeout(timer);
    }, []); // eslint-disable-line

    // ── Next step after user answers ─────────────────
    const advanceStep = useCallback((userMsg: string, updatedPrefs: TripPreferences) => {
        savePrefs(updatedPrefs);

        switch (step) {
            case 'destination':
                pushAssistant(`Great choice! **${updatedPrefs.destination}** is amazing 🌟\n\nHow many days are you planning to stay?`, 700);
                setStep('duration');
                break;
            case 'duration':
                pushAssistant(`${updatedPrefs.days} days — enough time to really soak it in! 🗓\n\nHow many people are travelling?`, 700);
                setStep('travelers');
                break;
            case 'travelers':
                pushAssistant(`Perfect, planning for **${updatedPrefs.travelers} traveler(s)**.\n\nWhat's your trip vibe? Who are you travelling with?`, 700);
                setStep('companions');
                break;
            case 'companions':
                pushAssistant(`Got it! Planning a trip for **${userMsg.toLowerCase()}**.\n\nWhat's your total **budget** for the trip? (e.g. ₹50,000 or $1500)`, 700);
                setStep('budget');
                break;
            case 'budget':
                pushAssistant(`Budget noted: **${updatedPrefs.budget}** 💰\n\nNow, what's your travel style?`, 700);
                setStep('travel_style');
                break;
            case 'travel_style':
                pushAssistant(`Love it! **${userMsg}** mode activated 🎯\n\nWhat are your main **interests**? Select all that apply — I'll use these to personalise every activity!`, 700);
                setStep('interests');
                break;
            case 'interests':
                pushAssistant(`Excellent taste! I'll weave **${updatedPrefs.interests?.join(', ')}** into your itinerary.\n\nWhen are you planning to travel? (e.g. "15 March 2026" or "next month" — or skip to leave flexible)`, 700);
                setStep('start_date');
                break;
            case 'start_date':
                pushAssistant(`Got it! Almost done 🎉\n\nAny **dietary restrictions or allergies** I should account for in meal suggestions? (e.g. vegetarian, vegan, gluten-free — or type "none")`, 700);
                setStep('dietary');
                break;
            case 'dietary':
                pushAssistant(`Perfect!\n\nOne last thing — any **physical activity level considerations**? This helps me pick the right activities. (e.g. "low — prefer slow walks", "high — love strenuous hikes", or "average")`, 700);
                setStep('physical');
                break;
            case 'physical':
                // Show summary before generating
                const summary = formatSummary(updatedPrefs);
                pushAssistant(`Here's a summary of your trip preferences:\n\n${summary}\n\nShall I **generate your personalized AI itinerary now**? ✨ (Type "yes" to confirm or "restart" to start over)`, 900);
                setStep('confirm');
                break;
            case 'confirm':
                if (userMsg.toLowerCase().includes('yes') || userMsg.toLowerCase().includes('sure') || userMsg.toLowerCase().includes('go') || userMsg.toLowerCase().includes('generat')) {
                    setStep('generating');
                    pushAssistant(`🚀 Generating your personalized **${updatedPrefs.destination}** itinerary...\n\nThis takes about 10-15 seconds while I craft the perfect plan for you!`, 500);
                    generateItinerary(updatedPrefs);
                } else if (userMsg.toLowerCase().includes('restart') || userMsg.toLowerCase().includes('start over')) {
                    handleRestart();
                } else {
                    pushAssistant(`Just type **"yes"** to generate your itinerary, or **"restart"** to begin again! 😊`, 600);
                }
                break;
        }
    }, [step, pushAssistant]); // eslint-disable-line

    function formatSummary(p: TripPreferences): string {
        const lines = [
            `📍 **Destination:** ${p.destination}`,
            `📅 **Duration:** ${p.days} days`,
            `👥 **Travelers:** ${p.travelers} (${p.companions || 'unspecified'})`,
            `💰 **Budget:** ${p.budget}`,
            `✈️ **Style:** ${p.travelStyle}`,
            `❤️ **Interests:** ${p.interests?.join(', ') || 'general'}`,
            p.startDate ? `🗓 **Start Date:** ${p.startDate}` : '',
            p.dietaryRestrictions && p.dietaryRestrictions !== 'none' ? `🥗 **Dietary:** ${p.dietaryRestrictions}` : '',
            p.physicalAbility ? `🏃 **Activity level:** ${p.physicalAbility}` : '',
        ].filter(Boolean);
        return lines.join('\n');
    }

    // ── Generate Itinerary ────────────────────────────
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
                    startDate: p.startDate,
                    companions: p.companions,
                    accommodation: p.accommodation,
                    dietaryRestrictions: p.dietaryRestrictions,
                    physicalAbility: p.physicalAbility,
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
                startDate: p.startDate,
                itinerary: data.data,
            });
            setStep('result');
            pushAssistant(`🎉 Your **${p.destination} itinerary** is ready! Scroll down to explore your personalized ${p.days}-day adventure.\n\nYou can download it as text, share it, or restart to plan another trip!`, 800);
        } catch (err: any) {
            pushAssistant(`❌ Oops! Something went wrong: ${err.message}.\n\nPlease type **"retry"** to try again or **"restart"** to begin fresh.`, 800);
            setStep('confirm');
        }
    }

    // ── Handle text input submit ──────────────────────
    const handleSubmit = useCallback(() => {
        const val = input.trim();
        if (!val || isTypingEffect || step === 'generating') return;
        setInput('');

        pushUser(val);

        if (step === 'confirm' && (val.toLowerCase().includes('restart') || val.toLowerCase().includes('start over'))) {
            handleRestart();
            return;
        }

        let updatedPrefs = { ...prefs };

        switch (step) {
            case 'destination':
                updatedPrefs.destination = val;
                break;
            case 'duration':
                updatedPrefs.days = parseInt(val) || 3;
                break;
            case 'travelers':
                updatedPrefs.travelers = parseInt(val) || 1;
                break;
            case 'companions':
                updatedPrefs.companions = val;
                break;
            case 'budget':
                updatedPrefs.budget = val;
                break;
            case 'start_date':
                updatedPrefs.startDate = val.toLowerCase() === 'skip' ? undefined : val;
                break;
            case 'dietary':
                updatedPrefs.dietaryRestrictions = val;
                break;
            case 'physical':
                updatedPrefs.physicalAbility = val;
                break;
        }

        setPrefs(updatedPrefs);
        advanceStep(val, updatedPrefs);
    }, [input, isTypingEffect, step, prefs, pushUser, advanceStep]);

    // ── Handle quick-select options ───────────────────
    const handleCompanionSelect = useCallback((companionLabel: string) => {
        const updatedPrefs = { ...prefs, companions: companionLabel, travelers: prefs.travelers || 1 };
        setSelectedCompanion(companionLabel);
        setPrefs(updatedPrefs);
        pushUser(companionLabel);
        advanceStep(companionLabel, updatedPrefs);
    }, [prefs, pushUser, advanceStep]);

    const handleStyleSelect = useCallback((styleId: string, styleLabel: string) => {
        const updatedPrefs = { ...prefs, travelStyle: styleId as TripPreferences['travelStyle'] };
        setSelectedStyle(styleId);
        setPrefs(updatedPrefs);
        pushUser(styleLabel);
        advanceStep(styleLabel, updatedPrefs);
    }, [prefs, pushUser, advanceStep]);

    const handleInterestsDone = useCallback(() => {
        if (selectedInterests.length === 0) return;
        const updatedPrefs = { ...prefs, interests: selectedInterests };
        setPrefs(updatedPrefs);
        pushUser(selectedInterests.join(', '));
        advanceStep(selectedInterests.join(', '), updatedPrefs);
    }, [selectedInterests, prefs, pushUser, advanceStep]);

    function toggleInterest(id: string) {
        setSelectedInterests(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    }

    // ── Restart ───────────────────────────────────────
    function handleRestart() {
        localStorage.removeItem(STORAGE_KEY);
        setMessages([]);
        setStep('greeting');
        setPrefs({});
        setInput('');
        setSelectedInterests([]);
        setSelectedStyle('');
        setSelectedCompanion('');
        setItinerary(null);
        setTimeout(() => {
            pushAssistant(buildGreeting(), 600);
            setTimeout(() => setStep('destination'), 1200);
        }, 200);
    }

    // ── Copy itinerary ────────────────────────────────
    function copyItinerary() {
        if (!itinerary) return;
        const text = itinerary.days.map(d =>
            `Day ${d.day}: ${d.title}\n  Morning: ${d.morning.activity} @ ${d.morning.location}\n  Afternoon: ${d.afternoon.activity} @ ${d.afternoon.location}\n  Evening: ${d.evening.activity} @ ${d.evening.location}\n  Meals: ${d.meals.breakfast} | ${d.meals.lunch} | ${d.meals.dinner}\n  Cost: ${d.estimatedDayCost}`
        ).join('\n\n');
        navigator.clipboard.writeText(`${itinerary.destination} Itinerary\n\n${itinerary.summary}\n\n${text}\n\nTotal Budget: ${itinerary.budgetBreakdown.total}`);
        setCopyDone(true);
        setTimeout(() => setCopyDone(false), 2000);
    }

    // ── Render markdown-style bold ────────────────────
    function renderContent(text: string) {
        const parts = text.split(/(\*\*[^*]+\*\*)/g);
        return parts.map((part, i) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={i} className="font-bold text-white">{part.slice(2, -2)}</strong>;
            }
            return <span key={i}>{part}</span>;
        });
    }

    const inputPlaceholders: Partial<Record<Step, string>> = {
        destination: 'Type a destination (e.g. Goa, Paris, Tokyo…)',
        duration: 'Number of days (e.g. 5)',
        travelers: 'Number of people (e.g. 2)',
        budget: 'Your total budget (e.g. ₹50,000 or $1500)',
        start_date: 'Start date or "skip"',
        dietary: 'Any dietary restrictions or "none"',
        physical: 'Your activity level (low / average / high)',
        confirm: 'Type "yes" to generate or "restart"',
    };

    const showInputBar = !['companions', 'travel_style', 'interests', 'generating', 'result'].includes(step)
        || step === 'confirm';

    return (
        <div className="flex min-h-screen flex-col bg-slate-100 text-slate-900" style={{ fontFamily: "'Inter', sans-serif" }}>
            {/* ── Header ── */}
            <header className="sticky top-0 z-50 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4 shadow-sm">
                <div className="flex items-center gap-4">
                    <Link to="/ai-copilot"
                        className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm text-slate-500 transition hover:bg-slate-100 hover:text-slate-900">
                        <ArrowLeft size={16} /> AI Copilot
                    </Link>
                    <div className="h-5 w-px bg-slate-200" />
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900">
                            <Bot size={18} className="text-white" />
                        </div>
                        <div>
                            <h1 className="text-sm font-bold text-slate-900">DreamBot — Trip Planner</h1>
                            <div className="flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                                <span className="text-xs text-slate-500">AI-powered · Personalised</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    {step === 'result' && itinerary && (
                        <button onClick={copyItinerary}
                            className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-700 transition hover:bg-slate-100">
                            {copyDone ? <><Check size={14} /> Copied!</> : <><Copy size={14} /> Copy Plan</>}
                        </button>
                    )}
                    <button onClick={handleRestart}
                        className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600 transition hover:bg-slate-100">
                        <RotateCcw size={14} /> New Trip
                    </button>
                    <Link to="/"
                        className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900">
                        <Home size={16} />
                    </Link>
                </div>
            </header>

            {/* ── Chat area ── */}
            <div className="flex w-full max-w-4xl flex-1 flex-col gap-4 px-4 py-6 mx-auto">

                {/* Progress indicator */}
                {step !== 'result' && step !== 'greeting' && (
                    <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                        <div className="flex gap-1.5 flex-1">
                            {(['destination', 'duration', 'travelers', 'companions', 'budget', 'travel_style', 'interests', 'start_date', 'dietary', 'physical', 'confirm'] as Step[]).map((s, i) => {
                                const steps: Step[] = ['destination', 'duration', 'travelers', 'companions', 'budget', 'travel_style', 'interests', 'start_date', 'dietary', 'physical', 'confirm'];
                                const currentIdx = steps.indexOf(step);
                                const done = i < currentIdx;
                                const active = i === currentIdx;
                                return (
                                    <div key={s} className="flex-1 h-1 rounded-full transition-all duration-500"
                                        style={{ background: done ? '#0f172a' : active ? '#94a3b8' : '#e2e8f0' }} />
                                );
                            })}
                        </div>
                        <span className="ml-2 shrink-0 text-xs text-slate-500">
                            {step === 'generating' ? 'Generating…' : `Step ${Math.min((['destination', 'duration', 'travelers', 'companions', 'budget', 'travel_style', 'interests', 'start_date', 'dietary', 'physical', 'confirm'] as Step[]).indexOf(step) + 1, 11)} / 11`}
                        </span>
                    </div>
                )}

                {/* Messages */}
                <div className="flex flex-col gap-5 flex-1">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                            {/* Avatar */}
                            {msg.role === 'assistant' && (
                                <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-900">
                                    <Sparkles size={16} className="text-white" />
                                </div>
                            )}
                            {msg.role === 'user' && (
                                <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-700">
                                    <span className="text-white text-sm font-bold">You</span>
                                </div>
                            )}

                            {/* Bubble */}
                            <div className={`max-w-[75%] ${msg.role === 'user' ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                                <div className={`px-5 py-3.5 rounded-2xl text-sm leading-7 whitespace-pre-line ${msg.role === 'user'
                                    ? 'rounded-tr-sm'
                                    : 'rounded-tl-sm'}`}
                                    style={msg.role === 'user'
                                        ? { background: '#0f172a', color: 'white' }
                                        : { background: '#ffffff', border: '1px solid #e2e8f0', color: '#334155' }
                                    }>
                                    {msg.isTyping ? (
                                        <div className="flex gap-1.5 py-1 items-center">
                                            <div className="typing-dot" style={{ width: 7, height: 7, borderRadius: '50%', background: '#6c63ff', animation: 'bounce 1.2s infinite 0s' }} />
                                            <div className="typing-dot" style={{ width: 7, height: 7, borderRadius: '50%', background: '#6c63ff', animation: 'bounce 1.2s infinite 0.2s' }} />
                                            <div className="typing-dot" style={{ width: 7, height: 7, borderRadius: '50%', background: '#6c63ff', animation: 'bounce 1.2s infinite 0.4s' }} />
                                        </div>
                                    ) : renderContent(msg.content)}
                                </div>
                                <span className="px-1 text-[11px] text-slate-400">
                                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        </div>
                    ))}

                    {/* ── Interactive option panels ── */}
                    {!isTypingEffect && step === 'companions' && (
                        <div className="ml-12 grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                            {COMPANION_OPTIONS.map(opt => (
                                <button key={opt.id} onClick={() => handleCompanionSelect(opt.label)}
                                    className={`text-left px-5 py-4 rounded-xl border transition-all duration-200 text-sm font-medium
                                        ${selectedCompanion === opt.label ? 'border-[#6c63ff] bg-[rgba(108,99,255,0.15)]' : 'border-white/[.07] bg-white/[.03] hover:border-[#6c63ff]/50 hover:bg-[rgba(108,99,255,0.07)]'}`}
                                    style={{ color: selectedCompanion === opt.label ? '#c8d0e8' : '#8a93b2' }}>
                                    <div className="text-lg mb-1">{opt.icon}</div>
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    )}

                    {!isTypingEffect && step === 'travel_style' && (
                        <div className="ml-12 flex flex-col gap-3 mt-2">
                            {STYLE_OPTIONS.map(opt => (
                                <button key={opt.id} onClick={() => handleStyleSelect(opt.id, opt.label)}
                                    className={`text-left px-6 py-4 rounded-xl border transition-all duration-200 ${selectedStyle === opt.id ? 'border-[#6c63ff]' : 'border-white/[.07] hover:border-[#6c63ff]/50'}`}
                                    style={{ background: selectedStyle === opt.id ? 'rgba(108,99,255,0.12)' : 'rgba(255,255,255,0.03)' }}>
                                    <div className="flex items-center gap-3">
                                        <div className="w-3 h-3 rounded-full" style={{ background: opt.color, boxShadow: `0 0 10px ${opt.color}60` }} />
                                        <div>
                                            <div className="text-sm font-bold" style={{ color: '#e8eaf6' }}>{opt.label}</div>
                                            <div className="text-xs mt-0.5" style={{ color: '#8a93b2' }}>{opt.desc}</div>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}

                    {!isTypingEffect && step === 'interests' && (
                        <div className="ml-12 mt-2">
                            <div className="flex flex-wrap gap-2.5 mb-4">
                                {INTEREST_OPTIONS.map(opt => (
                                    <button key={opt.id} onClick={() => toggleInterest(opt.id)}
                                        className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all duration-200 ${selectedInterests.includes(opt.id)
                                            ? 'border-[#6c63ff] text-white'
                                            : 'border-white/[.07] text-[#8a93b2] hover:border-[#6c63ff]/40'}`}
                                        style={selectedInterests.includes(opt.id) ? { background: 'rgba(108,99,255,0.2)' } : { background: 'rgba(255,255,255,0.03)' }}>
                                        {opt.label}
                                        {selectedInterests.includes(opt.id) && <CheckCircle2 size={12} className="inline ml-1.5 text-green-400" />}
                                    </button>
                                ))}
                            </div>
                            {selectedInterests.length > 0 && (
                                <button onClick={handleInterestsDone}
                                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all"
                                    style={{ background: 'linear-gradient(135deg, #6c63ff, #574fd6)', color: 'white' }}>
                                    Confirm {selectedInterests.length} interest{selectedInterests.length !== 1 ? 's' : ''} <ChevronRight size={16} />
                                </button>
                            )}
                        </div>
                    )}

                    {step === 'generating' && (
                        <div className="ml-12 flex items-center gap-4 px-5 py-4 rounded-xl" style={{ background: 'rgba(108,99,255,0.08)', border: '1px solid rgba(108,99,255,0.2)' }}>
                            <Loader2 size={20} className="text-[#6c63ff] animate-spin" />
                            <div>
                                <div className="text-sm font-semibold text-[#e8eaf6]">Crafting your personalized itinerary…</div>
                                <div className="text-xs mt-0.5 text-[#8a93b2]">Analysing destination data, curating hidden gems, optimising schedule</div>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* ── Itinerary Result ── */}
                {step === 'result' && itinerary && (
                    <div className="mt-6 flex flex-col gap-6">
                        {/* Hero */}
                        <div className="rounded-2xl overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(108,99,255,0.15) 0%, rgba(67,233,123,0.08) 100%)', border: '1px solid rgba(108,99,255,0.3)' }}>
                            <div className="px-8 py-6 border-b border-white/[.06]">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #6c63ff, #43e97b)' }}>
                                        <Plane size={18} className="text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-black" style={{ color: '#e8eaf6' }}>{itinerary.destination} — {prefs.days}-Day Itinerary</h2>
                                        <p className="text-xs" style={{ color: '#8a93b2' }}>Generated by DreamBot AI • Personalised for you</p>
                                    </div>
                                </div>
                                <p className="text-sm leading-7" style={{ color: '#b0b8d4' }}>{itinerary.summary}</p>
                            </div>

                            {/* Budget Breakdown */}
                            <div className="px-8 py-5 border-b border-white/[.06]">
                                <h3 className="text-sm font-bold mb-4 flex items-center gap-2" style={{ color: '#e8eaf6' }}>
                                    <DollarSign size={15} className="text-[#43e97b]" /> Budget Breakdown
                                </h3>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    {Object.entries(itinerary.budgetBreakdown).map(([key, val]) => (
                                        <div key={key} className="px-4 py-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                                            <div className="text-xs capitalize mb-1" style={{ color: '#8a93b2' }}>{key}</div>
                                            <div className="text-sm font-bold" style={{ color: key === 'total' ? '#43e97b' : '#e8eaf6' }}>{val}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Day-by-day */}
                            <div className="px-8 py-5">
                                <h3 className="text-sm font-bold mb-5 flex items-center gap-2" style={{ color: '#e8eaf6' }}>
                                    <Calendar size={15} className="text-[#6c63ff]" /> Day-by-Day Plan
                                </h3>
                                <div className="flex flex-col gap-4">
                                    {itinerary.days.map((day) => (
                                        <div key={day.day} className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
                                            <div className="px-5 py-3.5 flex items-center justify-between" style={{ background: 'rgba(108,99,255,0.12)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-black text-white"
                                                        style={{ background: 'linear-gradient(135deg, #6c63ff, #574fd6)' }}>
                                                        {day.day}
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-bold" style={{ color: '#e8eaf6' }}>{day.title}</div>
                                                        <div className="text-xs" style={{ color: '#8a93b2' }}>{day.date}</div>
                                                    </div>
                                                </div>
                                                <span className="text-xs px-3 py-1 rounded-full font-semibold" style={{ background: 'rgba(67,233,123,0.1)', color: '#43e97b', border: '1px solid rgba(67,233,123,0.2)' }}>
                                                    {day.estimatedDayCost}
                                                </span>
                                            </div>
                                            <div className="px-5 py-4 grid gap-3">
                                                {[
                                                    { label: '🌅 Morning', data: day.morning, color: '#f9ca24' },
                                                    { label: '☀️ Afternoon', data: day.afternoon, color: '#ff9966' },
                                                    { label: '🌙 Evening', data: day.evening, color: '#6c63ff' },
                                                ].map(({ label, data, color }) => (
                                                    <div key={label} className="flex gap-3">
                                                        <span className="text-xs font-semibold shrink-0 pt-0.5 w-20" style={{ color }}>{label}</span>
                                                        <div className="text-xs leading-6" style={{ color: '#b0b8d4' }}>
                                                            <span className="font-semibold" style={{ color: '#e8eaf6' }}>{data.activity}</span>
                                                            {' · '}<MapPin size={10} className="inline mb-0.5" /> {data.location}
                                                            {data.tip && <span className="block mt-0.5 italic" style={{ color: '#6a7194' }}>💡 {data.tip}</span>}
                                                        </div>
                                                    </div>
                                                ))}
                                                <div className="flex gap-3 pt-2 border-t border-white/[.04]">
                                                    <span className="text-xs font-semibold shrink-0 pt-0.5 w-20" style={{ color: '#43e97b' }}>🍽 Meals</span>
                                                    <div className="text-xs leading-6" style={{ color: '#8a93b2' }}>
                                                        🌄 {day.meals.breakfast} &nbsp;|&nbsp; ☀️ {day.meals.lunch} &nbsp;|&nbsp; 🌙 {day.meals.dinner}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Tips */}
                            {itinerary.generalTips.length > 0 && (
                                <div className="px-8 py-5 border-t border-white/[.06]">
                                    <h3 className="text-sm font-bold mb-3 flex items-center gap-2" style={{ color: '#e8eaf6' }}>
                                        <Zap size={15} className="text-[#f9ca24]" /> General Tips
                                    </h3>
                                    <ul className="space-y-2">
                                        {itinerary.generalTips.map((tip, i) => (
                                            <li key={i} className="flex items-start gap-2 text-xs leading-6" style={{ color: '#b0b8d4' }}>
                                                <span style={{ color: '#6c63ff' }}>→</span> {tip}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Best time */}
                            <div className="px-8 py-4 border-t border-white/[.06] flex items-center gap-2 text-xs" style={{ color: '#8a93b2', background: 'rgba(255,255,255,0.02)' }}>
                                <Heart size={12} className="text-pink-400" />
                                <span><strong className="text-white">Best time to visit:</strong> {itinerary.bestTimeToVisit}</span>
                            </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex flex-wrap gap-3">
                            <button onClick={copyItinerary}
                                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition"
                                style={{ background: copyDone ? 'rgba(67,233,123,0.12)' : 'rgba(108,99,255,0.12)', color: copyDone ? '#43e97b' : '#6c63ff', border: `1px solid ${copyDone ? 'rgba(67,233,123,0.3)' : 'rgba(108,99,255,0.3)'}` }}>
                                {copyDone ? <><Check size={15} /> Copied to clipboard!</> : <><Copy size={15} /> Copy Itinerary</>}
                            </button>
                            <button onClick={handleRestart}
                                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition"
                                style={{ background: 'rgba(255,255,255,0.04)', color: '#8a93b2', border: '1px solid rgba(255,255,255,0.08)' }}>
                                <RotateCcw size={15} /> Plan Another Trip
                            </button>
                            <Link to="/ai-copilot"
                                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition"
                                style={{ background: 'rgba(249,202,36,0.08)', color: '#f9ca24', border: '1px solid rgba(249,202,36,0.2)' }}>
                                <Sparkles size={15} /> More AI Tools
                            </Link>
                        </div>
                    </div>
                )}

                {/* ── Input bar ── */}
                {showInputBar && step !== 'result' && (
                    <div className="sticky bottom-0 pt-4">
                        <div className="flex gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-lg">
                            <input
                                ref={inputRef}
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                onKeyDown={e => { if (e.key === 'Enter') handleSubmit(); }}
                                placeholder={inputPlaceholders[step] || 'Type your answer…'}
                                disabled={isTypingEffect || step === 'generating'}
                                className="flex-1 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
                            />
                            <button
                                onClick={handleSubmit}
                                disabled={!input.trim() || isTypingEffect || step === 'generating'}
                                className="w-10 h-10 rounded-xl flex items-center justify-center transition-all"
                                style={{ background: input.trim() ? '#0f172a' : '#e2e8f0', color: input.trim() ? 'white' : '#94a3b8' }}>
                                <Send size={16} />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* ── Bounce animation CSS ── */}
            <style>{`
                @keyframes bounce {
                    0%, 80%, 100% { transform: translateY(0); opacity: 0.5; }
                    40% { transform: translateY(-6px); opacity: 1; }
                }
            `}</style>

        </div>
    );
}
