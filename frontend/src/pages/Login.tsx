import { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export function Login() {
    const navigate = useNavigate();
    const [tab, setTab] = useState<'login' | 'register'>('login');

    // ── Local auth (same as original script.js) ──────────────────────────
    const getUsers = (): { u: string[]; p: string[] } => ({
        u: (localStorage.getItem('user') || '').split(',').filter(Boolean),
        p: (localStorage.getItem('passw') || '').split(',').filter(Boolean),
    });

    function handleLogin(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        const email = fd.get('email') as string;
        const pass = fd.get('password') as string;
        const { u, p } = getUsers();
        const idx = u.indexOf(email);
        if (idx !== -1 && p[idx] === pass) {
            localStorage.setItem('currentUser', email);
            navigate('/dashboard');
        } else {
            alert('Login Failed! Incorrect username or password.');
        }
    }

    function handleRegister(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        const uname = fd.get('username') as string;
        const pass = fd.get('password') as string;
        const cpass = fd.get('confirm') as string;
        if (pass !== cpass) { alert('Passwords do not match.'); return; }
        const { u, p } = getUsers();
        u.push(uname); p.push(pass);
        localStorage.setItem('user', u.join(','));
        localStorage.setItem('passw', p.join(','));
        localStorage.setItem('currentUser', uname);
        alert('Account created!');
        navigate('/dashboard');
    }

    return (
        <div className="min-h-screen flex items-center justify-center"
            style={{ backgroundImage: "linear-gradient(135deg,#0d0d0d 60%,#1c2a3a 100%)" }}>
            <div className="w-full max-w-md bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden text-white">

                {/* Header */}
                <div className="bg-[bisque] p-6 flex flex-col items-center">
                    <Link to="/"><img src="/Imgaes/Logo.png" alt="Dreamscapes" className="h-14 mb-2" /></Link>
                    <h2 className="text-[#333] text-xl font-bold">Welcome to Dreamscapes</h2>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-white/20">
                    {(['login', 'register'] as const).map(t => (
                        <button key={t} onClick={() => setTab(t)}
                            className={`flex-1 py-3 capitalize font-semibold transition ${tab === t ? 'border-b-2 border-blue-400 text-blue-400' : 'text-gray-400 hover:text-white'}`}>
                            {t === 'login' ? 'Log In' : 'Register'}
                        </button>
                    ))}
                </div>

                {/* Body */}
                <div className="p-8">
                    {/* Google OAuth */}
                    <a href="http://localhost:3000/api/auth/google"
                        className="flex items-center justify-center gap-3 w-full border border-gray-300 rounded-lg py-2 mb-4 hover:bg-white/10 transition">
                        <img src="https://a.hwstatic.com/image/upload/hw/auth0/google.svg" className="h-5" alt="Google" />
                        <span className="font-medium">Continue with Google</span>
                    </a>

                    <div className="flex items-center gap-3 my-4 text-gray-400">
                        <hr className="flex-1 border-white/20" />or<hr className="flex-1 border-white/20" />
                    </div>

                    {tab === 'login' ? (
                        <form onSubmit={handleLogin} className="flex flex-col gap-4">
                            <input name="email" type="text" required placeholder="Email or Username"
                                className="w-full rounded-lg border border-white/30 bg-white/10 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-400" />
                            <input name="password" type="password" required placeholder="Password"
                                className="w-full rounded-lg border border-white/30 bg-white/10 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-400" />
                            <button type="submit"
                                className="w-full bg-blue-600 hover:bg-blue-700 rounded-lg py-3 font-semibold transition">
                                Log In
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleRegister} className="flex flex-col gap-4">
                            <input name="username" type="text" required placeholder="Username"
                                className="w-full rounded-lg border border-white/30 bg-white/10 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-400" />
                            <input name="password" type="password" required placeholder="Password"
                                className="w-full rounded-lg border border-white/30 bg-white/10 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-400" />
                            <input name="confirm" type="password" required placeholder="Confirm Password"
                                className="w-full rounded-lg border border-white/30 bg-white/10 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-400" />
                            <button type="submit"
                                className="w-full bg-green-600 hover:bg-green-700 rounded-lg py-3 font-semibold transition">
                                Create Account
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
