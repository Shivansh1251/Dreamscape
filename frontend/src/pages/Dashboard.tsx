import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
    ArrowRight, Bot, CheckCircle2, Compass, LayoutDashboard, LogOut,
    MessageSquare, Pencil, Plane, Plus, Settings, Sparkles, Trash2, User, Users,
} from 'lucide-react';
import { apiUrl } from '../lib/api';
import {
    AppSettings, RoamieConnection, SavedProfile, TripPlan, deleteTrip, disconnectRoamie,
    getActivity, getConnections, getProfile, getSettings, getTrips, onAppDataChange,
    saveProfile, saveSettings, updateTrip,
} from '../lib/appData';

type Section = 'dashboard' | 'profile' | 'settings' | 'ai' | 'trips' | 'roamies';

const sections: Section[] = ['dashboard', 'profile', 'settings', 'ai', 'trips', 'roamies'];

function sectionFrom(value: string | null): Section {
    return value && sections.includes(value as Section) ? value as Section : 'dashboard';
}

function displayDate(value: string) {
    return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(new Date(value));
}

function profileFromLogin(login: string): SavedProfile {
    const username = login.includes('@') ? login.split('@')[0] : login;
    return { firstName: username || 'Traveler', lastName: '', email: login || 'traveler@dreamscapes.app' };
}

