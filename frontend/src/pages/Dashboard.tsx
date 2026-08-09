import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Settings, LogOut, LayoutDashboard, Bot, Plane, Users, Bell } from 'lucide-react';
import { Footer } from '../components/Footer';

interface UserProfile {
    firstName: string;
    lastName: string;
    email: string;
    profilePicture?: string;
}

type Section = 'dashboard' | 'profile' | 'settings' | 'ai' | 'trips' | 'roamies';

export function Dashboard() {
    const navigate = useNavigate();
    const [section, setSection] = useState<Section>('dashboard');
    const [user, setUser] = useState<UserProfile | null>(null);
    const [activityLog, setActivityLog] = useState<string[]>([]);
    const [editMode, setEditMode] = useState(false);
    const [editName, setEditName] = useState('');
    const [editLast, setEditLast] = useState('');

    // ── Load user ────────────────────────────────────────────────────────
    useEffect(() => {
        const logs = JSON.parse(localStorage.getItem('activityLogs') || '[]');
        setActivityLog(logs);

        // 1. Try backend session first
        fetch('/api/auth/me')
            .then(r => r.json())
            .then(data => {
                if (data.success && data.user) {
                    setUser(data.user);
                    logActivity('Signed in via Google');
                } else {
                    // 2. Fall back to localStorage
                    const local = localStorage.getItem('currentUser');
                    if (local) {
                        setUser({ firstName: local, lastName: '', email: local });
                    } else {
                        navigate('/login');
                    }
                }
            })
            .catch(() => {
                const local = localStorage.getItem('currentUser');
                if (local) setUser({ firstName: local, lastName: '', email: local });
                else navigate('/login');
            });
    }, [navigate]);

    function logActivity(msg: string) {
        const entry = `${new Date().toLocaleString()} — ${msg}`;
        setActivityLog(prev => {
            const next = [entry, ...prev].slice(0, 20);
            localStorage.setItem('activityLogs', JSON.stringify(next));
            return next;
        });
    }

    async function handleLogout() {
        if (!confirm('Are you sure you want to log out?')) return;
        try { await fetch('/api/auth/logout'); } catch { /* ignored */ }
        localStorage.removeItem('currentUser');
        navigate('/login');
    }

    function saveProfile() {
        if (user) setUser({ ...user, firstName: editName, lastName: editLast });
        logActivity('Updated profile name');
        setEditMode(false);
    }

    if (!user) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-950 text-white text-2xl">
                Loading…
            </div>
        );
    }

    // ── Sidebar items ────────────────────────────────────────────────────
    const sidebarItems: { key: Section; label: string; icon: JSX.Element }[] = [
        { key: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
        { key: 'profile', label: 'Profile', icon: <User size={18} /> },
        { key: 'settings', label: 'Settings', icon: <Settings size={18} /> },
        { key: 'ai', label: 'AI Copilot', icon: <Bot size={18} /> },
        { key: 'trips', label: 'Travel Plans', icon: <Plane size={18} /> },
        { key: 'roamies', label: 'Roamies', icon: <Users size={18} /> },
    ];

    return (
        <div className="flex flex-col h-screen bg-gray-950 text-white overflow-hidden">
            <div className="flex flex-1 overflow-hidden">
                {/* ── Sidebar ── */}
                <aside className="w-64 bg-gray-900 flex flex-col border-r border-gray-800 shrink-0">
                    <div className="p-5 border-b border-gray-800">
                        <Link to="/"><img src="/Imgaes/Logo.png" alt="Dreamscapes" className="h-10" /></Link>
                    </div>
                    <nav className="flex-1 p-4 space-y-1">
                        {sidebarItems.map(item => (
                            <button key={item.key} onClick={() => setSection(item.key)}
                                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition ${section === item.key ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
                                {item.icon} {item.label}
                            </button>
                        ))}
                    </nav>
                    <div className="p-4 border-t border-gray-800">
                        <button onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-red-400 hover:bg-red-900/30 transition">
                            <LogOut size={18} /> Log Out
                        </button>
                    </div>
                </aside>

                {/* ── Main content ── */}
                <main className="flex-1 overflow-y-auto p-8">

                    {/* Dashboard Home */}
                    {section === 'dashboard' && (
                        <div>
                            <h1 className="text-3xl font-bold mb-2">Welcome back, {user.firstName}! 👋</h1>
                            <p className="text-gray-400 mb-8">Here's what's going on with your travels.</p>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                {[
                                    { label: 'Trips Planned', value: '3', icon: <Plane size={24} /> },
                                    { label: 'AI Copilot Uses', value: '12', icon: <Bot size={24} /> },
                                    { label: 'Roamie Connections', value: '5', icon: <Users size={24} /> },
                                ].map(c => (
                                    <div key={c.label} className="bg-gray-800 rounded-xl p-6 flex items-center gap-4">
                                        <div className="text-blue-400">{c.icon}</div>
                                        <div>
                                            <p className="text-2xl font-bold">{c.value}</p>
                                            <p className="text-gray-400 text-sm">{c.label}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="bg-gray-800 rounded-xl p-6">
                                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><Bell size={18} /> Activity Log</h2>
                                {activityLog.length === 0
                                    ? <p className="text-gray-500">No activity yet.</p>
                                    : <ul className="space-y-2">
                                        {activityLog.map((a, i) => (
                                            <li key={i} className="text-sm text-gray-400 border-b border-gray-700 pb-2">{a}</li>
                                        ))}
                                    </ul>}
                            </div>
                        </div>
                    )}

                    {/* Profile */}
                    {section === 'profile' && (
                        <div>
                            <h1 className="text-3xl font-bold mb-8">Your Profile</h1>
                            <div className="bg-gray-800 rounded-xl p-8 max-w-lg">
                                <div className="flex items-center gap-6 mb-8">
                                    {user.profilePicture
                                        ? <img src={user.profilePicture} className="w-20 h-20 rounded-full" alt="avatar" />
                                        : <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center text-3xl font-bold">
                                            {user.firstName[0]}
                                        </div>}
                                    <div>
                                        <p className="text-xl font-semibold">{user.firstName} {user.lastName}</p>
                                        <p className="text-gray-400">{user.email}</p>
                                    </div>
                                </div>
                                {editMode ? (
                                    <div className="space-y-4">
                                        <input value={editName} onChange={e => setEditName(e.target.value)}
                                            placeholder="First Name"
                                            className="w-full bg-gray-700 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-400" />
                                        <input value={editLast} onChange={e => setEditLast(e.target.value)}
                                            placeholder="Last Name"
                                            className="w-full bg-gray-700 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-400" />
                                        <div className="flex gap-4">
                                            <button onClick={saveProfile}
                                                className="flex-1 bg-blue-600 hover:bg-blue-700 rounded-lg py-2 font-semibold transition">Save</button>
                                            <button onClick={() => setEditMode(false)}
                                                className="flex-1 bg-gray-600 hover:bg-gray-500 rounded-lg py-2 transition">Cancel</button>
                                        </div>
                                    </div>
                                ) : (
                                    <button onClick={() => { setEditName(user.firstName); setEditLast(user.lastName); setEditMode(true); }}
                                        className="w-full bg-blue-600 hover:bg-blue-700 rounded-lg py-2 font-semibold transition">
                                        Edit Profile
                                    </button>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Settings */}
                    {section === 'settings' && (
                        <div>
                            <h1 className="text-3xl font-bold mb-8">Settings</h1>
                            <div className="bg-gray-800 rounded-xl p-8 max-w-lg space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Email Notifications</label>
                                    <div className="flex items-center gap-3">
                                        <input type="checkbox" id="notif" defaultChecked className="w-4 h-4 accent-blue-500" />
                                        <label htmlFor="notif" className="text-gray-400">Receive trip updates via email</label>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Theme</label>
                                    <select className="w-full bg-gray-700 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-400 text-white">
                                        <option>Dark (Default)</option>
                                        <option>Light</option>
                                    </select>
                                </div>
                                <button className="w-full bg-blue-600 hover:bg-blue-700 rounded-lg py-2 font-semibold transition">
                                    Save Settings
                                </button>
                            </div>
                        </div>
                    )}

                    {/* AI Copilot redirect card */}
                    {section === 'ai' && (
                        <div>
                            <h1 className="text-3xl font-bold mb-4">AI Copilot</h1>
                            <p className="text-gray-400 mb-6">Access all 13 AI travel features.</p>
                            <Link to="/ai-copilot"
                                className="inline-block bg-blue-600 hover:bg-blue-700 rounded-xl px-8 py-4 font-semibold transition text-lg">
                                Open AI Copilot →
                            </Link>
                        </div>
                    )}

                    {/* Placeholder sections */}
                    {(section === 'trips' || section === 'roamies') && (
                        <div className="text-gray-400 text-xl mt-20 text-center">
                            🚧 {section === 'trips' ? 'Travel Plans' : 'Roamies'} section coming soon!
                        </div>
                    )}

                </main>
            </div>
            <Footer />
        </div>
    );
}
