import { FormEvent, useState } from 'react';
import { X } from 'lucide-react';
import { apiUrl } from '../lib/api';

type AuthMode = 'login' | 'signup';

interface AuthModalProps {
    initialMode?: AuthMode;
    onClose?: () => void;
    onSuccess?: (username: string) => void;
    standalone?: boolean;
}

export function AuthModal({ initialMode = 'login', onClose, onSuccess, standalone = false }: AuthModalProps) {
    const [mode, setMode] = useState<AuthMode>(initialMode);
    const [error, setError] = useState('');

    const close = () => onClose?.();
    const getUsers = () => ({
        users: (localStorage.getItem('user') || '').split(',').filter(Boolean),
        passwords: (localStorage.getItem('passw') || '').split(',').filter(Boolean),
    });

    function handleLogin(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError('');
        const form = new FormData(event.currentTarget);
        const username = String(form.get('email') || '').trim();
        const password = String(form.get('password') || '');
        const { users, passwords } = getUsers();
        const index = users.indexOf(username);
        if (index === -1 || passwords[index] !== password) {
            setError('Login Failed! Incorrect username or password.');
            return;
        }
        localStorage.setItem('currentUser', username);
        onSuccess?.(username);
        if (standalone) window.location.href = '/dashboard';
    }

    function handleSignup(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError('');
        const form = new FormData(event.currentTarget);
        const email = String(form.get('email') || '').trim();
        const password = String(form.get('password') || '');
        const confirmation = String(form.get('confirm') || '');
        if (password !== confirmation) {
            setError('Passwords do not match.');
            return;
        }
        const { users, passwords } = getUsers();
        if (users.includes(email)) {
            setError('An account with this email already exists.');
            return;
        }
        localStorage.setItem('user', [...users, email].join(','));
        localStorage.setItem('passw', [...passwords, password].join(','));
        localStorage.setItem('currentUser', email);
        onSuccess?.(email);
        if (standalone) window.location.href = '/dashboard';
    }

    const card = (
        <div className="relative w-full max-w-[520px] overflow-hidden rounded-2xl bg-white text-[#2f3542] shadow-2xl">
            <div className="relative bg-[#ffe4c4] px-5 py-6 text-center">
                <button type="button" onClick={close} aria-label="Close authentication dialog" className="absolute right-5 top-4 text-3xl leading-none text-[#6f6b67] hover:text-black">
                    <X size={28} />
                </button>
                <h2 className="text-2xl font-bold sm:text-3xl">{mode === 'login' ? 'Welcome back' : 'Create an account'}</h2>
                <p className="mt-1 text-sm sm:text-base">{mode === 'login' ? 'Log in to your account' : "Let's get you started! Please enter your details."}</p>
            </div>
            <div className="px-6 py-5 sm:px-8">
                <a href={apiUrl('/api/auth/google')} className="mx-auto flex h-12 w-full max-w-[220px] items-center justify-center gap-3 rounded-xl border border-gray-300 bg-white text-base font-semibold shadow-sm transition hover:bg-gray-50" aria-label="Continue with Google"><svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5"><path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.55-.2-2.27H12v4.3h6.45a5.51 5.51 0 0 1-2.39 3.62v2.79h3.87c2.26-2.08 3.56-5.14 3.56-8.44Z"/><path fill="#34A853" d="M12 24c3.24 0 5.96-1.07 7.94-2.91l-3.87-2.79c-1.08.72-2.45 1.15-4.07 1.15-3.13 0-5.79-2.11-6.74-4.95H1.27v2.88A12 12 0 0 0 12 24Z"/><path fill="#FBBC05" d="M5.26 14.5A7.2 7.2 0 0 1 4.88 12c0-.87.15-1.71.38-2.5V6.62H1.27A12 12 0 0 0 0 12c0 1.94.46 3.78 1.27 5.38l3.99-2.88Z"/><path fill="#EA4335" d="M12 4.55c1.76 0 3.35.61 4.6 1.81l3.45-3.45C17.95.94 15.24 0 12 0A12 12 0 0 0 1.27 6.62L5.26 9.5C6.21 6.66 8.87 4.55 12 4.55Z"/></svg> Continue with Google</a>
                <div className="my-5 flex items-center gap-3 text-center text-sm text-gray-500"><hr className="flex-1" />or<hr className="flex-1" /></div>

                <p className="mb-4 text-center text-base font-medium">{mode === 'login' ? 'Log in with your email address' : 'Sign up with your email address'}</p>
                <form onSubmit={mode === 'login' ? handleLogin : handleSignup} className="space-y-3">
                    <input name="email" type="email" required placeholder="Email" className="w-full rounded-xl border border-gray-300 px-4 py-3 text-base outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
                    <input name="password" type="password" required placeholder="Password" className="w-full rounded-xl border border-gray-300 px-4 py-3 text-base outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
                    {mode === 'signup' && <input name="confirm" type="password" required placeholder="Confirm your password" className="w-full rounded-xl border border-gray-300 px-4 py-3 text-base outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />}
                    {mode === 'login' && <a href="#forgot-password" onClick={(event) => event.preventDefault()} className="block text-[#8b174e]">Forgot your password?</a>}
                    {mode === 'signup' && <p className="text-base leading-relaxed">When using Dreamscape you accept our <button type="button" className="font-medium text-[#a81759]">Terms &amp; Conditions</button> and <button type="button" className="font-medium text-[#a81759]">Privacy Policy</button>.</p>}
                    {error && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
                    <button type="submit" className="w-full rounded-xl bg-[#176df5] py-3 text-lg font-semibold text-white transition hover:bg-[#0f59d0]">{mode === 'login' ? 'Log In' : 'Sign Up'}</button>
                </form>
                <p className="mt-4 text-center text-base">
                    {mode === 'login' ? 'No account? ' : 'Already have an account? '}
                    <button type="button" onClick={() => { setError(''); setMode(mode === 'login' ? 'signup' : 'login'); }} className="font-semibold text-[#1d5aef]">{mode === 'login' ? 'Sign up' : 'Log In'}</button>
                </p>
            </div>
        </div>
    );

    if (standalone) return <div className="flex min-h-screen items-center justify-center bg-[#0e1724] px-4 py-8">{card}</div>;
    return <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-4 py-5 backdrop-blur-md" role="dialog" aria-modal="true">{card}</div>;
}