export function Dashboard() {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const section = sectionFrom(searchParams.get('section'));
    const [user, setUser] = useState<SavedProfile | null>(null);
    const [trips, setTrips] = useState<TripPlan[]>([]);
    const [connections, setConnections] = useState<RoamieConnection[]>([]);
    const [activity, setActivity] = useState<string[]>([]);
    const [settings, setSettings] = useState<AppSettings>(getSettings);
    const [editingProfile, setEditingProfile] = useState(false);
    const [profileDraft, setProfileDraft] = useState<SavedProfile | null>(null);
    const [notice, setNotice] = useState('');

    const refreshData = useCallback(() => {
        setTrips(getTrips());
        setConnections(getConnections());
        setActivity(getActivity());
        setSettings(getSettings());
    }, []);

    useEffect(() => {
        refreshData();
        return onAppDataChange(refreshData);
    }, [refreshData]);

    useEffect(() => {
        let active = true;
        const localLogin = localStorage.getItem('currentUser') || '';

        async function loadUser() {
            try {
                const response = await fetch(apiUrl('/api/auth/me'), { credentials: 'include' });
                const data = await response.json();
                if (data.success && data.user && active) {
                    setUser(getProfile({
                        firstName: data.user.firstName || 'Traveler',
                        lastName: data.user.lastName || '',
                        email: data.user.email || localLogin || 'traveler@dreamscapes.app',
                        profilePicture: data.user.profilePicture,
                    }));
                    return;
                }
            } catch {
                // Local account mode is a supported fallback while the API is unavailable.
            }

            if (!active) return;
            if (localLogin) setUser(getProfile(profileFromLogin(localLogin)));
            else navigate('/login');
        }

        void loadUser();
        return () => { active = false; };
    }, [navigate]);

    const setSection = (next: Section) => setSearchParams(next === 'dashboard' ? {} : { section: next });
    const plannedTrips = trips.filter(trip => trip.status === 'planned');
    const plannedDays = plannedTrips.reduce((sum, trip) => sum + trip.days, 0);
    const nextTrip = plannedTrips[0];

    const stats = useMemo(() => [
        { label: 'Travel plans', value: trips.length, icon: <Plane size={22} />, go: () => setSection('trips') },
        { label: 'Days planned', value: plannedDays, icon: <Compass size={22} />, go: () => setSection('trips') },
        { label: 'Roamie connections', value: connections.length, icon: <Users size={22} />, go: () => setSection('roamies') },
    ], [trips.length, plannedDays, connections.length]);

    const beginProfileEdit = () => {
        if (!user) return;
        setProfileDraft(user);
        setEditingProfile(true);
    };

    const saveProfileChanges = () => {
        if (!profileDraft) return;
        const cleaned = {
            ...profileDraft,
            firstName: profileDraft.firstName.trim() || 'Traveler',
            lastName: profileDraft.lastName.trim(),
            email: profileDraft.email.trim() || user?.email || 'traveler@dreamscapes.app',
            profilePicture: profileDraft.profilePicture?.trim() || undefined,
        };
        saveProfile(cleaned);
        setUser(cleaned);
        setEditingProfile(false);
        setNotice('Profile saved.');
    };

    const saveAccountSettings = () => {
        saveSettings(settings);
        setNotice('Settings saved.');
    };

    const handleLogout = async () => {
        if (!window.confirm('Log out of Dreamscapes?')) return;
        try { await fetch(apiUrl('/api/auth/logout'), { credentials: 'include' }); } catch { /* local mode has no server session */ }
        localStorage.removeItem('currentUser');
        navigate('/login');
    };

    if (!user) return <div className="flex min-h-screen items-center justify-center bg-slate-950 text-lg font-bold text-white">Loading your travel space…</div>;

    const sidebarItems: Array<{ key: Section; label: string; icon: JSX.Element }> = [
        { key: 'dashboard', label: 'Overview', icon: <LayoutDashboard size={18} /> },
        { key: 'trips', label: 'Travel Plans', icon: <Plane size={18} /> },
        { key: 'roamies', label: 'Roamies', icon: <Users size={18} /> },
        { key: 'ai', label: 'AI Tools', icon: <Bot size={18} /> },
        { key: 'profile', label: 'Profile', icon: <User size={18} /> },
        { key: 'settings', label: 'Settings', icon: <Settings size={18} /> },
    ];

    return (
        <div className="min-h-screen bg-slate-100 text-slate-900 md:pl-64">
            <aside className="flex shrink-0 flex-col bg-slate-950 text-white md:fixed md:inset-y-0 md:left-0 md:z-40 md:h-screen md:w-64">
                <div className="flex items-center justify-between border-b border-white/10 p-4 md:block md:p-5">
                    <Link to="/" aria-label="Go to Dreamscapes home"><img src="/Imgaes/Logo.png" alt="Dreamscapes" className="h-9 w-auto" /></Link>
                    <Link to="/" className="text-xs font-bold text-cyan-300 md:hidden">Explore</Link>
                </div>
                <nav className="flex gap-1 overflow-x-auto p-3 md:block md:space-y-1 md:overflow-visible md:p-4">
                    {sidebarItems.map(item => (
                        <button key={item.key} onClick={() => setSection(item.key)}
                            className={`flex shrink-0 items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold transition md:w-full md:px-4 ${section === item.key ? 'bg-cyan-400 text-slate-950' : 'text-slate-300 hover:bg-white/10 hover:text-white'}`}>
                            {item.icon}<span>{item.label}</span>
                        </button>
                    ))}
                </nav>
                <div className="hidden mt-auto border-t border-white/10 p-4 md:block">
                    <button onClick={handleLogout} className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-slate-300 transition hover:bg-white/10 hover:text-white"><LogOut size={18} /> Log out</button>
                </div>
            </aside>

            <main className="min-w-0 flex-1 p-4 sm:p-6 md:p-9">
                <div className="mx-auto max-w-6xl">
                    <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
                        <div><p className="text-sm font-black uppercase tracking-[0.18em] text-cyan-700">Your Dreamscapes account</p><h1 className="mt-1 text-3xl font-black text-slate-950 sm:text-4xl">Welcome back, {user.firstName}.</h1></div>
                        <Link to="/" className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:border-cyan-500 hover:text-cyan-700"><Compass size={16} /> Explore more places</Link>
                    </div>

                    {notice && <div className="mb-5 flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-800"><span>{notice}</span><button onClick={() => setNotice('')} aria-label="Dismiss message">×</button></div>}

                    {section === 'dashboard' && <>
                        <section className="mb-7 rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950 p-6 text-white shadow-xl sm:p-8"><p className="flex items-center gap-2 text-sm font-bold text-cyan-200"><Sparkles size={16} /> Your live travel snapshot</p><p className="mt-3 max-w-2xl text-lg leading-8 text-slate-200">Every number below comes from the plans you create and the Roamies you connect with. Nothing is pre-filled.</p>{nextTrip ? <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white/10 p-4"><span><strong>Next plan:</strong> {nextTrip.destination} · {nextTrip.days} days</span><button onClick={() => setSection('trips')} className="rounded-lg bg-cyan-400 px-3 py-2 text-sm font-black text-slate-950">View plan</button></div> : <Link to="/trip-planner" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-4 py-3 font-black text-slate-950">Create your first trip <ArrowRight size={17} /></Link>}</section>

                        <section className="mb-7 grid gap-4 sm:grid-cols-3">{stats.map(stat => <button key={stat.label} onClick={stat.go} className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-cyan-300 hover:shadow-md"><span className="rounded-xl bg-cyan-50 p-3 text-cyan-700">{stat.icon}</span><span><strong className="block text-2xl font-black">{stat.value}</strong><span className="text-sm font-semibold text-slate-500">{stat.label}</span></span></button>)}</section>

                        <section className="grid gap-6 lg:grid-cols-2">
                            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"><div className="mb-5 flex items-center justify-between"><h2 className="font-black text-slate-950">Recent travel plans</h2><button onClick={() => setSection('trips')} className="text-sm font-bold text-cyan-700">View all</button></div>{trips.length ? <div className="space-y-3">{trips.slice(0, 3).map(trip => <button key={trip.id} onClick={() => setSection('trips')} className="flex w-full items-center justify-between rounded-2xl bg-slate-50 p-4 text-left transition hover:bg-cyan-50"><span><strong className="block">{trip.destination}</strong><span className="text-sm text-slate-500">{trip.days} days · {trip.travelers} traveler{trip.travelers === 1 ? '' : 's'}</span></span><span className={`rounded-full px-2.5 py-1 text-xs font-bold ${trip.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-cyan-100 text-cyan-700'}`}>{trip.status}</span></button>)}</div> : <EmptyState text="No travel plans yet." action="Plan a trip" onClick={() => navigate('/trip-planner')} />}</div>
                            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"><div className="mb-5 flex items-center justify-between"><h2 className="font-black text-slate-950">Roamie connections</h2><button onClick={() => setSection('roamies')} className="text-sm font-bold text-cyan-700">Manage</button></div>{connections.length ? <div className="space-y-3">{connections.slice(0, 3).map(connection => <button key={connection.id} onClick={() => setSection('roamies')} className="flex w-full items-center gap-3 rounded-2xl bg-slate-50 p-3 text-left transition hover:bg-cyan-50"><img src={connection.avatar} alt="" className="h-11 w-11 rounded-full object-cover" /><span><strong className="block">{connection.name}</strong><span className="text-sm text-slate-500">{connection.city}</span></span></button>)}</div> : <EmptyState text="You have no Roamie connections yet." action="Find Roamies" onClick={() => navigate('/roamies')} />}</div>
                        </section>

                        <section className="mt-7 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"><h2 className="mb-4 font-black text-slate-950">Recent activity</h2>{activity.length ? <ul className="space-y-3">{activity.slice(0, 6).map((entry, index) => <li key={`${entry}-${index}`} className="border-b border-slate-100 pb-3 text-sm text-slate-600 last:border-0 last:pb-0">{entry}</li>)}</ul> : <p className="text-sm text-slate-500">Your actions—creating trips, connecting with Roamies, and editing settings—will appear here.</p>}</section>
                    </>}

                    {section === 'trips' && <section><div className="mb-6 flex flex-wrap items-end justify-between gap-4"><div><h2 className="text-2xl font-black text-slate-950">Travel Plans</h2><p className="mt-1 text-slate-600">Your saved DreamBot itineraries. Count: {trips.length}</p></div><Link to="/trip-planner" className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-sm font-black text-white transition hover:bg-slate-800"><Plus size={17} /> Plan a trip</Link></div>{trips.length ? <div className="grid gap-5 lg:grid-cols-2">{trips.map(trip => <TripCard key={trip.id} trip={trip} onDelete={() => deleteTrip(trip.id)} onToggle={() => updateTrip(trip.id, { status: trip.status === 'planned' ? 'completed' : 'planned' })} onOpen={() => navigate(`/destination/${encodeURIComponent(trip.destination)}`)} />)}</div> : <EmptyPanel title="No saved travel plans" description="Generate an itinerary with DreamBot and it will appear here automatically." action="Start planning" onClick={() => navigate('/trip-planner')} />}</section>}

                    {section === 'roamies' && <section><div className="mb-6 flex flex-wrap items-end justify-between gap-4"><div><h2 className="text-2xl font-black text-slate-950">Roamie connections</h2><p className="mt-1 text-slate-600">People you have chosen to connect with. Count: {connections.length}</p></div><Link to="/roamies" className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-sm font-black text-white transition hover:bg-slate-800"><Users size={17} /> Discover Roamies</Link></div>{connections.length ? <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{connections.map(connection => <ConnectionCard key={connection.id} connection={connection} onDisconnect={() => disconnectRoamie(connection.id)} />)}</div> : <EmptyPanel title="No connections yet" description="Visit Roamies to connect with travelers who share your interests." action="Find Roamies" onClick={() => navigate('/roamies')} />}</section>}

                    {section === 'ai' && <section><h2 className="text-2xl font-black text-slate-950">AI travel tools</h2><p className="mt-1 text-slate-600">Use DreamBot to make plans that are saved directly to your dashboard.</p><div className="mt-6 grid gap-5 md:grid-cols-2"><Link to="/trip-planner" className="rounded-3xl border-2 border-cyan-400 bg-cyan-50 p-6 transition hover:-translate-y-0.5 hover:shadow-md"><MessageSquare className="mb-5 text-cyan-700" /><h3 className="text-xl font-black">DreamBot trip planner</h3><p className="mt-2 text-sm leading-6 text-slate-600">Create a personal itinerary, then manage the saved plan here.</p><span className="mt-5 inline-block font-bold text-cyan-700">Plan a trip →</span></Link><Link to="/ai-copilot" className="rounded-3xl border border-slate-200 bg-white p-6 transition hover:-translate-y-0.5 hover:shadow-md"><Bot className="mb-5 text-slate-700" /><h3 className="text-xl font-black">AI Copilot</h3><p className="mt-2 text-sm leading-6 text-slate-600">Open the rest of the travel-assistance tools.</p><span className="mt-5 inline-block font-bold text-slate-700">Open tools →</span></Link></div></section>}

                    {section === 'profile' && <section className="max-w-2xl"><div className="mb-6 flex items-center justify-between"><div><h2 className="text-2xl font-black text-slate-950">Your profile</h2><p className="mt-1 text-slate-600">Changes are saved to your Dreamscapes account on this browser.</p></div>{!editingProfile && <button onClick={beginProfileEdit} className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-black text-white"><Pencil size={15} /> Edit</button>}</div><div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">{editingProfile && profileDraft ? <div className="space-y-4"><Field label="First name" value={profileDraft.firstName} onChange={value => setProfileDraft({ ...profileDraft, firstName: value })} /><Field label="Last name" value={profileDraft.lastName} onChange={value => setProfileDraft({ ...profileDraft, lastName: value })} /><Field label="Email" type="email" value={profileDraft.email} onChange={value => setProfileDraft({ ...profileDraft, email: value })} /><Field label="Profile image URL (optional)" value={profileDraft.profilePicture || ''} onChange={value => setProfileDraft({ ...profileDraft, profilePicture: value })} /><div className="flex flex-wrap gap-3 pt-2"><button onClick={saveProfileChanges} className="rounded-xl bg-slate-950 px-4 py-3 text-sm font-black text-white">Save profile</button><button onClick={() => setEditingProfile(false)} className="rounded-xl border border-slate-300 px-4 py-3 text-sm font-bold text-slate-700">Cancel</button></div></div> : <div className="flex flex-col gap-5 sm:flex-row sm:items-center"><Avatar profile={user} /><div><h3 className="text-xl font-black">{user.firstName} {user.lastName}</h3><p className="mt-1 text-slate-600">{user.email}</p><p className="mt-4 text-sm text-slate-500">{trips.length} saved plan{trips.length === 1 ? '' : 's'} · {connections.length} connection{connections.length === 1 ? '' : 's'}</p></div></div>}</div></section>}

                    {section === 'settings' && <section className="max-w-2xl"><h2 className="text-2xl font-black text-slate-950">Settings</h2><p className="mt-1 text-slate-600">Choose how Dreamscapes supports your travel planning.</p><div className="mt-6 space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"><Toggle label="Email notifications" description="Receive updates about your saved trips." checked={settings.emailNotifications} onChange={checked => setSettings({ ...settings, emailNotifications: checked })} /><Toggle label="Trip reminders" description="Keep reminders enabled for upcoming plans." checked={settings.tripReminders} onChange={checked => setSettings({ ...settings, tripReminders: checked })} /><Field label="Home city (optional)" value={settings.homeCity} onChange={value => setSettings({ ...settings, homeCity: value })} placeholder="e.g. Delhi" /><button onClick={saveAccountSettings} className="rounded-xl bg-slate-950 px-4 py-3 text-sm font-black text-white">Save settings</button></div></section>}
                </div>
            </main>
        </div>
    );
}

function EmptyState({ text, action, onClick }: { text: string; action: string; onClick: () => void }) {
    return <div className="rounded-2xl border border-dashed border-slate-300 p-5 text-sm text-slate-500"><p>{text}</p><button onClick={onClick} className="mt-3 font-bold text-cyan-700">{action} →</button></div>;
}

function EmptyPanel({ title, description, action, onClick }: { title: string; description: string; action: string; onClick: () => void }) {
    return <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm"><Compass className="mx-auto mb-4 text-cyan-700" /><h3 className="text-xl font-black">{title}</h3><p className="mx-auto mt-2 max-w-md text-slate-600">{description}</p><button onClick={onClick} className="mt-5 rounded-xl bg-slate-950 px-4 py-3 text-sm font-black text-white">{action}</button></div>;
}

function TripCard({ trip, onDelete, onToggle, onOpen }: { trip: TripPlan; onDelete: () => void; onToggle: () => void; onOpen: () => void }) {
    const [showItinerary, setShowItinerary] = useState(false);
    return <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"><div className="flex items-start justify-between gap-4"><div><span className={`rounded-full px-2.5 py-1 text-xs font-bold ${trip.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-cyan-100 text-cyan-700'}`}>{trip.status}</span><h3 className="mt-3 text-2xl font-black text-slate-950">{trip.destination}</h3><p className="mt-1 text-sm text-slate-500">Created {displayDate(trip.createdAt)}</p></div><Plane className="text-cyan-700" /></div><div className="mt-5 grid grid-cols-2 gap-3 text-sm"><Info label="Duration" value={`${trip.days} days`} /><Info label="Travelers" value={String(trip.travelers)} /><Info label="Style" value={trip.travelStyle} /><Info label="Budget" value={trip.itinerary?.budgetBreakdown?.total || trip.budget} /></div>{trip.interests.length > 0 && <p className="mt-4 text-sm text-slate-600"><strong>Interests:</strong> {trip.interests.join(', ')}</p>}{trip.itinerary?.summary && <p className="mt-4 text-sm leading-6 text-slate-600">{trip.itinerary.summary}</p>}{showItinerary && <div className="mt-4 rounded-2xl bg-slate-50 p-4"><p className="text-sm font-black text-slate-800">Saved itinerary</p>{trip.itinerary?.days?.length ? <ol className="mt-3 space-y-2">{trip.itinerary.days.map(day => <li key={day.day} className="text-sm text-slate-600"><strong>Day {day.day}:</strong> {day.title}</li>)}</ol> : <p className="mt-2 text-sm text-slate-500">This plan was saved without day-by-day details.</p>}</div>}<div className="mt-6 flex flex-wrap gap-2"><button onClick={onOpen} className="rounded-lg bg-slate-950 px-3 py-2 text-sm font-bold text-white">Explore destination</button><button onClick={() => setShowItinerary(!showItinerary)} className="rounded-lg border border-cyan-200 bg-cyan-50 px-3 py-2 text-sm font-bold text-cyan-700">{showItinerary ? 'Hide itinerary' : 'View itinerary'}</button><button onClick={onToggle} className="inline-flex items-center gap-1 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-bold text-emerald-700"><CheckCircle2 size={14} />{trip.status === 'planned' ? 'Mark complete' : 'Reopen'}</button><button onClick={onDelete} className="inline-flex items-center gap-1 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-bold text-rose-700"><Trash2 size={14} /> Delete</button></div></article>;
}

function ConnectionCard({ connection, onDisconnect }: { connection: RoamieConnection; onDisconnect: () => void }) {
    return <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-center gap-3"><img src={connection.avatar} alt="" className="h-14 w-14 rounded-full object-cover" /><div><h3 className="font-black text-slate-950">{connection.name}</h3><p className="text-sm text-slate-500">{connection.handle} · {connection.city}</p></div></div><p className="mt-4 text-sm leading-6 text-slate-600">{connection.bio}</p><p className="mt-4 text-xs font-bold uppercase tracking-wide text-cyan-700">{connection.interests.join(' · ')}</p><button onClick={onDisconnect} className="mt-5 rounded-lg border border-slate-300 px-3 py-2 text-sm font-bold text-slate-700">Disconnect</button></article>;
}

function Info({ label, value }: { label: string; value: string }) { return <div className="rounded-xl bg-slate-50 p-3"><p className="text-xs font-bold uppercase tracking-wide text-slate-400">{label}</p><p className="mt-1 truncate font-bold capitalize text-slate-700">{value}</p></div>; }

function Field({ label, value, onChange, type = 'text', placeholder }: { label: string; value: string; onChange: (value: string) => void; type?: string; placeholder?: string }) { return <label className="block text-sm font-bold text-slate-700">{label}<input type={type} value={value} placeholder={placeholder} onChange={event => onChange(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 font-medium text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100" /></label>; }

function Toggle({ label, description, checked, onChange }: { label: string; description: string; checked: boolean; onChange: (checked: boolean) => void }) { return <label className="flex cursor-pointer items-start justify-between gap-4"><span><span className="block font-bold text-slate-800">{label}</span><span className="mt-1 block text-sm text-slate-500">{description}</span></span><input type="checkbox" checked={checked} onChange={event => onChange(event.target.checked)} className="mt-1 h-5 w-5 accent-cyan-700" /></label>; }

function Avatar({ profile }: { profile: SavedProfile }) { return profile.profilePicture ? <img src={profile.profilePicture} alt="Your profile" className="h-20 w-20 rounded-full object-cover" /> : <div className="flex h-20 w-20 items-center justify-center rounded-full bg-cyan-100 text-2xl font-black text-cyan-800">{profile.firstName.slice(0, 1).toUpperCase()}</div>; }
